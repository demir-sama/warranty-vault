"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
export type Toast = { id: number; text: string; tone?: "ok" | "warn" | "err" };
export function Toasts({ items, drop }: { items: Toast[]; drop: (id: number) => void }) {
  useEffect(() => { const t = items.map((x) => setTimeout(() => drop(x.id), 4200)); return () => t.forEach(clearTimeout); }, [items, drop]);
  return (
    <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-50 flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence>{items.map((t) => (
        <motion.div key={t.id} layout initial={{ opacity: 0, y: 16, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 30 }} className={`pointer-events-auto card px-4 py-3 text-sm max-w-sm border-l-4 ${t.tone === "err" ? "border-l-verm" : t.tone === "warn" ? "border-l-amber" : "border-l-teal"}`}>{t.text}</motion.div>
      ))}</AnimatePresence>
    </div>
  );
}
export const Spinner = ({ className = "" }: { className?: string }) => <span className={`inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin ${className}`} />;
export const TONE: Record<string, [string, string]> = { return: ["text-verm", "bg-verm/10 border-verm/30"], "warranty-soon": ["text-amber", "bg-amber/10 border-amber/30"], review: ["text-sky", "bg-sky/10 border-sky/30"], expired: ["text-mute", "bg-sand border-line2"], covered: ["text-teal", "bg-teal/10 border-teal/30"] };
export function Pill({ k, children }: { k: string; children: React.ReactNode }) {
  const [t, b] = TONE[k] ?? TONE.covered;
  return <span className={`chip ${t} ${b}`}>{children}</span>;
}
/** A depleting bar: how much of a window is left. */
export function Window({ label, left, total, end, tone }: { label: string; left?: number; total?: number; end?: string; tone: string }) {
  if (left === undefined || !total) return <div className="text-xs text-dim">{label}: not stated</div>;
  const pct = Math.max(0, Math.min(100, (left / total) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1"><span className="text-mute">{label}</span><span className={left < 0 ? "text-dim" : "text-ink2"}>{left < 0 ? `ended ${end}` : `${left}d left · ${end}`}</span></div>
      <div className="h-1.5 rounded-full bg-sand overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: .9, ease: [0.2, 0.7, 0.2, 1] }} className={`h-full rounded-full ${tone}`} /></div>
    </div>
  );
}
export const FLAG: Record<string, string> = { US: "🇺🇸", DE: "🇩🇪", GB: "🇬🇧", CA: "🇨🇦", JP: "🇯🇵", AU: "🇦🇺", SE: "🇸🇪", FR: "🇫🇷" };
export function download(name: string, text: string, type: string) {
  const u = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement("a"); a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 2000);
}
