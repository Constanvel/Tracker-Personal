"use client";

import { Check, Plus } from "lucide-react";
import { useDemo } from "@/components/demo-provider";
import { formatProgress, type LibraryItem } from "@/lib/demo-library";

export function ProgressActions({ item }: { item: LibraryItem }) {
  const { incrementItem } = useDemo();
  const complete = item.total !== null && item.progress >= item.total;
  const delta = item.total === null ? 1 : Math.min(1, Math.max(0, item.total - item.progress));
  return (
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
  );
}
