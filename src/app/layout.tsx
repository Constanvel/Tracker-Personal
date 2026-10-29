import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Folio — Ruang untuk cerita Anda",
  description:
    "Prototipe personal tracker lintas media dan hobi. Data sintetis, tanpa penyimpanan permanen.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
