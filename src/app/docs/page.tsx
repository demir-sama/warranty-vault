import type { Metadata } from "next";
import DocsNav from "./DocsNav";
export const metadata: Metadata = { title: "Docs", description: "Install, use and understand the Warranty Vault skill and demo." };
const SECTIONS = [["start", "Getting started"], ["install", "Install on a NAS"], ["workflow", "The workflow"], ["fields", "Fields & evidence"], ["rules", "Warranty rules"], ["alerts", "Alerts & calendar"], ["approval", "Approvals & safety"], ["demo", "The web demo"], ["api", "Demo API"], ["faq", "FAQ"]] as const;
export default function Docs() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-12 grid lg:grid-cols-[220px_1fr] gap-12">
      <DocsNav sections={SECTIONS as unknown as [string, string][]} />
      <article className="prose-doc min-w-0 max-w-3xl pb-10">
        <div className="tick">Documentation</div>
        <h1 className="display text-6xl mt-3">Warranty Vault docs</h1>
        <p className="text-lg">How the skill works, what it reads, what it writes, and how to try it. About eight minutes.</p>

        <h2 id="start">Getting started</h2>
        <ul>
          <li>Open <a href="/app">the demo</a>. No account needed.</li>
          <li>Leave all five folders ticked and press <strong>Run Warranty Vault</strong>. Watch each expert delegation in the run log.</li>
          <li>Open any asset to see every field next to the line it was read from.</li>
          <li>Drag the <strong>time machine</strong> forward to see return windows close and warranties end.</li>
          <li>Approve <strong>Save the register</strong> and <strong>Tag the source files</strong>, or decline them; both are optional.</li>
          <li>Paste one of your own receipts under <strong>Add your own receipt</strong>, then download the <code>.ics</code> to get reminders in any calendar.</li>
        </ul>

        <h2 id="install">Install on a NAS</h2>
        <p>The skill is a folder of Markdown: <code>SKILL.md</code> plus <code>references/</code>. Download the <a href="/warranty-vault-skill.zip">ZIP</a>, then upload it to UGREEN SkillHub from your account. Once installed, ask Uliya on your NAS something like:</p>
        <pre>{`"What do I own that's still under warranty?"
"Can I still return anything I bought this month?"
"Build a warranty register from Documents and Downloads and save it."`}</pre>
        <p>Round 1 of the hackathon doesn't need hardware, so the skill hasn't run on a real NAS yet. See <a href="#faq">FAQ</a>.</p>

        <h2 id="workflow">The workflow</h2>
        <table><thead><tr><th>Step</th><th>Expert</th><th>What happens</th></tr></thead><tbody>
          <tr><td>1 Find</td><td><code>file-agent</code></td><td>Find PDF, JPG, PNG, HEIC and EML files in the folders you named, with md5 checksums.</td></tr>
          <tr><td>2 Dedupe</td><td>skill</td><td>Identical checksums: keep one, list the rest as duplicates.</td></tr>
          <tr><td>3 OCR</td><td><code>photo-agent</code></td><td>Read text from photos. Below 30% confidence a photo is <em>unreadable</em>, never guessed.</td></tr>
          <tr><td>4 Classify</td><td><code>document-agent</code></td><td>Receipt, manual, serial label or other. Others are skipped with a reason.</td></tr>
          <tr><td>5 Extract</td><td><code>document-agent</code></td><td>Purchase facts, each with its source line.</td></tr>
          <tr><td>6 Reconcile</td><td><code>document-agent</code></td><td>Match manuals and labels by model number; report conflicts.</td></tr>
          <tr><td>7 Alerts</td><td>skill</td><td>Compute return and warranty deadlines and sort by urgency.</td></tr>
          <tr><td>8 Save</td><td><code>knowledge-agent</code></td><td>After approval, write <code>Warranty Register YYYY-MM-DD.md</code>. No overwrite.</td></tr>
          <tr><td>9 Tag</td><td><code>file-agent</code></td><td>After approval, tag source files <code>warranty-vault</code>.</td></tr>
        </tbody></table>
        <p>Each step gets only the real result of the step before it. If step 1 or 5 fails, the skill stops. If OCR fails it carries on with PDFs and emails and says so.</p>

        <h2 id="fields">Fields & evidence</h2>
        <p>For each receipt: retailer, order number, purchase date, country, brand, model, product, serial, total and currency, warranty months, return days. Every field stores the exact line it came from, which the demo shows in the <em>Evidence</em> table. Currencies are never converted. A missing field stays empty.</p>
        <p>For receipts you add in the demo, the AI must return a verbatim quote for each field. If the quote isn't in your text, the field is dropped and the toast tells you which ones.</p>

        <h2 id="rules">Warranty rules</h2>
        <p>Which warranty term wins, in order:</p>
        <ul><li>A term written on the receipt or order email.</li><li>A term in a manual matched by model number.</li><li>A regional default, labelled <strong>assumed</strong>.</li></ul>
        <table><thead><tr><th>Sold in</th><th>Default</th><th>Basis</th></tr></thead><tbody>
          <tr><td>EU (DE, FR, SE…)</td><td>24 months</td><td>EU 2-year legal guarantee</td></tr>
          <tr><td>United Kingdom</td><td>12 months</td><td>Typical manufacturer warranty</td></tr>
          <tr><td>US, Canada, Japan</td><td>12 months</td><td>Typical manufacturer warranty</td></tr>
          <tr><td>Australia</td><td>24 months</td><td>Consumer-law guidance for major appliances</td></tr>
        </tbody></table>
        <p>Defaults are a starting point, not legal advice. An assumed term always flags the asset <em>Needs you</em>.</p>

        <h2 id="alerts">Alerts & calendar</h2>
        <table><thead><tr><th>Status</th><th>When</th></tr></thead><tbody>
          <tr><td>Return window closing</td><td>0–7 days left on a written return period</td></tr>
          <tr><td>Needs you</td><td>Serial conflict, assumed term, or partly unreadable receipt</td></tr>
          <tr><td>Warranty ending</td><td>0–45 days left</td></tr>
          <tr><td>Covered</td><td>Everything else still in warranty</td></tr>
          <tr><td>Warranty ended</td><td>Past the end date</td></tr>
        </tbody></table>
        <p>The <code>.ics</code> export has one all-day event per deadline, with an alarm 3 days before a return closes and 30 days before a warranty ends. It imports into Google Calendar, Apple Calendar and Outlook.</p>

        <h2 id="approval">Approvals & safety</h2>
        <ul>
          <li>Steps 1–7 only read.</li>
          <li>Step 8 and step 9 each show exactly what will be written and wait for <em>Approve</em>. Silence is not approval.</li>
          <li>No delete, move, rename or share capability is used.</li>
          <li>No credentials are requested. Nothing is sent outside the NAS.</li>
          <li>Return and claim emails in the demo are drafts you copy. Nothing is ever sent for you.</li>
        </ul>

        <h2 id="demo">The web demo</h2>
        <p>The demo NAS has 12 household items from 8 countries plus realistic noise: a duplicate invoice, a faded receipt photo, a blurred photo, a boarding pass, a bank statement and a pizza menu. Purchase dates are relative to today so the alerts are always live. The parser, matching, alert rules and exports in the demo are the same logic described here.</p>

        <h2 id="api">Demo API</h2>
        <h3><code>POST /api/scan</code></h3>
        <p>Body <code>{`{ "shares": ["/Documents", "/Downloads"] }`}</code>. Streams NDJSON: <code>step</code> events (agent, cli, text), one <code>files</code> event, then <code>done</code> with <code>assets</code>, <code>skipped</code> and <code>dupes</code>.</p>
        <h3><code>POST /api/extract</code></h3>
        <p>Body <code>{`{ "text": "…" }`}</code> or <code>{`{ "image": "data:image/jpeg;base64,…" }`}</code>. Returns one <code>asset</code>, the <code>model</code> used and the fields <code>dropped</code> for failing the quote check. Falls back to the rules parser for text if AI is unavailable.</p>
        <h3><code>POST /api/claim</code></h3>
        <p>Body <code>{`{ "asset": {…}, "kind": "return" | "warranty", "problem": "…" }`}</code>. Returns a draft email built only from the asset's facts.</p>

        <h2 id="faq">FAQ</h2>
        <h3>Has it run on a real UGREEN NAS?</h3>
        <p>Not yet. Round 1 doesn't provide hardware. If selected as a finalist, the plan is to test a normal scan of mixed folders, a serial conflict, and an empty folder on the official test NAS.</p>
        <h3>Does it file warranty claims?</h3>
        <p>No. It finds the facts and can draft the email. You send it.</p>
        <h3>What about receipts in other languages?</h3>
        <p>On the NAS, the document expert reads them. In the demo, try the French FNAC example under <em>Paste example</em>.</p>
        <h3>Where is my data stored in the demo?</h3>
        <p>Receipts you add are kept in your browser's local storage. The text is sent once to the AI model to read it. See <a href="/privacy">Privacy</a>.</p>
      </article>
    </div>
  );
}
