import type { Metadata } from "next";
import "../globals.css";
import { inter, playfair } from "../fonts";
import { BRAND } from "@/config/brand";

export const metadata: Metadata = { title: { default: `Admin | ${BRAND.name}`, template: `%s | Admin` }, robots: { index: false, follow: false }, icons: { icon: "/favicon.svg" } };

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-ivory text-ink antialiased">{children}</body>
    </html>
  );
}
