"use client";
/**
 * Parent Dashboard — progress overview, weak spots, streak calendar, achievement summary.
 * Data is all from localStorage (no auth yet).
 */
import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import {
  getTopicSummaries,
  type TopicSummary,
} from "@/data/topicCatalog";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { getLevelForXp } from "@/lib/xp";
import ParentPinGate, { lockParentSession } from "@/components/ParentPinGate";
import ChildProfileManager from "@/components/ChildProfileManager";
import { useSession } from "@/hooks/useSession";
import { ParentsGuestPreview } from "@/components/GuestPreview";
import { getActiveProfileId, loadFamily, type FamilyMember } from "@/lib/family";
import {
  CANTON_NAMES,
  resolveCurriculumProfile,
  type CurriculumSelection,
} from "@/lib/curriculumProfiles";
import { getReportingSubjects, readTopicProgressForChild } from "@/lib/reportingProgress";

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

interface TopicProgress {
  stars: number;
  score: number;
  completed: number;
  lastPlayed: string;
  partial: boolean;
}

interface SubjectCoverage {
  grade: number;
  subject: string;
  emoji: string;
  topics: number;
  exercises: number;
  startedTopics: number;
  doneTopics: number;
  weakTopics: number;
  progressPct: number;
  nextTopic: TopicSummary | null;
}

function loadActiveMember(): FamilyMember | null {
  if (typeof window === "undefined") return null;
  const family = loadFamily();
  const activeId = getActiveProfileId();
  return family.members.find(member => member.id === activeId) ?? family.members[0] ?? null;
}

function loadTopicProgress(grade: number, subject: string, topic: TopicSummary): TopicProgress | null {
  if (typeof window === "undefined") return null;
  return readTopicProgressForChild(grade, subject, topic);
}

function buildSubjectCoverage(grade: number, curriculum?: CurriculumSelection): SubjectCoverage[] {
  return getReportingSubjects(grade, curriculum)
    .map(subject => {
      const topics = getTopicSummaries(grade, subject.id);
      const topicProgress = topics.map(topic => ({ topic, progress: loadTopicProgress(grade, subject.id, topic) }));
      const doneTopics = topicProgress.filter(({ topic, progress }) => progress && progress.completed >= topic.exerciseCount).length;
      const startedTopics = topicProgress.filter(({ progress }) => (progress?.completed ?? 0) > 0).length;
      const weakTopics = topicProgress.filter(({ progress }) => progress && progress.completed > 0 && progress.stars <= 1).length;
      const nextTopic = topicProgress.find(({ topic, progress }) => !progress || progress.completed < topic.exerciseCount)?.topic ?? topics[0] ?? null;
      return {
        grade,
        subject: subject.id,
        emoji: subject.emoji,
        topics: topics.length,
        exercises: topics.reduce((sum, topic) => sum + topic.exerciseCount, 0),
        startedTopics,
        doneTopics,
        weakTopics,
        progressPct: topics.length > 0 ? Math.round((doneTopics / topics.length) * 100) : 0,
        nextTopic,
      };
    });
}

function loadAllStats(curriculum?: CurriculumSelection | null): TopicStat[] {
  if (typeof window === "undefined") return [];
  const stats: TopicStat[] = [];
  const activeChildId = getActiveProfileId();
  for (const grade of [1,2,3,4,5,6]) {
    for (const subject of getReportingSubjects(grade, curriculum)) {
      const topics = getTopicSummaries(grade, subject.id);
      for (const topic of topics) {
        try {
          const progress = readTopicProgressForChild(grade, subject.id, topic, activeChildId);
          if (!progress) continue;
          stats.push({
            grade, subject: subject.id,
            topicId: topic.id,
            topicTitle: topic.title,
            topicEmoji: topic.emoji,
            stars: progress.stars,
            score: progress.score,
            completed: progress.completed,
            total: topic.exerciseCount,
            lastPlayed: progress.lastPlayed,
            partial: progress.partial,
          });
        } catch { /* skip */ }
      }
    }
  }
  return stats;
}

// Last 14 days activity heatmap — uses real per-day playDates array from profile
function buildHeatmap(playDates: string[]): { date: string; active: boolean }[] {
  const days: { date: string; active: boolean }[] = [];
  const today = new Date();
  const dateSet = new Set(playDates);
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, active: dateSet.has(key) });
  }
  return days;
}

export default function ParentsDashboard() {
  const { session, loaded: sessionLoaded } = useSession();
  const { profile, loaded } = useProfileContext();
  const { lang } = useLang();

  // ⚠️ All hooks must be called unconditionally before any early returns (React rules)
  const activeMember = loaded ? loadActiveMember() : null;
  const activeGrade = activeMember?.grade ?? 1;
  const stats = useMemo(() => loaded ? loadAllStats(activeMember?.curriculum) : [], [activeMember?.curriculum, loaded]);
  const subjectCoverage = useMemo(
    () => loaded ? buildSubjectCoverage(activeGrade, activeMember?.curriculum) : [],
    [activeGrade, activeMember?.curriculum, loaded],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("lock") !== "1") return;
    lockParentSession();
    url.searchParams.delete("lock");
    window.location.replace(url.pathname + url.search + url.hash);
  }, []);

  if (!sessionLoaded) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return <ParentsGuestPreview />;

  const level = getLevelForXp(profile.xp);
  const levelTitle = lang === "fr" ? level.titleFr : lang === "it" ? level.titleIt : lang === "en" ? level.titleEn : level.title;

  // Weak spots: topics with 1 star or partial completion
  const weakSpots = stats.filter(s => s.stars <= 1 && s.completed > 0).sort((a, b) => a.stars - b.stars);
  // Strong topics: 3 stars
  const strongTopics = stats.filter(s => s.stars === 3);
  const heatmap = buildHeatmap(profile.playDates ?? []);

  const totalCorrect = stats.reduce((sum, s) => sum + Math.min(s.score, s.completed), 0);

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

  const subjectLabel = (subject: string) => {
    if (subject === "math") return t("Mathematik", "Mathématiques", "Matematica", "Maths");
    if (subject === "german") return t("Deutsch", "Allemand", "Tedesco", "German");
    if (subject === "science") return t("NMG", "Sciences", "Scienze", "Science");
    if (subject === "english") return t("Englisch", "Anglais", "Inglese", "English");
    if (subject === "french") return t("Französisch", "Français", "Francese", "French");
    if (subject === "mi") return t("Medien & Informatik", "Médias & informatique", "Media & informatica", "Media & Computing");
    return subject;
  };

  const curriculumProfile = resolveCurriculumProfile(activeMember?.curriculum);
  const curriculumLabel = activeMember?.curriculum
    ? `${CANTON_NAMES[activeMember.curriculum.canton]} · ${activeMember.curriculum.schoolLanguage.toUpperCase()}`
    : t("Standardprofil", "Profil standard", "Profilo standard", "Default profile");
  const totalCoveredTopics = subjectCoverage.reduce((sum, item) => sum + item.topics, 0);
  const totalCoveredExercises = subjectCoverage.reduce((sum, item) => sum + item.exercises, 0);
  const completedCoveredTopics = subjectCoverage.reduce((sum, item) => sum + item.doneTopics, 0);
  const startedCoveredTopics = subjectCoverage.reduce((sum, item) => sum + item.startedTopics, 0);
  const currentGradeStats = stats.filter(s => s.grade === activeGrade && s.completed > 0);
  const nextPractice = weakSpots.find(s => s.grade === activeGrade)
    ?? currentGradeStats.find(s => s.completed > 0 && s.completed < s.total)
    ?? (() => {
      const subject = subjectCoverage.find(item => item.nextTopic);
      if (!subject?.nextTopic) return null;
      return {
        grade: activeGrade,
        subject: subject.subject,
        topicId: subject.nextTopic.id,
        topicTitle: subject.nextTopic.title,
        topicEmoji: subject.nextTopic.emoji,
        stars: 0,
        score: 0,
        completed: 0,
        total: subject.nextTopic.exerciseCount,
        lastPlayed: "",
        partial: false,
      } satisfies TopicStat;
    })();
  const attentionItems = [
    weakSpots.length > 0
      ? t(`${weakSpots.length} Thema erneut üben`, `${weakSpots.length} thème à reprendre`, `${weakSpots.length} tema da riprendere`, `${weakSpots.length} topic to revisit`)
      : null,
    startedCoveredTopics === 0
      ? t("Noch kein Fach gestartet", "Aucune matière commencée", "Nessuna materia iniziata", "No subject started yet")
      : null,
    subjectCoverage.some(item => item.startedTopics === 0)
      ? t("Noch unberührte Fächer vorhanden", "Des matières sont encore intactes", "Ci sono materie non iniziate", "Some subjects are untouched")
      : null,
  ].filter(Boolean);

  return (
    <ParentPinGate>
    <main className="max-w-lg mx-auto px-4 py-6 pb-40 sm:pb-12 space-y-5">
      {/* Lock button */}
      <div className="flex justify-end">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload is intentional so the PIN gate remounts after clearing local session */}
        <a
          href="/parents?lock=1"
          data-testid="parent-dashboard-lock"
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors py-1.5 px-3 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50"
        >
          🔒 <span>Elternbereich sperren</span>
        </a>
      </div>

      {/* ── Child Profiles ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <ChildProfileManager />
      </div>

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Image src="/cleverli-sit-read.png" alt="Cleverli" width={64} height={64} className="drop-shadow-md" />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-black text-gray-800">
            {t("Eltern-Übersicht", "Vue parents", "Vista genitori", "Parent Overview")}
          </h1>
          <p className="text-xs text-gray-400">
            {t("Lernfortschritt auf einen Blick", "Progrès d'apprentissage en un coup d'œil", "Progressi di apprendimento", "Learning progress at a glance")}
          </p>
        </div>
        {activeMember && (
          <div className="text-right shrink-0">
            <div className="text-2xl">{activeMember.avatar}</div>
            <div className="text-xs font-bold text-gray-700 max-w-24 truncate">{activeMember.name}</div>
          </div>
        )}
      </div>

      {/* ── Learning status ── */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              {t("Lernprofil", "Profil d'apprentissage", "Profilo di apprendimento", "Learning profile")}
            </div>
            <h2 className="font-black text-gray-800 text-base">
              {activeGrade}. {t("Klasse", "Année", "Classe", "Grade")} · {curriculumLabel}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {curriculumProfile.supported
                ? t("LP21-Fächer passend zum Profil", "Matières LP21 selon le profil", "Materie LP21 secondo il profilo", "LP21 subjects matched to profile")
                : t("Sicherer Standardumfang aktiv", "Périmètre standard sécurisé actif", "Ambito standard sicuro attivo", "Safe default scope active")}
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-black text-green-700">{completedCoveredTopics}/{totalCoveredTopics}</div>
            <div className="text-[10px] text-gray-400 font-semibold">
              {t("Themen", "Thèmes", "Temi", "topics")}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-green-50 border border-green-100 px-3 py-2">
            <div className="text-lg font-black text-green-800">{totalCoveredExercises}</div>
            <div className="text-[10px] text-green-700 font-semibold">{t("Übungen", "Exercices", "Esercizi", "Exercises")}</div>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-100 px-3 py-2">
            <div className="text-lg font-black text-blue-800">{subjectCoverage.length}</div>
            <div className="text-[10px] text-blue-700 font-semibold">{t("Fächer", "Matières", "Materie", "Subjects")}</div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
            <div className="text-lg font-black text-amber-800">{attentionItems.length}</div>
            <div className="text-[10px] text-amber-700 font-semibold">{t("Hinweise", "Notes", "Note", "Notes")}</div>
          </div>
        </div>
      </div>

      {/* ── Key stats ── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: t("Level","Niveau","Livello","Level"), value: `${level.emoji} ${levelTitle}`, sub: `${profile.xp} XP` },
          { label: t("Streak","Série","Serie","Streak"), value: `🔥 ${profile.dailyStreak}`, sub: t("Tage in Folge","jours de suite","giorni di fila","days in a row") },
          { label: t("Gelöste Aufgaben","Exercices résolus","Esercizi risolti","Solved tasks"), value: totalCorrect.toString(), sub: totalCorrect > 0 ? t("aus Themenfortschritt","depuis la progression","dal progresso","from topic progress") : t("noch keine Aufgaben","pas encore d'exercices","ancora nessun esercizio","no tasks yet") },
          { label: t("Trophäen","Trophées","Trofei","Trophies"), value: `${profile.achievements.length}/${ACHIEVEMENTS.length}`, sub: t("freigeschaltet","débloqués","sbloccati","unlocked") },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="text-xl font-black text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.sub}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400 mt-1 font-semibold">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Next practice ── */}
      {nextPractice && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0">{nextPractice.topicEmoji}</span>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-blue-900 text-sm">
                {t("Als Nächstes üben", "À pratiquer ensuite", "Da esercitare ora", "Practice next")}
              </h2>
              <div className="text-sm font-black text-gray-800 mt-0.5">{nextPractice.topicTitle}</div>
              <p className="text-xs text-blue-700 mt-1">
                {nextPractice.completed > 0
                  ? t("Passt, weil hier schon Lernspuren sichtbar sind.", "Pertinent, car il y a déjà des traces d'apprentissage.", "Adatto perché ci sono già progressi visibili.", "Relevant because there is already progress here.")
                  : t("Guter nächster Einstieg im aktuellen Lernprofil.", "Bonne prochaine entrée dans le profil actuel.", "Buon prossimo inizio nel profilo attuale.", "Good next step for the current profile.")}
              </p>
            </div>
            <Link
              href={`/learn/${nextPractice.grade}/${nextPractice.subject}/${nextPractice.topicId}`}
              className="shrink-0 bg-blue-700 text-white rounded-xl px-3 py-2 text-xs font-bold active:scale-95 transition-all"
            >
              {t("Üben", "Pratiquer", "Esercitare", "Practise")}
            </Link>
          </div>
        </div>
      )}

      {attentionItems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <h2 className="font-bold text-amber-900 text-sm">
            {t("Worauf achten?", "À surveiller", "Da osservare", "Needs attention")}
          </h2>
          <div className="space-y-1.5">
            {attentionItems.map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-amber-800 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    {s.grade}. {t("Klasse","Année","Classe","Grade")} · {subjectLabel(s.subject)}
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
            <Link href="/missionen" className="text-xs text-green-700 underline">
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
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-gray-700 text-sm">
            📚 {t("Fach-Abdeckung", "Couverture des matières", "Copertura materie", "Subject coverage")}
          </h2>
          <span className="text-[10px] text-gray-400 font-semibold">
            {activeGrade}. {t("Klasse", "Année", "Classe", "Grade")}
          </span>
        </div>
        <div className="space-y-2">
          {subjectCoverage.map(item => {
            const nextHref = item.nextTopic ? `/learn/${item.grade}/${item.subject}/${item.nextTopic.id}` : "/dashboard";
            return (
              <Link
                key={`${item.grade}-${item.subject}`}
                href={nextHref}
                className="block rounded-xl border border-gray-100 px-3 py-2.5 hover:border-green-200 hover:bg-green-50/60 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-800 truncate">{subjectLabel(item.subject)}</span>
                      <span className="text-[10px] text-gray-500 shrink-0">
                        {item.doneTopics}/{item.topics} {t("Themen", "thèmes", "temi", "topics")}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.progressPct}%` }} />
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-[10px] text-gray-400">
                        {item.exercises} {t("Übungen", "exercices", "esercizi", "exercises")} · {item.startedTopics} {t("gestartet", "commencés", "iniziati", "started")}
                      </span>
                      {item.weakTopics > 0 && (
                        <span className="text-[10px] text-orange-600 font-bold shrink-0">
                          {item.weakTopics} {t("wiederholen", "à revoir", "da ripetere", "review")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-black text-gray-500 w-9 text-right shrink-0">{item.progressPct}%</span>
                </div>
              </Link>
            );
          })}
        </div>
        {subjectCoverage.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">
            {t("Für dieses Profil ist noch keine Fach-Abdeckung verfügbar.", "Aucune couverture disponible pour ce profil.", "Nessuna copertura disponibile per questo profilo.", "No subject coverage available for this profile.")}
          </p>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="flex flex-col gap-2 items-center pt-1">
        <Link href="/dashboard" className="w-full text-center bg-green-700 text-white py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md">
          🎒 {t("Jetzt üben","Pratiquer","Esercitati","Practice now")}
        </Link>
        <Link href="/family" className="text-xs text-gray-400 underline flex items-center gap-1">
          <Image src="/images/ui/Familie.svg" alt="Familie" width={16} height={16} />
          {t("Familien-Rangliste","Classement familial","Classifica famiglia","Family leaderboard")}
        </Link>
        <Link href="/missionen" className="text-xs text-gray-400 underline">
          🏆 {t("Missionen","Missions","Missioni","Missions")}
        </Link>
      </div>
    </main>
    </ParentPinGate>
  );
}
