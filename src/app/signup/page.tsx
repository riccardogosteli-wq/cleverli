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
    <div className="max-w-sm mx-auto px-4 py-10 text-center space-y-6">
      <CleverliMascot size={100} mood={step === 3 ? "celebrate" : "happy"} />
      <div className="flex justify-center gap-2">
        {[1,2,3].map(s => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>{s}</div>
        ))}
      </div>

      {step === 1 && (
        <>
          <h1 className="text-2xl font-bold text-gray-800">Wer bist du?</h1>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setRole("parent"); setStep(2); }}
              className="border-2 border-green-200 rounded-2xl p-6 hover:bg-green-50 text-center font-semibold transition-all">
              <div className="text-4xl mb-2">👨‍👩‍👧</div>{tr("iAmParent")}
            </button>
            <button onClick={() => { setRole("child"); setStep(2); }}
              className="border-2 border-green-200 rounded-2xl p-6 hover:bg-green-50 text-center font-semibold transition-all">
              <div className="text-4xl mb-2">🧒</div>{tr("iAmChild")}
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="text-2xl font-bold text-gray-800">{tr("createAccount")}</h1>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3 text-left">
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder={tr("namePlaceholder")}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-400 text-sm" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={tr("emailPlaceholder")}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-400 text-sm" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={tr("passwordPlaceholder")}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-400 text-sm" />
            <button onClick={() => setStep(3)} disabled={!name || !email || !password}
              className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-40">
              Weiter →
            </button>
          </div>
          <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-600">{tr("back")}</button>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="text-2xl font-bold text-gray-800">{tr("whichClass")}</h1>
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(g => (
              <button key={g} onClick={() => setGrade(g)}
                className={`border-2 rounded-2xl p-4 font-bold text-xl transition-all ${grade === g ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-green-300"}`}>
                {g}. {tr("gradeLabel")}
              </button>
            ))}
          </div>
          <Link href="/dashboard"
            className={`block w-full bg-green-600 text-white py-3 rounded-2xl font-semibold text-center hover:bg-green-700 transition-colors ${!grade ? "opacity-40 pointer-events-none" : ""}`}>
            🎉 Los geht&apos;s!
          </Link>
          <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-gray-600">{tr("back")}</button>
        </>
      )}

      <p className="text-sm text-gray-500">{tr("alreadyHave")} <Link href="/login" className="text-green-600 font-medium underline">{tr("login")}</Link></p>
    </div>
  );
}
