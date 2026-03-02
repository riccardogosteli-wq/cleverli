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
  const count = parseInt(answer);
  const items = Array.from({ length: count });

  const handleClick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onAnswer(opt === answer), 800);
  };

  return (
    <div className="space-y-4">
      <p className="text-xl font-semibold text-gray-800 text-center">{question}</p>
      <div className="bg-green-50 rounded-2xl p-4 flex flex-wrap gap-2 justify-center min-h-[80px]">
        {items.map((_, i) => (
          <span key={i} className="text-3xl">{emoji}</span>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {options.map(opt => {
          let cls = "border-2 rounded-2xl p-3 font-bold text-xl cursor-pointer transition-all text-center ";
          if (selected === opt) {
            cls += opt === answer ? "bg-green-100 border-green-500 text-green-800 scale-105" : "bg-red-100 border-red-400 text-red-800";
          } else if (selected && opt === answer) {
            cls += "bg-green-100 border-green-500 text-green-800";
          } else {
            cls += "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50";
          }
          return <button key={opt} onClick={() => handleClick(opt)} className={cls} disabled={!!selected}>{opt}</button>;
        })}
      </div>
    </div>
  );
}
