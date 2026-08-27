import { Exercise, Topic } from "@/types/exercise";

type Localised = [de: string, en: string, fr: string, it: string];

const safeHints: Record<"de" | "en" | "fr" | "it", [string, string]> = {
  de: ["Lies die Angaben sorgfältig ab.", "Prüfe, welche Information wirklich gefragt ist."],
  en: ["Read the information carefully.", "Check which piece of information is actually requested."],
  fr: ["Lis attentivement les informations.", "Vérifie quelle information est vraiment demandée."],
  it: ["Leggi attentamente le informazioni.", "Controlla quale informazione viene davvero richiesta."],
};

function fill(id: string, difficulty: 1 | 2 | 3, questions: Localised, answer: string): Exercise {
  return {
    id,
    type: "fill-in-blank",
    difficulty,
    question: questions[0],
    questionEN: questions[1],
    questionFR: questions[2],
    questionIT: questions[3],
    answer,
    answerEN: answer,
    answerFR: answer,
    answerIT: answer,
    hints: safeHints.de,
    hintsEN: safeHints.en,
    hintsFR: safeHints.fr,
    hintsIT: safeHints.it,
  };
}

function choice(
  id: string,
  difficulty: 1 | 2 | 3,
  questions: Localised,
  answers: Localised,
  options: [Localised, Localised, Localised, Localised],
): Exercise {
  return {
    id,
    type: "multiple-choice",
    difficulty,
    question: questions[0],
    questionEN: questions[1],
    questionFR: questions[2],
    questionIT: questions[3],
    answer: answers[0],
    answerEN: answers[1],
    answerFR: answers[2],
    answerIT: answers[3],
    options: options.map(option => option[0]),
    optionsEN: options.map(option => option[1]),
    optionsFR: options.map(option => option[2]),
    optionsIT: options.map(option => option[3]),
    hints: safeHints.de,
    hintsEN: safeHints.en,
    hintsFR: safeHints.fr,
    hintsIT: safeHints.it,
  };
}

const universal = (value: string): Localised => [value, value, value, value];

const exercises: Exercise[] = [
  // Easy: read simple tables, pictograms and probability language (15)
  fill("g4dz1", 1, ["Tabelle Haustiere: Hund 6, Katze 9, Fisch 4. Wie viele Kinder nannten eine Katze? ___", "Pet table: dog 6, cat 9, fish 4. How many children named a cat? ___", "Tableau des animaux : chien 6, chat 9, poisson 4. Combien d'enfants ont choisi le chat ? ___", "Tabella degli animali: cane 6, gatto 9, pesce 4. Quanti bambini hanno scelto il gatto? ___"], "9"),
  fill("g4dz2", 1, ["Tabelle Lieblingsobst: Apfel 8, Banane 5, Birne 3. Wie viele Stimmen gibt es insgesamt? ___", "Favourite fruit table: apple 8, banana 5, pear 3. How many votes are there altogether? ___", "Tableau des fruits préférés : pomme 8, banane 5, poire 3. Combien y a-t-il de voix au total ? ___", "Tabella della frutta preferita: mela 8, banana 5, pera 3. Quanti voti ci sono in totale? ___"], "16"),
  choice("g4dz3", 1, ["Säulendiagramm Bücher: Mo 4, Di 7, Mi 5. An welchem Tag wurden 7 Bücher gelesen?", "Book bar chart: Mon 4, Tue 7, Wed 5. On which day were 7 books read?", "Diagramme des livres : lun. 4, mar. 7, mer. 5. Quel jour 7 livres ont-ils été lus ?", "Diagramma dei libri: lun 4, mar 7, mer 5. In quale giorno sono stati letti 7 libri?"], ["Dienstag", "Tuesday", "mardi", "martedì"], [["Montag", "Monday", "lundi", "lunedì"], ["Dienstag", "Tuesday", "mardi", "martedì"], ["Mittwoch", "Wednesday", "mercredi", "mercoledì"], ["an allen Tagen", "on every day", "tous les jours", "in tutti i giorni"]]),
  choice("g4dz4", 1, ["Säulendiagramm Schritte: Lea 5'000, Amir 7'000, Noah 6'000. Wer hat am meisten Schritte?", "Step bar chart: Lea 5,000, Amir 7,000, Noah 6,000. Who has the most steps?", "Diagramme des pas : Lea 5 000, Amir 7 000, Noah 6 000. Qui a fait le plus de pas ?", "Diagramma dei passi: Lea 5.000, Amir 7.000, Noah 6.000. Chi ha fatto più passi?"], universal("Amir"), [["Lea", "Lea", "Lea", "Lea"], ["Amir", "Amir", "Amir", "Amir"], ["Noah", "Noah", "Noah", "Noah"], ["alle gleich", "all the same", "tous pareil", "tutti uguali"]]),
  fill("g4dz5", 1, ["Piktogramm: Ein ★ steht für 2 Kinder. Bei Velo stehen ★★★★. Wie viele Kinder fahren Velo? ___", "Pictogram: one ★ represents 2 children. Cycling has ★★★★. How many children cycle? ___", "Pictogramme : une ★ représente 2 enfants. Le vélo a ★★★★. Combien d'enfants vont à vélo ? ___", "Pittogramma: una ★ rappresenta 2 bambini. La bicicletta ha ★★★★. Quanti bambini vanno in bicicletta? ___"], "8"),
  fill("g4dz6", 1, ["Strichliste Würfelzahl 4: ||||| ||. Wie oft wurde die 4 gewürfelt? ___", "Tally for rolling a 4: ||||| ||. How many times was 4 rolled? ___", "Bâtons pour le résultat 4 : ||||| ||. Combien de fois le 4 est-il sorti ? ___", "Conteggio del risultato 4: ||||| ||. Quante volte è uscito il 4? ___"], "7"),
  choice("g4dz7", 1, ["In einem Beutel liegen nur rote Kugeln. Wie sicher ist es, eine rote Kugel zu ziehen?", "A bag contains only red balls. How certain is it that a red ball will be drawn?", "Un sac contient seulement des boules rouges. À quel point est-il certain de tirer une boule rouge ?", "Un sacchetto contiene solo palline rosse. Quanto è certo estrarre una pallina rossa?"], ["sicher", "certain", "certain", "certo"], [["unmöglich", "impossible", "impossible", "impossibile"], ["sicher", "certain", "certain", "certo"], ["wenig wahrscheinlich", "unlikely", "peu probable", "poco probabile"], ["nicht bestimmbar", "cannot be determined", "impossible à déterminer", "non determinabile"]]),
  choice("g4dz8", 1, ["Wie wahrscheinlich ist es, mit einem normalen Würfel eine 7 zu würfeln?", "How likely is it to roll a 7 on a standard die?", "Quelle est la probabilité d'obtenir 7 avec un dé normal ?", "Quanto è probabile ottenere 7 con un dado normale?"], ["unmöglich", "impossible", "impossible", "impossibile"], [["sicher", "certain", "certain", "certo"], ["wahrscheinlich", "likely", "probable", "probabile"], ["unmöglich", "impossible", "impossible", "impossibile"], ["gleich wahrscheinlich", "equally likely", "aussi probable", "altrettanto probabile"]]),
  choice("g4dz9", 1, ["Eine faire Münze wird einmal geworfen. Was kann passieren?", "A fair coin is tossed once. What can happen?", "On lance une pièce équilibrée une fois. Que peut-il arriver ?", "Si lancia una moneta equilibrata una volta. Cosa può succedere?"], ["Kopf oder Zahl", "heads or tails", "pile ou face", "testa o croce"], [["nur Kopf", "heads only", "seulement pile", "solo testa"], ["nur Zahl", "tails only", "seulement face", "solo croce"], ["Kopf oder Zahl", "heads or tails", "pile ou face", "testa o croce"], ["eine 6", "a six", "un 6", "un 6"]]),
  fill("g4dz10", 1, ["Temperaturtabelle: Mo 12 °C, Di 15 °C, Mi 11 °C. Wie viele Grad wärmer war es am Dienstag als am Mittwoch? ___", "Temperature table: Mon 12°C, Tue 15°C, Wed 11°C. How many degrees warmer was Tuesday than Wednesday? ___", "Tableau des températures : lun. 12 °C, mar. 15 °C, mer. 11 °C. Combien de degrés de plus mardi que mercredi ? ___", "Tabella delle temperature: lun 12 °C, mar 15 °C, mer 11 °C. Quanti gradi in più martedì rispetto a mercoledì? ___"], "4"),
  choice("g4dz11", 1, ["Tabelle Schulweg: zu Fuss 7, Velo 5, Bus 8. Welche Gruppe ist am kleinsten?", "Travel-to-school table: walk 7, bicycle 5, bus 8. Which group is smallest?", "Tableau du trajet scolaire : à pied 7, vélo 5, bus 8. Quel groupe est le plus petit ?", "Tabella del tragitto scolastico: a piedi 7, bicicletta 5, bus 8. Qual è il gruppo più piccolo?"], ["Velo", "bicycle", "vélo", "bicicletta"], [["zu Fuss", "walk", "à pied", "a piedi"], ["Velo", "bicycle", "vélo", "bicicletta"], ["Bus", "bus", "bus", "bus"], ["alle gleich", "all the same", "tous pareil", "tutti uguali"]]),
  fill("g4dz12", 1, ["Piktogramm: Ein ● steht für 5 Minuten. Für Lesen stehen ●●●. Wie viele Minuten wurde gelesen? ___", "Pictogram: one ● represents 5 minutes. Reading has ●●●. How many minutes were spent reading? ___", "Pictogramme : un ● représente 5 minutes. La lecture a ●●●. Combien de minutes de lecture ? ___", "Pittogramma: un ● rappresenta 5 minuti. La lettura ha ●●●. Quanti minuti di lettura? ___"], "15"),
  choice("g4dz13", 1, ["Ein Beutel enthält 5 blaue und 1 gelbe Kugel. Welche Farbe wird eher gezogen?", "A bag contains 5 blue and 1 yellow ball. Which colour is more likely to be drawn?", "Un sac contient 5 boules bleues et 1 jaune. Quelle couleur a le plus de chances d'être tirée ?", "Un sacchetto contiene 5 palline blu e 1 gialla. Quale colore è più probabile estrarre?"], ["blau", "blue", "bleu", "blu"], [["blau", "blue", "bleu", "blu"], ["gelb", "yellow", "jaune", "giallo"], ["beide gleich", "both equally", "les deux pareil", "entrambi uguali"], ["keine", "neither", "aucune", "nessuno"]]),
  fill("g4dz14", 1, ["Tabelle Regenmenge: Mo 2 mm, Di 0 mm, Mi 6 mm. Wie viel Regen fiel an allen drei Tagen zusammen? ___", "Rainfall table: Mon 2 mm, Tue 0 mm, Wed 6 mm. How much rain fell over all three days? ___", "Tableau des pluies : lun. 2 mm, mar. 0 mm, mer. 6 mm. Combien de pluie est tombée en trois jours ? ___", "Tabella della pioggia: lun 2 mm, mar 0 mm, mer 6 mm. Quanta pioggia è caduta nei tre giorni? ___"], "8 mm"),
  choice("g4dz15", 1, ["Welcher Titel passt zu einer Tabelle mit den Spalten Tag und Temperatur?", "Which title suits a table with the columns day and temperature?", "Quel titre convient à un tableau avec les colonnes jour et température ?", "Quale titolo si adatta a una tabella con le colonne giorno e temperatura?"], ["Temperaturen der Woche", "Temperatures during the week", "Températures de la semaine", "Temperature della settimana"], [["Temperaturen der Woche", "Temperatures during the week", "Températures de la semaine", "Temperature della settimana"], ["Lieblingsfarben", "Favourite colours", "Couleurs préférées", "Colori preferiti"], ["Bücher im Regal", "Books on the shelf", "Livres sur l'étagère", "Libri sullo scaffale"], ["Würfelergebnisse", "Dice results", "Résultats des dés", "Risultati dei dadi"]]),

  // Medium: scales, comparisons, tables and recorded chance experiments (20)
  fill("g4dz16", 2, ["Säulendiagramm Punkte: Rot 18, Blau 25, Grün 21. Wie viele Punkte mehr hat Blau als Rot? ___", "Points bar chart: red 18, blue 25, green 21. How many more points does blue have than red? ___", "Diagramme des points : rouge 18, bleu 25, vert 21. Combien de points de plus pour le bleu que pour le rouge ? ___", "Diagramma dei punti: rosso 18, blu 25, verde 21. Quanti punti in più ha il blu rispetto al rosso? ___"], "7"),
  fill("g4dz17", 2, ["Piktogramm: Ein ▲ steht für 3 Velos. Montag ▲▲, Dienstag ▲▲▲▲. Wie viele Velos sind es zusammen? ___", "Pictogram: one ▲ represents 3 bicycles. Monday ▲▲, Tuesday ▲▲▲▲. How many bicycles altogether? ___", "Pictogramme : un ▲ représente 3 vélos. Lundi ▲▲, mardi ▲▲▲▲. Combien de vélos au total ? ___", "Pittogramma: un ▲ rappresenta 3 biciclette. Lunedì ▲▲, martedì ▲▲▲▲. Quante biciclette in totale? ___"], "18"),
  choice("g4dz18", 2, ["In einer Urne liegen 4 rote, 4 blaue und 1 grüne Kugel. Welche Aussage stimmt?", "An urn contains 4 red, 4 blue and 1 green ball. Which statement is correct?", "Une urne contient 4 boules rouges, 4 bleues et 1 verte. Quelle affirmation est correcte ?", "Un'urna contiene 4 palline rosse, 4 blu e 1 verde. Quale affermazione è corretta?"], ["Rot und Blau sind gleich wahrscheinlich.", "Red and blue are equally likely.", "Le rouge et le bleu sont aussi probables.", "Rosso e blu sono ugualmente probabili."], [["Grün ist am wahrscheinlichsten.", "Green is most likely.", "Le vert est le plus probable.", "Il verde è il più probabile."], ["Rot und Blau sind gleich wahrscheinlich.", "Red and blue are equally likely.", "Le rouge et le bleu sont aussi probables.", "Rosso e blu sono ugualmente probabili."], ["Blau ist unmöglich.", "Blue is impossible.", "Le bleu est impossible.", "Il blu è impossibile."], ["Alle Farben sind gleich wahrscheinlich.", "All colours are equally likely.", "Toutes les couleurs sont aussi probables.", "Tutti i colori sono ugualmente probabili."]]),
  fill("g4dz19", 2, ["Ein Würfel wurde 20-mal geworfen. Die 6 kam 4-mal. Wie viele Würfe zeigten keine 6? ___", "A die was rolled 20 times. Six appeared 4 times. How many rolls did not show six? ___", "Un dé a été lancé 20 fois. Le 6 est sorti 4 fois. Combien de lancers n'ont pas donné 6 ? ___", "Un dado è stato lanciato 20 volte. Il 6 è uscito 4 volte. Quanti lanci non hanno dato 6? ___"], "16"),
  fill("g4dz20", 2, ["Strichliste Münze: Kopf 12, Zahl 8. Wie viele Würfe wurden protokolliert? ___", "Coin tally: heads 12, tails 8. How many tosses were recorded? ___", "Bilan des pièces : pile 12, face 8. Combien de lancers ont été notés ? ___", "Conteggio della moneta: testa 12, croce 8. Quanti lanci sono stati registrati? ___"], "20"),
  choice("g4dz21", 2, ["Ein Glücksrad hat 8 gleich grosse Felder: 4 rot, 2 blau, 2 gelb. Welche Farbe ist am wahrscheinlichsten?", "A spinner has 8 equal sections: 4 red, 2 blue, 2 yellow. Which colour is most likely?", "Une roue a 8 secteurs égaux : 4 rouges, 2 bleus, 2 jaunes. Quelle couleur est la plus probable ?", "Una ruota ha 8 settori uguali: 4 rossi, 2 blu, 2 gialli. Quale colore è più probabile?"], ["rot", "red", "rouge", "rosso"], [["rot", "red", "rouge", "rosso"], ["blau", "blue", "bleu", "blu"], ["gelb", "yellow", "jaune", "giallo"], ["alle gleich", "all the same", "toutes pareil", "tutti uguali"]]),
  fill("g4dz22", 2, ["Tabelle Bibliothek: Montag 24 Ausleihen, Dienstag 31, Mittwoch 28. Wie viele Ausleihen fehlen am Montag bis zum Dienstagwert? ___", "Library table: Monday 24 loans, Tuesday 31, Wednesday 28. How many more loans would Monday need to equal Tuesday? ___", "Tableau de la bibliothèque : lundi 24 prêts, mardi 31, mercredi 28. Combien manque-t-il lundi pour atteindre mardi ? ___", "Tabella della biblioteca: lunedì 24 prestiti, martedì 31, mercoledì 28. Quanti prestiti mancano lunedì per raggiungere martedì? ___"], "7"),
  fill("g4dz23", 2, ["Ein Säulendiagramm nutzt die Skala 0, 5, 10, 15, 20. Eine Säule endet genau zwischen 10 und 15. Welchen Wert zeigt sie? ___", "A bar chart uses the scale 0, 5, 10, 15, 20. A bar ends halfway between 10 and 15. What value does it show? ___", "Un diagramme utilise l'échelle 0, 5, 10, 15, 20. Une barre s'arrête à mi-chemin entre 10 et 15. Quelle valeur indique-t-elle ? ___", "Un diagramma usa la scala 0, 5, 10, 15, 20. Una barra finisce a metà tra 10 e 15. Quale valore indica? ___"], "12,5"),
  choice("g4dz24", 2, ["Welche Darstellung eignet sich am besten, um die Anzahl Haustiere in vier Gruppen zu vergleichen?", "Which display is best for comparing the number of pets in four groups?", "Quelle représentation convient le mieux pour comparer le nombre d'animaux dans quatre groupes ?", "Quale rappresentazione è più adatta per confrontare il numero di animali in quattro gruppi?"], ["Säulendiagramm", "bar chart", "diagramme en barres", "diagramma a barre"], [["Säulendiagramm", "bar chart", "diagramme en barres", "diagramma a barre"], ["Wegbeschreibung", "route description", "itinéraire", "descrizione del percorso"], ["Kalender", "calendar", "calendrier", "calendario"], ["Rezept", "recipe", "recette", "ricetta"]]),
  fill("g4dz25", 2, ["Messreihe Pflanzenhöhe: Woche 1 = 8 cm, Woche 2 = 11 cm, Woche 3 = 15 cm. Um wie viele Zentimeter wuchs die Pflanze insgesamt? ___", "Plant-height data: week 1 = 8 cm, week 2 = 11 cm, week 3 = 15 cm. How many centimetres did the plant grow altogether? ___", "Mesures de la plante : semaine 1 = 8 cm, semaine 2 = 11 cm, semaine 3 = 15 cm. De combien de centimètres a-t-elle grandi au total ? ___", "Misure della pianta: settimana 1 = 8 cm, settimana 2 = 11 cm, settimana 3 = 15 cm. Di quanti centimetri è cresciuta in totale? ___"], "7 cm"),
  choice("g4dz26", 2, ["Eine Münze wurde 10-mal geworfen und zeigte 7-mal Kopf. Was darf man sicher sagen?", "A coin was tossed 10 times and showed heads 7 times. What can be stated with certainty?", "Une pièce a été lancée 10 fois et a donné pile 7 fois. Que peut-on affirmer avec certitude ?", "Una moneta è stata lanciata 10 volte e ha dato testa 7 volte. Cosa si può affermare con certezza?"], ["In diesem Versuch kam Kopf häufiger vor.", "Heads occurred more often in this experiment.", "Dans cette expérience, pile est sorti plus souvent.", "In questo esperimento è uscita più spesso testa."], [["Kopf kommt immer häufiger.", "Heads will always occur more often.", "Pile sortira toujours plus souvent.", "Testa uscirà sempre più spesso."], ["Die Münze hat keine Zahlseite.", "The coin has no tails side.", "La pièce n'a pas de face.", "La moneta non ha il lato croce."], ["In diesem Versuch kam Kopf häufiger vor.", "Heads occurred more often in this experiment.", "Dans cette expérience, pile est sorti plus souvent.", "In questo esperimento è uscita più spesso testa."], ["Der nächste Wurf ist sicher Kopf.", "The next toss is certainly heads.", "Le prochain lancer donnera sûrement pile.", "Il prossimo lancio darà sicuramente testa."]]),
  fill("g4dz27", 2, ["Tabelle Ballwurfweiten: 12 m, 15 m, 11 m, 14 m. Wie gross ist die grösste Weite? ___", "Ball-throw distances: 12 m, 15 m, 11 m, 14 m. What is the greatest distance? ___", "Distances de lancer : 12 m, 15 m, 11 m, 14 m. Quelle est la plus grande distance ? ___", "Distanze di lancio: 12 m, 15 m, 11 m, 14 m. Qual è la distanza maggiore? ___"], "15 m"),
  fill("g4dz28", 2, ["Tabelle Ballwurfweiten: 12 m, 15 m, 11 m, 14 m. Wie gross ist der Unterschied zwischen Maximum und Minimum? ___", "Ball-throw distances: 12 m, 15 m, 11 m, 14 m. What is the difference between maximum and minimum? ___", "Distances de lancer : 12 m, 15 m, 11 m, 14 m. Quelle est la différence entre le maximum et le minimum ? ___", "Distanze di lancio: 12 m, 15 m, 11 m, 14 m. Qual è la differenza tra massimo e minimo? ___"], "4 m"),
  choice("g4dz29", 2, ["Ein Beutel enthält 3 Sterne, 3 Kreise und 3 Dreiecke. Welche Form ist am wahrscheinlichsten?", "A bag contains 3 stars, 3 circles and 3 triangles. Which shape is most likely?", "Un sac contient 3 étoiles, 3 cercles et 3 triangles. Quelle forme est la plus probable ?", "Un sacchetto contiene 3 stelle, 3 cerchi e 3 triangoli. Quale forma è più probabile?"], ["alle gleich wahrscheinlich", "all equally likely", "toutes aussi probables", "tutte ugualmente probabili"], [["Stern", "star", "étoile", "stella"], ["Kreis", "circle", "cercle", "cerchio"], ["Dreieck", "triangle", "triangle", "triangolo"], ["alle gleich wahrscheinlich", "all equally likely", "toutes aussi probables", "tutte ugualmente probabili"]]),
  fill("g4dz30", 2, ["Ein Diagramm zeigt 14 rote, 9 blaue und 7 grüne Murmeln. Wie viele Murmeln sind dargestellt? ___", "A chart shows 14 red, 9 blue and 7 green marbles. How many marbles are shown? ___", "Un diagramme montre 14 billes rouges, 9 bleues et 7 vertes. Combien de billes sont représentées ? ___", "Un diagramma mostra 14 biglie rosse, 9 blu e 7 verdi. Quante biglie sono rappresentate? ___"], "30"),
  fill("g4dz31", 2, ["Wertetabelle: 1 Heft = CHF 3, 2 Hefte = CHF 6, 3 Hefte = CHF 9. Was kosten 5 Hefte? CHF ___", "Value table: 1 notebook = CHF 3, 2 = CHF 6, 3 = CHF 9. What do 5 notebooks cost? CHF ___", "Tableau de valeurs : 1 cahier = CHF 3, 2 = CHF 6, 3 = CHF 9. Combien coûtent 5 cahiers ? CHF ___", "Tabella dei valori: 1 quaderno = CHF 3, 2 = CHF 6, 3 = CHF 9. Quanto costano 5 quaderni? CHF ___"], "15"),
  fill("g4dz32", 2, ["Eine Tabelle hat die Werte 4, 8, 12, 16. Welcher Wert folgt, wenn das Muster gleich bleibt? ___", "A table contains 4, 8, 12, 16. What value comes next if the pattern continues? ___", "Un tableau contient 4, 8, 12, 16. Quelle valeur vient ensuite si la suite continue ? ___", "Una tabella contiene 4, 8, 12, 16. Quale valore segue se il modello continua? ___"], "20"),
  choice("g4dz33", 2, ["Was muss ein gutes Diagramm unbedingt haben, damit man die Werte versteht?", "What must a good chart include so that its values can be understood?", "Que doit avoir un bon diagramme pour que ses valeurs soient compréhensibles ?", "Che cosa deve avere un buon diagramma perché i valori siano comprensibili?"], ["eine beschriftete Skala", "a labelled scale", "une échelle légendée", "una scala con etichette"], [["eine beschriftete Skala", "a labelled scale", "une échelle légendée", "una scala con etichette"], ["eine erfundene Zahl", "an invented number", "un nombre inventé", "un numero inventato"], ["möglichst viele Farben", "as many colours as possible", "le plus de couleurs possible", "più colori possibile"], ["keinen Titel", "no title", "aucun titre", "nessun titolo"]]),
  fill("g4dz34", 2, ["Ein Glücksrad wurde 30-mal gedreht: Rot 13, Blau 10, Gelb 7. Wie oft kam Blau oder Gelb zusammen? ___", "A spinner was used 30 times: red 13, blue 10, yellow 7. How often did blue or yellow occur altogether? ___", "Une roue a tourné 30 fois : rouge 13, bleu 10, jaune 7. Combien de fois bleu ou jaune au total ? ___", "Una ruota è stata girata 30 volte: rosso 13, blu 10, giallo 7. Quante volte sono usciti blu o giallo in totale? ___"], "17"),
  fill("g4dz35", 2, ["Säulendiagramm Sammelaktion: Klasse A 32 kg, B 27 kg, C 35 kg. Wie viel fehlt Klasse B bis zum Wert von Klasse C? ___", "Collection bar chart: class A 32 kg, B 27 kg, C 35 kg. How much does class B need to reach class C? ___", "Diagramme de collecte : classe A 32 kg, B 27 kg, C 35 kg. Combien manque-t-il à la classe B pour atteindre la classe C ? ___", "Diagramma della raccolta: classe A 32 kg, B 27 kg, C 35 kg. Quanto manca alla classe B per raggiungere la classe C? ___"], "8 kg"),

  // Hard: multi-step interpretation and simple combinatorics (15)
  fill("g4dz36", 3, ["Tabelle Pausengetränke: Wasser 12, Tee 7, Saft 5. Am Freitag wählen 3 Teekinder neu Wasser. Wie viele wählen dann Wasser? ___", "Break-time drinks table: water 12, tea 7, juice 5. On Friday, 3 tea drinkers switch to water. How many choose water then? ___", "Tableau des boissons : eau 12, thé 7, jus 5. Vendredi, 3 enfants passent du thé à l'eau. Combien choisissent alors l'eau ? ___", "Tabella delle bevande: acqua 12, tè 7, succo 5. Venerdì 3 bambini passano dal tè all'acqua. Quanti scelgono allora l'acqua? ___"], "15"),
  fill("g4dz37", 3, ["Piktogramm: Ein ◆ steht für 4 kg. Gruppe A hat ◆◆◆, Gruppe B ◆◆◆◆◆. Wie viele Kilogramm mehr sammelte B? ___", "Pictogram: one ◆ represents 4 kg. Group A has ◆◆◆ and group B ◆◆◆◆◆. How many more kilograms did B collect? ___", "Pictogramme : un ◆ représente 4 kg. Le groupe A a ◆◆◆ et le groupe B ◆◆◆◆◆. Combien de kilogrammes de plus pour B ? ___", "Pittogramma: un ◆ rappresenta 4 kg. Il gruppo A ha ◆◆◆ e il gruppo B ◆◆◆◆◆. Quanti chilogrammi in più ha raccolto B? ___"], "8 kg"),
  choice("g4dz38", 3, ["Zwei Beutel: A enthält 6 rote und 2 blaue Kugeln; B enthält 3 rote und 1 blaue. In welchem Beutel ist Blau im Vergleich zu Rot gleich wahrscheinlich?", "Two bags: A contains 6 red and 2 blue balls; B contains 3 red and 1 blue. In which bag is blue equally likely relative to red?", "Deux sacs : A contient 6 boules rouges et 2 bleues ; B contient 3 rouges et 1 bleue. Dans quel sac le rapport bleu-rouge est-il le même ?", "Due sacchetti: A contiene 6 palline rosse e 2 blu; B contiene 3 rosse e 1 blu. In quale sacchetto il rapporto blu-rosso è uguale?"], ["in beiden", "in both", "dans les deux", "in entrambi"], [["nur in A", "A only", "seulement dans A", "solo in A"], ["nur in B", "B only", "seulement dans B", "solo in B"], ["in beiden", "in both", "dans les deux", "in entrambi"], ["in keinem", "in neither", "dans aucun", "in nessuno"]]),
  fill("g4dz39", 3, ["Messwerte Schulweg in Minuten: 8, 12, 9, 15, 11. Wie viele Werte sind grösser als 10? ___", "Journey-to-school times in minutes: 8, 12, 9, 15, 11. How many values are greater than 10? ___", "Temps de trajet en minutes : 8, 12, 9, 15, 11. Combien de valeurs sont supérieures à 10 ? ___", "Tempi del tragitto in minuti: 8, 12, 9, 15, 11. Quanti valori sono maggiori di 10? ___"], "3"),
  fill("g4dz40", 3, ["In einer Tabelle fehlen 6 Stimmen. Bisher stehen Rot 9, Blau 8, Grün 7; insgesamt wurden 30 Stimmen abgegeben. Wie viele Stimmen hat Gelb? ___", "A table is missing one value. So far: red 9, blue 8, green 7; 30 votes were cast altogether. How many votes has yellow? ___", "Une valeur manque dans un tableau. Rouge 9, bleu 8, vert 7 ; il y a 30 voix au total. Combien de voix pour le jaune ? ___", "In una tabella manca un valore. Rosso 9, blu 8, verde 7; i voti totali sono 30. Quanti voti ha il giallo? ___"], "6"),
  choice("g4dz41", 3, ["Mit den Ziffern 1, 2 und 3 werden zweistellige Zahlen ohne Wiederholung gebildet. Wie viele verschiedene Zahlen sind möglich?", "Two-digit numbers are made from 1, 2 and 3 without repetition. How many different numbers are possible?", "On forme des nombres à deux chiffres avec 1, 2 et 3 sans répétition. Combien de nombres différents sont possibles ?", "Si formano numeri di due cifre con 1, 2 e 3 senza ripetizioni. Quanti numeri diversi sono possibili?"], universal("6"), [universal("3"), universal("4"), universal("6"), universal("9")]),
  fill("g4dz42", 3, ["Ein Würfel wurde 40-mal geworfen. Gerade Zahlen kamen 18-mal. Wie oft kamen ungerade Zahlen? ___", "A die was rolled 40 times. Even numbers occurred 18 times. How often did odd numbers occur? ___", "Un dé a été lancé 40 fois. Les nombres pairs sont sortis 18 fois. Combien de fois les nombres impairs ? ___", "Un dado è stato lanciato 40 volte. I numeri pari sono usciti 18 volte. Quante volte sono usciti i numeri dispari? ___"], "22"),
  choice("g4dz43", 3, ["Eine Klasse befragt 20 Kinder, welche Sportart sie mögen. 8 wählen Fussball, 6 Schwimmen, 4 Tanzen, 2 andere. Welche Aussage stimmt?", "A class asks 20 children which sport they like. 8 choose football, 6 swimming, 4 dancing, 2 another sport. Which statement is correct?", "Une classe demande à 20 enfants leur sport préféré. 8 choisissent le football, 6 la natation, 4 la danse, 2 un autre sport. Quelle affirmation est correcte ?", "Una classe chiede a 20 bambini quale sport preferiscono. 8 scelgono calcio, 6 nuoto, 4 danza, 2 altro. Quale affermazione è corretta?"], ["Fussball hat doppelt so viele Stimmen wie Tanzen.", "Football has twice as many votes as dancing.", "Le football a deux fois plus de voix que la danse.", "Il calcio ha il doppio dei voti della danza."], [["Schwimmen hat die meisten Stimmen.", "Swimming has the most votes.", "La natation a le plus de voix.", "Il nuoto ha più voti."], ["Fussball hat doppelt so viele Stimmen wie Tanzen.", "Football has twice as many votes as dancing.", "Le football a deux fois plus de voix que la danse.", "Il calcio ha il doppio dei voti della danza."], ["Tanzen und andere sind gleich.", "Dancing and other are equal.", "La danse et autre sont à égalité.", "Danza e altro sono uguali."], ["Zusammen sind es 18 Stimmen.", "There are 18 votes altogether.", "Il y a 18 voix au total.", "In totale ci sono 18 voti."]]),
  fill("g4dz44", 3, ["Ein Liniendiagramm zeigt einen Wasserstand: 8 Uhr 24 cm, 10 Uhr 31 cm, 12 Uhr 29 cm. Um wie viele Zentimeter sank er von 10 bis 12 Uhr? ___", "A line chart shows water level: 8:00 24 cm, 10:00 31 cm, 12:00 29 cm. By how many centimetres did it fall from 10:00 to 12:00? ___", "Un graphique montre le niveau d'eau : 8 h 24 cm, 10 h 31 cm, 12 h 29 cm. De combien de centimètres a-t-il baissé entre 10 h et 12 h ? ___", "Un grafico mostra il livello dell'acqua: ore 8 24 cm, ore 10 31 cm, ore 12 29 cm. Di quanti centimetri è sceso dalle 10 alle 12? ___"], "2 cm"),
  fill("g4dz45", 3, ["Wertetabelle: 2 Billette kosten CHF 8, 4 Billette CHF 16. Was kosten 7 Billette bei gleichem Preis pro Stück? CHF ___", "Value table: 2 tickets cost CHF 8 and 4 tickets CHF 16. What do 7 tickets cost at the same unit price? CHF ___", "Tableau de valeurs : 2 billets coûtent CHF 8 et 4 billets CHF 16. Combien coûtent 7 billets au même prix unitaire ? CHF ___", "Tabella dei valori: 2 biglietti costano CHF 8 e 4 biglietti CHF 16. Quanto costano 7 biglietti allo stesso prezzo unitario? CHF ___"], "28"),
  choice("g4dz46", 3, ["Ein Glücksrad hat 10 gleich grosse Felder. 5 sind blau, 3 rot, 2 grün. Welche Reihenfolge geht von wahrscheinlich zu weniger wahrscheinlich?", "A spinner has 10 equal sections: 5 blue, 3 red and 2 green. Which order goes from more likely to less likely?", "Une roue a 10 secteurs égaux : 5 bleus, 3 rouges, 2 verts. Quel ordre va du plus probable au moins probable ?", "Una ruota ha 10 settori uguali: 5 blu, 3 rossi, 2 verdi. Quale ordine va dal più probabile al meno probabile?"], ["Blau – Rot – Grün", "blue – red – green", "bleu – rouge – vert", "blu – rosso – verde"], [["Blau – Rot – Grün", "blue – red – green", "bleu – rouge – vert", "blu – rosso – verde"], ["Grün – Rot – Blau", "green – red – blue", "vert – rouge – bleu", "verde – rosso – blu"], ["Rot – Blau – Grün", "red – blue – green", "rouge – bleu – vert", "rosso – blu – verde"], ["alle gleich", "all the same", "toutes pareil", "tutti uguali"]]),
  fill("g4dz47", 3, ["Tabelle Papierverbrauch: Klasse A 420 Blätter, B 365, C 390. Wie viele Blätter verbrauchten A und C zusammen mehr als B? ___", "Paper-use table: class A 420 sheets, B 365, C 390. How many more sheets did A and C use together than B? ___", "Tableau de consommation de papier : classe A 420 feuilles, B 365, C 390. Combien de feuilles de plus A et C ensemble que B ? ___", "Tabella del consumo di carta: classe A 420 fogli, B 365, C 390. Quanti fogli in più hanno usato insieme A e C rispetto a B? ___"], "445"),
  fill("g4dz48", 3, ["Bei 24 Würfen kam Rot 9-mal, Blau 7-mal und Grün sonst. Wie oft kam Grün? ___", "In 24 trials, red occurred 9 times and blue 7 times; the rest were green. How often did green occur? ___", "Sur 24 essais, rouge est sorti 9 fois et bleu 7 fois ; le reste était vert. Combien de fois vert ? ___", "In 24 prove, rosso è uscito 9 volte e blu 7 volte; il resto era verde. Quante volte è uscito verde? ___"], "8"),
  fill("g4dz49", 3, ["Eine Umfrage hat 36 Antworten. Ein Drittel wählt den Spielplatz, 15 wählen das Schwimmbad, der Rest den Wald. Wie viele wählen den Wald? ___", "A survey has 36 responses. One third choose the playground, 15 choose the swimming pool, and the rest choose the forest. How many choose the forest? ___", "Une enquête a 36 réponses. Un tiers choisit la place de jeux, 15 la piscine et le reste la forêt. Combien choisissent la forêt ? ___", "Un sondaggio ha 36 risposte. Un terzo sceglie il parco giochi, 15 la piscina e il resto il bosco. Quanti scelgono il bosco? ___"], "9"),
  choice("g4dz50", 3, ["Zwei Kinder würfeln je 30-mal. Mia erhält 7 Sechsen, Leo 3. Welche Schlussfolgerung ist korrekt?", "Two children roll a die 30 times each. Mia gets seven sixes and Leo three. Which conclusion is correct?", "Deux enfants lancent chacun un dé 30 fois. Mia obtient sept 6 et Leo trois. Quelle conclusion est correcte ?", "Due bambini lanciano un dado 30 volte ciascuno. Mia ottiene sette 6 e Leo tre. Quale conclusione è corretta?"], ["Mia hatte in diesem Versuch mehr Sechsen.", "Mia got more sixes in this experiment.", "Mia a obtenu plus de 6 dans cette expérience.", "Mia ha ottenuto più 6 in questo esperimento."], [["Mia würfelt immer besser.", "Mia always rolls better.", "Mia lance toujours mieux.", "Mia tira sempre meglio."], ["Leo kann keine 6 würfeln.", "Leo cannot roll a six.", "Leo ne peut pas obtenir 6.", "Leo non può ottenere 6."], ["Mia hatte in diesem Versuch mehr Sechsen.", "Mia got more sixes in this experiment.", "Mia a obtenu plus de 6 dans cette expérience.", "Mia ha ottenuto più 6 in questo esperimento."], ["Der Würfel ist sicher unfair.", "The die is certainly unfair.", "Le dé est certainement truqué.", "Il dado è sicuramente truccato."]]),
];

// Add interactive formats while preserving the 15/20/15 difficulty distribution.
exercises[5] = {
  ...exercises[5],
  type: "number-line",
  answer: "7",
  answerEN: "7",
  answerFR: "7",
  answerIT: "7",
  numberMin: 0,
  numberMax: 10,
  numberStep: 1,
};

exercises[19] = {
  ...exercises[19],
  type: "matching",
  answer: "all",
  answerEN: "all",
  answerFR: "all",
  answerIT: "all",
  pairs: [
    { id: "heads", label: "12", emoji: "🪙" }, { id: "heads-answer", label: "Kopf / Heads / Pile / Testa" },
    { id: "tails", label: "8", emoji: "🪙" }, { id: "tails-answer", label: "Zahl / Tails / Face / Croce" },
  ],
};

exercises[31] = {
  ...exercises[31],
  type: "number-line",
  answer: "20",
  answerEN: "20",
  answerFR: "20",
  answerIT: "20",
  numberMin: 0,
  numberMax: 24,
  numberStep: 4,
};

exercises[40] = {
  ...exercises[40],
  type: "drag-drop",
  question: "Ziehe alle möglichen zweistelligen Zahlen in das Feld.",
  questionEN: "Drag all possible two-digit numbers into the box.",
  questionFR: "Glisse tous les nombres à deux chiffres possibles dans la zone.",
  questionIT: "Trascina nel riquadro tutti i numeri di due cifre possibili.",
  answer: "all",
  answerEN: "all",
  answerFR: "all",
  answerIT: "all",
  dragItems: [
    { id: "n12", label: "12" },
    { id: "n13", label: "13" },
    { id: "n21", label: "21" },
    { id: "n23", label: "23" },
    { id: "n31", label: "31" },
    { id: "n32", label: "32" },
  ],
  dropZones: [
    { id: "valid", label: "möglich / possible / possible / possibile" },
  ],
  dropAnswers: { n12: "valid", n13: "valid", n21: "valid", n23: "valid", n31: "valid", n32: "valid" },
  options: undefined,
  optionsEN: undefined,
  optionsFR: undefined,
  optionsIT: undefined,
};

const grade4DataProbability: Topic = {
  id: "daten-diagramme-zufall-4",
  title: "Daten, Diagramme & Zufall",
  emoji: "📊",
  exercises: exercises.map((exercise, index) => index < 3 ? { ...exercise, free: true } : exercise),
};

export default grade4DataProbability;
