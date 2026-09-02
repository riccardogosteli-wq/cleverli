const { chromium } = require("playwright");

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3045";

function hashScope(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

const accountScope = `account_${hashScope("qa-goku-retest-fixes-user")}`;
const childA = "qa-child-progress-a";
const childB = "qa-child-progress-b";

function scoped(base) {
  return `${base}__${accountScope}`;
}

async function seed(page, activeChildId) {
  await page.goto(baseURL);
  await page.evaluate(({ accountScope, childA, childB, activeChildId }) => {
    const scoped = (base) => `${base}__${accountScope}`;
    const progressKey = (grade, subject, topicId, childId) => scoped(`cleverli_${grade}_${subject}_${topicId}_child_${childId}`);
    const now = new Date().toISOString();

    localStorage.clear();
    localStorage.setItem("cleverli_session", JSON.stringify({
      email: "qa-goku-retest-fixes@example.com",
      name: "QA Retest",
      premium: true,
      userId: "qa-goku-retest-fixes-user",
    }));
    localStorage.setItem(scoped("cleverli_family"), JSON.stringify({
      members: [
        { id: childA, name: "QA Lina", avatar: "L", grade: 1, createdAt: now, curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 } },
        { id: childB, name: "QA Ben", avatar: "B", grade: 2, createdAt: now, curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 } },
      ],
    }));
    localStorage.setItem(scoped("cleverli_active_profile"), activeChildId);
    localStorage.setItem(scoped("cleverli_last_grade"), activeChildId === childA ? "1" : "2");
    localStorage.setItem(scoped("cleverli_parent_pin"), "2086475798");
    localStorage.setItem(scoped("cleverli_parent_unlocked"), JSON.stringify({ until: Date.now() + 60 * 60 * 1000 }));

    localStorage.setItem(scoped(`cleverli_profile_${childA}`), JSON.stringify({
      xp: 220,
      totalExercises: 49,
      totalTopicsComplete: 1,
      dailyStreak: 2,
      lastPlayedDate: "2026-09-02",
      achievements: ["first_topic", "perfect_score", "no_hints"],
      usedLanguages: ["de"],
      costume: 2,
      weeklyXp: 80,
      weeklyXpDate: "2026-W36",
      streakGraceUsed: false,
      weekendDays: [],
      playDates: ["2026-09-02"],
      coins: 55,
      ownedItems: [],
      equippedItems: {},
    }));
    localStorage.setItem(scoped(`cleverli_profile_${childB}`), JSON.stringify({
      xp: 45,
      totalExercises: 9,
      totalTopicsComplete: 0,
      dailyStreak: 1,
      lastPlayedDate: "2026-09-02",
      achievements: [],
      usedLanguages: ["de"],
      costume: 0,
      weeklyXp: 20,
      weeklyXpDate: "2026-W36",
      streakGraceUsed: false,
      weekendDays: [],
      playDates: ["2026-09-02"],
      coins: 9,
      ownedItems: [],
      equippedItems: {},
    }));
    localStorage.setItem(progressKey(1, "math", "zahlen-1-10", childA), JSON.stringify({
      completed: 50,
      score: 50,
      stars: 3,
      correctIds: Array.from({ length: 50 }, (_, i) => `qa-a-${i}`),
      partial: false,
      lastPlayed: now,
    }));
    localStorage.setItem(progressKey(2, "math", "zahlen-bis-100", childB), JSON.stringify({
      completed: 8,
      score: 8,
      stars: 0,
      correctIds: Array.from({ length: 8 }, (_, i) => `qa-b-${i}`),
      partial: true,
      lastPlayed: now,
    }));
    localStorage.setItem(scoped("cleverli_rewards"), JSON.stringify([
      {
        id: "reward-ben-only",
        childId: childB,
        emoji: "🎬",
        title: "QA Ben reward",
        triggerType: "tasks",
        triggerValue: 10,
        status: "active",
        createdAt: now,
      },
      {
        id: "reward-legacy-family",
        emoji: "🍦",
        title: "QA legacy family reward",
        triggerType: "tasks",
        triggerValue: 60,
        status: "active",
        createdAt: now,
      },
    ]));
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

  await seed(page, childB);
  await page.goto(`${baseURL}/parents`);
  await expectText(page, "QA Ben");
  await expectText(page, "8");
  await expectText(page, "Gelöste Aufgaben");
  await expectText(page, "aus Themenfortschritt");
  await rejectText(page, "Thema geschafft!");
  await rejectText(page, "Perfekt!");
  await rejectText(page, "Kein Tipp nötig!");

  await page.goto(`${baseURL}/rewards`);
  await expectText(page, "QA Ben reward");
  await expectText(page, "QA legacy family reward");
  await expectText(page, "Familien-Belohnung");
  await expectText(page, "9 / 10");

  await seed(page, childA);
  await page.goto(`${baseURL}/parents`);
  await expectText(page, "QA Lina");
  await expectText(page, "50");
  await expectText(page, "Thema geschafft!");
  await expectText(page, "Perfekt!");
  await expectText(page, "Kein Tipp nötig!");

  await page.goto(`${baseURL}/rewards`);
  await rejectText(page, "QA Ben reward");
  await expectText(page, "QA legacy family reward");
  await expectText(page, "Familien-Belohnung");
  await expectText(page, "50");

  await page.screenshot({ path: ".qa/goku-retest-fixes-2026-09-02/rewards-child-scoped.png", fullPage: true });
  await browser.close();
  console.log("goku retest regression QA passed");
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
