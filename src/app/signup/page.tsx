"use client";
import { useState } from "react";
import Link from "next/link";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";

export default function Signup() {
  const { tr } = useLang();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<"parent"|"child"|null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState<number|null>(null);

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-start pt-8 px-4 pb-16">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <CleverliMascot size={100} mood={step === 3 ? "celebrate" : "happy"} />
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-3">
          {[1,2,3].map(s => (
            <div key={s} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
              ${step > s ? "bg-green-600 border-green-600 text-white" :
                step === s ? "bg-green-600 border-green-600 text-white ring-4 ring-green-100" :
                "bg-white border-gray-300 text-gray-400"}`}>
              {step > s ? "✓" : s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 text-center">Wer bist du?</h1>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { setRole("parent"); setStep(2); }}
                className="bg-white border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-2xl p-6 text-center font-semibold text-gray-800 transition-all">
                <div className="text-4xl mb-2">👨‍👩‍👧</div>
                <div className="text-sm">{tr("iAmParent")}</div>
              </button>
              <button onClick={() => { setRole("child"); setStep(2); }}
                className="bg-white border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 rounded-2xl p-6 text-center font-semibold text-gray-800 transition-all">
                <div className="text-4xl mb-2">🧒</div>
                <div className="text-sm">{tr("iAmChild")}</div>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 text-center">{tr("createAccount")}</h1>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-3">
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder={tr("namePlaceholder")}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 bg-white text-sm transition-colors" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={tr("emailPlaceholder")}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 bg-white text-sm transition-colors" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder={tr("passwordPlaceholder")}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-green-500 bg-white text-sm transition-colors" />
              <button onClick={() => setStep(3)} disabled={!name || !email || !password}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                Weiter →
              </button>
            </div>
            <button onClick={() => setStep(1)} className="block mx-auto text-sm text-gray-500 hover:text-gray-700">{tr("back")}</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 text-center">{tr("whichClass")}</h1>
            <div className="grid grid-cols-3 gap-3">
              {[1,2,3].map(g => (
                <button key={g} onClick={() => setGrade(g)}
                  className={`border-2 rounded-xl p-4 font-bold text-lg transition-all ${
                    grade === g
                      ? "border-green-600 bg-green-600 text-white shadow-md"
                      : "border-gray-200 bg-white text-gray-800 hover:border-green-400 hover:bg-green-50"}`}>
                  {g}. {tr("gradeLabel")}
                </button>
              ))}
            </div>
            <Link href="/dashboard"
              className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-colors ${
                grade
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"}`}>
              🎉 Los geht&apos;s!
            </Link>
            <button onClick={() => setStep(2)} className="block mx-auto text-sm text-gray-500 hover:text-gray-700">{tr("back")}</button>
          </div>
        )}

        <p className="text-center text-sm text-gray-600">
          {tr("alreadyHave")}{" "}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">{tr("login")}</Link>
        </p>
      </div>
    </div>
  );
}
