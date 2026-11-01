import { z } from "zod";
import { withModel } from "@/lib/models";
import { generateJSON } from "@/lib/json";
import { parseReceipt, buildAssets, type Asset } from "@/lib/vault";
import { limit } from "@/lib/ratelimit";
export const runtime = "nodejs";
export const maxDuration = 60;

const F = z.object({ value: z.string(), quote: z.string() }).nullable();
const Schema = z.object({
  transcript: z.string().describe("Full verbatim text of the document, line by line"),
  isPurchase: z.boolean(),
  retailer: F, order: F, date: F.describe("purchase date, value as YYYY-MM-DD"), country: F.describe("country name in English"),
  brand: F, model: F, product: F.describe("short product name"), serial: F,
  total: F.describe("value like 'EUR 89.99'"), warrantyMonths: F.describe("value as integer months"), returnDays: F.describe("value as integer days"),
});

/** Extract one user-supplied receipt. Fields whose quote is not found in the source text are dropped. */
export async function POST(req: Request) {
  if (!limit(req, "extract", 10)) return Response.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
  const { text, image, name } = await req.json().catch(() => ({}));
  const file = `/Uploads/${String(name || "pasted-receipt.txt").replace(/[^\w .()-]/g, "").slice(0, 80)}`;
  const src = typeof text === "string" ? text.slice(0, 12000) : "";
  const img = typeof image === "string" && /^data:image\/(png|jpe?g|webp);base64,/.test(image) && image.length < 6_000_000 ? image : null;
  if (!src.trim() && !img) return Response.json({ error: "Paste receipt text or attach a photo." }, { status: 400 });
  try {
    const { result, model } = await withModel((m) => generateJSON({ model: m, schema: Schema, system: "You extract purchase facts from receipts, invoices and order emails for a household warranty register. Only report what the document says. Every non-null field must include `quote`: an exact, verbatim substring copied from the document. Never guess a warranty or return term that is not written; use null.", messages: [{ role: "user", content: img ? [{ type: "text", text: "Extract from this receipt photo." }, { type: "image", image: img }] : `Document:\n"""\n${src}\n"""` }] }));
    const o = result.object; const hay = (img ? o.transcript : src).toLowerCase().replace(/\s+/g, " ");
    const ok = (f: { value: string; quote: string } | null) => (f && f.quote && hay.includes(f.quote.toLowerCase().replace(/\s+/g, " ").trim()) ? f : null);
    const dropped: string[] = []; const keep = (k: string, f: { value: string; quote: string } | null) => { const r = ok(f); if (f && !r) dropped.push(k); return r; };
    if (!o.isPurchase) return Response.json({ error: "This doesn't look like a purchase receipt.", model }, { status: 422 });
    const g = { retailer: keep("retailer", o.retailer), order: keep("order", o.order), date: keep("date", o.date), country: keep("country", o.country), brand: keep("brand", o.brand), model: keep("model", o.model), product: keep("product", o.product), serial: keep("serial", o.serial), total: keep("total", o.total), w: keep("warranty", o.warrantyMonths), r: keep("returns", o.returnDays) };
    // Re-express verified facts in the canonical receipt form, then run the same deterministic builder as the NAS scan.
    const lines = [g.retailer?.value ?? "Unknown retailer", g.order ? `Order: ${g.order.value}` : "", g.date && /^\d{4}-\d{2}-\d{2}$/.test(g.date.value) ? `Date: ${g.date.value}` : "", g.country ? `Sold in: ${g.country.value}` : "", `Item: ${[g.brand?.value, g.model?.value].filter(Boolean).join(" ") || "Item"} - ${g.product?.value ?? "Product"}`, g.serial ? `Serial no: ${g.serial.value}` : "", g.total ? `Total paid: ${g.total.value}` : "", g.w && +g.w.value ? `Warranty: ${parseInt(g.w.value)} months` : "", g.r && +g.r.value ? `Returns: within ${parseInt(g.r.value)} days` : ""].filter(Boolean);
    const p = parseReceipt(file, lines.join("\n"));
    const quotes: Record<string, string | undefined> = { retailer: g.retailer?.quote, order: g.order?.quote, date: g.date?.quote, country: g.country?.quote, item: [g.brand?.quote, g.model?.quote, g.product?.quote].filter(Boolean).join(" … "), serial: g.serial?.quote, total: g.total?.quote, warrantyEv: g.w?.quote, returnEv: g.r?.quote };
    for (const [k, q] of Object.entries(quotes)) { const e = (p as Record<string, unknown>)[k] as { quote: string } | undefined; if (e && q) e.quote = q; }
    if (!p.date) return Response.json({ error: "Couldn't find a purchase date written on the document.", model, dropped }, { status: 422 });
    const [a] = buildAssets([], [p]) as Asset[];
    return Response.json({ asset: { ...a, id: `u${Date.now().toString(36)}`, added: true }, model, dropped, mode: "ai" });
  } catch (e) {
    if (!src.trim()) return Response.json({ error: "The AI reader is unavailable, and photos need it. Paste the receipt text instead." }, { status: 503 });
    const p = parseReceipt(file, src); const [a] = buildAssets([], [p]);
    if (!a) return Response.json({ error: "Couldn't read an item and purchase date. Use lines like 'Item: …' and 'Date: YYYY-MM-DD'.", detail: String((e as Error).message).slice(0, 120) }, { status: 422 });
    return Response.json({ asset: { ...a, id: `u${Date.now().toString(36)}`, added: true }, model: "rules parser", dropped: [], mode: "rules" });
  }
}
