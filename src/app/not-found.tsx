import Link from "next/link";
export default function NotFound() {
  return (
    <section className="panel empty-state">
      <span className="section-kicker">ALAMAT TIDAK DIKENAL</span>
      <h1>Halaman ini tidak ditemukan.</h1>
      <p>
        Tautan navigasi aplikasi tersedia di peta halaman. URL yang tidak
        dikenal tidak dialihkan diam-diam.
      </p>
      <div className="action-row">
        <Link className="primary-button" href="/">
          Ke beranda
        </Link>
        <Link className="secondary-button" href="/more">
          Peta halaman
        </Link>
      </div>
    </section>
  );
}
