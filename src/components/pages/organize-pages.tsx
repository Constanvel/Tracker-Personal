"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, FolderPlus, Plus } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { SessionDraftForm } from "@/components/session-draft-form";
import { collectionPath, itemPath } from "@/lib/routes";
import { mediaTypes } from "@/lib/demo-library";

export function ActivityPage() {
  const { activities, settings } = useDemo();
  const [kind, setKind] = useState("all");
  const filtered = activities.filter(
    (entry) => kind === "all" || entry.kind === kind,
  );
  return (
    <div className="page-stack editorial-activity">
      <div className="page-heading">
        <div>
          <span className="section-kicker">JEJAK KECIL</span>
          <h1>Aktivitas Anda.</h1>
          <p>
            Riwayat perubahan pada sesi demo ini, bukan histori dari server.
          </p>
        </div>
        <Link className="primary-button" href="/journal">
          <BookOpen size={16} />
          Tulis jurnal
        </Link>
      </div>
      <section className="panel activity-history" aria-labelledby="activity-history-title">
        <div className="section-header">
          <h2 id="activity-history-title">Riwayat sesi</h2>
          <label className="field compact-field">
            Jenis aktivitas
            <select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="all">Semua</option>
              <option value="progress">Progres</option>
              <option value="item">Item baru</option>
              <option value="edit">Perubahan item</option>
              <option value="journal">Jurnal</option>
            </select>
          </label>
        </div>
        {filtered.length ? (
          <ol className="activity-timeline">
            {filtered.map((entry) => (
              <li className="timeline-entry" key={entry.id}>
                <span className="activity-dot" aria-hidden="true" />
                <div>
                  <h3>{entry.text}</h3>
                  <time className="muted" dateTime={entry.at}>
                    {new Date(entry.at).toLocaleString("id-ID", {
                      timeZone: settings.timeZone,
                    })}
                  </time>
                  {entry.itemId ? (
                    <Link className="text-link" href={itemPath(entry.itemId)}>
                      Buka item <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <Link className="text-link" href="/journal">
                      Buka jurnal
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="empty-state">
            <h3>Belum ada aktivitas yang cocok.</h3>
            <p>Coba update progres atau tambah item.</p>
            <Link href="/library" className="secondary-button">
              Buka library
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

export function JournalPage() {
  const { items, journals, addJournal, settings } = useDemo();
  const search = useSearchParams();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<"title" | "text", string>>
  >({});
  const [filter, setFilter] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const filteredJournals = journals.filter((entry) =>
    `${entry.title} ${entry.text}`
      .toLocaleLowerCase("id")
      .includes(filter.trim().toLocaleLowerCase("id")),
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const text = String(data.get("text") ?? "").trim();
    const nextErrors: Partial<Record<"title" | "text", string>> = {};
    if (!title) nextErrors.title = "Judul jurnal wajib diisi, bukan hanya spasi.";
    else if (title.length > 160) nextErrors.title = "Judul jurnal maksimal 160 karakter.";
    if (!text) nextErrors.text = "Isi jurnal wajib diisi, bukan hanya spasi.";
    else if (text.length > 5000) nextErrors.text = "Isi jurnal maksimal 5000 karakter.";
    setErrors(nextErrors);
    setMessage("");
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      const control = form.elements.namedItem(firstInvalid);
      if (control instanceof HTMLElement) {
        requestAnimationFrame(() => control.focus());
      }
      return;
    }
    addJournal({
      title,
      text,
      itemId: String(data.get("item") ?? "") || undefined,
    });
    form.reset();
    setMessage(
      "Jurnal ditambahkan ke sesi demo. Refresh akan menghapus tulisan.",
    );
  }
  return (
    <div className="page-stack editorial-journal">
      <div className="page-heading">
        <div>
          <span className="section-kicker">CATAT YANG BERKESAN</span>
          <h1>Jurnal pribadi.</h1>
          <p>
            UI jurnal saja. Jangan masukkan tulisan sensitif sebelum penyimpanan
            privat tersedia.
          </p>
        </div>
      </div>
      <div className="journal-workspace">
      <SessionDraftForm
        draftKey="journal"
        className="panel editor-form journal-writer"
        onSubmit={submit}
        noValidate
      >
        <div className="journal-region-heading">
          <span className="section-kicker">RUANG MENULIS</span>
          <h2>Catatan baru</h2>
        </div>
        <p className="muted">Draf tetap ada saat berpindah halaman dalam sesi ini. Refresh atau reset menghapus draf.</p>
        <label className="field">
          Judul jurnal
          <input
            name="title"
            aria-label="Judul jurnal"
            required
            maxLength={160}
            aria-invalid={Boolean(errors.title)}
            aria-describedby={errors.title ? "journal-title-error" : undefined}
          />
          {errors.title && (
            <span id="journal-title-error" className="form-error" role="alert">
              {errors.title}
            </span>
          )}
        </label>
        <label className="field">
          Terkait item
          <select
            name="item"
            defaultValue={
              items.some((item) => item.id === search.get("item"))
                ? search.get("item")!
                : ""
            }
          >
            <option value="">Catatan umum</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Isi jurnal
          <textarea
            name="text"
            aria-label="Isi jurnal"
            required
            rows={5}
            maxLength={5000}
            aria-invalid={Boolean(errors.text)}
            aria-describedby={errors.text ? "journal-text-error" : undefined}
          />
          {errors.text && (
            <span id="journal-text-error" className="form-error" role="alert">
              {errors.text}
            </span>
          )}
        </label>
        <button className="primary-button" type="submit">
          <Plus size={16} />
          Tambah catatan demo
        </button>
        {message && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}
      </SessionDraftForm>
      <section className="panel journal-reading" aria-labelledby="journal-reading-title">
        <div className="section-header">
          <div className="journal-region-heading">
            <span className="section-kicker">LEMBAR TERSIMPAN</span>
            <h2 id="journal-reading-title">Catatan sesi ini</h2>
          </div>
          <label className="field compact-field">
            Cari jurnal
            <input
              ref={searchInput}
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </label>
        </div>
        {filteredJournals.map((entry) => (
          <article className="journal-note" key={entry.id}>
            <time className="muted" dateTime={entry.at}>
              {new Date(entry.at).toLocaleString("id-ID", {
                timeZone: settings.timeZone,
              })}
            </time>
            <h3>{entry.title}</h3>
            <p className="prose-text">{entry.text}</p>
            {entry.itemId && (
              <Link className="text-link" href={itemPath(entry.itemId)}>
                Buka item terkait
              </Link>
            )}
          </article>
        ))}
        {!filteredJournals.length &&
          (filter.trim() ? (
            <div className="empty-state" role="status">
              <h3>Tidak ada jurnal yang cocok.</h3>
              <p>
                Coba kata kunci lain atau hapus pencarian untuk melihat semua
                catatan.
              </p>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setFilter("");
                  searchInput.current?.focus();
                }}
              >
                Hapus pencarian
              </button>
            </div>
          ) : (
            <p className="muted">
              Belum ada catatan. Tidak ada jurnal asli yang dimuat.
            </p>
          ))}
      </section>
      </div>
    </div>
  );
}

export function CollectionsPage({ id }: { id?: string }) {
  const { items, collections, addCollection, updateCollection } = useDemo();
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "description", string>>
  >({});
  const collection = collections.find((entry) => entry.id === id);
  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const nextErrors: Partial<Record<"name" | "description", string>> = {};
    if (!name) nextErrors.name = "Nama koleksi wajib diisi, bukan hanya spasi.";
    else if (name.length > 100) nextErrors.name = "Nama koleksi maksimal 100 karakter.";
    if (description.length > 500) nextErrors.description = "Deskripsi maksimal 500 karakter.";
    setErrors(nextErrors);
    setMessage("");
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      const control = form.elements.namedItem(firstInvalid);
      if (control instanceof HTMLElement) {
        requestAnimationFrame(() => control.focus());
      }
      return;
    }
    addCollection(name, description);
    form.reset();
    setMessage("Koleksi dibuat dalam sesi demo. Buka dari daftar di bawah.");
  }
  if (id && !collection)
    return (
      <section className="panel empty-state editorial-collections">
        <h1>Koleksi tidak tersedia.</h1>
        <p>Koleksi buatan sendiri hilang setelah refresh.</p>
        <Link className="primary-button" href="/collections">
          Semua koleksi
        </Link>
      </section>
    );
  if (collection)
    return (
      <div className="page-stack editorial-collections editorial-collection-detail">
        <Link className="text-link" href="/collections">
          Kembali ke koleksi
        </Link>
        <div className="page-heading">
          <div>
            <span className="section-kicker">KOLEKSI PILIHAN</span>
            <h1>{collection.name}</h1>
            <p>
              {collection.description || "Kelompokkan cerita lintas kategori."}
            </p>
          </div>
        </div>
        <section className="panel">
          <h2>Atur isi koleksi</h2>
          <p className="muted">
            Centang item untuk menambahkan. Perubahan langsung berlaku di sesi
            ini.
          </p>
          <div className="membership-list">
            {items.map((item) => (
              <div className="membership-row" key={item.id}>
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={collection.itemIds.includes(item.id)}
                    onChange={(e) => {
                      updateCollection({
                        ...collection,
                        itemIds: e.target.checked
                          ? [...collection.itemIds, item.id]
                          : collection.itemIds.filter(
                              (value) => value !== item.id,
                            ),
                      });
                      setMessage("Isi koleksi diperbarui di sesi demo.");
                    }}
                  />
                  <span className="membership-cover" aria-hidden="true">
                    <Image src={`/covers/${item.cover}.svg`} alt="" fill sizes="40px" />
                  </span>
                  <span className="membership-title">{item.title}</span>
                  <span className="mini-label">{item.type}</span>
                </label>
                <Link className="text-link" href={itemPath(item.id)}>
                  Detail <ArrowRight size={13} />
                </Link>
              </div>
            ))}
          </div>
          {message && (
            <p role="status" className="form-message">
              {message}
            </p>
          )}
        </section>
      </div>
    );
  return (
    <div className="page-stack editorial-collections">
      <div className="page-heading">
        <div>
          <span className="section-kicker">KELOMPOKKAN CERITA</span>
          <h1>Koleksi pilihan.</h1>
          <p>
            Satu koleksi bisa menyimpan buku, film, musik, dan hobi sekaligus.
          </p>
        </div>
      </div>
      <div className="info-grid collection-shelves">
        {collections.map((entry) => {
          const shelfItems = entry.itemIds
            .map((itemId) => items.find((item) => item.id === itemId))
            .filter((item) => item !== undefined)
            .slice(0, 4);
          return (
            <Link
              className="panel destination-card collection-shelf"
              key={entry.id}
              href={collectionPath(entry.id)}
            >
              <div className="shelf-mosaic" aria-hidden="true">
                {shelfItems.length ? shelfItems.map((item) => (
                  <div className="shelf-cover" key={item.id}>
                    <Image
                      src={`/covers/${item.cover}.svg`}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 22vw, 120px"
                    />
                  </div>
                )) : (
                  <FolderPlus size={32} strokeWidth={1.25} />
                )}
              </div>
              <div className="shelf-copy">
                <span className="shelf-count">{entry.itemIds.length} item</span>
                <h2>{entry.name}</h2>
                <p>{entry.description || "Koleksi buatan Anda"}</p>
                <span className="shelf-open">Buka koleksi <ArrowRight size={16} aria-hidden="true" /></span>
              </div>
            </Link>
          );
        })}
      </div>
      <SessionDraftForm
        draftKey="collection-new"
        className="panel editor-form collection-create"
        onSubmit={create}
        noValidate
      >
        <h2>Buat koleksi</h2>
        <label className="field">
          Nama koleksi
          <input
            name="name"
            aria-label="Nama koleksi"
            required
            maxLength={100}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "collection-name-error" : undefined}
          />
          {errors.name && (
            <span id="collection-name-error" className="form-error" role="alert">
              {errors.name}
            </span>
          )}
        </label>
        <label className="field">
          Deskripsi (opsional)
          <textarea
            name="description"
            aria-label="Deskripsi (opsional)"
            maxLength={500}
            rows={2}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? "collection-description-error" : undefined}
          />
          {errors.description && (
            <span id="collection-description-error" className="form-error" role="alert">
              {errors.description}
            </span>
          )}
        </label>
        <button className="primary-button" type="submit">
          <Plus size={16} />
          Buat koleksi demo
        </button>
        {message && (
          <p role="status" className="form-message">
            {message}
          </p>
        )}
      </SessionDraftForm>
    </div>
  );
}

export function StatisticsPage() {
  const { items, activities, journals } = useDemo();
  const [type, setType] = useState("Semua");
  const filtered = items.filter(
    (item) => type === "Semua" || item.type === type,
  );
  const statuses = ["Direncanakan", "Sedang dijalani", "Selesai"];
  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="section-kicker">LIHAT TANPA MENGEJAR</span>
          <h1>Ruang dalam angka.</h1>
          <p>
            Ringkasan data contoh dan perubahan sesi. Bukan target
            produktivitas.
          </p>
        </div>
      </div>
      <label className="field compact-field">
        Filter kategori
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {mediaTypes.map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <div className="stats-row">
        {[
          { label: "Item", value: filtered.length },
          {
            label: "Favorit",
            value: filtered.filter((item) => item.favorite).length,
          },
          {
            label: "Sudah dinilai",
            value: filtered.filter((item) => item.rating !== null).length,
          },
        ].map((stat) => (
          <section key={stat.label} className="stat">
            <p>{stat.label}</p>
            <div className="stat-bottom">
              <strong>{stat.value}</strong>
            </div>
          </section>
        ))}
      </div>
      <section className="panel">
        <h2>Status konsumsi</h2>
        {statuses.map((status) => {
          const count = filtered.filter(
            (item) => item.status === status,
          ).length;
          return (
            <div className="stat-bar-row" key={status}>
              <span>{status}</span>
              <meter
                value={count}
                min={0}
                max={Math.max(1, filtered.length)}
                aria-label={`${status}: ${count} item`}
              />
              <strong>{count}</strong>
            </div>
          );
        })}
      </section>
      <div className="info-grid">
        <section className="panel">
          <h2>Aktivitas sesi</h2>
          <p className="big-number">{activities.length}</p>
          <p className="muted">
            Perubahan tercatat, bukan total konsumsi lintas unit.
          </p>
          <Link className="text-link" href="/activity">
            Lihat riwayat
          </Link>
        </section>
        <section className="panel">
          <h2>Jurnal sesi</h2>
          <p className="big-number">{journals.length}</p>
          <p className="muted">
            Catatan tidak ikut statistik rating atau progres.
          </p>
          <Link className="text-link" href="/journal">
            Buka jurnal
          </Link>
        </section>
      </div>
    </div>
  );
}
