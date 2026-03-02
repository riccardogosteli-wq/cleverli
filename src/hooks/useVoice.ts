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

    // ── Clean text for speech ────────────────────────────────────────
    const clean = text
      // ── Math operator substitutions (before emoji removal) ──
      .replace(/(\d)\s*[×x]\s*(\d)/g, "$1 mal $2")       // 8 × 9 / 8x9 → 8 mal 9
      .replace(/(\d)\s*÷\s*(\d)/g, "$1 durch $2")        // 8 ÷ 2 → 8 durch 2
      .replace(/(\d)\s*:\s*(\d)/g, "$1 durch $2")        // 8 : 2 → 8 durch 2
      .replace(/(\d)\s*\+\s*(\d)/g, "$1 plus $2")        // 3 + 4 → 3 plus 4
      .replace(/(\d)\s*−\s*(\d)/g, "$1 minus $2")        // 8 − 3 → 8 minus 3 (minus sign U+2212)
      .replace(/(\d)\s*-\s*(\d)/g, "$1 minus $2")        // 8 - 3 → 8 minus 3 (hyphen-minus)
      .replace(/(\d)\s*=\s*(\?|___)/g, "$1 gleich")      // 3 + 4 = ? → 3 plus 4 gleich
      .replace(/=\s*\?/g, "gleich wie viel?")             // = ? → gleich wie viel?
      .replace(/(\d)\s*%/g, "$1 Prozent")                 // 50% → 50 Prozent
      .replace(/(\d)\s*°/g, "$1 Grad")                    // 90° → 90 Grad
      .replace(/<\s*=/g, "kleiner oder gleich")           // <= → kleiner oder gleich
      .replace(/>\s*=/g, "grösser oder gleich")           // >= → grösser oder gleich
      .replace(/(?<!\w)<(?!\w)/g, "kleiner als")          // < → kleiner als
      .replace(/(?<!\w)>(?!\w)/g, "grösser als")          // > → grösser als
      // ── Remove all emoji ──
      .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA9F}\u{1FAA0}-\u{1FAFF}]/gu, "")
      .replace(/[\u{231A}-\u{231B}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2614}-\u{2615}\u{2648}-\u{2653}\u{267F}\u{2693}\u{26A1}\u{26AA}-\u{26AB}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}-\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}]/gu, "")
      // ── Fill-in / formatting ──
      .replace(/___/g, "")                       // blank markers
      .replace(/«([^»]+)»/g, "$1")               // «Bär» → Bär
      .replace(/\([^)]{0,40}\)/g, "")            // (laufen), (Nomen/Verb)
      .replace(/\.{2,}/g, "")                    // ... or ..
      .replace(/→|←|↑|↓/g, "")                  // arrows
      .replace(/✓|✗|✅|❌/g, "")                 // check/cross marks
      .replace(/[#*_~`]/g, "")                   // markdown remnants
      .replace(/\s{2,}/g, " ")
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
