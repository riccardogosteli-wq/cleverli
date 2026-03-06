import { Metadata } from "next";
import TrophiesClient from "./PageClient";

export const metadata: Metadata = {
  title: "Missionen",
  description: "Deine Missionen und dein Lernfortschritt auf Cleverli — alle Fächer und Aufgaben im Überblick.",
  robots: { index: false, follow: false },
};

export default function TrophiesPage() {
  return <TrophiesClient />;
}
