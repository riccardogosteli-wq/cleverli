"use client";

interface StreakMilestoneProps {
  streak: number;
  onDismiss: () => void;
  lang?: string;
}

export default function StreakMilestone({ streak, onDismiss, lang = "de" }: StreakMilestoneProps) {
  const getMessage = () => {
    if (lang === "fr") {
      if (streak === 3) return "Tu es en feu!";
      if (streak === 7) return "Une semaine entière!";
      if (streak === 14) return "Deux semaines!";
      if (streak === 30) return "Un mois – tu es une légende!";
    }
    if (lang === "it") {
      if (streak === 3) return "Sei in fiamme!";
      if (streak === 7) return "Una settimana intera!";
      if (streak === 14) return "Due settimane!";
      if (streak === 30) return "Un mese – sei una leggenda!";
    }
    if (lang === "en") {
      if (streak === 3) return "You are on fire!";
      if (streak === 7) return "A full week!";
      if (streak === 14) return "Two weeks – unstoppable!";
      if (streak === 30) return "One month – you are a legend!";
    }
    // Default: de
    if (streak === 3) return "Du bist auf Feuer! Weiter so!";
    if (streak === 7) return "Eine ganze Woche! Fantastisch!";
    if (streak === 14) return "Zwei Wochen – unaufhaltbar!";
    if (streak === 30) return "Ein ganzer Monat! Du bist eine Legende!";
    return "Großartig!";
  };

  const getButtonText = () => {
    if (lang === "fr") return "Continuer! →";
    if (lang === "it") return "Avanti! →";
    if (lang === "en") return "Continue! →";
    return "Weiter! →";
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
      onClick={onDismiss}
    >
      <div
        className="max-w-xs bg-gradient-to-b from-orange-400 to-amber-500 rounded-3xl p-8 text-center space-y-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-8xl" style={{ animation: "pulse 1s ease-in-out infinite" }}>
          🔥
        </div>
        <h2 className="text-2xl font-black text-white">
          {streak}-Tage-Streak!
        </h2>
        <p className="text-white text-base">
          {getMessage()}
        </p>
        <button
          onClick={onDismiss}
          className="bg-white text-orange-600 font-black px-8 py-3 rounded-full mt-2 hover:bg-gray-100 active:scale-95 transition-all"
        >
          {getButtonText()}
        </button>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
