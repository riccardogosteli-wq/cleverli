"use client";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";

const CONTENT = {
  de: {
    back: "← Zurück zur Startseite",
    title: "Impressum",
    operatorLabel: "Betreiber / Verantwortliche",
    contactLabel: "Kontakt",
    disclaimerLabel: "Haftungsausschluss",
    disclaimerText: "Die Inhalte dieser Website wurden mit grösster Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir keine Gewähr.",
    sourcesLabel: "Quellenhinweis",
    sourcesText: "Cleverli orientiert sich an der Schweizer Primarschule und am Lehrplan 21.",
    lp21Source: "Quelle: Lehrplan 21",
    copyrightLabel: "Urheberrecht",
    copyrightText: "© 2026 Cleverli. Alle Rechte vorbehalten. Die Inhalte dieser Website sind urheberrechtlich geschützt.",
  },
  fr: {
    back: "← Retour à l'accueil",
    title: "Mentions légales",
    operatorLabel: "Exploitant / Responsable",
    contactLabel: "Contact",
    disclaimerLabel: "Clause de non-responsabilité",
    disclaimerText: "Le contenu de ce site a été créé avec le plus grand soin. Nous ne garantissons pas l'exactitude, l'exhaustivité et l'actualité du contenu.",
    sourcesLabel: "Source",
    sourcesText: "Cleverli s'oriente sur l'école primaire suisse et le Lehrplan 21.",
    lp21Source: "Source: Lehrplan 21",
    copyrightLabel: "Droits d'auteur",
    copyrightText: "© 2026 Cleverli. Tous droits réservés. Le contenu de ce site est protégé par le droit d'auteur.",
  },
  it: {
    back: "← Torna alla pagina iniziale",
    title: "Note legali",
    operatorLabel: "Gestore / Responsabile",
    contactLabel: "Contatto",
    disclaimerLabel: "Esclusione di responsabilità",
    disclaimerText: "I contenuti di questo sito sono stati creati con la massima cura. Non garantiamo l'accuratezza, la completezza e l'attualità dei contenuti.",
    sourcesLabel: "Fonte",
    sourcesText: "Cleverli si orienta alla scuola primaria svizzera e al Lehrplan 21.",
    lp21Source: "Fonte: Lehrplan 21",
    copyrightLabel: "Diritto d'autore",
    copyrightText: "© 2026 Cleverli. Tutti i diritti riservati. I contenuti di questo sito sono protetti dal diritto d'autore.",
  },
  en: {
    back: "← Back to home",
    title: "Legal Notice",
    operatorLabel: "Operator / Responsible",
    contactLabel: "Contact",
    disclaimerLabel: "Disclaimer",
    disclaimerText: "The content of this website has been created with the greatest care. We do not guarantee the accuracy, completeness or timeliness of the content.",
    sourcesLabel: "Source note",
    sourcesText: "Cleverli is oriented around Swiss primary school and Lehrplan 21.",
    lp21Source: "Source: Lehrplan 21",
    copyrightLabel: "Copyright",
    copyrightText: "© 2026 Cleverli. All rights reserved. The content of this website is protected by copyright.",
  },
};

export default function ImpressumClient() {
  const { lang } = useLang();
  const t = CONTENT[lang as keyof typeof CONTENT] ?? CONTENT.de;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">{t.back}</Link>
      <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 text-gray-700">
        <div>
          <h2 className="font-bold text-gray-900 mb-1">{t.operatorLabel}</h2>
          <p>Alexandra Gosteli Digital Solutions<br />Langenmooserstrasse 22<br />8467 Truttikon<br />Schweiz</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">{t.contactLabel}</h2>
          <p>E-Mail: <a href="mailto:hello@cleverli.ch" className="text-green-700 hover:underline">hello@cleverli.ch</a></p>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">{t.disclaimerLabel}</h2>
          <p className="text-sm text-gray-500">{t.disclaimerText}</p>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">{t.sourcesLabel}</h2>
          <p className="text-sm text-gray-500">
            {t.sourcesText}{" "}
            <a href="https://www.lehrplan21.ch/" className="text-green-700 hover:underline" rel="noopener noreferrer">
              {t.lp21Source}
            </a>
          </p>
        </div>
        <div>
          <h2 className="font-bold text-gray-900 mb-1">{t.copyrightLabel}</h2>
          <p className="text-sm text-gray-500">{t.copyrightText}</p>
        </div>
      </div>
    </div>
  );
}
