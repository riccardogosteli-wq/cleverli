import { Metadata } from "next";
import DashboardClient from "./PageClient";

export const metadata: Metadata = {
  title: "Lernen",
  description: "Wähle deine Klasse und dein Fach — interaktive Übungen für Klasse 1–3.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
