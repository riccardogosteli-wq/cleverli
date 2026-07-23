"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "cleverli_cookie_consent";

const copy = {
  de: {
    text: "Wir nutzen Google Analytics und Google Ads Conversion Tracking, um zu sehen, ob Cleverli-Anzeigen funktionieren. Keine personalisierte Werbung für Kinder.",
    accept: "Analytics akzeptieren",
    decline: "Nur notwendige",
    privacy: "Datenschutz",
  },
  fr: {
    text: "Nous utilisons Google Analytics et le suivi des conversions Google Ads pour mesurer si les annonces Cleverli fonctionnent. Pas de publicité personnalisée pour les enfants.",
    accept: "Accepter Analytics",
    decline: "Nécessaires seulement",
    privacy: "Confidentialité",
  },
  it: {
    text: "Usiamo Google Analytics e il monitoraggio conversioni Google Ads per capire se gli annunci Cleverli funzionano. Nessuna pubblicità personalizzata per bambini.",
    accept: "Accetta Analytics",
    decline: "Solo necessari",
    privacy: "Privacy",
  },
  en: {
    text: "We use Google Analytics and Google Ads conversion tracking to see whether Cleverli ads work. No personalised advertising for children.",
    accept: "Accept analytics",
    decline: "Necessary only",
    privacy: "Privacy",
  },
};

export default function CookieConsent() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);
  const t = copy[lang as keyof typeof copy] ?? copy.de;

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const updateConsent = (granted: boolean) => {
    const value = granted ? "granted" : "denied";
    window.gtag?.("consent", "update", {
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: granted ? "denied" : "denied",
    });
    localStorage.setItem(CONSENT_KEY, granted ? "accepted" : "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[10000] mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:flex sm:items-center sm:gap-4">
      <p className="text-sm leading-relaxed text-gray-700 sm:flex-1">
        {t.text}{" "}
        <Link href="/datenschutz" className="font-semibold text-green-700 underline">
          {t.privacy}
        </Link>
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:flex-row">
        <button
          type="button"
          onClick={() => updateConsent(false)}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 active:scale-95"
        >
          {t.decline}
        </button>
        <button
          type="button"
          onClick={() => updateConsent(true)}
          className="rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white active:scale-95"
        >
          {t.accept}
        </button>
      </div>
    </div>
  );
}

