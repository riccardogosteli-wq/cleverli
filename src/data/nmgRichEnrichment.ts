import type { Exercise, Topic } from "@/types/exercise";

type Enrichment = Record<number, Record<string, Exercise[]>>;

const pair = (id: string, label: string, emoji?: string) => ({ id, label, emoji });
const item = (id: string, label: string, emoji?: string) => ({ id, label, emoji });
const zone = (id: string, label: string) => ({ id, label });

const ENRICHMENTS: Enrichment = {
  4: {
    "koerper-gesundheit": [
      {
        id: "nmg4-rich-koerper-match-1", type: "matching", difficulty: 2,
        question: "Verbinde Körperteil und Aufgabe.", answer: "all",
        pairs: [pair("herz", "Herz", "❤️"), pair("pumpt", "pumpt Blut", "🩸"), pair("lunge", "Lunge", "🫁"), pair("luft", "nimmt Sauerstoff auf", "💨"), pair("magen", "Magen", "🍽️"), pair("verdaut", "verdaut Nahrung", "🥣"), pair("haut", "Haut", "✋"), pair("schuetzt", "schützt den Körper", "🛡️")],
        hints: ["Suche zuerst die Aufgaben, die du aus dem Alltag kennst.", "Herz und Blut gehören zusammen."],
      },
    ],
    "lebensraeume-tiere": [
      {
        id: "nmg4-rich-tiere-memory-1", type: "memory", difficulty: 2,
        question: "Finde Tier und passenden Lebensraum.", answer: "all",
        pairs: [pair("frosch", "Frosch", "🐸"), pair("teich", "Teich", "💧"), pair("specht", "Specht", "🐦"), pair("wald", "Wald", "🌲"), pair("steinbock", "Steinbock", "🐐"), pair("berge", "Berge", "⛰️"), pair("biene", "Biene", "🐝"), pair("wiese", "Wiese", "🌼")],
        hints: ["Überlege, wo das Tier Nahrung und Schutz findet.", "Ein Frosch braucht feuchte Orte."],
      },
    ],
    "wetter-klima": [
      {
        id: "nmg4-rich-wasser-drag-1", type: "drag-drop", difficulty: 2,
        question: "Ordne die Schritte im Wasserkreislauf.", answer: "all",
        dragItems: [item("verdunstung", "Wasser verdunstet", "☀️"), item("wolke", "Wolken bilden sich", "☁️"), item("regen", "Regen fällt", "🌧️"), item("fluss", "Wasser fliesst zurück", "🏞️")],
        dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
        dropAnswers: { verdunstung: "s1", wolke: "s2", regen: "s3", fluss: "s4" },
        hints: ["Beginne bei der Sonne, die Wasser erwärmt.", "Nach den Wolken kommt der Niederschlag."],
      },
    ],
    "orientierung-karte-4": [
      {
        id: "nmg4-rich-karte-match-1", type: "matching", difficulty: 2,
        question: "Verbinde Kartenzeichen und Bedeutung.", answer: "all",
        pairs: [pair("linie", "dicke blaue Linie", "〰️"), pair("fluss", "Fluss", "🏞️"), pair("punkt", "schwarzer Punkt", "⚫"), pair("ort", "Ort", "🏘️"), pair("gruen", "grüne Fläche", "🟩"), pair("wald", "Wald", "🌲"), pair("kreuz", "rotes Kreuz", "➕"), pair("spital", "Spital", "🏥")],
        hints: ["Kartenzeichen sind kleine Abmachungen.", "Blau hat oft mit Wasser zu tun."],
      },
    ],
    "gemeinde-kanton-4": [
      {
        id: "nmg4-rich-gemeinde-drag-1", type: "drag-drop", difficulty: 2,
        question: "Ordne Aufgaben von Gemeinde und Kanton.", answer: "all",
        dragItems: [item("spielplatz", "Spielplatz pflegen", "🛝"), item("schule", "Schulen organisieren", "🏫"), item("strasse", "Strassen unterhalten", "🛣️"), item("regeln", "kantonale Regeln beschliessen", "📋")],
        dropZones: [zone("gemeinde", "eher Gemeinde"), zone("kanton", "eher Kanton")],
        dropAnswers: { spielplatz: "gemeinde", strasse: "gemeinde", schule: "kanton", regeln: "kanton" },
        hints: ["Gemeinden kümmern sich oft um Dinge vor Ort.", "Der Kanton regelt grössere gemeinsame Aufgaben."],
      },
    ],
    "oekologie-4": [
      {
        id: "nmg4-rich-oekologie-word-1", type: "word-search", difficulty: 1,
        question: "Finde Wörter rund um Lebensräume.", answer: "all",
        wordList: ["Wald", "Wiese", "Teich", "Boden", "Wasser", "Tiere"], gridSize: 10,
        hints: ["Suche waagrecht und senkrecht.", "Alle Wörter passen zu Orten, an denen Lebewesen vorkommen."],
      },
    ],
    "ressourcen-wasser-4": [
      {
        id: "nmg4-rich-wasser-review-1", type: "self-review", difficulty: 2,
        question: "Du hast nur wenig Wasser für einen Schultag. Erkläre, wofür du es zuerst nutzt und warum.", answer: "review",
        reviewCriteria: ["Nennt mindestens eine wichtige Nutzung von Wasser.", "Begründet die Reihenfolge verständlich.", "Unterscheidet zwischen Bedarf und Wunsch."],
        hints: ["Denke zuerst an Trinken, Hygiene und Pflanzen.", "Eine gute Begründung sagt, warum etwas wichtiger ist."],
      },
    ],
    "energie-stoffe": [
      {
        id: "nmg4-rich-produktion-drag-1", type: "drag-drop", difficulty: 2,
        question: "Ordne den Weg eines Brots vom Rohstoff bis zum Znüni.", answer: "all",
        dragItems: [item("getreide", "Getreide wächst", "🌾"), item("mehl", "Mehl wird gemahlen", "⚙️"), item("backen", "Brot wird gebacken", "🍞"), item("essen", "Brot wird gegessen", "🎒")],
        dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
        dropAnswers: { getreide: "s1", mehl: "s2", backen: "s3", essen: "s4" },
        hints: ["Beginne auf dem Feld.", "Vor dem Backen braucht es Mehl."],
      },
    ],
  },
  5: {
    oekosysteme: [
      {
        id: "nmg5-rich-oeko-drag-1", type: "drag-drop", difficulty: 2,
        question: "Ordne die Rollen in einer Nahrungskette.", answer: "all",
        dragItems: [item("gras", "Gras", "🌱"), item("heuschrecke", "Heuschrecke", "🦗"), item("frosch", "Frosch", "🐸"), item("pilz", "Pilz", "🍄")],
        dropZones: [zone("produzent", "Produzent"), zone("pflanzenfresser", "Pflanzenfresser"), zone("raeuber", "Räuber"), zone("zersetzer", "Zersetzer")],
        dropAnswers: { gras: "produzent", heuschrecke: "pflanzenfresser", frosch: "raeuber", pilz: "zersetzer" },
        hints: ["Pflanzen stellen Nahrung selbst her.", "Zersetzer bauen totes Material ab."],
      },
    ],
    "strom-energie": [
      {
        id: "nmg5-rich-strom-match-1", type: "matching", difficulty: 2,
        question: "Verbinde Energieform und Beispiel.", answer: "all",
        pairs: [pair("licht", "Lichtenergie", "💡"), pair("lampe", "Lampe leuchtet", "🔦"), pair("bewegung", "Bewegungsenergie", "🚲"), pair("velo", "Velo rollt", "🚴"), pair("waerme", "Wärmeenergie", "🔥"), pair("tee", "Tee wird warm", "🍵"), pair("strom", "elektrische Energie", "⚡"), pair("akku", "Akku lädt", "🔋")],
        hints: ["Suche das Beispiel, in dem man die Energie sehen oder spüren kann.", "Wärme spürt man mit der Haut."],
      },
    ],
    "menschlicher-koerper-5": [
      {
        id: "nmg5-rich-koerper-memory-1", type: "memory", difficulty: 2,
        question: "Finde Körpersystem und passende Aufgabe.", answer: "all",
        pairs: [pair("atmung", "Atmung", "🫁"), pair("sauerstoff", "Sauerstoff aufnehmen", "💨"), pair("kreislauf", "Blutkreislauf", "❤️"), pair("transport", "Stoffe transportieren", "🚚"), pair("verdauung", "Verdauung", "🍽️"), pair("naehrstoffe", "Nährstoffe aufnehmen", "🥕"), pair("nerven", "Nervensystem", "🧠"), pair("signale", "Signale weitergeben", "📡")],
        hints: ["Körpersysteme arbeiten zusammen.", "Das Blut bringt Stoffe durch den Körper."],
      },
    ],
    "erde-klima-5": [
      {
        id: "nmg5-rich-klima-word-1", type: "word-search", difficulty: 1,
        question: "Finde Begriffe zu Wetter und Klima.", answer: "all",
        wordList: ["Klima", "Wetter", "Regen", "Wind", "Wolke", "Sonne"], gridSize: 10,
        hints: ["Suche erst die kurzen Wörter.", "Wetter beschreibt eher kurze Zeit, Klima längere Zeit."],
      },
    ],
    "schweiz-politik-5": [
      {
        id: "nmg5-rich-politik-drag-1", type: "drag-drop", difficulty: 2,
        question: "Ordne die Beispiele zu Demokratie und Alltag.", answer: "all",
        dragItems: [item("abstimmung", "über eine Regel abstimmen", "🗳️"), item("zuhoeren", "anderen zuhören", "👂"), item("mehrheit", "Mehrheitsentscheid akzeptieren", "🤝"), item("argument", "eine Meinung begründen", "💬")],
        dropZones: [zone("mitbestimmen", "mitbestimmen"), zone("respekt", "respektvoll handeln")],
        dropAnswers: { abstimmung: "mitbestimmen", mehrheit: "mitbestimmen", zuhoeren: "respekt", argument: "respekt" },
        hints: ["Demokratie braucht Entscheidungen und respektvolle Gespräche.", "Eine Begründung hilft den anderen, dich zu verstehen."],
      },
    ],
    "wirtschaft-handel-5": [
      {
        id: "nmg5-rich-wirtschaft-match-1", type: "matching", difficulty: 2,
        question: "Verbinde Wirtschaftsbegriff und einfache Erklärung.", answer: "all",
        pairs: [pair("angebot", "Angebot", "🏪"), pair("verkauf", "Was verkauft wird", "🧺"), pair("nachfrage", "Nachfrage", "🙋"), pair("wunsch", "Was Menschen kaufen möchten", "🛒"), pair("kosten", "Kosten", "🧾"), pair("aufwand", "Was Herstellung und Arbeit brauchen", "🛠️"), pair("preis", "Preis", "🏷️"), pair("bezahlen", "Was man bezahlt", "🪙")],
        hints: ["Denke an einen Laden.", "Preis und Kosten sind verwandt, aber nicht dasselbe."],
      },
    ],
    "nachhaltigkeit-5": [
      {
        id: "nmg5-rich-nachhaltig-review-1", type: "self-review", difficulty: 2,
        question: "Ein kaputter Rucksack kann repariert oder ersetzt werden. Erkläre eine sinnvolle Entscheidung.", answer: "review",
        reviewCriteria: ["Nennt Reparatur oder Ersatz als Möglichkeit.", "Bezieht Kosten, Nutzen oder Ressourcen ein.", "Begründet die Entscheidung fair."],
        hints: ["Überlege, ob der Rucksack noch sicher und brauchbar ist.", "Ressourcen sparen heisst nicht immer: nie etwas Neues kaufen."],
      },
    ],
    "klima-lebensraeume-5": [
      {
        id: "nmg5-rich-lebensraeume-memory-1", type: "memory", difficulty: 2,
        question: "Finde Klima und passenden Lebensraum.", answer: "all",
        pairs: [pair("trocken", "trocken und heiss", "☀️"), pair("wueste", "Wüste", "🏜️"), pair("kalt", "sehr kalt", "❄️"), pair("tundra", "Tundra", "🧊"), pair("feucht", "warm und feucht", "🌧️"), pair("regenwald", "Regenwald", "🌴"), pair("gemischt", "wechselnde Jahreszeiten", "🍂"), pair("wald", "Laubwald", "🌳")],
        hints: ["Lebensräume hängen stark von Temperatur und Niederschlag ab.", "Regenwald braucht viel Wärme und Feuchtigkeit."],
      },
    ],
  },
  6: {
    "energie-nachh-6": [
      {
        id: "nmg6-rich-energie-drag-1", type: "drag-drop", difficulty: 3,
        question: "Ordne Energiequellen nach erneuerbar und nicht erneuerbar.", answer: "all",
        dragItems: [item("sonne", "Sonne", "☀️"), item("wind", "Wind", "🌬️"), item("erdgas", "Erdgas", "🔥"), item("kohle", "Kohle", "⬛")],
        dropZones: [zone("erneuerbar", "erneuerbar"), zone("nicht", "nicht erneuerbar")],
        dropAnswers: { sonne: "erneuerbar", wind: "erneuerbar", erdgas: "nicht", kohle: "nicht" },
        hints: ["Erneuerbare Quellen erneuern sich in kurzer Zeit.", "Kohle und Erdgas entstehen nicht schnell neu."],
      },
    ],
    "demokratie-menschenrechte-6": [
      {
        id: "nmg6-rich-demokratie-match-1", type: "matching", difficulty: 3,
        question: "Verbinde demokratische Handlung und Bedeutung.", answer: "all",
        pairs: [pair("waehlen", "wählen", "🗳️"), pair("vertreten", "mitentscheiden, wer vertritt", "👥"), pair("diskutieren", "diskutieren", "💬"), pair("gruende", "Gründe austauschen", "🧠"), pair("rechte", "Rechte kennen", "⚖️"), pair("schutz", "Menschen schützen", "🛡️"), pair("minderheit", "Minderheiten respektieren", "🤝"), pair("fair", "fair bleiben trotz Mehrheit", "✅")],
        hints: ["Demokratie ist mehr als Abstimmen.", "Rechte schützen auch Menschen, die nicht zur Mehrheit gehören."],
      },
    ],
    "migration-flucht-6": [
      {
        id: "nmg6-rich-migration-review-1", type: "self-review", difficulty: 3,
        question: "Eine neue Schülerin kommt in die Klasse und spricht noch wenig Deutsch. Beschreibe zwei faire Unterstützungen.", answer: "review",
        reviewCriteria: ["Nennt zwei konkrete Unterstützungen.", "Bleibt respektvoll und ohne Vorurteile.", "Begründet, warum die Unterstützung hilft."],
        hints: ["Denke an Sprache, Orientierung und Freundschaft.", "Fair heisst: unterstützen, ohne jemanden blosszustellen."],
      },
    ],
    "wirtschaft-grundlagen-6": [
      {
        id: "nmg6-rich-wirtschaft-drag-1", type: "drag-drop", difficulty: 3,
        question: "Ordne Faktoren, die einen Preis beeinflussen.", answer: "all",
        dragItems: [item("material", "Material", "🧱"), item("arbeit", "Arbeitszeit", "⏱️"), item("transport", "Transport", "🚚"), item("werbung", "Werbung", "📣")],
        dropZones: [zone("herstellung", "Herstellung"), zone("verkauf", "Verkauf")],
        dropAnswers: { material: "herstellung", arbeit: "herstellung", transport: "verkauf", werbung: "verkauf" },
        hints: ["Ein Preis entsteht nicht nur im Laden.", "Material und Arbeitszeit gehören direkt zur Herstellung."],
      },
    ],
    "globalisierung-6": [
      {
        id: "nmg6-rich-global-memory-1", type: "memory", difficulty: 2,
        question: "Finde weltweite Verbindung und Beispiel.", answer: "all",
        pairs: [pair("handel", "Handel", "🚢"), pair("banane", "Bananen aus weiter Ferne", "🍌"), pair("kommunikation", "Kommunikation", "📱"), pair("video", "Videoanruf", "💻"), pair("reise", "Reise", "✈️"), pair("zug", "Zug und Flugzeug", "🚆"), pair("daten", "Daten", "🌐"), pair("internet", "Internet", "🕸️")],
        hints: ["Globalisierung bedeutet: Menschen und Orte sind verbunden.", "Nicht jede Verbindung ist sichtbar."],
      },
    ],
    "kontinente-6": [
      {
        id: "nmg6-rich-kontinente-word-1", type: "word-search", difficulty: 2,
        question: "Finde Kontinente.", answer: "all",
        wordList: ["Europa", "Afrika", "Asien", "Amerika", "Ozeanien"], gridSize: 11,
        hints: ["Suche waagrecht und senkrecht.", "Kontinente sind grosse Landräume der Erde."],
      },
    ],
    "zukunft-herausforderungen-6": [
      {
        id: "nmg6-rich-zukunft-match-1", type: "matching", difficulty: 3,
        question: "Verbinde Herausforderung und sinnvolle Frage.", answer: "all",
        pairs: [pair("klima", "Klima", "🌡️"), pair("energie", "Wie nutzen wir Energie?", "⚡"), pair("wasser", "Wasser", "💧"), pair("sparsam", "Wie gehen wir sparsam damit um?", "🚰"), pair("mobilitaet", "Mobilität", "🚲"), pair("wege", "Wie bewegen wir uns?", "🛤️"), pair("zusammen", "Zusammenleben", "🤝"), pair("fair", "Wie bleiben Lösungen fair?", "⚖️")],
        hints: ["Gute Zukunftsfragen betrachten Folgen.", "Fairness gehört auch zu technischen Lösungen."],
      },
    ],
    "technik-informatik-6": [
      {
        id: "nmg6-rich-technik-drag-1", type: "drag-drop", difficulty: 3,
        question: "Ordne Technikfolgen nach Chance und Risiko.", answer: "all",
        dragItems: [item("hilfe", "hilft bei schweren Arbeiten", "🛠️"), item("tempo", "macht Abläufe schneller", "⚙️"), item("abhaengig", "macht abhängig von Geräten", "🔌"), item("daten", "braucht sorgfältigen Umgang mit Daten", "🔐")],
        dropZones: [zone("chance", "Chance"), zone("risiko", "Risiko")],
        dropAnswers: { hilfe: "chance", tempo: "chance", abhaengig: "risiko", daten: "risiko" },
        hints: ["Eine Technik kann gleichzeitig nützlich und anspruchsvoll sein.", "Daten brauchen Schutz."],
      },
    ],
  },
};

export function addNmgRichEnrichment(grade: number, subject: string, topics: Topic[]): Topic[] {
  if (subject !== "science") return topics;
  const byTopic = ENRICHMENTS[grade];
  if (!byTopic) return topics;
  return topics.map((topic) => ({
    ...topic,
    exercises: [...topic.exercises, ...(byTopic[topic.id] ?? [])],
  }));
}

export function getNmgRichEnrichmentIds() {
  return Object.entries(ENRICHMENTS).flatMap(([grade, topics]) =>
    Object.entries(topics).flatMap(([topicId, exercises]) =>
      exercises.map((exercise) => ({ grade: Number(grade), subject: "science", topicId, exerciseId: exercise.id })),
    ),
  );
}
