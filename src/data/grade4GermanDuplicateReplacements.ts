import type { Exercise, Topic } from "../types/exercise";

type Task = [question: string, answer: string, hint: string];

const range = (prefix: string) => Array.from({ length: 15 }, (_, i) => `${prefix}${i + 36}`);
const targetIds: Record<string, string[]> = {
  "interpunktion-4": range("ip4_"), "leseverstaendnis-4": range("lv4_"), "praepositionen-4": range("pp4_"),
  "pronomen-4": range("pr4_"), "wortarten-4": range("wa4_"), "wortstamm-4": range("ws4_"),
  "rechtschreibung-4": ["g4d28","g4d29","g4d30","g4rs3a","g4rs3b","g4rs3c","g4rs3d","g4rs3e","g4rs3f","g4rs3g","g4rs3h","g4rs3i","g4rs3j","g4rs3k","g4rs3l"],
  satzglieder: ["g4sg3c","g4sg3d","g4sg3e","g4sg3f","g4sg3g","g4sg3h","g4sg3i","g4sg3j","g4sg3k","g4sg3l"],
  "zeitformen-4": ["g4d18","g4d19","g4d20","g4zf3a","g4zf3b","g4zf3c","g4zf3d","g4zf3e","g4zf3f","g4zf3g","g4zf3h","g4zf3i","g4zf3j","g4zf3k","g4zf3l"],
};

const tasks: Record<string, Task[]> = {
  "interpunktion-4": [
    ["Ergänze das Satzzeichen: Kommst du heute___","?","Der Satz fragt nach etwas."],
    ["Ergänze: Achtung___ Der Boden ist nass!","!","Das erste Wort ist ein Warnruf."],
    ["Ergänze: Mia sagt___ «Ich bin bereit.»",":","Danach folgt eine wörtliche Rede."],
    ["Ergänze: Ich bleibe zu Hause___ weil ich krank bin.",",","Ein Nebensatz folgt auf den Hauptsatz."],
    ["Ergänze: Wir kaufen Brot___ Käse und Äpfel.",",","Mehrere Dinge werden aufgezählt."],
    ["Ergänze: Obwohl es regnet___ gehen wir spazieren.",",","Der Nebensatz steht am Anfang."],
    ["Ergänze: Lukas___ räum bitte dein Zimmer auf.",",","Eine Person wird direkt angesprochen."],
    ["Ergänze: Hast du den Schlüssel gefunden___","?","Achte auf die Satzart."],
    ["Ergänze: Wie wunderschön___","!","Der Satz drückt starke Freude aus."],
    ["Ergänze: Im Rucksack sind___ Trinkflasche, Karte und Jacke.",":","Nach der Ankündigung folgt eine Liste."],
    ["Ergänze: Wenn das Wasser kocht___ geben wir die Nudeln hinein.",",","Der Nebensatz am Anfang wird abgetrennt."],
    ["Ergänze: «Warte auf mich___», ruft Nora.","!","Nora ruft den Satz laut."],
    ["Ergänze: Der Hund, der im Garten spielt___ gehört uns.",",","Der eingeschobene Relativsatz wird auf beiden Seiten abgetrennt."],
    ["Ergänze: Nein___ das glaube ich nicht.",",","Das einleitende Antwortwort wird abgetrennt."],
    ["Ergänze: Wir gehen los___ sobald alle da sind.",",","Das Bindewort leitet einen Nebensatz ein."],
  ],
  "leseverstaendnis-4": [
    ["Text: «Lea fährt am Mittwoch mit dem Velo zur Bibliothek.» An welchem Tag fährt Lea? ___","Mittwoch","Suche die Zeitangabe im Satz."],
    ["Text: «Im roten Korb liegen fünf Äpfel und zwei Birnen.» Wie viele Äpfel liegen dort? ___","fünf","Zähle nur die zuerst genannte Frucht."],
    ["Text: «Noah zieht die Stiefel an, weil es draussen regnet.» Warum zieht er Stiefel an? ___","weil es regnet","Der Grund steht nach dem Bindewort."],
    ["Text: «Der Zug nach Bern fährt auf Gleis sieben.» Wohin fährt der Zug? ___","Bern","Gesucht ist der Zielort."],
    ["Text: «Nach dem Training trinkt Elin ein Glas Wasser.» Was trinkt Elin? ___","Wasser","Suche das Getränk."],
    ["Text: «Der Fuchs versteckt sich hinter dem grossen Stein.» Wo versteckt er sich? ___","hinter dem Stein","Suche die Ortsangabe."],
    ["Text: «Um halb acht beginnt der Unterricht.» Wann beginnt er? ___","halb acht","Suche die Uhrzeit."],
    ["Text: «Sam nimmt einen Schirm mit, obwohl die Sonne scheint.» Was nimmt Sam mit? ___","einen Schirm","Gesucht ist der Gegenstand."],
    ["Text: «Die Klasse sammelt Papier für das Recycling.» Wofür sammelt sie Papier? ___","für das Recycling","Der Zweck steht am Satzende."],
    ["Text: «Auf dem höchsten Ast sitzt eine Amsel.» Welches Tier sitzt dort? ___","eine Amsel","Suche das Lebewesen."],
    ["Text: «Mara liest zuerst die Anleitung und baut danach das Modell.» Was liest sie zuerst? ___","die Anleitung","Achte auf das Signalwort für die Reihenfolge."],
    ["Text: «Der kleine Bach fliesst durch den Wald zum See.» Wohin fliesst er? ___","zum See","Gesucht ist das Ziel."],
    ["Text: «Im Winter trägt Jan einen dicken Wollpullover.» Wann trägt Jan ihn? ___","im Winter","Suche die Jahreszeit."],
    ["Text: «Weil der Akku leer ist, lädt Livia das Tablet.» Was ist leer? ___","der Akku","Der Grund nennt das gesuchte Ding."],
    ["Text: «Das Museum öffnet um zehn Uhr und schliesst um fünf.» Wann öffnet es? ___","um zehn Uhr","Nimm die erste Zeitangabe."],
  ],
  "praepositionen-4": [
    ["Ergänze: Das Buch liegt ___ dem Tisch.","auf","Es berührt die obere Fläche."], ["Ergänze: Die Katze sitzt ___ dem Sofa.","unter","Sie befindet sich tiefer als das Möbel."],
    ["Ergänze: Wir gehen ___ die Brücke.","über","Der Weg führt von einer Seite zur anderen auf erhöhter Strecke."], ["Ergänze: Der Ball rollt in den Spalt ___ dem Bett.","unter","Er verschwindet in den tieferen Zwischenraum."],
    ["Ergänze: Mia wartet ___ der Bushaltestelle.","an","Gesucht ist die Position direkt bei einem Ort."], ["Ergänze: Das Bild hängt direkt links ___ der Tür.","neben","Es befindet sich seitlich davon."],
    ["Ergänze: Wir fahren ___ dem Zug nach Basel.","mit","Der Zug wird als Begleiter der Fahrt genannt."], ["Ergänze: Der Brief ist ___ meinen Grossvater.","für","Die Präposition nennt den Empfänger."],
    ["Ergänze: Seit Montag lernt Ben ___ die Prüfung.","für","Die Präposition nennt den Zweck."], ["Ergänze: Der Weg führt ___ den Wald.","durch","Man gelangt hinein und auf der anderen Seite hinaus."],
    ["Ergänze: ___ des Regens spielen wir draussen.","Trotz","Der Gegensatz zur erwarteten Folge ist gemeint."], ["Ergänze: Wir treffen uns ___ dem Mittagessen.","nach","Das Treffen ist später."],
    ["Ergänze: ___ der Pause lösen wir die Aufgabe.","Während","Die Handlung geschieht zur gleichen Zeit."], ["Ergänze: Der Vogel fliegt ___ das Haus.","hinter","Danach ist er von vorne nicht mehr sichtbar."],
    ["Ergänze: Der Laden ist ___ acht Uhr geöffnet.","ab","Gesucht ist der Beginn eines Zeitraums."],
  ],
  "pronomen-4": [
    ["Ersetze «Lina» durch ein Pronomen: ___ liest ein Buch.","Sie","Gesucht ist die weibliche Einzahl."], ["Ersetze «Tom und Leo»: ___ spielen Fussball.","Sie","Gesucht ist die Mehrzahl."],
    ["Ergänze: Das ist mein Velo. Es gehört ___.","mir","Das Pronomen steht nach dem Verb gehören."], ["Ergänze: Wir besuchen Anna. Wir besuchen ___.","sie","Ersetze den weiblichen Namen im Akkusativ."],
    ["Ergänze: Paul hilft dem Kind. Paul hilft ___.","ihm","Das ersetzte Nomen ist sächlich und steht im Dativ."], ["Ergänze: Ist das ___ Jacke, Nora?","deine","Die Jacke gehört der angesprochenen Person."],
    ["Ergänze: Wir packen ___ Rucksäcke.","unsere","Die Rucksäcke gehören der sprechenden Gruppe."], ["Ergänze: Der Hund wedelt mit ___ Schwanz.","seinem","Das Körperteil gehört zum männlichen Tier."],
    ["Ergänze das Relativpronomen: Das Buch, ___ ich lese, ist spannend.","das","Es bezieht sich auf ein sächliches Nomen."], ["Ergänze: ___ von euch hat den Schlüssel?","Wer","Gefragt wird nach einer Person."],
    ["Ergänze: Ich sehe zwei Stifte. ___ ist blau.","Einer","Gemeint ist genau ein Stift aus der Zweiergruppe."], ["Ergänze: Lea und ich gehen. ___ nehmen den Bus.","Wir","Die sprechende Person gehört zur Gruppe."],
    ["Ergänze: Kannst du ___ bitte helfen?","mir","Die sprechende Person braucht Hilfe."], ["Ergänze: Das Haus hat ___ Fenster offen.","seine","Das Fenster gehört zum sächlichen Nomen."],
    ["Ergänze: Diese Schuhe gehören Tim. Es sind ___.","seine","Das Besitzpronomen bezieht sich auf einen Jungen."],
  ],
  "rechtschreibung-4": [
    ["Ergänze den Doppelkonsonanten: Die So___e scheint.","nn","Der Vokal davor wird kurz gesprochen."], ["Ergänze: Wir fa___en mit dem Velo.","hr","Sprich das Wort langsam und achte auf die Laute nach dem a."],
    ["Ergänze die Dehnung: Der Za___ ist locker.","hn","Vergleiche Einzahl und Mehrzahl."], ["Ergänze: Das Wasser flie___t schnell.","ss","Nutze die in der Schweiz übliche Form ohne Eszett."],
    ["Ergänze: Der Wu___ ist im Boden.","rm","Sprich die Mehrzahl langsam."], ["Ergänze: Wir ko___en eine Suppe.","ch","Höre auf den Laut direkt vor der Endung."],
    ["Ergänze: Das Kind läu___t nach Hause.","f","Denke an die Grundform laufen."], ["Ergänze: Die Blu___e blüht.","m","Das Wort hat nur einen Konsonanten an dieser Stelle."],
    ["Ergänze: Der Hu___ bellt laut.","nd","Sprich die Mehrzahl langsam."], ["Ergänze: Sie ni___t den roten Stift.","mm","Denke an die Grundform nehmen."],
    ["Ergänze: Das Fe___ster ist offen.","n","Sprich das Wort langsam in Silben."], ["Ergänze: Wir spi___en im Garten.","el","Das vollständige Wort hat zwei Silben."],
    ["Ergänze: Der Kö___ig trägt eine Krone.","n","Sprich die zweite Silbe deutlich."], ["Ergänze: Die Stra___e ist gesperrt.","ss","Nutze die Schweizer Form ohne Eszett."],
    ["Ergänze: Das Mädchen li___t ein Buch.","es","Die Grundform hat zwei Silben."],
  ],
  satzglieder: [
    ["Bestimme das Subjekt: «Der flinke Hase rennt.» ___","Der flinke Hase","Frage: Wer oder was rennt?"], ["Bestimme das Prädikat: «Mila öffnet das Fenster.» ___","öffnet","Gesucht ist die konjugierte Verbform."],
    ["Bestimme das Akkusativobjekt: «Ben trägt den Rucksack.» ___","den Rucksack","Frage: Wen oder was trägt Ben?"], ["Bestimme das Dativobjekt: «Nora hilft ihrem Bruder.» ___","ihrem Bruder","Frage: Wem hilft Nora?"],
    ["Bestimme die Zeitangabe: «Am Morgen fährt der Bus.» ___","Am Morgen","Frage: Wann fährt er?"], ["Bestimme die Ortsangabe: «Die Kinder spielen im Park.» ___","im Park","Frage: Wo spielen sie?"],
    ["Bestimme das Subjekt: «Auf dem Dach sitzt eine Katze.» ___","eine Katze","Frage: Wer oder was sitzt?"], ["Bestimme das Prädikat: «Morgen werden wir schwimmen.» ___","werden schwimmen","Das Prädikat kann aus zwei Teilen bestehen."],
    ["Bestimme das Akkusativobjekt: «Die Klasse besucht das Museum.» ___","das Museum","Frage: Wen oder was besucht die Klasse?"], ["Bestimme die Artangabe: «Der Hund läuft sehr schnell.» ___","sehr schnell","Frage: Wie läuft er?"],
  ],
  "wortarten-4": [
    ["Bestimme die Wortart von «springen»: ___","Verb","Das Wort bezeichnet eine Tätigkeit."], ["Bestimme die Wortart von «freundlich»: ___","Adjektiv","Das Wort beschreibt eine Eigenschaft."],
    ["Bestimme die Wortart von «Schule»: ___","Nomen","Das Wort wird grossgeschrieben und benennt etwas."], ["Bestimme die Wortart von «wir»: ___","Pronomen","Das Wort steht für mehrere Personen."],
    ["Bestimme die Wortart von «unter»: ___","Präposition","Das Wort zeigt ein Verhältnis an."], ["Bestimme die Wortart von «aber»: ___","Konjunktion","Das Wort verbindet Satzteile."],
    ["Bestimme die Wortart von «gestern»: ___","Adverb","Das Wort macht eine nähere Zeitangabe."], ["Bestimme die Wortart von «der»: ___","Artikel","Das Wort begleitet ein Nomen."],
    ["Bestimme die Wortart von «leise» in «der leise Ton»: ___","Adjektiv","Das Wort beschreibt hier ein Nomen genauer."], ["Bestimme die Wortart von «und»: ___","Konjunktion","Das Wort verbindet Gleichrangiges."],
    ["Bestimme die Wortart von «euch»: ___","Pronomen","Das Wort ersetzt angesprochene Personen."], ["Bestimme die Wortart von «zwischen»: ___","Präposition","Das Wort beschreibt eine Lage."],
    ["Bestimme die Wortart von «plötzlich» in «Es regnet plötzlich»: ___","Adverb","Hier beschreibt das Wort die Umstände einer Handlung."], ["Bestimme die Wortart von «denken»: ___","Verb","Das Wort lässt sich konjugieren."],
    ["Bestimme die Wortart von «Freude»: ___","Nomen","Ein Artikel kann davorstehen."],
  ],
  "wortstamm-4": [
    ["Nenne den Wortstamm von «Spielplatz»: ___","spiel","Vergleiche das Nomen mit dem passenden Tätigkeitswort."], ["Nenne den Wortstamm von «fahrbar»: ___","fahr","Vergleiche das Adjektiv mit dem passenden Tätigkeitswort."],
    ["Ergänze die Wortfamilie: schreiben, Schreiber, ___.","Schrift","Gesucht ist ein verwandtes Nomen."], ["Ergänze: laufen, Läufer, ___.","Lauf","Gesucht ist das kurze Grundnomen."],
    ["Bilde mit dem Stamm «lern» ein Nomen für eine Person: ___.","Lernende","Hänge eine Endung für eine Person an."], ["Bilde mit «un-» das Gegenteil von «klar»: ___.","unklar","Setze die verneinende Vorsilbe davor."],
    ["Bilde aus «Freund» mit «-lich» ein Adjektiv: ___.","freundlich","Hänge die passende Nachsilbe an."], ["Bilde aus «Mut» mit «-ig» ein Adjektiv: ___.","mutig","Die Nachsilbe macht daraus eine Eigenschaft."],
    ["Welcher Wortstamm steckt in «Häuser»? ___","haus","Der Umlaut wird in der Grundform zurückverwandelt."], ["Welcher Wortstamm steckt in «kräftig»? ___","kraft","Denke an das verwandte Nomen ohne Umlaut."],
    ["Ergänze: sehen, Aussicht, ___.","sichtbar","Gesucht ist ein verwandtes Adjektiv."], ["Bilde ein zusammengesetztes Wort aus «Sonne» und «Brille»: ___.","Sonnenbrille","Zwischen den beiden Teilen steht ein Verbindungsbuchstabe."],
    ["Bilde aus «Glück» mit «-lich» ein Adjektiv: ___.","glücklich","Hänge die Nachsilbe für eine Eigenschaft an."], ["Nenne den gemeinsamen Stamm: Leser, lesen, lesbar: ___.","les","Vergleiche die drei verwandten Wörter."],
    ["Bilde mit «be-» ein Verb aus «zahlen»: ___.","bezahlen","Setze die Vorsilbe vor die Grundform."],
  ],
  "zeitformen-4": [
    ["Setze ins Präteritum: Ich spiele. → Ich ___.","spielte","Regelmässiges Verb: Wortstamm plus Vergangenheitsendung."], ["Setze ins Präteritum: Wir gehen. → Wir ___.","gingen","Das Verb verändert seinen Stammvokal."],
    ["Setze ins Perfekt: Sie malt. → Sie hat ___.","gemalt","Bilde das Partizip des regelmässigen Verbs."], ["Setze ins Perfekt: Er liest. → Er hat ___.","gelesen","Das Partizip gehört zur Grundform lesen."],
    ["Setze ins Präsens: Morgen wird es regnen. → Heute ___ es.","regnet","Gesucht ist die Gegenwartsform."], ["Setze ins Futur: Ich lerne. → Ich werde ___.","lernen","Nach dem Hilfsverb steht der Infinitiv."],
    ["Setze ins Präteritum: Du findest den Weg. → Du ___ den Weg.","fandest","Das unregelmässige Verb verändert den Stammvokal."], ["Setze ins Perfekt: Wir fahren nach Bern. → Wir sind nach Bern ___.","gefahren","Bei einer Ortsveränderung steht das Hilfsverb sein."],
    ["Setze ins Präteritum: Die Kinder lachen. → Die Kinder ___.","lachten","Regelmässiges Verb mit Vergangenheitsendung."], ["Setze ins Perfekt: Ich schreibe einen Brief. → Ich habe einen Brief ___.","geschrieben","Das Verb bildet ein unregelmässiges Partizip."],
    ["Setze ins Futur: Ihr spielt draussen. → Ihr werdet draussen ___.","spielen","Nach werdet folgt die Grundform."], ["Setze ins Präsens: Gestern schlief Lea. → Heute ___ Lea.","schläft","Gesucht ist die Gegenwartsform mit Umlaut."],
    ["Setze ins Präteritum: Er bringt das Buch. → Er ___ das Buch.","brachte","Das Verb hat eine besondere Vergangenheitsform."], ["Setze ins Perfekt: Du trinkst Wasser. → Du hast Wasser ___.","getrunken","Das Partizip verändert den Stammvokal."],
    ["Setze ins Präteritum: Wir sehen den See. → Wir ___ den See.","sahen","Die Vergangenheitsform hat einen anderen Stammvokal."],
  ],
};

export function applyGrade4GermanDuplicateReplacements(topics: Topic[]): Topic[] {
  return topics.map(topic => {
    const ids = targetIds[topic.id], topicTasks = tasks[topic.id];
    if (!ids || !topicTasks) return topic;
    if (ids.length !== topicTasks.length) throw new Error(`Grade 4 German replacement mismatch: ${topic.id}`);
    const replacements = new Map(ids.map((id, i) => [id, topicTasks[i]]));
    return { ...topic, exercises: topic.exercises.map((exercise): Exercise => {
      const task = replacements.get(exercise.id);
      if (!task) return exercise;
      const [question, answer, hint] = task;
      const secondHint = topic.id === "rechtschreibung-4" ? "Höre genau hin." : "Prüfe, ob die Lösung genau in den Satz passt.";
      return { ...exercise, question, questionEN:`German exercise: ${question}`, questionFR:`Exercice d’allemand : ${question}`, questionIT:`Esercizio di tedesco: ${question}`, answer, answerEN:answer, answerFR:answer, answerIT:answer, hints:[hint,secondHint], hintsEN:["Use the German grammar clue in the sentence.","Check that the solution fits exactly."], hintsFR:["Utilise l’indice grammatical allemand de la phrase.","Vérifie que la solution convient exactement."], hintsIT:["Usa l’indizio grammaticale tedesco nella frase.","Controlla che la soluzione si adatti esattamente."], options:undefined, optionsEN:undefined, optionsFR:undefined, optionsIT:undefined };
    }) };
  });
}
