"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";

// ── Parents preview ───────────────────────────────────────────────────────────
export function ParentsGuestPreview() {
  const { lang } = useLang();
  const title = lang === "fr" ? "Espace Parents" : lang === "it" ? "Area Genitori" : lang === "en" ? "Parent Dashboard" : "Elternbereich";
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-36 space-y-8">
      <div className="text-center space-y-3">
        <div className="text-5xl">👨‍👩‍👧</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          Verfolge den Lernfortschritt deines Kindes, verwalte Profile und sieh Schwachstellen auf einen Blick.
        </p>
      </div>

      {/* Mock stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Aufgaben gelöst", value: "142", icon: "✅" },
          { label: "Tage Streak", value: "7", icon: "🔥" },
          { label: "Trophäen", value: "12", icon: "🏆" },
        ].map(s => (
          <div key={s.label} className="bg-white border-2 border-gray-200 rounded-2xl p-4 text-center">
            <div className="text-2xl">{s.icon}</div>
            <div className="text-xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Weak spots teaser */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 space-y-3">
        <p className="font-bold text-gray-800 text-sm">🎯 Schwachstellen deines Kindes</p>
        {["Subtraktion bis 20", "Silbentrennung", "Körpersysteme"].map(t => (
          <div key={t} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div className="bg-red-300 h-2 rounded-full" style={{ width: "35%" }} />
            </div>
            <span className="text-xs text-gray-500 w-28 shrink-0">{t}</span>
          </div>
        ))}
      </div>

      {/* Feature list */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 space-y-2">
        <p className="font-bold text-amber-900 text-sm">👨‍👩‍👧 Elternbereich-Funktionen:</p>
        <ul className="space-y-1 text-sm text-amber-800">
          <li>✅ Bis zu 3 Kinderprofile verwalten</li>
          <li>✅ Fortschrittsübersicht pro Thema</li>
          <li>✅ Schwachstellen-Analyse</li>
          <li>✅ 14-Tage Aktivitäts-Heatmap</li>
          <li>✅ Belohnungssystem einrichten</li>
          <li>✅ PIN-geschützter Bereich</li>
        </ul>
      </div>

      <GuestCTAs />
    </div>
  );
}

// ── Shared CTA buttons ────────────────────────────────────────────────────────
function GuestCTAs() {
  const { lang } = useLang();
  const startLabel = lang === "fr" ? "Essayer gratuitement" : lang === "it" ? "Prova gratis" : lang === "en" ? "Try for free" : "Jetzt kostenlos testen";
  const loginLabel = lang === "fr" ? "Se connecter" : lang === "it" ? "Accedi" : lang === "en" ? "Log in" : "Anmelden";
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
      <Link
        href="/learn/1/math/zahlen-1-10"
        style={{ minHeight: "52px" }}
        className="bg-green-700 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-green-600 active:scale-95 transition-all shadow-md text-center"
      >
        🎉 {startLabel}
      </Link>
      <Link
        href="/login"
        style={{ minHeight: "52px" }}
        className="border-2 border-green-700 text-green-700 px-8 py-4 rounded-full font-semibold text-base hover:bg-green-50 active:scale-95 transition-all text-center"
      >
        {loginLabel}
      </Link>
    </div>
  );
}

// ── Dashboard / Lernen preview ────────────────────────────────────────────────
export function DashboardGuestPreview() {
  const { tr } = useLang();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-36 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <Image src="/cleverli-wave.png" alt="Cleverli" width={100} height={100}
          className="mx-auto drop-shadow-md animate-cleverli-jump" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {tr("heroTitle1") ?? "Lernen macht Spass"} 🎒
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          {tr("subtitle")?.split("\n")[0] ?? "Die interaktive Lernplattform für Schweizer Kinder der 1.–6. Klasse."}
        </p>
      </div>

      {/* Subject preview cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: "🔢", label: "Mathematik", color: "bg-blue-50 border-blue-200 text-blue-800" },
          { emoji: "📖", label: "Deutsch", color: "bg-purple-50 border-purple-200 text-purple-800" },
          { emoji: "🌍", label: "NMG", color: "bg-green-50 border-green-200 text-green-800" },
        ].map(s => (
          <div key={s.label} className={`${s.color} border-2 rounded-2xl p-4 text-center`}>
            <div className="text-3xl mb-1">{s.emoji}</div>
            <div className="text-xs font-bold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Grade preview */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-3">
        <p className="text-sm font-bold text-gray-700 text-center">🏫 Klassen 1–6 · Lehrplan 21 Schweiz</p>
        <div className="grid grid-cols-6 gap-2">
          {[1,2,3,4,5,6].map(g => (
            <div key={g}
              className="aspect-square rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
              {g}.
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">
          Mathematik · Deutsch · NMG &nbsp;·&nbsp; DE / FR / IT / EN
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { icon: "🎮", text: "Interaktive Übungen" },
          { icon: "🏆", text: "Trophäen & Level" },
          { icon: "⚡", text: "Tagesaufgabe" },
          { icon: "🆓", text: "5 Aufgaben gratis" },
        ].map(f => (
          <div key={f.text} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2 font-medium text-gray-700">
            <span className="text-xl">{f.icon}</span> {f.text}
          </div>
        ))}
      </div>

      <GuestCTAs />
    </div>
  );
}

// ── Missionen preview ─────────────────────────────────────────────────────────
export function MissionenGuestPreview() {
  const { lang } = useLang();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-36 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <div className="text-5xl">🗺️</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {lang === "fr" ? "Mes Missions" : lang === "it" ? "Le mie Missioni" : lang === "en" ? "My Missions" : "Meine Missionen"}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          Verfolge deinen Lernfortschritt auf der Missions-Karte — Bronzemedaille, Silber, Gold!
        </p>
      </div>

      {/* Mock progress map */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
          <span>Zahlen 1–10</span>
          <span className="text-green-700">Mathematik · 1. Klasse</span>
        </div>

        {/* Tier progress bar */}
        {[
          { label: "🥉 Anfänger", done: 5, total: 5, color: "bg-amber-400", locked: false },
          { label: "🥈 Fortgeschritten", done: 3, total: 5, color: "bg-gray-300", locked: false },
          { label: "🥇 Meister", done: 0, total: 5, color: "bg-gray-200", locked: true },
        ].map(tier => (
          <div key={tier.label} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className={`font-semibold ${tier.locked ? "text-gray-400" : "text-gray-800"}`}>{tier.label}</span>
              <span className="text-xs text-gray-400">{tier.locked ? "🔒" : `${tier.done}/${tier.total}`}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`${tier.color} h-2.5 rounded-full transition-all`}
                style={{ width: `${(tier.done / tier.total) * 100}%` }}
              />
            </div>
          </div>
        ))}

        {/* XP badge */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">⭐ 80 XP verdient</span>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-full">🔥 3 Tage Streak</span>
        </div>
      </div>

      {/* More subjects teaser */}
      <div className="grid grid-cols-3 gap-3">
        {["🔢 Mathe", "📖 Deutsch", "🌍 NMG"].map(s => (
          <div key={s} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-sm font-semibold text-gray-500 blur-[2px] select-none">
            {s}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 -mt-4">Alle Missionen nach Anmeldung sichtbar</p>

      <GuestCTAs />
    </div>
  );
}

// ── Belohnungen preview ───────────────────────────────────────────────────────
export function BelohnungenGuestPreview() {
  const { lang } = useLang();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-36 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <Image src="/images/ui/Belohnungen.svg" alt="Belohnungen" width={120} height={120}
          className="mx-auto" unoptimized />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {lang === "fr" ? "Récompenses" : lang === "it" ? "Premi" : lang === "en" ? "Rewards" : "Belohnungen"} 🎁
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          Als Elternteil kannst du echte Belohnungen für dein Kind einrichten —
          zum Beispiel für 50 gelöste Aufgaben oder eine 7-Tage-Serie.
        </p>
      </div>

      {/* Mock reward cards */}
      <div className="space-y-3">
        {[
          { emoji: "🍦", title: "Glacé am Wochenende", trigger: "20 Aufgaben gelöst", progress: 14, total: 20, unlocked: false },
          { emoji: "🎮", title: "1 Stunde Extra-Spielzeit", trigger: "7-Tage-Serie", progress: 7, total: 7, unlocked: true },
          { emoji: "🎬", title: "Kinobesuch", trigger: "50 Aufgaben gelöst", progress: 14, total: 50, unlocked: false },
        ].map(r => (
          <div key={r.title}
            className={`border-2 rounded-2xl p-4 flex items-center gap-4 ${r.unlocked ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
            <span className="text-3xl">{r.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-900 text-sm">{r.title}</p>
                {r.unlocked && <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full font-bold">🎉 Erreicht!</span>}
              </div>
              <p className="text-xs text-gray-500 mb-1">{r.trigger}</p>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`${r.unlocked ? "bg-green-500" : "bg-amber-400"} h-2 rounded-full`}
                  style={{ width: `${Math.min((r.progress / r.total) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{r.progress} / {r.total}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Parent tools preview */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 space-y-3">
        <p className="font-bold text-amber-900 text-sm">👨‍👩‍👧 Was Eltern einrichten können:</p>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>✅ Eigene Belohnungen mit Foto/Emoji erstellen</li>
          <li>✅ Lernziele setzen (Aufgaben, Streak, Sterne)</li>
          <li>✅ Fortschritt des Kindes verfolgen</li>
          <li>✅ Belohnungen als eingelöst markieren</li>
          <li>✅ Bis zu 3 Kinderprofile verwalten</li>
        </ul>
      </div>

      <GuestCTAs />
    </div>
  );
}
