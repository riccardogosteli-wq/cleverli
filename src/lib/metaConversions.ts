import "server-only";
import crypto from "node:crypto";
import * as Sentry from "@sentry/nextjs";

type MetaUserData = {
  email?: string | null;
  externalId?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
};

type MetaConversion = {
  eventName: string;
  eventId: string;
  eventSourceUrl?: string | null;
  userData: MetaUserData;
  customData?: Record<string, unknown>;
  eventTime?: number;
};

function hash(value?: string | null) {
  const clean = value?.trim().toLowerCase();
  return clean ? crypto.createHash("sha256").update(clean).digest("hex") : undefined;
}

export async function sendMetaConversion(event: MetaConversion) {
  const pixelId = process.env.META_PIXEL_ID ?? process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return { sent: false, reason: "not_configured" as const };

  const payload: Record<string, unknown> = {
    data: [{
      event_name: event.eventName,
      event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
      event_id: event.eventId,
      action_source: "website",
      event_source_url: event.eventSourceUrl ?? undefined,
      user_data: {
        em: hash(event.userData.email) ? [hash(event.userData.email)] : undefined,
        external_id: hash(event.userData.externalId) ? [hash(event.userData.externalId)] : undefined,
        client_ip_address: event.userData.clientIpAddress ?? undefined,
        client_user_agent: event.userData.clientUserAgent ?? undefined,
        fbp: event.userData.fbp ?? undefined,
        fbc: event.userData.fbc ?? undefined,
      },
      custom_data: event.customData,
    }],
  };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const response = await fetch(`https://graph.facebook.com/v25.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!response.ok) {
      const detail = (await response.text()).slice(0, 500);
      throw new Error(`Meta CAPI ${response.status}: ${detail}`);
    }
    return { sent: true };
  } catch (error) {
    Sentry.captureException(error);
    console.error("[meta-capi] event failed:", error);
    return { sent: false, reason: "request_failed" as const };
  }
}
