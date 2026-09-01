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
      {
        id: "nmg4-rich-koerper-match-2", type: "matching", difficulty: 2,
        question: "Verbinde Sinn und passende Beobachtung.", answer: "all",
        pairs: [pair("sehen", "sehen", "👀"), pair("farbe", "eine Farbe erkennen", "🎨"), pair("hoeren", "hören", "👂"), pair("ton", "einen Ton bemerken", "🔔"), pair("riechen", "riechen", "👃"), pair("duft", "einen Duft wahrnehmen", "🌼"), pair("tasten", "tasten", "✋"), pair("rau", "eine raue Oberfläche spüren", "🪵")],
        hints: ["Denke an Beobachtungen im Schulzimmer oder draussen.", "Tasten passiert mit der Haut."],
      },
      {
        id: "nmg4-rich-koerper-review-2", type: "self-review", difficulty: 2,
        question: "Du merkst, dass du nach langem Sitzen unruhig wirst. Was könntest du tun, damit dein Körper wieder wacher wird?", answer: "review",
        reviewCriteria: ["Nennt eine passende Handlung wie bewegen, trinken oder frische Luft.", "Erklärt, warum die Handlung dem Körper hilft.", "Bleibt bei einer gesunden und sicheren Idee."],
        hints: ["Denke an Bewegung, Pausen und Trinken.", "Eine gute Antwort erklärt den Zusammenhang zum Körper."],
      },
    ],
    "lebensraeume-tiere": [
      {
        id: "nmg4-rich-tiere-memory-1", type: "memory", difficulty: 2,
        question: "Finde Tier und passenden Lebensraum.", answer: "all",
        pairs: [pair("frosch", "Frosch", "🐸"), pair("teich", "Teich", "💧"), pair("specht", "Specht", "🐦"), pair("wald", "Wald", "🌲"), pair("steinbock", "Steinbock", "🐐"), pair("berge", "Berge", "⛰️"), pair("biene", "Biene", "🐝"), pair("wiese", "Wiese", "🌼")],
        hints: ["Überlege, wo das Tier Nahrung und Schutz findet.", "Ein Frosch braucht feuchte Orte."],
      },
      {
        id: "nmg4-rich-tiere-drag-2", type: "drag-drop", difficulty: 2,
        question: "Ordne die Tiermerkmale zum passenden Nutzen.", answer: "all",
        dragItems: [item("fell", "dichtes Fell", "🧥"), item("krallen", "scharfe Krallen", "🐾"), item("schnabel", "spitzer Schnabel", "🐦"), item("schwimmhaut", "Schwimmhäute", "🦆")],
        dropZones: [zone("warm", "warm bleiben"), zone("klettern", "klettern oder greifen"), zone("fressen", "Nahrung aufnehmen"), zone("schwimmen", "gut schwimmen")],
        dropAnswers: { fell: "warm", krallen: "klettern", schnabel: "fressen", schwimmhaut: "schwimmen" },
        hints: ["Ein Merkmal hilft einem Tier in seinem Lebensraum.", "Schwimmhäute passen zu Wasser."],
      },
      {
        id: "nmg4-rich-tiere-match-2", type: "matching", difficulty: 2,
        question: "Verbinde Spur und Tier.", answer: "all",
        pairs: [pair("pfote", "Pfotenabdruck", "🐾"), pair("fuchs", "Fuchs", "🦊"), pair("loch", "kleines Loch im Boden", "🕳️"), pair("maus", "Maus", "🐭"), pair("frass", "angenagte Nuss", "🌰"), pair("eichhoernchen", "Eichhörnchen", "🐿️"), pair("feder", "Feder", "🪶"), pair("vogel", "Vogel", "🐦")],
        hints: ["Spuren zeigen, welches Tier in der Nähe war.", "Federn gehören zu Vögeln."],
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
      {
        id: "nmg4-rich-wetter-drag-2", type: "drag-drop", difficulty: 2,
        question: "Ordne Messgerät und Wetterbeobachtung.", answer: "all",
        dragItems: [item("thermometer", "Thermometer", "🌡️"), item("regenmesser", "Regenmesser", "🌧️"), item("windfahne", "Windfahne", "🚩"), item("wolkenblick", "Blick zum Himmel", "☁️")],
        dropZones: [zone("temperatur", "Temperatur"), zone("regen", "Regenmenge"), zone("wind", "Windrichtung"), zone("wolken", "Wolken")],
        dropAnswers: { thermometer: "temperatur", regenmesser: "regen", windfahne: "wind", wolkenblick: "wolken" },
        hints: ["Messgeräte helfen, Wetter genau zu beschreiben.", "Das Thermometer zeigt, wie warm oder kalt es ist."],
      },
      {
        id: "nmg4-rich-wetter-match-2", type: "matching", difficulty: 2,
        question: "Verbinde Wetterzeichen und passende Bedeutung.", answer: "all",
        pairs: [pair("sonne", "Sonne", "☀️"), pair("hell", "hell und oft warm", "😎"), pair("wolke", "Wolke", "☁️"), pair("bedeckt", "Himmel ist bedeckt", "🌫️"), pair("regen", "Regen", "🌧️"), pair("nass", "es wird nass", "💧"), pair("wind", "Wind", "🌬️"), pair("luft", "Luft bewegt sich", "🍃")],
        hints: ["Wetterzeichen fassen Beobachtungen kurz zusammen.", "Wind sieht man oft an Blättern oder Fahnen."],
      },
      {
        id: "nmg4-rich-wetter-word-2", type: "word-search", difficulty: 1,
        question: "Finde Wörter für Wetterbeobachtungen.", answer: "all",
        wordList: ["Sonne", "Regen", "Wind", "Wolke", "Nebel", "Kalt"], gridSize: 10,
        hints: ["Suche waagrecht und senkrecht.", "Alle Wörter kann man beim Wetterbericht brauchen."],
      },
    ],
    "orientierung-karte-4": [
      {
        id: "nmg4-rich-karte-match-1", type: "matching", difficulty: 2,
        question: "Verbinde Kartenzeichen und Bedeutung.", answer: "all",
        pairs: [pair("linie", "dicke blaue Linie", "〰️"), pair("fluss", "Fluss", "🏞️"), pair("punkt", "schwarzer Punkt", "⚫"), pair("ort", "Ort", "🏘️"), pair("gruen", "grüne Fläche", "🟩"), pair("wald", "Wald", "🌲"), pair("kreuz", "rotes Kreuz", "➕"), pair("spital", "Spital", "🏥")],
        hints: ["Kartenzeichen sind kleine Abmachungen.", "Blau hat oft mit Wasser zu tun."],
      },
      {
        id: "nmg4-rich-karte-drag-2", type: "drag-drop", difficulty: 2,
        question: "Ordne die Schritte für einen sicheren Weg mit der Karte.", answer: "all",
        dragItems: [item("start", "Startpunkt finden", "📍"), item("ziel", "Ziel suchen", "🎯"), item("weg", "Weg vergleichen", "🗺️"), item("gehen", "Route Schritt für Schritt gehen", "🚶")],
        dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
        dropAnswers: { start: "s1", ziel: "s2", weg: "s3", gehen: "s4" },
        hints: ["Beginne immer dort, wo du gerade bist.", "Vor dem Losgehen vergleichst du mögliche Wege."],
      },
      {
        id: "nmg4-rich-karte-memory-2", type: "memory", difficulty: 2,
        question: "Finde Kartenzeichen und passenden Nutzen.", answer: "all",
        pairs: [pair("massstab", "Massstab", "📏"), pair("entfernung", "Entfernungen abschätzen", "↔️"), pair("legende", "Legende", "🔎"), pair("zeichen", "Zeichen verstehen", "🗺️"), pair("nordpfeil", "Nordpfeil", "🧭"), pair("richtung", "Richtung erkennen", "➡️"), pair("hoehenlinie", "Höhenlinie", "⛰️"), pair("steil", "Gelände einschätzen", "🥾")],
        hints: ["Die Legende erklärt Zeichen auf der Karte.", "Der Massstab hilft bei Entfernungen."],
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
      {
        id: "nmg4-rich-gemeinde-review-2", type: "self-review", difficulty: 2,
        question: "Auf dem Schulweg ist ein Zebrastreifen schlecht sichtbar. Wem würdest du das melden und warum?", answer: "review",
        reviewCriteria: ["Nennt eine passende Stelle wie Lehrperson, Eltern oder Gemeinde.", "Begründet, warum die Meldung wichtig ist.", "Denkt an Sicherheit für mehrere Menschen."],
        hints: ["Gemeinden kümmern sich oft um Wege und Strassen.", "Eine gute Meldung beschreibt den Ort genau."],
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
      {
        id: "nmg4-rich-wasser-memory-2", type: "memory", difficulty: 2,
        question: "Finde Wassernutzung und passende Begründung.", answer: "all",
        pairs: [pair("trinken", "trinken", "🥤"), pair("gesund", "der Körper braucht Wasser", "💪"), pair("haende", "Hände waschen", "🧼"), pair("hygiene", "Keime werden weniger", "✨"), pair("pflanzen", "Pflanzen giessen", "🪴"), pair("wachsen", "Pflanzen können wachsen", "🌱"), pair("sparen", "Wasser sparen", "🚰"), pair("ressource", "Ressource schützen", "💧")],
        hints: ["Wasser ist für Menschen, Tiere und Pflanzen wichtig.", "Sparen passt zu verantwortungsvollem Umgang."],
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
      {
        id: "nmg4-rich-produktion-drag-2", type: "drag-drop", difficulty: 2,
        question: "Ordne den Weg einer Glasflasche im Recycling.", answer: "all",
        dragItems: [item("sammeln", "Flasche sammeln", "🧺"), item("container", "in den Glascontainer bringen", "♻️"), item("schmelzen", "Glas einschmelzen", "🔥"), item("neu", "neues Glas herstellen", "🍾")],
        dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
        dropAnswers: { sammeln: "s1", container: "s2", schmelzen: "s3", neu: "s4" },
        hints: ["Zuerst muss die Flasche gesammelt werden.", "Aus altem Glas kann neues Glas entstehen."],
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
      {
        id: "nmg5-rich-oeko-drag-2", type: "drag-drop", difficulty: 2,
        question: "Ordne Veränderungen in einem Lebensraum nach möglicher Folge.", answer: "all",
        dragItems: [item("hecke", "Hecke wird gepflanzt", "🌿"), item("gift", "zu viel Gift im Garten", "⚠️"), item("teich", "kleiner Teich entsteht", "💧"), item("beton", "Wiese wird versiegelt", "⬜")],
        dropZones: [zone("mehr", "mehr Lebensraum"), zone("weniger", "weniger Lebensraum")],
        dropAnswers: { hecke: "mehr", teich: "mehr", gift: "weniger", beton: "weniger" },
        hints: ["Mehr Struktur kann Tieren Schutz geben.", "Versiegelter Boden lässt weniger Pflanzen wachsen."],
      },
      {
        id: "nmg5-rich-oeko-match-2", type: "matching", difficulty: 2,
        question: "Verbinde Ökosystem-Begriff und Erklärung.", answer: "all",
        pairs: [pair("produzent", "Produzent", "🌱"), pair("pflanze", "stellt Nahrung her", "☀️"), pair("konsument", "Konsument", "🐰"), pair("frisst", "frisst andere Lebewesen", "🍽️"), pair("zersetzer", "Zersetzer", "🍄"), pair("abbau", "baut Reste ab", "♻️"), pair("lebensraum", "Lebensraum", "🌳"), pair("ort", "Ort zum Leben", "📍")],
        hints: ["Pflanzen stehen oft am Anfang.", "Zersetzer machen aus Resten wieder Nährstoffe."],
      },
      {
        id: "nmg5-rich-oeko-review-2", type: "self-review", difficulty: 2,
        question: "Eine Klasse möchte den Pausenplatz tierfreundlicher machen. Welche zwei Ideen sind sinnvoll?", answer: "review",
        reviewCriteria: ["Nennt zwei konkrete Ideen für mehr Lebensraum.", "Erklärt, wie Tiere oder Pflanzen davon profitieren.", "Achtet auf Sicherheit und Pflege im Schulalltag."],
        hints: ["Denke an Pflanzen, Verstecke, Wasser oder weniger Abfall.", "Gute Ideen passen zu einem Schulhaus."],
      },
    ],
    "strom-energie": [
      {
        id: "nmg5-rich-strom-match-1", type: "matching", difficulty: 2,
        question: "Verbinde Energieform und Beispiel.", answer: "all",
        pairs: [pair("licht", "Lichtenergie", "💡"), pair("lampe", "Lampe leuchtet", "🔦"), pair("bewegung", "Bewegungsenergie", "🚲"), pair("velo", "Velo rollt", "🚴"), pair("waerme", "Wärmeenergie", "🔥"), pair("tee", "Tee wird warm", "🍵"), pair("strom", "elektrische Energie", "⚡"), pair("akku", "Akku lädt", "🔋")],
        hints: ["Suche das Beispiel, in dem man die Energie sehen oder spüren kann.", "Wärme spürt man mit der Haut."],
      },
      {
        id: "nmg5-rich-strom-drag-2", type: "drag-drop", difficulty: 2,
        question: "Ordne die Energieumwandlung bei einer Velolampe.", answer: "all",
        dragItems: [item("treten", "Beine treten Pedale", "🦵"), item("dynamo", "Dynamo dreht", "⚙️"), item("strom", "Strom entsteht", "⚡"), item("licht", "Lampe leuchtet", "💡")],
        dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
        dropAnswers: { treten: "s1", dynamo: "s2", strom: "s3", licht: "s4" },
        hints: ["Beginne bei der Bewegung.", "Am Ende wird elektrische Energie zu Licht."],
      },
      {
        id: "nmg5-rich-strom-memory-2", type: "memory", difficulty: 2,
        question: "Finde Energiequelle und passende Nutzung.", answer: "all",
        pairs: [pair("sonne", "Sonne", "☀️"), pair("solar", "Solarzelle liefert Strom", "🔋"), pair("wind", "Wind", "🌬️"), pair("rad", "Windrad dreht", "⚙️"), pair("wasser", "Wasser", "💧"), pair("kraftwerk", "Wasserkraftwerk", "🏭"), pair("holz", "Holz", "🪵"), pair("waerme", "Wärme erzeugen", "🔥")],
        hints: ["Energiequellen können unterschiedlich genutzt werden.", "Wind und Wasser können etwas antreiben."],
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
      {
        id: "nmg5-rich-politik-drag-2", type: "drag-drop", difficulty: 2,
        question: "Ordne politische Ebenen und Beispiele.", answer: "all",
        dragItems: [item("spielplatz", "Spielplatz im Quartier", "🛝"), item("schule", "Schulorganisation", "🏫"), item("bahn", "Bahnverbindungen", "🚆"), item("bundesrat", "Bundesrat", "🇨🇭")],
        dropZones: [zone("gemeinde", "Gemeinde"), zone("kanton", "Kanton"), zone("bund", "Bund")],
        dropAnswers: { spielplatz: "gemeinde", schule: "kanton", bahn: "bund", bundesrat: "bund" },
        hints: ["Die Gemeinde ist nahe beim Wohnort.", "Der Bund betrifft die ganze Schweiz."],
      },
      {
        id: "nmg5-rich-politik-review-2", type: "self-review", difficulty: 2,
        question: "In deiner Klasse gibt es zwei Vorschläge für den Ausflug. Wie kann die Klasse fair entscheiden?", answer: "review",
        reviewCriteria: ["Beschreibt einen fairen Entscheidungsweg.", "Nennt Zuhören, Begründen oder Abstimmen.", "Zeigt Respekt für Kinder mit anderer Meinung."],
        hints: ["Fair heisst nicht, dass alle am Ende ihren Wunsch bekommen.", "Gute Entscheidungen brauchen Informationen und Respekt."],
      },
    ],
    "wirtschaft-handel-5": [
      {
        id: "nmg5-rich-wirtschaft-match-1", type: "matching", difficulty: 2,
        question: "Verbinde Wirtschaftsbegriff und einfache Erklärung.", answer: "all",
        pairs: [pair("angebot", "Angebot", "🏪"), pair("verkauf", "Was verkauft wird", "🧺"), pair("nachfrage", "Nachfrage", "🙋"), pair("wunsch", "Was Menschen kaufen möchten", "🛒"), pair("kosten", "Kosten", "🧾"), pair("aufwand", "Was Herstellung und Arbeit brauchen", "🛠️"), pair("preis", "Preis", "🏷️"), pair("bezahlen", "Was man bezahlt", "🪙")],
        hints: ["Denke an einen Laden.", "Preis und Kosten sind verwandt, aber nicht dasselbe."],
      },
      {
        id: "nmg5-rich-wirtschaft-drag-2", type: "drag-drop", difficulty: 2,
        question: "Ordne den Weg eines Produkts vom Ursprung bis zum Verkauf.", answer: "all",
        dragItems: [item("rohstoff", "Rohstoff gewinnen", "🌾"), item("herstellen", "Produkt herstellen", "🏭"), item("transport", "transportieren", "🚚"), item("laden", "im Laden verkaufen", "🏪")],
        dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
        dropAnswers: { rohstoff: "s1", herstellen: "s2", transport: "s3", laden: "s4" },
        hints: ["Viele Produkte haben mehrere Stationen.", "Der Verkauf kommt erst nach Herstellung und Transport."],
      },
      {
        id: "nmg5-rich-wirtschaft-word-2", type: "word-search", difficulty: 1,
        question: "Finde Wörter rund um Wirtschaft.", answer: "all",
        wordList: ["Preis", "Kosten", "Arbeit", "Laden", "Kaufen", "Ware"], gridSize: 10,
        hints: ["Suche waagrecht und senkrecht.", "Alle Wörter passen zu Kaufen, Herstellen oder Verkaufen."],
      },
      {
        id: "nmg5-rich-wirtschaft-match-2", type: "matching", difficulty: 2,
        question: "Verbinde Bedürfnis und Wunsch mit einem Beispiel.", answer: "all",
        pairs: [pair("beduerfnis", "Bedürfnis", "💧"), pair("trinken", "Wasser trinken", "🥤"), pair("schutz", "Schutz", "🧥"), pair("jacke", "warme Jacke im Winter", "🧣"), pair("wunsch", "Wunsch", "🎁"), pair("spiel", "neues Spiel", "🎲"), pair("vergleichen", "vergleichen", "⚖️"), pair("entscheiden", "bewusst entscheiden", "✅")],
        hints: ["Bedürfnisse sind für das Leben besonders wichtig.", "Wünsche dürfen da sein, sind aber nicht immer gleich nötig."],
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
      {
        id: "nmg5-rich-lebensraeume-match-2", type: "matching", difficulty: 2,
        question: "Verbinde Anpassung und passenden Lebensraum.", answer: "all",
        pairs: [pair("dickes_fell", "dickes Fell", "🧥"), pair("kaelte", "kalte Gegend", "❄️"), pair("tiefe_wurzel", "tiefe Wurzeln", "🌵"), pair("trockenheit", "trockene Gegend", "🏜️"), pair("breites_blatt", "breite Blätter", "🌿"), pair("feucht", "feuchter Wald", "🌧️"), pair("schwimmblatt", "Schwimmblatt", "🪷"), pair("wasser", "Gewässer", "💧")],
        hints: ["Lebewesen passen zu ihren Lebensbedingungen.", "Tiefe Wurzeln helfen bei wenig Wasser."],
      },
      {
        id: "nmg5-rich-lebensraeume-memory-2", type: "memory", difficulty: 2,
        question: "Finde Beobachtung und mögliche Erklärung.", answer: "all",
        pairs: [pair("wenig_bienen", "wenig Bienen", "🐝"), pair("wenig_blueten", "wenig Blüten", "🌼"), pair("truebes_wasser", "trübes Wasser", "💧"), pair("aufgewirbelt", "Boden ist aufgewirbelt", "🌫️"), pair("viele_voegel", "viele Vögel", "🐦"), pair("nahrung", "viel Nahrung und Schutz", "🌳"), pair("trockene_wiese", "trockene Wiese", "🌾"), pair("wenig_regen", "lange wenig Regen", "☀️")],
        hints: ["Beobachtungen können mehrere Ursachen haben.", "Eine Erklärung muss zur Beobachtung passen."],
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
      {
        id: "nmg6-rich-energie-drag-2", type: "drag-drop", difficulty: 3,
        question: "Ordne Massnahmen nach direkter Wirkung.", answer: "all",
        dragItems: [item("licht", "Licht ausschalten", "💡"), item("zug", "Zug statt Auto wählen", "🚆"), item("isolieren", "Fenster gut abdichten", "🏠"), item("teilen", "Gerät gemeinsam nutzen", "🤝")],
        dropZones: [zone("strom", "spart Strom"), zone("verkehr", "verändert Verkehr"), zone("waerme", "spart Wärme"), zone("ressourcen", "spart Ressourcen")],
        dropAnswers: { licht: "strom", zug: "verkehr", isolieren: "waerme", teilen: "ressourcen" },
        hints: ["Achte auf die direkte Wirkung der Massnahme.", "Gemeinsam nutzen kann weniger neue Dinge nötig machen."],
      },
      {
        id: "nmg6-rich-energie-match-2", type: "matching", difficulty: 3,
        question: "Verbinde Energie-Entscheidung und mögliche Folge.", answer: "all",
        pairs: [pair("solar", "Solaranlage", "☀️"), pair("weniger_co2", "weniger CO2 beim Betrieb", "🌱"), pair("standby", "Stand-by vermeiden", "🔌"), pair("weniger_strom", "weniger Stromverbrauch", "⚡"), pair("flug", "kurzer Flug", "✈️"), pair("viel_energie", "hoher Energiebedarf", "📈"), pair("reparieren", "reparieren", "🛠️"), pair("laenger", "Dinge länger nutzen", "♻️")],
        hints: ["Eine Entscheidung kann mehrere Folgen haben.", "Hier suchst du die passendste direkte Folge."],
      },
    ],
    "demokratie-menschenrechte-6": [
      {
        id: "nmg6-rich-demokratie-match-1", type: "matching", difficulty: 3,
        question: "Verbinde demokratische Handlung und Bedeutung.", answer: "all",
        pairs: [pair("waehlen", "wählen", "🗳️"), pair("vertreten", "mitentscheiden, wer vertritt", "👥"), pair("diskutieren", "diskutieren", "💬"), pair("gruende", "Gründe austauschen", "🧠"), pair("rechte", "Rechte kennen", "⚖️"), pair("schutz", "Menschen schützen", "🛡️"), pair("minderheit", "Minderheiten respektieren", "🤝"), pair("fair", "fair bleiben trotz Mehrheit", "✅")],
        hints: ["Demokratie ist mehr als Abstimmen.", "Rechte schützen auch Menschen, die nicht zur Mehrheit gehören."],
      },
      {
        id: "nmg6-rich-demokratie-drag-2", type: "drag-drop", difficulty: 3,
        question: "Ordne die Schritte einer fairen Klassenentscheidung.", answer: "all",
        dragItems: [item("info", "Informationen sammeln", "🔎"), item("argumente", "Argumente austauschen", "💬"), item("abstimmen", "abstimmen", "🗳️"), item("auswerten", "Entscheid erklären", "📋")],
        dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
        dropAnswers: { info: "s1", argumente: "s2", abstimmen: "s3", auswerten: "s4" },
        hints: ["Gute Entscheidungen beginnen nicht mit der Abstimmung.", "Nach dem Entscheid hilft eine klare Erklärung."],
      },
      {
        id: "nmg6-rich-demokratie-review-2", type: "self-review", difficulty: 3,
        question: "Eine Mehrheit möchte eine Regel, die für ein paar Kinder unfair wäre. Wie könnte die Klasse besser vorgehen?", answer: "review",
        reviewCriteria: ["Erkennt, dass Mehrheit allein nicht immer fair ist.", "Schlägt ein Gespräch, eine Anpassung oder einen Schutz vor.", "Begründet mit Rücksicht auf Rechte oder Bedürfnisse."],
        hints: ["Demokratie schützt auch Minderheiten.", "Eine gute Lösung kann angepasst statt einfach durchgedrückt werden."],
      },
      {
        id: "nmg6-rich-demokratie-match-2", type: "matching", difficulty: 3,
        question: "Verbinde Recht und Alltagssituation.", answer: "all",
        pairs: [pair("meinung", "Meinungsfreiheit", "💬"), pair("sagen", "eigene Ansicht respektvoll sagen", "🗣️"), pair("bildung", "Recht auf Bildung", "📚"), pair("schule", "lernen dürfen", "🏫"), pair("schutz", "Schutz vor Gewalt", "🛡️"), pair("sicher", "sich sicher fühlen", "🤝"), pair("privat", "Privatsphäre", "🔐"), pair("persoenlich", "Persönliches schützen", "📱")],
        hints: ["Menschenrechte zeigen sich auch im Alltag.", "Privatsphäre bedeutet: Persönliches gehört nicht allen."],
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
      {
        id: "nmg6-rich-global-drag-2", type: "drag-drop", difficulty: 3,
        question: "Ordne Stationen einer Schokolade-Lieferkette.", answer: "all",
        dragItems: [item("kakao", "Kakao anbauen", "🌱"), item("transport", "Kakao transportieren", "🚢"), item("herstellen", "Schokolade herstellen", "🏭"), item("verkaufen", "im Laden verkaufen", "🏪")],
        dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
        dropAnswers: { kakao: "s1", transport: "s2", herstellen: "s3", verkaufen: "s4" },
        hints: ["Viele Alltagsprodukte haben eine lange Reise.", "Verkauft wird erst nach Herstellung und Transport."],
      },
      {
        id: "nmg6-rich-global-memory-2", type: "memory", difficulty: 2,
        question: "Finde globale Verbindung und mögliche Frage dazu.", answer: "all",
        pairs: [pair("kleidung", "Kleidung", "👕"), pair("arbeit", "Wer hat sie hergestellt?", "👷"), pair("essen", "Lebensmittel", "🍫"), pair("weg", "Wie weit wurde es transportiert?", "🚢"), pair("handy", "Handy", "📱"), pair("rohstoffe", "Welche Rohstoffe stecken darin?", "⛏️"), pair("ferien", "Ferienreise", "🧳"), pair("folgen", "Welche Folgen hat die Reise?", "🌍")],
        hints: ["Globale Verbindungen sieht man oft an Produkten.", "Gute Fragen schauen auch auf Menschen und Umwelt."],
      },
      {
        id: "nmg6-rich-global-review-2", type: "self-review", difficulty: 3,
        question: "Du kaufst ein T-Shirt. Welche zwei Fragen helfen dir, fairer zu entscheiden?", answer: "review",
        reviewCriteria: ["Nennt zwei passende Fragen zu Herkunft, Arbeit, Preis oder Umwelt.", "Begründet, warum die Fragen wichtig sind.", "Bleibt realistisch und vermeidet einfache Schuldzuweisungen."],
        hints: ["Denke an Herstellung, Transport und Nutzungsdauer.", "Fair entscheiden heisst: genauer hinschauen."],
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
      {
        id: "nmg6-rich-zukunft-word-2", type: "word-search", difficulty: 2,
        question: "Finde Begriffe zu Zukunftsfragen.", answer: "all",
        wordList: ["Klima", "Energie", "Wasser", "Fair", "Technik", "Wandel"], gridSize: 11,
        hints: ["Suche waagrecht und senkrecht.", "Die Wörter passen zu Fragen, die mehrere Lebensbereiche verbinden."],
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
      {
        id: "nmg6-rich-technik-drag-2", type: "drag-drop", difficulty: 3,
        question: "Ordne Technikbeispiele nach Nutzen und möglicher Verantwortung.", answer: "all",
        dragItems: [item("sensor", "Sensor misst Temperatur", "🌡️"), item("daten", "Messdaten speichern", "💾"), item("roboter", "Roboter hebt schwere Dinge", "🤖"), item("kontrolle", "Arbeit kontrollieren", "🔎")],
        dropZones: [zone("nutzen", "direkter Nutzen"), zone("verantwortung", "braucht Verantwortung")],
        dropAnswers: { sensor: "nutzen", roboter: "nutzen", daten: "verantwortung", kontrolle: "verantwortung" },
        hints: ["Technik kann helfen, wirft aber auch Fragen auf.", "Daten und Kontrolle brauchen besonders sorgfältige Regeln."],
      },
      {
        id: "nmg6-rich-technik-match-2", type: "matching", difficulty: 3,
        question: "Verbinde technische Lösung und passende Prüffrage.", answer: "all",
        pairs: [pair("app", "Lern-App", "📱"), pair("datenfrage", "Welche Daten braucht sie?", "🔐"), pair("bruecke", "Brücke", "🌉"), pair("sicherheit", "Ist sie sicher gebaut?", "🛡️"), pair("maschine", "Maschine", "⚙️"), pair("arbeit", "Welche Arbeit verändert sie?", "👷"), pair("recycling", "Recycling-Technik", "♻️"), pair("ressourcen", "Welche Ressourcen spart sie?", "🌱")],
        hints: ["Eine Prüffrage schaut hinter den ersten Nutzen.", "Bei Apps sind Daten besonders wichtig."],
      },
      {
        id: "nmg6-rich-technik-memory-2", type: "memory", difficulty: 2,
        question: "Finde Technikfolge und passendes Beispiel.", answer: "all",
        pairs: [pair("schneller", "schneller arbeiten", "⚙️"), pair("automat", "Automat sortiert", "📦"), pair("genauer", "genauer messen", "📏"), pair("sensor", "Sensor misst", "🌡️"), pair("abhaengig", "abhängig werden", "🔌"), pair("akku", "Akku leer", "🪫"), pair("schutz", "Daten schützen", "🔐"), pair("passwort", "starkes Passwort", "🔑")],
        hints: ["Folgen können nützlich oder anspruchsvoll sein.", "Datenschutz ist auch bei Technik im Alltag wichtig."],
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
