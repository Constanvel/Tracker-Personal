import { test, expect } from "@playwright/test";

async function leaveAndReturn(page: import("@playwright/test").Page) {
  await page.getByRole("navigation", { name: "Navigasi utama", exact: true }).getByRole("link", { name: "Beranda", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goBack();
}

test("category changes require an explicit unit decision and persist the chosen numbers", async ({ page }) => {
  await page.goto("/library/forest/edit");
  await page.getByLabel("Kategori", { exact: true }).selectOption("Film");
  await expect(page.getByRole("heading", { name: "Ubah satuan progres?" })).toBeFocused();
  await expect(page.getByLabel("Kategori", { exact: true })).toHaveValue("Buku");
  await expect(page.getByRole("button", { name: "Simpan di sesi demo" })).toBeDisabled();
  await page.getByRole("button", { name: "Batal ubah kategori" }).click();
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("75");
  await page.getByLabel("Kategori", { exact: true }).selectOption("Film");
  await page.getByRole("button", { name: "Pertahankan angka" }).click();
  await expect(page.getByLabel("Kategori", { exact: true })).toHaveValue("Film");
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("75");
  await page.getByLabel("Kategori", { exact: true }).selectOption("Hobi");
  await page.getByRole("button", { name: "Mulai dari nol" }).click();
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("0");
  await expect(page.getByLabel("Total", { exact: true })).toHaveValue("");
  await leaveAndReturn(page);
  await expect(page.getByLabel("Kategori", { exact: true })).toHaveValue("Hobi");
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("0");
  await expect(page.getByLabel("Total", { exact: true })).toHaveValue("");
});

test("item drafts survive navigation but explicit cancellation discards them", async ({ page }) => {
  await page.goto("/library/new");
  await page.getByLabel("Judul", { exact: true }).fill("Draf 雨");
  await page.getByLabel("Kategori", { exact: true }).selectOption("Hobi");
  await page.getByLabel("Progres", { exact: true }).fill("2.5");
  await page.locator("summary").click();
  await page.getByRole("checkbox", { name: "Belum dinilai", exact: true }).uncheck();
  await page.getByLabel("Rating", { exact: true }).fill("8.7");
  await leaveAndReturn(page);
  await expect(page.getByLabel("Judul", { exact: true })).toHaveValue("Draf 雨");
  await expect(page.getByLabel("Kategori", { exact: true })).toHaveValue("Hobi");
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("2.5");
  await page.locator("summary").click();
  await expect(page.getByLabel("Rating", { exact: true })).toBeEnabled();
  await expect(page.getByLabel("Rating", { exact: true })).toHaveValue("8.7");
  await page.getByRole("link", { name: "Batal", exact: true }).click();
  await expect(page).toHaveURL(/\/library$/);
  await page.goBack();
  await expect(page.getByLabel("Judul", { exact: true })).toHaveValue("");
});

test("multiple validation errors expose a linked focusable summary", async ({ page }) => {
  await page.goto("/library/new");
  await page.getByLabel("Progres", { exact: true }).fill("-1");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page.locator("#item-error-summary")).toBeFocused();
  await expect(page.locator("#item-error-summary a")).toHaveCount(2);
  await page.locator('#item-error-summary a[href="#item-progress"]').click();
  await expect(page.getByLabel("Progres", { exact: true })).toBeFocused();
});
