import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

function configureServices() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!publicKey || !privateKey || !supabaseUrl || !serviceKey) return null;

  webpush.setVapidDetails("mailto:hello@cleverli.ch", publicKey, privateKey);
  return createClient(supabaseUrl, serviceKey);
}

export async function GET() {
  const supabase = configureServices();
  if (!supabase) {
    return NextResponse.json({ error: "push_not_configured" }, { status: 503 });
  }

  try {
    const { data: subs } = await supabase
      .from("push_subscriptions")
      .select("subscription");

    if (!subs || subs.length === 0) return NextResponse.json({ sent: 0 });

    let sent = 0;
    for (const row of subs) {
      try {
        await webpush.sendNotification(
          row.subscription,
          JSON.stringify({
            title: "Cleverli ⚡",
            body: "Vergiss deine tägliche Aufgabe nicht! Dein Streak wartet auf dich 🔥",
            url: "/daily",
          })
        );
        sent++;
      } catch {
        // Subscription expired — remove it
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("subscription->endpoint", row.subscription.endpoint);
      }
    }

    return NextResponse.json({ sent });
  } catch (err) {
    console.error("Cron error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
