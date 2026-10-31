"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import {
  advanceProgress,
  formatProgress,
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

type ProgressUndo = {
  itemId: string;
  before: number;
  after: number;
  activityId: string;
};

export type SessionDraft = Record<string, string | boolean>;

type DemoContext = {
  getDraft: (key: string) => SessionDraft | undefined;
  saveDraft: (key: string, draft: SessionDraft) => void;
  clearDraft: (key: string) => void;
  items: LibraryItem[];
  activities: DemoActivity[];
  journals: JournalEntry[];
  collections: DemoCollection[];
  settings: DemoSettings;
  setSettings: (settings: DemoSettings) => void;
  updateItem: (item: LibraryItem) => void;
  addItem: (item: LibraryItem) => void;
  incrementItem: (id: string) => void;
  progressNotice: string;
  canUndoProgress: boolean;
  undoProgress: () => void;
  dismissProgressNotice: () => void;
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
  // Private drafts live only in this provider's memory, never browser storage.
  const draftsRef = useRef(new Map<string, SessionDraft>());
  const getDraft = (key: string) => draftsRef.current.get(key);
  const saveDraft = (key: string, draft: SessionDraft) => { draftsRef.current.set(key, draft); };
  const clearDraft = (key: string) => { draftsRef.current.delete(key); };
  const itemsRef = useRef(items);
  const undoRef = useRef<ProgressUndo | null>(null);
  const [progressNotice, setProgressNotice] = useState("");
  const [canUndoProgress, setCanUndoProgress] = useState(false);
  function applyItems(next: LibraryItem[]) {
    itemsRef.current = next;
    setItems(next);
  }
  function dismissProgressNotice() {
    setProgressNotice("");
  }
  function invalidateProgressUndo() {
    undoRef.current = null;
    setCanUndoProgress(false);
    dismissProgressNotice();
  }
  function record(text: string, kind: DemoActivity["kind"], itemId?: string) {
    const id = crypto.randomUUID();
    setActivities((current) => [
      {
        id,
        at: new Date().toISOString(),
        text,
        kind,
        itemId,
      },
      ...current,
    ]);
    return id;
  }
  function updateItem(item: LibraryItem) {
    const previous = itemsRef.current.find((entry) => entry.id === item.id);
    if (
      undoRef.current?.itemId === item.id && previous &&
      (previous.progress !== item.progress || previous.total !== item.total || previous.unit !== item.unit)
    ) invalidateProgressUndo();
    applyItems(
      itemsRef.current.map((entry) => (entry.id === item.id ? item : entry)),
    );
    record(`Diperbarui · ${item.title}`, "edit", item.id);
  }
  function addItem(item: LibraryItem) {
    applyItems([item, ...itemsRef.current]);
    record(`Ditambahkan · ${item.title}`, "item", item.id);
  }
  function incrementItem(id: string) {
    const item = itemsRef.current.find((entry) => entry.id === id);
    if (!item) return;
    const next = advanceProgress(item);
    if (next.progress === item.progress) return;
    applyItems(itemsRef.current.map((entry) => (entry.id === id ? next : entry)));
    const activityId = record(
      `${item.title} · ${formatProgress(next.progress)} ${item.unit}`,
      "progress",
      id,
    );
    undoRef.current = { itemId: id, before: item.progress, after: next.progress, activityId };
    setCanUndoProgress(true);
    setProgressNotice(`${item.title}: ${formatProgress(item.progress)} menjadi ${formatProgress(next.progress)} ${item.unit}. Tercatat di sesi demo.`);
  }
  function undoProgress() {
    const undo = undoRef.current;
    if (!undo) return;
    const item = itemsRef.current.find((entry) => entry.id === undo.itemId);
    if (!item || item.progress !== undo.after) {
      invalidateProgressUndo();
      return;
    }
    applyItems(itemsRef.current.map((entry) =>
      entry.id === item.id ? { ...entry, progress: undo.before } : entry,
    ));
    setActivities((current) => current.filter((entry) => entry.id !== undo.activityId));
    undoRef.current = null;
    setCanUndoProgress(false);
    setProgressNotice(`Perubahan progres ${item.title} diurungkan. Kembali ke ${formatProgress(undo.before)} ${item.unit}.`);
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
    draftsRef.current.clear();
    applyItems(initialLibrary);
    invalidateProgressUndo();
    setActivities([]);
    setJournals([]);
    setCollections(defaultCollections);
    setSettings(defaults);
  }
  return (
    <Context.Provider
      value={{
        getDraft,
        saveDraft,
        clearDraft,
        items,
        activities,
        journals,
        collections,
        settings,
        setSettings,
        updateItem,
        addItem,
        incrementItem,
        progressNotice,
        canUndoProgress,
        undoProgress,
        dismissProgressNotice,
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
