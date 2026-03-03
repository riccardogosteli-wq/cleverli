"use client";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";

const PROVIDER = "Alexandra Gosteli";
const ADDRESS = "Langenmooserstrasse 22, 8467 Truttikon, Schweiz";
const EMAIL = "hello@cleverli.ch";
const WEBSITE = "www.cleverli.ch";

// ─────────────────────────────────────────────────────────────────────────────
// Content per language
// ─────────────────────────────────────────────────────────────────────────────

const content = {
  de: {
    title: "Allgemeine Geschäftsbedingungen (AGB)",
    updated: "Stand: März 2026",
    sections: [
      {
        heading: "1. Anbieter",
        body: `Cleverli wird betrieben von:

${PROVIDER}
${ADDRESS}
E-Mail: ${EMAIL}
Website: ${WEBSITE}

(nachfolgend «Anbieter» oder «wir»)`,
      },
      {
        heading: "2. Geltungsbereich",
        body: `Diese AGB gelten für alle Verträge zwischen dem Anbieter und den Nutzern der Lernplattform Cleverli (nachfolgend «Dienst»), die über die Website ${WEBSITE} oder zugehörige mobile Anwendungen abgeschlossen werden. Mit der Registrierung oder Nutzung des Dienstes akzeptieren Sie diese AGB.`,
      },
      {
        heading: "3. Leistungsbeschreibung",
        body: `Cleverli ist eine digitale Lernplattform für Kinder der Grundschule (1.–3. Klasse) mit interaktiven Übungen in den Fächern Mathematik, Deutsch und Natur & Mensch (NMG). Die Plattform wird in den Sprachen Deutsch, Französisch, Italienisch und Englisch angeboten.

Kostenlose Inhalte (die ersten drei Übungen je Thema) stehen ohne Registrierung zur Verfügung. Der vollständige Zugang erfordert ein aktives Premium-Abonnement.

Der Anbieter behält sich vor, den Funktionsumfang des Dienstes jederzeit zu erweitern, anzupassen oder einzelne Funktionen einzustellen, sofern dies zumutbar ist.`,
      },
      {
        heading: "4. Registrierung & Nutzerkonto",
        body: `Die Registrierung steht volljährigen Personen (Eltern, Erziehungsberechtigte) offen. Bei der Registrierung sind wahrheitsgemässe Angaben zu machen. Das Nutzerkonto ist persönlich und nicht übertragbar.

Der Nutzer ist für die Geheimhaltung seiner Zugangsdaten verantwortlich. Bei Verdacht auf Missbrauch ist der Anbieter unverzüglich zu informieren.`,
      },
      {
        heading: "5. Abonnement & Preise",
        body: `Cleverli Premium ist erhältlich als:
• Monatsabonnement: CHF 9.90 / Monat
• Jahresabonnement: CHF 99.00 / Jahr (entspricht CHF 8.25 / Monat)

Alle Preise verstehen sich in Schweizer Franken (CHF) inkl. Mehrwertsteuer.

Das Abonnement verlängert sich automatisch um die gewählte Laufzeit, sofern es nicht rechtzeitig gekündigt wird. Die Abbuchung erfolgt im Voraus zum Beginn jeder Abrechnungsperiode.

Preisänderungen werden dem Nutzer mindestens 30 Tage vor Inkrafttreten per E-Mail mitgeteilt.`,
      },
      {
        heading: "6. Kündigung",
        body: `Das Abonnement kann jederzeit mit Wirkung auf das Ende der laufenden Abrechnungsperiode gekündigt werden. Nach der Kündigung bleibt der Premiumzugang bis zum Ende des bezahlten Zeitraums erhalten.

Die Kündigung erfolgt über das Nutzerkonto unter «Mein Konto» oder per E-Mail an ${EMAIL}.

Eine Rückerstattung bereits bezahlter Beträge erfolgt nicht, ausser der Anbieter stellt den Dienst vollständig ein.`,
      },
      {
        heading: "7. Ausschluss des Widerrufsrechts",
        body: `Mit Abschluss des Abonnements erklärt der Nutzer ausdrücklich sein Einverständnis, dass die Bereitstellung des Dienstes sofort nach Vertragsschluss beginnt. Der Nutzer nimmt zur Kenntnis, dass er damit sein allfälliges gesetzliches Widerrufsrecht verliert, soweit ein solches nach anwendbarem Recht bestünde.`,
      },
      {
        heading: "8. Datenschutz",
        body: `Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäss unserer Datenschutzerklärung, die unter ${WEBSITE}/datenschutz abrufbar ist.

Wir nehmen den Schutz von Kinderdaten besonders ernst. Persönliche Daten von Kindern werden nur im Rahmen der Plattformnutzung verarbeitet und nicht an Dritte weitergegeben. Die Nutzung des Dienstes durch Minderjährige erfolgt unter Aufsicht und Verantwortung der erziehungsberechtigten Person.`,
      },
      {
        heading: "9. Geistiges Eigentum",
        body: `Alle Inhalte auf Cleverli (Texte, Grafiken, Illustrationen, Software, Übungen) sind urheberrechtlich geschützt und Eigentum des Anbieters oder lizenzierter Dritter. Eine Vervielfältigung, Verbreitung oder Bearbeitung ohne ausdrückliche Genehmigung ist untersagt.

Die Nutzung ist ausschliesslich für den privaten, nicht-kommerziellen Gebrauch im Rahmen des Abonnements gestattet.`,
      },
      {
        heading: "10. Haftung",
        body: `Der Anbieter haftet nur für Schäden, die durch vorsätzliches oder grobfahrlässiges Verhalten verursacht wurden. Die Haftung für leichte Fahrlässigkeit sowie für indirekte Schäden, Folgeschäden und entgangenen Gewinn ist ausgeschlossen, soweit gesetzlich zulässig.

Der Anbieter übernimmt keine Garantie für die ständige Verfügbarkeit des Dienstes. Wartungsarbeiten werden wenn möglich ausserhalb der Hauptnutzungszeiten durchgeführt.`,
      },
      {
        heading: "11. Änderungen der AGB",
        body: `Der Anbieter behält sich vor, diese AGB jederzeit anzupassen. Änderungen werden dem Nutzer per E-Mail oder über eine Mitteilung auf der Plattform mindestens 30 Tage vor Inkrafttreten mitgeteilt. Die fortgesetzte Nutzung des Dienstes nach diesem Zeitpunkt gilt als Zustimmung zu den geänderten AGB.`,
      },
      {
        heading: "12. Anwendbares Recht & Gerichtsstand",
        body: `Es gilt Schweizer Recht unter Ausschluss des Übereinkommens der Vereinten Nationen über Verträge über den internationalen Warenkauf (CISG).

Ausschliesslicher Gerichtsstand für alle Streitigkeiten ist Zürich, Schweiz, sofern kein zwingender gesetzlicher Gerichtsstand entgegensteht.`,
      },
      {
        heading: "13. Kontakt",
        body: `Bei Fragen zu diesen AGB wenden Sie sich bitte an:

${PROVIDER}
${ADDRESS}
E-Mail: ${EMAIL}`,
      },
    ],
  },

  fr: {
    title: "Conditions Générales d'Utilisation (CGU)",
    updated: "Version : mars 2026",
    sections: [
      {
        heading: "1. Fournisseur",
        body: `Cleverli est exploité par :

${PROVIDER}
${ADDRESS}
E-mail : ${EMAIL}
Site web : ${WEBSITE}

(ci-après «Fournisseur» ou «nous»)`,
      },
      {
        heading: "2. Champ d'application",
        body: `Les présentes CGU régissent tous les contrats conclus entre le Fournisseur et les utilisateurs de la plateforme d'apprentissage Cleverli (ci-après «Service»), accessibles via ${WEBSITE} ou les applications associées. En s'inscrivant ou en utilisant le Service, vous acceptez les présentes CGU.`,
      },
      {
        heading: "3. Description du service",
        body: `Cleverli est une plateforme d'apprentissage numérique pour les enfants du primaire (1re–3e année) proposant des exercices interactifs en mathématiques, allemand et connaissance de l'environnement. La plateforme est disponible en allemand, français, italien et anglais.

Le contenu gratuit (les trois premiers exercices par thème) est accessible sans inscription. L'accès complet nécessite un abonnement Premium actif.

Le Fournisseur se réserve le droit de modifier ou d'adapter le Service à tout moment dans la mesure du raisonnable.`,
      },
      {
        heading: "4. Inscription & compte utilisateur",
        body: `L'inscription est réservée aux personnes majeures (parents, tuteurs légaux). Les informations fournies lors de l'inscription doivent être exactes. Le compte est personnel et non cessible.

L'utilisateur est responsable de la confidentialité de ses identifiants. Tout abus suspecté doit être signalé immédiatement au Fournisseur.`,
      },
      {
        heading: "5. Abonnement & tarifs",
        body: `Cleverli Premium est disponible en :
• Abonnement mensuel : CHF 9.90 / mois
• Abonnement annuel : CHF 99.00 / an (soit CHF 8.25 / mois)

Tous les prix sont en francs suisses (CHF), TVA incluse.

L'abonnement se renouvelle automatiquement pour la durée choisie, sauf résiliation dans les délais. Le paiement est prélevé à l'avance au début de chaque période de facturation.

Toute modification tarifaire sera communiquée par e-mail au moins 30 jours avant son entrée en vigueur.`,
      },
      {
        heading: "6. Résiliation",
        body: `L'abonnement peut être résilié à tout moment avec effet à la fin de la période de facturation en cours. Après résiliation, l'accès Premium reste actif jusqu'à la fin de la période payée.

La résiliation s'effectue via «Mon compte» ou par e-mail à ${EMAIL}.

Aucun remboursement n'est accordé pour les périodes déjà payées, sauf en cas d'arrêt total du Service par le Fournisseur.`,
      },
      {
        heading: "7. Exclusion du droit de rétractation",
        body: `En souscrivant un abonnement, l'utilisateur consent expressément à ce que la fourniture du Service commence immédiatement après la conclusion du contrat. L'utilisateur reconnaît par là perdre tout éventuel droit légal de rétractation dans la mesure prévue par le droit applicable.`,
      },
      {
        heading: "8. Protection des données",
        body: `La collecte et le traitement des données personnelles sont régis par notre Politique de confidentialité, disponible à l'adresse ${WEBSITE}/datenschutz.

Nous accordons une attention particulière à la protection des données des enfants. Les données personnelles des enfants sont traitées uniquement dans le cadre de l'utilisation de la plateforme et ne sont pas transmises à des tiers. L'utilisation du Service par des mineurs s'effectue sous la surveillance et la responsabilité du parent ou tuteur légal.`,
      },
      {
        heading: "9. Propriété intellectuelle",
        body: `Tous les contenus de Cleverli (textes, graphiques, illustrations, logiciels, exercices) sont protégés par le droit d'auteur et appartiennent au Fournisseur ou à des tiers licenciés. Toute reproduction, diffusion ou modification sans autorisation expresse est interdite.

L'utilisation est autorisée uniquement à des fins privées et non commerciales dans le cadre de l'abonnement.`,
      },
      {
        heading: "10. Responsabilité",
        body: `Le Fournisseur n'est responsable que des dommages causés intentionnellement ou par négligence grave. La responsabilité pour négligence légère, dommages indirects, consécutifs et manque à gagner est exclue dans les limites légales.

Le Fournisseur ne garantit pas la disponibilité permanente du Service. Les maintenances sont effectuées autant que possible en dehors des heures de pointe.`,
      },
      {
        heading: "11. Modifications des CGU",
        body: `Le Fournisseur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications seront communiquées par e-mail ou via une notification sur la plateforme au moins 30 jours avant leur entrée en vigueur. La poursuite de l'utilisation du Service après ce délai vaut acceptation des CGU modifiées.`,
      },
      {
        heading: "12. Droit applicable & for juridique",
        body: `Le droit suisse est applicable, à l'exclusion de la Convention des Nations Unies sur les contrats de vente internationale de marchandises (CVIM).

Le for exclusif pour tout litige est Zurich, Suisse, sous réserve de tout for légal impératif.`,
      },
      {
        heading: "13. Contact",
        body: `Pour toute question relative aux présentes CGU :

${PROVIDER}
${ADDRESS}
E-mail : ${EMAIL}`,
      },
    ],
  },

  it: {
    title: "Condizioni Generali di Contratto (CGC)",
    updated: "Versione: marzo 2026",
    sections: [
      {
        heading: "1. Fornitore",
        body: `Cleverli è gestito da:

${PROVIDER}
${ADDRESS}
E-mail: ${EMAIL}
Sito web: ${WEBSITE}

(di seguito «Fornitore» o «noi»)`,
      },
      {
        heading: "2. Ambito di applicazione",
        body: `Le presenti CGC disciplinano tutti i contratti conclusi tra il Fornitore e gli utenti della piattaforma di apprendimento Cleverli (di seguito «Servizio»), accessibile tramite ${WEBSITE} o le relative applicazioni. Registrandosi o utilizzando il Servizio, l'utente accetta le presenti CGC.`,
      },
      {
        heading: "3. Descrizione del servizio",
        body: `Cleverli è una piattaforma di apprendimento digitale per bambini della scuola elementare (1a–3a classe) con esercizi interattivi in matematica, tedesco e conoscenza dell'ambiente. La piattaforma è disponibile in tedesco, francese, italiano e inglese.

I contenuti gratuiti (i primi tre esercizi per argomento) sono accessibili senza registrazione. L'accesso completo richiede un abbonamento Premium attivo.

Il Fornitore si riserva il diritto di modificare o adattare il Servizio in qualsiasi momento nella misura del ragionevole.`,
      },
      {
        heading: "4. Registrazione & account utente",
        body: `La registrazione è aperta a persone maggiorenni (genitori, tutori legali). Le informazioni fornite devono essere veritiere. L'account è personale e non cedibile.

L'utente è responsabile della riservatezza delle proprie credenziali. Qualsiasi abuso sospetto deve essere segnalato immediatamente al Fornitore.`,
      },
      {
        heading: "5. Abbonamento & prezzi",
        body: `Cleverli Premium è disponibile come:
• Abbonamento mensile: CHF 9.90 / mese
• Abbonamento annuale: CHF 99.00 / anno (pari a CHF 8.25 / mese)

Tutti i prezzi sono in franchi svizzeri (CHF), IVA inclusa.

L'abbonamento si rinnova automaticamente per la durata scelta, salvo disdetta nei termini previsti. Il pagamento avviene in anticipo all'inizio di ogni periodo di fatturazione.

Eventuali modifiche tariffarie saranno comunicate via e-mail almeno 30 giorni prima dell'entrata in vigore.`,
      },
      {
        heading: "6. Disdetta",
        body: `L'abbonamento può essere disdetto in qualsiasi momento con effetto alla fine del periodo di fatturazione in corso. Dopo la disdetta, l'accesso Premium rimane attivo fino alla fine del periodo pagato.

La disdetta avviene tramite «Il mio account» o via e-mail a ${EMAIL}.

Non è previsto alcun rimborso per i periodi già pagati, salvo in caso di cessazione totale del Servizio da parte del Fornitore.`,
      },
      {
        heading: "7. Esclusione del diritto di recesso",
        body: `Sottoscrivendo un abbonamento, l'utente acconsente espressamente a che la fornitura del Servizio inizi immediatamente dopo la conclusione del contratto. L'utente riconosce con ciò di perdere l'eventuale diritto legale di recesso nella misura prevista dal diritto applicabile.`,
      },
      {
        heading: "8. Protezione dei dati",
        body: `La raccolta e il trattamento dei dati personali sono regolati dalla nostra Informativa sulla privacy, disponibile all'indirizzo ${WEBSITE}/datenschutz.

Prestiamo particolare attenzione alla protezione dei dati dei bambini. I dati personali dei bambini vengono trattati esclusivamente nell'ambito dell'utilizzo della piattaforma e non vengono trasmessi a terzi. L'utilizzo del Servizio da parte di minori avviene sotto la supervisione e la responsabilità del genitore o tutore legale.`,
      },
      {
        heading: "9. Proprietà intellettuale",
        body: `Tutti i contenuti di Cleverli (testi, grafica, illustrazioni, software, esercizi) sono protetti dal diritto d'autore e appartengono al Fornitore o a terzi licenziatari. Qualsiasi riproduzione, diffusione o modifica senza espressa autorizzazione è vietata.

L'utilizzo è consentito esclusivamente per uso privato e non commerciale nell'ambito dell'abbonamento.`,
      },
      {
        heading: "10. Responsabilità",
        body: `Il Fornitore risponde solo dei danni causati intenzionalmente o per negligenza grave. La responsabilità per negligenza lieve, danni indiretti, consequenziali e mancato guadagno è esclusa nei limiti di legge.

Il Fornitore non garantisce la disponibilità permanente del Servizio. La manutenzione viene effettuata, per quanto possibile, al di fuori degli orari di punta.`,
      },
      {
        heading: "11. Modifiche alle CGC",
        body: `Il Fornitore si riserva il diritto di modificare le presenti CGC in qualsiasi momento. Le modifiche saranno comunicate via e-mail o tramite notifica sulla piattaforma almeno 30 giorni prima dell'entrata in vigore. La prosecuzione dell'utilizzo del Servizio dopo tale termine costituisce accettazione delle CGC modificate.`,
      },
      {
        heading: "12. Diritto applicabile & foro competente",
        body: `Si applica il diritto svizzero, con esclusione della Convenzione delle Nazioni Unite sui contratti di vendita internazionale di merci (CISG).

Il foro esclusivo per qualsiasi controversia è Zurigo, Svizzera, fatte salve eventuali disposizioni di legge imperative.`,
      },
      {
        heading: "13. Contatto",
        body: `Per domande relative alle presenti CGC:

${PROVIDER}
${ADDRESS}
E-mail: ${EMAIL}`,
      },
    ],
  },

  en: {
    title: "Terms and Conditions",
    updated: "Version: March 2026",
    sections: [
      {
        heading: "1. Provider",
        body: `Cleverli is operated by:

${PROVIDER}
${ADDRESS}
Email: ${EMAIL}
Website: ${WEBSITE}

(hereinafter «Provider» or «we»)`,
      },
      {
        heading: "2. Scope",
        body: `These Terms and Conditions govern all contracts between the Provider and users of the Cleverli learning platform (hereinafter «Service»), accessible via ${WEBSITE} or associated applications. By registering or using the Service, you accept these Terms.`,
      },
      {
        heading: "3. Service Description",
        body: `Cleverli is a digital learning platform for primary school children (grades 1–3) offering interactive exercises in mathematics, German, and general studies (nature & society). The platform is available in German, French, Italian, and English.

Free content (the first three exercises per topic) is available without registration. Full access requires an active Premium subscription.

The Provider reserves the right to expand, modify, or discontinue features of the Service at any time, to the extent reasonable.`,
      },
      {
        heading: "4. Registration & User Account",
        body: `Registration is open to adults (parents, legal guardians). Information provided during registration must be accurate. The user account is personal and non-transferable.

The user is responsible for keeping their login credentials confidential. Any suspected misuse must be reported to the Provider immediately.`,
      },
      {
        heading: "5. Subscription & Pricing",
        body: `Cleverli Premium is available as:
• Monthly subscription: CHF 9.90 / month
• Annual subscription: CHF 99.00 / year (equivalent to CHF 8.25 / month)

All prices are in Swiss Francs (CHF) including VAT.

Subscriptions renew automatically for the chosen period unless cancelled in time. Payment is charged in advance at the beginning of each billing period.

Price changes will be communicated by email at least 30 days before taking effect.`,
      },
      {
        heading: "6. Cancellation",
        body: `Subscriptions may be cancelled at any time with effect from the end of the current billing period. After cancellation, Premium access remains active until the end of the paid period.

Cancellation is done via «My Account» or by email to ${EMAIL}.

No refunds are given for periods already paid, except if the Provider discontinues the Service entirely.`,
      },
      {
        heading: "7. Exclusion of Right of Withdrawal",
        body: `By subscribing, the user expressly agrees that the provision of the Service begins immediately upon conclusion of the contract. The user acknowledges that they thereby waive any statutory right of withdrawal to the extent provided under applicable law.`,
      },
      {
        heading: "8. Data Protection",
        body: `The collection and processing of personal data is governed by our Privacy Policy, available at ${WEBSITE}/datenschutz.

We take the protection of children's data particularly seriously. Personal data of children is processed solely in the context of platform use and is not shared with third parties. Use of the Service by minors is subject to the supervision and responsibility of the parent or legal guardian.`,
      },
      {
        heading: "9. Intellectual Property",
        body: `All content on Cleverli (text, graphics, illustrations, software, exercises) is protected by copyright and belongs to the Provider or licensed third parties. Reproduction, distribution, or modification without express permission is prohibited.

Use is permitted solely for private, non-commercial purposes within the scope of the subscription.`,
      },
      {
        heading: "10. Liability",
        body: `The Provider is only liable for damages caused intentionally or through gross negligence. Liability for slight negligence, indirect damages, consequential damages, and lost profits is excluded to the extent permitted by law.

The Provider does not guarantee permanent availability of the Service. Maintenance work is carried out outside peak usage times wherever possible.`,
      },
      {
        heading: "11. Changes to Terms",
        body: `The Provider reserves the right to modify these Terms at any time. Changes will be communicated by email or via a notification on the platform at least 30 days before taking effect. Continued use of the Service after that date constitutes acceptance of the updated Terms.`,
      },
      {
        heading: "12. Governing Law & Jurisdiction",
        body: `Swiss law applies, excluding the United Nations Convention on Contracts for the International Sale of Goods (CISG).

The exclusive place of jurisdiction for all disputes is Zurich, Switzerland, subject to any mandatory statutory provisions.`,
      },
      {
        heading: "13. Contact",
        body: `For questions regarding these Terms:

${PROVIDER}
${ADDRESS}
Email: ${EMAIL}`,
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────────────────────────────────────

export default function AGBPage() {
  const { lang } = useLang();
  const t = content[lang as keyof typeof content] ?? content.de;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-10 pb-20">

        {/* Back link */}
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 mb-6 inline-block">
          ← {lang === "fr" ? "Accueil" : lang === "it" ? "Home" : lang === "en" ? "Home" : "Startseite"}
        </Link>

        {/* Title */}
        <h1 className="text-2xl font-black text-gray-900 mb-1">{t.title}</h1>
        <p className="text-xs text-gray-400 mb-8">{t.updated}</p>

        {/* Sections */}
        <div className="space-y-7">
          {t.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-base font-bold text-gray-800 mb-2">{s.heading}</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {s.body}
              </div>
            </section>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400">
          <p>
            {lang === "fr"
              ? `Ces CGU sont soumises au droit suisse.`
              : lang === "it"
              ? `Le presenti CGC sono soggette al diritto svizzero.`
              : lang === "en"
              ? `These Terms are governed by Swiss law.`
              : `Diese AGB unterliegen Schweizer Recht.`}
          </p>
        </div>
      </div>
    </div>
  );
}
