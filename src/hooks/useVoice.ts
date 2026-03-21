"use client";
import { useCallback, useRef } from "react";

/**
 * useVoice — ElevenLabs TTS (Charlie Chatlin — conversational German) with Web Speech fallback.
 *
 * Primary: calls /api/tts?text=... → ElevenLabs eleven_multilingual_v2 + Charlie Chatlin voice
 *   - Real, casual, conversational German voice (vmVmHDKBkkCgbLVIOJRb)
 *   - Same voice used for reading questions in exercises
 *   - 7-day CDN cache (no repeated API calls for same text)
 *
 * Fallback: Web Speech API (device voice, used if API fails or key missing)
 */

// ─── In-memory audio cache (URL → decoded AudioBuffer or "pending") ──────────
const audioCache = new Map<string, AudioBuffer | "loading">();

// ─── Number words (German) ───────────────────────────────────────────────────
function numToWordsDE(n: number): string {
  const ones = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben",
                "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn",
                "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn"];
  const tens = ["", "", "zwanzig", "dreissig", "vierzig", "fünfzig",
                "sechzig", "siebzig", "achtzig", "neunzig"];
  if (n === 0) return "null";
  if (n < 0) return "minus " + numToWordsDE(-n);
  if (n < 20) return ones[n];
  if (n < 100) {
    const t = Math.floor(n / 10), o = n % 10;
    return o === 0 ? tens[t] : `${ones[o]}und${tens[t]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100), rest = n % 100;
    const hWord = h === 1 ? "hundert" : `${numToWordsDE(h)}hundert`;
    return rest === 0 ? hWord : `${hWord}${numToWordsDE(rest)}`;
  }
  if (n === 1000) return "tausend";
  return String(n); // fallback for very large numbers
}

// ─── Measurement units word map ──────────────────────────────────────────────
const UNIT_WORDS: Record<string, string> = {
  mm: "Millimeter", cm: "Zentimeter", dm: "Dezimeter", km: "Kilometer", m: "Meter",
  mg: "Milligramm", g: "Gramm", kg: "Kilogramm",
  ml: "Milliliter", cl: "Zentiliter", dl: "Deziliter", l: "Liter",
};

// ─── Decimal measurements: "1.5 m" → "eineinhalb Meter" ──────────────────────
// Natural German: 0.5→"ein halb", 1.5→"eineinhalb", 2.5→"zweieinhalb", etc.
// Other decimals: expand unit only, let ElevenLabs handle the number.
function decimalMeasureToSpeech(numStr: string, unit: string): string {
  const num  = parseFloat(numStr.replace(",", "."));
  const word = UNIT_WORDS[unit] ?? unit;
  if (isNaN(num)) return `${numStr} ${word}`;
  const whole = Math.floor(num);
  const frac  = Math.round((num - whole) * 100);
  if (frac === 0)  return `${numToWordsDE(whole)} ${word}`;
  if (frac === 50) return whole === 0 ? `ein halb ${word}` : `${numToWordsDE(whole)}einhalb ${word}`;
  if (frac === 25) return whole === 0 ? `ein Viertel ${word}` : `${numToWordsDE(whole)} und ein Viertel ${word}`;
  if (frac === 75) return whole === 0 ? `drei Viertel ${word}` : `${numToWordsDE(whole)} und drei Viertel ${word}`;
  return `${numStr} ${word}`; // e.g. "1.2 Meter" — ElevenLabs handles the rest
}

// ─── Swiss currency: "1.50" → "ein Franken fünfzig" ─────────────────────────
function chfToSpeech(amountStr: string): string {
  const num = parseFloat(amountStr.replace(",", "."));
  if (isNaN(num)) return `${amountStr} Franken`;
  const franken = Math.floor(num);
  const rappen = Math.round((num - franken) * 100);
  if (franken === 0) return `${numToWordsDE(rappen)} Rappen`;
  if (rappen === 0) return `${numToWordsDE(franken)} Franken`;
  return `${numToWordsDE(franken)} Franken ${numToWordsDE(rappen)}`;
}

// ─── Fractions: "1/2" → "ein halb", "3/4" → "drei Viertel" ─────────────────
function fractionToSpeech(num: string, den: string): string {
  const n = parseInt(num), d = parseInt(den);
  const denWords: Record<number, string> = {
    2: "halb", 3: "Drittel", 4: "Viertel", 5: "Fünftel",
    6: "Sechstel", 7: "Siebtel", 8: "Achtel", 10: "Zehntel",
  };
  const denWord = denWords[d] ?? `${numToWordsDE(d)}tel`;
  if (n === 1 && d === 2) return "ein halb";
  if (n === 1) return `ein ${denWord}`;
  return `${numToWordsDE(n)} ${denWord}`;
}

// ─── Time: "3:15 Uhr" → "drei Uhr fünfzehn" ────────────────────────────────
// Uses formal digit reading (not colloquial "Viertel nach") so exercises
// teaching "halb/Viertel" don't have their answers given away by the voice.
function timeToSpeech(h: string, m: string): string {
  const hours = parseInt(h), mins = parseInt(m);
  const hWord = numToWordsDE(hours);
  if (mins === 0) return `${hWord} Uhr`;
  return `${hWord} Uhr ${numToWordsDE(mins)}`;
}

// ─── Ordinals: "2." before a noun → "zweite" ────────────────────────────────
const ORDINALS: Record<number, string> = {
  1: "erste", 2: "zweite", 3: "dritte", 4: "vierte", 5: "fünfte",
  6: "sechste", 7: "siebte", 8: "achte", 9: "neunte", 10: "zehnte",
  11: "elfte", 12: "zwölfte", 13: "dreizehnte", 14: "vierzehnte",
  15: "fünfzehnte", 20: "zwanzigste", 21: "einundzwanzigste",
};
function ordinalToSpeech(n: number): string {
  if (ORDINALS[n]) return ORDINALS[n];
  if (n < 20) return `${numToWordsDE(n)}te`;
  return `${numToWordsDE(n)}ste`;
}

function cleanForSpeech(text: string): string {
  return text
    // ── 0a. Leading blank patterns ──────────────────────────────────────────
    // Math: "___ + 3 = 8" → "Welche Zahl plus 3 ist gleich 8" (Swiss teacher convention)
    .replace(/^___\s*\+\s*/g, "Welche Zahl plus ")
    .replace(/^___\s*[\-\u2212]\s*/g, "Welche Zahl minus ")
    .replace(/^___\s*[\u00d7x\*]\s*/g, "Welche Zahl mal ")
    .replace(/^___\s*[\u00f7:]\s*/g, "Welche Zahl durch ")
    // Article fill-in: "___ Hund bellt" → "Welcher Artikel? Hund bellt"
    .replace(/^___\s+(der|die|das|ein|eine|einen|einem|einer|des|dem|den)\b/gi, "Welcher Artikel? $1")
    // Genitiv/inflected noun: "___ Kindes..." → "Welches Wort fehlt? Kindes..."
    .replace(/^___\s+([A-ZÄÖÜ][a-zäöüß]+(?:es|en|em|er)\b)/,
      (_: string, next: string) => `Welches Wort fehlt? ${next}`)
    // Any other leading blank before a noun
    .replace(/^___\s+([A-ZÄÖÜ][a-zäöüß]+)/g, "Welcher Artikel? $1")
    // ── 0. Special symbols & abbreviations ──
    .replace(/CO₂/g, "Kohlendioxid")
    .replace(/O₂/g, "Sauerstoff")
    .replace(/H₂O/g, "Wasser")
    .replace(/\bca\.\s*/g, "circa ")
    // ── 0b. Fractions: "1/2" → "ein halb", "3/4" → "drei Viertel" ──
    .replace(/\b(\d+)\/(\d+)\b/g, (_: string, n: string, d: string) => fractionToSpeech(n, d))
    // ── 0c. Time: "3:15 Uhr" → "drei Uhr fünfzehn" (trailing Uhr consumed by match) ──
    .replace(/\b(\d{1,2}):(\d{2})\s*Uhr\b/g, (_: string, h: string, m: string) => timeToSpeech(h, m))
    .replace(/\b(\d{1,2}):(\d{2})\b/g, (_: string, h: string, m: string) => timeToSpeech(h, m))
    // ── 0d. Temperature: "37°C" → "siebenunddreissig Grad Celsius", "0°" → "null Grad" ──
    .replace(/(\d+)\s*°C\b/g, (_: string, n: string) => `${numToWordsDE(parseInt(n))} Grad Celsius`)
    .replace(/(\d+)\s*°\b/g, (_: string, n: string) => `${numToWordsDE(parseInt(n))} Grad`)
    // ── 0e. Percentage: "60%" → "sechzig Prozent" ──
    .replace(/(\d+)\s*%/g, (_: string, n: string) => `${numToWordsDE(parseInt(n))} Prozent`)
    // ── 0f. Ordinals before nouns: "2. Platz" → "zweite Platz" ──
    .replace(/\b(\d+)\.\s+(Platz|Monat|Stelle|Tag|Buchstabe|Woche|Klasse|Mal|Jahr|Runde|Zeile)\b/g,
      (_: string, n: string, noun: string) => `${ordinalToSpeech(parseInt(n))} ${noun}`)
    // ── 1. Currency — number+unit first, then standalone ──
    .replace(/CHF\s*([\d.,]+)/g, "$1 Franken")
    .replace(/([\d.,]+)\s*CHF/g, "$1 Franken")
    .replace(/([\d.,]+)\s*Fr\.(?!\w)/g, "$1 Franken")  // "3 Fr." not "Franken"
    .replace(/([\d.,]+)\s*Rp\.?/g, "$1 Rappen")
    .replace(/\bCHF\b/g, "Franken")    // standalone (e.g. before ___)
    .replace(/\bFr\.(?!\w)/g, "Franken")  // standalone Fr. at end or before space
    .replace(/\bRp\.?\b/g, "Rappen")     // standalone Rp
    // ── 1b. Convert "1.50 Franken" → "ein Franken fünfzig" ──
    .replace(/([\d.,]+)\s*Franken/g, (_: string, amt: string) => chfToSpeech(amt))
    .replace(/([\d.,]+)\s*Rappen/g, (_: string, amt: string) =>
      `${numToWordsDE(Math.round(parseFloat(amt.replace(",","."))))} Rappen`)
    // ── 2b. Compound speed units: "50 km/h" → "fünfzig Kilometer pro Stunde" ──
    .replace(/\bkm\/h\b/g, "Kilometer pro Stunde")
    .replace(/\bm\/s\b/g, "Meter pro Sekunde")
    .replace(/\bcm\/s\b/g, "Zentimeter pro Sekunde")
    // ── 2c. Decimal measures: "1.5 m" → "eineinhalb Meter", "0.5 l" → "ein halb Liter" ──
    // Order: longest unit abbr first so "mm" wins over "m", "ml" over "l"
    .replace(/\b(\d+[.,]\d+)\s*(mm|cm|dm|km|mg|kg|dl|ml|cl|m|g|l)\b/g,
      (_: string, num: string, unit: string) => decimalMeasureToSpeech(num, unit))
    // ── 3. Area units (before plain units) ──
    .replace(/cm²/g, "Quadratzentimeter")
    .replace(/m²/g, "Quadratmeter")
    .replace(/mm²/g, "Quadratmillimeter")
    // ── 4. Units with leading digit ──
    .replace(/(\d)\s*km\b/g, "$1 Kilometer")
    .replace(/(\d)\s*cm\b/g, "$1 Zentimeter")
    .replace(/(\d)\s*mm\b/g, "$1 Millimeter")
    .replace(/(\d)\s*kg\b/g, "$1 Kilogramm")
    .replace(/(\d)\s*mg\b/g, "$1 Milligramm")
    .replace(/(\d)\s*ml\b/g, "$1 Milliliter")
    .replace(/(\d)\s*dl\b/g, "$1 Deziliter")
    .replace(/(\d)\s*cl\b/g, "$1 Zentiliter")
    .replace(/(\d)\s*l\b/g, "$1 Liter")
    .replace(/(\d)\s*g\b/g, "$1 Gramm")
    .replace(/(\d)\s*m\b/g, "$1 Meter")
    // ── 5. Standalone unit abbreviations ──
    .replace(/\bkm\b/g, "Kilometer")
    .replace(/\bcm\b/g, "Zentimeter")
    .replace(/\bmm\b/g, "Millimeter")
    .replace(/\bkg\b/g, "Kilogramm")
    .replace(/\bml\b/g, "Milliliter")
    .replace(/\bdl\b/g, "Deziliter")
    .replace(/\bg\b/g, "Gramm")
    // ── 6. Blank patterns — MUST come after unit expansion ──
    // ── 6a. Arrow → (common in fill-in exercises) ──
    //    "Sortiere: A, B, C → ___" → "Sortiere: A, B, C, was kommt raus?"
    .replace(/→\s*Richtig\s*:\s*___/gi, "– was ist richtig?")
    .replace(/→\s*___/g, "– was kommt raus?")
    .replace(/→/g, ",")
    // ── 6a2. Mid-sentence math blank: "5 + ___ = 10" → "5 plus welche Zahl ist gleich 10"
    //    Must run BEFORE general blank rules
    .replace(/(\d+)\s*\+\s*___/g, "$1 plus welche Zahl")
    .replace(/(\d+)\s*[\-\u2212]\s*___/g, "$1 minus welche Zahl")
    .replace(/(\d+)\s*[\u00d7x\*]\s*___/g, "$1 mal welche Zahl")
    .replace(/(\d+)\s*[\u00f7:]\s*___/g, "$1 durch welche Zahl")
    // ── 6b. Colon + blank: "ist: ___" → "ist was?" ──
    .replace(/:\s*___/g, ": was?")
    // ── 6c. Blank + unit: "___ Zentimeter" / "___ kg" → "wie viele Zentimeter?" ──
    .replace(/___\s+(Zentimeter|Kilometer|Millimeter|Meter|Kilogramm|Gramm|Milligramm|Liter|Deziliter|Milliliter|Zentiliter|Franken|Rappen|Grad|Stunden?|Minuten?|Sekunden?|Tage?|Wochen?|Monate?|Jahre?|Prozent)/g, "wie viele $1?")
    // ── 6d. Multiple blanks: "___ und ___" → "was und was?" ──
    .replace(/___\s+und\s+___/g, "was und was?")
    .replace(/___,\s*___,\s*___/g, "was, was, was?")
    .replace(/___\s+und\s+noch\s+___/g, "was und noch was?")
    // ── 6e. Context-aware blanks ──
    //    Normalize colon-blank "ist: ___" → already handled above
    //    "beginnt mit ___" → "beginnt mit welchem Buchstaben?"
    .replace(/beginnt\s+mit\s+___/g, "beginnt mit welchem Buchstaben?")
    //    "endet mit ___" → "endet mit welchem Buchstaben?"
    .replace(/endet\s+mit\s+___/g, "endet mit welchem Buchstaben?")
    //    "hat ___ Buchstaben" → "hat wie viele Buchstaben?"
    .replace(/hat\s+___\s+Buchstaben/g, "hat wie viele Buchstaben?")
    //    "der ___ Buchstabe" → "der wievielte Buchstabe"
    .replace(/\bder\s+___\s+(Buchstabe|Tag|Monat|Wochentag)/gi, "der wievielte $1")
    //    "heisst ___" → "— wie heisst es?" (dash prevents awkward word order)
    .replace(/heisst\s*:\s*___/g, "heisst — wie?")
    .replace(/heisst\s+___/g, "heisst — wie?")
    //    "nennt man ___" → "wie nennt man es?"
    .replace(/nennt man\s+___/g, "wie nennt man es?")
    //    "ist ___ mehr/weniger als" → "ist wie viel mehr/weniger als"
    .replace(/ist\s+___\s+(mehr|weniger|grösser|kleiner|länger|kürzer)/g, "ist wie viel $1")
    //    "Buchstabe[n] … ist ___" → "welcher Buchstabe?"
    .replace(/\bBuchstabe[n]?\b[^_]*?ist\s+___/g, m => m.replace(/ist\s+___/, "ist welcher Buchstabe?"))
    //    "Laut … ist ___" → "welcher Laut?"
    .replace(/\bLaut\b[^_]*?ist\s+___/g, m => m.replace(/ist\s+___/, "ist welcher Laut?"))
    //    "Wort … ist ___" → "welches Wort?"
    .replace(/\bWort\b[^_]*?ist\s+___/g, m => m.replace(/ist\s+___/, "ist welches Wort?"))
    //    "Tier/Ort/Land/Stadt … ist ___" → "welches ...?"
    .replace(/\b(Tier|Ort|Land|Stadt|Pflanze|Farbe)\b[^_]*?ist\s+___/g,
      (m, noun) => m.replace(/ist\s+___/, `ist welches ${noun}?`))
    //    "ist ___" after a number context → "ist gleich wie viel?", else "— was?"
    .replace(/(\d)\s+ist\s+___/g, "$1 ist gleich wie viel?")
    .replace(/ist\s+___/g, "ist — was?")
    //    "sind ___" → "— was?"
    .replace(/sind\s+___/g, "sind — was?")
    //    "= ___ Unit" → "gleich wie viele Unit?"
    .replace(/=\s*___\s+([A-ZÄÖÜ][\wäöüÄÖÜß-]+)/g, "gleich wie viele $1?")
    //    "Unit ___" (unit before blank, e.g. "Franken ___") → "wie viele Franken?"
    .replace(/([A-ZÄÖÜ][\wäöüÄÖÜß-]+)\s+___/g, "wie viele $1?")
    //    "= ___" → "gleich wie viel?"
    .replace(/=\s*___/g, "gleich wie viel?")
    //    ", ___" at end of sequence → ", wie weiter?"
    .replace(/,\s*___\s*[.!?]?\s*$/g, ", wie weiter?")
    //    Mid-sentence blank before determiner
    .replace(/\s+___\s+(der|die|das|ein|eine|einen|einem|einer|des|dem|den)\b/gi, " welcher Artikel $1")
    //    Mid-sentence blank before inflected noun (genitiv etc.)
    .replace(/\s+___\s+([A-ZÄÖÜ][a-zäöüß]+(?:es|en|em|er)\b)/g, " welches Wort $1")
    //    Mid-sentence verb blank: "___ between lowercase words" → remove silently
    .replace(/(?<=\w)\s+___\s+(?=\w)/g, " ")
    //    Any remaining ___ → "was?"
    .replace(/___/g, "was?")
    // ── 7. Math operators ──
    .replace(/(\d)\s*[×x]\s*(\d)/g, "$1 mal $2")
    .replace(/(\d)\s*÷\s*(\d)/g, "$1 durch $2")
    .replace(/(\d)\s*:\s*(\d)/g, "$1 durch $2")
    .replace(/(\d)\s*\+\s*(\d)/g, "$1 plus $2")
    .replace(/(\d)\s*[−\-]\s*(\d)/g, "$1 minus $2")
    //    = in math equations → "ist gleich": "Wie viel mal sieben ist gleich dreiundsechzig"
    .replace(/\s*=\s*/g, " ist gleich ")
    .replace(/=\s*\?/g, " gleich wie viel?")
    .replace(/(?<!\w)<(?!\w)/g, "kleiner als")
    .replace(/(?<!\w)>(?!\w)/g, "grösser als")
    .replace(/\bà\b/g, "zu je")
    // ── 8. Parenthetical hints ──
    //    Grammar explanations: "(Genitiv von das Kind)" → skip entirely (too jargon-heavy for TTS)
    .replace(/\((Genitiv|Dativ|Akkusativ|Nominativ|Plural|Singular|Infinitiv|Partizip|Konjunktiv|Komparativ|Superlativ|Adjektiv|Nomen|Verb|Pronomen|Artikel)[^)]*\)/gi, "")
    //    "von + Nomen" explanatory notes → skip
    .replace(/\(von [^)]{1,40}\)/gi, "")
    //    Short parenthetical verb/word hints: "(laufen)" → ", also laufen,"
    .replace(/\(([a-zäöüA-ZÄÖÜ][^)]{1,20})\)/g, ", $1,")
    // ── 9. Remove emoji ──
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27FF}\u{2B00}-\u{2BFF}]/gu, "")
    .replace(/[\u{FE00}-\u{FE0F}]/gu, "")
    // ── Formatting ──
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
