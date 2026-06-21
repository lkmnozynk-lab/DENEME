import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

/**
 * E2E config. Boots the Next.js dev server and runs tests against it.
 * Public-page tests need no database (graceful fallbacks); admin tests only
 * assert the auth redirect, which is database-free.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    // Test against a production build — no on-demand compilation, so no
    // cold-start flakiness on routes like /admin or the middleware.
    command: `npm run build && npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    // Ensure auth redirects target the test server's own origin/port.
    env: {
      AUTH_URL: baseURL,
      NEXT_PUBLIC_SITE_URL: baseURL,
    },
  },
});
