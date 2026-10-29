"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="panel empty-state">
      <h1>Halaman belum bisa ditampilkan.</h1>
      <p>
        Coba muat ulang bagian ini. Data demo tidak disimpan permanen; refresh
        penuh mereset sesi.
      </p>
      <div className="action-row">
        <button className="primary-button" onClick={reset}>
          Coba lagi
        </button>
        <Link className="secondary-button" href="/">
          Ke beranda
        </Link>
      </div>
    </section>
  );
}
