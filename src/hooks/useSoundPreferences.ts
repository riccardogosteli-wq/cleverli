"use client";
import { useSyncExternalStore } from "react";
import { readSoundPreferences, setSoundPreference, SOUND_PREFERENCES_EVENT } from "@/lib/soundPreferences";
function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(SOUND_PREFERENCES_EVENT, notify);
  return () => { window.removeEventListener("storage", notify); window.removeEventListener(SOUND_PREFERENCES_EVENT, notify); };
}
function snapshot() { const p = readSoundPreferences(); return (p.effects ? 1 : 0) | (p.autoRead ? 2 : 0); }
export function useSoundPreferences() {
  const value = useSyncExternalStore(subscribe, snapshot, () => 0);
  return { effects: Boolean(value & 1), autoRead: Boolean(value & 2), setPreference: setSoundPreference };
}
