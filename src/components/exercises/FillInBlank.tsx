"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useLang } from "@/lib/LangContext";

interface Props {
  question: string;
  answer: string;
  onAnswer: (correct: boolean) => void;
}

function isNumericAnswer(answer: string): boolean {
  return /^-?\d+([.,]\d+)?$/.test(answer.trim());
}

export default function FillInBlank({ question, answer, onAnswer }: Props) {
  const { tr } = useLang();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const numeric = useMemo(() => isNumericAnswer(answer), [answer]);

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const t = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(t);
  }, []);

  const submit = () => {
    if (submitted || !value.trim()) return;
    setSubmitted(true);
    const correct = value.trim().toLowerCase() === answer.toLowerCase();
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => onAnswer(correct), 900);
  };

  const correct = submitted && value.trim().toLowerCase() === answer.toLowerCase();
  const wrong = submitted && !correct;

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug px-1">{question}</p>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          // Numeric keyboard on mobile for number answers — huge UX win for kids
          inputMode={numeric ? "numeric" : "text"}
          // German text needs autocapitalize for nouns; numbers don't
          autoCapitalize={numeric ? "off" : "sentences"}
          autoCorrect={numeric ? "off" : "on"}
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={e => !submitted && setValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder={numeric ? tr("numberPlaceholder") : tr("answerPlaceholder")}
          className={`w-full text-center font-bold border-2 rounded-2xl px-4 py-4 outline-none transition-all
            ${correct ? "border-green-500 bg-green-50 text-green-700" :
              wrong ? "border-red-400 bg-red-50 text-red-700" :
              "border-gray-200 bg-white text-gray-900 focus:border-green-400"}`}
          style={{
            fontSize: "clamp(16px, 5vw, 24px)",
            fontWeight: 700,
            animation: shake ? "shake 0.4s ease" : undefined,
            transition: "border-color 0.2s, background 0.2s",
          }}
          readOnly={submitted}
        />
        {correct && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">✅</span>}
        {wrong  && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">❌</span>}
      </div>

      {wrong && (
        <div className="text-center text-sm text-gray-500 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
          Die richtige Antwort ist: <span className="font-bold text-orange-700">{answer}</span>
        </div>
      )}

      <button
        onClick={submit}
        disabled={submitted || !value.trim()}
        className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitted ? (correct ? "Richtig! 🎉" : "Weiter →") : tr("checkAnswer")}
      </button>

      {!isMobile && (
        <p className="text-xs text-center text-gray-400 hidden sm:block">{tr("enterKeyHint")}</p>
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
