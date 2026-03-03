"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OnboardingModal from "@/components/OnboardingModal";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { getTopics, SUBJECTS } from "@/data/index";
import { getTopicTitle } from "@/data/topicTitles";
import { isDailyDoneToday } from "@/lib/daily";
import { useProfile, Profile } from "@/hooks/useProfile";
import { useSession } from "@/hooks/useSession";
import { loadFamily, getActiveProfileId } from "@/lib/family";
import { getLevelForXp, getNextLevel, Level } from "@/lib/xp";
import RewardWidget from "@/components/RewardWidget";

const GRADE_COLORS = [
  { base: "bg-blue-50 border-blue-300 text-blue-800 hover:bg-blue-100 active:bg-blue-200", emoji: "🐣" },
  { base: "bg-purple-50 border-purple-300 text-purple-800 hover:bg-purple-100 active:bg-purple-200", emoji: "🦊" },
  { base: "bg-orange-50 border-orange-300 text-orange-800 hover:bg-orange-100 active:bg-orange-200", emoji: "🦁" },
  { base: "bg-teal-50 border-teal-300 text-teal-800 hover:bg-teal-100 active:bg-teal-200", emoji: "🦅" },
  { base: "bg-pink-50 border-pink-300 text-pink-800 hover:bg-pink-100 active:bg-pink-200", emoji: "🐉" },
  { base: "bg-indigo-50 border-indigo-300 text-indigo-800 hover:bg-indigo-100 active:bg-indigo-200", emoji: "🦄" },
];

const SUBJECT_META: Record<string, {
  emoji: string;
  iconBg: string;
  subtitle: { de: string; fr: string; it: string; en: string };
  label: { de: string; fr: string; it: string; en: string };
}> = {
  math:    {
    emoji: "🔢", iconBg: "bg-blue-100",
    label:    { de: "Mathematik",   fr: "Mathématiques", it: "Matematica",   en: "Maths" },
    subtitle: { de: "Zahlen & Rechnen", fr: "Chiffres & calcul", it: "Numeri & calcolo", en: "Numbers & Maths" },
  },
  german:  {
    emoji: "📖", iconBg: "bg-yellow-100",
    label:    { de: "Deutsch",      fr: "Allemand",      it: "Tedesco",      en: "German" },
    subtitle: { de: "Lesen & Schreiben", fr: "Lecture & écriture", it: "Lettura & scrittura", en: "Reading & Writing" },
  },
  science: {
    emoji: "🌍", iconBg: "bg-green-100",
    label:    { de: "NMG",          fr: "NHS",           it: "NUS",          en: "Science" },
    subtitle: { de: "Natur, Mensch, Gesellschaft", fr: "Nature, Humain et Société", it: "Natura, Uomo e Società", en: "Nature & Society" },
  },
};

const GRADE_KEY = "cleverli_last_grade";

function getProgress(grade: number, subject: string, topicId: string) {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`cleverli_${grade}_${subject}_${topicId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ── Sidebar — defined OUTSIDE DashboardInner to avoid "component created during render" error ──
interface SidebarProps {
  profile: Profile;
  level: Level;
  nextLevel: Level | null;
  dailyDone: boolean;
  lang: string;
}

// Compact mobile-only bar — single row, minimal height
function MobileDailyBar({ dailyDone, lang }: { dailyDone: boolean; lang: string }) {
  if (dailyDone) return null;
  return (
    <Link href="/daily"
      className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2 transition-all active:scale-95">
      <span className="text-lg">⚡</span>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-bold text-amber-800">
          {lang === "fr" ? "Défi du jour" : lang === "it" ? "Sfida del giorno" : lang === "en" ? "Daily Challenge" : "Tagesaufgabe"}
        </span>
        <span className="text-xs text-amber-600 ml-1">+30 XP</span>
      </div>
      <span className="text-xs font-semibold text-amber-600">→</span>
    </Link>
  );
}

function Sidebar({ profile, level, nextLevel, dailyDone, lang }: SidebarProps) {
  const xpToNext = nextLevel ? nextLevel.minXp - profile.xp : 0;
  const xpPct = nextLevel
    ? Math.round((profile.xp - level.minXp) / (nextLevel.minXp - level.minXp) * 100)
    : 100;
  const levelTitle = (lv: Level) => {
    if (lang === "fr") return lv.titleFr;
    if (lang === "it") return lv.titleIt;
    if (lang === "en") return lv.titleEn;
    return lv.title;
  };
  return (
    <aside className="space-y-4">
      {/* XP strip */}
      {(profile.xp > 0 || profile.dailyStreak > 0) && (
        <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <span className="text-2xl">{level.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-800 text-sm">{levelTitle(level)}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${xpPct}%`, backgroundColor: level.color }} />
              </div>
              <span className="text-xs text-gray-400 shrink-0">
                {nextLevel ? `${xpToNext} XP` : `${profile.xp} XP`}
              </span>
            </div>
          </div>
          {profile.dailyStreak >= 2 && (
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
              <span className="text-base">🔥</span>
              <span className="text-sm font-bold text-orange-700">{profile.dailyStreak}</span>
            </div>
          )}
        </div>
      )}
      {/* Reward widget */}
      <RewardWidget profile={{
        totalExercises: profile.totalExercises,
        totalTopicsComplete: profile.totalTopicsComplete,
        dailyStreak: profile.dailyStreak,
      }} />
      {/* Daily challenge */}
      <Link href="/daily"
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all active:scale-95 ${dailyDone ? "bg-green-50 border-green-300 opacity-70" : "bg-amber-50 border-amber-300 hover:bg-amber-100"}`}>
        <span className="text-3xl">{dailyDone ? "✅" : "⚡"}</span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-amber-800 text-sm">
            {lang === "fr" ? "Défi du jour" : lang === "it" ? "Sfida del giorno" : lang === "en" ? "Daily Challenge" : "Tagesaufgabe"}
          </div>
          <div className="text-xs text-amber-600">
            {dailyDone
              ? (lang === "fr" ? "Terminé ! Reviens demain." : lang === "it" ? "Fatto! Torna domani." : lang === "en" ? "Done! Come back tomorrow." : "Erledigt! Morgen gibt es eine neue.")
              : (lang === "fr" ? "+30 XP bonus · Un essai par jour" : lang === "it" ? "+30 XP bonus" : lang === "en" ? "+30 Bonus XP · One try per day" : "+30 Bonus-XP · Einmal pro Tag")}
          </div>
        </div>
        <Image src={dailyDone ? "/cleverli-celebrate.png" : "/cleverli-run.png"}
          alt={dailyDone ? "Cleverli feiert" : "Cleverli läuft"}
          width={44} height={44} className="drop-shadow-sm shrink-0" />
      </Link>
    </aside>
  );
}

function DashboardInner() {
  const { tr, lang } = useLang();
  const { profile } = useProfile();
  const { isPremium: sessionPremium, loaded: sessionLoaded, session } = useSession();
  const uid = session?.userId ?? "";
  const searchParams = useSearchParams();
  const preselectedSubject = searchParams.get("subject");

  const [grade, setGrade] = useState<number | null>(null);
  const [subject, setSubject] = useState<string | null>(preselectedSubject);
  const [dailyDone, setDailyDone] = useState(false);
  const [activeMember, setActiveMember] = useState<{ name: string; avatar: string } | null>(null);
  const [familySize, setFamilySize] = useState(0);
  // (notify signup widget removed — state retained for safety)
  // Restore last-used grade from localStorage + load active child profile
  useEffect(() => {
    setDailyDone(isDailyDoneToday());
    if (!preselectedSubject) {
      const saved = localStorage.getItem(GRADE_KEY);
      if (saved) setGrade(parseInt(saved));
    }
    // PM-3/PM-4: show active child banner when family has 2+ profiles
    const family = loadFamily();
    setFamilySize(family.members.length);
    if (family.members.length >= 1) {
      const activeId = getActiveProfileId();
      const member = family.members.find(m => m.id === activeId) ?? family.members[0];
      if (member) setActiveMember({ name: member.name, avatar: member.avatar });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSubject(preselectedSubject);
    if (preselectedSubject) setGrade(null);
  }, [preselectedSubject]);

  const chooseGrade = (g: number) => {
    localStorage.setItem(GRADE_KEY, String(g));
    setGrade(g);
  };



  const subjectL = (id: string, key: "label" | "subtitle") => {
    const meta = SUBJECT_META[id];
    if (!meta) return id;
    return meta[key][lang as keyof typeof meta.label] ?? meta[key].de;
  };

  const level = profile ? getLevelForXp(profile.xp) : null;
  const nextLevel = profile ? getNextLevel(profile.xp) : null;

  // ── STEP 1: Choose grade ──────────────────────────────────────────────────
  if (!grade) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:block" style={{minHeight: "calc(100dvh - 140px)"}}>
        <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
          {/* Sidebar — hidden on mobile (shown inline below) */}
          <div className="hidden md:block">
            {profile && level && <Sidebar profile={profile} level={level} nextLevel={nextLevel} dailyDone={dailyDone} lang={lang} />}
          </div>

          <div className="space-y-5">
            {/* Mobile-only: compact daily bar (full sidebar is desktop-only) */}
            <div className="md:hidden">
              <MobileDailyBar dailyDone={dailyDone} lang={lang} />
            </div>

            {/* Grade picker header */}
            <div className="text-center space-y-1">
              {subject && SUBJECT_META[subject] && (
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-semibold px-3 py-1.5 rounded-full mb-1">
                  {SUBJECT_META[subject].emoji} {subjectL(subject, "subtitle")}
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-800">
                {lang === "fr" ? "Quelle classe?" : lang === "it" ? "Che classe?" : lang === "en" ? "Which class?" : "In welcher Klasse bist du?"}
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map((g, i) => (
                <button key={g} onClick={() => chooseGrade(g)}
                  style={{ minHeight: "100px", transition: "all 0.15s ease" }}
                  className={`border-2 rounded-2xl font-bold active:scale-95 flex flex-col items-center justify-center gap-1 ${GRADE_COLORS[i].base}`}>
                  <div className="text-3xl">{GRADE_COLORS[i].emoji}</div>
                  <div className="text-2xl font-black">{g}.</div>
                  <div className="text-xs font-medium opacity-70">{tr("gradeLabel")}</div>
                </button>
              ))}
            </div>


          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Choose subject (only if NOT pre-selected from URL) ────────────
  if (!subject) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:block" style={{minHeight: "calc(100dvh - 140px)"}}>
        <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
          <div className="hidden md:block">{profile && level && <Sidebar profile={profile} level={level} nextLevel={nextLevel} dailyDone={dailyDone} lang={lang} />}</div>
          <div className="space-y-5">
            <div className="md:hidden mb-2"><MobileDailyBar dailyDone={dailyDone} lang={lang} /></div>
            {/* PM-20: Nicer subject picker header with mascot */}
            <div className="flex items-center gap-3">
              <button onClick={() => setGrade(null)} className="text-sm text-gray-400 hover:text-gray-600 py-2 pr-3 min-w-[44px]">←</button>
              <Image
                src="/images/mascot/cleverli-thumbsup.png"
                alt="Cleverli"
                width={52} height={52}
                className="drop-shadow-md shrink-0"
              />
              <div>
                <h2 className="text-lg font-black text-gray-800 leading-tight">
                  {lang === "fr" ? "Que veux-tu apprendre?" : lang === "it" ? "Cosa vuoi imparare?" : lang === "en" ? "What do you want to learn?" : "Was möchtest du lernen?"}
                </h2>
                <div className="text-xs text-gray-400">{grade}. {tr("gradeLabel")}</div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-1">
              {SUBJECTS.map(s => {
                const meta = SUBJECT_META[s.id];
                const topics = getTopics(grade, s.id);
                const done = topics.filter(t => getProgress(grade, s.id, t.id)).length;
                return (
                  <button key={s.id} onClick={() => setSubject(s.id)}
                    style={{ minHeight: "80px", transition: "all 0.15s ease" }}
                    className={`border-2 rounded-2xl font-bold active:scale-95 flex items-center gap-4 px-5 text-left ${s.color}`}>
                    <div className={`w-12 h-12 ${meta?.iconBg ?? "bg-gray-100"} rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                      {s.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-base">{subjectL(s.id, "label")}</div>
                      <div className="text-xs font-normal opacity-70">{subjectL(s.id, "subtitle")}</div>
                    </div>
                    {done > 0 && (
                      <div className="text-xs font-semibold opacity-60 shrink-0">{done}/{topics.length} ✓</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 3: Topic list ────────────────────────────────────────────────────
  const topics = getTopics(grade, subject);
  const currentSubjectMeta = SUBJECT_META[subject];
  const completedCount = topics.filter(t => getProgress(grade, subject, t.id)).length;
  // First not-done topic index — that's where we show "Start ✨"
  const firstNotDoneIdx = topics.findIndex(t => !getProgress(grade, subject, t.id));

  // UJ-4: premium awareness (from session, only after hydration)
  const isPremium = sessionLoaded ? sessionPremium : true; // assume premium until loaded (avoids false lock flash)
  const isGrade3Locked = grade === 3 && sessionLoaded && !sessionPremium;

  const handleBack = () => {
    if (preselectedSubject) setGrade(null);
    else setSubject(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 pb-24 sm:pb-5">
      {/* UJ-11: Onboarding modal for first-time users */}
      <OnboardingModal />

      {/* PM-3/PM-4: Active child profile banner */}
      {activeMember && familySize >= 1 && (
        <div className="flex items-center gap-3 bg-blue-50 border-2 border-blue-200 rounded-2xl px-4 py-2.5 mb-4">
          <span className="text-2xl">{activeMember.avatar}</span>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-blue-800 text-sm">
              {lang === "fr" ? `${activeMember.name} apprend aujourd'hui`
               : lang === "it" ? `${activeMember.name} impara oggi`
               : lang === "en" ? `${activeMember.name} is learning today`
               : `${activeMember.name} lernt heute`}
            </span>
          </div>
          <a href="/parents"
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold border border-blue-300 rounded-lg px-2.5 py-1 hover:bg-blue-100 transition-colors shrink-0">
            {lang === "fr" ? "Changer" : lang === "it" ? "Cambia" : lang === "en" ? "Switch" : "Wechseln"}
          </a>
        </div>
      )}

      <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
      <div className="hidden md:block">{profile && level && <Sidebar profile={profile} level={level} nextLevel={nextLevel} dailyDone={dailyDone} lang={lang} />}</div>
      <div className="space-y-4">
      <div className="md:hidden mb-2"><MobileDailyBar dailyDone={dailyDone} lang={lang} /></div>

      {/* Header */}
      <div className="flex items-center gap-2">
        <button onClick={handleBack} className="text-sm text-gray-400 hover:text-gray-600 py-2 pr-2 min-w-[44px]">←</button>
        <div className={`w-9 h-9 ${currentSubjectMeta?.iconBg ?? "bg-gray-100"} rounded-xl flex items-center justify-center text-lg`}>
          {currentSubjectMeta?.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-800 leading-tight">{subjectL(subject, "label")} — {grade}. {tr("gradeLabel")}</h2>
          <div className="text-xs text-gray-400">{subjectL(subject, "subtitle")}</div>
        </div>
      </div>

      {/* Subject switcher — always visible, colored by subject */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {SUBJECTS.map(s => {
          const isActive = s.id === subject;
          const activeCls = s.id === "math"
            ? "bg-blue-500 text-white border-blue-500"
            : s.id === "german"
              ? "bg-yellow-500 text-white border-yellow-500"
              : "bg-green-600 text-white border-green-600";
          return (
            <button key={s.id}
              onClick={() => setSubject(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors shrink-0 shadow-sm ${
                isActive ? activeCls : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              }`}>
              {SUBJECT_META[s.id]?.emoji} {subjectL(s.id, "label")}
            </button>
          );
        })}
      </div>

      {/* Progress summary */}
      {completedCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div className="flex-1">
            <div className="text-sm font-bold text-green-800">
              {completedCount} {lang === "fr" ? "thèmes terminés" : lang === "it" ? "argomenti completati" : lang === "en" ? "topics done" : "Themen geschafft"}
              {" "}/ {topics.length}
            </div>
            <div className="h-1.5 bg-green-200 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${Math.round((completedCount / topics.length) * 100)}%` }} />
            </div>
          </div>
          {completedCount === topics.length && <span className="text-2xl">🎉</span>}
        </div>
      )}

      {/* UJ-10: Streak expiry warning — show when streak > 0 and daily not yet done */}
      {profile && profile.dailyStreak > 0 && !dailyDone && (
        <Link href="/daily" className="flex items-center gap-3 bg-amber-50 border-2 border-amber-300 rounded-2xl px-4 py-3 text-sm text-amber-800 font-medium hover:bg-amber-100 transition-colors">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <div className="font-bold">
              {lang === "fr" ? `Ta série de ${profile.dailyStreak} jours se termine ce soir!`
               : lang === "it" ? `La tua serie di ${profile.dailyStreak} giorni finisce stasera!`
               : lang === "en" ? `Your ${profile.dailyStreak}-day streak ends tonight!`
               : `Dein ${profile.dailyStreak}-Tage-Streak endet heute!`}
            </div>
            <div className="text-xs opacity-75">
              {lang === "fr" ? "Fais le défi du jour →"
               : lang === "it" ? "Fai la sfida del giorno →"
               : lang === "en" ? "Complete today's challenge →"
               : "Tägliche Aufgabe lösen →"}
            </div>
          </div>
          <span className="text-lg">🔥</span>
        </Link>
      )}

      {/* UJ-4: Premium upsell banner for grade 3 free users */}
      {isGrade3Locked && (
        <Link href={uid ? `/api/checkout?plan=monthly&uid=${uid}` : "/upgrade"} className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl px-4 py-3 text-sm text-amber-900 hover:from-amber-100 hover:to-orange-100 transition-colors">
          <span className="text-2xl">🔓</span>
          <div className="flex-1">
            <div className="font-bold">
              {lang === "fr" ? "Débloque toute la 3e classe"
               : lang === "it" ? "Sblocca tutta la 3a classe"
               : lang === "en" ? "Unlock all of Grade 3"
               : "Klasse 3 komplett freischalten"}
            </div>
            <div className="text-xs opacity-75">
              {lang === "fr" ? "CHF 9.90/mois · Annuler à tout moment"
               : lang === "it" ? "CHF 9.90/mese · Disdici quando vuoi"
               : lang === "en" ? "CHF 9.90/month · Cancel anytime"
               : "CHF 9.90/Monat · Jederzeit kündbar"}
            </div>
          </div>
          <span className="text-base font-bold text-amber-600">→</span>
        </Link>
      )}

      {/* UJ-13: Empty state nudge for new users (no progress yet) */}
      {profile && profile.xp === 0 && firstNotDoneIdx === 0 && (
        <div className="flex items-center gap-3 bg-green-50 border-2 border-green-300 rounded-2xl px-4 py-3 text-sm text-green-800 font-medium">
          <span className="text-2xl">🚀</span>
          <span>{lang === "fr" ? "Commence ici ! Ton premier thème t'attend." : lang === "it" ? "Inizia qui! Il tuo primo argomento ti aspetta." : lang === "en" ? "Start here! Your first topic is waiting." : "Hier starten! Dein erstes Thema wartet auf dich."}</span>
        </div>
      )}

      {/* Topic list */}
      <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
        {topics.map((topic, idx) => {
          const prog = getProgress(grade, subject, topic.id);
          const stars = prog?.stars ?? 0;
          const done = !!prog;
          const isNext = idx === firstNotDoneIdx; // first not-done topic = "start here"
          const iconBg = currentSubjectMeta?.iconBg ?? "bg-green-100";

          return (
            <Link key={topic.id} href={`/learn/${grade}/${subject}/${topic.id}`}
              style={{ minHeight: "66px" }}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all active:scale-95 shadow-sm ${
                isGrade3Locked
                  ? "bg-gray-50 border-gray-200 hover:border-amber-300 opacity-80"
                  : done
                    ? "bg-white border-green-200 hover:border-green-400"
                  : isNext && profile?.xp === 0
                    ? "bg-green-600 border-green-600 text-white hover:bg-green-700"
                  : isNext
                    ? "bg-green-50 border-green-300 hover:border-green-500"
                    : "bg-white border-gray-100 hover:border-green-300 hover:bg-green-50"
              }`}>

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${isGrade3Locked ? "bg-gray-100" : iconBg}`}>
                {isGrade3Locked ? "🔒" : topic.emoji}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm leading-tight">
                  {getTopicTitle(topic.id, lang, topic.title)}
                  {isNext && !isGrade3Locked && <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">Start ✨</span>}
                  {isGrade3Locked && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">Premium</span>}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {done && !isGrade3Locked
                    ? Array.from({length: 3}).map((_, j) => (
                        <span key={j} className={j < stars ? "text-yellow-400" : "text-gray-300"}>★</span>
                      ))
                    : `${topic.exercises.length} ${tr("exerciseCount")}`
                  }
                </div>
              </div>

              <div className="shrink-0">
                {done && !isGrade3Locked
                  ? <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                  : <span className="w-8 h-8 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center text-base">›</span>
                }
              </div>
            </Link>
          );
        })}
      </div>
      </div> {/* end space-y-4 */}
      </div> {/* end md:grid */}
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
        <Image src="/images/mascot/cleverli-thumbsup.png" alt="Cleverli Maskottchen" width={64} height={64} className="object-contain animate-bounce" />
        <div className="text-sm">Laden… / Chargement…</div>
      </div>
    }>
      <DashboardInner />
    </Suspense>
  );
}
