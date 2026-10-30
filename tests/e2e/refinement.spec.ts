import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("rapid increments undo only the latest change and preserve unrelated favorite edits", async ({ page }) => {
  await page.goto("/library/rain");
  const increment = page.getByRole("button", { name: /Tambah 1 chapter:/ });
  await increment.evaluate((button) => { (button as HTMLButtonElement).click(); (button as HTMLButtonElement).click(); });
  await expect(page.locator(".big-number")).toContainText("44,5");
  await expect(page.locator(".activity-entry")).toHaveCount(2);
  await page.getByRole("button", { name: "Hapus favorit", exact: true }).click();
  await page.getByRole("button", { name: "Urungkan", exact: true }).click();
  await expect(page.locator(".big-number")).toContainText("43,5");
  await expect(page.locator(".activity-entry")).toHaveCount(2); // prior increment + favorite edit
  await expect(page.getByRole("button", { name: "Jadikan favorit", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Urungkan", exact: true })).toHaveCount(0);
  await expect(page.locator(".progress-feedback")).toContainText("diurungkan");
  await page.getByRole("button", { name: "Tutup pemberitahuan progres" }).click();
  await expect(page.locator(".progress-feedback")).toHaveCount(0);
  await increment.click();
  await page.locator(".progress-feedback").evaluate((element) => {
    const notice = element.getBoundingClientRect();
    const button = document.createElement("button");
    button.textContent = "Focus regression probe";
    button.style.cssText = `position:fixed;left:${notice.left}px;top:${notice.top}px;width:60px;height:44px`;
    document.querySelector("main")!.appendChild(button);
    button.focus();
    button.remove();
  });
  await expect(page.locator(".progress-feedback")).toHaveCount(0);
});

test("fractional cap stays explicit, undo restores progress, edits invalidate stale undo", async ({ page }) => {
  await page.goto("/library/city/edit");
  await page.getByLabel("Progres", { exact: true }).fill("11.5");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await page.getByRole("button", { name: /Tambah 0,5 episode:/ }).click();
  await expect(page.locator(".big-number")).toContainText("12 / 12");
  await expect(page.getByRole("button", { name: /Batas progres tercapai:/ })).toBeDisabled();
  await expect(page.locator(".item-hero")).toContainText("Sedang dijalani");
  await page.getByRole("button", { name: "Urungkan", exact: true }).click();
  await expect(page.locator(".big-number")).toContainText("11,5 / 12");
  await page.getByRole("button", { name: /Tambah 0,5 episode:/ }).click();
  await page.getByRole("link", { name: "Edit item", exact: true }).click();
  await page.getByRole("button", { name: "Urungkan", exact: true }).click();
  await expect(page.getByLabel("Progres", { exact: true })).toHaveValue("11.5");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page.locator(".big-number")).toContainText("11,5 / 12");
  await page.getByRole("button", { name: /Tambah 0,5 episode:/ }).click();
  await page.getByRole("link", { name: "Edit item", exact: true }).click();
  await page.getByLabel("Progres", { exact: true }).fill("8");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page.getByRole("button", { name: "Urungkan", exact: true })).toHaveCount(0);
  await expect(page.locator(".big-number")).toContainText("8 / 12");
});

test("category form validates locally, supports tenths and distinct unrated values", async ({ page }) => {
  await page.goto("/library/new");
  await expect(page.locator("details")).not.toHaveAttribute("open");
  await page.getByLabel("Judul", { exact: true }).fill("   ");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page.getByLabel("Judul", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Judul", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Judul", { exact: true }).fill("Judul sintetis panjang untuk memeriksa pembungkusan teks dalam baris library di layar ponsel tanpa memotong kontrol progres");
  await page.getByLabel("Kategori", { exact: true }).selectOption("Hobi");
  await expect(page.locator("#progress-help")).toContainText("sesi");
  await page.getByLabel("Progres", { exact: true }).fill("2.5");
  await page.locator("summary").click();
  await page.getByLabel("Total", { exact: true }).fill("2");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page.getByLabel("Progres", { exact: true })).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel("Total", { exact: true }).fill("");
  await page.getByRole("checkbox", { name: "Belum dinilai", exact: true }).uncheck();
  await page.getByLabel("Rating", { exact: true }).fill("8.7");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page.locator(".rating-badge")).toHaveText("8,7/10");
  await expect(page.getByRole("status")).toContainText("Item disimpan di sesi demo");
  await page.getByRole("link", { name: "Edit item", exact: true }).click();
  await page.getByRole("checkbox", { name: "Belum dinilai", exact: true }).check();
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page.locator(".rating-badge")).toHaveText("Belum dinilai");
  await page.setViewportSize({ width: 360, height: 844 });
  await page.locator("main").getByRole("link", { name: "Library", exact: true }).click();
  await page.getByRole("button", { name: "Tampilan daftar" }).click();
  const card = page.locator(".media-card").first();
  expect(await card.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test("mobile controls fit cards, meet hit sizes and put continuation in the first viewport", async ({ page }) => {
  for (const width of [360, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(page.locator(".card-footer .progress-button").first()).toBeVisible();
    const first = await page.locator(".card-footer .progress-button").first().boundingBox();
    expect(first!.y + first!.height).toBeLessThan(752);
    await page.screenshot({ path: `test-results/refined-dashboard-${width}.png`, fullPage: true });
    await page.locator(".tracker-summary").getByRole("link", { name: /Sedang dijalani/ }).click();
    await expect(page).toHaveURL(/status=active/);
    await expect(page.locator(".media-card")).toHaveCount(4);
    await page.getByRole("button", { name: /Hapus filter/ }).click();
    await expect(page.locator(".media-card")).toHaveCount(6);
    await page.getByRole("button", { name: "Tampilan daftar" }).click();
    const problems = await page.locator(".media-card").evaluateAll((cards) => cards.flatMap((card) => {
      const outer = card.getBoundingClientRect();
      return Array.from(card.querySelectorAll("button")).filter((button) => {
        const bounds = button.getBoundingClientRect();
        return bounds.width < 44 || bounds.height < 44 || bounds.left < outer.left || bounds.right > outer.right || bounds.bottom > outer.bottom;
      }).map((button) => button.getAttribute("aria-label"));
    }));
    expect(problems).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.screenshot({ path: `test-results/refined-list-${width}.png`, fullPage: true });
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(audit.violations.map((v) => v.id)).toEqual([]);
  }
});
