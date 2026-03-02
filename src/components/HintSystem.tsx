"use client";
import { useState } from "react";
import CleverliMascot from "./CleverliMascot";

interface Props { hints: string[]; }

export default function HintSystem({ hints }: Props) {
  const [shown, setShown] = useState(false);
  const [idx, setIdx] = useState(0);

  const next = () => { if (idx < hints.length - 1) setIdx(i => i + 1); };

  if (!shown) {
    return (
      <button onClick={() => setShown(true)} className="text-sm text-green-600 border border-green-300 rounded-full px-3 py-1 hover:bg-green-50 transition-colors">
        💡 Tipp anzeigen
      </button>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-3">
      <CleverliMascot size={50} mood="thinking" />
      <div className="flex-1">
        <p className="text-sm text-yellow-800 font-medium">{hints[idx]}</p>
        {idx < hints.length - 1 && (
          <button onClick={next} className="mt-1 text-xs text-yellow-600 underline">Noch ein Tipp →</button>
        )}
      </div>
    </div>
  );
}
