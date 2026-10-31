"use client";

import { useRef, useState, type FormEvent } from "react";
import { Check, Plus, Pencil, X } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { formatProgress, type LibraryItem } from "@/lib/demo-library";
import type { ProgressSnapshot } from "@/lib/progress";
import "@/styles/progress-editor.css";

export function ProgressActions({ item }: { item: LibraryItem }) {
  const { incrementItem, setItemProgress, sessionVersion } = useDemo();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const snapshot = useRef<ProgressSnapshot | null>(null);
  const [error, setError] = useState("");
  const complete = item.total !== null && item.progress >= item.total;
  const delta = item.total === null ? 1 : Math.min(1, Math.max(0, item.total - item.progress));

  function open() {
    snapshot.current = { progress: item.progress, total: item.total, unit: item.unit, sessionVersion };
    setError("");
    if (input.current) input.current.value = String(item.progress);
    dialog.current?.showModal();
    input.current?.focus();
    input.current?.select();
  }
  function close() {
    dialog.current?.close();
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const control = input.current;
    if (!control || control.validity.badInput || !control.value.trim()) {
      setError("Isi progres dengan angka nol atau lebih.");
      control?.focus();
      return;
    }
    const message = setItemProgress(item.id, Number(control.value), snapshot.current ?? undefined);
    if (message) { setError(message); control.focus(); return; }
    close();
  }
  return (
    <>
      <button
        type="button"
        className="progress-button"
        aria-label={complete ? `Batas progres tercapai: ${item.title}` : `Tambah ${formatProgress(delta)} ${item.unit}: ${item.title}`}
        disabled={complete}
        onClick={() => incrementItem(item.id)}
      >
        {complete ? <Check size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
        <span>{complete ? "Batas tercapai" : `${formatProgress(delta)} ${item.unit}`}</span>
      </button>
      <button ref={trigger} type="button" className="record-progress" aria-label={`Catat progres: ${item.title}`} onClick={open}>
        <Pencil size={14} aria-hidden="true" /> Catat progres…
      </button>
      <dialog ref={dialog} className="progress-editor" aria-label={`Catat progres: ${item.title}`} onClose={() => trigger.current?.focus()}>
        <form onSubmit={save} noValidate>
          <div className="section-header">
            <h2>Catat progres</h2>
            <button type="button" className="icon-button" aria-label="Tutup editor progres" onClick={close}><X size={18} aria-hidden="true" /></button>
          </div>
          <p className="progress-editor-title">{item.title}</p>
          <p className="muted">Saat ini {formatProgress(item.progress)} {item.unit}{item.total === null ? ". Total belum diketahui." : ` dari ${formatProgress(item.total)}.`}</p>
          <label className="field">
            Posisi terbaru ({item.unit})
            <input ref={input} name="position" aria-label="Posisi terbaru" type="number" min={0} step="any" inputMode="decimal" required aria-invalid={Boolean(error)} aria-describedby={error ? `progress-error-${item.id}` : undefined} />
          </label>
          {error && <p id={`progress-error-${item.id}`} className="form-error" role="alert">{error}</p>}
          <p className="muted">Boleh pecahan atau koreksi ke angka lebih kecil. Status selesai tetap dipilih sendiri. Perubahan hanya di sesi demo.</p>
          <div className="action-row">
            <button type="button" className="secondary-button" onClick={close}>Batal</button>
            <button type="submit" className="primary-button">Simpan progres</button>
          </div>
        </form>
      </dialog>
    </>
  );
}
