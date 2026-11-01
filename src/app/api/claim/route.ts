import { generateText } from "ai";
import { withModel } from "@/lib/models";
import { limit } from "@/lib/ratelimit";
export const runtime = "nodejs";
export const maxDuration = 60;
/** Draft (never send) a warranty or return request from the asset's verified facts. */
export async function POST(req: Request) {
  if (!limit(req, "claim", 10)) return Response.json({ error: "Too many requests." }, { status: 429 });
  const { asset: a, problem, kind } = await req.json().catch(() => ({}));
  if (!a?.name) return Response.json({ error: "Missing asset" }, { status: 400 });
  const facts = `Product: ${a.model} (${a.name})\nSerial: ${a.serial ?? "not on file"}\nRetailer: ${a.retailer}\nPurchased: ${a.purchased}\nPrice: ${a.price} ${a.currency}\nWarranty: ${a.warrantyMonths} months (${a.warrantySource})\nReturn window: ${a.returnDays ? a.returnDays + " days" : "not stated"}\nProof: ${a.sources?.[0]}`;
  const what = String(problem || "").slice(0, 600) || (kind === "return" ? "I'd like to return it within the return window." : "It has developed a fault.");
  const fallback = `Subject: ${kind === "return" ? "Return request" : "Warranty claim"}: ${a.model}${a.serial ? `, serial ${a.serial}` : ""}\n\nHello ${a.retailer} team,\n\nI bought a ${a.model} (${a.name}) from you on ${a.purchased} for ${a.price} ${a.currency}. ${what}\n\n${kind === "return" ? `This is within your ${a.returnDays}-day return window.` : `The product is within its ${a.warrantyMonths}-month warranty.`} I've attached the receipt.\n\nPlease let me know the next step.\n\nThank you,`;
  try {
    const { result, model } = await withModel((m) => generateText({ model: m, temperature: 0.4, maxOutputTokens: 700, system: "Write a short, polite, firm email a customer sends to a retailer or manufacturer. Use only the facts given; never invent order numbers, dates or laws. Start with 'Subject: '. Under 170 words. Leave the sign-off name blank.", prompt: `${kind === "return" ? "Return request" : "Warranty claim"}.\n${facts}\nCustomer's words: ${what}` }));
    return Response.json({ text: result.text.trim(), model });
  } catch { return Response.json({ text: fallback, model: "template" }); }
}
