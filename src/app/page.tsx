"use client";
import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { useSession } from "@/hooks/useSession";
import { useState } from "react";

export default function Home() {
  const { tr, lang } = useLang();
  const { session, loaded, isPremium } = useSession();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Logged-in CTA targets
  const primaryHref  = session ? "/dashboard" : "/dashboard";
  const primaryLabel = session ? (isPremium ? "Zum Dashboard →" : "Weiterlernen →") : `${tr("startFree")} →`;
  const showSignupCta = !session;

  return (
    <main className="min-h-screen bg-white">
      {/* Banner */}
      <div className="bg-green-600 text-white text-center py-2 text-sm font-medium tracking-wide">
        🇨🇭 {tr("bannerLehrplan")} &nbsp;·&nbsp; 🏅 {tr("bannerTeachers")} &nbsp;·&nbsp; 🎮 {tr("bannerExercises")}
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 via-white to-yellow-50 px-4 sm:px-6 pt-8 sm:pt-12 pb-10 sm:pb-16">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* Mascot */}
          <div className="flex-shrink-0 relative">
            <Image src="/cleverli-wave.png" alt="Cleverli" width={180} height={180}
              className="drop-shadow-xl sm:w-[220px] sm:h-[220px] animate-cleverli-jump" priority />
          </div>
          {/* Text */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              {tr("heroTitle1")}<br />
              <span className="text-green-600">{tr("heroTitle2")}</span>
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-lg">{tr("subtitle").split("\n")[0]}</p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
              <Link href={primaryHref} className="bg-green-600 text-white px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-bold hover:bg-green-700 active:scale-95 transition-all shadow-md text-center">
                {loaded ? primaryLabel : `${tr("startFree")} →`}
              </Link>
              {showSignupCta && (
                <Link href="/signup" className="border-2 border-green-600 text-green-700 px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-green-50 active:scale-95 transition-all text-center">
                  {tr("createAccount")}
                </Link>
              )}
            </div>
            {!session && <p className="mt-3 text-xs text-gray-400 px-4 sm:px-0">{tr("freeNote")}</p>}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">{tr("subjectsTitle")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { emoji: "🔢", key: "math", label: "math", color: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100", href: "/dashboard?subject=math" },
              { emoji: "📖", key: "german", label: "german", color: "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100", href: "/dashboard?subject=german" },
              { emoji: "🌍", key: "science", label: "scienceFull", color: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100", href: "/dashboard?subject=science" },
            ].map((s) => (
              <Link key={s.key} href={s.href}
                className={`border-2 rounded-2xl p-6 text-center transition-colors ${s.color} cursor-pointer`}>
                <div className="text-5xl mb-3">{s.emoji}</div>
                <div className="font-bold text-base">{tr(s.label as Parameters<typeof tr>[0])}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — with mascot poses */}
      <section className="bg-green-50 py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">{tr("howTitle")}</h2>
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { step: "1", titleKey: "step1title", descKey: "step1desc", img: "/cleverli-sit-read.png", rounded: false },
              { step: "2", titleKey: "step2title", descKey: "step2desc", img: "/cleverli-celebrate.png", rounded: false },
              { step: "3", titleKey: "step3title", descKey: "step3desc", img: "/cleverli-think.png", rounded: false },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-3 bg-white rounded-2xl p-6 shadow-sm">
                <Image src={item.img} alt="" width={100} height={100} className="drop-shadow-md" />
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">{item.step}</div>
                <h3 className="font-bold text-gray-800">{tr(item.titleKey)}</h3>
                <p className="text-gray-500 text-sm">{tr(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">{tr("pricingTitle")}</h2>
          <p className="text-center text-gray-400 text-sm mb-10">{tr("pricingSubtitle")}</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Trial */}
            <div className="bg-white rounded-2xl p-5 sm:p-8 border-2 border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-1">
                <Image src="/cleverli-run.png" alt="" width={56} height={56} />
                <div className="text-3xl font-bold text-gray-900">{tr("free")}</div>
              </div>
              <div className="text-gray-400 text-sm mb-6">{tr("forever")}</div>
              <ul className="text-sm text-gray-600 space-y-2 flex-1">
                <li>✅ {tr("freeF1")}</li>
                <li>✅ {tr("freeF2")}</li>
                <li>✅ {tr("freeF3")}</li>
                <li>✅ {tr("freeF4")}</li>
              </ul>
              <Link href="/dashboard" className="mt-6 block text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                {tr("startFree")}
              </Link>
            </div>
            {/* Premium */}
            <div className="bg-green-600 rounded-2xl p-5 sm:p-8 border-2 border-green-600 shadow-lg text-white flex flex-col relative overflow-hidden">
              <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">{tr("badgePopular")}</div>
              <div className="flex items-center gap-3 mb-1">
                <Image src="/cleverli-jump-star.png" alt="" width={56} height={56} />
                <div className="text-3xl font-bold">CHF 9.90<span className="text-lg font-normal">{tr("perMonth")}</span></div>
              </div>
              <div className="text-green-200 text-sm mb-3">{tr("yearlyNote")}</div>
              {/* Savings banner */}
              <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full mb-5 self-start shadow-sm">
                {tr("yearlyBadge")}
              </div>
              <ul className="text-sm space-y-2 flex-1">
                <li>✅ {tr("premiumF1")}</li>
                <li>✅ {tr("premiumF2")}</li>
                <li>✅ {tr("premiumF3")}</li>
                <li>✅ {tr("premiumF4")}</li>
              </ul>
              <Link href="/signup" className="mt-6 block text-center bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-green-50 transition-colors">
                {tr("premiumCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Feature */}
      <section className="bg-amber-50 py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{tr("rewardTitle")}</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">{tr("rewardSubtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-10 items-center">
            {/* Left: reward examples cards */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">{tr("rewardExamplesTitle")}</p>
              {[
                { emoji: "🦁", de: "Wir gehen in den Zoo", fr: "Sortie au zoo", it: "Gita allo zoo", en: "Trip to the zoo" },
                { emoji: "🍦", de: "Ein Glace aussuchen", fr: "Choisir une glace", it: "Scegliere un gelato", en: "Pick an ice cream" },
                { emoji: "🎬", de: "Kinoabend aussuchen", fr: "Choisir un film", it: "Serata cinema", en: "Pick a movie night" },
                { emoji: "🧁", de: "Zusammen einen Kuchen backen", fr: "Cuisiner ensemble", it: "Cucinare insieme", en: "Bake a cake together" },
                { emoji: "🎨", de: "Neuen Malblock aussuchen", fr: "Choisir un carnet à dessin", it: "Nuovo blocco da disegno", en: "Pick a new sketchbook" },
                { emoji: "🛒", de: "Einen kleinen Wunsch erfüllen", fr: "Un petit souhait", it: "Un piccolo desiderio", en: "One small wish granted" },
              ].map((r) => (
                <div key={r.emoji} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-amber-100">
                  <span className="text-2xl">{r.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {lang === "fr" ? r.fr : lang === "it" ? r.it : lang === "en" ? r.en : r.de}
                  </span>
                  <span className="ml-auto text-xs text-amber-400 font-semibold">🔒</span>
                </div>
              ))}
              <div className="flex items-center gap-3 bg-amber-100 border-2 border-dashed border-amber-300 rounded-xl px-4 py-3 text-amber-700 text-sm font-medium">
                <span className="text-2xl">✏️</span>
                {tr("rewardCustom")}
              </div>
            </div>

            {/* Right: how it works steps */}
            <div className="flex flex-col gap-6">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">{tr("rewardHow")}</p>
              {[
                { n: "1", emoji: "🎯", title: "rewardStep1" as const, desc: "rewardStep1desc" as const },
                { n: "2", emoji: "📊", title: "rewardStep2" as const, desc: "rewardStep2desc" as const },
                { n: "3", emoji: "🎉", title: "rewardStep3" as const, desc: "rewardStep3desc" as const },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow">
                    {s.n}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 mb-0.5">{s.emoji} {tr(s.title)}</div>
                    <div className="text-sm text-gray-500">{tr(s.desc)}</div>
                  </div>
                </div>
              ))}
              <div className="mt-2 bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex items-center gap-4">
                <Image src="/cleverli-celebrate.png" alt="Cleverli feiert einen Erfolg" width={64} height={64} className="shrink-0" />
                <div>
                  <div className="text-sm font-bold text-gray-800">🎉 {lang === "fr" ? "Lena a atteint son objectif!" : lang === "it" ? "Lena ha raggiunto il suo obiettivo!" : lang === "en" ? "Lena reached her goal!" : "Lena hat ihr Ziel erreicht!"}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{lang === "fr" ? "Zeit für den Zoo 🦁" : lang === "it" ? "È ora dello zoo 🦁" : lang === "en" ? "Time for the zoo 🦁" : "Zeit für den Zoo 🦁"}</div>
                </div>
              </div>
              <Link href="/signup" className="inline-block text-center bg-amber-400 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-full shadow transition-colors">
                {tr("rewardCta")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-green-50 py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
            <Image src="/cleverli-wave.png" alt="" width={70} height={70} className="drop-shadow-md shrink-0 sm:w-[100px] sm:h-[100px]" />
            <h2 className="text-2xl font-bold text-gray-800">{tr("testimonialsTitle")}</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { nameKey: "Sandra M.", city: "Zürich", textKey: "testimonial1" as const },
              { nameKey: "Patrick K.", city: "Bern", textKey: "testimonial2" as const },
              { nameKey: "Léa D.", city: "Lausanne", textKey: "testimonial3" as const },
            ].map((t) => (
              <div key={t.nameKey} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-yellow-400 text-lg mb-3">{"⭐".repeat(5)}</div>
                <p className="text-gray-600 text-sm italic mb-4">&ldquo;{tr(t.textKey)}&rdquo;</p>
                <p className="text-sm font-semibold text-gray-800">{t.nameKey} · {t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8 justify-center">
            <Image src="/cleverli-think.png" alt="" width={70} height={70} className="drop-shadow-md" />
            <h2 className="text-2xl font-bold text-gray-800">{tr("faqTitle")}</h2>
          </div>
          <div className="space-y-3">
            {([
              ["faqQ1","faqA1"],["faqQ2","faqA2"],["faqQ3","faqA3"],["faqQ4","faqA4"],["faqQ5","faqA5"],
            ] as const).map(([qKey, aKey], i) => (
              <div key={i} className="border-2 border-gray-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{minHeight:"56px"}}
                  className="w-full text-left px-4 sm:px-5 py-4 font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base">
                  <span>{tr(qKey)}</span>
                  <span className="text-green-600 text-xl ml-3 shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">{tr(aKey)}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-green-600 py-10 sm:py-12 px-4 sm:px-6 text-center text-white" style={{paddingBottom:"max(2.5rem, env(safe-area-inset-bottom))"}}>

        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-6 justify-center">
          <Image src="/cleverli-jump-star.png" alt="" width={100} height={100} className="drop-shadow-lg" />
          <div>
            <h2 className="text-2xl font-bold mb-2">{tr("ctaTitle")}</h2>
            <p className="text-green-100 mb-4">{tr("ctaSubtitle")}</p>
            <Link href="/dashboard" className="inline-block bg-white text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-colors shadow-md">
              {loaded && session ? "Weiterlernen →" : `${tr("startFree")} →`}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-green-700">cleverli</span>
            <span>· {tr("footerCountry")}</span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/impressum" className="hover:text-gray-600">{tr("footerImpressum")}</Link>
            <Link href="/datenschutz" className="hover:text-gray-600">{tr("footerDatenschutz")}</Link>
            <Link href="mailto:hello@cleverli.ch" className="hover:text-gray-600">{tr("footerKontakt")}</Link>
          </div>
          <p>© 2026 Cleverli</p>
        </div>
      </footer>
    </main>
  );
}
