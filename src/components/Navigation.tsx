"use client";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { LANGUAGES, Lang } from "@/lib/i18n";

export default function Navigation() {
  const { lang, setLang, tr } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm"
      style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}>
      <div className="flex items-center justify-between px-4 py-0 max-w-6xl mx-auto h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 min-h-[44px]" onClick={() => setOpen(false)}>
          <span className="text-xl sm:text-2xl font-bold text-green-700">cleverli</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium hidden sm:inline">beta</span>
        </Link>

        {/* Language switcher */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => setLang(l.code as Lang)}
              title={l.name}
              style={{ minWidth: "36px", minHeight: "36px" }}
              className={`text-lg sm:text-xl rounded-lg flex items-center justify-center transition-all ${
                lang === l.code
                  ? "ring-2 ring-green-500 bg-green-50 scale-110"
                  : "opacity-50 hover:opacity-100 hover:bg-gray-50"}`}>
              {l.flag}
            </button>
          ))}
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-green-700 font-medium py-2 px-2">🎒 Lernen</Link>
          <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium py-2 px-2">{tr("login")}</Link>
          <Link href="/signup" className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors font-medium shadow-sm">
            {tr("signup")}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-700 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          style={{ width: "44px", height: "44px", fontSize: "22px" }}
          onClick={() => setOpen(o => !o)}
          aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <Link href="/login"
            className="text-base text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100"
            onClick={() => setOpen(false)}>
            {tr("login")}
          </Link>
          <Link href="/signup"
            className="text-base bg-green-600 text-white px-4 py-3 rounded-full text-center font-bold active:bg-green-700"
            onClick={() => setOpen(false)}>
            {tr("signup")}
          </Link>
          <Link href="/dashboard"
            className="text-base border-2 border-green-600 text-green-700 px-4 py-3 rounded-full text-center font-semibold active:bg-green-50"
            onClick={() => setOpen(false)}>
            Zum Lernen →
          </Link>
        </div>
      )}
    </nav>
  );
}
