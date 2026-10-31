export function progressError(value: number, total: number | null): string | null {
  if (!Number.isFinite(value) || value < 0) return "Isi progres dengan angka nol atau lebih.";
  if (total !== null && value > total) return "Progres tidak boleh melebihi total terbaru.";
  return null;
}

export type ProgressSnapshot = {
  progress: number;
  total: number | null;
  unit: string;
  sessionVersion: number;
};
