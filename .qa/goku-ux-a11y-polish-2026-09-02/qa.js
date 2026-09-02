const fs = require("fs");
const { chromium } = require("playwright");

const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:3046";

function hashScope(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

const accountScope = `account_${hashScope("qa-goku-ux-polish-user")}`;
const childId = "qa-goku-ux-child";

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

async function seedNoChild(page) {
  await page.goto(baseURL);
  await page.evaluate(({ accountScope }) => {
    const scoped = (base) => `${base}__${accountScope}`;
    localStorage.clear();
    localStorage.setItem("cleverli_session", JSON.stringify({
      email: "qa-goku-ux-polish@example.com",
      name: "QA UX",
      premium: true,
      userId: "qa-goku-ux-polish-user",
    }));
    localStorage.setItem(scoped("cleverli_family"), JSON.stringify({ members: [] }));
  }, { accountScope });
}

async function seedChild(page, options = {}) {
  await page.goto(baseURL);
  await page.evaluate(({ accountScope, childId, options }) => {
    const scoped = (base) => `${base}__${accountScope}`;
    const now = new Date().toISOString();
    localStorage.clear();
    localStorage.setItem("cleverli_session", JSON.stringify({
      email: "qa-goku-ux-polish@example.com",
      name: "QA UX",
      premium: true,
      userId: "qa-goku-ux-polish-user",
    }));
    localStorage.setItem(scoped("cleverli_family"), JSON.stringify({
      members: [
        {
          id: childId,
          name: options.longName ? "QA Kind Mit Einem Sehr Langen Namen" : "QA UX Kind",
          avatar: "Q",
          grade: 1,
          createdAt: now,
          curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 },
        },
      ],
    }));
    localStorage.setItem(scoped("cleverli_active_profile"), childId);
    localStorage.setItem(scoped("cleverli_parent_pin"), "2086475798");
    localStorage.setItem(scoped("cleverli_parent_unlocked"), JSON.stringify({ until: Date.now() + 60 * 60 * 1000 }));
    localStorage.setItem(scoped(`cleverli_profile_${childId}`), JSON.stringify({
      xp: 90,
      totalExercises: 6,
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
      coins: 6,
      ownedItems: [],
      equippedItems: {},
    }));
    localStorage.setItem(scoped(`cleverli_1_math_zahlen-1-10_child_${childId}`), JSON.stringify({
      completed: 6,
      score: 6,
      stars: 0,
      partial: true,
      lastPlayed: now,
    }));
    localStorage.setItem(scoped("cleverli_rewards"), JSON.stringify([
      {
        id: "reward-ux-topic",
        childId,
        emoji: "🎲",
        title: "QA Spielzeit",
        triggerType: "topics",
        triggerValue: 1,
        status: "unlocked",
        createdAt: now,
      },
    ]));
  }, { accountScope, childId, options });
}

function assertSourceGuards() {
  const reads = {
    memory: fs.readFileSync("src/components/exercises/MemoryGame.tsx", "utf8"),
    dragDrop: fs.readFileSync("src/components/exercises/DragDrop.tsx", "utf8"),
    mobileNav: fs.readFileSync("src/components/MobileBottomNav.tsx", "utf8"),
    childProfiles: fs.readFileSync("src/components/ChildProfileManager.tsx", "utf8"),
    topicHeader: fs.readFileSync("src/app/learn/[grade]/[subject]/[topic]/TopicHeaderClient.tsx", "utf8"),
    rewards: fs.readFileSync("src/app/rewards/PageClient.tsx", "utf8"),
    parents: fs.readFileSync("src/app/parents/PageClient.tsx", "utf8"),
  };

  const checks = [
    [reads.memory.includes("Memory-Karte"), "Memory cards have accessible labels"],
    [reads.memory.includes("aria-pressed"), "Memory cards expose pressed state"],
    [reads.dragDrop.includes("aria-grabbed"), "Drag/drop tiles expose grabbed state"],
    [reads.dragDrop.includes("Hier ablegen"), "Drag/drop zones expose a separate keyboard placement button"],
    [!reads.dragDrop.includes("role=\"button\""), "Drag/drop zones are not nested interactive controls"],
    [reads.dragDrop.includes("event.stopPropagation()"), "Placed drag/drop chip removal does not bubble into zone placement"],
    [reads.mobileNav.includes("aria-hidden=\"true\""), "Mobile nav decorative icons are hidden"],
    [reads.childProfiles.includes("Klasse ändern"), "Profile grade icon has explicit label/title"],
    [reads.childProfiles.includes("Profil löschen"), "Profile delete icon has explicit label/title"],
    [reads.topicHeader.includes("Das lernst du bei"), "Topic explainer is child-facing"],
    [reads.rewards.includes("meist 50 Aufgaben in Etappen"), "Reward topic estimate matches topic size"],
    [reads.rewards.includes("Als eingelöst markieren"), "Reward redeem action is not pre-confirmed"],
    [reads.parents.includes("!s.partial"), "Partial topics are not labelled as weak spots"],
  ];

  for (const [ok, label] of checks) {
    if (!ok) throw new Error(`Missing source guard: ${label}`);
  }
}

(async () => {
  assertSourceGuards();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

  await seedNoChild(page);
  await page.goto(`${baseURL}/dashboard`);
  await expectText(page, "Zuerst ein Kind hinzufügen");
  await expectText(page, "Kind hinzufügen");
  await rejectText(page, "Welche Klasse?");
  await page.evaluate(({ accountScope, childId }) => {
    const scoped = (base) => `${base}__${accountScope}`;
    const now = new Date().toISOString();
    localStorage.setItem(scoped("cleverli_family"), JSON.stringify({
      members: [
        {
          id: childId,
          name: "QA Restored Kind",
          avatar: "R",
          grade: 1,
          createdAt: now,
          curriculum: { canton: "ZH", schoolLanguage: "de", curriculumSystem: "lp21", version: 1 },
        },
      ],
    }));
    localStorage.setItem(scoped("cleverli_active_profile"), childId);
    window.dispatchEvent(new CustomEvent("cleverli-family-restored"));
  }, { accountScope, childId });
  await expectText(page, "QA Restored Kind");
  await expectText(page, "Was möchtest du lernen?");
  await rejectText(page, "Zuerst ein Kind hinzufügen");
  await page.screenshot({ path: ".qa/goku-ux-a11y-polish-2026-09-02/no-child-dashboard.png", fullPage: true });

  await seedChild(page, { longName: true });
  await page.goto(`${baseURL}/dashboard`);
  await expectText(page, "QA Kind Mit Einem Sehr Langen Namen");
  await expectText(page, "Was möchtest du lernen?");
  await rejectText(page, "Welche Klasse?");

  await page.goto(`${baseURL}/learn/1/math/zahlen-1-10`);
  await expectText(page, "6 von 50 erledigt");
  await expectText(page, "44 offen");
  await expectText(page, "Du übst kurze");
  await rejectText(page, "Dein Kind übt");
  await rejectText(page, "Aufgabe 1 von 44");
  await page.screenshot({ path: ".qa/goku-ux-a11y-polish-2026-09-02/resume-progress.png", fullPage: true });

  await page.evaluate(({ accountScope, childId }) => {
    const scoped = (base) => `${base}__${accountScope}`;
    localStorage.setItem(scoped(`cleverli_1_math_zahlen-1-10_child_${childId}`), JSON.stringify({
      completed: 50,
      score: 50,
      stars: 3,
      partial: false,
      lastPlayed: new Date().toISOString(),
    }));
  }, { accountScope, childId });

  await page.goto(`${baseURL}/rewards`);
  await expectText(page, "Als eingelöst markieren");
  await rejectText(page, "Eingelöst!");
  await expectText(page, "1/13");
  await page.screenshot({ path: ".qa/goku-ux-a11y-polish-2026-09-02/rewards-polish.png", fullPage: true });

  await page.goto(`${baseURL}/parents`);
  await rejectText(page, "Schwache Themen");
  await page.screenshot({ path: ".qa/goku-ux-a11y-polish-2026-09-02/parents-polish.png", fullPage: true });

  await browser.close();
  console.log("goku UX/a11y polish QA passed");
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
