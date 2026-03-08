import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LangProvider } from "@/lib/LangContext";
import { ProfileProvider } from "@/lib/ProfileContext";
import Navigation from "@/components/Navigation";
import StructuredData from "@/components/StructuredData";
import GameOverlays from "@/components/GameOverlays";
import MobileBottomNav from "@/components/MobileBottomNav";
import ClientInit from "@/components/ClientInit";

const GTM_ID = "GTM-K48335JC";

const geist = Geist({ subsets: ["latin"] });

const BASE_URL = "https://www.cleverli.ch";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // allow pinch zoom (accessibility)
  viewportFit: "cover", // iOS safe area
  themeColor: "#16a34a",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Cleverli — Lernen macht Spass 🇨🇭",
    template: "%s | Cleverli",
  },
  description: "Cleverli ist die interaktive Lernplattform für Schweizer Kinder der 1.–6. Klasse. Mathe, Deutsch & mehr — abgestimmt auf den Lehrplan 21. Jetzt kostenlos testen!",
  keywords: [
    "Lernplattform Schweiz", "Kinder Lernen", "Lehrplan 21",
    "Mathe 1. Klasse", "Deutsch 1. Klasse", "Mathe 2. Klasse",
    "Grundschule Schweiz", "Übungen Kinder", "interaktiv lernen",
    "Schulkinder App", "Lernen Volksschule", "Cleverli",
    "Mathematik Übungen", "Deutsch Übungen", "Primarschule",
  ],
  authors: [{ name: "Cleverli", url: BASE_URL }],
  creator: "Cleverli",
  publisher: "Cleverli",
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "de_CH",
    alternateLocale: ["fr_CH", "it_CH", "en_GB"],
    url: BASE_URL,
    siteName: "Cleverli",
    title: "Cleverli — Lernen macht Spass 🇨🇭",
    description: "Die interaktive Lernplattform für Schweizer Kinder der 1.–6. Klasse. Mathe, Deutsch & mehr — Lehrplan 21. Jetzt kostenlos testen!",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Cleverli — Lernen macht Spass" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cleverli — Lernen macht Spass 🇨🇭",
    description: "Interaktive Lernplattform für Schweizer Kinder. Mathe, Deutsch & NMG, Klasse 1–6, Lehrplan 21.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: BASE_URL,
    // Language switching is client-side; hreflang signals to Google that all 4 languages are served at same URL
    languages: {
      "x-default": BASE_URL,
      "de-CH": BASE_URL,
      "fr-CH": BASE_URL,
      "it-CH": BASE_URL,
      "en": BASE_URL,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "", // add GSC verification code later
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="beforeInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      </head>
      <body className={`${geist.className} bg-green-50 min-h-screen`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Skip-to-content link — visible on keyboard focus only (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-green-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Zum Inhalt springen
        </a>
        <LangProvider>
          <ProfileProvider>
            <ClientInit />
            <StructuredData />
            <Navigation />
            <GameOverlays />
            <div id="main-content" className="pb-[env(safe-area-inset-bottom)]">
              {children}
            </div>
            <MobileBottomNav />
          </ProfileProvider>
        </LangProvider>
      </body>
    </html>
  );
}
