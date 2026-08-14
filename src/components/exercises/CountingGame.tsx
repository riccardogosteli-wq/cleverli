"use client";
import { useState } from "react";
import { useLang } from "@/lib/LangContext";

interface Props {
  question: string;
  answer: string;
  emoji?: string;
  options: string[];
  onAnswer: (correct: boolean) => void;
  questionImage?: string;
}

const germanTapLabels: Record<string, string> = {
  "🍎": "jeden Apfel",
  "🍏": "jeden Apfel",
  "⭐": "jeden Stern",
  "🐸": "jeden Frosch",
  "🌻": "jede Sonnenblume",
  "🐝": "jede Biene",
  "🐱": "jede Katze",
  "🍬": "jedes Bonbon",
  "🐾": "jedes Tier",
  "🦋": "jeden Schmetterling",
  "⚂": "jeden Punkt",
};

export default function CountingGame({ question, answer, emoji = "🍎", options, onAnswer, questionImage }: Props) {
  const { lang, tr } = useLang();
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [popped, setPopped] = useState<boolean[]>([]);
  const count = parseInt(answer);
  const items = Array.from({ length: count });
  const tapInstruction = (() => {
    if (lang === "de") return `Tippe ${germanTapLabels[emoji] ?? "jedes Symbol"} an.`;
    if (lang === "fr") return `Touche chaque ${emoji} pour compter.`;
    if (lang === "it") return `Tocca ogni ${emoji} per contare.`;
    return `Tap each ${emoji} to count.`;
  })();

  const handleClick = (opt: string) => {
    if (submitted) return;
    setSelected(opt);
  };

  const submit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    setTimeout(() => onAnswer(selected === answer), 1500);
  };

  const handleEmojiClick = (i: number) => {
    if (!popped[i]) {
      const next = [...popped];
      next[i] = true;
      setPopped(next);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center px-1">{question}</p>

      {/* Emoji grid — bigger touch targets */}
      <div className="bg-green-50 rounded-2xl p-4 flex flex-wrap gap-3 justify-center min-h-[90px]">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => handleEmojiClick(i)}
            aria-label={`Zähle ${emoji} Nummer ${i + 1}`}
            style={{
              fontSize: "clamp(1.75rem, 7vw, 2.5rem)",
              transform: popped[i] ? "scale(1.35)" : "scale(1)",
              filter: popped[i] ? "drop-shadow(0 0 6px rgba(34,197,94,0.8))" : "none",
              transition: "transform 0.15s cubic-bezier(.34,1.56,.64,1), filter 0.15s ease",
              background: "none",
              border: "none",
              cursor: "pointer",
              lineHeight: 1,
              padding: "6px",        // bigger tap area
              minWidth: "44px",      // iOS HIG minimum
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        {popped.filter(Boolean).length === 0 ? (
          <span className="text-gray-400">{tapInstruction}</span>
        ) : popped.filter(Boolean).length === count ? (
          <span className="font-bold text-green-700">Alle gezählt! ✓ — Wähle jetzt deine Antwort 👇</span>
        ) : (
          <>Gezählt: <span className="font-bold text-green-700">{popped.filter(Boolean).length}</span></>
        )}
      </div>

      {/* Correct answer feedback */}
      {submitted && selected && selected !== answer && (
        <div className="text-center text-sm text-gray-500 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
          {tr("correctAnswerWas")} <span className="font-bold text-orange-700">{answer}</span>
        </div>
      )}

      {/* Answer buttons — 2 cols on mobile, 4 on wider */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map(opt => {
          const isSelected = selected === opt;
          const isCorrect = opt === answer;
          let bg = "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50 active:scale-95";
          if (submitted && isSelected && isCorrect) bg = "bg-green-100 border-green-500 text-green-800 scale-110 shadow-md";
          else if (submitted && isSelected && !isCorrect) bg = "bg-red-100 border-red-400 text-red-800";
          else if (submitted && selected && isCorrect) bg = "bg-green-100 border-green-500 text-green-800";
          else if (isSelected) bg = "bg-green-50 border-green-500 text-green-800 shadow-sm";

          return (
            <button key={opt} onClick={() => handleClick(opt)}
              disabled={submitted}
              aria-pressed={isSelected}
              data-answer={opt}
              style={{ transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)", minHeight: "56px" }}
              className={`border-2 rounded-2xl font-bold text-xl cursor-pointer text-center ${bg}`}>
              {opt}
            </button>
          );
        })}
      </div>
      <button
        onClick={submit}
        disabled={!selected || submitted}
        className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitted ? (selected === answer ? tr("correct") : tr("next")) : tr("checkAnswer")}
      </button>
    </div>
  );
}
