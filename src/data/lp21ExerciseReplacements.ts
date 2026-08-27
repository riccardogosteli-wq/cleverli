import type { Exercise, Topic } from "@/types/exercise";

type SafeFact = {
  question: string;
  answer: string;
  options: [string, string, string, string];
  fill: string;
  fillAnswer: string;
  hint: string;
};

const fact = (
  question: string,
  answer: string,
  distractors: [string, string, string],
  fill: string,
  fillAnswer: string,
  hint: string,
): SafeFact => ({ question, answer, options: [answer, ...distractors], fill, fillAnswer, hint });

const GROUP_IDS = {
  "1-math-money": ["g19", "g20", "g21", "g22", "g23", "g24", "g25", "g26", "g28", "g29", "g30", "g31", "g32", "g33", "g34", "g35", "g36", "g37", "g38", "g39", "g40", "g41", "g42", "g43", "g44", "g45", "g46", "g47", "g48", "g49", "g50"],
  "1-science-time": ["u18", "u24", "u28", "u30", "u32", "u35"],
  "1-science-basics": ["k50", "p22", "p30", "p38", "s18", "ph20"],
  "2-science-water": ["w21", "w23", "w29", "w30", "w31", "w32", "w33", "w34", "w35"],
  "2-math-foundations": ["sc36", "sc48"],
  "3-math-data": ["d4", "d5", "d7x2", "dd8", "dd10", "dd16", "dd20", "dd21", "dd23", "dd25", "dd27", "dd28", "dd30", "dd31", "dd33", "dd34", "dd35", "dd36", "dd38", "dd39", "dd40", "dd41", "dd42", "dd43", "dd44", "dd45", "dd46", "dd47", "dd48", "dd50"],
  "3-math-word-problems": ["t33", "t38"],
  "3-math-geometry": ["geo21", "geo29", "geo36", "geo37", "geo38", "geo39", "geo40", "geo41", "geo42", "geo43", "geo44", "geo45", "geo46", "geo47", "geo48", "geo49", "geo50", "br47", "fu30", "fu37", "fu39", "fu40", "fu41", "fu42", "fu43", "fu45", "fu46", "fu47", "fu49"],
  "3-german-verbs": ["vk46"],
  "3-german-texts": ["ts43", "ts44", "ts45", "ts47", "ts48"],
  "3-science-light": ["ls17", "ls22", "ls23", "ls24", "ls25", "ls31", "ls33", "ls34", "ls36", "ls37", "ls38", "ls39", "ls40", "ls41", "ls42", "ls44", "ls45", "ls46", "ls47", "ls49", "en44", "u24h47"],
  "3-science-environment": ["un38", "un40", "un42", "un47", "un50"],
  "3-science-democracy": ["dk36", "dk37", "dk38", "dk39", "dk41", "dk42", "dk45", "dk47", "dk50"],
  "4-math-numbers": ["g4m2d"],
  "4-math-geometry": ["ge4_23", "ge4_24", "gm4_23", "ta4_24"],
  "4-german-tenses": ["g4zf2j", "g4zf2k", "g4zf2n", "g4zf2o"],
  "4-science-animals": ["g4lr3a", "g4lr3g"],
  "4-science-weather": ["g4wk2b", "g4wk2c"],
  "4-science-plants": ["pfl4_26", "pfl4_32", "pfl4_34", "pfl4_35", "pfl4_36", "pfl4_39", "pfl4_40", "pfl4_42"],
  "4-science-matter": ["ms4_23"],
  "4-science-forces": ["ke4_43"],
  "4-science-ecology": ["oek4_25", "oek4_39", "oek4_44", "oek4_46"],
  "4-science-body": ["ks4_45", "ks4_47"],
  "4-science-water": ["rw4_20", "rw4_32", "rw4_38"],
  "5-german-sentences": ["sa5-29", "sa5-30"],
  "5-science-space": ["g5ss3c"],
  "5-science-body": ["mk5-36", "mk5-38", "mk5-40", "mk5-41"],
  "5-science-forces": ["kb5-46", "kb5-47"],
  "5-science-climate": ["ek5-43"],
  "5-science-plants": ["pt5-47"],
  "5-science-technology": ["te5-16", "te5-19", "te5-21", "te5-41", "te5-42"],
  "5-science-europe": ["eg5-46"],
  "5-science-reformation": ["rf5-48"],
  "6-math": ["g6gl2k", "g6gl2o", "g6stat29", "g6stat31"],
  "6-math-geometry": ["g6nz3a", "g6geo1", "g6geo5", "g6geo6", "g6geo12", "g6geo18", "g6geo21", "g6geo23", "g6geo24", "g6geo28", "g6geo29", "g6geo33", "g6geo37", "g6fk7", "g6fk13", "g6fk14", "g6fk16", "g6fk18", "g6fk20", "g6fk23", "g6fk24", "g6fk27", "g6fk28", "g6fk29", "g6fk32", "g6ta12", "g6ta15", "g6ta22", "g6ta28"],
  "6-german": ["g6d9", "g6ka3a", "g6lit20"],
  "6-science-states": ["g6az3a", "g6az3f", "g6az3j"],
  "6-science-chemistry": ["ch6_40", "ch6_48"],
  "6-science-light": ["lo6_34", "lo6_42"],
  "6-science-living-things": ["bz6_7", "bz6_15", "bz6_16", "bz6_17", "bz6_18", "bz6_19", "bz6_23", "bz6_25", "bz6_35", "bz6_36", "bz6_37", "bz6_38", "bz6_39", "bz6_40", "bz6_41", "bz6_42", "bz6_49"],
  "6-science-energy": ["en6_40"],
  "6-science-technology": ["ti6_37"],
  "6-science-space": ["as6_36", "as6_38", "as6_43", "as6_49"],
  "6-science-future": ["zh6_32", "zh6_39", "zh6_40", "zh6_41", "zh6_42", "zh6_48"],
} as const satisfies Record<string, readonly string[]>;

export const LP21_REPLACEMENT_GROUP_IDS = GROUP_IDS;

const SAFE_FACTS: Record<keyof typeof GROUP_IDS, SafeFact[]> = {
  "1-math-money": [
    fact("Welche Münze hat den grösseren Wert?", "2 Franken", ["1 Franken", "50 Rappen", "20 Rappen"], "Eine 2-Franken-Münze ist mehr wert als eine ___-Franken-Münze.", "1", "Vergleiche die aufgedruckten Zahlen."),
    fact("Wie viele Rappen sind 1 Franken?", "100 Rappen", ["10 Rappen", "50 Rappen", "200 Rappen"], "1 Franken sind ___ Rappen.", "100", "Zwei 50-Rappen-Münzen ergeben einen Franken."),
    fact("Du hast 2 Franken und bekommst 1 Franken dazu. Wie viel hast du?", "3 Franken", ["1 Franken", "2 Franken", "4 Franken"], "2 Franken + 1 Franken = ___ Franken.", "3", "Zähle einen Franken weiter."),
    fact("Welche zwei Münzen ergeben zusammen 1 Franken?", "2 × 50 Rappen", ["2 × 20 Rappen", "2 × 10 Rappen", "1 × 50 Rappen"], "Zwei Münzen zu 50 Rappen ergeben ___ Franken.", "1", "50 + 50 = 100 Rappen."),
    fact("Du hast 5 Franken und bezahlst 2 Franken. Wie viel bleibt?", "3 Franken", ["2 Franken", "5 Franken", "7 Franken"], "5 Franken − 2 Franken = ___ Franken.", "3", "Rechne mit ganzen Franken."),
    fact("Welche Münze ist weniger wert als 1 Franken?", "50 Rappen", ["2 Franken", "5 Franken", "1 Franken"], "50 Rappen sind weniger als ___ Franken.", "1", "100 Rappen entsprechen einem Franken."),
  ],
  "1-science-time": [
    fact("Wie viele Stunden hat ein Tag?", "24", ["12", "20", "60"], "Ein Tag hat ___ Stunden.", "24", "Eine Uhr zeigt zweimal zwölf Stunden."),
    fact("Was kommt nach 7 Uhr?", "8 Uhr", ["6 Uhr", "9 Uhr", "12 Uhr"], "Eine Stunde nach 7 Uhr ist es ___ Uhr.", "8", "Zähle eine Stunde weiter."),
    fact("Wann beginnt ungefähr der Morgen?", "Nach dem Aufstehen", ["Mitten in der Nacht", "Nach dem Abendessen", "Kurz vor Mitternacht"], "Nach dem Aufstehen beginnt für uns der ___.", "Morgen", "Denke an Frühstück und Schulweg."),
    fact("Wie viele Minuten hat eine Stunde?", "60", ["30", "24", "100"], "Eine Stunde hat ___ Minuten.", "60", "Der Minutenzeiger läuft einmal um die Uhr."),
  ],
  "1-science-basics": [
    fact("Welcher Körperteil hilft uns beim Denken?", "Das Gehirn", ["Der Fuss", "Der Ellbogen", "Der Zahn"], "Wir denken mit dem ___.", "Gehirn", "Es liegt geschützt im Kopf."),
    fact("Was braucht eine Pflanze zum Wachsen?", "Wasser und Licht", ["Plastik und Stein", "Nur Dunkelheit", "Salz und Rauch"], "Eine Pflanze braucht Wasser und ___.", "Licht", "Die Sonne liefert Licht."),
    fact("Warum haben Blumen Blüten?", "Sie helfen bei der Bildung von Samen", ["Sie machen Wind", "Sie tragen Schuhe", "Sie messen die Zeit"], "Aus einer Blüte können später ___ entstehen.", "Samen", "Aus Samen wachsen neue Pflanzen."),
    fact("Womit fühlen wir eine Berührung?", "Mit der Haut", ["Mit den Haaren allein", "Mit den Zähnen", "Mit den Schuhen"], "Wir fühlen Berührungen mit der ___.", "Haut", "Die Haut bedeckt unseren Körper."),
    fact("Was passiert mit einem Ball, wenn du ihn anstösst?", "Er bewegt sich", ["Er wird zu Wasser", "Er verschwindet", "Er wächst"], "Nach einem Stoss kann sich ein Ball ___.", "bewegen", "Beobachte einen Ball auf dem Boden."),
    fact("Warum sind Insekten für viele Blumen wichtig?", "Sie tragen Blütenstaub weiter", ["Sie bauen die Wurzeln", "Sie färben den Himmel", "Sie machen die Erde schwer"], "Bienen tragen ___ von Blüte zu Blüte.", "Blütenstaub", "So können Samen entstehen."),
  ],
  "2-science-water": [
    fact("Was passiert mit einer Pfütze bei Sonne?", "Das Wasser verdunstet", ["Sie wird zu Eis", "Sie wird zu Sand", "Sie wächst"], "Bei Sonne kann Wasser aus einer Pfütze ___.", "verdunsten", "Das Wasser geht als Wasserdampf in die Luft."),
    fact("Woher kommt Regen?", "Aus Wolken", ["Aus Steinen", "Aus Bäumen", "Aus Strassen"], "Regen fällt aus ___.", "Wolken", "In Wolken sammeln sich Wassertröpfchen."),
    fact("Warum sollen wir Wasser sparen?", "Sauberes Wasser ist wertvoll", ["Wasser ist immer schmutzig", "Wasser ist zu schwer", "Wasser hat keine Farbe"], "Sauberes Wasser ist ___.", "wertvoll", "Wir brauchen Wasser zum Trinken, Waschen und Kochen."),
    fact("Was ist Grundwasser?", "Wasser im Boden", ["Wasser in Wolken", "Wasser im Kochtopf", "Wasser auf Blättern"], "Wasser, das sich im Boden sammelt, heisst ___.", "Grundwasser", "Ein Teil des Regens versickert."),
    fact("Wie wird schmutziges Wasser wieder sauberer?", "Es wird in einer Kläranlage gereinigt", ["Es wird bemalt", "Es wird eingefroren", "Es wird mit Sand gemischt"], "Abwasser wird in einer ___ gereinigt.", "Kläranlage", "Dort werden Schmutzstoffe entfernt."),
  ],
  "2-math-foundations": [
    fact("Welcher Wert ist am grössten?", "90", ["9", "19", "80"], "Von 9, 19, 80 und 90 ist ___ am grössten.", "90", "Vergleiche zuerst die Zehnerstellen."),
    fact("Was ist 4 · 5?", "20", ["9", "16", "25"], "4 · 5 = ___.", "20", "Vier Gruppen mit je fünf ergeben zwanzig."),
    fact("Ein Balkendiagramm zeigt 8 rote und 5 blaue Punkte. Welche Farbe kommt häufiger vor?", "Rot", ["Blau", "Beide gleich", "Nicht erkennbar"], "8 rote Punkte sind ___ als 5 blaue Punkte.", "mehr", "Vergleiche 8 und 5."),
    fact("Eine Tabelle zeigt 7 Äpfel und 3 Birnen. Wie viele Früchte sind es zusammen?", "10", ["4", "9", "11"], "7 + 3 = ___.", "10", "Addiere beide Mengen."),
  ],
  "3-math-data": [
    fact("Ein Balkendiagramm zeigt Rot=8, Blau=5. Welche Farbe hat mehr Stimmen?", "Rot", ["Blau", "Beide gleich", "Das ist nicht erkennbar"], "Rot hat 8 Stimmen, Blau 5. ___ hat mehr Stimmen.", "Rot", "Vergleiche 8 und 5."),
    fact("Eine Strichliste zeigt 6 Velos und 4 Trottis. Wie viele Fahrzeuge sind es zusammen?", "10", ["2", "8", "12"], "6 Velos und 4 Trottis sind zusammen ___.", "10", "Addiere beide Gruppen."),
    fact("Im Diagramm stehen Montag 3, Dienstag 7 und Mittwoch 5 Bücher. Wann wurden am meisten gelesen?", "Dienstag", ["Montag", "Mittwoch", "An allen Tagen gleich"], "Der höchste Wert 7 gehört zum ___.", "Dienstag", "Suche den grössten Wert."),
    fact("Eine Tabelle zeigt 12 Äpfel und 7 Birnen. Wie viele Äpfel gibt es mehr?", "5", ["4", "6", "19"], "12 minus 7 ergibt ___.", "5", "Berechne den Unterschied."),
    fact("Welche Darstellung eignet sich zum Vergleichen mehrerer Mengen?", "Ein Balkendiagramm", ["Eine Uhr", "Ein Lineal", "Ein Kalender"], "Mengen lassen sich gut mit einem ___ vergleichen.", "Balkendiagramm", "Unterschiedlich lange Balken zeigen die Mengen."),
    fact("Eine Tabelle zeigt 4, 6 und 3 Punkte. Wie viele Punkte sind es insgesamt?", "13", ["9", "10", "15"], "4 + 6 + 3 = ___.", "13", "Addiere schrittweise."),
  ],
  "3-math-word-problems": [
    fact("Drei Klassen sammeln 24, 27 und 23 Bücher. Wie viele Bücher sind es zusammen?", "74", ["64", "70", "84"], "24 + 27 + 23 = ___.", "74", "Addiere zuerst 24 und 27."),
    fact("In einer Klasse sind 14 Mädchen und 12 Buben. Wie viele Kinder sind es?", "26", ["24", "25", "28"], "14 + 12 = ___.", "26", "Addiere beide Gruppen."),
  ],
  "3-math-geometry": [
    fact("Wie viele rechte Winkel hat ein Rechteck?", "4", ["2", "3", "6"], "Ein Rechteck hat ___ rechte Winkel.", "4", "Betrachte jede Ecke."),
    fact("Ein Rechteck ist 8 cm lang und 3 cm breit. Wie gross ist seine Fläche?", "24 cm²", ["11 cm²", "16 cm²", "22 cm²"], "8 cm · 3 cm = ___ cm².", "24", "Fläche ist Länge mal Breite."),
    fact("Ein Quadrat hat eine Seitenlänge von 6 cm. Wie gross ist sein Umfang?", "24 cm", ["12 cm", "18 cm", "36 cm"], "Vier Seiten zu je 6 cm ergeben ___ cm Umfang.", "24", "Addiere die vier gleich langen Seiten."),
    fact("Welche Figur hat drei Seiten?", "Dreieck", ["Rechteck", "Fünfeck", "Kreis"], "Eine Figur mit drei Seiten heisst ___.", "Dreieck", "Der Name beginnt mit «Drei»."),
    fact("Wie viele Flächen hat ein Würfel?", "6", ["4", "8", "12"], "Ein Würfel hat ___ Flächen.", "6", "Zähle oben, unten und die vier Seiten."),
    fact("Ein Quader ist 4 cm lang, 3 cm breit und 2 cm hoch. Wie gross ist sein Volumen?", "24 cm³", ["9 cm³", "12 cm³", "18 cm³"], "4 · 3 · 2 = ___ cm³.", "24", "Multipliziere Länge, Breite und Höhe."),
  ],
  "3-german-verbs": [
    fact("Welche Verbform passt? Gestern ___ wir im Park.", "spielten", ["spielen", "spielt", "gespielt"], "Gestern ___ wir im Park.", "spielten", "Das Signalwort «gestern» verlangt Vergangenheit."),
  ],
  "3-german-texts": [
    fact("Was gehört in die Einleitung eines Berichts?", "Die wichtigsten Angaben zum Ereignis", ["Nur die eigene Meinung", "Eine Einkaufsliste", "Nur der letzte Satz"], "Ein Bericht beginnt mit den wichtigsten ___.", "Angaben", "Beantworte Wer, Was, Wann und Wo."),
    fact("Was macht eine Geschichte spannend?", "Ein Problem und eine passende Lösung", ["Nur Zahlen", "Viele gleiche Sätze", "Keine Handlung"], "Eine spannende Geschichte hat ein Problem und eine ___.", "Lösung", "Denke an Anfang, Mitte und Schluss."),
    fact("Wozu dienen Absätze?", "Sie gliedern einen Text", ["Sie ersetzen alle Satzzeichen", "Sie machen Wörter kürzer", "Sie zählen Buchstaben"], "Absätze ___ einen Text.", "gliedern", "Jeder Abschnitt behandelt einen Gedanken."),
    fact("Was ist eine Zusammenfassung?", "Ein kurzer Text mit den wichtigsten Aussagen", ["Eine Abschrift jedes Satzes", "Eine erfundene Geschichte", "Eine Liste ohne Zusammenhang"], "Eine Zusammenfassung nennt die wichtigsten ___.", "Aussagen", "Unwichtige Einzelheiten lässt man weg."),
    fact("Was kennzeichnet einen persönlichen Brief?", "Anrede, Nachricht und Gruss", ["Nur eine Überschrift", "Eine Tabelle", "Nur Stichwörter"], "Ein Brief endet mit einem ___.", "Gruss", "Denke an «Liebe Grüsse»."),
  ],
  "3-science-light": [
    fact("Warum entsteht ein Schatten?", "Ein Gegenstand hält Licht ab", ["Licht wird schwer", "Luft wird dunkel", "Der Boden leuchtet"], "Ein Schatten entsteht, wenn ein Gegenstand Licht ___.", "abhält", "Licht breitet sich geradlinig aus."),
    fact("Was macht ein Spiegel mit Licht?", "Er wirft Licht zurück", ["Er verschluckt jedes Licht", "Er erzeugt Wind", "Er macht Licht schwer"], "Ein Spiegel ___ Licht.", "reflektiert", "Das zurückgeworfene Licht gelangt ins Auge."),
    fact("Was passiert mit weissem Licht im Regenbogen?", "Es wird in Farben aufgeteilt", ["Es wird zu Schall", "Es verschwindet", "Es wird magnetisch"], "Ein Regenbogen teilt weisses Licht in ___ auf.", "Farben", "Rot, Orange, Gelb, Grün, Blau und Violett."),
    fact("Welche Materialien lassen Licht gut hindurch?", "Durchsichtige Materialien", ["Dicke Holzbretter", "Steine", "Metallplatten"], "Glas ist oft ___ und lässt Licht hindurch.", "durchsichtig", "Man kann durch klares Glas sehen."),
    fact("Wann ist ein Schatten besonders lang?", "Wenn die Sonne tief steht", ["Wenn die Sonne hoch steht", "Wenn kein Licht da ist", "Wenn es windig ist"], "Bei tief stehender Sonne ist der Schatten oft ___.", "lang", "Beobachte Schatten am Morgen."),
    fact("Was zeigt ein Kompass?", "Die Himmelsrichtungen", ["Die Temperatur", "Die Uhrzeit", "Das Gewicht"], "Ein Kompass hilft, die ___ zu finden.", "Himmelsrichtungen", "Die Nadel zeigt ungefähr nach Norden."),
  ],
  "3-science-environment": [
    fact("Warum trennt man Abfall?", "Damit Wertstoffe wiederverwendet werden können", ["Damit alles schwerer wird", "Damit mehr Abfall entsteht", "Damit Papier nass wird"], "Abfalltrennung erleichtert das ___.", "Recycling", "Glas, Papier und Metall können erneut genutzt werden."),
    fact("Was hilft dem Klima im Alltag?", "Zu Fuss gehen oder Velo fahren", ["Licht immer brennen lassen", "Mehr Abfall produzieren", "Wasser unnötig laufen lassen"], "Kurze Wege kann man zu Fuss oder mit dem ___ zurücklegen.", "Velo", "So entsteht weniger Abgas."),
    fact("Warum sind vielfältige Lebensräume wichtig?", "Viele Arten finden Nahrung und Schutz", ["Alle Tiere brauchen denselben Ort", "Pflanzen wachsen ohne Wasser", "Lebensräume sind nur Dekoration"], "Ein Lebensraum bietet Nahrung und ___.", "Schutz", "Hecken, Wiesen und Teiche sind verschieden."),
    fact("Was bedeutet wiederverwenden?", "Einen Gegenstand mehrmals benutzen", ["Ihn sofort wegwerfen", "Ihn verstecken", "Ihn verbrennen"], "Eine Trinkflasche kann man mehrmals ___.", "benutzen", "Mehrweg spart Material."),
    fact("Warum spart man Strom?", "Damit Ressourcen und Umwelt geschont werden", ["Damit Geräte lauter werden", "Damit Kabel länger werden", "Damit Batterien schwerer werden"], "Strom sparen schont die ___.", "Umwelt", "Schalte unnötige Geräte aus."),
  ],
  "3-science-democracy": [
    fact("Was ist eine Abstimmung?", "Menschen entscheiden zwischen Vorschlägen", ["Eine Wetterbeobachtung", "Ein Rechenverfahren", "Eine Sportart"], "Bei einer ___ entscheiden Menschen gemeinsam.", "Abstimmung", "Jede Stimme zählt."),
    fact("Warum gibt es Regeln in einer Gemeinschaft?", "Damit das Zusammenleben fair und sicher ist", ["Damit niemand sprechen darf", "Damit nur Erwachsene gewinnen", "Damit Aufgaben verschwinden"], "Regeln helfen beim fairen ___.", "Zusammenleben", "Sie gelten für alle."),
    fact("Was macht eine Gemeinde?", "Sie organisiert Aufgaben am Wohnort", ["Sie bestimmt das Weltwetter", "Sie baut alle Länder", "Sie ersetzt Familien"], "Die ___ kümmert sich um Aufgaben am Wohnort.", "Gemeinde", "Zum Beispiel Schule, Abfall oder Feuerwehr."),
    fact("Was bedeutet Demokratie?", "Menschen dürfen mitbestimmen", ["Eine Person entscheidet alles", "Niemand darf wählen", "Gesetze gelten nur für wenige"], "In einer Demokratie dürfen Menschen ___.", "mitbestimmen", "In der Schweiz geschieht das auch durch Abstimmungen."),
    fact("Was ist ein fairer Entscheid?", "Alle werden angehört und Regeln gelten für alle", ["Nur die lauteste Person entscheidet", "Regeln ändern sich für Freunde", "Niemand kennt den Vorschlag"], "Bei einem fairen Entscheid werden alle ___.", "angehört", "Respektiere unterschiedliche Meinungen."),
  ],
  "4-math-numbers": [
    fact("Welche Zahl ist durch 2 und 5 teilbar?", "30", ["21", "25", "33"], "Eine Zahl, die durch 2 und 5 teilbar ist, endet auf ___.", "0", "Sie muss gerade sein und auf 0 oder 5 enden."),
  ],
  "4-math-geometry": [
    fact("Ein Rechteck ist 12 cm lang und 5 cm breit. Wie gross ist sein Umfang?", "34 cm", ["17 cm", "60 cm", "24 cm"], "2 · (12 + 5) = ___ cm.", "34", "Addiere Länge und Breite und verdopple."),
    fact("Ein Dreieck hat Grundseite 8 cm und Höhe 5 cm. Wie gross ist seine Fläche?", "20 cm²", ["13 cm²", "40 cm²", "80 cm²"], "8 · 5 : 2 = ___ cm².", "20", "Ein Dreieck ist halb so gross wie das passende Rechteck."),
    fact("Ein Quader misst 5 cm · 4 cm · 3 cm. Wie gross ist sein Volumen?", "60 cm³", ["12 cm³", "20 cm³", "40 cm³"], "5 · 4 · 3 = ___ cm³.", "60", "Multipliziere die drei Kantenlängen."),
    fact("Ein Quadrat hat eine Seitenlänge von 14 cm. Wie gross ist seine Fläche?", "196 cm²", ["28 cm²", "56 cm²", "144 cm²"], "14 · 14 = ___ cm².", "196", "Fläche des Quadrats: Seite mal Seite."),
  ],
  "4-german-tenses": [
    fact("Welche Zeitform passt zu «Gestern spielte ich Fussball»?", "Präteritum", ["Präsens", "Perfekt", "Futur"], "«Gestern spielte ich» steht im ___.", "Präteritum", "Das Verb «spielte» bezeichnet Vergangenes."),
    fact("Wie lautet das Perfekt von «ich spiele»?", "Ich habe gespielt", ["Ich werde spielen", "Ich spielte", "Ich spiele"], "Perfekt: Ich habe ___.", "gespielt", "Das Perfekt besteht hier aus «haben» und Partizip II."),
    fact("Welche Form beschreibt Zukünftiges?", "Ich werde morgen lesen", ["Ich las gestern", "Ich lese gerade", "Ich habe gelesen"], "Morgen ___ ich lesen.", "werde", "Das Futur wird mit «werden» gebildet."),
    fact("Was ist das Präteritum von «gehen»?", "ging", ["geht", "gegangen", "gehen"], "Gestern ___ ich nach Hause.", "ging", "Gesucht ist die einfache Vergangenheit."),
  ],
  "4-science-animals": [
    fact("Warum braucht ein Tier einen passenden Lebensraum?", "Es findet dort Nahrung, Schutz und Platz", ["Es braucht nur eine Farbe", "Alle Tiere leben gleich", "Es braucht keine Umwelt"], "Ein Lebensraum bietet Nahrung, Schutz und ___.", "Platz", "Wald, Wiese und Gewässer bieten verschiedene Bedingungen."),
    fact("Was zeigt eine Nahrungskette?", "Wer wen frisst", ["Wie schnell Tiere laufen", "Wie alt Pflanzen sind", "Wie das Wetter wird"], "Eine Nahrungskette zeigt, wer wen ___.", "frisst", "Sie beginnt oft mit einer Pflanze."),
  ],
  "4-science-weather": [
    fact("Was geschieht, wenn Wasserdampf abkühlt?", "Es entstehen Wassertröpfchen", ["Er wird zu Holz", "Er verschwindet vollständig", "Er wird zu Sand"], "Beim Abkühlen wird Wasserdampf zu ___.", "Wassertröpfchen", "So können Wolken entstehen."),
    fact("Wozu dient eine Wetterstation?", "Sie misst Wetterdaten", ["Sie baut Wolken", "Sie hält die Sonne an", "Sie zählt Häuser"], "Eine Wetterstation misst Temperatur, Wind und ___.", "Niederschlag", "Mehrere Messwerte beschreiben das Wetter."),
  ],
  "4-science-plants": [
    fact("Welche Aufgabe haben Wurzeln?", "Sie nehmen Wasser auf und verankern die Pflanze", ["Sie erzeugen Wind", "Sie bilden Wolken", "Sie hören Geräusche"], "Wurzeln nehmen Wasser auf und geben der Pflanze ___.", "Halt", "Wurzeln liegen meist im Boden."),
    fact("Warum sind Blätter wichtig?", "Sie nutzen Licht zur Herstellung von Zucker", ["Sie pumpen Blut", "Sie bewegen Steine", "Sie messen Zeit"], "Blätter nutzen Licht für die ___.", "Photosynthese", "Dabei stellt die Pflanze Nahrung her."),
    fact("Wie gelangt Wasser von den Wurzeln zu den Blättern?", "Durch Leitungsbahnen im Stängel", ["Durch die Blütenfarbe", "Durch den Wind", "Durch Samen"], "Im Stängel wird Wasser nach ___ transportiert.", "oben", "Der Stängel verbindet Wurzeln und Blätter."),
    fact("Was braucht ein Samen zum Keimen?", "Wasser, Wärme und passende Bedingungen", ["Nur Dunkelheit", "Nur Salz", "Nur Wind"], "Zum Keimen braucht ein Samen unter anderem Wasser und ___.", "Wärme", "Beobachte einen Bohnenkeimling."),
  ],
  "4-science-matter": [
    fact("Was passiert mit Eis beim Erwärmen?", "Es schmilzt", ["Es wird zu Holz", "Es wird magnetisch", "Es wächst"], "Beim Erwärmen ___ Eis.", "schmilzt", "Der Stoff bleibt Wasser, ändert aber seinen Zustand."),
  ],
  "4-science-forces": [
    fact("Warum wird ein rollender Ball langsamer?", "Reibung bremst ihn", ["Er vergisst den Weg", "Seine Farbe ändert sich", "Licht hält ihn fest"], "Ein rollender Ball wird durch ___ gebremst.", "Reibung", "Boden und Luft wirken der Bewegung entgegen."),
  ],
  "4-science-ecology": [
    fact("Was passiert, wenn ein Lebensraum verschmutzt wird?", "Pflanzen und Tiere können geschädigt werden", ["Alle Arten vermehren sich sofort", "Wasser wird automatisch sauber", "Es hat keine Folgen"], "Verschmutzung kann Lebewesen ___.", "schädigen", "Saubere Lebensräume sind wichtig."),
    fact("Warum sind verschiedene Arten wichtig?", "Sie erfüllen unterschiedliche Aufgaben im Ökosystem", ["Alle Arten sind gleich", "Nur grosse Tiere zählen", "Pflanzen brauchen keine Tiere"], "Artenvielfalt stärkt ein ___.", "Ökosystem", "Bestäubung und Nahrungsketten hängen zusammen."),
    fact("Was ist ein natürlicher Kreislauf?", "Stoffe werden in der Natur wiederverwendet", ["Alles verschwindet", "Nur Wasser bewegt sich", "Tiere erzeugen Plastik"], "In Kreisläufen werden Stoffe ___.", "wiederverwendet", "Abgestorbene Pflanzen werden zersetzt."),
    fact("Wie schützt man einen Bach?", "Keinen Abfall oder Schadstoff hineinwerfen", ["Mehr Plastik hineinwerfen", "Das Wasser färben", "Alle Pflanzen entfernen"], "Ein Bach bleibt sauber, wenn keine ___ hineingelangen.", "Schadstoffe", "Wasser ist Lebensraum."),
  ],
  "4-science-body": [
    fact("Wie arbeiten Auge und Gehirn zusammen?", "Das Auge nimmt Licht auf, das Gehirn verarbeitet Signale", ["Das Auge denkt allein", "Das Gehirn erzeugt jedes Licht", "Die Ohren sehen Bilder"], "Das Gehirn ___ die Signale aus dem Auge.", "verarbeitet", "Sehen entsteht durch Zusammenarbeit."),
    fact("Warum schützen wir unser Gehör?", "Sehr laute Geräusche können es schädigen", ["Ohren brauchen Dunkelheit", "Musik macht Ohren schwer", "Gehör wächst durch Lärm"], "Sehr laute Geräusche können das Gehör ___.", "schädigen", "Bei grossem Lärm hilft Gehörschutz."),
  ],
  "4-science-water": [
    fact("Wie gelangt Regen ins Grundwasser?", "Er versickert im Boden", ["Er fliegt nach oben", "Er wird zu Metall", "Er bleibt immer auf Blättern"], "Regen kann im Boden ___.", "versickern", "Wasser wandert durch Bodenschichten."),
    fact("Warum schützt man Trinkwasser?", "Menschen, Tiere und Pflanzen brauchen sauberes Wasser", ["Wasser ist nur Dekoration", "Schmutz macht Wasser gesünder", "Trinkwasser wird nie knapp"], "Sauberes Trinkwasser ist für alle Lebewesen ___.", "wichtig", "Vermeide Schadstoffe in Gewässern."),
    fact("Was macht eine Kläranlage?", "Sie reinigt Abwasser", ["Sie erzeugt Regen", "Sie baut Flüsse", "Sie friert Seen ein"], "Eine Kläranlage ___ Abwasser.", "reinigt", "Mehrere Reinigungsstufen entfernen Schmutz."),
  ],
  "5-german-sentences": [
    fact("Was ist ein Hauptsatz?", "Ein Satz, der allein stehen kann", ["Ein Satz ohne Verb", "Nur ein einzelnes Wort", "Ein Satzteil nach einem Komma"], "Ein Hauptsatz kann allein ___.", "stehen", "Das konjugierte Verb steht meist an zweiter Stelle."),
    fact("Woran erkennt man einen Nebensatz?", "Das konjugierte Verb steht meist am Schluss", ["Er hat nie ein Verb", "Er beginnt immer mit einer Zahl", "Er braucht kein Komma"], "Im Nebensatz steht das konjugierte Verb meist am ___.", "Schluss", "Zum Beispiel: weil es regnet."),
  ],
  "5-science-space": [
    fact("Warum bleiben Planeten auf ihren Bahnen?", "Die Schwerkraft der Sonne zieht sie an", ["Der Sonnenwind schiebt sie im Kreis", "Sie hängen an unsichtbaren Seilen", "Wolken lenken sie"], "Die ___ der Sonne hält Planeten auf ihren Bahnen.", "Schwerkraft", "Massen ziehen einander an."),
  ],
  "5-science-body": [
    fact("Warum steigt der Puls bei Bewegung?", "Die Muskeln brauchen mehr Sauerstoff", ["Das Herz wird kleiner", "Die Lunge hört auf", "Blut wird zu Wasser"], "Bei Bewegung brauchen Muskeln mehr ___.", "Sauerstoff", "Das Herz pumpt schneller."),
    fact("Welche Aufgabe hat das Nervensystem?", "Es überträgt Signale im Körper", ["Es verdaut Nahrung", "Es bildet Knochen", "Es speichert Luft"], "Nerven übertragen ___.", "Signale", "So reagiert der Körper schnell."),
    fact("Wie hält der Körper seine Temperatur ungefähr gleich?", "Durch Schwitzen oder Zittern", ["Durch Haarwachstum", "Durch Blinzeln", "Durch Verdauung allein"], "Beim Schwitzen gibt der Körper ___ ab.", "Wärme", "Der Körper regelt seine Temperatur."),
    fact("Warum ist Schlaf wichtig?", "Körper und Gehirn erholen sich", ["Nur die Augen brauchen Pause", "Der Körper arbeitet gar nicht", "Schlaf ersetzt Nahrung"], "Im Schlaf können sich Körper und Gehirn ___.", "erholen", "Schlaf unterstützt Lernen und Wachstum."),
  ],
  "5-science-forces": [
    fact("Was verändert eine Kraft?", "Bewegung oder Form eines Körpers", ["Nur die Farbe", "Nur den Namen", "Die Jahreszeit"], "Eine Kraft kann Bewegung oder ___ verändern.", "Form", "Drücken, ziehen und bremsen sind Kraftwirkungen."),
    fact("Warum braucht ein Velo Bremsen?", "Damit Reibung die Bewegung verlangsamt", ["Damit es schneller wird", "Damit es leichter wird", "Damit es leuchtet"], "Beim Bremsen sorgt ___ für das Langsamerwerden.", "Reibung", "Bremsklötze drücken auf Rad oder Scheibe."),
  ],
  "5-science-climate": [
    fact("Wie kann eine Gemeinde Hitze im Sommer mindern?", "Mit Bäumen und begrünten Flächen", ["Mit mehr Asphalt", "Mit dunklen Dächern überall", "Mit weniger Schatten"], "Bäume spenden Schatten und kühlen durch ___.", "Verdunstung", "Grünflächen helfen bei Hitze."),
  ],
  "5-science-plants": [
    fact("Warum ist genetische Vielfalt bei Pflanzen wichtig?", "Sie hilft Arten, mit Veränderungen umzugehen", ["Alle Pflanzen werden identisch", "Sie verhindert Bestäubung", "Sie stoppt jedes Wachstum"], "Vielfalt hilft Arten, sich an Veränderungen ___.", "anzupassen", "Unterschiedliche Eigenschaften können nützlich sein."),
  ],
  "5-science-technology": [
    fact("Wie prüft man eine technische Erfindung?", "Man testet, ob sie sicher und nützlich funktioniert", ["Man betrachtet nur die Farbe", "Man testet sie nie", "Man ignoriert Risiken"], "Eine Erfindung muss sicher und zuverlässig ___.", "funktionieren", "Tests zeigen Stärken und Schwächen."),
    fact("Was ist ein Sensor?", "Ein Bauteil, das Messwerte erfasst", ["Ein reiner Energiespeicher", "Ein Zahnrad ohne Aufgabe", "Eine Farbe"], "Ein Sensor ___ Werte wie Licht oder Temperatur.", "misst", "Geräte reagieren auf Messdaten."),
    fact("Warum verbessert man Erfindungen schrittweise?", "Tests zeigen Probleme und neue Lösungen", ["Die erste Idee ist immer perfekt", "Änderungen sind verboten", "Nur das Aussehen zählt"], "Nach einem Test kann ein Modell ___ werden.", "verbessert", "Technisches Entwickeln ist ein Prozess."),
  ],
  "5-science-europe": [
    fact("Warum unterstützen europäische Regionen gemeinsame Projekte?", "Damit Verkehr, Umwelt oder Zusammenarbeit verbessert werden", ["Damit Grenzen täglich wechseln", "Damit alle Orte gleich aussehen", "Damit Karten unnötig werden"], "Gemeinsame Projekte fördern die ___.", "Zusammenarbeit", "Probleme enden oft nicht an Landesgrenzen."),
  ],
  "5-science-reformation": [
    fact("Welche Folge hatte der Buchdruck für die Reformation?", "Ideen und Texte verbreiteten sich schneller", ["Bücher verschwanden", "Nur Könige konnten lesen", "Reisen wurden verboten"], "Durch den Buchdruck verbreiteten sich Ideen ___.", "schneller", "Flugschriften erreichten viele Menschen."),
  ],
  "6-math": [
    fact("Welche Zahl löst 3x = 24?", "8", ["6", "7", "9"], "3 · x = 24, also ist x = ___.", "8", "Nutze die Umkehroperation 24 : 3."),
    fact("Welche Aussage beschreibt einen Ausreisser?", "Ein Wert liegt weit von den übrigen Werten entfernt", ["Alle Werte sind gleich", "Der häufigste Wert", "Der kleinste mögliche Wert"], "Ein ungewöhnlich weit entfernter Wert heisst ___.", "Ausreisser", "Vergleiche ihn mit dem Rest des Datensatzes."),
    fact("Welche Angabe beschreibt die Streuung einfach?", "Die Spannweite zwischen grösstem und kleinstem Wert", ["Nur der Mittelwert", "Nur die Anzahl Werte", "Die Reihenfolge der Namen"], "Grösster Wert minus kleinster Wert ergibt die ___.", "Spannweite", "Diese Grösse ist im 2. Zyklus anschaulich."),
  ],
  "6-math-geometry": [
    fact("Ein Quader misst 8 cm · 5 cm · 3 cm. Wie gross ist sein Volumen?", "120 cm³", ["16 cm³", "40 cm³", "80 cm³"], "8 · 5 · 3 = ___ cm³.", "120", "Multipliziere Länge, Breite und Höhe."),
    fact("Ein Rechteck hat 48 cm² Fläche und ist 8 cm lang. Wie breit ist es?", "6 cm", ["4 cm", "8 cm", "40 cm"], "48 : 8 = ___ cm.", "6", "Nutze die Umkehroperation."),
    fact("Ein Dreieck hat Grundseite 12 cm und Höhe 7 cm. Wie gross ist seine Fläche?", "42 cm²", ["19 cm²", "84 cm²", "96 cm²"], "12 · 7 : 2 = ___ cm².", "42", "Halbiere das Produkt aus Grundseite und Höhe."),
    fact("Ein Würfel hat eine Kantenlänge von 5 cm. Wie gross ist sein Volumen?", "125 cm³", ["25 cm³", "75 cm³", "150 cm³"], "5 · 5 · 5 = ___ cm³.", "125", "Multipliziere die drei Kantenlängen."),
    fact("Wie viele Symmetrieachsen hat ein Quadrat?", "4", ["1", "2", "8"], "Ein Quadrat hat ___ Symmetrieachsen.", "4", "Zwei verlaufen durch Seitenmitten, zwei diagonal."),
    fact("Ein Kreis hat einen Radius von 7 cm. Wie gross ist sein Durchmesser?", "14 cm", ["3,5 cm", "7 cm", "21 cm"], "Der Durchmesser ist ___ cm.", "14", "Der Durchmesser ist doppelt so gross wie der Radius."),
  ],
  "6-german": [
    fact("Welche Wortart beschreibt ein Nomen genauer?", "Adjektiv", ["Verb", "Pronomen", "Konjunktion"], "Ein ___ beschreibt Eigenschaften eines Nomens.", "Adjektiv", "Zum Beispiel: der spannende Text."),
    fact("Was ist Aktiv?", "Das Subjekt führt die Handlung aus", ["Das Verb fehlt", "Der Satz hat kein Subjekt", "Die Handlung ist unmöglich"], "Im Aktiv ___ das Subjekt die Handlung aus.", "führt", "Beispiel: Mia öffnet die Tür."),
    fact("Was ist eine Metapher in einfacher Form?", "Ein bildhafter Ausdruck", ["Eine wörtliche Rechnung", "Ein Satz ohne Bedeutung", "Ein Reimwort"], "«Ein Meer aus Lichtern» ist ein bildhafter ___.", "Ausdruck", "Das Bild ist nicht wörtlich gemeint."),
  ],
  "6-science-states": [
    fact("Warum verdunstet Wasser bei Wärme schneller?", "Die Wasserteilchen bewegen sich stärker", ["Wasser wird schwerer", "Die Luft wird fest", "Teilchen hören auf sich zu bewegen"], "Bei Wärme bewegen sich Wasserteilchen ___.", "stärker", "Mehr Teilchen können die Oberfläche verlassen."),
    fact("Warum streut man Salz auf vereiste Wege?", "Salz erschwert das Gefrieren von Wasser", ["Salz macht Eis dicker", "Salz erzeugt Schnee", "Salz wärmt durch Feuer"], "Salz hilft, dass Eis leichter ___.", "schmilzt", "Die Gefriertemperatur sinkt."),
    fact("Was zeigt ein Teilchenmodell beim Schmelzen?", "Die Teilchen können sich freier bewegen", ["Die Teilchen verschwinden", "Neue Atome entstehen", "Die Masse verdoppelt sich"], "Beim Schmelzen bewegen sich Teilchen ___.", "freier", "Der Stoff wird flüssig."),
  ],
  "6-science-chemistry": [
    fact("Woran erkennt man eine chemische Reaktion?", "Es entstehen neue Stoffe mit neuen Eigenschaften", ["Nur die Form ändert sich", "Alles bleibt genau gleich", "Nur die Uhrzeit ändert sich"], "Bei einer chemischen Reaktion entstehen neue ___.", "Stoffe", "Farbänderung, Gas oder Wärme können Hinweise sein."),
    fact("Was zeigt die pH-Skala vereinfacht?", "Ob eine Lösung sauer, neutral oder basisch ist", ["Wie schwer ein Stoff ist", "Wie schnell Licht ist", "Wie alt Wasser ist"], "Die pH-Skala ordnet Lösungen als sauer, neutral oder ___ ein.", "basisch", "Neutral liegt ungefähr bei pH 7."),
  ],
  "6-science-light": [
    fact("Warum erscheint ein Strohhalm im Wasserglas geknickt?", "Licht ändert beim Übergang seine Richtung", ["Der Strohhalm bricht", "Wasser erzeugt Schatten", "Das Glas wird magnetisch"], "Beim Übergang zwischen Luft und Wasser wird Licht ___.", "gebrochen", "Das nennt man Lichtbrechung."),
    fact("Wie entsteht ein Regenbogen?", "Wassertropfen zerlegen weisses Licht in Farben", ["Wolken färben die Luft", "Der Wind malt Farben", "Schatten leuchten"], "Wassertropfen zerlegen weisses Licht in ___.", "Farben", "Brechung und Reflexion wirken zusammen."),
  ],
  "6-science-living-things": [
    fact("Was haben alle Lebewesen gemeinsam?", "Sie wachsen, reagieren und brauchen Energie", ["Sie können alle fliegen", "Sie leben alle im Wasser", "Sie sind alle gleich gross"], "Lebewesen wachsen und brauchen ___.", "Energie", "Auch Pflanzen sind Lebewesen."),
    fact("Welche Aufgabe hat die Haut?", "Sie schützt den Körper und nimmt Reize wahr", ["Sie pumpt Blut", "Sie verdaut Nahrung", "Sie bildet Knochen"], "Die Haut schützt und nimmt ___ wahr.", "Reize", "Berührung, Wärme und Kälte werden gespürt."),
    fact("Wie hängen Pflanzen und Tiere in einem Lebensraum zusammen?", "Durch Nahrung, Sauerstoff und Lebensraum", ["Sie haben nichts miteinander zu tun", "Tiere erzeugen Sonnenlicht", "Pflanzen brauchen keine Umwelt"], "Pflanzen und Tiere bilden ein ___.", "Ökosystem", "Veränderungen können viele Arten betreffen."),
    fact("Warum ist Artenvielfalt wichtig?", "Unterschiedliche Arten erfüllen verschiedene Aufgaben", ["Nur eine Art wird gebraucht", "Vielfalt verhindert Nahrung", "Alle Arten sind austauschbar"], "Viele verschiedene Arten nennt man ___.", "Artenvielfalt", "Bestäuber, Pflanzen und Zersetzer wirken zusammen."),
    fact("Was geschieht bei der Verdauung?", "Nahrung wird in nutzbare Bestandteile zerlegt", ["Nahrung wird zu Luft", "Der Körper erzeugt Steine", "Nur Wasser wird verarbeitet"], "Bei der Verdauung wird Nahrung ___.", "zerlegt", "So kann der Körper Nährstoffe aufnehmen."),
    fact("Warum ist Bewegung gesund?", "Sie stärkt Herz, Muskeln und Knochen", ["Sie ersetzt Schlaf", "Sie stoppt den Kreislauf", "Sie macht Knochen weich"], "Bewegung stärkt Herz, Muskeln und ___.", "Knochen", "Regelmässige Aktivität unterstützt den Körper."),
    fact("Wie schützt sich der Körper vor Krankheitserregern?", "Haut und Immunsystem wehren sie ab", ["Nur Haare helfen", "Der Körper tut nichts", "Kälte entfernt alle Erreger"], "Das ___ bekämpft Krankheitserreger.", "Immunsystem", "Auch die Haut ist eine Schutzbarriere."),
    fact("Was bedeutet Anpassung bei Lebewesen?", "Merkmale helfen in einem bestimmten Lebensraum", ["Jedes Tier kann überall gleich leben", "Merkmale ändern sich täglich", "Anpassung bedeutet Schlaf"], "Angepasste Merkmale helfen im ___.", "Lebensraum", "Zum Beispiel dichtes Fell in der Kälte."),
  ],
  "6-science-energy": [
    fact("Welche erneuerbare Energiequelle eignet sich auf einem sonnigen Dach?", "Solarenergie", ["Kohle", "Erdöl", "Diesel"], "Eine Solaranlage nutzt die Energie der ___.", "Sonne", "Sie wandelt Licht in Strom oder Wärme um."),
  ],
  "6-science-technology": [
    fact("Wie arbeitet ein Computerprogramm?", "Es führt eine Folge eindeutiger Anweisungen aus", ["Es rät ohne Regeln", "Es erzeugt Strom aus nichts", "Es verändert die Zeit"], "Eine geordnete Folge von Anweisungen heisst ___.", "Algorithmus", "Jeder Schritt muss verständlich sein."),
  ],
  "6-science-space": [
    fact("Warum gibt es Tag und Nacht?", "Die Erde dreht sich um ihre Achse", ["Die Sonne erlischt", "Wolken decken die Erde zu", "Der Mond dreht die Sonne"], "Tag und Nacht entstehen durch die ___ der Erde.", "Drehung", "Eine Umdrehung dauert ungefähr 24 Stunden."),
    fact("Was ist eine Galaxie?", "Eine grosse Ansammlung von Sternen, Gas und Staub", ["Ein einzelner Planet", "Eine Wetterwolke", "Ein Mondkrater"], "Die Milchstrasse ist eine ___.", "Galaxie", "Unser Sonnensystem liegt darin."),
    fact("Wie erforschen Menschen das Weltall?", "Mit Teleskopen, Sonden und Messgeräten", ["Nur mit Landkarten", "Mit Thermometern im Klassenzimmer", "Ohne Beobachtungen"], "Eine Raumsonde sammelt Daten mit ___.", "Messgeräten", "Messungen liefern überprüfbare Informationen."),
    fact("Warum sind Raumanzüge nötig?", "Sie liefern Luft und schützen vor extremen Bedingungen", ["Sie machen Menschen unsichtbar", "Sie erzeugen Schwerkraft", "Sie ersetzen Raumschiffe"], "Ein Raumanzug liefert Atemluft und ___.", "Schutz", "Im All fehlen Luftdruck und atembare Luft."),
  ],
  "6-science-future": [
    fact("Wie kann man Informationen im Internet prüfen?", "Mehrere verlässliche Quellen vergleichen", ["Die erste Überschrift glauben", "Nur Likes zählen", "Absender ignorieren"], "Vor dem Teilen sollte man die ___ prüfen.", "Quelle", "Autor, Datum und Belege sind wichtig."),
    fact("Was hilft gegen den Klimawandel?", "Treibhausgase senken und Ressourcen schonen", ["Mehr Energie verschwenden", "Wälder entfernen", "Produkte sofort wegwerfen"], "Klimaschutz soll Treibhausgase ___.", "senken", "Energie, Verkehr und Konsum spielen eine Rolle."),
    fact("Warum müssen technische Lösungen fair gestaltet sein?", "Nutzen und Risiken betreffen verschiedene Menschen", ["Technik hat nie Folgen", "Nur der Preis zählt", "Regeln sind unnötig"], "Bei Technik sollen Nutzen und ___ geprüft werden.", "Risiken", "Auch Datenschutz und Zugang zählen."),
    fact("Was bedeutet nachhaltiger Konsum?", "Produkte bewusst auswählen, lange nutzen und reparieren", ["Alles sofort ersetzen", "Nur Verpackung beachten", "Möglichst viel Abfall erzeugen"], "Nachhaltiger Konsum vermeidet unnötigen ___.", "Abfall", "Reparieren und Teilen spart Ressourcen."),
    fact("Wie kann eine Klasse Zukunftsideen bewerten?", "Folgen für Menschen und Umwelt vergleichen", ["Nur die schönste Zeichnung wählen", "Keine Fragen stellen", "Nur kurzfristig denken"], "Gute Entscheidungen beachten Menschen und ___.", "Umwelt", "Denke an Vor- und Nachteile."),
    fact("Was ist digitale Verantwortung?", "Daten schützen und respektvoll kommunizieren", ["Passwörter teilen", "Andere beleidigen", "Jede Nachricht weiterleiten"], "Persönliche Daten sollte man ___.", "schützen", "Starke Passwörter und Respekt gehören dazu."),
  ],
};

const GROUP_BY_EXERCISE = new Map<string, keyof typeof GROUP_IDS>();
for (const [group, ids] of Object.entries(GROUP_IDS) as [keyof typeof GROUP_IDS, readonly string[]][]) {
  const [grade, subject] = group.split("-");
  for (const id of ids) GROUP_BY_EXERCISE.set(`${grade}-${subject}-${id}`, group);
}

function replacementExercise(original: Exercise, safe: SafeFact, ordinal: number): Exercise {
  const common = {
    id: original.id,
    difficulty: original.difficulty,
    free: original.free,
    hints: [safe.hint, `Prüfe den Zusammenhang noch einmal.`],
  };

  if (original.type === "multiple-choice") {
    return { ...common, type: "multiple-choice", question: `Denkaufgabe ${ordinal + 1}: ${safe.question}`, answer: safe.answer, options: safe.options };
  }
  if (original.type === "fill-in-blank") {
    return { ...common, type: "fill-in-blank", question: `Denkaufgabe ${ordinal + 1}: ${safe.fill}`, answer: safe.fillAnswer };
  }
  throw new Error(`LP21 replacement ${original.id} has unsupported type ${original.type}`);
}

export const LP21_REPLACEMENT_COUNT = Object.values(GROUP_IDS).reduce((sum, ids) => sum + ids.length, 0);
export const LP21_REPLACEMENT_IDS = new Set(Object.values(GROUP_IDS).flat());

export function applyLp21ExerciseReplacements(grade: number, subject: string, topics: Topic[]): Topic[] {
  return topics.map((topic) => ({
    ...topic,
    exercises: topic.exercises.map((exercise) => {
      const group = GROUP_BY_EXERCISE.get(`${grade}-${subject}-${exercise.id}`);
      if (!group) return exercise;
      const ids: readonly string[] = GROUP_IDS[group];
      const safeFacts = SAFE_FACTS[group];
      const index = ids.indexOf(exercise.id);
      return replacementExercise(exercise, safeFacts[index % safeFacts.length], index);
    }),
  }));
}
