"use client";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "@/lib/LangContext";

export default function NotFound() {
  const { lang } = useLang();
  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-5">
      <Image src="/cleverli-think.png" alt="Cleverli" width={130} height={130} className="drop-shadow-lg" />
      <h1 className="text-4xl font-extrabold text-gray-800">404</h1>
      <p className="text-gray-500 max-w-sm">
        {t(
          "Hm, diese Seite konnten wir nicht finden. Vielleicht ist sie versteckt wie ein Schatz? 🗺️",
          "Hm, nous n'avons pas trouvé cette page. Peut-être cachée comme un trésor ? 🗺️",
          "Hm, non abbiamo trovato questa pagina. Forse è nascosta come un tesoro? 🗺️",
          "Hmm, we couldn't find this page. Maybe it's hidden like treasure? 🗺️"
        )}
      </p>
      <Link href="/"
        className="bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md">
        {t("Zurück zur Startseite →", "Retour à l'accueil →", "Torna alla home →", "Back to home →")}
      </Link>
      <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 underline">
        {t("Oder direkt zum Lernen", "Ou directement apprendre", "O direttamente all'apprendimento", "Or go directly to learning")}
      </Link>
    </div>
  );
}
