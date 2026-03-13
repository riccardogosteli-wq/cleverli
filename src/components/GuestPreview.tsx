"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";

// ── Simple 4-lang helper ───────────────────────────────────────────────────────
function t4(lang: string, de: string, fr: string, it: string, en: string) {
  if (lang === "fr") return fr;
  if (lang === "it") return it;
  if (lang === "en") return en;
  return de;
}

// ── Parents preview ───────────────────────────────────────────────────────────
export function ParentsGuestPreview() {
  const { lang } = useLang();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-36 space-y-8">
      <div className="text-center space-y-3">
        <div className="text-5xl">👨‍👩‍👧</div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {t4(lang, "Elternbereich", "Espace Parents", "Area Genitori", "Parent Dashboard")}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          {t4(lang,
            "Verfolge den Lernfortschritt deines Kindes, verwalte Profile und sieh Schwachstellen auf einen Blick.",
            "Suivez les progrès d'apprentissage de votre enfant, gérez les profils et repérez les points faibles.",
            "Segui i progressi di apprendimento di tuo figlio, gestisci i profili e individua i punti deboli.",
            "Track your child's learning progress, manage profiles and spot weak areas at a glance."
          )}
        </p>
      </div>

      {/* Mock stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t4(lang, "Aufgaben gelöst", "Exercices faits", "Esercizi svolti", "Exercises done"), value: "142", icon: "✅" },
          { label: t4(lang, "Tage Streak", "Jours de suite", "Giorni di fila", "Day streak"), value: "7", icon: "🔥" },
          { label: t4(lang, "Trophäen", "Trophées", "Trofei", "Trophies"), value: "12", icon: "🏆" },
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
        <p className="font-bold text-gray-800 text-sm">
          🎯 {t4(lang, "Schwachstellen deines Kindes", "Points faibles de votre enfant", "Punti deboli di tuo figlio", "Your child's weak spots")}
        </p>
        {[
          t4(lang, "Subtraktion bis 20", "Soustraction jusqu'à 20", "Sottrazione fino a 20", "Subtraction up to 20"),
          t4(lang, "Silbentrennung", "Séparation des syllabes", "Divisione sillabe", "Syllable division"),
          t4(lang, "Körpersysteme", "Systèmes du corps", "Sistemi corporei", "Body systems"),
        ].map(topic => (
          <div key={topic} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div className="bg-red-300 h-2 rounded-full" style={{ width: "35%" }} />
            </div>
            <span className="text-xs text-gray-500 w-28 shrink-0">{topic}</span>
          </div>
        ))}
      </div>

      {/* Feature list */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 space-y-2">
        <p className="font-bold text-amber-900 text-sm">
          👨‍👩‍👧 {t4(lang, "Elternbereich-Funktionen:", "Fonctions espace parents :", "Funzioni area genitori:", "Parent area features:")}
        </p>
        <ul className="space-y-1 text-sm text-amber-800">
          <li>✅ {t4(lang, "Bis zu 3 Kinderprofile verwalten", "Gérer jusqu'à 3 profils enfants", "Gestisci fino a 3 profili bambino", "Manage up to 3 child profiles")}</li>
          <li>✅ {t4(lang, "Fortschrittsübersicht pro Thema", "Aperçu des progrès par thème", "Panoramica progressi per argomento", "Progress overview per topic")}</li>
          <li>✅ {t4(lang, "Schwachstellen-Analyse", "Analyse des points faibles", "Analisi punti deboli", "Weak spot analysis")}</li>
          <li>✅ {t4(lang, "14-Tage Aktivitäts-Heatmap", "Heatmap d'activité 14 jours", "Heatmap attività 14 giorni", "14-day activity heatmap")}</li>
          <li>✅ {t4(lang, "Belohnungssystem einrichten", "Configurer le système de récompenses", "Configura il sistema premi", "Set up reward system")}</li>
          <li>✅ {t4(lang, "PIN-geschützter Bereich", "Zone protégée par PIN", "Area protetta da PIN", "PIN-protected area")}</li>
        </ul>
      </div>

      <GuestCTAs />
    </div>
  );
}

// ── Shared CTA buttons ────────────────────────────────────────────────────────
function GuestCTAs() {
  const { lang } = useLang();
  const startLabel = t4(lang, "Jetzt kostenlos testen", "Essayer gratuitement", "Prova gratis", "Try for free");
  const loginLabel = t4(lang, "Anmelden", "Se connecter", "Accedi", "Log in");
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
  const { lang, tr } = useLang();
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-36 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <Image src="/cleverli-wave.png" alt="Cleverli" width={100} height={100}
          className="mx-auto drop-shadow-md animate-cleverli-jump" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {tr("heroTitle1") ?? t4(lang, "Lernen macht Spass", "Apprendre, c'est amusant", "Imparare è divertente", "Learning is fun")} 🎒
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          {tr("subtitle")?.split("\n")[0] ?? t4(lang,
            "Die interaktive Lernplattform für Schweizer Kinder der 1.–6. Klasse.",
            "La plateforme d'apprentissage interactive pour les enfants suisses de la 1re à la 6e.",
            "La piattaforma interattiva per i bambini svizzeri dalla 1ª alla 6ª classe.",
            "The interactive learning platform for Swiss children in grades 1–6."
          )}
        </p>
      </div>

      {/* Subject preview cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: "🔢", label: t4(lang, "Mathematik", "Mathématiques", "Matematica", "Mathematics"), color: "bg-blue-50 border-blue-200 text-blue-800" },
          { emoji: "📖", label: t4(lang, "Deutsch", "Allemand", "Tedesco", "German"), color: "bg-purple-50 border-purple-200 text-purple-800" },
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
        <p className="text-sm font-bold text-gray-700 text-center">
          🏫 {t4(lang, "Klassen 1–6 · Lehrplan 21 Schweiz", "Classes 1–6 · Plan d'études 21 Suisse", "Classi 1–6 · Piano di studio 21 Svizzera", "Grades 1–6 · Swiss Curriculum 21")}
        </p>
        <div className="grid grid-cols-6 gap-2">
          {[1,2,3,4,5,6].map(g => (
            <div key={g}
              className="aspect-square rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
              {g}.
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">
          {t4(lang, "Mathematik", "Mathématiques", "Matematica", "Mathematics")} · {t4(lang, "Deutsch", "Allemand", "Tedesco", "German")} · NMG &nbsp;·&nbsp; DE / FR / IT / EN
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {[
          { icon: "🎮", text: t4(lang, "Interaktive Übungen", "Exercices interactifs", "Esercizi interattivi", "Interactive exercises") },
          { icon: "🏆", text: t4(lang, "Trophäen & Level", "Trophées & niveaux", "Trofei e livelli", "Trophies & levels") },
          { icon: "⚡", text: t4(lang, "Tagesaufgabe", "Exercice du jour", "Esercizio del giorno", "Daily challenge") },
          { icon: "🆓", text: t4(lang, "5 Aufgaben gratis", "5 exercices gratuits", "5 esercizi gratuiti", "5 exercises free") },
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
          {t4(lang, "Meine Missionen", "Mes Missions", "Le mie Missioni", "My Missions")}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          {t4(lang,
            "Verfolge deinen Lernfortschritt auf der Missions-Karte — Bronzemedaille, Silber, Gold!",
            "Suis tes progrès sur la carte des missions — médaille de bronze, argent, or !",
            "Segui i tuoi progressi sulla mappa delle missioni — medaglia di bronzo, argento, oro!",
            "Track your learning progress on the mission map — bronze, silver, gold medal!"
          )}
        </p>
      </div>

      {/* Mock progress map */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wide">
          <span>{t4(lang, "Zahlen 1–10", "Nombres 1–10", "Numeri 1–10", "Numbers 1–10")}</span>
          <span className="text-green-700">{t4(lang, "Mathematik · 1. Klasse", "Mathématiques · 1re classe", "Matematica · 1ª classe", "Mathematics · Grade 1")}</span>
        </div>

        {/* Tier progress bar */}
        {[
          { label: t4(lang, "🥉 Anfänger", "🥉 Débutant", "🥉 Principiante", "🥉 Beginner"), done: 5, total: 5, color: "bg-amber-400", locked: false },
          { label: t4(lang, "🥈 Fortgeschritten", "🥈 Intermédiaire", "🥈 Intermedio", "🥈 Intermediate"), done: 3, total: 5, color: "bg-gray-300", locked: false },
          { label: t4(lang, "🥇 Meister", "🥇 Maître", "🥇 Maestro", "🥇 Master"), done: 0, total: 5, color: "bg-gray-200", locked: true },
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
          <span className="text-xs bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">
            ⭐ {t4(lang, "80 XP verdient", "80 XP gagnés", "80 XP guadagnati", "80 XP earned")}
          </span>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-full">
            🔥 {t4(lang, "3 Tage Streak", "3 jours de suite", "3 giorni di fila", "3-day streak")}
          </span>
        </div>
      </div>

      {/* More subjects teaser */}
      <div className="grid grid-cols-3 gap-3">
        {[
          `🔢 ${t4(lang, "Mathe", "Maths", "Matematica", "Maths")}`,
          `📖 ${t4(lang, "Deutsch", "Allemand", "Tedesco", "German")}`,
          "🌍 NMG",
        ].map(s => (
          <div key={s} className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center text-sm font-semibold text-gray-500 blur-[2px] select-none">
            {s}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-400 -mt-4">
        {t4(lang,
          "Alle Missionen nach Anmeldung sichtbar",
          "Toutes les missions visibles après connexion",
          "Tutte le missioni visibili dopo l'accesso",
          "All missions visible after sign in"
        )}
      </p>

      <GuestCTAs />
    </div>
  );
}

// ── Belohnungen preview ───────────────────────────────────────────────────────
export function BelohnungenGuestPreview() {
  const { lang } = useLang();

  const rewardExamples = [
    {
      emoji: "🍦",
      title: t4(lang, "Glacé am Wochenende", "Glace le week-end", "Gelato nel weekend", "Ice cream at the weekend"),
      trigger: t4(lang, "20 Aufgaben gelöst", "20 exercices résolus", "20 esercizi completati", "20 exercises completed"),
      progress: 14, total: 20, unlocked: false,
    },
    {
      emoji: "🎮",
      title: t4(lang, "1 Stunde Extra-Spielzeit", "1 heure de jeu en plus", "1 ora di gioco extra", "1 hour extra play time"),
      trigger: t4(lang, "7-Tage-Serie", "Série de 7 jours", "Serie di 7 giorni", "7-day streak"),
      progress: 7, total: 7, unlocked: true,
    },
    {
      emoji: "🎬",
      title: t4(lang, "Kinobesuch", "Sortie au cinéma", "Gita al cinema", "Trip to the cinema"),
      trigger: t4(lang, "50 Aufgaben gelöst", "50 exercices résolus", "50 esercizi completati", "50 exercises completed"),
      progress: 14, total: 50, unlocked: false,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 pb-36 space-y-8">
      {/* Hero */}
      <div className="text-center space-y-3">
        <Image src="/images/ui/Belohnungen.svg" alt="Belohnungen" width={120} height={120}
          className="mx-auto" unoptimized />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {t4(lang, "Belohnungen", "Récompenses", "Premi", "Rewards")} 🎁
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          {t4(lang,
            "Als Elternteil kannst du echte Belohnungen für dein Kind einrichten — zum Beispiel für 50 gelöste Aufgaben oder eine 7-Tage-Serie.",
            "En tant que parent, tu peux créer de vraies récompenses pour ton enfant — par exemple pour 50 exercices résolus ou une série de 7 jours.",
            "Come genitore puoi creare premi reali per tuo figlio — ad esempio per 50 esercizi completati o una serie di 7 giorni.",
            "As a parent you can set up real rewards for your child — for example for completing 50 exercises or a 7-day streak."
          )}
        </p>
      </div>

      {/* Mock reward cards */}
      <div className="space-y-3">
        {rewardExamples.map(r => (
          <div key={r.title}
            className={`border-2 rounded-2xl p-4 flex items-center gap-4 ${r.unlocked ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}`}>
            <span className="text-3xl">{r.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-900 text-sm">{r.title}</p>
                {r.unlocked && (
                  <span className="text-xs bg-green-700 text-white px-2 py-0.5 rounded-full font-bold">
                    🎉 {t4(lang, "Erreicht!", "Atteint !", "Raggiunto!", "Reached!")}
                  </span>
                )}
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
        <p className="font-bold text-amber-900 text-sm">
          👨‍👩‍👧 {t4(lang, "Was Eltern einrichten können:", "Ce que les parents peuvent configurer :", "Cosa possono configurare i genitori:", "What parents can set up:")}
        </p>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>✅ {t4(lang, "Eigene Belohnungen mit Foto/Emoji erstellen", "Créer ses propres récompenses avec photo/emoji", "Crea premi personalizzati con foto/emoji", "Create custom rewards with photo/emoji")}</li>
          <li>✅ {t4(lang, "Lernziele setzen (Aufgaben, Streak, Sterne)", "Fixer des objectifs (exercices, série, étoiles)", "Imposta obiettivi (esercizi, serie, stelle)", "Set learning goals (exercises, streak, stars)")}</li>
          <li>✅ {t4(lang, "Fortschritt des Kindes verfolgen", "Suivre les progrès de l'enfant", "Segui i progressi del bambino", "Track your child's progress")}</li>
          <li>✅ {t4(lang, "Belohnungen als eingelöst markieren", "Marquer les récompenses comme échangées", "Segna i premi come riscattati", "Mark rewards as redeemed")}</li>
          <li>✅ {t4(lang, "Bis zu 3 Kinderprofile verwalten", "Gérer jusqu'à 3 profils enfants", "Gestisci fino a 3 profili bambino", "Manage up to 3 child profiles")}</li>
        </ul>
      </div>

      <GuestCTAs />
    </div>
  );
}
