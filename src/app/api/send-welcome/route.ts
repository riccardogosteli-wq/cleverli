import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email) return NextResponse.json({ error: "missing email" }, { status: 400 });
    await sendWelcomeEmail(email, name ?? "");
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[send-welcome]", e);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
