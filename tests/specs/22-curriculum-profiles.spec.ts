import { expect, test, type Page } from "@playwright/test";
import { TEST_ACCOUNT } from "../fixtures/testData";
import { mkdirSync } from "node:fs";
import path from "node:path";

const CHILD_ID = "52e57a26-9918-43aa-84fd-e867b59188d3";
const QA_DIR = path.join(process.cwd(), ".qa/curriculum-profiles-2026-08-31");
mkdirSync(QA_DIR, { recursive: true });

type StoredCurriculum = {
  canton: string;
  schoolLanguage: string;
  curriculumSystem: string;
  version: number;
};

async function seedChild(page: Page, grade: number, curriculum?: StoredCurriculum) {
  await page.goto("/login");
  const email = page.locator("input[type=email]");
  if (await email.isVisible()) {
    await email.fill(TEST_ACCOUNT.email);
    await page.locator("input[type=password]").fill(TEST_ACCOUNT.password);
    await page.getByRole("button", { name: /Anmelden|Login/ }).click();
    await page.waitForURL(url => !url.pathname.includes("/login"));
  }
  await page.route("**/rest/v1/child_profiles**", route => route.fulfill({ status: 200, json: [] }));
  await page.goto("/dashboard");
  await page.evaluate(({ childId, childGrade, storedCurriculum }) => {
    localStorage.setItem("cleverli_family", JSON.stringify({
      members: [{
        id: childId,
        name: "QA Kind",
        avatar: "🦊",
        grade: childGrade,
        createdAt: "2026-08-31T00:00:00.000Z",
        ...(storedCurriculum ? { curriculum: storedCurriculum } : {}),
      }],
    }));
    localStorage.setItem("cleverli_active_profile", childId);
    localStorage.setItem("cleverli_last_grade", String(childGrade));
  }, { childId: CHILD_ID, childGrade: grade, storedCurriculum: curriculum });
  await page.reload();
  await expect(page.getByText("Was möchtest du lernen?")).toBeVisible();
}

test.describe("Curriculum profile rollout", () => {
  test("rollout flag keeps the selector completely hidden by default", async ({ page }) => {
    test.skip(process.env.CURRICULUM_EXPECT_DISABLED !== "1", "Run against a server built without the rollout flag");
    await page.goto("/family");
    await page.getByRole("button", { name: /Kind hinzufügen|Add a child|Ajouter un enfant|Aggiungi un bambino/ }).click();
    await expect(page.getByTestId("curriculum-canton")).toHaveCount(0);
  });

  test("legacy children keep today's E3/F5 subject visibility", async ({ page }) => {
    await seedChild(page, 3);
    await expect(page.getByTestId("subject-english")).toBeVisible();
    await expect(page.getByTestId("subject-french")).toHaveCount(0);
  });

  test("AI hides French in primary without changing progress", async ({ page }) => {
    await seedChild(page, 5, {
      canton: "AI",
      schoolLanguage: "de",
      curriculumSystem: "lp21",
      version: 1,
    });
    await page.evaluate(() => {
      localStorage.setItem("cleverli_5_french_existing-topic", JSON.stringify({ completed: 4, score: 4 }));
    });

    await expect(page.getByTestId("subject-english")).toBeVisible();
    await expect(page.getByTestId("subject-french")).toHaveCount(0);
    await expect.poll(() => page.evaluate(() => localStorage.getItem("cleverli_5_french_existing-topic")))
      .toContain('"completed":4');

    await page.goto("/dashboard?subject=french");
    await page.getByTestId("grade-5").click();
    await expect(page.getByText("Was möchtest du lernen?")).toBeVisible();
    await expect(page.getByTestId("subject-french")).toHaveCount(0);
  });

  test("unsupported F3/E5 selection safely retains the legacy catalogue", async ({ page }) => {
    await seedChild(page, 3, {
      canton: "BE",
      schoolLanguage: "de",
      curriculumSystem: "lp21",
      version: 1,
    });
    await expect(page.getByTestId("subject-english")).toBeVisible();
    await expect(page.getByTestId("subject-french")).toHaveCount(0);
  });

  test("selector handles multilingual and Graubünden requirements", async ({ page }) => {
    await page.goto("/family");
    await page.getByRole("button", { name: /Kind hinzufügen|Add a child|Ajouter un enfant|Aggiungi un bambino/ }).click();

    const canton = page.getByTestId("curriculum-canton");
    await expect(canton).toBeVisible();
    await canton.selectOption("ZH");
    await expect(page.getByTestId("curriculum-profile-status")).toContainText("verfügbar");

    await canton.selectOption("BE");
    await expect(page.getByTestId("curriculum-school-language")).toBeVisible();
    await expect(page.getByTestId("curriculum-profile-status")).toContainText("Vorbereitung");

    await canton.selectOption("GR");
    await expect(page.getByTestId("curriculum-school-language")).toBeVisible();
    await expect(page.getByTestId("curriculum-gr-region")).toBeVisible();
    await expect(page.getByTestId("curriculum-profile-status")).toContainText("Vorbereitung");
    await page.getByTestId("curriculum-profile-status").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: path.join(QA_DIR, "mobile-selector-gr.png"), fullPage: true });
  });

  test("desktop selector has no overflow and clearly shows supported status", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/family");
    await page.getByRole("button", { name: /Kind hinzufügen|Add a child|Ajouter un enfant|Aggiungi un bambino/ }).click();
    await page.getByTestId("curriculum-canton").selectOption("ZH");
    await expect(page.getByTestId("curriculum-profile-status")).toContainText("verfügbar");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: path.join(QA_DIR, "desktop-selector-zh.png"), fullPage: true });
  });

  test("existing family can change canton without losing progress", async ({ page }) => {
    await seedChild(page, 3);
    await page.evaluate(() => {
      localStorage.setItem("cleverli_3_english_existing-topic", JSON.stringify({ completed: 7, score: 6 }));
      localStorage.setItem("cleverli_parent_unlocked", JSON.stringify({ until: Date.now() + 60_000 }));
    });
    await page.goto("/parents");

    await page.getByRole("button", { name: /Schulkanton festlegen|Set school canton/ }).click();
    await page.getByTestId("curriculum-canton").selectOption("BE");
    await page.getByTestId("curriculum-school-language").selectOption("fr");
    await expect(page.getByTestId("curriculum-profile-status")).toContainText("Vorbereitung");
    await page.getByRole("button", { name: /Speichern|Save/ }).click();

    await expect(page.getByText("Bern · FR")).toBeVisible();
    const stored = await page.evaluate(({ childId }) => {
      const family = JSON.parse(localStorage.getItem("cleverli_family") ?? "{}");
      return {
        curriculum: family.members?.find((member: { id: string }) => member.id === childId)?.curriculum,
        progress: localStorage.getItem("cleverli_3_english_existing-topic"),
      };
    }, { childId: CHILD_ID });
    expect(stored.curriculum).toMatchObject({ canton: "BE", schoolLanguage: "fr", curriculumSystem: "per" });
    expect(stored.progress).toContain('"completed":7');
    await page.screenshot({ path: path.join(QA_DIR, "mobile-existing-profile-switched.png"), fullPage: true });
  });
});
