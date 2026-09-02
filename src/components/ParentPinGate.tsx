"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { getSupabase } from "@/lib/supabase";
import {
  getParentPinHashStorageKey,
  getParentPinUnlockStorageKey,
  hasAuthenticatedStorageScope,
} from "@/lib/accountScopedStorage";

const PIN_HASH_KEY = "cleverli_parent_pin";
const PIN_SESSION_KEY = "cleverli_parent_unlocked";
const UNLOCK_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours — less annoying on mobile

function hashPin(pin: string): string {
  // Simple deterministic hash (not crypto — localStorage-only, no server)
  let h = 5381;
  for (let i = 0; i < pin.length; i++) h = (h * 33) ^ pin.charCodeAt(i);
  return String(h >>> 0);
}

function isUnlocked(): boolean {
  try {
    const raw = localStorage.getItem(getParentPinUnlockStorageKey()) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(PIN_SESSION_KEY)
    );
    if (!raw) return false;
    const { until } = JSON.parse(raw);
    return Date.now() < until;
  } catch { return false; }
}

function setUnlocked() {
  localStorage.setItem(getParentPinUnlockStorageKey(), JSON.stringify({ until: Date.now() + UNLOCK_DURATION_MS }));
}

export function lockParentSession() {
  localStorage.removeItem(getParentPinUnlockStorageKey());
  localStorage.removeItem(PIN_SESSION_KEY);
}

interface Props { children: React.ReactNode; }

export default function ParentPinGate({ children }: Props) {
  const [state, setState] = useState<"loading" | "unlocked" | "setup" | "enter">("loading");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [resetMode, setResetMode] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hasPin = !!(localStorage.getItem(getParentPinHashStorageKey()) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(PIN_HASH_KEY)
    ));
    if (isUnlocked()) { setState("unlocked"); return; }
    setState(hasPin ? "enter" : "setup");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSetup = () => {
    if (pin.length !== 4) { setError("PIN muss 4 Ziffern haben."); return; }
    if (pin !== confirmPin) { setError("PINs stimmen nicht überein."); setConfirmPin(""); return; }
    localStorage.setItem(getParentPinHashStorageKey(), hashPin(pin));
    setUnlocked();
    setState("unlocked");
  };

  const handleEnter = useCallback(() => {
    const stored = localStorage.getItem(getParentPinHashStorageKey()) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(PIN_HASH_KEY)
    );
    if (hashPin(pin) === stored) {
      setUnlocked();
      setState("unlocked");
      setError("");
    } else {
      setAttempts(a => a + 1);
      setError(`Falsche PIN. ${attempts >= 2 ? "Noch " + (5 - attempts) + " Versuche." : ""}`);
      setPin("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [attempts, pin]);

  const handleVerifiedReset = async () => {
    if (!password) {
      setError("Bitte bestätige zuerst dein Kontopasswort.");
      return;
    }
    setResetLoading(true);
    setError("");
    setNotice("");
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error("Auth unavailable");
      const { data: { user } } = await supabase.auth.getUser();
      const email = user?.email;
      if (!email) throw new Error("Bitte melde dich neu an.");
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw authError;
      localStorage.removeItem(getParentPinHashStorageKey());
      lockParentSession();
      setPin("");
      setConfirmPin("");
      setPassword("");
      setResetMode(false);
      setNotice("Passwort bestätigt. Lege jetzt einen neuen PIN fest.");
      setState("setup");
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch {
      setError("Passwort stimmt nicht. Der PIN wurde nicht zurückgesetzt.");
    } finally {
      setResetLoading(false);
    }
  };

  // Auto-submit when 4 digits entered
  useEffect(() => {
    if (state === "enter" && pin.length === 4) handleEnter();
    if (state === "setup" && pin.length === 4 && confirmPin.length === 0) {
      inputRef.current?.blur();
    }
  }, [confirmPin.length, handleEnter, pin.length, state]);

  if (state === "loading") return null;
  if (state === "unlocked") return <>{children}</>;

  return (
    <div className="max-w-xs mx-auto px-4 py-12 text-center space-y-6">
      <Image src="/cleverli-sit-read.png" alt="Cleverli Elternbereich" width={100} height={100} className="mx-auto drop-shadow-md" />

      {state === "setup" ? (
        <>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Elternbereich einrichten</h1>
            <p className="text-gray-400 text-sm mt-2">Lege einen 4-stelligen PIN fest. Nur du kennst ihn.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label htmlFor="parent-pin-new" className="text-xs text-gray-500 font-semibold tracking-wide block mb-1">Neuen PIN eingeben</label>
              <input
                id="parent-pin-new"
                ref={inputRef}
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="● ● ● ●"
                className="w-full text-center text-3xl font-bold tracking-[0.5em] border-2 border-gray-200 rounded-2xl py-4 outline-none focus:border-green-500 bg-white"
              />
            </div>
            <div>
              <label htmlFor="parent-pin-confirm" className="text-xs text-gray-500 font-semibold tracking-wide block mb-1">PIN bestätigen</label>
              <input
                id="parent-pin-confirm"
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, "")); setError(""); }}
                placeholder="● ● ● ●"
                className="w-full text-center text-3xl font-bold tracking-[0.5em] border-2 border-gray-200 rounded-2xl py-4 outline-none focus:border-green-500 bg-white"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          {notice && <p className="text-sm text-green-700 font-medium">{notice}</p>}

          <button
            onClick={handleSetup}
            disabled={pin.length !== 4 || confirmPin.length !== 4}
            className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40"
          >
            PIN speichern &amp; Bereich öffnen →
          </button>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">🔐 Elternbereich</h1>
            <p className="text-gray-400 text-sm mt-2">Bitte gib deinen 4-stelligen PIN ein.</p>
          </div>

          {resetMode ? (
            <div className="space-y-3 text-left">
              <p className="text-sm text-gray-500 text-center">
                Bestätige dein Kontopasswort, bevor du einen neuen PIN festlegst.
              </p>
              <div>
                <label htmlFor="parent-pin-reset-password" className="text-xs text-gray-500 font-semibold tracking-wide block mb-1">Kontopasswort</label>
                <input
                  id="parent-pin-reset-password"
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-500 bg-white"
                  autoComplete="current-password"
                />
              </div>
            </div>
          ) : (
            <input
              id="parent-pin-enter"
              aria-label="Eltern-PIN eingeben"
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={e => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }}
              placeholder="● ● ● ●"
              className="w-full text-center text-3xl font-bold tracking-[0.5em] border-2 border-gray-200 rounded-2xl py-4 outline-none focus:border-green-500 bg-white"
              autoFocus
            />
          )}

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          {notice && <p className="text-sm text-green-700 font-medium">{notice}</p>}

          {resetMode ? (
            <button
              onClick={handleVerifiedReset}
              disabled={resetLoading || !password}
              className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40"
            >
              {resetLoading ? "Prüfen …" : "Passwort bestätigen"}
            </button>
          ) : (
            <button
              onClick={handleEnter}
              disabled={pin.length !== 4}
              className="w-full bg-green-700 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40"
            >
              Entsperren →
            </button>
          )}

          <button
            onClick={() => { setResetMode(mode => !mode); setPin(""); setPassword(""); setError(""); setNotice(""); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            {resetMode ? "Zurück zur PIN-Eingabe" : "PIN vergessen? Mit Passwort zurücksetzen"}
          </button>
        </>
      )}
    </div>
  );
}
