"use client";
import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { useSoundPreferences } from "./useSoundPreferences";
import { useVoice, stopAutomaticVoice } from "./useVoice";
/** Only automatic playback is cancelled by preference changes; manual listening remains independent. */
export function useAutomaticReading(text: string, language: Lang, verbatim: boolean, active: boolean, identity: string) {
  const { autoRead } = useSoundPreferences();
  const { speak } = useVoice();
  useEffect(() => {
    if (!autoRead || !active || !text) return;
    const timer = window.setTimeout(() => { void speak(text, language, verbatim, true); }, 200);
    return () => { clearTimeout(timer); stopAutomaticVoice(); };
  }, [autoRead, active, text, language, verbatim, identity, speak]);
}
