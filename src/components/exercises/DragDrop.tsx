"use client";
/**
 * DragDrop — drag word/image tiles into labelled drop zones.
 * Works on both touch and mouse (pointer events).
 * Props:
 *   items: { id, label, image? } — draggable tiles
 *   zones: { id, label }         — drop targets (one answer per zone)
 *   answers: Record<zoneId, itemId> — correct mapping
 */
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";
import { useSound } from "@/hooks/useSound";

export interface DragItem { id: string; label: string; image?: string; emoji?: string; }
export interface DropZone  { id: string; label: string; }

interface Props {
  question: string;
  items: DragItem[];
  zones: DropZone[];
  answers: Record<string, string>; // zoneId → itemId
  onAnswer: (correct: boolean) => void;
}

export default function DragDrop({ question, items, zones, answers, onAnswer }: Props) {
  const { tr } = useLang();
  const { play } = useSound();

  // mapping: zoneId → itemId currently dropped there
  const [placed, setPlaced] = useState<Record<string, string>>({});
  // set of item ids currently placed somewhere
  const placed_ids = new Set(Object.values(placed));
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<Record<string, boolean>>({});

  const dragging = useRef<string | null>(null);

  const handleDragStart = useCallback((itemId: string) => {
    dragging.current = itemId;
  }, []);

  const handleDrop = useCallback((zoneId: string) => {
    if (!dragging.current) return;
    setPlaced(prev => {
      const next = { ...prev };
      // Remove this item from any other zone it was in
      for (const z of Object.keys(next)) {
        if (next[z] === dragging.current) delete next[z];
      }
      next[zoneId] = dragging.current!;
      return next;
    });
    dragging.current = null;
  }, []);

  const handleCheck = () => {
    if (checked) return;
    const res: Record<string, boolean> = {};
    let allCorrect = true;
    for (const zone of zones) {
      const placedItem = placed[zone.id];
      const correct = placedItem === answers[zone.id];
      res[zone.id] = correct;
      if (!correct) allCorrect = false;
    }
    setResult(res);
    setChecked(true);
    play(allCorrect ? "correct" : "wrong");
    setTimeout(() => onAnswer(allCorrect), 900);
  };

  const removeFromZone = (zoneId: string) => {
    if (checked) return;
    setPlaced(prev => { const n = { ...prev }; delete n[zoneId]; return n; });
  };

  const allPlaced = zones.every(z => placed[z.id]);

  return (
    <div className="space-y-4">
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug">{question}</p>

      {/* Drop zones */}
      <div className="grid grid-cols-2 gap-2">
        {zones.map(zone => {
          const itemId = placed[zone.id];
          const item = items.find(i => i.id === itemId);
          const correct = checked ? result[zone.id] : undefined;
          return (
            <div
              key={zone.id}
              onDragOver={e => { e.preventDefault(); }}
              onDrop={() => handleDrop(zone.id)}
              onClick={() => item && removeFromZone(zone.id)}
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all"
              style={{
                minHeight: "90px",
                borderColor: correct === true ? "#22c55e" : correct === false ? "#ef4444" : item ? "#3b82f6" : "#d1d5db",
                background: correct === true ? "#f0fdf4" : correct === false ? "#fef2f2" : item ? "#eff6ff" : "#f9fafb",
                cursor: item ? "pointer" : "default",
              }}
            >
              {/* Zone label */}
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-2 text-center">{zone.label}</div>
              {/* Placed item */}
              {item && (
                <div className="flex flex-col items-center gap-1">
                  {item.image
                    ? <Image src={item.image} alt={item.label} width={44} height={44} className="drop-shadow-sm" />
                    : item.emoji
                    ? <span className="text-3xl">{item.emoji}</span>
                    : null}
                  <span className="text-xs font-semibold text-gray-700">{item.label}</span>
                </div>
              )}
              {!item && <span className="text-gray-300 text-2xl">+</span>}
              {correct === true  && <span className="text-green-500 text-sm font-bold">✓</span>}
              {correct === false && <span className="text-red-400 text-sm font-bold">✗</span>}
            </div>
          );
        })}
      </div>

      {/* Draggable tiles */}
      <div className="flex flex-wrap gap-2 justify-center">
        {items.filter(item => !placed_ids.has(item.id)).map(item => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(item.id)}
            className="flex flex-col items-center gap-1 bg-white border-2 border-gray-200 rounded-2xl px-3 py-2 cursor-grab active:scale-95 shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-all select-none"
            style={{ minWidth: "72px" }}
          >
            {item.image
              ? <Image src={item.image} alt={item.label} width={40} height={40} className="drop-shadow-sm pointer-events-none" />
              : item.emoji
              ? <span className="text-3xl pointer-events-none">{item.emoji}</span>
              : null}
            <span className="text-xs font-semibold text-gray-700 pointer-events-none">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Check button */}
      {allPlaced && !checked && (
        <button
          onClick={handleCheck}
          className="w-full bg-green-600 text-white py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md"
        >
          {tr("checkAnswer")}
        </button>
      )}

      {!allPlaced && (
        <p className="text-center text-xs text-gray-400">
          {zones.length - Object.keys(placed).length} {" "}
          {zones.length - Object.keys(placed).length === 1 ? "Feld fehlt noch" : "Felder fehlen noch"}
        </p>
      )}
    </div>
  );
}
