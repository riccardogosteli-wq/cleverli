"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Level } from "@/lib/xp";
import { useLang } from "@/lib/LangContext";

interface Props { level: Level; onDone: () => void; }

export default function LevelUpOverlay({ level, onDone }: Props) {
  const { lang } = useLang();
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  const title =
    lang === "fr" ? level.titleFr :
    lang === "it" ? level.titleIt :
    lang === "en" ? level.titleEn :
    level.title;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 2800);
    const t3 = setTimeout(onDone, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        transition: "opacity 0.35s",
        opacity: phase === "out" ? 0 : 1,
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
      onClick={onDone}
    >
      <div
        style={{
          textAlign: "center",
          transition: "transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.35s",
          transform: phase === "in" ? "scale(0.5)" : "scale(1)",
          opacity: phase === "in" ? 0 : 1,
        }}
      >
        <div className="text-7xl mb-3" style={{ filter: "drop-shadow(0 0 24px gold)" }}>
          {level.emoji}
        </div>
        <div className="text-white text-2xl font-black mb-1 drop-shadow-lg">
          {lang === "de" ? "Level Up!" : lang === "fr" ? "Niveau Supérieur !" : lang === "it" ? "Livello Superiore!" : "Level Up!"}
        </div>
        <div
          className="text-white text-3xl font-black drop-shadow-lg"
          style={{ textShadow: `0 0 20px ${level.color}` }}
        >
          {title}
        </div>
        <div className="mt-4">
          <Image src="/cleverli-jump-star.png" alt="Cleverli" width={100} height={100} className="mx-auto drop-shadow-2xl" />
        </div>
        <p className="text-white/70 text-sm mt-3">
          {lang === "de" ? "Tippe um weiterzumachen" : lang === "fr" ? "Appuie pour continuer" : lang === "it" ? "Tocca per continuare" : "Tap to continue"}
        </p>
      </div>
    </div>
  );
}
