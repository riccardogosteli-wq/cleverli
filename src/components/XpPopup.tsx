"use client";
import { useEffect, useState } from "react";

interface Props { xp: number; onDone: () => void; }

export default function XpPopup({ xp, onDone }: Props) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300); }, 1800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      style={{
        position: "fixed", top: "80px", right: "16px", zIndex: 9999,
        transition: "opacity 0.3s, transform 0.3s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-12px)",
        pointerEvents: "none",
      }}
    >
      <div className="bg-green-500 text-white font-bold px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-1.5">
        <span>⚡</span>
        <span>+{xp} XP</span>
      </div>
    </div>
  );
}
