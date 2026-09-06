"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { matchOrderedTextAnswer, normaliseTextAnswer } from "@/lib/fillInBlankMatching";

interface Props {
  question: string;
  answer: string;
  altAnswers?: string[];
  sequentialAnswer?: boolean;
  caseSensitiveAnswer?: boolean;
  onAnswer: (correct: boolean) => void;
  questionImage?: string;
}

const MINUS_SIGN_VARIANTS = /[−–—‒﹣－]/g;

function normalizeMinusSigns(value: string): string {
  return value.normalize("NFKC").replace(MINUS_SIGN_VARIANTS, "-");
}

function isNumericAnswer(answer: string): boolean {
  return /^-?\d+([.,]\d+)?$/.test(normalizeMinusSigns(answer).trim());
}

function isDecimalAnswer(answer: string): boolean {
  return /^-?\d+[.,]\d+$/.test(normalizeMinusSigns(answer).trim());
}

function isNegativeNumericAnswer(answer: string): boolean {
  return /^-\d+([.,]\d+)?$/.test(normalizeMinusSigns(answer).trim());
}

export default function FillInBlank({ question, answer, altAnswers, sequentialAnswer, caseSensitiveAnswer, onAnswer, questionImage }: Props) {
  const { tr } = useLang();
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const numeric = useMemo(() => isNumericAnswer(answer), [answer]);
  const decimal = useMemo(() => isDecimalAnswer(answer), [answer]);
  const negativeNumeric = useMemo(() => isNegativeNumericAnswer(answer), [answer]);

  useEffect(() => {
    const mobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsMobile(mobile);
    // Don't auto-focus on mobile — the keyboard would pop up before the child reads the question
    if (!mobile) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, []);

  const matchesSingle = (input: string, expected: string) => {
    return caseSensitiveAnswer ? input.normalize("NFKC").trim() === expected.normalize("NFKC").trim() : matchOrderedTextAnswer(input, expected);
  };

  const answerVariants = (expected: string) => {
    const variants = new Set([expected]);

    if (!sequentialAnswer) {
      expected
        .split(/\s*\/\s*/g)
        .map(part => part.trim())
        .filter(Boolean)
        .forEach(part => variants.add(part));
    }

    const parentheticalAlternative = sequentialAnswer
      ? null
      : expected.match(/^(.+?)\s*\((?:oder|or|o|ou)\s+(.+?)\)$/i);
    if (parentheticalAlternative) {
      variants.add(parentheticalAlternative[1].trim());
      variants.add(parentheticalAlternative[2].trim());
    }

    return [...variants];
  };

  const displayAnswerVariants = (expected: string) => {
    const variants = answerVariants(expected);
    const hasCompositeAnswer = expected.includes("/") || /\((?:oder|or|o|ou)\s+/i.test(expected);

    const visible = variants
      .filter(variant => !hasCompositeAnswer || normaliseTextAnswer(variant) !== normaliseTextAnswer(expected))
      .map(variant => variant.trim())
      .filter(Boolean);

    return [...new Set(visible)];
  };

  const visibleAnswerVariants = displayAnswerVariants(answer);
  const hasMultipleVisibleAnswers = visibleAnswerVariants.length > 1;

  const matchesOpenEndedNumberList = (input: string, prompt: string) => {
    const smallerThanMatch = prompt.match(/schreibe\s+drei\s+zahlen\s+kleiner\s+als\s+(\d+)/i);
    if (!smallerThanMatch) return false;

    const limit = parseInt(smallerThanMatch[1], 10);
    const numbers = (input.match(/-?\d+/g) ?? []).map(Number);
    if (numbers.length !== 3) return false;

    const unique = new Set(numbers);
    return unique.size === 3 && numbers.every(n => Number.isInteger(n) && n >= 0 && n < limit);
  };

  const isCorrect = (input: string, expected: string) => {
    if (matchesOpenEndedNumberList(input, question)) return true;
    if (matchesSingle(input, expected)) return true;
    if (answerVariants(expected).some(variant => matchesSingle(input, variant))) return true;
    // Check alternative answers
    if (altAnswers?.some(alt => answerVariants(alt).some(variant => matchesSingle(input, variant)))) return true;
    return false;
  };

  const submit = () => {
    if (submitted || !value.trim()) return;
    setSubmitted(true);
    const correct = isCorrect(value, answer);
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setTimeout(() => onAnswer(correct), 1500);
  };

  const correct = submitted && isCorrect(value, answer);
  const wrong = submitted && !correct;

  return (
    <div className="space-y-4">
      {questionImage && (
        <div className="flex justify-center">
          <Image src={questionImage} alt="Aufgabe" width={140} height={140} className="drop-shadow-md rounded-2xl" />
        </div>
      )}
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug px-1">{question}</p>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          // Negative numbers need a normal keyboard because several mobile/Swiss
          // numeric keypads hide the minus key.
          inputMode={numeric ? (negativeNumeric ? "text" : decimal ? "decimal" : "numeric") : "text"}
          // German text needs autocapitalize for nouns; numbers don't
          autoCapitalize={numeric ? "off" : "sentences"}
          autoCorrect={numeric ? "off" : "on"}
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={e => !submitted && setValue(normalizeMinusSigns(e.target.value))}
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
          {hasMultipleVisibleAnswers ? tr("correctAnswers") : tr("correctAnswer")}{" "}
          <span className="font-bold text-orange-700">
            {hasMultipleVisibleAnswers ? visibleAnswerVariants.join(" · ") : answer}
          </span>
        </div>
      )}

      <button
        onClick={submit}
        disabled={submitted || !value.trim()}
        className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {submitted ? (correct ? tr("correct") : tr("next")) : tr("checkAnswer")}
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
