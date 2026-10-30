export const mediaTypes = [
  "Semua",
  "Manhwa",
  "Buku",
  "Film",
  "Anime",
  "Musik",
  "Hobi",
] as const;
export type MediaType = Exclude<(typeof mediaTypes)[number], "Semua">;
export type LibraryItem = {
  id: string;
  title: string;
  creator: string;
  type: MediaType;
  status: "Sedang dijalani" | "Direncanakan" | "Selesai";
  progress: number;
  total: number | null;
  unit: "chapter" | "halaman" | "episode" | "sesi" | "film";
  rating: number | null;
  favorite: boolean;
  cover: "rain" | "orbit" | "forest" | "city" | "music" | "guitar";
  note: string;
};

// Original synthetic titles. This data is public demo content, never a private archive.
export const initialLibrary: LibraryItem[] = [
  {
    id: "rain",
    title: "Perpustakaan di Ujung Hujan",
    creator: "Han Sora",
    type: "Manhwa",
    status: "Sedang dijalani",
    progress: 42.5,
    total: null,
    unit: "chapter",
    rating: 87,
    favorite: true,
    cover: "rain",
    note: "Dunia yang tenang, dengan kejutan kecil di setiap chapter.",
  },
  {
    id: "forest",
    title: "Surat dari Musim Kelima",
    creator: "Nara Prameswari",
    type: "Buku",
    status: "Sedang dijalani",
    progress: 75,
    total: 300,
    unit: "halaman",
    rating: null,
    favorite: false,
    cover: "forest",
    note: "Simpan kutipan tentang rumah untuk dibaca lagi.",
  },
  {
    id: "orbit",
    title: "Satu Hari di Orbit",
    creator: "Studio Lintang",
    type: "Film",
    status: "Direncanakan",
    progress: 0,
    total: 1,
    unit: "film",
    rating: null,
    favorite: false,
    cover: "orbit",
    note: "Untuk malam akhir pekan.",
  },
  {
    id: "city",
    title: "Peta Kota Senja",
    creator: "Aki Mori",
    type: "Anime",
    status: "Sedang dijalani",
    progress: 6,
    total: 12,
    unit: "episode",
    rating: 90,
    favorite: true,
    cover: "city",
    note: "Warna kota dan musiknya terasa hangat.",
  },
  {
    id: "music",
    title: "Nada untuk Jendela",
    creator: "Ruang Teduh",
    type: "Musik",
    status: "Selesai",
    progress: 1,
    total: null,
    unit: "sesi",
    rating: 0,
    favorite: true,
    cover: "music",
    note: "Contoh rating nol: berbeda dari belum dinilai.",
  },
  {
    id: "guitar",
    title: "Petikan Sore",
    creator: "Latihan gitar pribadi",
    type: "Hobi",
    status: "Sedang dijalani",
    progress: 8,
    total: null,
    unit: "sesi",
    rating: null,
    favorite: false,
    cover: "guitar",
    note: "Latihan perpindahan akor selama 25 menit.",
  },
];

export function formatRating(value: number | null): string {
  return value === null
    ? "Belum dinilai"
    : `${(value / 10).toLocaleString("id-ID", { maximumFractionDigits: 1 })}/10`;
}

export function filterLibrary(
  items: LibraryItem[],
  query: string,
  type: string,
  favoritesOnly = false,
) {
  const needle = query.trim().toLocaleLowerCase("id-ID");
  return items.filter(
    (item) =>
      (type === "Semua" || item.type === type) &&
      (!favoritesOnly || item.favorite) &&
      `${item.title} ${item.creator} ${item.note}`
        .toLocaleLowerCase("id-ID")
        .includes(needle),
  );
}

export function formatProgress(value: number) {
  return value.toLocaleString("id-ID", { maximumSignificantDigits: 21 });
}

export function advanceProgress(item: LibraryItem): LibraryItem {
  // Progress never changes consumption status implicitly. Unknown totals stay unknown.
  return {
    ...item,
    progress:
      item.total === null
        ? item.progress + 1
        : Math.min(item.total, item.progress + 1),
  };
}
