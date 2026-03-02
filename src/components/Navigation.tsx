"use client";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { LANGUAGES, Lang } from "@/lib/i18n";

export default function Navigation() {
  const { lang, setLang, tr } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold text-green-700">cleverli</span>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">beta</span>
      </Link>

      {/* Language switcher */}
      <div className="flex items-center gap-1">
        {LANGUAGES.map(l => (
          <button key={l.code} onClick={() => setLang(l.code as Lang)}
            className={`text-xl rounded-full p-1 transition-all ${lang === l.code ? "ring-2 ring-green-500 scale-110" : "opacity-60 hover:opacity-100"}`}
            title={l.name}>
            {l.flag}
          </button>
        ))}
      </div>

      <div className="hidden sm:flex items-center gap-3">
        <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">{tr("login")}</Link>
        <Link href="/signup" className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors">{tr("signup")}</Link>
      </div>

      <button className="sm:hidden text-gray-600" onClick={() => setOpen(o => !o)}>☰</button>
      {open && (
        <div className="absolute top-14 right-4 bg-white shadow-lg rounded-2xl p-4 flex flex-col gap-2 z-50 sm:hidden">
          <Link href="/login" className="text-sm text-gray-700" onClick={() => setOpen(false)}>{tr("login")}</Link>
          <Link href="/signup" className="text-sm bg-green-600 text-white px-4 py-2 rounded-full text-center" onClick={() => setOpen(false)}>{tr("signup")}</Link>
        </div>
      )}
    </nav>
  );
}
