"use client";
import CleverliMascot from "./CleverliMascot";

interface Props { correct: boolean; onContinue: () => void; label?: string; }

export default function RewardAnimation({ correct, onContinue, label }: Props) {
  return (
    <div className={`rounded-2xl p-4 text-center ${correct ? "bg-green-50 border-2 border-green-200" : "bg-orange-50 border-2 border-orange-200"}`}>
      <CleverliMascot size={80} mood={correct ? "celebrate" : "thinking"} />
      <p className={`text-xl font-bold mt-2 ${correct ? "text-green-700" : "text-orange-600"}`}>
        {correct ? "Richtig! 🎉" : "Fast! Versuch nochmal 💪"}
      </p>
      {label && <p className="text-sm text-gray-500 mt-1">{label}</p>}
      <button onClick={onContinue} className="mt-3 bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors">
        Weiter →
      </button>
    </div>
  );
}
