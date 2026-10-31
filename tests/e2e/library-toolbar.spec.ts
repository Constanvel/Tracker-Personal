import { expect, test, type Page } from "@playwright/test";

const searchName = "Cari judul, kreator, atau catatan";

async function expectQuery(page: Page, expected: Record<string, string | null>) {
  await expect.poll(() => {
    const query = new URL(page.url()).searchParams;
    return Object.fromEntries(Object.keys(expected).map((key) => [key, query.get(key)]));
  }).toEqual(expected);
}

test("desktop sort names the active order and grid/list expose pressed state", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/library");
  const toolbar = page.locator(".library-toolbar");
  await expect(toolbar.locator("summary")).toBeHidden();
  await expect(page.getByRole("button", { name: "Tampilan grid", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Urutan: bawaan", exact: true })).toHaveAttribute("aria-pressed", "false");

  await page.getByRole("button", { name: "Urutan: bawaan", exact: true }).click();
  await expectQuery(page, { sort: "title" });
  await expect(page.getByRole("button", { name: "Urutan: Judul A–Z", exact: true })).toHaveAttribute("aria-pressed", "true");
  const titles = await page.locator(".media-card h3").allTextContents();
  expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b, "id")));

  await page.getByRole("button", { name: "Tampilan daftar", exact: true }).click();
  await expectQuery(page, { sort: "title", view: "list" });
  await expect(page.locator(".media-grid")).toHaveClass(/list-view/);
  await expect(page.getByRole("button", { name: "Tampilan daftar", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Tampilan grid", exact: true })).toHaveAttribute("aria-pressed", "false");

  await page.getByRole("button", { name: "Tampilan grid", exact: true }).click();
  await page.getByRole("button", { name: "Urutan: Judul A–Z", exact: true }).click();
  await expectQuery(page, { sort: null, view: null });
});

test("mobile disclosure supports Enter, Space, Escape and focus without menu semantics", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 844 });
  await page.goto("/library");
  const disclosure = page.locator(".library-toolbar-disclosure");
  const summary = disclosure.locator("summary");
  await expect(summary).toContainText("Tampilan & urutan");
  await expect(summary).toContainText("Urutan: bawaan");
  await expect(page.getByRole("button", { name: "Tampilan daftar", exact: true })).toHaveCount(0);
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(disclosure).toHaveAttribute("open", "");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Urutan: bawaan", exact: true })).toBeFocused();
  await page.keyboard.press("Space");
  await expectQuery(page, { sort: "title" });
  await expect(summary).toContainText("Urutan: Judul A–Z");
  await expect(page.getByRole("button", { name: "Urutan: Judul A–Z", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(disclosure).not.toHaveAttribute("open");
  await expect(summary).toBeFocused();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Tampilan daftar", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tampilan daftar", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expectQuery(page, { sort: "title", view: "list" });
  await page.getByRole("button", { name: "Tampilan grid", exact: true }).click();
  await expectQuery(page, { sort: "title", view: null });
  await expect(page.getByRole("button", { name: "Tampilan grid", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".media-grid")).not.toHaveClass(/list-view/);
  await summary.click();
  await expect(disclosure).not.toHaveAttribute("open");
  await expect(page.getByRole("menu")).toHaveCount(0);
});

for (const viewport of [
  { width: 360, height: 844 },
  { width: 390, height: 844 },
  { width: 740, height: 390 },
]) {
  test(`mobile toolbar fits ${viewport.width}px with full-width search and 44px targets`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/library?q=kata%20yang%20panjang&sort=title&view=list");
    const toolbar = page.locator(".library-toolbar");
    const summary = toolbar.locator("summary");
    const outer = await toolbar.boundingBox();
    const search = await toolbar.locator(".search-box").boundingBox();
    expect(Math.abs(search!.width - outer!.width)).toBeLessThanOrEqual(1);
    await summary.click();
    const problems = await toolbar.evaluate((element) => {
      const outer = element.getBoundingClientRect();
      return Array.from(element.querySelectorAll("button, summary")).filter((control) => {
        const bounds = control.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return false;
        return bounds.width < 44 || bounds.height < 44 || bounds.left < outer.left - 1 || bounds.right > outer.right + 1 || control.scrollWidth > control.clientWidth;
      }).map((control) => control.getAttribute("aria-label") ?? control.textContent);
    });
    expect(problems).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await expect(summary).toContainText("Urutan: Judul A–Z");
    await expect(page.getByRole("button", { name: "Tampilan daftar", exact: true })).toHaveAttribute("aria-pressed", "true");
  });
}

test("sort/view retain search, category, active filter and unrelated query; reset keeps view preferences", async ({ page }) => {
  await page.goto("/library?q=tidak-ditemukan&type=Anime&status=active&source=toolbar-test");
  await page.getByRole("button", { name: "Urutan: bawaan", exact: true }).click();
  await page.getByRole("button", { name: "Tampilan daftar", exact: true }).click();
  await expectQuery(page, { q: "tidak-ditemukan", type: "Anime", status: "active", sort: "title", view: "list", source: "toolbar-test" });
  await expect(page.getByRole("button", { name: "Anime", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reset filter", exact: true }).click();
  await expectQuery(page, { q: null, type: null, status: null, sort: "title", view: "list", source: "toolbar-test" });
  await expect(page.locator(".media-card")).toHaveCount(6);

  await page.getByRole("button", { name: "Anime", exact: true }).click();
  await page.getByRole("textbox", { name: searchName }).fill("Peta");
  await expectQuery(page, { q: "Peta", type: "Anime", sort: "title", view: "list" });
  await expect(page.locator(".media-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Hapus pencarian", exact: true }).click();
  await expect(page.getByRole("textbox", { name: searchName })).toBeFocused();
  await expectQuery(page, { q: null, type: "Anime", sort: "title", view: "list" });
});

test("query-backed toolbar restores with browser back/forward", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/library?q=Peta&type=Anime&status=active&sort=title&view=list");
  await page.getByRole("link", { name: "Buka Peta Kota Senja", exact: true }).click();
  await expect(page).toHaveURL(/\/library\/city$/);
  await page.goBack();
  await expectQuery(page, { q: "Peta", type: "Anime", status: "active", sort: "title", view: "list" });
  await expect(page.getByRole("textbox", { name: searchName })).toHaveValue("Peta");
  await expect(page.locator(".library-toolbar-disclosure summary")).toContainText("Urutan: Judul A–Z");
  await page.locator(".library-toolbar-disclosure summary").click();
  await expect(page.getByRole("button", { name: "Tampilan daftar", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(page).toHaveURL(/\/library\/city$/);
  await page.goBack();
  await expect(page.locator(".media-grid")).toHaveClass(/list-view/);
});

test("favorite scope and dashboard search still cover the intended library", async ({ page }) => {
  await page.goto("/favorites?sort=title&view=list");
  await expect(page.locator(".media-card")).toHaveCount(3);
  await page.getByRole("textbox", { name: searchName }).fill("Nada");
  await expect(page.getByRole("link", { name: "Buka Nada untuk Jendela", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Urutan: Judul A–Z", exact: true }).click();
  await expectQuery(page, { q: "Nada", sort: null, view: "list" });
  await expect(page.locator(".media-card")).toHaveCount(1);

  await page.goto("/");
  await expect(page.getByRole("link", { name: "Buka Nada untuk Jendela", exact: true })).toHaveCount(0);
  await page.getByRole("textbox", { name: searchName }).fill("Nada");
  await expect(page.getByRole("link", { name: "Buka Nada untuk Jendela", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Urutan: bawaan", exact: true }).click();
  await expectQuery(page, { q: "Nada", sort: "title" });
});
