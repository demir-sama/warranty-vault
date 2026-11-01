import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Warranty Vault: your NAS already knows what you own";
export default function OG() {
  const rows: [string, string, string, string][] = [["Sony WH-1000XM5 · Best Buy", "Return closes in 3d", "#e4572e", "#fde3da"], ["Bosch SMS4HVI33E · MediaMarkt", "Warranty ends in 30d", "#b7791f", "#f8ecd2"], ["IKEA KIVIK · 10-year guarantee", "Covered to 2036", "#1f8a70", "#dcefe8"]];
  return new ImageResponse(
    <div style={{ width: 1200, height: 630, display: "flex", background: "#f5f0e6", color: "#15213a", padding: 70, fontFamily: "Georgia, serif" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 610 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="66" height="66" viewBox="0 0 64 64"><path d="M32 5 53 12.5V30c0 14-9 23.5-21 28.5C20 53.5 11 44 11 30V12.5Z" fill="#15213a" /><path d="M23 17h18v24l-3 2.2-3-2.2-3 2.2-3-2.2-3 2.2-3-2.2Z" fill="#f5f0e6" /><path d="M27 23h10M27 28h10M27 33h6" stroke="#15213a" strokeWidth="2.4" strokeLinecap="round" /><circle cx="44" cy="44" r="9" fill="#e4572e" stroke="#f5f0e6" strokeWidth="2.5" /><path d="M44 39.5V44l3 2" stroke="#f5f0e6" strokeWidth="2.4" strokeLinecap="round" fill="none" /></svg>
          <div style={{ fontSize: 46, display: "flex" }}>Warranty<span style={{ color: "#e4572e", fontStyle: "italic" }}>Vault</span></div>
        </div>
        <div style={{ fontSize: 74, lineHeight: 1.02, marginTop: 64, letterSpacing: -2 }}>Your NAS already</div>
        <div style={{ fontSize: 74, lineHeight: 1.02, letterSpacing: -2, fontStyle: "italic", color: "#e4572e" }}>knows what you own.</div>
        <div style={{ fontSize: 26, marginTop: 30, color: "#6f665a", fontFamily: "sans-serif" }}>A UGREEN AI NAS skill that turns receipts, manuals and serial labels into a register with return and warranty alerts.</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginLeft: 46, marginTop: 110, width: 410 }}>
        {rows.map(([n, s, c, bg]) => (
          <div key={n} style={{ display: "flex", flexDirection: "column", padding: 22, borderRadius: 18, border: "1.5px solid #ddd3c1", background: "#fffdf8", fontFamily: "sans-serif" }}>
            <div style={{ fontSize: 22, display: "flex" }}>{n}</div>
            <div style={{ display: "flex", marginTop: 12 }}><span style={{ fontSize: 18, color: c, background: bg, padding: "5px 12px", borderRadius: 99 }}>{s}</span></div>
          </div>))}
      </div>
    </div>, size);
}
