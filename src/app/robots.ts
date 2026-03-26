import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
        "/api/",
        "/_next/",
        "/account",
        "/payment/",
        "/kids",
        "/family",
        "/shop",
        "/test/",
      ],
      },
    ],
    sitemap: "https://www.cleverli.ch/sitemap.xml",
    host: "https://www.cleverli.ch",
  };
}
