"use client";

interface Props { current: number; total: number; streak: number; }

export default function ProgressBar({ current, total, streak }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-1 px-1">
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span className="font-medium">{current}/{total} Aufgaben</span>
        {streak >= 3 && (
          <span className="text-orange-500 font-bold animate-pulse">
            🔥 {streak}er Serie!
          </span>
        )}
        <span className="font-medium">{pct}%</span>
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
