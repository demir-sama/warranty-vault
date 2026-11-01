import Link from "next/link";
import HeroDemo from "@/components/HeroDemo";
import { Reveal } from "@/components/Chrome";

const SHOPS = ["Best Buy", "MediaMarkt", "John Lewis", "Costco", "Apple Ginza", "JB Hi-Fi", "IKEA", "REI", "Darty", "B&H Photo", "Amazon.de", "FNAC"];
const STEPS = [
  ["01", "Find", "file-agent searches only the folders you name for PDFs, photos and order emails, and sets aside duplicate copies by checksum.", "ug-filesystem find · md5sum"],
  ["02", "Read", "photo-agent reads receipt photos and serial labels. document-agent sorts receipts from manuals and skips boarding passes, menus and bank statements.", "ug-photo vision-ocr · ug-document metadata"],
  ["03", "Extract", "Item, serial, date, price, warranty and return terms. Each field keeps the exact line it came from, and blanks stay blank.", "ug-document extract"],
  ["04", "Reconcile", "Receipts are matched to manuals and label photos by model number. A serial that disagrees is flagged, never silently fixed.", "ug-document reconcile"],
  ["05", "Alert", "Return windows closing within 7 days and warranties ending within 45 go to the top, with a calendar file for both.", "computed in the skill"],
  ["06", "Save, if you say so", "The register is written to the NAS and source files are tagged only after you approve each one.", "ug-knowledge save-text · ug-filemgr tag-add-file"],
];
export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 dots pointer-events-none" />
        <div className="relative mx-auto max-w-6xl px-5 pt-14 md:pt-24 pb-16 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <Reveal>
            <span className="chip text-verm border-verm/30 bg-verm/5">A skill for UGREEN AI NAS</span>
            <h1 className="display text-[3.4rem] md:text-[5.6rem] mt-6">Your NAS already knows <em className="text-verm">what you own.</em></h1>
            <p className="text-lg md:text-xl text-mute mt-6 max-w-xl leading-relaxed">Warranty Vault reads the receipts, order emails, manuals and serial-label photos already on your drives, and builds one register of everything you own, with the last day to return it and the day its warranty ends.</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/app" className="btn btn-ink">Run the live demo →</Link>
              <Link href="/skill" className="btn btn-ghost">Read the SKILL.md</Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm text-mute"><span>✓ Read-only until you approve</span><span>✓ A source for every date</span><span>✓ Nothing leaves the NAS</span></div>
          </Reveal>
          <Reveal delay={.15}><HeroDemo /></Reveal>
        </div>
      </section>

      <div className="border-y border-line bg-card/60 overflow-hidden py-4">
        <div className="marquee flex gap-12 w-max font-serif text-2xl text-dim whitespace-nowrap">{[...SHOPS, ...SHOPS].map((s, i) => <span key={i}>{s} <span className="text-verm">✦</span></span>)}</div>
      </div>

      <section className="mx-auto max-w-6xl px-5 py-24 grid md:grid-cols-3 gap-6">
        {[["3 places", "is where one purchase's paperwork usually ends up: a PDF in Downloads, an order email, and a photo of the box label."], ["14–30 days", "is all most shops give you to change your mind. Nobody remembers the date."], ["2 years", "is the EU's legal guarantee on goods. Most people never use it, because they can't find the receipt."]].map(([b, t], i) => (
          <Reveal key={b} delay={i * .08}><div className="card p-7 h-full"><div className="display text-5xl">{b}</div><p className="text-mute mt-4 leading-relaxed">{t}</p></div></Reveal>
        ))}
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-10 scroll-mt-20">
        <Reveal><div className="tick">How it works</div><h2 className="display text-5xl md:text-6xl mt-3 max-w-3xl">Six steps. Four experts. <em className="text-verm">Zero guessing.</em></h2></Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {STEPS.map(([n, t, d, c], i) => (
            <Reveal key={n} delay={i * .05}><div className="card p-6 h-full group hover:-translate-y-1 transition-transform">
              <div className="flex justify-between"><span className="font-serif text-4xl text-verm">{n}</span><span className="h-2.5 w-2.5 rounded-full bg-line2 group-hover:bg-verm transition" /></div>
              <div className="font-semibold text-lg mt-4">{t}</div><p className="text-mute text-sm mt-2 leading-relaxed">{d}</p>
              <div className="font-mono text-[11px] text-dim mt-4">{c}</div>
            </div></Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 grid lg:grid-cols-2 gap-10 items-center">
        <Reveal>
          <div className="tick">Why it's different</div>
          <h2 className="display text-5xl mt-3">Not another receipt app.</h2>
          <div className="mt-6 space-y-5 text-mute leading-relaxed">
            <p><strong className="text-ink">No re-scanning.</strong> Receipt apps want you to photograph every purchase from now on. Your history is already on the NAS, in Downloads, mail exports and phone backups. Warranty Vault starts from there.</p>
            <p><strong className="text-ink">Evidence, not vibes.</strong> A chatbot will happily tell you your dishwasher has a 5-year warranty. Here every term is quoted from a file, and anything not written down is labelled <em>assumed</em> with the regional rule it came from.</p>
            <p><strong className="text-ink">Private by design.</strong> It runs on your NAS's own experts. No cloud upload, no retailer logins, no data broker.</p>
          </div>
        </Reveal>
        <Reveal delay={.1}>
          <div className="card p-6">
            <div className="tick">Needs you</div>
            <div className="font-semibold text-lg mt-3">LG OLED55C3 · Costco</div>
            <div className="mt-3 rounded-xl border border-sky/30 bg-sky/5 px-4 py-3 text-sm text-ink2">⚑ Serial on the receipt (309MAPK1A<b>123</b>) doesn&apos;t match the label photo (309MAPK1A<b>128</b>). Check the device before you claim.</div>
            <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-[11px] text-dim"><div className="rounded-lg border border-line p-2.5">costco-warehouse-1185.pdf</div><div className="rounded-lg border border-line p-2.5">tv back label.jpg</div></div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <Reveal><div className="card p-10 md:p-16 text-center bg-ink !border-ink text-paper relative overflow-hidden">
          <h2 className="display text-5xl md:text-6xl">Find out what you can <em className="text-verm">still return.</em></h2>
          <p className="text-paper/70 mt-4 max-w-lg mx-auto">The demo runs the full skill workflow on a sample household NAS with receipts from eight countries.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-8"><Link href="/app" className="btn btn-verm">Run the demo →</Link><Link href="/docs" className="btn border border-paper/30 text-paper hover:bg-paper/10">Read the docs</Link></div>
        </div></Reveal>
      </section>
    </>
  );
}
