import { Metadata } from "next";
import RewardsClient from "./PageClient";

export const metadata: Metadata = {
  title: "Belohnungen",
  description: "Erstelle persönliche Belohnungen für dein Kind auf Cleverli.",
  robots: { index: false, follow: false },
};

export default function RewardsPage() {
  return <RewardsClient />;
}
