import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Let crawlers read this public fixture's noindex; other test routes stay blocked.
        allow: ["/", "/_next/static/", "/_next/image", "/test/roadmap"],
        disallow: [
        "/api/",
        "/_next/",
        "/account",
        "/payment/",
        "/kids",
        "/family",
        "/feedback/",
        "/shop",
        "/internal-log-dashboard",
        "/test/",
      ],
      },
    ],
    sitemap: "https://www.cleverli.ch/sitemap.xml",
    host: "https://www.cleverli.ch",
  };
}
