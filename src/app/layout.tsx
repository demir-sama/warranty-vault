import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import { Nav, Footer } from "@/components/Chrome";
import "./globals.css";
const serif = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK", "opsz"], style: ["normal", "italic"], variable: "--f-serif" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--f-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--f-mono" });
const url = "https://warranty-vault-sama-5806.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: { default: "Warranty Vault: your NAS already knows what you own", template: "%s · Warranty Vault" },
  description: "A UGREEN AI NAS skill that finds receipts, manuals and serial labels on your NAS and builds a household asset register with return-window and warranty alerts, with a source for every date.",
  openGraph: { type: "website", url, siteName: "Warranty Vault" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#f5f0e6" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body><Nav /><main>{children}</main><Footer /></body>
    </html>
  );
}
