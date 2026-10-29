import assert from "node:assert/strict";
import test from "node:test";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  routes,
  itemPath,
  editItemPath,
  collectionPath,
  defaultCollections,
} from "../../src/lib/routes";
import { initialLibrary } from "../../src/lib/demo-library";

test("every advertised static route has a concrete Next page", () => {
  for (const route of Object.values(routes))
    assert.ok(
      existsSync(join(process.cwd(), "src/app", route, "page.tsx")),
      `${route} needs a page`,
    );
  for (const route of [
    "library/[id]",
    "library/[id]/edit",
    "collections/[id]",
    "data/[section]",
    "settings/[section]",
    "more",
  ])
    assert.ok(
      existsSync(join(process.cwd(), "src/app", route, "page.tsx")),
      `${route} needs a page`,
    );
});
test("route helpers encode IDs as a single path segment", () => {
  assert.equal(itemPath("a/b?c"), "/library/a%2Fb%3Fc");
  assert.equal(editItemPath("rain"), "/library/rain/edit");
  assert.equal(collectionPath("a b"), "/collections/a%20b");
});
test("default collections contain distinct existing library IDs", () => {
  const ids = new Set(initialLibrary.map((item) => item.id));
  for (const collection of defaultCollections) {
    assert.equal(new Set(collection.itemIds).size, collection.itemIds.length);
    assert.ok(collection.itemIds.every((id) => ids.has(id)));
  }
});
