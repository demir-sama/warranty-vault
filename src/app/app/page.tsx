import type { Metadata } from "next";
import Console from "@/components/app/Console";
export const metadata: Metadata = { title: "Live demo", description: "Run the Warranty Vault skill on a simulated household NAS." };
export default function Page() { return <Console />; }
