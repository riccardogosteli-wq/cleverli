"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const GRADES = [1, 2, 3];
const ONBOARDING_KEY = "cleverli_new_user";
const GRADE_KEY = "cleverli_last_grade";

export default function OnboardingModal() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"welcome" | "grade" | "explain">("welcome");
  const [grade, setGrade] = useState<number | null>(null);

  useEffect(() => {
    const isNew = localStorage.getItem(ONBOARDING_KEY) === "true";
    const hasGrade = localStorage.getItem(GRADE_KEY);
    // Show if new user (came from signup) OR first ever visit with no grade set
    if (isNew || !hasGrade) setVisible(true);
  }, []);

  const handleGradeSelect = (g: number) => {
    setGrade(g);
    localStorage.setItem(GRADE_KEY, String(g));
    setStep("explain");
  };

  const handleFinish = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setVisible(false);
    // Route straight to their grade's math topic (first topic)
    if (grade) router.push(`/learn/${grade}/math`);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-6 sm:pb-0">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Welcome step */}
        {step === "welcome" && (
          <div className="p-6 text-center space-y-4">
            <Image src="/cleverli-wave.png" alt="Cleverli" width={120} height={120} className="mx-auto drop-shadow-lg" />
            <h1 className="text-2xl font-extrabold text-gray-900">Willkommen bei Cleverli! 🎉</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Hier lernst du Mathe, Deutsch und NMG — Schritt für Schritt, mit Spass und echten Belohnungen.
            </p>
            <button
              onClick={() => setStep("grade")}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all shadow-md"
            >
              Los geht's! →
            </button>
          </div>
        )}

        {/* Grade selection step */}
        {step === "grade" && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎒</div>
              <h2 className="text-xl font-bold text-gray-900">In welcher Klasse bist du?</h2>
              <p className="text-gray-400 text-sm mt-1">Wir passen die Aufgaben für dich an.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {GRADES.map(g => (
                <button
                  key={g}
                  onClick={() => handleGradeSelect(g)}
                  className="bg-green-50 border-2 border-green-200 hover:border-green-500 hover:bg-green-100 active:scale-95 rounded-2xl py-5 flex flex-col items-center gap-1 font-bold text-gray-800 transition-all"
                >
                  <span className="text-3xl font-extrabold text-green-700">{g}.</span>
                  <span className="text-xs text-gray-500">Klasse</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Explain XP/stars step */}
        {step === "explain" && (
          <div className="p-6 text-center space-y-4">
            <div className="text-4xl">⭐</div>
            <h2 className="text-xl font-bold text-gray-900">So funktioniert Cleverli</h2>
            <div className="space-y-3 text-left">
              {[
                { icon: "⭐", text: "Sammle Sterne für jedes Thema, das du abschliesst." },
                { icon: "⚡", text: "Verdiene XP-Punkte und steige im Level auf." },
                { icon: "🔥", text: "Mach jeden Tag eine Aufgabe — halte deinen Streak!" },
                { icon: "🏆", text: "Schalte Trophäen frei wenn du Meilensteine erreichst." },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-start gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-xl shrink-0">{icon}</span>
                  <span className="text-sm text-gray-700">{text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleFinish}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all shadow-md"
            >
              Erste Aufgabe starten 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
