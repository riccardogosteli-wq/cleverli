import { expect, test } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { mkdirSync, readFileSync } from "node:fs";
import * as path from "node:path";

test.use({ storageState: { cookies: [], origins: [] } });

const QA_DIR = path.join(process.cwd(), ".qa/curriculum-profiles-2026-08-31/public-rollout-real-auth");
mkdirSync(QA_DIR, { recursive: true });

type EnvMap = Record<string, string>;

function loadLocalEnv(): EnvMap {
  const envPath = path.join(process.cwd(), ".env.vercel.production");
  const raw = readFileSync(envPath, "utf8");
  const parsed: EnvMap = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const value = match[2].trim().replace(/^['"]|['"]$/g, "");
    parsed[match[1]] = value;
  }
  return parsed;
}

function makeAdminClient(): SupabaseClient {
  const localEnv = loadLocalEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? localEnv.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? localEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin credentials for real-auth curriculum QA");
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function cleanupQaUser(admin: SupabaseClient, userId: string | null, email: string) {
  if (userId) {
    await admin.from("topic_progress").delete().eq("parent_id", userId);
    await admin.from("child_progress").delete().eq("parent_id", userId);
    await admin.from("child_profiles").delete().eq("parent_id", userId);
    await admin.from("parent_profiles").delete().eq("id", userId);
    await admin.auth.admin.deleteUser(userId);
    return;
  }

  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  const users = data.users as Array<{ id: string; email?: string | null }>;
  const existing = users.find(user => user.email?.toLowerCase() === email.toLowerCase());
  if (existing) await admin.auth.admin.deleteUser(existing.id);
}

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}

test.describe("real production auth curriculum profile QA", () => {
  test.describe.configure({ retries: 0 });
  test.setTimeout(120_000);
  test.skip(process.env.E2E_REAL_AUTH !== "1", "Opt-in only: creates and deletes a real Supabase QA user");

  test("creates and updates canton profile through real auth, then preserves progress", async ({ page }) => {
    const admin = makeAdminClient();
    const runId = Date.now();
    const email = `qa-curriculum-${runId}@cleverli.ch`;
    const password = `CleverliQA-${runId}!`;
    let userId: string | null = null;
    let childId: string | null = null;

    try {
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: "Curriculum QA" },
      });
      expect(createError).toBeNull();
      userId = created.user?.id ?? null;
      expect(userId).toBeTruthy();

      const { error: profileError } = await admin.from("parent_profiles").upsert({
        id: userId,
        email,
        name: "Curriculum QA",
        premium: true,
        premium_plan: "qa",
        premium_until: "2099-12-31T23:59:59+00:00",
        cancelled: false,
      }, { onConflict: "id" });
      expect(profileError).toBeNull();

      const consoleErrors: string[] = [];
      page.on("console", message => {
        const text = message.text();
        if (message.type() === "error" && !text.includes("vercel.live/_next-live/feedback/feedback.js")) {
          consoleErrors.push(text);
        }
      });

      await page.goto("/login");
      await page.locator("input[type='email']").fill(email);
      await page.locator("input[type='password']").first().fill(password);
      await page.getByRole("button", { name: /Anmelden|Login/i }).click();
      await page.waitForURL(url => !url.pathname.includes("/login"), { timeout: 15_000 });

      await page.goto("/family");
      await expect(page.getByRole("heading", { name: /Familienprofile/i })).toBeVisible();
      await page.getByRole("button", { name: /Kind hinzufügen/i }).click();
      await page.getByPlaceholder("z.B. Emma").fill("QA Bern Kind");
      await page.getByRole("button", { name: /^3\. Kl\./ }).click();
      await expect(page.getByTestId("curriculum-canton")).toBeVisible();
      await page.getByTestId("curriculum-canton").selectOption("BE");
      await expect(page.getByTestId("curriculum-school-language")).toBeVisible();
      await page.getByTestId("curriculum-school-language").selectOption("de");
      await expect(page.getByTestId("curriculum-profile-status")).toContainText("verfügbar");
      await expectNoHorizontalOverflow(page);
      await page.screenshot({ path: path.join(QA_DIR, "mobile-create-bern-real-auth.png"), fullPage: true });
      await page.getByRole("button", { name: /^Hinzufügen$/ }).click();
      await expect(page.getByText("QA Bern Kind")).toBeVisible();

      await expect.poll(async () => {
        const { data } = await admin
          .from("child_profiles")
          .select("id, parent_id, name, grade, canton, school_language, curriculum_system, curriculum_profile_version")
          .eq("parent_id", userId)
          .eq("name", "QA Bern Kind")
          .maybeSingle();
        return data
          ? `${data.parent_id}|${data.name}|${data.grade}|${data.canton}|${data.school_language}|${data.curriculum_system}|${data.curriculum_profile_version}`
          : "";
      }, { timeout: 10_000 }).toBe(`${userId}|QA Bern Kind|3|BE|de|lp21|1`);

      const { data: child } = await admin
        .from("child_profiles")
        .select("id")
        .eq("parent_id", userId)
        .eq("name", "QA Bern Kind")
        .single();
      childId = child?.id ?? null;
      expect(childId).toBeTruthy();

      const progressPayload = {
        child_id: childId,
        parent_id: userId,
        grade: 3,
        subject: "english",
        topic_id: "qa-existing-topic",
        stars: 2,
        score: 7,
        completed: 7,
        correct_ids: ["qa-1", "qa-2"],
        partial: true,
        last_played: new Date().toISOString(),
      };
      const { error: progressError } = await admin
        .from("topic_progress")
        .upsert(progressPayload, { onConflict: "child_id, grade, subject, topic_id" });
      if (progressError && /correct_ids/i.test(progressError.message)) {
        const legacyProgressPayload = {
          child_id: progressPayload.child_id,
          parent_id: progressPayload.parent_id,
          grade: progressPayload.grade,
          subject: progressPayload.subject,
          topic_id: progressPayload.topic_id,
          stars: progressPayload.stars,
          score: progressPayload.score,
          completed: progressPayload.completed,
          partial: progressPayload.partial,
          last_played: progressPayload.last_played,
        };
        const { error: legacyProgressError } = await admin
          .from("topic_progress")
          .upsert(legacyProgressPayload, { onConflict: "child_id, grade, subject, topic_id" });
        expect(legacyProgressError).toBeNull();
      } else {
        expect(progressError).toBeNull();
      }

      await page.goto("/parents");
      await page.evaluate(() => {
        localStorage.setItem("cleverli_parent_unlocked", JSON.stringify({ until: Date.now() + 60 * 60 * 1000 }));
      });
      await page.reload();
      await expect(page.getByText("QA Bern Kind")).toBeVisible();
      await page.getByRole("button", { name: /Schulkanton ändern/ }).click();
      await page.getByTestId("curriculum-canton").selectOption("VS");
      await page.getByTestId("curriculum-school-language").selectOption("de");
      await expect(page.getByTestId("curriculum-profile-status")).toContainText("verfügbar");
      await expectNoHorizontalOverflow(page);
      await page.screenshot({ path: path.join(QA_DIR, "mobile-switch-vs-real-auth.png"), fullPage: true });
      await page.getByRole("button", { name: /Speichern/ }).click();
      await expect(page.getByText("Wallis · DE")).toBeVisible();

      await expect.poll(async () => {
        const { data } = await admin
          .from("child_profiles")
          .select("canton, school_language, curriculum_system, curriculum_profile_version")
          .eq("id", childId)
          .maybeSingle();
        return data
          ? `${data.canton}|${data.school_language}|${data.curriculum_system}|${data.curriculum_profile_version}`
          : "";
      }, { timeout: 10_000 }).toBe("VS|de|lp21|1");

      await expect.poll(async () => {
        const { data } = await admin
          .from("topic_progress")
          .select("completed, score")
          .eq("child_id", childId)
          .eq("topic_id", "qa-existing-topic")
          .maybeSingle();
        return data ? `${data.completed}|${data.score}` : "";
      }, { timeout: 10_000 }).toBe("7|7");

      expect(consoleErrors).toEqual([]);
    } finally {
      await cleanupQaUser(admin, userId, email);
    }
  });
});
