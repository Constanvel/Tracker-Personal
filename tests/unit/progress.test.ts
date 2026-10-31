import assert from "node:assert/strict";
import test from "node:test";
import { progressError } from "../../src/lib/progress";

test("exact progress accepts fractional positions and distinguishes zero and unknown total", () => {
  assert.equal(progressError(100, 300), null);
  assert.equal(progressError(0.0001, null), null);
  assert.equal(progressError(0, 0), null);
  assert.equal(progressError(100, null), null);
});
test("exact progress rejects invalid and out-of-bounds positions", () => {
  for (const value of [NaN, Infinity, -1]) assert.ok(progressError(value, null));
  assert.ok(progressError(1, 0));
  assert.ok(progressError(301, 300));
});
