import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

type ProductEventProperties = Record<string, string | number | boolean | null | undefined>;

export function captureAppError(error: unknown, context?: ProductEventProperties) {
  Sentry.withScope(scope => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        if (value !== undefined) scope.setTag(key, String(value));
      });
    }
    Sentry.captureException(error);
  });
}

export function captureProductEvent(eventName: string, properties: ProductEventProperties = {}) {
  if (typeof window === "undefined") return;

  try {
    if (posthog.__loaded) {
      posthog.capture(eventName, properties);
    }
  } catch {
    // Product telemetry must never break the exercise flow.
  }
}
