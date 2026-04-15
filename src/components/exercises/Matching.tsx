"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { useSound } from "@/hooks/useSound";

interface MatchItem {
  id: string;
  label: string;
  image?: string;
  emoji?: string;
}

interface Props {
  question: string;
  pairs: MatchItem[];
  onAnswer: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Matching({ question, pairs, onAnswer }: Props) {
  const { play } = useSound();
  const leftItems = useMemo(() => pairs.filter((_, i) => i % 2 === 0), [pairs]);
  const rightBase = useMemo(() => pairs.filter((_, i) => i % 2 === 1), [pairs]);
  const rightItems = useMemo(() => shuffle(rightBase), [rightBase]);
  const expectedMap = useMemo(() => {
    const map = new Map<string, string>();
    for (let i = 0; i < pairs.length; i += 2) {
      const left = pairs[i];
      const right = pairs[i + 1];
      if (left && right) map.set(left.id, right.id);
    }
    return map;
  }, [pairs]);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedLeftIds, setMatchedLeftIds] = useState<Set<string>>(new Set());
  const [matchedRightIds, setMatchedRightIds] = useState<Set<string>>(new Set());
  const [wrongLeft, setWrongLeft] = useState<string | null>(null);
  const [wrongRight, setWrongRight] = useState<string | null>(null);

  const tryMatch = (leftId: string, rightId: string) => {
    if (expectedMap.get(leftId) === rightId) {
      play("correct");
      setMatchedLeftIds(prev => {
        const next = new Set(prev);
        next.add(leftId);
        if (next.size === leftItems.length) {
          setTimeout(() => onAnswer(true), 500);
        }
        return next;
      });
      setMatchedRightIds(prev => new Set(prev).add(rightId));
      setSelectedLeft(null);
      setSelectedRight(null);
      setWrongLeft(null);
      setWrongRight(null);
    } else {
      play("wrong");
      setWrongLeft(leftId);
      setWrongRight(rightId);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongLeft(null);
        setWrongRight(null);
      }, 700);
    }
  };

  const handleLeft = (leftId: string) => {
    if (matchedLeftIds.has(leftId)) return;
    setSelectedLeft(leftId);
    if (selectedRight) tryMatch(leftId, selectedRight);
  };

  const handleRight = (rightId: string) => {
    if (matchedRightIds.has(rightId)) return;
    setSelectedRight(rightId);
    if (selectedLeft) tryMatch(selectedLeft, rightId);
  };

  const renderItem = (item: MatchItem) => {
    const isSvg = item.image?.endsWith(".svg");
    return (
      <>
        {item.image ? (
          <Image src={item.image} alt={item.label} width={36} height={36} className="drop-shadow-sm" unoptimized={isSvg} />
        ) : item.emoji ? (
          <span className="text-2xl leading-none">{item.emoji}</span>
        ) : null}
        <span className="text-sm font-semibold text-gray-700 leading-tight text-center">{item.label}</span>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug px-1">{question}</p>
      <div className="grid grid-cols-2 gap-3 items-start">
        <div className="space-y-2">
          {leftItems.map(item => {
            const selected = selectedLeft === item.id;
            const matched = matchedLeftIds.has(item.id);
            const wrong = wrongLeft === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLeft(item.id)}
                className="w-full rounded-2xl border-2 px-3 py-3 flex flex-col items-center gap-2 transition-all active:scale-95"
                style={{
                  minHeight: "84px",
                  borderColor: matched ? "#22c55e" : wrong ? "#ef4444" : selected ? "#3b82f6" : "#e5e7eb",
                  background: matched ? "#f0fdf4" : wrong ? "#fef2f2" : selected ? "#eff6ff" : "#ffffff",
                }}
              >
                {renderItem(item)}
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rightItems.map(item => {
            const selected = selectedRight === item.id;
            const matched = matchedRightIds.has(item.id);
            const wrong = wrongRight === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleRight(item.id)}
                className="w-full rounded-2xl border-2 px-3 py-3 flex flex-col items-center gap-2 transition-all active:scale-95"
                style={{
                  minHeight: "84px",
                  borderColor: matched ? "#22c55e" : wrong ? "#ef4444" : selected ? "#3b82f6" : "#e5e7eb",
                  background: matched ? "#f0fdf4" : wrong ? "#fef2f2" : selected ? "#eff6ff" : "#ffffff",
                }}
              >
                {renderItem(item)}
              </button>
            );
          })}
        </div>
      </div>
      <p className="text-center text-xs text-gray-400">
        {matchedLeftIds.size}/{leftItems.length} Paare
      </p>
    </div>
  );
}
