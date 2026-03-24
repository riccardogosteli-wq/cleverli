"use client";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";

type Lang = "de" | "fr" | "it" | "en";

const T: Record<Lang, {
  back: string; title: string; updated: string;
  s1h: string; s1p: string;
  s2h: string; s2progress: string; s2account: string; s2tech: string;
  s3h: string; s3p1: string; s3p2: string;
  s4h: string; s4p: string;
  s5h: string; s5p: string;
  s6h: string; s6p: string;
}> = {
  de: {
    back: "← Zurück zur Startseite",
    title: "Datenschutzerklärung",
    updated: "Stand: März 2026",
    s1h: "1. Verantwortliche Stelle",
    s1p: "A. Gosteli Digital Solutions, 8467 Truttikon, Schweiz. Kontakt:",
    s2h: "2. Welche Daten wir sammeln",
    s2progress: "Lernfortschritt: Lokal im Browser gespeichert (localStorage), nicht auf unseren Servern.",
    s2account: "Konto (optional): Name, E-Mail-Adresse beim Erstellen eines Kontos.",
    s2tech: "Technische Daten: Serverlog-Daten (IP, Browser) durch den Hosting-Anbieter Vercel.",
    s3h: "3. Cookies & Tag-Management",
    s3p1: "Wir verwenden keine Tracking-Cookies für Werbung oder persönliche Profile. Kein Facebook Pixel.",
    s3p2: "Wir setzen Google Tag Manager (GTM) als technische Infrastruktur ein. GTM selbst erhebt keine personenbezogenen Daten — es dient als Container für Analyse-Tags, die nur nach expliziter Konfiguration aktiviert werden.",
    s4h: "4. Kinder & Datenschutz",
    s4p: "Cleverli richtet sich an Kinder unter 13 Jahren. Wir erheben bewusst minimale Daten und empfehlen, dass Eltern das Konto für ihre Kinder erstellen. Gemäss DSG (Schweiz) und DSGVO.",
    s5h: "5. Deine Rechte",
    s5p: "Du hast das Recht auf Auskunft, Berichtigung und Löschung deiner Daten. Kontaktiere uns unter",
    s6h: "6. Hosting",
    s6p: "Diese Website wird gehostet bei Vercel Inc., USA. Vercel ist dem EU-US Data Privacy Framework beigetreten.",
  },
  fr: {
    back: "← Retour à l'accueil",
    title: "Politique de confidentialité",
    updated: "Mise à jour : mars 2026",
    s1h: "1. Responsable du traitement",
    s1p: "A. Gosteli Digital Solutions, 8467 Truttikon, Suisse. Contact :",
    s2h: "2. Données collectées",
    s2progress: "Progression d'apprentissage : stockée localement dans le navigateur (localStorage), pas sur nos serveurs.",
    s2account: "Compte (optionnel) : nom et adresse e-mail lors de la création d'un compte.",
    s2tech: "Données techniques : données du journal serveur (IP, navigateur) via l'hébergeur Vercel.",
    s3h: "3. Cookies & gestion des balises",
    s3p1: "Nous n'utilisons pas de cookies de suivi à des fins publicitaires ou de profilage. Pas de pixel Facebook.",
    s3p2: "Nous utilisons Google Tag Manager (GTM) comme infrastructure technique. GTM lui-même ne collecte pas de données personnelles — il sert de conteneur pour les balises analytiques, activées uniquement après configuration explicite.",
    s4h: "4. Enfants & protection des données",
    s4p: "Cleverli s'adresse aux enfants de moins de 13 ans. Nous collectons un minimum de données et recommandons que les parents créent le compte pour leurs enfants. Conformément au nDPT (Suisse) et au RGPD.",
    s5h: "5. Tes droits",
    s5p: "Tu as le droit d'accès, de rectification et de suppression de tes données. Contacte-nous à",
    s6h: "6. Hébergement",
    s6p: "Ce site est hébergé par Vercel Inc., États-Unis. Vercel adhère au cadre EU-US Data Privacy Framework.",
  },
  it: {
    back: "← Torna alla pagina iniziale",
    title: "Informativa sulla privacy",
    updated: "Aggiornamento: marzo 2026",
    s1h: "1. Titolare del trattamento",
    s1p: "A. Gosteli Digital Solutions, 8467 Truttikon, Svizzera. Contatto:",
    s2h: "2. Dati raccolti",
    s2progress: "Progressi di apprendimento: salvati localmente nel browser (localStorage), non sui nostri server.",
    s2account: "Account (facoltativo): nome e indirizzo e-mail al momento della creazione dell'account.",
    s2tech: "Dati tecnici: dati del registro del server (IP, browser) tramite il fornitore di hosting Vercel.",
    s3h: "3. Cookie & gestione dei tag",
    s3p1: "Non utilizziamo cookie di tracciamento per pubblicità o profilazione. Nessun pixel Facebook.",
    s3p2: "Utilizziamo Google Tag Manager (GTM) come infrastruttura tecnica. GTM stesso non raccoglie dati personali — funge da contenitore per i tag analitici, attivati solo dopo configurazione esplicita.",
    s4h: "4. Bambini & protezione dei dati",
    s4p: "Cleverli si rivolge a bambini di età inferiore ai 13 anni. Raccogliamo il minimo indispensabile e consigliamo che i genitori creino l'account per i propri figli. In conformità con la LPD (Svizzera) e il GDPR.",
    s5h: "5. I tuoi diritti",
    s5p: "Hai il diritto di accesso, rettifica e cancellazione dei tuoi dati. Contattaci a",
    s6h: "6. Hosting",
    s6p: "Questo sito è ospitato da Vercel Inc., USA. Vercel aderisce al quadro EU-US Data Privacy Framework.",
  },
  en: {
    back: "← Back to home",
    title: "Privacy Policy",
    updated: "Last updated: March 2026",
    s1h: "1. Data Controller",
    s1p: "A. Gosteli Digital Solutions, 8467 Truttikon, Switzerland. Contact:",
    s2h: "2. Data We Collect",
    s2progress: "Learning progress: stored locally in your browser (localStorage), not on our servers.",
    s2account: "Account (optional): name and email address when creating an account.",
    s2tech: "Technical data: server log data (IP, browser) via hosting provider Vercel.",
    s3h: "3. Cookies & Tag Management",
    s3p1: "We do not use tracking cookies for advertising or personal profiling. No Facebook Pixel.",
    s3p2: "We use Google Tag Manager (GTM) as technical infrastructure. GTM itself does not collect personal data — it serves as a container for analytics tags, activated only after explicit configuration.",
    s4h: "4. Children & Privacy",
    s4p: "Cleverli is aimed at children under 13. We collect minimal data and recommend that parents create accounts for their children. In accordance with the Swiss DSG and GDPR.",
    s5h: "5. Your Rights",
    s5p: "You have the right to access, correct and delete your data. Contact us at",
    s6h: "6. Hosting",
    s6p: "This website is hosted by Vercel Inc., USA. Vercel has joined the EU-US Data Privacy Framework.",
  },
};

export default function DatenschutzClient() {
  const { lang } = useLang();
  const t = T[lang as Lang] ?? T.de;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">{t.back}</Link>
      <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5 text-gray-700 text-sm leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">{t.s1h}</h2>
          <p>{t.s1p} <a href="mailto:hello@cleverli.ch" className="text-green-700 hover:underline">hello@cleverli.ch</a></p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">{t.s2h}</h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600">
            <li>{t.s2progress}</li>
            <li>{t.s2account}</li>
            <li>{t.s2tech}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">{t.s3h}</h2>
          <p className="text-gray-600">{t.s3p1}</p>
          <p className="text-gray-600 mt-2">{t.s3p2}</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">{t.s4h}</h2>
          <p className="text-gray-600">{t.s4p}</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">{t.s5h}</h2>
          <p className="text-gray-600">{t.s5p} <a href="mailto:hello@cleverli.ch" className="text-green-700 hover:underline">hello@cleverli.ch</a>.</p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 text-base mb-2">{t.s6h}</h2>
          <p className="text-gray-600">{t.s6p}</p>
        </section>

        <p className="text-gray-400 text-xs pt-2">{t.updated}</p>
      </div>
    </div>
  );
}
