import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cleverli Blog – Lernen, Motivation und Primarschule",
  description: "Praktische, kindgerechte Tipps rund ums Lernen, Motivation und den Schweizer Primarschulalltag.",
  alternates: { canonical: "https://www.cleverli.ch/blog" },
};

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-sm font-bold uppercase tracking-widest text-green-700">Cleverli Blog</p>
      <h1 className="mt-2 text-3xl font-black text-gray-950 sm:text-4xl">
        Lernen mit Freude begleiten
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-gray-700">
        Ehrliche, praktische Impulse für Eltern – warm, alltagstauglich und passend zur Schweizer Primarschule.
      </p>

      <article className="mt-8 rounded-3xl border border-green-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">Motivation</p>
        <h2 className="mt-2 text-2xl font-black text-gray-950">
          Kinder zum Lernen motivieren: Was wirklich hilft
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
          Warum Druck selten hilft – und wie kleine Erfolgserlebnisse, passende Routinen und echte Mitbestimmung das Lernen leichter machen.
        </p>
        <Link
          href="/blog/kinder-motivieren-zum-lernen"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-green-700 px-5 py-3 font-bold text-white transition-colors hover:bg-green-800"
        >
          Artikel lesen →
        </Link>
      </article>

      <Link href="/" className="mt-8 inline-flex min-h-11 items-center text-sm font-semibold text-green-800 underline">
        ← Zurück zur Startseite
      </Link>
    </main>
  );
}
