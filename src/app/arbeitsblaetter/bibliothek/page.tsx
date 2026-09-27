import type { Metadata } from "next";
import WorksheetLibrary from "./WorksheetLibrary";
export const metadata: Metadata = { title: "Meine Arbeitsblätter | Cleverli", alternates: { canonical: "https://www.cleverli.ch/arbeitsblaetter/bibliothek" }, robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };
export default function LibraryPage() { return <WorksheetLibrary/>; }
