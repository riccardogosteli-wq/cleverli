import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendPaymentConfirmationEmail } from "@/lib/email";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

async function updateSupabasePremium(userId: string, plan: string, premium: boolean) {
  const now = new Date();
  const premiumUntil = premium
    ? plan === "yearly"
      ? new Date(now.setFullYear(now.getFullYear() + 1)).toISOString()
      : new Date(now.setMonth(now.getMonth() + 1)).toISOString()
    : null;

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/parent_profiles?id=eq.${userId}`,
    {
      method: "PATCH",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        premium,
        premium_plan: premium ? plan : null,
        premium_until: premiumUntil,
        cancelled: !premium,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error("[stripe-webhook] supabase update failed:", err);
    throw new Error("db_update_failed");
  }
}

async function getUserByStripeCustomer(stripeCustomerId: string): Promise<{ userId: string; email: string } | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/parent_profiles?stripe_customer_id=eq.${stripeCustomerId}&select=id`,
    {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    }
  );
  const rows = await res.json();
  if (!rows?.[0]?.id) return null;
  return { userId: rows[0].id, email: rows[0].email ?? "" };
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Subscription activated ──────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== "subscription") return NextResponse.json({ ok: true });

    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan ?? "monthly";
    const customerEmail = session.customer_details?.email ?? "";
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;

    if (!userId) {
      console.error("[stripe-webhook] no userId in metadata");
      return NextResponse.json({ error: "no_user" }, { status: 400 });
    }

    // Update Supabase
    await updateSupabasePremium(userId, plan, true);

    // Store Stripe IDs for cancellation lookup
    await fetch(
      `${SUPABASE_URL}/rest/v1/parent_profiles?id=eq.${userId}`,
      {
        method: "PATCH",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
        }),
      }
    );

    // Send confirmation email
    if (customerEmail) {
      sendPaymentConfirmationEmail(customerEmail, "", plan as "monthly" | "yearly").catch(() => {});
    }

    console.log(`[stripe-webhook] ✅ Premium activated for ${userId} (${plan})`);
  }

  // ── Subscription cancelled ───────────────────────────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.userId;
    const plan = subscription.metadata?.plan ?? "monthly";

    if (userId) {
      await updateSupabasePremium(userId, plan, false);
      console.log(`[stripe-webhook] ❌ Premium cancelled for ${userId}`);
    } else {
      // Fallback: look up by stripe_customer_id
      const user = await getUserByStripeCustomer(subscription.customer as string);
      if (user) {
        await updateSupabasePremium(user.userId, plan, false);
        console.log(`[stripe-webhook] ❌ Premium cancelled for ${user.userId} (by customer ID)`);
      }
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, service: "cleverli-stripe-webhook" });
}
