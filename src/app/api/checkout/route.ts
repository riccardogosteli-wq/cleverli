import { NextRequest, NextResponse } from "next/server";

const INSTANCE = "cleverli";
const API_KEY   = process.env.PAYREXX_API_KEY ?? "";
const BASE_URL  = process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.cleverli.ch";

const PLANS: Record<string, { amount: number; interval: string; title: string; desc: string }> = {
  monthly: {
    amount: 990,
    interval: "monthly",
    title: "Cleverli Premium — Monatlich",
    desc: "Unbegrenzter Zugang zu allen Aufgaben · CHF 9.90/Monat",
  },
  yearly: {
    amount: 9900,
    interval: "yearly",
    title: "Cleverli Premium — Jährlich",
    desc: "Ganzes Jahr unbegrenzt lernen · CHF 99/Jahr",
  },
};

async function payrexxPost(endpoint: string, params: Record<string, unknown>) {
  const res = await fetch(
    `https://api.payrexx.com/v1/${endpoint}/?instance=${INSTANCE}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body: JSON.stringify(params),
    }
  );
  return res.json();
}

export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get("plan") ?? "monthly";
  const userId = req.nextUrl.searchParams.get("uid") ?? "";   // Supabase user id

  if (!API_KEY) return NextResponse.json({ error: "payment_not_configured" }, { status: 503 });

  // Guest checkout: redirect to signup with plan pre-selected so uid is captured
  if (!userId) {
    const signupUrl = `${BASE_URL}/signup?next=/api/checkout?plan=${plan}`;
    return NextResponse.redirect(signupUrl);
  }

  const p = PLANS[plan] ?? PLANS.monthly;

  const result = await payrexxPost("Gateway", {
    amount: p.amount,
    currency: "CHF",
    title: p.title,
    description: p.desc,
    subscriptionInterval: p.interval,
    subscriptionCancellationInterval: 1,
    successRedirectUrl: `${BASE_URL}/payment/success?plan=${plan}`,
    failedRedirectUrl:  `${BASE_URL}/payment/cancel`,
    referenceId: userId ? `${plan}:${userId}` : plan,  // encode user id for webhook
  });

  const link = result?.data?.[0]?.link;
  if (!link) {
    console.error("[checkout] Payrexx error:", result);
    return NextResponse.json({ error: "gateway_failed" }, { status: 500 });
  }

  // Redirect user directly to Payrexx hosted payment page
  return NextResponse.redirect(link, 302);
}
