import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) return null;
  return createClient(supabaseUrl, serviceKey);
}

export async function POST(req: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "push_not_configured" }, { status: 503 });
  }

  try {
    const { userId, subscription } = await req.json();
    if (!subscription) return NextResponse.json({ error: "Missing subscription" }, { status: 400 });

    await supabase
      .from("push_subscriptions")
      .upsert({ user_id: userId || null, subscription }, { onConflict: "endpoint" })
      .throwOnError();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
