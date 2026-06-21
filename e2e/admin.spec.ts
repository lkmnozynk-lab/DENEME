import { test, expect } from "@playwright/test";

test.describe("Admin erişim koruması", () => {
  test("/admin giriş sayfasına yönlendirir", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByText("NERAAJANS Yönetim")).toBeVisible();
  });

  test("korunan alt rotalar da yönlendirir", async ({ page }) => {
    await page.goto("/admin/works");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("login formu alanları gösterilir", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
});
