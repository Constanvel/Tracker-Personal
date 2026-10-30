import { expect, test } from "@playwright/test";

test("desktop dashboard continuation is horizontal with progress visible before scrolling", async ({ page }) => {
  for (const width of [1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const card = page.locator(".tracker-home .media-card").first();
    await expect(card).toBeVisible();
    const action = card.locator(".progress-button");
    await expect(action).toBeInViewport({ ratio: 1 });
    const layout = await card.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const cover = element.querySelector(".cover")!.getBoundingClientRect();
      const info = element.querySelector(".card-info")!.getBoundingClientRect();
      const footer = element.querySelector(".card-footer")!.getBoundingClientRect();
      const action = element.querySelector(".progress-button")!.getBoundingClientRect();
      return {
        height: bounds.height,
        coverWidth: cover.width,
        infoBesideCover: info.left >= cover.right,
        footerBesideInfo: footer.left >= info.right,
        actionBottom: action.bottom,
      };
    });
    expect(layout.height).toBeLessThan(180);
    expect(layout.coverWidth).toBe(72);
    expect(layout.infoBesideCover).toBe(true);
    expect(layout.footerBesideInfo).toBe(true);
    expect(layout.actionBottom).toBeLessThanOrEqual(900);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  }
});

test("library keeps portrait grid cards and the existing compact list layout", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/library");
  const card = page.locator(".media-card").first();
  const grid = await card.evaluate((element) => ({
    card: element.getBoundingClientRect().width,
    cover: element.querySelector(".cover")!.getBoundingClientRect().width,
    display: getComputedStyle(element).display,
  }));
  expect(grid.display).toBe("flex");
  expect(Math.abs(grid.card - grid.cover)).toBeLessThan(3);
  await page.getByRole("button", { name: "Tampilan daftar" }).click();
  await expect(page.locator(".media-grid")).toHaveClass(/list-view/);
  await expect(card.locator(".cover")).toHaveCSS("width", "72px");
  await expect(card.locator(".card-open")).toHaveCSS("display", "flex");
});

test("mobile searches avoid input zoom and preserve the compact dashboard", async ({ page }) => {
  for (const width of [360, 390, 760]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/", "/library", "/favorites"]) {
      await page.goto(route);
      const search = page.getByRole("textbox", { name: "Cari judul, kreator, atau catatan" });
      await expect(search).toBeVisible();
      expect(await search.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
      if (route === "/" && width < 540) {
        const action = page.locator(".tracker-home .progress-button").first();
        await expect(action).toBeInViewport({ ratio: 1 });
        const bounds = await action.boundingBox();
        expect(bounds!.y + bounds!.height).toBeLessThan(752);
        await expect(page.locator(".tracker-home .cover").first()).toHaveCSS("width", "64px");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    }
    await page.goto("/journal");
    const journalSearch = page.getByRole("searchbox", { name: "Cari jurnal" });
    await expect(journalSearch).toBeVisible();
    expect(await journalSearch.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
  }
});

test("inline reset confirmation focuses cancel and restores its trigger after either outcome", async ({ page }) => {
  await page.goto("/settings");
  const trigger = page.getByRole("button", { name: "Reset sesi demo…", exact: true });
  const cancel = page.getByRole("button", { name: "Batal", exact: true });
  const confirm = page.getByRole("button", { name: "Ya, reset sesi demo", exact: true });
  await expect(trigger).not.toBeFocused();
  await page.getByRole("checkbox", { name: /Kurangi transparansi/ }).check();

  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(cancel).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Lihat ekspor demo", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Kembali ke pustaka", exact: true })).toBeFocused();
  await cancel.click();
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("checkbox", { name: /Kurangi transparansi/ })).toBeChecked();

  await page.keyboard.press("Enter");
  await expect(cancel).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(confirm).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(trigger).toBeFocused();
  await expect(page.getByRole("checkbox", { name: /Kurangi transparansi/ })).not.toBeChecked();
  await expect(page.getByRole("status")).toContainText("Sesi demo dalam memori telah direset.");
});
