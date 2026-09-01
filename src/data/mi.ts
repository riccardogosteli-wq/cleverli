import type { Exercise, Topic } from "@/types/exercise";

type Fact = {
  prompt: string;
  answer: string;
  distractors: [string, string, string];
  hint: string;
  difficulty: 1 | 2 | 3;
};

type Fill = {
  prompt: string;
  answer: string;
  hint: string;
  difficulty: 1 | 2 | 3;
};

type PairGroup = {
  prompt: string;
  pairs: [string, string][];
  hint: string;
  difficulty: 1 | 2 | 3;
};

type SortGroup = {
  prompt: string;
  zones: [string, string][];
  items: [string, string, string][];
  hint: string;
  difficulty: 1 | 2 | 3;
};

type TopicPlan = {
  grade: 3 | 4 | 5 | 6;
  id: string;
  title: string;
  emoji: string;
  curriculumCodes: string[];
  facts: Fact[];
  fills: Fill[];
  pairGroups: PairGroup[];
  sortGroups: SortGroup[];
  extraPairGroup: PairGroup;
  extraSortGroup: SortGroup;
  wordList: string[];
  reviewPrompt: string;
  reviewCriteria: string[];
  extraReviewPrompt: string;
  extraReviewCriteria: string[];
  extraReviewDifficulty: 1 | 2 | 3;
};

const h2 = "Vergleiche genau und lies alle Antworten langsam.";

function mc(id: string, fact: Fact, free = false): Exercise {
  return {
    id,
    type: "multiple-choice",
    question: fact.prompt,
    options: [fact.answer, ...fact.distractors],
    answer: fact.answer,
    hints: [fact.hint, h2],
    difficulty: fact.difficulty,
    free,
  };
}

function fill(id: string, item: Fill, free = false): Exercise {
  return {
    id,
    type: "fill-in-blank",
    question: item.prompt,
    answer: item.answer,
    hints: [item.hint, "Setze nur das passende Wort in die Lücke."],
    difficulty: item.difficulty,
    free,
  };
}

function matching(id: string, group: PairGroup): Exercise {
  return {
    id,
    type: "matching",
    question: group.prompt,
    answer: "richtig zugeordnet",
    pairs: group.pairs.flatMap(([left, right], index) => [
      { id: `${id}-l${index + 1}`, label: left },
      { id: `${id}-r${index + 1}`, label: right },
    ]),
    hints: [group.hint, "Tippe zuerst links und dann die passende Karte rechts an."],
    difficulty: group.difficulty,
  };
}

function memory(id: string, group: PairGroup): Exercise {
  return {
    id,
    type: "memory",
    question: group.prompt,
    answer: "alle Paare gefunden",
    pairs: group.pairs.map(([left, right], index) => ({ id: `${id}-p${index + 1}`, label: `${left}: ${right}` })),
    hints: [group.hint, "Merke dir die Karten, die schon aufgedeckt waren."],
    difficulty: group.difficulty,
  };
}

function dragDrop(id: string, group: SortGroup): Exercise {
  return {
    id,
    type: "drag-drop",
    question: group.prompt,
    answer: "richtig sortiert",
    dropZones: group.zones.map(([zoneId, label]) => ({ id: zoneId, label })),
    dragItems: group.items.map(([itemId, label]) => ({ id: itemId, label })),
    dropAnswers: Object.fromEntries(group.items.map(([itemId, , zoneId]) => [itemId, zoneId])),
    hints: [group.hint, "Ziehe jedes Kärtchen in die passende Gruppe."],
    difficulty: group.difficulty,
  };
}

function wordSearch(id: string, words: string[], difficulty: 1 | 2 | 3): Exercise {
  return {
    id,
    type: "word-search",
    question: "Finde die MI-Wörter.",
    answer: words.join(", "),
    wordList: words,
    gridSize: 10,
    hints: ["Suche waagrecht und senkrecht.", "Beginne mit dem längsten Wort."],
    difficulty,
  };
}

function selfReview(id: string, prompt: string, criteria: string[], difficulty: 1 | 2 | 3): Exercise {
  return {
    id,
    type: "self-review",
    question: prompt,
    answer: "eigene begründete Antwort",
    reviewCriteria: criteria,
    hints: ["Schreibe kurz und konkret.", "Nenne ein Beispiel aus dem Alltag."],
    difficulty,
  };
}

function buildTopic(plan: TopicPlan): Topic {
  const prefix = `mi${plan.grade}-${plan.id}`;
  const exercises: Exercise[] = [
    ...plan.facts.map((fact, index) => mc(`${prefix}-mc${index + 1}`, fact, index < 3)),
    ...plan.fills.map((item, index) => fill(`${prefix}-fb${index + 1}`, item)),
    matching(`${prefix}-ma1`, plan.pairGroups[0]),
    memory(`${prefix}-me1`, plan.pairGroups[0]),
    matching(`${prefix}-ma2`, plan.pairGroups[1]),
    memory(`${prefix}-me2`, plan.pairGroups[1]),
    matching(`${prefix}-ma3`, plan.extraPairGroup),
    dragDrop(`${prefix}-dd1`, plan.sortGroups[0]),
    dragDrop(`${prefix}-dd2`, plan.sortGroups[1]),
    dragDrop(`${prefix}-dd3`, plan.extraSortGroup),
    wordSearch(`${prefix}-ws1`, plan.wordList, plan.grade <= 4 ? 2 : 3),
    selfReview(`${prefix}-sr1`, plan.reviewPrompt, plan.reviewCriteria, plan.grade <= 4 ? 2 : 3),
    selfReview(`${prefix}-sr2`, plan.extraReviewPrompt, plan.extraReviewCriteria, plan.extraReviewDifficulty),
  ];

  return {
    id: plan.id,
    title: plan.title,
    emoji: plan.emoji,
    curriculumCodes: plan.curriculumCodes,
    exercises,
  };
}

const plans: TopicPlan[] = [
  {
    grade: 3,
    id: "digitale-spuren-3",
    title: "Digitale Spuren",
    emoji: "👣",
    curriculumCodes: ["MI.1.1", "MI.1.4"],
    facts: [
      { prompt: "Was ist eine digitale Spur?", answer: "Eine Information, die bei der Nutzung von Geräten entsteht", distractors: ["Ein Kratzer auf dem Bildschirm", "Ein Papierabdruck", "Ein ausgeschaltetes Gerät"], hint: "Denke daran, was beim Klicken, Suchen oder Schreiben gespeichert werden kann.", difficulty: 1 },
      { prompt: "Welche Angabe ist privat?", answer: "Wohnadresse", distractors: ["Lieblingsfarbe", "Lieblingsspiel", "Tierbild"], hint: "Private Angaben sagen viel über eine Person.", difficulty: 1 },
      { prompt: "Was ist beim Profilbild wichtig?", answer: "Es sollte nicht zu viel Privates zeigen", distractors: ["Es muss immer lustig sein", "Es muss fremde Kinder zeigen", "Es braucht den Wohnort"], hint: "Ein Bild kann mehr verraten, als man zuerst denkt.", difficulty: 1 },
      { prompt: "Was machst du, wenn dich online jemand nach deiner Adresse fragt?", answer: "Ich frage eine erwachsene Vertrauensperson", distractors: ["Ich schicke sie sofort", "Ich rate eine Adresse", "Ich frage nach einem Geschenk"], hint: "Bei privaten Fragen holst du Hilfe.", difficulty: 2 },
      { prompt: "Warum meldet man gemeine Nachrichten?", answer: "Damit jemand helfen und stoppen kann", distractors: ["Damit man mehr Nachrichten bekommt", "Damit alles geheim bleibt", "Damit man selbst gemein antwortet"], hint: "Melden ist kein Petzen, wenn jemand verletzt wird.", difficulty: 2 },
      { prompt: "Was ist ein fairer Kommentar?", answer: "Er bleibt freundlich und respektvoll", distractors: ["Er macht andere lächerlich", "Er verrät Geheimnisse", "Er enthält Beleidigungen"], hint: "Fair heisst: so schreiben, wie man selbst behandelt werden möchte.", difficulty: 2 },
      { prompt: "Bedingung: Ein Foto zeigt ein Strassenschild. Was prüfst du vor dem Teilen?", answer: "Ob es zu viel über den Ort verrät", distractors: ["Ob das Schild schön aussieht", "Ob viele Farben im Bild sind", "Ob das Foto alt genug ist"], hint: "Eine Bedingung ist: Erkennt man den Ort?", difficulty: 3 },
      { prompt: "Bedingung: Jemand schickt ein Geheimnis weiter. Was ist daran problematisch?", answer: "Andere haben nicht zugestimmt", distractors: ["Die Nachricht ist zu kurz", "Der Chat wird langsamer", "Das Handy braucht mehr Akku"], hint: "Denke an Erlaubnis und Vertrauen.", difficulty: 3 },
      { prompt: "Bedingung: Eine Nachricht betrifft eine andere Person. Welche Regel passt?", answer: "Erst fragen, wenn sie eine andere Person betrifft", distractors: ["Immer sofort senden", "Nur auf die Uhr schauen", "Den Namen lauter schreiben"], hint: "Die Bedingung ist: Betrifft es jemand anderes?", difficulty: 3 },
    ],
    fills: [
      { prompt: "Meine Adresse ist eine ___ Angabe.", answer: "private", hint: "Diese Angabe gehört nicht öffentlich ins Internet.", difficulty: 1 },
      { prompt: "Vor dem Teilen eines Fotos frage ich um ___.", answer: "Erlaubnis", hint: "Andere Menschen dürfen mitentscheiden.", difficulty: 1 },
      { prompt: "Wenn mir etwas online Angst macht, hole ich ___.", answer: "Hilfe", hint: "Du musst so etwas nicht allein lösen.", difficulty: 1 },
      { prompt: "Ein respektvoller Chat braucht freundliche ___.", answer: "Worte", hint: "Denke an Sprache, die nicht verletzt.", difficulty: 2 },
      { prompt: "Digitale Spuren können länger ___ bleiben.", answer: "sichtbar", hint: "Nicht alles verschwindet sofort wieder.", difficulty: 2 },
      { prompt: "Bedingung: Ein Bild zeigt private Orte. Ich teile es nur mit ___.", answer: "Erlaubnis", hint: "Andere dürfen mitentscheiden.", difficulty: 3 },
      { prompt: "Bei einer Wenn-dann-Regel prüfe ich zuerst die ___.", answer: "Bedingung", hint: "Was muss gelten, bevor ich handle?", difficulty: 3 },
    ],
    pairGroups: [
      { prompt: "Ordne private und eher harmlose Angaben.", pairs: [["Wohnadresse", "privat"], ["Lieblingsfarbe", "meist harmlos"], ["Telefonnummer", "privat"], ["Lieblingstier", "meist harmlos"]], hint: "Privat ist, womit man dich gut finden oder kontaktieren kann.", difficulty: 1 },
      { prompt: "Ordne die Situation zur guten Reaktion.", pairs: [["Gemeine Nachricht", "melden"], ["Foto von Freundin", "erst fragen"], ["Unbekannter Kontakt", "Erwachsene fragen"], ["Netter Kommentar", "freundlich antworten"]], hint: "Suche die Handlung, die schützt oder respektvoll ist.", difficulty: 2 },
    ],
    sortGroups: [
      { prompt: "Sortiere: Teilen oder besser privat behalten?", zones: [["share", "Kann man teilen"], ["private", "Privat behalten"]], items: [["tier", "Mein Lieblingstier", "share"], ["adresse", "Meine Adresse", "private"], ["hobby", "Mein Hobby", "share"], ["telefon", "Telefonnummer", "private"]], hint: "Frage dich: Könnte mich jemand damit finden?", difficulty: 1 },
      { prompt: "Sortiere faire und unfaire Chat-Beiträge.", zones: [["fair", "Fair"], ["unfair", "Unfair"]], items: [["danke", "Danke für deine Hilfe", "fair"], ["witz", "Du bist peinlich", "unfair"], ["bitte", "Kannst du mir erklären?", "fair"], ["geheim", "Ich verrate dein Geheimnis", "unfair"]], hint: "Fair verletzt niemanden absichtlich.", difficulty: 2 },
    ],
    extraPairGroup: { prompt: "Ordne die Wenn-dann-Regel zur guten Entscheidung.", pairs: [["Wenn Foto mit Adresse", "nicht teilen"], ["Wenn Freundin zu sehen", "erst fragen"], ["Wenn Chat gemein wird", "Hilfe holen"], ["Wenn alles harmlos ist", "freundlich bleiben"]], hint: "Jede Bedingung führt zu einer sicheren Handlung.", difficulty: 3 },
    extraSortGroup: { prompt: "Sortiere einfache und schwierigere Teilen-Entscheidungen nach Bedingung.", zones: [["easy", "Einfach"], ["think", "Genau prüfen"]], items: [["tierbild", "Bild von meinem Plüschtier", "easy"], ["adresse", "Foto vor der Haustür", "think"], ["gruppe", "Klassenfoto im Chat", "think"], ["farbe", "Lieblingsfarbe nennen", "easy"]], hint: "Genau prüfen, wenn andere Personen oder Orte sichtbar sind.", difficulty: 3 },
    wordList: ["DATEN", "CHAT", "FOTO", "HILFE"],
    reviewPrompt: "Schreibe zwei Regeln, die dir beim sicheren Chatten helfen.",
    reviewCriteria: ["Ich nenne eine Regel zu privaten Angaben.", "Ich nenne eine Regel zu freundlicher Sprache.", "Meine Antwort ist verständlich und konkret."],
    extraReviewPrompt: "Du willst ein Foto teilen. Beschreibe mit einer Wenn-dann-Regel, wann du zuerst fragst.",
    extraReviewCriteria: ["Ich nutze eine klare Wenn-dann-Regel.", "Ich denke an andere Personen.", "Ich erkläre, warum Fragen fair ist."],
    extraReviewDifficulty: 3,
  },
  {
    grade: 3,
    id: "algorithmen-alltag-3",
    title: "Algorithmen im Alltag",
    emoji: "🧩",
    curriculumCodes: ["MI.2.2"],
    facts: [
      { prompt: "Was ist ein Algorithmus?", answer: "Eine klare Folge von Schritten", distractors: ["Ein zufälliger Tipp", "Ein kaputter Bildschirm", "Ein geheimes Passwort"], hint: "Denke an ein Rezept oder eine Anleitung.", difficulty: 1 },
      { prompt: "Welche Anleitung ist am klarsten?", answer: "Erst Hände waschen, dann Apfel schneiden", distractors: ["Mach etwas mit Essen", "Vielleicht zuerst oder später", "Nimm Dinge"], hint: "Klare Schritte sagen genau, was zuerst passiert.", difficulty: 1 },
      { prompt: "Warum ist Reihenfolge wichtig?", answer: "Weil sonst ein Schritt nicht passen kann", distractors: ["Weil Computer Farben mögen", "Weil alles gleichzeitig geht", "Weil Zahlen verschwinden"], hint: "Man kann die Schuhe nicht binden, bevor sie am Fuss sind.", difficulty: 1 },
      { prompt: "Was bedeutet wiederholen in einer Anleitung?", answer: "Einen Schritt mehrmals ausführen", distractors: ["Einen Schritt vergessen", "Nichts mehr tun", "Alles geheim halten"], hint: "Denke an Zähneputzen: jede Seite mehrmals.", difficulty: 2 },
      { prompt: "Was ist ein Fehler in einem Ablauf?", answer: "Ein Schritt passt nicht oder fehlt", distractors: ["Die Anleitung hat Wörter", "Die Aufgabe ist fertig", "Die Reihenfolge ist klar"], hint: "Ein kleiner Fehler kann den ganzen Ablauf stören.", difficulty: 2 },
      { prompt: "Was hilft beim Finden eines Fehlers?", answer: "Schritt für Schritt prüfen", distractors: ["Alles sofort löschen", "Raten und nicht schauen", "Nur den letzten Schritt lesen"], hint: "Gehe langsam durch den Ablauf.", difficulty: 2 },
      { prompt: "Wenn eine Figur nur bei Rot stehen bleibt, was ist Rot in der Regel?", answer: "Die Bedingung", distractors: ["Der letzte Schritt", "Ein Fehler", "Ein Passwort"], hint: "Die Farbe entscheidet, was passiert.", difficulty: 3 },
      { prompt: "Bedingung: Ein Ablauf sagt zweimal klatschen und dann springen. Was kommt zuerst?", answer: "Zweimal klatschen", distractors: ["Springen", "Pause machen", "Alles wieder löschen"], hint: "Die Reihenfolge bleibt wichtig.", difficulty: 3 },
      { prompt: "Bedingung: Ein Roboter sieht ein Hindernis. Welche Regel passt?", answer: "Wenn Hindernis vorne, dann drehen", distractors: ["Wenn fertig, dann schlafen", "Wenn Musik, dann malen", "Wenn hell, dann lesen"], hint: "Die Bedingung muss zum Hindernis passen.", difficulty: 3 },
    ],
    fills: [
      { prompt: "Ein Rezept ist eine Folge von ___.", answer: "Schritten", hint: "Ein Rezept sagt, was nacheinander passiert.", difficulty: 1 },
      { prompt: "Bei einer Anleitung ist die ___ wichtig.", answer: "Reihenfolge", hint: "Was kommt zuerst, was kommt danach?", difficulty: 1 },
      { prompt: "Einen Schritt mehrmals machen heisst ___.", answer: "wiederholen", hint: "Das Wort passt zu mehrmals.", difficulty: 2 },
      { prompt: "Einen Fehler im Ablauf kann man Schritt für Schritt ___.", answer: "prüfen", hint: "Man schaut jeden Schritt genau an.", difficulty: 2 },
      { prompt: "Ein Computer braucht klare ___.", answer: "Befehle", hint: "Unklare Sprache versteht er schlecht.", difficulty: 2 },
      { prompt: "Wenn etwas entscheidet, ob ein Schritt passiert, nennt man das ___.", answer: "Bedingung", hint: "Das Wort gehört zu Wenn-dann-Regeln.", difficulty: 3 },
      { prompt: "Bei einer Wenn-dann-Regel kommt nach wenn die ___.", answer: "Bedingung", hint: "Zuerst wird geprüft, ob etwas gilt.", difficulty: 3 },
    ],
    pairGroups: [
      { prompt: "Ordne Alltagssituationen zur passenden Schrittfolge.", pairs: [["Zähne putzen", "Bürste, Zahnpasta, putzen"], ["Jacke anziehen", "Ärmel, Reissverschluss, rausgehen"], ["Tee machen", "Wasser, Tee, warten"], ["Bild öffnen", "App, Datei, antippen"]], hint: "Suche, was logisch nacheinander passiert.", difficulty: 1 },
      { prompt: "Ordne die Wörter zur Bedeutung.", pairs: [["Schritt", "ein Teil der Anleitung"], ["Wiederholung", "mehrmals ausführen"], ["Fehler", "passt nicht"], ["Prüfen", "genau anschauen"]], hint: "Denke an eine Anleitung, die funktionieren soll.", difficulty: 2 },
    ],
    sortGroups: [
      { prompt: "Sortiere klare und unklare Befehle.", zones: [["clear", "Klar"], ["unclear", "Unklar"]], items: [["eins", "Tippe auf Start", "clear"], ["zwei", "Mach halt irgendwas", "unclear"], ["drei", "Lege die Karte nach rechts", "clear"], ["vier", "So ungefähr weiter", "unclear"]], hint: "Klare Befehle kann man direkt ausführen.", difficulty: 1 },
      { prompt: "Sortiere: Ablauf oder kein Ablauf?", zones: [["flow", "Ablauf"], ["none", "Kein Ablauf"]], items: [["rezept", "Rezept", "flow"], ["fahrplan", "Fahrplan", "flow"], ["farbe", "Lieblingsfarbe", "none"], ["wolke", "Wolkenform", "none"]], hint: "Ein Ablauf hat Schritte oder eine Reihenfolge.", difficulty: 2 },
    ],
    extraPairGroup: { prompt: "Ordne die Wenn-dann-Regel zur Bedeutung.", pairs: [["Wenn rot", "stehen bleiben"], ["Wenn grün", "gehen"], ["Wenn Fehler", "prüfen"], ["Wenn fertig", "speichern"]], hint: "Die Bedingung steht links, die Handlung rechts.", difficulty: 3 },
    extraSortGroup: { prompt: "Sortiere Wiederholung und Bedingung.", zones: [["loop", "Wiederholung"], ["condition", "Bedingung"]], items: [["dreimal", "dreimal klatschen", "loop"], ["solange", "solange Musik läuft", "loop"], ["wennrot", "wenn es rot ist", "condition"], ["fallsleer", "falls die Box leer ist", "condition"]], hint: "Wiederholung macht etwas mehrmals. Bedingung entscheidet.", difficulty: 3 },
    wordList: ["SCHRITT", "FEHLER", "CODE", "PLAN"],
    reviewPrompt: "Beschreibe eine kurze Anleitung mit mindestens drei Schritten.",
    reviewCriteria: ["Meine Anleitung hat mindestens drei Schritte.", "Die Reihenfolge ist logisch.", "Jeder Schritt ist klar formuliert."],
    extraReviewPrompt: "Schreibe eine Anleitung mit einer Wenn-dann-Regel, zum Beispiel für ein Spiel.",
    extraReviewCriteria: ["Ich nenne eine klare Bedingung.", "Die Handlung passt zur Bedingung.", "Die Schritte sind in einer sinnvollen Reihenfolge."],
    extraReviewDifficulty: 3,
  },
  {
    grade: 4,
    id: "informationen-pruefen-4",
    title: "Informationen prüfen",
    emoji: "🔎",
    curriculumCodes: ["MI.1.2"],
    facts: [
      { prompt: "Was ist eine Quelle?", answer: "Der Ursprung einer Information", distractors: ["Ein Ladekabel", "Ein Spielstand", "Eine Bildschirmfarbe"], hint: "Frage: Woher kommt die Information?", difficulty: 1 },
      { prompt: "Was hilft beim Prüfen einer Behauptung?", answer: "Mehrere verlässliche Quellen vergleichen", distractors: ["Nur die Überschrift lesen", "Dem lautesten Kommentar glauben", "Die erste Werbung nehmen"], hint: "Eine zweite Quelle kann bestätigen oder widersprechen.", difficulty: 2 },
      { prompt: "Welche Frage passt zu einem Bild im Internet?", answer: "Wer hat das Bild gemacht und warum?", distractors: ["Ist es bunt genug?", "Hat es viele Sterne?", "Gefällt es allen Kindern?"], hint: "Bilder können informieren, werben oder täuschen.", difficulty: 2 },
      { prompt: "Woran erkennt man Werbung oft?", answer: "Sie will zu einem Kauf oder Klick bewegen", distractors: ["Sie enthält nie Bilder", "Sie ist immer falsch", "Sie hat keine Überschrift"], hint: "Werbung verfolgt ein Ziel.", difficulty: 1 },
      { prompt: "Was ist eine Meinung?", answer: "Eine persönliche Einschätzung", distractors: ["Eine immer messbare Tatsache", "Ein Passwort", "Eine Datei"], hint: "Eine Meinung kann von Person zu Person verschieden sein.", difficulty: 1 },
      { prompt: "Was ist eine Tatsache?", answer: "Etwas, das man prüfen kann", distractors: ["Ein Wunsch", "Ein Gefühl", "Eine Lieblingsfarbe"], hint: "Tatsachen lassen sich belegen.", difficulty: 2 },
      { prompt: "Bedingung: Ein Bild wirkt sehr überraschend. Was prüfst du zusätzlich?", answer: "Ob es zum Text und zur Quelle passt", distractors: ["Ob es möglichst bunt ist", "Ob es ohne Lesen reicht", "Ob es viele Smileys hat"], hint: "Die Bedingung ist: Bild und Aussage müssen zusammenpassen.", difficulty: 3 },
      { prompt: "Bedingung: Zwei Quellen sagen Unterschiedliches. Was ist ein guter nächster Schritt?", answer: "Eine weitere verlässliche Quelle suchen", distractors: ["Die lautere Quelle wählen", "Beide sofort teilen", "Nur das Bild anschauen"], hint: "Bei Widerspruch prüft man weiter.", difficulty: 3 },
      { prompt: "Bedingung: Eine Seite will etwas verkaufen. Wie liest du die Information?", answer: "Ich achte besonders auf Werbung und Absicht", distractors: ["Ich glaube alles sofort", "Ich lese nur die Farbe", "Ich lösche alle Fakten"], hint: "Die Absicht der Quelle ist wichtig.", difficulty: 3 },
    ],
    fills: [
      { prompt: "Eine Information kommt aus einer ___.", answer: "Quelle", hint: "Das Wort meint den Ursprung.", difficulty: 1 },
      { prompt: "Eine Tatsache kann man ___.", answer: "prüfen", hint: "Man sucht Belege.", difficulty: 1 },
      { prompt: "Werbung möchte oft, dass man etwas ___.", answer: "kauft", hint: "Denke an Laden, App oder Klick.", difficulty: 1 },
      { prompt: "Bei einer Behauptung hilft ein zweiter ___.", answer: "Beleg", hint: "Ein Nachweis macht eine Aussage stärker.", difficulty: 2 },
      { prompt: "Eine Meinung ist nicht automatisch ___.", answer: "falsch", hint: "Sie ist persönlich, nicht zwingend eine Tatsache.", difficulty: 2 },
      { prompt: "Bedingung: Quellen widersprechen. Ich prüfe mit einer weiteren ___.", answer: "Quelle", hint: "Ein dritter Blick kann helfen.", difficulty: 3 },
      { prompt: "Bedingung: Eine Quelle will überzeugen. Ihre Absicht zeigt, warum sie etwas ___.", answer: "sagt", hint: "Will sie informieren, werben oder überzeugen?", difficulty: 3 },
    ],
    pairGroups: [
      { prompt: "Ordne Begriff und Bedeutung.", pairs: [["Quelle", "Ursprung"], ["Beleg", "Nachweis"], ["Meinung", "Einschätzung"], ["Tatsache", "prüfbar"]], hint: "Denke an das Prüfen von Informationen.", difficulty: 1 },
      { prompt: "Ordne die Aussage richtig ein.", pairs: [["Bern ist eine Stadt", "Tatsache"], ["Ich mag Videos", "Meinung"], ["Klick hier und kauf", "Werbung"], ["Autorin: Stadtbibliothek", "Quelle"]], hint: "Frage, ob man es prüfen kann oder ob jemand überzeugen will.", difficulty: 2 },
    ],
    sortGroups: [
      { prompt: "Sortiere Tatsache und Meinung.", zones: [["fact", "Tatsache"], ["opinion", "Meinung"]], items: [["bern", "Bern liegt in der Schweiz", "fact"], ["beste", "Das ist das beste Spiel", "opinion"], ["wasser", "Wasser kann gefrieren", "fact"], ["langweilig", "Dieses Buch ist langweilig", "opinion"]], hint: "Tatsachen kann man prüfen.", difficulty: 1 },
      { prompt: "Sortiere gute und schwache Prüf-Schritte.", zones: [["good", "Guter Schritt"], ["weak", "Schwacher Schritt"]], items: [["zwei", "Zwei Quellen vergleichen", "good"], ["nur", "Nur die Überschrift lesen", "weak"], ["datum", "Datum beachten", "good"], ["laut", "Dem lautesten Kommentar glauben", "weak"]], hint: "Gute Schritte machen eine Aussage nachvollziehbar.", difficulty: 2 },
    ],
    extraPairGroup: { prompt: "Ordne die Wenn-dann-Situation zum Prüfschritt.", pairs: [["Wenn Quelle unbekannt", "Autor suchen"], ["Wenn Bild überrascht", "Bild und Text vergleichen"], ["Wenn Werbung sichtbar", "Absicht beachten"], ["Wenn Datum alt", "neuere Quelle suchen"]], hint: "Die Bedingung zeigt, worauf du achten musst.", difficulty: 3 },
    extraSortGroup: { prompt: "Sortiere Hinweise nach Bedingung: verlässliche oder unsichere Information.", zones: [["reliable", "Verlässlicher"], ["unclear", "Unsicherer"]], items: [["autor", "Autor ist genannt", "reliable"], ["datum", "Datum ist sichtbar", "reliable"], ["druck", "Teile sofort!", "unclear"], ["ohne", "keine Quelle genannt", "unclear"]], hint: "Verlässlich heisst: Man kann Herkunft und Zeitpunkt prüfen.", difficulty: 3 },
    wordList: ["QUELLE", "BELEG", "FAKT", "BILD"],
    reviewPrompt: "Erkläre, wie du eine überraschende Nachricht prüfen würdest.",
    reviewCriteria: ["Ich nenne mindestens zwei Prüfschritte.", "Ich unterscheide Tatsache und Meinung.", "Ich schreibe in eigenen Worten."],
    extraReviewPrompt: "Beschreibe mit einer Wenn-dann-Regel, was du tust, wenn zwei Quellen nicht dasselbe sagen.",
    extraReviewCriteria: ["Ich nenne den Widerspruch.", "Ich suche eine weitere Quelle.", "Ich teile die Information nicht vorschnell."],
    extraReviewDifficulty: 3,
  },
  {
    grade: 4,
    id: "programme-befehle-4",
    title: "Programme & Befehle",
    emoji: "⌨️",
    curriculumCodes: ["MI.2.2", "MI.2.3"],
    facts: [
      { prompt: "Was ist ein Programm?", answer: "Eine Folge von Befehlen für ein Gerät", distractors: ["Ein leerer Ordner", "Eine Bildschirmfolie", "Ein Ladekabel"], hint: "Ein Programm sagt dem Gerät, was es tun soll.", difficulty: 1 },
      { prompt: "Was bedeutet Debugging?", answer: "Fehler in einem Ablauf finden und verbessern", distractors: ["Alles farbig machen", "Den Bildschirm putzen", "Ein Passwort verraten"], hint: "Es geht um Fehler im Ablauf.", difficulty: 2 },
      { prompt: "Warum testet man ein Programm?", answer: "Damit man sieht, ob es wie geplant funktioniert", distractors: ["Damit es schwerer wird", "Damit die Datei verschwindet", "Damit niemand es öffnen kann"], hint: "Ein Test zeigt, ob ein Befehl passt.", difficulty: 2 },
      { prompt: "Was ist eine Schleife?", answer: "Eine Wiederholung von Befehlen", distractors: ["Ein sicherer Name", "Eine Bilddatei", "Ein leerer Akku"], hint: "Denke an etwas, das mehrmals passiert.", difficulty: 2 },
      { prompt: "Was braucht ein genauer Befehl?", answer: "Eine klare Handlung", distractors: ["Viele Geheimwörter", "Ein Rätsel", "Eine zufällige Reihenfolge"], hint: "Ein Befehl soll ausführbar sein.", difficulty: 1 },
      { prompt: "Was ist eine Bedingung?", answer: "Eine Wenn-dann-Regel", distractors: ["Eine Farbe", "Ein Kabel", "Ein Spielstand"], hint: "Wenn etwas gilt, passiert etwas.", difficulty: 3 },
      { prompt: "Welche Aufgabe passt zu einer Schleife?", answer: "Zeichne fünf gleiche Schritte nacheinander", distractors: ["Vergiss den ersten Schritt", "Wähle eine zufällige Farbe", "Schalte das Heft aus"], hint: "Eine Schleife wiederholt.", difficulty: 1 },
      { prompt: "Wenn eine Figur am Rand drehen soll, welche Bedingung passt?", answer: "Wenn Rand erreicht, dann drehen", distractors: ["Wenn Musik leise, dann schreiben", "Wenn Heft voll, dann trinken", "Wenn Farbe blau, dann schlafen"], hint: "Die Bedingung muss zum Rand passen.", difficulty: 2 },
      { prompt: "Bedingung: Ein Testlauf endet anders als geplant. Was prüfst du zuerst?", answer: "Ob ein Befehl fehlt oder falsch steht", distractors: ["Ob das Wort schön aussieht", "Ob der Akku voll klingt", "Ob die Figur einen Namen hat"], hint: "Suche den Fehler im Ablauf.", difficulty: 3 },
    ],
    fills: [
      { prompt: "Ein Gerät folgt klaren ___.", answer: "Befehlen", hint: "Das sind einzelne Anweisungen.", difficulty: 1 },
      { prompt: "Eine Wiederholung nennt man auch ___.", answer: "Schleife", hint: "Das Wort passt zu mehrmals ausführen.", difficulty: 2 },
      { prompt: "Beim Testen sucht man ___.", answer: "Fehler", hint: "Man schaut, was noch nicht passt.", difficulty: 1 },
      { prompt: "Eine Wenn-dann-Regel ist eine ___.", answer: "Bedingung", hint: "Das Wort gehört zum Programmieren.", difficulty: 3 },
      { prompt: "Ein Ablaufplan zeigt die ___ der Schritte.", answer: "Reihenfolge", hint: "Was kommt zuerst?", difficulty: 2 },
      { prompt: "Ein Testlauf zeigt, ob ein Programm ___.", answer: "funktioniert", hint: "Man probiert es aus.", difficulty: 2 },
      { prompt: "Bedingung: Ein Ablauf stockt. Ich suche den ___.", answer: "Fehler", hint: "Ein Schritt passt dann noch nicht.", difficulty: 3 },
    ],
    pairGroups: [
      { prompt: "Ordne Programmierwörter zur Bedeutung.", pairs: [["Befehl", "Anweisung"], ["Test", "ausprobieren"], ["Fehler", "passt nicht"], ["Schleife", "Wiederholung"]], hint: "Suche die einfache Erklärung.", difficulty: 1 },
      { prompt: "Ordne die Regel zur Situation.", pairs: [["Wenn es regnet", "Jacke nehmen"], ["Wenn Akku leer", "laden"], ["Wenn fertig", "speichern"], ["Wenn falsch", "prüfen"]], hint: "Wenn-dann-Regeln verbinden Bedingung und Handlung.", difficulty: 2 },
    ],
    sortGroups: [
      { prompt: "Sortiere Befehle und keine Befehle.", zones: [["command", "Befehl"], ["other", "Kein Befehl"]], items: [["start", "Drücke Start", "command"], ["rot", "Rot ist schön", "other"], ["speichere", "Speichere die Datei", "command"], ["vielleicht", "Vielleicht später", "other"]], hint: "Ein Befehl sagt klar, was getan wird.", difficulty: 1 },
      { prompt: "Sortiere nach Programmier-Idee.", zones: [["loop", "Wiederholung"], ["condition", "Bedingung"]], items: [["dreimal", "Wiederhole dreimal", "loop"], ["solange", "Solange Musik läuft", "loop"], ["wenn", "Wenn richtig", "condition"], ["falls", "Falls es regnet", "condition"]], hint: "Wiederholung macht etwas mehrmals, Bedingung entscheidet.", difficulty: 2 },
    ],
    extraPairGroup: { prompt: "Ordne Programmfehler zur passenden Verbesserung der Bedingung oder Schritte.", pairs: [["Schritt fehlt", "ergänzen"], ["Reihenfolge falsch", "umstellen"], ["Befehl unklar", "genauer schreiben"], ["Bedingung falsch", "Wenn-dann prüfen"]], hint: "Jede Verbesserung passt zu einem bestimmten Problem.", difficulty: 3 },
    extraSortGroup: { prompt: "Sortiere einfache Befehle und Bedingungen.", zones: [["command", "Befehl"], ["condition", "Bedingung"]], items: [["tippe", "Tippe auf Start", "command"], ["speichere", "Speichere das Bild", "command"], ["wennvoll", "wenn der Korb voll ist", "condition"], ["fallsrot", "falls die Karte rot ist", "condition"]], hint: "Befehle tun etwas. Bedingungen prüfen etwas.", difficulty: 3 },
    wordList: ["CODE", "TEST", "FEHLER", "PLAN"],
    reviewPrompt: "Schreibe eine Wenn-dann-Regel aus deinem Alltag.",
    reviewCriteria: ["Ich verwende wenn und dann sinnvoll.", "Die Handlung passt zur Bedingung.", "Die Regel ist klar und kurz."],
    extraReviewPrompt: "Erkläre, wie du einen Fehler in einer kurzen Wenn-dann-Anleitung findest.",
    extraReviewCriteria: ["Ich prüfe die Schritte der Reihe nach.", "Ich beachte die Bedingung.", "Ich beschreibe eine passende Verbesserung."],
    extraReviewDifficulty: 3,
  },
  {
    grade: 5,
    id: "sicher-online-5",
    title: "Sicher online",
    emoji: "🛡️",
    curriculumCodes: ["MI.1.4", "MI.2.3"],
    facts: [
      { prompt: "Was macht ein Passwort stärker?", answer: "Es ist lang und schwer zu erraten", distractors: ["Es ist der eigene Name", "Es steht auf dem Pult", "Es ist 1234"], hint: "Länge und Überraschung helfen.", difficulty: 1 },
      { prompt: "Warum nutzt man nicht überall dasselbe Passwort?", answer: "Ein einzelnes bekanntes Passwort wäre sonst besonders gefährlich", distractors: ["Weil Geräte sonst zu hell werden", "Weil Websites Farben verwechseln", "Weil man dann keine Dateien sieht"], hint: "Wenn ein Passwort bekannt wird, schützt ein anderes Konto noch.", difficulty: 2 },
      { prompt: "Was ist Phishing?", answer: "Ein Trick, um an Daten oder Passwörter zu kommen", distractors: ["Ein sicheres Backup", "Ein Bildformat", "Eine Rechenart"], hint: "Es wirkt oft wie eine echte Nachricht.", difficulty: 2 },
      { prompt: "Was prüfst du bei einem verdächtigen Link?", answer: "Absender, Adresse und Zweck", distractors: ["Nur die Farbe", "Nur die Länge", "Nur das Emoji"], hint: "Ein Link kann echt aussehen und trotzdem täuschen.", difficulty: 2 },
      { prompt: "Was gehört nicht in einen öffentlichen Chat?", answer: "Passwort", distractors: ["Lieblingsbuch", "Allgemeine Frage", "Freundlicher Dank"], hint: "Ein Passwort ist immer privat.", difficulty: 1 },
      { prompt: "Wofür ist ein Update wichtig?", answer: "Es kann Sicherheitslücken schliessen", distractors: ["Es macht jedes Gerät gratis", "Es löscht immer Fotos", "Es ersetzt jedes Passwort"], hint: "Updates verbessern nicht nur das Aussehen.", difficulty: 3 },
      { prompt: "Welche Passwort-Idee ist gut merkbar und trotzdem stärker?", answer: "Mehrere zufällige Wörter mit Zahl", distractors: ["Nur mein Vorname", "Das Wort Passwort", "Vier gleiche Zahlen"], hint: "Lang und überraschend ist besser.", difficulty: 1 },
      { prompt: "Warum ist Zeitdruck in einer Nachricht ein Warnzeichen?", answer: "Er soll dich zu schnellem Klicken bringen", distractors: ["Er macht Links automatisch sicher", "Er beweist, dass alles stimmt", "Er ersetzt einen Absender"], hint: "Tricknachrichten wollen oft schnelle Reaktionen.", difficulty: 3 },
      { prompt: "Was prüfst du, bevor du eine App installierst?", answer: "Quelle, Bewertungen und benötigte Berechtigungen", distractors: ["Nur die Farbe des Symbols", "Ob der Name kurz ist", "Ob sie viele Töne macht"], hint: "Eine App bekommt manchmal Zugriff auf Daten.", difficulty: 3 },
    ],
    fills: [
      { prompt: "Ein starkes Passwort ist schwer zu ___.", answer: "erraten", hint: "Andere sollen es nicht leicht finden.", difficulty: 1 },
      { prompt: "Eine verdächtige Nachricht kann ___ sein.", answer: "Phishing", hint: "Das Wort bezeichnet einen Daten-Trick.", difficulty: 2 },
      { prompt: "Passwörter gehören nicht in den ___.", answer: "Chat", hint: "Dort können andere mitlesen.", difficulty: 1 },
      { prompt: "Updates können Sicherheitslücken ___.", answer: "schliessen", hint: "Sie machen ein System sicherer.", difficulty: 3 },
      { prompt: "Bei Unsicherheit frage ich eine ___ Person.", answer: "erwachsene", hint: "Hol dir Hilfe, bevor du klickst.", difficulty: 1 },
      { prompt: "Ein Passwort bleibt sicherer, wenn ich es ___ halte.", answer: "geheim", hint: "Es gehört nicht in Nachrichten oder Chats.", difficulty: 1 },
      { prompt: "Eine Nachricht mit Druck sollte ich besonders genau ___.", answer: "prüfen", hint: "Schnelles Klicken ist oft riskant.", difficulty: 3 },
    ],
    pairGroups: [
      { prompt: "Ordne Sicherheitsbegriffe.", pairs: [["Passwort", "geheim halten"], ["Update", "erneuern"], ["Phishing", "Tricknachricht"], ["Backup", "Sicherungskopie"]], hint: "Denke an Schutz und Wiederherstellung.", difficulty: 2 },
      { prompt: "Ordne Risiko und gute Reaktion.", pairs: [["Unbekannter Link", "prüfen"], ["Passwort gefragt", "nicht senden"], ["Gerät meldet Update", "Erwachsene fragen"], ["Daten verloren", "Backup nutzen"]], hint: "Die gute Reaktion schützt Daten.", difficulty: 2 },
    ],
    sortGroups: [
      { prompt: "Sortiere starke und schwache Passwörter.", zones: [["strong", "Stärker"], ["weak", "Schwach"]], items: [["lang", "Wolke!Birne7Zug", "strong"], ["name", "Lena2015", "weak"], ["kurz", "123456", "weak"], ["satz", "Mein-Velo-ist-blau-8", "strong"]], hint: "Stark heisst lang und nicht leicht zu erraten.", difficulty: 2 },
      { prompt: "Sortiere sichere und riskante Klicks.", zones: [["safe", "Sicherer"], ["risk", "Riskant"]], items: [["schule", "bekannte Schulplattform öffnen", "safe"], ["gewinn", "Gewinn-Link von Unbekannt", "risk"], ["abo", "Linkadresse prüfen", "safe"], ["druck", "Sofort Passwort eingeben", "risk"]], hint: "Druck und unbekannte Absender sind Warnzeichen.", difficulty: 2 },
    ],
    extraPairGroup: { prompt: "Ordne Warnzeichen und gute Reaktion.", pairs: [["Zeitdruck", "ruhig prüfen"], ["Passwort gefragt", "nicht senden"], ["unbekannte App", "Quelle prüfen"], ["komischer Link", "Adresse anschauen"]], hint: "Die Reaktion soll Daten schützen.", difficulty: 1 },
    extraSortGroup: { prompt: "Sortiere App-Berechtigungen.", zones: [["ok", "Passt eher"], ["check", "Genau prüfen"]], items: [["kamera", "Kamera für Foto-App", "ok"], ["standort", "Standort für Taschenlampe", "check"], ["mikro", "Mikrofon für Aufnahme-App", "ok"], ["kontakte", "Kontakte für einfaches Spiel", "check"]], hint: "Prüfe, ob die Berechtigung zur App passt.", difficulty: 3 },
    wordList: ["PASSWORT", "DATEN", "UPDATE", "LINK"],
    reviewPrompt: "Formuliere drei Regeln für ein sicheres Passwort.",
    reviewCriteria: ["Ich nenne Länge oder mehrere Wortteile.", "Ich sage, dass es geheim bleiben muss.", "Ich vermeide persönliche Daten im Passwort."],
    extraReviewPrompt: "Erkläre, wie du bei einer Nachricht mit Zeitdruck ruhig und sicher entscheidest.",
    extraReviewCriteria: ["Ich prüfe Absender oder Link.", "Ich gebe keine privaten Daten ein.", "Ich hole Hilfe, wenn ich unsicher bin."],
    extraReviewDifficulty: 3,
  },
  {
    grade: 5,
    id: "daten-diagramme-5",
    title: "Daten verstehen",
    emoji: "📊",
    curriculumCodes: ["MI.2.1", "MI.2.3"],
    facts: [
      { prompt: "Was sind Daten?", answer: "Gesammelte Informationen, die man ordnen und auswerten kann", distractors: ["Nur leere Tabellen", "Immer geheime Passwörter", "Nur Bilder ohne Bedeutung"], hint: "Daten können Zahlen, Wörter oder Beobachtungen sein.", difficulty: 1 },
      { prompt: "Warum ordnet man Daten?", answer: "Damit man Muster leichter erkennt", distractors: ["Damit sie verschwinden", "Damit sie zufällig werden", "Damit niemand sie lesen kann"], hint: "Ordnung hilft beim Vergleichen.", difficulty: 1 },
      { prompt: "Welche Darstellung passt zu Häufigkeiten?", answer: "Ein Säulendiagramm", distractors: ["Ein Passwortfeld", "Eine Tonaufnahme", "Ein leerer Ordner"], hint: "Säulen zeigen Mengen nebeneinander.", difficulty: 2 },
      { prompt: "Was bedeutet auswerten?", answer: "Daten anschauen und Schlüsse ziehen", distractors: ["Daten absichtlich mischen", "Daten ohne Grund löschen", "Daten in Geheimschrift schreiben"], hint: "Man fragt: Was zeigen die Daten?", difficulty: 2 },
      { prompt: "Warum achtet man auf Datenschutz?", answer: "Weil Daten etwas über Menschen verraten können", distractors: ["Weil Tabellen immer falsch sind", "Weil Zahlen nie stimmen", "Weil Diagramme verboten sind"], hint: "Manche Daten sind persönlich.", difficulty: 2 },
      { prompt: "Was ist ein Datenfehler?", answer: "Ein Wert passt nicht zur Beobachtung", distractors: ["Eine klare Überschrift", "Eine vollständige Tabelle", "Ein korrektes Datum"], hint: "Fehler können beim Eintragen passieren.", difficulty: 3 },
      { prompt: "Welche Daten darf eine Klasse meist ohne Namen sammeln?", answer: "Wie viele Kinder mit dem Velo kommen", distractors: ["Adresse jedes Kindes", "Passwort jedes Kontos", "Telefonnummern mit Namen"], hint: "Ohne Namen ist eine Umfrage oft besser geschützt.", difficulty: 1 },
      { prompt: "Warum braucht eine Umfrage klare Antwortmöglichkeiten?", answer: "Damit die Antworten vergleichbar sind", distractors: ["Damit niemand zählen kann", "Damit jede Tabelle leer bleibt", "Damit Daten zufällig werden"], hint: "Gleiche Kategorien helfen beim Auswerten.", difficulty: 3 },
      { prompt: "Was prüfst du, wenn ein Diagramm sehr überraschend aussieht?", answer: "Skala, Titel und Datenquelle", distractors: ["Nur die schönste Farbe", "Ob es ein Passwort hat", "Ob die Säulen laut sind"], hint: "Ein Diagramm kann durch Darstellung täuschen.", difficulty: 3 },
    ],
    fills: [
      { prompt: "Daten kann man sammeln, ordnen und ___.", answer: "auswerten", hint: "Danach versteht man sie besser.", difficulty: 2 },
      { prompt: "Ein Diagramm macht Daten ___.", answer: "sichtbar", hint: "Man erkennt Unterschiede schneller.", difficulty: 1 },
      { prompt: "Persönliche Daten brauchen besonderen ___.", answer: "Schutz", hint: "Nicht alles darf öffentlich sein.", difficulty: 2 },
      { prompt: "Ein Fehler in einer Tabelle kann ein Ergebnis ___.", answer: "verändern", hint: "Ein falscher Wert beeinflusst den Schluss.", difficulty: 3 },
      { prompt: "Gleiche Kategorien helfen beim ___.", answer: "Vergleichen", hint: "Dann sieht man Unterschiede fairer.", difficulty: 2 },
      { prompt: "Eine Umfrage ohne Namen schützt die ___.", answer: "Privatsphäre", hint: "Persönliche Angaben bleiben besser geschützt.", difficulty: 1 },
      { prompt: "Bei einem Diagramm prüfe ich Titel, Skala und ___.", answer: "Quelle", hint: "Woher kommen die Daten?", difficulty: 3 },
    ],
    pairGroups: [
      { prompt: "Ordne Datenwörter.", pairs: [["Tabelle", "geordnet"], ["Diagramm", "sichtbar"], ["Kategorie", "Gruppe"], ["Auswertung", "Schluss ziehen"]], hint: "Denke an eine Umfrage in der Klasse.", difficulty: 1 },
      { prompt: "Ordne Beispiel und Datentyp.", pairs: [["Anzahl Velos", "Zahl"], ["Lieblingsfach", "Kategorie"], ["Geburtsdatum", "persönlich"], ["Wetterbeobachtung", "Messung"]], hint: "Frage, welche Art von Information vorliegt.", difficulty: 2 },
    ],
    sortGroups: [
      { prompt: "Sortiere persönliche und unpersönliche Daten.", zones: [["personal", "Persönlich"], ["general", "Unpersönlich"]], items: [["name", "Name und Adresse", "personal"], ["klasse", "Anzahl Kinder in der Klasse", "general"], ["lieblings", "Lieblingsessen mit Name", "personal"], ["regen", "Regentage im Mai", "general"]], hint: "Persönlich heisst: Es lässt sich einer Person zuordnen.", difficulty: 2 },
      { prompt: "Sortiere gute und schlechte Tabellen-Arbeit.", zones: [["good", "Sorgfältig"], ["bad", "Unsorgfältig"]], items: [["titel", "klare Überschrift", "good"], ["mix", "Kategorien mischen", "bad"], ["check", "Werte prüfen", "good"], ["leer", "wichtige Felder leer lassen", "bad"]], hint: "Sorgfalt macht Daten verlässlicher.", difficulty: 2 },
    ],
    extraPairGroup: { prompt: "Ordne Datensituation und gute Entscheidung.", pairs: [["Klassenumfrage", "ohne Namen"], ["Diagramm", "Skala prüfen"], ["Tabelle", "Kategorien klären"], ["Datenfehler", "Wert korrigieren"]], hint: "Die Entscheidung soll fair und verlässlich sein.", difficulty: 1 },
    extraSortGroup: { prompt: "Sortiere gute und heikle Umfragefragen.", zones: [["good", "Geeignet"], ["sensitive", "Heikel"]], items: [["velo", "Wie kommst du zur Schule?", "good"], ["fach", "Welches Fach magst du?", "good"], ["adresse", "Wie lautet deine Adresse?", "sensitive"], ["konto", "Wie lautet dein Passwort?", "sensitive"]], hint: "Heikle Fragen verraten zu viel über einzelne Personen.", difficulty: 3 },
    wordList: ["DATEN", "TABELLE", "MUSTER", "SCHUTZ"],
    reviewPrompt: "Du machst eine Klassenumfrage. Welche Daten darfst du ohne Namen sammeln?",
    reviewCriteria: ["Ich nenne mindestens zwei geeignete Beispiele.", "Ich erkläre, warum keine Namen nötig sind.", "Ich achte auf Datenschutz."],
    extraReviewPrompt: "Erkläre, wie du ein überraschendes Diagramm prüfst, bevor du ihm glaubst.",
    extraReviewCriteria: ["Ich prüfe Titel oder Frage.", "Ich schaue auf Skala und Quelle.", "Ich ziehe nicht vorschnell einen Schluss."],
    extraReviewDifficulty: 3,
  },
  {
    grade: 6,
    id: "feeds-algorithmen-6",
    title: "Feeds & Algorithmen",
    emoji: "🧠",
    curriculumCodes: ["MI.1.2", "MI.2.2", "MI.2.3"],
    facts: [
      { prompt: "Warum sehen zwei Kinder nicht immer dieselben Suchergebnisse?", answer: "Systeme können Ergebnisse unterschiedlich sortieren", distractors: ["Das Internet hat nur eine Seite", "Alle Wörter bedeuten dasselbe", "Suchmaschinen würfeln immer"], hint: "Reihenfolge und Auswahl entstehen nicht zufällig.", difficulty: 2 },
      { prompt: "Was ist ein Feed?", answer: "Eine laufende Auswahl von Beiträgen", distractors: ["Ein Druckerpapier", "Ein leerer Akku", "Ein sicherer Ordner"], hint: "Du siehst Beitrag für Beitrag.", difficulty: 1 },
      { prompt: "Was kann ein Empfehlungsalgorithmus tun?", answer: "Beiträge nach Signalen auswählen", distractors: ["Alle Meinungen prüfen", "Jedes Passwort schützen", "Das Wetter ändern"], hint: "Signale können Klicks, Zeit oder Suchbegriffe sein.", difficulty: 2 },
      { prompt: "Was ist eine Filterblase?", answer: "Man sieht vor allem Ähnliches wie bisher", distractors: ["Ein kaputter Bildschirm", "Ein starkes Passwort", "Eine leere Tabelle"], hint: "Der Blick kann enger werden.", difficulty: 3 },
      { prompt: "Was hilft gegen einseitige Informationen?", answer: "Verschiedene Quellen bewusst vergleichen", distractors: ["Nur einem Feed folgen", "Nur die erste Meinung lesen", "Jede Werbung teilen"], hint: "Breiter schauen hilft.", difficulty: 2 },
      { prompt: "Warum ist die Überschrift allein zu wenig?", answer: "Sie zeigt oft nicht den ganzen Zusammenhang", distractors: ["Sie ist immer verboten", "Sie enthält nie Wörter", "Sie ersetzt Belege"], hint: "Eine Überschrift soll Aufmerksamkeit holen.", difficulty: 2 },
      { prompt: "Was ist ein Like für ein Empfehlungssystem?", answer: "Ein Signal, dass ein Inhalt interessieren könnte", distractors: ["Ein sicheres Passwort", "Ein kaputtes Kabel", "Ein Beweis für Wahrheit"], hint: "Ein Signal hilft beim Sortieren.", difficulty: 1 },
      { prompt: "Warum werden ähnliche Videos oft nacheinander gezeigt?", answer: "Das System nutzt frühere Nutzung als Hinweis", distractors: ["Alle Videos sind gleich", "Niemand wählt Reihenfolgen", "Das Gerät kennt die Zukunft"], hint: "Klicks und Sehzeit können Hinweise sein.", difficulty: 1 },
      { prompt: "Was ist eine gute erste Prüfung bei einem starken Beitrag?", answer: "Quelle und Datum anschauen", distractors: ["Nur die Musik bewerten", "Sofort weiterleiten", "Nur die Kommentare zählen"], hint: "Herkunft und Zeit helfen beim Einordnen.", difficulty: 1 },
      { prompt: "Warum kann ein Feed deine Sicht enger machen?", answer: "Er zeigt oft mehr von dem, was du schon anschaust", distractors: ["Er löscht alle Quellen", "Er macht Fakten unmöglich", "Er verbietet Bücher"], hint: "Ähnliche Inhalte können andere Sichtweisen verdrängen.", difficulty: 3 },
      { prompt: "Was ist ein sinnvoller Umgang mit empfohlenen Beiträgen?", answer: "Bewusst auch andere Quellen suchen", distractors: ["Alles sofort glauben", "Nur kurze Beiträge lesen", "Alle Hinweise ausschalten"], hint: "Breiter suchen hilft gegen Einseitigkeit.", difficulty: 3 },
    ],
    fills: [
      { prompt: "Ein Feed zeigt eine Auswahl von ___.", answer: "Beiträgen", hint: "Es sind einzelne Posts, Videos oder Meldungen.", difficulty: 1 },
      { prompt: "Ein Algorithmus kann Beiträge ___.", answer: "sortieren", hint: "Was kommt zuerst?", difficulty: 2 },
      { prompt: "Bei einer Filterblase sieht man oft ähnliche ___.", answer: "Inhalte", hint: "Der Blick wird enger.", difficulty: 3 },
      { prompt: "Gegen Einseitigkeit helfen verschiedene ___.", answer: "Quellen", hint: "Mehrere Ursprünge von Information.", difficulty: 2 },
      { prompt: "Eine starke Behauptung braucht gute ___.", answer: "Belege", hint: "Sonst bleibt sie unsicher.", difficulty: 2 },
    ],
    pairGroups: [
      { prompt: "Ordne Medienbegriffe.", pairs: [["Feed", "Beitragsauswahl"], ["Signal", "Hinweis fürs System"], ["Quelle", "Ursprung"], ["Filterblase", "enger Blick"]], hint: "Suche die einfache Bedeutung.", difficulty: 2 },
      { prompt: "Ordne Handlung und Wirkung.", pairs: [["Nur ein Feed", "einseitiger"], ["Quellen vergleichen", "verlässlicher"], ["Überschrift prüfen", "genauer"], ["Werbung erkennen", "bewusster"]], hint: "Was macht die Information besser oder enger?", difficulty: 2 },
    ],
    sortGroups: [
      { prompt: "Sortiere sinnvolle und schwache Prüfungen.", zones: [["good", "Sinnvoll"], ["weak", "Schwach"]], items: [["autor", "Autor und Datum prüfen", "good"], ["titel", "nur Titel lesen", "weak"], ["vergleich", "zweite Quelle suchen", "good"], ["likes", "nur Likes zählen", "weak"]], hint: "Sinnvoll heisst nachvollziehbar und breiter.", difficulty: 2 },
      { prompt: "Sortiere Feed-Signale und keine Feed-Signale.", zones: [["signal", "Signal"], ["none", "Kein Signal"]], items: [["klick", "angeklickt", "signal"], ["zeit", "lange angeschaut", "signal"], ["himmel", "Wolkenform", "none"], ["schuh", "Schuhgrösse ohne Bezug", "none"]], hint: "Signale hängen mit Nutzung oder Inhalt zusammen.", difficulty: 3 },
    ],
    extraPairGroup: { prompt: "Ordne Feed-Begriff und Bedeutung.", pairs: [["Like", "Interesse-Signal"], ["Sehzeit", "Nutzungshinweis"], ["Quelle", "Herkunft"], ["Filterblase", "ähnliche Inhalte"]], hint: "Denke daran, wie ein Feed Beiträge auswählt.", difficulty: 3 },
    extraSortGroup: { prompt: "Sortiere breite und enge Informationssuche.", zones: [["broad", "Breiter"], ["narrow", "Enger"]], items: [["vergleich", "mehrere Quellen lesen", "broad"], ["nurfeed", "nur dem Feed folgen", "narrow"], ["andere", "andere Sichtweise suchen", "broad"], ["sofort", "sofort alles glauben", "narrow"]], hint: "Breiter heisst: nicht nur eine Quelle nutzen.", difficulty: 3 },
    wordList: ["FEED", "QUELLE", "SIGNAL", "FAKT"],
    reviewPrompt: "Beschreibe, wie du prüfst, ob ein Beitrag in deinem Feed verlässlich ist.",
    reviewCriteria: ["Ich nenne Quelle oder Autor.", "Ich vergleiche mit einer zweiten Quelle.", "Ich unterscheide Inhalt und Werbung."],
    extraReviewPrompt: "Erkläre, wie ein Feed durch deine Nutzung beeinflusst werden kann.",
    extraReviewCriteria: ["Ich nenne mindestens ein Signal.", "Ich erkläre die Auswahl von Beiträgen.", "Ich erwähne eine Möglichkeit, breiter zu suchen."],
    extraReviewDifficulty: 3,
  },
  {
    grade: 6,
    id: "netzwerke-sicherheit-6",
    title: "Netzwerke & Sicherheit",
    emoji: "🌐",
    curriculumCodes: ["MI.2.1", "MI.2.3"],
    facts: [
      { prompt: "Was ist ein Netzwerk?", answer: "Mehrere Geräte oder Menschen sind miteinander verbunden", distractors: ["Ein einzelner Stift", "Ein leeres Heft", "Ein ausgeschalteter Bildschirm"], hint: "Verbindung ist das wichtige Wort.", difficulty: 1 },
      { prompt: "Wofür braucht man ein Login?", answer: "Um Zugang zu einem Konto zu schützen", distractors: ["Um den Bildschirm heller zu machen", "Um das WLAN zu färben", "Um jede Werbung zu stoppen"], hint: "Login und Passwort schützen Zugang.", difficulty: 1 },
      { prompt: "Was ist eine Verschlüsselung einfach gesagt?", answer: "Informationen werden für Fremde unlesbar gemacht", distractors: ["Daten werden lauter vorgelesen", "Bilder werden immer gelöscht", "Dateien werden grösser gedruckt"], hint: "Nur Berechtigte sollen es lesen können.", difficulty: 3 },
      { prompt: "Warum sollte man Geräte sperren?", answer: "Damit andere nicht einfach Daten öffnen", distractors: ["Damit der Akku nie leer wird", "Damit Apps schneller wachsen", "Damit alle Dateien öffentlich sind"], hint: "Sperren schützt, wenn ein Gerät unbeaufsichtigt ist.", difficulty: 2 },
      { prompt: "Was ist ein Backup?", answer: "Eine Sicherungskopie wichtiger Daten", distractors: ["Ein Werbebild", "Ein falsches Passwort", "Ein lauter Ton"], hint: "Backup hilft, wenn etwas verloren geht.", difficulty: 1 },
      { prompt: "Was prüfst du vor einer Datei von Unbekannt?", answer: "Ob Absender und Zweck vertrauenswürdig sind", distractors: ["Ob der Dateiname lustig ist", "Ob sie viele Farben hat", "Ob sie sehr gross klingt"], hint: "Unbekannte Dateien können riskant sein.", difficulty: 2 },
      { prompt: "Welcher Schutz passt, wenn du kurz vom Tablet weggehst?", answer: "Bildschirm sperren", distractors: ["Passwort in den Chat schreiben", "Datei offen lassen", "Alle fremden Links öffnen"], hint: "Sperren schützt bei kurzer Abwesenheit.", difficulty: 1 },
      { prompt: "Was ist ein gutes Backup-Beispiel?", answer: "Eine wichtige Datei zusätzlich sichern", distractors: ["Die Datei nur umbenennen", "Das Passwort kürzer machen", "Den Bildschirm heller stellen"], hint: "Eine Sicherung hilft, wenn etwas verloren geht.", difficulty: 1 },
      { prompt: "Warum ist ein fremdes WLAN manchmal heikel?", answer: "Man weiss nicht sicher, wer mitliest oder es betreibt", distractors: ["Es ist immer schneller", "Es löscht automatisch alle Fehler", "Es macht jedes Login unnötig"], hint: "Verbindungen brauchen Vertrauen.", difficulty: 3 },
    ],
    fills: [
      { prompt: "Ein Netzwerk verbindet mehrere ___.", answer: "Geräte", hint: "Computer, Tablets oder Handys können verbunden sein.", difficulty: 1 },
      { prompt: "Ein Login schützt den ___ zu einem Konto.", answer: "Zugang", hint: "Wer darf hinein?", difficulty: 1 },
      { prompt: "Eine Sicherungskopie nennt man ___.", answer: "Backup", hint: "Englisches Wort, in der Schule oft genutzt.", difficulty: 1 },
      { prompt: "Verschlüsselung macht Daten für Fremde ___.", answer: "unlesbar", hint: "Andere sollen den Inhalt nicht verstehen.", difficulty: 3 },
      { prompt: "Geräte sperren schützt private ___.", answer: "Daten", hint: "Fotos, Nachrichten oder Dokumente.", difficulty: 2 },
      { prompt: "Vor fremden Dateien prüfe ich Absender und ___.", answer: "Zweck", hint: "Warum wurde die Datei geschickt?", difficulty: 1 },
      { prompt: "Ein fremdes WLAN nutze ich nur besonders ___.", answer: "vorsichtig", hint: "Nicht jede Verbindung ist gleich vertrauenswürdig.", difficulty: 3 },
    ],
    pairGroups: [
      { prompt: "Ordne Sicherheitsbegriffe.", pairs: [["Login", "Zugang"], ["Backup", "Sicherung"], ["Netzwerk", "Verbindung"], ["Verschlüsselung", "unlesbar für Fremde"]], hint: "Suche die alltagsnahe Erklärung.", difficulty: 2 },
      { prompt: "Ordne Situation und Schutz.", pairs: [["Tablet liegt herum", "Gerät sperren"], ["Datei gelöscht", "Backup nutzen"], ["Konto öffnen", "Login verwenden"], ["Geheime Nachricht", "verschlüsseln"]], hint: "Welche Schutzidee passt?", difficulty: 2 },
    ],
    sortGroups: [
      { prompt: "Sortiere sichere und riskante Situationen.", zones: [["safe", "Sicherer"], ["risk", "Riskant"]], items: [["sperre", "Bildschirmsperre aktiv", "safe"], ["offen", "Gerät offen liegen lassen", "risk"], ["backup", "Backup erstellt", "safe"], ["fremd", "Datei von Unbekannt öffnen", "risk"]], hint: "Sicherer heisst: Daten sind besser geschützt.", difficulty: 2 },
      { prompt: "Sortiere Netzwerk-Beispiele und Einzelgeräte.", zones: [["network", "Netzwerk"], ["single", "Einzeln"]], items: [["wlan", "Tablet im WLAN", "network"], ["mail", "Mail an Lehrperson", "network"], ["offline", "Taschenrechner ohne Verbindung", "single"], ["papier", "Papierheft", "single"]], hint: "Ein Netzwerk braucht Verbindung.", difficulty: 2 },
    ],
    extraPairGroup: { prompt: "Ordne Alltagsschutz und Wirkung.", pairs: [["Bildschirm sperren", "Zugriff schützen"], ["Backup machen", "Daten sichern"], ["Login nutzen", "Konto schützen"], ["Datei prüfen", "Risiko senken"]], hint: "Jede Massnahme schützt an einer anderen Stelle.", difficulty: 1 },
    extraSortGroup: { prompt: "Sortiere vertrauenswürdige und heikle Verbindungen.", zones: [["trusted", "Eher vertrauenswürdig"], ["careful", "Vorsichtig sein"]], items: [["schule", "Schul-WLAN mit Lehrperson", "trusted"], ["daheim", "WLAN zu Hause", "trusted"], ["offen", "offenes WLAN ohne Namen", "careful"], ["fremd", "Link zu unbekanntem Login", "careful"]], hint: "Bei unbekannten Verbindungen genau prüfen.", difficulty: 3 },
    wordList: ["LOGIN", "BACKUP", "DATEN", "NETZ"],
    reviewPrompt: "Plane drei Schritte, um ein Schul-Tablet besser zu schützen.",
    reviewCriteria: ["Ich nenne Gerätesperre oder Login.", "Ich nenne vorsichtigen Umgang mit Dateien oder Links.", "Ich nenne Backup oder Hilfe durch Erwachsene."],
    extraReviewPrompt: "Erkläre, warum Sperre, Login und Backup zusammen besser schützen als nur eine Massnahme.",
    extraReviewCriteria: ["Ich erkläre mindestens zwei Schutzmassnahmen.", "Ich nenne einen passenden Alltagssfall.", "Ich zeige, dass Schutz an mehreren Stellen hilft."],
    extraReviewDifficulty: 3,
  },
];

export const grade3Mi = plans.filter((plan) => plan.grade === 3).map(buildTopic);
export const grade4Mi = plans.filter((plan) => plan.grade === 4).map(buildTopic);
export const grade5Mi = plans.filter((plan) => plan.grade === 5).map(buildTopic);
export const grade6Mi = plans.filter((plan) => plan.grade === 6).map(buildTopic);
