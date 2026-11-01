import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div style={{ width: 180, height: 180, background: "#f5f0e6", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="140" height="140" viewBox="0 0 64 64"><path d="M32 5 53 12.5V30c0 14-9 23.5-21 28.5C20 53.5 11 44 11 30V12.5Z" fill="#15213a" /><path d="M23 17h18v24l-3 2.2-3-2.2-3 2.2-3-2.2-3 2.2-3-2.2Z" fill="#f5f0e6" /><path d="M27 23h10M27 28h10M27 33h6" stroke="#15213a" strokeWidth="2.4" strokeLinecap="round" /><circle cx="44" cy="44" r="9" fill="#e4572e" stroke="#f5f0e6" strokeWidth="2.5" /><path d="M44 39.5V44l3 2" stroke="#f5f0e6" strokeWidth="2.4" strokeLinecap="round" fill="none" /></svg>
    </div>, size);
}
