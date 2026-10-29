"use client";

import Image from "next/image";
import { useRef, useState, useEffect, type FormEvent } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Film,
  Grid2X2,
  Headphones,
  Heart,
  House,
  Layers3,
  List,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import {
  advanceProgress,
  filterLibrary,
  formatRating,
  initialLibrary,
  mediaTypes,
  type LibraryItem,
  type MediaType,
} from "@/lib/demo-library";

const navigation = [
  { label: "Beranda", icon: House },
  { label: "Library", icon: Layers3 },
  { label: "Favorit", icon: Heart },
  { label: "Aktivitas", icon: Clock3 },
] as const;
type View = (typeof navigation)[number]["label"] | "Pengaturan";
const categoryIcons = [
  Layers3,
  BookOpen,
  BookOpen,
  Film,
  Sparkles,
  Headphones,
  Sprout,
];

function PixelMark({ small = false }: { small?: boolean }) {
  return (
    <span aria-hidden="true" className={`pixel-mark ${small ? "small" : ""}`}>
      {[1, 1, 0, 1, 0, 1, 1, 1, 0].map((on, i) => (
        <i key={i} className={on ? "on" : ""} />
      ))}
    </span>
  );
}

function Cover({
  item,
  className = "",
}: {
  item: LibraryItem;
  className?: string;
}) {
  return (
    <div className={`cover ${className}`}>
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

export function Tracker() {
  const [items, setItems] = useState(initialLibrary);
  const [view, setView] = useState<View>("Beranda");
  const [category, setCategory] = useState<string>("Semua");
  const [query, setQuery] = useState("");
  const [listView, setListView] = useState(false);
  const [sort, setSort] = useState(false);
  const [solid, setSolid] = useState(false);
  const [selected, setSelected] = useState<LibraryItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");
  const [activities, setActivities] = useState<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const active = items.filter((item) => item.status === "Sedang dijalani");
  let filtered = filterLibrary(items, query, category, view === "Favorit");
  if (sort)
    filtered = [...filtered].sort((a, b) =>
      a.title.localeCompare(b.title, "id"),
    );

  useEffect(() => {
    if (selected || adding) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selected, adding]);

  function closeDialog() {
    setSelected(null);
    setAdding(false);
  }
  function announce(message: string) {
    setNotice(message);
  }
  function update(item: LibraryItem) {
    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? item : entry)),
    );
    setSelected(item);
  }
  function increment(item: LibraryItem) {
    const next = advanceProgress(item);
    if (next.progress === item.progress) {
      announce(
        "Progres sudah mencapai total. Status tetap perlu diubah secara manual.",
      );
      return;
    }
    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? next : entry)),
    );
    setActivities((current) => [
      `${item.title} · ${next.progress} ${item.unit}`,
      ...current,
    ]);
    announce(
      `Progres ${item.title}: ${next.progress} ${item.unit}. Hanya tersimpan dalam sesi demo.`,
    );
  }
  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    if (!title) return;
    const type = String(data.get("type")) as MediaType;
    const unit =
      type === "Manhwa"
        ? "chapter"
        : type === "Buku"
          ? "halaman"
          : type === "Anime"
            ? "episode"
            : type === "Film"
              ? "film"
              : "sesi";
    const item: LibraryItem = {
      id: crypto.randomUUID(),
      title,
      type,
      creator: String(data.get("creator") ?? "").trim() || "Ditambahkan manual",
      status: "Direncanakan",
      progress: 0,
      total: null,
      unit,
      rating: null,
      favorite: false,
      cover: type === "Film" ? "orbit" : type === "Hobi" ? "guitar" : "forest",
      note: "",
    };
    setItems((current) => [item, ...current]);
    setActivities((current) => [`Ditambahkan · ${item.title}`, ...current]);
    closeDialog();
    setView("Library");
    setCategory("Semua");
    setQuery("");
    announce(
      `${title} ditambahkan ke sesi demo. Refresh akan menghapus perubahan.`,
    );
  }

  return (
    <div className={`app ${solid ? "reduce-transparency" : ""}`}>
      <a className="skip-link" href="#main">
        Lewati navigasi
      </a>
      <aside className="sidebar glass">
        <a className="brand" href="#main" onClick={() => setView("Beranda")}>
          <PixelMark />
          <span>
            folio<span className="brand-dot">.</span>
          </span>
        </a>
        <div className="workspace-label">RUANG PRIBADI</div>
        <nav aria-label="Navigasi utama">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${view === label ? "active" : ""}`}
              aria-current={view === label ? "page" : undefined}
              onClick={() => {
                setView(label);
                setQuery("");
                setCategory("Semua");
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "Library" && (
                <span className="nav-count">{items.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-divider" />
        <div className="workspace-label">KOLEKSI PILIHAN</div>
        <button
          className="collection-link"
          onClick={() => {
            setView("Library");
            setCategory("Buku");
          }}
        >
          <span className="collection-square" />
          Bacaan pelan-pelan<span>01</span>
        </button>
        <button
          className="collection-link"
          onClick={() => {
            setView("Library");
            setCategory("Film");
          }}
        >
          <span className="collection-square dim" />
          Akhir pekan<span>01</span>
        </button>
        <div className="sidebar-bottom">
          <div className="quiet-card">
            <PixelMark small />
            <p>
              Sedikit demi sedikit,
              <br />
              cerita jadi kenangan.
            </p>
            <span>TAKE YOUR TIME.</span>
          </div>
          <button
            className={`nav-item ${view === "Pengaturan" ? "active" : ""}`}
            onClick={() => setView("Pengaturan")}
          >
            <Settings2 size={19} />
            Pengaturan
          </button>
          <div className="profile">
            <span className="avatar">R</span>
            <div>
              <strong>Rainer</strong>
              <span>Profil contoh · bukan login</span>
            </div>
            <ShieldCheck size={16} />
          </div>
        </div>
      </aside>

      <div className="page-shell">
        <header className="topbar glass">
          <div className="breadcrumb">
            Ruang pribadi <ChevronRight size={14} />
            <span>{view}</span>
          </div>
          <div className="topbar-right">
            <span className="demo-chip">
              <i />
              Mode demo
            </span>
            <button
              className="icon-button"
              aria-label="Tentang prototipe"
              onClick={() =>
                announce(
                  "Folio adalah prototipe antarmuka. Tidak ada login, database, backup, atau sinkronisasi. Jangan masukkan data sensitif.",
                )
              }
            >
              <CircleHelp size={19} />
            </button>
            <span className="avatar small-avatar">R</span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="tiny-pixel" /> YOUR LITTLE UNIVERSE
              </div>
              <h1>
                {view === "Beranda" ? (
                  <>
                    Cerita belum selesai<span className="heading-dot">.</span>
                  </>
                ) : view === "Library" ? (
                  "Semua cerita Anda."
                ) : view === "Favorit" ? (
                  "Yang selalu berkesan."
                ) : view === "Aktivitas" ? (
                  "Jejak kecil Anda."
                ) : (
                  "Buat terasa seperti rumah."
                )}
              </h1>
              <p>
                {view === "Beranda"
                  ? "Bacaan, tontonan, dan hal-hal yang Anda nikmati. Satu ruang untuk semuanya."
                  : "Ruang tenang untuk menikmati, mencatat, dan kembali lagi."}
              </p>
            </div>
            <button className="primary-button" onClick={() => setAdding(true)}>
              <Plus size={18} />
              Tambah item
            </button>
          </div>
          <div className="demo-banner">
            <ShieldCheck size={16} />
            <span>
              <strong>Pratinjau desain.</strong> Data contoh, perubahan hilang
              saat refresh. Belum ada login atau penyimpanan privat.
            </span>
          </div>

          {view === "Pengaturan" ? (
            <section className="panel settings-panel">
              <h2>Tampilan & kenyamanan</h2>
              <p>
                Tema arang dan abu-abu. Pengaturan ini hanya berlaku selama tab
                terbuka.
              </p>
              <label className="toggle-row">
                <span>
                  <strong>Kurangi transparansi</strong>
                  <small>Gunakan permukaan solid tanpa efek blur.</small>
                </span>
                <input
                  type="checkbox"
                  checked={solid}
                  onChange={(event) => setSolid(event.target.checked)}
                />
              </label>
              <div className="settings-note">
                <ShieldCheck size={20} />
                <p>
                  Ini bukan arsip privat. Autentikasi GitHub pemilik, database,
                  ekspor, dan sinkronisasi masih dalam backlog.
                </p>
              </div>
              <a
                className="text-link"
                href="https://www.figma.com/design/hnquRBsbBdU45OeSe7CeTG"
                target="_blank"
                rel="noreferrer"
              >
                Lihat desain Figma <ArrowRight size={16} />
              </a>
            </section>
          ) : view === "Aktivitas" ? (
            <section className="panel activity-page">
              <h2>Aktivitas sesi ini</h2>
              <p>
                Tidak ada aktivitas pribadi yang dimuat. Riwayat ini direset
                saat refresh.
              </p>
              {activities.length ? (
                activities.map((activity, i) => (
                  <div className="activity-entry" key={`${activity}-${i}`}>
                    <span className="activity-dot" />
                    <div>
                      <strong>{activity}</strong>
                      <small>Sesi demo saat ini</small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <Clock3 size={32} />
                  <h3>Belum ada jejak baru.</h3>
                  <p>Tambahkan item atau perbarui progres untuk mencoba.</p>
                  <button
                    className="secondary-button"
                    onClick={() => setView("Beranda")}
                  >
                    Kembali ke beranda
                  </button>
                </div>
              )}
            </section>
          ) : (
            <>
              {view === "Beranda" && (
                <div className="stats-row">
                  {[
                    {
                      label: "Dalam library",
                      value: items.length.toString().padStart(2, "0"),
                      icon: Layers3,
                      note: "cerita untuk dinikmati",
                    },
                    {
                      label: "Sedang dijalani",
                      value: active.length.toString().padStart(2, "0"),
                      icon: BookOpen,
                      note: "selangkah demi selangkah",
                    },
                    {
                      label: "Favorit",
                      value: items
                        .filter((item) => item.favorite)
                        .length.toString()
                        .padStart(2, "0"),
                      icon: Heart,
                      note: "punya tempat tersendiri",
                    },
                  ].map(({ label, value, icon: Icon, note }) => (
                    <div className="stat" key={label}>
                      <div className="stat-top">
                        <span>{label}</span>
                        <Icon size={17} />
                      </div>
                      <div className="stat-bottom">
                        <strong>{value}</strong>
                        <span>{note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="content-columns">
                <div className="library-section">
                  <div className="section-heading">
                    <div>
                      <span className="section-kicker">
                        {view === "Beranda"
                          ? "LANJUTKAN PERJALANAN"
                          : "RUANG KOLEKSI"}
                      </span>
                      <h2>
                        {view === "Favorit"
                          ? "Pilihan hati"
                          : view === "Beranda"
                            ? "Kembali ke cerita Anda"
                            : "Library Anda"}
                      </h2>
                    </div>
                    {view === "Beranda" && (
                      <button
                        className="text-button"
                        onClick={() => setView("Library")}
                      >
                        Lihat semua <ArrowRight size={15} />
                      </button>
                    )}
                  </div>
                  <div className="library-tools">
                    <label className="search-box">
                      <Search size={17} />
                      <input
                        ref={search}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Cari di antara cerita..."
                        aria-label="Cari judul, kreator, atau catatan"
                      />
                      {query && (
                        <button
                          className="clear-search"
                          aria-label="Hapus pencarian"
                          onClick={() => {
                            setQuery("");
                            search.current?.focus();
                          }}
                        >
                          <X size={15} />
                        </button>
                      )}
                    </label>
                    <div className="view-controls">
                      <button
                        className={`icon-button ${sort ? "selected" : ""}`}
                        aria-label="Urutkan berdasarkan judul"
                        aria-pressed={sort}
                        onClick={() => setSort(!sort)}
                      >
                        <ArrowDownUp size={17} />
                      </button>
                      <span />
                      <button
                        className={`icon-button ${!listView ? "selected" : ""}`}
                        aria-label="Tampilan grid"
                        aria-pressed={!listView}
                        onClick={() => setListView(false)}
                      >
                        <Grid2X2 size={17} />
                      </button>
                      <button
                        className={`icon-button ${listView ? "selected" : ""}`}
                        aria-label="Tampilan daftar"
                        aria-pressed={listView}
                        onClick={() => setListView(true)}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="categories" aria-label="Filter kategori">
                    {mediaTypes.map((type, i) => {
                      const Icon = categoryIcons[i];
                      return (
                        <button
                          key={type}
                          className={category === type ? "chosen" : ""}
                          aria-pressed={category === type}
                          onClick={() => setCategory(type)}
                        >
                          <Icon size={14} />
                          {type}
                        </button>
                      );
                    })}
                  </div>
                  <div className="results-meta">
                    <span>
                      {filtered.length} item{" "}
                      {query ? "ditemukan" : "dalam ruang Anda"}
                    </span>
                    <span>Data sintetis</span>
                  </div>
                  {filtered.length ? (
                    <div
                      className={`media-grid ${listView ? "list-view" : ""}`}
                    >
                      {filtered.map((item) => (
                        <article className="media-card" key={item.id}>
                          <button
                            className="card-open"
                            onClick={() => setSelected(item)}
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
                          </button>
                          <div className="card-footer">
                            <div>
                              <span>
                                {item.progress.toLocaleString("id-ID")}
                                {item.total !== null ? ` / ${item.total}` : ""}
                              </span>
                              <small>{item.unit}</small>
                            </div>
                            <button
                              className="progress-button"
                              aria-label={`Tambah progres ${item.title}`}
                              disabled={
                                item.total !== null &&
                                item.progress >= item.total
                              }
                              onClick={() => increment(item)}
                            >
                              {item.total !== null &&
                              item.progress >= item.total ? (
                                <Check size={17} />
                              ) : (
                                <Plus size={17} />
                              )}
                            </button>
                          </div>
                          {item.total !== null && (
                            <div
                              className="progress-track"
                              role="progressbar"
                              aria-label={`Progres ${item.title}`}
                              aria-valuenow={item.progress}
                              aria-valuemax={item.total}
                              aria-valuemin={0}
                            >
                              <span
                                style={{
                                  width: `${Math.min(100, (item.progress / item.total) * 100)}%`,
                                }}
                              />
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state panel">
                      <Search size={30} />
                      <h3>Belum ada cerita di sini.</h3>
                      <p>Coba kata lain atau pilih kategori berbeda.</p>
                      <button
                        className="secondary-button"
                        onClick={() => {
                          setQuery("");
                          setCategory("Semua");
                        }}
                      >
                        Reset pencarian
                      </button>
                    </div>
                  )}
                </div>
                {view === "Beranda" && (
                  <aside className="right-column">
                    <section className="panel pixel-calendar">
                      <div className="section-heading">
                        <h2>Ritme kecil</h2>
                        <span className="mini-label">CONTOH</span>
                      </div>
                      <p>Setiap cerita punya waktunya sendiri.</p>
                      <div className="month-label">
                        <span>SEP</span>
                        <span>OKT</span>
                      </div>
                      <div className="heatmap" aria-hidden="true">
                        {Array.from({ length: 91 }, (_, i) => (
                          <i
                            key={i}
                            className={`heat-${(i * 7 + Math.floor(i / 5)) % 5}`}
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
                        Ilustrasi aktivitas 13 minggu, bukan riwayat Anda. Hari
                        kosong juga bagian dari perjalanan.
                      </p>
                    </section>
                    <section className="panel recent-panel">
                      <div className="section-heading">
                        <h2>Jejak terakhir</h2>
                        <Clock3 size={16} />
                      </div>
                      <span className="mini-label">
                        {activities.length ? "SESI INI" : "CONTOH AKTIVITAS"}
                      </span>
                      {(activities.length
                        ? activities.slice(0, 3)
                        : [
                            "Perpustakaan di Ujung Hujan · 42,5 chapter",
                            "Peta Kota Senja · 6 episode",
                            "Petikan Sore · 25 menit latihan",
                          ]
                      ).map((activity, i) => (
                        <div
                          className="activity-entry"
                          key={`${activity}-${i}`}
                        >
                          <span className="activity-dot" />
                          <div>
                            <strong>{activity}</strong>
                            <small>
                              {activities.length
                                ? "Baru saja · demo"
                                : "Data contoh, bukan aktivitas nyata"}
                            </small>
                          </div>
                        </div>
                      ))}
                      <button
                        className="text-button"
                        onClick={() => setView("Aktivitas")}
                      >
                        Riwayat sesi <ArrowRight size={14} />
                      </button>
                    </section>
                    <div className="pixel-note">
                      <PixelMark />
                      <p>
                        Bukan soal seberapa banyak.
                        <br />
                        <strong>Soal apa yang berkesan.</strong>
                      </p>
                      <span>MAKE ROOM FOR WHAT YOU LOVE.</span>
                    </div>
                  </aside>
                )}
              </div>
            </>
          )}
          <footer className="page-footer">
            <span>
              <PixelMark small />
              Ruang kecil. Cerita tak terbatas.
            </span>
            <span>Folio · Prototipe 0.1</span>
          </footer>
        </main>
      </div>
      <nav className="mobile-nav glass" aria-label="Navigasi ponsel">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            aria-current={view === label ? "page" : undefined}
            className={view === label ? "active" : ""}
            onClick={() => {
              setView(label);
              setCategory("Semua");
              setQuery("");
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
        <button
          aria-label="Pengaturan"
          className={view === "Pengaturan" ? "active" : ""}
          onClick={() => setView("Pengaturan")}
        >
          <Settings2 size={20} />
          <span>Atur</span>
        </button>
      </nav>
      <div
        role="status"
        aria-live="polite"
        className={`toast ${notice ? "visible" : ""}`}
      >
        {notice && (
          <>
            <Check size={17} />
            <span>{notice}</span>
            <button
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice("")}
            >
              <X size={16} />
            </button>
          </>
        )}
      </div>
      <dialog
        ref={dialog}
        className="item-dialog"
        onCancel={closeDialog}
        onClose={closeDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        aria-labelledby="dialog-title"
      >
        <div className="dialog-content">
          <button
            className="icon-button dialog-close"
            aria-label="Tutup dialog"
            onClick={closeDialog}
          >
            <X size={20} />
          </button>
          {adding ? (
            <>
              <span className="section-kicker">SATU CERITA BARU</span>
              <h2 id="dialog-title">Tambahkan ke ruang Anda.</h2>
              <p className="dialog-description">
                Cukup judul dan kategori. Hanya disimpan selama sesi demo.
              </p>
              <form onSubmit={addItem}>
                <label>
                  Judul
                  <input
                    name="title"
                    required
                    maxLength={200}
                    autoFocus
                    placeholder="Apa yang sedang Anda nikmati?"
                  />
                </label>
                <label>
                  Kategori
                  <select name="type" defaultValue="Manhwa">
                    {mediaTypes
                      .filter((type) => type !== "Semua")
                      .map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                  </select>
                </label>
                <label>
                  Kreator <span>(opsional)</span>
                  <input
                    name="creator"
                    maxLength={200}
                    placeholder="Penulis, sutradara, atau diri sendiri"
                  />
                </label>
                <div className="form-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeDialog}
                  >
                    Batal
                  </button>
                  <button className="primary-button" type="submit">
                    <Plus size={17} />
                    Tambah item
                  </button>
                </div>
              </form>
            </>
          ) : (
            selected && (
              <>
                <div className="detail-heading">
                  <Cover item={selected} />
                  <div>
                    <span className="section-kicker">{selected.type}</span>
                    <h2 id="dialog-title">{selected.title}</h2>
                    <p>{selected.creator}</p>
                    <button
                      className={`secondary-button favorite-button ${selected.favorite ? "is-favorite" : ""}`}
                      onClick={() =>
                        update({ ...selected, favorite: !selected.favorite })
                      }
                    >
                      <Heart
                        size={16}
                        fill={selected.favorite ? "currentColor" : "none"}
                      />
                      {selected.favorite ? "Favorit" : "Jadikan favorit"}
                    </button>
                  </div>
                </div>
                <p className="dialog-description">
                  Perubahan langsung berlaku di sesi demo. Refresh mengembalikan
                  data contoh.
                </p>
                <label>
                  Status
                  <select
                    value={selected.status}
                    onChange={(event) =>
                      update({
                        ...selected,
                        status: event.target.value as LibraryItem["status"],
                      })
                    }
                  >
                    {["Direncanakan", "Sedang dijalani", "Selesai"].map(
                      (status) => (
                        <option key={status}>{status}</option>
                      ),
                    )}
                  </select>
                </label>
                <div className="detail-fields">
                  <label>
                    Progres ({selected.unit})
                    <input
                      type="number"
                      min={0}
                      max={selected.total ?? undefined}
                      step="any"
                      value={selected.progress}
                      onChange={(event) => {
                        const value = event.target.valueAsNumber;
                        if (
                          Number.isFinite(value) &&
                          value >= 0 &&
                          (selected.total === null || value <= selected.total)
                        )
                          update({ ...selected, progress: value });
                      }}
                    />
                  </label>
                  <label>
                    Rating · {formatRating(selected.rating)}
                    <select
                      value={selected.rating ?? ""}
                      onChange={(event) =>
                        update({
                          ...selected,
                          rating:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                    >
                      <option value="">Belum dinilai</option>
                      {Array.from({ length: 101 }, (_, i) => (
                        <option key={i} value={i}>
                          {formatRating(i)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  Kesan singkat
                  <textarea
                    maxLength={2000}
                    value={selected.note}
                    rows={3}
                    onChange={(event) =>
                      update({ ...selected, note: event.target.value })
                    }
                  />
                </label>
                <div className="form-actions">
                  <span className="dialog-hint">
                    Tanpa database · jangan isi data sensitif
                  </span>
                  <button className="primary-button" onClick={closeDialog}>
                    Selesai
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </dialog>
    </div>
  );
}
