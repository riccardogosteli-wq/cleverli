"use client";
import { useState } from "react";

interface Props {
  question: string;
  answer: string;
  emoji?: string;
  options: string[];
  onAnswer: (correct: boolean) => void;
}

export default function CountingGame({ question, answer, emoji = "🍎", options, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [popped, setPopped] = useState<boolean[]>([]);
  const count = parseInt(answer);
  const items = Array.from({ length: count });

  const handleClick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onAnswer(opt === answer), 900);
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
      <p className="text-xs text-center text-gray-400">Tippe auf jedes {emoji} um es zu zählen!</p>

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
        Gezählt: <span className="font-bold text-green-700">{popped.filter(Boolean).length}</span> / {count}
      </div>

      {/* Correct answer feedback */}
      {selected && selected !== answer && (
        <div className="text-center text-sm text-gray-500 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
          Die richtige Antwort war: <span className="font-bold text-orange-700">{answer}</span>
        </div>
      )}

      {/* Answer buttons — 2 cols on mobile, 4 on wider */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {options.map(opt => {
          const isSelected = selected === opt;
          const isCorrect = opt === answer;
          let bg = "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50 active:scale-95";
          if (isSelected && isCorrect) bg = "bg-green-100 border-green-500 text-green-800 scale-110 shadow-md";
          else if (isSelected && !isCorrect) bg = "bg-red-100 border-red-400 text-red-800";
          else if (selected && isCorrect) bg = "bg-green-100 border-green-500 text-green-800";

          return (
            <button key={opt} onClick={() => handleClick(opt)}
              style={{ transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)", minHeight: "56px" }}
              className={`border-2 rounded-2xl font-bold text-xl cursor-pointer text-center ${bg}`}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
