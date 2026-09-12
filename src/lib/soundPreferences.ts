/** Device preferences, intentionally independent of account/child progress. */
export const SOUND_PREFERENCES_KEY = "cleverli_sound_preferences";
export const SOUND_PREFERENCES_EVENT = "cleverli-sound-preferences-change";
export type SoundPreferences = { effects: boolean; autoRead: boolean };
export const DEFAULT_SOUND_PREFERENCES: SoundPreferences = { effects: false, autoRead: false };
let fallback: SoundPreferences = DEFAULT_SOUND_PREFERENCES;
export function parseSoundPreferences(raw: string | null): SoundPreferences {
  try {
    const value = JSON.parse(raw ?? "null");
    return { effects: value?.effects === true, autoRead: value?.autoRead === true };
  } catch { return DEFAULT_SOUND_PREFERENCES; }
}
export function readSoundPreferences(): SoundPreferences {
  if (typeof window === "undefined") return DEFAULT_SOUND_PREFERENCES;
  try { return parseSoundPreferences(window.localStorage.getItem(SOUND_PREFERENCES_KEY)); }
  catch { return fallback; }
}
export function setSoundPreference(key: keyof SoundPreferences, value: boolean) {
  const next = { ...readSoundPreferences(), [key]: value };
  fallback = next;
  try { window.localStorage.setItem(SOUND_PREFERENCES_KEY, JSON.stringify(next)); } catch { /* Session-only when storage is denied. */ }
  window.dispatchEvent(new Event(SOUND_PREFERENCES_EVENT));
}
export const SOUND_COPY = {
  de: { title: "Ton & Vorlesen", effects: "Soundeffekte", autoRead: "Automatisch vorlesen", note: "Gilt auf diesem Gerät. Manuelles Vorlesen und Hörtexte bleiben immer verfügbar.", on: "Ein", off: "Aus" },
  fr: { title: "Son et lecture", effects: "Effets sonores", autoRead: "Lecture automatique", note: "Sur cet appareil. La lecture manuelle et les textes audio restent toujours disponibles.", on: "Activé", off: "Désactivé" },
  it: { title: "Suoni e lettura", effects: "Effetti sonori", autoRead: "Lettura automatica", note: "Su questo dispositivo. La lettura manuale e i testi audio restano sempre disponibili.", on: "Attivo", off: "Disattivato" },
  en: { title: "Sound and reading", effects: "Sound effects", autoRead: "Read aloud automatically", note: "On this device. Manual reading and listening audio are always available.", on: "On", off: "Off" },
};
