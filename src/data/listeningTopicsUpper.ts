import type { Exercise, Topic } from "@/types/exercise";

type L = [de: string, en: string, fr: string, it: string];
type Case = [audio: string, answer: string];
type Group = { question: L; cases: [Case, Case, Case, Case, Case] };
type OrderCase = [audio: string, steps: [string, string, string]];

const q = (de: string, en: string, fr: string, it: string): L => [de, en, fr, it];

const hints: Record<1 | 2 | 3, [L, L]> = {
  1: [
    q("Höre auf Namen, Orte, Zeiten und Zahlen.", "Listen for names, places, times and numbers.", "Écoute les noms, les lieux, les heures et les nombres.", "Ascolta nomi, luoghi, orari e numeri."),
    q("Spiele den Hörtext nochmals ab und suche die ausdrücklich genannte Information.", "Play the audio again and find the information stated directly.", "Réécoute et cherche l'information dite clairement.", "Riascolta e cerca l'informazione detta chiaramente."),
  ],
  2: [
    q("Achte auf Begründungen, Reihenfolgen und die Absicht der sprechenden Person.", "Listen for reasons, sequence and the speaker's intention.", "Écoute les raisons, l'ordre et l'intention de la personne qui parle.", "Ascolta i motivi, l'ordine e l'intenzione di chi parla."),
    q("Verbinde die wichtigsten Aussagen miteinander.", "Connect the most important statements.", "Relie les informations les plus importantes.", "Collega le informazioni più importanti."),
  ],
  3: [
    q("Unterscheide Gesagtes, Gemeintes und Schlussfolgerungen.", "Distinguish what is said, meant and inferred.", "Distingue ce qui est dit, voulu et déduit.", "Distingui ciò che viene detto, inteso e dedotto."),
    q("Höre nochmals und prüfe, welche Antwort den ganzen Hörtext treffend zusammenfasst.", "Listen again and check which answer best summarises the whole audio.", "Réécoute et vérifie quelle réponse résume le mieux tout le texte.", "Riascolta e verifica quale risposta riassume meglio tutto il testo."),
  ],
};

function multipleChoice(id: string, difficulty: 1 | 2 | 3, question: L, item: Case, wrong: [string, string, string], free = false): Exercise {
  const [hint1, hint2] = hints[difficulty];
  const choices = [item[1], ...wrong];
  const offset = Number(id.match(/\d+$/u)?.[0] ?? 0) % 4;
  const options = [...choices.slice(offset), ...choices.slice(0, offset)];
  return {
    id,
    type: "multiple-choice",
    difficulty,
    free,
    question: question[0], questionEN: question[1], questionFR: question[2], questionIT: question[3],
    listeningText: item[0], answer: item[1], options,
    hints: [hint1[0], hint2[0]], hintsEN: [hint1[1], hint2[1]], hintsFR: [hint1[2], hint2[2]], hintsIT: [hint1[3], hint2[3]],
    preserveGermanContent: true,
  };
}

function ordering(id: string, difficulty: 2, item: OrderCase): Exercise {
  const [hint1, hint2] = hints[difficulty];
  const dragItems = item[1].map((label, index) => ({ id: `${id}-i${index + 1}`, label }));
  const dropZones = item[1].map((_, index) => ({ id: `${id}-z${index + 1}`, label: `${index + 1}.` }));
  return {
    id, type: "drag-drop", difficulty,
    question: "Bringe die gehörten Schritte in die richtige Reihenfolge.",
    questionEN: "Put the steps you heard in the correct order.",
    questionFR: "Mets les étapes entendues dans le bon ordre.",
    questionIT: "Metti i passaggi ascoltati nell'ordine corretto.",
    listeningText: item[0], answer: "all", dragItems, dropZones,
    dropAnswers: Object.fromEntries(dragItems.map((dragItem, index) => [dragItem.id, dropZones[index].id])),
    hints: [hint1[0], hint2[0]], hintsEN: [hint1[1], hint2[1]], hintsFR: [hint1[2], hint2[2]], hintsIT: [hint1[3], hint2[3]],
    preserveGermanContent: true,
  };
}

function flattenGroups(grade: number, start: number, difficulty: 1 | 2 | 3, groups: [Group, Group, Group]): Exercise[] {
  const exercises: Exercise[] = [];
  for (const group of groups) {
    group.cases.forEach((item, index) => {
      const otherAnswers = group.cases.filter((_, otherIndex) => otherIndex !== index).map(candidate => candidate[1]);
      exercises.push(multipleChoice(`g${grade}hoer${start + exercises.length}`, difficulty, group.question, item, otherAnswers.slice(0, 3) as [string, string, string], start + exercises.length <= 3));
    });
  }
  return exercises;
}

function makeTopic(grade: 3 | 4 | 5 | 6, id: string, title: string, easy: [Group, Group, Group], medium: [Group, Group, Group], hard: [Group, Group, Group], orders: [OrderCase, OrderCase, OrderCase, OrderCase, OrderCase]): Topic {
  return {
    id, title, emoji: "🎧",
    exercises: [
      ...flattenGroups(grade, 1, 1, easy),
      ...flattenGroups(grade, 16, 2, medium),
      ...orders.map((item, index) => ordering(`g${grade}hoer${31 + index}`, 2, item)),
      ...flattenGroups(grade, 36, 3, hard),
    ],
  };
}

const where = q("Wo findet die Handlung statt?", "Where does the event take place?", "Où se passe la scène ?", "Dove si svolge la scena?");
const detail = q("Welche Information wird im Hörtext genannt?", "Which information is stated in the audio?", "Quelle information est donnée dans le texte audio ?", "Quale informazione viene detta nel testo audio?");
const instruction = q("Was soll als Nächstes getan werden?", "What should be done next?", "Que faut-il faire ensuite ?", "Cosa bisogna fare dopo?");
const reason = q("Welche Begründung passt zum Hörtext?", "Which reason matches the audio?", "Quelle raison correspond au texte audio ?", "Quale motivo corrisponde al testo audio?");
const result = q("Was geschieht als Folge davon?", "What happens as a result?", "Que se passe-t-il ensuite ?", "Cosa succede di conseguenza?");
const intention = q("Was möchte die sprechende Person erreichen?", "What does the speaker want to achieve?", "Que veut obtenir la personne qui parle ?", "Cosa vuole ottenere chi parla?");
const inference = q("Welche Schlussfolgerung passt am besten?", "Which conclusion fits best?", "Quelle conclusion convient le mieux ?", "Quale conclusione è più adatta?");
const mainIdea = q("Was ist die Hauptaussage des Hörtexts?", "What is the main idea of the audio?", "Quelle est l'idée principale du texte audio ?", "Qual è l'idea principale del testo audio?");
const attitude = q("Welche Haltung wird im Hörtext deutlich?", "Which attitude is expressed in the audio?", "Quelle attitude ressort du texte audio ?", "Quale atteggiamento emerge dal testo audio?");

const grade3Easy: [Group, Group, Group] = [
  { question: where, cases: [
    ["In der Bibliothek sucht Nina im Regal ein Buch über Füchse.", "in der Bibliothek"],
    ["Am Bahnhof wartet Amir unter der grossen Uhr auf den Zug.", "am Bahnhof"],
    ["Auf dem Pausenplatz übt Lio mit Freunden einen neuen Balltrick.", "auf dem Pausenplatz"],
    ["Im Hallenbad legt Sara ihre Schwimmbrille auf die Bank.", "im Hallenbad"],
    ["Auf dem Wochenmarkt kauft Mia drei rote Äpfel.", "auf dem Wochenmarkt"],
  ] },
  { question: detail, cases: [
    ["Der Bastelkurs beginnt am Dienstag um vier Uhr und dauert eine Stunde.", "Der Kurs beginnt am Dienstag."],
    ["Für den Ausflug braucht die Klasse einen Rucksack, Wasser und feste Schuhe.", "Feste Schuhe werden benötigt."],
    ["Noah leiht zwei Bücher aus und muss sie in drei Wochen zurückbringen.", "Die Bücher sind in drei Wochen fällig."],
    ["Das Fussballspiel endet mit drei zu zwei Toren für die blaue Mannschaft.", "Die blaue Mannschaft gewinnt."],
    ["Oma kommt mit dem Bus um Viertel nach fünf an.", "Oma kommt um Viertel nach fünf."],
  ] },
  { question: instruction, cases: [
    ["Schreibe zuerst deinen Namen auf das Blatt. Lies danach die erste Aufgabe.", "die erste Aufgabe lesen"],
    ["Stelle das Glas unter den Messbecher und giesse dann langsam das Wasser ein.", "das Wasser langsam eingiessen"],
    ["Öffne die Karte. Suche den Bahnhof und markiere danach den Weg zur Schule.", "den Weg zur Schule markieren"],
    ["Zieh die nassen Schuhe aus und stelle sie anschliessend auf die Matte.", "die Schuhe auf die Matte stellen"],
    ["Kontrolliere die Rechnung. Trage das Ergebnis danach in die Tabelle ein.", "das Ergebnis in die Tabelle eintragen"],
  ] },
];

const grade3Medium: [Group, Group, Group] = [
  { question: reason, cases: [
    ["Mia fährt heute mit dem Bus, weil an ihrem Velo die Kette abgesprungen ist.", "Die Velokette ist abgesprungen."],
    ["Ben bringt eine Taschenlampe mit, denn der Weg führt durch einen dunklen Tunnel.", "Der Weg führt durch einen dunklen Tunnel."],
    ["Nora verschiebt das Picknick, weil für den Nachmittag starker Regen angekündigt ist.", "Es ist starker Regen angekündigt."],
    ["Lio spricht leise, damit er das schlafende Baby nicht weckt.", "Das Baby soll nicht aufwachen."],
    ["Sara liest die Anleitung nochmals, weil beim ersten Versuch ein Teil übrig blieb.", "Beim ersten Versuch blieb ein Teil übrig."],
  ] },
  { question: result, cases: [
    ["Der Wind wird stärker. Amir schliesst das Fenster, bevor die Blätter hereinfliegen.", "Das Fenster wird geschlossen."],
    ["Nina teilt die Aufgaben gerecht auf. Dadurch ist die Gruppe schneller fertig.", "Die Gruppe beendet die Arbeit schneller."],
    ["Der Bus hat Verspätung. Deshalb erreicht Tom den Beginn des Trainings nicht.", "Tom verpasst den Trainingsbeginn."],
    ["Mia giesst die Pflanze regelmässig. Nach einigen Tagen richtet sie sich wieder auf.", "Die Pflanze erholt sich."],
    ["Ben vergisst den Deckel auf der Trinkflasche. Im Rucksack wird das Heft nass.", "Das Heft wird nass."],
  ] },
  { question: intention, cases: [
    ["Bitte wartet mit euren Fragen, bis ich die ganze Spielregel erklärt habe.", "Die Erklärung soll nicht unterbrochen werden."],
    ["Könntest du die Musik etwas leiser stellen? Ich möchte mich auf die Aufgabe konzentrieren.", "Die Musik soll leiser werden."],
    ["Vergiss nicht, morgen deine unterschriebene Erlaubnis mitzubringen.", "An die Erlaubnis erinnern"],
    ["Lass uns beide Vorschläge aufschreiben und danach gemeinsam abstimmen.", "Eine faire Entscheidung treffen"],
    ["Schau zuerst selbst im Wörterbuch nach, bevor du mich nach der Bedeutung fragst.", "Selbstständiges Nachschlagen fördern"],
  ] },
];

const grade3Hard: [Group, Group, Group] = [
  { question: inference, cases: [
    ["Als Lea den Stall betritt, scharren die Ponys mit den Hufen und kommen zum Futtertrog.", "Die Ponys erwarten Futter."],
    ["Vor dem Haus liegen nasse Schirme, und aus dem Flur hört man viele Kinder lachen.", "Im Haus sind mehrere Gäste."],
    ["Nora betrachtet den Fahrplan, schaut auf die Uhr und beginnt plötzlich zu rennen.", "Ihr Verkehrsmittel fährt bald ab."],
    ["Ben trägt Handschuhe, und bei jedem Atemzug sieht man eine kleine Wolke.", "Draussen ist es kalt."],
    ["Im Klassenzimmer stehen alle Stühle auf den Tischen, und der Boden glänzt noch feucht.", "Der Boden wurde gerade gereinigt."],
  ] },
  { question: mainIdea, cases: [
    ["Eine Gruppe sammelt Abfall am Bach. Danach sortiert sie Glas, Metall und Plastik und entsorgt alles richtig.", "Die Gruppe schützt die Umwelt durch Aufräumen und Sortieren."],
    ["Mia übt jeden Tag zehn Minuten Flöte. Anfangs quietschen die Töne, doch nach einer Woche klingt das Lied deutlich besser.", "Regelmässiges Üben führt zu Fortschritt."],
    ["Zwei Kinder wollen denselben Ball. Sie vereinbaren, jeweils zehn Minuten damit zu spielen.", "Ein Kompromiss löst den Streit."],
    ["Die Klasse vergleicht drei Wege zur Schule und wählt den mit dem sicheren Fussgängerstreifen.", "Sicherheit ist bei der Wegwahl wichtig."],
    ["Amir liest verschiedene Tierbücher und notiert Gemeinsamkeiten von Wolf und Hund.", "Amir sammelt und vergleicht Informationen."],
  ] },
  { question: attitude, cases: [
    ["Ich war zuerst unsicher, aber jetzt freue ich mich darauf, vor der Klasse vorzulesen.", "Die Person ist inzwischen zuversichtlich."],
    ["Schon wieder liegt Müll auf dem Spielplatz. Das finde ich wirklich schade.", "Die Person ist enttäuscht."],
    ["Danke, dass du mir beim Tragen geholfen hast. Allein wäre es schwierig gewesen.", "Die Person ist dankbar."],
    ["Vielleicht klappt mein Modell beim nächsten Versuch. Ich probiere eine andere Lösung.", "Die Person bleibt hartnäckig."],
    ["Ich möchte erst alle Seiten hören, bevor wir jemanden beschuldigen.", "Die Person urteilt vorsichtig und fair."],
  ] },
];

const grade3Orders: [OrderCase, OrderCase, OrderCase, OrderCase, OrderCase] = [
  ["Zuerst faltet Mia das Papier. Dann schneidet sie eine Form aus. Zum Schluss klebt sie die Form auf die Karte.", ["Mia faltet das Papier.", "Mia schneidet eine Form aus.", "Mia klebt die Form auf."]],
  ["Ben liest den Fahrplan. Danach kauft er ein Billett. Schliesslich geht er zum richtigen Gleis.", ["Ben liest den Fahrplan.", "Ben kauft ein Billett.", "Ben geht zum Gleis."]],
  ["Die Klasse sammelt Blätter. Danach sortiert sie diese nach Form. Am Ende beschriftet sie die Gruppen.", ["Blätter sammeln", "Blätter sortieren", "Gruppen beschriften"]],
  ["Nora wäscht den Apfel. Dann schneidet sie ihn in Stücke. Zuletzt legt sie die Stücke in eine Schale.", ["Apfel waschen", "Apfel schneiden", "Stücke in die Schale legen"]],
  ["Amir prüft die Rechnung. Er verbessert einen Fehler. Danach trägt er das Ergebnis ein.", ["Rechnung prüfen", "Fehler verbessern", "Ergebnis eintragen"]],
];

const grade4Easy: [Group, Group, Group] = [
  { question: where, cases: [
    ["Im Naturmuseum zeichnet Lio das Skelett eines Dinosauriers ab.", "im Naturmuseum"],
    ["Auf dem Gemeindeplatz erklärt die Feuerwehr ihre neue Drehleiter.", "auf dem Gemeindeplatz"],
    ["In der Schulküche wiegt Nora Mehl für das Brot ab.", "in der Schulküche"],
    ["Am Waldrand beobachtet Ben mit dem Feldstecher einen Specht.", "am Waldrand"],
    ["Im Radiostudio spricht Mia ihren kurzen Wetterbericht ein.", "im Radiostudio"],
  ] },
  { question: detail, cases: [
    ["Der Vortrag beginnt um zehn Uhr im Zimmer zwölf und dauert fünfundvierzig Minuten.", "Der Vortrag dauert fünfundvierzig Minuten."],
    ["Für das Experiment werden zwei Gläser, warmes Wasser und ein Löffel Salz gebraucht.", "Für das Experiment braucht es Salz."],
    ["Die Wandergruppe legt nach sechs Kilometern bei der Hütte eine Pause ein.", "Die Pause findet bei der Hütte statt."],
    ["Das Paket wiegt ein Kilogramm und wird am Freitag geliefert.", "Das Paket wird am Freitag geliefert."],
    ["Im Schülerparlament stimmen zwölf Kinder dafür und acht dagegen.", "Zwölf Kinder stimmen dafür."],
  ] },
  { question: instruction, cases: [
    ["Lies den Abschnitt. Unterstreiche danach zwei Schlüsselwörter und formuliere eine Überschrift.", "eine Überschrift formulieren"],
    ["Miss zuerst die Länge. Runde das Ergebnis anschliessend auf ganze Zentimeter.", "das Ergebnis runden"],
    ["Öffne die Datei, ergänze deinen Namen und speichere sie danach im Klassenordner.", "die Datei im Klassenordner speichern"],
    ["Betrachte die Karte. Suche den höchsten Punkt und übertrage seine Höhe in die Tabelle.", "die Höhe in die Tabelle übertragen"],
    ["Mische die Lösung vorsichtig. Notiere anschliessend, ob sich die Farbe verändert.", "die Farbveränderung notieren"],
  ] },
];

const grade4Medium: [Group, Group, Group] = [
  { question: reason, cases: [
    ["Die Klasse führt das Experiment nochmals durch, weil beim ersten Mal die Wassermenge nicht gemessen wurde.", "Die Wassermenge war nicht gemessen worden."],
    ["Mia nimmt den längeren Heimweg, denn die Unterführung ist wegen Bauarbeiten geschlossen.", "Die Unterführung ist geschlossen."],
    ["Ben prüft zwei Quellen, weil die Angaben zur Tiergrösse unterschiedlich sind.", "Die Quellen enthalten unterschiedliche Angaben."],
    ["Nora setzt Kopfhörer auf, damit sie den Hörtext ohne Nebengeräusche verstehen kann.", "Sie möchte störende Geräusche vermeiden."],
    ["Die Gruppe vereinfacht ihr Plakat, weil die vielen kleinen Texte aus der Entfernung unlesbar sind.", "Das Plakat ist aus der Entfernung schlecht lesbar."],
  ] },
  { question: result, cases: [
    ["Amir ordnet seine Notizen nach Themen. Dadurch findet er die passende Information schneller.", "Er findet Informationen schneller."],
    ["Die Temperatur fällt über Nacht unter null Grad. Am Morgen ist die Pfütze gefroren.", "Die Pfütze wird zu Eis."],
    ["Die Klasse reduziert den Papierverbrauch. Am Monatsende ist der Altpapierstapel deutlich kleiner.", "Es fällt weniger Altpapier an."],
    ["Nina spricht bei der Präsentation langsamer. Nun können die Zuhörenden besser folgen.", "Die Präsentation wird verständlicher."],
    ["Der Bach führt nach dem starken Regen mehr Wasser. Der schmale Weg am Ufer wird überschwemmt.", "Der Uferweg steht unter Wasser."],
  ] },
  { question: intention, cases: [
    ["Ich fasse zuerst zusammen, was wir bereits wissen, damit wir nicht dieselben Ideen wiederholen.", "Die Gruppenarbeit effizienter machen"],
    ["Bitte nennt bei jeder Behauptung auch die Quelle, aus der eure Information stammt.", "Aussagen überprüfbar machen"],
    ["Lasst uns die Aufgaben nach Stärken verteilen, damit jede Person etwas beitragen kann.", "Alle sinnvoll beteiligen"],
    ["Ich zeichne den Ablauf an die Tafel, damit niemand einen Schritt vergisst.", "Den Ablauf übersichtlich zeigen"],
    ["Wir testen beide Modelle unter denselben Bedingungen, sonst ist der Vergleich unfair.", "Einen fairen Vergleich ermöglichen"],
  ] },
];

const grade4Hard: [Group, Group, Group] = [
  { question: inference, cases: [
    ["Der Museumsführer bittet die Gruppe, nicht mehr zu blitzen. Einige Farben der alten Bilder reagieren empfindlich auf starkes Licht.", "Die Bilder sollen vor Schäden geschützt werden."],
    ["Obwohl die Sonne scheint, bleibt der obere Wanderweg gesperrt. In der Nacht hat es dort stark geschneit.", "In der Höhe besteht noch eine Gefahr durch Schnee."],
    ["Nina vergleicht die Messwerte und streicht einen Wert, der zehnmal grösser als alle anderen ist.", "Der gestrichene Wert ist wahrscheinlich ein Messfehler."],
    ["Amir liest die Überschrift, betrachtet das Diagramm und sagt: Der Text will uns wohl zum Wassersparen bewegen.", "Der Text verfolgt eine überzeugende Absicht."],
    ["Die Vögel sammeln sich auf den Dächern und ziehen in grossen Gruppen Richtung Süden.", "Die Zugvögel bereiten sich auf den Winter vor."],
  ] },
  { question: mainIdea, cases: [
    ["Ein Dorf ersetzt alte Lampen durch sparsame Leuchten. Der Stromverbrauch sinkt, obwohl gleich viele Strassen beleuchtet werden.", "Effiziente Technik kann Energie sparen."],
    ["Kinder befragen ältere Menschen zur Schulzeit früher, vergleichen die Antworten und halten Unterschiede fest.", "Zeitzeugen helfen, Veränderungen zu verstehen."],
    ["Eine Gruppe misst an drei Orten die Temperatur. Im Schatten ist es deutlich kühler als auf Asphalt in der Sonne.", "Der Untergrund und Schatten beeinflussen die Temperatur."],
    ["Die Klasse diskutiert Regeln, stimmt darüber ab und überprüft nach einem Monat, ob sie funktionieren.", "Gemeinsame Regeln können demokratisch entwickelt werden."],
    ["Nora liest den Artikel ganz, bevor sie die auffällige Überschrift beurteilt. Im Text klingt die Aussage viel weniger dramatisch.", "Eine Überschrift allein kann irreführen."],
  ] },
  { question: attitude, cases: [
    ["Die neue Regel ist nicht perfekt, aber sie berücksichtigt mehr Kinder als die alte. Deshalb unterstütze ich sie.", "Die Person wägt Vor- und Nachteile ab."],
    ["Ich glaube die Zahl erst, wenn ich weiss, wer sie gemessen hat und wie.", "Die Person prüft Informationen kritisch."],
    ["Unser erster Versuch ist misslungen. Das zeigt uns immerhin, was wir verändern müssen.", "Die Person sieht Fehler als Lernchance."],
    ["Auch wenn meine Idee nicht gewählt wurde, helfe ich bei der gemeinsamen Lösung mit.", "Die Person akzeptiert den Gruppenentscheid."],
    ["Wir sollten erst die betroffene Person fragen, statt über sie zu vermuten.", "Die Person möchte fair und direkt klären."],
  ] },
];

const grade4Orders: [OrderCase, OrderCase, OrderCase, OrderCase, OrderCase] = [
  ["Zuerst formuliert die Gruppe eine Frage. Dann führt sie die Messung durch. Zum Schluss wertet sie die Ergebnisse aus.", ["Frage formulieren", "Messung durchführen", "Ergebnisse auswerten"]],
  ["Nora recherchiert in zwei Quellen. Danach vergleicht sie die Angaben. Schliesslich schreibt sie eine Zusammenfassung.", ["In Quellen recherchieren", "Angaben vergleichen", "Zusammenfassung schreiben"]],
  ["Ben skizziert sein Modell. Dann baut er einen Prototyp. Nach dem Test verbessert er die schwache Stelle.", ["Modell skizzieren", "Prototyp bauen", "Schwache Stelle verbessern"]],
  ["Die Klasse sammelt Vorschläge. Danach diskutiert sie deren Vor- und Nachteile. Am Ende stimmt sie ab.", ["Vorschläge sammeln", "Vor- und Nachteile diskutieren", "Abstimmen"]],
  ["Mia liest das Diagramm. Sie beschreibt den höchsten Wert. Danach erklärt sie einen möglichen Grund.", ["Diagramm lesen", "Höchsten Wert beschreiben", "Möglichen Grund erklären"]],
];

const grade5Easy: [Group, Group, Group] = [
  { question: where, cases: [
    ["Im Gemeindehaus präsentiert die Jugendgruppe ihre Idee für einen neuen Treffpunkt.", "im Gemeindehaus"],
    ["In der Wetterstation kontrolliert Ben die aufgezeichneten Niederschlagsmengen.", "in der Wetterstation"],
    ["Auf dem Recyclinghof erklärt eine Mitarbeiterin die Trennung von Aluminium und Stahl.", "auf dem Recyclinghof"],
    ["Im Theater probt Nora mit der Klasse die letzte Szene des Stücks.", "im Theater"],
    ["Auf dem Forschungsschiff untersucht Amir eine Wasserprobe aus dem See.", "auf einem Forschungsschiff"],
  ] },
  { question: detail, cases: [
    ["Die Umfrage umfasst hundertzwanzig Personen. Davon fahren siebenundvierzig regelmässig mit dem Velo.", "47 Personen fahren regelmässig Velo."],
    ["Der Informationsabend findet am 14. September um 19 Uhr in der Aula statt.", "Der Anlass beginnt um 19 Uhr."],
    ["Das Solarmodul erzeugte im Juni mehr Strom als im Mai, obwohl es an weniger Tagen sonnig war.", "Im Juni wurde mehr Strom erzeugt."],
    ["Für den Wettbewerb müssen Beiträge höchstens drei Minuten lang sein und bis Freitag eingereicht werden.", "Die Beiträge müssen bis Freitag eingereicht werden."],
    ["Der Zug hält wegen Bauarbeiten nicht in Olten, sondern fährt direkt bis Bern.", "Der Halt in Olten entfällt."],
  ] },
  { question: instruction, cases: [
    ["Notiere die Behauptung. Suche danach zwei Belege und kennzeichne, aus welcher Quelle sie stammen.", "die Quellen der Belege kennzeichnen"],
    ["Vergleiche beide Diagramme. Beschreibe anschliessend eine Gemeinsamkeit und einen Unterschied.", "Gemeinsamkeit und Unterschied beschreiben"],
    ["Höre das Interview einmal ganz. Beim zweiten Hören notierst du die wichtigsten Argumente.", "die wichtigsten Argumente notieren"],
    ["Prüfe zuerst das Veröffentlichungsdatum und danach, wer für den Text verantwortlich ist.", "die verantwortliche Person oder Organisation prüfen"],
    ["Formuliere deine Vermutung. Plane dann einen Versuch, mit dem du sie überprüfen kannst.", "einen passenden Versuch planen"],
  ] },
];

const grade5Medium: [Group, Group, Group] = [
  { question: reason, cases: [
    ["Die Gemeinde testet den neuen Veloweg zunächst während drei Monaten, weil noch unklar ist, wie stark er genutzt wird.", "Die tatsächliche Nutzung ist noch unbekannt."],
    ["Nora verwirft eine Internetquelle, weil weder Autor noch Veröffentlichungsdatum angegeben sind.", "Wichtige Angaben zur Quelle fehlen."],
    ["Das Team ändert nur eine Bedingung im Versuch, damit die Wirkung eindeutig zugeordnet werden kann.", "Die Ursache soll eindeutig erkennbar sein."],
    ["Amir ergänzt sein Referat mit einem Beispiel, weil der Fachbegriff allein schwer verständlich ist.", "Das Beispiel soll den Begriff verständlicher machen."],
    ["Die Klasse befragt verschiedene Altersgruppen, damit die Umfrage nicht nur eine Sichtweise zeigt.", "Die Umfrage soll mehrere Perspektiven enthalten."],
  ] },
  { question: result, cases: [
    ["Die Zeitung korrigiert eine falsche Zahl gut sichtbar. Dadurch können Lesende die Änderung nachvollziehen.", "Die Korrektur wird transparent."],
    ["Der Schulrat verschiebt den Unterrichtsbeginn um zehn Minuten. Danach kommen deutlich weniger Kinder zu spät.", "Die Zahl der Verspätungen sinkt."],
    ["Das Team komprimiert die grossen Bilder. Nun lädt die Webseite auch bei langsamer Verbindung schneller.", "Die Ladezeit der Webseite wird kürzer."],
    ["Die Klasse verwendet Mehrwegbecher statt Einwegbecher. Nach dem Fest bleibt weniger Abfall zurück.", "Die Abfallmenge nimmt ab."],
    ["Nina prüft ihre Zusammenfassung am Originaltext und ergänzt einen ausgelassenen Hauptpunkt.", "Die Zusammenfassung wird vollständiger."],
  ] },
  { question: intention, cases: [
    ["Der Beitrag nennt zuerst ein Problem, zeigt danach Folgen und endet mit drei konkreten Handlungsvorschlägen.", "Zum Handeln anregen"],
    ["Die Sprecherin verwendet genaue Zahlen und nennt die Studie, aus der sie stammen.", "Ihre Aussage glaubwürdig belegen"],
    ["Im Interview fragt der Moderator nach, was mit dem unklaren Ausdruck genau gemeint ist.", "Eine Aussage präzisieren lassen"],
    ["Der Autor stellt zwei Positionen gegenüber, ohne eine davon sofort zu bewerten.", "Einen ausgewogenen Überblick geben"],
    ["Die Werbung wiederholt mehrmals, dass das Angebot nur heute gilt.", "Zeitdruck erzeugen"],
  ] },
];

const grade5Hard: [Group, Group, Group] = [
  { question: inference, cases: [
    ["Die Studie befragte nur zwanzig Mitglieder eines Sportvereins. Trotzdem behauptet der Bericht, alle Jugendlichen bewegten sich genug.", "Die Schlussfolgerung ist zu allgemein."],
    ["Der Podcast nennt ein Produkt hervorragend, erwähnt aber erst am Ende leise, dass der Hersteller die Folge bezahlt hat.", "Die Empfehlung könnte durch Werbung beeinflusst sein."],
    ["In beiden Jahren wurden mehr Velos gezählt. Im zweiten Jahr dauerte die Messung jedoch doppelt so lange.", "Die Rohzahlen sind nicht direkt vergleichbar."],
    ["Die Sprecherin sagt, der Park sei immer leer. Gleichzeitig berichtet sie von einem gut besuchten Fest am Wochenende.", "Ihre Aussagen widersprechen sich."],
    ["Der Artikel beruft sich auf eine Untersuchung, verlinkt aber weder den Titel noch die verantwortliche Institution.", "Die Behauptung lässt sich schwer überprüfen."],
  ] },
  { question: mainIdea, cases: [
    ["Eine Stadt pflanzt Bäume entlang heisser Strassen. Messungen zeigen später tiefere Temperaturen im Schatten und angenehmere Wege.", "Bäume können städtische Hitze mindern."],
    ["Ein Klassenrat sammelt Konflikte, hört alle Beteiligten an und vereinbart überprüfbare Lösungen.", "Strukturierte Gespräche helfen bei Konflikten."],
    ["Ein Bericht erklärt Chancen digitaler Geräte, nennt aber auch Ablenkung und Datenschutz als Risiken.", "Digitale Geräte haben Nutzen und Risiken."],
    ["Forschende markieren Zugvögel und vergleichen ihre Routen über mehrere Jahre.", "Langzeitbeobachtungen zeigen Veränderungen bei Zugrouten."],
    ["Ein Dorf repariert alte Gegenstände in einer Werkstatt, statt sie wegzuwerfen und neu zu kaufen.", "Reparieren schont Ressourcen."],
  ] },
  { question: attitude, cases: [
    ["Die Idee klingt interessant, doch bevor wir Geld ausgeben, sollten wir Kosten und Nutzen genauer prüfen.", "kritisch, aber offen"],
    ["Natürlich löst eine einzige Aktion nicht alles. Trotzdem ist sie ein sinnvoller Anfang.", "realistisch und ermutigend"],
    ["Wer anderer Meinung ist, hat den Text offenbar nicht verstanden.", "abwertend gegenüber anderen Meinungen"],
    ["Ich habe meine Position geändert, weil die neuen Messwerte meiner ersten Annahme widersprechen.", "bereit, die Meinung aufgrund von Belegen zu ändern"],
    ["Wir wissen noch zu wenig für ein sicheres Urteil und sollten weitere Daten sammeln.", "vorsichtig und forschungsorientiert"],
  ] },
];

const grade5Orders: [OrderCase, OrderCase, OrderCase, OrderCase, OrderCase] = [
  ["Zuerst formuliert Nina eine Suchfrage. Danach bewertet sie mehrere Quellen. Zum Schluss fasst sie die verlässlichen Informationen zusammen.", ["Suchfrage formulieren", "Quellen bewerten", "Informationen zusammenfassen"]],
  ["Die Gruppe stellt eine Vermutung auf. Dann führt sie einen kontrollierten Versuch durch. Anschliessend vergleicht sie Ergebnis und Vermutung.", ["Vermutung aufstellen", "Versuch durchführen", "Ergebnis vergleichen"]],
  ["Amir hört das Interview vollständig. Beim zweiten Hören notiert er Argumente. Danach ordnet er sie nach Pro und Contra.", ["Interview ganz hören", "Argumente notieren", "Pro und Contra ordnen"]],
  ["Die Klasse sammelt Umfragedaten. Sie stellt diese in einem Diagramm dar. Zum Schluss interpretiert sie auffällige Werte.", ["Daten sammeln", "Diagramm erstellen", "Auffällige Werte interpretieren"]],
  ["Nora entwirft ihren Vortrag. Danach probt sie mit einer Stoppuhr. Schliesslich kürzt sie einen zu langen Abschnitt.", ["Vortrag entwerfen", "Dauer beim Proben messen", "Zu langen Abschnitt kürzen"]],
];

const grade6Easy: [Group, Group, Group] = [
  { question: where, cases: [
    ["Im Kantonsrat verfolgen die Schülerinnen und Schüler eine Debatte über den öffentlichen Verkehr.", "im Kantonsrat"],
    ["In einem Tonstudio nimmt die Klasse eine Folge ihres Wissenschaftspodcasts auf.", "in einem Tonstudio"],
    ["Auf einer archäologischen Grabung dokumentiert Amir die Lage gefundener Scherben.", "auf einer archäologischen Grabung"],
    ["Im Wasserlabor untersucht Nora Proben aus drei verschiedenen Bächen.", "in einem Wasserlabor"],
    ["An einer Medienkonferenz beantwortet die Projektleiterin Fragen zum neuen Schulhaus.", "an einer Medienkonferenz"],
  ] },
  { question: detail, cases: [
    ["Die Abstimmung endet mit 58 Prozent Ja-Stimmen bei einer Beteiligung von 42 Prozent.", "58 Prozent stimmen Ja."],
    ["Der Bericht vergleicht Daten von 2019 bis 2025 und berücksichtigt sechs Gemeinden.", "Sechs Gemeinden werden verglichen."],
    ["Die neue Buslinie fährt werktags alle fünfzehn Minuten, am Sonntag jedoch nur jede halbe Stunde.", "Sonntags fährt der Bus jede halbe Stunde."],
    ["Von den drei getesteten Materialien hält Holz die Wärme am längsten, Metall am kürzesten.", "Holz hält die Wärme am längsten."],
    ["Die Autorin veröffentlicht den Artikel unter ihrem Namen und verlinkt alle verwendeten Statistiken.", "Die verwendeten Statistiken sind verlinkt."],
  ] },
  { question: instruction, cases: [
    ["Notiere die zentrale These. Ordne danach jedes Argument danach, ob es die These stützt oder ihr widerspricht.", "Argumente nach ihrer Funktion ordnen"],
    ["Prüfe die Grafik zuerst auf Achsen und Einheit. Vergleiche anschliessend die dargestellten Zeiträume.", "die dargestellten Zeiträume vergleichen"],
    ["Höre beide Aussagen. Markiere danach, wo Fakten genannt und wo Bewertungen geäussert werden.", "Fakten und Bewertungen unterscheiden"],
    ["Recherchiere die ursprüngliche Quelle. Kontrolliere dann, ob das Zitat vollständig wiedergegeben wurde.", "die Vollständigkeit des Zitats prüfen"],
    ["Formuliere ein Gegenargument und antworte darauf mit einem passenden Beleg.", "das Gegenargument mit einem Beleg beantworten"],
  ] },
];

const grade6Medium: [Group, Group, Group] = [
  { question: reason, cases: [
    ["Das Forschungsteam veröffentlicht auch negative Ergebnisse, weil sonst ein verzerrtes Bild der Versuche entstehen würde.", "Alle Ergebnisse sollen berücksichtigt werden."],
    ["Der Gemeinderat lässt die Planung überarbeiten, da die erste Variante keinen sicheren Schulweg vorsieht.", "Die erste Variante berücksichtigt die Sicherheit nicht genug."],
    ["Nina zitiert die Originalstudie statt eines kurzen Social-Media-Beitrags, weil dort Methode und Daten erklärt werden.", "Die Originalstudie liefert überprüfbaren Kontext."],
    ["Die Redaktion trennt Kommentar und Nachricht klar, damit Meinung nicht als Tatsache erscheint.", "Meinung und Information sollen unterscheidbar bleiben."],
    ["Amir passt die Skala seines Diagramms an, weil die alte Darstellung kleine Unterschiede übertrieben gross wirken liess.", "Die Darstellung soll Unterschiede nicht verzerren."],
  ] },
  { question: result, cases: [
    ["Die Plattform kennzeichnet bezahlte Beiträge deutlich. Nutzende erkennen nun leichter, welche Inhalte Werbung sind.", "Werbung wird transparenter."],
    ["Die Gemeinde veröffentlicht Rohdaten und Berechnungsmethode. Andere können das Resultat nun nachprüfen.", "Das Resultat wird überprüfbar."],
    ["Die Klasse anonymisiert die Umfrageantworten. Dadurch äussern mehr Teilnehmende auch kritische Meinungen.", "Die Antworten werden offener."],
    ["Das Team ergänzt eine Kontrollgruppe. Erst jetzt lässt sich die beobachtete Wirkung sinnvoll vergleichen.", "Die Aussagekraft des Versuchs steigt."],
    ["Die Moderatorin fasst beide Positionen neutral zusammen. Die anschliessende Diskussion bleibt sachlicher.", "Die Diskussion wird sachlicher."],
  ] },
  { question: intention, cases: [
    ["Der Redner beginnt mit einer persönlichen Geschichte und verbindet sie danach mit statistischen Daten.", "Interesse wecken und die Aussage belegen"],
    ["Die Autorin verwendet Wörter wie angeblich und fragwürdig, bevor sie die Gegenposition überhaupt erklärt.", "Zweifel an der Gegenposition erzeugen"],
    ["Der Podcast nennt am Ende mehrere weiterführende Quellen mit unterschiedlichen Standpunkten.", "Eigenständige Vertiefung ermöglichen"],
    ["Die Kampagne zeigt dramatische Bilder und fordert unmittelbar zu einer Spende auf.", "Gefühle auslösen und zu einer Spende bewegen"],
    ["Der Bericht erklärt zuerst die Methode, bevor er Zahlen und Schlussfolgerungen präsentiert.", "Die Entstehung der Ergebnisse nachvollziehbar machen"],
  ] },
];

const grade6Hard: [Group, Group, Group] = [
  { question: inference, cases: [
    ["Eine Befragung auf der Website eines Veloverbands ergibt grosse Zustimmung zu mehr Velowegen. Andere Bevölkerungsgruppen wurden nicht gezielt erreicht.", "Die Stichprobe könnte einseitig sein."],
    ["Die Grafik beginnt auf der senkrechten Achse bei 98 statt bei null. Ein kleiner Unterschied wirkt dadurch sehr gross.", "Die Darstellung übertreibt den Unterschied optisch."],
    ["Ein Artikel spricht von Fachleuten, nennt aber weder Namen noch Institutionen oder Studien.", "Die Berufung auf Fachleute ist nicht überprüfbar."],
    ["Die Sprecherin erklärt, es gebe nur zwei Möglichkeiten, obwohl in der Diskussion mehrere Zwischenlösungen genannt wurden.", "Sie stellt eine falsche Entweder-oder-Wahl dar."],
    ["Der Bericht vergleicht absolute Fallzahlen zweier Kantone, erwähnt jedoch ihre stark unterschiedliche Einwohnerzahl nicht.", "Für einen fairen Vergleich fehlen relative Werte."],
  ] },
  { question: mainIdea, cases: [
    ["Der Beitrag zeigt, wie Algorithmen Inhalte auswählen, welche Vorteile personalisierte Vorschläge haben und wie dadurch Filterblasen entstehen können.", "Personalisierung bietet Nutzen, kann aber die Sicht einschränken."],
    ["Eine Gemeinde kombiniert Solaranlagen, Gebäudedämmung und einen tieferen Energieverbrauch, statt nur auf eine einzelne Massnahme zu setzen.", "Mehrere abgestimmte Massnahmen verbessern die Energiebilanz."],
    ["Ein Historiker vergleicht Briefe, Zeitungen und amtliche Akten, weil jede Quelle nur einen Teil der Vergangenheit zeigt.", "Mehrere Quellen ermöglichen ein vollständigeres Geschichtsbild."],
    ["Die Debatte zeigt, dass günstiger Verkehr, Umweltschutz und kurze Fahrzeiten teilweise unterschiedliche Lösungen verlangen.", "Politische Entscheidungen müssen verschiedene Ziele abwägen."],
    ["Ein Experiment wird von unabhängigen Gruppen wiederholt. Erst als ähnliche Resultate entstehen, gilt der Befund als belastbarer.", "Wiederholbarkeit stärkt wissenschaftliche Ergebnisse."],
  ] },
  { question: attitude, cases: [
    ["Die Daten stützen meine Vermutung nur teilweise. Deshalb formuliere ich die Aussage vorsichtiger.", "evidenzorientiert und selbstkritisch"],
    ["Diese Massnahme hat Nachteile, doch im Vergleich zu den Alternativen verursacht sie die geringsten Probleme.", "abwägend und pragmatisch"],
    ["Wer das anders sieht, denkt offensichtlich nicht nach.", "unsachlich und abwertend"],
    ["Ich finde den Vorschlag überzeugend, möchte aber wissen, wie die Kosten berechnet wurden.", "zustimmend, aber kritisch prüfend"],
    ["Noch fehlen Langzeitdaten. Eine endgültige Aussage wäre deshalb verfrüht.", "vorsichtig gegenüber voreiligen Schlüssen"],
  ] },
];

const grade6Orders: [OrderCase, OrderCase, OrderCase, OrderCase, OrderCase] = [
  ["Zuerst identifiziert Nora die zentrale These. Danach prüft sie die genannten Belege. Zum Schluss bewertet sie, ob die Schlussfolgerung daraus folgt.", ["These identifizieren", "Belege prüfen", "Schlussfolgerung bewerten"]],
  ["Amir sucht die Originalquelle. Er kontrolliert Autor und Datum. Danach vergleicht er das Zitat mit dem vollständigen Text.", ["Originalquelle suchen", "Autor und Datum prüfen", "Zitat mit dem Original vergleichen"]],
  ["Die Gruppe plant eine Stichprobe. Anschliessend erhebt sie die Daten. Zum Schluss beschreibt sie Grenzen der Untersuchung.", ["Stichprobe planen", "Daten erheben", "Grenzen beschreiben"]],
  ["Die Klasse sammelt Pro- und Contra-Argumente. Danach gewichtet sie deren Belege. Abschliessend formuliert sie ein begründetes Urteil.", ["Argumente sammeln", "Belege gewichten", "Begründetes Urteil formulieren"]],
  ["Nina prüft Achsen und Einheit der Grafik. Dann berechnet sie relative Werte. Danach beurteilt sie die dargestellte Aussage neu.", ["Achsen und Einheit prüfen", "Relative Werte berechnen", "Aussage neu beurteilen"]],
];

export const listeningGrade3 = makeTopic(3, "hoerverstehen-3", "Hörgeschichten verstehen", grade3Easy, grade3Medium, grade3Hard, grade3Orders);
export const listeningGrade4 = makeTopic(4, "hoerverstehen-4", "Hörtexte erschliessen", grade4Easy, grade4Medium, grade4Hard, grade4Orders);
export const listeningGrade5 = makeTopic(5, "hoerverstehen-5", "Zuhören & einordnen", grade5Easy, grade5Medium, grade5Hard, grade5Orders);
export const listeningGrade6 = makeTopic(6, "hoerverstehen-6", "Hörtexte analysieren", grade6Easy, grade6Medium, grade6Hard, grade6Orders);
