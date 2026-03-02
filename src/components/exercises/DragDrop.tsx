"use client";
/**
 * DragDrop — pointer-event drag/drop (works on iOS Safari, Android, desktop).
 * Uses onPointerDown/Move/Up instead of the broken HTML5 drag API.
 */
import { useState, useRef, useEffect, useCallback } from "react";
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

interface Ghost {
  itemId: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function DragDrop({ question, items, zones, answers, onAnswer }: Props) {
  const { tr } = useLang();
  const { play } = useSound();

  const [placed, setPlaced] = useState<Record<string, string>>({});   // zoneId → itemId
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<Record<string, boolean>>({});
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<Ghost | null>(null);

  const placed_ids = new Set(Object.values(placed));

  // Sync ghost ref so pointer events can read latest
  useEffect(() => { ghostRef.current = ghost; }, [ghost]);

  const getZoneAtPoint = useCallback((x: number, y: number): string | null => {
    for (const [zoneId, el] of Object.entries(zoneRefs.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return zoneId;
      }
    }
    return null;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, itemId: string) => {
    if (checked) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    const g: Ghost = { itemId, x: e.clientX - r.width / 2, y: e.clientY - r.height / 2, w: r.width, h: r.height };
    setGhost(g);
    setActiveItemId(itemId);
  }, [checked]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!ghostRef.current) return;
    e.preventDefault();
    setGhost(prev => prev ? { ...prev, x: e.clientX - prev.w / 2, y: e.clientY - prev.h / 2 } : null);
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const g = ghostRef.current;
    if (!g) return;
    e.preventDefault();

    const zoneId = getZoneAtPoint(e.clientX, e.clientY);

    if (zoneId) {
      setPlaced(prev => {
        const next = { ...prev };
        // Remove item from any previous zone
        for (const z of Object.keys(next)) {
          if (next[z] === g.itemId) delete next[z];
        }
        // Place in new zone (evict existing if any)
        next[zoneId] = g.itemId;
        return next;
      });
    }
    setGhost(null);
    setActiveItemId(null);
  }, [getZoneAtPoint]);

  const removeFromZone = (zoneId: string) => {
    if (checked) return;
    setPlaced(prev => { const n = { ...prev }; delete n[zoneId]; return n; });
  };

  const handleCheck = () => {
    if (checked) return;
    const res: Record<string, boolean> = {};
    let allCorrect = true;
    for (const zone of zones) {
      const correct = placed[zone.id] === answers[zone.id];
      res[zone.id] = correct;
      if (!correct) allCorrect = false;
    }
    setResult(res);
    setChecked(true);
    play(allCorrect ? "correct" : "wrong");
    setTimeout(() => onAnswer(allCorrect), 900);
  };

  const allPlaced = zones.every(z => placed[z.id]);
  const remaining = zones.length - Object.keys(placed).length;

  const renderItemContent = (item: DragItem, size = 40) => (
    <>
      {item.image
        ? <Image src={item.image} alt={item.label} width={size} height={size} className="drop-shadow-sm pointer-events-none" />
        : item.emoji
        ? <span className="text-3xl pointer-events-none select-none">{item.emoji}</span>
        : null}
      <span className="text-xs font-semibold text-gray-700 pointer-events-none select-none text-center leading-tight">{item.label}</span>
    </>
  );

  return (
    <div ref={containerRef} className="space-y-4 select-none" style={{ touchAction: "none" }}>
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
              ref={el => { zoneRefs.current[zone.id] = el; }}
              onClick={() => item && removeFromZone(zone.id)}
              className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all"
              style={{
                minHeight: "90px",
                borderColor: correct === true ? "#22c55e" : correct === false ? "#ef4444" : item ? "#3b82f6" : "#d1d5db",
                background: correct === true ? "#f0fdf4" : correct === false ? "#fef2f2" : item ? "#eff6ff" : "#f9fafb",
                cursor: item && !checked ? "pointer" : "default",
              }}
            >
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-2 text-center">{zone.label}</div>
              {item ? (
                <div className="flex flex-col items-center gap-1">
                  {renderItemContent(item, 44)}
                </div>
              ) : (
                <span className="text-gray-300 text-2xl">+</span>
              )}
              {correct === true  && <span className="text-green-500 text-sm font-bold">✓</span>}
              {correct === false && <span className="text-red-400 text-sm font-bold">✗</span>}
            </div>
          );
        })}
      </div>

      {/* Draggable tiles — only show items not placed */}
      <div
        className="flex flex-wrap gap-2 justify-center"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {items.filter(item => !placed_ids.has(item.id)).map(item => (
          <div
            key={item.id}
            onPointerDown={e => handlePointerDown(e, item.id)}
            className="flex flex-col items-center gap-1 bg-white border-2 border-gray-200 rounded-2xl px-3 py-2 shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-all"
            style={{
              minWidth: "72px",
              cursor: "grab",
              opacity: activeItemId === item.id ? 0.4 : 1,
              touchAction: "none",
            }}
          >
            {renderItemContent(item, 40)}
          </div>
        ))}
      </div>

      {!allPlaced && !checked && (
        <p className="text-center text-xs text-gray-400">
          {remaining} {remaining === 1 ? tr("fieldMissing") : tr("fieldsMissing")}
        </p>
      )}

      {allPlaced && !checked && (
        <button
          onClick={handleCheck}
          className="w-full bg-green-600 text-white py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md"
        >
          {tr("checkAnswer")}
        </button>
      )}

      {/* Floating ghost while dragging */}
      {ghost && (() => {
        const item = items.find(i => i.id === ghost.itemId);
        if (!item) return null;
        return (
          <div
            className="fixed z-50 flex flex-col items-center gap-1 bg-white border-2 border-blue-400 rounded-2xl px-3 py-2 shadow-xl pointer-events-none"
            style={{
              left: ghost.x,
              top: ghost.y,
              width: ghost.w,
              minWidth: "72px",
              transform: "scale(1.1)",
              opacity: 0.92,
            }}
          >
            {renderItemContent(item, 40)}
          </div>
        );
      })()}
    </div>
  );
}
