import { test, expect } from "@playwright/test";

const pages = [
  { path: "/hakkimizda", heading: "Sözcüklerin" },
  { path: "/hizmetler", heading: "uzmanlıklar" },
  { path: "/calismalarimiz", heading: "hikâyeler" },
  { path: "/blog", heading: "notlar" },
  { path: "/iletisim", heading: "iletişime geçin" },
  { path: "/teklif-al", heading: "ücretsiz teklif" },
];

test.describe("Sayfa gezinmesi", () => {
  for (const { path, heading } of pages) {
    test(`${path} yüklenir`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toContainText(new RegExp(heading, "i"));
    });
  }

  test("hizmet detay sayfası açılır", async ({ page }) => {
    await page.goto("/hizmetler/editorluk");
    await expect(page.locator("h1")).toContainText("Editörlük");
    await expect(page.getByText("Sıkça Sorulanlar")).toBeVisible();
  });

  test("blog kategori filtresi çalışır", async ({ page }) => {
    await page.goto("/blog?kategori=dizgi");
    // Aktif kategori pili ana içerikte; footer'daki "Dizgi" linkini hariç tut.
    const activePill = page
      .locator("#main")
      .getByRole("link", { name: "Dizgi", exact: true });
    await expect(activePill).toBeVisible();
  });
});
