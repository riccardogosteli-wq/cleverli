import type { Exercise, Topic } from "@/types/exercise";

type L = [de: string, en: string, fr: string, it: string];
type ListeningCase = {
  audio: string;
  question: L;
  answer: string;
  wrong: [string, string, string];
  visuals?: [answer: string, wrong1: string, wrong2: string, wrong3: string];
};

const taskHints: Record<1 | 2 | 3, [L, L]> = {
  1: [
    ["Höre auf das wichtigste Wort.", "Listen for the most important word.", "Écoute le mot le plus important.", "Ascolta la parola più importante."],
    ["Spiele den Hörtext nochmals ab und achte genau auf Namen und Dinge.", "Play the audio again and listen carefully for names and objects.", "Réécoute et fais attention aux noms et aux objets.", "Riascolta e presta attenzione ai nomi e agli oggetti."],
  ],
  2: [
    ["Achte darauf, was geschieht und in welcher Reihenfolge.", "Listen for what happens and in which order.", "Écoute ce qui se passe et dans quel ordre.", "Ascolta cosa succede e in quale ordine."],
    ["Höre ein zweites Mal und merke dir Ort, Zeit oder Handlung.", "Listen a second time and remember the place, time or action.", "Réécoute et retiens le lieu, le moment ou l'action.", "Riascolta e ricorda il luogo, il momento o l'azione."],
  ],
  3: [
    ["Verbinde mehrere Hinweise aus dem Hörtext.", "Combine several clues from the audio.", "Relie plusieurs indices du texte entendu.", "Collega diversi indizi del testo ascoltato."],
    ["Höre nochmals: Was wird gesagt, und was kann man daraus schliessen?", "Listen again: what is said, and what can you conclude?", "Réécoute : qu'est-ce qui est dit et que peux-tu en déduire ?", "Riascolta: cosa viene detto e cosa puoi dedurre?"],
  ],
};

function mc(id: string, difficulty: 1 | 2 | 3, item: ListeningCase, free = false, speakChoices = false): Exercise {
  const [hint1, hint2] = taskHints[difficulty];
  const choices = [item.answer, ...item.wrong];
  const offset = Number(id.match(/\d+$/)?.[0] ?? 0) % choices.length;
  const options = [...choices.slice(offset), ...choices.slice(0, offset)];
  const optionEmojis = item.visuals ? [...item.visuals.slice(offset), ...item.visuals.slice(0, offset)] : undefined;
  const listeningText = optionEmojis || speakChoices
    ? `${item.audio} ${item.question[0]} ${options.map((option, index) => `Antwort ${index + 1}: ${option}`).join(". ")}.`
    : item.audio;
  return {
    id,
    type: "multiple-choice",
    difficulty,
    free,
    question: item.question[0],
    questionEN: item.question[1],
    questionFR: item.question[2],
    questionIT: item.question[3],
    listeningText,
    answer: item.answer,
    options,
    optionEmojis,
    hints: [hint1[0], hint2[0]],
    hintsEN: [hint1[1], hint2[1]],
    hintsFR: [hint1[2], hint2[2]],
    hintsIT: [hint1[3], hint2[3]],
    preserveGermanContent: true,
  };
}

function order(id: string, difficulty: 2 | 3, audio: string, steps: [string, string, string], emojis?: [string, string, string]): Exercise {
  const [hint1, hint2] = taskHints[difficulty];
  const items = steps.map((label, index) => ({ id: `${id}-i${index + 1}`, label, emoji: emojis?.[index] }));
  const zones = steps.map((_, index) => ({ id: `${id}-z${index + 1}`, label: `${index + 1}.` }));
  return {
    id,
    type: "drag-drop",
    difficulty,
    question: "Bringe die gehörten Schritte in die richtige Reihenfolge.",
    questionEN: "Put the steps you heard in the correct order.",
    questionFR: "Mets les étapes entendues dans le bon ordre.",
    questionIT: "Metti i passaggi ascoltati nell'ordine corretto.",
    listeningText: emojis ? `${audio} Bringe die drei Bilder in die gehörte Reihenfolge.` : audio,
    answer: "all",
    hints: [hint1[0], hint2[0]],
    hintsEN: [hint1[1], hint2[1]],
    hintsFR: [hint1[2], hint2[2]],
    hintsIT: [hint1[3], hint2[3]],
    dragItems: items,
    dropZones: zones,
    dropAnswers: Object.fromEntries(items.map((item, index) => [item.id, zones[index].id])),
    preserveGermanContent: true,
  };
}

const q = (de: string, en: string, fr: string, it: string): L => [de, en, fr, it];

const grade1Easy: ListeningCase[] = [
  { audio: "Ich sehe einen roten Ball.", question: q("Was sieht das Kind?", "What does the child see?", "Que voit l'enfant ?", "Cosa vede il bambino?"), answer: "einen roten Ball", wrong: ["eine blaue Tasche", "einen grünen Frosch", "ein gelbes Buch"], visuals: ["🔴⚽", "🔵🎒", "🟢🐸", "🟡📕"] },
  { audio: "Mia trägt eine gelbe Mütze.", question: q("Welche Farbe hat Mias Mütze?", "What colour is Mia's hat?", "De quelle couleur est le bonnet de Mia ?", "Di che colore è il berretto di Mia?"), answer: "gelb", wrong: ["rot", "blau", "grün"], visuals: ["🟡", "🔴", "🔵", "🟢"] },
  { audio: "Der Hund schläft im Korb.", question: q("Wo schläft der Hund?", "Where is the dog sleeping?", "Où dort le chien ?", "Dove dorme il cane?"), answer: "im Korb", wrong: ["unter dem Tisch", "auf dem Sofa", "im Garten"], visuals: ["🐶💤🧺", "🐶⬇️🪑", "🐶🛋️", "🐶🌳"] },
  { audio: "Noah isst einen Apfel.", question: q("Was isst Noah?", "What is Noah eating?", "Que mange Noah ?", "Cosa mangia Noah?"), answer: "einen Apfel", wrong: ["eine Birne", "ein Brot", "eine Banane"], visuals: ["🍎", "🍐", "🍞", "🍌"] },
  { audio: "Im Garten sitzt eine Katze.", question: q("Welches Tier sitzt im Garten?", "Which animal is in the garden?", "Quel animal est dans le jardin ?", "Quale animale è in giardino?"), answer: "eine Katze", wrong: ["ein Hase", "ein Vogel", "ein Hund"], visuals: ["🐱", "🐰", "🐦", "🐶"] },
  { audio: "Lina malt ein grosses Haus.", question: q("Was malt Lina?", "What is Lina drawing?", "Que dessine Lina ?", "Cosa disegna Lina?"), answer: "ein grosses Haus", wrong: ["einen kleinen Baum", "eine rote Blume", "ein schnelles Auto"], visuals: ["🏠", "🌳", "🌹", "🏎️"] },
  { audio: "Der Vogel singt auf dem Ast.", question: q("Was macht der Vogel?", "What is the bird doing?", "Que fait l'oiseau ?", "Cosa fa l'uccello?"), answer: "Er singt.", wrong: ["Er schläft.", "Er frisst.", "Er fliegt weg."], visuals: ["🐦🎵", "🐦💤", "🐦🍽️", "🐦🪽"] },
  { audio: "Ben hat drei blaue Stifte.", question: q("Wie viele Stifte hat Ben?", "How many pencils does Ben have?", "Combien de crayons Ben a-t-il ?", "Quante matite ha Ben?"), answer: "drei", wrong: ["zwei", "vier", "fünf"], visuals: ["3️⃣✏️", "2️⃣✏️", "4️⃣✏️", "5️⃣✏️"] },
  { audio: "Heute regnet es. Nimm den Schirm mit.", question: q("Was soll das Kind mitnehmen?", "What should the child take?", "Que doit prendre l'enfant ?", "Cosa deve portare il bambino?"), answer: "den Schirm", wrong: ["die Sonnenbrille", "den Fussball", "die Badehose"], visuals: ["☂️", "😎", "⚽", "🩱"] },
  { audio: "Sara fährt mit dem Velo zur Schule.", question: q("Wie fährt Sara zur Schule?", "How does Sara get to school?", "Comment Sara va-t-elle à l'école ?", "Come va Sara a scuola?"), answer: "mit dem Velo", wrong: ["mit dem Bus", "mit dem Zug", "mit dem Schiff"], visuals: ["🚲", "🚌", "🚆", "⛵"] },
  { audio: "Auf dem Tisch liegen zwei Bücher.", question: q("Was liegt auf dem Tisch?", "What is on the table?", "Qu'y a-t-il sur la table ?", "Cosa c'è sul tavolo?"), answer: "zwei Bücher", wrong: ["drei Hefte", "ein Ball", "vier Äpfel"], visuals: ["📚📚", "📒📒📒", "⚽", "🍎🍎🍎🍎"] },
  { audio: "Oma backt einen Kuchen.", question: q("Wer backt einen Kuchen?", "Who is baking a cake?", "Qui prépare un gâteau ?", "Chi prepara una torta?"), answer: "Oma", wrong: ["Mia", "der Lehrer", "Noah"], visuals: ["👵🧁", "👧🧁", "👨‍🏫🧁", "👦🧁"] },
  { audio: "Der kleine Frosch springt ins Wasser.", question: q("Wohin springt der Frosch?", "Where does the frog jump?", "Où saute la grenouille ?", "Dove salta la rana?"), answer: "ins Wasser", wrong: ["auf den Baum", "in den Korb", "unter das Bett"], visuals: ["🐸💦", "🐸🌳", "🐸🧺", "🐸🛏️"] },
  { audio: "Am Morgen trinke ich Milch.", question: q("Wann trinkt das Kind Milch?", "When does the child drink milk?", "Quand l'enfant boit-il du lait ?", "Quando beve il latte il bambino?"), answer: "am Morgen", wrong: ["am Mittag", "am Abend", "in der Nacht"], visuals: ["🌅🥛", "☀️🥛", "🌆🥛", "🌙🥛"] },
  { audio: "Lea öffnet langsam die Tür.", question: q("Was öffnet Lea?", "What does Lea open?", "Qu'est-ce que Lea ouvre ?", "Cosa apre Lea?"), answer: "die Tür", wrong: ["das Fenster", "die Schachtel", "den Schirm"], visuals: ["🚪", "🪟", "📦", "☂️"] },
];

const grade1Medium: ListeningCase[] = [
  { audio: "Zieh zuerst die Jacke an. Nimm dann deine Tasche.", question: q("Was soll das Kind zuerst tun?", "What should the child do first?", "Que doit faire l'enfant d'abord ?", "Cosa deve fare prima il bambino?"), answer: "die Jacke anziehen", wrong: ["die Tasche nehmen", "die Schuhe ausziehen", "das Fenster öffnen"], visuals: ["🧥✅", "🎒", "👟⬅️", "🪟"] },
  { audio: "Stell den Becher neben den Teller.", question: q("Wohin gehört der Becher?", "Where should the cup go?", "Où faut-il mettre le gobelet ?", "Dove va messo il bicchiere?"), answer: "neben den Teller", wrong: ["unter den Tisch", "in die Tasche", "hinter die Tür"], visuals: ["🥤➡️🍽️", "🥤⬇️🪑", "🥤🎒", "🥤🚪"] },
  { audio: "Male die Sonne gelb und die Wolke blau.", question: q("Welche Farbe bekommt die Wolke?", "What colour should the cloud be?", "De quelle couleur doit être le nuage ?", "Di che colore deve essere la nuvola?"), answer: "blau", wrong: ["gelb", "rot", "grün"], visuals: ["🔵☁️", "🟡☁️", "🔴☁️", "🟢☁️"] },
  { audio: "Klopfe zweimal auf den Tisch und klatsche einmal.", question: q("Wie oft soll das Kind klopfen?", "How many times should the child knock?", "Combien de fois l'enfant doit-il frapper ?", "Quante volte deve bussare il bambino?"), answer: "zweimal", wrong: ["einmal", "dreimal", "viermal"], visuals: ["2️⃣👊", "1️⃣👊", "3️⃣👊", "4️⃣👊"] },
  { audio: "Mia sucht ihren Ball. Er liegt hinter dem Vorhang.", question: q("Wo findet Mia den Ball?", "Where does Mia find the ball?", "Où Mia trouve-t-elle le ballon ?", "Dove trova Mia la palla?"), answer: "hinter dem Vorhang", wrong: ["unter dem Bett", "im Schrank", "vor der Haustür"], visuals: ["⚽🪟", "⚽🛏️", "⚽🚪", "⚽🏠"] },
  { audio: "Leo hat Hunger. Er macht sich ein Käsebrot.", question: q("Warum macht Leo ein Brot?", "Why does Leo make a sandwich?", "Pourquoi Leo prépare-t-il une tartine ?", "Perché Leo prepara un panino?"), answer: "weil er Hunger hat", wrong: ["weil er müde ist", "weil es regnet", "weil er zur Schule muss"], visuals: ["🍞😋", "🍞😴", "🍞🌧️", "🍞🏫"] },
  { audio: "Es ist kalt. Nina zieht Handschuhe und eine Mütze an.", question: q("Wie ist das Wetter?", "What is the weather like?", "Quel temps fait-il ?", "Com'è il tempo?"), answer: "kalt", wrong: ["heiss", "windstill", "schwül"], visuals: ["🥶", "🥵", "🍃🚫", "💧😓"] },
  { audio: "Der Bus kommt um acht Uhr. Amir wartet an der Haltestelle.", question: q("Wo wartet Amir?", "Where is Amir waiting?", "Où Amir attend-il ?", "Dove aspetta Amir?"), answer: "an der Haltestelle", wrong: ["im Klassenzimmer", "auf dem Spielplatz", "im Laden"], visuals: ["🚏", "🏫", "🛝", "🛒"] },
  { audio: "Lina legt das Heft in den Rucksack und den Stift ins Etui.", question: q("Was legt Lina ins Etui?", "What does Lina put in the pencil case?", "Que met Lina dans la trousse ?", "Cosa mette Lina nell'astuccio?"), answer: "den Stift", wrong: ["das Heft", "den Rucksack", "das Buch"], visuals: ["✏️", "📒", "🎒", "📕"] },
  { audio: "Papa liest vor. Danach putzt Ben die Zähne.", question: q("Was macht Ben nach dem Vorlesen?", "What does Ben do after the story?", "Que fait Ben après l'histoire ?", "Cosa fa Ben dopo la lettura?"), answer: "Er putzt die Zähne.", wrong: ["Er zieht die Schuhe an.", "Er frühstückt.", "Er geht einkaufen."], visuals: ["🪥", "👟", "🍳", "🛒"] },
  { audio: "Auf dem Pausenplatz spielt Sara mit Mia und Tom.", question: q("Mit wem spielt Sara?", "Who is Sara playing with?", "Avec qui Sara joue-t-elle ?", "Con chi gioca Sara?"), answer: "mit Mia und Tom", wrong: ["mit Noah und Ben", "mit Oma und Opa", "mit ihrer Lehrerin"], visuals: ["👧👦", "👦👦", "👵👴", "👩‍🏫"] },
  { audio: "Im roten Haus wohnt eine Familie mit zwei Kindern.", question: q("Wie viele Kinder wohnen im Haus?", "How many children live in the house?", "Combien d'enfants habitent dans la maison ?", "Quanti bambini vivono nella casa?"), answer: "zwei", wrong: ["eins", "drei", "vier"], visuals: ["2️⃣👧", "1️⃣👧", "3️⃣👧", "4️⃣👧"] },
  { audio: "Noah möchte lesen, aber sein Buch liegt in der Schule.", question: q("Warum kann Noah nicht lesen?", "Why can Noah not read?", "Pourquoi Noah ne peut-il pas lire ?", "Perché Noah non può leggere?"), answer: "Sein Buch liegt in der Schule.", wrong: ["Er ist zu müde.", "Das Licht ist aus.", "Er kann das Buch nicht öffnen."], visuals: ["📕🏫", "😴", "💡❌", "📕🔒"] },
  { audio: "Der Hase rennt über die Wiese. Dann versteckt er sich im Gebüsch.", question: q("Was macht der Hase zuletzt?", "What does the rabbit do last?", "Que fait le lapin à la fin ?", "Cosa fa infine il coniglio?"), answer: "Er versteckt sich.", wrong: ["Er schläft ein.", "Er frisst eine Karotte.", "Er springt ins Wasser."], visuals: ["🐰🙈", "🐰💤", "🐰🥕", "🐰💦"] },
  { audio: "Lea hört Musik. Ihr Bruder baut daneben einen Turm.", question: q("Was baut Leas Bruder?", "What is Lea's brother building?", "Que construit le frère de Lea ?", "Cosa costruisce il fratello di Lea?"), answer: "einen Turm", wrong: ["ein Schiff", "eine Höhle", "eine Brücke"], visuals: ["🧱🏰", "⛵", "🕳️", "🌉"] },
];

const grade1Hard: ListeningCase[] = [
  { audio: "Am Morgen findet Tim eine Spur im Schnee. Er folgt ihr bis zum Baum. Dort sitzt ein kleiner Vogel.", question: q("Was findet Tim am Ende?", "What does Tim find at the end?", "Que trouve Tim à la fin ?", "Cosa trova Tim alla fine?"), answer: "einen kleinen Vogel", wrong: ["seinen Ball", "eine Katze", "einen Handschuh"], visuals: ["🐦", "⚽", "🐱", "🧤"] },
  { audio: "Nora packt Brot und Wasser ein. Dann zieht sie Wanderschuhe an. Sie möchte in den Wald gehen.", question: q("Was plant Nora?", "What is Nora planning?", "Que prévoit Nora ?", "Cosa ha in programma Nora?"), answer: "eine Wanderung", wrong: ["einen Schwimmbadbesuch", "eine Zugfahrt", "einen Schultag"], visuals: ["🥾🌲", "🏊", "🚆", "🏫"] },
  { audio: "Mia stellt einen Teller auf den Tisch. Sie zündet keine Kerze an, sondern holt Löffel. Heute gibt es Suppe.", question: q("Welches Besteck braucht Mia?", "Which cutlery does Mia need?", "Quel couvert Mia doit-elle prendre ?", "Quale posata serve a Mia?"), answer: "einen Löffel", wrong: ["eine Gabel", "ein Messer", "eine Schere"], visuals: ["🥄", "🍴", "🔪", "✂️"] },
  { audio: "Ben hört Donner und sieht dunkle Wolken. Schnell schliesst er das Fenster.", question: q("Was kommt wahrscheinlich?", "What will probably happen?", "Que va-t-il probablement se passer ?", "Cosa succederà probabilmente?"), answer: "ein Gewitter", wrong: ["starker Sonnenschein", "Schneefall", "Nebel am Morgen"], visuals: ["⛈️", "☀️", "🌨️", "🌫️"] },
  { audio: "Lina wollte den roten Pullover tragen. Er ist aber noch nass. Darum nimmt sie den blauen.", question: q("Welchen Pullover trägt Lina?", "Which jumper does Lina wear?", "Quel pull Lina porte-t-elle ?", "Quale maglione indossa Lina?"), answer: "den blauen", wrong: ["den roten", "den grünen", "keinen Pullover"], visuals: ["🔵👕", "🔴👕", "🟢👕", "🚫👕"] },
  { audio: "Noah legt ein Buch, ein Heft und sein Etui bereit. Danach wartet er vor der Klassenzimmertür.", question: q("Wohin geht Noah?", "Where is Noah going?", "Où va Noah ?", "Dove va Noah?"), answer: "in den Unterricht", wrong: ["zum Fussballtraining", "ins Bett", "zum Einkaufen"], visuals: ["🏫", "⚽", "🛏️", "🛒"] },
  { audio: "Sara giesst die Erde jeden Tag. Nach einer Woche schaut ein grüner Stängel aus dem Topf.", question: q("Was wächst im Topf?", "What is growing in the pot?", "Qu'est-ce qui pousse dans le pot ?", "Cosa cresce nel vaso?"), answer: "eine Pflanze", wrong: ["ein Stein", "ein Pilz aus Papier", "ein Spielzeug"], visuals: ["🌱", "🪨", "🍄📄", "🧸"] },
  { audio: "Der Wecker klingelt. Amir zieht sich an und isst ein Brot. Dann verlässt er das Haus.", question: q("Was macht Amir vor dem Verlassen des Hauses?", "What does Amir do before leaving the house?", "Que fait Amir avant de quitter la maison ?", "Cosa fa Amir prima di uscire di casa?"), answer: "Er isst ein Brot.", wrong: ["Er geht schlafen.", "Er nimmt ein Bad.", "Er liest ein Buch."], visuals: ["🍞", "🛏️", "🛁", "📕"] },
  { audio: "Lea flüstert, weil das Baby schläft. Ihr Bruder schliesst leise die Tür.", question: q("Warum sind die Kinder leise?", "Why are the children quiet?", "Pourquoi les enfants sont-ils silencieux ?", "Perché i bambini fanno piano?"), answer: "Das Baby schläft.", wrong: ["Sie haben Angst.", "Sie schreiben einen Test.", "Es ist schon Mittag."], visuals: ["👶💤", "😨", "📝", "🕛"] },
  { audio: "Tom hat seinen Schlüssel vergessen. Er klingelt, und seine Schwester öffnet ihm.", question: q("Wer öffnet die Tür?", "Who opens the door?", "Qui ouvre la porte ?", "Chi apre la porta?"), answer: "Toms Schwester", wrong: ["Tom selbst", "sein Lehrer", "der Nachbarshund"], visuals: ["👧🚪", "👦🚪", "👨‍🏫🚪", "🐶🚪"] },
  { audio: "Nina legt die Badehose bereit. Am Morgen sieht sie jedoch Schnee vor dem Fenster und zieht stattdessen die Winterjacke an.", question: q("Welcher Plan passt nicht mehr zum Wetter?", "Which plan no longer suits the weather?", "Quel projet ne convient plus au temps ?", "Quale piano non è più adatto al tempo?"), answer: "schwimmen gehen", wrong: ["einen Schneemann bauen", "die Winterjacke tragen", "warme Schuhe anziehen"], visuals: ["🏊❌", "⛄", "🧥", "🥾"] },
  { audio: "Ben möchte den hohen Ast erreichen. Er stellt sich nicht auf den wackligen Stuhl, sondern bittet einen Erwachsenen um Hilfe.", question: q("Warum handelt Ben sicher?", "Why is Ben acting safely?", "Pourquoi Ben agit-il prudemment ?", "Perché Ben agisce in modo sicuro?"), answer: "Er bittet einen Erwachsenen um Hilfe.", wrong: ["Er klettert schnell auf den Stuhl.", "Er springt nach dem Ast.", "Er zieht am Baum."], visuals: ["🧒🙋🧑", "🧒🪑", "🧒🤸🌳", "🧒💪🌳"] },
  { audio: "Mia hört an der Tür ein Kratzen. Als sie öffnet, sitzt der nasse Hund davor und wedelt mit dem Schwanz.", question: q("Wie fühlt sich der Hund wahrscheinlich?", "How does the dog probably feel?", "Comment le chien se sent-il probablement ?", "Come si sente probabilmente il cane?"), answer: "Er freut sich, Mia zu sehen.", wrong: ["Er möchte schlafen.", "Er hat Mia nicht bemerkt.", "Er ist über den Regen froh."], visuals: ["🐶😊👧", "🐶💤", "🐶🙈", "🐶🌧️😊"] },
  { audio: "Amir teilt seine vier Farbstifte mit Lio. Nun können beide gleichzeitig malen.", question: q("Was bewirkt Amirs Entscheidung?", "What is the result of Amir's decision?", "Quel est le résultat de la décision d'Amir ?", "Qual è il risultato della decisione di Amir?"), answer: "Beide Kinder können malen.", wrong: ["Kein Kind hat mehr Stifte.", "Nur Amir kann malen.", "Lio geht nach Hause."], visuals: ["👧👦🎨", "🚫✏️", "👦🎨", "👦🏠"] },
  { audio: "Lea hört die Schulglocke, steckt das Springseil ein und läuft mit den anderen Kindern zur Tür.", question: q("Was ist wahrscheinlich vorbei?", "What is probably over?", "Qu'est-ce qui est probablement terminé ?", "Cosa è probabilmente finito?"), answer: "die Pause", wrong: ["der Unterricht", "das Abendessen", "der Schulweg"], visuals: ["🛝⏰", "📚🏫", "🍽️", "🎒🚶"] },
];

const grade2Easy: ListeningCase[] = [
  { audio: "Mara trifft Jonas um drei Uhr beim Brunnen.", question: q("Wann treffen sich Mara und Jonas?", "When are Mara and Jonas meeting?", "Quand Mara et Jonas se retrouvent-ils ?", "Quando si incontrano Mara e Jonas?"), answer: "um drei Uhr", wrong: ["um zwei Uhr", "um vier Uhr", "am Morgen"], visuals: ["🕒", "🕑", "🕓", "🌅"] },
  { audio: "Im Regal steht das grüne Buch zwischen zwei roten Büchern.", question: q("Wo steht das grüne Buch?", "Where is the green book?", "Où se trouve le livre vert ?", "Dove si trova il libro verde?"), answer: "zwischen zwei roten Büchern", wrong: ["unter dem Regal", "neben einem blauen Heft", "auf dem Tisch"], visuals: ["📕📗📕", "⬇️📚", "📗📘", "📗🪑"] },
  { audio: "Nina bestellt eine Suppe und ein Glas Wasser.", question: q("Was bestellt Nina zu trinken?", "What does Nina order to drink?", "Que commande Nina à boire ?", "Cosa ordina Nina da bere?"), answer: "ein Glas Wasser", wrong: ["einen Tee", "einen Saft", "eine Milch"], visuals: ["💧🥛", "🍵", "🧃", "🥛"] },
  { audio: "Der Zug nach Bern fährt auf Gleis vier ab.", question: q("Auf welchem Gleis fährt der Zug?", "Which platform does the train leave from?", "De quelle voie part le train ?", "Da quale binario parte il treno?"), answer: "auf Gleis vier", wrong: ["auf Gleis zwei", "auf Gleis drei", "auf Gleis fünf"], visuals: ["4️⃣🚆", "2️⃣🚆", "3️⃣🚆", "5️⃣🚆"] },
  { audio: "Herr Keller liest heute eine lustige Geschichte vor.", question: q("Wie ist die Geschichte?", "What is the story like?", "Comment est l'histoire ?", "Com'è la storia?"), answer: "lustig", wrong: ["traurig", "gruselig", "langweilig"], visuals: ["😂", "😢", "😱", "🥱"] },
  { audio: "Das Training beginnt am Mittwoch um halb fünf.", question: q("An welchem Tag beginnt das Training?", "On which day does training start?", "Quel jour commence l'entraînement ?", "In quale giorno inizia l'allenamento?"), answer: "am Mittwoch", wrong: ["am Montag", "am Dienstag", "am Freitag"], visuals: ["3️⃣📅", "1️⃣📅", "2️⃣📅", "5️⃣📅"] },
  { audio: "Lio trägt den schweren Karton gemeinsam mit seinem Vater.", question: q("Wer hilft Lio?", "Who helps Lio?", "Qui aide Lio ?", "Chi aiuta Lio?"), answer: "sein Vater", wrong: ["seine Schwester", "sein Freund", "seine Lehrerin"], visuals: ["👨📦", "👧📦", "👦📦", "👩‍🏫📦"] },
  { audio: "Vor der Pause lösen wir Mathematikaufgaben. Danach gehen wir nach draussen.", question: q("Was macht die Klasse nach den Mathematikaufgaben?", "What does the class do after the maths exercises?", "Que fait la classe après les exercices de mathématiques ?", "Cosa fa la classe dopo gli esercizi di matematica?"), answer: "Sie geht nach draussen.", wrong: ["Sie bleibt im Klassenzimmer.", "Sie singt ein Lied.", "Sie liest eine Geschichte."], visuals: ["🚪🌳", "🏫🪑", "🎵", "📖"] },
  { audio: "Lea leiht in der Bibliothek ein Sachbuch über Wale aus.", question: q("Worüber handelt Leas Buch?", "What is Lea's book about?", "De quoi parle le livre de Lea ?", "Di cosa parla il libro di Lea?"), answer: "über Wale", wrong: ["über Berge", "über Ritter", "über Planeten"], visuals: ["🐋", "⛰️", "🏰⚔️", "🪐"] },
  { audio: "Heute nimmt Amir den Bus, weil sein Velo einen platten Reifen hat.", question: q("Warum fährt Amir mit dem Bus?", "Why does Amir take the bus?", "Pourquoi Amir prend-il le bus ?", "Perché Amir prende l'autobus?"), answer: "Sein Velo hat einen platten Reifen.", wrong: ["Es regnet stark.", "Er hat den Weg vergessen.", "Der Bus ist gratis."], visuals: ["🚲🛞💨", "🌧️", "🗺️❓", "🚌🆓"] },
  { audio: "Sara wählt die kleinere Schachtel für die Murmeln.", question: q("Welche Schachtel wählt Sara?", "Which box does Sara choose?", "Quelle boîte Sara choisit-elle ?", "Quale scatola sceglie Sara?"), answer: "die kleinere", wrong: ["die grössere", "die rote", "keine Schachtel"], visuals: ["▫️📦", "◼️📦", "🔴📦", "🚫📦"] },
  { audio: "Bitte öffnet das Heft auf Seite zwölf.", question: q("Welche Seite sollen die Kinder öffnen?", "Which page should the children open?", "Quelle page les enfants doivent-ils ouvrir ?", "Quale pagina devono aprire i bambini?"), answer: "Seite zwölf", wrong: ["Seite zehn", "Seite elf", "Seite zwanzig"], visuals: ["1️⃣2️⃣📖", "1️⃣0️⃣📖", "1️⃣1️⃣📖", "2️⃣0️⃣📖"] },
  { audio: "Mia sammelt Kastanien, während Noah bunte Blätter sucht.", question: q("Was sucht Noah?", "What is Noah looking for?", "Que cherche Noah ?", "Cosa cerca Noah?"), answer: "bunte Blätter", wrong: ["Kastanien", "kleine Steine", "rote Beeren"], visuals: ["🍂🍁", "🌰", "🪨", "🔴🫐"] },
  { audio: "Der Film dauert eine Stunde und beginnt um sechs Uhr.", question: q("Wann beginnt der Film?", "When does the film start?", "Quand commence le film ?", "Quando inizia il film?"), answer: "um sechs Uhr", wrong: ["um fünf Uhr", "um sieben Uhr", "um halb sechs"], visuals: ["🕕", "🕔", "🕖", "🕠"] },
  { audio: "Opa bringt morgen Äpfel aus seinem Garten mit.", question: q("Wann bringt Opa die Äpfel?", "When will Grandpa bring the apples?", "Quand grand-père apporte-t-il les pommes ?", "Quando porta le mele il nonno?"), answer: "morgen", wrong: ["heute", "gestern", "nächste Woche"], visuals: ["➡️📅", "📅", "⬅️📅", "⏩📅"] },
];

const grade2Medium: ListeningCase[] = [
  { audio: "Mia fragt: Kommst du heute mit ins Schwimmbad? Lea antwortet: Nein, ich habe Musikunterricht.", question: q("Warum kommt Lea nicht mit?", "Why is Lea not coming?", "Pourquoi Lea ne vient-elle pas ?", "Perché Lea non viene?"), answer: "Sie hat Musikunterricht.", wrong: ["Sie ist krank.", "Sie kann nicht schwimmen.", "Sie muss einkaufen."] },
  { audio: "Jonas sagt: Ich habe meinen Farbstift vergessen. Ben antwortet: Du kannst meinen nehmen.", question: q("Was bietet Ben an?", "What does Ben offer?", "Que propose Ben ?", "Cosa offre Ben?"), answer: "seinen Farbstift", wrong: ["sein Heft", "seinen Radiergummi", "seine Schere"] },
  { audio: "Die Lehrerin sagt: Arbeitet zuerst allein. Vergleicht danach eure Lösungen zu zweit.", question: q("Was tun die Kinder nach der Einzelarbeit?", "What do the children do after working alone?", "Que font les enfants après le travail individuel ?", "Cosa fanno i bambini dopo il lavoro individuale?"), answer: "Sie vergleichen ihre Lösungen zu zweit.", wrong: ["Sie gehen nach Hause.", "Sie schreiben alles ab.", "Sie beginnen sofort ein neues Thema."] },
  { audio: "Im Zoo sieht Lio zuerst die Pinguine. Danach besucht er die Elefanten und zuletzt die Affen.", question: q("Welche Tiere sieht Lio zuletzt?", "Which animals does Lio see last?", "Quels animaux Lio voit-il en dernier ?", "Quali animali vede Lio per ultimi?"), answer: "die Affen", wrong: ["die Pinguine", "die Elefanten", "die Löwen"] },
  { audio: "Nora zieht die Vorhänge zu und schaltet die Lampe ein. Draussen wird es dunkel.", question: q("Welche Tageszeit beginnt wahrscheinlich?", "Which time of day is probably beginning?", "Quel moment de la journée commence probablement ?", "Quale momento della giornata sta probabilmente iniziando?"), answer: "der Abend", wrong: ["der Morgen", "der Mittag", "die Pause"] },
  { audio: "Amir liest die Anleitung zweimal, bevor er das Modell baut.", question: q("Was macht Amir vor dem Bauen?", "What does Amir do before building?", "Que fait Amir avant de construire ?", "Cosa fa Amir prima di costruire?"), answer: "Er liest die Anleitung zweimal.", wrong: ["Er malt das Modell an.", "Er räumt das Zimmer auf.", "Er ruft seinen Freund an."] },
  { audio: "Sara möchte draussen spielen. Als sie die Haustür öffnet, beginnt es stark zu hageln.", question: q("Was hindert Sara am Spielen?", "What stops Sara from playing?", "Qu'est-ce qui empêche Sara de jouer ?", "Cosa impedisce a Sara di giocare?"), answer: "starker Hagel", wrong: ["grosse Hitze", "ein kaputter Ball", "ihre Hausaufgaben"] },
  { audio: "Der rote Bus fährt zum Bahnhof. Der blaue Bus fährt zum Spital.", question: q("Welcher Bus fährt zum Spital?", "Which bus goes to the hospital?", "Quel bus va à l'hôpital ?", "Quale autobus va all'ospedale?"), answer: "der blaue Bus", wrong: ["der rote Bus", "beide Busse", "kein Bus"] },
  { audio: "Lea sagt leise: Das Baby schläft. Bitte schliesse die Tür vorsichtig.", question: q("Wie soll die Tür geschlossen werden?", "How should the door be closed?", "Comment faut-il fermer la porte ?", "Come va chiusa la porta?"), answer: "vorsichtig", wrong: ["laut", "schnell und heftig", "gar nicht"] },
  { audio: "Mara liest den Wetterbericht. Am Nachmittag soll es regnen, deshalb nimmt sie einen Schirm mit.", question: q("Welche Information verändert Maras Plan?", "Which information changes Mara's plan?", "Quelle information change le plan de Mara ?", "Quale informazione cambia il piano di Mara?"), answer: "Am Nachmittag soll es regnen.", wrong: ["Am Morgen scheint die Sonne.", "Der Bus kommt später.", "Die Schule endet früher."] },
  { audio: "Tom sagt: Ich räume zuerst mein Zimmer auf. Danach darf ich zu Ben gehen.", question: q("Was muss Tom zuerst erledigen?", "What must Tom do first?", "Que doit faire Tom d'abord ?", "Cosa deve fare prima Tom?"), answer: "sein Zimmer aufräumen", wrong: ["Ben anrufen", "die Küche putzen", "seine Tasche packen"] },
  { audio: "Beim Backen fehlen zwei Eier. Papa geht kurz in den Laden und holt welche.", question: q("Warum geht Papa in den Laden?", "Why does Dad go to the shop?", "Pourquoi papa va-t-il au magasin ?", "Perché papà va al negozio?"), answer: "Es fehlen Eier.", wrong: ["Es fehlt Mehl.", "Der Ofen ist kaputt.", "Er möchte Brot kaufen."] },
  { audio: "Die Klasse stimmt ab. Zwölf Kinder wählen den Wald, acht Kinder den See.", question: q("Welches Ausflugsziel gewinnt?", "Which excursion destination wins?", "Quelle destination gagne ?", "Quale meta vince?"), answer: "der Wald", wrong: ["der See", "beide gleich", "das Museum"] },
  { audio: "Nina hört ein Miauen unter der Bank. Sie kniet sich hin und entdeckt ein Kätzchen.", question: q("Wodurch findet Nina das Kätzchen?", "How does Nina find the kitten?", "Comment Nina trouve-t-elle le chaton ?", "Come trova Nina il gattino?"), answer: "durch sein Miauen", wrong: ["durch seine Pfotenabdrücke", "durch ein Schild", "durch einen Anruf"] },
  { audio: "Der Hauswart warnt: Der Boden ist frisch gewischt und noch nass.", question: q("Worauf sollen die Kinder achten?", "What should the children watch out for?", "À quoi les enfants doivent-ils faire attention ?", "A cosa devono fare attenzione i bambini?"), answer: "auf den nassen Boden", wrong: ["auf eine offene Tür", "auf laute Musik", "auf einen verlorenen Schlüssel"] },
];

const grade2Hard: ListeningCase[] = [
  { audio: "Mara wollte mit dem Velo kommen. Weil der Reifen platt war, nahm sie den Bus. Trotzdem kam sie pünktlich an.", question: q("Welche Aussage stimmt?", "Which statement is correct?", "Quelle affirmation est correcte ?", "Quale affermazione è corretta?"), answer: "Mara kam trotz des Problems pünktlich.", wrong: ["Mara verpasste den Bus.", "Mara reparierte den Reifen unterwegs.", "Mara blieb zu Hause."] },
  { audio: "Lio öffnet das Fenster. Kurz darauf fliegen Blätter ins Zimmer. Er schliesst es wieder und sammelt die Blätter ein.", question: q("Warum schliesst Lio das Fenster wieder?", "Why does Lio close the window again?", "Pourquoi Lio referme-t-il la fenêtre ?", "Perché Lio richiude la finestra?"), answer: "Weil Blätter hereingeflogen sind.", wrong: ["Weil es zu dunkel ist.", "Weil er schlafen möchte.", "Weil jemand klingelt."] },
  { audio: "Beim Wandern wird der Weg immer steiler. Nora bleibt kurz stehen, trinkt Wasser und geht dann langsamer weiter.", question: q("Wie reagiert Nora auf den steilen Weg?", "How does Nora react to the steep path?", "Comment Nora réagit-elle au chemin raide ?", "Come reagisce Nora al sentiero ripido?"), answer: "Sie macht kurz Pause und geht langsamer.", wrong: ["Sie rennt zurück.", "Sie wirft die Flasche weg.", "Sie wartet bis zum Abend."] },
  { audio: "Ben sucht ein ruhiges Plätzchen zum Lesen. Auf dem Pausenplatz ist es laut, deshalb setzt er sich in die Bibliothek.", question: q("Warum wählt Ben die Bibliothek?", "Why does Ben choose the library?", "Pourquoi Ben choisit-il la bibliothèque ?", "Perché Ben sceglie la biblioteca?"), answer: "Dort ist es ruhiger.", wrong: ["Dort gibt es Essen.", "Dort wartet sein Velo.", "Dort darf er laut sprechen."] },
  { audio: "Die Lehrerin kündigt Regen für den Ausflug an. Die Klasse packt Regenjacken ein, lässt die Picknickdecken aber zu Hause.", question: q("Was passt die Klasse wegen des Wetters an?", "What does the class change because of the weather?", "Qu'est-ce que la classe adapte à cause du temps ?", "Cosa cambia la classe a causa del tempo?"), answer: "Sie nimmt Regenjacken statt Picknickdecken mit.", wrong: ["Sie sagt den Ausflug ab.", "Sie nimmt Sonnenhüte mit.", "Sie fährt einen Tag früher."] },
  { audio: "Sara erklärt eine Spielregel. Tom unterbricht sie zweimal. Danach bittet sie ihn, erst zuzuhören und dann zu fragen.", question: q("Was wünscht Sara von Tom?", "What does Sara want Tom to do?", "Que souhaite Sara de Tom ?", "Cosa vuole Sara da Tom?"), answer: "Er soll zuerst zuhören.", wrong: ["Er soll das Spiel verlassen.", "Er soll die Regeln abschreiben.", "Er soll lauter sprechen."] },
  { audio: "Noah hört in der Durchsage, dass der Zug zehn Minuten später fährt. Er informiert seine Mutter und wartet auf dem Perron.", question: q("Welche Information gibt Noah weiter?", "What information does Noah pass on?", "Quelle information Noah transmet-il ?", "Quale informazione comunica Noah?"), answer: "Der Zug hat zehn Minuten Verspätung.", wrong: ["Der Zug fällt aus.", "Der Zug fährt früher.", "Das Perron wurde geschlossen."] },
  { audio: "Mia probiert den Schlüssel an der Haustür. Er passt nicht. Dann bemerkt sie, dass sie den Schlüssel zum Veloschloss genommen hat.", question: q("Welchen Fehler hat Mia gemacht?", "What mistake did Mia make?", "Quelle erreur Mia a-t-elle faite ?", "Quale errore ha fatto Mia?"), answer: "Sie hat den falschen Schlüssel mitgenommen.", wrong: ["Sie hat die Tür offen gelassen.", "Sie hat das Velo verloren.", "Sie hat den Schlüssel zerbrochen."] },
  { audio: "Amir möchte den Kuchen sofort schneiden. Oma erklärt, dass er zuerst abkühlen muss, sonst zerfällt er.", question: q("Warum wartet Amir mit dem Schneiden?", "Why does Amir wait before cutting?", "Pourquoi Amir attend-il avant de couper ?", "Perché Amir aspetta prima di tagliare?"), answer: "Der Kuchen muss zuerst abkühlen.", wrong: ["Das Messer fehlt.", "Der Kuchen ist noch nicht süss.", "Die Gäste sind schon gegangen."] },
  { audio: "Im Gespräch schlägt Lea den Spielplatz vor. Nina möchte lieber in den Wald. Sie einigen sich darauf, heute zum Spielplatz und morgen in den Wald zu gehen.", question: q("Wie lösen Lea und Nina die Meinungsverschiedenheit?", "How do Lea and Nina resolve the disagreement?", "Comment Lea et Nina résolvent-elles leur désaccord ?", "Come risolvono Lea e Nina il disaccordo?"), answer: "Sie berücksichtigen beide Vorschläge.", wrong: ["Lea entscheidet allein.", "Sie bleiben beide zu Hause.", "Nina gibt ihren Vorschlag ganz auf."] },
  { audio: "Im Museum erklärt der Führer zuerst das Skelett. Tom fragt erst danach nach den Zähnen, damit er die Erklärung nicht unterbricht.", question: q("Was zeigt Toms gutes Zuhören?", "What shows that Tom listens well?", "Qu'est-ce qui montre que Tom écoute bien ?", "Cosa mostra che Tom ascolta bene?"), answer: "Er wartet mit seiner Frage bis zum Ende.", wrong: ["Er spricht gleichzeitig mit dem Führer.", "Er verlässt die Gruppe.", "Er beantwortet seine Frage selbst laut."] },
  { audio: "Nora hört zwei Wegbeschreibungen. Die erste führt über eine gesperrte Brücke. Die zweite führt etwas länger am Fluss entlang. Sie wählt den Weg am Fluss.", question: q("Warum nimmt Nora den längeren Weg?", "Why does Nora take the longer route?", "Pourquoi Nora prend-elle le chemin le plus long ?", "Perché Nora prende il percorso più lungo?"), answer: "Die Brücke ist gesperrt.", wrong: ["Sie möchte schwimmen.", "Sie hat den kürzeren Weg vergessen.", "Der Flussweg ist steiler."] },
  { audio: "Beim Gruppenauftrag liest Ben die Fragen vor. Mia notiert die Antworten, und Lio achtet auf die Zeit.", question: q("Welche Aufgabe hat Lio?", "What is Lio's task?", "Quelle est la tâche de Lio ?", "Qual è il compito di Lio?"), answer: "Er achtet auf die Zeit.", wrong: ["Er liest die Fragen vor.", "Er notiert die Antworten.", "Er zeichnet ein Bild."] },
  { audio: "Die Durchsage nennt zuerst Gleis zwei, korrigiert sich aber sofort: Der Zug fährt heute ausnahmsweise auf Gleis fünf.", question: q("Wo müssen die Reisenden warten?", "Where must the passengers wait?", "Où les voyageurs doivent-ils attendre ?", "Dove devono aspettare i viaggiatori?"), answer: "auf Gleis fünf", wrong: ["auf Gleis zwei", "vor dem Bahnhof", "im Zug nach Bern"] },
  { audio: "Sara erzählt von einem Tier mit Federn, einem roten Schnabel und Schwimmhäuten. Es lebt am Teich und kann gut schwimmen.", question: q("Welches Tier beschreibt Sara?", "Which animal is Sara describing?", "Quel animal Sara décrit-elle ?", "Quale animale descrive Sara?"), answer: "eine Ente", wrong: ["eine Katze", "ein Eichhörnchen", "ein Frosch"] },
];

const grade1Orders: Array<[string, [string, string, string], [string, string, string]]> = [
  ["Zuerst zieht Ben die Schuhe an. Dann nimmt er die Jacke. Zum Schluss geht er hinaus.", ["Ben zieht die Schuhe an.", "Ben nimmt die Jacke.", "Ben geht hinaus."], ["👟", "🧥", "🚪➡️"]],
  ["Mia öffnet das Buch. Danach liest sie eine Seite. Am Ende schliesst sie das Buch.", ["Mia öffnet das Buch.", "Mia liest eine Seite.", "Mia schliesst das Buch."], ["📖✨", "👧📖", "📕"]],
  ["Noah nimmt den Becher. Dann füllt er Wasser ein. Zuletzt trinkt er.", ["Noah nimmt den Becher.", "Noah füllt Wasser ein.", "Noah trinkt."], ["🥤", "🚰🥤", "🧒🥤"]],
  ["Sara baut einen Turm. Der Turm fällt um. Sara baut ihn nochmals.", ["Sara baut einen Turm.", "Der Turm fällt um.", "Sara baut nochmals."], ["🧱🏰", "🧱💥", "🧱🏰✨"]],
  ["Lea gräbt ein Loch. Sie setzt die Blume hinein. Danach giesst sie die Erde.", ["Lea gräbt ein Loch.", "Lea setzt die Blume hinein.", "Lea giesst die Erde."], ["🕳️", "🌱🕳️", "💧🌱"]],
];

const grade2Orders: Array<[string, [string, string, string], [string, string, string]]> = [
  ["Zuerst liest Amir die Aufgabe. Danach rechnet er im Heft. Zum Schluss prüft er das Ergebnis.", ["Amir liest die Aufgabe.", "Amir rechnet im Heft.", "Amir prüft das Ergebnis."], ["👦📖", "✏️📒", "✅🔎"]],
  ["Nora mischt den Teig. Dann füllt sie ihn in die Form. Nach dem Backen lässt sie den Kuchen abkühlen.", ["Nora mischt den Teig.", "Nora füllt den Teig in die Form.", "Nora lässt den Kuchen abkühlen."], ["🥣🥄", "🥣➡️🍰", "🍰💨"]],
  ["Mia schreibt eine Einladung. Danach steckt sie sie in ein Couvert. Am Ende bringt sie den Brief zur Post.", ["Mia schreibt eine Einladung.", "Mia steckt sie in ein Couvert.", "Mia bringt den Brief zur Post."], ["✍️💌", "💌✉️", "✉️📮"]],
  ["Die Klasse sammelt Ideen. Dann stimmt sie darüber ab. Danach plant sie den Ausflug.", ["Die Klasse sammelt Ideen.", "Die Klasse stimmt ab.", "Die Klasse plant den Ausflug."], ["💡💡", "🗳️", "🗺️✏️"]],
  ["Lio entdeckt eine Pfütze. Er holt seine Gummistiefel. Dann springt er hinein.", ["Lio entdeckt eine Pfütze.", "Lio holt die Gummistiefel.", "Lio springt in die Pfütze."], ["👀💧", "🥾", "🧒💦"]],
];

const grade1Exercises: Exercise[] = [
  ...grade1Easy.map((item, index) => mc(`g1hoer${index + 1}`, 1, item, index < 3)),
  ...grade1Medium.map((item, index) => mc(`g1hoer${index + 16}`, 2, item)),
  ...grade1Orders.map(([audio, steps, emojis], index) => order(`g1hoer${index + 31}`, 2, audio, steps, emojis)),
  ...grade1Hard.map((item, index) => mc(`g1hoer${index + 36}`, 3, item)),
];

const grade2Exercises: Exercise[] = [
  ...grade2Easy.map((item, index) => mc(`g2hoer${index + 1}`, 1, item, index < 3, true)),
  ...grade2Medium.map((item, index) => mc(`g2hoer${index + 16}`, 2, item, false, true)),
  ...grade2Orders.map(([audio, steps, emojis], index) => order(`g2hoer${index + 31}`, 2, audio, steps, emojis)),
  ...grade2Hard.map((item, index) => mc(`g2hoer${index + 36}`, 3, item, false, true)),
];

export const listeningGrade1: Topic = {
  id: "hoerverstehen-1",
  title: "Hören & verstehen",
  emoji: "🎧",
  exercises: grade1Exercises,
};

export const listeningGrade2: Topic = {
  id: "hoerverstehen-2",
  title: "Hörtexte verstehen",
  emoji: "🎧",
  exercises: grade2Exercises,
};
