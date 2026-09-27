"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { worksheetReturnTo } from "@/lib/worksheets/returnTo";
export default function WorksheetReturnLink() {
  const [destination, setDestination] = useState<string | null>(null);
  useEffect(() => {
    const explicit = worksheetReturnTo(window.location.search);
    try {
      if (explicit) sessionStorage.setItem("cleverli_worksheet_return", JSON.stringify({ url: explicit, until: Date.now() + 2 * 60 * 60 * 1000 }));
      const saved = JSON.parse(sessionStorage.getItem("cleverli_worksheet_return") || "null");
      const valid = saved && saved.until > Date.now() ? worksheetReturnTo(`?returnTo=${encodeURIComponent(saved.url)}`) : null;
      setDestination(explicit || valid);
    } catch { setDestination(explicit); }
  }, []);
  return destination ? <div className="mx-auto max-w-4xl px-5 pt-6"><Link href={destination} className="inline-flex min-h-12 items-center rounded-xl border border-green-200 bg-white px-4 py-3 font-semibold text-green-800">← Zurück zu deinen Arbeitsblättern</Link></div> : null;
}
