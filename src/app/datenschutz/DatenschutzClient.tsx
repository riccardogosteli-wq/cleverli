"use client";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { privacyContent } from "./privacyContent";

export default function DatenschutzClient() {
  const { lang } = useLang();
  const t = privacyContent[lang] ?? privacyContent.de;
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <Link href="/" className="inline-flex min-h-11 items-center px-2 text-sm text-gray-600 hover:text-gray-800">← {t.back}</Link>
      <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
      <p className="text-sm text-gray-600">{t.updated}</p>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 text-gray-700 text-sm leading-relaxed break-words">
        {t.sections.map(([heading, body]) => (
          <section key={heading}>
            <h2 className="font-bold text-gray-900 text-base mb-2">{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
        <a href="mailto:hello@cleverli.ch" className="inline-flex min-h-11 items-center text-green-800 underline">hello@cleverli.ch</a>
      </div>
    </div>
  );
}
