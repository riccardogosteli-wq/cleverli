import type { Metadata } from "next";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Kostenlos registrieren – Cleverli",
  description: "Jetzt kostenlos bei Cleverli anmelden. Die ersten 5 Aufgaben gratis — keine Kreditkarte nötig.",
  alternates: { canonical: "https://www.cleverli.ch/signup" },
};

export default function Page() {
  return <SignupClient />;
}
