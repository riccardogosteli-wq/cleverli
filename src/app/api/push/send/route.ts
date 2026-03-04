import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";

webpush.setVapidDetails(
  "mailto:hallo@cleverli.ch",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { subscription, title, body, url } = await req.json();
    if (!subscription) return NextResponse.json({ error: "Missing subscription" }, { status: 400 });

    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title: title || "Cleverli", body: body || "Vergiss deine tägliche Aufgabe nicht! ⚡", url: url || "/daily" })
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Push send error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
