"use client";

import Image from "next/image";

const exerciseImages = [
  {
    src: "/images/ads/exercise-math-vorlesen.png",
    alt: "Cleverli Beispielaufgabe Mathe mit Vorlesen, Tipp und direktem Feedback",
    title: "Mathe mit direktem Feedback",
  },
  {
    src: "/images/ads/exercise-deutsch-vorlesen.png",
    alt: "Cleverli Deutsch Beispielaufgabe mit Satz vorlesen und Tipp anzeigen",
    title: "Deutsch mit Vorlesen",
  },
  {
    src: "/images/ads/exercise-memory-paare.png",
    alt: "Cleverli Memory Beispielaufgabe mit Paare finden und Vorlesen",
    title: "Spielerische Übungsformen",
  },
];

export default function AdsExerciseImages() {
  return (
    <section className="bg-white px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-green-700">Beispielaufgaben</p>
          <h2 className="mt-2 text-3xl font-black text-gray-950">So sieht eine kurze Übungsrunde aus.</h2>
          <p className="mt-3 text-base leading-7 text-gray-600">
            Klare Aufgaben, Vorlesen, Tipps und direkte Rückmeldung helfen Kindern, selbstständiger weiterzukommen.
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {exerciseImages.map((item) => (
            <figure key={item.src} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <Image
                src={item.src}
                alt={item.alt}
                width={1200}
                height={628}
                className="h-auto w-full"
                sizes="(min-width: 1024px) 360px, 100vw"
              />
              <figcaption className="border-t border-gray-100 px-4 py-3 text-sm font-bold text-gray-800">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
