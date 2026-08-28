import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "https://www.cleverli.ch";
const OUT = path.resolve(".qa/responsive-audit-2026-08-28/core-visuals");
const AUTH_STATE = path.resolve("tests/.auth/state.json");
const ROUTES = [
  "/", "/dashboard", "/daily", "/missionen", "/rewards", "/family",
  "/parents", "/shop", "/upgrade", "/account", "/login", "/signup",
  "/primarschule-uebungen", "/einmaleins-ueben", "/blog/kinder-motivieren-zum-lernen",
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results: unknown[] = [];
  for (const width of [320, 390, 768]) {
    const context = await browser.newContext({
      storageState: fs.existsSync(AUTH_STATE) ? AUTH_STATE : undefined,
      viewport: { width, height: width === 320 ? 568 : width === 390 ? 844 : 1024 },
      isMobile: width < 768,
      hasTouch: width < 768,
      locale: "de-CH",
    });
    for (const route of ROUTES) {
      const page = await context.newPage();
      const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: "domcontentloaded", timeout: 20_000 });
      await page.waitForTimeout(400);
      const top = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        inputFonts: [...document.querySelectorAll("input,textarea,select")]
          .filter((entry) => {
            const rect = entry.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          })
          .map((entry) => ({ tag: entry.tagName, type: entry.getAttribute("type") ?? "", fontSize: getComputedStyle(entry).fontSize })),
      }));
      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(200);
      const bottom = await page.evaluate(() => {
        const nav = document.querySelector('nav[aria-label="Mobile Navigation"]');
        const navRect = nav?.getBoundingClientRect();
        const candidates = [...document.querySelectorAll("main, footer, #main-content > *")]
          .filter((entry) => {
            const rect = entry.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
          });
        const last = candidates.at(-1);
        const lastRect = last?.getBoundingClientRect();
        return {
          scrollY,
          scrollHeight: document.documentElement.scrollHeight,
          nav: navRect ? { top: navRect.top, bottom: navRect.bottom, height: navRect.height } : null,
          last: lastRect ? { tag: last?.tagName, top: lastRect.top, bottom: lastRect.bottom, height: lastRect.height } : null,
          overlap: Boolean(navRect && lastRect && lastRect.bottom > navRect.top),
        };
      });
      let screenshot: string | null = null;
      if (width === 390) {
        screenshot = path.join(OUT, route === "/" ? "home--bottom.png" : `${route.slice(1).replaceAll("/", "--")}--bottom.png`);
        await page.screenshot({ path: screenshot });
      }
      results.push({ route, width, status: response?.status() ?? 0, top, bottom, screenshot });
      await page.close();
    }
    await context.close();
  }
  fs.writeFileSync(path.join(OUT, "results.json"), JSON.stringify(results, null, 2));
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
