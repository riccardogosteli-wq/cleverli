import { NextRequest, NextResponse } from "next/server";
import {
  INTERNAL_LOG_COOKIE,
  internalCookieMaxAge,
  signInternalSession,
} from "@/lib/internalDashboardAuth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const expected = process.env.INTERNAL_DASHBOARD_PASSWORD;

  if (!expected || password !== expected) {
    return NextResponse.redirect(new URL("/internal-log-dashboard?error=1", req.url), 303);
  }

  const res = NextResponse.redirect(new URL("/internal-log-dashboard", req.url), 303);
  res.cookies.set(INTERNAL_LOG_COOKIE, signInternalSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/internal-log-dashboard",
    maxAge: internalCookieMaxAge(),
  });
  return res;
}
