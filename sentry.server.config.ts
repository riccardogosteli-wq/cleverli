import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,
    // Private offer capabilities arrive in a POST body, never report that request.
    beforeSendTransaction(event) {
      return ["/offer/personal", "/internal-log-dashboard/private-offer-mail", "/offer/click/"].some(path => event.transaction?.includes(path)) ? null : event;
    },
    beforeSend(event) {
      if (["/offer/personal", "/internal-log-dashboard/private-offer-mail", "/offer/click/"].some(path => event.request?.url?.includes(path) || event.transaction?.includes(path))) return null;
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
