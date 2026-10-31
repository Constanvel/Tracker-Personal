"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { SessionDraftForm } from "@/components/session-draft-form";
import { ArrowLeft, Check, Heart, Pencil, Plus } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { ProgressActions } from "@/components/progress-actions";
import {
  itemStatuses,
  itemUnit,
  validateItemForm,
  type ItemFormErrors,
  type ItemFormField,
} from "@/lib/item-form";
import {
  formatRating,
  formatProgress,
  mediaTypes,
  type LibraryItem,
  type MediaType,
} from "@/lib/demo-library";
import { editItemPath, itemPath } from "@/lib/routes";
import "@/styles/item-editor.css";

// Keep query-driven focus inside its own boundary so direct edit routes can prerender.
// Changing intent never remounts the form or replaces its unsaved input values.
function ContextualEditIntent({
  disclosureRef,
  noteRef,
}: {
  disclosureRef: RefObject<HTMLDetailsElement | null>;
  noteRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const searchParams = useSearchParams();
  const sections = searchParams.getAll("section");
  const section = sections.length === 1 && sections[0] === "note" ? "note" : null;

  useEffect(() => {
    if (disclosureRef.current) disclosureRef.current.open = section === "note";
    if (section !== "note") return;
    const frame = requestAnimationFrame(() => noteRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [section, disclosureRef, noteRef]);

  return null;
}

function SavedConfirmation() {
  const searchParams = useSearchParams();
  return searchParams.get("saved") === "1" ? (
    <p className="notice-box" role="status">
      Item disimpan di sesi demo. Refresh akan menghapus perubahan.
    </p>
  ) : null;
}

export function ItemPage({
  id,
  edit = false,
  create = false,
}: {
  id?: string;
  edit?: boolean;
  create?: boolean;
}) {
  const { items, updateItem, addItem, journals, activities, getDraft, clearDraft } = useDemo();
  const item = items.find((entry) => entry.id === id);
  const draftKey = create ? "item-new" : `item-${id}`;
  const [draft] = useState(() => getDraft(draftKey));
  const router = useRouter();
  const categoryRef = useRef<HTMLSelectElement>(null);
  const disclosureRef = useRef<HTMLDetailsElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const previousProgress = useRef(item?.progress);
  useEffect(() => {
    if (previousProgress.current !== item?.progress) {
      // The keyed input follows Undo; capture its new value with the other draft fields.
      progressRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
      previousProgress.current = item?.progress;
    }
  }, [item?.progress]);
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const [pendingCategory, setPendingCategory] = useState<MediaType | null>(null);
  const [category, setCategory] = useState<MediaType>((draft?.type as MediaType) ?? item?.type ?? "Manhwa");
  const [unrated, setUnrated] = useState(typeof draft?.unrated === "boolean" ? draft.unrated : item?.rating == null);
  const [saved, setSaved] = useState(false);
  const unit = itemUnit(category);

  function fieldError(field: ItemFormField) {
    return errors[field] ? (
      <span id={`${field}-error`} className="form-error" role="alert">
        {errors[field]}
      </span>
    ) : null;
  }

  function describedBy(field: ItemFormField, helper?: string) {
    return [helper, errors[field] ? `${field}-error` : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  }
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

  function resolveCategory(clearNumbers: boolean) {
    const select = categoryRef.current;
    const form = select?.form;
    if (!pendingCategory || !select || !form) return;
    if (clearNumbers) {
      for (const [name, value] of [["progress", "0"], ["total", ""]]) {
        const control = form.elements.namedItem(name);
        if (control instanceof HTMLInputElement) control.value = value;
      }
    }
    select.value = pendingCategory;
    setCategory(pendingCategory);
    setPendingCategory(null);
    select.dispatchEvent(new Event("input", { bubbles: true }));
    select.focus();
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (pendingCategory) return;
    const data = new FormData(form);
    function numericText(name: "progress" | "total" | "rating") {
      const control = form.elements.namedItem(name);
      // Number inputs serialize malformed entries as empty; do not treat those as unknown totals.
      return control instanceof HTMLInputElement && control.validity.badInput
        ? "NaN"
        : String(data.get(name) ?? "");
    }
    const result = validateItemForm({
      title: String(data.get("title") ?? ""),
      type: String(data.get("type") ?? ""),
      status: String(data.get("status") ?? ""),
      progress: numericText("progress"),
      total: numericText("total"),
      rating: numericText("rating"),
      unrated: data.get("unrated") === "on",
    });
    if (!result.valid) {
      setErrors(result.errors);
      const fields = Object.keys(result.errors);
      for (const field of fields) {
        const control = form.elements.namedItem(field);
        if (control instanceof HTMLElement) {
          const disclosure = control.closest("details");
          if (disclosure) disclosure.open = true;
        }
      }
      const control = form.elements.namedItem(fields[0]);
      requestAnimationFrame(() => {
        if (fields.length > 1) document.getElementById("item-error-summary")?.focus();
        else if (control instanceof HTMLElement) control.focus();
      });
      return;
    }
    setErrors({});
    const { type } = result.values;
    const next: LibraryItem = {
      id: item?.id ?? crypto.randomUUID(),
      ...result.values,
      creator: String(data.get("creator") ?? "").trim() || "Ditambahkan manual",
      favorite: data.get("favorite") === "on",
      cover:
        item?.cover ??
        (type === "Film" ? "orbit" : type === "Hobi" ? "guitar" : "forest"),
      note: String(data.get("note") ?? ""),
    };
    if (create) addItem(next);
    else updateItem(next);
    clearDraft(draftKey);
    router.push(`${itemPath(next.id)}?saved=1`);
  }

  if (create || edit)
    return (
      <div className="page-stack">
        <Link
          className="text-link"
          href={item ? itemPath(item.id) : "/library"}
          onClick={() => clearDraft(draftKey)}
        >
          <ArrowLeft size={16} />
          Batal dan kembali
        </Link>
        <div className="page-heading">
          <div>
            <h1>{create ? "Tambahkan ke ruang Anda." : "Edit item."}</h1>
            <p>Draf tetap ada saat berpindah halaman. Batal membuang draf; refresh menghapus sesi demo.</p>
          </div>
        </div>
        <SessionDraftForm
          draftKey={draftKey}
          className="panel editor-form item-editor"
          onSubmit={save}
          key={item?.id ?? "new"}
          noValidate
        >
          {Object.keys(errors).length > 1 && (
            <section id="item-error-summary" tabIndex={-1} className="notice-box" aria-labelledby="item-errors-title">
              <h2 id="item-errors-title">Periksa isian berikut</h2>
              <ul>
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}><a href={`#item-${field}`} onClick={(event) => {
                    event.preventDefault();
                    const form = event.currentTarget.closest("form")!;
                    const control = form.elements.namedItem(field);
                    if (control instanceof HTMLElement) {
                      const disclosure = control.closest("details");
                      if (disclosure) disclosure.open = true;
                      control.focus();
                    }
                  }}>{message}</a></li>
                ))}
              </ul>
            </section>
          )}
          <label className="field">
            Judul
            <input
              id="item-title"
              name="title"
              aria-label="Judul"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={describedBy("title")}
              required
              maxLength={200}
              defaultValue={item?.title}
              placeholder="Apa yang sedang dinikmati?"
            />
            {fieldError("title")}
          </label>
          <div className="info-grid">
            <label className="field">
              Kategori
              <select
                aria-label="Kategori"
                id="item-type"
                name="type"
                ref={categoryRef}
                value={category}
                onChange={(event) => {
                  const next = event.target.value as MediaType;
                  const form = event.currentTarget.form!;
                  const progress = form.elements.namedItem("progress") as HTMLInputElement;
                  const total = form.elements.namedItem("total") as HTMLInputElement;
                  if (itemUnit(next) !== unit && (Number(progress.value) !== 0 || total.value !== "")) {
                    event.currentTarget.value = category;
                    setPendingCategory(next);
                    requestAnimationFrame(() => document.getElementById("category-change-title")?.focus());
                  } else {
                    setCategory(next);
                    setPendingCategory(null);
                  }
                }}
                aria-invalid={Boolean(errors.type)}
                aria-describedby={describedBy("type")}
              >
                {mediaTypes
                  .filter((type) => type !== "Semua")
                  .map((type) => (
                    <option key={type}>{type}</option>
                  ))}
              </select>
              {fieldError("type")}
            </label>
            <label className="field">
              Status
              <select
                aria-label="Status"
                id="item-status"
                name="status"
                defaultValue={item?.status ?? "Direncanakan"}
                aria-invalid={Boolean(errors.status)}
                aria-describedby={describedBy("status", "status-help")}
              >
                {itemStatuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <small id="status-help" className="muted">
                Status selesai dipilih sendiri, bukan otomatis dari progres.
              </small>
              {fieldError("status")}
            </label>
          </div>
          {pendingCategory && (
            <section className="notice-box page-stack" aria-labelledby="category-change-title">
              <h2 id="category-change-title" tabIndex={-1}>Ubah satuan progres?</h2>
              <p>{category} memakai {unit}; {pendingCategory} memakai {itemUnit(pendingCategory)}. Angka tidak dikonversi otomatis. Pilih sebelum melanjutkan.</p>
              <div className="action-row">
                <button type="button" className="secondary-button" onClick={() => { setPendingCategory(null); categoryRef.current?.focus(); }}>Batal ubah kategori</button>
                <button type="button" className="secondary-button" onClick={() => resolveCategory(true)}>Mulai dari nol</button>
                <button type="button" className="secondary-button" onClick={() => resolveCategory(false)}>Pertahankan angka</button>
              </div>
            </section>
          )}
          <label className="field">
            Progres ({unit})
            <input
              key={`progress-${item?.progress ?? "new"}`}
              ref={progressRef}
              aria-label="Progres"
              id="item-progress"
              name="progress"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              required
              aria-invalid={Boolean(errors.progress)}
              aria-describedby={describedBy("progress", "progress-help")}
              defaultValue={item?.progress ?? 0}
            />
            <small id="progress-help" className="muted">
              Jumlah {unit} yang sudah dijalani. Boleh pecahan, misalnya 2,5.
            </small>
            {fieldError("progress")}
          </label>
          <div className="item-editor-actions">
            <p id="item-save-help" className="muted">Simpan seluruh isian, termasuk detail opsional. Perubahan hanya berlaku di sesi demo.</p>
            <div className="action-row">
              <Link
                className="secondary-button"
                href={item ? itemPath(item.id) : "/library"}
                onClick={() => clearDraft(draftKey)}
              >
                Batal
              </Link>
              <button className="primary-button" type="submit" disabled={Boolean(pendingCategory)} aria-describedby="item-save-help">
                <Check size={16} />
                Simpan di sesi demo
              </button>
            </div>
          </div>
          {edit && (
            <Suspense fallback={null}>
              <ContextualEditIntent disclosureRef={disclosureRef} noteRef={noteRef} />
            </Suspense>
          )}
          <details className="form-disclosure" ref={disclosureRef}>
            <summary>Detail opsional: kreator, total, rating & kesan</summary>
            <div className="page-stack">
              <div className="info-grid">
                <label className="field">
                  Kreator (opsional)
                  <input
                    name="creator"
                    maxLength={200}
                    defaultValue={item?.creator}
                  />
                </label>
                <label className="field">
                  Total ({unit}, opsional)
                  <input
                    aria-label="Total"
                    id="item-total"
                    name="total"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="any"
                    aria-invalid={Boolean(errors.total)}
                    aria-describedby={describedBy("total", "total-help")}
                    defaultValue={item?.total ?? ""}
                  />
                  <small id="total-help" className="muted">
                    Kosongkan jika jumlah {unit} belum diketahui. Nol berarti totalnya memang 0.
                  </small>
                  {fieldError("total")}
                </label>
              </div>
              <label className="checkbox-line">
                <input
                  type="checkbox"
                  name="unrated"
                  checked={unrated}
                  onChange={(event) => setUnrated(event.target.checked)}
                  aria-describedby="rating-help"
                />
                Belum dinilai
              </label>
              <label className="field">
                Rating /10
                <input
                  aria-label="Rating"
                  id="item-rating"
                  name="rating"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={10}
                  step={0.1}
                  disabled={unrated}
                  aria-invalid={Boolean(errors.rating)}
                  aria-describedby={describedBy("rating", "rating-help")}
                  defaultValue={item?.rating == null ? "" : item.rating / 10}
                />
                <small id="rating-help" className="muted">
                  Nilai 0–10, maksimal satu desimal. Nol adalah penilaian; centang Belum dinilai untuk mengosongkan.
                </small>
                {fieldError("rating")}
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
                  id="item-note"
                  aria-label="Kesan singkat"
                  ref={noteRef}
                  name="note"
                  maxLength={2000}
                  rows={4}
                  defaultValue={item?.note}
                />
              </label>
            </div>
          </details>
        </SessionDraftForm>
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
      <Suspense fallback={null}>
        <SavedConfirmation />
      </Suspense>
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
          <h1>{current.title}</h1>
          <p className="muted">{current.type} · {current.status}</p>
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
            {formatProgress(current.progress)}
            {current.total !== null ? ` / ${formatProgress(current.total)}` : ""}
            <small> {current.unit}</small>
          </p>
          <p className="muted">
            {current.total === null ? "Total belum diketahui. " : ""}Status
            selesai dipilih secara manual.
          </p>
          <div className="action-row">
            <ProgressActions item={current} />
            <span className="rating-badge">{formatRating(current.rating)}</span>
          </div>
        </section>
        <section className="panel">
          <h2>Kesan singkat</h2>
          <p className="prose-text">
            {current.note || "Belum ada kesan. Tambahkan melalui edit item."}
          </p>
          <Link href={`${editItemPath(current.id)}?section=note`} className="text-link">
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
