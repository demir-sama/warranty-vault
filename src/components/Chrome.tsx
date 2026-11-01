"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Wordmark } from "./Logo";

const LINKS = [{ href: "/#how", label: "How it works" }, { href: "/skill", label: "The skill" }, { href: "/docs", label: "Docs" }, { href: "/about", label: "About" }];

export function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 8); f(); addEventListener("scroll", f, { passive: true }); return () => removeEventListener("scroll", f); }, []);
  useEffect(() => setOpen(false), [path]);
  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "backdrop-blur-xl bg-paper/80 border-b border-line" : "border-b border-transparent"}`}>
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Warranty Vault home"><Wordmark /></Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-mute">
          {LINKS.map((l) => <Link key={l.href} href={l.href} className={`link-u hover:text-ink transition ${path === l.href ? "text-ink" : ""}`}>{l.label}</Link>)}
          <Link href="/app" className="btn btn-ink btn-sm">Try the demo →</Link>
        </nav>
        <button className="md:hidden btn btn-ghost btn-sm" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">{open ? "Close" : "Menu"}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-line bg-paper/95 backdrop-blur-xl">
            <div className="px-5 py-4 flex flex-col gap-3">
              {LINKS.map((l) => <Link key={l.href} href={l.href} className="py-1 text-lg">{l.label}</Link>)}
              <Link href="/app" className="btn btn-ink mt-2">Try the demo →</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line mt-24">
      <div className="mx-auto max-w-6xl px-5 py-12 grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] text-sm">
        <div>
          <Wordmark />
          <p className="text-mute mt-4 max-w-xs leading-relaxed">A skill for UGREEN AI NAS that turns the paperwork already on your drives into a register of everything you own, with a source for every date.</p>
        </div>
        <Col title="Product" links={[["/app", "Live demo"], ["/skill", "The skill (SKILL.md)"], ["/#how", "How it works"]]} />
        <Col title="Learn" links={[["/docs", "Docs"], ["/docs#faq", "FAQ"], ["/about", "About"]]} />
        <Col title="Legal" links={[["/privacy", "Privacy"], ["/terms", "Terms"], ["https://github.com/demir-sama/warranty-vault", "Source"]]} />
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-10 flex flex-wrap justify-between gap-3 text-xs text-dim">
        <span>Built for the UGREEN Hackathon 2026. Independent project, not an official UGREEN skill.</span>
        <span>The web demo runs on a simulated NAS with sample files.</span>
      </div>
    </footer>
  );
}
function Col({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="tick mb-3">{title}</div>
      <ul className="space-y-2">{links.map(([h, l]) => <li key={h}><Link href={h} className="text-ink2 hover:text-verm transition">{l}</Link></li>)}</ul>
    </div>
  );
}
export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: .65, delay, ease: [0.2, 0.7, 0.2, 1] }} className={className}>{children}</motion.div>;
}
