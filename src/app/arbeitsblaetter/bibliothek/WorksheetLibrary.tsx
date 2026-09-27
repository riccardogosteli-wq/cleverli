"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { worksheetSubjects, type WorksheetTopic } from "@/lib/worksheets/types";
const control = "min-h-12 rounded-xl border border-stone-300 bg-white px-4 py-3 text-slate-800 focus:outline-2 focus:outline-green-700";
export default function WorksheetLibrary() {
  const [topics, setTopics] = useState<WorksheetTopic[]>([]);
  const [status, setStatus] = useState(0);
  const [grade, setGrade] = useState(0), [subject, setSubject] = useState(""), [search, setSearch] = useState("");
  const [busy, setBusy] = useState(""), [message, setMessage] = useState("");
  const [returnTo, setReturnTo] = useState("/arbeitsblaetter/bibliothek");
  const load = useCallback(async (signal?: AbortSignal) => {
    setTopics([]); setStatus(0);
    try {
      const db = getSupabase();
      const session = db ? (await db.auth.getSession()).data.session : null;
      if (signal?.aborted) return;
      if (!session) { setStatus(401); return; }
      const response = await fetch("/api/worksheets", { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store", signal });
      const data = await response.json();
      if (signal?.aborted) return;
      if (response.ok) setTopics(data.topics);
      setStatus(response.status);
    } catch { if (!signal?.aborted) setStatus(503); }
  }, []);
  useEffect(() => {
    const raw = Number(new URLSearchParams(window.location.search).get("klasse"));
    if (raw >= 1 && raw <= 6 && Number.isInteger(raw)) setGrade(raw);
    setReturnTo(window.location.pathname + window.location.search);
    let disposed = false;
    let controller = new AbortController();
    const refresh = () => { if (disposed) return; controller.abort(); controller = new AbortController(); void load(controller.signal); };
    refresh();
    const db = getSupabase();
    const subscription = db?.auth.onAuthStateChange(() => { controller.abort(); setTopics([]); setStatus(0); queueMicrotask(refresh); }).data.subscription;
    window.addEventListener("focus", refresh);
    return () => { disposed = true; controller.abort(); subscription?.unsubscribe(); window.removeEventListener("focus", refresh); };
  }, [load]);
  async function download(topic: WorksheetTopic, type: "worksheet" | "solution") {
    setBusy(`${topic.id}-${type}`); setMessage("");
    try {
      const session = (await getSupabase()?.auth.getSession())?.data.session;
      if (!session) { setTopics([]); setStatus(401); return; }
      const response = await fetch(`/api/worksheets?id=${encodeURIComponent(topic.id)}&type=${type}`, { headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store" });
      if (!response.ok) {
        if ([401,403].includes(response.status)) { setTopics([]); setStatus(response.status); }
        throw Error("Das PDF konnte nicht geladen werden. Bitte versuche es erneut.");
      }
      const url = URL.createObjectURL(await response.blob());
      const a = document.createElement("a"); a.href = url; a.download = `${topic.id}-${type === "worksheet" ? "Arbeitsblatt" : "Loesung"}.pdf`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setMessage(`${topic.title}: Download bereit.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Bitte versuche es erneut."); }
    finally { setBusy(""); }
  }
  const gradeTopics = topics.filter(t => !grade || t.grade === grade);
  const availableSubjects = Object.entries(worksheetSubjects).filter(([id]) => gradeTopics.some(t => t.subject === id));
  const needle = search.trim().toLocaleLowerCase("de-CH");
  const filtered = gradeTopics.filter(t => (!subject || t.subject === subject) && `${t.title} ${worksheetSubjects[t.subject]} ${t.curriculum.code} ${t.curriculum.scope}`.toLocaleLowerCase("de-CH").includes(needle));
  return <main className="min-h-screen bg-[#fbfaf5] px-5 py-10 pb-24 text-slate-800 sm:px-8"><div className="mx-auto max-w-6xl">
    <Link href="/arbeitsblaetter" className="inline-flex min-h-11 items-center text-sm font-semibold text-green-800 underline underline-offset-4">← Arbeitsblätter kennenlernen</Link>
    <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-green-700">Deine Materialsammlung</p><h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">Was möchtest du üben?</h1><p className="mt-4 max-w-2xl leading-7 text-slate-600">Ein Thema, ein Arbeitsblatt, eine separate Lösung. Finde das passende Material für deinen nächsten Lernmoment.</p></div><span className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-900">Premiumbibliothek</span></div>
    {status === 0 ? <p role="status" className="mt-10 rounded-2xl bg-white p-8">Dein Zugang wird geprüft …</p> : status !== 200 ? <section className="mt-10 max-w-2xl rounded-3xl border border-green-200 bg-white p-7 sm:p-10"><h2 className="text-2xl font-extrabold">{status === 401 ? "Deine Bibliothek wartet auf dich" : status === 403 ? "Alle Arbeitsblätter mit Premium" : "Wir können die Bibliothek gerade nicht laden"}</h2><p className="mt-4 leading-7 text-slate-600">{status === 401 ? "Melde dich an, damit wir deinen Premiumzugang oder deinen gültigen Lehrpersonenzugang prüfen können." : status === 403 ? "Das kostenlose Beispiel bleibt für dich verfügbar. Für alle Arbeitsblätter und Lösungen brauchst du Premium oder einen gültigen Lehrpersonenzugang." : "Bitte versuche es nochmals. Deine Arbeitsblätter bleiben unverändert."}</p><div className="mt-6 flex flex-col gap-3 sm:flex-row">{status === 401 ? <Link className={`${control} bg-green-700! text-center font-bold text-white!`} href={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Anmelden und weiter</Link> : status === 403 ? <Link className={`${control} bg-green-700! text-center font-bold text-white!`} href={`/upgrade?returnTo=${encodeURIComponent(returnTo)}`}>Premium ansehen</Link> : <button className={control} onClick={() => void load()}>Erneut versuchen</button>}<Link className={`${control} text-center`} href="/arbeitsblaetter#beispiel">Kostenloses Beispiel</Link></div></section> : <>
      <section aria-label="Arbeitsblätter filtern" className="mt-9 rounded-3xl border border-stone-200 bg-white p-5 sm:p-6"><fieldset><legend className="mb-3 text-sm font-bold">Klasse wählen</legend><div className="flex flex-wrap gap-2">{[0,1,2,3,4,5,6].map(n=><button key={n} aria-pressed={grade===n} onClick={()=>{setGrade(n);setSubject("");}} className={`min-h-12 rounded-xl border px-4 py-3 text-sm font-bold ${grade===n ? "border-green-800 bg-green-800 text-white" : "border-stone-200 hover:bg-green-50"}`}>{n ? `${n}. Klasse` : "Alle Klassen"}</button>)}</div></fieldset><div className="mt-5 grid gap-4 sm:grid-cols-[1fr_2fr_auto]"><label className="flex flex-col gap-2 text-sm font-bold">Fach<select aria-label="Fach" className={control} value={subject} onChange={e=>setSubject(e.target.value)}><option value="">Alle Fächer</option>{availableSubjects.map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label><label className="flex flex-col gap-2 text-sm font-bold">Thema suchen<input type="search" className={control} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Zum Beispiel Brüche, Wald, MA.1 …"/></label><button onClick={()=>{setGrade(0);setSubject("");setSearch("");}} className={`${control} self-end font-semibold text-green-800`}>Zurücksetzen</button></div></section>
      <p role="status" className="mt-6 text-sm font-semibold text-slate-600">{filtered.length} von {topics.length} Themen · Je 1 Arbeitsblatt und 1 Lösung</p>
      <p aria-live="polite" className="mt-2 text-sm font-semibold text-green-800">{message}</p>
      {!filtered.length && <section className="mt-6 rounded-2xl bg-white p-8"><h2 className="text-xl font-bold">Dazu haben wir kein Thema gefunden.</h2><p className="mt-2 text-slate-600">Versuche einen kürzeren Suchbegriff oder setze die Filter zurück.</p></section>}
      {[1,2,3,4,5,6].map(g=>Object.entries(worksheetSubjects).map(([s,label])=>{
        const rows=filtered.filter(t=>t.grade===g&&t.subject===s); if(!rows.length)return null;
        return <section key={`${g}-${s}`} className="mt-9" aria-label={`${g}. Klasse ${label}`}><h2 className="text-xl font-extrabold">{g}. Klasse <span className="font-normal text-slate-500">/</span> {label} <span className="ml-2 text-sm font-normal text-slate-500">({rows.length})</span></h2><div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.map(t=><article key={t.id} className="flex min-w-0 flex-col rounded-2xl border border-stone-200 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wider text-green-700">A4 · Je 1 Seite</p><h3 className="mt-3 text-xl font-extrabold">{t.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{t.curriculum.scope}</p><a href={t.curriculum.url} target="_blank" rel="noopener" className="mt-3 text-xs text-slate-600 underline underline-offset-4">Lehrplanbezug: {t.curriculum.code}<span className="sr-only"> (neuer Tab)</span></a><div className="mt-auto flex flex-wrap gap-2 pt-5">{(["worksheet","solution"] as const).map(type=><button disabled={!!busy} key={type} onClick={()=>void download(t,type)} className={`min-h-12 rounded-xl px-4 py-3 text-sm font-bold disabled:opacity-60 ${type==="worksheet" ? "bg-green-700 text-white hover:bg-green-800" : "border border-green-200 text-green-800 hover:bg-green-50"}`} aria-label={`${type==="worksheet" ? "Arbeitsblatt" : "Lösung"} herunterladen: ${t.title}`}>{busy===`${t.id}-${type}` ? "Wird geladen …" : type==="worksheet" ? "Arbeitsblatt ↓" : "Lösung ↓"}</button>)}</div></article>)}</div></section>;
      }))}
      <p className="mt-10 text-sm leading-6 text-slate-600">Die Lehrplanbezüge beschreiben den geübten Teilbereich, keine vollständige Kompetenzabdeckung. Nutze die Materialien im Rahmen deines bestehenden Cleverli Zugangs. Eine öffentliche Weiterveröffentlichung der Bibliothek ist nicht vorgesehen.</p>
    </>}
  </div></main>;
}
