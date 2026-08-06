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

const subjects = [
  { icon: "/images/ui/Mathematik.png", title: "Mathematik", body: "Rechnen, Geometrie und Textaufgaben für die 1.–6. Klasse." },
  { icon: "/images/ui/Deutsch.png", title: "Deutsch", body: "Lesen, Grammatik, Wortschatz und Rechtschreibung in kurzen Einheiten." },
  { icon: "/images/ui/NMG.png", title: "NMG", body: "Natur, Mensch und Gesellschaft passend zur Primarschule nach Lehrplan 21." },
];

const steps = [
  { n: "1", title: "Klasse wählen", body: "Dein Kind findet sofort Aufgaben, die zur Primarschule passen." },
  { n: "2", title: "Kurz üben", body: "10 Minuten reichen für eine sinnvolle Runde ohne Drama am Küchentisch." },
  { n: "3", title: "Fortschritt sehen", body: "Du siehst, was erledigt wurde und wo dein Kind noch Übung braucht." },
];

const rewardExamples = [
  { emoji: "🦁", title: "Wir gehen in den Zoo" },
  { emoji: "🍦", title: "Ein Glace essen" },
  { emoji: "🎬", title: "Kinoabend" },
  { emoji: "🎨", title: "Neuen Malblock aussuchen" },
  { emoji: "🛒", title: "Einen kleinen Wunsch erfüllen" },
];

const rewardSteps = [
  { n: "1", emoji: "🎯", title: "Belohnung festlegen", body: "Wähle aus Vorschlägen oder erstelle eine eigene Belohnung." },
  { n: "2", emoji: "📊", title: "Ziel setzen", body: "Du entscheidest: nach Aufgaben, Themen oder einer 7-Tage-Serie." },
  { n: "3", emoji: "🎉", title: "Kind erreicht das Ziel", body: "Dein Kind sieht den Fortschritt und bleibt motiviert dran." },
];

const previewAnswers = ["18", "24", "32"];

const freeTrialUrl = "/learn/1/math/zahlen-1-10";

export default function AdsPrimarschuleClient() {
  const { session } = useSession();
  const uid = session?.userId ?? "";
  const checkoutDestination = (plan: "monthly" | "yearly") => `/api/checkout?plan=${plan}`;
  const variant = useAdsLpVariant("primarschule_uebungen", "/primarschule-uebungen");
  const seoCluster = (
    <section className="bg-white px-4 pb-12 sm:px-6 sm:pb-16">
      <div className="mx-auto max-w-6xl rounded-2xl border border-green-100 bg-green-50 p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">Übungen nach Fach</p>
        <h2 className="mt-2 text-2xl font-black text-gray-950">Direkt zu passenden Primarschul-Übungen</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ORGANIC_LANDING_PAGES.filter((page) => page.href !== "/primarschule-uebungen").slice(0, 4).map((page) => (
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
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            ["/learn/1/math/zahlen-1-10", "Mathe 1. Klasse"],
            ["/learn/1/german/saetze-lesen", "Deutsch 1. Klasse"],
            ["/learn/2/math/einmaleins", "Einmaleins üben"],
            ["/learn/1/science/tiere", "NMG 1. Klasse"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-green-200 bg-white px-3 py-2 text-sm font-bold text-green-800 hover:bg-green-100"
            >
              {label}
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
          pageKey="primarschule_uebungen"
          pagePath="/primarschule-uebungen"
          checkoutSource="primarschule_uebungen"
          title="Mathe, Deutsch und NMG 7 Tage gratis freischalten."
          lead="Erstelle ein Konto, wähle dein Abo und teste Cleverli Premium eine Woche lang mit allen Aufgaben und Klassen. Erst danach wird bezahlt, wenn du nicht kündigst."
        />
        {seoCluster}
      </>
    );
  }

  return (
    <main className="bg-white text-gray-900">
      <section className="bg-gradient-to-br from-green-50 via-white to-amber-50 px-4 py-8 sm:px-6 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-green-700">20 Aufgaben gratis · Schweizer Primarschule</p>
            <h1 className="text-4xl font-black leading-tight text-gray-950 sm:text-5xl">
              Mathe und Deutsch kostenlos ausprobieren.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
              Starte direkt mit 20 Aufgaben gratis. Danach entscheidest du in Ruhe, ob Cleverli als Familienabo zu euch passt.
            </p>
            <div className="mt-5 grid gap-3 text-sm font-semibold text-gray-700 sm:grid-cols-3">
              <div className="rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm">Ohne Kreditkarte</div>
              <div className="rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm">Direkt im Browser</div>
              <div className="rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm">1.–6. Klasse</div>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={freeTrialUrl}
                onClick={() => trackAdsLpCtaClick("free", "hero", freeTrialUrl)}
                className="rounded-full bg-green-700 px-7 py-4 text-center text-base font-bold text-white shadow-lg shadow-green-100 transition-colors hover:bg-green-800"
              >
                20 Aufgaben gratis starten
              </Link>
              <button
                type="button"
                onClick={() => {
                  trackAdsLpCtaClick("paid", "hero", checkoutDestination("yearly"), "yearly");
                  startCheckout("yearly", "primarschule_uebungen_hero", uid);
                }}
                className="rounded-full border-2 border-green-700 px-7 py-4 text-center text-base font-bold text-green-800 transition-colors hover:bg-green-50"
              >
                Jahresabo ansehen
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-500">Premium danach ab CHF 8.25 / Monat · bis zu 3 Kinderprofile · TWINT & Kreditkarte</p>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-3xl bg-white shadow-xl shadow-green-100 ring-1 ring-green-100 sm:min-h-[380px]">
            <div className="absolute inset-x-0 top-0 h-28 bg-green-700" />
            <Image
              src="/images/scenes/cleverli-teach-kids.jpg"
              alt="Cleverli Lernszene"
              fill
              priority
              className="object-cover object-center opacity-95"
              sizes="(min-width: 1024px) 520px, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-lg backdrop-blur">
              <div className="flex items-start gap-3">
                <Image src="/cleverli-thumbsup.png" alt="" width={48} height={48} className="h-12 w-12 shrink-0 object-contain" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-green-700">Beispielaufgabe</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">2. Klasse Mathe</p>
                  <p className="mt-1 text-lg font-black text-gray-950">Wie viel ist 8 + 7 + 9?</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewAnswers.map((answer, index) => (
                  <div
                    key={answer}
                    className={`rounded-xl border px-3 py-3 text-center text-sm font-black ${
                      index === 1
                        ? "border-green-600 bg-green-50 text-green-800"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                  >
                    {answer}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold text-gray-500">Kurze Runden, sofortiges Feedback, Fortschritt für Eltern sichtbar.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-white px-4 py-8 sm:px-6">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-4">
          {[
            ["13’000+", "interaktive Übungen"],
            ["1.–6.", "Klasse Primarschule"],
            ["20", "Aufgaben gratis"],
            ["LP21", "nach Lehrplan 21"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-black text-gray-950">{value}</div>
              <div className="text-sm font-medium text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <GameExercisePreview
        exerciseTitle="Finde, was zusammenpasst."
        pairs={[
          ["Auge", "sehen"],
          ["Ohr", "hören"],
          ["8 + 7", "15"],
        ]}
      />

      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">Für den Alltag gebaut</p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">10 Minuten üben. Fortschritt sehen. Ohne Lernstress.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-base font-black text-white">{step.n}</div>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Fächer</p>
              <h2 className="mt-2 text-3xl font-black text-gray-950">Die wichtigsten Primarschul-Fächer an einem Ort.</h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Für die deutschsprachige Schweiz: Mathe, Deutsch und NMG stehen im Zentrum. Französisch und Englisch sind für die höheren Primarklassen ebenfalls drin.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {subjects.map((subject) => (
                <div key={subject.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <Image src={subject.icon} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
                  <h3 className="mt-4 font-bold text-gray-900">{subject.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{subject.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {seoCluster}

      <section className="bg-amber-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 text-5xl">🎁</div>
            <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Motivation für daheim</p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">Echte Belohnungen für echte Leistungen.</h2>
            <p className="mt-4 text-base leading-7 text-gray-700">
              Eltern definieren persönliche Belohnungen. Kinder sehen ihr Ziel und arbeiten motiviert darauf hin.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-amber-700">Beispiel-Belohnungen</p>
              {rewardExamples.map((reward) => (
                <div key={reward.title} className="flex items-center gap-3 rounded-xl border border-amber-100 bg-white px-4 py-3 shadow-sm">
                  <span className="text-2xl">{reward.emoji}</span>
                  <span className="text-sm font-semibold text-gray-800">{reward.title}</span>
                  <span className="ml-auto text-xs font-bold text-amber-400">🔒</span>
                </div>
              ))}
              <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-amber-300 bg-amber-100 px-4 py-3 text-sm font-bold text-amber-800">
                <span className="text-2xl">✏️</span>
                Oder eigene Belohnung erstellen
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-amber-700">So funktioniert es</p>
              {rewardSteps.map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400 text-lg font-black text-white shadow">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900">{step.emoji} {step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-600">{step.body}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
                <Image src="/cleverli-think.png" alt="" width={64} height={64} className="shrink-0" loading="lazy" />
                <div>
                  <p className="text-sm font-black text-gray-900">🎉 Lena hat ihr Ziel erreicht!</p>
                  <p className="mt-1 text-xs text-gray-500">Zeit für den Zoo! 🦁</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-700">Preis</p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">Für Familien gemacht, nicht pro Kind verrechnet.</h2>
          </div>
          <div className="mt-8 grid items-stretch gap-5 md:grid-cols-3">
            <div className="flex min-h-[220px] flex-col rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Kostenlos</h3>
              <p className="mt-2 text-3xl font-black text-gray-950">CHF 0</p>
              <p className="mt-2 text-sm leading-6 text-gray-500">20 Aufgaben gratis testen, ohne Kreditkarte.</p>
              <Link
                href={freeTrialUrl}
                onClick={() => trackAdsLpCtaClick("free", "pricing", freeTrialUrl)}
                className="mt-auto block rounded-full bg-gray-100 px-5 py-3 text-center text-sm font-bold text-gray-800 hover:bg-gray-200"
              >
                Jetzt testen
              </Link>
            </div>

            <div className="flex min-h-[220px] flex-col rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900">Monatlich</h3>
              <p className="mt-2 text-3xl font-black text-gray-950">CHF 9.90<span className="text-base font-medium text-gray-500">/Mt.</span></p>
              <p className="mt-2 text-sm leading-6 text-gray-500">Flexibel starten und jederzeit kündigen.</p>
              <button
                type="button"
                onClick={() => {
                  trackAdsLpCtaClick("paid", "pricing", checkoutDestination("monthly"), "monthly");
                  startCheckout("monthly", "primarschule_uebungen_pricing", uid);
                }}
                className="mt-auto block rounded-full bg-green-700 px-5 py-3 text-center text-sm font-bold text-white hover:bg-green-800"
              >
                Monatlich starten
              </button>
            </div>

            <div className="relative flex min-h-[220px] flex-col rounded-2xl border-2 border-green-700 bg-green-700 p-6 text-white shadow-xl shadow-green-100">
              <div className="absolute -top-3 left-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-white">Empfohlen</div>
              <h3 className="text-lg font-bold">Jährlich</h3>
              <p className="mt-2 text-3xl font-black">CHF 99<span className="text-base font-medium text-green-200">/Jahr</span></p>
              <p className="mt-2 text-sm leading-6 text-green-50">CHF 8.25/Mt. für bis zu 3 Kinderprofile.</p>
              <button
                type="button"
                onClick={() => {
                  trackAdsLpCtaClick("paid", "pricing", checkoutDestination("yearly"), "yearly");
                  startCheckout("yearly", "primarschule_uebungen_pricing", uid);
                }}
                className="mt-auto block rounded-full bg-white px-5 py-3 text-center text-sm font-black text-green-800 hover:bg-green-50"
              >
                Jährlich für bis zu 3 Kinder
              </button>
            </div>
          </div>
          <p className="mt-5 text-center text-sm text-gray-500">Sicher bezahlen mit TWINT oder Kreditkarte. Premium schaltet alle Aufgaben, Fächer und Klassen frei.</p>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-black text-gray-950">Häufige Fragen</h2>
          <div className="mt-8 space-y-4">
            {[
              ["Ist Cleverli nach Lehrplan 21 aufgebaut?", "Ja. Cleverli ist auf die Schweizer Primarschule und Lehrplan 21 ausgerichtet."],
              ["Muss ich eine App installieren?", "Nein. Cleverli läuft direkt im Browser auf Handy, Tablet und Computer."],
              ["Kann ich zuerst testen?", "Ja. Die ersten 20 Aufgaben sind gratis und ohne Kreditkarte verfügbar."],
              ["Gilt der Jahrespreis pro Kind?", "Nein. Der Jahrespreis gilt für die Familie mit bis zu 3 Kinderprofilen."],
            ].map(([q, a]) => (
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
        <h2 className="mx-auto max-w-2xl text-3xl font-black">Bereit für weniger Lern-Stress daheim?</h2>
        <p className="mx-auto mt-3 max-w-xl text-green-50">Teste 20 Aufgaben gratis oder schalte alle Übungen für die ganze Familie frei.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              trackAdsLpCtaClick("paid", "bottom", checkoutDestination("yearly"), "yearly");
              startCheckout("yearly", "primarschule_uebungen_bottom", uid);
            }}
            className="rounded-full bg-white px-7 py-4 text-base font-black text-green-800 hover:bg-green-50"
          >
            CHF 99/Jahr · bis zu 3 Kinder
          </button>
          <Link
            href={freeTrialUrl}
            onClick={() => trackAdsLpCtaClick("free", "bottom", freeTrialUrl)}
            className="rounded-full border-2 border-white px-7 py-4 text-base font-bold text-white hover:bg-green-800"
          >
            Erst kostenlos testen
          </Link>
        </div>
      </section>
    </main>
  );
}
