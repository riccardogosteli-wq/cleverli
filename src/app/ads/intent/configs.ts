import type { IntentLandingPageConfig } from "./IntentLandingPage";

export const einmaleinsUebenConfig: IntentLandingPageConfig = {
  pageKey: "einmaleins_ueben",
  path: "/einmaleins-ueben",
  eyebrow: "Einmaleins üben · 20 Aufgaben gratis",
  title: "Einmaleins online üben, ohne Druck daheim.",
  lead: "Kurze 1x1-Aufgaben für die Schweizer Primarschule. Dein Kind übt im Browser, bekommt direkt Feedback und kann sich Tipps vorlesen lassen.",
  badges: ["2er, 5er, 10er & mehr", "Mit Vorlesen und Tipps", "Nach Lehrplan 21"],
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
      body: "Von einfachen Reihen bis zu gemischten Aufgaben. Dein Kind baut Sicherheit auf, statt nur auswendig zu raten.",
    },
    {
      icon: "🔊",
      title: "Aufgaben vorlesen lassen",
      body: "Praktisch, wenn ein Kind die Aufgabe hören möchte oder noch nicht alles flüssig liest.",
    },
    {
      icon: "💡",
      title: "Tipps statt Frust",
      body: "Wenn es hakt, hilft Cleverli mit einem Hinweis weiter, ohne die Aufgabe sofort komplett zu lösen.",
    },
  ],
  trustTitle: "Einmaleins soll sitzen, aber nicht zum Streitpunkt werden.",
  trustBody: "Cleverli macht aus 1x1-Training kleine Runden mit sofortigem Feedback. Eltern sehen, was erledigt wurde, und Kinder merken schneller: Ich komme vorwärts.",
  faq: [
    ["Ist die Seite fürs 1x1 gedacht?", "Ja. Der Einstieg führt direkt zu Einmaleins-Aufgaben für die Primarschule."],
    ["Kann mein Kind die Aufgaben hören?", "Ja. In den Übungen gibt es eine Vorlesen-Funktion und zusätzliche Tipps."],
    ["Brauche ich eine App?", "Nein. Cleverli läuft direkt im Browser auf Handy, Tablet und Computer."],
    ["Kann ich zuerst testen?", "Ja. Die ersten 20 Aufgaben sind gratis und ohne Kreditkarte verfügbar."],
  ],
};

export const einsMalEinsSpieleConfig: IntentLandingPageConfig = {
  pageKey: "eins_mal_eins_spiele",
  path: "/1x1-spiele",
  eyebrow: "1x1 Spiele · spielerisch üben",
  title: "1x1 Spiele für kurze Mathe-Runden.",
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
      body: "Tipps und Vorlesen unterstützen direkt in der Aufgabe, ohne dass Eltern daneben sitzen müssen.",
    },
  ],
  trustTitle: "Spielerisch heisst hier nicht beliebig.",
  trustBody: "Die Aufgaben bleiben echte Primarschul-Mathe. Cleverli verpackt sie nur so, dass Kinder schneller starten und Eltern weniger anschieben müssen.",
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
  title: "Mathe üben, ohne jedes Mal neu zu diskutieren.",
  lead: "Cleverli gibt Kindern kurze Mathe-Aufgaben mit direktem Feedback. Eltern sehen Fortschritt, Kinder bekommen Tipps und können Aufgaben vorlesen lassen.",
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
  trustTitle: "Für Mathe daheim braucht es klare Aufgaben, nicht noch mehr Chaos.",
  trustBody: "Cleverli bündelt Mathe-Übungen für die Primarschule in einem ruhigen, kindgerechten Ablauf. Kurze Runden, sichtbarer Fortschritt und Hilfe genau dann, wenn sie gebraucht wird.",
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
  title: "So klappt Deutsch üben auch daheim.",
  lead: "Cleverli gibt Kindern kurze Deutsch-Aufgaben mit direktem Feedback. Lesen, Rechtschreibung, Grammatik und Satzbau werden in ruhigen, klaren Übungsrunden gefestigt.",
  badges: ["1.–6. Klasse", "Lesen, Wörter, Grammatik", "20 Aufgaben gratis"],
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
      body: "Kurze Aufgaben helfen beim genauen Lesen, Verstehen und Wiederholen ohne lange Vorbereitung.",
    },
    {
      icon: "✍️",
      title: "Rechtschreibung üben",
      body: "Wörter, Laute und Schreibmuster werden Schritt für Schritt gefestigt, mit direkter Rückmeldung.",
    },
    {
      icon: "💬",
      title: "Grammatik und Satzbau",
      body: "Sätze, Wortarten und passende Formen werden in kleinen Einheiten geübt, statt trocken erklärt.",
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
  trustTitle: "Deutsch daheim braucht kurze Aufgaben, die Kinder wirklich starten.",
  trustBody: "Cleverli bündelt Deutsch-Übungen für die Schweizer Primarschule in einem klaren Ablauf. Kinder bekommen Hinweise und Vorlesen, Eltern sehen Fortschritt und müssen nicht jedes Übungsblatt selbst suchen.",
  faq: [
    ["Welche Deutsch-Themen sind drin?", "Lesen, Rechtschreibung, Grammatik, Satzbau, Wortschatz und weitere Primarschul-Themen."],
    ["Ist Cleverli nach Lehrplan 21 aufgebaut?", "Ja. Cleverli ist auf die Schweizer Primarschule und Lehrplan 21 ausgerichtet."],
    ["Kann mein Kind selbstständig üben?", "Ja. Vorlesen, Tipps und sofortige Rückmeldung helfen beim selbstständigen Üben."],
    ["Kann ich zuerst testen?", "Ja. Die ersten 20 Aufgaben sind gratis und ohne Kreditkarte verfügbar."],
  ],
};
