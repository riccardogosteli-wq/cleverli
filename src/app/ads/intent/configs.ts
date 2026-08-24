import type { IntentLandingPageConfig } from "./IntentLandingPage";

export const einmaleinsUebenConfig: IntentLandingPageConfig = {
  pageKey: "einmaleins_ueben",
  path: "/einmaleins-ueben",
  eyebrow: "Einmaleins üben · 20 Aufgaben gratis",
  title: "Einmaleins online üben",
  lead: "Kurze 1x1-Aufgaben für die Schweizer Primarschule. Dein Kind übt einzelne Reihen, gemischte Aufgaben und kleine Textaufgaben direkt im Browser.",
  badges: ["2er bis 10er-Reihen", "Gemischt üben", "Nach Lehrplan 21"],
  freeTrialUrl: "/learn/2/math/einmaleins",
  checkoutSource: "einmaleins_ueben",
  heroImage: "/images/scenes/cleverli-math-ask.jpg",
  imageAlt: "Cleverli hilft einem Kind beim Einmaleins üben",
  sample: {
    grade: "2. Klasse Mathe",
    question: "5 × 8 = ?",
    answers: ["35", "40", "45"],
    correctIndex: 1,
    tip: "Tipp: Zähle in 5er-Schritten: 5, 10, 15 ...",
  },
  stats: [
    ["20", "Aufgaben gratis"],
    ["1x1", "kurze Übungsrunden"],
    ["LP21", "Schweizer Primarschule"],
    ["3", "Kinderprofile möglich"],
  ],
  sections: [
    {
      icon: "✕",
      title: "Malreihen Schritt für Schritt",
      body: "Erst vertraute Reihen wie 2er, 5er und 10er, danach gemischte Aufgaben. So entsteht Sicherheit statt reines Raten.",
    },
    {
      icon: "↔",
      title: "Mal und geteilt verbinden",
      body: "Einmaleins wird stärker, wenn Kinder auch Umkehraufgaben verstehen: 6 mal 4 und 24 geteilt durch 6 gehören zusammen.",
    },
    {
      icon: "💡",
      title: "Tipps statt Frust",
      body: "Wenn es hakt, hilft Cleverli mit einem Hinweis weiter, ohne die Aufgabe sofort komplett zu lösen.",
    },
  ],
  trustTitle: "Einmaleins wird sicherer, wenn Kinder Reihen wirklich festigen.",
  trustBody: "Cleverli verbindet kurze 1x1-Runden mit direkter Rückmeldung, Vorlesen und Tipps. Eltern sehen Fortschritt, Kinder merken schneller, welche Reihen schon sitzen und welche noch Übung brauchen.",
  seoDetail: {
    eyebrow: "1x1 gezielt festigen",
    title: "Einmaleins üben ohne lange Vorbereitung",
    body: "Viele Kinder können einzelne Reihen schnell aufsagen, stolpern aber bei gemischten Aufgaben oder Divisionen. Cleverli hilft, diese Lücke mit kurzen, wiederholbaren Übungsrunden zu schliessen.",
    items: [
      {
        title: "Reihen einzeln trainieren",
        body: "2er-, 5er- und 10er-Reihen geben Sicherheit. Danach können schwierigere Reihen wie 6er, 7er oder 8er dazukommen.",
      },
      {
        title: "Gemischte Aufgaben üben",
        body: "Wenn Reihen durcheinander erscheinen, zeigt sich, ob das 1x1 wirklich sitzt. Genau dafür sind kurze Browser-Runden ideal.",
      },
      {
        title: "Division mitdenken",
        body: "Zu jeder Malaufgabe gehört auch eine Umkehraufgabe. So wird aus Auswendiglernen echtes Zahlenverständnis.",
      },
    ],
  },
  relatedLinks: [
    {
      href: "/einmaleins-uebungen-2-klasse",
      title: "Einmaleins Übungen 2. Klasse",
      description: "Mit 2er-, 5er- und 10er-Reihen ruhig ins 1x1 einsteigen.",
    },
    {
      href: "/1x1-spiele",
      title: "1x1 Spiele",
      description: "Einmaleins mit Memory, kurzen Runden und sichtbarem Fortschritt üben.",
    },
    {
      href: "/mathe-uebungen-2-klasse",
      title: "Mathe Übungen 2. Klasse",
      description: "Rechnen bis 100, Einmaleins, Uhrzeit, Geld und Textaufgaben festigen.",
    },
    {
      href: "/learn/2/math/einmaleins",
      title: "Direkt Einmaleins üben",
      description: "Ohne Vorbereitung mit einer kurzen kostenlosen Übungsrunde starten.",
    },
  ],
  referenceTable: {
    eyebrow: "Einmaleins Tabelle",
    title: "Die 1x1-Reihen von 1 bis 10 im Überblick",
    body: "Die Tabelle hilft beim Nachschauen und Wiederholen. Für nachhaltige Sicherheit lohnt es sich, danach einzelne Reihen und gemischte Aufgaben aktiv zu üben.",
    headers: ["Reihe", "× 1", "× 2", "× 3", "× 4", "× 5", "× 6", "× 7", "× 8", "× 9", "× 10"],
    rows: Array.from({ length: 10 }, (_, rowIndex) => {
      const factor = rowIndex + 1;
      return [`${factor}er`, ...Array.from({ length: 10 }, (_, columnIndex) => String(factor * (columnIndex + 1)))];
    }),
  },
  faq: [
    ["Ist die Seite fürs 1x1 gedacht?", "Ja. Der Einstieg führt direkt zu Einmaleins-Aufgaben für die Primarschule."],
    ["Welche Malreihen kann mein Kind üben?", "Cleverli deckt einfache Reihen, gemischte 1x1-Aufgaben und passende Divisionen ab."],
    ["Passt das für die 2. Klasse?", "Ja. Das Einmaleins wird typischerweise ab der 2. Klasse aufgebaut und später regelmässig gefestigt."],
    ["Kann mein Kind die Aufgaben hören?", "Ja. In den Übungen gibt es eine Vorlesen-Funktion und zusätzliche Tipps."],
    ["Kann ich zuerst testen?", "Ja. Die ersten 20 Aufgaben sind gratis und ohne Kreditkarte verfügbar."],
  ],
};

export const einsMalEinsSpieleConfig: IntentLandingPageConfig = {
  pageKey: "eins_mal_eins_spiele",
  path: "/1x1-spiele",
  eyebrow: "1x1 Spiele · spielerisch üben",
  title: "1x1 Spiele online üben",
  lead: "Für Kinder, die das Einmaleins lieber spielerisch üben: kleine Aufgaben, klare Rückmeldung, Vorlesen und Tipps, wenn sie nicht weiterkommen.",
  badges: ["Spielerisch üben", "Ohne Installation", "20 Aufgaben gratis"],
  freeTrialUrl: "/learn/2/math/einmaleins",
  checkoutSource: "eins_mal_eins_spiele",
  heroImage: "/images/scenes/cleverli-chalkboard-quest.jpg",
  imageAlt: "Cleverli zeigt eine spielerische Mathe-Aufgabe",
  sample: {
    grade: "1x1 Spielrunde",
    question: "Welche Zahl fehlt? 6 × __ = 42",
    answers: ["6", "7", "8"],
    correctIndex: 1,
    tip: "Tipp: Welche 6er-Reihe kommt direkt nach 36?",
  },
  stats: [
    ["10 Min.", "reichen oft"],
    ["1x1", "spielerisch festigen"],
    ["20", "Aufgaben gratis"],
    ["LP21", "passend zur Primarschule"],
  ],
  sections: [
    {
      icon: "🎯",
      title: "Kurze Ziele",
      body: "Eine Runde ist überschaubar. Das hilft Kindern, dranzubleiben, auch wenn Mathe gerade nicht ihr Liebling ist.",
    },
    {
      icon: "⭐",
      title: "Feedback und XP",
      body: "Richtige Antworten fühlen sich sichtbar gut an. XP und Missionen machen Fortschritt greifbar.",
    },
    {
      icon: "💡",
      title: "Hilfe im Moment",
      body: "Tipps und Vorlesen unterstützen direkt in der Aufgabe, damit Kinder selbstständiger üben können.",
    },
  ],
  preview: {
    classic: {
      grade: "1x1 Spielrunde",
      question: "Welche Zahl fehlt? 7 × __ = 42",
      answers: ["5", "6", "7"],
      correctIndex: 1,
      tip: "Tipp: Suche in der 7er-Reihe nach 42.",
    },
    exerciseTitle: "Finde Einmaleins-Aufgabe und Ergebnis.",
    pairs: [
      ["6 × 7", "42"],
      ["8 × 4", "32"],
      ["9 × 3", "27"],
    ],
  },
  trustTitle: "Spielerisch heisst hier nicht beliebig.",
  trustBody: "Die Aufgaben bleiben echte Primarschul-Mathe. Cleverli macht den Einstieg leicht: kurze Runden, klares Feedback und Fortschritt für Eltern.",
  seoDetail: {
    eyebrow: "1x1 spielerisch festigen",
    title: "Einmaleins-Spiele mit einem klaren Lernziel",
    body: "Kinder üben dieselben wichtigen Reihen in unterschiedlichen Formaten. Das bringt Abwechslung, ohne dass das eigentliche Lernziel aus dem Blick gerät.",
    items: [
      {
        title: "Rechnung und Ergebnis verbinden",
        body: "Beim Memory gehören Malaufgabe und Ergebnis zusammen. So prägen sich Zusammenhänge leichter ein.",
      },
      {
        title: "Lücken in Reihen finden",
        body: "Lückenaufgaben helfen Kindern, eine Reihe nicht nur aufzusagen, sondern flexibel anzuwenden.",
      },
      {
        title: "Gemischt wiederholen",
        body: "Wenn mehrere Reihen durcheinander vorkommen, zeigt sich in einer kurzen Runde, was schon sicher sitzt.",
      },
    ],
  },
  relatedLinks: [
    {
      href: "/einmaleins-ueben",
      title: "Einmaleins üben",
      description: "Reihen gezielt lernen, gemischt festigen und mit Division verbinden.",
    },
    {
      href: "/einmaleins-uebungen-2-klasse",
      title: "Einmaleins Übungen 2. Klasse",
      description: "Mit 2er-, 5er- und 10er-Reihen passend zur 2. Klasse starten.",
    },
    {
      href: "/mathe-uebungen-2-klasse",
      title: "Mathe Übungen 2. Klasse",
      description: "Weitere Aufgaben zu Rechnen bis 100, Uhrzeit, Geld und Textaufgaben.",
    },
    {
      href: "/learn/2/math/einmaleins",
      title: "Kostenlose 1x1-Runde",
      description: "Direkt im Browser mit einer kurzen Einmaleins-Runde starten.",
    },
  ],
  faq: [
    ["Sind das echte Mathe-Übungen oder nur Spiele?", "Es sind echte Einmaleins-Aufgaben mit spielerischer Oberfläche, Feedback und Fortschritt."],
    ["Für welche Klasse passt das?", "Vor allem für Kinder, die das 1x1 in der Primarschule aufbauen oder festigen."],
    ["Kann mein Kind alleine üben?", "Ja. Vorlesen, Tipps und sofortige Rückmeldung helfen beim selbstständigen Üben."],
    ["Was kostet es?", "20 Aufgaben sind gratis. Premium kostet CHF 9.90/Monat oder CHF 99/Jahr für die Familie."],
  ],
};

export const matheUebungenKinderConfig: IntentLandingPageConfig = {
  pageKey: "mathe_uebungen_kinder",
  path: "/mathe-uebungen-kinder",
  eyebrow: "Mathe Übungen für Kinder · Primarschule",
  title: "Mathe Übungen für Kinder in der Primarschule",
  lead: "Kurze Online-Aufgaben für Rechnen, Einmaleins, Geometrie und Textaufgaben. Kinder bekommen direkt Feedback, Eltern sehen den Fortschritt.",
  badges: ["1.–6. Klasse", "Rechnen, Geometrie, Zeit", "20 Aufgaben gratis"],
  freeTrialUrl: "/learn/2/math/addition-bis-20",
  checkoutSource: "mathe_uebungen_kinder",
  heroImage: "/images/scenes/cleverli-solution.jpg",
  imageAlt: "Cleverli begleitet ein Kind beim Mathe üben",
  sample: {
    grade: "2. Klasse Mathe",
    question: "13 + 5 = ?",
    answers: ["17", "18", "19"],
    correctIndex: 1,
    tip: "Tipp: Starte bei 13 und zähle 5 Schritte weiter.",
  },
  stats: [
    ["13'000+", "interaktive Übungen"],
    ["1.–6.", "Klasse Primarschule"],
    ["20", "Aufgaben gratis"],
    ["LP21", "Schweizer Lehrplan"],
  ],
  sections: [
    {
      icon: "🔢",
      title: "Rechnen festigen",
      body: "Addition, Subtraktion, Einmaleins, Division und Zahlenverständnis in kurzen Einheiten.",
    },
    {
      icon: "📐",
      title: "Mehr als Kopfrechnen",
      body: "Auch Geometrie, Uhrzeit, Daten und Textaufgaben sind abgedeckt, passend zur Primarschule.",
    },
    {
      icon: "📊",
      title: "Fortschritt für Eltern",
      body: "Du siehst, welche Aufgaben erledigt wurden und wo dein Kind noch Übung braucht.",
    },
  ],
  trustTitle: "Mathe daheim braucht klare Übungen und sichtbaren Fortschritt.",
  trustBody: "Cleverli bündelt Mathe-Übungen für die Primarschule in einem ruhigen, kindgerechten Ablauf. Kurze Runden, sichtbarer Fortschritt und Hilfe genau dann, wenn sie gebraucht wird.",
  relatedLinks: [
    {
      href: "/mathe-uebungen-2-klasse",
      title: "Mathe Übungen 2. Klasse",
      description: "Rechnen bis 100, Plus und Minus, Uhrzeit und Geld passend zur 2. Klasse üben.",
    },
    {
      href: "/einmaleins-ueben",
      title: "Einmaleins üben",
      description: "Reihen aufbauen, gemischte Aufgaben lösen und Fortschritt direkt sehen.",
    },
    {
      href: "/1x1-spiele",
      title: "1x1 Spiele",
      description: "Das Einmaleins mit Memory und kurzen Spielrunden festigen.",
    },
    {
      href: "/einmaleins-uebungen-2-klasse",
      title: "Einmaleins 2. Klasse",
      description: "Mit 2er-, 5er- und 10er-Reihen ruhig ins Einmaleins einsteigen.",
    },
  ],
  faq: [
    ["Welche Mathe-Themen sind drin?", "Zahlen, Addition, Subtraktion, Einmaleins, Division, Geometrie, Uhrzeit, Daten und weitere Primarschul-Themen."],
    ["Ist Cleverli nach Lehrplan 21 aufgebaut?", "Ja. Cleverli ist auf die Schweizer Primarschule und Lehrplan 21 ausgerichtet."],
    ["Muss mein Kind angemeldet sein?", "Zum kostenlosen Start nicht zwingend. Für Fortschritt über mehrere Geräte ist ein Konto sinnvoll."],
    ["Kann ich zuerst testen?", "Ja. Die ersten 20 Aufgaben sind gratis und ohne Kreditkarte verfügbar."],
  ],
};

export const deutschUebungenKinderConfig: IntentLandingPageConfig = {
  pageKey: "deutsch_uebungen_kinder",
  path: "/deutsch-uebungen-kinder",
  eyebrow: "Deutsch Übungen für Kinder · Primarschule",
  title: "Deutsch üben: Lesen, Rechtschreibung und Grammatik",
  lead: "Kurze Deutsch-Runden für Kinder der 1.–6. Klasse: lesen verstehen, Wörter richtig schreiben und Grammatik sicher anwenden.",
  badges: ["1.–6. Klasse", "Lesen & Grammatik", "20 Aufgaben gratis"],
  freeTrialUrl: "/learn/1/german/saetze-lesen",
  checkoutSource: "deutsch_uebungen_kinder",
  heroImage: "/images/scenes/cleverli-reading-abc.jpg",
  imageAlt: "Cleverli begleitet ein Kind beim Deutsch üben",
  sample: {
    grade: "2. Klasse Deutsch",
    question: "Welches Wort passt? Der Hund ___ schnell.",
    answers: ["läuft", "laufen", "gelaufen"],
    correctIndex: 0,
    tip: "Tipp: Achte darauf, welches Wort zum Satz passt.",
  },
  stats: [
    ["13'000+", "interaktive Übungen"],
    ["1.–6.", "Klasse Primarschule"],
    ["20", "Aufgaben gratis"],
    ["LP21", "Schweizer Lehrplan"],
  ],
  sections: [
    {
      icon: "📖",
      title: "Lesen sicherer machen",
      body: "Von ersten Sätzen bis zu Textverständnis: kurze Aufgaben helfen beim genauen Lesen, Verstehen und Wiederholen.",
    },
    {
      icon: "✍️",
      title: "Rechtschreibung üben",
      body: "Wörter, Laute, Gross- und Kleinschreibung sowie typische Schreibmuster werden Schritt für Schritt gefestigt.",
    },
    {
      icon: "💬",
      title: "Grammatik und Satzbau",
      body: "Wortarten, Satzzeichen, Zeitformen und Satzbau werden in kleinen Einheiten geübt, statt trocken erklärt.",
    },
  ],
  preview: {
    classic: {
      grade: "2. Klasse Deutsch",
      question: "Welcher Satz ist richtig?",
      answers: ["Der Kind spielt.", "Das Kind spielt.", "Die Kind spielt."],
      correctIndex: 1,
      tip: "Tipp: Achte auf den Artikel vor dem Nomen.",
    },
    exerciseTitle: "Finde Wort und Bedeutung.",
    pairs: [
      ["laufen", "Verb"],
      ["Hund", "Nomen"],
      ["gross", "Adjektiv"],
    ],
  },
  trustTitle: "Deutsch üben klappt besser, wenn Kinder sofort merken, was stimmt.",
  trustBody: "Cleverli bündelt Deutsch-Übungen für die Schweizer Primarschule in einem ruhigen Ablauf. Kinder bekommen Hinweise und Vorlesen, Eltern sehen Fortschritt und finden schnell passende Themen.",
  seoDetail: {
    eyebrow: "Deutsch gezielt üben",
    title: "Von Lesen bis Grammatik: kurze Deutsch-Runden für daheim",
    body: "Deutsch ist in der Primarschule kein einzelnes Thema. Kinder brauchen Übung beim Lesen, Verstehen, Schreiben, Wortschatz und bei Grammatik. Cleverli bündelt diese Bereiche so, dass Eltern schnell passende Aufgaben finden.",
    items: [
      {
        title: "Lesen und verstehen",
        body: "Kurze Aufgaben helfen Kindern, Wörter, Sätze und Texte genauer zu lesen und Antworten im Text zu finden.",
      },
      {
        title: "Rechtschreibung festigen",
        body: "Grossschreibung, Wortmuster und typische Stolperstellen werden in kleinen Einheiten wiederholt.",
      },
      {
        title: "Grammatik anwenden",
        body: "Wortarten, Zeitformen und Satzbau werden direkt in Aufgaben geübt, damit Regeln nicht nur Theorie bleiben.",
      },
    ],
  },
  relatedLinks: [
    {
      href: "/deutsch-uebungen-2-klasse",
      title: "Deutsch Übungen 2. Klasse",
      description: "Lesen, Sätze, Nomen, Verben und erste Rechtschreibung gezielt festigen.",
    },
    {
      href: "/leseverstaendnis-uebungen-2-klasse",
      title: "Leseverständnis 2. Klasse",
      description: "Kurze Texte lesen, Informationen finden und Fragen beantworten.",
    },
    {
      href: "/rechtschreibung-uebungen-primarschule",
      title: "Rechtschreibung üben",
      description: "Grossschreibung, Wortbilder und typische Stolperstellen wiederholen.",
    },
    {
      href: "/lesen-lernen",
      title: "Lesen lernen",
      description: "Buchstaben, Wörter und erste Sätze Schritt für Schritt üben.",
    },
  ],
  faq: [
    ["Welche Deutsch-Themen sind drin?", "Lesen, Rechtschreibung, Grammatik, Satzbau, Wortschatz und weitere Primarschul-Themen."],
    ["Für welche Klasse passen die Übungen?", "Cleverli deckt die 1. bis 6. Klasse ab. Kinder können nach Klasse und Thema starten."],
    ["Gibt es auch Leseverständnis?", "Ja. Neben Buchstaben, Wörtern und Sätzen gibt es auch Textverständnis und Lesestrategien."],
    ["Ist Cleverli nach Lehrplan 21 aufgebaut?", "Ja. Cleverli ist auf die Schweizer Primarschule und Lehrplan 21 ausgerichtet."],
    ["Kann mein Kind selbstständig üben?", "Ja. Vorlesen, Tipps und sofortige Rückmeldung helfen beim selbstständigen Üben."],
  ],
};

export const lesenLernenConfig: IntentLandingPageConfig = {
  pageKey: "lesen_lernen",
  path: "/lesen-lernen",
  eyebrow: "Lesen lernen · 1. und 2. Klasse",
  title: "Lesen lernen online üben",
  lead: "Kurze Leseübungen für Kinder in der Primarschule: Buchstaben erkennen, Wörter verstehen und erste Sätze sicher lesen.",
  badges: ["Buchstaben & Laute", "Wörter und Sätze", "20 Aufgaben gratis"],
  freeTrialUrl: "/learn/1/german/saetze-lesen",
  checkoutSource: "lesen_lernen",
  heroImage: "/images/scenes/cleverli-reading-abc.jpg",
  imageAlt: "Cleverli begleitet ein Kind beim Lesen lernen",
  sample: {
    grade: "1. Klasse Deutsch",
    question: "Welcher Satz passt zum Bild?",
    answers: ["Mia malt.", "Mia rennt.", "Mia schläft."],
    correctIndex: 0,
    tip: "Tipp: Lies zuerst das Verb. Was macht Mia?",
  },
  stats: [
    ["1.–2.", "Klasse Einstieg"],
    ["Lesen", "Wörter und Sätze"],
    ["20", "Aufgaben gratis"],
    ["LP21", "Schweizer Primarschule"],
  ],
  sections: [
    {
      icon: "🔤",
      title: "Buchstaben und Laute festigen",
      body: "Kinder üben Buchstaben, Anlaute und einfache Wörter in kurzen Runden, die nicht überfordern.",
    },
    {
      icon: "📖",
      title: "Sätze genau lesen",
      body: "Erste Sätze werden Schritt für Schritt verstanden: Wer macht was, welches Wort passt, was steht wirklich da?",
    },
    {
      icon: "💡",
      title: "Hilfe ohne Druck",
      body: "Vorlesen, Tipps und direkte Rückmeldung helfen, wenn ein Kind stockt oder ein Wort noch unsicher ist.",
    },
  ],
  preview: {
    classic: {
      grade: "1. Klasse Deutsch",
      question: "Welches Wort beginnt mit M?",
      answers: ["Mond", "Sonne", "Ball"],
      correctIndex: 0,
      tip: "Tipp: Sprich die Wörter langsam aus.",
    },
    exerciseTitle: "Ordne Wort und Bedeutung.",
    pairs: [
      ["lesen", "mit den Augen Wörter verstehen"],
      ["Satz", "mehrere Wörter zusammen"],
      ["Buchstabe", "Zeichen wie A, M oder S"],
    ],
  },
  trustTitle: "Lesen lernen braucht viele kleine Erfolgsmomente.",
  trustBody: "Cleverli macht Leseübungen überschaubar: kurze Aufgaben, klare Rückmeldung und Unterstützung genau dann, wenn dein Kind sie braucht.",
  seoDetail: {
    eyebrow: "Leseeinstieg",
    title: "Buchstaben, Wörter und Sätze Schritt für Schritt üben",
    body: "Lesen lernen braucht Wiederholung ohne Druck. Cleverli startet bei einfachen Bausteinen und führt Kinder langsam zu ganzen Sätzen und erstem Textverständnis.",
    items: [
      {
        title: "Buchstaben hören und erkennen",
        body: "Anlaute und Buchstaben werden in kurzen Aufgaben wiederholt, damit Kinder Wörter sicherer entschlüsseln.",
      },
      {
        title: "Wörter verstehen",
        body: "Kinder üben, Wörter Bildern, Bedeutungen oder passenden Sätzen zuzuordnen.",
      },
      {
        title: "Erste Sätze lesen",
        body: "Kurze Sätze helfen beim genauen Lesen: Wer macht was, welches Wort passt, was steht wirklich da?",
      },
    ],
  },
  faq: [
    ["Für wen ist diese Seite gedacht?", "Für Kinder, die Buchstaben, Wörter und erste Sätze lesen lernen oder in der 1. und 2. Klasse mehr Übung brauchen."],
    ["Ist das dasselbe wie Deutsch Übungen?", "Nein. Diese Seite fokussiert gezielt auf den Leseeinstieg: Buchstaben, Wörter, Sätze und erstes Textverständnis."],
    ["Kann mein Kind die Aufgaben hören?", "Ja. Cleverli kann Aufgaben vorlesen und gibt Tipps, wenn ein Kind nicht weiterkommt."],
    ["Kann ich gratis starten?", "Ja. Die ersten 20 Aufgaben sind gratis und ohne Kreditkarte verfügbar."],
  ],
};
