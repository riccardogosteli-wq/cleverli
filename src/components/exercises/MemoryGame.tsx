"use client";
/**
 * MemoryGame — flip cards to find matching pairs.
 * Pairs are provided as { word, image } items; cards are shuffled and shown face-down.
 * When all pairs are matched, onAnswer(true) is called.
 */
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSound } from "@/hooks/useSound";

export interface MemoryPair {
  id: string;
  label: string;
  image?: string;
  emoji?: string;
}

interface Card {
  key: string;  // unique per card (id + "-a" or "-b")
  pairId: string;
  label: string;
  image?: string;
  emoji?: string;
}

interface Props {
  pairs: MemoryPair[];   // 3–6 pairs ideal
  onAnswer: (correct: boolean) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryGame({ pairs, onAnswer }: Props) {
  const { play } = useSound();
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // Create two cards per pair (text + image side OR both text)
    const deck: Card[] = [];
    for (const p of pairs) {
      deck.push({ key: `${p.id}-a`, pairId: p.id, label: p.label, image: p.image, emoji: p.emoji });
      deck.push({ key: `${p.id}-b`, pairId: p.id, label: p.label, image: p.image, emoji: p.emoji });
    }
    setCards(shuffle(deck));
  }, [pairs]);

  useEffect(() => {
    if (matched.length === pairs.length && pairs.length > 0) {
      play("complete");
      setTimeout(() => onAnswer(true), 600);
    }
  }, [matched, pairs.length, onAnswer, play]);

  const flip = useCallback((key: string) => {
    if (locked || flipped.includes(key) || matched.includes(cards.find(c => c.key === key)?.pairId ?? "")) return;
    const newFlipped = [...flipped, key];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [a, b] = newFlipped.map(k => cards.find(c => c.key === k)!);
      if (a.pairId === b.pairId) {
        play("correct");
        setMatched(m => [...m, a.pairId]);
        setFlipped([]);
        setLocked(false);
      } else {
        play("wrong");
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  }, [locked, flipped, matched, cards, play]);

  const cols = pairs.length <= 3 ? "grid-cols-3" : pairs.length <= 4 ? "grid-cols-4" : "grid-cols-3";

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <p className="text-sm font-semibold text-gray-600">
          🃏 {pairs.length === matched.length
            ? "Alle Paare gefunden! 🎉"
            : `${matched.length} / ${pairs.length} Paare gefunden`}
        </p>
        <p className="text-xs text-gray-400">{moves} Versuche</p>
      </div>

      <div className={`grid ${cols} gap-2`}>
        {cards.map(card => {
          const isFlipped = flipped.includes(card.key) || matched.includes(card.pairId);
          const isMatched = matched.includes(card.pairId);

          return (
            <button
              key={card.key}
              onClick={() => flip(card.key)}
              className="relative aspect-square rounded-2xl border-2 transition-all active:scale-95 overflow-hidden"
              style={{
                borderColor: isMatched ? "#22c55e" : isFlipped ? "#3b82f6" : "#e5e7eb",
                background: isMatched ? "#f0fdf4" : isFlipped ? "#eff6ff" : "#f1f5f9",
                cursor: isMatched ? "default" : "pointer",
                minHeight: "72px",
              }}
            >
              {isFlipped ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
                  {card.image ? (
                    <Image src={card.image} alt={card.label} width={44} height={44} className="drop-shadow-sm" />
                  ) : card.emoji ? (
                    <span className="text-3xl">{card.emoji}</span>
                  ) : null}
                  <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight">{card.label}</span>
                  {isMatched && <span className="absolute top-1 right-1 text-green-500 text-xs">✓</span>}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-2xl text-gray-300">
                  🐿️
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
