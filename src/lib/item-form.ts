import { mediaTypes, type LibraryItem, type MediaType } from "./demo-library";

export const itemStatuses = [
  "Direncanakan",
  "Sedang dijalani",
  "Selesai",
] as const;

const units: Record<MediaType, LibraryItem["unit"]> = {
  Manhwa: "chapter",
  Buku: "halaman",
  Anime: "episode",
  Film: "film",
  Musik: "sesi",
  Hobi: "sesi",
};

export function itemUnit(type: MediaType) {
  return units[type];
}

export type ItemFormField =
  | "title"
  | "type"
  | "status"
  | "progress"
  | "total"
  | "rating";
export type ItemFormErrors = Partial<Record<ItemFormField, string>>;

type ItemFormValues = Pick<
  LibraryItem,
  "title" | "type" | "status" | "progress" | "total" | "rating" | "unit"
>;

type FormInput = Record<ItemFormField, string> & { unrated: boolean };
type FormResult =
  | { valid: true; values: ItemFormValues }
  | { valid: false; errors: ItemFormErrors };

export function validateItemForm(input: FormInput): FormResult {
  const errors: ItemFormErrors = {};
  const title = input.title.trim();
  const type = input.type as MediaType;
  const status = input.status as LibraryItem["status"];
  const progress = Number(input.progress);
  const total = input.total.trim() === "" ? null : Number(input.total);
  const rating = input.unrated ? null : Number(input.rating);

  if (!title) errors.title = "Isi judul, bukan hanya spasi.";
  else if (title.length > 200) errors.title = "Batasi judul hingga 200 karakter.";
  if (!mediaTypes.some((entry) => entry !== "Semua" && entry === type))
    errors.type = "Pilih kategori yang tersedia.";
  if (!itemStatuses.some((entry) => entry === status))
    errors.status = "Pilih status yang tersedia.";
  if (!input.progress.trim() || !Number.isFinite(progress) || progress < 0)
    errors.progress = "Isi progres dengan angka nol atau lebih.";
  if (total !== null && (!Number.isFinite(total) || total < 0))
    errors.total = "Isi total dengan angka nol atau lebih, atau kosongkan jika belum diketahui.";
  if (!errors.progress && !errors.total && total !== null && progress > total)
    errors.progress = "Progres tidak boleh melebihi total. Perbaiki progres atau total.";
  if (
    rating !== null &&
    (!input.rating.trim() || !Number.isFinite(rating) || rating < 0 || rating > 10)
  )
    errors.rating = "Isi rating dari 0 sampai 10, atau centang Belum dinilai.";
  else if (
    rating !== null &&
    Math.abs(rating * 10 - Math.round(rating * 10)) > 1e-9
  )
    errors.rating = "Gunakan maksimal satu angka di belakang desimal, misalnya 8,7.";

  if (Object.keys(errors).length) return { valid: false, errors };
  return {
    valid: true,
    values: {
      title,
      type,
      status,
      progress,
      total,
      rating: rating === null ? null : Math.round(rating * 10),
      unit: itemUnit(type),
    },
  };
}
