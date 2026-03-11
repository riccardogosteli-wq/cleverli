"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  isOpen: boolean;
  exerciseCount: number;
}

export default function SignupPromptModal({ isOpen, exerciseCount }: Props) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (!isOpen || dismissed) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm space-y-4 text-center">
        <div className="text-5xl">🎉</div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Fantastisch! {exerciseCount} Übungen gelöst! 🌟
          </h2>
          <p className="text-sm text-gray-600">
            Du machst gute Fortschritte. Erstelle jetzt ein Konto, um deine Fortschritte zu speichern und Premium freizuschalten.
          </p>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 space-y-1 text-sm text-green-800">
          <p className="font-semibold">Mit Premium bekommst du:</p>
          <ul className="text-xs space-y-1 text-left">
            <li>✅ Alle 1000+ Übungen pro Thema</li>
            <li>✅ Deine Fortschritte speichern</li>
            <li>✅ Trophäen & Belohnungen</li>
            <li>✅ Familie einladen & vergleichen</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Link
            href="/signup"
            className="block w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-600 active:scale-95 transition-all"
          >
            Kostenlos Konto erstellen
          </Link>
          
          <button
            onClick={() => {
              setDismissed(true);
              localStorage.setItem("cleverli_signup_dismissed", "true");
            }}
            className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-300 transition-all"
          >
            Noch mehr üben (kostenlos)
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Premium kostet nur CHF 9.90/Monat
        </p>
      </div>
    </div>
  );
}
