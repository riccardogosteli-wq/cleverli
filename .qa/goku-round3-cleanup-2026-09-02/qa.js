const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3048";
let chromium;
let assert;
let fs;
let path;
let outDir;

function hashScope(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

const accountScope = `account_${hashScope("qa-round3-cleanup-user")}`;
const childId = "qa-round3-cleanup-child";

async function seed(page) {
  await page.goto(baseURL);
  await page.evaluate(({ accountScope, childId }) => {
    const scoped = (base) => `${base}__${accountScope}`;
    const now = new Date().toISOString();
    localStorage.clear();
    localStorage.setItem("cleverli_session", JSON.stringify({
      email: "qa-round3-cleanup@example.com",
      name: "QA Cleanup",
      premium: true,
      userId: "qa-round3-cleanup-user",
    }));
    localStorage.setItem(scoped("cleverli_family"), JSON.stringify({
      members: [
        { id: childId, name: "Touch Target", avatar: "T", grade: 1, createdAt: now, curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 } },
      ],
    }));
    localStorage.setItem(scoped("cleverli_active_profile"), childId);
    localStorage.setItem(scoped("cleverli_parent_pin"), "2086475798");
    localStorage.setItem(scoped("cleverli_parent_unlocked"), JSON.stringify({ until: Date.now() + 60 * 60 * 1000 }));
    localStorage.setItem(scoped(`cleverli_profile_${childId}`), JSON.stringify({
      xp: 40,
      totalExercises: 4,
      totalTopicsComplete: 0,
      dailyStreak: 1,
      achievements: ["first_exercise"],
      playDates: [new Date().toISOString().slice(0, 10)],
      coins: 4,
      ownedItems: [],
      equippedItems: {},
    }));
  }, { accountScope, childId });
}

async function expectMinTarget(locator, name, min = 44) {
  await locator.first().waitFor({ timeout: 8000 });
  const box = await locator.first().boundingBox();
  assert.ok(box, `${name} has no box`);
  assert.ok(box.width >= min, `${name} width ${box.width} < ${min}`);
  assert.ok(box.height >= min, `${name} height ${box.height} < ${min}`);
}

async function expectNoHorizontalOverflow(page, name) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  assert.ok(overflow <= 1, `${name} horizontal overflow ${overflow}px`);
}

(async () => {
  ({ chromium } = await import("playwright"));
  ({ default: assert } = await import("node:assert/strict"));
  fs = await import("node:fs");
  path = await import("node:path");
  outDir = path.join(process.cwd(), ".qa/goku-round3-cleanup-2026-09-02");
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const response = await page.goto(`${baseURL}/trophies`, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, "/trophies should render");
  assert.equal(new URL(page.url()).pathname, "/trophies", "/trophies should not silently redirect");
  await page.getByText("Meine Missionen", { exact: false }).first().waitFor({ timeout: 8000 });
  await expectNoHorizontalOverflow(page, "/trophies");
  await page.screenshot({ path: path.join(outDir, "trophies-mobile.png"), fullPage: true });

  const cspResponse = await page.goto(baseURL, { waitUntil: "networkidle" });
  const csp = cspResponse.headers()["content-security-policy"] || "";
  assert.match(csp, /frame-src[^;]*www\.facebook\.com/, "CSP frame-src should allow www.facebook.com");
  assert.match(csp, /frame-src[^;]*web\.facebook\.com/, "CSP frame-src should allow web.facebook.com");

  await seed(page);
  await page.goto(`${baseURL}/parents`, { waitUntil: "networkidle" });
  await expectMinTarget(page.getByTestId("parent-dashboard-lock"), "parents lock");
  await expectMinTarget(page.getByText("Alle", { exact: true }), "parents all achievements link");
  await expectNoHorizontalOverflow(page, "/parents");

  await seed(page);
  await page.goto(`${baseURL}/rewards`, { waitUntil: "networkidle" });
  await expectMinTarget(page.getByRole("link", { name: /Zurück zum Dashboard|Back to dashboard|Retour au tableau de bord|Torna alla dashboard/ }), "rewards back link");
  await expectMinTarget(page.getByRole("button", { name: /Elternbereich sperren|Lock parent area|Verrouiller espace parents|Blocca area genitori/ }), "rewards lock");
  await expectNoHorizontalOverflow(page, "/rewards");

  await seed(page);
  await page.goto(`${baseURL}/family`, { waitUntil: "networkidle" });
  await expectMinTarget(page.getByRole("button", { name: /Touch Target: Lernfortschritt zurücksetzen/ }), "family reset");
  await expectMinTarget(page.getByRole("button", { name: /Touch Target: Profil entfernen/ }), "family remove");
  await expectNoHorizontalOverflow(page, "/family");
  await page.screenshot({ path: path.join(outDir, "family-touch-targets.png"), fullPage: true });

  await browser.close();
  console.log("goku round 3 cleanup QA passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
