"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  loadRewards, addReward, markRedeemed, removeReward,
  countTotalStars, REWARD_TEMPLATES, TRIGGER_LABELS,
  Reward, TriggerType, ProgressSnapshot,
  getProgressValue,
} from "@/lib/rewards";
import { useLang } from "@/lib/LangContext";

const TRIGGER_PRESETS: { type: TriggerType; values: number[] }[] = [
  { type: "tasks",  values: [10, 20, 50, 100] },
  { type: "topics", values: [3, 5, 10, 20] },
  { type: "streak", values: [3, 7, 14, 30] },
  { type: "stars",  values: [10, 25, 50, 100] },
];

export default function RewardsPage() {
  const { lang } = useLang();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [snap, setSnap] = useState<ProgressSnapshot>({ totalExercises: 0, totalTopicsComplete: 0, dailyStreak: 0, totalStars: 0 });
  const [adding, setAdding] = useState(false);

  // Form state
  const [form, setForm] = useState({
    emoji: "🦁",
    title: "",
    triggerType: "tasks" as TriggerType,
    triggerValue: 20,
  });
  const [customEmoji, setCustomEmoji] = useState(false);
  const [error, setError] = useState("");

  const reload = () => {
    setRewards(loadRewards());
    // Load current progress snapshot
    const totalStars = countTotalStars();
    const raw = typeof window !== "undefined" ? localStorage.getItem("cleverli_profile") : null;
    const profile = raw ? JSON.parse(raw) : {};
    setSnap({
      totalExercises: profile.totalExercises ?? 0,
      totalTopicsComplete: profile.totalTopicsComplete ?? 0,
      dailyStreak: profile.dailyStreak ?? 0,
      totalStars,
    });
  };

  useEffect(() => { reload(); }, []);

  const tl = (key: keyof typeof TRIGGER_LABELS) =>
    TRIGGER_LABELS[key][lang as keyof typeof TRIGGER_LABELS[typeof key]] ?? TRIGGER_LABELS[key].de;

  const active = rewards.filter(r => r.status === "active");
  const unlocked = rewards.filter(r => r.status === "unlocked");
  const redeemed = rewards.filter(r => r.status === "redeemed");

  const handleAdd = () => {
    if (!form.title.trim()) { setError(lang === "de" ? "Bitte einen Titel eingeben." : "Please enter a title."); return; }
    if (active.length >= 3) { setError(lang === "de" ? "Max. 3 aktive Belohnungen." : "Max 3 active rewards."); return; }
    try {
      addReward({ emoji: form.emoji, title: form.title, triggerType: form.triggerType, triggerValue: form.triggerValue });
      setAdding(false);
      setForm({ emoji: "🦁", title: "", triggerType: "tasks", triggerValue: 20 });
      setError("");
      reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  const statusColor = (r: Reward) => {
    if (r.status === "unlocked") return "bg-amber-50 border-amber-300";
    if (r.status === "redeemed") return "bg-gray-50 border-gray-200 opacity-60";
    return "bg-white border-gray-200";
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">← {lang === "de" ? "Zurück" : "Back"}</Link>
        <div className="flex-1" />
        <Image src="/cleverli-celebrate.png" alt="" width={44} height={44} className="drop-shadow-md" />
        <h1 className="text-xl font-bold text-gray-800">
          🎁 {lang === "fr" ? "Récompenses" : lang === "it" ? "Premi" : lang === "en" ? "Rewards" : "Belohnungen"}
        </h1>
      </div>

      {/* Current progress snapshot */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3">
          {lang === "de" ? "Aktueller Fortschritt" : lang === "fr" ? "Progrès actuel" : lang === "it" ? "Progresso attuale" : "Current progress"}
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: lang === "de" ? "Aufgaben" : "Tasks", value: snap.totalExercises, emoji: "✅" },
            { label: lang === "de" ? "Themen" : "Topics", value: snap.totalTopicsComplete, emoji: "📚" },
            { label: lang === "de" ? "Streak" : "Streak", value: snap.dailyStreak, emoji: "🔥" },
            { label: lang === "de" ? "Sterne" : "Stars", value: snap.totalStars, emoji: "⭐" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-2 shadow-sm">
              <div className="text-xl">{item.emoji}</div>
              <div className="text-lg font-black text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active rewards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">
            {lang === "de" ? `Aktive Belohnungen (${active.length}/3)` : `Active rewards (${active.length}/3)`}
          </h2>
          {active.length < 3 && !adding && (
            <button onClick={() => setAdding(true)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition-colors">
              + {lang === "de" ? "Hinzufügen" : "Add"}
            </button>
          )}
        </div>

        {/* Add form */}
        {adding && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 space-y-4">
            <div className="font-bold text-amber-800">
              {lang === "de" ? "Neue Belohnung" : "New reward"}
            </div>

            {/* Template picker */}
            <div>
              <div className="text-xs text-gray-500 mb-2">{lang === "de" ? "Vorlage wählen:" : "Choose template:"}</div>
              <div className="flex flex-wrap gap-2">
                {REWARD_TEMPLATES.map((t, i) => (
                  <button key={i}
                    onClick={() => { setForm(f => ({ ...f, emoji: t.emoji, title: t.title[lang as keyof typeof t.title] ?? t.title.de })); }}
                    className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-amber-400 px-2 py-1.5 rounded-xl text-sm transition-colors">
                    {t.emoji} <span className="text-xs">{t.title[lang as keyof typeof t.title] ?? t.title.de}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom title */}
            <div className="flex gap-2">
              <button onClick={() => setCustomEmoji(e => !e)}
                className="w-12 h-12 text-2xl border border-gray-200 rounded-xl bg-white hover:border-amber-400 transition-colors">
                {form.emoji}
              </button>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder={lang === "de" ? "Belohnung benennen…" : "Name the reward…"}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Emoji picker */}
            {customEmoji && (
              <div className="flex flex-wrap gap-2">
                {["🦁","🍦","🎬","🧁","🎨","🛒","🏊","🎠","🍕","📚","🎡","🐬","🎭","🌈","🎪","🦄","🧸","🎮"].map(e => (
                  <button key={e} onClick={() => { setForm(f => ({ ...f, emoji: e })); setCustomEmoji(false); }}
                    className="text-2xl w-10 h-10 rounded-xl hover:bg-amber-100 transition-colors">
                    {e}
                  </button>
                ))}
              </div>
            )}

            {/* Trigger */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500">{lang === "de" ? "Ziel:" : "Goal:"}</div>
              <div className="grid grid-cols-2 gap-2">
                {TRIGGER_PRESETS.map(tp => (
                  <div key={tp.type}>
                    <div className="text-xs font-medium text-gray-600 mb-1">{tl(tp.type)}</div>
                    <div className="flex gap-1 flex-wrap">
                      {tp.values.map(v => (
                        <button key={v}
                          onClick={() => setForm(f => ({ ...f, triggerType: tp.type, triggerValue: v }))}
                          className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${
                            form.triggerType === tp.type && form.triggerValue === v
                              ? "bg-amber-500 text-white"
                              : "bg-white border border-gray-200 text-gray-600 hover:border-amber-400"
                          }`}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-sm text-amber-700 bg-amber-100 rounded-xl px-3 py-2">
                🎯 {lang === "de" ? "Freischalten wenn:" : "Unlocks when:"}{" "}
                <strong>{form.triggerValue} {tl(form.triggerType)}</strong>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex gap-2">
              <button onClick={handleAdd}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">
                {lang === "de" ? "Belohnung speichern" : "Save reward"}
              </button>
              <button onClick={() => { setAdding(false); setError(""); }}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors text-sm">
                {lang === "de" ? "Abbrechen" : "Cancel"}
              </button>
            </div>
          </div>
        )}

        {active.length === 0 && !adding && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🎁</div>
            <div className="text-sm">{lang === "de" ? "Noch keine aktiven Belohnungen." : "No active rewards yet."}</div>
          </div>
        )}

        {active.map(r => {
          const current = getProgressValue(snap, r.triggerType);
          const pct = Math.min(100, Math.round((current / r.triggerValue) * 100));
          return (
            <div key={r.id} className={`border-2 rounded-2xl p-4 ${statusColor(r)}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{r.emoji}</span>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{r.title}</div>
                  <div className="text-xs text-gray-400">{current} / {r.triggerValue} {tl(r.triggerType)}</div>
                </div>
                <button onClick={() => { removeReward(r.id); reload(); }}
                  className="text-gray-300 hover:text-red-400 text-lg transition-colors px-1">✕</button>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-right text-gray-400 mt-1">{pct}%</div>
            </div>
          );
        })}
      </div>

      {/* Unlocked — waiting to be redeemed */}
      {unlocked.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-amber-700">
            🔓 {lang === "de" ? "Bereit zum Einlösen!" : lang === "fr" ? "Prêt à réclamer!" : lang === "it" ? "Pronto per il riscatto!" : "Ready to redeem!"}
          </h2>
          {unlocked.map(r => (
            <div key={r.id} className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4 flex items-center gap-4 shadow-md">
              <span className="text-4xl">{r.emoji}</span>
              <div className="flex-1">
                <div className="font-bold text-gray-800">{r.title}</div>
                <div className="text-xs text-amber-600 mt-0.5">
                  🎉 {lang === "de" ? "Dein Kind hat das Ziel erreicht!" : lang === "fr" ? "Votre enfant a atteint l'objectif!" : lang === "it" ? "Il tuo bambino ha raggiunto l'obiettivo!" : "Your child reached the goal!"}
                </div>
              </div>
              <button
                onClick={() => { markRedeemed(r.id); reload(); }}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors active:scale-95 whitespace-nowrap">
                {lang === "de" ? "✅ Eingelöst!" : lang === "fr" ? "✅ Réclamé!" : lang === "it" ? "✅ Riscattato!" : "✅ Redeemed!"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Redeemed history */}
      {redeemed.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-gray-400 text-sm">
            {lang === "de" ? `Bereits eingelöst (${redeemed.length})` : `Redeemed (${redeemed.length})`}
          </h2>
          {redeemed.map(r => (
            <div key={r.id} className="flex items-center gap-3 opacity-50 px-1">
              <span className="text-2xl grayscale">{r.emoji}</span>
              <span className="text-sm text-gray-400 line-through">{r.title}</span>
              <span className="ml-auto text-xs text-gray-300">
                {r.redeemedAt ? new Date(r.redeemedAt).toLocaleDateString() : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
