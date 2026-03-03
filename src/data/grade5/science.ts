import { Topic } from "@/types/exercise";

const grade5Science: Topic[] = [
  {
    id: "oekosysteme",
    title: "Ökosysteme",
    emoji: "🌲",
    exercises: [
      { id: "g5s1", type: "multiple-choice", question: "Was ist ein Ökosystem?", answer: "Lebewesen und ihre Umwelt zusammen", options: ["Nur Tiere im Wald","Nur Pflanzen","Lebewesen und ihre Umwelt zusammen","Eine Tierart allein"], hints: ["Ein Öko-System = alle Lebewesen + ihre Umgebung (Boden, Wasser, Luft)."], difficulty: 1, free: true },
      { id: "g5s2", type: "multiple-choice", question: "Was fressen Pflanzenfresser (Herbivoren)?", answer: "Nur Pflanzen", options: ["Nur Tiere","Nur Pflanzen","Pflanzen und Tiere","Pilze"], hints: ["Herbi = Pflanze (lat. herba = Kraut)"], difficulty: 1, free: true },
      { id: "g5s3", type: "fill-in-blank", question: "Tiere, die Pflanzen UND andere Tiere fressen, nennt man ___.", answer: "Allesfresser", hints: ["Omni = alles (lat.) — Mensch ist auch einer."], difficulty: 1, free: true },
      { id: "g5s4", type: "multiple-choice", question: "Was ist der erste Schritt in einer Nahrungskette?", answer: "Pflanze (Produzent)", options: ["Fleischfresser","Pflanze (Produzent)","Zersetzer","Allesfresser"], hints: ["Pflanzen produzieren Energie aus Sonnenlicht — sie sind immer am Anfang."], difficulty: 2 },
      { id: "g5s5", type: "fill-in-blank", question: "Pilze und Bakterien zersetzen tote Organismen. Man nennt sie ___.", answer: "Zersetzer", hints: ["Sie zerlegen (zersetzen) Totes in Nährstoffe."], difficulty: 2 },
      { id: "g5s6", type: "multiple-choice", question: "Welches Ökosystem hat die grösste Artenvielfalt?", answer: "Tropischer Regenwald", options: ["Wüste","Tundra","Tropischer Regenwald","Hochgebirge"], hints: ["Viel Wärme + viel Regen = ideale Bedingungen für viele Arten."], difficulty: 2 },
      { id: "g5s7", type: "multiple-choice", question: "Was passiert, wenn eine Art ausstirbt?", answer: "Das ganze Ökosystem kann aus dem Gleichgewicht geraten", options: ["Nichts verändert sich","Das ganze Ökosystem kann aus dem Gleichgewicht geraten","Andere Arten werden stärker ohne Auswirkungen","Nur die direkte Beute ist betroffen"], hints: ["Alle Arten sind vernetzt — fällt eine weg, spüren das alle anderen."], difficulty: 2 },
      { id: "g5s8", type: "fill-in-blank", question: "In einem See: Algen → Wasserfloh → Fisch → Fischadler. Der Fischadler ist der ___.", answer: "Endkonsument", hints: ["Er steht am Ende der Nahrungskette — niemand frisst ihn (normalerweise)."], difficulty: 3 },
      { id: "g5s9", type: "multiple-choice", question: "Was ist Symbiose?", answer: "Wenn zwei Arten gegenseitig voneinander profitieren", options: ["Wenn eine Art die andere frisst","Wenn eine Art die andere parasitiert","Wenn zwei Arten gegenseitig voneinander profitieren","Wenn zwei Arten um Nahrung konkurrieren"], hints: ["Sym = zusammen, bios = Leben — beide gewinnen."], difficulty: 3 },
      { id: "g5s10", type: "fill-in-blank", question: "Der Anteil einer Art an der Gesamtbiomasse in einem Ökosystem nennt man ihre ___.", answer: "Biomasse", hints: ["Bio = Leben, Masse = Gewicht — die Gesamtmenge lebender Materie dieser Art."], difficulty: 3 },
    ],
  },
  {
    id: "sonnensystem",
    title: "Unser Sonnensystem",
    emoji: "🪐",
    exercises: [
      { id: "g5s11", type: "multiple-choice", question: "Wie viele Planeten hat unser Sonnensystem?", answer: "8", options: ["7","8","9","10"], hints: ["Merkur, Venus, Erde, Mars, Jupiter, Saturn, Uranus, Neptun — zähle nach."], difficulty: 1, free: true },
      { id: "g5s12", type: "multiple-choice", question: "Welcher Planet ist der grösste?", answer: "Jupiter", options: ["Saturn","Erde","Jupiter","Mars"], hints: ["Er ist so gross, dass alle anderen Planeten darin Platz hätten."], difficulty: 1, free: true },
      { id: "g5s13", type: "fill-in-blank", question: "Der Planet am nächsten zur Sonne heisst ___.", answer: "Merkur", hints: ["Merkur, Venus, Erde, Mars... — welcher ist der erste?"], difficulty: 1, free: true },
      { id: "g5s14", type: "multiple-choice", question: "Was ist die Sonne?", answer: "Ein Stern", options: ["Ein Planet","Ein Mond","Ein Stern","Ein Asteroid"], hints: ["Die Sonne leuchtet selbst — das können nur Sterne."], difficulty: 1 },
      { id: "g5s15", type: "fill-in-blank", question: "Ein Jahr auf der Erde dauert ungefähr ___ Tage.", answer: "365", hints: ["Die Erde braucht so lange für eine Runde um die Sonne."], difficulty: 2 },
      { id: "g5s16", type: "multiple-choice", question: "Welcher Planet hat auffällige Ringe?", answer: "Saturn", options: ["Jupiter","Mars","Saturn","Uranus"], hints: ["Dieser Planet ist berühmt für sein helles Ringsystem aus Eis und Staub."], difficulty: 2 },
      { id: "g5s17", type: "multiple-choice", question: "Was ist der Mond?", answer: "Ein natürlicher Satellit der Erde", options: ["Ein Stern","Ein Planet","Ein natürlicher Satellit der Erde","Ein Asteroid"], hints: ["Er kreist um die Erde — das nennt man Satellit."], difficulty: 2 },
      { id: "g5s18", type: "fill-in-blank", question: "Die vier Planeten nach dem Asteroidengürtel (Jupiter, Saturn, Uranus, Neptun) nennt man ___.", answer: "Gasriesen", hints: ["Sie haben keine feste Oberfläche — sie bestehen vor allem aus Gas."], difficulty: 3 },
      { id: "g5s19", type: "multiple-choice", question: "Wie lange braucht Licht von der Sonne zur Erde?", answer: "Etwa 8 Minuten", options: ["1 Sekunde","1 Stunde","Etwa 8 Minuten","1 Tag"], hints: ["Lichtgeschwindigkeit = 300'000 km/s, Entfernung Erde–Sonne ≈ 150 Mio. km."], difficulty: 3 },
      { id: "g5s20", type: "fill-in-blank", question: "Körper, die zwischen Mars und Jupiter kreisen, nennt man ___.", answer: "Asteroiden", hints: ["Sie bilden den Asteroidengürtel zwischen den inneren und äusseren Planeten."], difficulty: 3 },
    ],
  },
  {
    id: "strom-energie",
    title: "Strom und Energie",
    emoji: "⚡",
    exercises: [
      { id: "g5s21", type: "multiple-choice", question: "Was braucht ein einfacher Stromkreis?", answer: "Batterie, Kabel und Glühbirne", options: ["Nur eine Batterie","Nur ein Kabel","Batterie, Kabel und Glühbirne","Nur eine Glühbirne"], hints: ["Strom fliesst nur, wenn der Kreis geschlossen ist — alle drei Teile müssen verbunden sein."], difficulty: 1, free: true },
      { id: "g5s22", type: "multiple-choice", question: "Welche Energiequelle ist erneuerbar?", answer: "Sonnenenergie", options: ["Erdöl","Kohle","Erdgas","Sonnenenergie"], hints: ["Die Sonne scheint immer weiter — sie ist unerschöpflich (erneuerbar)."], difficulty: 1, free: true },
      { id: "g5s23", type: "fill-in-blank", question: "Strom fliesst von der Batterie durch das Kabel und zurück. Das nennt man einen ___.", answer: "Stromkreis", hints: ["Kreis = es geht rund — von + zu − und wieder zurück."], difficulty: 1, free: true },
      { id: "g5s24", type: "multiple-choice", question: "Was leitet Strom gut?", answer: "Metalle", options: ["Holz","Gummi","Metalle","Glas"], hints: ["Gute Leiter haben freie Elektronen — das haben die meisten Metalle."], difficulty: 2 },
      { id: "g5s25", type: "fill-in-blank", question: "Energie, die aus Fliessgewässern gewonnen wird, heisst ___.", answer: "Wasserkraft", hints: ["Die Schweiz produziert viel Strom damit — fliessendes Wasser dreht Turbinen."], difficulty: 2 },
      { id: "g5s26", type: "multiple-choice", question: "Was ist ein Isolator?", answer: "Ein Material, das Strom nicht leitet", options: ["Ein Material, das Strom leitet","Ein Material, das Strom erzeugt","Ein Material, das Strom nicht leitet","Eine Batterie"], hints: ["Isolatoren halten den Strom auf — deshalb haben Kabel einen Plastikmantel."], difficulty: 2 },
      { id: "g5s27", type: "multiple-choice", question: "Was wandelt ein Solarmodul um?", answer: "Licht in elektrischen Strom", options: ["Wärme in Licht","Strom in Wärme","Licht in elektrischen Strom","Wind in Strom"], hints: ["Solar = Sonne. Photovoltaik wandelt Lichtenergie (Photonen) in Strom um."], difficulty: 2 },
      { id: "g5s28", type: "fill-in-blank", question: "Geräte, die in einem Stromkreis parallel geschaltet sind, funktionieren ___ voneinander.", answer: "unabhängig", hints: ["Beim Ausfall eines Geräts laufen die anderen weiter — anders als bei Reihenschaltung."], difficulty: 3 },
      { id: "g5s29", type: "multiple-choice", question: "Welche Einheit misst elektrische Spannung?", answer: "Volt (V)", options: ["Ampere (A)","Watt (W)","Volt (V)","Ohm (Ω)"], hints: ["Spannung treibt den Strom an. Alessandro Volta hat ihr seinen Namen gegeben."], difficulty: 3 },
      { id: "g5s30", type: "fill-in-blank", question: "Energie kann nicht vernichtet, sondern nur ___ werden.", answer: "umgewandelt", hints: ["Das ist der Energieerhaltungssatz — Energie wechselt die Form, geht aber nie verloren."], difficulty: 3 },
    ],
  },
];

export default grade5Science;
