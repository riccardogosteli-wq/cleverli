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
import { useSession } from "@/hooks/useSession";
import ParentPinGate, { lockParentSession } from "@/components/ParentPinGate";
import { getTopics, SUBJECTS } from "@/data/index";

const TRIGGER_PRESETS: { type: TriggerType; values: number[] }[] = [
  { type: "tasks",  values: [10, 20, 50, 100] },
  { type: "topics", values: [3, 5, 10, 20] },
  { type: "streak", values: [3, 7, 14, 30] },
  { type: "stars",  values: [10, 25, 50, 100] },
];

export default function RewardsPage() {
  const { lang } = useLang();
  const { isPremium, loaded, session } = useSession();
  const uid = session?.userId ?? "";
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

  // Per-subject topic completion counts (all grades)
  const subjectProgress = SUBJECTS.map(s => {
    let done = 0, total = 0;
    for (const g of [1,2,3,4,5,6]) {
      const topics = getTopics(g, s.id);
      total += topics.length;
      for (const t of topics) {
        try {
          const raw = typeof window !== "undefined" ? localStorage.getItem(`cleverli_${g}_${s.id}_${t.id}`) : null;
          if (raw) done++;
        } catch { /* ignore */ }
      }
    }
    return { id: s.id, emoji: s.emoji, done, total };
  });

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

  const TRIGGER_CONTEXT: Record<TriggerType, { de: string; en: string; fr: string; it: string }> = {
    tasks:  { de: "ca. 2 Wochen bei 10 Min./Tag", en: "~2 weeks at 10 min/day", fr: "~2 semaines à 10 min/jour", it: "~2 settimane a 10 min/giorno" },
    topics: { de: "1 Thema = ca. 10–15 Aufgaben", en: "1 topic = ~10–15 exercises", fr: "1 thème = ~10–15 exercices", it: "1 argomento = ~10–15 esercizi" },
    streak: { de: "Jeden Tag eine Aufgabe erledigen", en: "Complete one exercise every day", fr: "Un exercice chaque jour", it: "Un esercizio ogni giorno" },
    stars:  { de: "Sterne beim Thema-Abschluss", en: "Stars earned on topic completion", fr: "Étoiles à la fin d'un thème", it: "Stelle al completamento di un argomento" },
  };

  const triggerCtx = (type: TriggerType) => {
    const ctx = TRIGGER_CONTEXT[type];
    return ctx[lang as keyof typeof ctx] ?? ctx.de;
  };

  const statusColor = (r: Reward) => {
    if (r.status === "unlocked") return "bg-amber-50 border-amber-300";
    if (r.status === "redeemed") return "bg-gray-50 border-gray-200 opacity-60";
    return "bg-white border-gray-200";
  };

  // UJ-9 + UJ-16: Premium gate first, then PIN gate
  if (loaded && !isPremium) {
    return (
      <div className="max-w-sm mx-auto px-4 py-16 text-center space-y-5">
        <Image src="/cleverli-think.png" alt="Cleverli Maskottchen" width={110} height={110} className="mx-auto drop-shadow-md hidden sm:block" />
        <div className="flex items-center gap-2">
          <Image src="/images/ui/Belohnungen.svg" alt="Belohnungen" width={28} height={28} className="drop-shadow-sm" />
          <h1 className="text-2xl font-extrabold text-gray-900">Belohnungen</h1>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">
          Mit dem Belohnungs-System kannst du echte Belohnungen für dein Kind einrichten — und es motivieren, dranzubleiben.
        </p>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-left space-y-2 text-sm text-amber-900">
          <div className="flex items-center gap-2"><Image src="/images/ui/Trophaeen.svg" alt="Trophy" width={20} height={20} /> Belohnungen für Sterne, Streaks und Aufgaben</div>
          <div>👶 Bis zu 3 Kinderprofile mit Premium</div>
          <div>📊 Lernfortschritt der ganzen Familie sehen</div>
        </div>
        <Link href={uid ? `/api/checkout?plan=monthly&uid=${uid}` : "/upgrade"}
          className="block w-full bg-amber-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-amber-600 active:scale-95 transition-all shadow-md">
          Premium freischalten — CHF 9.90/Mt.
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 underline">Zurück zum Lernen</Link>
      </div>
    );
  }

  return (
    <ParentPinGate>
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24 sm:pb-8">
      {/* Lock button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => { lockParentSession(); window.location.reload(); }}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors py-1.5 px-3 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50"
        >
          🔒 <span>Elternbereich sperren</span>
        </button>
      </div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 min-w-[44px]">←</Link>
        <Image src="/cleverli-celebrate.png" alt="Cleverli feiert" width={44} height={44} className="drop-shadow-md" />
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Image src="/images/ui/Belohnungen.svg" alt="Belohnungen" width={24} height={24} />
          {lang === "fr" ? "Récompenses" : lang === "it" ? "Premi" : lang === "en" ? "Rewards" : "Belohnungen"}
        </h1>
        <div className="flex-1" />
        <Link href="/dashboard" className="hidden md:block text-sm text-gray-400 hover:text-gray-600">
          ← {lang === "de" ? "Zurück zum Dashboard" : "Back to dashboard"}
        </Link>
      </div>

      <div className="md:grid md:grid-cols-[1fr_380px] md:gap-8 space-y-6 md:space-y-0">
      {/* LEFT: active rewards + form */}
      <div className="space-y-6">

      {/* Current progress snapshot */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3">
          {lang === "de" ? "Aktueller Fortschritt" : lang === "fr" ? "Progrès actuel" : lang === "it" ? "Progresso attuale" : "Current progress"}
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: lang === "de" ? "Aufgaben" : lang === "fr" ? "Exercices" : lang === "it" ? "Esercizi" : "Tasks", value: snap.totalExercises, emoji: "✅" },
            { label: lang === "de" ? "Themen" : lang === "fr" ? "Thèmes" : lang === "it" ? "Argomenti" : "Topics", value: snap.totalTopicsComplete, emoji: "📚" },
            { label: lang === "de" ? "Streak" : "Streak", value: snap.dailyStreak, emoji: "🔥" },
            { label: lang === "de" ? "Sterne" : lang === "fr" ? "Étoiles" : lang === "it" ? "Stelle" : "Stars", value: snap.totalStars, emoji: "⭐" },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl p-2 shadow-sm">
              <div className="text-xl">{item.emoji}</div>
              <div className="text-lg font-black text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-400">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Per-subject breakdown */}
        {subjectProgress.some(s => s.done > 0) && (
          <div className="mt-3 space-y-2">
            <div className="text-xs text-green-600 font-semibold">
              {lang === "de" ? "Nach Fach:" : lang === "fr" ? "Par matière:" : lang === "it" ? "Per materia:" : "By subject:"}
            </div>
            {subjectProgress.map(s => {
              const pct = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
              const barColor = s.id === "math" ? "bg-blue-400" : s.id === "german" ? "bg-yellow-400" : "bg-green-500";
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="text-base w-6 shrink-0">{s.emoji}</span>
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-green-700 font-semibold w-14 text-right shrink-0">{s.done}/{s.total}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active rewards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-bold text-gray-800">
            {lang === "de" ? `Aktive Belohnungen (${active.length}/3)` : lang === "fr" ? `Récompenses actives (${active.length}/3)` : lang === "it" ? `Premi attivi (${active.length}/3)` : `Active rewards (${active.length}/3)`}
          </h2>
          {active.length >= 3 && !adding ? (
            <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded-full font-semibold">
              {lang === "fr" ? "Max atteint" : lang === "it" ? "Max raggiunto" : lang === "en" ? "Limit reached" : "Limit erreicht"}
            </span>
          ) : (!adding && (
            <button onClick={() => setAdding(true)}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-1.5 rounded-full transition-colors">
              + {lang === "de" ? "Hinzufügen" : lang === "fr" ? "Ajouter" : lang === "it" ? "Aggiungi" : "Add"}
            </button>
          ))}
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
                      {triggerCtx(tp.type)}
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
            <div className="flex justify-center">
              <Image src="/images/ui/Belohnungen.svg" alt="Rewards" width={80} height={80} />
            </div>
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
                      className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-lg font-bold">
                      {lang === "fr" ? "✓ Supprimer" : lang === "it" ? "✓ Elimina" : lang === "en" ? "✓ Delete" : "✓ Löschen"}
                    </button>
                    <button onClick={() => setDeleteConfirm(null)}
                      className="text-xs bg-gray-100 text-gray-500 hover:bg-gray-200 px-2 py-1 rounded-lg">
                      {lang === "fr" ? "Non" : lang === "it" ? "No" : lang === "en" ? "No" : "Nein"}
                    </button>
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

      </div> {/* end LEFT col */}

      {/* RIGHT col: unlocked + redeemed */}
      <div className="space-y-6">

      {/* Unlocked — waiting to be redeemed */}
      {unlocked.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-amber-700 flex items-center gap-2">
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
                  <div className="text-xs text-amber-800 font-semibold text-center">
                    {lang === "fr" ? "Vraiment?" : lang === "it" ? "Davvero?" : lang === "en" ? "Confirm?" : "Wirklich?"}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { markRedeemed(r.id); setRedeemConfirm(null); reload(); }}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-xl text-sm active:scale-95">
                      {lang === "fr" ? "✓ Oui" : lang === "it" ? "✓ Sì" : lang === "en" ? "✓ Yes" : "✓ Ja!"}
                    </button>
                    <button onClick={() => setRedeemConfirm(null)}
                      className="bg-gray-100 text-gray-600 px-3 py-2 rounded-xl text-sm">
                      {lang === "fr" ? "Non" : lang === "it" ? "No" : lang === "en" ? "No" : "Nein"}
                    </button>
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
                    ✓ {r.redeemedAt ? new Date(r.redeemedAt).toLocaleDateString(
                      lang === "de" ? "de-CH" : lang === "fr" ? "fr-CH" : lang === "it" ? "it-CH" : "en-GB"
                    ) : ""}
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

      {/* Empty right col placeholder when no unlocked/redeemed */}
      {unlocked.length === 0 && redeemed.length === 0 && (
        <div className="hidden md:flex flex-col items-center justify-center py-16 text-gray-200 text-center space-y-3">
          <div className="text-6xl">🎯</div>
          <div className="text-sm text-gray-300 max-w-xs">
            {lang === "de" ? "Wenn dein Kind ein Ziel erreicht, erscheint es hier." : "When your child reaches a goal, it'll appear here."}
          </div>
        </div>
      )}

      </div> {/* end RIGHT col */}
      </div> {/* end md:grid */}
    </div>
    </ParentPinGate>
  );
}
