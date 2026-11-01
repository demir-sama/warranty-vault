"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
const DOCS = [
  { shop: "BEST BUY", lines: ["Order: BBY01-806611254", "Item: Sony WH-1000XM5", "Serial no: S01-5521873", "Total paid: $399.99 USD", "Returns: within 15 days"], hit: [1, 2, 4], row: ["Sony WH-1000XM5", "Return closes in 3d", "verm"] },
  { shop: "MEDIAMARKT", lines: ["Order: MM-4471-220981", "Item: Bosch SMS4HVI33E", "Total paid: €649.00 EUR", "Manual: 24 months warranty", "S/N FD 0304 019283 (label)"], hit: [1, 3, 4], row: ["Bosch SMS4HVI33E", "Warranty ends in 30d", "amber"] },
  { shop: "IKEA", lines: ["Order: IK-552-0918877", "Item: IKEA KIVIK", "Total paid: kr 7,995.00 SEK", "Warranty: 10 års garanti", "Returns: within 365 days"], hit: [1, 3], row: ["IKEA KIVIK sofa", "Covered to 2036", "teal"] },
];
const C: Record<string, string> = { verm: "text-verm bg-verm/10 border-verm/30", amber: "text-amber bg-amber/10 border-amber/30", teal: "text-teal bg-teal/10 border-teal/30" };
export default function HeroDemo() {
  const [i, setI] = useState(0); const [lit, setLit] = useState(0);
  useEffect(() => { const t = setInterval(() => setLit((l) => { if (l >= 4) { setI((x) => (x + 1) % 6); return 0; } return l + 1; }), 650); return () => clearInterval(t); }, []);
  const d = DOCS[i % 3]; const done = Math.min(3, i % 6 >= 3 ? 3 : (i % 3) + (lit >= 4 ? 1 : 0));
  return (
    <div className="relative h-[430px] md:h-[470px]">
      <AnimatePresence mode="popLayout">
        <motion.div key={i} initial={{ opacity: 0, y: -30, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -3 }} exit={{ opacity: 0, x: 120, y: 60, rotate: 4, scale: .7 }} transition={{ duration: .6, ease: [0.2, 0.7, 0.2, 1] }}
          className="absolute left-0 top-2 w-[250px] md:w-[270px] bg-card border border-line shadow-xl shadow-ink/10 receipt-edge px-5 pt-5 font-mono text-[11.5px]">
          <div className="text-center tracking-[.3em] font-medium text-ink">{d.shop}</div>
          <div className="border-t border-dashed border-line2 my-3" />
          {d.lines.map((l, k) => (
            <div key={k} className="relative py-1 px-1 -mx-1 rounded">
              <motion.span className="absolute inset-0 rounded bg-verm/15" initial={false} animate={{ opacity: d.hit.includes(k) && lit > d.hit.indexOf(k) ? 1 : 0 }} />
              <span className="relative text-ink2">{l}</span>
            </div>
          ))}
          <div className="border-t border-dashed border-line2 my-3" />
          <div className="text-center text-dim">THANK YOU</div>
        </motion.div>
      </AnimatePresence>
      <div className="absolute right-0 bottom-0 w-[290px] md:w-[330px] card p-4">
        <div className="flex justify-between items-center"><span className="tick">Asset register</span><span className="font-mono text-[10px] text-dim">/Warranty Vault</span></div>
        <div className="mt-3 space-y-2">
          {DOCS.map((x, k) => (
            <motion.div key={k} initial={false} animate={{ opacity: k < done ? 1 : .25, y: k < done ? 0 : 6 }} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-paper/60 px-3 py-2.5">
              <span className="text-[13px] font-medium truncate">{x.row[0]}</span>
              <span className={`chip ${C[x.row[2]]}`}>{x.row[1]}</span>
            </motion.div>
          ))}
        </div>
        <div className="text-[11px] text-dim mt-3">Every date links to the file it came from.</div>
      </div>
    </div>
  );
}
