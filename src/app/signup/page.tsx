import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Kostenlos registrieren – Cleverli",
  description: "Jetzt kostenlos ein Cleverli-Konto erstellen und passende Übungen für dein Kind entdecken.",
  robots: { index: false },
  alternates: { canonical: "https://www.cleverli.ch/signup" },
  openGraph: {
    title: "Kostenlos registrieren | Cleverli",
    description: "Jetzt kostenlos ein Cleverli-Konto erstellen und passende Übungen für dein Kind entdecken.",
    images: [{ url: "https://www.cleverli.ch/og-cleverli-primarschule-2026.png", width: 1200, height: 630, alt: "Cleverli – Die Lernplattform für die Primarschule" }],
  },
};

export default function Page() {
  return <SignupClient />;
}
