import { Metadata } from "next";
import DatenschutzClient from "./DatenschutzClient";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Cleverli.",
  robots: { index: false },
};

export default function Datenschutz() {
  return <DatenschutzClient />;
}
