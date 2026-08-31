import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Client } from "pg";

function localEnvironment() {
  try {
    return Object.fromEntries(
      readFileSync(".env.vercel.production", "utf8")
        .split(/\r?\n/)
        .filter(line => line && !line.startsWith("#") && line.includes("="))
        .map(line => {
          const separator = line.indexOf("=");
          return [line.slice(0, separator), line.slice(separator + 1).replace(/^"|"$/g, "")];
        }),
    );
  } catch {
    return {};
  }
}

const env = { ...localEnvironment(), ...process.env };
assert.ok(env.DB_PASSWORD, "DB_PASSWORD is required");
assert.ok(env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL is required");

const projectRef = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
async function main() {
  const client = new Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
  const before = await client.query<{ children: number }>(
    "select count(*)::int as children from public.child_profiles",
  );
  await client.query("begin");
  const parent = await client.query<{ id: string }>(
    "select id from public.parent_profiles order by created_at asc limit 1",
  );
  assert.ok(parent.rows[0]?.id, "A parent profile is required for the transactional audit");

  const childId = "16c394f2-6ecb-4e32-82b5-c673abf1106c";
  await client.query(
    `insert into public.child_profiles
      (id, parent_id, name, grade, avatar, canton, school_language, curriculum_system, curriculum_profile_version)
     values ($1, $2, 'Curriculum QA', 3, '🦊', 'ZH', 'de', 'lp21', 1)`,
    [childId, parent.rows[0].id],
  );
  const stored = await client.query<{
    canton: string;
    school_language: string;
    curriculum_system: string;
    curriculum_profile_version: number;
  }>(
    "select canton, school_language, curriculum_system, curriculum_profile_version from public.child_profiles where id = $1",
    [childId],
  );
  assert.deepEqual(stored.rows[0], {
    canton: "ZH",
    school_language: "de",
    curriculum_system: "lp21",
    curriculum_profile_version: 1,
  });

  await assert.rejects(
    client.query("update public.child_profiles set canton = 'XX' where id = $1", [childId]),
    /child_profiles_canton_check/,
  );
  await client.query("rollback");

  const after = await client.query<{ children: number }>(
    "select count(*)::int as children from public.child_profiles",
  );
  assert.equal(after.rows[0].children, before.rows[0].children);
  console.log(`Curriculum database audit passed: transactional persistence, constraints and rollback (${after.rows[0].children} live child profiles unchanged).`);
  } catch (error) {
    await client.query("rollback").catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
