"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const PIN_HASH_KEY = "cleverli_parent_pin";
const PIN_SESSION_KEY = "cleverli_parent_unlocked";
const UNLOCK_DURATION_MS = 30 * 60 * 1000; // 30 min

function hashPin(pin: string): string {
  // Simple deterministic hash (not crypto — localStorage-only, no server)
  let h = 5381;
  for (let i = 0; i < pin.length; i++) h = (h * 33) ^ pin.charCodeAt(i);
  return String(h >>> 0);
}

function isUnlocked(): boolean {
  try {
    const raw = sessionStorage.getItem(PIN_SESSION_KEY);
    if (!raw) return false;
    const { until } = JSON.parse(raw);
    return Date.now() < until;
  } catch { return false; }
}

function setUnlocked() {
  sessionStorage.setItem(PIN_SESSION_KEY, JSON.stringify({ until: Date.now() + UNLOCK_DURATION_MS }));
}

export function lockParentSession() {
  sessionStorage.removeItem(PIN_SESSION_KEY);
}

interface Props { children: React.ReactNode; }

export default function ParentPinGate({ children }: Props) {
  const [state, setState] = useState<"loading" | "unlocked" | "setup" | "enter">("loading");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const hasPin = !!localStorage.getItem(PIN_HASH_KEY);
    if (isUnlocked()) { setState("unlocked"); return; }
    setState(hasPin ? "enter" : "setup");
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Auto-submit when 4 digits entered
  useEffect(() => {
    if (state === "enter" && pin.length === 4) handleEnter();
    if (state === "setup" && pin.length === 4 && confirmPin.length === 0) {
      inputRef.current?.blur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, state]);

  const handleSetup = () => {
    if (pin.length !== 4) { setError("PIN muss 4 Ziffern haben."); return; }
    if (pin !== confirmPin) { setError("PINs stimmen nicht überein."); setConfirmPin(""); return; }
    localStorage.setItem(PIN_HASH_KEY, hashPin(pin));
    setUnlocked();
    setState("unlocked");
  };

  const handleEnter = () => {
    const stored = localStorage.getItem(PIN_HASH_KEY);
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
  };

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
              <label className="text-xs text-gray-500 font-semibold tracking-wide block mb-1">Neuen PIN eingeben</label>
              <input
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
              <label className="text-xs text-gray-500 font-semibold tracking-wide block mb-1">PIN bestätigen</label>
              <input
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

          <button
            onClick={handleSetup}
            disabled={pin.length !== 4 || confirmPin.length !== 4}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40"
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

          <input
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

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <button
            onClick={handleEnter}
            disabled={pin.length !== 4}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-base hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40"
          >
            Entsperren →
          </button>

          <button
            onClick={() => { localStorage.removeItem(PIN_HASH_KEY); setState("setup"); setPin(""); setError(""); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            PIN vergessen? PIN zurücksetzen
          </button>
        </>
      )}
    </div>
  );
}
