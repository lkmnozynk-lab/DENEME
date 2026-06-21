import { test, expect } from "@playwright/test";

test.describe("Ana sayfa", () => {
  test("hero ve ana bölümler yüklenir", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Kelimeleriniz");
    await expect(page.getByRole("link", { name: "Teklif Al" }).first()).toBeVisible();
    // Bölüm başlıkları
    await expect(page.locator("#hizmetler")).toBeVisible();
    await expect(page.locator("#calismalarimiz")).toBeVisible();
    await expect(page.locator("#iletisim")).toBeVisible();
  });

  test("tema toggle çalışır", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
    await page.getByLabel(/moda geç/).first().click();
    await expect(html).toHaveClass(/dark/);
  });

  test("OG görseli üretilir", async ({ request }) => {
    const res = await request.get("/opengraph-image");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });

  test("robots ve sitemap erişilebilir", async ({ request }) => {
    expect((await request.get("/robots.txt")).status()).toBe(200);
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("<urlset");
  });
});
