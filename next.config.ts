import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // CSP: permissive for Next.js compatibility, but blocks framing and restricts origins
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com", // Next.js + GTM
      "style-src 'self' 'unsafe-inline'",                // Tailwind inline styles
      "img-src 'self' data: blob: https: https://www.googletagmanager.com", // Next/Image + GTM
      "font-src 'self'",                                 // Geist is self-hosted via next/font
      [
        "connect-src 'self'",
        "https://*.supabase.co wss://*.supabase.co",
        "https://formspree.io",
        "https://*.google-analytics.com https://analytics.google.com https://region1.analytics.google.com",
        "https://ad.doubleclick.net https://stats.g.doubleclick.net https://www.google.com",
        "https://*.ingest.sentry.io https://*.ingest.us.sentry.io",
        "https://*.posthog.com https://*.i.posthog.com https://eu.i.posthog.com https://us.i.posthog.com",
      ].join(" "),
      "worker-src 'self' blob:",
      "frame-src https://www.googletagmanager.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256],
  },
};

const sentryEnabled = Boolean(
  process.env.SENTRY_AUTH_TOKEN ||
  process.env.SENTRY_DSN ||
  process.env.NEXT_PUBLIC_SENTRY_DSN
);

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: true,
      telemetry: false,
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
    })
  : nextConfig;
