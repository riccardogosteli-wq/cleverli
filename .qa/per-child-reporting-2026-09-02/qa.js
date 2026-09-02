const { chromium } = require("playwright");

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3044";

function hashScope(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

const accountScope = `account_${hashScope("qa-per-child-reporting-user")}`;
const childA = "qa-child-alpha";
const childB = "qa-child-beta";

function scoped(base) {
  return `${base}__${accountScope}`;
}

function progressKey(grade, subject, topicId, childId) {
  return scoped(`cleverli_${grade}_${subject}_${topicId}_child_${childId}`);
}

async function seed(page, activeChildId) {
  await page.goto(baseURL);
  await page.evaluate(({ accountScope, childA, childB, activeChildId }) => {
    const scoped = (base) => `${base}__${accountScope}`;
    const progressKey = (grade, subject, topicId, childId) => scoped(`cleverli_${grade}_${subject}_${topicId}_child_${childId}`);
    const now = new Date().toISOString();
    localStorage.clear();
    localStorage.setItem("cleverli_session", JSON.stringify({
      email: "qa-per-child-reporting@example.com",
      name: "QA Reporting",
      premium: true,
      userId: "qa-per-child-reporting-user",
    }));
    localStorage.setItem(scoped("cleverli_family"), JSON.stringify({
      members: [
        {
          id: childA,
          name: "QA Alpha",
          avatar: "A",
          grade: 5,
          createdAt: now,
          curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 },
        },
        {
          id: childB,
          name: "QA Beta",
          avatar: "B",
          grade: 5,
          createdAt: now,
          curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 },
        },
      ],
    }));
    localStorage.setItem(scoped("cleverli_active_profile"), activeChildId);
    localStorage.setItem(scoped("cleverli_last_grade"), "5");
    localStorage.setItem(scoped("cleverli_parent_pin"), "2086475798");
    localStorage.setItem(scoped("cleverli_parent_unlocked"), JSON.stringify({ until: Date.now() + 60 * 60 * 1000 }));
    localStorage.setItem(scoped(`cleverli_profile_${childA}`), JSON.stringify({
      xp: 120,
      totalExercises: 51,
      totalTopicsComplete: 1,
      dailyStreak: 2,
      lastPlayedDate: "2026-09-02",
      achievements: [],
      usedLanguages: ["en"],
      costume: 2,
      weeklyXp: 40,
      weeklyXpDate: "2026-W36",
      streakGraceUsed: false,
      weekendDays: [],
      playDates: ["2026-09-02"],
      coins: 51,
      ownedItems: [],
      equippedItems: {},
    }));
    localStorage.setItem(scoped(`cleverli_profile_${childB}`), JSON.stringify({
      xp: 80,
      totalExercises: 27,
      totalTopicsComplete: 1,
      dailyStreak: 1,
      lastPlayedDate: "2026-09-02",
      achievements: [],
      usedLanguages: ["de"],
      costume: 1,
      weeklyXp: 25,
      weeklyXpDate: "2026-W36",
      streakGraceUsed: false,
      weekendDays: [],
      playDates: ["2026-09-02"],
      coins: 27,
      ownedItems: [],
      equippedItems: {},
    }));
    localStorage.setItem(progressKey(5, "english", "present-continuous-5", childA), JSON.stringify({
      completed: 51,
      score: 51,
      stars: 3,
      correctIds: Array.from({ length: 51 }, (_, i) => `qa-a-${i}`),
      lastPlayed: now,
    }));
    localStorage.setItem(progressKey(5, "mi", "sicher-online-5", childB), JSON.stringify({
      completed: 27,
      score: 27,
      stars: 3,
      correctIds: Array.from({ length: 27 }, (_, i) => `qa-b-${i}`),
      lastPlayed: now,
    }));
  }, { accountScope, childA, childB, activeChildId });
}

async function expectText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout: 8000 });
}

async function rejectText(page, text) {
  if (await page.getByText(text, { exact: false }).first().isVisible().catch(() => false)) {
    throw new Error(`Unexpected visible text: ${text}`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

  await seed(page, childA);
  await page.goto(`${baseURL}/dashboard?subject=english`);
  await page.getByTestId("grade-5").click();
  await expectText(page, "QA Alpha");
  await expectText(page, "Präsens kontinuierlich");
  await expectText(page, "51/51");

  await page.goto(`${baseURL}/dashboard?subject=mi`);
  await page.getByTestId("grade-5").click();
  await rejectText(page, "27/27");

  await page.goto(`${baseURL}/parents`);
  await expectText(page, "QA Alpha");
  await expectText(page, "Present Continuous");
  await rejectText(page, "Sicher online");

  await page.goto(`${baseURL}/missionen`);
  await expectText(page, "QA Alpha");
  await expectText(page, "Englisch");
  await expectText(page, "1/9");
  await page.screenshot({ path: ".qa/per-child-reporting-2026-09-02/alpha-missionen.png", fullPage: true });

  await page.goto(`${baseURL}/trophies`);
  await expectText(page, "QA Alpha");
  await expectText(page, "Englisch");
  await expectText(page, "1/9");

  await page.goto(`${baseURL}/rewards`);
  await expectText(page, "Aktueller Fortschritt");
  await expectText(page, "1/9");

  await seed(page, childB);
  await page.goto(`${baseURL}/dashboard?subject=mi`);
  await page.getByTestId("grade-5").click();
  await expectText(page, "QA Beta");
  await expectText(page, "Sicher online");
  await expectText(page, "27/27");

  await page.goto(`${baseURL}/dashboard?subject=english`);
  await page.getByTestId("grade-5").click();
  await rejectText(page, "51/51");

  await page.goto(`${baseURL}/parents`);
  await expectText(page, "QA Beta");
  await expectText(page, "Sicher online");
  await rejectText(page, "Present Continuous");

  await page.goto(`${baseURL}/missionen`);
  await expectText(page, "QA Beta");
  await expectText(page, "Medien & Informatik");
  await expectText(page, "1/2");
  await page.screenshot({ path: ".qa/per-child-reporting-2026-09-02/beta-missionen.png", fullPage: true });

  await page.goto(`${baseURL}/trophies`);
  await expectText(page, "QA Beta");
  await expectText(page, "Medien & Informatik");
  await expectText(page, "1/2");

  await page.goto(`${baseURL}/rewards`);
  await expectText(page, "Aktueller Fortschritt");
  await expectText(page, "1/2");

  await browser.close();
  console.log("per-child reporting QA passed");
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
