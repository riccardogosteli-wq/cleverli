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

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm overflow-visible"
      style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}>
      <div className="flex items-center justify-between px-4 py-0 max-w-6xl mx-auto h-14 overflow-visible">
        {/* Logo — floats below nav bar for a premium feel */}
        <Link href="/" className="flex items-center gap-3 min-h-[44px] relative" onClick={() => setOpen(false)} style={{ marginBottom: "-28px", zIndex: 60 }}>
          <Image
            src="/cleverli-logo.png"
            alt="Cleverli – Lernplattform für Schweizer Kinder"
            width={210}
            height={70}
            className="w-auto object-contain drop-shadow-md"
            style={{ height: "90px" }}
            priority
          />
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium hidden sm:inline self-start mt-2">beta</span>
        </Link>

        {/* Language switcher — fixed container so switching never shifts layout */}
        <div className="flex items-center gap-0.5 sm:gap-1" style={{ width: "156px", flexShrink: 0 }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => setLang(l.code as Lang)}
              title={l.name}
              aria-label={l.name}
              style={{ width: "36px", height: "36px", fontSize: "20px", flexShrink: 0 }}
              className={`rounded-lg flex items-center justify-center transition-colors ${
                lang === l.code
                  ? "ring-2 ring-green-500 bg-green-50"
                  : "opacity-50 hover:opacity-100 hover:bg-gray-50"}`}>
              <span aria-hidden="true">{l.flag}</span>
            </button>
          ))}
        </div>

        {/* Desktop nav — fixed widths prevent layout shift on language change */}
        <div className="hidden sm:flex items-center gap-3" style={{ flexShrink: 0 }}>
          <XpBar />
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-green-700 font-medium py-2 px-2 whitespace-nowrap" style={{ minWidth: "80px", textAlign: "center" }}>{tr("learnNav")}</Link>
          <Link href="/rewards" className="text-sm text-amber-600 hover:text-amber-700 font-medium py-2 px-2 whitespace-nowrap">🎁</Link>
          {session ? (
            <>
              {isPremium && <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 shrink-0">⭐ Premium</span>}
              <button onClick={() => { logout(); window.location.href = "/"; }} className="text-sm text-gray-500 hover:text-gray-700 font-medium py-2 px-2 whitespace-nowrap">
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium py-2 px-2 whitespace-nowrap" style={{ minWidth: "56px", textAlign: "center" }}>{tr("login")}</Link>
              <Link href="/signup" className="text-sm bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors font-medium shadow-sm whitespace-nowrap inline-block text-center" style={{ width: "196px" }}>
                {tr("signup")}
              </Link>
            </>
          )}
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
            {tr("goLearn")}
          </Link>
          <Link href="/daily"
            className="text-base border-2 border-amber-400 text-amber-700 px-4 py-3 rounded-full text-center font-semibold active:bg-amber-50"
            onClick={() => setOpen(false)}>
            ⚡ {lang === "de" ? "Tagesaufgabe" : lang === "fr" ? "Défi du jour" : lang === "it" ? "Sfida del giorno" : "Daily Challenge"}
          </Link>
          <Link href="/trophies"
            className="text-base text-gray-600 font-medium py-3 px-4 rounded-xl hover:bg-gray-50"
            onClick={() => setOpen(false)}>
            🏆 {lang === "de" ? "Trophäen" : lang === "fr" ? "Trophées" : lang === "it" ? "Trofei" : "Trophies"}
          </Link>
          <Link href="/rewards"
            className="text-base text-amber-700 font-medium py-3 px-4 rounded-xl hover:bg-amber-50"
            onClick={() => setOpen(false)}>
            🎁 {lang === "de" ? "Belohnungen (Eltern)" : lang === "fr" ? "Récompenses (Parents)" : lang === "it" ? "Premi (Genitori)" : "Rewards (Parents)"}
          </Link>
        </div>
      )}
    </nav>
  );
}
