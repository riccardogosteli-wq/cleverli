const { chromium } = require("@playwright/test");

const baseUrl = process.env.BASE_URL || "http://localhost:3041";

function hash(value) {
  let h = 5381;
  for (let i = 0; i < value.length; i += 1) h = (h * 33) ^ value.charCodeAt(i);
  return (h >>> 0).toString(36);
}

function hashPin(pin) {
  let h = 5381;
  for (let i = 0; i < pin.length; i += 1) h = (h * 33) ^ pin.charCodeAt(i);
  return String(h >>> 0);
}

function scoped(base, identity) {
  return `${base}__account_${hash(identity.toLowerCase())}`;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("console", msg => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", error => errors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const scopeB = `account_${hash("account-b")}`;
  await page.evaluate(({ scopedA, scopeB, pinB }) => {
    localStorage.clear();
    localStorage.setItem("cleverli_family", JSON.stringify({ members: [{ id: "legacy-a", name: "Leaky Legacy", avatar: "P", grade: 1, createdAt: "2026-09-02T00:00:00Z" }] }));
    localStorage.setItem("cleverli_active_profile", "legacy-a");
    localStorage.setItem("cleverli_parent_pin", "1111");
    localStorage.setItem("cleverli_session", JSON.stringify({ userId: "account-b", email: "account-b@example.com", name: "Account B", premium: true }));
    localStorage.setItem(scopedA.family, JSON.stringify({ members: [{ id: "child-a", name: "Mia Account A", avatar: "M", grade: 1, createdAt: "2026-09-02T00:00:00Z" }] }));
    localStorage.setItem(scopedA.active, "child-a");
    localStorage.setItem(scopedA.pin, "1111");
    localStorage.setItem(`cleverli_family__${scopeB}`, JSON.stringify({ members: [{ id: "child-b", name: "Noah Account B", avatar: "N", grade: 2, createdAt: "2026-09-02T00:00:00Z" }] }));
    localStorage.setItem(`cleverli_active_profile__${scopeB}`, "child-b");
    localStorage.setItem(`cleverli_parent_pin__${scopeB}`, pinB);
  }, {
    scopedA: {
      family: scoped("cleverli_family", "account-a"),
      active: scoped("cleverli_active_profile", "account-a"),
      pin: scoped("cleverli_parent_pin", "account-a"),
    },
    scopeB,
    pinB: hashPin("2468"),
  });

  await page.goto(`${baseUrl}/family`, { waitUntil: "networkidle" });
  await page.getByLabel("Eltern-PIN eingeben").fill("2468");
  await page.waitForTimeout(500);
  await page.screenshot({ path: ".qa/account-parent-lock-2026-09-02/family-account-b.png", fullPage: true });
  if (!(await page.getByText("Noah Account B").isVisible())) throw new Error("Scoped Account B child was not visible after unlock.");
  if (await page.getByText("Mia Account A").isVisible().catch(() => false)) throw new Error("Account A child leaked into Account B family page.");
  if (await page.getByText("Leaky Legacy").isVisible().catch(() => false)) throw new Error("Legacy unscoped child leaked into signed-in family page.");

  await page.evaluate(() => {
    for (const key of Object.keys(localStorage)) {
      if (key.includes("cleverli_parent_unlocked")) localStorage.removeItem(key);
    }
  });
  await page.goto(`${baseUrl}/account`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { name: /Elternbereich/ }).waitFor({ state: "visible", timeout: 5000 });
  if (await page.getByRole("heading", { name: "Mein Konto" }).isVisible().catch(() => false)) throw new Error("/account content was visible while locked.");
  await page.screenshot({ path: ".qa/account-parent-lock-2026-09-02/account-locked.png", fullPage: true });

  await page.goto(`${baseUrl}/parents`, { waitUntil: "networkidle" });
  await page.getByText("PIN vergessen? Mit Passwort zurücksetzen").click();
  if (!(await page.getByLabel("Kontopasswort").isVisible())) throw new Error("PIN reset did not require account password.");
  if (await page.getByLabel("Neuen PIN eingeben").isVisible().catch(() => false)) throw new Error("PIN reset opened new PIN setup without verification.");
  await page.screenshot({ path: ".qa/account-parent-lock-2026-09-02/pin-reset-password-required.png", fullPage: true });

  await page.evaluate(({ scopeB }) => {
    localStorage.setItem("cleverli_1_math_zahlen-1-10", JSON.stringify({ completed: 7, score: 7 }));
    localStorage.setItem("cleverli_profile_12345678-1234-1234-1234-123456789abc", JSON.stringify({ totalExercises: 99 }));
    localStorage.setItem(`cleverli_parent_unlocked__${scopeB}`, JSON.stringify({ until: Date.now() + 100000 }));
    const event = new StorageEvent("storage", { key: "noop" });
    window.dispatchEvent(event);
  }, { scopeB });
  await page.goto(`${baseUrl}/account`, { waitUntil: "networkidle" });
  if (await page.getByLabel("Eltern-PIN eingeben").isVisible().catch(() => false)) {
    await page.getByLabel("Eltern-PIN eingeben").fill("2468");
    await page.waitForTimeout(500);
  }
  await page.getByRole("button", { name: /Abmelden|Log out/i }).click();
  await page.waitForTimeout(500);
  const leakedKeys = await page.evaluate(() => Object.keys(localStorage).filter(key =>
    key === "cleverli_1_math_zahlen-1-10" ||
    key === "cleverli_profile_12345678-1234-1234-1234-123456789abc" ||
    key.startsWith("cleverli_parent_unlocked__account_")
  ));
  if (leakedKeys.length > 0) throw new Error(`Logout cleanup left local data behind: ${leakedKeys.join(", ")}`);

  const seriousErrors = errors.filter(text => !/Failed to load resource|supabase|Auth session missing|Invalid Refresh Token/i.test(text));
  if (seriousErrors.length) throw new Error(`Console errors: ${seriousErrors.join(" | ")}`);
  await browser.close();
}

main().catch(async error => {
  console.error(error);
  process.exit(1);
});
