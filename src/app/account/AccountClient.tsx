"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import { useLang } from "@/lib/LangContext";
import { clearLocalFamilyStateOnLogout } from "@/lib/accountScopedStorage";
import ParentPinGate from "@/components/ParentPinGate";

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
  const [cancelState, setCancelState] = useState<"idle" | "confirm" | "loading" | "offer-loading" | "retained" | "done" | "error">("idle");
  const [cancelError, setCancelError] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelComment, setCancelComment] = useState("");

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  const cancellationReasons = [
    {
      value: "too_expensive",
      label: t("Zu teuer", "Trop cher", "Troppo caro", "Too expensive"),
    },
    {
      value: "child_not_using",
      label: t("Mein Kind nutzt es zu wenig", "Mon enfant ne l'utilise pas assez", "Mio figlio lo usa troppo poco", "My child is not using it enough"),
    },
    {
      value: "missing_content",
      label: t("Ich finde nicht die passenden Aufgaben", "Je ne trouve pas les bons exercices", "Non trovo gli esercizi adatti", "I cannot find the right exercises"),
    },
    {
      value: "level_mismatch",
      label: t("Die Aufgaben passen nicht zum Niveau", "Les exercices ne correspondent pas au niveau", "Gli esercizi non sono del livello giusto", "The exercises do not fit the level"),
    },
    {
      value: "technical_issue",
      label: t("Technisches Problem", "Problème technique", "Problema tecnico", "Technical issue"),
    },
    {
      value: "pause_or_alternative",
      label: t("Pause oder andere Lösung", "Pause ou autre solution", "Pausa o altra soluzione", "Break or another solution"),
    },
    {
      value: "other",
      label: t("Anderer Grund", "Autre raison", "Altro motivo", "Other reason"),
    },
  ];

  const handleLogout = async () => {
    const supabase = getSupabase();
    localStorage.removeItem("cleverli_session");
    clearLocalFamilyStateOnLogout();
    if (supabase) await supabase.auth.signOut();
    router.push("/");
  };

  const handleChangePassword = async () => {
    if (newPw.length < 6) { setPwError(t("Min. 6 Zeichen.", "Min. 6 car.", "Min. 6 car.", "Min. 6 chars.")); return; }
    if (newPw !== confirmPw) { setPwError(t("Passwörter stimmen nicht überein.", "Mots de passe différents.", "Password diverse.", "Passwords don't match.")); return; }
    setPwLoading(true);
    setPwError("");
    try {
      const supabase = getSupabase();
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
    const supabase = getSupabase();
    if (!session?.email || !supabase) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin || "https://www.cleverli.ch";
    await supabase.auth.resetPasswordForEmail(session.email, {
      redirectTo: `${baseUrl}/reset-password?mode=update`,
    });
    setResetSent(true);
  };

  const handleCancel = async () => {
    if (cancelState === "idle") { setCancelState("confirm"); return; }
    if (cancelState !== "confirm") return;
    setCancelState("loading");
    try {
      const supabase = getSupabase();
      const { data: authData } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
      const token = authData.session?.access_token;
      if (!token) throw new Error("unauthorized");

      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: session?.userId,
          cancellationReason: cancelReason || "not_provided",
          cancellationComment: cancelComment,
          retentionOfferShown: cancelReason === "too_expensive",
        }),
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

  const handleRetentionOffer = async () => {
    setCancelState("offer-loading");
    setCancelError("");
    try {
      const supabase = getSupabase();
      const { data: authData } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
      const token = authData.session?.access_token;
      if (!token) throw new Error("unauthorized");

      const res = await fetch("/api/retention-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: session?.userId }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "unknown");
      setCancelState("retained");
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
          <Link href="/login" className="inline-block bg-green-700 text-white px-6 py-3 rounded-full font-bold">
            {t("Einloggen", "Se connecter", "Accedi", "Log in")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ParentPinGate>
    <div className="min-h-screen bg-green-50 px-4 py-8 pb-24">
      <div className="max-w-sm mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" aria-label={t("Zurück zum Dashboard", "Retour au tableau de bord", "Torna alla dashboard", "Back to dashboard")} className="inline-flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-gray-600 text-sm">←</Link>
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
            {session.premium ? t("👑 Premium aktiv", "👑 Premium actif", "👑 Premium attivo", "👑 Premium active") : t("🔓 Gratis-Konto", "🔓 Compte gratuit", "🔓 Account gratuito", "🔓 Free account")}
            {!session.premium && (
              <Link href="/upgrade" className="ml-auto inline-flex min-h-11 items-center text-xs text-green-700 underline font-normal">
                {t("Upgrade →", "Passer Premium →", "Upgrade →", "Upgrade →")}
              </Link>
            )}
          </div>
        </div>

        {/* ── Billing section ── */}
        {session.premium ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {session.premiumPlan === "schooltime"
                ? t("Premium-Zugang", "Accès Premium", "Accesso Premium", "Premium access")
                : t("Abonnement", "Abonnement", "Abbonamento", "Subscription")}
            </div>

            {/* Active plan info */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-gray-800 text-sm">👑 {t("Premium aktiv", "Premium actif", "Premium attivo", "Premium active")}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {session.premiumPlan === "schooltime"
                    ? t("Einmal bezahlt · Keine Verlängerung", "Payé une fois · Sans renouvellement", "Pagato una volta · Nessun rinnovo", "Paid once · No renewal")
                    : t("Verwaltet über Stripe · Jederzeit kündbar",
                     "Géré via Stripe · Résiliable à tout moment",
                     "Gestito via Stripe · Annullabile in qualsiasi momento",
                     "Managed via Stripe · Cancel anytime")}
                </div>
              </div>
              <span className="text-xl">✅</span>
            </div>

            {/* Cancel flow */}
            {session.premiumPlan === "schooltime" ? (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-800">
                <div className="font-black">✅ {t("Lebenslanger Zugang freigeschaltet", "Accès à vie débloqué", "Accesso a vita sbloccato", "Lifetime access unlocked")}</div>
                <div className="mt-1 text-xs leading-5">
                  {t("Alle Klassen 1–6, für bis zu 3 Kinderprofile. Es folgen keine weiteren Abbuchungen.", "Toutes les années 1–6, pour jusqu’à 3 profils enfants. Aucun autre prélèvement.", "Tutte le classi 1–6, fino a 3 profili bambino. Nessun altro addebito.", "All grades 1–6, for up to 3 child profiles. No further charges.")}
                </div>
              </div>
            ) : cancelState === "retained" ? (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm text-green-800">
                <div className="font-black">✅ {t("CHF 66/Jahr gesichert", "CHF 66/an confirmé", "CHF 66/anno confermato", "CHF 66/year confirmed")}</div>
                <div className="mt-1 text-xs leading-5">
                  {t("Der neue Jahrespreis gilt ab deiner nächsten Verlängerung.", "Le nouveau prix annuel s'appliquera dès ton prochain renouvellement.", "Il nuovo prezzo annuale si applicherà dal prossimo rinnovo.", "The new yearly price starts at your next renewal.")}
                </div>
              </div>
            ) : cancelState === "done" ? (
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 text-center">
                ✅ {t("Gekündigt. Zugang bis Ablauf der Laufzeit aktiv.", "Résilié. Accès actif jusqu'à la fin de la période.", "Annullato. Accesso attivo fino alla fine del periodo.", "Cancelled. Access remains active until the period ends.")}
              </div>
            ) : cancelState === "loading" || cancelState === "offer-loading" ? (
              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-semibold text-gray-600 text-center">
                {cancelState === "offer-loading"
                  ? t("Angebot wird aktiviert …", "Activation de l'offre …", "Attivazione dell'offerta …", "Activating offer …")
                  : t("Kündigung wird verarbeitet …", "Résiliation en cours …", "Annullamento in corso …", "Cancelling …")}
              </div>
            ) : cancelState === "error" ? (
              <div className="space-y-2">
                <div className="bg-red-50 text-red-600 text-xs rounded-xl px-3 py-2">
                  ❌ {cancelError || t("Fehler beim Kündigen.", "Erreur d'annulation.", "Errore annullamento.", "Cancellation error.")}
                </div>
                <button onClick={() => setCancelState("idle")} className="min-h-11 w-full text-xs text-gray-400 underline">
                  {t("Zurück", "Retour", "Indietro", "Back")}
                </button>
              </div>
            ) : cancelState === "confirm" ? (
              <div className="space-y-4 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-black text-gray-800">
                    {t("Kurz bevor du kündigst:", "Juste avant de résilier :", "Prima di annullare:", "Before you cancel:")}
                  </p>
                  <p className="text-xs leading-5 text-gray-600">
                    {t("Was ist der wichtigste Grund? Dein Zugang läuft bis zum Ende der bezahlten Laufzeit weiter.",
                       "Quelle est la raison principale ? L'accès reste actif jusqu'à la fin de la période payée.",
                       "Qual è il motivo principale? L'accesso rimane attivo fino alla fine del periodo pagato.",
                       "What is the main reason? Your access remains active until the end of the paid period.")}
                  </p>
                </div>

                <div className="grid gap-1.5">
                  {cancellationReasons.map(reason => (
                    <button
                      key={reason.value}
                      type="button"
                      onClick={() => setCancelReason(reason.value)}
                      className={`min-h-11 w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                        cancelReason === reason.value
                          ? "border-green-500 bg-white text-green-800 shadow-sm"
                          : "border-gray-200 bg-white/80 text-gray-600 hover:border-green-200 hover:text-gray-800"
                      }`}
                    >
                      {reason.label}
                    </button>
                  ))}
                </div>

                {cancelReason && (
                  <textarea
                    value={cancelComment}
                    onChange={event => setCancelComment(event.target.value.slice(0, 500))}
                    rows={2}
                    placeholder={t("Optional: Was hätten wir besser machen können?",
                                    "Optionnel : qu'aurions-nous pu améliorer ?",
                                    "Opzionale: cosa avremmo potuto fare meglio?",
                                    "Optional: what could we have done better?")}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-400"
                  />
                )}

                {cancelReason === "too_expensive" && (
                  <div className="rounded-2xl border-2 border-green-300 bg-white p-4 shadow-sm">
                    <div className="text-xs font-black uppercase tracking-wider text-green-700">
                      {t("Persönliches Angebot", "Offre personnelle", "Offerta personale", "Personal offer")}
                    </div>
                    <p className="mt-1 text-lg font-black text-gray-900">
                      {t("Bleib für CHF 66/Jahr", "Reste pour CHF 66/an", "Resta per CHF 66/anno", "Stay for CHF 66/year")}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {t("Statt CHF 99/Jahr. Der neue Preis gilt ab deiner nächsten Verlängerung und bleibt danach bei CHF 66/Jahr.",
                         "Au lieu de CHF 99/an. Le nouveau prix s'applique dès ton prochain renouvellement et reste ensuite à CHF 66/an.",
                         "Invece di CHF 99/anno. Il nuovo prezzo si applica dal prossimo rinnovo e resta poi CHF 66/anno.",
                         "Instead of CHF 99/year. The new price starts at your next renewal and remains CHF 66/year after that.")}
                    </p>
                    <button
                      type="button"
                      onClick={handleRetentionOffer}
                      className="mt-3 min-h-11 w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-black text-white hover:bg-green-800"
                    >
                      {t("CHF 66/Jahr sichern", "Confirmer CHF 66/an", "Conferma CHF 66/anno", "Confirm CHF 66/year")}
                    </button>
                  </div>
                )}

                <button onClick={handleCancel} disabled={false}
                  className="min-h-11 w-full bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-red-600 disabled:opacity-60">
                  {cancelReason === "too_expensive"
                    ? t("Trotzdem kündigen", "Résilier quand même", "Annulla comunque", "Cancel anyway")
                    : t("Kündigung abschliessen", "Confirmer la résiliation", "Conferma annullamento", "Confirm cancellation")}
                </button>
                <button onClick={() => setCancelState("idle")}
                  className="min-h-11 w-full border-2 border-gray-200 text-gray-500 py-2 rounded-xl text-sm">
                  {t("Doch behalten", "Garder l'abonnement", "Mantieni abbonamento", "Keep subscription")}
                </button>
              </div>
            ) : (
              <button
                onClick={handleCancel}
                className="min-h-11 w-full border-2 border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-medium hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
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
              {t("Du nutzt Cleverli aktuell kostenlos.",
                 "Tu utilises actuellement Cleverli gratuitement.",
                 "Attualmente usi Cleverli gratuitamente.",
                 "You're currently using Cleverli for free.")}
            </div>
            <Link href="/upgrade"
              className="block min-h-11 text-center bg-green-700 text-white font-bold py-3 rounded-xl text-sm hover:bg-green-700 active:scale-95 transition-all">
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
              className="inline-flex min-h-11 items-center text-xs text-green-700 underline font-semibold">
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
              {pwDone && <p className="text-green-700 text-xs font-semibold">✅ {t("Passwort geändert!", "Mot de passe changé !", "Password cambiata!", "Password updated!")}</p>}
              <button onClick={handleChangePassword} disabled={pwLoading}
                className="min-h-11 w-full bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-green-700 disabled:opacity-60">
                {pwLoading ? "…" : t("Speichern", "Enregistrer", "Salva", "Save")}
              </button>

              <div className="text-center">
                <button onClick={handleSendReset} className="inline-flex min-h-11 items-center text-xs text-gray-400 underline hover:text-gray-600">
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
            className="min-h-11 w-full border-2 border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">
            {t("Abmelden", "Se déconnecter", "Disconnetti", "Log out")}
          </button>
        </div>

        {/* Nav links */}
        <div className="flex gap-3">
          <Link href="/parents" className="flex-1 min-h-11 text-center border border-gray-200 text-gray-500 py-2.5 rounded-full text-sm font-medium">
            📊 {t("Eltern-Übersicht", "Vue parents", "Vista genitori", "Parent view")}
          </Link>
          <Link href="/dashboard" className="flex-1 min-h-11 text-center bg-green-700 text-white py-2.5 rounded-full text-sm font-bold">
            🎒 {t("Üben", "Pratiquer", "Esercitati", "Practice")}
          </Link>
        </div>

      </div>
    </div>
    </ParentPinGate>
  );
}
