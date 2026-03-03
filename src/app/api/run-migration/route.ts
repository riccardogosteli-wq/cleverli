import { NextRequest, NextResponse } from "next/server";

const SECRET = process.env.MIGRATION_SECRET ?? "";

export async function POST(req: NextRequest) {
  const { secret } = await req.json().catch(() => ({}));
  if (!secret || secret !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { Client } = await import("pg");
  const DB_PASS = process.env.DB_PASSWORD ?? "aAshQfCyGiz8F3.";
  const PROJECT = "hfptpwxguplwiikmjifo";

  const configs = [
    // Direct connection (IPv6, works from Vercel)
    `postgresql://postgres:${DB_PASS}@db.${PROJECT}.supabase.co:5432/postgres`,
    // Poolers — all regions
    `postgresql://postgres.${PROJECT}:${DB_PASS}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${PROJECT}:${DB_PASS}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
    `postgresql://postgres.${PROJECT}:${DB_PASS}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${PROJECT}:${DB_PASS}@aws-0-eu-west-2.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${PROJECT}:${DB_PASS}@aws-0-eu-north-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${PROJECT}:${DB_PASS}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${PROJECT}:${DB_PASS}@aws-0-us-west-1.pooler.supabase.com:5432/postgres`,
  ];

  const errors: string[] = [];

  for (const connStr of configs) {
    const client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
    try {
      await client.connect();
      await client.query("ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS premium_until timestamptz");
      await client.query("ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS premium_plan text");
      await client.query("ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS cancelled boolean DEFAULT false");
      const { rows } = await client.query(
        "SELECT column_name FROM information_schema.columns WHERE table_name='parent_profiles' ORDER BY ordinal_position"
      );
      await client.end();
      const host = connStr.split("@")[1]?.split("/")[0];
      return NextResponse.json({ ok: true, host, columns: rows.map((r: {column_name: string}) => r.column_name) });
    } catch (e: unknown) {
      errors.push(`${connStr.split("@")[1]?.split("/")[0]}: ${e instanceof Error ? e.message : String(e)}`);
      await client.end().catch(() => {});
    }
  }

  return NextResponse.json({ error: "all_failed", details: errors }, { status: 500 });
}
