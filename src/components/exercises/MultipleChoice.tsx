"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/LangContext";

interface Props {
  question: string;
  options: string[];
  answer: string;
  onAnswer: (correct: boolean) => void;
}

export default function MultipleChoice({ question, options, answer, onAnswer }: Props) {
  const { tr } = useLang();
  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handler = (e: KeyboardEvent) => {
      if (selected) return;
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < options.length) pick(options[idx]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, isMobile, options.length]);

  const pick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === answer;
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => onAnswer(correct), 900);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug px-1">{question}</p>
      {!isMobile && (
        <p className="text-xs text-center text-gray-400 hidden sm:block">Tastenkürzel: 1 · 2 · 3 · 4</p>
      )}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === answer;
          let style: React.CSSProperties = {
            transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)",
          };

          let cls = "relative border-2 rounded-2xl px-4 py-4 font-semibold text-base cursor-pointer text-left flex items-center gap-3 w-full active:scale-95 ";

          if (isSelected && isCorrect) {
            cls += "bg-green-100 border-green-500 text-green-800 shadow-md";
            style.transform = "scale(1.03)";
          } else if (isSelected && !isCorrect) {
            cls += "bg-red-100 border-red-400 text-red-700";
            style.animation = shake ? "shake 0.4s ease" : undefined;
          } else if (selected && isCorrect) {
            cls += "bg-green-100 border-green-400 text-green-800";
            style.transform = "scale(1.02)";
          } else {
            cls += "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50";
          }

          const badge = isSelected && isCorrect ? "✓" : isSelected && !isCorrect ? "✗" : selected && isCorrect ? "✓" : `${i + 1}`;
          const badgeColor = isSelected && isCorrect ? "bg-green-500 text-white" : isSelected && !isCorrect ? "bg-red-400 text-white" : selected && isCorrect ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500";

          return (
            <button key={opt} onClick={() => pick(opt)} className={cls} style={style}>
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${badgeColor}`}>{badge}</span>
              <span className="text-sm sm:text-base">{opt}</span>
            </button>
          );
        })}
      </div>
      {selected && selected !== answer && (
        <div className="text-center text-sm text-gray-500 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
          {tr("correctAnswerWas")} <span className="font-bold text-orange-700">{answer}</span>
        </div>
      )}
      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
