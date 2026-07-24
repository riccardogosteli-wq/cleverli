import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

function scrubSentryEvent<T extends { user?: Record<string, unknown> }>(event: T): T {
  if (event.user) {
    delete event.user.email;
    delete event.user.username;
    delete event.user.name;
    delete event.user.ip_address;
  }

  return event;
}

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    beforeSend: scrubSentryEvent,
  });
}

if (posthogToken && typeof window !== "undefined") {
  posthog.init(posthogToken, {
    api_host: posthogHost,
    capture_pageview: "history_change",
    autocapture: false,
    disable_session_recording: true,
    mask_all_text: true,
    mask_all_element_attributes: true,
    persistence: "localStorage+cookie",
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
