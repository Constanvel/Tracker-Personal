"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, FolderPlus, Plus } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { collectionPath, itemPath } from "@/lib/routes";
import { mediaTypes } from "@/lib/demo-library";

export function ActivityPage() {
  const { activities, settings } = useDemo();
  const [kind, setKind] = useState("all");
  const filtered = activities.filter(
    (entry) => kind === "all" || entry.kind === kind,
  );
  return (
    <div className="page-stack">
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
      <section className="panel">
        <div className="section-header">
          <h2>Riwayat sesi</h2>
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
          filtered.map((entry) => (
            <article className="timeline-entry" key={entry.id}>
              <span className="activity-dot" />
              <div>
                <h3>{entry.text}</h3>
                <p className="muted">
                  {new Date(entry.at).toLocaleString("id-ID", {
                    timeZone: settings.timeZone,
                  })}
                </p>
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
            </article>
          ))
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
  const [filter, setFilter] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const text = String(data.get("text") ?? "").trim();
    if (!title || !text) {
      setMessage("Judul dan isi tidak boleh hanya spasi.");
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
    <div className="page-stack">
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
      <form className="panel editor-form" onSubmit={submit}>
        <h2>Catatan baru</h2>
        <label className="field">
          Judul jurnal
          <input name="title" required maxLength={160} />
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
          <textarea name="text" required rows={5} maxLength={5000} />
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
      </form>
      <section className="panel">
        <div className="section-header">
          <h2>Catatan sesi ini</h2>
          <label className="field compact-field">
            Cari jurnal
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </label>
        </div>
        {journals
          .filter((entry) =>
            `${entry.title} ${entry.text}`
              .toLocaleLowerCase("id")
              .includes(filter.toLocaleLowerCase("id")),
          )
          .map((entry) => (
            <article className="journal-note" key={entry.id}>
              <h3>{entry.title}</h3>
              <p className="muted">
                {new Date(entry.at).toLocaleString("id-ID", {
                  timeZone: settings.timeZone,
                })}
              </p>
              <p className="prose-text">{entry.text}</p>
              {entry.itemId && (
                <Link className="text-link" href={itemPath(entry.itemId)}>
                  Buka item terkait
                </Link>
              )}
            </article>
          ))}
        {!journals.length && (
          <p className="muted">
            Belum ada catatan. Tidak ada jurnal asli yang dimuat.
          </p>
        )}
      </section>
    </div>
  );
}

export function CollectionsPage({ id }: { id?: string }) {
  const { items, collections, addCollection, updateCollection } = useDemo();
  const [message, setMessage] = useState("");
  const collection = collections.find((entry) => entry.id === id);
  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    if (!name) {
      setMessage("Nama koleksi wajib diisi.");
      return;
    }
    addCollection(name, String(data.get("description") ?? "").trim());
    form.reset();
    setMessage("Koleksi dibuat dalam sesi demo. Buka dari daftar di bawah.");
  }
  if (id && !collection)
    return (
      <section className="panel empty-state">
        <h1>Koleksi tidak tersedia.</h1>
        <p>Koleksi buatan sendiri hilang setelah refresh.</p>
        <Link className="primary-button" href="/collections">
          Semua koleksi
        </Link>
      </section>
    );
  if (collection)
    return (
      <div className="page-stack">
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
                  {item.title}
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
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="section-kicker">KELOMPOKKAN CERITA</span>
          <h1>Koleksi pilihan.</h1>
          <p>
            Satu koleksi bisa menyimpan buku, film, musik, dan hobi sekaligus.
          </p>
        </div>
      </div>
      <div className="info-grid">
        {collections.map((entry) => (
          <Link
            className="panel destination-card"
            key={entry.id}
            href={collectionPath(entry.id)}
          >
            <FolderPlus size={24} />
            <h2>{entry.name}</h2>
            <p>{entry.description || "Koleksi buatan Anda"}</p>
            <span>
              {entry.itemIds.length} item <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </div>
      <form className="panel editor-form" onSubmit={create}>
        <h2>Buat koleksi</h2>
        <label className="field">
          Nama koleksi
          <input name="name" required maxLength={100} />
        </label>
        <label className="field">
          Deskripsi (opsional)
          <textarea name="description" maxLength={500} rows={2} />
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
      </form>
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
