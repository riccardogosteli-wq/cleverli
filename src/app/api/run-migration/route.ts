import { NextRequest, NextResponse } from "next/server";

// TEMPORARY — delete after migration runs once
const SECRET = process.env.MIGRATION_SECRET ?? "";

export async function POST(req: NextRequest) {
  const { secret } = await req.json().catch(() => ({}));
  if (!secret || secret !== SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { Client } = await import("pg");
  const client = new Client({
    connectionString: `postgresql://postgres.hfptpwxguplwiikmjifo:${process.env.DB_PASSWORD}@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    await client.query("ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS premium_until timestamptz");
    await client.query("ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS premium_plan text");
    await client.query("ALTER TABLE parent_profiles ADD COLUMN IF NOT EXISTS cancelled boolean DEFAULT false");
    const { rows } = await client.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'parent_profiles' ORDER BY ordinal_position"
    );
    await client.end();
    return NextResponse.json({ ok: true, columns: rows.map((r: {column_name: string}) => r.column_name) });
  } catch (e: unknown) {
    await client.end().catch(() => {});
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
