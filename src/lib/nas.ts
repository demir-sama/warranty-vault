/**
 * A simulated household NAS. Purchase dates are stored as "days before today" so the demo's
 * return windows and warranty deadlines stay live whenever you open it.
 */
export type Kind = "receipt" | "receipt-photo" | "email" | "manual" | "label-photo" | "other" | "unreadable";
export type NasFile = { path: string; kind: Kind; bytes: number; text: string; ocr?: number; md5: string };
export type Fixture = {
  id: string; item: string; brand: string; model: string; category: string; serial?: string;
  retailer: string; country: string; currency: string; price: number; daysAgo: number;
  warrantyMonths?: number; warrantyNote?: string; returnDays?: number; order: string;
  receipt: { path: string; kind: "receipt" | "receipt-photo" | "email"; ocr?: number };
  manual?: { path: string; warrantyMonths: number };
  label?: { path: string; serial: string };
  dupe?: string;
};

export const FIXTURES: Fixture[] = [
  { id: "a1", item: "Wireless noise-cancelling headphones", brand: "Sony", model: "WH-1000XM5", category: "Audio", serial: "S01-5521873", retailer: "Best Buy", country: "US", currency: "USD", price: 399.99, daysAgo: 12, warrantyMonths: 12, returnDays: 15, order: "BBY01-806611254", receipt: { path: "/Documents/Receipts/2026/bestbuy-order-806611254.pdf", kind: "receipt" } },
  { id: "a2", item: "Dishwasher, Series 4", brand: "Bosch", model: "SMS4HVI33E", category: "Kitchen", retailer: "MediaMarkt", country: "DE", currency: "EUR", price: 649, daysAgo: 700, returnDays: 14, order: "MM-4471-220981", receipt: { path: "/Documents/Receipts/2024/mediamarkt-rechnung-220981.pdf", kind: "receipt" }, manual: { path: "/Documents/Manuals/Bosch SMS4HVI33E Gebrauchsanleitung.pdf", warrantyMonths: 24 }, label: { path: "/Photos/Home/2024/IMG_0412 dishwasher label.jpg", serial: "FD 0304 019283" } },
  { id: "a3", item: "Cordless vacuum V15 Detect", brand: "Dyson", model: "V15 Detect Absolute", category: "Home", serial: "XK4-UK-HPA2291A", retailer: "John Lewis", country: "GB", currency: "GBP", price: 599.99, daysAgo: 400, warrantyMonths: 24, warrantyNote: "2 year guarantee (register with Dyson)", returnDays: 35, order: "JL-71902345", receipt: { path: "/Mail/Exports/John Lewis - Your order 71902345.eml", kind: "email" } },
  { id: "a4", item: "55\" OLED TV", brand: "LG", model: "OLED55C3", category: "TV & Video", serial: "309MAPK1A123", retailer: "Costco", country: "CA", currency: "CAD", price: 1799.99, daysAgo: 75, warrantyMonths: 24, warrantyNote: "Costco Concierge: manufacturer warranty extended to 2 years", returnDays: 90, order: "CC-1185-99231", receipt: { path: "/Documents/Receipts/2026/costco-warehouse-1185.pdf", kind: "receipt" }, label: { path: "/Photos/Home/2026/tv back label.jpg", serial: "309MAPK1A128" } },
  { id: "a5", item: "MacBook Air 13\" (M3)", brand: "Apple", model: "MacBook Air M3 13", category: "Computers", serial: "C02FX1JQ9P", retailer: "Apple Ginza", country: "JP", currency: "JPY", price: 164800, daysAgo: 340, warrantyMonths: 12, returnDays: 14, order: "W1338829471", receipt: { path: "/Photos/Scans/receipt_apple_ginza.jpg", kind: "receipt-photo", ocr: 0.93 } },
  { id: "a6", item: "Espresso machine Barista Express", brand: "Breville", model: "BES870", category: "Kitchen", retailer: "JB Hi-Fi", country: "AU", currency: "AUD", price: 799, daysAgo: 200, order: "JB-3310-77812", receipt: { path: "/Photos/Scans/IMG_2208.jpg", kind: "receipt-photo", ocr: 0.64 } },
  { id: "a7", item: "KIVIK 3-seat sofa", brand: "IKEA", model: "KIVIK", category: "Furniture", retailer: "IKEA Kungens Kurva", country: "SE", currency: "SEK", price: 7995, daysAgo: 90, warrantyMonths: 120, warrantyNote: "10 års garanti", returnDays: 365, order: "IK-552-0918877", receipt: { path: "/Documents/Receipts/2026/ikea-kvitto-0918877.pdf", kind: "receipt" } },
  { id: "a8", item: "GPS running watch", brand: "Garmin", model: "Forerunner 265", category: "Wearables", serial: "3KX019284", retailer: "REI", country: "US", currency: "USD", price: 449.95, daysAgo: 30, warrantyMonths: 12, returnDays: 365, order: "REI-A19920314", receipt: { path: "/Mail/Exports/REI order A19920314.eml", kind: "email" } },
  { id: "a9", item: "Office chair Aeron", brand: "Herman Miller", model: "Aeron Size B", category: "Furniture", serial: "HM-AER-6630921", retailer: "Herman Miller Store", country: "US", currency: "USD", price: 1395, daysAgo: 900, warrantyMonths: 144, returnDays: 30, order: "HMS-2210448", receipt: { path: "/Documents/Receipts/2024/hermanmiller-2210448.pdf", kind: "receipt" } },
  { id: "a10", item: "Fridge-freezer Bespoke", brand: "Samsung", model: "RB38A7B6", category: "Kitchen", serial: "0AJ94BBT600218", retailer: "Darty", country: "FR", currency: "EUR", price: 1099, daysAgo: 1100, warrantyMonths: 24, returnDays: 14, order: "DA-88120451", receipt: { path: "/Documents/Receipts/2023/darty-facture-88120451.pdf", kind: "receipt" } },
  { id: "a11", item: "Mirrorless camera EOS R8", brand: "Canon", model: "EOS R8", category: "Cameras", serial: "082031004417", retailer: "B&H Photo", country: "US", currency: "USD", price: 1299, daysAgo: 20, warrantyMonths: 12, returnDays: 30, order: "BH-1029384756", receipt: { path: "/Downloads/BH-Invoice-1029384756.pdf", kind: "receipt" }, manual: { path: "/Documents/Manuals/EOS R8 Advanced User Guide.pdf", warrantyMonths: 12 } },
  { id: "a12", item: "Electric toothbrush", brand: "Philips", model: "Sonicare 7100 HX7429", category: "Personal care", retailer: "Amazon.de", country: "DE", currency: "EUR", price: 89.99, daysAgo: 25, warrantyMonths: 24, returnDays: 30, order: "302-4419983-1102217", receipt: { path: "/Downloads/Rechnung 302-4419983-1102217.pdf", kind: "receipt" }, dupe: "/Documents/Receipts/2026/amazon 302-4419983-1102217 (1).pdf" },
];

export const COUNTRY: Record<string, string> = { US: "United States", DE: "Germany", GB: "United Kingdom", CA: "Canada", JP: "Japan", AU: "Australia", SE: "Sweden", FR: "France" };
const SYM: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", CAD: "C$", JPY: "¥", AUD: "A$", SEK: "kr " };
export const money = (c: string, n: number) => (c === "JPY" ? `¥${Math.round(n).toLocaleString("en-US")}` : `${SYM[c] ?? c + " "}${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const dayStart = (d = new Date()) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 864e5);

function hash(s: string) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16).padStart(8, "0"); }

/** Text the document/OCR experts would return for a fixture's receipt. Every field we extract is a quote from this. */
export function receiptText(f: Fixture, today: Date) {
  const date = iso(addDays(today, -f.daysAgo));
  const L = [
    `${f.retailer.toUpperCase()}`,
    f.receipt.kind === "email" ? `Subject: Your order ${f.order} has been dispatched` : `Receipt / Invoice`,
    `Order: ${f.order}`,
    `Date: ${date}`,
    `Sold in: ${COUNTRY[f.country]}`,
    `Item: ${f.brand} ${f.model} - ${f.item}`,
    ...(f.serial ? [`Serial no: ${f.serial}`] : []),
    `Total paid: ${money(f.currency, f.price)} ${f.currency}`,
    ...(f.warrantyMonths ? [`Warranty: ${f.warrantyNote ?? `${f.warrantyMonths} months manufacturer warranty`}`] : []),
    ...(f.returnDays ? [`Returns: within ${f.returnDays} days of purchase`] : []),
    `Thank you for shopping at ${f.retailer}.`,
  ];
  if (f.receipt.ocr && f.receipt.ocr < 0.7) return L.filter((l) => !l.startsWith("Returns") && !l.startsWith("Warranty")).map((l, i) => (i === 5 ? l.replace(/a/g, "ä") : l)).join("\n") + "\n[OCR: lower half of the receipt is faded and unreadable]";
  return L.join("\n");
}

export function nasFiles(today: Date): NasFile[] {
  const out: NasFile[] = [];
  for (const f of FIXTURES) {
    const t = receiptText(f, today);
    out.push({ path: f.receipt.path, kind: f.receipt.kind, bytes: 40_000 + t.length * 37, text: t, ocr: f.receipt.ocr, md5: hash(t) });
    if (f.dupe) out.push({ path: f.dupe, kind: "receipt", bytes: 40_000 + t.length * 37, text: t, md5: hash(t) });
    if (f.manual) { const m = `${f.brand} ${f.model}\nUser manual\n...\nWarranty: ${f.manual.warrantyMonths} months from the date of purchase. Keep your receipt as proof of purchase.`; out.push({ path: f.manual.path, kind: "manual", bytes: 2_400_000, text: m, md5: hash(m) }); }
    if (f.label) { const l = `${f.brand.toUpperCase()}  MODEL ${f.model}\nS/N ${f.label.serial}\nMADE IN ...  220-240V`; out.push({ path: f.label.path, kind: "label-photo", bytes: 3_100_000, text: l, ocr: 0.97, md5: hash(l) }); }
  }
  const noise: [string, Kind, string][] = [
    ["/Documents/Bank/statement-2026-09.pdf", "other", "Monthly statement. Opening balance ... card payments ... (not a receipt for a durable item)"],
    ["/Photos/Scans/pizza-menu.jpg", "other", "MARGHERITA 9.50  DIAVOLA 11.00  (menu, no purchase)"],
    ["/Photos/Scans/IMG_2231.jpg", "unreadable", "[OCR: image too blurred to read]"],
    ["/Downloads/boarding-pass-LHR-JFK.pdf", "other", "Boarding pass. Gate 22. (travel document, not a product)"],
  ];
  for (const [p, k, t] of noise) out.push({ path: p, kind: k, bytes: 180_000, text: t, ocr: k === "unreadable" ? 0.18 : undefined, md5: hash(t) });
  return out;
}

/** Regional fallbacks, used only when no document states a term. Always marked "assumed". */
export const DEFAULT_WARRANTY: Record<string, [number, string]> = {
  DE: [24, "EU 2-year legal guarantee"], FR: [24, "EU 2-year legal guarantee"], SE: [24, "EU 2-year legal guarantee"], GB: [12, "typical UK manufacturer warranty"],
  US: [12, "typical US manufacturer warranty"], CA: [12, "typical manufacturer warranty"], JP: [12, "typical manufacturer warranty"], AU: [24, "Australian Consumer Law guidance for major appliances"],
};
