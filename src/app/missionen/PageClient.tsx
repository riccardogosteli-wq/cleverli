"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useProfileContext } from "@/lib/ProfileContext";
import { useLang } from "@/lib/LangContext";
import { loadFamily, getActiveProfileId } from "@/lib/family";
import { getTopics, SUBJECTS } from "@/data/index";
import { getTierProgress } from "@/lib/tierProgress";
import { LEVELS, getLevelProgress } from "@/lib/xp";

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface TopicProgress {
  topicId: string;
  title: string;
  emoji: string;
  grade: number;
  subject: string;
  totalExercises: number;
  completedExercises: number;
  stars: number; // 0–3
  tiers: { easy: { total: number; done: number }; medium: { total: number; done: number }; hard: { total: number; done: number } };
  status: "locked" | "available" | "started" | "completed";
}

// ─── READ SAVED PROGRESS FROM LOCALSTORAGE ──────────────────────────────────
function loadTopicProgress(grade: number, subject: string, topicId: string): { completed: number; stars: number } {
  if (typeof window === "undefined") return { completed: 0, stars: 0 };
  try {
    const raw = localStorage.getItem(`cleverli_${grade}_${subject}_${topicId}`);
    if (!raw) return { completed: 0, stars: 0 };
    const d = JSON.parse(raw);
    return { completed: d.completed ?? 0, stars: d.stars ?? 0 };
  } catch { return { completed: 0, stars: 0 }; }
}

// ─── MINI CHECKPOINT DOTS ────────────────────────────────────────────────────
function CheckpointDots({ tiers, compact = false }: {
  tiers: TopicProgress["tiers"];
  compact?: boolean;
}) {
  const tierList = [
    { key: "easy",   color: "#22c55e", label: "1" },
    { key: "medium", color: "#3b82f6", label: "2" },
    { key: "hard",   color: "#9333ea", label: "3" },
  ] as const;

  return (
    <div className={`flex items-center ${compact ? "gap-1" : "gap-1.5"}`}>
      {tierList.map(({ key, color, label }) => {
        const t = tiers[key];
        if (t.total === 0) return null; // skip empty tiers
        const done = t.done >= t.total;
        const partial = t.done > 0 && !done;
        const pct = t.total > 0 ? (t.done / t.total) * 100 : 0;
        return (
          <div key={key} className="flex flex-col items-center gap-0.5">
            <div
              className={`${compact ? "w-5 h-5 text-[9px]" : "w-7 h-7 text-xs"} rounded-full flex items-center justify-center font-black relative overflow-hidden border-2`}
              style={{
                borderColor: done ? color : partial ? color : "#e2e8f0",
                background: done ? color : "#f8fafc",
                color: done ? "white" : partial ? color : "#94a3b8",
              }}
            >
              {done ? "✓" : label}
              {partial && !done && (
                <div
                  className="absolute bottom-0 left-0 right-0 opacity-30"
                  style={{ height: `${pct}%`, background: color }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── TOPIC CARD ───────────────────────────────────────────────────────────────
function TopicCard({ tp, grade, subject }: { tp: TopicProgress; grade: number; subject: string }) {
  const pct = tp.totalExercises > 0 ? Math.round((tp.completedExercises / tp.totalExercises) * 100) : 0;

  const statusColors = {
    locked:    { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-400" },
    available: { bg: "bg-white",   border: "border-gray-200", text: "text-gray-700" },
    started:   { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
    completed: { bg: "bg-green-50",border: "border-green-300",text: "text-green-800" },
  };
  const sc = statusColors[tp.status];

  const tierBarColors = ["#22c55e", "#3b82f6", "#9333ea"];
  const activeTiers = [tp.tiers.easy, tp.tiers.medium, tp.tiers.hard].filter(t => t.total > 0);

  return (
    <Link
      href={tp.status === "locked" ? "#" : `/learn/${grade}/${subject}/${tp.topicId}`}
      className={`block rounded-2xl border-2 p-3.5 transition-all active:scale-98 ${sc.bg} ${sc.border} ${tp.status === "locked" ? "opacity-60 pointer-events-none" : "hover:shadow-md hover:-translate-y-0.5"}`}
    >
      <div className="flex items-start gap-3">
        {/* Emoji */}
        <div className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tp.status === "completed" ? "bg-green-100" : tp.status === "started" ? "bg-blue-100" : "bg-gray-100"}`}>
          {tp.status === "locked" ? "🔒" : tp.emoji}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title + status */}
          <div className="flex items-center justify-between gap-2">
            <span className={`text-sm font-bold truncate ${sc.text}`}>{tp.title}</span>
            <span className="shrink-0 text-sm">
              {tp.stars >= 3 ? "⭐⭐⭐" : tp.stars === 2 ? "⭐⭐" : tp.stars === 1 ? "⭐" : ""}
            </span>
          </div>

          {/* Checkpoint dots */}
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <CheckpointDots tiers={tp.tiers} compact />
            <span className="text-xs font-semibold tabular-nums shrink-0" style={{ color: tp.status === "completed" ? "#16a34a" : tp.status === "started" ? "#1d4ed8" : "#94a3b8" }}>
              {tp.completedExercises}/{tp.totalExercises}
            </span>
          </div>

          {/* Progress bar — segmented by tier */}
          {tp.status !== "locked" && tp.totalExercises > 0 && (
            <div className="mt-2 flex h-2 rounded-full overflow-hidden gap-px bg-gray-100">
              {activeTiers.map((t, i) => {
                const segPct = (t.total / tp.totalExercises) * 100;
                const fillPct = t.total > 0 ? (t.done / t.total) * 100 : 0;
                return (
                  <div key={i} className="relative h-full bg-gray-200 overflow-hidden" style={{ width: `${segPct}%` }}>
                    <div className="h-full transition-all duration-700 rounded-full"
                      style={{ width: `${fillPct}%`, background: tierBarColors[i] }} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── SUBJECT SECTION ─────────────────────────────────────────────────────────
function SubjectSection({ subjectId, topics, grade, completedCount, totalCount }: {
  subjectId: string;
  topics: TopicProgress[];
  grade: number;
  completedCount: number;
  totalCount: number;
}) {
  const { tr } = useLang();
  const meta = SUBJECTS.find(s => s.id === subjectId)!;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const subjectColors: Record<string, { bg: string; border: string; bar: string; text: string }> = {
    math:    { bg: "bg-blue-50",   border: "border-blue-200",  bar: "#3b82f6",  text: "text-blue-900" },
    german:  { bg: "bg-yellow-50", border: "border-yellow-200",bar: "#f59e0b",  text: "text-yellow-900" },
    science: { bg: "bg-green-50",  border: "border-green-200", bar: "#22c55e",  text: "text-green-900" },
  };
  const sc = subjectColors[subjectId] ?? subjectColors.math;

  return (
    <div className={`rounded-2xl border-2 ${sc.border} ${sc.bg} overflow-hidden`}>
      {/* Subject header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-white/50">
        <span className="text-2xl">{meta.emoji}</span>
        <div className="flex-1">
          <div className={`font-black text-base ${sc.text}`}>{tr(subjectId as "math" | "german" | "science")}</div>
          <div className="text-xs text-gray-500 font-medium">
            {completedCount}/{totalCount} {tr("gradeLabel") ? "" : "Aufgaben"} · {pct}%
          </div>
        </div>
        {/* Subject progress bar */}
        <div className="w-24">
          <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-gray-200">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: sc.bar }} />
          </div>
        </div>
      </div>

      {/* Topics grid */}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {topics.map(tp => (
          <TopicCard key={tp.topicId} tp={tp} grade={grade} subject={subjectId} />
        ))}
      </div>
    </div>
  );
}

// ─── MAIN MISSIONEN PAGE ──────────────────────────────────────────────────────
export default function MissionenPage() {
  const { profile, loaded } = useProfileContext();
  const { lang, tr } = useLang();
  const [activeTab, setActiveTab] = useState<"all" | "math" | "german" | "science">("all");

  // Get active child's grade from family store
  const grade = useMemo(() => {
    if (typeof window === "undefined") return 1;
    try {
      const activeId = localStorage.getItem("cleverli_active_profile");
      const family = loadFamily();
      const member = family.members.find(m => m.id === activeId);
      if (member?.grade) return member.grade;
    } catch { /* */ }
    const saved = localStorage.getItem("cleverli_last_grade");
    return saved ? parseInt(saved) : 1;
  }, []);

  // Get active child name
  const childName = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      const activeId = localStorage.getItem("cleverli_active_profile");
      const family = loadFamily();
      const member = family.members.find(m => m.id === activeId);
      return member ? { name: member.name, avatar: member.avatar } : null;
    } catch { return null; }
  }, []);

  // Build full curriculum progress map
  const curriculumData = useMemo(() => {
    if (!loaded) return null;
    return SUBJECTS.map(subject => {
      const topics = getTopics(grade, subject.id);
      let completedExercisesTotal = 0;
      let totalExercisesTotal = 0;

      const topicProgressList: TopicProgress[] = topics.map(topic => {
        const { completed, stars } = loadTopicProgress(grade, subject.id, topic.id);
        const tierInfo = getTierProgress(topic, completed);
        const total = topic.exercises.length;

        completedExercisesTotal += completed;
        totalExercisesTotal += total;

        let status: TopicProgress["status"] = "available";
        if (completed === 0 && stars === 0) status = "available";
        if (completed > 0 && completed < total) status = "started";
        if (completed >= total) status = "completed";

        return {
          topicId: topic.id,
          title: topic.title,
          emoji: topic.emoji ?? "📚",
          grade,
          subject: subject.id,
          totalExercises: total,
          completedExercises: completed,
          stars,
          tiers: {
            easy:   tierInfo.easy,
            medium: tierInfo.medium,
            hard:   tierInfo.hard,
          },
          status,
        };
      });

      return {
        subjectId: subject.id,
        topics: topicProgressList,
        completedExercises: completedExercisesTotal,
        totalExercises: totalExercisesTotal,
      };
    });
  }, [grade, loaded, profile.totalExercises]); // re-run when exercises change

  // Overall stats
  const overallCompleted = curriculumData?.reduce((s, d) => s + d.completedExercises, 0) ?? 0;
  const overallTotal     = curriculumData?.reduce((s, d) => s + d.totalExercises, 0) ?? 1;
  const overallPct = Math.round((overallCompleted / overallTotal) * 100);

  const levelProgress = getLevelProgress(profile.xp);
  const currentLevelData = LEVELS.slice().reverse().find(l => profile.xp >= l.minXp) ?? LEVELS[0];
  const levelLabel = currentLevelData.title;

  if (!loaded) return <div className="animate-pulse space-y-4 p-4">{[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-green-50 rounded-2xl"/>)}</div>;

  const tabs = [
    { id: "all",     label: lang === "fr" ? "Tous" : lang === "it" ? "Tutti" : lang === "en" ? "All" : "Alle", emoji: "🗺️" },
    { id: "math",    label: tr("math"),    emoji: "🔢" },
    { id: "german",  label: tr("german"),  emoji: "📖" },
    { id: "science", label: tr("science"), emoji: "🌍" },
  ] as const;

  const filteredData = activeTab === "all"
    ? (curriculumData ?? [])
    : (curriculumData ?? []).filter(d => d.subjectId === activeTab);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-28 space-y-5">

      {/* Header */}
      <div className="pt-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              🗺️ {lang === "fr" ? "Mes Missions" : lang === "it" ? "Le mie Missioni" : lang === "en" ? "My Missions" : "Meine Missionen"}
            </h1>
            <div className="text-sm text-gray-500 mt-0.5">
              {grade}. {tr("gradeLabel")}
              {childName && <span className="ml-2 font-semibold text-green-700">{childName.avatar} {childName.name}</span>}
            </div>
          </div>
        </div>

        {/* Overall progress card */}
        <div className="mt-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 p-4">
          <div className="flex items-center gap-4">
            {/* XP + Level */}
            <div className="text-center shrink-0">
              <div className="text-3xl font-black text-green-700">{profile.xp}</div>
              <div className="text-xs text-green-600 font-semibold">XP</div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-gray-700">{levelLabel}</span>
                <span className="text-xs font-semibold text-gray-500">{overallCompleted}/{overallTotal} · {overallPct}%</span>
              </div>
              <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-green-200">
                <div className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-green-400 to-emerald-500"
                  style={{ width: `${overallPct}%` }} />
              </div>
              <div className="mt-1 flex gap-2 text-xs text-gray-400">
                <span>🔥 {profile.dailyStreak} Tage</span>
                <span>⭐ {profile.xp} XP</span>
                <span>📝 {profile.totalExercises} Aufgaben</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all shrink-0 ${
              activeTab === tab.id
                ? "bg-green-600 text-white shadow-md"
                : "bg-white border-2 border-gray-200 text-gray-600 hover:border-green-300"
            }`}>
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
            {tab.id !== "all" && curriculumData && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === tab.id ? "bg-white/20" : "bg-gray-100"}`}>
                {curriculumData.find(d => d.subjectId === tab.id)?.topics.filter(t => t.status === "completed").length ?? 0}
                /{curriculumData.find(d => d.subjectId === tab.id)?.topics.length ?? 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Subject sections */}
      <div className="space-y-4">
        {filteredData.map(d => (
          <SubjectSection
            key={d.subjectId}
            subjectId={d.subjectId}
            topics={d.topics}
            grade={grade}
            completedCount={d.completedExercises}
            totalCount={d.totalExercises}
          />
        ))}
      </div>

      {/* Back link */}
      <div className="text-center pt-2">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 underline">
          ← {lang === "fr" ? "Retour au tableau de bord" : lang === "it" ? "Torna alla dashboard" : lang === "en" ? "Back to dashboard" : "Zurück zum Dashboard"}
        </Link>
      </div>
    </div>
  );
}
