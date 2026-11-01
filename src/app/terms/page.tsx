import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms" };
export default function T() {
  return (<div className="mx-auto max-w-3xl px-5 pt-14 prose-doc"><div className="tick">Legal</div><h1 className="display text-6xl mt-3">Terms</h1><p>Last updated 1 November 2026.</p>
    <ul><li>Warranty Vault is a hackathon project provided as is, with no warranty of its own (yes, really).</li><li>Dates and terms it reports come from your documents or from stated regional defaults. They are not legal advice. Check with the retailer or manufacturer before relying on a deadline.</li><li>Draft emails are suggestions. You're responsible for what you send.</li><li>Don't use the demo to process other people's documents without permission.</li><li>The source code is MIT licensed.</li><li>Warranty Vault is independent and not affiliated with or endorsed by UGREEN or any retailer named in the sample data.</li></ul></div>);
}
