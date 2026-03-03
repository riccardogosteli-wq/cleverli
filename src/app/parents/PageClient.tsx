"use client";
/**
 * Parent Dashboard — progress overview, weak spots, streak calendar, achievement summary.
 * Data is all from localStorage (no auth yet).
 */
import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { getTopics, SUBJECTS } from "@/data/index";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { getLevelForXp } from "@/lib/xp";
import ParentPinGate, { lockParentSession } from "@/components/ParentPinGate";
import ChildProfileManager from "@/components/ChildProfileManager";

interface TopicStat {
  grade: number;
  subject: string;
  topicId: string;
  topicTitle: string;
  topicEmoji: string;
  stars: number;
  score: number;
  completed: number;
  total: number;
  lastPlayed: string;
  partial: boolean;
}

function loadAllStats(): TopicStat[] {
  if (typeof window === "undefined") return [];
  const stats: TopicStat[] = [];
  for (const grade of [1, 2, 3]) {
    for (const subject of ["math", "german"]) {
      const topics = getTopics(grade, subject);
      for (const topic of topics) {
        const key = `cleverli_${grade}_${subject}_${topic.id}`;
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const p = JSON.parse(raw);
          stats.push({
            grade, subject,
            topicId: topic.id,
            topicTitle: topic.title,
            topicEmoji: topic.emoji,
            stars: p.stars ?? 0,
            score: p.score ?? 0,
            completed: p.completed ?? 0,
            total: topic.exercises.length,
            lastPlayed: p.lastPlayed ?? "",
            partial: p.partial ?? false,
          });
        } catch { /* skip */ }
      }
    }
  }
  return stats;
}

// Last 14 days activity heatmap from profile
function buildHeatmap(lastPlayedDate: string, dailyStreak: number): { date: string; active: boolean }[] {
  const days: { date: string; active: boolean }[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    // Approximate: mark active if within streak window
    const diff = Math.round((new Date(lastPlayedDate).getTime() - d.getTime()) / 86400000);
    const active = lastPlayedDate >= key && diff >= -(dailyStreak - 1) && diff <= 0;
    days.push({ date: key, active });
  }
  return days;
}

export default function ParentsDashboard() {
  const { profile, loaded } = useProfileContext();
  const { lang, tr } = useLang();

  const stats = useMemo(() => loaded ? loadAllStats() : [], [loaded]);

  const level = getLevelForXp(profile.xp);
  const levelTitle = lang === "fr" ? level.titleFr : lang === "it" ? level.titleIt : lang === "en" ? level.titleEn : level.title;

  // Weak spots: topics with 1 star or partial completion
  const weakSpots = stats.filter(s => s.stars <= 1 && s.completed > 0).sort((a, b) => a.stars - b.stars);
  // Strong topics: 3 stars
  const strongTopics = stats.filter(s => s.stars === 3);
  // All played
  const played = stats.filter(s => s.completed > 0);

  const heatmap = buildHeatmap(profile.lastPlayedDate, profile.dailyStreak);

  const totalCorrect = stats.reduce((sum, s) => sum + s.score, 0);
  const avgAccuracy = played.length > 0
    ? Math.round(stats.reduce((sum, s) => sum + (s.total > 0 ? s.score / s.total : 0), 0) / Math.max(1, played.length) * 100)
    : 0;

  const recentAchievements = profile.achievements
    .slice(-5)
    .map(id => ACHIEVEMENTS.find(a => a.id === id))
    .filter(Boolean);

  if (!loaded) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-5xl animate-pulse">📊</span>
    </div>
  );

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  return (
    <ParentPinGate>
    <main className="max-w-lg mx-auto px-4 py-6 pb-24 sm:pb-12 space-y-5">
      {/* Lock button */}
      <div className="flex justify-end">
        <button
          onClick={() => { lockParentSession(); window.location.reload(); }}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors py-1.5 px-3 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50"
        >
          🔒 <span>Elternbereich sperren</span>
        </button>
      </div>

      {/* ── Child Profiles ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <ChildProfileManager />
      </div>

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Image src="/cleverli-sit-read.png" alt="Cleverli" width={64} height={64} className="drop-shadow-md" />
        <div>
          <h1 className="text-xl font-black text-gray-800">
            {t("Eltern-Übersicht", "Vue parents", "Vista genitori", "Parent Overview")}
          </h1>
          <p className="text-xs text-gray-400">
            {t("Lernfortschritt auf einen Blick", "Progrès d'apprentissage en un coup d'œil", "Progressi di apprendimento", "Learning progress at a glance")}
          </p>
        </div>
      </div>

      {/* ── Key stats ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: t("Level","Niveau","Livello","Level"), value: `${level.emoji} ${levelTitle}`, sub: `${profile.xp} XP` },
          { label: t("Streak","Série","Serie","Streak"), value: `🔥 ${profile.dailyStreak}`, sub: t("Tage in Folge","jours de suite","giorni di fila","days in a row") },
          { label: t("Richtige Antworten","Bonnes réponses","Risposte corrette","Correct answers"), value: totalCorrect.toString(), sub: `~${avgAccuracy}% ${t("Genauigkeit","précision","precisione","accuracy")}` },
          { label: t("Trophäen","Trophées","Trofei","Trophies"), value: `${profile.achievements.length}/${ACHIEVEMENTS.length}`, sub: t("freigeschaltet","débloqués","sbloccati","unlocked") },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-xl font-black text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Activity heatmap (last 14 days) ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
        <h2 className="font-bold text-gray-700 text-sm">
          {t("Aktivität (letzte 14 Tage)", "Activité (14 derniers jours)", "Attività (ultimi 14 giorni)", "Activity (last 14 days)")}
        </h2>
        <div className="flex gap-1.5 flex-wrap">
          {heatmap.map(day => (
            <div
              key={day.date}
              title={day.date}
              className="w-6 h-6 rounded-md"
              style={{ background: day.active ? "#22c55e" : "#f1f5f9" }}
            />
          ))}
        </div>
        <p className="text-[10px] text-gray-400">
          {t("Grün = aktiv gelernt", "Vert = actif", "Verde = attivo", "Green = active")}
        </p>
      </div>

      {/* ── Weak spots ── */}
      {weakSpots.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 space-y-3">
          <h2 className="font-bold text-orange-800 text-sm">
            ⚠️ {t("Schwache Bereiche", "Points faibles", "Punti deboli", "Weak spots")}
          </h2>
          <div className="space-y-2">
            {weakSpots.slice(0, 4).map(s => (
              <Link
                key={`${s.grade}-${s.subject}-${s.topicId}`}
                href={`/learn/${s.grade}/${s.subject}/${s.topicId}`}
                className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-orange-100 hover:border-orange-300 active:scale-95 transition-all"
              >
                <span className="text-2xl shrink-0">{s.topicEmoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-800">{s.topicTitle}</div>
                  <div className="text-[10px] text-gray-400">
                    {s.grade}. {t("Klasse","Année","Classe","Grade")} · {s.subject === "math" ? "Mathematik" : "Deutsch"}
                  </div>
                </div>
                <div className="text-sm shrink-0">
                  {Array.from({length:3}).map((_,i) => <span key={i}>{i < s.stars ? "⭐" : "☆"}</span>)}
                </div>
              </Link>
            ))}
          </div>
          <p className="text-[10px] text-orange-600">
            {t("Tippe um zu üben →", "Appuie pour pratiquer →", "Tocca per esercitarti →", "Tap to practice →")}
          </p>
        </div>
      )}

      {/* ── Strong topics ── */}
      {strongTopics.length > 0 && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 space-y-2">
          <h2 className="font-bold text-green-800 text-sm">
            ✅ {t("Beherrschte Themen", "Thèmes maîtrisés", "Argomenti padroneggiati", "Mastered topics")} ({strongTopics.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {strongTopics.map(s => (
              <span key={`${s.grade}-${s.subject}-${s.topicId}`}
                className="text-xs bg-white border border-green-200 text-green-700 px-2 py-1 rounded-full font-medium">
                {s.topicEmoji} {s.topicTitle}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent achievements ── */}
      {recentAchievements.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-700 text-sm">
              🏆 {t("Neue Erfolge", "Nouveaux succès", "Nuovi traguardi", "Recent achievements")}
            </h2>
            <Link href="/trophies" className="text-xs text-green-600 underline">
              {t("Alle","Tous","Tutti","All")}
            </Link>
          </div>
          <div className="space-y-2">
            {recentAchievements.map(ach => ach && (
              <div key={ach.id} className="flex items-center gap-2">
                <span className="text-xl">{ach.emoji}</span>
                <div>
                  <div className="text-xs font-bold text-gray-800">
                    {lang === "fr" ? ach.titleFr : lang === "it" ? ach.titleIt : lang === "en" ? ach.titleEn : ach.title}
                  </div>
                  <div className="text-[10px] text-gray-400">
                    {lang === "fr" ? ach.descFr : lang === "it" ? ach.descIt : lang === "en" ? ach.descEn : ach.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Subject breakdown ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <h2 className="font-bold text-gray-700 text-sm">
          📚 {t("Fach-Übersicht", "Aperçu des matières", "Panoramica materie", "Subject overview")}
        </h2>
        {[1,2,3].map(grade => {
          const gradeStats = stats.filter(s => s.grade === grade && s.completed > 0);
          if (!gradeStats.length) return null;
          return (
            <div key={grade}>
              <div className="text-xs font-bold text-gray-400 uppercase mb-1.5">
                {grade}. {t("Klasse","Année","Classe","Grade")}
              </div>
              <div className="space-y-1.5">
                {SUBJECTS.map(sub => {
                  const subStats = gradeStats.filter(s => s.subject === sub.id);
                  const topics = getTopics(grade, sub.id);
                  const doneCnt = subStats.filter(s => s.stars >= 1).length;
                  const pct = topics.length > 0 ? Math.round((doneCnt / topics.length) * 100) : 0;
                  return (
                    <div key={sub.id} className="flex items-center gap-2">
                      <span className="text-lg shrink-0">{sub.emoji}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                          <span>{tr(sub.id)}</span>
                          <span>{doneCnt}/{topics.length}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {stats.filter(s => s.completed > 0).length === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">
            {t("Noch keine Aufgaben gelöst.", "Aucun exercice encore.", "Nessun esercizio ancora.", "No exercises done yet.")}
          </p>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="flex flex-col gap-2 items-center pt-1">
        <Link href="/dashboard" className="w-full text-center bg-green-600 text-white py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md">
          🎒 {t("Jetzt üben","Pratiquer","Esercitati","Practice now")}
        </Link>
        <Link href="/family" className="text-xs text-gray-400 underline">
          👨‍👩‍👧‍👦 {t("Familien-Rangliste","Classement familial","Classifica famiglia","Family leaderboard")}
        </Link>
        <Link href="/trophies" className="text-xs text-gray-400 underline">
          🏆 {t("Trophäen ansehen","Voir trophées","Vedi trofei","View trophies")}
        </Link>
      </div>
    </main>
    </ParentPinGate>
  );
}
