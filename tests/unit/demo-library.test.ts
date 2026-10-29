import assert from "node:assert/strict";
import test from "node:test";
import {
  advanceProgress,
  filterLibrary,
  formatRating,
  initialLibrary,
} from "../../src/lib/demo-library";

test("rating null and zero stay distinct; internal integer preserves fractional display", () => {
  assert.equal(formatRating(null), "Belum dinilai");
  assert.equal(formatRating(0), "0/10");
  assert.equal(formatRating(87), "8,7/10");
});

test("search covers titles, creators and notes with case folding", () => {
  assert.equal(
    filterLibrary(initialLibrary, "  HUJAN ", "Semua")[0]?.id,
    "rain",
  );
  assert.equal(
    filterLibrary(initialLibrary, "aki mori", "Anime")[0]?.id,
    "city",
  );
  assert.equal(filterLibrary(initialLibrary, "rumah", "Buku")[0]?.id, "forest");
  assert.equal(filterLibrary(initialLibrary, "hujan", "Film").length, 0);
  assert.equal(
    filterLibrary(initialLibrary, "tidak ditemukan", "Semua").length,
    0,
  );
});

test("favorites compose with category and search", () => {
  assert.equal(filterLibrary(initialLibrary, "", "Semua", true).length, 3);
  assert.equal(filterLibrary(initialLibrary, "", "Buku", true).length, 0);
});

test("fractional progress and unknown total survive an update", () => {
  const item = initialLibrary[0];
  const result = advanceProgress(item);
  assert.equal(result.progress, 43.5);
  assert.equal(result.total, null);
  assert.equal(result.status, "Sedang dijalani");
  assert.equal(item.progress, 42.5, "update must not mutate input");
});

test("known total is not exceeded and completion remains explicit", () => {
  const item = { ...initialLibrary[3], progress: 11 };
  const result = advanceProgress(item);
  assert.equal(result.progress, 12);
  assert.equal(result.status, "Sedang dijalani");
  assert.equal(advanceProgress(result).progress, 12);
});

test("demo IDs and original covers are consistent", () => {
  assert.equal(
    new Set(initialLibrary.map((item) => item.id)).size,
    initialLibrary.length,
  );
  assert.ok(
    initialLibrary.every(
      (item) =>
        item.rating === null ||
        (Number.isInteger(item.rating) &&
          item.rating >= 0 &&
          item.rating <= 100),
    ),
  );
  assert.equal(
    initialLibrary.filter((item) => item.status === "Sedang dijalani").length,
    4,
  );
});
