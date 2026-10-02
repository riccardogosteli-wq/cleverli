"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import type { Profile } from "@/hooks/useProfile";
import {
  dismissFirstWeekActivation,
  isFirstWeekActivationVisible,
  readFirstWeekActivation,
  type FirstWeekActivationState,
} from "@/lib/firstWeekActivation";

type Props = {
  childId: string | null;
  childName?: string;
  profile: Profile | null;
};

export default function FirstWeekActivationCard({ childId, childName, profile }: Props) {
  const { lang } = useLang();
  const [state, setState] = useState<FirstWeekActivationState | null>(null);

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  useEffect(() => {
    const refresh = () => setState(readFirstWeekActivation(childId));
    refresh();
    window.addEventListener("cleverli-activation-update", refresh);
    window.addEventListener("cleverli-progress-update", refresh);
    return () => {
      window.removeEventListener("cleverli-activation-update", refresh);
      window.removeEventListener("cleverli-progress-update", refresh);
    };
  }, [childId]);

  const startedDay = state?.startedAt.slice(0, 10) ?? "";
  const activeDays = startedDay && profile?.playDates?.length
    ? new Set(profile.playDates.filter(day => day >= startedDay)).size
    : 0;

  if (!childId || !isFirstWeekActivationVisible(state)) return null;

  const missionDone = Boolean(state?.firstMissionCompletedAt);
  const secondDayDone = activeDays >= 2;
  const nextPath = state?.nextPath ?? `/dashboard?grade=${state?.grade ?? 1}`;
  const ctaHref = missionDone ? nextPath : `${nextPath}${nextPath.includes("?") ? "&" : "?"}first-week=1`;
  const steps = [
    { done: true, label: t("Kinderprofil bereit", "Profil enfant prêt", "Profilo bambino pronto", "Child profile ready") },
    { done: missionDone, label: t("Erste Mission geschafft", "Première mission terminée", "Prima missione completata", "First mission completed") },
    { done: secondDayDone, label: t("An einem zweiten Tag gelernt", "Apprentissage un deuxième jour", "Studio in un secondo giorno", "Learned on a second day") },
  ];

  return (
    <section className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-4 shadow-sm" aria-labelledby="first-week-progress-title" data-testid="activation-checklist">
      <div className="flex items-start gap-3">
        <div className="text-3xl" aria-hidden="true">🌱</div>
        <div className="min-w-0 flex-1">
          <h2 id="first-week-progress-title" className="font-black text-green-900">
            {secondDayDone
              ? t("Cleverli Start geschafft", "Départ Cleverli réussi", "Avvio Cleverli completato", "Cleverli start completed")
              : t(`Der Start für ${childName ?? "dein Kind"}`, `Le départ de ${childName ?? "ton enfant"}`, `L’inizio di ${childName ?? "tuo figlio"}`, `Getting ${childName ?? "your child"} started`)}
          </h2>
          <p className="mt-1 text-xs leading-5 text-green-800">
            {secondDayDone
              ? t("Zwei Lerntage sind geschafft. Jetzt darf der Rhythmus ganz entspannt wachsen.", "Deux jours d’apprentissage sont terminés. Le rythme peut maintenant grandir tranquillement.", "Due giorni di apprendimento sono completati. Ora il ritmo può crescere con calma.", "Two learning days are complete. The routine can now grow gently.")
              : t("Drei kleine Schritte helfen, aus dem ersten Versuch eine gute Lernroutine zu machen.", "Trois petites étapes transforment le premier essai en bonne routine.", "Tre piccoli passi trasformano il primo tentativo in una buona routine.", "Three small steps turn the first try into a helpful routine.")}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {steps.map(item => (
          <div key={item.label} className="flex items-center gap-2 text-sm">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-bold ${item.done ? "bg-green-600 text-white" : "border-2 border-green-200 bg-white text-green-400"}`} aria-hidden="true">
              {item.done ? "✓" : ""}
            </span>
            <span className={item.done ? "font-semibold text-green-900" : "text-gray-600"}>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        {secondDayDone ? (
          <button type="button" onClick={() => { dismissFirstWeekActivation(childId); setState(null); }}
            className="min-h-11 w-full rounded-xl border-2 border-green-600 px-4 py-2 text-sm font-bold text-green-800">
            {t("Start abschliessen", "Terminer le départ", "Completa l’avvio", "Finish setup")}
          </button>
        ) : (
          <Link href={ctaHref} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-green-700 px-4 py-2 text-center text-sm font-bold text-white">
            {missionDone
              ? t("Nächste Mission starten", "Commencer la prochaine mission", "Inizia la prossima missione", "Start next mission")
              : t("Erste Mission starten", "Commencer la première mission", "Inizia la prima missione", "Start first mission")}
          </Link>
        )}
      </div>
    </section>
  );
}
