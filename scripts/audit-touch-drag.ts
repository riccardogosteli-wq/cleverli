import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ headless: true });
  for (const width of [320, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 320 ? 568 : 844 },
      isMobile: true,
      hasTouch: true,
    });
    await context.addInitScript(() => {
      localStorage.setItem("cleverli_1_math_zahlen-1-10", JSON.stringify({
        correctIds: Array.from({ length: 24 }, (_, index) => `z${index + 1}`),
        completed: 24,
      }));
      localStorage.setItem("cleverli_active_profile", "responsive-audit-child");
    });
    const page = await context.newPage();
    await page.goto("https://www.cleverli.ch/learn/1/math/zahlen-1-10", { waitUntil: "domcontentloaded" });
    await page.getByText("Ordne die Zahlen von klein nach gross! 🔢", { exact: true }).waitFor();
    const tile = page.locator("div[style*='touch-action: none']").first();
    const zone = page.locator("div.border-dashed").first();
    await tile.scrollIntoViewIfNeeded();
    const tileBox = await tile.boundingBox();
    const zoneBox = await zone.boundingBox();
    if (!tileBox || !zoneBox) throw new Error(`Missing drag geometry at ${width}px`);
    const session = await context.newCDPSession(page);
    const start = { x: tileBox.x + tileBox.width / 2, y: tileBox.y + tileBox.height / 2 };
    const end = { x: zoneBox.x + zoneBox.width / 2, y: zoneBox.y + zoneBox.height / 2 };
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [start] });
    for (let index = 1; index <= 10; index += 1) {
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{
          x: start.x + ((end.x - start.x) * index) / 10,
          y: start.y + ((end.y - start.y) * index) / 10,
        }],
      });
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(300);
    const text = await page.locator("body").innerText();
    console.log(`${width}px touch drag: ${text.includes("4 Felder fehlen") ? "passed" : "failed"}`);
    await context.close();
  }
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
