import Link from "next/link";
import { getLevelForXp, getNextLevel, getLevelProgress, getLevelTitle, getRankTrack, LEGEND_STEP } from "@/lib/xp";

const COPY = {
  de: { heading: "Deine Ränge", current: "Dein aktueller Rang", next: "Dein nächstes Ziel", left: "Noch", to: "bis", all: "Alle Ränge ansehen", earned: "Erreicht", locked: "Noch vor dir", active: "Aktuell", keep: "Deine erreichten Ränge bleiben dir erhalten.", more: "Danach erreichst du alle", again: "XP eine neue Legendenstufe. Dein Lernweg geht weiter.", play: "Weiterlernen" },
  fr: { heading: "Tes rangs", current: "Ton rang actuel", next: "Ton prochain objectif", left: "Encore", to: "pour atteindre", all: "Voir tous les rangs", earned: "Acquis", locked: "À découvrir", active: "Actuel", keep: "Tu conserves tous les rangs déjà acquis.", more: "Ensuite, tous les", again: "XP, tu atteins un nouveau niveau de légende. Ton parcours continue.", play: "Continuer à apprendre" },
  it: { heading: "I tuoi ranghi", current: "Il tuo rango attuale", next: "Il tuo prossimo obiettivo", left: "Ancora", to: "per raggiungere", all: "Vedi tutti i ranghi", earned: "Ottenuto", locked: "Da scoprire", active: "Attuale", keep: "Conservi tutti i ranghi già raggiunti.", more: "Poi, ogni", again: "XP raggiungi un nuovo livello di leggenda. Il tuo percorso continua.", play: "Continua a imparare" },
  en: { heading: "Your ranks", current: "Your current rank", next: "Your next goal", left: "Just", to: "to reach", all: "See all ranks", earned: "Earned", locked: "Ahead of you", active: "Current", keep: "You keep every rank you have already earned.", more: "After that, every", again: "XP brings a new legend stage. Your learning journey continues.", play: "Keep learning" },
};

export default function RankProgress({ xp, lang }: { xp: number; lang: string }) {
  const copy = COPY[lang as keyof typeof COPY] ?? COPY.de;
  const current = getLevelForXp(xp), next = getNextLevel(xp);
  const locale = lang === "de" ? "de-CH" : lang === "fr" ? "fr-CH" : lang === "it" ? "it-CH" : "en-GB";
  const format = (n: number) => n.toLocaleString(locale);
  const progress = getLevelProgress(xp);
  return <section data-rank-progress data-rank-id={current.id} data-rank-next={next.minXp} className="mt-4 rounded-2xl border-2 border-purple-200 bg-purple-50 p-4 space-y-4" aria-label={copy.heading}>
    <h2 className="font-black text-purple-900">🏆 {copy.heading}</h2>
    <div className="flex items-center gap-3">
      <span className="text-4xl shrink-0" aria-hidden="true">{current.emoji}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-purple-700">{copy.current}</p>
        <p data-rank-title className="font-black text-lg text-gray-900 break-words">{getLevelTitle(current, lang)}</p>
        <p className="text-sm text-gray-600">{format(xp)} XP</p>
      </div>
    </div>
    <div className="rounded-xl bg-white border border-purple-200 p-3 space-y-2">
      <p className="text-xs font-bold text-purple-700">{copy.next}</p>
      <p className="font-bold text-gray-900 break-words"><span aria-hidden="true">{next.emoji} </span>{getLevelTitle(next, lang)}</p>
      <progress aria-label={copy.next} aria-valuetext={format(xp - current.minXp) + " / " + format(next.minXp - current.minXp) + " XP"} value={progress} max={100} className="w-full h-3 accent-purple-600" />
      <p data-rank-remaining className="text-sm font-semibold text-purple-900">{copy.left} {format(next.minXp - xp)} XP {copy.to} {format(next.minXp)} XP</p>
      <Link href="/dashboard" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-800">{copy.play} →</Link>
    </div>
    <details className="rounded-xl border border-purple-200 bg-white px-3">
      <summary className="min-h-11 cursor-pointer py-3 text-sm font-bold text-purple-900 focus-visible:outline-2 focus-visible:outline-purple-600">{copy.all}</summary>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-3">
        {getRankTrack(xp).map(rank => {
          const earned = xp >= rank.minXp, active = rank.id === current.id;
          return <li key={rank.id} data-rank-card={rank.id} aria-current={active ? "step" : undefined} className={"min-w-0 rounded-xl border-2 p-2 " + (active ? "border-purple-500 bg-purple-50" : earned ? "border-green-200" : "border-gray-200 text-gray-500")}>
            <span className="text-2xl" aria-hidden="true">{earned ? rank.emoji : "🔒"}</span>
            <p className="text-sm font-bold break-words">{getLevelTitle(rank, lang)}</p>
            <p className="text-xs">{active ? copy.active : earned ? copy.earned : copy.locked} · {format(rank.minXp)} XP</p>
          </li>;
        })}
      </ul>
      <p className="pb-3 text-xs text-gray-600">{copy.keep} {copy.more} {format(LEGEND_STEP)} {copy.again}</p>
    </details>
  </section>;
}
