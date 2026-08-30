import type { Metadata } from "next";
import UpgradePageClient from "./PageClient";

export const metadata: Metadata = {
  title: "Cleverli Premium — lebenslanger Zugang für CHF 249",
  description: "Nur für kurze Zeit: lebenslanger Cleverli-Zugang mit allen Klassen 1–6 und bis zu 3 Kinderprofilen. Einmalig CHF 249 statt CHF 594.",
  openGraph: {
    title: "Lebenslanger Cleverli-Zugang — einmalig CHF 249",
    description: "Nur für kurze Zeit: lebenslanger Zugang, alle Klassen 1–6, alle Fächer und bis zu 3 Kinderprofile. CHF 249 statt CHF 594.",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
  alternates: { canonical: "https://www.cleverli.ch/upgrade" },
};

export default function UpgradePage() {
  return <UpgradePageClient />;
}
