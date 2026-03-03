"use client";
import { useCallback, useRef } from "react";

/**
 * useVoice — ElevenLabs TTS (Jessica voice) with Web Speech fallback.
 *
 * Primary: calls /api/tts?text=... → ElevenLabs eleven_multilingual_v2
 *   - Same warm character voice in DE/FR/IT/EN
 *   - 7-day CDN cache (no repeated API calls for same text)
 *
 * Fallback: Web Speech API (device voice, used if API fails or key missing)
 */

// ─── In-memory audio cache (URL → decoded AudioBuffer or "pending") ──────────
const audioCache = new Map<string, AudioBuffer | "loading">();

function cleanForSpeech(text: string): string {
  return text
    .replace(/(\d)\s*[×x]\s*(\d)/g, "$1 mal $2")
    .replace(/(\d)\s*÷\s*(\d)/g, "$1 durch $2")
    .replace(/(\d)\s*:\s*(\d)/g, "$1 durch $2")
    .replace(/(\d)\s*\+\s*(\d)/g, "$1 plus $2")
    .replace(/(\d)\s*[−-]\s*(\d)/g, "$1 minus $2")
    .replace(/=\s*\?/g, "gleich wie viel?")
    .replace(/(?<!\w)<(?!\w)/g, "kleiner als")
    .replace(/(?<!\w)>(?!\w)/g, "grösser als")
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\u{2B00}-\u{2BFF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    .replace(/___/g, "")
    .replace(/«([^»]+)»/g, "$1")
    .replace(/[#*_~`→←↑↓✓✗✅❌]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function useVoice() {
  const ctxRef  = useRef<AudioContext | null>(null);
  const srcRef  = useRef<AudioBufferSourceNode | null>(null);

  const getCtx = () => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return ctxRef.current;
  };

  const stop = useCallback(() => {
    srcRef.current?.stop();
    srcRef.current = null;
    if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  }, []);

  const speakWebSpeech = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "de-DE";
    utt.rate = 0.85;
    utt.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("de") && /anna|hedda|female/i.test(v.name))
              ?? voices.find(v => v.lang.startsWith("de"));
    if (pref) utt.voice = pref;
    window.speechSynthesis.speak(utt);
  }, []);

  const speak = useCallback(async (text: string) => {
    const clean = cleanForSpeech(text);
    if (!clean) return;
    stop();

    const key = clean.slice(0, 300); // cache key

    // ── Try ElevenLabs via /api/tts ──────────────────────────────────────────
    try {
      const ctx = getCtx();

      // Resume AudioContext if suspended (mobile requires user gesture first)
      if (ctx.state === "suspended") await ctx.resume();

      let buffer = audioCache.get(key);

      if (!buffer || buffer === "loading") {
        if (buffer !== "loading") {
          audioCache.set(key, "loading");
          const url = `/api/tts?text=${encodeURIComponent(clean)}`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`TTS HTTP ${res.status}`);
          const ab = await res.arrayBuffer();
          buffer = await ctx.decodeAudioData(ab);
          audioCache.set(key, buffer);
        } else {
          // Already loading from another call — fall back to Web Speech
          speakWebSpeech(clean);
          return;
        }
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer as AudioBuffer;
      src.connect(ctx.destination);
      srcRef.current = src;
      src.start(0);
    } catch (err) {
      console.warn("[useVoice] ElevenLabs failed, falling back to Web Speech:", err);
      speakWebSpeech(clean);
    }
  }, [stop, speakWebSpeech]);

  const isSupported = typeof window !== "undefined" &&
    ("speechSynthesis" in window || "AudioContext" in window);

  return { speak, stop, isSupported };
}

// ─── Cleverli personality phrases ────────────────────────────────────────────

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
