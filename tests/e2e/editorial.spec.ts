import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("editorial page layouts stay accessible across phone, tablet, landscape, and desktop", async ({ page }) => {
  test.setTimeout(180000);
  for (const viewport of [{ width: 375, height: 812 }, { width: 812, height: 375 }, { width: 1024, height: 768 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const route of ["/", "/library", "/journal", "/collections", "/library/rain"]) {
      await page.goto(route);
      await expect(page.locator("main h1")).toHaveCount(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `${route} at ${viewport.width}`).toBe(false);
      const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(audit.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
    }
  }
});

test("curated collection artwork reflects actual membership and journal retains readable typography", async ({ page }) => {
  await page.goto("/collections");
  const shelf = page.locator(".collection-shelf").first();
  await expect(shelf.locator(".shelf-cover img")).toHaveCount(2);
  await shelf.click();
  await page.getByRole("checkbox", { name: /Perpustakaan di Ujung Hujan/ }).uncheck();
  await page.getByRole("link", { name: "Kembali ke koleksi", exact: true }).click();
  await expect(page.locator(".collection-shelf").first().locator(".shelf-cover img")).toHaveCount(1);
  await page.getByRole("navigation", { name: "Navigasi utama", exact: true }).getByRole("link", { name: "Jurnal", exact: true }).click();
  await expect(page.locator(".journal-writer")).toBeVisible();
  await expect(page.locator(".journal-reading")).toBeVisible();
  await page.getByLabel("Judul jurnal", { exact: true }).fill("Kesan pertama");
  await page.getByLabel("Isi jurnal", { exact: true }).fill("Catatan sintetis untuk pemeriksaan desain.");
  await page.getByRole("button", { name: "Tambah catatan demo" }).click();
  const body = page.locator(".journal-note .prose-text");
  expect(await body.evaluate((element) => parseFloat(getComputedStyle(element).lineHeight) / parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(1.8);
});
