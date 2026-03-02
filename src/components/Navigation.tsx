"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";
import { LANGUAGES, Lang } from "@/lib/i18n";
import XpBar from "./XpBar";
import { useSession } from "@/hooks/useSession";

export default function Navigation() {
  const { lang, setLang, tr } = useLang();
  const { session, isPremium, logout } = useSession();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === lang);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm overflow-visible"
      style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}>
      <div className="flex items-center justify-between px-4 py-0 max-w-6xl mx-auto h-14 overflow-visible">
        {/* Logo — floats below nav bar for a premium feel */}
        <Link href="/" className="flex items-center gap-3 min-h-[44px] relative" onClick={() => setOpen(false)} style={{ marginBottom: "-28px", zIndex: 60 }}>
          <Image
            src="/cleverli-wave.png"
            alt="Cleverli – Lernplattform für Schweizer Kinder"
            width={210}
            height={70}
            className="w-auto object-contain drop-shadow-md"
            style={{ height: "90px" }}
            priority
          />
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium hidden sm:inline self-start mt-2">beta</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3" style={{ flexShrink: 0 }}>
          <XpBar />
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-green-700 font-medium py-2 px-2 whitespace-nowrap"
            style={{ minWidth: "80px", textAlign: "center" }}
          >
            {tr("learnNav")}
          </Link>
          <Link
            href="/rewards"
            className="text-sm text-amber-600 hover:text-amber-700 font-medium py-2 px-2 whitespace-nowrap"
            aria-label={tr("navRewardsShort")}
            title={tr("navRewardsShort")}
          >
            🎁
          </Link>
          {session ? (
            <>
              {isPremium && (
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 shrink-0">
                  ⭐ Premium
                </span>
              )}
              <button
                onClick={() => { logout(); window.location.href = "/"; }}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium py-2 px-2 whitespace-nowrap"
                aria-label="Abmelden"
              >
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium py-2 px-2 whitespace-nowrap"
                style={{ minWidth: "56px", textAlign: "center" }}
              >
                {tr("login")}
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors font-medium shadow-sm whitespace-nowrap inline-block text-center min-w-[160px]"
              >
                {tr("signup")}
              </Link>
            </>
          )}

          {/* Language switcher */}
          <div className="relative ml-1" style={{ flexShrink: 0 }}>
            <button
              onClick={() => setLangOpen(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:border-green-300 hover:bg-green-50 transition-colors min-w-[44px]"
              aria-label={tr("navLanguage")}
              aria-expanded={langOpen}
              aria-haspopup="listbox"
            >
              <span style={{ fontSize: "18px" }}>{currentLang?.flag}</span>
              <span className="text-xs font-bold tracking-wide text-gray-500 uppercase">{lang}</span>
              <span className={`text-gray-400 text-xs transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} aria-hidden="true">▾</span>
            </button>
            {langOpen && <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} aria-hidden="true" />}
            {langOpen && (
              <ul
                role="listbox"
                aria-label={tr("navLanguage")}
                className="absolute right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[140px]"
              >
                {LANGUAGES.map(l => (
                  <li key={l.code} role="option" aria-selected={lang === l.code}>
                    <button
                      onClick={() => { setLang(l.code as Lang); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${lang === l.code ? "bg-green-50 text-green-700 font-bold" : "text-gray-700 hover:bg-gray-50"}`}
                    >
                      <span style={{ fontSize: "20px" }}>{l.flag}</span>
                      <span className="flex-1">{l.name}</span>
                      {lang === l.code && <span className="text-green-500 text-xs" aria-hidden="true">✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-700 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
          style={{ width: "44px", height: "44px", fontSize: "22px" }}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Menü schliessen" : "Menü öffnen"}
          aria-expanded={open}
        >
          <span aria-hidden="true">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="sm:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-2"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
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
            {tr("goLearn")}
          </Link>
          <Link href="/daily"
            className="text-base border-2 border-amber-400 text-amber-700 px-4 py-3 rounded-full text-center font-semibold active:bg-amber-50"
            onClick={() => setOpen(false)}>
            {tr("navDaily")}
          </Link>
          <Link href="/trophies"
            className="text-base text-gray-600 font-medium py-3 px-4 rounded-xl hover:bg-gray-50"
            onClick={() => setOpen(false)}>
            {tr("navTrophies")}
          </Link>
          <Link href="/rewards"
            className="text-base text-amber-700 font-medium py-3 px-4 rounded-xl hover:bg-amber-50"
            onClick={() => setOpen(false)}>
            {tr("navRewards")}
          </Link>

          {/* Language switcher in mobile menu */}
          <div className="border-t border-gray-100 pt-2 mt-1">
            <div className="text-xs text-gray-500 uppercase tracking-wider px-4 mb-2">
              {tr("navLanguage")}
            </div>
            <div className="flex gap-2 px-2" role="group" aria-label={tr("navLanguage")}>
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code as Lang); setOpen(false); }}
                  aria-label={l.name}
                  aria-pressed={lang === l.code}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-sm font-semibold transition-colors flex-1 justify-center ${
                    lang === l.code
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <span style={{ fontSize: "18px" }}>{l.flag}</span>
                  <span className="text-xs uppercase">{l.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
