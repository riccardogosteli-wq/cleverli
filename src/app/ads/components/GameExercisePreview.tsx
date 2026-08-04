"use client";

type GameExercisePreviewProps = {
  exerciseTitle?: string;
  pairs?: [string, string][];
};

const defaultPairs: [string, string][] = [
  ["6 × 7", "42"],
  ["8 × 4", "32"],
  ["9 × 3", "27"],
];

export default function GameExercisePreview({
  exerciseTitle = "Finde Rechnung und Ergebnis.",
  pairs = defaultPairs,
}: GameExercisePreviewProps) {
  const cards = pairs.flatMap(([left, right], pairIndex) => [
    { label: left, pair: pairIndex, side: "left" },
    { label: right, pair: pairIndex, side: "right" },
  ]);
  const orderedCards = [cards[0], cards[3], cards[4], cards[1], cards[2], cards[5]];

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2 lg:items-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-lg font-black text-green-800">
              1
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-700">Klassische Aufgabe</p>
              <h3 className="mt-1 text-lg font-black text-gray-950">Wie viel ist 8 + 7 + 9?</h3>
              <p className="mt-1 text-sm font-bold text-gray-500">2. Klasse Mathe</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {["22", "24", "26"].map((answer, index) => (
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

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-center text-sm font-bold text-green-800">
              Vorlesen
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm font-bold text-amber-800">
              Tipp anzeigen
            </div>
          </div>

          <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-xs font-semibold leading-5 text-gray-600">
            Tipp: Rechne zuerst 8 + 7. Danach zählst du 9 dazu.
          </p>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-green-700 px-4 py-3 text-white">
            <span className="text-sm font-black">Antwort prüfen</span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">+10 XP</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Memory</p>
              <h3 className="mt-1 text-lg font-black text-gray-950">{exerciseTitle}</h3>
              <p className="mt-1 text-sm font-bold text-gray-500">Paare finden</p>
            </div>
            <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">+20 XP</div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/3 rounded-full bg-emerald-600" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {orderedCards.map((card, index) => {
              const isMatched = card.pair === 0;
              const isOpen = isMatched || index === 4;
              return (
                <div
                  key={`${card.label}-${card.side}`}
                  className={`flex aspect-[1.2] items-center justify-center rounded-2xl border px-2 text-center text-sm font-black shadow-sm ${
                    isMatched
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                      : isOpen
                        ? "border-blue-200 bg-white text-gray-900"
                        : "border-green-700 bg-green-700 text-white"
                  }`}
                >
                  {isOpen ? card.label : "?"}
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-black text-emerald-900">1 Paar gefunden.</p>
            <p className="mt-1 text-xs font-semibold text-emerald-700">Weiter so: Noch zwei Paare bis zur fertigen Runde.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
