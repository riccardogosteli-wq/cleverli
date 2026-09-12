"use client";
import { useLang } from "@/lib/LangContext";
import { SOUND_COPY } from "@/lib/soundPreferences";
import { useSoundPreferences } from "@/hooks/useSoundPreferences";
export function EffectsToggle() {
  const { lang } = useLang();
  const { effects, setPreference } = useSoundPreferences();
  const c = SOUND_COPY[lang];
  return <button type="button" role="switch" aria-checked={effects} aria-label={c.effects} title={`${c.effects}: ${effects ? c.on : c.off}`} onClick={() => setPreference("effects", !effects)} className={`shrink-0 w-11 h-11 rounded-full border-2 ${effects ? "border-green-600 bg-green-50" : "border-gray-300 bg-gray-50"}`}><span aria-hidden="true">{effects ? "🔊" : "🔇"}</span></button>;
}
export default function SoundPreferences() {
  const { lang } = useLang();
  const prefs = useSoundPreferences();
  const c = SOUND_COPY[lang];
  return <details className="rounded-2xl border border-gray-200 bg-white p-3 text-sm" data-testid="sound-preferences">
    <summary className="min-h-11 cursor-pointer py-3 font-semibold text-gray-700">{c.title}</summary>
    <div className="space-y-2 pt-2">
      {(["effects", "autoRead"] as const).map(key => <button key={key} type="button" role="switch" aria-checked={prefs[key]} aria-label={c[key]} onClick={() => prefs.setPreference(key, !prefs[key])} className="w-full min-h-12 flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-2 text-left">
        <span>{c[key]}</span><span className={`shrink-0 rounded-full px-3 py-1 font-semibold ${prefs[key] ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{prefs[key] ? c.on : c.off}</span>
      </button>)}
      <p className="text-xs text-gray-500">{c.note}</p>
    </div>
  </details>;
}
