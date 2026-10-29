"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Check, Heart, Pencil, Plus } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import {
  formatRating,
  mediaTypes,
  type LibraryItem,
  type MediaType,
} from "@/lib/demo-library";
import { editItemPath, itemPath } from "@/lib/routes";

export function ItemPage({
  id,
  edit = false,
  create = false,
}: {
  id?: string;
  edit?: boolean;
  create?: boolean;
}) {
  const { items, updateItem, addItem, incrementItem, journals, activities } =
    useDemo();
  const item = items.find((entry) => entry.id === id);
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  if (!create && !item)
    return (
      <section className="panel empty-state">
        <h1>Item tidak tersedia.</h1>
        <p>
          ID ini tidak ada dalam sesi demo. Item buatan sendiri hilang saat
          refresh.
        </p>
        <Link className="primary-button" href="/library">
          Kembali ke library
        </Link>
        <Link className="text-link" href="/library/new">
          Tambah item baru
        </Link>
      </section>
    );

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const type = String(data.get("type")) as MediaType;
    const progress = Number(data.get("progress") ?? 0);
    const totalText = String(data.get("total") ?? "");
    const total = totalText.trim() ? Number(totalText) : null;
    const ratingText = String(data.get("rating") ?? "");
    const rating = ratingText === "" ? null : Number(ratingText);
    if (!title) {
      setError("Judul wajib diisi, bukan hanya spasi.");
      return;
    }
    if (
      !Number.isFinite(progress) ||
      progress < 0 ||
      (total !== null &&
        (!Number.isFinite(total) || total < 0 || progress > total))
    ) {
      setError(
        "Progres harus positif atau nol dan tidak melebihi total. Kosongkan total bila belum diketahui.",
      );
      return;
    }
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
    const next: LibraryItem = {
      id: item?.id ?? crypto.randomUUID(),
      title,
      type,
      creator: String(data.get("creator") ?? "").trim() || "Ditambahkan manual",
      status: String(data.get("status")) as LibraryItem["status"],
      progress,
      total,
      unit,
      rating,
      favorite: data.get("favorite") === "on",
      cover:
        item?.cover ??
        (type === "Film" ? "orbit" : type === "Hobi" ? "guitar" : "forest"),
      note: String(data.get("note") ?? ""),
    };
    if (create) addItem(next);
    else updateItem(next);
    router.push(itemPath(next.id));
  }

  if (create || edit)
    return (
      <div className="page-stack">
        <Link
          className="text-link"
          href={item ? itemPath(item.id) : "/library"}
        >
          <ArrowLeft size={16} />
          Batal dan kembali
        </Link>
        <div className="page-heading">
          <div>
            <span className="section-kicker">
              {create ? "SATU CERITA BARU" : "RAPIKAN CERITA"}
            </span>
            <h1>{create ? "Tambahkan ke ruang Anda." : "Edit item."}</h1>
            <p>Form menyimpan ke memori sesi demo, bukan ke server.</p>
          </div>
        </div>
        <form
          className="panel editor-form"
          onSubmit={save}
          key={item?.id ?? "new"}
        >
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <label className="field">
            Judul
            <input
              name="title"
              required
              maxLength={200}
              defaultValue={item?.title}
              placeholder="Apa yang sedang dinikmati?"
            />
          </label>
          <div className="info-grid">
            <label className="field">
              Kategori
              <select
                aria-label="Kategori"
                name="type"
                defaultValue={item?.type ?? "Manhwa"}
              >
                {mediaTypes
                  .filter((type) => type !== "Semua")
                  .map((type) => (
                    <option key={type}>{type}</option>
                  ))}
              </select>
            </label>
            <label className="field">
              Kreator (opsional)
              <input
                name="creator"
                maxLength={200}
                defaultValue={item?.creator}
              />
            </label>
          </div>
          <label className="field">
            Status
            <select
              aria-label="Status"
              name="status"
              defaultValue={item?.status ?? "Direncanakan"}
            >
              {["Direncanakan", "Sedang dijalani", "Selesai"].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <div className="info-grid">
            <label className="field">
              Progres
              <input
                name="progress"
                type="number"
                min={0}
                step="any"
                defaultValue={item?.progress ?? 0}
              />
            </label>
            <label className="field">
              Total (kosong = belum diketahui)
              <input
                name="total"
                type="number"
                min={0}
                step="any"
                defaultValue={item?.total ?? ""}
              />
            </label>
          </div>
          <label className="field">
            Rating
            <select
              aria-label="Rating"
              name="rating"
              defaultValue={item?.rating ?? ""}
            >
              <option value="">Belum dinilai</option>
              {Array.from({ length: 101 }, (_, i) => (
                <option key={i} value={i}>
                  {formatRating(i)}
                </option>
              ))}
            </select>
          </label>
          <label className="checkbox-line">
            <input
              type="checkbox"
              name="favorite"
              defaultChecked={item?.favorite}
            />
            Jadikan favorit
          </label>
          <label className="field">
            Kesan singkat
            <textarea
              name="note"
              maxLength={2000}
              rows={4}
              defaultValue={item?.note}
            />
          </label>
          <div className="action-row">
            <Link
              className="secondary-button"
              href={item ? itemPath(item.id) : "/library"}
            >
              Batal
            </Link>
            <button className="primary-button" type="submit">
              <Check size={16} />
              Simpan di sesi demo
            </button>
          </div>
        </form>
      </div>
    );

  const current = item!;
  const history = activities.filter(
    (activity) => activity.itemId === current.id,
  );
  return (
    <div className="page-stack">
      <Link className="text-link" href="/library">
        <ArrowLeft size={16} />
        Library
      </Link>
      <section className="panel item-hero">
        <div className="detail-art">
          <Image
            src={`/covers/${current.cover}.svg`}
            alt={`Ilustrasi pixel ${current.title}`}
            fill
            sizes="220px"
          />
        </div>
        <div>
          <span className="section-kicker">
            {current.type} · {current.status}
          </span>
          <h1>{current.title}</h1>
          <p className="muted">{current.creator}</p>
          <div className="action-row">
            <Link href={editItemPath(current.id)} className="primary-button">
              <Pencil size={16} />
              Edit item
            </Link>
            <button
              className={`secondary-button ${current.favorite ? "is-favorite" : ""}`}
              onClick={() => {
                updateItem({ ...current, favorite: !current.favorite });
                setSaved(true);
              }}
            >
              <Heart
                size={16}
                fill={current.favorite ? "currentColor" : "none"}
              />
              {current.favorite ? "Hapus favorit" : "Jadikan favorit"}
            </button>
          </div>
          {saved && (
            <p className="muted" role="status">
              Favorit diperbarui di sesi demo.
            </p>
          )}
        </div>
      </section>
      <div className="info-grid">
        <section className="panel">
          <h2>Progres & penilaian</h2>
          <p className="big-number">
            {current.progress.toLocaleString("id-ID")}
            {current.total !== null ? ` / ${current.total}` : ""}
            <small> {current.unit}</small>
          </p>
          <p className="muted">
            {current.total === null ? "Total belum diketahui. " : ""}Status
            selesai dipilih secara manual.
          </p>
          <div className="action-row">
            <button
              className="secondary-button"
              disabled={
                current.total !== null && current.progress >= current.total
              }
              onClick={() => incrementItem(current.id)}
            >
              <Plus size={16} />
              Tambah progres
            </button>
            <span className="rating-badge">{formatRating(current.rating)}</span>
          </div>
        </section>
        <section className="panel">
          <h2>Kesan singkat</h2>
          <p className="prose-text">
            {current.note || "Belum ada kesan. Tambahkan melalui edit item."}
          </p>
          <Link href={editItemPath(current.id)} className="text-link">
            Edit kesan <Pencil size={14} />
          </Link>
        </section>
      </div>
      <section className="panel">
        <div className="section-header">
          <h2>Jurnal terkait</h2>
          <Link
            className="text-link"
            href={`/journal?item=${encodeURIComponent(current.id)}`}
          >
            Tulis jurnal <Plus size={15} />
          </Link>
        </div>
        {journals
          .filter((entry) => entry.itemId === current.id)
          .map((entry) => (
            <article className="journal-note" key={entry.id}>
              <h3>{entry.title}</h3>
              <p className="prose-text">{entry.text}</p>
            </article>
          ))}
        {!journals.some((entry) => entry.itemId === current.id) && (
          <p className="muted">
            Belum ada jurnal dalam sesi ini. Tulisan tidak dikirim ke platform
            lain.
          </p>
        )}
      </section>
      <section className="panel">
        <div className="section-header">
          <h2>Riwayat sesi item</h2>
          <Link href="/activity" className="text-link">
            Semua aktivitas
          </Link>
        </div>
        {history.length ? (
          history.map((entry) => (
            <p className="activity-entry" key={entry.id}>
              {entry.text}
            </p>
          ))
        ) : (
          <p className="muted">Belum ada perubahan pada sesi ini.</p>
        )}
      </section>
    </div>
  );
}
