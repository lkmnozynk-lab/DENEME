import { test, expect } from "@playwright/test";

test.describe("Teklif formu doğrulama", () => {
  test("boş gönderim sunucu doğrulama hatası verir", async ({ page }) => {
    await page.goto("/teklif-al");
    await page.getByRole("button", { name: /Teklif Talebi Gönder/ }).click();
    await expect(page.getByText(/Lütfen formdaki hataları düzeltin/)).toBeVisible();
  });

  test("geçersiz e-posta reddedilir", async ({ page }) => {
    await page.goto("/teklif-al");
    await page.locator('input[name="name"]').fill("Test Kullanıcı");
    await page.locator('input[name="email"]').fill("gecersiz-email");
    await page.locator('textarea[name="message"]').fill("Bu bir test mesajıdır, en az on karakter.");
    await page.getByRole("button", { name: /Teklif Talebi Gönder/ }).click();
    await expect(page.getByText(/Geçerli bir e-posta/)).toBeVisible();
  });
});
