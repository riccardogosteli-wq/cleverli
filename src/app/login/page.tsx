"use client";
import { useState } from "react";
import Link from "next/link";
import CleverliMascot from "@/components/CleverliMascot";
import { useLang } from "@/lib/LangContext";

export default function Login() {
  const { tr } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-sm mx-auto px-4 py-10 text-center space-y-6">
      <CleverliMascot size={100} />
      <h1 className="text-2xl font-bold text-gray-800">{tr("login")}</h1>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3 text-left">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder={tr("emailPlaceholder")}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-400 text-sm" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder={tr("passwordPlaceholder")}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-400 text-sm" />
        <button className="w-full bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 transition-colors">
          {tr("login")}
        </button>
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-100" /><span className="text-xs text-gray-400">oder</span><div className="flex-1 h-px bg-gray-100" />
        </div>
        <button className="w-full border-2 border-gray-200 py-3 rounded-2xl font-semibold text-gray-600 hover:bg-gray-50 text-sm flex items-center justify-center gap-2">
          <span>🔵</span> Weiter mit Google
        </button>
      </div>
      <p className="text-sm text-gray-500">{tr("noAccount")} <Link href="/signup" className="text-green-600 font-medium underline">{tr("signup")}</Link></p>
    </div>
  );
}
