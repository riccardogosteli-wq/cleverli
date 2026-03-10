"use client";
/**
 * NumberLine — drag a thumb on a number line to the correct position.
 * Props:
 *   min, max: range of the line
 *   answer: correct integer value
 *   question: prompt text
 *   step: default 1
 */
import { useRef, useState, useCallback } from "react";
import { useSound } from "@/hooks/useSound";
import { useLang } from "@/lib/LangContext";

interface Props {
  question: string;
  min: number;
  max: number;
  answer: number;
  step?: number;
  onAnswer: (correct: boolean) => void;
}

export default function NumberLine({ question, min, max, answer, step = 1, onAnswer }: Props) {
  const { play } = useSound();
  const { tr } = useLang();
  const [value, setValue] = useState<number>(Math.round((min + max) / 2));
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  }, []);

  const handleSubmit = () => {
    if (submitted) return;
    const ok = value === answer;
    setCorrect(ok);
    setSubmitted(true);
    play(ok ? "correct" : "wrong");
    setTimeout(() => onAnswer(ok), 900);
  };

  // Tick marks
  const ticks: number[] = [];
  for (let i = min; i <= max; i += step) ticks.push(i);
  // Only show every Nth label to avoid crowding
  const labelEvery = Math.ceil(ticks.length / 6);

  return (
    <div className="space-y-5">
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug">{question}</p>

      {/* Selected value display */}
      <div className="flex justify-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-4 transition-all shadow-md"
          style={{
            borderColor: submitted ? (correct ? "#22c55e" : "#ef4444") : "#3b82f6",
            color:       submitted ? (correct ? "#15803d" : "#b91c1c") : "#1d4ed8",
            background:  submitted ? (correct ? "#f0fdf4" : "#fef2f2") : "#eff6ff",
          }}
        >
          {value}
        </div>
      </div>

      {/* Number line */}
      <div className="px-3 space-y-1" ref={trackRef}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSlider}
          disabled={submitted}
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${pct(value)}%, #e5e7eb ${pct(value)}%)`,
            WebkitAppearance: "none",
          }}
        />
        {/* Tick labels */}
        <div className="flex justify-between px-0.5">
          {ticks.filter((_, i) => i % labelEvery === 0 || _ === min || _ === max).map(t => (
            <span key={t} className="text-[10px] text-gray-400 font-medium">{t}</span>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {submitted && !correct && (
        <div className="text-center text-sm bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-gray-600">
          {tr("correctAnswer")} <span className="font-bold text-orange-700">{answer}</span>
        </div>
      )}

      {/* Submit */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="w-full bg-green-700 text-white py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md"
        >
          {tr("checkAnswer")}
        </button>
      )}

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #3b82f6;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(59,130,246,0.4);
          cursor: grab;
        }
        input[type=range]:disabled::-webkit-slider-thumb {
          background: #9ca3af;
          cursor: default;
        }
      `}</style>
    </div>
  );
}
