"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import { useLang } from "@/lib/LangContext";

// ── Request reset (step 1) ───────────────────────────────────────────────────

function RequestReset() {
  const { lang } = useLang();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  const handleRequest = async () => {
    if (!email.includes("@")) { setError(t("Bitte gültige E-Mail eingeben.", "E-mail invalide.", "E-mail non valida.", "Invalid email.")); return; }
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Auth unavailable");
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?mode=update`,
      });
      if (err) throw err;
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="text-center space-y-4">
      <div className="text-5xl">📬</div>
      <h2 className="text-xl font-black text-gray-800">
        {t("E-Mail gesendet!", "E-mail envoyé !", "E-mail inviata!", "Email sent!")}
      </h2>
      <p className="text-sm text-gray-500">
        {t(
          `Wir haben einen Reset-Link an ${email} gesendet. Prüfe auch deinen Spam-Ordner.`,
          `Lien envoyé à ${email}. Vérifie tes spams.`,
          `Link inviato a ${email}. Controlla lo spam.`,
          `We sent a reset link to ${email}. Check your spam folder too.`,
        )}
      </p>
      <Link href="/login" className="inline-block text-sm text-green-700 underline">
        {t("Zurück zum Login", "Retour à la connexion", "Torna al login", "Back to login")}
      </Link>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-black text-gray-900">
          {t("Passwort vergessen?", "Mot de passe oublié ?", "Password dimenticata?", "Forgot password?")}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {t("Wir senden dir einen Reset-Link.", "On t'envoie un lien.", "Ti inviamo un link.", "We'll send you a reset link.")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
          <input
            type="email" value={email}
            onChange={e => { setEmail(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleRequest()}
            placeholder="deine@email.ch"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
            autoFocus
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button onClick={handleRequest} disabled={loading || !email}
          className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60">
          {loading ? "…" : t("Reset-Link senden →", "Envoyer le lien →", "Invia link →", "Send reset link →")}
        </button>

        <p className="text-center text-xs text-gray-400">
          <Link href="/login" className="text-green-700 underline">
            {t("Zurück zum Login", "Retour", "Torna", "Back to login")}
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Set new password (step 2, after clicking email link) ─────────────────────

function SetNewPassword() {
  const { lang } = useLang();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const t = (de: string, fr: string, it: string, en: string) =>
    lang === "fr" ? fr : lang === "it" ? it : lang === "en" ? en : de;

  const handleUpdate = async () => {
    if (password.length < 6) { setError(t("Mindestens 6 Zeichen.", "Min. 6 caractères.", "Min. 6 caratteri.", "Min. 6 characters.")); return; }
    if (password !== confirm) { setError(t("Passwörter stimmen nicht überein.", "Mots de passe différents.", "Password diverse.", "Passwords don't match.")); return; }
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Auth unavailable");
      const { error: err } = await supabase.auth.updateUser({ password });
      if (err) throw err;
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Fehler");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="text-center space-y-4">
      <div className="text-5xl">✅</div>
      <h2 className="text-xl font-black text-gray-800">
        {t("Passwort geändert!", "Mot de passe changé !", "Password cambiata!", "Password updated!")}
      </h2>
      <p className="text-sm text-gray-500">
        {t("Du wirst weitergeleitet…", "Redirection en cours…", "Reindirizzamento…", "Redirecting…")}
      </p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-black text-gray-900">
          {t("Neues Passwort", "Nouveau mot de passe", "Nuova password", "New password")}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {t("Wähle ein sicheres Passwort.", "Choisis un mot de passe sécurisé.", "Scegli una password sicura.", "Choose a secure password.")}
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Neues Passwort", "Nouveau mot de passe", "Nuova password", "New password")}
          </label>
          <input type="password" value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Passwort bestätigen", "Confirmer", "Conferma", "Confirm password")}
          </label>
          <input type="password" value={confirm}
            onChange={e => { setConfirm(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && handleUpdate()}
            placeholder="••••••••"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button onClick={handleUpdate} disabled={loading || !password || !confirm}
          className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-60">
          {loading ? "…" : t("Passwort speichern →", "Enregistrer →", "Salva →", "Save password →")}
        </button>
      </div>
    </div>
  );
}

// ── Page wrapper ─────────────────────────────────────────────────────────────

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start pt-8 px-4 pb-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Image src="/images/mascot/cleverli-thumbsup.png" alt="Cleverli" width={80} height={80} className="mx-auto drop-shadow-md" />
        </div>
        {mode === "update" ? <SetNewPassword /> : <RequestReset />}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
