"use client";
interface Props { current: number; total: number; streak: number; }

export default function ProgressBar({ current, total, streak }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-500">
        <span>{current} / {total} Aufgaben</span>
        {streak >= 2 && <span className="text-orange-500 font-medium">🔥 {streak} richtig!</span>}
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
