"use client";
import { useEffect, useState } from "react";
import { Achievement, RARITY_COLORS } from "@/lib/achievements";
import { useLang } from "@/lib/LangContext";

interface Props { achievement: Achievement; onDone: () => void; }

export default function AchievementToast({ achievement, onDone }: Props) {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  const title =
    lang === "fr" ? achievement.titleFr :
    lang === "it" ? achievement.titleIt :
    lang === "en" ? achievement.titleEn :
    achievement.title;

  const desc =
    lang === "fr" ? achievement.descFr :
    lang === "it" ? achievement.descIt :
    lang === "en" ? achievement.descEn :
    achievement.desc;

  useEffect(() => {
    const t0 = setTimeout(() => setVisible(true), 50);
    const t1 = setTimeout(() => setVisible(false), 3200);
    const t2 = setTimeout(onDone, 3600);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const rarityLabel: Record<Achievement["rarity"], Record<string, string>> = {
    common:    { de: "Gewöhnlich", fr: "Commun", it: "Comune", en: "Common" },
    rare:      { de: "Selten",     fr: "Rare",   it: "Raro",   en: "Rare" },
    epic:      { de: "Episch",     fr: "Épique", it: "Epico",  en: "Epic" },
    legendary: { de: "Legendär",   fr: "Légendaire", it: "Leggendario", en: "Legendary" },
  };

  const bgGrad = RARITY_COLORS[achievement.rarity];

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(120px)",
        transition: "transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.3s",
        opacity: visible ? 1 : 0,
        zIndex: 9998,
        minWidth: "280px",
        maxWidth: "calc(100vw - 32px)",
        pointerEvents: "none",
      }}
    >
      <div className={`bg-gradient-to-r ${bgGrad} border-2 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3`}>
        <div className="text-4xl shrink-0">{achievement.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
            🏆 {lang === "de" ? "Erfolg freigeschaltet!" : lang === "fr" ? "Succès débloqué !" : lang === "it" ? "Traguardo sbloccato!" : "Achievement unlocked!"}
          </div>
          <div className="font-bold text-gray-800 text-sm leading-tight">{title}</div>
          <div className="text-xs text-gray-500 leading-snug">{desc}</div>
          {achievement.xpReward > 0 && (
            <div className="text-xs text-green-600 font-semibold mt-0.5">+{achievement.xpReward} XP</div>
          )}
        </div>
        <div className="text-[10px] text-gray-400 uppercase font-bold shrink-0">
          {rarityLabel[achievement.rarity][lang] ?? rarityLabel[achievement.rarity]["de"]}
        </div>
      </div>
    </div>
  );
}
