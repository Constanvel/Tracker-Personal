"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import {
  advanceProgress,
  formatProgress,
  initialLibrary,
  type LibraryItem,
} from "@/lib/demo-library";
import { defaultCollections } from "@/lib/routes";
import { progressError, type ProgressSnapshot } from "@/lib/progress";

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
  sessionVersion: number;
  setItemProgress: (id: string, value: number, expected?: ProgressSnapshot) => string | null;
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
  const [sessionVersion, setSessionVersion] = useState(0);
  const sessionVersionRef = useRef(0);
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
  function setItemProgress(id: string, value: number, expected?: ProgressSnapshot): string | null {
    const item = itemsRef.current.find((entry) => entry.id === id);
    if (!item) return "Item tidak tersedia. Tutup editor dan buka kembali library.";
    if (expected && (expected.sessionVersion !== sessionVersionRef.current ||
        expected.progress !== item.progress || expected.total !== item.total || expected.unit !== item.unit)) {
      return "Progres, satuan, atau sesi berubah. Tutup dan buka kembali editor untuk memakai data terbaru.";
    }
    const error = progressError(value, item.total);
    if (error) return error;
    if (value === item.progress) return null;
    applyItems(itemsRef.current.map((entry) => entry.id === id ? { ...entry, progress: value } : entry));
    const correction = value < item.progress ? "Koreksi progres · " : "";
    const activityId = record(`${correction}${item.title} · ${formatProgress(value)} ${item.unit}`, "progress", id);
    undoRef.current = { itemId: id, before: item.progress, after: value, activityId };
    setCanUndoProgress(true);
    setProgressNotice(`${item.title}: ${formatProgress(item.progress)} menjadi ${formatProgress(value)} ${item.unit}. Tercatat di sesi demo.`);
    return null;
  }
  function incrementItem(id: string) {
    const item = itemsRef.current.find((entry) => entry.id === id);
    if (item) setItemProgress(id, advanceProgress(item).progress);
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
    sessionVersionRef.current += 1;
    setSessionVersion(sessionVersionRef.current);
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
        setItemProgress,
        sessionVersion,
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
