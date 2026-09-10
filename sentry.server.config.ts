import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
    // Private offer capabilities arrive in a POST body, never report that request.
    beforeSendTransaction(event) {
      return event.transaction?.includes("/offer/personal") ? null : event;
    },
    beforeSend(event) {
      if (event.request?.url?.includes("/offer/personal") || event.transaction?.includes("/offer/personal")) return null;
      if (event.user) {
        delete event.user.email;
        delete event.user.username;
        delete event.user.name;
        delete event.user.ip_address;
      }
      return event;
    },
  });
}
