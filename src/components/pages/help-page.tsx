import Link from "next/link";
import { ArrowRight } from "lucide-react";

const destinations = [
  ["/", "Beranda", "Lanjutkan cerita dan lihat ringkasan."],
  ["/library", "Library", "Cari, filter, dan buka item lintas kategori."],
  ["/library/new", "Tambah item", "Input judul, kategori, progres dan kesan."],
  ["/favorites", "Favorit", "Item yang diberi tanda favorit."],
  ["/activity", "Aktivitas", "Riwayat perubahan sesi ini."],
  ["/journal", "Jurnal", "Catatan demo umum atau terkait item."],
  ["/collections", "Koleksi", "Buat kelompok dan atur anggotanya."],
  ["/statistics", "Statistik", "Ringkasan status, tipe dan rating."],
  ["/data", "Pusat data", "Pratinjau data, transfer dan koneksi."],
  ["/settings", "Pengaturan", "Tampilan, zona waktu dan privasi."],
  ["/help", "Bantuan", "Panduan dan batas prototipe."],
];
export function MorePage() {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="section-kicker">SELURUH RUANG</span>
          <h1>Ke mana berikutnya?</h1>
          <p>Semua bagian dapat diakses melalui URL langsung.</p>
        </div>
      </div>
      <div className="info-grid">
        {destinations.map(([href, title, description]) => (
          <Link href={href} className="panel destination-card" key={href}>
            <h2>{title}</h2>
            <p>{description}</p>
            <span>
              Buka halaman <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function HelpPage() {
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="section-kicker">PANDUAN FOLIO</span>
          <h1>Ruang kecil, alur yang jelas.</h1>
          <p>
            Prototipe UI dengan halaman nyata. Belum merupakan arsip privat siap
            pakai.
          </p>
        </div>
      </div>
      <section className="panel prose-section">
        <h2>Mulai dari satu cerita</h2>
        <ol>
          <li>
            <Link className="text-link" href="/library/new">
              Tambahkan item
            </Link>{" "}
            dengan judul dan kategori.
          </li>
          <li>
            Buka detail dari{" "}
            <Link className="text-link" href="/library">
              library
            </Link>
            , lalu edit rating, status, progres atau kesan.
          </li>
          <li>
            Kelompokkan di{" "}
            <Link className="text-link" href="/collections">
              koleksi
            </Link>{" "}
            dan tulis{" "}
            <Link className="text-link" href="/journal">
              jurnal demo
            </Link>
            .
          </li>
          <li>
            Lihat{" "}
            <Link className="text-link" href="/activity">
              aktivitas
            </Link>{" "}
            dan{" "}
            <Link className="text-link" href="/statistics">
              statistik
            </Link>{" "}
            sesi.
          </li>
        </ol>
      </section>
      <section className="panel prose-section">
        <h2>Apa yang benar-benar tersedia?</h2>
        <p>
          Navigasi menggunakan halaman Next.js, mendukung URL langsung dan
          tombol kembali browser. Data dibagi antarhalaman dalam memori tab.
          Refresh mereset perubahan, termasuk item dan koleksi baru.
        </p>
        <p>
          Belum ada autentikasi GitHub, database, backup native, restore
          produksi, atau koneksi platform. Halaman fitur tersebut menjelaskan
          statusnya, bukan mengaku berhasil menyimpan atau menyinkronkan.
        </p>
        <p>
          Jangan masukkan data sensitif. Pengaturan privasi dan halaman pusat
          data bukan pengganti autentikasi server.
        </p>
        <Link className="secondary-button" href="/settings/privacy">
          Baca status privasi
        </Link>
      </section>
      <section className="panel">
        <h2>Peta halaman</h2>
        <div className="link-list">
          {destinations
            .filter(([href]) => href !== "/help")
            .map(([href, title]) => (
              <Link className="text-link" href={href} key={href}>
                {title}
                <ArrowRight size={14} />
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
