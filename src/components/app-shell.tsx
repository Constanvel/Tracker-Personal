"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  ChevronRight,
  CircleHelp,
  Database,
  FolderHeart,
  Heart,
  House,
  Layers3,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useDemo } from "./demo-provider";
import { collectionPath, routes } from "@/lib/routes";

const nav = [
  { href: routes.home, label: "Beranda", icon: House },
  { href: routes.library, label: "Library", icon: Layers3 },
  { href: routes.favorites, label: "Favorit", icon: Heart },
  { href: routes.activity, label: "Aktivitas", icon: Activity },
  { href: routes.journal, label: "Jurnal", icon: BookOpen },
  { href: routes.collections, label: "Koleksi", icon: FolderHeart },
  { href: routes.statistics, label: "Statistik", icon: ChartNoAxesCombined },
  { href: routes.data, label: "Pusat data", icon: Database },
];
export function PixelMark() {
  return (
    <span aria-hidden="true" className="pixel-mark">
      {[1, 1, 0, 1, 0, 1, 1, 1, 0].map((on, i) => (
        <i key={i} className={on ? "on" : ""} />
      ))}
    </span>
  );
}
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { items, collections, settings } = useDemo();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  const section =
    nav.find((entry) => isActive(entry.href))?.label ??
    (isActive("/settings")
      ? "Pengaturan"
      : pathname === "/more"
        ? "Lainnya"
        : "Bantuan");
  const moreActive = !nav.slice(0, 4).some((entry) => isActive(entry.href));
  return (
    <div className={`app ${settings.solid ? "reduce-transparency" : ""}`}>
      <a className="skip-link" href="#main">
        Lewati navigasi
      </a>
      <aside className="sidebar glass">
        <Link href="/" className="brand">
          <PixelMark />
          <span>
            folio<span className="brand-dot">.</span>
          </span>
        </Link>
        <div className="workspace-label">RUANG PRIBADI</div>
        <nav aria-label="Navigasi utama">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-item ${isActive(href) ? "active" : ""}`}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
              {href === "/library" && (
                <span className="nav-count">{items.length}</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <div className="workspace-label">KOLEKSI PILIHAN</div>
        {collections.slice(0, 2).map((collection) => (
          <Link
            className="collection-link"
            href={collectionPath(collection.id)}
            key={collection.id}
          >
            <span className="collection-square" />
            {collection.name}
            <span>{collection.itemIds.length.toString().padStart(2, "0")}</span>
          </Link>
        ))}
        <div className="sidebar-bottom">
          <Link
            className={`nav-item ${isActive("/settings") ? "active" : ""}`}
            href="/settings"
          >
            <Settings2 size={18} />
            Pengaturan
          </Link>
          <Link className="profile" href="/settings/privacy">
            <span className="avatar">R</span>
            <div>
              <strong>Ruang milikmu</strong>
              <span>Mode demo · bukan login</span>
            </div>
            <ShieldCheck size={16} />
          </Link>
        </div>
      </aside>
      <div className="page-shell">
        <header className="topbar glass">
          <div className="breadcrumb">
            <Link href="/">Ruang pribadi</Link>
            <ChevronRight size={14} />
            <span>{section}</span>
          </div>
          <div className="topbar-right">
            <Link className="demo-chip" href="/help">
              <i />
              Mode demo
            </Link>
            <Link
              href="/help"
              className="icon-button"
              aria-label="Bantuan dan status prototipe"
            >
              <CircleHelp size={19} />
            </Link>
            <Link
              href="/settings/privacy"
              className="avatar small-avatar"
              aria-label="Profil dan privasi"
            >
              R
            </Link>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="demo-banner">
            <ShieldCheck size={16} />
            <span>
              <strong>Pratinjau desain.</strong> Data contoh; perubahan bertahan
              saat berpindah halaman, tetapi hilang saat refresh. Belum ada
              login atau database.
            </span>
          </div>
          {children}
          <footer className="page-footer">
            <Link href="/help">Ruang kecil. Cerita tak terbatas.</Link>
            <Link href="/help">
              Folio · Panduan <ArrowRight size={11} />
            </Link>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav glass" aria-label="Navigasi ponsel">
        {nav.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Link
            href={href}
            key={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={isActive(href) ? "active" : ""}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
        <Link
          href="/more"
          className={moreActive ? "active" : ""}
          aria-current={moreActive ? "page" : undefined}
        >
          <Layers3 size={20} />
          <span>Lainnya</span>
        </Link>
      </nav>
    </div>
  );
}
