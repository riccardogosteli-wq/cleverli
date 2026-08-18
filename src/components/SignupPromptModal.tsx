"use client";
import { useState } from "react";
import Link from "next/link";

interface Props {
  isOpen: boolean;
  exerciseCount: number;
}

export default function SignupPromptModal({ isOpen, exerciseCount }: Props) {
  const [dismissed, setDismissed] = useState(false);

  if (!isOpen || dismissed) return null;

  const trialSignupHref = "/signup?checkout=yearly&source=free_exercise_trial_bridge&trial=7";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm space-y-4 text-center">
        <div className="text-5xl">🎉</div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-gray-900">
            Stark! {exerciseCount} Aufgaben geschafft.
          </h2>
          <p className="text-sm text-gray-600">
            Teste jetzt 7 Tage Premium: alle Übungen, alle Klassen und dein Fortschritt werden gespeichert. Heute CHF 0.
          </p>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 space-y-1 text-sm text-green-800">
          <p className="font-semibold">Im 7-Tage-Test bekommst du:</p>
          <ul className="text-xs space-y-1 text-left">
            <li>✅ Alle Übungen und Klassen freischalten</li>
            <li>✅ Deine Fortschritte speichern</li>
            <li>✅ Bis zu 3 Kinderprofile</li>
            <li>✅ Zahlung erst nach 7 Tagen</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Link
            href={trialSignupHref}
            className="block w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-600 active:scale-95 transition-all"
          >
            7 Tage Premium gratis testen
          </Link>
          
          <button
            onClick={() => {
              setDismissed(true);
              localStorage.setItem("cleverli_signup_dismissed", "true");
            }}
            className="block w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:border-gray-300 transition-all"
          >
            Später entscheiden
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Danach CHF 99/Jahr. Vor Ablauf der 7 Tage kündbar.
        </p>
      </div>
    </div>
  );
}
