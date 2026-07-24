import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_LOG_COOKIE } from "@/lib/internalDashboardAuth";

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/internal-log-dashboard", req.url), 303);
  res.cookies.set(INTERNAL_LOG_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/internal-log-dashboard",
    maxAge: 0,
  });
  return res;
}
