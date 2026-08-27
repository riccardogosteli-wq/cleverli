import type { Exercise, Topic } from "@/types/exercise";

type Localised = [de: string, en: string, fr: string, it: string];

const hints = {
  de: ["Lies den ganzen Satz; klingt der Inhalt sinnvoll?", "Achte auf Reihenfolge, Grossschreibung sowie Satzzeichen."],
  en: ["Read the whole sentence and check whether it makes sense.", "Pay attention to order, capital letters and punctuation."],
  fr: ["Lis toute la phrase et vérifie si elle a du sens.", "Fais attention à l'ordre, aux majuscules et à la ponctuation."],
  it: ["Leggi tutta la frase e controlla se ha senso.", "Fai attenzione all'ordine, alle maiuscole e alla punteggiatura."],
} as const;

function fill(id: string, difficulty: 1 | 2 | 3, question: Localised, answer: string): Exercise {
  return {
    id,
    preserveGermanContent: true,
    type: "fill-in-blank",
    difficulty,
    question: question[0], questionEN: question[1], questionFR: question[2], questionIT: question[3],
    answer, answerEN: answer, answerFR: answer, answerIT: answer,
    hints: [...hints.de], hintsEN: [...hints.en], hintsFR: [...hints.fr], hintsIT: [...hints.it],
  };
}

function choice(id: string, difficulty: 1 | 2 | 3, question: Localised, answer: string, options: [string, string, string, string]): Exercise {
  return {
    id,
    preserveGermanContent: true,
    type: "multiple-choice",
    difficulty,
    question: question[0], questionEN: question[1], questionFR: question[2], questionIT: question[3],
    answer, answerEN: answer, answerFR: answer, answerIT: answer,
    options, optionsEN: options, optionsFR: options, optionsIT: options,
    hints: [...hints.de], hintsEN: [...hints.en], hintsFR: [...hints.fr], hintsIT: [...hints.it],
  };
}

function order(id: string, difficulty: 1 | 2 | 3, question: Localised, words: string[]): Exercise {
  const dragItems = words.map((label, index) => ({ id: `${id}-w${index + 1}`, label }));
  const dropZones = words.map((_, index) => ({ id: `${id}-p${index + 1}`, label: `${index + 1}.` }));
  return {
    id,
    preserveGermanContent: true,
    type: "drag-drop",
    difficulty,
    question: question[0], questionEN: question[1], questionFR: question[2], questionIT: question[3],
    answer: "all", answerEN: "all", answerFR: "all", answerIT: "all",
    dragItems,
    dropZones,
    dropAnswers: Object.fromEntries(dragItems.map((item, index) => [item.id, dropZones[index].id])),
    hints: [...hints.de], hintsEN: [...hints.en], hintsFR: [...hints.fr], hintsIT: [...hints.it],
  };
}

const exercises: Exercise[] = [
  // Easy: recognise and complete clear first sentences (15)
  choice("g1gs1", 1, ["Welcher Satz passt zum Bild? 🐶💤", "Which German sentence matches the picture? 🐶💤", "Quelle phrase allemande correspond à l'image ? 🐶💤", "Quale frase tedesca corrisponde all'immagine? 🐶💤"], "Der Hund schläft.", ["Der Hund schläft.", "Der Hund fliegt.", "Der Fisch bellt.", "Die Sonne trinkt."]),
  choice("g1gs2", 1, ["Welcher Satz passt zum Bild? 🌧️☂️", "Which German sentence matches the picture? 🌧️☂️", "Quelle phrase allemande correspond à l'image ? 🌧️☂️", "Quale frase tedesca corrisponde all'immagine? 🌧️☂️"], "Mia trägt einen Schirm.", ["Mia trägt einen Schirm.", "Mia schwimmt im Bett.", "Mia isst den Regen.", "Mia fährt auf der Wolke."]),
  choice("g1gs3", 1, ["Welcher Satz passt zum Bild? 🍎🧺", "Which German sentence matches the picture? 🍎🧺", "Quelle phrase allemande correspond à l'image ? 🍎🧺", "Quale frase tedesca corrisponde all'immagine? 🍎🧺"], "Der Apfel liegt im Korb.", ["Der Apfel liegt im Korb.", "Der Korb liest.", "Der Apfel bellt laut.", "Der Korb liegt im Apfel."]),
  choice("g1gs4", 1, ["Welcher Satz ist vollständig?", "Which German sentence is complete?", "Quelle phrase allemande est complète ?", "Quale frase tedesca è completa?"], "Lina malt ein Haus.", ["Lina malt ein Haus.", "Lina ein Haus.", "Malt ein.", "Ein Haus Lina."]),
  choice("g1gs5", 1, ["Welcher Satz erzählt etwas Sinnvolles?", "Which German sentence makes sense?", "Quelle phrase allemande a du sens ?", "Quale frase tedesca ha senso?"], "Der Vogel sitzt auf dem Ast.", ["Der Vogel sitzt auf dem Ast.", "Der Ast fliegt den Vogel.", "Der Vogel trinkt den Baum.", "Der Ast singt ein Brot."]),
  fill("g1gs6", 1, ["Wähle und ergänze: «Die Katze ___ auf dem Sofa.» (schläft/fliegt)", "Choose and complete the German sentence: «Die Katze ___ auf dem Sofa.» (schläft/fliegt)", "Choisis et complète la phrase allemande : «Die Katze ___ auf dem Sofa.» (schläft/fliegt)", "Scegli e completa la frase tedesca: «Die Katze ___ auf dem Sofa.» (schläft/fliegt)"], "schläft"),
  fill("g1gs7", 1, ["Wähle und ergänze: «Am Morgen esse ich ___.» (Frühstück/Schnee)", "Choose and complete the German sentence: «Am Morgen esse ich ___.» (Frühstück/Schnee)", "Choisis et complète la phrase allemande : «Am Morgen esse ich ___.» (Frühstück/Schnee)", "Scegli e completa la frase tedesca: «Am Morgen esse ich ___.» (Frühstück/Schnee)"], "Frühstück"),
  fill("g1gs8", 1, ["Wähle und ergänze: «Im Winter fällt ___.» (Schnee/Brot)", "Choose and complete the German sentence: «Im Winter fällt ___.» (Schnee/Brot)", "Choisis et complète la phrase allemande : «Im Winter fällt ___.» (Schnee/Brot)", "Scegli e completa la frase tedesca: «Im Winter fällt ___.» (Schnee/Brot)"], "Schnee"),
  fill("g1gs9", 1, ["Wähle und ergänze: «Der Fisch schwimmt im ___.» (Wasser/Baum)", "Choose and complete the German sentence: «Der Fisch schwimmt im ___.» (Wasser/Baum)", "Choisis et complète la phrase allemande : «Der Fisch schwimmt im ___.» (Wasser/Baum)", "Scegli e completa la frase tedesca: «Der Fisch schwimmt im ___.» (Wasser/Baum)"], "Wasser"),
  fill("g1gs10", 1, ["Wähle und ergänze: «Ich schreibe mit einem ___.» (Stift/Löffel)", "Choose and complete the German sentence: «Ich schreibe mit einem ___.» (Stift/Löffel)", "Choisis et complète la phrase allemande : «Ich schreibe mit einem ___.» (Stift/Löffel)", "Scegli e completa la frase tedesca: «Ich schreibe mit einem ___.» (Stift/Löffel)"], "Stift"),
  choice("g1gs11", 1, ["Welcher Satz beginnt richtig?", "Which German sentence begins correctly?", "Quelle phrase allemande commence correctement ?", "Quale frase tedesca inizia correttamente?"], "Heute spiele ich draussen.", ["Heute spiele ich draussen.", "heute spiele ich draussen.", "Heute Spiele ich draussen.", "heute Spiele ich draussen."]),
  choice("g1gs12", 1, ["Welcher Satz endet richtig?", "Which German sentence ends correctly?", "Quelle phrase allemande se termine correctement ?", "Quale frase tedesca termina correttamente?"], "Wir gehen nach Hause.", ["Wir gehen nach Hause.", "Wir gehen nach Hause", "Wir gehen nach Hause,", "Wir gehen nach Hause?"]),
  choice("g1gs13", 1, ["Welche Frage ist richtig geschrieben?", "Which German question is written correctly?", "Quelle question allemande est correctement écrite ?", "Quale domanda tedesca è scritta correttamente?"], "Kommst du mit?", ["Kommst du mit?", "Kommst du mit.", "kommst du mit?", "Kommst Du mit?"]),
  choice("g1gs14", 1, ["Welche Notiz ist klar?", "Which German note is clear?", "Quelle note allemande est claire ?", "Quale nota tedesca è chiara?"], "Bitte füttere die Katze.", ["Bitte füttere die Katze.", "Katze bitte die.", "Füttere bitte.", "Die bitte Katze füttere."]),
  choice("g1gs15", 1, ["Welche Überschrift passt zu einer Liste mit Apfel, Brot und Milch?", "Which German heading fits a list with apples, bread and milk?", "Quel titre allemand convient à une liste de pommes, pain et lait ?", "Quale titolo tedesco va bene per una lista con mele, pane e latte?"], "Einkaufsliste", ["Einkaufsliste", "Mein Haustier", "Auf dem Spielplatz", "Gute Nacht"]),

  // Medium: build sentences and use simple text patterns (20)
  order("g1gs16", 2, ["Ordne die Wörter zu einem Satz.", "Put the German words in sentence order.", "Mets les mots allemands dans l'ordre.", "Metti le parole tedesche nell'ordine corretto."], ["Der", "Hase", "hüpft", "."]),
  order("g1gs17", 2, ["Ordne die Wörter zu einem Satz.", "Put the German words in sentence order.", "Mets les mots allemands dans l'ordre.", "Metti le parole tedesche nell'ordine corretto."], ["Lina", "liest", "ein", "Buch", "."]),
  order("g1gs18", 2, ["Ordne die Wörter zu einem Satz.", "Put the German words in sentence order.", "Mets les mots allemands dans l'ordre.", "Metti le parole tedesche nell'ordine corretto."], ["Im", "Garten", "blühen", "Blumen", "."]),
  order("g1gs19", 2, ["Ordne die Wörter zu einer Frage.", "Put the German words in question order.", "Mets les mots allemands dans l'ordre d'une question.", "Metti le parole tedesche nell'ordine di una domanda."], ["Wo", "ist", "mein", "Ball", "?"]),
  order("g1gs20", 2, ["Ordne die Wörter zu einer Bitte.", "Put the German words in order to make a request.", "Mets les mots allemands dans l'ordre pour former une demande.", "Metti le parole tedesche nell'ordine per formare una richiesta."], ["Bitte", "öffne", "das", "Fenster", "."]),
  choice("g1gs21", 2, ["Welcher Satz passt: 🐦 Der Vogel ist zuerst im Nest und fliegt dann los.", "Which German sentence fits: the bird is first in the nest and then flies away?", "Quelle phrase allemande convient : l'oiseau est d'abord au nid puis s'envole ?", "Quale frase tedesca va bene: l'uccello è prima nel nido e poi vola via?"], "Zuerst sitzt der Vogel im Nest. Dann fliegt er los.", ["Zuerst sitzt der Vogel im Nest. Dann fliegt er los.", "Dann sitzt der Vogel im Nest. Zuerst fliegt er los.", "Der Vogel ist ein Fisch.", "Das Nest fliegt davon."]),
  choice("g1gs22", 2, ["Welcher Satz beschreibt das Bild genauer? 🚲", "Which German sentence describes the picture more precisely? 🚲", "Quelle phrase allemande décrit l'image plus précisément ? 🚲", "Quale frase tedesca descrive l'immagine in modo più preciso? 🚲"], "Noah fährt mit dem roten Velo.", ["Noah fährt mit dem roten Velo.", "Noah ist da.", "Etwas fährt.", "Rot Noah Velo."]),
  choice("g1gs23", 2, ["Welcher Satz beschreibt das Bild genauer? 🐈🌳", "Which German sentence describes the picture more precisely? 🐈🌳", "Quelle phrase allemande décrit l'image plus précisément ? 🐈🌳", "Quale frase tedesca descrive l'immagine in modo più preciso? 🐈🌳"], "Die schwarze Katze sitzt unter dem Baum.", ["Die schwarze Katze sitzt unter dem Baum.", "Die Katze ist irgendwo.", "Der Baum sitzt auf der Katze.", "Schwarz unter sitzt."]),
  choice("g1gs24", 2, ["Welche Ergänzung macht den Satz genauer? «Mia malt ___.»", "Which addition makes the German sentence more precise?", "Quel complément rend la phrase allemande plus précise ?", "Quale aggiunta rende la frase tedesca più precisa?"], "ein grosses gelbes Haus", ["ein grosses gelbes Haus", "malt", "Mia", "und aber"]),
  choice("g1gs25", 2, ["Welche Ergänzung passt? «Der Hund rennt ___.»", "Which addition fits the German sentence?", "Quel complément convient à la phrase allemande ?", "Quale aggiunta va bene nella frase tedesca?"], "schnell über die Wiese", ["schnell über die Wiese", "einen blauen", "weil und", "die Hund"]),
  fill("g1gs26", 2, ["Verbinde: «Lea singt. Lea tanzt.» → «Lea singt ___ tanzt.»", "Join the German sentences: «Lea singt. Lea tanzt.» → «Lea singt ___ tanzt.»", "Relie les phrases allemandes : «Lea singt. Lea tanzt.» → «Lea singt ___ tanzt.»", "Unisci le frasi tedesche: «Lea singt. Lea tanzt.» → «Lea singt ___ tanzt.»"], "und"),
  fill("g1gs27", 2, ["Verbinde: «Ich packe Brot ein. Ich packe einen Apfel ein.» → «Ich packe Brot ___ einen Apfel ein.»", "Join the German sentences: «Ich packe Brot ein. Ich packe einen Apfel ein.» → «Ich packe Brot ___ einen Apfel ein.»", "Relie les phrases allemandes : «Ich packe Brot ein. Ich packe einen Apfel ein.» → «Ich packe Brot ___ einen Apfel ein.»", "Unisci le frasi tedesche: «Ich packe Brot ein. Ich packe einen Apfel ein.» → «Ich packe Brot ___ einen Apfel ein.»"], "und"),
  fill("g1gs28", 2, ["Ergänze die Reihenfolge: «Zuerst ziehe ich die Schuhe an. ___ gehe ich hinaus.»", "Complete the German sequence: «Zuerst ziehe ich die Schuhe an. ___ gehe ich hinaus.»", "Complète la suite allemande : «Zuerst ziehe ich die Schuhe an. ___ gehe ich hinaus.»", "Completa la sequenza tedesca: «Zuerst ziehe ich die Schuhe an. ___ gehe ich hinaus.»"], "Dann"),
  fill("g1gs29", 2, ["Ergänze die Reihenfolge: «Zuerst wasche ich den Apfel. ___ esse ich ihn.»", "Complete the German sequence: «Zuerst wasche ich den Apfel. ___ esse ich ihn.»", "Complète la suite allemande : «Zuerst wasche ich den Apfel. ___ esse ich ihn.»", "Completa la sequenza tedesca: «Zuerst wasche ich den Apfel. ___ esse ich ihn.»"], "Dann"),
  fill("g1gs30", 2, ["Wähle und ergänze: «Es regnet. ___ nehme ich den Schirm.» (Darum/Aber)", "Choose and complete the German text: «Es regnet. ___ nehme ich den Schirm.» (Darum/Aber)", "Choisis et complète le texte allemand : «Es regnet. ___ nehme ich den Schirm.» (Darum/Aber)", "Scegli e completa il testo tedesco: «Es regnet. ___ nehme ich den Schirm.» (Darum/Aber)"], "Darum"),
  choice("g1gs31", 2, ["Welche Anrede passt auf eine Karte an Mia?", "Which German greeting fits a card to Mia?", "Quelle formule allemande convient à une carte pour Mia ?", "Quale saluto tedesco va bene su un biglietto per Mia?"], "Liebe Mia", ["Liebe Mia", "Einkaufsliste", "Ende", "Montag Brot"]),
  choice("g1gs32", 2, ["Welcher Gruss passt ans Ende einer Karte?", "Which German closing fits the end of a card?", "Quelle formule allemande convient à la fin d'une carte ?", "Quale saluto tedesco va bene alla fine di un biglietto?"], "Liebe Grüsse, Noah", ["Liebe Grüsse, Noah", "Liebe Mia", "Einkaufsliste", "Es war einmal"]),
  choice("g1gs33", 2, ["Welche Wunschliste ist klar geschrieben?", "Which German wish list is clear?", "Quelle liste de souhaits allemande est claire ?", "Quale lista dei desideri tedesca è scritta chiaramente?"], "Buch, Ball, Farbstifte", ["Buch, Ball, Farbstifte", "Ich und weil.", "Ball spielt Buch.", "Wünsche sind."]),
  choice("g1gs34", 2, ["Welche Namenskarte ist vollständig?", "Which German name card is complete?", "Quelle carte de nom allemande est complète ?", "Quale cartellino tedesco è completo?"], "Name: Amir", ["Name: Amir", "Amir weil", "Name und", "Ist Amir?"]),
  choice("g1gs35", 2, ["Welche Dankeskarte ist klar?", "Which German thank-you card is clear?", "Quelle carte de remerciement allemande est claire ?", "Quale biglietto di ringraziamento tedesco è chiaro?"], "Danke für das schöne Geschenk!", ["Danke für das schöne Geschenk!", "Geschenk danke das.", "Für und schön.", "Das Geschenk?"]),

  // Hard: order and improve tiny texts (15)
  choice("g1gs36", 3, ["Welche Reihenfolge ergibt eine kleine Geschichte?", "Which order makes a short German story?", "Quel ordre forme une petite histoire allemande ?", "Quale ordine forma una piccola storia tedesca?"], "1. Der Ball rollt weg. 2. Mia läuft hinterher. 3. Sie fängt ihn.", ["1. Der Ball rollt weg. 2. Mia läuft hinterher. 3. Sie fängt ihn.", "1. Sie fängt ihn. 2. Der Ball rollt weg. 3. Mia schläft.", "1. Mia läuft. 2. Der Ball schläft. 3. Sie isst ihn.", "1. Der Ball rollt. 2. Ende. 3. Zuerst."]),
  choice("g1gs37", 3, ["Welche Reihenfolge ergibt eine kleine Geschichte?", "Which order makes a short German story?", "Quel ordre forme une petite histoire allemande ?", "Quale ordine forma una piccola storia tedesca?"], "1. Es beginnt zu regnen. 2. Leo öffnet den Schirm. 3. Er bleibt trocken.", ["1. Es beginnt zu regnen. 2. Leo öffnet den Schirm. 3. Er bleibt trocken.", "1. Leo bleibt trocken. 2. Er wirft den Schirm weg. 3. Dann regnet es vorher.", "1. Der Schirm regnet. 2. Leo öffnet trocken. 3. Ende.", "1. Leo schläft. 2. Es regnet im Bett. 3. Der Schirm isst."]),
  choice("g1gs38", 3, ["Welche Reihenfolge ergibt eine kleine Geschichte?", "Which order makes a short German story?", "Quel ordre forme une petite histoire allemande ?", "Quale ordine forma una piccola storia tedesca?"], "1. Sara pflanzt einen Samen. 2. Sie giesst ihn. 3. Eine Blume wächst.", ["1. Sara pflanzt einen Samen. 2. Sie giesst ihn. 3. Eine Blume wächst.", "1. Die Blume wächst. 2. Sara pflanzt später. 3. Der Samen verschwindet zuerst.", "1. Sara giesst. 2. Eine Blume pflanzt Sara. 3. Samen.", "1. Der Samen liest. 2. Sara wächst. 3. Wasser pflanzt."]),
  choice("g1gs39", 3, ["Welcher Anfang passt zu einer Geschichte über einen verlorenen Schlüssel?", "Which German beginning fits a story about a lost key?", "Quel début allemand convient à une histoire de clé perdue ?", "Quale inizio tedesco va bene per una storia su una chiave persa?"], "Am Morgen findet Ben seinen Schlüssel nicht.", ["Am Morgen findet Ben seinen Schlüssel nicht.", "Der Kuchen schmeckt süss.", "Im Meer lebt ein Wal.", "Die Sonne ist ein Stern."]),
  choice("g1gs40", 3, ["Welches Ende passt? «Nina sucht ihre Mütze. Sie schaut unter das Bett.»", "Which German ending fits the text?", "Quelle fin allemande convient au texte ?", "Quale finale tedesco va bene per il testo?"], "Dort findet sie die Mütze.", ["Dort findet sie die Mütze.", "Darum fliegt der Fisch.", "Dann beginnt gestern.", "Die Mütze sucht Nina."]),
  choice("g1gs41", 3, ["Welcher Titel passt? «Ein Hund rennt zum Teich. Er springt ins Wasser und holt einen Stock.»", "Which German title fits the text?", "Quel titre allemand convient au texte ?", "Quale titolo tedesco va bene per il testo?"], "Der mutige Hund", ["Der mutige Hund", "Meine Einkaufsliste", "Schnee im Sommer", "Ein stilles Buch"]),
  choice("g1gs42", 3, ["Welcher Titel passt? «Lina backt mit ihrem Vater einen Kuchen.»", "Which German title fits the text?", "Quel titre allemand convient au texte ?", "Quale titolo tedesco va bene per il testo?"], "Kuchen backen", ["Kuchen backen", "Im Schwimmbad", "Der verlorene Ball", "Eine Reise zum Mond"]),
  choice("g1gs43", 3, ["Welcher Satz macht die Geschichte klarer? «Noah sieht etwas.»", "Which German sentence makes the story clearer?", "Quelle phrase allemande rend l'histoire plus claire ?", "Quale frase tedesca rende la storia più chiara?"], "Noah sieht einen kleinen Igel im Laub.", ["Noah sieht einen kleinen Igel im Laub.", "Etwas ist etwas.", "Noah sieht.", "Im klein Noah."]),
  choice("g1gs44", 3, ["Welcher Satz macht die Notiz klarer? «Bin weg.»", "Which German sentence makes the note clearer?", "Quelle phrase allemande rend la note plus claire ?", "Quale frase tedesca rende la nota più chiara?"], "Ich bin auf dem Spielplatz und komme um fünf zurück.", ["Ich bin auf dem Spielplatz und komme um fünf zurück.", "Bin weg.", "Spielplatz fünf.", "Zurück und bin."]),
  choice("g1gs45", 3, ["Welche Verbesserung ist richtig? «mia spielt im garten»", "Which correction of the German sentence is right?", "Quelle correction de la phrase allemande est juste ?", "Quale correzione della frase tedesca è giusta?"], "Mia spielt im Garten.", ["Mia spielt im Garten.", "mia spielt im Garten", "Mia Spielt im garten.", "Mia spielt im garten,"]),
  choice("g1gs46", 3, ["Welche Verbesserung ist richtig? «der hase rennt»", "Which correction of the German sentence is right?", "Quelle correction de la phrase allemande est juste ?", "Quale correzione della frase tedesca è giusta?"], "Der Hase rennt.", ["Der Hase rennt.", "der Hase rennt", "Der hase Rennt.", "Der Hase rennt?"]),
  choice("g1gs47", 3, ["Welche Verbesserung ist richtig? «wo ist mein heft.»", "Which correction of the German question is right?", "Quelle correction de la question allemande est juste ?", "Quale correzione della domanda tedesca è giusta?"], "Wo ist mein Heft?", ["Wo ist mein Heft?", "wo ist mein Heft.", "Wo ist mein heft.", "Wo ist mein Heft,"]),
  choice("g1gs48", 3, ["Welches Wort vermeidet die Wiederholung? «Lina hat einen Ball. Lina wirft den Ball.»", "Which German word avoids repetition?", "Quel mot allemand évite la répétition ?", "Quale parola tedesca evita la ripetizione?"], "Sie", ["Sie", "Und", "Ball", "Dann"]),
  fill("g1gs49", 3, ["Ersetze die Wiederholung: «Tom sieht den Hund. ___ streichelt ihn.»", "Replace the repetition in the German text: «Tom sieht den Hund. ___ streichelt ihn.»", "Remplace la répétition dans le texte allemand : «Tom sieht den Hund. ___ streichelt ihn.»", "Sostituisci la ripetizione nel testo tedesco: «Tom sieht den Hund. ___ streichelt ihn.»"], "Er"),
  choice("g1gs50", 3, ["Welche Mini-Geschichte ist vollständig?", "Which short German story is complete?", "Quelle petite histoire allemande est complète ?", "Quale piccola storia tedesca è completa?"], "Zuerst baut Mia einen Turm. Dann fällt er um. Mia baut ihn noch einmal.", ["Zuerst baut Mia einen Turm. Dann fällt er um. Mia baut ihn noch einmal.", "Dann Turm. Zuerst Mia.", "Mia baut, weil aber.", "Der Turm ist. Ende zuerst."]),
];

const guidedCompositionGrade1: Topic = {
  id: "gefuehrtes-schreiben-1",
  title: "Sätze & kleine Texte",
  emoji: "✍️",
  exercises: exercises.map((exercise, index) => index < 3 ? { ...exercise, free: true } : exercise),
};

export default guidedCompositionGrade1;
