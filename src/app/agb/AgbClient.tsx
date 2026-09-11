"use client";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";

const PROVIDER = "Alexandra Gosteli Digital Solutions";
const ADDRESS = "Langenmooserstrasse 22, 8467 Truttikon, Schweiz";
const EMAIL = "hello@cleverli.ch";
const WEBSITE = "www.cleverli.ch";

// ─────────────────────────────────────────────────────────────────────────────
// Content per language
// ─────────────────────────────────────────────────────────────────────────────

const content = {
  de: {
    title: "Allgemeine Geschäftsbedingungen (AGB)",
    updated: "Stand: 11. September 2026",
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
        body: `Cleverli ist eine digitale Lernplattform für Kinder der Primarschule (1.–6. Klasse) mit interaktiven Übungen in den Fächern Mathematik, Deutsch und Natur & Mensch (NMG). Die Plattform wird in den Sprachen Deutsch, Französisch, Italienisch und Englisch angeboten.

Eine Auswahl an Inhalten steht kostenlos zur Verfügung. Der vollständige Zugang erfordert einen aktiven Premium-Zugang.

Der Anbieter behält sich vor, den Funktionsumfang des Dienstes jederzeit zu erweitern, anzupassen oder einzelne Funktionen einzustellen, sofern dies zumutbar ist.`,
      },
      {
        heading: "4. Registrierung & Nutzerkonto",
        body: `Die Registrierung steht volljährigen Personen offen, insbesondere Eltern, Erziehungsberechtigten und Lehrpersonen. Lehrpersonen dürfen Cleverli zur Unterrichtsvorbereitung, zur gemeinsamen Bearbeitung und Vorführung im Unterricht sowie zur begleiteten individuellen Förderung nutzen. Angaben bei der Registrierung müssen wahrheitsgemäss sein. Zugangsdaten bleiben persönlich und dürfen nicht an eine Klasse weitergegeben werden. Familienangebote umfassen weiterhin bis zu drei Kinderprofile. Auf Anfrage unter hello@cleverli.ch schalten wir nach persönlicher Vereinbarung ein Lehrerkonto mit Premium-Zugang und unbegrenzt vielen Kinderprofilen für die eigene pädagogische Arbeit der benannten Lehrperson frei. Das Lehrerkonto ist nicht online kaufbar und keine übertragbare Schullizenz. Kinderprofile haben keine eigenen Anmeldedaten; die Nutzung erfolgt begleitet im verantwortlichen Erwachsenenkonto. Die Freischaltung begründet keine Vertretungsbefugnis für Eltern und ersetzt keine erforderlichen schulischen Datenschutzvereinbarungen.`,
      },
      {
        heading: "5. Abonnement & Preise",
        body: `Cleverli Premium ist erhältlich als:
• Monatsabonnement: CHF 9.90 / Monat
• Jahresabonnement: CHF 99.00 / Jahr (entspricht CHF 8.25 / Monat)
• Nur für kurze Zeit erhältliche Gründeraktion: CHF 249.00 einmalig für einen lebenslangen, zeitlich unbefristeten Familienzugang zu Cleverli mit den Inhalten der 1.–6. Klasse, für bis zu drei Kinderprofile

Für Lehrerkonten vereinbaren wir Preis, Leistungszeitraum und Zahlungsweise vor der manuellen Freischaltung schriftlich. Ohne ausdrückliche Vereinbarung gibt es keine automatische Verlängerung oder Abbuchung. Eine Freischaltung kündigt ein bestehendes Familienabonnement nicht. Nach Ablauf oder Beendigung des Lehrerzugangs bleiben die Kinderprofile erhalten; neue Profile unterliegen wieder dem Familienlimit. Ein zusätzlich bestehender Familienzugang bleibt nach seinen eigenen Bedingungen gültig.

Alle Preise verstehen sich in Schweizer Franken (CHF) inkl. Mehrwertsteuer.

Monats- und Jahresabonnements verlängern sich automatisch um die gewählte Laufzeit, sofern sie nicht rechtzeitig gekündigt werden. Die Abbuchung erfolgt im Voraus zum Beginn jeder Abrechnungsperiode. Der lebenslange Zugang aus der Gründeraktion ist zeitlich unbefristet, verlängert sich nicht und löst keine weiteren Abbuchungen aus. Er ist an das persönliche Familienkonto gebunden und nicht übertragbar.

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
        body: `Personenbezogene Daten werden gemäss unserer Datenschutzerklärung unter www.cleverli.ch/datenschutz verarbeitet. Darin sind auch die eingesetzten technischen Dienstleister und mögliche Bearbeitungen im Ausland beschrieben. Wir verkaufen keine Kinderprofile oder Lernfortschritte. Minderjährige nutzen Cleverli unter Aufsicht einer erziehungsberechtigten Person oder einer verantwortlichen Lehrperson. Vor dem Anlegen personenbezogener Schülerprofile muss die Schule die erforderliche Rechtsgrundlage, Information der Erziehungsberechtigten und gegebenenfalls Einwilligung sowie eine erforderliche Vereinbarung zur Auftragsbearbeitung klären. Eine Lehrperson kann nicht allein durch Annahme dieser AGB im Namen aller Eltern einwilligen. Verwenden Sie möglichst Spitznamen und keine sensiblen Angaben. Eine Aufnahme in ein Anwendungsverzeichnis ersetzt keine schulische Datenschutzprüfung.`,
      },
      {
        heading: "9. Geistiges Eigentum",
        body: `Alle Inhalte auf Cleverli sind urheberrechtlich geschützt und gehören dem Anbieter oder lizenzierten Dritten. Neben privatem Lernen ist die pädagogische Nutzung durch Lehrpersonen im Rahmen ihres Unterrichts und des gebuchten Zugangs ausdrücklich gestattet, einschliesslich Vorführung und gemeinsamer Bearbeitung der Übungen. Die berufliche Tätigkeit einer Lehrperson steht dieser Erlaubnis nicht entgegen. Nicht umfasst sind Weiterverkauf, öffentliche Wiederveröffentlichung, systematische Vervielfältigung oder eine eigene kommerzielle Verwertung der Inhalte. Dafür ist eine separate Genehmigung erforderlich.`,
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
    updated: "Version : 11 septembre 2026",
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
        body: `Cleverli est une plateforme d'apprentissage numérique pour les enfants du primaire (1re–6e année) proposant des exercices interactifs en mathématiques, allemand et connaissance de l'environnement. La plateforme est disponible en allemand, français, italien et anglais.

Une sélection de contenus est disponible gratuitement. L'accès complet nécessite un accès Premium actif.

Le Fournisseur se réserve le droit de modifier ou d'adapter le Service à tout moment dans la mesure du raisonnable.`,
      },
      {
        heading: "4. Inscription & compte utilisateur",
        body: `L’inscription est ouverte aux personnes majeures, notamment aux parents, représentants légaux et enseignants. Les enseignants peuvent utiliser Cleverli pour préparer leurs cours, présenter et résoudre des exercices en classe et accompagner un travail individuel. Les informations fournies doivent être exactes. Les identifiants restent personnels et ne peuvent pas être distribués à une classe. Les offres familiales restent limitées à trois profils enfants. Sur demande à hello@cleverli.ch et après accord personnel, nous activons un compte enseignant avec accès Premium et profils enfants illimités pour le propre travail pédagogique de l’enseignant désigné. Ce compte n’est pas vendu en ligne et ne constitue pas une licence scolaire transférable. Les profils enfants n’ont pas leurs propres identifiants et sont utilisés sous supervision dans le compte adulte responsable. L’activation ne donne aucun pouvoir de représenter les parents et ne remplace pas les accords scolaires de protection des données requis.`,
      },
      {
        heading: "5. Abonnement & tarifs",
        body: `Cleverli Premium est disponible en :
• Abonnement mensuel : CHF 9.90 / mois
• Abonnement annuel : CHF 99.00 / an (soit CHF 8.25 / mois)
• Offre de lancement limitée : CHF 249.00 en une fois pour l’accès familial pendant toute l’école primaire (1re–6e année), jusqu’à trois profils enfants

Pour les comptes enseignants, le prix, la durée et le paiement sont convenus par écrit avant l’activation manuelle. Aucun renouvellement ni prélèvement automatique sans accord explicite. L’activation ne résilie pas un abonnement familial existant. À l’expiration ou à la fin de l’accès enseignant, les profils sont conservés et les nouveaux profils sont à nouveau soumis à la limite familiale. Tout accès familial supplémentaire reste valable selon ses propres conditions.

Tous les prix sont en francs suisses (CHF), TVA incluse.

Les abonnements mensuel et annuel se renouvellent automatiquement pour la durée choisie, sauf résiliation dans les délais. Le paiement est prélevé à l'avance au début de chaque période de facturation. L’accès unique de l’offre de lancement ne se renouvelle pas et n’entraîne aucun autre prélèvement. Il est lié au compte familial personnel et n’est pas transférable.

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
        body: `Les données personnelles sont traitées selon notre politique de confidentialité sur www.cleverli.ch/datenschutz, qui décrit aussi les prestataires techniques et les traitements possibles à l’étranger. Nous ne vendons pas les profils enfants ni leur progression. Les mineurs utilisent Cleverli sous la surveillance d’un représentant légal ou d’un enseignant responsable. Avant de créer des profils élèves contenant des données personnelles, l’école doit clarifier la base légale, l’information des représentants légaux, le consentement si nécessaire et toute convention de sous-traitance requise. Accepter ces CGU ne permet pas à un enseignant de consentir au nom de tous les parents. Privilégiez les pseudonymes et évitez les données sensibles. Une inscription dans un annuaire ne remplace pas l’examen de protection des données de l’école.`,
      },
      {
        heading: "9. Propriété intellectuelle",
        body: `Les contenus de Cleverli sont protégés par le droit d’auteur et appartiennent au Fournisseur ou à des tiers licenciés. Outre l’apprentissage privé, leur utilisation pédagogique par les enseignants dans leurs cours et dans les limites de l’accès souscrit est expressément autorisée, y compris la présentation et la résolution collective des exercices. Le caractère professionnel de l’activité enseignante ne s’oppose pas à cette autorisation. La revente, la republication publique, la reproduction systématique et une exploitation commerciale distincte nécessitent une autorisation séparée.`,
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
    updated: "Versione: 11 settembre 2026",
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
        body: `Cleverli è una piattaforma di apprendimento digitale per bambini della scuola elementare (1a–6a classe) con esercizi interattivi in matematica, tedesco e conoscenza dell'ambiente. La piattaforma è disponibile in tedesco, francese, italiano e inglese.

Una selezione di contenuti è disponibile gratuitamente. L'accesso completo richiede un accesso Premium attivo.

Il Fornitore si riserva il diritto di modificare o adattare il Servizio in qualsiasi momento nella misura del ragionevole.`,
      },
      {
        heading: "4. Registrazione & account utente",
        body: `La registrazione è aperta alle persone maggiorenni, in particolare genitori, tutori e docenti. I docenti possono usare Cleverli per preparare le lezioni, presentare e svolgere insieme gli esercizi in classe e accompagnare l’apprendimento individuale. I dati forniti devono essere veritieri. Le credenziali restano personali e non possono essere distribuite a una classe. Le offerte famiglia restano limitate a tre profili bambino. Su richiesta a hello@cleverli.ch e previo accordo personale, attiviamo un account docente con accesso Premium e profili bambino illimitati per la propria attività pedagogica del docente nominato. Non è acquistabile online e non è una licenza scolastica trasferibile. I profili bambino non hanno credenziali proprie e vengono utilizzati sotto supervisione nell’account adulto responsabile. L’attivazione non conferisce alcun potere di rappresentare i genitori e non sostituisce gli accordi scolastici sulla protezione dei dati richiesti.`,
      },
      {
        heading: "5. Abbonamento & prezzi",
        body: `Cleverli Premium è disponibile come:
• Abbonamento mensile: CHF 9.90 / mese
• Abbonamento annuale: CHF 99.00 / anno (pari a CHF 8.25 / mese)
• Offerta di lancio limitata: CHF 249.00 una tantum per l’accesso famiglia durante tutta la scuola primaria (1a–6a classe), fino a tre profili bambino

Per gli account docente, prezzo, durata e pagamento vengono concordati per iscritto prima dell’attivazione manuale. Nessun rinnovo o addebito automatico senza accordo esplicito. L’attivazione non disdice un abbonamento famiglia esistente. Alla scadenza o alla cessazione dell’accesso docente, i profili restano conservati e i nuovi profili sono nuovamente soggetti al limite famiglia. Un eventuale accesso famiglia aggiuntivo resta valido secondo le proprie condizioni.

Tutti i prezzi sono in franchi svizzeri (CHF), IVA inclusa.

Gli abbonamenti mensile e annuale si rinnovano automaticamente per la durata scelta, salvo disdetta nei termini previsti. Il pagamento avviene in anticipo all'inizio di ogni periodo di fatturazione. L’accesso una tantum dell’offerta di lancio non si rinnova e non comporta ulteriori addebiti. È legato all’account famiglia personale e non è trasferibile.

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
        body: `I dati personali sono trattati secondo l’informativa su www.cleverli.ch/datenschutz, che descrive anche i fornitori tecnici e i possibili trattamenti all’estero. Non vendiamo profili dei bambini o progressi di apprendimento. I minori usano Cleverli sotto la supervisione di un tutore o docente responsabile. Prima di creare profili degli allievi con dati personali, la scuola deve chiarire la base giuridica, l’informazione dei tutori, l’eventuale consenso e gli accordi sul trattamento per conto terzi necessari. Accettare queste CGC non consente al docente di prestare consenso per tutti i genitori. Usare preferibilmente soprannomi ed evitare dati sensibili. L’inserimento in un elenco di applicazioni non sostituisce la verifica della scuola in materia di protezione dei dati.`,
      },
      {
        heading: "9. Proprietà intellettuale",
        body: `I contenuti di Cleverli sono protetti dal diritto d’autore e appartengono al Fornitore o a terzi licenziatari. Oltre all’apprendimento privato, è espressamente autorizzato l’uso didattico da parte dei docenti nelle proprie lezioni e nei limiti dell’accesso acquistato, inclusa la presentazione e lo svolgimento collettivo degli esercizi. L’attività professionale del docente non è esclusa da questa autorizzazione. Rivendita, ripubblicazione pubblica, riproduzione sistematica e sfruttamento commerciale separato richiedono un’autorizzazione distinta.`,
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
    updated: "Version: 11 September 2026",
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
        body: `Cleverli is a digital learning platform for primary school children (grades 1–6) offering interactive exercises in mathematics, German, and general studies (nature & society). The platform is available in German, French, Italian, and English.

A selection of content is available free of charge. Full access requires active Premium access.

The Provider reserves the right to expand, modify, or discontinue features of the Service at any time, to the extent reasonable.`,
      },
      {
        heading: "4. Registration & User Account",
        body: `Registration is open to adults, including parents, legal guardians and teachers. Teachers may use Cleverli to prepare lessons, present and work through exercises in class, and support supervised individual learning. Registration details must be accurate. Login credentials remain personal and must not be distributed to a class. Family plans remain limited to three child profiles. On request at hello@cleverli.ch and following a personal agreement, we manually activate a teacher account with Premium access and unlimited child profiles for the named teacher’s own teaching work. This account cannot be purchased online and is not a transferable school licence. Child profiles have no separate login credentials and are used under supervision within the responsible adult account. Activation does not authorize teachers to represent parents or replace required school data protection agreements.`,
      },
      {
        heading: "5. Subscription & Pricing",
        body: `Cleverli Premium is available as:
• Monthly subscription: CHF 9.90 / month
• Annual subscription: CHF 99.00 / year (equivalent to CHF 8.25 / month)
• Limited founder offer: CHF 249.00 one-time for family access throughout primary school (grades 1–6), for up to three child profiles

For teacher accounts, price, duration and payment are agreed in writing before manual activation. There is no automatic renewal or charge without explicit agreement. Activation does not cancel an existing family subscription. When teacher access expires or ends, existing profiles are retained and new profiles are again subject to the family limit. Any additional family access remains valid under its own terms.

All prices are in Swiss Francs (CHF) including VAT.

Monthly and annual subscriptions renew automatically for the chosen period unless cancelled in time. Payment is charged in advance at the beginning of each billing period. The founder-offer access is a one-time purchase, does not renew, and creates no further charges. It is tied to the personal family account and is non-transferable.

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
        body: `Personal data is processed according to our privacy policy at www.cleverli.ch/datenschutz, which also describes technical service providers and possible processing abroad. We do not sell child profiles or learning progress. Minors use Cleverli under the supervision of a legal guardian or responsible teacher. Before creating identifiable pupil profiles, the school must establish the required legal basis, parental information, consent where necessary, and any required data processing agreement. Accepting these terms does not allow a teacher to consent on behalf of every parent. Prefer nicknames and avoid sensitive information. Inclusion in an application directory does not replace a school’s data protection assessment.`,
      },
      {
        heading: "9. Intellectual Property",
        body: `Cleverli content is protected by copyright and belongs to the Provider or licensed third parties. In addition to private learning, teachers are expressly permitted to use it for educational purposes in their lessons within the purchased access limits, including presenting and jointly completing exercises. A teacher’s professional activity does not invalidate this permission. Resale, public republication, systematic reproduction and separate commercial exploitation require separate permission.`,
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
        <Link href="/" className="mb-6 inline-flex min-h-11 items-center px-2 text-sm text-gray-400 hover:text-gray-600">
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
