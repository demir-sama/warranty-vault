"use client";
import { useState } from "react";
export default function SkillTabs({ files }: { files: [string, string][] }) {
  const [i, setI] = useState(0);
  return (
    <div className="card mt-8 overflow-hidden">
      <div className="flex overflow-x-auto border-b border-line bg-sand/40">
        {files.map(([n], k) => <button key={n} onClick={() => setI(k)} className={`px-4 py-3 font-mono text-xs whitespace-nowrap border-b-2 transition ${k === i ? "border-verm text-ink bg-card" : "border-transparent text-mute hover:text-ink"}`}>{n}</button>)}
      </div>
      <pre className="p-5 md:p-7 text-[12.5px] leading-relaxed font-mono whitespace-pre-wrap text-ink2 max-h-[70vh] overflow-y-auto">{files[i][1]}</pre>
    </div>
  );
}
