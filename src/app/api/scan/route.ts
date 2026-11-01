import { nasFiles, dayStart } from "@/lib/nas";
import { classify } from "@/lib/classify";
import { parseReceipt, buildAssets } from "@/lib/vault";
import { limit } from "@/lib/ratelimit";
export const runtime = "nodejs";
const SHARES = ["/Documents", "/Downloads", "/Photos/Scans", "/Photos/Home", "/Mail/Exports"];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: Request) {
  if (!limit(req, "scan", 20)) return Response.json({ error: "Too many scans. Try again in a minute." }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const shares: string[] = Array.isArray(body.shares) && body.shares.length ? body.shares.filter((s: string) => SHARES.includes(s)) : SHARES;
  const today = dayStart();
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(c) {
      const send = (o: unknown) => c.enqueue(enc.encode(JSON.stringify(o) + "\n"));
      const step = async (agent: string, cli: string, text: string, detail?: string) => { send({ k: "step", agent, cli, text, detail }); await sleep(420); };
      const all = nasFiles(today).filter((f) => shares.some((s) => f.path.startsWith(s + "/")));
      await step("file-agent", "ug-filesystem find", `Searching ${shares.length} shares for PDFs, photos and mail exports`, shares.join(" · "));
      send({ k: "files", files: all.map((f) => ({ path: f.path, bytes: f.bytes, kind: f.kind })) });
      if (!all.length) { send({ k: "done", assets: [], skipped: [], dupes: [], empty: true }); c.close(); return; }
      const imgs = all.filter((f) => /\.(jpe?g|png|heic)$/i.test(f.path));
      await step("photo-agent", "ug-photo vision-ocr", `Reading text from ${imgs.length} photos`, imgs.map((f) => `${f.path.split("/").pop()} ${Math.round((f.ocr ?? 0) * 100)}%`).join(" · "));
      const seen = new Map<string, string>(); const dupes: { path: string; of: string }[] = []; const unique = [];
      for (const f of all) { const o = seen.get(f.md5); if (o) dupes.push({ path: f.path, of: o }); else { seen.set(f.md5, f.path); unique.push(f); } }
      await step("file-agent", "ug-filesystem md5sum", dupes.length ? `${dupes.length} duplicate copy found and set aside` : "No duplicate copies", dupes.map((d) => d.path).join(" · "));
      const cls = unique.map((f) => ({ f, ...classify(f) }));
      const skipped = cls.filter((x) => x.cls === "other" || x.cls === "unreadable").map((x) => ({ path: x.f.path, reason: x.why, cls: x.cls }));
      const counts = (k: string) => cls.filter((x) => x.cls === k).length;
      await step("document-agent", "ug-document metadata", `Sorted into ${counts("receipt")} receipts, ${counts("manual")} manuals, ${counts("label")} serial labels`, `${skipped.length} files are not purchases and were skipped`);
      const receipts = cls.filter((x) => x.cls === "receipt").map((x) => parseReceipt(x.f.path, x.f.text));
      await step("document-agent", "ug-document extract", `Extracted item, date, price, serial and terms from ${receipts.length} receipts`, "Every field keeps the line it was read from");
      const assets = buildAssets(unique, receipts);
      await step("document-agent", "ug-document reconcile", `Matched receipts with manuals and labels into ${assets.length} assets`, `${assets.filter((a) => a.issues.length).length} need a look from you`);
      send({ k: "done", assets, skipped, dupes, today: today.toISOString() });
      c.close();
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson", "cache-control": "no-store" } });
}
