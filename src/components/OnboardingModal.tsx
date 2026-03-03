"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLang } from "@/lib/LangContext";

const GRADES = [1, 2, 3];
const ONBOARDING_KEY = "cleverli_new_user";
const GRADE_KEY = "cleverli_last_grade";
const ROLE_KEY = "cleverli_role";

export default function OnboardingModal() {
  const router = useRouter();
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<"welcome" | "grade" | "explain">("welcome");
  const [grade, setGrade] = useState<number | null>(null);
  const [isParent, setIsParent] = useState(false);

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  useEffect(() => {
    const isNew = localStorage.getItem(ONBOARDING_KEY) === "true";
    const hasGrade = localStorage.getItem(GRADE_KEY);
    const role = localStorage.getItem(ROLE_KEY) ?? "";
    setIsParent(role === "parent");
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
    if (isParent) {
      router.push("/parents");
    } else if (grade) {
      router.push(`/learn/${grade}/math`);
    } else {
      router.push("/dashboard");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-6 sm:pb-0">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Welcome step */}
        {step === "welcome" && (
          <div className="p-6 text-center space-y-4">
            <Image src="/cleverli-wave.png" alt="Cleverli" width={120} height={120} className="mx-auto drop-shadow-lg" />
            <h1 className="text-2xl font-extrabold text-gray-900">
              {t("Willkommen bei Cleverli! 🎉", "Bienvenue sur Cleverli ! 🎉", "Benvenuto su Cleverli! 🎉", "Welcome to Cleverli! 🎉")}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              {isParent
                ? t("Begleite dein Kind beim Lernen. Setze Belohnungen, verfolge den Fortschritt und motiviere jeden Tag.",
                    "Accompagne ton enfant dans son apprentissage. Fixe des récompenses, suis la progression et motive chaque jour.",
                    "Accompagna il tuo figlio nell'apprendimento. Imposta premi, segui i progressi e motiva ogni giorno.",
                    "Support your child's learning. Set rewards, track progress and motivate every day.")
                : t("Hier lernst du Mathe, Deutsch und NMG — Schritt für Schritt, mit Spass und echten Belohnungen.",
                    "Ici tu apprends les maths, l'allemand et les sciences — pas à pas, avec du plaisir et de vraies récompenses.",
                    "Qui impari matematica, tedesco e scienze — passo dopo passo, con divertimento e veri premi.",
                    "Here you learn maths, German and science — step by step, with fun and real rewards.")}
            </p>
            <button
              onClick={() => isParent ? handleFinish() : setStep("grade")}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all shadow-md"
            >
              {isParent
                ? t("Zum Elternbereich →", "Vers l'espace parents →", "All'area genitori →", "To parent area →")
                : t("Los geht's! →", "C'est parti ! →", "Iniziamo! →", "Let's go! →")}
            </button>
          </div>
        )}

        {/* Grade selection step — only for children */}
        {step === "grade" && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <div className="text-3xl mb-2">🎒</div>
              <h2 className="text-xl font-bold text-gray-900">
                {t("In welcher Klasse bist du?", "Dans quelle classe es-tu ?", "In che classe sei?", "What grade are you in?")}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {t("Wir passen die Aufgaben für dich an.", "On adapte les exercices pour toi.", "Adattiamo gli esercizi per te.", "We'll adjust exercises for you.")}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {GRADES.map(g => (
                <button
                  key={g}
                  onClick={() => handleGradeSelect(g)}
                  className="bg-green-50 border-2 border-green-200 hover:border-green-500 hover:bg-green-100 active:scale-95 rounded-2xl py-5 flex flex-col items-center gap-1 font-bold text-gray-800 transition-all"
                >
                  <span className="text-3xl font-extrabold text-green-700">{g}.</span>
                  <span className="text-xs text-gray-500">{t("Klasse", "Année", "Classe", "Grade")}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Explain XP/stars step */}
        {step === "explain" && (
          <div className="p-6 text-center space-y-4">
            <div className="text-4xl">⭐</div>
            <h2 className="text-xl font-bold text-gray-900">
              {t("So funktioniert Cleverli", "Comment fonctionne Cleverli", "Come funziona Cleverli", "How Cleverli works")}
            </h2>
            <div className="space-y-3 text-left">
              {[
                {
                  icon: "⭐",
                  de: "Sammle Sterne für jedes Thema, das du abschliesst.",
                  fr: "Collecte des étoiles pour chaque thème que tu termines.",
                  it: "Colleziona stelle per ogni argomento che completi.",
                  en: "Collect stars for every topic you finish.",
                },
                {
                  icon: "⚡",
                  de: "Verdiene XP-Punkte und steige im Level auf.",
                  fr: "Gagne des XP et monte de niveau.",
                  it: "Guadagna XP e sali di livello.",
                  en: "Earn XP points and level up.",
                },
                {
                  icon: "🔥",
                  de: "Mach jeden Tag eine Aufgabe — halte deinen Streak!",
                  fr: "Fais un exercice chaque jour — garde ta série !",
                  it: "Fai un esercizio ogni giorno — mantieni la tua serie!",
                  en: "Do one exercise every day — keep your streak!",
                },
                {
                  icon: "🏆",
                  de: "Schalte Trophäen frei wenn du Meilensteine erreichst.",
                  fr: "Débloque des trophées quand tu atteins des jalons.",
                  it: "Sblocca trofei quando raggiungi i traguardi.",
                  en: "Unlock trophies when you reach milestones.",
                },
              ].map((item) => (
                <div key={item.icon} className="flex items-start gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <span className="text-sm text-gray-700">{t(item.de, item.fr, item.it, item.en)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleFinish}
              className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all shadow-md"
            >
              {t("Erste Aufgabe starten 🚀", "Commencer le premier exercice 🚀", "Inizia il primo esercizio 🚀", "Start first exercise 🚀")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
