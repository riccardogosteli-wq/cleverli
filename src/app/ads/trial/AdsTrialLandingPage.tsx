"use client";

import Image from "next/image";
import { trackAdsLpCtaClick } from "@/lib/analytics";
import { startCheckout } from "@/lib/checkoutClient";
import { useSession } from "@/hooks/useSession";
import GameExercisePreview from "@/app/ads/components/GameExercisePreview";
import LifetimeFounderOffer from "@/components/LifetimeFounderOffer";

type Plan = "monthly" | "yearly";

type TrialLandingPageProps = {
  pageKey: string;
  pagePath: string;
  checkoutSource: string;
  freeTrialUrl?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  heroImage?: string;
  imageAlt?: string;
  trialCtaLabel?: string;
  freeCtaLabel?: string;
};

const features = [
  "Alle Übungen und Klassen freigeschaltet",
  "Mathe, Deutsch, NMG, Sprachen und Medien an einem Ort",
  "Bis zu 3 Kinderprofile für die Familie",
  "Fortschritt auf Handy, Tablet und Computer",
];

const trustItems = [
  ["7 Tage kostenlos testen", "Premium eine Woche lang mit allen Übungen und Klassen ausprobieren."],
  ["Jederzeit kündbar", "Das Abo bleibt flexibel."],
  ["Jährlich spart 17 %", "CHF 99/Jahr statt CHF 118.80 bei monatlicher Zahlung."],
  ["Sicher über Stripe", "Kartenzahlung, verschlüsselt und klar ausgewiesen."],
];

export default function AdsTrialLandingPage({
  pageKey,
  pagePath,
  checkoutSource,
  freeTrialUrl = "/learn/2/math/addition-bis-20",
  eyebrow = "7 Tage Premium gratis testen",
  title = "Alle Übungen und Klassen 7 Tage gratis freischalten.",
  lead = "Erstelle ein Konto, wähle dein Abo und teste Cleverli Premium eine Woche lang mit allen Übungen und Klassen.",
  heroImage = "/images/scenes/cleverli-teach-kids.jpg",
  imageAlt = "Cleverli Premium Vorschau",
  trialCtaLabel = "7 Tage kostenlos testen",
  freeCtaLabel = "Kostenlos mit Übungen starten",
}: TrialLandingPageProps) {
  const { session } = useSession();
  const uid = session?.userId ?? "";

  const startTrial = async (plan: Plan, location: "hero" | "pricing" | "bottom") => {
    const destination = `/api/checkout?plan=${plan}&trial=7`;
    await trackAdsLpCtaClick("paid", location, destination, plan, {
      page: pageKey,
      page_path: pagePath,
      experiment: "ads_lp_7_day_trial",
      variant: "trial",
      trial_days: 7,
    });
    startCheckout(plan, `${checkoutSource}_trial_${location}`, uid, { trialDays: 7 });
  };

  const startFreePractice = async (location: "hero" | "bottom") => {
    await trackAdsLpCtaClick("free", location, freeTrialUrl, undefined, {
      page: pageKey,
      page_path: pagePath,
      experiment: "ads_lp_7_day_trial",
      variant: "trial",
      trial_days: 7,
    });
    window.location.assign(freeTrialUrl);
  };

  return (
    <main className="bg-white text-gray-900">
      <section className="bg-gradient-to-br from-green-50 via-white to-amber-50 px-4 py-8 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
          <div className="min-w-0">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-700">{eyebrow}</p>
            <h1 className="break-words text-4xl font-black leading-tight text-gray-950 sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">{lead}</p>

            <div className="mt-5 grid gap-3 text-sm font-semibold text-gray-700 sm:grid-cols-2">
              <div className="rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm">Heute CHF 0</div>
              <div className="rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm">Jederzeit kündbar</div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => startTrial("yearly", "hero")}
                className="w-full rounded-full bg-green-700 px-7 py-4 text-center text-base font-bold text-white shadow-lg shadow-green-100 transition-colors hover:bg-green-800 sm:w-auto"
              >
                {trialCtaLabel}
              </button>
              <button
                type="button"
                onClick={() => startFreePractice("hero")}
                className="w-full rounded-full border-2 border-green-700 px-7 py-4 text-center text-base font-bold text-green-800 transition-colors hover:bg-green-50 sm:w-auto"
              >
                {freeCtaLabel}
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              CHF 99/Jahr, spart CHF 19.80 gegenüber monatlich.
            </p>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-white shadow-xl shadow-green-100 ring-1 ring-green-100 sm:min-h-[460px]">
            <Image
              src={heroImage}
              alt={imageAlt}
              fill
              priority
              className="object-cover object-center opacity-95"
              sizes="(min-width: 1024px) 520px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-950/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
              <p className="text-xs font-black uppercase tracking-widest text-green-700">Premium-Test</p>
              <h2 className="mt-1 text-xl font-black text-gray-950">7 Tage kostenlos testen</h2>
              <div className="mt-4 grid gap-2">
                {features.map((feature) => (
                  <div key={feature} className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-sm font-bold text-green-800">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            ["7 Tage", "Premium gratis"],
            ["13’000+", "interaktive Übungen"],
            ["1.–6.", "Klasse Primarschule"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-gray-950">{value}</div>
              <div className="text-sm font-medium text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <GameExercisePreview />

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">Abo wählen</p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">7 Tage kostenlos testen. Wähle dein Abo.</h2>
          </div>
          <LifetimeFounderOffer
            uid={uid}
            checkoutSource={`${checkoutSource}_schooltime_offer`}
            pageKey={pageKey}
            pagePath={pagePath}
            className="mt-8"
          />
          <div className="mt-8 grid items-stretch gap-5 md:grid-cols-2">
            <div className="flex min-h-[260px] flex-col rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Monatlich</h3>
              <p className="mt-2 text-3xl font-black text-gray-950">CHF 9.90<span className="text-base font-medium text-gray-500">/Mt.</span></p>
              <p className="mt-2 text-sm leading-6 text-gray-500">7 Tage gratis testen, danach monatlich kündbar.</p>
              <button
                type="button"
                onClick={() => startTrial("monthly", "pricing")}
                className="mt-auto block rounded-full bg-gray-100 px-5 py-3 text-center text-sm font-bold text-gray-800 hover:bg-gray-200"
              >
                Jetzt 7 Tage gratis testen
              </button>
            </div>

            <div className="relative flex min-h-[260px] flex-col rounded-2xl border-2 border-green-700 bg-green-700 p-6 text-white shadow-xl shadow-green-100">
              <div className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-white">
                Empfohlen · spart CHF 19.80
              </div>
              <h3 className="text-lg font-bold">Jährlich</h3>
              <p className="mt-2 text-3xl font-black">CHF 99<span className="text-base font-medium text-green-200">/Jahr</span></p>
              <p className="mt-2 text-sm leading-6 text-green-50">
                7 Tage gratis testen. Danach CHF 99/Jahr für bis zu 3 Kinderprofile.
              </p>
              <button
                type="button"
                onClick={() => startTrial("yearly", "pricing")}
                className="mt-auto block rounded-full bg-white px-5 py-3 text-center text-sm font-black text-green-800 hover:bg-green-50"
              >
                Jetzt 7 Tage gratis testen
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {trustItems.map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green-700 px-4 py-12 text-center text-white sm:px-6 sm:py-16">
        <Image src="/cleverli-try-now.png" alt="" width={120} height={120} className="mx-auto mb-4 drop-shadow-lg" />
        <h2 className="mx-auto max-w-2xl text-3xl font-black">Premium eine Woche lang ohne Einschränkung testen.</h2>
        <p className="mx-auto mt-3 max-w-xl text-green-50">
          Alle Übungen, alle Klassen und bis zu 3 Kinderprofile.
        </p>
        <button
          type="button"
          onClick={() => startTrial("yearly", "bottom")}
          className="mt-7 rounded-full bg-white px-7 py-4 text-base font-black text-green-800 hover:bg-green-50"
        >
          7 Tage gratis starten
        </button>
        <button
          type="button"
          onClick={() => startFreePractice("bottom")}
          className="mt-3 rounded-full border-2 border-white px-7 py-4 text-base font-bold text-white hover:bg-green-800"
        >
          Kostenlos mit Übungen starten
        </button>
      </section>
    </main>
  );
}
