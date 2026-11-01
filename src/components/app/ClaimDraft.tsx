"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Asset } from "@/lib/vault";
import { Spinner } from "./ui";
export default function ClaimDraft({ a, kind, onClose }: { a: Asset; kind: "return" | "warranty"; onClose: () => void }) {
  const [problem, setProblem] = useState(kind === "return" ? "It doesn't suit me and I'd like a refund." : "");
  const [out, setOut] = useState<{ text: string; model: string } | null>(null); const [busy, setBusy] = useState(false); const [copied, setCopied] = useState(false);
  async function go() { setBusy(true); try { const r = await fetch("/api/claim", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ asset: a, problem, kind }) }); setOut(await r.json()); } finally { setBusy(false); } }
  return (
    <motion.div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="card relative p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" initial={{ y: 24, scale: .97 }} animate={{ y: 0, scale: 1 }} exit={{ y: 24, opacity: 0 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Draft">
        <div className="tick">{kind === "return" ? "Return request" : "Warranty claim"} · draft only</div>
        <div className="font-serif text-2xl mt-2">{a.model}</div>
        <div className="text-sm text-mute">{a.retailer} · bought {a.purchased}{a.serial ? ` · S/N ${a.serial}` : ""}</div>
        <label className="block text-sm mt-4 mb-1.5">What&apos;s wrong?</label>
        <textarea className="field text-sm" rows={3} value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="e.g. The left earcup crackles at high volume." />
        <button className="btn btn-ink btn-sm mt-3" onClick={go} disabled={busy} data-testid="draft">{busy ? <><Spinner /> Drafting…</> : out ? "Redraft" : "Draft it"}</button>
        {out && <>
          <pre className="mt-4 whitespace-pre-wrap text-sm font-sans bg-paper border border-line rounded-xl p-4 text-ink2" data-testid="draft-out">{out.text}</pre>
          <div className="flex justify-between items-center mt-3"><span className="text-[11px] text-dim">by {out.model} · uses only facts from your documents · never sent for you</span>
            <button className="btn btn-sm btn-ghost" onClick={() => { navigator.clipboard?.writeText(out.text); setCopied(true); }}>{copied ? "Copied ✓" : "Copy"}</button></div>
        </>}
        <button className="absolute top-4 right-5 text-dim hover:text-ink" onClick={onClose} aria-label="Close">✕</button>
      </motion.div>
    </motion.div>
  );
}
