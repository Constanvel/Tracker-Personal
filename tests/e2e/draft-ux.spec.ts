import { test, expect } from "@playwright/test";

const nav = (page: import("@playwright/test").Page) => page.getByRole("navigation", { name: "Navigasi utama", exact: true });

test("private journal and collection drafts survive navigation and clear after submit", async ({ page }) => {
  await page.goto("/journal");
  await page.getByLabel("Judul jurnal", { exact: true }).fill("Draf catatan");
  await page.getByLabel("Isi jurnal", { exact: true }).fill("Tulisan sintetis belum dikirim.");
  await nav(page).getByRole("link", { name: "Koleksi", exact: true }).click();
  await page.getByLabel("Nama koleksi", { exact: true }).fill("Draf koleksi");
  await nav(page).getByRole("link", { name: "Jurnal", exact: true }).click();
  await expect(page.getByLabel("Judul jurnal", { exact: true })).toHaveValue("Draf catatan");
  await expect(page.getByLabel("Isi jurnal", { exact: true })).toHaveValue("Tulisan sintetis belum dikirim.");
  await page.getByRole("button", { name: "Tambah catatan demo" }).click();
  await nav(page).getByRole("link", { name: "Koleksi", exact: true }).click();
  await expect(page.getByLabel("Nama koleksi", { exact: true })).toHaveValue("Draf koleksi");
  await page.getByRole("button", { name: "Buat koleksi demo" }).click();
  await nav(page).getByRole("link", { name: "Jurnal", exact: true }).click();
  await expect(page.getByLabel("Judul jurnal", { exact: true })).toHaveValue("");
  await nav(page).getByRole("link", { name: "Koleksi", exact: true }).click();
  await expect(page.getByLabel("Nama koleksi", { exact: true })).toHaveValue("");
});

test("reset clears drafts and drafts do not enter browser storage", async ({ page }) => {
  await page.goto("/library/new");
  await page.getByLabel("Judul", { exact: true }).fill("Draf sintetis");
  expect(await page.evaluate(() => `${JSON.stringify(localStorage)} ${JSON.stringify(sessionStorage)}`)).not.toContain("Draf sintetis");
  await page.getByRole("link", { name: "Pengaturan", exact: true }).first().click();
  await page.getByRole("button", { name: "Reset sesi demo…", exact: true }).click();
  await page.getByRole("button", { name: "Ya, reset sesi demo", exact: true }).click();
  await nav(page).getByRole("link", { name: /Library/ }).click();
  await page.getByRole("link", { name: /Tambah item/ }).click();
  await expect(page.getByLabel("Judul", { exact: true })).toHaveValue("");
});
