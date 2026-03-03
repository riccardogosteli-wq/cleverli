import { Topic } from "@/types/exercise";

const grade6German: Topic[] = [
  {
    id: "kasus",
    title: "Kasus: Nominativ, Akkusativ, Dativ",
    emoji: "📌",
    exercises: [
      { id: "g6d1", type: "multiple-choice", question: "«Der Hund bellt.» — In welchem Fall steht «der Hund»?", answer: "Nominativ", options: ["Nominativ","Akkusativ","Dativ","Genitiv"], hints: ["Wer oder was bellt? → Das ist der Nominativ (Subjekt)."], difficulty: 1, free: true },
      { id: "g6d2", type: "multiple-choice", question: "«Ich sehe den Hund.» — In welchem Fall steht «den Hund»?", answer: "Akkusativ", options: ["Nominativ","Akkusativ","Dativ","Genitiv"], hints: ["Wen oder was sehe ich? → Akkusativ (direktes Objekt)."], difficulty: 1, free: true },
      { id: "g6d3", type: "fill-in-blank", question: "«Ich gebe ___ Hund einen Knochen.» — Ergänze den richtigen Artikel (dem/den/der).", answer: "dem", hints: ["Wem gebe ich? → Dativ. Maskulin im Dativ = dem."], difficulty: 1, free: true },
      { id: "g6d4", type: "multiple-choice", question: "«Die Lehrerin hilft dem Kind.» — «dem Kind» steht im…", answer: "Dativ", options: ["Nominativ","Akkusativ","Dativ","Genitiv"], hints: ["Wem hilft sie? → Dativ. Frage: Wem?"], difficulty: 2 },
      { id: "g6d5", type: "fill-in-blank", question: "«Ich besuche ___ Freundin.» Ergänze (die/der/das).", answer: "die", hints: ["Wen besuche ich? → Akkusativ. Freundin ist feminin → die (im Akkusativ bleibt es «die»)."], difficulty: 2 },
      { id: "g6d6", type: "multiple-choice", question: "In welchem Fall steht das Subjekt eines Satzes immer?", answer: "Nominativ", options: ["Akkusativ","Dativ","Nominativ","Genitiv"], hints: ["Wer oder was tut etwas? Das Subjekt steht immer im Nominativ."], difficulty: 2 },
      { id: "g6d7", type: "fill-in-blank", question: "«Das Geschenk gehört ___ Bruder.» Ergänze (dem/den/der).", answer: "dem", hints: ["Wem gehört es? → Dativ. Bruder ist maskulin → dem Bruder."], difficulty: 2 },
      { id: "g6d8", type: "multiple-choice", question: "«Sie kauft einen Apfel.» — Welchen Fall hat «einen Apfel»?", answer: "Akkusativ", options: ["Nominativ","Akkusativ","Dativ","Genitiv"], hints: ["Was kauft sie? → Akkusativ. Maskulin im Akkusativ = einen."], difficulty: 3 },
      { id: "g6d9", type: "fill-in-blank", question: "«Er schreibt ___ Lehrer einen Brief.» Ergänze (dem/den/der).", answer: "dem", hints: ["Wem schreibt er? → Dativ. Lehrer ist maskulin im Dativ = dem."], difficulty: 3 },
      { id: "g6d10", type: "multiple-choice", question: "Welcher Satz ist korrekt?", answer: "Sie hilft dem alten Mann.", options: ["Sie hilft den alten Mann.","Sie hilft der alten Mann.","Sie hilft dem alten Mann.","Sie hilft das alte Mann."], hints: ["helfen → Dativ. Mann ist maskulin → Dativ: dem alten Mann."], difficulty: 3 },
    ],
  },
  {
    id: "textsorten",
    title: "Textsorten",
    emoji: "📄",
    exercises: [
      { id: "g6d11", type: "multiple-choice", question: "Was ist ein Merkmal eines Berichts?", answer: "Sachlich, ohne Meinung, beantwortet W-Fragen", options: ["Enthält viele Reime","Hat einen Erzähler","Sachlich, ohne Meinung, beantwortet W-Fragen","Ist immer sehr kurz"], hints: ["Bericht = Wer? Was? Wann? Wo? Wie? — sachlich und objektiv."], difficulty: 1, free: true },
      { id: "g6d12", type: "multiple-choice", question: "Was ist ein Merkmal eines Briefes?", answer: "Anrede, Datum, Gruss und Unterschrift", options: ["Refrains und Strophen","Anrede, Datum, Gruss und Unterschrift","Überschrift und Zwischenüberschriften","Anfang, Höhepunkt, Ende"], hints: ["Formelle Briefe haben eine klare Struktur: Ort/Datum, Betreff, Anrede, Text, Gruss."], difficulty: 1, free: true },
      { id: "g6d13", type: "fill-in-blank", question: "Ein Text, der eine persönliche Meinung mit Begründungen darlegt, heisst ___.", answer: "Erörterung", hints: ["Er = er-örtern = einen Standpunkt mit Argumenten darlegen."], difficulty: 1, free: true },
      { id: "g6d14", type: "multiple-choice", question: "Welche Textsorte hat Strophen und Refrains?", answer: "Lied / Gedicht", options: ["Bericht","Brief","Lied / Gedicht","Anleitung"], hints: ["Strophen und Refrains sind typisch für Lieder und viele Gedichte."], difficulty: 2 },
      { id: "g6d15", type: "fill-in-blank", question: "Eine schrittweise Erklärung, wie man etwas tut, heisst ___.", answer: "Anleitung", hints: ["Anleitungen verwenden Imperativ: «Falte das Papier...», «Schneide dann...»"], difficulty: 2 },
      { id: "g6d16", type: "multiple-choice", question: "Was unterscheidet eine Erörterung von einem Bericht?", answer: "Die Erörterung enthält eine persönliche Meinung", options: ["Der Bericht hat mehr Absätze","Die Erörterung ist immer kürzer","Die Erörterung enthält eine persönliche Meinung","Der Bericht verwendet Reime"], hints: ["Bericht = objektiv (keine Meinung). Erörterung = Standpunkt + Argumente."], difficulty: 2 },
      { id: "g6d17", type: "fill-in-blank", question: "Ein Text, der eine Geschichte erzählt (mit Figuren, Ort, Zeit, Handlung), heisst ___.", answer: "Erzählung", hints: ["Erzählungen haben eine Einleitung, einen Hauptteil mit Höhepunkt, und einen Schluss."], difficulty: 2 },
      { id: "g6d18", type: "multiple-choice", question: "Was ist das Ziel eines Werbetextes?", answer: "Den Leser überzeugen, etwas zu kaufen oder zu tun", options: ["Etwas sachlich berichten","Den Leser unterhalten","Den Leser überzeugen, etwas zu kaufen oder zu tun","Eine Geschichte erzählen"], hints: ["Werbetexte nutzen emotionale Sprache und Appelle, um zu überzeugen."], difficulty: 3 },
      { id: "g6d19", type: "fill-in-blank", question: "Ein kurzer Text, der in einer Zeitung über ein aktuelles Ereignis berichtet, heisst ___.", answer: "Nachricht", hints: ["Nachrichten beantworten: Wer? Was? Wann? Wo? — kurz und sachlich."], difficulty: 3 },
      { id: "g6d20", type: "multiple-choice", question: "Welche Textsorte verwendet man, um in einem Zeugnis oder Lebenslauf Informationen zu strukturieren?", answer: "Sachtext / Tabellarischer Lebenslauf", options: ["Gedicht","Erzählung","Sachtext / Tabellarischer Lebenslauf","Märchen"], hints: ["Sachtexte geben geordnete Fakten — kein erzählerisches Element, keine Reime."], difficulty: 3 },
    ],
  },
  {
    id: "rechtschreibstrategien",
    title: "Rechtschreibstrategien",
    emoji: "🔤",
    exercises: [
      { id: "g6d21", type: "multiple-choice", question: "Wie prüft man, ob ein Nomen gross- oder kleingeschrieben wird?", answer: "Kann man «ein/eine» davor setzen?", options: ["Steht es am Satzanfang?","Ist es ein Adjektiv?","Kann man «ein/eine» davor setzen?","Hat es mehr als 5 Buchstaben?"], hints: ["«ein Hund», «eine Katze» → Hund und Katze sind Nomen → Grossschreibung."], difficulty: 1, free: true },
      { id: "g6d22", type: "fill-in-blank", question: "Die Verlängerungsstrategie: Ist das Wort «kalt» mit d oder t am Ende? Verlängere: «kal___e Luft».", answer: "t", hints: ["Verlängern: «kalte» → wir hören t, also schreiben wir kalt mit t."], difficulty: 1, free: true },
      { id: "g6d23", type: "multiple-choice", question: "Welche Strategie hilft bei Wörtern mit ie oder i?", answer: "Das Wort dehnen und auf den langen Laut hören", options: ["Das Wort umgekehrt lesen","Das Wort schnell sprechen","Das Wort dehnen und auf den langen Laut hören","Die erste Silbe weglassen"], hints: ["«lie-ben» → langer i-Laut → ie. «bit-ten» → kurzer i-Laut → i."], difficulty: 1, free: true },
      { id: "g6d24", type: "fill-in-blank", question: "Ableiten: «das Rad» — schreibt man «Räder» mit d oder t? (Antwort: d oder t)", answer: "d", hints: ["Ableiten: «Räder» → wir hören d → also «Rad» mit d am Ende."], difficulty: 2 },
      { id: "g6d25", type: "multiple-choice", question: "Wann schreibt man «dass» (mit ss)?", answer: "Wenn man es nicht durch «weil» ersetzen kann", options: ["Immer","Wenn es ein Artikel ist","Wenn man es nicht durch «weil» ersetzen kann","Nur am Satzanfang"], hints: ["«Ich weiss, dass...» → kein Ersatz durch «weil» möglich → «dass» mit ss."], difficulty: 2 },
      { id: "g6d26", type: "fill-in-blank", question: "Stammstrategegie: «schreiben» — wie schreibt man «er schrieb»? (schrieb oder schriep?)", answer: "schrieb", hints: ["Stamm = schreib. Im Präteritum bleibt der Stamm: schrieb (nicht schriep)."], difficulty: 2 },
      { id: "g6d27", type: "multiple-choice", question: "Welche Strategie nutzt man bei ss oder ß (in Schweizer Schreibung nur ss)?", answer: "Nach langem Vokal oder Diphthong: ss; nach kurzem Vokal: ss", options: ["Immer ss schreiben","Immer ß schreiben","Nach langem Vokal oder Diphthong: ss; nach kurzem Vokal: ss","Keine Regel vorhanden"], hints: ["In der Schweiz schreibt man immer ss (kein ß). Gross, heiss, Strasse — alles ss."], difficulty: 2 },
      { id: "g6d28", type: "fill-in-blank", question: "Wörter mit dem Stamm «fahr» — «er fuhr» zeigt den gleichen Stamm. Das nennt man die ___strategie.", answer: "Stamm", hints: ["Du leitest das schwierige Wort vom bekannten Stamm ab: fahr → fuhr."], difficulty: 3 },
      { id: "g6d29", type: "multiple-choice", question: "Welche Strategie hilft bei Fremdwörtern wie «Telefon» oder «Foto»?", answer: "Das Wort aus der Ursprungssprache ableiten", options: ["Das Wort verlängern","Das Wort umformen","Das Wort aus der Ursprungssprache ableiten","Die Silben umdrehen"], hints: ["«Foto» kommt vom griech. «phos» (Licht) → ph wird zu f in Deutschen oft vereinfacht."], difficulty: 3 },
      { id: "g6d30", type: "fill-in-blank", question: "«Das Kind lachte, weil es Freude ___te.» Ergänze das fehlende Wort (empfand / empfant).", answer: "empfand", hints: ["Ableitung: «empfinden» → Stamm ist «empfind» → Präteritum: empfand (mit d)."], difficulty: 3 },
    ],
  },
];

export default grade6German;
