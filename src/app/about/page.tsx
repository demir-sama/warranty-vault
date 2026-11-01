import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Chrome";
export const metadata: Metadata = { title: "About", description: "Why Warranty Vault exists and how it was built." };
export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-14">
      <Reveal><div className="tick">About</div>
        <h1 className="display text-5xl md:text-7xl mt-3">The paperwork is already there. <em className="text-verm">Nobody reads it.</em></h1></Reveal>
      <Reveal delay={.1}><div className="prose-doc mt-10 text-lg">
        <p>Every household that owns a NAS has the same pile: invoices saved to Downloads, order confirmations exported from mail, a phone backup full of photos of receipts and the back of the TV. It's all there. It's just never in one place on the day the headphones crackle or the dishwasher leaks.</p>
        <p>Warranty Vault is a skill for UGREEN AI NAS that reads that pile for you. It doesn't ask you to change habits or photograph anything new. It builds a register of what you own, when you bought it, what you paid, and the two dates that matter: the last day you can return it, and the day its warranty ends.</p>
        <h2>Principles</h2>
        <ul>
          <li><strong>Every date has a source.</strong> If a term isn't written in one of your files, it's shown as an assumption with the rule behind it.</li>
          <li><strong>Read first, write only with permission.</strong> Saving the register and tagging files each wait for a yes.</li>
          <li><strong>Stay on the box.</strong> The skill uses the NAS's own experts. Your receipts never go to a third party.</li>
          <li><strong>Disagreements are surfaced, not resolved.</strong> When a receipt and a label disagree on a serial number, you decide.</li>
        </ul>
        <h2>Who it's for</h2>
        <p>Anyone, anywhere, who buys things that come with a guarantee. The demo household shops in the US, UK, Germany, France, Sweden, Canada, Japan and Australia, because real households do too, and each country has its own default rules.</p>
        <h2>How it was built</h2>
        <p>The skill follows the Uliya Skill Development Standard and passes the official static checker. This website is a companion: it runs the same workflow against a simulated NAS so judges and users can see the result without hardware. It is built with Next.js and deployed on Vercel. Receipts you add yourself in the demo are read by an AI model through Vercel AI Gateway, and every field is checked against your text before it's kept.</p>
        <p>Warranty Vault is an independent hackathon project. It is not made or endorsed by UGREEN.</p>
      </div></Reveal>
      <div className="flex gap-3 mt-10"><Link href="/app" className="btn btn-ink">Try the demo</Link><Link href="/docs" className="btn btn-ghost">Docs</Link></div>
    </div>
  );
}
