export type GradeSeoSubject = "math" | "german";

export type GradeSubjectSeoPage = {
  slug: string;
  href: string;
  grade: number;
  subject: GradeSeoSubject;
  subjectName: string;
  shortSubjectName: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  lead: string;
  focusTitle: string;
  focusItems: string[];
  parentAnswer: string;
  ctaHref: string;
  ctaLabel: string;
  sampleRefs?: { topicId: string; exerciseId: string; explanation: string }[];
  workedExamples?: { topicId: string; exerciseId: string; explanation: string; linkLabel: string }[];
  detailIntro?: string;
  detailHeading?: string;
  detailItems?: {
    title: string;
    body: string;
    link?: { href: string; label: string };
  }[];
  faqItems?: {
    question: string;
    answer: string;
  }[];
  extraLinks?: {
    href: string;
    label: string;
  }[];
};

const mathFocus: Record<number, string[]> = {
  1: ["Zahlen bis 20 verstehen", "Plus und Minus sicher üben", "Formen, Muster und Mengen erkennen"],
  2: ["Rechnen bis 100 festigen", "Einmaleins aufbauen", "Uhrzeit, Geld und Textaufgaben üben"],
  3: ["Rechnen bis 1000 trainieren", "Mal und geteilt sicherer anwenden", "Geometrie und Sachaufgaben verstehen"],
  4: ["Grosse Zahlen und Grundrechenarten üben", "Brüche und Grössen einordnen", "Sachaufgaben Schritt für Schritt lösen"],
  5: ["Dezimalzahlen und Grössen festigen", "Brüche, Daten und Diagramme üben", "Rechenwege sauber anwenden"],
  6: ["Prozent, Brüche und Dezimalzahlen verbinden", "Gleichungen und Sachaufgaben üben", "Sicherheit für den Übertritt aufbauen"],
};

const germanFocus: Record<number, string[]> = {
  1: ["Buchstaben und Laute festigen", "Silben, Wörter und erste Sätze lesen", "Schreiben Schritt für Schritt üben"],
  2: ["Leseflüssigkeit aufbauen", "Nomen, Verben und Adjektive erkennen", "Rechtschreibung in kurzen Aufgaben üben"],
  3: ["Texte genauer verstehen", "Wortarten und Satzbau festigen", "Rechtschreibung sicherer anwenden"],
  4: ["Längere Texte lesen und verstehen", "Zeitformen und Satzzeichen üben", "Eigene Sätze klarer schreiben"],
  5: ["Textverständnis und Wortschatz stärken", "Grammatik und Rechtschreibung wiederholen", "Schreibaufgaben besser strukturieren"],
  6: ["Lesestrategien festigen", "Grammatik und Rechtschreibung sicher anwenden", "Texte planen, schreiben und überarbeiten"],
};

const mathCtaTopic: Record<number, string> = {
  1: "zahlen-1-10",
  2: "zahlen-bis-100",
  3: "zahlen-bis-1000",
  4: "zahlen-bis-10000",
  5: "dezimalzahlen",
  6: "negative-zahlen",
};

const germanCtaTopic: Record<number, string> = {
  1: "buchstaben",
  2: "nomen-artikel",
  3: "wortarten",
  4: "satzglieder",
  5: "direkte-rede",
  6: "kasus",
};

const pageOverrides: Partial<Record<string, Partial<GradeSubjectSeoPage>>> = {
  "mathe-uebungen-5-klasse": {
  "lead": "Dezimalzahlen verstehen, mit Brüchen rechnen und den Umfang bestimmen: Hier findet ihr konkrete Matheaufgaben für die 5. Klasse mit Lösungen und kurzen Erklärungen.",
  "parentAnswer": "In der 5. Klasse verbinden Kinder verschiedene Darstellungen von Zahlen und wenden Rechenwege auf Grössen und Formen an. Beginnt mit dem Thema, das gerade im Unterricht vorkommt. Die Beispiele unten helfen euch einzuschätzen, was schon sicher sitzt und wo eine Wiederholung sinnvoll ist.",
  "workedExamples": [
    {
      "topicId": "dezimalzahlen",
      "exerciseId": "g5m1",
      "explanation": "Die erste Stelle nach dem Komma bezeichnet Zehntel. 0,5 sind deshalb fünf Zehntel, also die Hälfte eines Ganzen.",
      "linkLabel": "Dezimalzahlen und Stellenwerte üben"
    },
    {
      "topicId": "brueche-rechnen",
      "exerciseId": "g5m21",
      "explanation": "Beide Brüche haben denselben Nenner. Addiere die Zähler: ein Viertel plus ein Viertel ergibt zwei Viertel. 2/4 lässt sich zu 1/2 kürzen.",
      "linkLabel": "Mit Brüchen rechnen üben"
    },
    {
      "topicId": "flaechen-umfang",
      "exerciseId": "g5m11",
      "explanation": "Zum Umfang gehören alle vier Seiten: 5 + 3 + 5 + 3 = 16 cm. Die Fläche wäre dagegen 15 cm². Umfang und Fläche haben unterschiedliche Einheiten.",
      "linkLabel": "Flächen und Umfang unterscheiden"
    }
  ],
  "faqItems": [
    {
      "question": "Welche Mathethemen kann mein Kind in der 5. Klasse üben?",
      "answer": "Hier findet ihr unter anderem Dezimalzahlen, Bruchrechnen, Flächen und Umfang sowie Daten und Diagramme. Die Reihenfolge im Unterricht kann variieren. Wählt deshalb das Thema, das dein Kind gerade in der Schule behandelt."
    },
    {
      "question": "Mit welcher Aufgabe sollten wir anfangen?",
      "answer": "Lasst dein Kind zuerst eines der drei Beispiele lösen und den Rechenweg erklären. Wenn Zehntel noch unsicher sind, beginnt bei Dezimalzahlen. Wenn das gut klappt, könnt ihr mit Brüchen oder dem Umfang weiterüben."
    },
    {
      "question": "Wie helfe ich, ohne die Lösung vorzusagen?",
      "answer": "Frage: Was ist gegeben, und was suchst du? Zeichnet bei Brüchen ein in gleiche Teile geteiltes Rechteck. Beim Umfang kann dein Kind die vier Seiten mit dem Finger nachfahren und ihre Längen addieren."
    },
    {
      "question": "Wie lange sollte eine Übungsrunde dauern?",
      "answer": "Beginnt mit fünf bis zehn ruhigen Minuten zu einem Thema. Wichtiger als viele Aufgaben ist, dass dein Kind einen Rechenweg versteht. Bei Frust macht ihr eine Pause und greift später ein einfacheres Beispiel auf."
    }
  ],
  "extraLinks": [
    {
      "href": "/mathe-uebungen-kinder",
      "label": "Mathe für alle Primarschulklassen"
    }
  ]
},
  "deutsch-uebungen-3-klasse": {
    description: "Deutsch Übungen 3. Klasse: Texte verstehen, Wortarten, Satzbau und Rechtschreibung üben. Mit erklärtem Beispiel und passenden Aufgaben für die Primarschule.",
    detailHeading: "Wörter untersuchen und Texte verstehen",
    detailIntro: "Lesen, Sprache untersuchen und richtig schreiben hängen zusammen. Die Übungen greifen diese Bereiche der Schweizer Primarschule auf. Die Beispiele zeigen einen möglichen Einstieg, keinen festen Stoffplan für jede Klasse.",
    detailItems: [
      { title: "Was vorher hilft", body: "Lest einen kurzen Abschnitt und lasst dein Kind in eigenen Worten erzählen, was passiert. Stockt es noch bei einzelnen Wörtern, nehmt zuerst einen kürzeren Text und sucht die Antwort gemeinsam darin.", link: { href: "/learn/2/german/texte-lesen", label: "Mit kurzen Texten beginnen" } },
      { title: "Wortarten im Satz entdecken", body: "Nomen benennen beispielsweise Tiere oder Dinge, Adjektive beschreiben Eigenschaften und Verben Tätigkeiten. Im Satz «Der kleine Hund rennt.» beschreibt «kleine» den Hund, und «rennt» sagt, was er tut.", link: { href: "/learn/3/german/wortarten", label: "Nomen, Verben und Adjektive üben" } },
      { title: "So geht es weiter", body: "Sucht beim Lesen die Textstelle, die eine Frage beantwortet. Prüft bei eigenen Sätzen den grossen Satzanfang, die Nomen und das passende Satzzeichen. So wendet dein Kind einzelne Regeln im Zusammenhang an.", link: { href: "/learn/3/german/leseverstaendnis", label: "Texte der 3. Klasse genauer lesen" } },
    ],

  "lead": "Wortarten erkennen, genau lesen und Wörter richtig schreiben: Entdeckt Deutschaufgaben für die 3. Klasse mit Lösungen und verständlichen Erklärungen.",
  "parentAnswer": "In der 3. Klasse geht es darum, Sprache bewusst anzuwenden: Was sagt ein Text tatsächlich? Welche Aufgabe hat ein Wort im Satz? Wie wird es geschrieben? Die drei Beispiele zeigen unterschiedliche Bereiche, damit ihr passend zum Schulstoff einen überschaubaren Einstieg findet.",
  "workedExamples": [
    {
      "topicId": "wortarten",
      "exerciseId": "g3-german-wortarten-w1",
      "explanation": "Hund bezeichnet ein Tier und ist ein Nomen. Du kannst einen Artikel davor setzen: der Hund. Nomen werden grossgeschrieben.",
      "linkLabel": "Nomen, Verben und Adjektive üben"
    },
    {
      "topicId": "leseverstaendnis",
      "exerciseId": "lv5",
      "explanation": "Die Frage sucht eine Dauer. Im zweiten Satz steht: Er braucht 55 Minuten. Die Ortsnamen sagen, wohin der Zug fährt, nicht wie lange die Fahrt dauert.",
      "linkLabel": "Kurze Texte lesen und verstehen"
    },
    {
      "topicId": "rechtschreibung",
      "exerciseId": "rs10",
      "explanation": "Katze bezeichnet ein Tier und ist ein Nomen. Nomen beginnen mit einem Grossbuchstaben, auch mitten im Satz: Die Katze miaut.",
      "linkLabel": "Grossschreibung von Nomen üben"
    }
  ],
  "faqItems": [
    {
      "question": "Was üben Kinder in Deutsch in der 3. Klasse?",
      "answer": "Cleverli bietet unter anderem Wortarten, Adjektive, Sätze, Leseverständnis und Rechtschreibung. Wählt einen Bereich, der zum aktuellen Unterricht und zum Lernstand deines Kindes passt."
    },
    {
      "question": "Wo sollten wir mit dem Üben anfangen?",
      "answer": "Beginnt mit einer Aufgabe aus einem vertrauten Thema. Kann dein Kind die Antwort erklären, probiert einen anderen Bereich. Wenn es bei einer Textfrage unsicher ist, lest den Text gemeinsam und sucht die Stelle mit der Antwort."
    },
    {
      "question": "Wie unterstütze ich mein Kind beim Lesen?",
      "answer": "Lass dein Kind einen kurzen Abschnitt lesen und in eigenen Worten erzählen, was passiert. Fragt dann: Wo steht die Antwort? Bei schwierigen Wörtern könnt ihr abwechselnd lesen. Es geht um Verstehen, nicht um Tempo."
    },
    {
      "question": "Was hilft bei wiederkehrenden Rechtschreibfehlern?",
      "answer": "Nehmt jeweils ein Wort und eine passende Strategie. Bei Freund hilft die Verlängerung Freunde, um das d zu hören. Lass dein Kind die Probe erklären und das Wort danach in einem eigenen Satz verwenden."
    }
  ],
  "extraLinks": [
    {
      "href": "/deutsch-uebungen-kinder",
      "label": "Deutsch für alle Primarschulklassen"
    },
    {
      "href": "/lesen-lernen",
      "label": "Lesen Schritt für Schritt festigen"
    }
  ]
},

  "mathe-uebungen-3-klasse": {
    description: "Mathe Übungen 3. Klasse: Zahlen bis 1000, Plus, Minus, Einmaleins und Sachaufgaben. Mit erklärtem Beispiel und passenden Übungen für die Primarschule.",
    lead: "In der 3. Klasse erweitert dein Kind den Zahlenraum bis 1000. Hier findet ihr Übungen zu Hundertern, Zehnern und Einern, zu Plus und Minus sowie zu Malaufgaben, Division und Geometrie.",
    parentAnswer: "Ein guter Einstieg sind vertraute Rechnungen bis 100 und das Zerlegen in Zehner und Einer. Darauf baut das Rechnen bis 1000 auf. Für Division helfen bekannte Malaufgaben. Wählt das Thema, das dein Kind gerade im Unterricht übt, denn die Reihenfolge kann sich unterscheiden.",
    detailHeading: "Vom Stellenwert zum eigenen Rechenweg",
    detailIntro: "Die Aufgaben greifen Zahlen und Operationen sowie Formen und Grössen der Schweizer Primarschule auf. Dein Kind muss nicht schon alles können: Wenn eine Grundlage noch unsicher ist, könnt ihr dort beginnen.",
    detailItems: [
      { title: "Was vorher hilft", body: "Kann dein Kind 47 als 4 Zehner und 7 Einer darstellen und Plus und Minus bis 100 rechnen? Falls das noch schwerfällt, festigt zuerst diese Schritte, bevor ihr mit Hundertern weiterübt.", link: { href: "/learn/2/math/add-sub-100", label: "Plus und Minus bis 100 wiederholen" } },
      { title: "Beispiel: 500 + 60 + 3", body: "Die Aufgabe lautet: 500 + 60 + 3 = ___. 5 Hunderter sind 500, 6 Zehner sind 60 und 3 Einer sind 3. Zusammen ergibt das 563. Zur Kontrolle zerlegt dein Kind 563 wieder in 500 + 60 + 3.", link: { href: "/learn/3/math/zahlen-bis-1000", label: "Stellenwerte bis 1000 üben" } },
      { title: "So geht es weiter", body: "Wenn die Stellenwerte vertraut sind, übt Plus und Minus bis 1000. Bei Sachaufgaben lest ihr zuerst die Frage, sucht die nötigen Zahlen und wählt die Rechenart. Prüft am Schluss, ob die Antwort zur Situation passt.", link: { href: "/learn/3/math/textaufgaben", label: "Sachaufgaben der 3. Klasse lösen" } },
    ],
  },
  "mathe-uebungen-1-klasse": {
    title: "Mathe Übungen 1. Klasse - Primarschule Schweiz",
    description:
      "Mathe Übungen 1. Klasse für die Schweizer Primarschule: Zahlen bis 20, Plus, Minus, Mengen und Formen online üben.",
    lead:
      "Mathe Übungen für die 1. Klasse: Zahlen verstehen, Mengen vergleichen, Plus und Minus üben und erste Aufgaben mit direkter Rückmeldung lösen.",
    focusItems: [
      "Zahlen, Mengen und Reihenfolgen sicherer erkennen",
      "Plus und Minus im Zahlenraum bis 20 üben",
      "Formen, Muster und einfache Sachaufgaben verstehen",
    ],
    parentAnswer:
      "In der 1. Klasse zählt vor allem Sicherheit mit Zahlen, Mengen und einfachen Rechenwegen. Cleverli macht daraus kurze Übungen, die Kinder ohne lange Vorbereitung starten können.",
    detailIntro:
      "Die Seite ist auf den Einstieg in die Primarschul-Mathe ausgerichtet. Sie vermeidet lange Theorie und gibt Kindern direkt Rückmeldung, wenn eine Antwort stimmt oder ein Tipp hilft.",
    detailItems: [
      {
        title: "Zahlen bis 20",
        body: "Kinder üben Zahlen lesen, zählen, vergleichen und ordnen, damit die Grundlagen für späteres Rechnen sitzen.",
      },
      {
        title: "Plus und Minus",
        body: "Einfache Rechnungen werden in kleinen Schritten trainiert, passend für kurze Übungsrunden daheim.",
      },
      {
        title: "Muster und Formen",
        body: "Mengen, Formen und Muster helfen, mathematische Zusammenhänge früh sichtbar zu machen.",
      },
    ],
    faqItems: [
      {
        question: "Welche Mathe-Themen sind in der 1. Klasse wichtig?",
        answer:
          "Wichtig sind Zahlen bis 20, Mengen, Plus, Minus, Muster, Formen und erste Sachaufgaben.",
      },
      {
        question: "Kann mein Kind selbstständig üben?",
        answer:
          "Ja. Die Aufgaben sind kurz, geben direkt Rückmeldung und bieten Tipps, wenn dein Kind nicht weiterkommt.",
      },
      {
        question: "Ist das für die Schweiz passend?",
        answer:
          "Ja. Cleverli ist auf die Schweizer Primarschule und Lehrplan 21 ausgerichtet.",
      },
    ],
  },
  "mathe-uebungen-2-klasse": {
    title: "Mathe Übungen 2. Klasse - Rechnen bis 100",
    description:
      "Mathe Übungen 2. Klasse für die Schweizer Primarschule: Rechenaufgaben bis 100, Plus, Minus, Einmaleins, Uhrzeit und Geld online üben.",
    lead:
      "Mathe Übungen für die 2. Klasse: Plus und Minus bis 100 festigen, erste Einmaleins-Reihen aufbauen und Rechenaufgaben aus dem Alltag besser verstehen.",
    focusItems: [
      "Addition und Subtraktion bis 100 festigen",
      "Einmaleins-Reihen Schritt für Schritt aufbauen",
      "Uhrzeit, Geld und einfache Textaufgaben üben",
    ],
    parentAnswer:
      "In der 2. Klasse wird Mathe spürbar breiter. Cleverli hilft mit kurzen Runden für Rechnen bis 100, Einmaleins und Alltagsthemen wie Geld oder Uhrzeit.",
    detailIntro:
      "Die Übungen sind so aufgebaut, dass Kinder Plus, Minus und weitere Grundlagen in kurzen Runden wiederholen können, ohne gleich eine ganze Arbeitsmappe durcharbeiten zu müssen.",
    detailItems: [
      {
        title: "Rechnen bis 100",
        body: "Addition und Subtraktion werden mit passenden Rechenaufgaben gefestigt. Zahlen zerlegen, Zehnerübergänge und Zahlenmauern machen Rechenwege verständlicher.",
      },
      {
        title: "Einmaleins vorbereiten",
        body: "Kinder üben Reihen, Muster und Malaufgaben, bevor gemischte 1x1-Aufgaben schwieriger werden.",
      },
      {
        title: "Alltagsmathe",
        body: "Uhrzeit, Geld, Längen und kleine Textaufgaben bringen Mathe näher an Situationen aus Schule und Alltag.",
      },
    ],
    faqItems: [
      {
        question: "Ist Einmaleins in der 2. Klasse schon dabei?",
        answer:
          "Ja. Viele Kinder bauen das Einmaleins in der 2. Klasse auf und festigen es danach weiter.",
      },
      {
        question: "Kann ich gezielt nur Rechnen bis 100 üben lassen?",
        answer:
          "Ja. Du kannst direkt passende Themen auswählen und dein Kind mit kurzen Aufgaben starten lassen.",
      },
      {
        question: "Gibt es auch Textaufgaben?",
        answer:
          "Ja. Cleverli enthält auch einfache Sach- und Textaufgaben, damit Kinder Rechnen im Kontext üben.",
      },
    ],
    extraLinks: [
      { href: "/einmaleins-ueben", label: "Einmaleins üben" },
      { href: "/1x1-spiele", label: "1x1 Spiele" },
      { href: "/learn/2/math/zahlen-bis-100", label: "Zahlen bis 100 üben" },
      { href: "/learn/2/math/add-sub-100", label: "Plus und Minus bis 100" },
      { href: "/learn/2/math/uhrzeit", label: "Uhrzeit üben" },
    ],
  },
  "deutsch-uebungen-2-klasse": {
    title: "Deutsch Übungen 2. Klasse - Lesen & Rechtschreibung",
    description:
      "Deutsch Übungen 2. Klasse für die Schweizer Primarschule: Lesen, Sätze, Nomen, Verben und erste Rechtschreibung online üben.",
    lead:
      "Deutsch Übungen für die 2. Klasse: kurze Leserunden, einfache Sätze, Nomen, Verben und erste Rechtschreibung in ruhigen Schritten festigen.",
    focusItems: [
      "kurze Texte lesen und sicherer verstehen",
      "Nomen, Artikel und Verben erkennen",
      "erste Rechtschreibregeln in einfachen Sätzen üben",
    ],
    parentAnswer:
      "In der 2. Klasse wird Deutsch oft lebendiger, aber auch anspruchsvoller. Cleverli hilft mit kurzen Übungen, die dein Kind ohne Druck starten kann und die sofort zeigen, was schon gut klappt.",
    ctaHref: "/learn/2/german/nomen-artikel",
    ctaLabel: "Deutsch gratis üben",
    detailIntro:
      "Die Übungen verbinden Lesen, Wortarten und Schreiben in kleinen Runden. So kann dein Kind regelmässig üben, ohne dass daheim zuerst Arbeitsblätter gesucht werden müssen.",
    detailItems: [
      {
        title: "Lesen verstehen",
        body: "Kurze Texte und einfache Fragen helfen, genauer zu lesen und wichtige Informationen wiederzufinden.",
      },
      {
        title: "Wörter erkennen",
        body: "Nomen, Artikel und Verben werden mit klaren Aufgaben gefestigt, damit Sätze besser verstanden werden.",
      },
      {
        title: "Richtig schreiben",
        body: "Grossschreibung, Satzzeichen und häufige Schreibmuster werden Schritt für Schritt sicherer.",
      },
    ],
    faqItems: [
      {
        question: "Welche Deutsch-Themen passen für die 2. Klasse?",
        answer:
          "Typisch sind kurze Texte, Sätze, Nomen, Artikel, Verben, Grossschreibung und erste Rechtschreibung.",
      },
      {
        question: "Kann mein Kind selbstständig üben?",
        answer:
          "Ja. Die Aufgaben sind kurz, geben direkte Rückmeldung und bieten Tipps, wenn dein Kind nicht weiterkommt.",
      },
      {
        question: "Ist das für die Schweizer Primarschule gedacht?",
        answer:
          "Ja. Cleverli ist auf Schweizer Primarschulkinder und den Lehrplan 21 ausgerichtet.",
      },
    ],
    extraLinks: [
      { href: "/deutsch-uebungen-kinder", label: "Deutsch Übungen für Kinder" },
      { href: "/leseverstaendnis-uebungen-2-klasse", label: "Leseverständnis 2. Klasse" },
      { href: "/rechtschreibung-uebungen-primarschule", label: "Rechtschreibung Primarschule" },
    ],
  },
  "deutsch-uebungen-1-klasse": {
    title: "Deutsch Übungen 1. Klasse - Lesen & Schreiben",
    description:
      "Deutsch Übungen 1. Klasse für die Schweizer Primarschule: Buchstaben, Laute, Wörter, erste Sätze und Lesen lernen.",
    lead:
      "Deutsch Übungen für die 1. Klasse: Buchstaben, Laute, erste Wörter und kurze Sätze üben, damit Lesen und Schreiben sicherer werden.",
    focusItems: [
      "Buchstaben und Laute erkennen",
      "Wörter und erste Sätze lesen",
      "Grossschreibung und einfache Schreibmuster üben",
    ],
    parentAnswer:
      "In der 1. Klasse geht es um den Einstieg ins Lesen und Schreiben. Cleverli gibt Kindern kleine, klare Aufgaben, die sofort Rückmeldung geben und nicht überfordern.",
    detailIntro:
      "Die Übungen passen besonders für Kinder, die Buchstaben, Wörter und einfache Sätze häufiger wiederholen sollen.",
    detailItems: [
      {
        title: "Lesen lernen",
        body: "Kinder üben Buchstaben, Laute, Wörter und erste Sätze mit kurzen Aufgaben und Vorlesen.",
      },
      {
        title: "Schreiben vorbereiten",
        body: "Einfache Wörter, Grossschreibung und passende Satzanfänge helfen beim Aufbau sicherer Schreibgrundlagen.",
      },
      {
        title: "Selbstständiger üben",
        body: "Tipps und direkte Rückmeldung helfen, ohne dass Eltern jede Aufgabe vorbereiten müssen.",
      },
    ],
    faqItems: [
      {
        question: "Hilft Cleverli beim Lesen lernen?",
        answer:
          "Ja. Es gibt Übungen zu Buchstaben, Wörtern, Sätzen und erstem Leseverständnis.",
      },
      {
        question: "Ist das für Kinder am Anfang der 1. Klasse geeignet?",
        answer:
          "Ja. Dein Kind kann mit einfachen Themen starten und später zu Sätzen und kleinen Texten wechseln.",
      },
      {
        question: "Kann mein Kind Aufgaben vorlesen lassen?",
        answer:
          "Ja. Die Vorlesen-Funktion unterstützt Kinder, die noch nicht alles flüssig lesen.",
      },
    ],
    extraLinks: [
      { href: "/lesen-lernen", label: "Lesen lernen" },
      { href: "/deutsch-uebungen-kinder", label: "Deutsch Übungen für Kinder" },
    ],
  },
  "deutsch-uebungen-6-klasse": {
    title: "Deutsch Übungen 6. Klasse - Lehrplan 21 Schweiz",
    description:
      "Deutsch Übungen 6. Klasse für die Schweizer Primarschule: Grammatik, Rechtschreibung, Textverständnis, Argumentation und Übertritt sicher üben.",
    lead:
      "Deutsch Übungen für die 6. Klasse, passend zur Schweizer Primarschule: Grammatik, Rechtschreibung, Textverständnis und Schreiben in kurzen Lernrunden festigen.",
    focusItems: [
      "Kasus, Wortarten und Satzbau sicher anwenden",
      "Rechtschreibstrategien und Grammatik wiederholen",
      "Texte verstehen, argumentieren und überarbeiten",
    ],
    parentAnswer:
      "In der 6. Klasse geht es nicht mehr nur um einzelne Regeln. Kinder müssen Texte genauer lesen, Grammatik bewusst anwenden und eigene Gedanken klar formulieren. Cleverli macht daraus kurze, überschaubare Übungen mit direkter Rückmeldung.",
    detailIntro:
      "Die Übungen passen zu typischen Deutsch-Themen der oberen Primarschule in der Schweiz. Dein Kind kann gezielt einzelne Bereiche üben oder einfach mit einer kurzen Runde starten, wenn Hausaufgaben, Prüfungsvorbereitung oder Übertrittsstress anstehen.",
    detailItems: [
      {
        title: "Grammatik verstehen",
        body: "Kasus, Wortarten, Relativsätze, Satzglieder und Zeitformen werden in kleinen Schritten geübt, statt als lange Theorieblöcke.",
      },
      {
        title: "Rechtschreibung festigen",
        body: "Strategien, typische Stolperstellen und sichere Wortformen helfen Kindern, beim Schreiben genauer zu werden.",
      },
      {
        title: "Texte besser meistern",
        body: "Leseverständnis, Textsorten, Argumentation und Überarbeitung bereiten auf anspruchsvollere Aufgaben in der Sekundarstufe vor.",
      },
    ],
    faqItems: [
      {
        question: "Welche Deutsch-Themen sind in der 6. Klasse wichtig?",
        answer:
          "Wichtig sind Grammatik, Kasus, Wortarten, Rechtschreibung, Textverständnis, Textsorten, Argumentation und das Überarbeiten eigener Texte.",
      },
      {
        question: "Hilft Cleverli bei Prüfungsvorbereitung und Übertritt?",
        answer:
          "Ja. Die Übungen sind kurz genug für regelmässiges Wiederholen und decken zentrale Grundlagen ab, die Kinder vor dem Übertritt sicherer beherrschen sollten.",
      },
      {
        question: "Muss ich als Elternteil die Aufgaben vorbereiten?",
        answer:
          "Nein. Dein Kind kann direkt starten, erhält Hinweise und sieht sofort, ob eine Antwort stimmt. Du kannst später den Fortschritt anschauen.",
      },
    ],
    extraLinks: [
      { href: "/deutsch-uebungen-kinder", label: "Deutsch Übungen für Kinder" },
      { href: "/deutsch-uebungen-5-klasse", label: "Deutsch Übungen 5. Klasse" },
      { href: "/deutsch-uebungen-2-klasse", label: "Deutsch Übungen 2. Klasse" },
    ],
  },
};

function buildPage(grade: number, subject: GradeSeoSubject): GradeSubjectSeoPage {
  const isMath = subject === "math";
  const subjectName = isMath ? "Mathematik" : "Deutsch";
  const shortSubjectName = isMath ? "Mathe" : "Deutsch";
  const slugSubject = isMath ? "mathe" : "deutsch";
  const titleSubject = isMath ? "Mathe Übungen" : "Deutsch Übungen";
  const focusItems = isMath ? mathFocus[grade] : germanFocus[grade];
  const ctaTopic = isMath ? mathCtaTopic[grade] : germanCtaTopic[grade];
  const slug = `${slugSubject}-uebungen-${grade}-klasse`;
  const h1 = `${titleSubject} ${grade}. Klasse`;
  const description = `${h1} für die Schweizer Primarschule: kurze Online-Aufgaben nach Lehrplan 21, direkt im Browser kostenlos testen.`;

  const basePage: GradeSubjectSeoPage = {
    slug,
    href: `/${slug}`,
    grade,
    subject,
    subjectName,
    shortSubjectName,
    title: h1,
    description,
    h1,
    eyebrow: `${shortSubjectName} · ${grade}. Klasse · Schweizer Primarschule`,
    lead: `${h1} passend zur Schweizer Primarschule: kurze Aufgaben, direkte Rückmeldung und Vorlesen, wenn dein Kind Unterstützung braucht.`,
    focusTitle: `Was dein Kind in ${shortSubjectName} ${grade}. Klasse übt`,
    focusItems,
    parentAnswer: `Cleverli bündelt passende Übungen für die ${grade}. Klasse in ruhigen, klaren Lernrunden. Dein Kind kann selbst starten, bekommt sofort Rückmeldung und du siehst, was schon gut klappt.`,
    ctaHref: `/learn/${grade}/${subject}/${ctaTopic}`,
    ctaLabel: `${shortSubjectName} ${grade}. Klasse gratis starten`,
  };

  return {
    ...basePage,
    ...pageOverrides[slug],
  };
}

const GENERATED_GRADE_SUBJECT_SEO_PAGES: GradeSubjectSeoPage[] = [1, 2, 3, 4, 5, 6].flatMap((grade) => [
  buildPage(grade, "math"),
  buildPage(grade, "german"),
]);

const SPECIAL_SEO_PAGES: GradeSubjectSeoPage[] = [
  {
    slug: "einmaleins-uebungen-2-klasse",
    href: "/einmaleins-uebungen-2-klasse",
    grade: 2,
    subject: "math",
    subjectName: "Mathematik",
    shortSubjectName: "Mathe",
    title: "Einmaleins Übungen 2. Klasse - 1x1 online üben",
    description:
      "Einmaleins Übungen 2. Klasse für die Schweizer Primarschule: 2er-, 5er- und 10er-Reihen, gemischte Aufgaben und 1x1 online üben.",
    h1: "Einmaleins Übungen 2. Klasse",
    eyebrow: "Einmaleins · 2. Klasse · Schweizer Primarschule",
    lead:
      "Wenn das 1x1 neu dazukommt, helfen kurze, klare Runden. Dein Kind übt die 2er-, 5er- und 10er-Reihen und bekommt direkt Rückmeldung.",
    focusTitle: "Was dein Kind beim Einmaleins in der 2. Klasse übt",
    focusItems: [
      "2er-, 5er- und 10er-Reihen sicher aufbauen",
      "Malaufgaben mit Mustern und Wiederholung festigen",
      "gemischte 1x1-Aufgaben Schritt für Schritt lösen",
    ],
    parentAnswer:
      "Das Einmaleins braucht Wiederholung, aber keine langen Übungsblöcke. Cleverli macht daraus kurze Runden, die dein Kind auch zwischendurch starten kann.",
    ctaHref: "/learn/2/math/einmaleins",
    ctaLabel: "1x1 gratis üben",
    sampleRefs: [
      { topicId: "einmaleins", exerciseId: "e1", explanation: "Lege 2 Reihen mit je 3 Plättchen. Das sind 3 + 3 = 6 Plättchen, also 2 × 3 = 6. Drehst du die Anordnung, siehst du 3 Reihen mit je 2: 2 + 2 + 2 ergibt ebenfalls 6." },
      { topicId: "einmaleins", exerciseId: "e2", explanation: "5 Schälchen mit je 4 Steinen: 4 + 4 + 4 + 4 + 4 = 20. Also ist 5 × 4 = 20." },
      { topicId: "einmaleins", exerciseId: "e3", explanation: "10 Reihen mit je 7 Plättchen lassen sich zu 7 Reihen mit je 10 drehen. Zähle 10, 20, 30, 40, 50, 60, 70. Also ist 10 × 7 = 70." },
      { topicId: "einmaleins", exerciseId: "e4", explanation: "2 Schälchen mit je 8 Steinen: 8 + 8 = 16. Also ist 2 × 8 = 16." },
      { topicId: "einmaleins", exerciseId: "e5", explanation: "5 Reihen mit je 6 Plättchen: 6 + 6 + 6 + 6 + 6 = 30. Also ist 5 × 6 = 30." },
    ],
    detailHeading: "Einmaleins in der 2. Klasse gezielt festigen",
    detailIntro:
      "Kann dein Kind gleiche Mengen abzählen und kleine Plusaufgaben lösen? Dann könnt ihr Malaufgaben mit Plättchen oder Steinen legen. Startet mit der 2er-, 5er- und 10er-Reihe im Zahlenraum bis 100, passend zum aktuellen Unterricht.",
    detailItems: [
      {
        title: "Reihen verstehen",
        body: "Eine Malaufgabe fasst gleich grosse Gruppen zusammen. Bei 2 × 3 legst du zwei Gruppen mit je drei Gegenständen. Zähle zuerst alle Gegenstände und vergleiche danach mit 3 + 3.",
      },
      {
        title: "Sicherer abrufen",
        body: "Zählt in Zweier-, Fünfer- oder Zehnerschritten. Wenn eine Antwort noch nicht einfällt, legt die Gruppen erneut. Später könnt ihr die drei Reihen mischen.",
      },
      {
        title: "Direkte Rückmeldung",
        body: "Dein Kind sieht sofort, ob es richtig liegt, und bekommt Tipps, wenn ein Rechenweg noch wackelt.",
      },
    ],
    faqItems: [
      {
        question: "Welche Reihen sind in der 2. Klasse wichtig?",
        answer:
          "Häufig starten Kinder mit 2er-, 5er- und 10er-Reihen und erweitern danach Schritt für Schritt.",
      },
      {
        question: "Ist das auch für 1x1-Wiederholung geeignet?",
        answer:
          "Ja. Die kurzen Runden passen gut, wenn dein Kind die Reihen regelmässig festigen soll.",
      },
      {
        question: "Kann mein Kind direkt loslegen?",
        answer:
          "Ja. Die ersten Aufgaben sind ohne Vorbereitung im Browser startklar.",
      },
    ],
    extraLinks: [
      { href: "/einmaleins-ueben", label: "Einmaleins üben" },
      { href: "/1x1-spiele", label: "1x1 Spiele" },
      { href: "/mathe-uebungen-2-klasse", label: "Mathe Übungen 2. Klasse" },
    ],
  },
  {
    slug: "rechtschreibung-uebungen-primarschule",
    href: "/rechtschreibung-uebungen-primarschule",
    grade: 3,
    subject: "german",
    subjectName: "Deutsch",
    shortSubjectName: "Deutsch",
    title: "Rechtschreibung Übungen für die Primarschule",
    description:
      "Rechtschreibung Übungen für die Schweizer Primarschule: Gross- und Kleinschreibung, Wortbilder, häufige Fehler und kurze Online-Aufgaben.",
    h1: "Rechtschreibung Übungen für die Primarschule",
    eyebrow: "Rechtschreibung · Deutsch · Schweizer Primarschule",
    lead:
      "Rechtschreibung wird sicherer, wenn Kinder Regeln in kleinen Portionen wiederholen. Cleverli übt Gross- und Kleinschreibung, Wortbilder und typische Stolperstellen.",
    focusTitle: "Was dein Kind in der Rechtschreibung übt",
    focusItems: [
      "Gross- und Kleinschreibung bewusster anwenden",
      "häufige Fehlerwörter und Wortbilder festigen",
      "Sätze genauer lesen und richtig schreiben",
    ],
    parentAnswer:
      "Viele Rechtschreibfehler verschwinden nicht durch einmal Erklären. Cleverli gibt deinem Kind kurze, klare Übungsrunden mit direkter Rückmeldung und ohne roten-Stift-Gefühl.",
    ctaHref: "/learn/3/german/rechtschreibung",
    ctaLabel: "Rechtschreibung gratis üben",
    detailHeading: "Rechtschreibung in der Primarschule gezielt festigen",
    detailIntro:
      "Die Übungen passen für Kinder, die beim Schreiben sicherer werden sollen, ob als kurze Wiederholung oder als ruhige Vorbereitung vor einer Lernkontrolle.",
    detailItems: [
      {
        title: "Regeln anwenden",
        body: "Kinder üben Grossschreibung, Wortarten und Satzzeichen in Aufgaben, die direkt verstanden werden.",
      },
      {
        title: "Wortbilder stärken",
        body: "Typische Wörter und Muster tauchen wiederholt auf, damit dein Kind sie beim Schreiben leichter erkennt.",
      },
      {
        title: "In kurzen Runden üben",
        body: "Statt langer Listen gibt es kleine Aufgaben mit Feedback, Tipps und einem klaren nächsten Schritt.",
      },
    ],
    faqItems: [
      {
        question: "Für welche Klasse passt diese Rechtschreibung-Seite?",
        answer:
          "Sie passt besonders für Kinder ab der 2. und 3. Klasse, viele Grundlagen bleiben aber in der ganzen Primarschule wichtig.",
      },
      {
        question: "Geht es nur um Gross- und Kleinschreibung?",
        answer:
          "Nein. Cleverli übt auch Wortbilder, Satzzeichen, Wortarten und typische Fehlerstellen.",
      },
      {
        question: "Kann ich nur Deutsch üben lassen?",
        answer:
          "Ja. Dein Kind kann direkt mit Deutsch-Themen starten und später weitere Fächer freischalten.",
      },
    ],
    extraLinks: [
      { href: "/deutsch-uebungen-kinder", label: "Deutsch Übungen für Kinder" },
      { href: "/deutsch-uebungen-2-klasse", label: "Deutsch Übungen 2. Klasse" },
      { href: "/leseverstaendnis-uebungen-2-klasse", label: "Leseverständnis 2. Klasse" },
    ],
  },
  {
    slug: "leseverstaendnis-uebungen-2-klasse",
    href: "/leseverstaendnis-uebungen-2-klasse",
    grade: 2,
    subject: "german",
    subjectName: "Deutsch",
    shortSubjectName: "Deutsch",
    title: "Leseverständnis Übungen 2. Klasse – online üben",
    description:
      "Leseverständnis Übungen 2. Klasse: kurze Texte online lesen, Fragen beantworten und Cleverli kostenlos testen. Schweizer Primarschule.",
    h1: "Leseverständnis Übungen 2. Klasse",
    eyebrow: "Leseverständnis · 2. Klasse · Schweizer Primarschule",
    lead:
      "Kurze Texte helfen Kindern, genauer zu lesen und Antworten im Text zu finden. Cleverli macht Leseverständnis überschaubar, ruhig und direkt im Browser.",
    focusTitle: "Was dein Kind beim Leseverständnis übt",
    focusItems: [
      "kurze Texte aufmerksam lesen",
      "wichtige Informationen im Text finden",
      "Fragen in eigenen Schritten beantworten",
    ],
    parentAnswer:
      "In der 2. Klasse geht es nicht nur ums Lesen können, sondern ums Verstehen. Cleverli unterstützt dein Kind mit kleinen Texten, klaren Fragen und direkter Rückmeldung.",
    ctaHref: "/learn/2/german/texte-lesen",
    ctaLabel: "Lesen gratis üben",
    detailHeading: "Leseverständnis in der 2. Klasse gezielt festigen",
    detailIntro:
      "Die Übungen passen für Kinder, die noch langsam lesen, wichtige Informationen übersehen oder beim Beantworten von Fragen unsicher sind.",
    detailItems: [
      {
        title: "Texte überblicken",
        body: "Dein Kind liest kurze Abschnitte und lernt, Überschrift, Schlüsselwörter und die Frage bewusst anzuschauen.",
      },
      {
        title: "Antworten finden",
        body: "Die Aufgaben trainieren, Informationen im Text wiederzufinden statt nur zu raten.",
      },
      {
        title: "Mit Unterstützung üben",
        body: "Vorlesen, Tipps und direkte Rückmeldung helfen, wenn dein Kind noch nicht alles flüssig liest.",
      },
    ],
    faqItems: [
      {
        question: "Was ist Leseverständnis in der 2. Klasse?",
        answer:
          "Kinder lesen kurze Texte und beantworten Fragen dazu. Wichtig ist, Informationen zu erkennen und Zusammenhänge zu verstehen.",
      },
      {
        question: "Hilft Cleverli auch langsam lesenden Kindern?",
        answer:
          "Ja. Die Texte und Aufgaben sind kurz, und die Vorlesen-Funktion kann beim Einstieg unterstützen.",
      },
      {
        question: "Sind die Übungen online nutzbar?",
        answer:
          "Ja. Dein Kind kann direkt im Browser starten, ohne App-Installation.",
      },
    ],
    extraLinks: [
      { href: "/lesen-lernen", label: "Lesen lernen" },
      { href: "/deutsch-uebungen-2-klasse", label: "Deutsch Übungen 2. Klasse" },
      { href: "/deutsch-uebungen-kinder", label: "Deutsch Übungen für Kinder" },
      { href: "/learn/2/german/texte-lesen", label: "Kurze Texte lesen" },
    ],
  },
  {
    slug: "textaufgaben-3-klasse",
    href: "/textaufgaben-3-klasse",
    grade: 3,
    subject: "math",
    subjectName: "Mathematik",
    shortSubjectName: "Mathe",
    title: "Textaufgaben 3. Klasse üben",
    description:
      "Textaufgaben 3. Klasse für die Schweizer Primarschule: Rechnen aus Alltagssituationen verstehen, wichtige Informationen finden und online üben.",
    h1: "Textaufgaben 3. Klasse üben",
    eyebrow: "Textaufgaben · 3. Klasse · Schweizer Primarschule",
    lead:
      "Textaufgaben werden leichter, wenn Kinder zuerst verstehen, was gefragt ist. Cleverli übt Alltagssituationen, Rechenwege und genaue Antworten in kurzen Runden.",
    focusTitle: "Was dein Kind bei Textaufgaben übt",
    focusItems: [
      "wichtige Zahlen und Hinweise im Text erkennen",
      "den passenden Rechenweg auswählen",
      "Antworten prüfen und verständlich lösen",
    ],
    parentAnswer:
      "Textaufgaben sind oft kein Rechenproblem, sondern ein Verstehensproblem. Cleverli hilft deinem Kind, den Text zu ordnen und Schritt für Schritt zum passenden Rechenweg zu kommen.",
    ctaHref: "/learn/3/math/textaufgaben",
    ctaLabel: "Textaufgaben gratis üben",
    detailHeading: "Textaufgaben in der 3. Klasse gezielt festigen",
    detailIntro:
      "Die Übungen passen für Kinder, die Sachaufgaben in Mathe sicherer verstehen und lösen sollen.",
    detailItems: [
      {
        title: "Aufgabe verstehen",
        body: "Kinder lernen, die Frage zuerst sauber zu lesen und wichtige Informationen zu markieren.",
      },
      {
        title: "Rechenweg finden",
        body: "Plus, Minus, Mal und Geteilt werden im Kontext geübt, damit Mathe näher am Alltag bleibt.",
      },
      {
        title: "Sicherer lösen",
        body: "Direkte Rückmeldung und Tipps helfen, wenn dein Kind bei einer Textaufgabe hängen bleibt.",
      },
    ],
    faqItems: [
      {
        question: "Warum sind Textaufgaben oft schwierig?",
        answer:
          "Kinder müssen den Text verstehen, die richtigen Zahlen finden und dann erst rechnen. Cleverli übt genau diese Schritte.",
      },
      {
        question: "Welche Rechenarten kommen vor?",
        answer:
          "Typisch sind Plus, Minus, Mal, Geteilt und einfache Alltagsaufgaben mit Geld, Mengen oder Wegen.",
      },
      {
        question: "Passt das zur 3. Klasse in der Schweiz?",
        answer:
          "Ja. Die Übungen sind auf Primarschul-Themen und kurze Lernrunden daheim ausgerichtet.",
      },
    ],
    extraLinks: [
      { href: "/mathe-uebungen-3-klasse", label: "Mathe Übungen 3. Klasse" },
      { href: "/mathe-uebungen-2-klasse", label: "Mathe Übungen 2. Klasse" },
      { href: "/einmaleins-uebungen-2-klasse", label: "Einmaleins Übungen 2. Klasse" },
    ],
  },
];

export const GRADE_SUBJECT_SEO_PAGES: GradeSubjectSeoPage[] = [
  ...GENERATED_GRADE_SUBJECT_SEO_PAGES,
  ...SPECIAL_SEO_PAGES,
];

export function getGradeSubjectSeoPage(slug: string) {
  return GRADE_SUBJECT_SEO_PAGES.find((page) => page.slug === slug);
}

export function getGradeSubjectSeoLinks(limit?: number) {
  return typeof limit === "number" ? GRADE_SUBJECT_SEO_PAGES.slice(0, limit) : GRADE_SUBJECT_SEO_PAGES;
}
