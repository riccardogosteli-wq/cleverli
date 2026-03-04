"use client";
import { useState, useEffect } from "react";
import { useLang } from "@/lib/LangContext";
import { useSession } from "@/hooks/useSession";

interface Props { correctCount: number; }

export default function PushPrompt({ correctCount }: Props) {
  const { lang } = useLang();
  const { session } = useSession();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (correctCount >= 3 && !done) {
      const alreadyPrompted = localStorage.getItem("cleverli_push_prompted") === "true";
      if (!alreadyPrompted && "Notification" in window && Notification.permission === "default") {
        setShow(true);
      }
    }
  }, [correctCount, done]);

  if (!show || done) return null;

  const dismiss = () => {
    localStorage.setItem("cleverli_push_prompted", "true");
    setShow(false);
    setDone(true);
  };

  const subscribe = async () => {
    dismiss();
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.userId ?? null, subscription: sub }),
      });
    } catch {
      // Silently fail — push is a nice-to-have
    }
  };

  const text = {
    title: lang === "fr" ? "🔔 Activer les rappels quotidiens ?"
         : lang === "it" ? "🔔 Attivare i promemoria giornalieri ?"
         : lang === "en" ? "🔔 Enable daily reminders?"
         : "🔔 Tägliche Erinnerungen aktivieren?",
    yes: lang === "fr" ? "Oui" : lang === "it" ? "Sì" : lang === "en" ? "Yes" : "Ja",
    no:  lang === "fr" ? "Non merci" : lang === "it" ? "No grazie" : lang === "en" ? "No thanks" : "Nein danke",
  };

  return (
    <div className="fixed bottom-16 left-3 right-3 z-50 sm:bottom-4 sm:left-auto sm:right-4 sm:max-w-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex items-center gap-3">
        <div className="flex-1 text-sm font-semibold text-gray-800 leading-snug">{text.title}</div>
        <div className="flex gap-2 shrink-0">
          <button onClick={subscribe}
            className="bg-green-600 text-white text-sm font-bold px-3 py-1.5 rounded-full hover:bg-green-700 active:scale-95 transition-all">
            {text.yes}
          </button>
          <button onClick={dismiss}
            className="bg-gray-100 text-gray-500 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 active:scale-95 transition-all">
            {text.no}
          </button>
        </div>
      </div>
    </div>
  );
}
