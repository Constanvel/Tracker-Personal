"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  BookOpen,
  Clock3,
  Film,
  Grid2X2,
  Headphones,
  Heart,
  Layers3,
  List,
  Plus,
  Search,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { ProgressActions } from "@/components/progress-actions";
import {
  filterLibrary,
  formatProgress,
  mediaTypes,
  type LibraryItem,
} from "@/lib/demo-library";

const categoryIcons = [
  Layers3,
  BookOpen,
  BookOpen,
  Film,
  Sparkles,
  Headphones,
  Sprout,
];

function Cover({ item }: { item: LibraryItem }) {
  return (
    <div className="cover">
      <Image
        src={`/covers/${item.cover}.svg`}
        alt=""
        fill
        sizes="(max-width: 600px) 45vw, 220px"
      />
      <span className="cover-type">{item.type}</span>
    </div>
  );
}

function activityTime(at: string, timeZone: string) {
  const date = new Date(at);
  return Number.isNaN(date.getTime())
    ? "Sesi ini"
    : date.toLocaleString("id-ID", {
        timeZone,
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export function Tracker({
  mode = "home",
}: {
  mode?: "home" | "library" | "favorites";
}) {
  const { items, activities, settings, updateItem, journals } = useDemo();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const search = useRef<HTMLInputElement>(null);
  const query = params.get("q") ?? "";
  const category =
    mediaTypes.find((type) => type === params.get("type")) ?? "Semua";
  const alphabetical = params.get("sort") === "title";
  const listView = params.get("view") === "list";
  const home = mode === "home";
  const searching = query.trim().length > 0;
  const activeOnly = params.get("status") === "active";
  const active = items.filter((item) => item.status === "Sedang dijalani");

  function setFilters(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const suffix = next.toString();
    router.replace(`${pathname}${suffix ? `?${suffix}` : ""}`, {
      scroll: false,
    });
  }

  // Dashboard searches include the entire library, not only the four active cards.
  let filtered = filterLibrary(
    home && !searching ? active : items,
    query,
    category,
    mode === "favorites",
  );
  if (activeOnly) filtered = filtered.filter((item) => item.status === "Sedang dijalani");
  if (alphabetical)
    filtered = [...filtered].sort((a, b) =>
      a.title.localeCompare(b.title, "id"),
    );
  const displayed = home && !searching ? filtered.slice(0, 4) : filtered;

  return (
    <div className={`tracker ${home ? "tracker-home" : ""}`}>
      <div className="page-heading">
        <div>
          <span className="section-kicker editorial-kicker">{home ? "SEBUAH ARSIP PRIBADI" : mode === "favorites" ? "YANG PUNYA TEMPAT TERSENDIRI" : "RAK CERITA & HAL-HAL BAIK"}</span>
          <h1>
            {home ? (
              <>
                Cerita belum <em>selesai</em><span className="heading-dot">.</span>
              </>
            ) : mode === "favorites" ? (
              "Yang selalu berkesan."
            ) : (
              "Semua cerita Anda."
            )}
          </h1>
          <p>
            {home
              ? "Bacaan, tontonan, dan hal-hal yang Anda nikmati. Satu ruang untuk semuanya."
              : "Ruang tenang untuk menikmati, mencatat, dan kembali lagi."}
          </p>
        </div>
        <Link className="primary-button" href="/library/new">
          <Plus size={18} /> Tambah item
        </Link>
      </div>

      {home && (
        <div className="stats-row tracker-summary">
          {[
            {
              label: "Dalam library",
              value: items.length,
              icon: Layers3,
              note: "cerita untuk dinikmati",
              href: "/library",
            },
            {
              label: "Sedang dijalani",
              value: active.length,
              icon: BookOpen,
              note: "selangkah demi selangkah",
              href: "/library?status=active",
            },
            {
              label: "Favorit",
              value: items.filter((item) => item.favorite).length,
              icon: Heart,
              note: "punya tempat tersendiri",
              href: "/favorites",
            },
          ].map(({ label, value, icon: Icon, note, href }) => (
            <Link className="stat" href={href} key={label}>
              <div className="stat-top">
                <span>{label}</span>
                <Icon size={17} />
              </div>
              <div className="stat-bottom">
                <strong>{String(value).padStart(2, "0")}</strong>
                <span>{note}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {home && (
        <section className="editorial-intro" aria-label="Tentang ruang ini">
          <span className="editorial-index" aria-hidden="true">F / 01</span>
          <p>Simpan tempat Anda berhenti.<br /><span>Kembali saat ingin melanjutkan.</span></p>
          <Link className="text-link" href="/journal">Tulis yang berkesan <ArrowRight size={16} aria-hidden="true" /></Link>
        </section>
      )}
      <div className="content-columns">
        <section className="library-section" aria-labelledby="library-heading">
          <div className="section-heading">
            <div>
              <h2 id="library-heading">
                {searching
                  ? "Hasil pencarian"
                  : mode === "favorites"
                    ? "Pilihan hati"
                    : home
                      ? "Kembali ke cerita Anda"
                      : "Library Anda"}
              </h2>
            </div>
            {home && (
              <Link className="text-button" href="/library">
                Lihat semua <ArrowRight size={15} />
              </Link>
            )}
          </div>

          <div className="library-tools">
            <label className="search-box">
              <Search size={17} />
              <input
                ref={search}
                value={query}
                onChange={(event) => {
                  setFilters({ q: event.target.value });
                }}
                placeholder={
                  mode === "favorites"
                    ? "Cari dalam favorit..."
                    : "Cari di seluruh library..."
                }
                aria-label="Cari judul, kreator, atau catatan"
              />
              {query && (
                <button
                  type="button"
                  className="clear-search"
                  aria-label="Hapus pencarian"
                  onClick={() => {
                    setFilters({ q: null });
                    search.current?.focus();
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </label>
            <div className="view-controls">
              <button
                type="button"
                className={`icon-button ${alphabetical ? "selected" : ""}`}
                aria-label="Urutkan berdasarkan judul"
                aria-pressed={alphabetical}
                onClick={() =>
                  setFilters({ sort: alphabetical ? null : "title" })
                }
              >
                <ArrowDownUp size={17} />
              </button>
              <span />
              <button
                type="button"
                className={`icon-button ${!listView ? "selected" : ""}`}
                aria-label="Tampilan grid"
                aria-pressed={!listView}
                onClick={() => setFilters({ view: null })}
              >
                <Grid2X2 size={17} />
              </button>
              <button
                type="button"
                className={`icon-button ${listView ? "selected" : ""}`}
                aria-label="Tampilan daftar"
                aria-pressed={listView}
                onClick={() => setFilters({ view: "list" })}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="categories" aria-label="Filter kategori">
            {mediaTypes.map((type, index) => {
              const Icon = categoryIcons[index];
              return (
                <button
                  type="button"
                  key={type}
                  className={category === type ? "chosen" : ""}
                  aria-pressed={category === type}
                  onClick={() =>
                    setFilters({ type: type === "Semua" ? null : type })
                  }
                >
                  <Icon size={14} />
                  {type}
                </button>
              );
            })}
          </div>
          <div className="results-meta" aria-live="polite">
            <span>
              {displayed.length} item{" "}
              {searching
                ? "ditemukan"
                : home
                  ? "untuk dilanjutkan"
                  : "dalam ruang Anda"}
            </span>
            {activeOnly ? (
              <button type="button" className="text-button" onClick={() => setFilters({ status: null })}>
                Sedang dijalani · Hapus filter <X size={14} aria-hidden="true" />
              </button>
            ) : <span>Sesi demo</span>}
          </div>

          {displayed.length ? (
            <div className={`media-grid ${listView ? "list-view" : ""}`}>
              {displayed.map((item) => {
                return (
                  <article className="media-card" key={item.id}>
                    <Link
                      className="card-open"
                      href={`/library/${item.id}`}
                      aria-label={`Buka ${item.title}`}
                    >
                      <Cover item={item} />
                      <div className="card-info">
                        <div className="card-status">
                          <span
                            className={
                              item.status === "Sedang dijalani"
                                ? "status-dot"
                                : "status-dot muted-dot"
                            }
                          />
                          {item.status}
                        </div>
                        <h3>{item.title}</h3>
                        <p>{item.creator}</p>
                      </div>
                    </Link>
                    <div className="card-footer">
                      <div>
                        <span>
                          {formatProgress(item.progress)}
                          {item.total !== null
                            ? ` / ${formatProgress(item.total)}`
                            : ""}
                        </span>
                        <small>{item.unit}</small>
                      </div>
                      <button
                        type="button"
                        className={`icon-button ${item.favorite ? "is-favorite" : ""}`}
                        aria-label={`${item.favorite ? "Hapus dari" : "Tambahkan ke"} favorit: ${item.title}`}
                        aria-pressed={item.favorite}
                        onClick={() =>
                          updateItem({ ...item, favorite: !item.favorite })
                        }
                      >
                        <Heart
                          size={16}
                          fill={item.favorite ? "currentColor" : "none"}
                        />
                      </button>
                      <ProgressActions item={item} />
                    </div>
                    {item.total !== null && item.total > 0 && (
                      <div
                        className="progress-track"
                        role="progressbar"
                        aria-label={`Progres ${item.title}`}
                        aria-valuenow={item.progress}
                        aria-valuemin={0}
                        aria-valuemax={item.total}
                      >
                        <span
                          style={{
                            width: `${item.total > 0 ? Math.min(100, (item.progress / item.total) * 100) : 0}%`,
                          }}
                        />
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state panel">
              <Search size={30} />
              <h3>Belum ada cerita di sini.</h3>
              <p>
                {home && !searching
                  ? "Mulai sebuah cerita dari library atau tambahkan item baru."
                  : "Coba kata lain atau pilih kategori berbeda."}
              </p>
              {query || category !== "Semua" || activeOnly ? (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setFilters({ q: null, type: null, status: null })}
                >
                  Reset filter
                </button>
              ) : (
                <Link
                  className="secondary-button"
                  href={home ? "/library" : "/library/new"}
                >
                  {home ? "Buka library" : "Tambah item"}
                </Link>
              )}
            </div>
          )}
        </section>

        {home && (
          <aside className="right-column">
            <section className="panel pixel-calendar">
              <div className="section-heading">
                <h2>Ritme kecil</h2>
                <span className="mini-label">SINTETIS</span>
              </div>
              <p>Setiap cerita punya waktunya sendiri.</p>
              <div className="month-label">
                <span>13 MINGGU</span>
                <span>ILUSTRASI</span>
              </div>
              <div className="heatmap" aria-hidden="true">
                {Array.from({ length: 91 }, (_, index) => (
                  <i
                    key={index}
                    className={`heat-${(index * 7 + Math.floor(index / 5)) % 5}`}
                  />
                ))}
              </div>
              <div className="heatmap-legend">
                <span>Lebih sedikit</span>
                <i />
                <i />
                <i />
                <i />
                <span>Lebih banyak</span>
              </div>
              <p className="heatmap-summary">
                Ilustrasi sintetis 13 minggu, bukan tanggal atau riwayat
                aktivitas Anda.
              </p>
              <Link className="text-button" href="/statistics">
                Lihat statistik sesi <ArrowRight size={14} />
              </Link>
            </section>
            <section className="panel recent-panel">
              <div className="section-heading">
                <h2>Jejak terakhir</h2>
                <Clock3 size={16} />
              </div>
              <span className="mini-label">SESI INI</span>
              {activities.length ? (
                activities.slice(0, 3).map((activity) => (
                  <Link
                    className="activity-entry"
                    href={
                      activity.itemId
                        ? `/library/${activity.itemId}`
                        : "/activity"
                    }
                    key={activity.id}
                  >
                    <span className="activity-dot" />
                    <div>
                      <strong>{activity.text}</strong>
                      <small>
                        <time dateTime={activity.at}>
                          {activityTime(activity.at, settings.timeZone)}
                        </time>
                      </small>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="heatmap-summary">
                  Belum ada aktivitas sesi. Perbarui progres atau tandai favorit
                  untuk membuat jejak baru.
                </p>
              )}
              <Link className="text-button" href="/activity">
                Riwayat sesi <ArrowRight size={14} />
              </Link>
            </section>
            <section className="editorial-journal-teaser" aria-labelledby="journal-teaser-heading">
              <span className="section-kicker">DI ANTARA CERITA</span>
              <h2 id="journal-teaser-heading">Ada yang ingin<br /><em>Anda ingat?</em></h2>
              <p>{journals.length ? `${journals.length} catatan tersimpan di sesi ini. Kembali ke hal-hal yang berkesan.` : "Sebuah kalimat, kesan pertama, atau hal kecil yang tinggal lebih lama."}</p>
              <Link className="text-link" href="/journal">Buka jurnal <ArrowRight size={15} aria-hidden="true" /></Link>
            </section>
          </aside>
        )}
      </div>
    </div>
  );
}
