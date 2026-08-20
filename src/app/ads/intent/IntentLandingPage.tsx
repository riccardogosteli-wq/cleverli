"use client";

import Image from "next/image";
import Link from "next/link";
import { trackAdsLpCtaClick } from "@/lib/analytics";
import { startCheckout } from "@/lib/checkoutClient";
import { useSession } from "@/hooks/useSession";
import { useAdsLpVariant } from "@/lib/adsAbTest";
import AdsTrialLandingPage from "@/app/ads/trial/AdsTrialLandingPage";
import GameExercisePreview from "@/app/ads/components/GameExercisePreview";
import { ORGANIC_LANDING_PAGES } from "@/lib/seoContent";
import { getGradeSubjectSeoLinks } from "@/lib/gradeSubjectSeo";

type Plan = "monthly" | "yearly";

export type IntentLandingPageConfig = {
  pageKey: string;
  path: string;
  eyebrow: string;
  title: string;
  lead: string;
  badges: string[];
  freeTrialUrl: string;
  checkoutSource: string;
  heroImage: string;
  imageAlt: string;
  sample: {
    grade: string;
    question: string;
    answers: string[];
    correctIndex: number;
    tip: string;
  };
  stats: [string, string][];
  sections: {
    title: string;
    body: string;
    icon: string;
  }[];
  preview?: {
    classic: {
      grade: string;
      question: string;
      answers: string[];
      correctIndex: number;
      tip: string;
    };
    exerciseTitle: string;
    pairs: [string, string][];
  };
  trustTitle: string;
  trustBody: string;
  seoDetail?: {
    eyebrow: string;
    title: string;
    body: string;
    items: {
      title: string;
      body: string;
    }[];
  };
  faq: [string, string][];
};

const priceCards = [
  {
    plan: "free" as const,
    title: "Kostenlos",
    price: "CHF 0",
    body: "20 Aufgaben gratis testen, ohne Kreditkarte.",
  },
  {
    plan: "monthly" as const,
    title: "Monatlich",
    price: "CHF 9.90/Mt.",
    body: "Flexibel starten und jederzeit kündigen.",
  },
  {
    plan: "yearly" as const,
    title: "Jährlich",
    price: "CHF 99/Jahr",
    body: "CHF 8.25/Mt. für bis zu 3 Kinderprofile.",
  },
];

function checkoutDestination(plan: Plan) {
  return `/api/checkout?plan=${plan}`;
}

export default function IntentLandingPage({ config }: { config: IntentLandingPageConfig }) {
  const { session } = useSession();
  const uid = session?.userId ?? "";
  const variant = useAdsLpVariant(config.pageKey, config.path);
  const gradeLinks = getGradeSubjectSeoLinks(6);
  const seoDetailSection = config.seoDetail ? (
    <section className="border-y border-green-100 bg-green-50/60 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-green-700">{config.seoDetail.eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black text-gray-950">{config.seoDetail.title}</h2>
          <p className="mt-4 text-base leading-7 text-gray-700">{config.seoDetail.body}</p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {config.seoDetail.items.map((item) => (
            <article key={item.title} className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
              <h3 className="text-base font-black text-gray-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-700">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  ) : null;
  const seoCluster = (
    <section className="bg-white px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="mx-auto max-w-6xl rounded-2xl border border-green-100 bg-green-50 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">Weitere Übungen</p>
        <h2 className="mt-2 text-2xl font-black text-gray-950">Mehr Themen für die Primarschule</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ORGANIC_LANDING_PAGES.filter((page) => page.href !== config.path).slice(0, 4).map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-xl border border-green-100 bg-white p-4 shadow-sm transition-colors hover:border-green-300 hover:bg-green-50"
            >
              <h3 className="text-sm font-black text-gray-900">{page.title}</h3>
              <p className="mt-2 text-xs leading-5 text-gray-600">{page.description}</p>
            </Link>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {gradeLinks.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="rounded-xl border border-green-100 bg-white p-4 shadow-sm transition-colors hover:border-green-300 hover:bg-green-50"
            >
              <h3 className="text-sm font-black text-gray-900">{page.h1}</h3>
              <p className="mt-2 text-xs leading-5 text-gray-600">{page.focusItems.slice(0, 2).join(" · ")}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

  if (variant === "trial") {
    return (
      <>
        <AdsTrialLandingPage
          pageKey={config.pageKey}
          pagePath={config.path}
          checkoutSource={config.checkoutSource}
          freeTrialUrl={config.freeTrialUrl}
          heroImage={config.heroImage}
          imageAlt={config.imageAlt}
          title={`${config.title.replace(/\.$/, "")} - 7 Tage Premium gratis.`}
          lead="Erstelle ein Konto, wähle dein Abo und teste alle Übungen und Klassen eine Woche lang ohne Belastung. Erst danach wird bezahlt, wenn du nicht kündigst."
        />
        {seoDetailSection}
        {seoCluster}
      </>
    );
  }

  const startPaidCheckout = (plan: Plan, location: "hero" | "pricing" | "bottom") => {
    const destination = checkoutDestination(plan);
    trackAdsLpCtaClick("paid", location, destination, plan, {
      page: config.pageKey,
      page_path: config.path,
    });
    startCheckout(plan, `${config.checkoutSource}_${location}`, uid);
  };

  const trackFreeClick = (location: "hero" | "pricing" | "bottom") => {
    trackAdsLpCtaClick("free", location, config.freeTrialUrl, undefined, {
      page: config.pageKey,
      page_path: config.path,
    });
  };

  return (
    <main className="bg-white text-gray-900">
      <section className="bg-gradient-to-br from-green-50 via-white to-amber-50 px-4 py-8 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-700">{config.eyebrow}</p>
            <h1 className="text-4xl font-black leading-tight text-gray-950 sm:text-5xl">{config.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">{config.lead}</p>

            <div className="mt-5 grid gap-3 text-sm font-semibold text-gray-700 sm:grid-cols-3">
              {config.badges.map((badge) => (
                <div key={badge} className="rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm">
                  {badge}
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={config.freeTrialUrl}
                onClick={() => trackFreeClick("hero")}
                className="rounded-full bg-green-700 px-7 py-4 text-center text-base font-bold text-white shadow-lg shadow-green-100 transition-colors hover:bg-green-800"
              >
                20 Aufgaben gratis starten
              </Link>
              <button
                type="button"
                onClick={() => startPaidCheckout("yearly", "hero")}
                className="rounded-full border-2 border-green-700 px-7 py-4 text-center text-base font-bold text-green-800 transition-colors hover:bg-green-50"
              >
                Jahresabo ansehen
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Premium danach ab CHF 8.25 / Monat · bis zu 3 Kinderprofile · TWINT & Kreditkarte
            </p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-white shadow-xl shadow-green-100 ring-1 ring-green-100 sm:min-h-[460px]">
            <Image
              src={config.heroImage}
              alt={config.imageAlt}
              fill
              priority
              className="object-cover object-center opacity-95"
              sizes="(min-width: 1024px) 520px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-950/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
              <div className="flex items-start gap-3">
                <Image src="/cleverli-thumbsup.png" alt="" width={48} height={48} className="h-12 w-12 shrink-0 object-contain" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-green-700">Beispielaufgabe</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{config.sample.grade}</p>
                  <p className="mt-1 text-lg font-black text-gray-950">{config.sample.question}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {config.sample.answers.map((answer, index) => (
                  <div
                    key={answer}
                    className={`rounded-xl border px-3 py-3 text-center text-sm font-black ${
                      index === config.sample.correctIndex
                        ? "border-green-600 bg-green-50 text-green-800"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {answer}
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center text-sm font-bold text-green-800">
                  🔊 Vorlesen
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-bold text-amber-800">
                  💡 Tipp anzeigen
                </div>
              </div>
              <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">{config.sample.tip}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-4">
          {config.stats.map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-gray-950">{value}</div>
              <div className="text-sm font-medium text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <GameExercisePreview
        classic={config.preview?.classic}
        exerciseTitle={config.preview?.exerciseTitle}
        pairs={config.preview?.pairs}
      />

      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">Für den Alltag gebaut</p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">Kurz üben, sofort Feedback bekommen, Fortschritt sehen.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {config.sections.map((section) => (
              <div key={section.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-4xl">{section.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{section.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Warum Cleverli</p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">{config.trustTitle}</h2>
            <p className="mt-4 text-base leading-7 text-gray-600">{config.trustBody}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Lehrplan 21", "Aufgaben passend zur Schweizer Primarschule."],
              ["Ohne App", "Läuft im Browser auf Handy, Tablet und Computer."],
              ["Eltern sehen Fortschritt", "XP, erledigte Aufgaben und Themen bleiben sichtbar."],
              ["Deutsch, Mathe, NMG", "Die wichtigsten Primarschul-Fächer an einem Ort."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {seoDetailSection}

      {seoCluster}

      <section className="bg-amber-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <Image src="/cleverli-celebrate.png" alt="" width={100} height={100} className="mx-auto mb-4" />
          <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Motivation für daheim</p>
          <h2 className="mt-2 text-3xl font-black text-gray-950">Kinder bleiben eher dran, wenn Fortschritt sichtbar wird.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-700">
            Cleverli verbindet kurze Übungsrunden mit Missionen, XP und Eltern-Belohnungen. So fühlt sich Lernen weniger nach Pflicht und mehr nach geschafft an.
          </p>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">Preis</p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">20 Aufgaben gratis, danach ein Familienabo.</h2>
          </div>
          <div className="mt-8 grid items-stretch gap-5 md:grid-cols-3">
            {priceCards.map((card) => {
              const isYearly = card.plan === "yearly";
              return (
                <div
                  key={card.plan}
                  className={`relative flex min-h-[220px] flex-col rounded-2xl border-2 p-6 shadow-sm ${
                    isYearly ? "border-green-700 bg-green-700 text-white shadow-xl shadow-green-100" : "border-gray-100 bg-white"
                  }`}
                >
                  {isYearly && (
                    <div className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-white">
                      Empfohlen
                    </div>
                  )}
                  <h3 className={`text-lg font-bold ${isYearly ? "text-white" : "text-gray-900"}`}>{card.title}</h3>
                  <p className={`mt-2 text-3xl font-black ${isYearly ? "text-white" : "text-gray-950"}`}>{card.price}</p>
                  <p className={`mt-2 text-sm leading-6 ${isYearly ? "text-green-50" : "text-gray-500"}`}>{card.body}</p>

                  {card.plan === "free" ? (
                    <Link
                      href={config.freeTrialUrl}
                      onClick={() => trackFreeClick("pricing")}
                      className="mt-auto block rounded-full bg-gray-100 px-5 py-3 text-center text-sm font-bold text-gray-800 hover:bg-gray-200"
                    >
                      Jetzt testen
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startPaidCheckout(card.plan, "pricing")}
                      className={`mt-auto block rounded-full px-5 py-3 text-center text-sm font-bold ${
                        isYearly
                          ? "bg-white text-green-800 hover:bg-green-50"
                          : "bg-green-700 text-white hover:bg-green-800"
                      }`}
                    >
                      {isYearly ? "Jährlich starten" : "Monatlich starten"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-5 text-center text-sm text-gray-500">
            Sicher bezahlen mit TWINT oder Kreditkarte. Premium schaltet alle Aufgaben, Fächer und Klassen frei.
          </p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-black text-gray-950">Häufige Fragen</h2>
          <div className="mt-8 space-y-4">
            {config.faq.map(([q, a]) => (
              <div key={q} className="rounded-2xl border border-gray-200 bg-white p-5">
                <h3 className="font-bold text-gray-900">{q}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-700 px-4 py-12 text-center text-white sm:px-6 sm:py-16">
        <Image src="/cleverli-try-now.png" alt="" width={120} height={120} className="mx-auto mb-4 drop-shadow-lg" />
        <h2 className="mx-auto max-w-2xl text-3xl font-black">Bereit für eine kurze Übungsrunde?</h2>
        <p className="mx-auto mt-3 max-w-xl text-green-50">Starte gratis oder schalte alle Übungen für die ganze Familie frei.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => startPaidCheckout("yearly", "bottom")}
            className="rounded-full bg-white px-7 py-4 text-base font-black text-green-800 hover:bg-green-50"
          >
            CHF 99/Jahr · bis zu 3 Kinder
          </button>
          <Link
            href={config.freeTrialUrl}
            onClick={() => trackFreeClick("bottom")}
            className="rounded-full border-2 border-white px-7 py-4 text-base font-bold text-white hover:bg-green-800"
          >
            Erst kostenlos testen
          </Link>
        </div>
      </section>
    </main>
  );
}
