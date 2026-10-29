import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoProvider } from "@/components/demo-provider";
import { AppShell } from "@/components/app-shell";
import "./globals.css";
import "../styles/pages.css";

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
      <body>
        <DemoProvider>
          <AppShell>
            <Suspense
              fallback={
                <section className="panel" role="status">
                  Memuat halaman…
                </section>
              }
            >
              {children}
            </Suspense>
          </AppShell>
        </DemoProvider>
      </body>
    </html>
  );
}
