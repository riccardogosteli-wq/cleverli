import { Metadata } from "next";
import DailyClient from "./PageClient";

export const metadata: Metadata = {
  title: "Tagesaufgabe",
  description: "Deine tägliche Lernaufgabe auf Cleverli.",
  robots: { index: false, follow: false },
};

export default function DailyPage() {
  return <DailyClient />;
}
