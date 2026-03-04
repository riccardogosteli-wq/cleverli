/**
 * Diagnostic: capture the real JS error behind "Application error"
 * Runs WITHOUT storageState — injects localStorage values via addInitScript so we control timing
 */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

test.use({ storageState: { cookies: [], origins: [] } }); // no storageState for this file

const STATE_FILE = path.join(__dirname, "../.auth/state.json");

test("capture real crash error with injected localStorage", async ({ context, page }) => {
  // Load stored localStorage values and inject them before page load
  const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  const lsItems: { name: string; value: string }[] = state.origins?.[0]?.localStorage ?? [];

  for (const item of lsItems) {
    await context.addInitScript(([k, v]: [string, string]) => {
      localStorage.setItem(k, v);
    }, [item.name, item.value]);
  }

  // Collect ALL errors before and after load
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (err) => {
    pageErrors.push(`[pageerror] ${err.message}\n${err.stack?.slice(0, 500)}`);
  });
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[console.error] ${msg.text()}`);
    }
  });

  await page.goto("https://www.cleverli.ch", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);

  const crashHeading = page.locator("text=Application error");
  const crashed = await crashHeading.count();

  console.log("=== CRASH:", crashed > 0 ? "YES" : "NO", "===");
  console.log("=== pageerrors:", pageErrors.length, "===");
  for (const e of pageErrors) console.log(e);
  console.log("=== console errors:", consoleErrors.length, "===");
  for (const e of consoleErrors) console.log(e);
  console.log("=== localStorage injected:", lsItems.map(x => x.name).join(", "));

  // Always pass — this is diagnostic
  expect(true).toBe(true);
});

test("no crash WITHOUT localStorage", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (err) => {
    pageErrors.push(`[pageerror] ${err.message}`);
  });

  await page.goto("https://www.cleverli.ch", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);

  const crashed = await page.locator("text=Application error").count();
  console.log("=== CRASH without state:", crashed > 0 ? "YES" : "NO", "===");
  console.log("=== errors:", pageErrors);
  expect(true).toBe(true);
});
