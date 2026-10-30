import { test, expect } from "@playwright/test";

test("journal errors identify each field and search can recover from no results", async ({ page }) => {
  await page.goto("/journal");
  const title = page.getByLabel("Judul jurnal", { exact: true });
  const text = page.getByLabel("Isi jurnal", { exact: true });
  const submit = page.getByRole("button", { name: "Tambah catatan demo" });

  await submit.click();
  await expect(title).toBeFocused();
  await expect(title).toHaveAttribute("aria-invalid", "true");
  await expect(title).toHaveAttribute("aria-describedby", "journal-title-error");
  await expect(text).toHaveAttribute("aria-invalid", "true");
  await expect(text).toHaveAttribute("aria-describedby", "journal-text-error");
  await expect(page.locator("#journal-title-error")).toContainText("Judul jurnal wajib diisi");
  await expect(page.locator("#journal-text-error")).toContainText("Isi jurnal wajib diisi");

  await title.fill("Catatan pengujian");
  await text.fill("   ");
  await submit.click();
  await expect(text).toBeFocused();
  await expect(title).toHaveAttribute("aria-invalid", "false");
  await expect(title).not.toHaveAttribute("aria-describedby");
  await expect(text).toHaveValue("   ");

  await text.fill("Cerita yang ingin disimpan selama sesi ini.");
  await submit.click();
  await expect(title).toHaveValue("");
  await expect(text).toHaveValue("");
  await expect(page.locator(".journal-note").filter({ hasText: "Catatan pengujian" })).toBeVisible();
  await expect(text).toHaveAttribute("aria-invalid", "false");
  await expect(page.locator(".form-error")).toHaveCount(0);

  const search = page.getByLabel("Cari jurnal", { exact: true });
  await search.fill("pencarian-tidak-ada-12345");
  await expect(page.locator(".journal-note")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Tidak ada jurnal yang cocok." })).toBeVisible();
  await page.getByRole("button", { name: "Hapus pencarian", exact: true }).click();
  await expect(search).toHaveValue("");
  await expect(search).toBeFocused();
  await expect(page.locator(".journal-note").filter({ hasText: "Catatan pengujian" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hapus pencarian", exact: true })).toHaveCount(0);
});

test("collection validation focuses its invalid field and preserves the description", async ({ page }) => {
  await page.goto("/collections");
  const name = page.getByLabel("Nama koleksi", { exact: true });
  const description = page.getByLabel("Deskripsi (opsional)", { exact: true });
  const submit = page.getByRole("button", { name: "Buat koleksi demo" });

  await name.fill("   ");
  await description.fill("Deskripsi yang tetap ada setelah validasi.");
  await submit.click();
  await expect(name).toBeFocused();
  await expect(name).toHaveAttribute("aria-invalid", "true");
  await expect(name).toHaveAttribute("aria-describedby", "collection-name-error");
  await expect(page.locator("#collection-name-error")).toContainText("Nama koleksi wajib diisi");
  await expect(description).toHaveValue("Deskripsi yang tetap ada setelah validasi.");
  await expect(description).toHaveAttribute("aria-invalid", "false");

  await name.fill("Koleksi pengujian");
  await submit.click();
  await expect(name).toHaveValue("");
  await expect(description).toHaveValue("");
  await expect(name).toHaveAttribute("aria-invalid", "false");
  await expect(name).not.toHaveAttribute("aria-describedby");
  await expect(page.locator(".form-error")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Koleksi pengujian", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Koleksi dibuat dalam sesi demo");
});
