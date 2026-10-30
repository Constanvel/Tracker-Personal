import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";

const ids = ["rain", "forest", "orbit", "city", "music", "guitar"];
const paths = [
  "/",
  "/library",
  "/library/new",
  "/favorites",
  "/activity",
  "/journal",
  "/collections",
  "/collections/slow-reading",
  "/collections/weekend",
  "/statistics",
  "/data",
  "/data/import",
  "/data/export",
  "/data/connections",
  "/data/jobs",
  "/settings",
  "/settings/categories",
  "/settings/privacy",
  "/help",
  "/more",
  ...ids.flatMap((id) => [`/library/${id}`, `/library/${id}/edit`]),
];

test("every advertised page loads directly, exposes an h1 and has no broken internal links", async ({
  page,
  request,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const links = new Set<string>();
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("main h1"), path).toHaveCount(1);
    await expect(page.locator("main")).not.toContainText(
      "Halaman ini tidak ditemukan.",
    );
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("href")!),
      );
    hrefs.forEach((href) => links.add(href));
  }
  for (const href of links)
    expect((await request.get(href)).status(), href).toBe(200);
  const unknown = await page.goto("/halaman-tidak-dikenal");
  expect(unknown?.status()).toBe(404);
  await expect(page.locator("main h1")).toHaveText(
    "Halaman ini tidak ditemukan.",
  );
  await page.goto("/library/id-tidak-ada");
  await expect(page.locator("main h1")).toHaveText("Item tidak tersedia.");
  await page
    .locator("main")
    .getByRole("link", { name: "Kembali ke library", exact: true })
    .click();
  await expect(page).toHaveURL(/\/library$/);
  expect(errors).toEqual([]);
});

test("item add/edit, real navigation, back, shared state and refresh", async ({
  page,
}) => {
  await page.goto("/library/new");
  await page.getByLabel("Judul", { exact: true }).fill("Cerita 雨 navigasi");
  await page.locator('select[name="type"]').selectOption("Buku");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page).toHaveURL(/\/library\/[^/?]+\?saved=1$/);
  await expect(page.locator("main h1")).toHaveText("Cerita 雨 navigasi");
  const detailURL = page.url().replace("?saved=1", "");
  await page.getByRole("link", { name: "Edit item", exact: true }).click();
  await expect(page).toHaveURL(/\/edit$/);
  await page.getByLabel("Progres", { exact: true }).fill("12.5");
  await page.getByRole("checkbox", { name: "Belum dinilai", exact: true }).uncheck();
  await page.getByLabel("Rating", { exact: true }).fill("0");
  await page.getByRole("button", { name: "Simpan di sesi demo" }).click();
  await expect(page.locator("main")).toContainText("12,5");
  await expect(page.locator("main")).toContainText("0/10");
  await page
    .getByRole("button", { name: "Jadikan favorit", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Navigasi utama", exact: true })
    .getByRole("link", { name: "Favorit", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Buka Cerita 雨 navigasi", exact: true })
    .click();
  await expect(page).toHaveURL(detailURL);
  await page.goBack();
  await expect(page).toHaveURL(/\/favorites$/);
  await page.goto(detailURL);
  await expect(page.locator("main")).toContainText("Item tidak tersedia.");
  await page
    .getByRole("link", { name: "Kembali ke library", exact: true })
    .click();
  await expect(page).toHaveURL(/\/library$/);
});

test("collections, journals, settings and URL filters perform meaningful actions", async ({
  page,
}) => {
  await page.goto("/collections");
  await page
    .getByLabel("Nama koleksi", { exact: true })
    .fill("Cerita campuran");
  await page.getByRole("button", { name: "Buat koleksi demo" }).click();
  await page.getByRole("link", { name: /Cerita campuran/ }).click();
  await page
    .getByRole("checkbox", { name: /Perpustakaan di Ujung Hujan/ })
    .check();
  await page
    .getByRole("link", { name: "Kembali ke koleksi", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: /Cerita campuran/ }),
  ).toContainText("1 item");
  await page
    .getByRole("navigation", { name: "Navigasi utama", exact: true })
    .getByRole("link", { name: "Jurnal", exact: true })
    .click();
  await page.getByLabel("Judul jurnal", { exact: true }).fill("Catatan uji");
  await page
    .getByLabel("Isi jurnal", { exact: true })
    .fill("Tulisan sintetis untuk pengujian.");
  await page.getByRole("button", { name: "Tambah catatan demo" }).click();
  await expect(page.locator(".journal-note")).toContainText("Catatan uji");
  await page
    .getByRole("navigation", { name: "Navigasi utama", exact: true })
    .getByRole("link", { name: "Aktivitas", exact: true })
    .click();
  await expect(page.locator("main")).toContainText("Jurnal · Catatan uji");
  await page
    .getByRole("link", { name: "Pengaturan", exact: true })
    .first()
    .click();
  await page.getByRole("checkbox", { name: /Kurangi transparansi/ }).check();
  expect(
    await page
      .locator(".topbar")
      .evaluate((element) => getComputedStyle(element).backdropFilter),
  ).toBe("none");
  await page
    .getByRole("navigation", { name: "Navigasi utama", exact: true })
    .getByRole("link", { name: /Library/ })
    .click();
  await page
    .getByRole("textbox", { name: "Cari judul, kreator, atau catatan" })
    .fill("HUJAN");
  await expect(page).toHaveURL(/q=HUJAN/);
  await expect(page.locator(".media-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".media-card")).toHaveCount(1);
});

test("desktop/mobile page families pass axe and have no document overflow", async ({
  page,
}) => {
  test.setTimeout(300000);
  for (const width of [1440, 390, 360]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/library",
      "/library/new",
      "/library/rain",
      "/library/rain/edit",
      "/activity",
      "/journal",
      "/collections",
      "/collections/slow-reading",
      "/statistics",
      "/data/import",
      "/data/export",
      "/data/connections",
      "/data/jobs",
      "/settings",
      "/settings/categories",
      "/settings/privacy",
      "/help",
      "/more",
    ]) {
      await page.goto(path);
      await expect(page.locator("main h1")).toHaveCount(1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      expect(overflow, `${path} at ${width}`).toBe(false);
      if (width !== 360) {
        const audit = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          audit.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => n.target),
          })),
          `${path} at ${width}`,
        ).toEqual([]);
      }
    }
    await page.goto("/library");
    await page.screenshot({
      path: `test-results/library-${width}.png`,
      fullPage: true,
    });
  }
});

test("demo download and read-only import inspect actual file content", async ({
  page,
}) => {
  await page.goto("/data/export");
  const event = page.waitForEvent("download");
  await page.getByRole("button", { name: "Unduh JSON demo sintetis" }).click();
  const download = await event;
  const path = await download.path();
  expect(path).toBeTruthy();
  const payload = await readFile(path!);
  const data = JSON.parse(payload.toString());
  expect(data.synthetic).toBe(true);
  expect(data.items).toHaveLength(6);
  await page.goto("/data/import");
  await page.locator("input[type=file]").setInputFiles({
    name: "demo.json",
    mimeType: "application/json",
    buffer: payload,
  });
  await expect(
    page.getByRole("heading", { name: "Pratinjau file" }),
  ).toBeVisible();
  await page.locator("input[type=file]").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("{ invalid"),
  });
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "JSON tidak dapat dibaca",
  );
});

test("mobile navigation and keyboard links open real pages", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Navigasi ponsel" })
    .getByRole("link", { name: "Lainnya", exact: true })
    .click();
  await expect(page).toHaveURL(/\/more$/);
  await page
    .locator("main")
    .getByRole("link", { name: /Pusat data/ })
    .click();
  await expect(page).toHaveURL(/\/data$/);
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page
      .locator(".primary-button")
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe("0s");
  const help = page
    .locator("main")
    .getByRole("link", { name: "Bantuan", exact: true });
  await help.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/help$/);
  for (const path of [
    "/library/new",
    "/library/rain",
    "/library/rain/edit",
    "/more",
  ]) {
    await page.goto(path);
    const navigation = page.getByRole("navigation", {
      name: "Navigasi ponsel",
    });
    await expect(navigation.locator('a[aria-current="page"]')).toHaveCount(1);
    await expect(navigation.locator("a.active")).toHaveCount(1);
    await expect(navigation.locator('a[aria-current="page"]')).toHaveText(
      path === "/more" ? "Lainnya" : "Library",
    );
  }
  await expect(page.locator(".breadcrumb")).toContainText("Lainnya");
});
