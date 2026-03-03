"use client";
import { useCallback, useRef } from "react";

/**
 * useSound — Web Audio API sound effects for Cleverli
 *
 * All sounds generated programmatically via OscillatorNode.
 * No files, no licensing, works offline, ~0kb overhead.
 */

type SoundType = "correct" | "wrong" | "streak" | "complete" | "hint" | "levelup" | "achievement" | "combo" | "perfect" | "chest";

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  /** Play a sequence of notes: [{freq, duration, delay}] */
  const playNotes = useCallback((
    notes: { freq: number; dur: number; delay: number; type?: OscillatorType }[],
    masterGain = 0.18
  ) => {
    const ctx = getCtx();
    if (!ctx) return;

    const master = ctx.createGain();
    master.gain.setValueAtTime(masterGain, ctx.currentTime);
    master.connect(ctx.destination);

    for (const { freq, dur, delay, type = "sine" } of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      // Envelope: quick attack, smooth decay
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(1, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);

      osc.connect(gain);
      gain.connect(master);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur + 0.05);
    }
  }, [getCtx]);

  const play = useCallback((sound: SoundType) => {
    switch (sound) {
      // ✅ Correct — bright ascending chime (C5-E5-G5)
      case "correct":
        playNotes([
          { freq: 523, dur: 0.15, delay: 0 },
          { freq: 659, dur: 0.15, delay: 0.1 },
          { freq: 784, dur: 0.25, delay: 0.2 },
        ]);
        break;

      // ❌ Wrong — soft descending (low, not discouraging)
      case "wrong":
        playNotes([
          { freq: 392, dur: 0.15, delay: 0, type: "triangle" },
          { freq: 330, dur: 0.25, delay: 0.12, type: "triangle" },
        ], 0.12);
        break;

      // 🔥 Streak — faster excited run (C5-D5-E5-G5-C6)
      case "streak":
        playNotes([
          { freq: 523, dur: 0.10, delay: 0 },
          { freq: 587, dur: 0.10, delay: 0.08 },
          { freq: 659, dur: 0.10, delay: 0.16 },
          { freq: 784, dur: 0.10, delay: 0.24 },
          { freq: 1047, dur: 0.30, delay: 0.32 },
        ], 0.15);
        break;

      // 🏆 Topic complete — mini fanfare (C5-E5-G5-C6 + chord)
      case "complete":
        playNotes([
          { freq: 523, dur: 0.15, delay: 0 },
          { freq: 659, dur: 0.15, delay: 0.12 },
          { freq: 784, dur: 0.15, delay: 0.24 },
          { freq: 1047, dur: 0.50, delay: 0.36 },
          { freq: 784,  dur: 0.50, delay: 0.36 },
          { freq: 659,  dur: 0.50, delay: 0.36 },
        ], 0.14);
        break;

      // 💡 Hint — gentle soft ping
      case "hint":
        playNotes([
          { freq: 880, dur: 0.20, delay: 0, type: "triangle" },
        ], 0.10);
        break;

      // 🆙 Level up — C5 E5 G5 C6 E6
      case "levelup":
        playNotes([
          { freq: 523, dur: 0.15, delay: 0 },
          { freq: 659, dur: 0.15, delay: 0.1 },
          { freq: 784, dur: 0.15, delay: 0.2 },
          { freq: 1047, dur: 0.15, delay: 0.3 },
          { freq: 1319, dur: 0.15, delay: 0.4 },
        ], 0.18);
        break;

      // 🏆 Achievement — rapid arpeggio G5 C6 E6 G6 E6 C6
      case "achievement":
        playNotes([
          { freq: 784, dur: 0.08, delay: 0 },
          { freq: 1047, dur: 0.08, delay: 0.07 },
          { freq: 1319, dur: 0.08, delay: 0.14 },
          { freq: 1568, dur: 0.08, delay: 0.21 },
          { freq: 1319, dur: 0.08, delay: 0.28 },
          { freq: 1047, dur: 0.08, delay: 0.35 },
        ], 0.14);
        break;

      // 🔥 Combo — D5 F#5 A5
      case "combo":
        playNotes([
          { freq: 587, dur: 0.10, delay: 0, type: "square" },
          { freq: 740, dur: 0.10, delay: 0.07, type: "square" },
          { freq: 880, dur: 0.10, delay: 0.14, type: "square" },
        ], 0.16);
        break;

      // 🌟 Perfect — C5 E5 G5 C6 chord then E6
      case "perfect":
        playNotes([
          { freq: 523, dur: 0.5, delay: 0 },
          { freq: 659, dur: 0.5, delay: 0 },
          { freq: 784, dur: 0.5, delay: 0 },
          { freq: 1047, dur: 0.5, delay: 0 },
          { freq: 1319, dur: 0.4, delay: 0.5 },
        ], 0.16);
        break;

      // 🎁 Chest — B2 then E6 C6 G5
      case "chest":
        playNotes([
          { freq: 123, dur: 0.3, delay: 0, type: "triangle" },
          { freq: 1319, dur: 0.2, delay: 0.28 },
          { freq: 1047, dur: 0.2, delay: 0.33 },
          { freq: 784, dur: 0.2, delay: 0.38 },
        ], 0.2);
        break;
    }
  }, [playNotes]);

  return { play };
}
