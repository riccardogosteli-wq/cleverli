import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image"],
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
