import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Kostenlos registrieren – Cleverli",
  description: "Jetzt kostenlos bei Cleverli anmelden. Die ersten 20 Aufgaben gratis — keine Kreditkarte nötig.",
  robots: { index: false },
  alternates: { canonical: "https://www.cleverli.ch/signup" },
  openGraph: {
    title: "Kostenlos registrieren | Cleverli",
    description: "Jetzt kostenlos bei Cleverli anmelden. Die ersten 20 Aufgaben gratis — keine Kreditkarte nötig.",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-logo-2026.png", width: 1200, height: 630, alt: "Cleverli Logo mit Maskottchen" }],
  },
};

export default function Page() {
  return <SignupClient />;
}
