import { Topic } from "@/types/exercise";

const grade6Science: Topic[] = [
  {
    id: "schweiz-geografie",
    title: "Schweiz: Geografie",
    emoji: "🇨🇭",
    exercises: [
      { id: "g6s1", type: "multiple-choice", question: "Wie viele Kantone hat die Schweiz?", answer: "26", options: ["23","24","25","26"], hints: ["Zähle: 20 Vollkantone + 6 Halbkantone = 26."], difficulty: 1, free: true },
      { id: "g6s2", type: "multiple-choice", question: "Was ist der höchste Berg der Schweiz?", answer: "Dufourspitze (4634 m)", options: ["Matterhorn (4478 m)","Jungfrau (4158 m)","Dufourspitze (4634 m)","Finsteraarhorn (4274 m)"], hints: ["Er liegt im Kanton Wallis, im Monte-Rosa-Massiv."], difficulty: 1, free: true },
      { id: "g6s3", type: "fill-in-blank", question: "Der längste Fluss, der vollständig in der Schweiz liegt, ist die ___.", answer: "Aare", hints: ["Sie fliesst von Gletschern im Berner Oberland bis in den Rhein."], difficulty: 1, free: true },
      { id: "g6s4", type: "multiple-choice", question: "In welchem Kanton liegt die Bundeshauptstadt Bern?", answer: "Im Kanton Bern", options: ["Im Kanton Zürich","Im Kanton Freiburg","Im Kanton Bern","Im Kanton Solothurn"], hints: ["Die Stadt und der Kanton haben denselben Namen."], difficulty: 1 },
      { id: "g6s5", type: "fill-in-blank", question: "Die grösste Stadt der Schweiz ist ___.", answer: "Zürich", hints: ["Sie liegt am Zürichsee im Norden der Schweiz."], difficulty: 2 },
      { id: "g6s6", type: "multiple-choice", question: "Welche Gebirgsgruppe teilt die Schweiz in Nord und Süd?", answer: "Die Alpen", options: ["Der Jura","Der Schwarzwald","Die Alpen","Die Vogesen"], hints: ["Sie sind das grösste Gebirge der Schweiz und prägen das Klima."], difficulty: 2 },
      { id: "g6s7", type: "multiple-choice", question: "Welcher Kanton hat als einziger vier Landessprachen?", answer: "Graubünden", options: ["Bern","Wallis","Freiburg","Graubünden"], hints: ["Deutsch, Rätoromanisch, Italienisch und Ladinisch werden dort gesprochen."], difficulty: 2 },
      { id: "g6s8", type: "fill-in-blank", question: "Der Kanton Tessin liegt südlich der Alpen und grenzt an ___.", answer: "Italien", hints: ["Er ist der einzige Kanton mit Italienisch als Hauptsprache — und Italien als Nachbar."], difficulty: 3 },
      { id: "g6s9", type: "multiple-choice", question: "Was ist das Mittelland?", answer: "Die Landschaft zwischen Jura und Alpen, wo die meisten Menschen leben", options: ["Ein Hochgebirge","Die Südschweiz","Die Landschaft zwischen Jura und Alpen, wo die meisten Menschen leben","Eine Küstenregion"], hints: ["Das Mittelland ist flach/hügelig und am dichtesten besiedelt (Zürich, Bern, Basel)."], difficulty: 3 },
      { id: "g6s10", type: "fill-in-blank", question: "Der Genfersee liegt an der Grenze zwischen der Schweiz und ___.", answer: "Frankreich", hints: ["Er ist der grösste See der Schweiz — Genf liegt an seinem Westufer."], difficulty: 3 },
    ],
  },
  {
    id: "mittelalter",
    title: "Das Mittelalter",
    emoji: "🏰",
    exercises: [
      { id: "g6s11", type: "multiple-choice", question: "Wann begann das Mittelalter ungefähr?", answer: "Um 500 n. Chr.", options: ["Um 1000 v. Chr.","Um Jahr 0","Um 500 n. Chr.","Um 1500 n. Chr."], hints: ["Das Mittelalter begann nach dem Untergang des Weströmischen Reiches (476 n. Chr.)."], difficulty: 1, free: true },
      { id: "g6s12", type: "multiple-choice", question: "Wie nannte man den Herrscher über viele Länder im Mittelalter?", answer: "Kaiser", options: ["Bürgermeister","König","Kaiser","Ritter"], hints: ["Der Kaiser stand über den Königen — z. B. Karl der Grosse war Kaiser."], difficulty: 1, free: true },
      { id: "g6s13", type: "fill-in-blank", question: "Im Feudalsystem besassen ___ das Land und verliehen es an Vasallen.", answer: "Könige", hints: ["Das Feudalsystem: König → Adel → Ritter → Bauern. Wer stand ganz oben?"], difficulty: 1, free: true },
      { id: "g6s14", type: "multiple-choice", question: "Was war die wichtigste Schutzanlage eines Rittersitzes?", answer: "Die Burg", options: ["Der Marktplatz","Der Dom","Die Burg","Das Kloster"], hints: ["Burgen schützten den Adel — hohe Mauern, Zugbrücke, Burggraben."], difficulty: 2 },
      { id: "g6s15", type: "fill-in-blank", question: "Im Mittelalter konnten die meisten Menschen nicht lesen und schreiben — Wissen wurde in ___ aufbewahrt.", answer: "Klöstern", hints: ["Mönche und Nonnen in Klöstern kopierten Bücher und bewahrten Wissen."], difficulty: 2 },
      { id: "g6s16", type: "multiple-choice", question: "Was war die Pest?", answer: "Eine Seuche, die im 14. Jahrhundert viele Menschen tötete", options: ["Ein mittelalterlicher Krieg","Eine Seuche, die im 14. Jahrhundert viele Menschen tötete","Eine Hungersnot","Eine Naturkatastrophe"], hints: ["Die Pest (Schwarzer Tod) tötete ca. 1/3 der europäischen Bevölkerung um 1350."], difficulty: 2 },
      { id: "g6s17", type: "fill-in-blank", question: "Der erste Schweizer Bund entstand 1291 zwischen Uri, Schwyz und ___.", answer: "Unterwalden", hints: ["Der Bundesbrief von 1291 gilt als Gründungsdokument der Eidgenossenschaft."], difficulty: 2 },
      { id: "g6s18", type: "multiple-choice", question: "Wann endete das Mittelalter ungefähr?", answer: "Um 1500 n. Chr.", options: ["Um 1000 n. Chr.","Um 1500 n. Chr.","Um 1200 n. Chr.","Um 1800 n. Chr."], hints: ["Neue Epoche: Entdeckung Amerikas (1492), Buchdruck (1450), Reformation (1517)."], difficulty: 3 },
      { id: "g6s19", type: "fill-in-blank", question: "Die mittelalterliche Gesellschaftsordnung (König → Adel → Ritter → Bauern) nennt man das ___ system.", answer: "Feudal", hints: ["Feudum = Lehen (lat.). Ein Lehen = Stück Land, das gegen Dienst verliehen wird."], difficulty: 3 },
      { id: "g6s20", type: "multiple-choice", question: "Was erfand Johannes Gutenberg um 1450?", answer: "Den Buchdruck mit beweglichen Lettern", options: ["Das Schiesspulver","Den Buchdruck mit beweglichen Lettern","Das Fernrohr","Den Kompass"], hints: ["Dank Gutenbergs Presse konnten Bücher erstmals in grossen Mengen gedruckt werden."], difficulty: 3 },
    ],
  },
  {
    id: "aggregatzustaende",
    title: "Aggregatzustände",
    emoji: "🧪",
    exercises: [
      { id: "g6s21", type: "multiple-choice", question: "Welche drei Aggregatzustände gibt es?", answer: "Fest, flüssig, gasförmig", options: ["Hart, weich, fliessend","Fest, flüssig, gasförmig","Kalt, warm, heiss","Roh, gekocht, gefroren"], hints: ["Wasser existiert in allen drei: Eis (fest), Wasser (flüssig), Dampf (gasförmig)."], difficulty: 1, free: true },
      { id: "g6s22", type: "multiple-choice", question: "Bei welchem Vorgang wird Eis zu Wasser?", answer: "Schmelzen", options: ["Gefrieren","Verdampfen","Schmelzen","Kondensieren"], hints: ["Wärme → Eis schmilzt → flüssiges Wasser."], difficulty: 1, free: true },
      { id: "g6s23", type: "fill-in-blank", question: "Wenn Wasser zu Dampf wird, nennt man das ___.", answer: "Verdampfen", hints: ["Viel Wärme → Wasser wird gasförmig → Verdampfen (oder Verdunsten bei niedrigerer Temperatur)."], difficulty: 1, free: true },
      { id: "g6s24", type: "multiple-choice", question: "Was passiert beim Kondensieren?", answer: "Gas wird zu Flüssigkeit", options: ["Flüssigkeit wird zu Gas","Fest wird zu Gas","Gas wird zu Flüssigkeit","Flüssigkeit wird zu Feststoff"], hints: ["Denke an beschlagene Fensterscheiben: Dampf in der Luft → trifft kühles Glas → wird flüssig."], difficulty: 2 },
      { id: "g6s25", type: "fill-in-blank", question: "Der direkte Übergang von fest zu gasförmig (ohne flüssige Phase) heisst ___.", answer: "Sublimieren", hints: ["Trockeneis (festes CO₂) sublimiert bei Raumtemperatur direkt zu Gas."], difficulty: 2 },
      { id: "g6s26", type: "multiple-choice", question: "Bei welcher Temperatur schmilzt Eis unter Normaldruck?", answer: "0°C", options: ["−10°C","0°C","10°C","100°C"], hints: ["Der Schmelzpunkt von Wasser ist 0°C — darunter gefriert es, darüber schmilzt es."], difficulty: 2 },
      { id: "g6s27", type: "multiple-choice", question: "Was passiert mit den Teilchen, wenn Wasser gefriert?", answer: "Sie bewegen sich langsamer und ordnen sich in einem Gitter an", options: ["Sie verschwinden","Sie bewegen sich schneller","Sie teilen sich","Sie bewegen sich langsamer und ordnen sich in einem Gitter an"], hints: ["Kälte entzieht Energie → Teilchen verlangsamen → feste Struktur (Kristallgitter)."], difficulty: 2 },
      { id: "g6s28", type: "fill-in-blank", question: "Bei welcher Temperatur siedet Wasser unter normalem Luftdruck?", answer: "100", hints: ["100°C ist der Siedepunkt von Wasser — dann wird es zu Dampf (gasförmig)."], difficulty: 3 },
      { id: "g6s29", type: "multiple-choice", question: "Warum kocht Wasser auf dem Berg bei weniger als 100°C?", answer: "Weil der Luftdruck höher oben geringer ist", options: ["Weil es dort kälter ist","Weil der Luftdruck höher oben geringer ist","Weil Bergwasser eine andere Zusammensetzung hat","Weil die Sonne dort stärker scheint"], hints: ["Geringerer Druck → Teilchen können leichter entweichen → tieferer Siedepunkt."], difficulty: 3 },
      { id: "g6s30", type: "fill-in-blank", question: "Wenn ein Gas ohne Zwischenschritt direkt zu einem Feststoff wird, nennt man das ___.", answer: "Resublimieren", hints: ["Das Gegenteil von Sublimieren — Gas wird direkt fest (z. B. Reif auf Fensterscheiben)."], difficulty: 3 },
    ],
  },
];

export default grade6Science;
