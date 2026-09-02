const { chromium } = require("playwright");

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3047";

function hashScope(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

const accountScope = `account_${hashScope("qa-goku-round2-user")}`;
const childA = "qa-round2-nina";
const childB = "qa-round2-ben";

function scoped(base) {
  return `${base}__${accountScope}`;
}

async function expectText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout: 8000 });
}

async function rejectText(page, text) {
  if (await page.getByText(text, { exact: false }).first().isVisible().catch(() => false)) {
    throw new Error(`Unexpected visible text: ${text}`);
  }
}

async function seed(page, activeChildId) {
  await page.goto(baseURL);
  await page.evaluate(({ accountScope, childA, childB, activeChildId }) => {
    const scoped = (base) => `${base}__${accountScope}`;
    const now = new Date().toISOString();

    localStorage.clear();
    localStorage.setItem("cleverli_session", JSON.stringify({
      email: "qa-goku-round2@example.com",
      name: "QA Round 2",
      premium: true,
      userId: "qa-goku-round2-user",
    }));
    localStorage.setItem(scoped("cleverli_family"), JSON.stringify({
      members: [
        { id: childA, name: "Nina Fresh", avatar: "N", grade: 1, createdAt: now, curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 } },
        { id: childB, name: "Ben Cleanup", avatar: "B", grade: 1, createdAt: now, curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 } },
      ],
    }));
    localStorage.setItem(scoped("cleverli_active_profile"), activeChildId);
    localStorage.setItem(scoped("cleverli_parent_pin"), "2086475798");
    localStorage.setItem(scoped("cleverli_parent_unlocked"), JSON.stringify({ until: Date.now() + 60 * 60 * 1000 }));

    for (const childId of [childA, childB]) {
      localStorage.setItem(scoped(`cleverli_profile_${childId}`), JSON.stringify({
        xp: 40,
        totalExercises: 4,
        totalTopicsComplete: 0,
        dailyStreak: 1,
        lastPlayedDate: "2026-09-02",
        achievements: childId === childB
          ? ["first_exercise", "first_topic", "perfect_score", "no_hints"]
          : ["first_exercise"],
        usedLanguages: ["de"],
        costume: 0,
        weeklyXp: 10,
        weeklyXpDate: "2026-W36",
        streakGraceUsed: false,
        weekendDays: [],
        playDates: ["2026-09-02"],
        coins: 4,
        ownedItems: [],
        equippedItems: {},
      }));
      // Old/legacy partial progress often lacked the explicit partial flag.
      localStorage.setItem(scoped(`cleverli_1_math_zahlen-1-10_child_${childId}`), JSON.stringify({
        completed: 4,
        score: 4,
        stars: 0,
        lastPlayed: now,
      }));
    }

    localStorage.setItem(`cleverli_daily__${accountScope}__child_${childA}`, JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      completed: true,
      correct: true,
    }));
  }, { accountScope, childA, childB, activeChildId });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

  await seed(page, childA);
  await page.goto(`${baseURL}/parents`);
  await expectText(page, "Nina Fresh");
  await expectText(page, "In Bearbeitung");
  await expectText(page, "4/50");
  await expectText(page, "Fortsetzen");
  await rejectText(page, "Schwache Bereiche");
  await rejectText(page, "Thema erneut üben");
  await page.screenshot({ path: ".qa/goku-round2-fixes-2026-09-02/parents-in-progress.png", fullPage: true });

  await seed(page, childB);
  await page.goto(`${baseURL}/parents`);
  await expectText(page, "Ben Cleanup");
  await expectText(page, "In Bearbeitung");
  await rejectText(page, "Thema geschafft!");
  await rejectText(page, "Perfekt!");
  await rejectText(page, "Kein Tipp nötig!");
  const storedAchievements = await page.evaluate(({ accountScope, childB }) => {
    const raw = localStorage.getItem(`cleverli_profile_${childB}__${accountScope}`);
    return raw ? JSON.parse(raw).achievements : [];
  }, { accountScope, childB });
  if (storedAchievements.includes("first_topic") || storedAchievements.includes("perfect_score") || storedAchievements.includes("no_hints")) {
    throw new Error(`False topic achievements were not sanitized: ${storedAchievements.join(", ")}`);
  }

  await seed(page, childA);
  await page.goto(`${baseURL}/daily`);
  await expectText(page, "Tagesaufgabe erledigt");

  await seed(page, childB);
  await page.goto(`${baseURL}/daily`);
  await rejectText(page, "Tagesaufgabe erledigt");
  await expectText(page, "Tagesaufgabe");
  await page.screenshot({ path: ".qa/goku-round2-fixes-2026-09-02/daily-child-scoped.png", fullPage: true });

  await browser.close();
  console.log("goku round 2 fixes QA passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
