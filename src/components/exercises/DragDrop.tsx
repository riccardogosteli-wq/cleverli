"use client";
/**
 * DragDrop — pointer-event drag/drop (works on iOS Safari, Android, desktop).
 * Supports multiple items per zone.
 * answers format: { itemId: zoneId } (as stored in data files)
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
  answers: Record<string, string>; // itemId → zoneId
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

  // Multiple items per zone: zoneId → itemId[]
  const [placed, setPlaced] = useState<Record<string, string[]>>({});
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<Record<string, boolean>>({});  // zoneId → correct?
  const [ghost, setGhost] = useState<Ghost | null>(null);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const zoneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<Ghost | null>(null);

  // All item IDs currently placed anywhere
  const placedIds = new Set(Object.values(placed).flat());

  useEffect(() => { ghostRef.current = ghost; }, [ghost]);

  const getZoneAtPoint = useCallback((x: number, y: number): string | null => {
    for (const [zoneId, el] of Object.entries(zoneRefs.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zoneId;
    }
    return null;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent, itemId: string) => {
    if (checked) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = e.currentTarget.getBoundingClientRect();
    setGhost({ itemId, x: e.clientX - r.width / 2, y: e.clientY - r.height / 2, w: r.width, h: r.height });
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
        const next: Record<string, string[]> = {};
        // Copy all zones, removing itemId from any previous zone
        for (const z of Object.keys(prev)) {
          next[z] = (prev[z] ?? []).filter(id => id !== g.itemId);
        }
        // Add to new zone
        next[zoneId] = [...(next[zoneId] ?? []), g.itemId];
        return next;
      });
    }
    setGhost(null);
    setActiveItemId(null);
  }, [getZoneAtPoint]);

  // Remove a specific item from a zone (tap to unplace)
  const removeItem = (zoneId: string, itemId: string) => {
    if (checked) return;
    setPlaced(prev => ({ ...prev, [zoneId]: (prev[zoneId] ?? []).filter(id => id !== itemId) }));
  };

  const handleCheck = () => {
    if (checked) return;
    const res: Record<string, boolean> = {};
    let allCorrect = true;

    for (const zone of zones) {
      const inZone = placed[zone.id] ?? [];
      // Items that SHOULD be in this zone
      const expected = items.filter(item => answers[item.id] === zone.id).map(i => i.id);
      // Zone correct if: same set of items (order-independent)
      const zoneCorrect =
        inZone.length === expected.length &&
        expected.every(id => inZone.includes(id));
      res[zone.id] = zoneCorrect;
      if (!zoneCorrect) allCorrect = false;
    }

    setResult(res);
    setChecked(true);
    play(allCorrect ? "correct" : "wrong");
    setTimeout(() => onAnswer(allCorrect), 900);
  };

  const allItemsPlaced = items.every(item => placedIds.has(item.id));
  const remaining = items.length - placedIds.size;

  const renderItemContent = (item: DragItem, size = 36) => {
    const imgSize = item.image ? Math.max(size, 52) : size;
    return (
      <>
        {item.image
          ? <Image src={item.image} alt={item.label} width={imgSize} height={imgSize} className="drop-shadow-sm pointer-events-none" />
          : item.emoji
          ? <span style={{ fontSize: size * 0.75 }} className="pointer-events-none select-none">{item.emoji}</span>
          : null}
        <span className="text-xs font-semibold text-gray-700 pointer-events-none select-none text-center leading-tight">
          {item.label}
        </span>
      </>
    );
  };

  return (
    <div ref={containerRef} className="space-y-4 select-none" style={{ touchAction: "none" }}>
      <p className="text-lg sm:text-xl font-semibold text-gray-800 text-center leading-snug">{question}</p>

      {/* Drop zones */}
      <div className={`grid gap-2 ${zones.length === 2 ? "grid-cols-2" : zones.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}>
        {zones.map(zone => {
          const inZone = placed[zone.id] ?? [];
          const expectedCount = items.filter(i => answers[i.id] === zone.id).length;
          const correct = checked ? result[zone.id] : undefined;
          const hasItems = inZone.length > 0;

          return (
            <div
              key={zone.id}
              ref={el => { zoneRefs.current[zone.id] = el; }}
              className="rounded-2xl border-2 border-dashed flex flex-col gap-1.5 transition-all p-2"
              style={{
                minHeight: "90px",
                borderColor: correct === true ? "#22c55e" : correct === false ? "#ef4444" : hasItems ? "#3b82f6" : "#d1d5db",
                background: correct === true ? "#f0fdf4" : correct === false ? "#fef2f2" : hasItems ? "#eff6ff" : "#f9fafb",
              }}
            >
              {/* Zone label */}
              <div className="text-[10px] uppercase tracking-wider text-gray-400 font-bold text-center leading-tight px-1">
                {zone.label}
                {!checked && expectedCount > 1 && (
                  <span className="ml-1 text-gray-300 font-normal normal-case tracking-normal">
                    ({inZone.length}/{expectedCount})
                  </span>
                )}
              </div>

              {/* Placed items as removable chips */}
              <div className="flex flex-wrap gap-1 justify-center">
                {inZone.map(itemId => {
                  const item = items.find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <button
                      key={itemId}
                      onClick={() => removeItem(zone.id, itemId)}
                      disabled={checked}
                      className={`flex flex-col items-center gap-0.5 bg-white border rounded-xl px-2 py-1 shadow-sm transition-all ${
                        checked ? "cursor-default" : "hover:border-red-300 hover:bg-red-50 active:scale-95"
                      }`}
                      style={{ minWidth: "56px", borderColor: checked ? (correct ? "#86efac" : "#fca5a5") : "#bfdbfe" }}
                      title={checked ? undefined : "Tippe zum Entfernen"}
                    >
                      {renderItemContent(item, 32)}
                    </button>
                  );
                })}

                {/* Empty slot indicator */}
                {inZone.length === 0 && (
                  <span className="text-gray-300 text-xl self-center">+</span>
                )}
              </div>

              {/* Result indicator */}
              {correct === true  && <div className="text-green-500 text-xs font-bold text-center">✓</div>}
              {correct === false && <div className="text-red-400 text-xs font-bold text-center">✗</div>}
            </div>
          );
        })}
      </div>

      {/* Draggable tiles — only items not yet placed */}
      <div
        className="flex flex-wrap gap-2 justify-center"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {items.filter(item => !placedIds.has(item.id)).map(item => (
          <div
            key={item.id}
            onPointerDown={e => handlePointerDown(e, item.id)}
            className="flex flex-col items-center gap-1 bg-white border-2 border-gray-200 rounded-2xl px-3 py-2 shadow-sm hover:border-blue-300 hover:bg-blue-50 transition-all"
            style={{
              minWidth: "70px",
              cursor: "grab",
              opacity: activeItemId === item.id ? 0.35 : 1,
              touchAction: "none",
            }}
          >
            {renderItemContent(item, 36)}
          </div>
        ))}
      </div>

      {!allItemsPlaced && !checked && remaining > 0 && (
        <p className="text-center text-xs text-gray-400">
          {remaining} {remaining === 1 ? tr("fieldMissing") : tr("fieldsMissing")}
        </p>
      )}

      {allItemsPlaced && !checked && (
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
              minWidth: "70px",
              transform: "scale(1.12) rotate(2deg)",
              opacity: 0.93,
            }}
          >
            {renderItemContent(item, 36)}
          </div>
        );
      })()}
    </div>
  );
}
