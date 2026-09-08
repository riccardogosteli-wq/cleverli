export default function StructuredData() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.cleverli.ch/#website",
        url: "https://www.cleverli.ch",
        name: "Cleverli",
        description: "Interaktive Lernplattform für Kinder der 1.-6. Klasse",
        inLanguage: ["de-CH", "fr-CH", "it-CH", "en-GB"],
      },
      {
        "@type": "Organization",
        "@id": "https://www.cleverli.ch/#organization",
        name: "Cleverli",
        url: "https://www.cleverli.ch",
        logo: {
          "@type": "ImageObject",
          url: "https://www.cleverli.ch/cleverli-logo.svg",
          width: 1718,
          height: 871,
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "hello@cleverli.ch",
          contactType: "customer service",
          availableLanguage: ["German", "French", "Italian", "English"],
        },
        sameAs: ["https://www.youtube.com/channel/UCN8EKFH2QTYlOpYld89OjQQ"],
        areaServed: { "@type": "Country", name: "Switzerland" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.cleverli.ch/#app",
        name: "Cleverli",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web browser",
        url: "https://www.cleverli.ch",
        description: "Cleverli ist die interaktive Lernplattform für Kinder der 1.-6. Klasse. Mathe, Deutsch und mehr — abgestimmt auf Lehrplan 21.",
        inLanguage: ["de-CH", "fr-CH", "it-CH", "en-GB"],
        publisher: { "@id": "https://www.cleverli.ch/#organization" },
        offers: [
          {
            "@type": "Offer",
            name: "Kostenlos testen",
            price: "0",
            priceCurrency: "CHF",
            description: "Die ersten 20 Aufgaben kostenlos testen",
          },
          {
            "@type": "Offer",
            name: "Premium monatlich",
            price: "9.90",
            priceCurrency: "CHF",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "9.90",
              priceCurrency: "CHF",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
            },
            description: "Voller Zugriff auf alle Übungen",
          },
          {
            "@type": "Offer",
            name: "Premium jährlich",
            price: "99",
            priceCurrency: "CHF",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "99",
              priceCurrency: "CHF",
              referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "ANN" },
            },
            description: "Voller Zugriff, jährliche Abrechnung",
          },
          {
            "@type": "Offer",
            name: "Premium lebenslang",
            price: "249",
            priceCurrency: "CHF",
            description: "Lebenslanger Zugang, einmalige Zahlung",
          },
        ],
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "student",
          audienceType: "Kinder 6–13 Jahre, Klasse 1–6 Schweiz",
        },
        educationalAlignment: [
          {
            "@type": "AlignmentObject",
            alignmentType: "educationalFramework",
            targetName: "Lehrplan 21",
            targetUrl: "https://www.lehrplan21.ch",
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
