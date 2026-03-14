import { test, expect, devices } from "@playwright/test";

// Test against production — WebKit can't reach localhost reliably on macOS
test("missionen on WebKit iPhone (production)", async ({ playwright }) => {
  const browser = await playwright.webkit.launch({ headless: true });
  const iphone = devices["iPhone 14"];
  const ctx = await browser.newContext({ ...iphone });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push("[console] " + m.text()); });

  await page.goto("https://www.cleverli.ch/missionen", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(3000);

  const body = await page.innerText("body").catch(() => "");
  const crashed = body.includes("Application error") || body.includes("Unhandled Runtime");

  console.log("Errors:", JSON.stringify(errors));
  console.log("Crashed:", crashed);
  if (!crashed) console.log("Body snippet:", body.substring(0, 300));

  await page.screenshot({ path: "tests/webkit-prod-missionen.png" });
  await browser.close();

  expect(crashed).toBe(false);
  expect(errors.filter(e => !e.includes("Failed to load resource"))).toHaveLength(0);
});

test("home on WebKit iPhone (production)", async ({ playwright }) => {
  const browser = await playwright.webkit.launch({ headless: true });
  const iphone = devices["iPhone 14"];
  const ctx = await browser.newContext({ ...iphone });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));

  await page.goto("https://www.cleverli.ch/", { waitUntil: "load", timeout: 30000 });
  await page.waitForTimeout(2000);

  const body = await page.innerText("body").catch(() => "");
  const crashed = body.includes("Application error");
  console.log("Home crashed:", crashed);
  console.log("Home errors:", JSON.stringify(errors));
  await page.screenshot({ path: "tests/webkit-prod-home.png" });
  await browser.close();

  expect(crashed).toBe(false);
});
