"use client";
import { useEffect, useRef, useCallback } from "react";

/**
 * useVoice — Web Speech API wrapper for Cleverli
 *
 * Reads text aloud using the device's built-in TTS engine.
 * - iOS: Siri engine (excellent German quality)
 * - Android Chrome: Google TTS (very good)
 * - Desktop Chrome/Firefox: system voices
 *
 * No API key, no cost, no licensing concerns.
 * Future: swap speak() to play a pre-generated ElevenLabs MP3 per exercise ID.
 */

interface UseVoiceOptions {
  lang?: string;   // BCP-47 language tag, default "de-DE"
  rate?: number;   // 0.1–10, default 0.85 (slightly slower for kids)
  pitch?: number;  // 0–2, default 1.1 (slightly warmer)
  volume?: number; // 0–1, default 1
}

export function useVoice(options: UseVoiceOptions = {}) {
  const { lang = "de-DE", rate = 0.85, pitch = 1.1, volume = 1 } = options;
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Cancel on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    // Strip markdown-style formatting, emoji at start, and fill-in-blank markers
    const clean = text
      .replace(/___/g, "")           // fill-in-blank blanks
      .replace(/\(schreibe[^)]+\)/g, "") // parenthetical instructions
      .trim();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Prefer a female German voice if available (warmer for kids)
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith("de") && (v.name.includes("Anna") || v.name.includes("Hedda") || v.name.includes("Female"))
    ) ?? voices.find(v => v.lang.startsWith("de"));
    if (preferred) utterance.voice = preferred;

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [lang, rate, pitch, volume]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }
  }, []);

  const isSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  return { speak, stop, isSupported };
}

// ─── Cleverli personality phrases ───────────────────────────────────────────
// Varied so kids don't hear the same thing every time

type PhraseKey = "correct" | "wrong" | "streak" | "complete" | "hint";

const PHRASES: Record<PhraseKey, string[]> = {
  correct: [
    "Super gemacht!",
    "Toll! Weiter so!",
    "Richtig! Du bist klasse!",
    "Ja! Das stimmt!",
    "Wunderbar! Du lernst so schnell!",
    "Perfekt! Ich bin stolz auf dich!",
  ],
  wrong: [
    "Fast! Du schaffst das!",
    "Nicht ganz, aber probier nochmal.",
    "Mmh, schau dir den Tipp an!",
    "Das war knapp! Weiter versuchen.",
    "Kopf hoch! Beim nächsten klappt's.",
  ],
  streak: [
    "Wow, drei richtig hintereinander!",
    "Du bist auf Feuer! Fantastisch!",
    "Unglaublich! Du läufst heute zur Hochform auf!",
    "Drei in Folge! Du bist ein Mathegenie!",
  ],
  complete: [
    "Fantastisch! Du hast alle Aufgaben gelöst!",
    "Bravo! Das Thema hast du im Griff!",
    "Wow, du hast das Thema gemeistert! Ich bin beeindruckt!",
    "Alle Aufgaben geschafft! Du bist ein Superstar!",
  ],
  hint: [
    "Ich gebe dir einen kleinen Tipp!",
    "Hier ist ein Hinweis für dich.",
    "Schau mal hier — das hilft bestimmt!",
  ],
};

export function getPhrase(key: PhraseKey): string {
  const list = PHRASES[key];
  return list[Math.floor(Math.random() * list.length)];
}
