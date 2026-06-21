import { chromium } from "@playwright/test";

const BASE = process.env.SHOT_URL ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`${BASE}/admin`, { waitUntil: "networkidle" });
console.log("after /admin ->", page.url());

await page.locator('input[name="email"]').fill("admin");
await page.locator('input[name="password"]').fill("123456");
await page.getByRole("button", { name: /Giriş Yap/ }).click();
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1500);

console.log("after login ->", page.url());
const heading = await page.locator("h1").first().textContent().catch(() => null);
console.log("dashboard h1:", heading?.trim());
const ok = page.url().includes("/admin") && !page.url().includes("/login");
console.log(ok ? "LOGIN_OK" : "LOGIN_FAIL");

await page.screenshot({ path: "screenshots/admin-dashboard.png", fullPage: false });
await browser.close();
process.exit(ok ? 0 : 1);
