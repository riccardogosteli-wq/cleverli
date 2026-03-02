"use client";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { LANGUAGES, Lang } from "@/lib/i18n";

export default function Navigation() {
  const { lang, setLang, tr } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-green-700">cleverli</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">beta</span>
        </Link>

        {/* Language switcher */}
        <div className="flex items-center gap-1">
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => setLang(l.code as Lang)}
              title={l.name}
              className={`text-xl rounded-lg p-1 transition-all ${
                lang === l.code
                  ? "ring-2 ring-green-500 bg-green-50 scale-110"
                  : "opacity-50 hover:opacity-100 hover:bg-gray-50"}`}>
              {l.flag}
            </button>
          ))}
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium">{tr("login")}</Link>
          <Link href="/signup" className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors font-medium shadow-sm">
            {tr("signup")}
          </Link>
        </div>

        {/* Mobile menu */}
        <button className="sm:hidden text-gray-700 text-2xl p-1" onClick={() => setOpen(o => !o)}>☰</button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
          <Link href="/login" className="text-sm text-gray-700 font-medium py-2" onClick={() => setOpen(false)}>{tr("login")}</Link>
          <Link href="/signup" className="text-sm bg-green-600 text-white px-4 py-2 rounded-full text-center font-medium" onClick={() => setOpen(false)}>{tr("signup")}</Link>
        </div>
      )}
    </nav>
  );
}
