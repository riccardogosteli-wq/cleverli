"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";

interface Props {
  question: string;
  options: string[];
  answer: string;
  onAnswer: (correct: boolean) => void;
  optionImages?: string[];   // one image per option (same order), e.g. ["/images/shapes/circle.svg", ...]
  questionImage?: string;    // illustration above the question
}

export default function MultipleChoice({ question, options, answer, onAnswer, optionImages, questionImage }: Props) {
  const { tr } = useLang();
  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hasImages = optionImages && optionImages.length === options.length;

  useEffect(() => {
    setIsMobile("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isMobile || hasImages) return; // no kbd shortcuts when images shown
    const handler = (e: KeyboardEvent) => {
      if (selected) return;
      const idx = parseInt(e.key) - 1;
      if (idx >= 0 && idx < options.length) pick(options[idx]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, isMobile, options.length, hasImages]);

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

  // ── Image tiles layout ───────────────────────────────────────────
  if (hasImages) {
    return (
      <div className="space-y-4">
        {questionImage && (
          <div className="flex justify-center">
            <Image src={questionImage} alt="" width={140} height={140} className="drop-shadow-md rounded-2xl" />
          </div>
        )}
        <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug px-1">{question}</p>
        <div className={`grid gap-3 ${options.length <= 2 ? "grid-cols-2" : "grid-cols-2"}`}>
          {options.map((opt, i) => {
            const isSelected = selected === opt;
            const isCorrect = opt === answer;
            let borderColor = "#e5e7eb";
            let bg = "#ffffff";
            if (isSelected && isCorrect) { borderColor = "#22c55e"; bg = "#f0fdf4"; }
            else if (isSelected && !isCorrect) { borderColor = "#ef4444"; bg = "#fef2f2"; }
            else if (selected && isCorrect) { borderColor = "#22c55e"; bg = "#f0fdf4"; }

            return (
              <button
                key={opt}
                onClick={() => pick(opt)}
                className="relative rounded-2xl border-2 p-2 flex flex-col items-center gap-1.5 active:scale-95 transition-all"
                style={{
                  borderColor,
                  background: bg,
                  animation: isSelected && !isCorrect && shake ? "shake 0.4s ease" : undefined,
                  minHeight: "110px",
                }}
              >
                <Image
                  src={optionImages![i]}
                  alt={opt}
                  width={72}
                  height={72}
                  className="drop-shadow-sm"
                  unoptimized={optionImages![i].endsWith(".svg")}
                  style={{ filter: isSelected && !isCorrect ? "saturate(0.4)" : "none" }}
                />
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight px-1">{opt}</span>
                {/* Result icon */}
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${isCorrect ? "bg-green-500" : "bg-red-400"}`}>
                    {isCorrect ? "✓" : "✗"}
                  </div>
                )}
                {!isSelected && selected && isCorrect && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-green-500">✓</div>
                )}
              </button>
            );
          })}
        </div>
        {selected && selected !== answer && (
          <div className="text-center text-sm text-gray-500 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
            {tr("correctAnswerWas")} <span className="font-bold text-orange-700">{answer}</span>
          </div>
        )}
        <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`}</style>
      </div>
    );
  }

  // ── Text list layout (original) ──────────────────────────────────
  return (
    <div className="space-y-4">
      {questionImage && (
        <div className="flex justify-center">
          <Image src={questionImage} alt="" width={140} height={140} className="drop-shadow-md rounded-2xl" />
        </div>
      )}
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug px-1">{question}</p>
      {!isMobile && !hasImages && (
        <p className="text-xs text-center text-gray-400 hidden sm:block">Tastenkürzel: 1 · 2 · 3 · 4</p>
      )}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === answer;
          let style: React.CSSProperties = { transition: "all 0.2s cubic-bezier(.34,1.56,.64,1)" };
          let cls = "relative border-2 rounded-2xl px-4 py-4 font-semibold text-base cursor-pointer text-left flex items-center gap-3 w-full active:scale-95 ";
          if (isSelected && isCorrect) { cls += "bg-green-100 border-green-500 text-green-800 shadow-md"; style.transform = "scale(1.03)"; }
          else if (isSelected && !isCorrect) { cls += "bg-red-100 border-red-400 text-red-700"; style.animation = shake ? "shake 0.4s ease" : undefined; }
          else if (selected && isCorrect) { cls += "bg-green-100 border-green-400 text-green-800"; style.transform = "scale(1.02)"; }
          else { cls += "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50"; }
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
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`}</style>
    </div>
  );
}
