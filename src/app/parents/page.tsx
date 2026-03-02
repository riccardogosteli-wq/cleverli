import { Metadata } from "next";
import ParentsClient from "./PageClient";

export const metadata: Metadata = {
  title: "Eltern-Dashboard",
  description: "Verfolge den Lernfortschritt deines Kindes auf Cleverli.",
  robots: { index: false, follow: false },
};

export default function ParentsPage() {
  return <ParentsClient />;
}
