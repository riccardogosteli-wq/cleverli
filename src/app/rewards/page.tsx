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
  const [formStep, setFormStep] = useState<1 | 2>(1); // step-by-step form
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [redeemConfirm, setRedeemConfirm] = useState<string | null>(null);

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
      setFormStep(1);
      setForm({ emoji: "🦁", title: "", triggerType: "tasks", triggerValue: 20 });
      setError("");
      reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error");
    }
  };

  const TRIGGER_CONTEXT: Record<TriggerType, { de: string; en: string }> = {
    tasks:  { de: "Das sind ca. 2 Wochen bei 10 Min./Tag", en: "About 2 weeks at 10 min/day" },
    topics: { de: "Ein Thema = ca. 10–15 Aufgaben", en: "One topic = approx. 10–15 exercises" },
    streak: { de: "Jeden Tag eine Aufgabe", en: "One exercise every day" },
    stars:  { de: "Sterne werden beim Thema-Abschluss vergeben", en: "Stars earned on topic completion" },
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

        {/* Add form — step by step */}
        {adding && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-4">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${formStep === 1 ? "bg-amber-500 text-white" : "bg-green-500 text-white"}`}>1</div>
              <div className="flex-1 h-1 bg-amber-200 rounded-full"><div className={`h-full bg-amber-500 rounded-full transition-all ${formStep === 2 ? "w-full" : "w-0"}`}/></div>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${formStep === 2 ? "bg-amber-500 text-white" : "bg-gray-200 text-gray-400"}`}>2</div>
            </div>

            {formStep === 1 && (<>
              <div className="font-bold text-amber-800">
                {lang === "de" ? "Was ist die Belohnung?" : "What is the reward?"}
              </div>

              {/* Template grid */}
              <div className="grid grid-cols-2 gap-2">
                {REWARD_TEMPLATES.map((t, i) => (
                  <button key={i}
                    onClick={() => setForm(f => ({ ...f, emoji: t.emoji, title: t.title[lang as keyof typeof t.title] ?? t.title.de }))}
                    className={`flex items-center gap-2 p-3 rounded-xl text-sm text-left transition-colors border-2 ${
                      form.title === (t.title[lang as keyof typeof t.title] ?? t.title.de)
                        ? "bg-amber-200 border-amber-500 font-semibold"
                        : "bg-white border-gray-200 hover:border-amber-400"
                    }`}>
                    <span className="text-xl shrink-0">{t.emoji}</span>
                    <span className="text-xs leading-tight">{t.title[lang as keyof typeof t.title] ?? t.title.de}</span>
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="text-xs text-gray-400 text-center mb-2">— {lang === "de" ? "oder eigene eingeben" : "or type your own"} —</div>
                <div className="flex gap-2">
                  <button onClick={() => setCustomEmoji(e => !e)}
                    className="w-12 h-12 text-2xl border-2 border-gray-200 rounded-xl bg-white hover:border-amber-400 transition-colors shrink-0">
                    {form.emoji}
                  </button>
                  <input
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder={lang === "de" ? "z.B. Schlittschuh laufen gehen…" : "e.g. Go ice skating…"}
                    className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 bg-white"
                  />
                </div>
                {customEmoji && (
                  <div className="flex flex-wrap gap-1.5 mt-2 bg-white border rounded-xl p-2">
                    {["🦁","🍦","🎬","🧁","🎨","🛒","🏊","🎠","🍕","📚","🎡","🐬","🎭","🌈","🎪","🦄","🧸","🎮","⛷️","🎳","🚲","🎵"].map(e => (
                      <button key={e} onClick={() => { setForm(f => ({ ...f, emoji: e })); setCustomEmoji(false); }}
                        className="text-xl w-9 h-9 rounded-lg hover:bg-amber-100 transition-colors">
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                onClick={() => { if (!form.title.trim()) { setError(lang === "de" ? "Bitte eine Belohnung wählen oder eingeben." : "Please choose or enter a reward."); return; } setError(""); setFormStep(2); }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">
                {lang === "de" ? "Weiter: Ziel festlegen →" : "Next: Set the goal →"}
              </button>
            </>)}

            {formStep === 2 && (<>
              <div>
                <div className="font-bold text-amber-800 mb-1">
                  {lang === "de" ? "Wann soll die Belohnung kommen?" : "When should the reward unlock?"}
                </div>
                <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-amber-200 mb-4">
                  <span className="text-2xl">{form.emoji}</span>
                  <span className="font-semibold text-gray-800 text-sm">{form.title}</span>
                </div>
              </div>

              {TRIGGER_PRESETS.map(tp => (
                <div key={tp.type} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">{tl(tp.type)}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {TRIGGER_CONTEXT[tp.type][lang === "de" ? "de" : "en"]}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {tp.values.map(v => (
                      <button key={v}
                        onClick={() => setForm(f => ({ ...f, triggerType: tp.type, triggerValue: v }))}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                          form.triggerType === tp.type && form.triggerValue === v
                            ? "bg-amber-500 text-white shadow-sm"
                            : "bg-white border-2 border-gray-200 text-gray-600 hover:border-amber-400"
                        }`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-white border-2 border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-800 font-medium">
                🎯 {lang === "de" ? "Freischalten wenn:" : "Unlocks when:"}{" "}
                <strong>{form.triggerValue} {tl(form.triggerType)}</strong>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex gap-2">
                <button onClick={() => setFormStep(1)} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm">←</button>
                <button onClick={handleAdd} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">
                  🎁 {lang === "de" ? "Belohnung erstellen" : "Create reward"}
                </button>
              </div>
            </>)}

            <button onClick={() => { setAdding(false); setError(""); setFormStep(1); }}
              className="w-full text-xs text-gray-400 hover:text-gray-600 py-1">
              {lang === "de" ? "Abbrechen" : "Cancel"}
            </button>
          </div>
        )}

        {/* Empty state */}
        {active.length === 0 && !adding && (
          <div className="text-center py-10 space-y-3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-5xl">🎁</div>
            <div className="font-bold text-gray-700">
              {lang === "de" ? "Noch keine Belohnungen" : "No rewards yet"}
            </div>
            <div className="text-sm text-gray-400 max-w-xs mx-auto px-4">
              {lang === "de"
                ? "Erstelle eine Belohnung für dein Kind — es sieht den Fortschritt direkt in der App!"
                : "Create a reward for your child — they'll see their progress right in the app!"}
            </div>
            <button onClick={() => setAdding(true)}
              className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-full transition-colors shadow-sm">
              + {lang === "de" ? "Erste Belohnung erstellen" : "Create first reward"}
            </button>
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
                {deleteConfirm === r.id ? (
                  <div className="flex gap-1">
                    <button onClick={() => { removeReward(r.id); setDeleteConfirm(null); reload(); }}
                      className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-lg font-bold">✓ Löschen</button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 px-2 py-1 rounded-lg">Nein</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(r.id)}
                    className="text-gray-300 hover:text-red-400 text-lg transition-colors px-2 py-1">✕</button>
                )}
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
              {redeemConfirm === r.id ? (
                <div className="flex flex-col gap-1 shrink-0">
                  <div className="text-xs text-amber-800 font-semibold text-center">Wirklich eingelöst?</div>
                  <div className="flex gap-1">
                    <button onClick={() => { markRedeemed(r.id); setRedeemConfirm(null); reload(); }}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-xl text-sm active:scale-95">✓ Ja!</button>
                    <button onClick={() => setRedeemConfirm(null)}
                      className="bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-sm">Nein</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setRedeemConfirm(r.id)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-3 rounded-xl text-sm transition-colors active:scale-95 whitespace-nowrap shadow-sm">
                  {lang === "de" ? "✅ Eingelöst!" : lang === "fr" ? "✅ Réclamé!" : lang === "it" ? "✅ Riscattato!" : "✅ Redeemed!"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Redeemed history — celebrate! */}
      {redeemed.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-bold text-gray-600 text-sm flex items-center gap-2">
            🏅 {lang === "de" ? `Erlebnisse (${redeemed.length})` : `Memories (${redeemed.length})`}
          </h2>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4 space-y-3">
            {redeemed.map(r => (
              <div key={r.id} className="flex items-center gap-3">
                <span className="text-2xl">{r.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700">{r.title}</div>
                  <div className="text-xs text-gray-400">
                    ✓ {r.redeemedAt ? new Date(r.redeemedAt).toLocaleDateString(lang === "de" ? "de-CH" : "fr-CH") : ""}
                  </div>
                </div>
                <span className="text-green-500 text-lg">✓</span>
              </div>
            ))}
            <div className="text-xs text-purple-400 text-center pt-1">
              {lang === "de" ? `${redeemed.length} gemeinsame Erlebnis${redeemed.length > 1 ? "se" : ""} 🎉` : `${redeemed.length} shared experience${redeemed.length > 1 ? "s" : ""} 🎉`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
