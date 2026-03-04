import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:hallo@cleverli.ch",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
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
