const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.vercel.production" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anon || !service) {
  throw new Error("Missing Supabase QA credentials");
}

const run = Date.now();
const email = `qa-progress-${run}@cleverli.ch`;
const secondEmail = `qa-progress-other-${run}@cleverli.ch`;
const password = `CleverliQA-${run}!`;
const childId = crypto.randomUUID();
const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });
const auth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
const otherAuth = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
let userId = null;
let secondUserId = null;

(async () => {
  try {
    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: "Progress QA" },
    });
    if (created.error) throw created.error;
    userId = created.data.user.id;

    const secondCreated = await admin.auth.admin.createUser({
      email: secondEmail,
      password,
      email_confirm: true,
      user_metadata: { name: "Progress QA Other" },
    });
    if (secondCreated.error) throw secondCreated.error;
    secondUserId = secondCreated.data.user.id;

    let result = await admin.from("parent_profiles").upsert({
      id: userId,
      email,
      name: "Progress QA",
      premium: true,
      premium_plan: "qa",
      premium_until: "2099-12-31T23:59:59+00:00",
      cancelled: false,
    }, { onConflict: "id" });
    if (result.error) throw result.error;

    result = await admin.from("parent_profiles").upsert({
      id: secondUserId,
      email: secondEmail,
      name: "Progress QA Other",
      premium: true,
      premium_plan: "qa",
      premium_until: "2099-12-31T23:59:59+00:00",
      cancelled: false,
    }, { onConflict: "id" });
    if (result.error) throw result.error;

    const signed = await auth.auth.signInWithPassword({ email, password });
    if (signed.error) throw signed.error;
    const secondSigned = await otherAuth.auth.signInWithPassword({ email: secondEmail, password });
    if (secondSigned.error) throw secondSigned.error;

    result = await auth.from("child_profiles").upsert({
      id: childId,
      parent_id: userId,
      name: "DB QA Child",
      grade: 1,
      avatar: "Q",
      canton: "ZH",
      school_language: "de",
      curriculum_system: "lp21",
      curriculum_profile_version: 1,
    }, { onConflict: "id" });
    if (result.error) throw result.error;

    result = await auth.from("child_progress").upsert({
      child_id: childId,
      parent_id: userId,
      xp: 12,
      daily_streak: 1,
      total_exercises: 2,
      total_topics_done: 0,
      costume: 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: "child_id" });
    if (result.error) throw result.error;

    result = await auth.from("topic_progress").upsert({
      child_id: childId,
      parent_id: userId,
      grade: 1,
      subject: "math",
      topic_id: "zahlen-1-10",
      stars: 0,
      score: 2,
      completed: 2,
      correct_ids: ["qa-a", "qa-b"],
      partial: true,
      last_played: new Date().toISOString(),
    }, { onConflict: "child_id,grade,subject,topic_id" });
    if (result.error) throw result.error;

    const readback = await auth
      .from("topic_progress")
      .select("completed,correct_ids")
      .eq("child_id", childId)
      .single();
    if (readback.error) throw readback.error;
    if (readback.data.completed !== 2 || readback.data.correct_ids?.length !== 2) {
      throw new Error(`Unexpected progress readback: ${JSON.stringify(readback.data)}`);
    }

    const squattedChildProgress = await otherAuth.from("child_progress").upsert({
      child_id: childId,
      parent_id: secondUserId,
      xp: 99,
      daily_streak: 9,
      total_exercises: 99,
      total_topics_done: 9,
      costume: 0,
      updated_at: new Date().toISOString(),
    }, { onConflict: "child_id" });
    if (!squattedChildProgress.error) {
      throw new Error("RLS allowed another parent to write child_progress for an unowned child");
    }

    const squattedTopicProgress = await otherAuth.from("topic_progress").upsert({
      child_id: childId,
      parent_id: secondUserId,
      grade: 1,
      subject: "math",
      topic_id: "zahlen-1-10",
      stars: 3,
      score: 50,
      completed: 50,
      correct_ids: ["bad"],
      partial: false,
      last_played: new Date().toISOString(),
    }, { onConflict: "child_id,grade,subject,topic_id" });
    if (!squattedTopicProgress.error) {
      throw new Error("RLS allowed another parent to write topic_progress for an unowned child");
    }

    console.log("supabase progress write QA passed");
  } finally {
    if (userId) {
      await admin.from("topic_progress").delete().eq("parent_id", userId);
      await admin.from("child_progress").delete().eq("parent_id", userId);
      await admin.from("child_profiles").delete().eq("parent_id", userId);
      await admin.from("parent_profiles").delete().eq("id", userId);
      await admin.auth.admin.deleteUser(userId);
    }
    if (secondUserId) {
      await admin.from("topic_progress").delete().eq("parent_id", secondUserId);
      await admin.from("child_progress").delete().eq("parent_id", secondUserId);
      await admin.from("child_profiles").delete().eq("parent_id", secondUserId);
      await admin.from("parent_profiles").delete().eq("id", secondUserId);
      await admin.auth.admin.deleteUser(secondUserId);
    }
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
