"use client";

interface Props { current: number; total: number; streak: number; }

export default function ProgressBar({ current, total, streak }: Props) {
  // current = exercise number being shown (1-based)
  // Fill based on exercises COMPLETED (current - 1), not the exercise currently shown
  const done = current - 1;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="space-y-1 px-1">
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className="font-medium">Aufgabe {current} von {total}</span>
        {streak >= 3 && (
          <span className="text-orange-500 font-bold animate-pulse">
            🔥 {streak}er Serie!
          </span>
        )}
        <span className="font-medium text-green-600">{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
