export const routes = {
  home: "/",
  library: "/library",
  favorites: "/favorites",
  activity: "/activity",
  journal: "/journal",
  collections: "/collections",
  statistics: "/statistics",
  data: "/data",
  settings: "/settings",
  help: "/help",
  newItem: "/library/new",
} as const;

export const itemPath = (id: string) => `/library/${encodeURIComponent(id)}`;
export const editItemPath = (id: string) => `${itemPath(id)}/edit`;
export const collectionPath = (id: string) =>
  `/collections/${encodeURIComponent(id)}`;
export const defaultCollections = [
  {
    id: "slow-reading",
    name: "Bacaan pelan-pelan",
    description: "Bacaan yang ingin dinikmati tanpa terburu-buru.",
    itemIds: ["rain", "forest"],
  },
  {
    id: "weekend",
    name: "Akhir pekan",
    description: "Cerita untuk waktu luang.",
    itemIds: ["orbit", "city"],
  },
];
