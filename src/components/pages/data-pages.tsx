"use client";

import Link from "next/link";
import { useRef, useState, type ChangeEvent } from "react";
import { useDemo } from "@/components/demo-provider";
import { mediaTypes, type LibraryItem } from "@/lib/demo-library";

const MAX_FILE_BYTES = 1024 * 1024;
const MAX_ITEMS = 1000;
const DEMO_FORMAT = "ruang-synthetic-demo";
const sections = [
  { key: "overview", label: "Ringkasan", href: "/data" },
  { key: "import", label: "Inspeksi impor", href: "/data/import" },
  { key: "export", label: "Ekspor demo", href: "/data/export" },
  { key: "connections", label: "Koneksi", href: "/data/connections" },
  { key: "jobs", label: "Pekerjaan", href: "/data/jobs" },
] as const;

type DemoFile = {
  format: typeof DEMO_FORMAT;
  version: 1;
  synthetic: true;
  exportedAt: string;
  items: LibraryItem[];
  activityCount: number;
  settings: { solid: boolean; timeZone: string; language: string };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown, maxLength = 500): value is string {
  return typeof value === "string" && value.length <= maxLength;
}

function isNonnegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isItem(value: unknown): value is LibraryItem {
  if (!isRecord(value)) return false;
  return (
    isText(value.id, 200) &&
    value.id.length > 0 &&
    isText(value.title) &&
    value.title.trim().length > 0 &&
    isText(value.creator) &&
    isText(value.note, 10000) &&
    mediaTypes.some((type) => type !== "Semua" && type === value.type) &&
    typeof value.status === "string" &&
    ["Sedang dijalani", "Direncanakan", "Selesai"].includes(value.status) &&
    typeof value.unit === "string" &&
    ["chapter", "halaman", "episode", "sesi", "film"].includes(value.unit) &&
    typeof value.cover === "string" &&
    ["rain", "orbit", "forest", "city", "music", "guitar"].includes(
      value.cover,
    ) &&
    isNonnegative(value.progress) &&
    (value.total === null ||
      (isNonnegative(value.total) && value.progress <= value.total)) &&
    (value.rating === null ||
      (isNonnegative(value.rating) &&
        Number.isInteger(value.rating) &&
        value.rating <= 100)) &&
    typeof value.favorite === "boolean"
  );
}

function validateDemoFile(value: unknown): DemoFile {
  if (
    !isRecord(value) ||
    value.format !== DEMO_FORMAT ||
    value.version !== 1 ||
    value.synthetic !== true
  ) {
    throw new Error(
      "Format tidak didukung. Pilih JSON demo sintetis versi 1 dari halaman Ekspor demo, bukan cadangan aplikasi asli.",
    );
  }
  if (
    !isText(value.exportedAt, 100) ||
    !Number.isFinite(Date.parse(value.exportedAt))
  ) {
    throw new Error("Tanggal ekspor tidak valid.");
  }
  if (
    !Array.isArray(value.items) ||
    value.items.length > MAX_ITEMS ||
    !value.items.every(isItem)
  ) {
    throw new Error(
      `Daftar item tidak valid. Maksimal ${MAX_ITEMS} item dengan judul, kategori, progres, dan rating yang sesuai skema demo.`,
    );
  }
  if (new Set(value.items.map((item) => item.id)).size !== value.items.length) {
    throw new Error("ID item harus unik dalam file demo.");
  }
  if (
    !isNonnegative(value.activityCount) ||
    !Number.isSafeInteger(value.activityCount)
  ) {
    throw new Error("Jumlah aktivitas tidak valid.");
  }
  const settings = value.settings;
  if (
    !isRecord(settings) ||
    typeof settings.solid !== "boolean" ||
    !isText(settings.timeZone, 100) ||
    !settings.timeZone ||
    !isText(settings.language, 100) ||
    !settings.language
  ) {
    throw new Error("Preferensi demo tidak sesuai skema.");
  }
  try {
    new Intl.DateTimeFormat("id-ID", { timeZone: settings.timeZone });
  } catch {
    throw new Error("Zona waktu pada file demo tidak dikenali.");
  }
  return value as DemoFile;
}

function ImportPreview() {
  const [preview, setPreview] = useState<DemoFile | null>(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const request = useRef(0);

  async function inspect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const currentRequest = ++request.current;
    setPreview(null);
    setError("");
    setFileName(file?.name ?? "");
    setReading(false);
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setError(
        "File terlalu besar. Batas inspeksi adalah 1 MiB (1.048.576 byte).",
      );
      return;
    }
    setReading(true);
    try {
      const text = await file.text();
      if (currentRequest !== request.current) return;
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error(
          "JSON tidak dapat dibaca. Periksa sintaks file lalu pilih kembali.",
        );
      }
      setPreview(validateDemoFile(parsed));
    } catch (cause) {
      if (currentRequest === request.current) {
        setError(
          cause instanceof Error ? cause.message : "File tidak dapat dibaca.",
        );
      }
    } finally {
      if (currentRequest === request.current) setReading(false);
    }
  }

  return (
    <div className="page-stack">
      <section className="panel page-stack" aria-labelledby="inspect-title">
        <div className="section-header">
          <h2 id="inspect-title">Periksa file, tanpa memulihkan data</h2>
          <span className="mini-label">HANYA BACA</span>
        </div>
        <p>
          File dibaca di browser untuk menampilkan pratinjau. Tidak dikirim ke
          server, tidak digabungkan, dan tidak mengubah sesi demo.
        </p>
        <label className="field" htmlFor="demo-json-file">
          <span>File JSON demo sintetis</span>
          <input
            id="demo-json-file"
            type="file"
            accept=".json,application/json"
            onChange={inspect}
            aria-describedby="demo-file-help"
          />
        </label>
        <p id="demo-file-help">
          Batas 1 MiB dan {MAX_ITEMS} item. Hanya format{" "}
          <code>{DEMO_FORMAT}</code> versi 1 yang diperiksa. Cadangan native dan
          format layanan lain tidak didukung.
        </p>
        <div role="status" aria-live="polite">
          {reading
            ? "Membaca file secara lokal…"
            : preview
              ? `Skema valid: ${fileName}. Tidak ada data yang diimpor.`
              : "Belum ada file valid untuk ditampilkan."}
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="action-row">
          <button
            className="secondary-button"
            type="button"
            disabled
            aria-describedby="restore-unavailable"
          >
            Pulihkan data
          </button>
          <Link className="text-link" href="/data/export">
            Buat file demo yang sesuai
          </Link>
        </div>
        <p id="restore-unavailable">
          Pemulihan tidak tersedia: demo ini belum memiliki backend atau
          pemetaan format cadangan native.
        </p>
      </section>
      {preview && (
        <section className="panel page-stack" aria-labelledby="preview-title">
          <h2 id="preview-title">Pratinjau file</h2>
          <dl className="info-grid">
            <div>
              <dt>Item</dt>
              <dd>{preview.items.length}</dd>
            </div>
            <div>
              <dt>Jumlah aktivitas tercatat dalam file</dt>
              <dd>{preview.activityCount}</dd>
            </div>
            <div>
              <dt>Waktu ekspor</dt>
              <dd>{preview.exportedAt}</dd>
            </div>
            <div>
              <dt>Zona waktu</dt>
              <dd>{preview.settings.timeZone}</dd>
            </div>
          </dl>
          <p>
            Menampilkan hingga 10 item. Teks file diperlakukan sebagai teks,
            bukan HTML.
          </p>
          {preview.items.length ? (
            <ul>
              {preview.items.slice(0, 10).map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong> · {item.type} · {item.progress}
                  {item.total === null ? "" : ` / ${item.total}`} {item.unit}
                </li>
              ))}
            </ul>
          ) : (
            <p>File ini tidak memuat item.</p>
          )}
        </section>
      )}
    </div>
  );
}

function ExportDemo() {
  const { items, activities, settings } = useDemo();
  const [message, setMessage] = useState("");

  function download() {
    try {
      const payload: DemoFile = {
        format: DEMO_FORMAT,
        version: 1,
        synthetic: true,
        exportedAt: new Date().toISOString(),
        items,
        activityCount: activities.length,
        settings,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json;charset=utf-8",
      });
      if (blob.size > MAX_FILE_BYTES) {
        setMessage(
          "File demo melebihi batas inspeksi 1 MiB. Unduhan tidak dibuat.",
        );
        return;
      }
      validateDemoFile(payload);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "ruang-synthetic-demo-v1.json";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage(
        "Unduhan JSON demo diminta ke browser. Periksa daftar unduhan; ini bukan cadangan native.",
      );
    } catch {
      setMessage(
        "File demo tidak dapat dibuat. Periksa data sesi dan pengaturan unduhan browser.",
      );
    }
  }

  return (
    <section className="panel page-stack" aria-labelledby="export-title">
      <div className="section-header">
        <h2 id="export-title">Snapshot demo sintetis</h2>
        <span className="mini-label">JSON · VERSI 1</span>
      </div>
      <p>
        Unduh {items.length} item dari sesi demo ini, preferensi tampilan, dan
        jumlah aktivitas ({activities.length}). Catatan item ikut disertakan;
        periksa isinya sebelum membagikan file.
      </p>
      <p>
        <strong>Bukan cadangan arsip asli.</strong> Format ini hanya untuk
        mempelajari demo dan inspeksi lokal. Tidak kompatibel dengan impor
        native, tidak memuat jurnal atau koleksi, dan tidak menyertakan riwayat
        aktivitas lengkap.
      </p>
      <div className="action-row">
        <button className="primary-button" type="button" onClick={download}>
          Unduh JSON demo sintetis
        </button>
        <Link className="text-link" href="/data/import">
          Inspeksi file demo
        </Link>
      </div>
      <p role="status" aria-live="polite">
        {message}
      </p>
      <div className="action-row">
        <button
          className="secondary-button"
          type="button"
          disabled
          aria-describedby="native-export-reason"
        >
          Ekspor cadangan native
        </button>
      </div>
      <p id="native-export-reason">
        Tidak tersedia: backend dan format cadangan arsip asli belum terhubung.
      </p>
    </section>
  );
}

export function DataPage({ section = "overview" }: { section?: string }) {
  const { items, activities } = useDemo();
  const current = sections.find((entry) => entry.key === section);

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">
            <i className="tiny-pixel" />
            DATA &amp; PORTABILITAS
          </span>
          <h1>
            {current?.label ?? "Halaman data tidak tersedia"}
            <span className="heading-dot">.</span>
          </h1>
          <p>
            Kontrol yang jelas untuk sesi demo, tanpa mengklaim akses ke arsip
            pribadi.
          </p>
        </div>
        <Link className="secondary-button" href="/help">
          Bantuan
        </Link>
      </header>
      <nav className="action-row" aria-label="Navigasi data">
        {sections.map((entry) => (
          <Link
            key={entry.key}
            href={entry.href}
            className={
              section === entry.key ? "primary-button" : "secondary-button"
            }
            aria-current={section === entry.key ? "page" : undefined}
          >
            {entry.label}
          </Link>
        ))}
      </nav>
      <p className="demo-banner">
        <strong>Demo dalam memori.</strong> Tidak ada backend, sinkronisasi
        akun, atau proses latar belakang yang terhubung. Muat ulang halaman
        dapat mengembalikan data contoh.
      </p>
      {section === "overview" && (
        <>
          <section
            className="panel page-stack"
            aria-labelledby="data-scope-title"
          >
            <h2 id="data-scope-title">Apa yang tersedia sekarang</h2>
            <dl className="info-grid">
              <div>
                <dt>Item demo dalam sesi</dt>
                <dd>{items.length}</dd>
              </div>
              <div>
                <dt>Aktivitas sesi</dt>
                <dd>{activities.length}</dd>
              </div>
              <div>
                <dt>Koneksi backend</dt>
                <dd>Belum tersedia</dd>
              </div>
              <div>
                <dt>Pekerjaan latar belakang</dt>
                <dd>Tidak tersedia</dd>
              </div>
            </dl>
            <p>
              Perubahan hanya berlaku pada sesi demo di browser. Angka di atas
              bukan isi arsip pribadi atau hasil sinkronisasi.
            </p>
          </section>
          <div className="info-grid">
            <section className="panel page-stack">
              <h2>Inspeksi impor</h2>
              <p>
                Validasi file demo hingga 1 MiB dan lihat isinya tanpa mengubah
                data.
              </p>
              <Link className="text-link" href="/data/import">
                Buka inspeksi file
              </Link>
            </section>
            <section className="panel page-stack">
              <h2>Ekspor demo</h2>
              <p>
                Unduh JSON berlabel sintetis. Bukan file pemulihan atau cadangan
                native.
              </p>
              <Link className="text-link" href="/data/export">
                Lihat cakupan ekspor
              </Link>
            </section>
            <section className="panel page-stack">
              <h2>Koneksi</h2>
              <p>Tinjau kemampuan integrasi yang belum tersedia.</p>
              <Link className="text-link" href="/data/connections">
                Lihat status koneksi
              </Link>
            </section>
            <section className="panel page-stack">
              <h2>Pekerjaan</h2>
              <p>
                Tidak ada antrean impor, ekspor, atau sinkronisasi server dalam
                demo.
              </p>
              <Link className="text-link" href="/data/jobs">
                Lihat pekerjaan
              </Link>
            </section>
          </div>
        </>
      )}
      {section === "import" && <ImportPreview />}
      {section === "export" && <ExportDemo />}
      {section === "connections" && (
        <section
          className="panel page-stack"
          aria-labelledby="connections-title"
        >
          <div className="section-header">
            <h2 id="connections-title">Belum ada layanan terhubung</h2>
            <span className="mini-label">BACKEND TIDAK TERSEDIA</span>
          </div>
          <p>
            Demo ini tidak menjalankan login, OAuth, pengambilan arsip, atau
            sinkronisasi perangkat. Tidak ada token koneksi yang perlu
            dimasukkan.
          </p>
          <div className="info-grid">
            <div className="page-stack">
              <h3>Sinkronisasi akun</h3>
              <p>
                Memerlukan autentikasi dan penyimpanan server yang belum
                diimplementasikan.
              </p>
              <button
                className="secondary-button"
                type="button"
                disabled
                aria-label="Hubungkan akun: autentikasi dan backend belum tersedia"
              >
                Hubungkan akun
              </button>
            </div>
            <div className="page-stack">
              <h3>Sumber eksternal</h3>
              <p>
                Adapter layanan, izin akses, dan pemetaan data belum tersedia.
              </p>
              <button
                className="secondary-button"
                type="button"
                disabled
                aria-label="Sinkronkan: adapter layanan belum tersedia"
              >
                Sinkronkan
              </button>
            </div>
          </div>
          <div className="action-row">
            <Link className="text-link" href="/settings/privacy">
              Privasi demo
            </Link>
            <Link className="text-link" href="/help">
              Bantuan koneksi
            </Link>
          </div>
        </section>
      )}
      {section === "jobs" && (
        <section className="panel page-stack" aria-labelledby="jobs-title">
          <div className="section-header">
            <h2 id="jobs-title">Pekerjaan latar belakang</h2>
            <span className="mini-label">0 PEKERJAAN</span>
          </div>
          <div className="empty-state">
            <h3>Tidak ada pekerjaan</h3>
            <p>
              Backend dan antrean pekerjaan belum tersedia. Tidak ada
              sinkronisasi yang sedang berjalan atau riwayat pekerjaan server
              untuk ditampilkan.
            </p>
          </div>
          <p>
            Inspeksi file dan pembuatan JSON demo berjalan langsung di browser;
            keduanya tidak membuat pekerjaan server.
          </p>
          <div className="action-row">
            <button
              className="secondary-button"
              type="button"
              disabled
              aria-describedby="jobs-unavailable"
            >
              Jalankan sinkronisasi
            </button>
            <Link className="text-link" href="/help">
              Bantuan pekerjaan
            </Link>
          </div>
          <p id="jobs-unavailable">
            Tidak tersedia tanpa koneksi backend dan penjadwal pekerjaan.
          </p>
        </section>
      )}
      {!current && (
        <section className="panel page-stack">
          <h2>Bagian ini tidak ditemukan</h2>
          <p>Pilih halaman data dari navigasi di atas.</p>
        </section>
      )}
      <div className="action-row">
        {section !== "overview" && (
          <Link className="text-link" href="/data">
            Kembali ke ringkasan data
          </Link>
        )}
        <Link className="text-link" href="/library">
          Kembali ke pustaka
        </Link>
      </div>
    </div>
  );
}
