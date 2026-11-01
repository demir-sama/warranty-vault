import type { NasFile } from "./nas";
export type Cls = "receipt" | "manual" | "label" | "other" | "unreadable";
/** What document-agent `metadata` + a quick read would tell us about a file. */
export function classify(f: NasFile): { cls: Cls; why: string } {
  const t = f.text;
  if ((f.ocr ?? 1) < 0.3) return { cls: "unreadable", why: `OCR confidence ${(f.ocr! * 100).toFixed(0)}%` };
  if (/^(?:order|invoice no)\s*[:#]/im.test(t) && /total/i.test(t)) return { cls: "receipt", why: "has an order number and a total" };
  if (/user manual|user guide|gebrauchsanleitung/i.test(t)) return { cls: "manual", why: "product manual with a warranty clause" };
  if (/S\/N\s/.test(t)) return { cls: "label", why: "rating-plate photo with a serial number" };
  return { cls: "other", why: /boarding|statement|menu/i.test(t) ? t.split("(")[1]?.replace(")", "") ?? "not a purchase" : "not a purchase document" };
}
