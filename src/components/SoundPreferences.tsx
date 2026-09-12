"use client";
import { useId, useRef, useState } from "react";
import { useLang } from "@/lib/LangContext";
import { SOUND_COPY } from "@/lib/soundPreferences";
import { useSoundPreferences } from "@/hooks/useSoundPreferences";

function SoundOptions() {
  const { lang } = useLang();
  const prefs = useSoundPreferences();
  const c = SOUND_COPY[lang];
  return <div className="space-y-2 pt-2">
    {(["effects", "autoRead"] as const).map(key => <button key={key} type="button" role="switch" aria-checked={prefs[key]} aria-label={c[key]} onClick={() => prefs.setPreference(key, !prefs[key])} className="w-full min-h-12 flex items-center justify-between gap-3 rounded-xl border border-gray-200 px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
      <span>{c[key]}</span><span className={`shrink-0 rounded-full px-3 py-1 font-semibold ${prefs[key] ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}>{prefs[key] ? c.on : c.off}</span>
    </button>)}
    <p className="text-xs text-gray-500">{c.note}</p>
  </div>;
}

/** One exercise entry point; native modal supplies focus containment and Escape. */
export function ExerciseSoundSettings() {
  const { lang } = useLang();
  const c = SOUND_COPY[lang];
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => dialog.current?.close();
  return <>
    <button ref={trigger} type="button" aria-haspopup="dialog" aria-controls={id} aria-expanded={open} data-testid="exercise-sound-settings-trigger" onClick={() => {
      dialog.current?.showModal();
      setOpen(true);
      dialog.current?.querySelector<HTMLButtonElement>('[role="switch"]')?.focus();
    }} className="shrink-0 min-h-11 rounded-full border border-gray-300 bg-white px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">
      <span aria-hidden="true">⚙️ </span>{c.button}
    </button>
    <dialog ref={dialog} id={id} aria-labelledby={`${id}-title`} data-testid="sound-preferences" onClose={() => {
      setOpen(false);
      trigger.current?.focus({ preventScroll: true });
    }} onKeyDown={event => {
      if (event.key !== "Tab") return;
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
      if (!buttons.length) return;
      event.preventDefault();
      const index = Array.from(buttons).indexOf(document.activeElement as HTMLButtonElement);
      const next = index < 0 ? (event.shiftKey ? buttons.length - 1 : 0)
        : (index + (event.shiftKey ? -1 : 1) + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const r = event.currentTarget.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close();
    }} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-800 shadow-xl backdrop:bg-black/35">
      <div className="flex items-center justify-between gap-3">
        <h2 id={`${id}-title`} className="font-bold text-base">{c.title}</h2>
        <button type="button" onClick={close} aria-label={c.close} className="min-h-11 min-w-11 rounded-full text-xl hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-green-600">×</button>
      </div>
      <SoundOptions />
    </dialog>
  </>;
}

/** Parent settings remain available in the parent area, not duplicated in exercises. */
export default function SoundPreferences() {
  const { lang } = useLang();
  return <details className="rounded-2xl border border-gray-200 bg-white p-3 text-sm" data-testid="sound-preferences">
    <summary className="min-h-11 cursor-pointer py-3 font-semibold text-gray-700">{SOUND_COPY[lang].title}</summary>
    <SoundOptions />
  </details>;
}
