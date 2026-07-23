import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Kostenlos registrieren – Cleverli",
  description: "Jetzt kostenlos bei Cleverli anmelden. Die ersten 15 Aufgaben pro Thema gratis — keine Kreditkarte nötig.",
  alternates: { canonical: "https://www.cleverli.ch/signup" },
  openGraph: {
    title: "Kostenlos registrieren | Cleverli",
    description: "Jetzt kostenlos bei Cleverli anmelden. Die ersten 15 Aufgaben pro Thema gratis — keine Kreditkarte nötig.",
    images: [{ url: "https://www.cleverli.ch/og-image.png", width: 1200, height: 630, alt: "Cleverli — Lernen macht Spass" }],
  },
};

export default function Page() {
  return <SignupClient />;
}
