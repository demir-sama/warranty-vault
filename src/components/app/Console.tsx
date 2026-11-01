"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { addDays, dayStart, iso, money } from "@/lib/nas";
import { statusOf, toCSV, toICS, toMarkdown, type Asset } from "@/lib/vault";
import { FLAG, Pill, Spinner, Toasts, Window, download, type Toast } from "./ui";
import AddReceipt from "./AddReceipt";
import ClaimDraft from "./ClaimDraft";

const SHARES = ["/Documents", "/Downloads", "/Photos/Scans", "/Photos/Home", "/Mail/Exports"];
type Step = { agent: string; cli: string; text: string; detail?: string };
type Skip = { path: string; reason: string; cls: string };
type Dupe = { path: string; of: string };
type Approval = "pending" | "approved" | "declined";
const ORDER = { return: 0, review: 1, "warranty-soon": 2, expired: 4, covered: 3 } as const;
const FILTERS = [["all", "All"], ["act", "Act now"], ["review", "Needs you"], ["covered", "Covered"], ["expired", "Ended"]] as const;
const AGENT_C: Record<string, string> = { "file-agent": "bg-sky/10 text-sky border-sky/30", "photo-agent": "bg-amber/10 text-amber border-amber/30", "document-agent": "bg-teal/10 text-teal border-teal/30", "knowledge-agent": "bg-verm/10 text-verm border-verm/30" };

export default function Console() {
  const [shares, setShares] = useState<string[]>(SHARES);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState(0);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [mine, setMine] = useState<Asset[]>([]);
  const [skipped, setSkipped] = useState<Skip[]>([]);
  const [dupes, setDupes] = useState<Dupe[]>([]);
  const [ahead, setAhead] = useState(0);
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const [open, setOpen] = useState<string | null>(null);
  const [save, setSave] = useState<Approval>("pending");
  const [tag, setTag] = useState<Approval>("pending");
  const [claim, setClaim] = useState<{ a: Asset; kind: "return" | "warranty" } | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [empty, setEmpty] = useState(false);
  const tid = useRef(0);
  const toast = useCallback((text: string, tone?: Toast["tone"]) => setToasts((t) => [...t, { id: ++tid.current, text, tone }]), []);
  const drop = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  useEffect(() => { try { const m = JSON.parse(localStorage.getItem("wv.mine") || "[]"); if (Array.isArray(m)) setMine(m); } catch {} }, []);
  useEffect(() => { localStorage.setItem("wv.mine", JSON.stringify(mine)); }, [mine]);

  const asOf = useMemo(() => addDays(dayStart(), ahead), [ahead]);
  const all = useMemo(() => [...mine, ...assets], [mine, assets]);
  const rows = useMemo(() => all.map((a) => ({ a, s: statusOf(a, asOf) })).sort((x, y) => ORDER[x.s.key] - ORDER[y.s.key] || (x.s.returnLeft ?? x.s.warrantyLeft) - (y.s.returnLeft ?? y.s.warrantyLeft)), [all, asOf]);
  const shown = rows.filter(({ s }) => filter === "all" || (filter === "act" ? s.key === "return" || s.key === "warranty-soon" : s.key === filter));
  const n = (k: string) => rows.filter((r) => r.s.key === k).length;
  const sourceCount = new Set(all.flatMap((a) => a.sources)).size;

  async function run() {
    if (!shares.length) { toast("Pick at least one share to search.", "warn"); return; }
    setPhase("running"); setSteps([]); setAssets([]); setSkipped([]); setDupes([]); setFiles(0); setSave("pending"); setTag("pending"); setEmpty(false); setOpen(null);
    try {
      const r = await fetch("/api/scan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ shares }) });
      if (!r.ok || !r.body) throw new Error((await r.json().catch(() => ({}))).error || `Scan failed (${r.status})`);
      const rd = r.body.getReader(); const dec = new TextDecoder(); let buf = "";
      for (;;) {
        const { done, value } = await rd.read(); if (done) break;
        buf += dec.decode(value, { stream: true }); const parts = buf.split("\n"); buf = parts.pop()!;
        for (const line of parts) {
          if (!line.trim()) continue; const e = JSON.parse(line);
          if (e.k === "step") setSteps((s) => [...s, e]);
          if (e.k === "files") setFiles(e.files.length);
          if (e.k === "done") { setAssets(e.assets); setSkipped(e.skipped); setDupes(e.dupes); setEmpty(!!e.empty); }
        }
      }
      setPhase("done");
    } catch (e) { setPhase("idle"); toast((e as Error).message, "err"); }
  }

  const stamp = iso(asOf);
  const regPath = `/home/you/Warranty Vault/Warranty Register ${stamp}.md`;
  const md = toMarkdown(all, asOf);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 pb-10">
      <div className="card !rounded-2xl px-4 py-3 mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm bg-amber/5 border-amber/30">
        <span className="tick !text-amber">Simulated NAS</span>
        <span className="text-ink2">Sample household paperwork from 8 countries, laid out like a real NAS. The workflow, parsing, matching and alerts are the real thing. Receipts you add are read by AI and stay in this browser.</span>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <aside className="space-y-5 lg:sticky lg:top-20 self-start">
          <div className="card p-5">
            <div className="tick mb-3">Folders to search</div>
            <div className="space-y-1.5">
              {SHARES.map((s) => (
                <label key={s} className="flex items-center gap-3 rounded-xl px-2.5 py-2 hover:bg-sand/60 cursor-pointer text-sm">
                  <input type="checkbox" className="accent-ink h-4 w-4" checked={shares.includes(s)} onChange={() => setShares((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))} />
                  <span className="font-mono text-[13px]">{s}</span>
                </label>
              ))}
            </div>
            <button onClick={run} disabled={phase === "running"} className="btn btn-ink w-full mt-4" data-testid="run">{phase === "running" ? <><Spinner /> Running…</> : phase === "done" ? "Run again" : "Run Warranty Vault"}</button>
            <p className="text-xs text-dim mt-3 leading-relaxed">Read-only. Nothing is saved or tagged until you approve it below.</p>
          </div>
          <div className="card p-5">
            <div className="flex justify-between items-baseline"><div className="tick">Time machine</div><span className="font-mono text-xs">{ahead ? `+${ahead}d` : "today"}</span></div>
            <div className="font-serif text-2xl mt-2">{asOf.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</div>
            <input type="range" min={0} max={400} value={ahead} onChange={(e) => setAhead(+e.target.value)} className="mt-3" aria-label="Days ahead" />
            <p className="text-xs text-dim mt-2">Slide forward to watch windows close and warranties lapse.</p>
          </div>
          <AddReceipt onAdd={(a, model, dropped) => { setMine((m) => [a, ...m]); setOpen(a.id); toast(`Added ${a.model} · read by ${model}${dropped.length ? ` · dropped unverified: ${dropped.join(", ")}` : ""}`); }} onErr={(m) => toast(m, "err")} />
        </aside>

        <section className="min-w-0 space-y-6">
          {phase === "idle" && !all.length && (
            <div className="card p-8 md:p-12 text-center dots-wrap relative overflow-hidden">
              <div className="absolute inset-0 dots" />
              <div className="relative">
                <div className="display text-4xl md:text-5xl">What do you own,<br /><em className="text-verm">and until when?</em></div>
                <p className="text-mute mt-4 max-w-md mx-auto">Pick the folders, then run the skill. It finds receipts, manuals and serial labels, and builds your register with a source for every date.</p>
                <button onClick={run} className="btn btn-verm mt-6">Run Warranty Vault →</button>
              </div>
            </div>
          )}

          {(phase !== "idle" || steps.length > 0) && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3"><div className="tick">Run log · expert delegations</div>{files > 0 && <span className="chip">{files} files in scope</span>}</div>
              <ol className="space-y-2.5">
                <AnimatePresence initial={false}>
                  {steps.map((s, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 items-start">
                      <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-teal text-white grid place-items-center text-[11px]">✓</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2 items-center"><span className={`chip ${AGENT_C[s.agent]}`}>{s.agent}</span><span className="font-mono text-[11px] text-dim">{s.cli}</span></div>
                        <div className="text-sm mt-1">{s.text}</div>
                        {s.detail && <div className="text-xs text-dim mt-0.5 truncate">{s.detail}</div>}
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {phase === "running" && <li className="flex gap-3 items-center text-sm text-mute"><Spinner className="text-ink2" /> working…</li>}
              </ol>
            </div>
          )}

          {empty && <div className="card p-6 text-ink2">I didn&apos;t find any receipts or invoices in {shares.join(", ")}. Receipts are usually in Documents, Downloads or a Scans folder.</div>}

          {all.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[["Assets", all.length, "text-ink"], ["Return closing", n("return"), "text-verm"], ["Warranty ending", n("warranty-soon"), "text-amber"], ["Needs you", n("review"), "text-sky"]].map(([l, v, c], i) => (
                  <motion.div key={l as string} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .06 }} className="card p-4">
                    <div className="tick">{l}</div><div className={`font-serif text-4xl mt-1 ${c}`}>{v}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1">
                {FILTERS.map(([k, l]) => <button key={k} onClick={() => setFilter(k)} className={`btn btn-sm whitespace-nowrap ${filter === k ? "btn-ink" : "btn-ghost"}`}>{l}</button>)}
              </div>

              <motion.div layout className="space-y-3" data-testid="assets">
                <AnimatePresence initial={false}>
                  {shown.map(({ a, s }) => (
                    <motion.div layout key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .98 }} className="card overflow-hidden">
                      <button className="w-full text-left p-4 md:p-5 grid md:grid-cols-[1fr_260px] gap-4 items-center" onClick={() => setOpen(open === a.id ? null : a.id)} aria-expanded={open === a.id}>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2"><Pill k={s.key}>{s.label}</Pill>{a.added && <span className="chip">added by you</span>}{a.warrantySource === "assumed" && <span className="chip text-dim">assumed term</span>}</div>
                          <div className="font-semibold text-lg mt-2 truncate">{a.model}</div>
                          <div className="text-sm text-mute truncate">{a.name} · {FLAG[a.country] ?? ""} {a.retailer} · {money(a.currency, a.price)} · {a.purchased}</div>
                        </div>
                        <div className="space-y-2.5">
                          <Window label="Return" left={s.returnLeft} total={a.returnDays} end={s.returnEnd} tone="bg-verm" />
                          <Window label={`Warranty · ${a.warrantyMonths}mo`} left={s.warrantyLeft} total={a.warrantyMonths * 30.4} end={s.warrantyEnd} tone={s.key === "warranty-soon" ? "bg-amber" : "bg-teal"} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {open === a.id && (
                          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-line bg-paper/50">
                            <div className="p-4 md:p-5 space-y-4">
                              {a.issues.map((x) => <div key={x} className="text-sm rounded-xl border border-sky/30 bg-sky/5 px-3 py-2 text-ink2">⚑ {x}</div>)}
                              <div className="tick">Evidence · every field and where it came from</div>
                              <div className="overflow-x-auto"><table className="w-full text-sm">
                                <tbody>{a.evidence.map((e, i) => (
                                  <tr key={i} className="border-b border-line last:border-0 align-top">
                                    <td className="py-2 pr-3 font-mono text-[12px] text-ink2 whitespace-nowrap">{e.value}</td>
                                    <td className="py-2 pr-3 text-mute">“{e.quote}”</td>
                                    <td className="py-2 font-mono text-[11px] text-dim break-all">{e.file.split("/").pop()}</td>
                                  </tr>))}
                                  <tr><td className="py-2 pr-3 font-mono text-[12px] text-ink2">{a.warrantyMonths} months</td><td className="py-2 pr-3 text-mute" colSpan={2}>Warranty basis: {a.warrantyBasis}</td></tr>
                                </tbody></table></div>
                              <div className="flex flex-wrap gap-2">
                                {(s.returnLeft ?? -1) >= 0 && <button className="btn btn-sm btn-verm" onClick={() => setClaim({ a, kind: "return" })}>Draft return request</button>}
                                {s.warrantyLeft >= 0 && <button className="btn btn-sm btn-ink" onClick={() => setClaim({ a, kind: "warranty" })}>Draft warranty claim</button>}
                                {a.added && <button className="btn btn-sm btn-ghost" onClick={() => setMine((m) => m.filter((x) => x.id !== a.id))}>Remove</button>}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {!shown.length && <div className="text-mute text-sm p-4">Nothing in this view.</div>}
              </motion.div>

              {phase === "done" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <ApprovalCard title="Save the register" body={<>Write <span className="font-mono text-[12px]">{regPath}</span> ({new Blob([md]).size.toLocaleString()} bytes). An existing file is never overwritten.</>} agent="knowledge-agent · ug-knowledge save-text" state={save} onApprove={() => { setSave("approved"); toast("Register saved to the simulated NAS. Downloaded a copy too."); download(`Warranty Register ${stamp}.md`, md, "text/markdown"); }} onDecline={() => setSave("declined")} done={`completed · saved ${regPath.split("/").pop()}`} testid="approve-save" />
                  <ApprovalCard title="Tag the source files" body={<>Add the tag <span className="chip">warranty-vault</span> to {sourceCount} source files so you can find them in UGOS later. No file is moved or renamed.</>} agent="file-agent · ug-filemgr tag-add-file" state={tag} onApprove={() => { setTag("approved"); toast(`Tagged ${sourceCount} files.`); }} onDecline={() => setTag("declined")} done={`completed · ${sourceCount} files tagged`} testid="approve-tag" />
                </div>
              )}

              <div className="card p-5 flex flex-wrap items-center gap-3 justify-between">
                <div><div className="tick">Take it with you</div><div className="text-sm text-mute mt-1">Calendar reminders fire 3 days before a return closes and 30 days before a warranty ends.</div></div>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-sm btn-ink" data-testid="ics" onClick={() => download("warranty-vault.ics", toICS(all, asOf), "text/calendar")}>Add to calendar (.ics)</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => download("warranty-register.csv", toCSV(all, asOf), "text/csv")}>CSV</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => download("warranty-register.md", md, "text/markdown")}>Markdown</button>
                </div>
              </div>

              {(skipped.length > 0 || dupes.length > 0) && (
                <details className="card p-5 group">
                  <summary className="cursor-pointer flex justify-between items-center"><span className="tick">Skipped & duplicates · {skipped.length + dupes.length}</span><span className="text-dim group-open:rotate-45 transition">＋</span></summary>
                  <ul className="mt-3 space-y-2 text-sm">
                    {dupes.map((d) => <li key={d.path} className="flex gap-2"><span className="chip">duplicate</span><span className="font-mono text-[12px] break-all">{d.path}</span><span className="text-dim">same as {d.of.split("/").pop()}</span></li>)}
                    {skipped.map((d) => <li key={d.path} className="flex gap-2"><span className={`chip ${d.cls === "unreadable" ? "text-verm" : ""}`}>{d.cls}</span><span className="font-mono text-[12px] break-all">{d.path}</span><span className="text-dim">{d.reason}</span></li>)}
                  </ul>
                </details>
              )}
            </>
          )}
        </section>
      </div>
      <AnimatePresence>{claim && <ClaimDraft a={claim.a} kind={claim.kind} onClose={() => setClaim(null)} />}</AnimatePresence>
      <Toasts items={toasts} drop={drop} />
    </div>
  );
}

function ApprovalCard({ title, body, agent, state, onApprove, onDecline, done, testid }: { title: string; body: React.ReactNode; agent: string; state: Approval; onApprove: () => void; onDecline: () => void; done: string; testid: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`card p-5 ${state === "pending" ? "border-verm/40" : ""}`}>
      <div className="flex justify-between items-center"><span className={`chip ${state === "approved" ? "text-teal" : state === "declined" ? "text-dim" : "text-verm"}`}>{state === "pending" ? "waiting_approval" : state === "approved" ? "completed" : "cancelled"}</span><span className="font-mono text-[10px] text-dim">{agent}</span></div>
      <div className="font-semibold mt-3">{title}</div>
      <p className="text-sm text-mute mt-1">{body}</p>
      {state === "pending" ? (
        <div className="flex gap-2 mt-4"><button className="btn btn-sm btn-verm" onClick={onApprove} data-testid={testid}>Approve</button><button className="btn btn-sm btn-ghost" onClick={onDecline}>Not now</button></div>
      ) : <div className="text-sm mt-4 text-ink2">{state === "approved" ? `✓ ${done}` : "Skipped. Nothing was written."}</div>}
    </motion.div>
  );
}
