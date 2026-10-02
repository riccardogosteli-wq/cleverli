"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/LangContext";
import {
  addMember,
  AVATARS,
  getActiveProfileId,
  loadFamily,
  setActiveProfileId,
  type FamilyMember,
} from "@/lib/family";
import { createChildInSupabase } from "@/lib/progressSync";
import { getTopicSummaries } from "@/data/topicCatalog";
import { getTopicTitle } from "@/data/topicTitles";
import {
  beginFirstWeekActivation,
  FIRST_WEEK_MISSION_SIZE,
  selectFirstWeekGoal,
} from "@/lib/firstWeekActivation";
import { captureProductEvent } from "@/lib/monitoring";
import { trackUserActivity } from "@/lib/userActivityClient";

const ONBOARDING_KEY = "cleverli_new_user";
const SUBJECTS = ["math", "german", "science"] as const;
type SubjectId = (typeof SUBJECTS)[number];
type Step = "welcome" | "profile" | "goal";

const SUBJECT_META: Record<SubjectId, { icon: string; de: string; fr: string; it: string; en: string }> = {
  math: { icon: "🔢", de: "Mathematik", fr: "Mathématiques", it: "Matematica", en: "Maths" },
  german: { icon: "📖", de: "Deutsch", fr: "Allemand", it: "Tedesco", en: "German" },
  science: { icon: "🌍", de: "NMG", fr: "NHS", it: "NUS", en: "Science" },
};

export default function OnboardingModal() {
  const router = useRouter();
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(1);
  const [subject, setSubject] = useState<SubjectId>("math");
  const [topicId, setTopicId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  useEffect(() => {
    if (window.localStorage.getItem(ONBOARDING_KEY) !== "true") return;
    const family = loadFamily();
    const activeId = getActiveProfileId();
    const current = family.members.find(candidate => candidate.id === activeId) ?? family.members[0] ?? null;
    if (current) {
      setActiveProfileId(current.id);
      setMember(current);
      setGrade(current.grade);
      beginFirstWeekActivation(current.id, current.grade);
    }
    setVisible(true);
  }, []);

  const topics = useMemo(() => getTopicSummaries(grade, subject).slice(0, 3), [grade, subject]);

  useEffect(() => {
    setTopicId(topics[0]?.id ?? "");
  }, [topics]);

  const handleProfileSave = async () => {
    if (saving) return;
    if (!name.trim()) {
      setError(t("Bitte gib den Vornamen oder Spitznamen ein.", "Entre le prénom ou le surnom.", "Inserisci il nome o soprannome.", "Enter a first name or nickname."));
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = addMember(name.trim(), AVATARS[0], grade);
      setActiveProfileId(created.id);
      setMember(created);
      beginFirstWeekActivation(created.id, grade);
      void createChildInSupabase(created.id, created.name, created.grade, created.avatar);
      captureProductEvent("activation_profile_created", { grade });
      void trackUserActivity("activation_profile_created", {
        grade,
        metadata: { child_id: created.id, source: "first_week_activation" },
      });
      setStep("goal");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t("Bitte versuche es nochmals.", "Réessaie.", "Riprova.", "Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleStart = () => {
    if (!member || !topicId) return;
    const state = selectFirstWeekGoal(member.id, grade, subject, topicId);
    window.localStorage.removeItem(ONBOARDING_KEY);
    captureProductEvent("activation_goal_selected", { grade, subject, topic_id: topicId });
    void trackUserActivity("activation_goal_selected", {
      grade,
      subject,
      topicId,
      metadata: { child_id: member.id, source: "first_week_activation", mission_size: FIRST_WEEK_MISSION_SIZE },
    });
    setVisible(false);
    router.push(`${state.nextPath}?first-week=1`);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/45 px-3 pb-3 backdrop-blur-sm sm:items-center sm:px-4 sm:pb-0" role="dialog" aria-modal="true" aria-labelledby="first-week-title">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="border-b border-gray-100 px-5 pt-5">
          <div className="mb-4 flex items-center gap-2" aria-label={t("Schritt", "Étape", "Passaggio", "Step")}>
            {["welcome", "profile", "goal"].map((item, index) => {
              const profileSkipped = Boolean(member);
              const stepIndex = step === "welcome" ? 0 : step === "profile" ? 1 : 2;
              const done = index < stepIndex || (profileSkipped && index === 1 && step === "goal");
              const active = index === stepIndex;
              return <div key={item} className={`h-2 flex-1 rounded-full ${done ? "bg-green-600" : active ? "bg-green-300" : "bg-gray-100"}`} />;
            })}
          </div>
        </div>

        {step === "welcome" && (
          <div className="space-y-5 p-6 text-center">
            <Image src="/cleverli-wave.png" alt="" width={112} height={112} className="mx-auto drop-shadow-md" priority />
            <div className="space-y-2">
              <h1 id="first-week-title" className="text-2xl font-black text-gray-900">
                {t("In zwei Minuten startklar", "Prêt en deux minutes", "Pronti in due minuti", "Ready in two minutes")}
              </h1>
              <p className="text-sm leading-6 text-gray-600">
                {t(
                  "Wir richten das Kinderprofil ein, wählen ein passendes Lernziel und starten direkt mit fünf Aufgaben.",
                  "Nous configurons le profil de l’enfant, choisissons un objectif adapté et commençons directement avec cinq exercices.",
                  "Configuriamo il profilo del bambino, scegliamo un obiettivo adatto e iniziamo subito con cinque esercizi.",
                  "We’ll set up the child profile, choose a suitable learning goal and start with five exercises.",
                )}
              </p>
            </div>
            <button type="button" onClick={() => setStep(member ? "goal" : "profile")} data-testid="activation-continue"
              className="min-h-12 w-full rounded-2xl bg-green-700 px-5 py-3 font-bold text-white shadow-sm active:scale-95">
              {member
                ? t("Lernziel wählen", "Choisir l’objectif", "Scegli l’obiettivo", "Choose learning goal")
                : t("Kind einrichten", "Configurer l’enfant", "Configura il bambino", "Set up child")}
            </button>
          </div>
        )}

        {step === "profile" && (
          <div className="space-y-5 p-6">
            <div className="text-center">
              <div className="mb-2 text-4xl">🦊</div>
              <h1 id="first-week-title" className="text-2xl font-black text-gray-900">
                {t("Für wen ist Cleverli?", "Pour qui est Cleverli ?", "Per chi è Cleverli?", "Who is Cleverli for?")}
              </h1>
              <p className="mt-1 text-sm text-gray-500">{t("So passen die Aufgaben zur Klasse.", "Ainsi, les exercices correspondent à la classe.", "Così gli esercizi corrispondono alla classe.", "This matches exercises to the grade.")}</p>
            </div>
            <div>
              <label htmlFor="activation-child-name" className="mb-1 block text-sm font-semibold text-gray-700">
                {t("Vorname oder Spitzname", "Prénom ou surnom", "Nome o soprannome", "First name or nickname")}
              </label>
              <input id="activation-child-name" value={name} onChange={event => { setName(event.target.value); setError(""); }} maxLength={30} autoComplete="off"
                placeholder={t("z.B. Lena", "p. ex. Léa", "es. Lena", "e.g. Lena")}
                className="min-h-12 w-full rounded-xl border-2 border-gray-200 px-4 text-base text-gray-900 outline-none focus:border-green-500" />
            </div>
            <div>
              <div id="activation-grade-label" className="mb-2 text-sm font-semibold text-gray-700">{t("Klasse", "Année", "Classe", "Grade")}</div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-labelledby="activation-grade-label">
                {[1, 2, 3, 4, 5, 6].map(value => (
                  <button key={value} type="button" onClick={() => setGrade(value)} aria-pressed={grade === value} data-testid={`activation-grade-${value}`}
                    className={`min-h-12 rounded-xl border-2 text-sm font-bold ${grade === value ? "border-green-700 bg-green-700 text-white" : "border-gray-200 bg-white text-gray-700"}`}>
                    {value}.
                  </button>
                ))}
              </div>
            </div>
            {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            <button type="button" onClick={handleProfileSave} disabled={saving} data-testid="activation-save-profile"
              className="min-h-12 w-full rounded-2xl bg-green-700 px-5 py-3 font-bold text-white shadow-sm disabled:opacity-50 active:scale-95">
              {saving ? t("Wird gespeichert…", "Enregistrement…", "Salvataggio…", "Saving…") : t("Lernziel wählen", "Choisir l’objectif", "Scegli l’obiettivo", "Choose learning goal")}
            </button>
          </div>
        )}

        {step === "goal" && (
          <div className="space-y-5 p-6">
            <div className="text-center">
              <div className="mb-2 text-4xl">🎯</div>
              <h1 id="first-week-title" className="text-2xl font-black text-gray-900">
                {t("Was soll heute leichter werden?", "Qu’est-ce qui doit devenir plus facile aujourd’hui ?", "Cosa dovrebbe diventare più facile oggi?", "What should feel easier today?")}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {t(`Wähle ein Lernziel für ${member?.name ?? "dein Kind"}.`, `Choisis un objectif pour ${member?.name ?? "ton enfant"}.`, `Scegli un obiettivo per ${member?.name ?? "il tuo bambino"}.`, `Choose a goal for ${member?.name ?? "your child"}.`)}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2" role="tablist" aria-label={t("Fach", "Matière", "Materia", "Subject")}>
              {SUBJECTS.map(value => {
                const meta = SUBJECT_META[value];
                const label = t(meta.de, meta.fr, meta.it, meta.en);
                return (
                  <button key={value} type="button" role="tab" aria-selected={subject === value} onClick={() => setSubject(value)}
                    className={`min-h-12 rounded-xl border-2 px-2 py-2 text-xs font-bold sm:text-sm ${subject === value ? "border-green-700 bg-green-50 text-green-800" : "border-gray-200 text-gray-600"}`}>
                    <span aria-hidden="true">{meta.icon}</span> {label}
                  </button>
                );
              })}
            </div>
            <div className="space-y-2" role="radiogroup" aria-label={t("Lernziel", "Objectif", "Obiettivo", "Learning goal")}>
              {topics.map(topic => {
                const selected = topicId === topic.id;
                return (
                  <button key={topic.id} type="button" role="radio" aria-checked={selected} onClick={() => setTopicId(topic.id)} data-testid={`activation-topic-${topic.id}`}
                    className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left ${selected ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"}`}>
                    <span className="text-2xl" aria-hidden="true">{topic.emoji}</span>
                    <span className="flex-1 font-bold text-gray-800">{getTopicTitle(topic.id, lang, topic.title)}</span>
                    {selected && <span className="font-black text-green-700" aria-hidden="true">✓</span>}
                  </button>
                );
              })}
            </div>
            <div className="rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm font-semibold text-amber-900">
              {t("Erste Mission: fünf kurze Aufgaben", "Première mission : cinq exercices courts", "Prima missione: cinque esercizi brevi", "First mission: five short exercises")}
            </div>
            <button type="button" onClick={handleStart} disabled={!topicId} data-testid="activation-start-mission"
              className="min-h-12 w-full rounded-2xl bg-green-700 px-5 py-3 font-bold text-white shadow-sm disabled:opacity-50 active:scale-95">
              {t("Erste Mission starten", "Commencer la première mission", "Inizia la prima missione", "Start first mission")} 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
