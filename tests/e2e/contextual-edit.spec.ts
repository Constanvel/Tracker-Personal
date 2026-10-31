import { test, expect, type Page } from "@playwright/test";

const save = (page: Page) => page.getByRole("button", { name: "Simpan di sesi demo", exact: true });
const disclosure = (page: Page) => page.locator("details.form-disclosure");
const optionalDetails = (page: Page) => page.getByText("Detail opsional: kreator, total, rating & kesan", { exact: true });
const nav = (page: Page) => page.getByRole("navigation", { name: "Navigasi utama", exact: true });

test("general edit keeps core fields and one save action before collapsed details", async ({ page }) => {
  await page.goto("/library/forest");
  const progress = await page.locator(".big-number").innerText();
  const note = await page.locator(".prose-text").first().innerText();
  const rating = await page.locator(".rating-badge").innerText();
  await page.getByRole("link", { name: "Edit item", exact: true }).click();
  await expect(page).toHaveURL(/\/library\/forest\/edit$/);
  await expect(disclosure(page)).not.toHaveAttribute("open");
  await expect(page.getByLabel("Progres", { exact: true })).toBeVisible();
  await expect(save(page)).toHaveCount(1);
  expect(await save(page).evaluate((button) => Boolean(button.compareDocumentPosition(document.querySelector("details.form-disclosure")!) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  await save(page).click();
  await expect(page).toHaveURL(/\/library\/forest\?saved=1$/);
  await expect(page.locator(".big-number")).toHaveText(progress);
  await expect(page.locator(".prose-text").first()).toHaveText(note);
  await expect(page.locator(".rating-badge")).toHaveText(rating);
});

test("Edit kesan opens and focuses the existing note without changing item identity", async ({ page }) => {
  await page.goto("/library/rain");
  await expect(page.getByRole("link", { name: "Edit kesan", exact: true })).toHaveAttribute("href", "/library/rain/edit?section=note");
  await page.getByRole("link", { name: "Edit kesan", exact: true }).click();
  await expect(page).toHaveURL(/\/library\/rain\/edit\?section=note$/);
  await expect(disclosure(page)).toHaveAttribute("open", "");
  await expect(page.getByLabel("Kesan singkat", { exact: true })).toBeFocused();
  await page.getByLabel("Kesan singkat", { exact: true }).fill("Kesan sintetis 雨, dari edit kontekstual.");
  await save(page).click();
  await expect(page).toHaveURL(/\/library\/rain\?saved=1$/);
  await expect(page.locator(".prose-text").first()).toHaveText("Kesan sintetis 雨, dari edit kontekstual.");
});

for (const query of ["section=unknown", "section=NOTE", "section=note&section=unknown"]) {
  test(`invalid intent falls back to general edit: ${query}`, async ({ page }) => {
    await page.goto(`/library/rain/edit?${query}&q=rain&view=list`);
    await expect(disclosure(page)).not.toHaveAttribute("open");
    await expect(page.getByLabel("Judul", { exact: true })).toHaveValue("Perpustakaan di Ujung Hujan");
    await expect(page.getByLabel("Kesan singkat", { exact: true })).not.toBeFocused();
    await expect(page).toHaveURL(`/library/rain/edit?${query}&q=rain&view=list`);
  });
}

test("intent navigation and leaving the editor retain all draft inputs and unrelated query", async ({ page }) => {
  await page.goto("/library/forest/edit?q=forest&view=list");
  await page.getByLabel("Judul", { exact: true }).fill("Draf kontekstual 雨");
  await page.getByLabel("Progres", { exact: true }).fill("80.5");
  // Next's native history integration changes query intent without remounting the editor.
  await page.evaluate(() => {
    const url = new URL(location.href);
    url.searchParams.set("section", "note");
    history.pushState(null, "", url);
  });
  await expect(page.getByLabel("Kesan singkat", { exact: true })).toBeFocused();
  await page.getByLabel("Kesan singkat", { exact: true }).fill("Draf kesan belum disimpan.");
  await expect(page).toHaveURL(/q=forest&view=list&section=note$/);
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("80.5");
  await page.goBack();
  await expect(disclosure(page)).not.toHaveAttribute("open");
  await expect(page.getByLabel("Judul", { exact: true })).toHaveValue("Draf kontekstual 雨");
  await nav(page).getByRole("link", { name: "Beranda", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expect(disclosure(page)).not.toHaveAttribute("open");
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("80.5");
  await optionalDetails(page).click();
  await expect(page.getByLabel("Kesan singkat", { exact: true })).toHaveValue("Draf kesan belum disimpan.");
  await page.getByRole("link", { name: "Batal", exact: true }).click();
  await expect(page).toHaveURL(/\/library\/forest$/);
  await page.getByRole("link", { name: "Edit kesan", exact: true }).click();
  await expect(page.getByLabel("Judul", { exact: true })).not.toHaveValue("Draf kontekstual 雨");
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("75");
  await expect(page.getByLabel("Kesan singkat", { exact: true })).not.toHaveValue("Draf kesan belum disimpan.");
});

test("a hidden optional error opens details and focuses its field; multiple errors expose links", async ({ page }) => {
  await page.goto("/library/rain/edit?section=note");
  await expect(page.getByLabel("Kesan singkat", { exact: true })).toBeFocused();
  await page.getByRole("checkbox", { name: "Belum dinilai", exact: true }).uncheck();
  await page.getByLabel("Rating", { exact: true }).fill("10.1");
  await optionalDetails(page).click();
  await expect(disclosure(page)).not.toHaveAttribute("open");
  await save(page).click();
  await expect(disclosure(page)).toHaveAttribute("open", "");
  await expect(page.getByLabel("Rating", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Rating", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Total", { exact: true }).fill("-1");
  await page.getByLabel("Judul", { exact: true }).fill("   ");
  await optionalDetails(page).click();
  await save(page).click();
  await expect(disclosure(page)).toHaveAttribute("open", "");
  await expect(page.locator("#item-error-summary")).toBeFocused();
  await expect(page.locator("#item-error-summary a")).toHaveCount(3);
  await page.getByLabel("Judul", { exact: true }).fill("Perpustakaan di Ujung Hujan");
  await page.locator('#item-error-summary a[href="#item-total"]').click();
  await expect(page.getByLabel("Total", { exact: true })).toBeFocused();
  await page.getByLabel("Total", { exact: true }).fill("");
  await page.getByLabel("Rating", { exact: true }).fill("0");
  await save(page).click();
  await expect(page.locator(".rating-badge")).toHaveText("0/10");
  await page.getByRole("link", { name: "Edit kesan", exact: true }).click();
  await expect(page.getByLabel("Kesan singkat", { exact: true })).toBeFocused();
  await page.getByRole("checkbox", { name: "Belum dinilai", exact: true }).check();
  await save(page).click();
  await expect(page.locator(".rating-badge")).toHaveText("Belum dinilai");
});

test("Undo while contextual edit is open updates progress without discarding the note draft", async ({ page }) => {
  await page.goto("/library/city");
  const initialProgress = await page.locator(".big-number").innerText();
  await page.getByRole("button", { name: /Tambah 1 episode:/ }).click();
  await page.getByRole("link", { name: "Edit kesan", exact: true }).click();
  await expect(page.getByLabel("Kesan singkat", { exact: true })).toBeFocused();
  await page.getByLabel("Kesan singkat", { exact: true }).fill("Kesan dipertahankan setelah Undo.");
  await page.getByRole("button", { name: "Urungkan", exact: true }).click();
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("6");
  await expect(page.getByLabel("Kesan singkat", { exact: true })).toHaveValue("Kesan dipertahankan setelah Undo.");
  await page.getByRole("navigation", { name: "Navigasi utama", exact: true }).getByRole("link", { name: "Beranda", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("6");
  await expect(page.getByLabel("Kesan singkat", { exact: true })).toHaveValue("Kesan dipertahankan setelah Undo.");
  await save(page).click();
  await expect(page.locator(".big-number")).toHaveText(initialProgress);
  await expect(page.locator(".prose-text").first()).toHaveText("Kesan dipertahankan setelah Undo.");
});

for (const width of [360, 390]) {
  test(`editor actions remain in flow and fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/library/forest/edit");
    await expect(disclosure(page)).not.toHaveAttribute("open");
    await save(page).scrollIntoViewIfNeeded();
    const bounds = await save(page).boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(await page.locator(".item-editor-actions").evaluate((element) => getComputedStyle(element).position)).toBe("static");
    await optionalDetails(page).click();
    await page.getByLabel("Kesan singkat", { exact: true }).fill("Kesan sintetis untuk pemeriksaan ponsel.");
    await save(page).click();
    await expect(page.locator(".prose-text").first()).toHaveText("Kesan sintetis untuk pemeriksaan ponsel.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  });
}
