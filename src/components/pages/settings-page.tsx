"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDemo } from "@/components/demo-provider";
import { mediaTypes, type MediaType } from "@/lib/demo-library";

const categoryTemplates: Record<
  MediaType,
  { unit: string; example: string; tip: string }
> = {
  Manhwa: {
    unit: "chapter",
    example: "42,5 chapter · total belum diketahui",
    tip: "Catat chapter pecahan dan biarkan total kosong untuk seri yang masih terbit.",
  },
  Buku: {
    unit: "halaman",
    example: "75 dari 300 halaman",
    tip: "Gunakan jumlah halaman edisi yang sedang dibaca.",
  },
  Film: {
    unit: "film",
    example: "0 dari 1 film",
    tip: "Pisahkan progres menonton dari status selesai yang dipilih secara eksplisit.",
  },
  Anime: {
    unit: "episode",
    example: "6 dari 12 episode",
    tip: "Gunakan satu entri per musim bila jumlah episode berbeda.",
  },
  Musik: {
    unit: "sesi",
    example: "1 sesi · total belum diketahui",
    tip: "Satu sesi dapat mewakili satu kali mendengarkan; tentukan kebiasaan pencatatan sendiri.",
  },
  Hobi: {
    unit: "sesi",
    example: "8 sesi · total belum diketahui",
    tip: "Catat sesi latihan dan tulis konteksnya di catatan item.",
  },
};

const settingsSections = [
  { key: "overview", label: "Preferensi", href: "/settings" },
  { key: "categories", label: "Kategori", href: "/settings/categories" },
  { key: "privacy", label: "Privasi", href: "/settings/privacy" },
] as const;

function Preferences() {
  const { settings, setSettings, resetDemo } = useDemo();
  const [confirmReset, setConfirmReset] = useState(false);
  const [message, setMessage] = useState("");
  const resetTrigger = useRef<HTMLButtonElement>(null);
  const cancelReset = useRef<HTMLButtonElement>(null);
  const wasConfirmingReset = useRef(false);

  useEffect(() => {
    if (confirmReset) {
      cancelReset.current?.focus();
    } else if (wasConfirmingReset.current) {
      resetTrigger.current?.focus();
    }
    wasConfirmingReset.current = confirmReset;
  }, [confirmReset]);

  const timeZones = Array.from(
    new Set([
      settings.timeZone,
      "Asia/Jakarta",
      "Asia/Makassar",
      "Asia/Jayapura",
      "UTC",
    ]),
  );

  function resetSession() {
    resetDemo();
    setConfirmReset(false);
    setMessage(
      "Sesi demo dalam memori telah direset. Tidak ada arsip pribadi atau data server yang dihapus.",
    );
  }

  return (
    <>
      <section className="panel page-stack" aria-labelledby="appearance-title">
        <div className="section-header">
          <h2 id="appearance-title">Tampilan &amp; format</h2>
          <span className="mini-label">SESI INI</span>
        </div>
        <p>
          Preferensi berlaku untuk demo dalam memori. Tidak disimpan ke akun dan
          dapat kembali ke nilai awal saat halaman dimuat ulang.
        </p>
        <label className="toggle-row" htmlFor="solid-interface">
          <span>
            <strong>Kurangi transparansi</strong>
            <small>
              Gunakan latar solid untuk panel antarmuka yang mendukung
              transparansi.
            </small>
          </span>
          <input
            id="solid-interface"
            type="checkbox"
            checked={settings.solid}
            onChange={(event) => {
              setSettings({ ...settings, solid: event.target.checked });
              setMessage("Preferensi tampilan diperbarui untuk sesi demo ini.");
            }}
          />
        </label>
        <div className="info-grid">
          <label className="field" htmlFor="settings-time-zone">
            <span>Preferensi zona waktu</span>
            <select
              id="settings-time-zone"
              value={settings.timeZone}
              onChange={(event) => {
                setSettings({ ...settings, timeZone: event.target.value });
                setMessage(
                  "Preferensi zona waktu diperbarui untuk sesi demo ini.",
                );
              }}
              aria-describedby="timezone-help"
            >
              {timeZones.map((timeZone) => (
                <option key={timeZone} value={timeZone}>
                  {timeZone}
                </option>
              ))}
            </select>
            <small id="timezone-help">
              Preferensi format waktu demo; tidak mengubah waktu pada arsip atau
              layanan eksternal.
            </small>
          </label>
          <label className="field" htmlFor="settings-language">
            <span>Bahasa antarmuka</span>
            <select
              id="settings-language"
              value={settings.language}
              disabled
              aria-describedby="language-help"
            >
              <option value={settings.language}>
                {["id", "id-ID", "Indonesia", "Bahasa Indonesia"].includes(
                  settings.language,
                )
                  ? "Bahasa Indonesia"
                  : settings.language}
              </option>
            </select>
            <small id="language-help">
              Terjemahan tambahan belum tersedia. Antarmuka demo menggunakan
              Bahasa Indonesia.
            </small>
          </label>
        </div>
      </section>
      <div className="info-grid">
        <section className="panel page-stack">
          <h2>Template kategori</h2>
          <p>
            Lihat satuan progres dan contoh untuk tiap jenis media. Template
            hanya baca, bukan pengaturan skema arsip.
          </p>
          <Link className="text-link" href="/settings/categories">
            Lihat template kategori
          </Link>
        </section>
        <section className="panel page-stack">
          <h2>Privasi &amp; akses</h2>
          <p>
            Tidak ada login atau backend dalam demo. Pelajari apa yang terjadi
            pada sesi dan file yang diperiksa.
          </p>
          <Link className="text-link" href="/settings/privacy">
            Baca batasan privasi demo
          </Link>
        </section>
      </div>
      <section className="panel page-stack" aria-labelledby="reset-title">
        <h2 id="reset-title">Mulai ulang sesi demo</h2>
        <p>
          Reset mengembalikan data contoh dan preferensi sesi ini ke kondisi
          awal. Perubahan yang hanya ada dalam memori akan hilang. Tindakan ini
          tidak menghapus arsip pribadi, file unduhan, atau data server.
        </p>
        {confirmReset ? (
          <div className="page-stack">
            <p id="reset-confirmation">
              <strong>Reset sesi demo sekarang?</strong> Simpan snapshot demo
              terlebih dahulu bila ingin memeriksa perubahan sesi nanti. JSON
              demo bukan cadangan yang dapat dipulihkan.
            </p>
            <div className="action-row">
              <button
                className="primary-button"
                type="button"
                onClick={resetSession}
                aria-describedby="reset-confirmation"
              >
                Ya, reset sesi demo
              </button>
              <button
                ref={cancelReset}
                className="secondary-button"
                type="button"
                aria-describedby="reset-confirmation"
                onClick={() => setConfirmReset(false)}
              >
                Batal
              </button>
              <Link className="text-link" href="/data/export">
                Lihat ekspor demo
              </Link>
            </div>
          </div>
        ) : (
          <div className="action-row">
            <button
              ref={resetTrigger}
              className="secondary-button"
              type="button"
              onClick={() => {
                setConfirmReset(true);
                setMessage("");
              }}
            >
              Reset sesi demo…
            </button>
          </div>
        )}
      </section>
      <p role="status" aria-live="polite">
        {message}
      </p>
    </>
  );
}

function Categories() {
  return (
    <>
      <section className="panel page-stack" aria-labelledby="category-title">
        <div className="section-header">
          <h2 id="category-title">Enam template, satu pustaka</h2>
          <span className="mini-label">HANYA BACA</span>
        </div>
        <p>
          Kategori di bawah berasal dari jenis media demo. “Semua” adalah filter
          pustaka, bukan kategori item. Template membantu memilih satuan
          progres; tidak membuat atau mengubah kategori arsip asli.
        </p>
      </section>
      <div className="info-grid">
        {mediaTypes
          .filter((type): type is MediaType => type !== "Semua")
          .map((type) => {
            const template = categoryTemplates[type];
            return (
              <section
                className="panel page-stack"
                key={type}
                aria-labelledby={`category-${type}`}
              >
                <div className="section-header">
                  <h2 id={`category-${type}`}>{type}</h2>
                  <span className="mini-label">{template.unit}</span>
                </div>
                <p>{template.tip}</p>
                <p>
                  <strong>Contoh:</strong> {template.example}
                </p>
              </section>
            );
          })}
      </div>
      <section className="panel page-stack">
        <h2>Aturan pencatatan demo</h2>
        <ul>
          <li>Total yang belum diketahui tetap kosong, bukan dianggap nol.</li>
          <li>Progres dan status konsumsi dicatat terpisah.</li>
          <li>Rating nol berbeda dari belum dinilai.</li>
        </ul>
        <p id="category-edit-reason">
          Editor kategori dan satuan khusus belum diimplementasikan. Template
          ini tidak dapat diedit.
        </p>
        <div className="action-row">
          <button
            className="secondary-button"
            type="button"
            disabled
            aria-describedby="category-edit-reason"
          >
            Ubah template kategori
          </button>
          <Link className="text-link" href="/library/new">
            Tambahkan item demo
          </Link>
        </div>
      </section>
    </>
  );
}

function Privacy() {
  return (
    <>
      <section className="panel page-stack" aria-labelledby="privacy-title">
        <div className="section-header">
          <h2 id="privacy-title">Demo, bukan akun pribadi</h2>
          <span className="mini-label">TANPA LOGIN</span>
        </div>
        <p>
          Antarmuka ini menggunakan data contoh sintetis. Tidak ada autentikasi,
          backend arsip, penyimpanan akun, atau sinkronisasi perangkat yang
          terhubung. Identitas contoh di antarmuka bukan bukti bahwa seseorang
          telah masuk.
        </p>
        <p>
          Jangan masukkan kata sandi, token layanan, atau informasi sensitif.
          Demo tidak menyediakan kontrol akses atau jaminan penyimpanan untuk
          arsip pribadi.
        </p>
      </section>
      <div className="info-grid">
        <section className="panel page-stack">
          <h2>Data sesi</h2>
          <p>
            Perubahan item dan preferensi berada dalam memori sesi antarmuka.
            Muat ulang dapat mengembalikan data contoh. Reset sesi hanya
            mengembalikan keadaan demo; bukan penghapusan akun atau arsip.
          </p>
        </section>
        <section className="panel page-stack">
          <h2>File yang diperiksa</h2>
          <p>
            Inspeksi JSON membaca file pilihan di browser, memvalidasi skema
            demo, dan menampilkan pratinjau hanya baca. Alur ini tidak
            mengunggah file ke backend atau memulihkan isinya.
          </p>
          <Link className="text-link" href="/data/import">
            Buka inspeksi lokal
          </Link>
        </section>
        <section className="panel page-stack">
          <h2>File yang diunduh</h2>
          <p>
            JSON demo dapat memuat teks catatan yang dimasukkan dalam sesi.
            Periksa sebelum membagikan. File unduhan tetap berada di lokasi
            unduhan browser sampai dihapus sendiri; reset sesi tidak
            menghapusnya.
          </p>
          <Link className="text-link" href="/data/export">
            Lihat cakupan ekspor
          </Link>
        </section>
        <section className="panel page-stack">
          <h2>Batasan situs</h2>
          <p>
            Tidak adanya backend arsip bukan jaminan bahwa hosting tidak
            mencatat permintaan web. Halaman ini tidak menyediakan audit log
            hosting, pengaturan analitik, atau kebijakan layanan eksternal.
          </p>
        </section>
      </div>
      <section className="panel page-stack">
        <h2>Kontrol akun belum tersedia</h2>
        <p id="account-unavailable">
          Tidak ada akun yang dapat dikelola dalam demo. Login, ekspor data
          akun, dan penghapusan akun memerlukan layanan autentikasi dan backend
          yang belum tersedia.
        </p>
        <div className="action-row">
          <button
            className="secondary-button"
            type="button"
            disabled
            aria-describedby="account-unavailable"
          >
            Kelola akun
          </button>
          <Link className="text-link" href="/data/connections">
            Status koneksi
          </Link>
          <Link className="text-link" href="/help">
            Bantuan privasi
          </Link>
        </div>
      </section>
    </>
  );
}

export function SettingsPage({ section = "overview" }: { section?: string }) {
  const current = settingsSections.find((entry) => entry.key === section);

  return (
    <div className="page-stack">
      <header className="page-heading">
        <div>
          <span className="eyebrow">
            <i className="tiny-pixel" />
            RUANG SESUAI KEBIASAANMU
          </span>
          <h1>
            {section === "overview"
              ? "Pengaturan"
              : (current?.label ?? "Pengaturan tidak ditemukan")}
            <span className="heading-dot">.</span>
          </h1>
          <p>
            Preferensi demo yang transparan tentang apa yang disimpan dan apa
            yang belum tersedia.
          </p>
        </div>
        <Link className="secondary-button" href="/help">
          Bantuan
        </Link>
      </header>
      <nav className="action-row" aria-label="Navigasi pengaturan">
        {settingsSections.map((entry) => (
          <Link
            key={entry.key}
            href={entry.href}
            className={
              entry.key === section ? "primary-button" : "secondary-button"
            }
            aria-current={entry.key === section ? "page" : undefined}
          >
            {entry.label}
          </Link>
        ))}
      </nav>
      {section === "overview" && <Preferences />}
      {section === "categories" && <Categories />}
      {section === "privacy" && <Privacy />}
      {!current && (
        <section className="panel page-stack">
          <h2>Bagian pengaturan ini tidak tersedia</h2>
          <p>
            Gunakan navigasi di atas untuk membuka preferensi, kategori, atau
            informasi privasi.
          </p>
        </section>
      )}
      <div className="action-row">
        {section !== "overview" && (
          <Link className="text-link" href="/settings">
            Kembali ke pengaturan
          </Link>
        )}
        <Link className="text-link" href="/library">
          Kembali ke pustaka
        </Link>
      </div>
    </div>
  );
}
