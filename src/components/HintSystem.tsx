"use client";
import { useState } from "react";
import Image from "next/image";

interface Props { hints: string[]; }

export default function HintSystem({ hints }: Props) {
  const [shown, setShown] = useState(false);
  const [idx, setIdx] = useState(0);

  if (!hints.length) return null;

  if (!shown) {
    return (
      <button
        onClick={() => setShown(true)}
        className="w-full text-sm text-green-700 border-2 border-green-200 bg-green-50 rounded-xl px-4 py-3 hover:bg-green-100 active:scale-95 transition-all font-medium"
        style={{ minHeight: "44px" }}
      >
        💡 Tipp anzeigen
      </button>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
      <Image src="/cleverli-think.png" alt="Cleverli denkt" width={44} height={44} className="shrink-0 drop-shadow-sm" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-amber-900 font-medium leading-snug">{hints[idx]}</p>
        {idx < hints.length - 1 && (
          <button
            onClick={() => setIdx(i => i + 1)}
            className="mt-2 text-xs text-amber-700 font-semibold underline underline-offset-2 hover:text-amber-900"
          >
            Noch ein Tipp →
          </button>
        )}
        <p className="text-xs text-amber-500 mt-1">Tipp {idx + 1} / {hints.length}</p>
      </div>
    </div>
  );
}
