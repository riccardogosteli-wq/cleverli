import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId, subscription } = await req.json();
    if (!subscription) return NextResponse.json({ error: "Missing subscription" }, { status: 400 });

    await supabase
      .from("push_subscriptions")
      .upsert({ user_id: userId || null, subscription }, { onConflict: "subscription->endpoint" })
      .throwOnError();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
