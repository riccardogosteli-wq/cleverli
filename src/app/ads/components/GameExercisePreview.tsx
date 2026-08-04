"use client";

type GameExercisePreviewProps = {
  title?: string;
  body?: string;
  exerciseTitle?: string;
  pairs?: [string, string][];
};

const defaultPairs: [string, string][] = [
  ["6 × 7", "42"],
  ["8 × 4", "32"],
  ["9 × 3", "27"],
];

export default function GameExercisePreview({
  title = "Noch spielerischer: Memory-Runde.",
  body = "Neben klassischen Aufgaben sieht dein Kind auch spielerische Formate: Karten merken, Paare finden und dabei Rechnungen festigen.",
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
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Beispielaufgabe</p>
          <h2 className="mt-2 text-3xl font-black text-gray-950">{title}</h2>
          <p className="mt-4 text-base leading-7 text-gray-600">{body}</p>
          <div className="mt-5 grid gap-3 text-sm font-bold text-gray-700 sm:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">Merken</div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">Paar finden</div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">Feedback sehen</div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Memory</p>
              <h3 className="mt-1 text-lg font-black text-gray-950">{exerciseTitle}</h3>
            </div>
            <div className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">+20 XP</div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
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
