import { chromium } from "@playwright/test";

const BASE = process.env.SHOT_URL ?? "http://localhost:3200";
const out = "screenshots";
import { mkdirSync } from "fs";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();

// Desktop — light
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const p1 = await desktop.newPage();
await p1.goto(BASE, { waitUntil: "networkidle" });
await p1.waitForTimeout(1200);
await p1.screenshot({ path: `${out}/home-light.png`, fullPage: true });
console.log("saved home-light.png");

// Desktop — dark (set stored theme then reload)
await p1.evaluate(() => localStorage.setItem("neraajans-theme", "dark"));
await p1.reload({ waitUntil: "networkidle" });
await p1.waitForTimeout(1200);
await p1.screenshot({ path: `${out}/home-dark.png`, fullPage: true });
console.log("saved home-dark.png");

// Desktop — hero only (viewport, light)
await p1.evaluate(() => localStorage.setItem("neraajans-theme", "light"));
await p1.reload({ waitUntil: "networkidle" });
await p1.waitForTimeout(1000);
await p1.screenshot({ path: `${out}/home-hero.png`, fullPage: false });
console.log("saved home-hero.png");

// Mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p2 = await mobile.newPage();
await p2.goto(BASE, { waitUntil: "networkidle" });
await p2.waitForTimeout(1000);
await p2.screenshot({ path: `${out}/home-mobile.png`, fullPage: false });
console.log("saved home-mobile.png");

await browser.close();
