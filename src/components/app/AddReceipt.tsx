"use client";
import { useState } from "react";
import type { Asset } from "@/lib/vault";
import { Spinner } from "./ui";
const SAMPLE = `FNAC Paris Saint-Lazare
Ticket de caisse n° 0457-221903
Date: 2026-10-18
Nintendo Switch OLED - Console blanche
N° de série: XTW70012345678
Total TTC: 349,99 EUR
Garantie: 2 ans (garantie légale de conformité)
Retours: 15 jours avec ticket`;
export default function AddReceipt({ onAdd, onErr }: { onAdd: (a: Asset, model: string, dropped: string[]) => void; onErr: (m: string) => void }) {
  const [text, setText] = useState(""); const [img, setImg] = useState<string | null>(null); const [name, setName] = useState(""); const [busy, setBusy] = useState(false);
  async function go() {
    setBusy(true);
    try {
      const r = await fetch("/api/extract", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text, image: img, name: name || "pasted-receipt.txt" }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "Couldn't read that receipt");
      onAdd(j.asset, j.model, j.dropped || []); setText(""); setImg(null); setName("");
    } catch (e) { onErr((e as Error).message); } finally { setBusy(false); }
  }
  function pick(f?: File) {
    if (!f) return; if (f.size > 4_000_000) { onErr("Photo is over 4 MB."); return; }
    const rd = new FileReader(); rd.onload = () => { setImg(String(rd.result)); setName(f.name); }; rd.readAsDataURL(f);
  }
  return (
    <div className="card p-5">
      <div className="flex justify-between items-baseline"><div className="tick">Add your own receipt</div><button className="text-xs text-verm" onClick={() => setText(SAMPLE)}>Paste example</button></div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder="Paste a receipt or order email…" className="field mt-3 text-sm font-mono" aria-label="Receipt text" />
      <label className="mt-2 flex items-center gap-2 text-xs text-mute cursor-pointer"><input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => pick(e.target.files?.[0])} /><span className="btn btn-sm btn-ghost">{img ? "Photo attached ✓" : "Or attach a photo"}</span>{img && <span className="truncate">{name}</span>}</label>
      <button className="btn btn-ink btn-sm w-full mt-3" disabled={busy || (!text.trim() && !img)} onClick={go} data-testid="add">{busy ? <><Spinner /> Reading…</> : "Read & add"}</button>
      <p className="text-[11px] text-dim mt-2 leading-relaxed">AI reads it, then every field is checked against the text. Anything it can&apos;t quote is dropped.</p>
    </div>
  );
}
