import type { Metadata } from "next";

/** Public, canonical pages share their own copy, not the root fallback. */
export function withPageSocial(metadata: Metadata): Metadata {
  const title = typeof metadata.title === "string" ? metadata.title : undefined;
  const description = metadata.description ?? undefined;
  const canonical = metadata.alternates?.canonical;
  const url = typeof canonical === "string" || canonical instanceof URL ? canonical : canonical?.url;
  const images = [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli: Die Lernplattform für die Primarschule" }];
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, title, description, url, images },
    twitter: { card: "summary_large_image", title, description, images: images.map((image) => image.url) },
  };
}
