import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("recording surfaces retain focus, contrast and layout across responsive and zoomed views", async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 390, 360, 740]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/library");
    await page.screenshot({ path: `test-results/recording-library-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: /^Catat progres:/ }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByLabel("Posisi terbaru")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(dialog.getByRole("button", { name: "Tutup editor progres" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByLabel("Posisi terbaru")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Batal", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog.getByRole("button", { name: "Simpan progres" })).toBeFocused();
    await dialog.getByLabel("Posisi terbaru").fill("44");
    for (const button of await dialog.getByRole("button").all()) {
      const bounds = await button.boundingBox();
      expect(bounds!.width).toBeGreaterThanOrEqual(44);
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
    }
    await page.screenshot({ path: `test-results/recording-dialog-${width}.png` });
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await dialog.getByRole("button", { name: "Simpan progres" }).click();
    await page.getByRole("button", { name: "Tutup pemberitahuan progres" }).click();
    await expect(page.getByRole("button", { name: "Urungkan", exact: true })).toBeVisible();
    expect(await page.locator(".progress-feedback").evaluate((element) => getComputedStyle(element).position)).toBe("static");
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Urungkan", exact: true }).click();
    await page.goto("/library/rain/edit?section=note");
    await expect(page.getByLabel("Kesan singkat", { exact: true })).toBeFocused();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/recording-edit-${width}.png`, fullPage: true });
  }
  // A 720×500 CSS viewport simulates reflow from 1440×1000 at 200% browser zoom.
  // CSS zoom is not equivalent: it scales native dialog viewport units a second time.
  await page.setViewportSize({ width: 720, height: 500 });
  await page.goto("/library/forest");
  await page.getByRole("button", { name: /^Catat progres:/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Posisi terbaru")).toBeFocused();
  await dialog.getByRole("button", { name: "Simpan progres" }).scrollIntoViewIfNeeded();
  const bounds = await dialog.getByRole("button", { name: "Simpan progres" }).boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(720);
  expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(500);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: /^Catat progres:/ })).toBeFocused();
  expect(errors).toEqual([]);
});
