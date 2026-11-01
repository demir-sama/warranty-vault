import type { Metadata } from "next";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import SkillTabs from "./SkillTabs";
export const metadata: Metadata = { title: "The skill", description: "The Warranty Vault SKILL.md and references, as submitted to the UGREEN Hackathon 2026." };
export const dynamic = "force-static";
export default function Skill() {
  const root = path.join(process.cwd(), "skill", "warranty-vault");
  const files = [["SKILL.md", readFileSync(path.join(root, "SKILL.md"), "utf8")], ...readdirSync(path.join(root, "references")).sort().map((f) => [`references/${f}`, readFileSync(path.join(root, "references", f), "utf8")])] as [string, string][];
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12">
      <div className="tick">UGREEN Hackathon 2026 · Round 1</div>
      <h1 className="display text-5xl md:text-7xl mt-3">The skill, <em className="text-verm">in full.</em></h1>
      <p className="text-lg text-mute mt-5 max-w-2xl">Warranty Vault is a Markdown-only orchestration skill in the Uliya Skill Development Standard. It delegates to four registered NAS experts and passes the official <span className="font-mono text-sm">uliya-skill-kit 0.7.3</span> static check with 0 errors and 0 warnings.</p>
      <div className="flex flex-wrap gap-3 mt-7">
        <a href="/warranty-vault-skill.zip" className="btn btn-ink" download>Download skill ZIP</a>
        <a href="/warranty-vault-proposal.pdf" className="btn btn-ghost" download>Proposal PDF</a>
      </div>
      <div className="grid sm:grid-cols-4 gap-3 mt-10">
        {[["file-agent", "ug-filesystem · ug-filemgr"], ["photo-agent", "ug-photo"], ["document-agent", "ug-document"], ["knowledge-agent", "ug-knowledge"]].map(([a, c]) => <div key={a} className="card p-4"><div className="font-mono text-sm">{a}</div><div className="text-xs text-dim mt-1">{c}</div></div>)}
      </div>
      <SkillTabs files={files} />
    </div>
  );
}
