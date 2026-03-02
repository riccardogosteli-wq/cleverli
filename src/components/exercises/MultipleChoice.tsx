"use client";
import { useState } from "react";

interface Props {
  question: string;
  options: string[];
  answer: string;
  onAnswer: (correct: boolean) => void;
}

const COLORS = [
  "bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-800",
  "bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-800",
  "bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-800",
  "bg-pink-100 border-pink-300 hover:bg-pink-200 text-pink-800",
];
const LABELS = ["A", "B", "C", "D"];

export default function MultipleChoice({ question, options, answer, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onAnswer(opt === answer), 800);
  };

  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold text-gray-800 text-center">{question}</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          let cls = COLORS[i] + " border-2 rounded-2xl p-4 font-semibold text-lg cursor-pointer transition-all flex items-center gap-2";
          if (selected === opt) {
            cls = opt === answer
              ? "bg-green-100 border-green-500 text-green-800 border-2 rounded-2xl p-4 font-semibold text-lg scale-105"
              : "bg-red-100 border-red-400 text-red-800 border-2 rounded-2xl p-4 font-semibold text-lg";
          } else if (selected && opt === answer) {
            cls = "bg-green-100 border-green-500 text-green-800 border-2 rounded-2xl p-4 font-semibold text-lg";
          }
          return (
            <button key={opt} onClick={() => handleClick(opt)} className={cls} disabled={!!selected}>
              <span className="w-7 h-7 rounded-full bg-white/60 flex items-center justify-center text-sm font-bold shrink-0">{LABELS[i]}</span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
