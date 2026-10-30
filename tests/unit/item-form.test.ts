import assert from "node:assert/strict";
import test from "node:test";
import { itemUnit, validateItemForm } from "../../src/lib/item-form";

const input = {
  title: "  Cerita baru  ",
  type: "Manhwa",
  status: "Direncanakan",
  progress: "2.5",
  total: "",
  rating: "",
  unrated: true,
};

test("category selects the correct progress unit", () => {
  assert.equal(itemUnit("Manhwa"), "chapter");
  assert.equal(itemUnit("Buku"), "halaman");
  assert.equal(itemUnit("Anime"), "episode");
  assert.equal(itemUnit("Film"), "film");
  assert.equal(itemUnit("Musik"), "sesi");
  assert.equal(itemUnit("Hobi"), "sesi");
});

test("quick add trims titles and retains fractional progress, null total and null rating", () => {
  const result = validateItemForm(input);
  assert.ok(result.valid);
  assert.deepEqual(result.values, {
    title: "Cerita baru",
    type: "Manhwa",
    status: "Direncanakan",
    progress: 2.5,
    total: null,
    rating: null,
    unit: "chapter",
  });
});

test("rating /10 converts to canonical integers with zero distinct from unrated", () => {
  for (let canonical = 0; canonical <= 100; canonical++) {
    const result = validateItemForm({
      ...input,
      rating: String(canonical / 10),
      unrated: false,
    });
    assert.ok(result.valid);
    assert.equal(result.values.rating, canonical);
  }
  const unrated = validateItemForm({ ...input, rating: "0", unrated: true });
  assert.ok(unrated.valid);
  assert.equal(unrated.values.rating, null);
});

test("known total is inclusive and zero is not an unknown total", () => {
  const equal = validateItemForm({ ...input, progress: "2.5", total: "2.5" });
  assert.ok(equal.valid);
  assert.equal(equal.values.status, "Direncanakan");
  const zero = validateItemForm({ ...input, progress: "0", total: "0" });
  assert.ok(zero.valid);
  assert.equal(zero.values.total, 0);
  const exceeded = validateItemForm({ ...input, progress: "0.1", total: "0" });
  assert.ok(!exceeded.valid);
  assert.ok(exceeded.errors.progress);
});

test("empty or whitespace titles and invalid category/status get local errors", () => {
  const result = validateItemForm({
    ...input,
    title: " \t\n ",
    type: "Semua",
    status: "Tidak valid",
  });
  assert.ok(!result.valid);
  assert.deepEqual(Object.keys(result.errors), ["title", "type", "status"]);
});

test("progress requires a finite nonnegative number", () => {
  for (const progress of ["", " ", "-1", "NaN", "Infinity", "1e999", "abc"]) {
    const result = validateItemForm({ ...input, progress });
    assert.ok(!result.valid, progress);
    assert.ok(result.errors.progress, progress);
  }
});

test("total accepts blank but rejects negative and nonfinite values locally", () => {
  for (const total of ["-1", "NaN", "Infinity", "1e999", "abc"]) {
    const result = validateItemForm({ ...input, total });
    assert.ok(!result.valid, total);
    assert.ok(result.errors.total, total);
    assert.equal(result.errors.progress, undefined);
  }
});

test("rated values require finite 0–10 with at most one decimal", () => {
  for (const rating of ["", " ", "-0.1", "10.1", "NaN", "Infinity", "1e999", "8.75"]) {
    const result = validateItemForm({ ...input, rating, unrated: false });
    assert.ok(!result.valid, rating);
    assert.ok(result.errors.rating, rating);
  }
});
