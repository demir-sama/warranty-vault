import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy" };
export default function P() {
  return (<div className="mx-auto max-w-3xl px-5 pt-14 prose-doc"><div className="tick">Legal</div><h1 className="display text-6xl mt-3">Privacy</h1><p>Last updated 1 November 2026.</p>
    <h2>The skill</h2><p>On a NAS, Warranty Vault uses only the NAS's own experts. It doesn't send your files, receipts or register anywhere, and it doesn't ask for any account or payment details.</p>
    <h2>This website</h2><ul><li>The demo NAS contains sample files only.</li><li>Receipts you paste or attach are sent once to an AI model through Vercel AI Gateway to read them, then the result is stored only in your browser's local storage. We don't keep a copy.</li><li>Draft emails are generated the same way and are never sent.</li><li>No accounts, no analytics cookies, no advertising.</li><li>Our host (Vercel) keeps standard request logs.</li></ul>
    <p>Don't paste anything you wouldn't want an AI provider to process. Remove a receipt at any time with <em>Remove</em>, or clear site data in your browser.</p></div>);
}
