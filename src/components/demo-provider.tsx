"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  advanceProgress,
  initialLibrary,
  type LibraryItem,
} from "@/lib/demo-library";
import { defaultCollections } from "@/lib/routes";

export type DemoActivity = {
  id: string;
  itemId?: string;
  text: string;
  at: string;
  kind: "progress" | "item" | "journal" | "edit";
};
export type JournalEntry = {
  id: string;
  itemId?: string;
  title: string;
  text: string;
  at: string;
};
export type DemoCollection = {
  id: string;
  name: string;
  description: string;
  itemIds: string[];
};
export type DemoSettings = {
  solid: boolean;
  timeZone: string;
  language: string;
};
const defaults: DemoSettings = {
  solid: false,
  timeZone: "Asia/Jakarta",
  language: "id",
};

type DemoContext = {
  items: LibraryItem[];
  activities: DemoActivity[];
  journals: JournalEntry[];
  collections: DemoCollection[];
  settings: DemoSettings;
  setSettings: (settings: DemoSettings) => void;
  updateItem: (item: LibraryItem) => void;
  addItem: (item: LibraryItem) => void;
  incrementItem: (id: string) => void;
  addJournal: (entry: Omit<JournalEntry, "id" | "at">) => void;
  addCollection: (name: string, description: string) => string;
  updateCollection: (collection: DemoCollection) => void;
  resetDemo: () => void;
};
const Context = createContext<DemoContext | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LibraryItem[]>(initialLibrary);
  const [activities, setActivities] = useState<DemoActivity[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [collections, setCollections] =
    useState<DemoCollection[]>(defaultCollections);
  const [settings, setSettings] = useState(defaults);
  function record(text: string, kind: DemoActivity["kind"], itemId?: string) {
    setActivities((current) => [
      {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        text,
        kind,
        itemId,
      },
      ...current,
    ]);
  }
  function updateItem(item: LibraryItem) {
    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? item : entry)),
    );
    record(`Diperbarui · ${item.title}`, "edit", item.id);
  }
  function addItem(item: LibraryItem) {
    setItems((current) => [item, ...current]);
    record(`Ditambahkan · ${item.title}`, "item", item.id);
  }
  function incrementItem(id: string) {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    const next = advanceProgress(item);
    if (next.progress === item.progress) return;
    setItems((current) =>
      current.map((entry) => (entry.id === id ? next : entry)),
    );
    record(
      `${item.title} · ${next.progress.toLocaleString("id-ID")} ${item.unit}`,
      "progress",
      id,
    );
  }
  function addJournal(entry: Omit<JournalEntry, "id" | "at">) {
    const journal = {
      ...entry,
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
    };
    setJournals((current) => [journal, ...current]);
    record(`Jurnal · ${journal.title}`, "journal", entry.itemId);
  }
  function addCollection(name: string, description: string) {
    const id = crypto.randomUUID();
    setCollections((current) => [
      ...current,
      { id, name, description, itemIds: [] },
    ]);
    return id;
  }
  function updateCollection(collection: DemoCollection) {
    setCollections((current) =>
      current.map((entry) => (entry.id === collection.id ? collection : entry)),
    );
  }
  function resetDemo() {
    setItems(initialLibrary);
    setActivities([]);
    setJournals([]);
    setCollections(defaultCollections);
    setSettings(defaults);
  }
  return (
    <Context.Provider
      value={{
        items,
        activities,
        journals,
        collections,
        settings,
        setSettings,
        updateItem,
        addItem,
        incrementItem,
        addJournal,
        addCollection,
        updateCollection,
        resetDemo,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("useDemo requires DemoProvider");
  return value;
}
