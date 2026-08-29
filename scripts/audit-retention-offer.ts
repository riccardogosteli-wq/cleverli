import { chromium, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

const baseUrl = process.env.QA_BASE_URL ?? "http://127.0.0.1:3101";
const outputDir = process.env.QA_OUTPUT_DIR ?? ".qa/retention-offer-2026-08-29";

async function prepare(page: Page) {
  await page.route("**/*.supabase.co/**", route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem("cleverli_session", JSON.stringify({
      email: "qa-retention@cleverli.ch",
      name: "QA Retention",
      premium: true,
      premiumUntil: "2099-01-01T00:00:00.000Z",
      premiumPlan: "yearly",
      cancelled: false,
      userId: "qa-retention-user",
    }));
  });
  await page.goto(`${baseUrl}/account`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Abonnement kündigen" }).click();
  await page.getByRole("button", { name: "Mein Kind nutzt es zu wenig" }).click();
  if (await page.getByText("Bleib für CHF 66/Jahr").count() !== 0) {
    throw new Error("Retention offer appeared for a reason other than too_expensive");
  }
  await page.getByRole("button", { name: "Zu teuer" }).click();
  await page.getByText("Bleib für CHF 66/Jahr").waitFor();
}

async function audit(name: string, width: number, height: number) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await prepare(page);

  const offerButton = page.getByRole("button", { name: "CHF 66/Jahr sichern" });
  const cancelButton = page.getByRole("button", { name: "Trotzdem kündigen" });
  const [offerBox, cancelBox, overflow] = await Promise.all([
    offerButton.boundingBox(),
    cancelButton.boundingBox(),
    page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
  ]);

  if (!offerBox || offerBox.height < 44) throw new Error(`${name}: offer button is below 44px`);
  if (!cancelBox || cancelBox.height < 44) throw new Error(`${name}: cancel button is below 44px`);
  if (overflow > 0) throw new Error(`${name}: horizontal overflow ${overflow}px`);
  if (await page.getByText("Bleib für CHF 66/Jahr").count() !== 1) throw new Error(`${name}: offer missing or duplicated`);

  await page.screenshot({ path: `${outputDir}/${name}.png`, fullPage: true });
  await browser.close();
  return { name, width, height, offerButtonHeight: offerBox.height, cancelButtonHeight: cancelBox.height, overflow };
}

async function main() {
  mkdirSync(outputDir, { recursive: true });
  const results = await Promise.all([
    audit("desktop", 1440, 1000),
    audit("mobile", 390, 844),
  ]);
  console.log(JSON.stringify(results, null, 2));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
