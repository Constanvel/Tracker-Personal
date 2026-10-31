import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("exact position records a large jump, correction and fractional value with undo", async ({ page }) => {
  await page.goto("/library/forest");
  const trigger = page.getByRole("button", { name: /^Catat progres:/ });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByLabel("Posisi terbaru")).toBeFocused();
  await dialog.getByLabel("Posisi terbaru").fill("100");
  await dialog.getByRole("button", { name: "Simpan progres" }).click();
  await expect(page.locator(".big-number")).toContainText("100 / 300");
  await expect(trigger).toBeFocused();
  await page.getByRole("button", { name: "Tutup pemberitahuan progres" }).click();
  await page.getByRole("button", { name: "Urungkan", exact: true }).click();
  await expect(page.locator(".big-number")).toContainText("75 / 300");
  await trigger.click();
  await dialog.getByLabel("Posisi terbaru").fill("0.0001");
  await dialog.getByRole("button", { name: "Simpan progres" }).click();
  await expect(page.locator(".big-number")).toContainText("0,0001 / 300");
  await expect(page.locator(".activity-entry")).toContainText("Koreksi progres");
  await page.getByRole("button", { name: "Urungkan", exact: true }).click();
  await expect(page.locator(".big-number")).toContainText("75 / 300");
  await trigger.click();
  await page.getByRole("button", { name: /Tambah 1 halaman:/ }).evaluate((button) => (button as HTMLButtonElement).click());
  await dialog.getByLabel("Posisi terbaru").fill("90");
  await dialog.getByRole("button", { name: "Simpan progres" }).click();
  await expect(dialog.getByRole("alert")).toContainText("berubah");
  await expect(page.locator(".big-number")).toContainText("76 / 300");
  await page.keyboard.press("Escape");
});

test("exact editor validates, cancels, no-ops and stays accessible on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/library/forest");
  const trigger = page.getByRole("button", { name: /^Catat progres:/ });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  for (const value of ["", "-1", "301"]) {
    await dialog.getByLabel("Posisi terbaru").fill(value);
    await dialog.getByRole("button", { name: "Simpan progres" }).click();
    await expect(dialog.getByRole("alert")).toBeVisible();
  }
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("button", { name: "Simpan progres" }).click();
  await expect(page.getByRole("button", { name: "Urungkan", exact: true })).toHaveCount(0);
  await expect(page.locator(".activity-entry")).toHaveCount(0);
  await trigger.click();
  await dialog.getByLabel("Posisi terbaru").fill("100");
  await dialog.getByRole("button", { name: "Batal", exact: true }).click();
  await expect(page.locator(".big-number")).toContainText("75 / 300");
});
