"use client";
import { useState } from "react";
import Image from "next/image";
import { useSound } from "@/hooks/useSound";
import { useVoice } from "@/hooks/useVoice";
import { useLang } from "@/lib/LangContext";

interface Props { hints: string[]; onHintUsed?: () => void; }

export default function HintSystem({ hints, onHintUsed }: Props) {
  const [shown, setShown] = useState(false);
  const [idx, setIdx] = useState(0);
  const { play } = useSound();
  const { speak, isSupported } = useVoice();
  const { tr } = useLang();

  if (!hints.length) return null;

  if (!shown) {
    return (
      <button
        onClick={() => { play("hint"); setShown(true); onHintUsed?.(); }}
        className="w-full text-sm text-green-700 border-2 border-green-200 bg-green-50 rounded-xl px-4 py-3 hover:bg-green-100 active:scale-95 transition-all font-medium"
        style={{ minHeight: "44px" }}
      >
        {tr("showHint")}
      </button>
    );
  }

  return (
    <div className="flex items-start gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl p-3">
      <Image src="/cleverli-think.png" alt="Cleverli" width={44} height={44} className="shrink-0 drop-shadow-sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <p className="text-sm text-amber-900 font-medium leading-snug flex-1">{hints[idx]}</p>
          {isSupported && (
            <button
              onClick={() => speak(hints[idx])}
              className="shrink-0 text-amber-700 hover:text-amber-900 transition-colors p-1 rounded hover:bg-amber-100"
              title={tr("readAloud") ?? "Vorlesen"}
              style={{ minHeight: "32px", minWidth: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              🔊
            </button>
          )}
        </div>
        {idx < hints.length - 1 && (
          <button
            onClick={() => { play("hint"); setIdx(i => i + 1); onHintUsed?.(); }}
            className="mt-2 text-xs text-amber-700 font-semibold underline underline-offset-2 hover:text-amber-900"
          >
            {tr("nextHint")}
          </button>
        )}
        <p className="text-xs text-amber-500 mt-1">{tr("hintCounter")} {idx + 1} / {hints.length}</p>
      </div>
    </div>
  );
}
