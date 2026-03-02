export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.cleverli.ch/#website",
        url: "https://www.cleverli.ch",
        name: "Cleverli",
        description: "Interaktive Lernplattform für Schweizer Kinder der 1.–3. Klasse",
        inLanguage: ["de-CH", "fr-CH", "it-CH", "en-GB"],
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: "https://www.cleverli.ch/dashboard?q={search_term_string}" },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://www.cleverli.ch/#organization",
        name: "Cleverli",
        url: "https://www.cleverli.ch",
        logo: {
          "@type": "ImageObject",
          url: "https://www.cleverli.ch/cleverli-wave.png",
          width: 512,
          height: 512,
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@cleverli.ch",
          contactType: "customer service",
          availableLanguage: ["German", "French", "Italian", "English"],
        },
        areaServed: { "@type": "Country", name: "Switzerland" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.cleverli.ch/#app",
        name: "Cleverli",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web, iOS, Android",
        url: "https://www.cleverli.ch",
        description: "Cleverli ist die interaktive Schweizer Lernplattform für Kinder der 1.–3. Klasse. Mathe, Deutsch und mehr — abgestimmt auf Lehrplan 21.",
        inLanguage: ["de-CH", "fr-CH", "it-CH", "en-GB"],
        screenshot: "https://www.cleverli.ch/og-image.png",
        offers: [
          {
            "@type": "Offer",
            name: "Kostenlos testen",
            price: "0",
            priceCurrency: "CHF",
            description: "Erste 3 Aufgaben pro Thema gratis",
          },
          {
            "@type": "Offer",
            name: "Premium",
            price: "9.90",
            priceCurrency: "CHF",
            billingDuration: "P1M",
            description: "Voller Zugriff auf alle Übungen",
          },
        ],
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "student",
          audienceType: "Kinder 6–10 Jahre, Klasse 1–3 Schweiz",
        },
        educationalAlignment: [
          {
            "@type": "AlignmentObject",
            alignmentType: "educationalFramework",
            targetName: "Lehrplan 21",
            targetUrl: "https://www.lehrplan21.ch",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "47",
          bestRating: "5",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.cleverli.ch/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Kann ich Cleverli kostenlos ausprobieren?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Ja! Die ersten 3 Aufgaben pro Thema kannst du immer kostenlos testen — ganz ohne Anmeldung oder Kreditkarte.",
            },
          },
          {
            "@type": "Question",
            name: "Für welche Klassen ist Cleverli?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Aktuell decken wir die 1., 2. und 3. Klasse ab (Schweizer Lehrplan 21, alle Kantone).",
            },
          },
          {
            "@type": "Question",
            name: "Brauche ich eine App herunterladen?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Nein. Cleverli läuft direkt im Browser auf Handy, Tablet und Computer — nichts installieren nötig.",
            },
          },
          {
            "@type": "Question",
            name: "Wie kündige ich das Abo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Jederzeit — kein Mindestabo, keine Kündigungsfrist. Einfach in den Einstellungen kündigen.",
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
