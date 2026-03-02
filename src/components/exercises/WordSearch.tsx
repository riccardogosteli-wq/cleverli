"use client";
/**
 * WordSearch — find hidden words in a letter grid.
 * Words can be placed horizontally (L→R) only for grade 1–2 simplicity.
 * Tapping/clicking letters selects them; completed words highlight green.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import { useSound } from "@/hooks/useSound";

interface Props {
  question: string;
  words: string[];        // words to find (uppercase)
  onAnswer: (correct: boolean) => void;
  gridSize?: number;      // default 8
}

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function buildGrid(words: string[], size: number): { grid: string[][]; placements: { word: string; row: number; col: number }[] } {
  const grid: string[][] = Array.from({length: size}, () => Array(size).fill(""));
  const placements: { word: string; row: number; col: number }[] = [];

  // Place each word horizontally with simple collision avoidance
  for (const word of words) {
    const upper = word.toUpperCase();
    let placed = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * (size - upper.length + 1));
      // Check no conflict
      let ok = true;
      for (let i = 0; i < upper.length; i++) {
        const cell = grid[row][col + i];
        if (cell !== "" && cell !== upper[i]) { ok = false; break; }
      }
      if (ok) {
        for (let i = 0; i < upper.length; i++) grid[row][col + i] = upper[i];
        placements.push({ word: upper, row, col });
        placed = true;
        break;
      }
    }
    if (!placed) {
      // Force-place on last row (fallback)
      const row = size - 1;
      const col = 0;
      for (let i = 0; i < Math.min(upper.length, size); i++) grid[row][col + i] = upper[i];
      placements.push({ word: upper, row, col });
    }
  }

  // Fill empty cells with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  }

  return { grid, placements };
}

export default function WordSearch({ question, words, onAnswer, gridSize = 8 }: Props) {
  const { play } = useSound();
  const { grid, placements } = useMemo(() => buildGrid(words, gridSize), [words, gridSize]);

  const [selecting, setSelecting] = useState<{row: number; col: number}[]>([]);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());  // "r-c" keys

  useEffect(() => {
    if (found.size === words.length && words.length > 0) {
      play("complete");
      setTimeout(() => onAnswer(true), 600);
    }
  }, [found, words.length, onAnswer, play]);

  const isSelected = (r: number, c: number) => selecting.some(s => s.row === r && s.col === c);
  const isFound    = (r: number, c: number) => foundCells.has(`${r}-${c}`);

  const tapCell = useCallback((row: number, col: number) => {
    if (found.size === words.length) return;

    setSelecting(prev => {
      // If already selected, deselect
      if (prev.some(s => s.row === row && s.col === col)) return [];
      const next = [...prev, { row, col }];

      // Check if selection spells a word (horizontal check)
      if (next.length > 1) {
        const sortedByCol = [...next].sort((a, b) => a.col - b.col);
        const allSameRow = sortedByCol.every(s => s.row === sortedByCol[0].row);
        if (!allSameRow) return next;

        // Check contiguous
        const minCol = sortedByCol[0].col;
        const contiguous = sortedByCol.every((s, i) => s.col === minCol + i);
        if (!contiguous) return next;

        const attempt = sortedByCol.map(s => grid[s.row][s.col]).join("");
        const match = placements.find(p => p.word === attempt && p.row === sortedByCol[0].row && p.col === minCol);
        if (match) {
          play("correct");
          setFound(f => new Set([...f, match.word]));
          const newCells = sortedByCol.map(s => `${s.row}-${s.col}`);
          setFoundCells(fc => new Set([...fc, ...newCells]));
          return [];
        }
      }
      return next;
    });
  }, [found, grid, placements, play]);

  const cellSize = gridSize <= 8 ? 34 : 28;

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-gray-800 text-center">{question}</p>

      {/* Word list */}
      <div className="flex flex-wrap gap-2 justify-center">
        {words.map(w => {
          const upper = w.toUpperCase();
          const done = found.has(upper);
          return (
            <span key={w}
              className={`text-sm font-bold px-3 py-1 rounded-full border-2 transition-all ${done ? "bg-green-100 border-green-400 text-green-700 line-through" : "bg-white border-gray-200 text-gray-700"}`}>
              {done ? "✓" : ""} {w}
            </span>
          );
        })}
      </div>

      {/* Grid */}
      <div className="overflow-x-auto flex justify-center">
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`, gap: "2px" }}>
          {grid.flatMap((row, r) => row.map((letter, c) => {
            const sel  = isSelected(r, c);
            const fnd  = isFound(r, c);
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => tapCell(r, c)}
                className="rounded-md font-bold transition-all active:scale-90 select-none"
                style={{
                  width: cellSize, height: cellSize,
                  fontSize: cellSize <= 28 ? 11 : 13,
                  background: fnd ? "#bbf7d0" : sel ? "#bfdbfe" : "#f1f5f9",
                  color:      fnd ? "#15803d" : sel ? "#1d4ed8" : "#374151",
                  border:     fnd ? "2px solid #22c55e" : sel ? "2px solid #3b82f6" : "2px solid transparent",
                }}
              >
                {letter}
              </button>
            );
          }))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400">
        {found.size}/{words.length} {found.size === words.length ? "🎉" : "Wörter gefunden"}
      </p>
    </div>
  );
}
