"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { useLang } from "@/lib/LangContext";

export default function AccountPage() {
  const { session, loaded } = useSession();
  const { lang } = useLang();
  const router = useRouter();
  const [pwMode, setPwMode] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwDone, setPwDone] = useState(false);
  const [pwError, setPwError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // Billing
  const [cancelState, setCancelState] = useState<"idle" | "confirm" | "loading" | "done" | "error">("idle");
  const [cancelError, setCancelError] = useState("");

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("cleverli_session");
    router.push("/");
  };

  const handleChangePassword = async () => {
    if (newPw.length < 6) { setPwError(t("Min. 6 Zeichen.", "Min. 6 car.", "Min. 6 car.", "Min. 6 chars.")); return; }
    if (newPw !== confirmPw) { setPwError(t("Passwörter stimmen nicht überein.", "Mots de passe différents.", "Password diverse.", "Passwords don't match.")); return; }
    setPwLoading(true);
    setPwError("");
    try {
      if (!supabase) throw new Error("Auth unavailable");
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setPwDone(true);
      setTimeout(() => { setPwMode(false); setPwDone(false); setNewPw(""); setConfirmPw(""); }, 2000);
    } catch (e: unknown) {
      setPwError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setPwLoading(false);
    }
  };

  const handleSendReset = async () => {
    if (!session?.email || !supabase) return;
    await supabase.auth.resetPasswordForEmail(session.email, {
      redirectTo: `${window.location.origin}/reset-password?mode=update`,
    });
    setResetSent(true);
  };

  const handleCancel = async () => {
    if (cancelState === "idle") { setCancelState("confirm"); return; }
    if (cancelState !== "confirm") return;
    setCancelState("loading");
    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.userId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "unknown");
      setCancelState("done");
      // Refresh session after a short delay so premium badge updates
      setTimeout(() => window.location.reload(), 1500);
    } catch (e: unknown) {
      setCancelError(e instanceof Error ? e.message : "Fehler");
      setCancelState("error");
    }
  };

  if (!loaded) return (
    <div className="flex items-center justify-center min-h-screen">
      <span className="text-4xl animate-pulse">👤</span>
    </div>
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-gray-600">{t("Bitte zuerst einloggen.", "Connecte-toi d'abord.", "Accedi prima.", "Please log in first.")}</p>
          <Link href="/login" className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-bold">
            {t("Einloggen", "Se connecter", "Accedi", "Log in")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8 pb-24">
      <div className="max-w-sm mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600 text-sm">←</Link>
          <h1 className="text-xl font-black text-gray-800">
            {t("Mein Konto", "Mon compte", "Il mio account", "My Account")}
          </h1>
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <div className="font-bold text-gray-800">{session.name || "Elternteil"}</div>
              <div className="text-sm text-gray-400">{session.email}</div>
            </div>
          </div>

          {/* Premium badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${
            session.premium
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-gray-50 text-gray-500 border border-gray-100"
          }`}>
            {session.premium ? "👑 Premium aktiv" : "🔓 Gratis-Konto"}
            {!session.premium && (
              <Link href="/upgrade" className="ml-auto text-xs text-green-600 underline font-normal">
                {t("Upgrade →", "Passer Premium →", "Upgrade →", "Upgrade →")}
              </Link>
            )}
          </div>
        </div>

        {/* ── Billing section ── */}
        {session.premium ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t("Abonnement", "Abonnement", "Abbonamento", "Subscription")}
            </div>

            {/* Active plan info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-800 text-sm">👑 {t("Premium aktiv", "Premium actif", "Premium attivo", "Premium active")}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {t("Verwaltet über Payrexx · Jederzeit kündbar",
                     "Géré via Payrexx · Résiliable à tout moment",
                     "Gestito via Payrexx · Annullabile in qualsiasi momento",
                     "Managed via Payrexx · Cancel anytime")}
                </div>
              </div>
              <span className="text-xl">✅</span>
            </div>

            {/* Cancel flow */}
            {cancelState === "done" ? (
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 text-center">
                ✅ {t("Gekündigt. Zugang läuft aus.", "Résilié. L'accès expire bientôt.", "Annullato. L'accesso scade.", "Cancelled. Access will expire.")}
              </div>
            ) : cancelState === "error" ? (
              <div className="space-y-2">
                <div className="bg-red-50 text-red-600 text-xs rounded-xl px-3 py-2">
                  ❌ {cancelError || t("Fehler beim Kündigen.", "Erreur d'annulation.", "Errore annullamento.", "Cancellation error.")}
                </div>
                <button onClick={() => setCancelState("idle")} className="w-full text-xs text-gray-400 underline">
                  {t("Zurück", "Retour", "Indietro", "Back")}
                </button>
              </div>
            ) : cancelState === "confirm" ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">
                  {t("Wirklich kündigen? Dein Zugang endet sofort.",
                     "Vraiment résilier ? L'accès s'arrête immédiatement.",
                     "Vuoi davvero annullare? L'accesso termina subito.",
                     "Really cancel? Your access ends immediately.")}
                </p>
                <button onClick={handleCancel} disabled={false}
                  className="w-full bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-600 disabled:opacity-60">
                  {t("Ja, kündigen", "Oui, résilier", "Sì, annulla", "Yes, cancel")}
                </button>
                <button onClick={() => setCancelState("idle")}
                  className="w-full border-2 border-gray-200 text-gray-500 py-2 rounded-xl text-sm">
                  {t("Abbrechen", "Annuler", "Annulla", "Keep subscription")}
                </button>
              </div>
            ) : (
              <button
                onClick={handleCancel}
                className="w-full border-2 border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-medium hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                {t("Abonnement kündigen", "Résilier l'abonnement", "Annulla abbonamento", "Cancel subscription")}
              </button>
            )}
          </div>
        ) : (
          /* Upsell for free users */
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-200 p-5 space-y-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t("Abonnement", "Abonnement", "Abbonamento", "Subscription")}
            </div>
            <div className="text-sm text-gray-600">
              {t("Du nutzt die Gratis-Version mit 3 Aufgaben pro Thema.",
                 "Tu utilises la version gratuite avec 3 exercices par thème.",
                 "Stai usando la versione gratuita con 3 esercizi per argomento.",
                 "You're on the free plan with 3 exercises per topic.")}
            </div>
            <Link href="/upgrade"
              className="block text-center bg-green-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-green-700 active:scale-95 transition-all">
              ⭐ {t("Jetzt auf Premium upgraden →", "Passer à Premium →", "Passa a Premium →", "Upgrade to Premium →")}
            </Link>
          </div>
        )}

        {/* Change password */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800 text-sm">
                {t("Passwort", "Mot de passe", "Password", "Password")}
              </div>
              <div className="text-xs text-gray-400">••••••••</div>
            </div>
            <button onClick={() => { setPwMode(m => !m); setPwError(""); }}
              className="text-xs text-green-600 underline font-semibold">
              {pwMode ? t("Abbrechen", "Annuler", "Annulla", "Cancel") : t("Ändern", "Modifier", "Modifica", "Change")}
            </button>
          </div>

          {pwMode && (
            <div className="space-y-3 pt-1">
              <input type="password" value={newPw}
                onChange={e => { setNewPw(e.target.value); setPwError(""); }}
                placeholder={t("Neues Passwort", "Nouveau mot de passe", "Nuova password", "New password")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
              />
              <input type="password" value={confirmPw}
                onChange={e => { setConfirmPw(e.target.value); setPwError(""); }}
                placeholder={t("Bestätigen", "Confirmer", "Conferma", "Confirm")}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                onKeyDown={e => e.key === "Enter" && handleChangePassword()}
              />
              {pwError && <p className="text-red-500 text-xs">{pwError}</p>}
              {pwDone && <p className="text-green-600 text-xs font-semibold">✅ {t("Passwort geändert!", "Mot de passe changé !", "Password cambiata!", "Password updated!")}</p>}
              <button onClick={handleChangePassword} disabled={pwLoading}
                className="w-full bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-green-700 disabled:opacity-60">
                {pwLoading ? "…" : t("Speichern", "Enregistrer", "Salva", "Save")}
              </button>

              <div className="text-center">
                <button onClick={handleSendReset} className="text-xs text-gray-400 underline hover:text-gray-600">
                  {resetSent
                    ? t("✅ Reset-Link gesendet!", "✅ Lien envoyé !", "✅ Link inviato!", "✅ Reset link sent!")
                    : t("Per E-Mail zurücksetzen →", "Réinitialiser par e-mail →", "Reimposta per e-mail →", "Reset by email →")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {t("Konto", "Compte", "Account", "Account")}
          </div>
          <button onClick={handleLogout}
            className="w-full border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">
            {t("Abmelden", "Se déconnecter", "Disconnetti", "Log out")}
          </button>
        </div>

        {/* Nav links */}
        <div className="flex gap-3">
          <Link href="/parents" className="flex-1 text-center border border-gray-200 text-gray-500 py-2.5 rounded-full text-sm font-medium">
            📊 {t("Eltern-Übersicht", "Vue parents", "Vista genitori", "Parent view")}
          </Link>
          <Link href="/dashboard" className="flex-1 text-center bg-green-600 text-white py-2.5 rounded-full text-sm font-bold">
            🎒 {t("Üben", "Pratiquer", "Esercitati", "Practice")}
          </Link>
        </div>

      </div>
    </div>
  );
}
