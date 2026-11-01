import { COUNTRY, DEFAULT_WARRANTY, addDays, iso, type NasFile } from "./nas";

export type Ev = { value: string; quote: string; file: string };
export type Parsed = {
  file: string; order?: Ev; date?: Ev; country?: Ev; item?: Ev; serial?: Ev; total?: Ev; currency?: string; price?: number;
  warrantyMonths?: number; warrantyEv?: Ev; returnDays?: number; returnEv?: Ev; retailer?: Ev; partial: boolean;
};
export type Asset = {
  id: string; name: string; model: string; retailer: string; country: string; currency: string; price: number;
  purchased: string; serial?: string; warrantyMonths: number; warrantySource: "receipt" | "manual" | "assumed"; warrantyBasis: string;
  returnDays?: number; sources: string[]; evidence: Ev[]; issues: string[]; added?: boolean;
};
export type Status = { key: "return" | "warranty-soon" | "covered" | "expired" | "review"; label: string; returnLeft?: number; warrantyLeft: number; returnEnd?: string; warrantyEnd: string };

const NAME2CODE = Object.fromEntries(Object.entries(COUNTRY).map(([k, v]) => [v.toLowerCase(), k]));
const CUR: [RegExp, string][] = [[/C\$|CAD/, "CAD"], [/A\$|AUD/, "AUD"], [/€|EUR/, "EUR"], [/£|GBP/, "GBP"], [/¥|JPY/, "JPY"], [/\bkr\b|SEK/, "SEK"], [/\$|USD/, "USD"]];

/** Deterministic receipt parser. Each field keeps the exact line it came from, so the UI can show its evidence. */
export function parseReceipt(file: string, text: string): Parsed {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const find = (re: RegExp) => { for (const l of lines) { const m = l.match(re); if (m) return { m, l }; } return null; };
  const ev = (re: RegExp, g = 1): Ev | undefined => { const r = find(re); return r ? { value: r.m[g].trim(), quote: r.l, file } : undefined; };
  const p: Parsed = { file, partial: /unreadable|faded/i.test(text) };
  p.retailer = lines[0] ? { value: titleCase(lines[0]), quote: lines[0], file } : undefined;
  p.order = ev(/^(?:order|order no\.?|order number|invoice no\.?)\s*[:#]\s*(.+)$/i);
  p.date = ev(/^(?:date|purchase date|order date)\s*:\s*(\d{4}-\d{2}-\d{2})/i);
  p.country = ev(/^sold in\s*:\s*(.+)$/i);
  p.item = ev(/^item\s*:\s*(.+)$/i);
  p.serial = ev(/^(?:serial(?: no\.?| number)?|s\/n)\s*:?\s*([A-Z0-9][A-Z0-9 -]{4,})$/i);
  p.total = ev(/^(?:total(?: paid)?|amount paid)\s*:\s*(.+)$/i);
  if (p.total) {
    const t = p.total.value; p.currency = CUR.find(([re]) => re.test(t))?.[1];
    const n = t.replace(/[^\d.,]/g, ""); p.price = Number(n.replace(/,(?=\d{3}\b)/g, "").replace(",", "."));
  }
  const w = find(/warrant|guarantee|garanti/i);
  if (w) { const y = w.l.match(/(\d+)\s*(?:years?|yrs?|års|jahre?|ans?)\b/i), mo = w.l.match(/(\d+)\s*month/i); const months = mo ? +mo[1] : y ? +y[1] * 12 : undefined; if (months) { p.warrantyMonths = months; p.warrantyEv = { value: `${months} months`, quote: w.l, file }; } }
  const r = find(/^returns?\b.*?(\d+)\s*days?/i);
  if (r) { const d = r.l.match(/(\d+)\s*days?/i)!; p.returnDays = +d[1]; p.returnEv = { value: `${p.returnDays} days`, quote: r.l, file }; }
  return p;
}
const titleCase = (s: string) => (s === s.toUpperCase() ? s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bB&h\b/, "B&H").replace(/\bIkea\b/, "IKEA").replace(/\bRei\b/, "REI").replace(/Mediamarkt/, "MediaMarkt").replace(/Amazon\.De/, "Amazon.de").replace(/\bJb\b/, "JB") : s);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Turn parsed receipts plus manuals and serial-label photos into an asset register. */
export function buildAssets(files: NasFile[], receipts: Parsed[]): Asset[] {
  const manuals = files.filter((f) => f.kind === "manual"), labels = files.filter((f) => f.kind === "label-photo");
  return receipts.filter((p) => p.item && p.date).map((p, i) => {
    const item = p.item!.value; const [brandModel, nm] = item.split(/\s+-\s+/);
    const tokens = brandModel.split(/\s+/); const model = tokens.slice(1).join(" ");
    const mkey = norm(model);
    const evidence: Ev[] = [p.retailer, p.order, p.date, p.country, p.item, p.serial, p.total, p.warrantyEv, p.returnEv].filter(Boolean) as Ev[];
    const sources = [p.file]; const issues: string[] = [];
    let serial = p.serial?.value;
    const lab = labels.find((l) => norm(l.text).includes(mkey));
    if (lab) {
      const s = lab.text.match(/S\/N\s+(.+)/)?.[1]?.trim(); sources.push(lab.path);
      if (s) { evidence.push({ value: s, quote: `S/N ${s}`, file: lab.path }); if (serial && norm(serial) !== norm(s)) issues.push(`Serial on the receipt (${serial}) doesn't match the label photo (${s}). Check the device before you claim.`); serial = serial ?? s; }
    }
    const man = manuals.find((m) => norm(m.text).includes(mkey));
    let warrantyMonths = p.warrantyMonths, warrantySource: Asset["warrantySource"] = "receipt", warrantyBasis = p.warrantyEv?.quote ?? "";
    if (man) {
      sources.push(man.path); const mm = man.text.match(/Warranty:\s*(\d+)\s*months/i);
      if (mm) { evidence.push({ value: `${mm[1]} months`, quote: man.text.split("\n").find((l) => /Warranty/.test(l))!, file: man.path }); if (!warrantyMonths) { warrantyMonths = +mm[1]; warrantySource = "manual"; warrantyBasis = `Manual: ${mm[1]} months`; } }
    }
    const cc = p.country ? NAME2CODE[p.country.value.toLowerCase()] ?? "" : "";
    if (!warrantyMonths) { const d = DEFAULT_WARRANTY[cc] ?? [12, "common manufacturer default"]; warrantyMonths = d[0]; warrantySource = "assumed"; warrantyBasis = `Assumed: ${d[1]}`; issues.push("No document states the warranty term, so a regional default is used. Find the warranty card or manual to confirm."); }
    if (p.partial) issues.push("Part of this receipt was unreadable. Rescan it, or keep the paper copy.");
    if (!p.returnDays && !p.partial) { /* no return policy on the receipt: no return alert */ }
    return { id: `as${i}`, name: nm ?? item, model: brandModel, retailer: p.retailer?.value ?? "Unknown", country: cc, currency: p.currency ?? "USD", price: p.price ?? 0, purchased: p.date!.value, serial, warrantyMonths, warrantySource, warrantyBasis, returnDays: p.returnDays, sources, evidence, issues };
  });
}

export function addMonths(d: Date, m: number) { const x = new Date(d); x.setUTCMonth(x.getUTCMonth() + m); return x; }
export function statusOf(a: Asset, asOf: Date): Status {
  const bought = new Date(a.purchased + "T00:00:00Z");
  const wEnd = addMonths(bought, a.warrantyMonths); const wLeft = Math.round((wEnd.getTime() - asOf.getTime()) / 864e5);
  const rEnd = a.returnDays ? addDays(bought, a.returnDays) : undefined; const rLeft = rEnd ? Math.round((rEnd.getTime() - asOf.getTime()) / 864e5) : undefined;
  const base = { warrantyLeft: wLeft, warrantyEnd: iso(wEnd), returnLeft: rLeft, returnEnd: rEnd ? iso(rEnd) : undefined };
  if (a.issues.some((i) => /match/.test(i))) return { ...base, key: "review", label: "Needs you" };
  if (rLeft !== undefined && rLeft >= 0 && rLeft <= 7) return { ...base, key: "return", label: rLeft === 0 ? "Return window closes today" : `Return window closes in ${rLeft}d` };
  if (wLeft < 0) return { ...base, key: "expired", label: "Warranty ended" };
  if (wLeft <= 45) return { ...base, key: "warranty-soon", label: `Warranty ends in ${wLeft}d` };
  if (a.issues.length) return { ...base, key: "review", label: "Needs you" };
  return { ...base, key: "covered", label: "Covered" };
}

export function toCSV(as: Asset[], asOf: Date) {
  const h = ["Item", "Model", "Serial", "Retailer", "Country", "Purchased", "Price", "Currency", "Return by", "Warranty until", "Warranty source", "Status", "Sources"];
  const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [h.join(","), ...as.map((a) => { const s = statusOf(a, asOf); return [a.name, a.model, a.serial, a.retailer, a.country, a.purchased, a.price, a.currency, s.returnEnd, s.warrantyEnd, a.warrantySource, s.label, a.sources.join(" | ")].map(q).join(","); })].join("\n");
}
export function toMarkdown(as: Asset[], asOf: Date) {
  const rows = as.map((a) => { const s = statusOf(a, asOf); return `| ${a.name} | ${a.model} | ${a.serial ?? "-"} | ${a.retailer} | ${a.purchased} | ${s.returnEnd ?? "-"} | ${s.warrantyEnd} (${a.warrantySource}) | ${s.label} |`; });
  return `# Household asset register\n\nGenerated ${iso(asOf)} by Warranty Vault. Every date comes from the listed source files; "assumed" terms are regional defaults.\n\n| Item | Model | Serial | Retailer | Purchased | Return by | Warranty until | Status |\n|---|---|---|---|---|---|---|---|\n${rows.join("\n")}\n\n## Sources\n\n${as.map((a) => `- **${a.name}**: ${a.sources.join("; ")}`).join("\n")}\n`;
}
export function toICS(as: Asset[], asOf: Date) {
  const ev: string[] = []; const stamp = asOf.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const day = (d: string) => d.replace(/-/g, "");
  for (const a of as) {
    const s = statusOf(a, asOf);
    const add = (uid: string, date: string, title: string, desc: string, before: number) => ev.push(["BEGIN:VEVENT", `UID:${uid}@warranty-vault`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${day(date)}`, `SUMMARY:${title}`, `DESCRIPTION:${desc.replace(/[,;]/g, "\\$&")}`, "BEGIN:VALARM", "ACTION:DISPLAY", `TRIGGER:-P${before}D`, `DESCRIPTION:${title}`, "END:VALARM", "END:VEVENT"].join("\r\n"));
    if (s.returnEnd && (s.returnLeft ?? -1) >= 0) add(`${a.id}-ret`, s.returnEnd, `Last day to return: ${a.name}`, `${a.retailer} return window (${a.returnDays} days). Source: ${a.sources[0]}`, 3);
    if (s.warrantyLeft >= 0) add(`${a.id}-war`, s.warrantyEnd, `Warranty ends: ${a.name}`, `${a.warrantyMonths}-month warranty (${a.warrantySource}). Serial ${a.serial ?? "unknown"}.`, 30);
  }
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Warranty Vault//EN", "CALSCALE:GREGORIAN", ...ev, "END:VCALENDAR"].join("\r\n");
}
