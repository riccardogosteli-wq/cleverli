"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OnboardingModal from "@/components/OnboardingModal";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { getTopics, getSubjects } from "@/data/index";
import { getTopicTitle } from "@/data/topicTitles";
import { isDailyDoneToday } from "@/lib/daily";
import { useProfile, Profile } from "@/hooks/useProfile";
import { useSession } from "@/hooks/useSession";
import { loadFamily, saveFamily, getActiveProfileId } from "@/lib/family";
import { getLevelForXp, getNextLevel, Level } from "@/lib/xp";
import { getTierProgress } from "@/lib/tierProgress";
import RewardWidget from "@/components/RewardWidget";
import AuthGuard from "@/components/AuthGuard";

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
    subtitle: { de: "Natur & Gesellschaft", fr: "Nature & Société", it: "Natura & Società", en: "Nature & Society" },
  },
  nt: {
    emoji: "🔬", iconBg: "bg-emerald-100",
    label:    { de: "Natur & Technik", fr: "Nature & Technique", it: "Natura & Tecnica", en: "Nature & Tech" },
    subtitle: { de: "Biologie, Physik, Chemie", fr: "Biologie, physique, chimie", it: "Biologia, fisica, chimica", en: "Biology, Physics, Chemistry" },
  },
  rzg: {
    emoji: "🗺️", iconBg: "bg-orange-100",
    label:    { de: "RZG",             fr: "ESS",               it: "RSS",              en: "Geography & History" },
    subtitle: { de: "Geografie, Geschichte, Gesellschaft", fr: "Géographie, histoire, société", it: "Geografia, storia, società", en: "Geography, History & Society" },
  },
  french: {
    emoji: "🇫🇷", iconBg: "bg-purple-100",
    label:    { de: "Französisch",  fr: "Français",      it: "Francese",     en: "French" },
    subtitle: { de: "Sprechen & Schreiben", fr: "Parler & écrire", it: "Parlare & scrivere", en: "Speaking & Writing" },
  },
  english: {
    emoji: "🇬🇧", iconBg: "bg-red-100",
    label:    { de: "Englisch",     fr: "Anglais",       it: "Inglese",      en: "English" },
    subtitle: { de: "Sprechen & Verstehen", fr: "Parler & comprendre", it: "Parlare & capire", en: "Speaking & Understanding" },
  },
};

const SUBJECT_ICONS: Record<string, string> = {
  math:    "/images/ui/Mathematik.svg",
  german:  "/images/ui/Deutsch.svg",
  science: "/images/ui/NMG.svg",
  nt:      "/images/ui/NMG.svg",      // reuse NMG icon until custom one made
  rzg:     "/images/ui/Zeit.svg",
  french:  "/images/ui/Woerter-Sprache.svg",
  english: "/images/ui/Woerter-Sprache.svg",
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
              <span className="text-xs text-gray-800 font-semibold shrink-0">
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
  // Restore grade from active child profile (or fall back to last-used)
  useEffect(() => {
    setDailyDone(isDailyDoneToday());
    if (!preselectedSubject) {
      const family = loadFamily();
      const activeId = getActiveProfileId();
      const member = family.members.find(m => m.id === activeId) ?? family.members[0];
      if (member?.grade) {
        // ✅ Always use the child's stored grade — not the global last-used key
        setGrade(member.grade);
        localStorage.setItem(GRADE_KEY, String(member.grade));
      } else {
        // Guest / no profile: fall back to last-used grade
        const saved = localStorage.getItem(GRADE_KEY);
        if (saved) setGrade(parseInt(saved));
      }
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
    // ✅ Also persist grade back to the child's family profile
    const family = loadFamily();
    const activeId = getActiveProfileId();
    const member = family.members.find(m => m.id === activeId);
    if (member && member.grade !== g) {
      member.grade = g;
      saveFamily(family);
    }
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
            <div className="text-center">
              {activeMember && (
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full mb-2">
                  <span className="text-lg">{activeMember.avatar}</span>
                  <span className="text-sm font-bold text-blue-800">{activeMember.name}</span>
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-800">
                {lang === "fr" ? "Quelle classe ?" : lang === "it" ? "Che classe ?" : lang === "en" ? "Which grade?" : "Welche Klasse?"}
              </h2>
              <p className="text-xs text-gray-800 font-semibold mt-0.5">
                {lang === "fr" ? "Choisis ta classe" : lang === "it" ? "Scegli la tua classe" : lang === "en" ? "Choose your grade" : "Wähle deine Klasse"}
              </p>
            </div>

            {/* ✅ loadFamily once, not 6× per render */}
            {(() => {
              const _fam = loadFamily();
              const _aid = getActiveProfileId();
              const _cur = _fam.members.find(m => m.id === _aid);
              return (
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map((g, i) => {
                const isCurrent = _cur?.grade === g;
                return (
                  <button key={g} onClick={() => chooseGrade(g)}
                    style={{ minHeight: "100px", transition: "all 0.15s ease" }}
                    className={`border-2 rounded-2xl font-bold active:scale-95 flex flex-col items-center justify-center gap-1 relative ${isCurrent ? 'ring-2 ring-blue-400 ring-offset-2' : ''} ${GRADE_COLORS[i].base}`}>
                    {isCurrent && <span className="absolute top-1.5 right-1.5 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full font-bold">✓</span>}
                    <div className="text-3xl">{GRADE_COLORS[i].emoji}</div>
                    <div className="text-2xl font-black">{g}.</div>
                    <div className="text-xs font-medium opacity-70">{tr("gradeLabel")}</div>
                  </button>
                );
              })}
            </div>
              ); // end IIFE return
            })()}


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
              <button onClick={() => setGrade(null)} className="text-sm text-gray-800 font-semibold hover:text-gray-800 py-2 pr-3 min-w-[44px]">←</button>
              <Image
                src="/cleverli-thumbsup.png"
                alt="Cleverli"
                width={80} height={80}
                className="drop-shadow-md shrink-0"
              />
              <div className="flex-1 min-w-0">
                {/* Show active child chip here too */}
                {activeMember && (
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full mb-1">
                    <span className="text-sm">{activeMember.avatar}</span>
                    <span className="text-xs font-bold text-blue-800">{activeMember.name}</span>
                  </div>
                )}
                <h2 className="text-lg font-black text-gray-800 leading-tight">
                  {lang === "fr" ? "Que veux-tu apprendre?" : lang === "it" ? "Cosa vuoi imparare?" : lang === "en" ? "What do you want to learn?" : "Was möchtest du lernen?"}
                </h2>
                <div className="text-xs text-gray-800 font-semibold">{grade}. {tr("gradeLabel")}</div>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-1">
              {getSubjects(grade!).map(s => {
                const meta = SUBJECT_META[s.id];
                const topics = getTopics(grade!, s.id);
                const done = topics.filter(t => getProgress(grade!, s.id, t.id)).length;
                return (
                  <button key={s.id} onClick={() => setSubject(s.id)}
                    style={{ minHeight: "80px", transition: "all 0.15s ease" }}
                    className={`border-2 rounded-2xl font-bold active:scale-95 flex items-center gap-4 px-5 text-left ${s.color}`}>
                    <div className="w-16 h-16 flex items-center justify-center shrink-0">
                      {SUBJECT_ICONS[s.id]
                        ? <Image src={SUBJECT_ICONS[s.id]} alt={s.id} width={64} height={64} className="w-full h-full object-contain" />
                        : <span className="text-4xl">{s.emoji}</span>
                      }
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
  // ✅ Grades 3–6 require premium (grade 3 was the only locked grade before — gap fixed)
  const isGrade3Locked = grade !== null && grade >= 3 && sessionLoaded && !sessionPremium;

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
        <button onClick={handleBack} className="text-sm text-gray-800 font-semibold hover:text-gray-800 py-2 pr-2 min-w-[44px]">←</button>
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          {SUBJECT_ICONS[subject]
            ? <Image src={SUBJECT_ICONS[subject]} alt={subject} width={40} height={40} className="w-full h-full object-contain" />
            : <span className="text-3xl">{getSubjects(grade!).find(s => s.id === subject)?.emoji ?? "📚"}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-gray-800 leading-tight">{subjectL(subject, "label")}</h2>
            {/* Grade badge — tap to change grade directly from dashboard */}
            <button
              onClick={() => setGrade(null)}
              className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors shrink-0"
              title={lang === "fr" ? "Changer de classe" : lang === "it" ? "Cambia classe" : lang === "en" ? "Change grade" : "Klasse wechseln"}
            >
              {grade}. {tr("gradeLabel")} ✏️
            </button>
          </div>
          <div className="text-xs text-gray-800 font-semibold">{subjectL(subject, "subtitle")}</div>
        </div>
      </div>

      {/* Subject switcher — always visible, colored by subject */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {getSubjects(grade!).map(s => {
          const isActive = s.id === subject;
          const activeClsMap: Record<string, string> = {
            math:    "bg-blue-500 text-white border-blue-500",
            german:  "bg-yellow-500 text-white border-yellow-500",
            science: "bg-green-700 text-white border-green-700",
            nt:      "bg-emerald-600 text-white border-emerald-600",
            rzg:     "bg-orange-500 text-white border-orange-500",
            french:  "bg-purple-600 text-white border-purple-600",
            english: "bg-red-500 text-white border-red-500",
          };
          const activeCls = activeClsMap[s.id] ?? "bg-gray-600 text-white border-gray-600";
          return (
            <button key={s.id}
              onClick={() => setSubject(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border transition-colors shrink-0 shadow-sm ${
                isActive ? activeCls : "bg-white text-gray-800 border-gray-200 hover:border-gray-300"
              }`}>
              {SUBJECT_ICONS[s.id]
                ? <Image src={SUBJECT_ICONS[s.id]} alt={s.id} width={20} height={20} className="w-5 h-5 object-contain" />
                : <span className="text-base">{s.emoji}</span>
              }
              {" "}{subjectL(s.id, "label")}
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
      {isGrade3Locked && grade !== null && (
        <Link href={uid ? `/api/checkout?plan=monthly&uid=${uid}` : "/upgrade"} className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl px-4 py-3 text-sm text-amber-900 hover:from-amber-100 hover:to-orange-100 transition-colors">
          <span className="text-2xl">🔓</span>
          <div className="flex-1">
            <div className="font-bold">
              {tr("premiumRequiredGrade").replace("{n}", String(grade))}
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

      {/* Topic path — linear unlock progression */}
      {(() => {
        const firstCurrentIdx = topics.findIndex((t, i) => {
          const pp = i > 0 ? getProgress(grade, subject, topics[i - 1].id) : null;
          const unlocked = i === 0 || isGrade3Locked || (pp?.stars ?? 0) >= 1;
          return unlocked && (getProgress(grade, subject, t.id)?.stars ?? 0) === 0;
        });
        return (
          <div className="flex flex-col">
            {topics.map((topic, i) => {
              const prog = getProgress(grade, subject, topic.id);
              const stars = prog?.stars ?? 0;
              const done = stars > 0;
              const prevProg = i > 0 ? getProgress(grade, subject, topics[i - 1].id) : null;
              const isUnlocked = i === 0 || isGrade3Locked || (prevProg?.stars ?? 0) >= 1;
              const isLocked = !isUnlocked;
              const isCurrent = i === firstCurrentIdx;
              const iconBg = currentSubjectMeta?.iconBg ?? "bg-green-100";
              
              // Get tier progress to show Level 1/2/3 badges
              const tierInfo = getTierProgress(topic, prog?.completed ?? 0);
              const tierLevel = 
                tierInfo.isTiered && tierInfo.easy.done === tierInfo.easy.total && tierInfo.medium.done === tierInfo.medium.total && tierInfo.hard.done === tierInfo.hard.total ? 3
                : tierInfo.isTiered && tierInfo.easy.done === tierInfo.easy.total && tierInfo.medium.done === tierInfo.medium.total ? 2
                : tierInfo.isTiered && tierInfo.easy.done === tierInfo.easy.total ? 1
                : 0;

              const cardContent = (
                <>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${isLocked || isGrade3Locked ? "bg-gray-100" : iconBg}`}>
                    {isLocked || isGrade3Locked ? "🔒" : topic.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm leading-tight ${isLocked ? "text-gray-800 font-semibold" : "text-gray-800"}`}>
                      {getTopicTitle(topic.id, lang, topic.title)}
                      {isCurrent && !isGrade3Locked && <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">Start ✨</span>}
                      {isGrade3Locked && <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">Premium</span>}
                    </div>
                    <div className="text-xs mt-0.5 flex items-center gap-2">
                      {isLocked ? (
                        <span className="text-gray-800 font-semibold">
                          {lang === "fr" ? "Encore verrouillé" : lang === "it" ? "Ancora bloccato" : lang === "en" ? "Still locked" : "Noch gesperrt"}
                        </span>
                      ) : tierInfo.isTiered && tierLevel > 0 ? (
                        <>
                          {/* Show tier level badges */}
                          {tierLevel >= 1 && <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold text-xs">Level 1</span>}
                          {tierLevel >= 2 && <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold text-xs">Level 2</span>}
                          {tierLevel >= 3 && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-bold text-xs">Level 3</span>}
                        </>
                      ) : done ? (
                        Array.from({length: 3}).map((_, j) => (
                          <span key={j} className={j < stars ? "text-yellow-500" : "text-gray-800"}>★</span>
                        ))
                      ) : (
                        <span className="text-gray-800 font-semibold">{topic.exercises.length} {tr("exerciseCount")}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {done && !isGrade3Locked
                      ? <span className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">✓</span>
                      : isLocked
                        ? <span className="w-8 h-8 bg-gray-100 text-gray-800 rounded-full flex items-center justify-center text-xs">🔒</span>
                        : <span className="w-8 h-8 bg-gray-50 text-gray-800 font-semibold rounded-full flex items-center justify-center text-base">›</span>
                    }
                  </div>
                </>
              );

              return (
                <div key={topic.id}>
                  {i > 0 && <div className="h-3 w-0.5 bg-gray-200 mx-auto" />}
                  {isLocked ? (
                    <div style={{ minHeight: "66px" }}
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 border-2 shadow-sm opacity-45 bg-gray-50 border-gray-200 cursor-not-allowed select-none">
                      {cardContent}
                    </div>
                  ) : (
                    <Link href={`/learn/${grade}/${subject}/${topic.id}`}
                      style={{ minHeight: "66px" }}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 border-2 transition-all active:scale-95 shadow-sm ${
                        isGrade3Locked
                          ? "bg-gray-50 border-gray-200 hover:border-amber-300 opacity-80"
                          : done
                            ? "bg-white border-green-200 hover:border-green-400"
                          : isCurrent
                            ? "bg-green-50 border-green-400 hover:border-green-500 ring-2 ring-green-200"
                            : "bg-white border-gray-100 hover:border-green-300 hover:bg-green-50"
                      }`}>
                      {cardContent}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        );
      })()}
      </div> {/* end space-y-4 */}
      </div> {/* end md:grid */}
    </div>
  );
}

export default function Dashboard() {
  return (
    <AuthGuard>
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-800 font-semibold">
          <Image src="/cleverli-thumbsup.png" alt="Cleverli Maskottchen" width={64} height={64} className="object-contain animate-bounce" />
          <div className="text-sm">Laden… / Chargement…</div>
        </div>
      }>
        <DashboardInner />
      </Suspense>
    </AuthGuard>
  );
}
