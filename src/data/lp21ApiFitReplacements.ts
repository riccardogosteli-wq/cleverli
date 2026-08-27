import type { Exercise, Topic } from "@/types/exercise";
import targets from "./lp21ApiFitTargets.json";

type Lang = "de" | "en" | "fr" | "it";
type Texts = Record<Lang, string>;
type Choice = { label: Texts; wrong: [Texts, Texts, Texts] };
type Generated = { question: Texts; answer: Texts; choices: Choice; hint: Texts };

const tx = (de: string, en: string, fr: string, it: string): Texts => ({ de, en, fr, it });
const value = (texts: Texts, lang: Lang) => texts[lang];

const ORIGINAL_TARGET_KEYS = new Set(targets.map((target) => `${target.grade}/${target.subject}/${target.topic}/${target.id}`));
const EXPANDED_TOPIC_KEYS = new Set([
  "5/science/chemie-einfuehrung-5",
  "5/science/wirtschaft-handel-5",
  "5/science/sonnensystem",
  "5/science/weltall",
  "6/german/argumentation-6",
  "6/german/sprache-wandel-6",
  "6/german/literatur-6",
  "6/science/chemie-6",
  "6/science/astronomie-6",
  "6/science/weltall",
  "6/science/wirtschaft-grundlagen-6",
  "6/science/globalisierung-6",
]);
const ADDITIONAL_FALSE_NEGATIVE_KEYS = new Set(["5/science/technik-erfinungen-5/te5-38"]);
export const LP21_API_FIT_ORIGINAL_TARGET_COUNT = targets.length;
export const LP21_API_FIT_EXPANDED_TARGET_COUNT = 1_136;
export function isLp21ApiFitTarget(key: string): boolean {
  if (ORIGINAL_TARGET_KEYS.has(key) || ADDITIONAL_FALSE_NEGATIVE_KEYS.has(key)) return true;
  const parts = key.split("/");
  return EXPANDED_TOPIC_KEYS.has(parts.slice(0, 3).join("/"));
}

export const LP21_API_FIT_TOPIC_TITLES: Record<string, string> = {
  "5/science/chemie-einfuehrung-5": "Stoffe im Alltag erforschen",
  "5/science/wirtschaft-handel-5": "Wirtschaft im Alltag",
  "5/science/sonnensystem": "Sonnensystem entdecken",
  "5/science/weltall": "Weltall entdecken",
  "6/science/chemie-6": "Stoffe und ihre Eigenschaften",
  "6/science/biologie-zelle-6": "Körper, Gesundheit & Lebensräume",
  "6/science/industrialisierung-6": "Arbeit & Technik im Wandel",
  "6/science/weltkriege-6": "Frieden & Zusammenleben",
  "6/science/astronomie-6": "Erde, Mond & Sonne",
  "6/science/weltall": "Weltall erforschen",
  "6/science/wirtschaft-grundlagen-6": "Wirtschaft im Alltag",
  "6/science/globalisierung-6": "Weltweit verbunden",
  "6/english/passive-voice-6": "Everyday English",
  "6/english/conditionals-6": "Plans & Reasons",
  "6/english/reported-speech-6": "Conversations",
  "6/french/passe-compose-6": "Ma journée",
  "6/french/imparfait-6": "À l’école",
  "6/french/futur-simple-6": "Projets & loisirs",
  "6/french/pronoms-cod-coi-6": "Phrases utiles",
};

const TOPIC_CONTEXTS: Record<string, Texts> = {
  "fuenf-sinne": tx("Sinne", "Senses", "Les sens", "I sensi"),
  "lebewesen": tx("Lebewesen", "Living things", "Les êtres vivants", "Gli esseri viventi"),
  "rechtschreibung": tx("Rechtschreibung", "Spelling", "Orthographe", "Ortografia"),
  "demokratie": tx("Gemeinsam entscheiden", "Deciding together", "Décider ensemble", "Decidere insieme"),
  "koerper-sinne-4": tx("Körper und Sinne", "Body and senses", "Corps et sens", "Corpo e sensi"),
  "schweizer-geschichte-4": tx("Schweizer Geschichte", "Swiss history", "Histoire suisse", "Storia svizzera"),
  "europa-4": tx("Europa", "Europe", "Europe", "Europa"),
  "direkte-rede": tx("Direkte Rede", "Direct speech", "Discours direct", "Discorso diretto"),
  "textsorten-5": tx("Texte", "Texts", "Textes", "Testi"),
  "sonnensystem": tx("Sonnensystem", "Solar System", "Système solaire", "Sistema solare"),
  "menschlicher-koerper-5": tx("Menschlicher Körper", "Human body", "Corps humain", "Corpo umano"),
  "chemie-einfuehrung-5": tx("Stoffe im Alltag", "Everyday materials", "Matières du quotidien", "Materiali quotidiani"),
  "pflanzen-tiere-5": tx("Pflanzen und Tiere", "Plants and animals", "Plantes et animaux", "Piante e animali"),
  "weltall": tx("Weltall", "Space", "Espace", "Spazio"),
  "wirtschaft-handel-5": tx("Wirtschaft und Handel", "Economy and trade", "Économie et commerce", "Economia e commercio"),
  "textsorten": tx("Textsorten", "Text types", "Types de textes", "Tipi di testo"),
  "rechtschreibstrategien": tx("Rechtschreibstrategien", "Spelling strategies", "Stratégies d’orthographe", "Strategie ortografiche"),
  "argumentation-6": tx("Meinung begründen", "Giving reasons", "Justifier une opinion", "Motivare un’opinione"),
  "sprache-wandel-6": tx("Sprache im Wandel", "Language change", "Évolution de la langue", "Evoluzione della lingua"),
  "literatur-6": tx("Geschichten verstehen", "Understanding stories", "Comprendre des histoires", "Capire storie"),
  "chemie-6": tx("Stoffe erforschen", "Exploring materials", "Explorer les matières", "Esplorare materiali"),
  "biologie-zelle-6": tx("Körper und Gesundheit", "Body and health", "Corps et santé", "Corpo e salute"),
  "astronomie-6": tx("Himmelskörper", "Celestial bodies", "Corps célestes", "Corpi celesti"),
  "neuzeit-6": tx("Wandel der Zeit", "Change over time", "Changements dans le temps", "Cambiamenti nel tempo"),
  "industrialisierung-6": tx("Arbeit im Wandel", "Work through time", "Travail au fil du temps", "Lavoro nel tempo"),
  "demokratie-menschenrechte-6": tx("Rechte und Mitbestimmung", "Rights and participation", "Droits et participation", "Diritti e partecipazione"),
  "weltkriege-6": tx("Frieden und Zusammenleben", "Peace and living together", "Paix et vivre ensemble", "Pace e convivenza"),
  "globalisierung-6": tx("Weltweit verbunden", "Connected worldwide", "Reliés dans le monde", "Connessi nel mondo"),
  "wirtschaft-grundlagen-6": tx("Wirtschaft im Alltag", "Everyday economy", "Économie quotidienne", "Economia quotidiana"),
  "kontinente-6": tx("Kontinente", "Continents", "Continents", "Continenti"),
  "migration-flucht-6": tx("Zusammenleben", "Living together", "Vivre ensemble", "Vivere insieme"),
  "passe-compose-6": tx("Ma journée", "Ma journée", "Ma journée", "Ma journée"),
  "imparfait-6": tx("À l’école", "À l’école", "À l’école", "À l’école"),
  "futur-simple-6": tx("Projets et loisirs", "Projets et loisirs", "Projets et loisirs", "Projets et loisirs"),
  "pronoms-cod-coi-6": tx("Phrases utiles", "Phrases utiles", "Phrases utiles", "Phrases utiles"),
  "france-pays-francophones-6": tx("Monde francophone", "Monde francophone", "Monde francophone", "Monde francophone"),
  "passive-voice-6": tx("Everyday English", "Everyday English", "Everyday English", "Everyday English"),
  "conditionals-6": tx("Plans and reasons", "Plans and reasons", "Plans and reasons", "Plans and reasons"),
  "reported-speech-6": tx("Conversations", "Conversations", "Conversations", "Conversations"),
  "exam-skills-6": tx("Learning strategies", "Learning strategies", "Learning strategies", "Learning strategies"),
};

function withTopicContext(generated: Generated, topic: string): Generated {
  const context = TOPIC_CONTEXTS[topic];
  if (!context) return generated;
  return {
    ...generated,
    question: {
      de: `${context.de}: ${generated.question.de}`,
      en: `${context.en}: ${generated.question.en}`,
      fr: `${context.fr} : ${generated.question.fr}`,
      it: `${context.it}: ${generated.question.it}`,
    },
  };
}

const MATERIALS: Choice[] = [
  { label: tx("durchsichtig", "transparent", "transparent", "trasparente"), wrong: [tx("magnetisch", "magnetic", "magnétique", "magnetico"), tx("weich", "soft", "mou", "morbido"), tx("wasserlöslich", "water-soluble", "soluble dans l’eau", "solubile in acqua")] },
  { label: tx("elastisch", "elastic", "élastique", "elastico"), wrong: [tx("spröde", "brittle", "cassant", "fragile"), tx("flüssig", "liquid", "liquide", "liquido"), tx("magnetisch", "magnetic", "magnétique", "magnetico")] },
  { label: tx("wärmeleitend", "heat-conducting", "conducteur de chaleur", "conduttore di calore"), wrong: [tx("durchsichtig", "transparent", "transparent", "trasparente"), tx("saugfähig", "absorbent", "absorbant", "assorbente"), tx("elastisch", "elastic", "élastique", "elastico")] },
  { label: tx("wärmedämmend", "heat-insulating", "isolant thermique", "isolante termico"), wrong: [tx("magnetisch", "magnetic", "magnétique", "magnetico"), tx("wasserlöslich", "water-soluble", "soluble dans l’eau", "solubile in acqua"), tx("hart", "hard", "dur", "duro")] },
  { label: tx("magnetisch anziehbar", "attracted by a magnet", "attiré par un aimant", "attratto da un magnete"), wrong: [tx("durchsichtig", "transparent", "transparent", "trasparente"), tx("saugfähig", "absorbent", "absorbant", "assorbente"), tx("schwimmend", "floating", "flottant", "galleggiante")] },
  { label: tx("saugfähig", "absorbent", "absorbant", "assorbente"), wrong: [tx("magnetisch", "magnetic", "magnétique", "magnetico"), tx("wärmeleitend", "heat-conducting", "conducteur de chaleur", "conduttore di calore"), tx("wasserabweisend", "water-repellent", "hydrofuge", "idrorepellente")] },
  { label: tx("sinkend", "sinking", "qui coule", "che affonda"), wrong: [tx("schwimmend", "floating", "flottant", "galleggiante"), tx("verdampfend", "evaporating", "qui s’évapore", "che evapora"), tx("löslich", "soluble", "soluble", "solubile")] },
  { label: tx("schwimmend", "floating", "flottant", "galleggiante"), wrong: [tx("sinkend", "sinking", "qui coule", "che affonda"), tx("magnetisch", "magnetic", "magnétique", "magnetico"), tx("schmelzend", "melting", "qui fond", "che fonde")] },
  { label: tx("schmelzend", "melting", "qui fond", "che fonde"), wrong: [tx("gefrierend", "freezing", "qui gèle", "che congela"), tx("magnetisch", "magnetic", "magnétique", "magnetico"), tx("saugfähig", "absorbent", "absorbant", "assorbente")] },
  { label: tx("gefrierend", "freezing", "qui gèle", "che congela"), wrong: [tx("schmelzend", "melting", "qui fond", "che fonde"), tx("brennend", "burning", "qui brûle", "che brucia"), tx("magnetisch", "magnetic", "magnétique", "magnetico")] },
];

const MATERIAL_OBJECTS: Texts[] = [
  tx("Glas", "glass", "le verre", "il vetro"), tx("Gummi", "rubber", "le caoutchouc", "la gomma"),
  tx("Metall", "metal", "le métal", "il metallo"), tx("Wolle", "wool", "la laine", "la lana"),
  tx("Eisen", "iron", "le fer", "il ferro"), tx("Schwamm", "sponge", "l’éponge", "la spugna"),
  tx("Stein im Wasser", "stone in water", "la pierre dans l’eau", "la pietra nell’acqua"),
  tx("Kork im Wasser", "cork in water", "le liège dans l’eau", "il sughero nell’acqua"),
  tx("Eis bei Wärme", "ice when warmed", "la glace chauffée", "il ghiaccio riscaldato"),
  tx("Wasser unter 0 °C", "water below 0 °C", "l’eau sous 0 °C", "l’acqua sotto 0 °C"),
];

const BODY_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Herz", "heart", "cœur", "cuore"), fact: { label: tx("pumpt Blut", "pumps blood", "pompe le sang", "pompa il sangue"), wrong: [tx("verdaut Nahrung", "digests food", "digère les aliments", "digerisce il cibo"), tx("speichert Luft", "stores air", "stocke l’air", "immagazzina aria"), tx("bildet Gedanken", "forms thoughts", "forme des pensées", "forma pensieri")] } },
  { thing: tx("Lunge", "lungs", "poumons", "polmoni"), fact: { label: tx("tauscht Atemgase aus", "exchanges breathing gases", "échange les gaz respiratoires", "scambia i gas respiratori"), wrong: [tx("pumpt Blut", "pumps blood", "pompe le sang", "pompa il sangue"), tx("bewegt Knochen", "moves bones", "fait bouger les os", "muove le ossa"), tx("verdaut Nahrung", "digests food", "digère les aliments", "digerisce il cibo")] } },
  { thing: tx("Magen", "stomach", "estomac", "stomaco"), fact: { label: tx("hilft bei der Verdauung", "helps digestion", "aide à la digestion", "aiuta la digestione"), wrong: [tx("nimmt Licht wahr", "detects light", "perçoit la lumière", "percepisce la luce"), tx("pumpt Blut", "pumps blood", "pompe le sang", "pompa il sangue"), tx("hört Töne", "hears sounds", "entend les sons", "sente i suoni")] } },
  { thing: tx("Haut", "skin", "peau", "pelle"), fact: { label: tx("schützt und nimmt Reize wahr", "protects and senses stimuli", "protège et perçoit des stimuli", "protegge e percepisce stimoli"), wrong: [tx("pumpt Blut", "pumps blood", "pompe le sang", "pompa il sangue"), tx("verdaut Nahrung", "digests food", "digère les aliments", "digerisce il cibo"), tx("bildet Knochen", "forms bones", "forme les os", "forma le ossa")] } },
  { thing: tx("Muskeln", "muscles", "muscles", "muscoli"), fact: { label: tx("ermöglichen Bewegung", "enable movement", "permettent le mouvement", "permettono il movimento"), wrong: [tx("erzeugen Licht", "produce light", "produisent de la lumière", "producono luce"), tx("verdauen Nahrung", "digest food", "digèrent les aliments", "digeriscono il cibo"), tx("speichern Luft", "store air", "stockent l’air", "immagazzinano aria")] } },
  { thing: tx("Knochen", "bones", "os", "ossa"), fact: { label: tx("stützen den Körper", "support the body", "soutiennent le corps", "sostengono il corpo"), wrong: [tx("pumpen Blut", "pump blood", "pompent le sang", "pompano il sangue"), tx("schmecken Nahrung", "taste food", "goûtent les aliments", "assaggiano il cibo"), tx("erzeugen Atemluft", "make breathing air", "produisent l’air", "producono aria")] } },
  { thing: tx("Gehirn", "brain", "cerveau", "cervello"), fact: { label: tx("verarbeitet Informationen", "processes information", "traite les informations", "elabora informazioni"), wrong: [tx("pumpt Blut", "pumps blood", "pompe le sang", "pompa il sangue"), tx("filtert Wasser", "filters water", "filtre l’eau", "filtra l’acqua"), tx("bildet Zähne", "forms teeth", "forme les dents", "forma i denti")] } },
  { thing: tx("Dünndarm", "small intestine", "intestin grêle", "intestino tenue"), fact: { label: tx("nimmt Nährstoffe auf", "absorbs nutrients", "absorbe les nutriments", "assorbe i nutrienti"), wrong: [tx("hört Töne", "hears sounds", "entend les sons", "sente i suoni"), tx("pumpt Blut", "pumps blood", "pompe le sang", "pompa il sangue"), tx("bewegt Arme", "moves arms", "bouge les bras", "muove le braccia")] } },
  { thing: tx("Nerven", "nerves", "nerfs", "nervi"), fact: { label: tx("übertragen Signale", "carry signals", "transmettent des signaux", "trasmettono segnali"), wrong: [tx("verdauen Nahrung", "digest food", "digèrent les aliments", "digeriscono il cibo"), tx("bilden Knochen", "form bones", "forment les os", "formano le ossa"), tx("speichern Wasser", "store water", "stockent l’eau", "immagazzinano acqua")] } },
  { thing: tx("Immunsystem", "immune system", "système immunitaire", "sistema immunitario"), fact: { label: tx("wehrt Krankheitserreger ab", "defends against pathogens", "combat les agents pathogènes", "difende dagli agenti patogeni"), wrong: [tx("erzeugt Sonnenlicht", "makes sunlight", "produit la lumière du soleil", "produce luce solare"), tx("pumpt allein das Blut", "alone pumps blood", "pompe seul le sang", "pompa da solo il sangue"), tx("ersetzt Schlaf", "replaces sleep", "remplace le sommeil", "sostituisce il sonno")] } },
];

const SENSE_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Auge", "eye", "œil", "occhio"), fact: { label: tx("nimmt Licht wahr", "detects light", "perçoit la lumière", "percepisce la luce"), wrong: [tx("hört Töne", "hears sounds", "entend les sons", "sente i suoni"), tx("schmeckt Nahrung", "tastes food", "goûte les aliments", "assaggia il cibo"), tx("riecht Düfte", "smells scents", "sent les odeurs", "sente gli odori")] } },
  { thing: tx("Ohr", "ear", "oreille", "orecchio"), fact: { label: tx("nimmt Töne wahr", "detects sounds", "perçoit les sons", "percepisce i suoni"), wrong: [tx("sieht Farben", "sees colours", "voit les couleurs", "vede i colori"), tx("schmeckt Nahrung", "tastes food", "goûte les aliments", "assaggia il cibo"), tx("riecht Düfte", "smells scents", "sent les odeurs", "sente gli odori")] } },
  { thing: tx("Nase", "nose", "nez", "naso"), fact: { label: tx("nimmt Gerüche wahr", "detects smells", "perçoit les odeurs", "percepisce gli odori"), wrong: [tx("hört Musik", "hears music", "entend la musique", "sente la musica"), tx("sieht Licht", "sees light", "voit la lumière", "vede la luce"), tx("schmeckt Nahrung", "tastes food", "goûte les aliments", "assaggia il cibo")] } },
  { thing: tx("Zunge", "tongue", "langue", "lingua"), fact: { label: tx("nimmt Geschmäcker wahr", "detects tastes", "perçoit les goûts", "percepisce i sapori"), wrong: [tx("hört Töne", "hears sounds", "entend les sons", "sente i suoni"), tx("sieht Farben", "sees colours", "voit les couleurs", "vede i colori"), tx("riecht Düfte", "smells scents", "sent les odeurs", "sente gli odori")] } },
  { thing: tx("Haut", "skin", "peau", "pelle"), fact: { label: tx("nimmt Berührung und Temperatur wahr", "detects touch and temperature", "perçoit le toucher et la température", "percepisce tatto e temperatura"), wrong: [tx("hört Töne", "hears sounds", "entend les sons", "sente i suoni"), tx("sieht Farben", "sees colours", "voit les couleurs", "vede i colori"), tx("schmeckt Nahrung", "tastes food", "goûte les aliments", "assaggia il cibo")] } },
];

const LIVING_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Eine Pflanze", "a plant", "une plante", "una pianta"), fact: { label: tx("braucht Licht und Wasser", "needs light and water", "a besoin de lumière et d’eau", "ha bisogno di luce e acqua"), wrong: [tx("braucht kein Wasser", "needs no water", "n’a pas besoin d’eau", "non ha bisogno di acqua"), tx("lebt nur im Dunkeln", "lives only in darkness", "vit seulement dans le noir", "vive solo al buio"), tx("besteht aus Metall", "is made of metal", "est faite de métal", "è fatta di metallo")] } },
  { thing: tx("Ein Lebensraum", "a habitat", "un habitat", "un habitat"), fact: { label: tx("bietet Nahrung, Schutz und Platz", "provides food, shelter and space", "offre nourriture, abri et espace", "offre cibo, riparo e spazio"), wrong: [tx("ist für alle Arten gleich", "is the same for every species", "est identique pour toutes les espèces", "è uguale per ogni specie"), tx("besteht nur aus Luft", "contains only air", "ne contient que de l’air", "contiene solo aria"), tx("hat keine Pflanzen", "has no plants", "n’a pas de plantes", "non ha piante")] } },
  { thing: tx("Eine Nahrungskette", "a food chain", "une chaîne alimentaire", "una catena alimentare"), fact: { label: tx("zeigt Beziehungen zwischen Lebewesen", "shows links between living things", "montre des liens entre les êtres vivants", "mostra relazioni tra esseri viventi"), wrong: [tx("zeigt nur Steine", "shows only stones", "ne montre que des pierres", "mostra solo pietre"), tx("ist eine Wetterkarte", "is a weather map", "est une carte météo", "è una carta meteo"), tx("hat keine Pflanzen", "has no plants", "n’a pas de plantes", "non ha piante")] } },
  { thing: tx("Angepasste Merkmale", "adapted features", "des caractères adaptés", "caratteristiche adattate"), fact: { label: tx("helfen im jeweiligen Lebensraum", "help in a particular habitat", "aident dans un habitat donné", "aiutano in un certo habitat"), wrong: [tx("ändern sich jeden Tag", "change every day", "changent chaque jour", "cambiano ogni giorno"), tx("machen Nahrung unnötig", "make food unnecessary", "rendent la nourriture inutile", "rendono inutile il cibo"), tx("sind bei allen Arten gleich", "are the same in all species", "sont identiques chez toutes les espèces", "sono uguali in tutte le specie")] } },
  { thing: tx("Artenvielfalt", "biodiversity", "biodiversité", "biodiversità"), fact: { label: tx("bedeutet viele verschiedene Arten", "means many different species", "signifie de nombreuses espèces différentes", "significa molte specie diverse"), wrong: [tx("bedeutet nur eine Art", "means only one species", "signifie une seule espèce", "significa una sola specie"), tx("betrifft nur Haustiere", "concerns only pets", "concerne seulement les animaux domestiques", "riguarda solo animali domestici"), tx("verhindert Lebensräume", "prevents habitats", "empêche les habitats", "impedisce gli habitat")] } },
];

const ECONOMY_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Geld", "money", "argent", "denaro"), fact: { label: tx("erleichtert den Tausch von Waren und Leistungen", "makes exchanging goods and services easier", "facilite l’échange de biens et services", "facilita lo scambio di beni e servizi"), wrong: [tx("ersetzt jede Arbeit", "replaces all work", "remplace tout travail", "sostituisce ogni lavoro"), tx("macht Preise unnötig", "makes prices unnecessary", "rend les prix inutiles", "rende inutili i prezzi"), tx("kann nicht gespart werden", "cannot be saved", "ne peut pas être économisé", "non può essere risparmiato")] } },
  { thing: tx("Ein Budget", "a budget", "un budget", "un budget"), fact: { label: tx("plant Einnahmen und Ausgaben", "plans income and spending", "planifie recettes et dépenses", "pianifica entrate e spese"), wrong: [tx("zeigt nur das Wetter", "shows only weather", "montre seulement la météo", "mostra solo il tempo"), tx("macht Geld unbegrenzt", "makes money unlimited", "rend l’argent illimité", "rende il denaro illimitato"), tx("enthält keine Zahlen", "contains no numbers", "ne contient aucun nombre", "non contiene numeri")] } },
  { thing: tx("Ein Preis", "a price", "un prix", "un prezzo"), fact: { label: tx("zeigt, was etwas kostet", "shows what something costs", "indique ce que coûte quelque chose", "indica quanto costa qualcosa"), wrong: [tx("zeigt das Gewicht jeder Ware", "shows every item’s weight", "indique le poids de chaque produit", "indica il peso di ogni prodotto"), tx("ist immer überall gleich", "is always the same everywhere", "est toujours identique partout", "è sempre uguale ovunque"), tx("ist eine Wetterangabe", "is weather information", "est une donnée météo", "è un dato meteorologico")] } },
  { thing: tx("Handel", "trade", "commerce", "commercio"), fact: { label: tx("bringt Waren von Anbietern zu Kundinnen und Kunden", "moves goods from sellers to customers", "amène les biens des vendeurs aux clients", "porta merci dai venditori ai clienti"), wrong: [tx("verhindert jeden Transport", "prevents all transport", "empêche tout transport", "impedisce ogni trasporto"), tx("betrifft nur Geschenke", "concerns only gifts", "concerne seulement les cadeaux", "riguarda solo regali"), tx("braucht keine Entscheidungen", "needs no decisions", "ne demande aucune décision", "non richiede decisioni")] } },
  { thing: tx("Reparieren", "repairing", "réparer", "riparare"), fact: { label: tx("kann Geld und Ressourcen sparen", "can save money and resources", "peut économiser argent et ressources", "può risparmiare denaro e risorse"), wrong: [tx("erzeugt immer mehr Abfall", "always creates more waste", "crée toujours plus de déchets", "crea sempre più rifiuti"), tx("macht Produkte sofort unbrauchbar", "makes products unusable", "rend les produits inutilisables", "rende i prodotti inutilizzabili"), tx("verbraucht nie Material", "never uses material", "n’utilise jamais de matériau", "non usa mai materiali")] } },
];

const GEO_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Eine Kartenlegende", "a map legend", "une légende de carte", "una legenda cartografica"), fact: { label: tx("erklärt Zeichen und Farben", "explains symbols and colours", "explique les symboles et couleurs", "spiega simboli e colori"), wrong: [tx("zeigt nur das Datum", "shows only the date", "montre seulement la date", "mostra solo la data"), tx("misst die Temperatur", "measures temperature", "mesure la température", "misura la temperatura"), tx("ersetzt die Karte", "replaces the map", "remplace la carte", "sostituisce la carta")] } },
  { thing: tx("Ein Kompass", "a compass", "une boussole", "una bussola"), fact: { label: tx("hilft Himmelsrichtungen zu bestimmen", "helps identify directions", "aide à trouver les points cardinaux", "aiuta a trovare i punti cardinali"), wrong: [tx("misst Regen", "measures rain", "mesure la pluie", "misura la pioggia"), tx("zeigt Landesgrenzen automatisch", "automatically shows borders", "montre automatiquement les frontières", "mostra automaticamente i confini"), tx("berechnet Preise", "calculates prices", "calcule les prix", "calcola prezzi")] } },
  { thing: tx("Eine Grenze", "a border", "une frontière", "un confine"), fact: { label: tx("trennt politische oder geografische Räume", "separates political or geographical areas", "sépare des espaces politiques ou géographiques", "separa spazi politici o geografici"), wrong: [tx("ist immer ein Fluss", "is always a river", "est toujours une rivière", "è sempre un fiume"), tx("kann nie auf Karten stehen", "can never appear on maps", "ne peut jamais figurer sur une carte", "non può apparire sulle carte"), tx("zeigt eine Jahreszeit", "shows a season", "indique une saison", "indica una stagione")] } },
  { thing: tx("Ein Kontinent", "a continent", "un continent", "un continente"), fact: { label: tx("ist eine sehr grosse zusammenhängende Landfläche", "is a very large connected land area", "est une très grande étendue de terre", "è una vastissima area terrestre"), wrong: [tx("ist immer ein einzelnes Land", "is always one country", "est toujours un seul pays", "è sempre un solo paese"), tx("ist kleiner als jede Insel", "is smaller than every island", "est plus petit que chaque île", "è più piccolo di ogni isola"), tx("besteht nur aus Städten", "contains only cities", "ne contient que des villes", "contiene solo città")] } },
  { thing: tx("Eine Region", "a region", "une région", "una regione"), fact: { label: tx("kann gemeinsame Merkmale haben", "can share common features", "peut avoir des caractéristiques communes", "può avere caratteristiche comuni"), wrong: [tx("hat nie eine Landschaft", "never has a landscape", "n’a jamais de paysage", "non ha mai un paesaggio"), tx("ist immer ein Staat", "is always a state", "est toujours un État", "è sempre uno Stato"), tx("kann nicht auf Karten gezeigt werden", "cannot be shown on maps", "ne peut pas être montrée sur une carte", "non può essere mostrata su una carta")] } },
];

const WORK_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Buchdruck", "printing press", "imprimerie", "stampa"), fact: { label: tx("Bücher schneller vervielfältigen", "copy books faster", "reproduire des livres plus vite", "riprodurre libri più velocemente"), wrong: [tx("Wolle spinnen", "spin wool", "filer la laine", "filare la lana"), tx("Felder bewässern", "water fields", "irriguer les champs", "irrigare i campi"), tx("Brücken messen", "measure bridges", "mesurer des ponts", "misurare ponti")] } },
  { thing: tx("Dampfmaschine", "steam engine", "machine à vapeur", "macchina a vapore"), fact: { label: tx("Maschinen und Fahrzeuge antreiben", "power machines and vehicles", "entraîner des machines et véhicules", "azionare macchine e veicoli"), wrong: [tx("Briefe schreiben", "write letters", "écrire des lettres", "scrivere lettere"), tx("Tiere füttern", "feed animals", "nourrir les animaux", "nutrire animali"), tx("Bilder drucken", "print pictures", "imprimer des images", "stampare immagini")] } },
  { thing: tx("Eisenbahn", "railway", "chemin de fer", "ferrovia"), fact: { label: tx("Menschen und Waren schneller transportieren", "move people and goods faster", "transporter plus vite personnes et marchandises", "trasportare più rapidamente persone e merci"), wrong: [tx("Strom speichern", "store electricity", "stocker l’électricité", "immagazzinare elettricità"), tx("Getreide mahlen", "grind grain", "moudre le grain", "macinare cereali"), tx("Wasser reinigen", "clean water", "purifier l’eau", "pulire l’acqua")] } },
  { thing: tx("Telefon", "telephone", "téléphone", "telefono"), fact: { label: tx("über Distanz sprechen", "speak over a distance", "parler à distance", "parlare a distanza"), wrong: [tx("Brot backen", "bake bread", "cuire du pain", "cuocere pane"), tx("Stoff weben", "weave cloth", "tisser du tissu", "tessere stoffa"), tx("Wasser pumpen", "pump water", "pomper l’eau", "pompare acqua")] } },
  { thing: tx("Elektrisches Licht", "electric light", "lumière électrique", "luce elettrica"), fact: { label: tx("Räume ohne Kerze beleuchten", "light rooms without candles", "éclairer sans bougie", "illuminare senza candela"), wrong: [tx("Briefe transportieren", "carry letters", "transporter des lettres", "trasportare lettere"), tx("Wolle färben", "dye wool", "teindre la laine", "tingere lana"), tx("Felder pflügen", "plough fields", "labourer les champs", "arare campi")] } },
  { thing: tx("Waschmaschine", "washing machine", "machine à laver", "lavatrice"), fact: { label: tx("Wäsche mit weniger Handarbeit waschen", "wash clothes with less hand work", "laver avec moins de travail manuel", "lavare con meno lavoro manuale"), wrong: [tx("Nachrichten senden", "send messages", "envoyer des messages", "inviare messaggi"), tx("Holz sägen", "saw wood", "scier du bois", "segare legno"), tx("Strassen bauen", "build roads", "construire des routes", "costruire strade")] } },
  { thing: tx("Computer", "computer", "ordinateur", "computer"), fact: { label: tx("Informationen verarbeiten", "process information", "traiter des informations", "elaborare informazioni"), wrong: [tx("Wasser kochen", "boil water", "faire bouillir l’eau", "bollire acqua"), tx("Getreide ernten", "harvest grain", "récolter le grain", "raccogliere cereali"), tx("Wolle spinnen", "spin wool", "filer la laine", "filare lana")] } },
  { thing: tx("Roboter", "robot", "robot", "robot"), fact: { label: tx("wiederholte Aufgaben ausführen", "perform repeated tasks", "effectuer des tâches répétées", "eseguire compiti ripetuti"), wrong: [tx("selbst Ziele bestimmen", "set its own goals", "choisir seul ses buts", "decidere da solo i propri obiettivi"), tx("ohne Energie arbeiten", "work without energy", "travailler sans énergie", "lavorare senza energia"), tx("jede Arbeit ersetzen", "replace every job", "remplacer tout travail", "sostituire ogni lavoro")] } },
  { thing: tx("Solarpanel", "solar panel", "panneau solaire", "pannello solare"), fact: { label: tx("Sonnenlicht in Energie umwandeln", "turn sunlight into energy", "transformer la lumière en énergie", "trasformare luce solare in energia"), wrong: [tx("Wind erzeugen", "make wind", "produire du vent", "produrre vento"), tx("Wasser färben", "colour water", "colorer l’eau", "colorare acqua"), tx("Kohle herstellen", "make coal", "fabriquer du charbon", "produrre carbone")] } },
  { thing: tx("Reparatur", "repair", "réparation", "riparazione"), fact: { label: tx("Produkte länger nutzbar machen", "make products last longer", "faire durer les produits", "far durare più a lungo i prodotti"), wrong: [tx("mehr Abfall erzeugen", "make more waste", "produire plus de déchets", "produrre più rifiuti"), tx("Material verstecken", "hide material", "cacher le matériau", "nascondere materiale"), tx("Energie verschwenden", "waste energy", "gaspiller l’énergie", "sprecare energia")] } },
];

const PEACE_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Bei einem Streit", "During an argument", "Lors d’un conflit", "Durante un litigio"), fact: { label: tx("ruhig zuhören und gemeinsam sprechen", "listen calmly and talk together", "écouter calmement et parler ensemble", "ascoltare con calma e parlare insieme"), wrong: [tx("beleidigen", "insult", "insulter", "insultare"), tx("Gerüchte verbreiten", "spread rumours", "répandre des rumeurs", "diffondere voci"), tx("drohen", "threaten", "menacer", "minacciare")] } },
  { thing: tx("Bei unterschiedlichen Meinungen", "With different opinions", "Avec des avis différents", "Con opinioni diverse"), fact: { label: tx("Gründe austauschen", "share reasons", "échanger des raisons", "scambiarsi le ragioni"), wrong: [tx("andere auslachen", "mock others", "se moquer des autres", "deridere gli altri"), tx("niemanden anhören", "hear nobody", "n’écouter personne", "non ascoltare nessuno"), tx("Informationen erfinden", "invent information", "inventer des informations", "inventare informazioni")] } },
  { thing: tx("In einer Abstimmung", "In a vote", "Lors d’un vote", "In una votazione"), fact: { label: tx("jede Stimme respektieren", "respect every vote", "respecter chaque voix", "rispettare ogni voto"), wrong: [tx("Stimmen verstecken", "hide votes", "cacher les voix", "nascondere voti"), tx("andere zwingen", "force others", "forcer les autres", "costringere gli altri"), tx("Regeln wechseln", "change rules", "changer les règles", "cambiare le regole")] } },
  { thing: tx("Bei einer Klassenregel", "For a class rule", "Pour une règle de classe", "Per una regola di classe"), fact: { label: tx("Betroffene einbeziehen", "include those affected", "inclure les personnes concernées", "coinvolgere le persone interessate"), wrong: [tx("nur eine Person entscheiden lassen", "let only one person decide", "laisser une seule personne décider", "far decidere una sola persona"), tx("niemanden informieren", "inform nobody", "n’informer personne", "non informare nessuno"), tx("die Regel geheim halten", "keep the rule secret", "garder la règle secrète", "tenere segreta la regola")] } },
  { thing: tx("Wenn jemand ausgeschlossen wird", "When someone is excluded", "Quand quelqu’un est exclu", "Quando qualcuno viene escluso"), fact: { label: tx("Hilfe holen und die Person einbeziehen", "get help and include the person", "chercher de l’aide et inclure la personne", "chiedere aiuto e includere la persona"), wrong: [tx("wegschauen", "look away", "détourner le regard", "guardare altrove"), tx("mitmachen", "join in", "participer", "partecipare"), tx("darüber lachen", "laugh about it", "en rire", "riderne")] } },
  { thing: tx("Bei einer unklaren Nachricht", "With an unclear message", "Avec un message peu clair", "Con un messaggio poco chiaro"), fact: { label: tx("Quelle und Inhalt prüfen", "check source and content", "vérifier la source et le contenu", "verificare fonte e contenuto"), wrong: [tx("sofort weiterleiten", "forward immediately", "transmettre tout de suite", "inoltrare subito"), tx("eine Überschrift glauben", "believe one headline", "croire un titre", "credere a un titolo"), tx("Absender ignorieren", "ignore the sender", "ignorer l’auteur", "ignorare il mittente")] } },
  { thing: tx("Für Menschenrechte", "For human rights", "Pour les droits humains", "Per i diritti umani"), fact: { label: tx("gelten gleiche Grundrechte für alle", "the same basic rights apply to all", "les mêmes droits fondamentaux valent pour tous", "gli stessi diritti fondamentali valgono per tutti"), wrong: [tx("zählen nur Erwachsene", "only adults count", "seuls les adultes comptent", "contano solo gli adulti"), tx("gelten Rechte nur manchmal", "rights apply only sometimes", "les droits ne valent que parfois", "i diritti valgono solo a volte"), tx("entscheidet die Herkunft", "origin decides", "l’origine décide", "decide l’origine")] } },
  { thing: tx("Bei einem Kompromiss", "With a compromise", "Avec un compromis", "Con un compromesso"), fact: { label: tx("geben beide Seiten etwas nach", "both sides give a little", "les deux côtés font un pas", "entrambe le parti cedono un po’"), wrong: [tx("gewinnt immer nur eine Seite", "only one side always wins", "un seul côté gagne toujours", "vince sempre una sola parte"), tx("wird nicht gesprochen", "nobody talks", "personne ne parle", "nessuno parla"), tx("werden Regeln ignoriert", "rules are ignored", "les règles sont ignorées", "si ignorano le regole")] } },
  { thing: tx("In einer Gemeinschaft", "In a community", "Dans une communauté", "In una comunità"), fact: { label: tx("übernehmen Menschen Verantwortung", "people take responsibility", "les personnes prennent leurs responsabilités", "le persone si assumono responsabilità"), wrong: [tx("ist nur eine Person wichtig", "only one person matters", "une seule personne compte", "conta una sola persona"), tx("braucht es keine Regeln", "no rules are needed", "aucune règle n’est nécessaire", "non servono regole"), tx("werden Aufgaben versteckt", "tasks are hidden", "les tâches sont cachées", "i compiti vengono nascosti")] } },
  { thing: tx("Für Frieden", "For peace", "Pour la paix", "Per la pace"), fact: { label: tx("sind Dialog und faire Regeln wichtig", "dialogue and fair rules matter", "le dialogue et des règles justes comptent", "contano dialogo e regole eque"), wrong: [tx("helfen Drohungen am besten", "threats work best", "les menaces aident le mieux", "le minacce aiutano di più"), tx("soll niemand zuhören", "nobody should listen", "personne ne doit écouter", "nessuno dovrebbe ascoltare"), tx("sind Fakten unwichtig", "facts do not matter", "les faits sont inutiles", "i fatti non contano")] } },
];

const SPACE_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Tag und Nacht", "day and night", "le jour et la nuit", "il giorno e la notte"), fact: { label: tx("entstehen durch die Drehung der Erde", "are caused by Earth’s rotation", "sont causés par la rotation de la Terre", "sono causati dalla rotazione terrestre"), wrong: [tx("entstehen durch Wolken", "are caused by clouds", "sont causés par les nuages", "sono causati dalle nuvole"), tx("werden vom Mond eingeschaltet", "are switched on by the Moon", "sont allumés par la Lune", "sono accesi dalla Luna"), tx("wechseln jede Woche", "change every week", "changent chaque semaine", "cambiano ogni settimana")] } },
  { thing: tx("Ein Jahr", "a year", "une année", "un anno"), fact: { label: tx("entspricht ungefähr einem Umlauf der Erde um die Sonne", "is about one orbit of Earth around the Sun", "correspond environ à un tour de la Terre autour du Soleil", "corrisponde circa a un’orbita della Terra attorno al Sole"), wrong: [tx("dauert einen Tag", "lasts one day", "dure un jour", "dura un giorno"), tx("entsteht durch Wolken", "is caused by clouds", "est causée par les nuages", "è causato dalle nuvole"), tx("entspricht einer Mondphase", "is one Moon phase", "correspond à une phase lunaire", "corrisponde a una fase lunare")] } },
  { thing: tx("Der Mond", "the Moon", "la Lune", "la Luna"), fact: { label: tx("reflektiert Licht der Sonne", "reflects light from the Sun", "réfléchit la lumière du Soleil", "riflette la luce del Sole"), wrong: [tx("erzeugt sein Licht selbst", "makes its own light", "produit sa propre lumière", "produce luce propria"), tx("ist grösser als die Sonne", "is larger than the Sun", "est plus grande que le Soleil", "è più grande del Sole"), tx("besteht aus Wolken", "is made of clouds", "est faite de nuages", "è fatta di nuvole")] } },
  { thing: tx("Die Sonne", "the Sun", "le Soleil", "il Sole"), fact: { label: tx("ist ein Stern", "is a star", "est une étoile", "è una stella"), wrong: [tx("ist ein Planet", "is a planet", "est une planète", "è un pianeta"), tx("ist ein Mond", "is a moon", "est une lune", "è una luna"), tx("ist eine Wolke", "is a cloud", "est un nuage", "è una nuvola")] } },
  { thing: tx("Das Sonnensystem", "the Solar System", "le Système solaire", "il Sistema solare"), fact: { label: tx("umfasst die Sonne und ihre Himmelskörper", "includes the Sun and its celestial bodies", "comprend le Soleil et ses corps célestes", "comprende il Sole e i suoi corpi celesti"), wrong: [tx("besteht nur aus der Erde", "contains only Earth", "ne contient que la Terre", "contiene solo la Terra"), tx("liegt in einem Ozean", "lies in an ocean", "se trouve dans un océan", "si trova in un oceano"), tx("hat keine Planeten", "has no planets", "n’a pas de planètes", "non ha pianeti")] } },
  { thing: tx("Planeten", "planets", "les planètes", "i pianeti"), fact: { label: tx("umkreisen die Sonne", "orbit the Sun", "tournent autour du Soleil", "orbitano attorno al Sole"), wrong: [tx("stehen immer still", "always stand still", "restent toujours immobiles", "stanno sempre fermi"), tx("erzeugen Sonnenlicht", "make sunlight", "produisent la lumière solaire", "producono luce solare"), tx("umkreisen Wolken", "orbit clouds", "tournent autour des nuages", "orbitano attorno alle nuvole")] } },
  { thing: tx("Ein Teleskop", "a telescope", "un télescope", "un telescopio"), fact: { label: tx("hilft weit entfernte Himmelskörper zu beobachten", "helps observe distant celestial bodies", "aide à observer des corps célestes lointains", "aiuta a osservare corpi celesti lontani"), wrong: [tx("misst das Körpergewicht", "measures body weight", "mesure le poids du corps", "misura il peso corporeo"), tx("reinigt Wasser", "cleans water", "purifie l’eau", "pulisce l’acqua"), tx("erzeugt Sterne", "creates stars", "crée des étoiles", "crea stelle")] } },
  { thing: tx("Die Jahreszeiten", "the seasons", "les saisons", "le stagioni"), fact: { label: tx("hängen mit Erdumlauf und geneigter Erdachse zusammen", "are linked to Earth’s orbit and tilted axis", "dépendent de l’orbite et de l’axe incliné de la Terre", "dipendono dall’orbita e dall’asse inclinato terrestre"), wrong: [tx("entstehen durch Mondlicht", "are caused by moonlight", "sont causées par la lumière lunaire", "sono causate dalla luce lunare"), tx("werden von Uhren gesteuert", "are controlled by clocks", "sont contrôlées par les horloges", "sono controllate dagli orologi"), tx("wechseln jeden Tag", "change every day", "changent chaque jour", "cambiano ogni giorno")] } },
  { thing: tx("Mondphasen", "Moon phases", "les phases de la Lune", "le fasi lunari"), fact: { label: tx("zeigen unterschiedlich beleuchtete Teile des Mondes", "show differently lit parts of the Moon", "montrent des parties différemment éclairées de la Lune", "mostrano parti diversamente illuminate della Luna"), wrong: [tx("zeigen verschiedene Monde", "show different moons", "montrent plusieurs lunes", "mostrano lune diverse"), tx("entstehen durch Wetter", "are caused by weather", "sont causées par la météo", "sono causate dal tempo"), tx("ändern die Form des Mondes", "change the Moon’s shape", "changent la forme de la Lune", "cambiano la forma della Luna")] } },
  { thing: tx("Eine Raumsonde", "a space probe", "une sonde spatiale", "una sonda spaziale"), fact: { label: tx("sammelt Messdaten im All", "collects measurements in space", "recueille des mesures dans l’espace", "raccoglie dati nello spazio"), wrong: [tx("transportiert Schulklassen", "carries school classes", "transporte des classes", "trasporta classi scolastiche"), tx("erzeugt Planeten", "creates planets", "crée des planètes", "crea pianeti"), tx("steuert das Wetter", "controls weather", "contrôle la météo", "controlla il tempo")] } },
];

const SPACE_EXPLORATION_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Teleskop", "telescope", "télescope", "telescopio"), fact: { label: tx("sammelt Licht entfernter Himmelskörper", "collects light from distant celestial bodies", "recueille la lumière d’astres lointains", "raccoglie luce da corpi celesti lontani"), wrong: [tx("erzeugt Sterne", "creates stars", "crée des étoiles", "crea stelle"), tx("misst Körpergewicht", "measures body weight", "mesure le poids", "misura il peso"), tx("steuert das Wetter", "controls weather", "contrôle la météo", "controlla il tempo")] } },
  { thing: tx("Raumsonde", "space probe", "sonde spatiale", "sonda spaziale"), fact: { label: tx("fliegt unbemannt zu Forschungszielen", "travels unmanned to research targets", "voyage sans équipage vers des objectifs scientifiques", "viaggia senza equipaggio verso obiettivi scientifici"), wrong: [tx("transportiert Schulklassen", "carries school classes", "transporte des classes", "trasporta classi"), tx("erzeugt Planeten", "creates planets", "crée des planètes", "crea pianeti"), tx("bleibt immer am Boden", "always stays on the ground", "reste toujours au sol", "resta sempre a terra")] } },
  { thing: tx("Satellit", "satellite", "satellite", "satellite"), fact: { label: tx("umkreist einen Himmelskörper", "orbits a celestial body", "tourne autour d’un corps céleste", "orbita attorno a un corpo celeste"), wrong: [tx("ist immer ein Stern", "is always a star", "est toujours une étoile", "è sempre una stella"), tx("steht ohne Bewegung", "never moves", "reste immobile", "rimane immobile"), tx("erzeugt Sonnenlicht", "makes sunlight", "produit la lumière solaire", "produce luce solare")] } },
  { thing: tx("Raumstation", "space station", "station spatiale", "stazione spaziale"), fact: { label: tx("ist ein Arbeitsplatz für Menschen im Erdorbit", "is a workplace for people in Earth orbit", "est un lieu de travail humain en orbite terrestre", "è un luogo di lavoro umano in orbita terrestre"), wrong: [tx("liegt auf dem Meeresboden", "lies on the sea floor", "se trouve au fond de la mer", "si trova sul fondo marino"), tx("ist ein natürlicher Mond", "is a natural moon", "est une lune naturelle", "è una luna naturale"), tx("steuert die Jahreszeiten", "controls the seasons", "contrôle les saisons", "controlla le stagioni")] } },
  { thing: tx("Rakete", "rocket", "fusée", "razzo"), fact: { label: tx("liefert Schub für den Start ins All", "provides thrust for launch into space", "fournit la poussée pour partir dans l’espace", "fornisce spinta per partire nello spazio"), wrong: [tx("braucht keine Energie", "needs no energy", "n’a pas besoin d’énergie", "non ha bisogno di energia"), tx("erzeugt Schwerkraft", "creates gravity", "crée la gravité", "crea gravità"), tx("bleibt beim Start still", "stays still at launch", "reste immobile au départ", "resta ferma al lancio")] } },
  { thing: tx("Raumanzug", "space suit", "combinaison spatiale", "tuta spaziale"), fact: { label: tx("liefert Schutz und Atemluft", "provides protection and breathing air", "fournit protection et air respirable", "fornisce protezione e aria respirabile"), wrong: [tx("macht unsichtbar", "makes people invisible", "rend invisible", "rende invisibili"), tx("ersetzt ein Raumschiff", "replaces a spacecraft", "remplace un vaisseau", "sostituisce una navicella"), tx("erzeugt Sterne", "creates stars", "crée des étoiles", "crea stelle")] } },
  { thing: tx("Mars-Rover", "Mars rover", "rover martien", "rover marziano"), fact: { label: tx("fährt und misst auf der Marsoberfläche", "drives and measures on the surface of Mars", "roule et mesure sur la surface de Mars", "si muove e misura sulla superficie di Marte"), wrong: [tx("schwimmt im Ozean", "swims in the ocean", "nage dans l’océan", "nuota nell’oceano"), tx("erzeugt einen Mond", "creates a moon", "crée une lune", "crea una luna"), tx("transportiert viele Menschen", "carries many people", "transporte beaucoup de personnes", "trasporta molte persone")] } },
  { thing: tx("Weltraumkamera", "space camera", "caméra spatiale", "fotocamera spaziale"), fact: { label: tx("nimmt Bilder für die Forschung auf", "takes images for research", "prend des images pour la recherche", "scatta immagini per la ricerca"), wrong: [tx("verändert Planeten", "changes planets", "modifie les planètes", "cambia i pianeti"), tx("misst nur Geräusche", "measures only sounds", "mesure seulement les sons", "misura solo suoni"), tx("ersetzt jede Messung", "replaces every measurement", "remplace toute mesure", "sostituisce ogni misura")] } },
  { thing: tx("Funkantenne", "radio antenna", "antenne radio", "antenna radio"), fact: { label: tx("sendet und empfängt Signale", "sends and receives signals", "envoie et reçoit des signaux", "invia e riceve segnali"), wrong: [tx("erzeugt Sauerstoff", "creates oxygen", "produit de l’oxygène", "produce ossigeno"), tx("baut Raketen", "builds rockets", "construit des fusées", "costruisce razzi"), tx("misst Körpergrösse", "measures body height", "mesure la taille", "misura l’altezza")] } },
  { thing: tx("Messdaten", "measurement data", "données de mesure", "dati di misurazione"), fact: { label: tx("helfen Vermutungen zu prüfen", "help test ideas", "aident à vérifier des hypothèses", "aiutano a verificare ipotesi"), wrong: [tx("machen Beobachtungen unnötig", "make observations unnecessary", "rendent les observations inutiles", "rendono inutili le osservazioni"), tx("sind immer Meinungen", "are always opinions", "sont toujours des opinions", "sono sempre opinioni"), tx("dürfen nicht verglichen werden", "must not be compared", "ne doivent pas être comparées", "non devono essere confrontati")] } },
];

const GLOBAL_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Eine Lieferkette", "a supply chain", "une chaîne d’approvisionnement", "una catena di fornitura"), fact: { label: tx("zeigt Stationen vom Rohstoff bis zum Produkt", "shows stages from raw material to product", "montre les étapes de la matière au produit", "mostra le tappe dalla materia al prodotto"), wrong: [tx("zeigt nur den Preis", "shows only the price", "montre seulement le prix", "mostra solo il prezzo"), tx("besteht immer aus einem Ort", "always has one place", "se trouve toujours en un seul lieu", "si trova sempre in un solo luogo"), tx("braucht keinen Transport", "needs no transport", "n’a besoin d’aucun transport", "non richiede trasporto")] } },
  { thing: tx("Fairer Handel", "fair trade", "commerce équitable", "commercio equo"), fact: { label: tx("achtet auf faire Bedingungen für Produzierende", "supports fair conditions for producers", "favorise des conditions justes pour les producteurs", "favorisce condizioni eque per i produttori"), wrong: [tx("verbietet jeden Handel", "bans all trade", "interdit tout commerce", "vieta ogni commercio"), tx("ignoriert Arbeitsbedingungen", "ignores working conditions", "ignore les conditions de travail", "ignora le condizioni di lavoro"), tx("betrifft nur Verpackungen", "concerns only packaging", "concerne seulement les emballages", "riguarda solo gli imballaggi")] } },
  { thing: tx("Das Internet", "the internet", "internet", "internet"), fact: { label: tx("verbindet Informationen und Menschen weltweit", "connects information and people worldwide", "relie informations et personnes dans le monde", "collega informazioni e persone nel mondo"), wrong: [tx("ersetzt alle Sprachen", "replaces all languages", "remplace toutes les langues", "sostituisce tutte le lingue"), tx("macht Quellenprüfung unnötig", "makes source checking unnecessary", "rend inutile la vérification des sources", "rende inutile verificare le fonti"), tx("funktioniert ohne Geräte", "works without devices", "fonctionne sans appareils", "funziona senza dispositivi")] } },
  { thing: tx("Kultureller Austausch", "cultural exchange", "échange culturel", "scambio culturale"), fact: { label: tx("lässt Menschen voneinander lernen", "lets people learn from one another", "permet aux personnes d’apprendre les unes des autres", "permette alle persone di imparare tra loro"), wrong: [tx("macht alle Kulturen gleich", "makes all cultures identical", "rend toutes les cultures identiques", "rende tutte le culture identiche"), tx("verhindert Begegnungen", "prevents meetings", "empêche les rencontres", "impedisce incontri"), tx("betrifft nur Geld", "concerns only money", "concerne seulement l’argent", "riguarda solo il denaro")] } },
  { thing: tx("Sprachen", "languages", "langues", "lingue"), fact: { label: tx("helfen bei Verständigung und Zugehörigkeit", "help communication and belonging", "aident à communiquer et à appartenir", "aiutano comunicazione e appartenenza"), wrong: [tx("sind überall gleich", "are the same everywhere", "sont identiques partout", "sono uguali ovunque"), tx("verändern sich nie", "never change", "ne changent jamais", "non cambiano mai"), tx("bestehen nur aus Schrift", "contain only writing", "ne contiennent que l’écrit", "contengono solo scrittura")] } },
  { thing: tx("Klimaschutz", "climate protection", "protection du climat", "protezione del clima"), fact: { label: tx("braucht Zusammenarbeit über Grenzen hinweg", "needs cooperation across borders", "demande une coopération au-delà des frontières", "richiede cooperazione oltre i confini"), wrong: [tx("betrifft nur ein Dorf", "concerns only one village", "concerne un seul village", "riguarda un solo villaggio"), tx("braucht keine Daten", "needs no data", "n’a besoin d’aucune donnée", "non richiede dati"), tx("hat nichts mit Energie zu tun", "has nothing to do with energy", "n’a rien à voir avec l’énergie", "non riguarda l’energia")] } },
  { thing: tx("Humanitäre Hilfe", "humanitarian aid", "aide humanitaire", "aiuto umanitario"), fact: { label: tx("unterstützt Menschen in Notlagen", "supports people in emergencies", "soutient les personnes en détresse", "sostiene persone in emergenza"), wrong: [tx("ist ein Sportwettkampf", "is a sports contest", "est une compétition sportive", "è una gara sportiva"), tx("betrifft nur Handel", "concerns only trade", "concerne seulement le commerce", "riguarda solo il commercio"), tx("verhindert jede Zusammenarbeit", "prevents all cooperation", "empêche toute coopération", "impedisce ogni cooperazione")] } },
  { thing: tx("Migration", "migration", "migration", "migrazione"), fact: { label: tx("kann viele freiwillige oder erzwungene Gründe haben", "can have many voluntary or forced reasons", "peut avoir de nombreuses raisons volontaires ou forcées", "può avere molte ragioni volontarie o forzate"), wrong: [tx("hat immer nur einen Grund", "always has one reason", "a toujours une seule raison", "ha sempre una sola ragione"), tx("betrifft nie Familien", "never concerns families", "ne concerne jamais les familles", "non riguarda mai famiglie"), tx("findet nur im Urlaub statt", "happens only on holiday", "a lieu seulement en vacances", "avviene solo in vacanza")] } },
  { thing: tx("Internationale Zusammenarbeit", "international cooperation", "coopération internationale", "cooperazione internazionale"), fact: { label: tx("hilft gemeinsame Probleme zu lösen", "helps solve shared problems", "aide à résoudre des problèmes communs", "aiuta a risolvere problemi comuni"), wrong: [tx("verbietet Gespräche", "bans discussion", "interdit les discussions", "vieta discussioni"), tx("macht Regeln unnötig", "makes rules unnecessary", "rend les règles inutiles", "rende inutili le regole"), tx("betrifft nur Sport", "concerns only sport", "concerne seulement le sport", "riguarda solo lo sport")] } },
  { thing: tx("Bewusster Konsum", "mindful consumption", "consommation responsable", "consumo consapevole"), fact: { label: tx("beachtet Herkunft, Nutzung und Entsorgung", "considers origin, use and disposal", "tient compte de l’origine, de l’usage et de l’élimination", "considera origine, uso e smaltimento"), wrong: [tx("achtet nur auf Werbung", "looks only at advertising", "ne regarde que la publicité", "considera solo la pubblicità"), tx("erzeugt absichtlich Abfall", "deliberately creates waste", "crée volontairement des déchets", "crea volontariamente rifiuti"), tx("vermeidet jede Reparatur", "avoids every repair", "évite toute réparation", "evita ogni riparazione")] } },
];

const GERMAN_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  { thing: tx("Eine Meinung", "an opinion", "une opinion", "un’opinione"), fact: { label: tx("zeigt, was jemand denkt", "zeigt, was jemand denkt", "zeigt, was jemand denkt", "zeigt, was jemand denkt"), wrong: [tx("ist immer eine Zahl", "ist immer eine Zahl", "ist immer eine Zahl", "ist immer eine Zahl"), tx("braucht kein Thema", "braucht kein Thema", "braucht kein Thema", "braucht kein Thema"), tx("ist automatisch ein Beweis", "ist automatisch ein Beweis", "ist automatisch ein Beweis", "ist automatisch ein Beweis")] } },
  { thing: tx("Eine Begründung", "a reason", "une justification", "una motivazione"), fact: { label: tx("erklärt, warum man etwas meint", "erklärt, warum man etwas meint", "erklärt, warum man etwas meint", "erklärt, warum man etwas meint"), wrong: [tx("nennt nur ein Thema", "nennt nur ein Thema", "nennt nur ein Thema", "nennt nur ein Thema"), tx("besteht nur aus einem Ausrufezeichen", "besteht nur aus einem Ausrufezeichen", "besteht nur aus einem Ausrufezeichen", "besteht nur aus einem Ausrufezeichen"), tx("ersetzt jedes Beispiel", "ersetzt jedes Beispiel", "ersetzt jedes Beispiel", "ersetzt jedes Beispiel")] } },
  { thing: tx("Ein Beispiel", "an example", "un exemple", "un esempio"), fact: { label: tx("macht eine Aussage anschaulich", "macht eine Aussage anschaulich", "macht eine Aussage anschaulich", "macht eine Aussage anschaulich"), wrong: [tx("versteckt das Thema", "versteckt das Thema", "versteckt das Thema", "versteckt das Thema"), tx("ist immer eine Überschrift", "ist immer eine Überschrift", "ist immer eine Überschrift", "ist immer eine Überschrift"), tx("braucht keinen Zusammenhang", "braucht keinen Zusammenhang", "braucht keinen Zusammenhang", "braucht keinen Zusammenhang")] } },
  { thing: tx("Eine Geschichte", "a story", "une histoire", "una storia"), fact: { label: tx("hat Figuren und eine Handlung", "hat Figuren und eine Handlung", "hat Figuren und eine Handlung", "hat Figuren und eine Handlung"), wrong: [tx("besteht nur aus Zahlen", "besteht nur aus Zahlen", "besteht nur aus Zahlen", "besteht nur aus Zahlen"), tx("hat nie einen Ort", "hat nie einen Ort", "hat nie einen Ort", "hat nie einen Ort"), tx("braucht keine Reihenfolge", "braucht keine Reihenfolge", "braucht keine Reihenfolge", "braucht keine Reihenfolge")] } },
  { thing: tx("Eine Überschrift", "a title", "un titre", "un titolo"), fact: { label: tx("kündigt das Thema eines Textes an", "kündigt das Thema eines Textes an", "kündigt das Thema eines Textes an", "kündigt das Thema eines Textes an"), wrong: [tx("steht immer am Textende", "steht immer am Textende", "steht immer am Textende", "steht immer am Textende"), tx("ist ein Satzzeichen", "ist ein Satzzeichen", "ist ein Satzzeichen", "ist ein Satzzeichen"), tx("nennt jede Einzelheit", "nennt jede Einzelheit", "nennt jede Einzelheit", "nennt jede Einzelheit")] } },
  { thing: tx("Direkte Rede", "direct speech", "le discours direct", "il discorso diretto"), fact: { label: tx("gibt gesprochene Worte wieder", "gibt gesprochene Worte wieder", "gibt gesprochene Worte wieder", "gibt gesprochene Worte wieder"), wrong: [tx("enthält nie Satzzeichen", "enthält nie Satzzeichen", "enthält nie Satzzeichen", "enthält nie Satzzeichen"), tx("besteht nur aus Titeln", "besteht nur aus Titeln", "besteht nur aus Titeln", "besteht nur aus Titeln"), tx("vermeidet jedes Verb", "vermeidet jedes Verb", "vermeidet jedes Verb", "vermeidet jedes Verb")] } },
  { thing: tx("Ein Reim", "a rhyme", "une rime", "una rima"), fact: { label: tx("verbindet ähnlich klingende Wortenden", "verbindet ähnlich klingende Wortenden", "verbindet ähnlich klingende Wortenden", "verbindet ähnlich klingende Wortenden"), wrong: [tx("ist eine Zeitform", "ist eine Zeitform", "ist eine Zeitform", "ist eine Zeitform"), tx("trennt jedes Wort", "trennt jedes Wort", "trennt jedes Wort", "trennt jedes Wort"), tx("ist eine Zahl", "ist eine Zahl", "ist eine Zahl", "ist eine Zahl")] } },
  { thing: tx("Ein Fremdwort", "a loanword", "un mot étranger", "una parola straniera"), fact: { label: tx("stammt ursprünglich aus einer anderen Sprache", "stammt ursprünglich aus einer anderen Sprache", "stammt ursprünglich aus einer anderen Sprache", "stammt ursprünglich aus einer anderen Sprache"), wrong: [tx("ist immer falsch", "ist immer falsch", "ist immer falsch", "ist immer falsch"), tx("hat nie eine Bedeutung", "hat nie eine Bedeutung", "hat nie eine Bedeutung", "hat nie eine Bedeutung"), tx("besteht nur aus einem Buchstaben", "besteht nur aus einem Buchstaben", "besteht nur aus einem Buchstaben", "besteht nur aus einem Buchstaben")] } },
  { thing: tx("Ein Dialekt", "a dialect", "un dialecte", "un dialetto"), fact: { label: tx("ist eine regionale Sprachform", "ist eine regionale Sprachform", "ist eine regionale Sprachform", "ist eine regionale Sprachform"), wrong: [tx("ist eine Rechenart", "ist eine Rechenart", "ist eine Rechenart", "ist eine Rechenart"), tx("wird nur geschrieben", "wird nur geschrieben", "wird nur geschrieben", "wird nur geschrieben"), tx("hat keine Wörter", "hat keine Wörter", "hat keine Wörter", "hat keine Wörter")] } },
  { thing: tx("Korrekturlesen", "proofreading", "la relecture", "la rilettura"), fact: { label: tx("hilft Fehler im Text zu finden", "hilft Fehler im Text zu finden", "hilft Fehler im Text zu finden", "hilft Fehler im Text zu finden"), wrong: [tx("löscht den ganzen Text", "löscht den ganzen Text", "löscht den ganzen Text", "löscht den ganzen Text"), tx("ersetzt das Schreiben", "ersetzt das Schreiben", "ersetzt das Schreiben", "ersetzt das Schreiben"), tx("macht Satzzeichen unnötig", "macht Satzzeichen unnötig", "macht Satzzeichen unnötig", "macht Satzzeichen unnötig")] } },
];

const ARGUMENT_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  GERMAN_FACTS[0], GERMAN_FACTS[1], GERMAN_FACTS[2],
  { thing: tx("Eine Quelle", "a source", "une source", "una fonte"), fact: { label: tx("macht Informationen überprüfbar", "macht Informationen überprüfbar", "macht Informationen überprüfbar", "macht Informationen überprüfbar"), wrong: [tx("ersetzt jedes Argument", "ersetzt jedes Argument", "ersetzt jedes Argument", "ersetzt jedes Argument"), tx("ist immer eine Meinung", "ist immer eine Meinung", "ist immer eine Meinung", "ist immer eine Meinung"), tx("braucht keinen Autor", "braucht keinen Autor", "braucht keinen Autor", "braucht keinen Autor")] } },
  { thing: tx("Ein Gegenargument", "a counterargument", "un contre-argument", "un controargomento"), fact: { label: tx("zeigt eine andere begründete Sicht", "zeigt eine andere begründete Sicht", "zeigt eine andere begründete Sicht", "zeigt eine andere begründete Sicht"), wrong: [tx("wiederholt nur die Überschrift", "wiederholt nur die Überschrift", "wiederholt nur die Überschrift", "wiederholt nur die Überschrift"), tx("ist immer beleidigend", "ist immer beleidigend", "ist immer beleidigend", "ist immer beleidigend"), tx("enthält nie einen Grund", "enthält nie einen Grund", "enthält nie einen Grund", "enthält nie einen Grund")] } },
  { thing: tx("Ein Kompromiss", "a compromise", "un compromis", "un compromesso"), fact: { label: tx("berücksichtigt beide Seiten", "berücksichtigt beide Seiten", "berücksichtigt beide Seiten", "berücksichtigt beide Seiten"), wrong: [tx("lässt nur eine Seite gewinnen", "lässt nur eine Seite gewinnen", "lässt nur eine Seite gewinnen", "lässt nur eine Seite gewinnen"), tx("vermeidet jedes Gespräch", "vermeidet jedes Gespräch", "vermeidet jedes Gespräch", "vermeidet jedes Gespräch"), tx("ignoriert alle Gründe", "ignoriert alle Gründe", "ignoriert alle Gründe", "ignoriert alle Gründe")] } },
  { thing: tx("Eine faire Diskussion", "a fair discussion", "une discussion équitable", "una discussione equa"), fact: { label: tx("hört andere Meinungen respektvoll an", "hört andere Meinungen respektvoll an", "hört andere Meinungen respektvoll an", "hört andere Meinungen respektvoll an"), wrong: [tx("unterbricht absichtlich", "unterbricht absichtlich", "unterbricht absichtlich", "unterbricht absichtlich"), tx("erfindet Belege", "erfindet Belege", "erfindet Belege", "erfindet Belege"), tx("verbietet Rückfragen", "verbietet Rückfragen", "verbietet Rückfragen", "verbietet Rückfragen")] } },
  { thing: tx("Ein Fazit", "a conclusion", "une conclusion", "una conclusione"), fact: { label: tx("fasst die wichtigsten Gedanken zusammen", "fasst die wichtigsten Gedanken zusammen", "fasst die wichtigsten Gedanken zusammen", "fasst die wichtigsten Gedanken zusammen"), wrong: [tx("beginnt ein neues Thema", "beginnt ein neues Thema", "beginnt ein neues Thema", "beginnt ein neues Thema"), tx("besteht nur aus einer Frage", "besteht nur aus einer Frage", "besteht nur aus einer Frage", "besteht nur aus einer Frage"), tx("nennt keine Position", "nennt keine Position", "nennt keine Position", "nennt keine Position")] } },
  { thing: tx("Eine Tatsache", "a fact", "un fait", "un fatto"), fact: { label: tx("kann überprüft werden", "kann überprüft werden", "kann überprüft werden", "kann überprüft werden"), wrong: [tx("ist immer Geschmackssache", "ist immer Geschmackssache", "ist immer Geschmackssache", "ist immer Geschmackssache"), tx("braucht keine Prüfung", "braucht keine Prüfung", "braucht keine Prüfung", "braucht keine Prüfung"), tx("ist dasselbe wie ein Wunsch", "ist dasselbe wie ein Wunsch", "ist dasselbe wie ein Wunsch", "ist dasselbe wie ein Wunsch")] } },
  { thing: tx("Eine sinnvolle Reihenfolge", "a logical order", "un ordre logique", "un ordine logico"), fact: { label: tx("macht Argumente leichter verständlich", "macht Argumente leichter verständlich", "macht Argumente leichter verständlich", "macht Argumente leichter verständlich"), wrong: [tx("versteckt die Begründung", "versteckt die Begründung", "versteckt die Begründung", "versteckt die Begründung"), tx("macht Beispiele falsch", "macht Beispiele falsch", "macht Beispiele falsch", "macht Beispiele falsch"), tx("ersetzt das Korrekturlesen", "ersetzt das Korrekturlesen", "ersetzt das Korrekturlesen", "ersetzt das Korrekturlesen")] } },
];

const LANGUAGE_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  GERMAN_FACTS[7], GERMAN_FACTS[8],
  { thing: tx("Standardsprache", "standard language", "langue standard", "lingua standard"), fact: { label: tx("wird überregional verstanden", "wird überregional verstanden", "wird überregional verstanden", "wird überregional verstanden"), wrong: [tx("gibt es nur in einem Dorf", "gibt es nur in einem Dorf", "gibt es nur in einem Dorf", "gibt es nur in einem Dorf"), tx("hat keine Regeln", "hat keine Regeln", "hat keine Regeln", "hat keine Regeln"), tx("wird nie geschrieben", "wird nie geschrieben", "wird nie geschrieben", "wird nie geschrieben")] } },
  { thing: tx("Jugendsprache", "youth language", "langage des jeunes", "linguaggio giovanile"), fact: { label: tx("verändert sich oft und schafft neue Ausdrücke", "verändert sich oft und schafft neue Ausdrücke", "verändert sich oft und schafft neue Ausdrücke", "verändert sich oft und schafft neue Ausdrücke"), wrong: [tx("bleibt immer gleich", "bleibt immer gleich", "bleibt immer gleich", "bleibt immer gleich"), tx("besteht nur aus Zahlen", "besteht nur aus Zahlen", "besteht nur aus Zahlen", "besteht nur aus Zahlen"), tx("darf keine neuen Wörter haben", "darf keine neuen Wörter haben", "darf keine neuen Wörter haben", "darf keine neuen Wörter haben")] } },
  { thing: tx("Die Schweiz", "Switzerland", "la Suisse", "la Svizzera"), fact: { label: tx("hat vier Landessprachen", "hat vier Landessprachen", "hat vier Landessprachen", "hat vier Landessprachen"), wrong: [tx("hat nur eine Sprache", "hat nur eine Sprache", "hat nur eine Sprache", "hat nur eine Sprache"), tx("hat keine Dialekte", "hat keine Dialekte", "hat keine Dialekte", "hat keine Dialekte"), tx("verwendet kein Deutsch", "verwendet kein Deutsch", "verwendet kein Deutsch", "verwendet kein Deutsch")] } },
  { thing: tx("Das Wort «Velo»", "the word Velo", "le mot Velo", "la parola Velo"), fact: { label: tx("ist typisch für die Schweiz", "ist typisch für die Schweiz", "ist typisch für die Schweiz", "ist typisch für die Schweiz"), wrong: [tx("ist eine Rechenformel", "ist eine Rechenformel", "ist eine Rechenformel", "ist eine Rechenformel"), tx("bedeutet Auto", "bedeutet Auto", "bedeutet Auto", "bedeutet Auto"), tx("hat keine Bedeutung", "hat keine Bedeutung", "hat keine Bedeutung", "hat keine Bedeutung")] } },
  { thing: tx("Eine Abkürzung", "an abbreviation", "une abréviation", "un’abbreviazione"), fact: { label: tx("verkürzt ein längeres Wort oder eine Wortgruppe", "verkürzt ein längeres Wort oder eine Wortgruppe", "verkürzt ein längeres Wort oder eine Wortgruppe", "verkürzt ein längeres Wort oder eine Wortgruppe"), wrong: [tx("verlängert jedes Wort", "verlängert jedes Wort", "verlängert jedes Wort", "verlängert jedes Wort"), tx("ist immer ein Satz", "ist immer ein Satz", "ist immer ein Satz", "ist immer ein Satz"), tx("ändert jede Bedeutung", "ändert jede Bedeutung", "ändert jede Bedeutung", "ändert jede Bedeutung")] } },
  { thing: tx("Wortbedeutungen", "word meanings", "sens des mots", "significati delle parole"), fact: { label: tx("können sich mit der Zeit verändern", "können sich mit der Zeit verändern", "können sich mit der Zeit verändern", "können sich mit der Zeit verändern"), wrong: [tx("bleiben zwingend immer gleich", "bleiben zwingend immer gleich", "bleiben zwingend immer gleich", "bleiben zwingend immer gleich"), tx("haben nichts mit Sprache zu tun", "haben nichts mit Sprache zu tun", "haben nichts mit Sprache zu tun", "haben nichts mit Sprache zu tun"), tx("werden nur durch Zahlen bestimmt", "werden nur durch Zahlen bestimmt", "werden nur durch Zahlen bestimmt", "werden nur durch Zahlen bestimmt")] } },
  { thing: tx("Mehrsprachigkeit", "multilingualism", "multilinguisme", "multilinguismo"), fact: { label: tx("bedeutet mehrere Sprachen zu verwenden", "bedeutet mehrere Sprachen zu verwenden", "bedeutet mehrere Sprachen zu verwenden", "bedeutet mehrere Sprachen zu verwenden"), wrong: [tx("verbietet Dialekte", "verbietet Dialekte", "verbietet Dialekte", "verbietet Dialekte"), tx("bedeutet ohne Sprache", "bedeutet ohne Sprache", "bedeutet ohne Sprache", "bedeutet ohne Sprache"), tx("betrifft nur Schrift", "betrifft nur Schrift", "betrifft nur Schrift", "betrifft nur Schrift")] } },
  { thing: tx("Ein Wörterbuch", "a dictionary", "un dictionnaire", "un dizionario"), fact: { label: tx("erklärt Wörter und Schreibweisen", "erklärt Wörter und Schreibweisen", "erklärt Wörter und Schreibweisen", "erklärt Wörter und Schreibweisen"), wrong: [tx("enthält nur Bilder", "enthält nur Bilder", "enthält nur Bilder", "enthält nur Bilder"), tx("ersetzt jedes Gespräch", "ersetzt jedes Gespräch", "ersetzt jedes Gespräch", "ersetzt jedes Gespräch"), tx("zeigt nur Zahlen", "zeigt nur Zahlen", "zeigt nur Zahlen", "zeigt nur Zahlen")] } },
];

const LITERATURE_FACTS: Array<{ thing: Texts; fact: Choice }> = [
  GERMAN_FACTS[3], GERMAN_FACTS[4], GERMAN_FACTS[6],
  { thing: tx("Eine Figur", "a character", "un personnage", "un personaggio"), fact: { label: tx("handelt in einer Geschichte", "handelt in einer Geschichte", "handelt in einer Geschichte", "handelt in einer Geschichte"), wrong: [tx("ist immer die Überschrift", "ist immer die Überschrift", "ist immer die Überschrift", "ist immer die Überschrift"), tx("besteht nur aus Zahlen", "besteht nur aus Zahlen", "besteht nur aus Zahlen", "besteht nur aus Zahlen"), tx("hat nie Eigenschaften", "hat nie Eigenschaften", "hat nie Eigenschaften", "hat nie Eigenschaften")] } },
  { thing: tx("Die Handlung", "the plot", "l’action", "la trama"), fact: { label: tx("beschreibt, was in einer Geschichte geschieht", "beschreibt, was in einer Geschichte geschieht", "beschreibt, was in einer Geschichte geschieht", "beschreibt, was in einer Geschichte geschieht"), wrong: [tx("nennt nur den Autor", "nennt nur den Autor", "nennt nur den Autor", "nennt nur den Autor"), tx("ist ein Satzzeichen", "ist ein Satzzeichen", "ist ein Satzzeichen", "ist ein Satzzeichen"), tx("steht nur auf dem Umschlag", "steht nur auf dem Umschlag", "steht nur auf dem Umschlag", "steht nur auf dem Umschlag")] } },
  { thing: tx("Der Schauplatz", "the setting", "le lieu", "l’ambientazione"), fact: { label: tx("ist der Ort der Geschichte", "ist der Ort der Geschichte", "ist der Ort der Geschichte", "ist der Ort der Geschichte"), wrong: [tx("ist immer eine Figur", "ist immer eine Figur", "ist immer eine Figur", "ist immer eine Figur"), tx("ist ein Reim", "ist ein Reim", "ist ein Reim", "ist ein Reim"), tx("zeigt nur die Zeit", "zeigt nur die Zeit", "zeigt nur die Zeit", "zeigt nur die Zeit")] } },
  { thing: tx("Eine Erzählstimme", "a narrator", "une voix narrative", "una voce narrante"), fact: { label: tx("erzählt die Geschichte", "erzählt die Geschichte", "erzählt die Geschichte", "erzählt die Geschichte"), wrong: [tx("druckt das Buch", "druckt das Buch", "druckt das Buch", "druckt das Buch"), tx("ist immer die Hauptfigur", "ist immer die Hauptfigur", "ist immer die Hauptfigur", "ist immer die Hauptfigur"), tx("ersetzt die Handlung", "ersetzt die Handlung", "ersetzt die Handlung", "ersetzt die Handlung")] } },
  { thing: tx("Eine Strophe", "a stanza", "une strophe", "una strofa"), fact: { label: tx("ist ein Abschnitt eines Gedichts", "ist ein Abschnitt eines Gedichts", "ist ein Abschnitt eines Gedichts", "ist ein Abschnitt eines Gedichts"), wrong: [tx("ist eine Romanfigur", "ist eine Romanfigur", "ist eine Romanfigur", "ist eine Romanfigur"), tx("ist ein Satzzeichen", "ist ein Satzzeichen", "ist ein Satzzeichen", "ist ein Satzzeichen"), tx("ist immer die Überschrift", "ist immer die Überschrift", "ist immer die Überschrift", "ist immer die Überschrift")] } },
  { thing: tx("Eine einfache Metapher", "a simple metaphor", "une métaphore simple", "una metafora semplice"), fact: { label: tx("verwendet ein sprachliches Bild", "verwendet ein sprachliches Bild", "verwendet ein sprachliches Bild", "verwendet ein sprachliches Bild"), wrong: [tx("ist nur eine Rechnung", "ist nur eine Rechnung", "ist nur eine Rechnung", "ist nur eine Rechnung"), tx("muss wörtlich stimmen", "muss wörtlich stimmen", "muss wörtlich stimmen", "muss wörtlich stimmen"), tx("besteht nur aus Namen", "besteht nur aus Namen", "besteht nur aus Namen", "besteht nur aus Namen")] } },
  { thing: tx("Das Ende", "the ending", "la fin", "il finale"), fact: { label: tx("schliesst die Handlung ab", "schliesst die Handlung ab", "schliesst die Handlung ab", "schliesst die Handlung ab"), wrong: [tx("beginnt immer ein neues Buch", "beginnt immer ein neues Buch", "beginnt immer ein neues Buch", "beginnt immer ein neues Buch"), tx("nennt nur den Titel", "nennt nur den Titel", "nennt nur den Titel", "nennt nur den Titel"), tx("hat keinen Bezug zur Geschichte", "hat keinen Bezug zur Geschichte", "hat keinen Bezug zur Geschichte", "hat keinen Bezug zur Geschichte")] } },
];

function scienceGenerated(profile: "materials" | "body" | "senses" | "living" | "economy" | "global" | "geo" | "work" | "peace" | "space" | "space-exploration" | "german" | "argument" | "language" | "literature", ordinal: number): Generated {
  const facts = profile === "materials"
    ? MATERIALS.map((fact, index) => ({ thing: MATERIAL_OBJECTS[index], fact }))
    : profile === "body" ? BODY_FACTS
      : profile === "senses" ? SENSE_FACTS
        : profile === "living" ? LIVING_FACTS
          : profile === "economy" ? ECONOMY_FACTS
            : profile === "global" ? GLOBAL_FACTS
              : profile === "geo" ? GEO_FACTS
      : profile === "work" ? WORK_FACTS
        : profile === "space" ? SPACE_FACTS
          : profile === "space-exploration" ? SPACE_EXPLORATION_FACTS
            : profile === "german" ? GERMAN_FACTS
            : profile === "argument" ? ARGUMENT_FACTS
              : profile === "language" ? LANGUAGE_FACTS
                : profile === "literature" ? LITERATURE_FACTS
            : PEACE_FACTS;
  const entry = facts[ordinal % facts.length];
  const mode = Math.floor(ordinal / facts.length) % 5;
  const cycle = Math.floor(ordinal / (facts.length * 5));
  const prompts = [
    tx(`${entry.thing.de}: Welche Aussage passt?`, `${entry.thing.en}: which statement matches?`, `${entry.thing.fr} : quelle affirmation convient ?`, `${entry.thing.it}: quale affermazione è adatta?`),
    tx(`${entry.thing.de}: Was trifft zu?`, `${entry.thing.en}: what is true?`, `${entry.thing.fr} : qu’est-ce qui est vrai ?`, `${entry.thing.it}: che cosa è corretto?`),
    tx(`${entry.thing.de}: Ergänze die passende Eigenschaft oder Wirkung: ___`, `${entry.thing.en}: complete the matching property or effect: ___`, `${entry.thing.fr} : complète avec la propriété ou l’effet : ___`, `${entry.thing.it}: completa con la proprietà o l’effetto: ___`),
    tx(`${entry.thing.de}: Welche Beschreibung ist richtig?`, `${entry.thing.en}: which description is correct?`, `${entry.thing.fr} : quelle description est correcte ?`, `${entry.thing.it}: quale descrizione è corretta?`),
    tx(`Lerncheck ${ordinal + 1}: ${entry.thing.de} – welche Aussage stimmt?`, `Learning check ${ordinal + 1}: ${entry.thing.en} – which statement is correct?`, `Défi ${ordinal + 1} : ${entry.thing.fr} – quelle affirmation est correcte ?`, `Verifica ${ordinal + 1}: ${entry.thing.it} – quale affermazione è corretta?`),
  ];
  const question = cycle === 0 ? prompts[mode] : {
    de: `Praxisrunde: ${prompts[mode].de}`,
    en: `Practice round: ${prompts[mode].en}`,
    fr: `Mise en pratique : ${prompts[mode].fr}`,
    it: `Esercizio pratico: ${prompts[mode].it}`,
  };
  return {
    question,
    answer: entry.fact.label,
    choices: entry.fact,
    hint: profile === "german"
      ? tx("Überlege, welche Bedeutung der Begriff im Text hat.", "Think about what the German term means in a text.", "Réfléchis au sens du terme allemand dans un texte.", "Pensa al significato del termine tedesco in un testo.")
      : profile === "peace"
        ? tx("Vergleiche, welche Handlung fair und respektvoll ist.", "Compare which action is fair and respectful.", "Compare l’action qui est juste et respectueuse.", "Confronta quale azione è equa e rispettosa.")
        : profile === "work"
          ? tx("Denke an die Wirkung der Erfindung oder Veränderung.", "Think about the effect of the invention or change.", "Pense à l’effet de l’invention ou du changement.", "Pensa all’effetto dell’invenzione o del cambiamento.")
          : profile === "economy"
            ? tx("Denke an Kaufen, Verkaufen, Planen und Sparen im Alltag.", "Think about buying, selling, planning and saving in everyday life.", "Pense à acheter, vendre, planifier et économiser au quotidien.", "Pensa a comprare, vendere, pianificare e risparmiare nella vita quotidiana.")
            : profile === "global"
              ? tx("Denke an Verbindungen und Zusammenarbeit zwischen Ländern und Menschen.", "Think about links and cooperation between countries and people.", "Pense aux liens et à la coopération entre pays et personnes.", "Pensa ai legami e alla cooperazione tra paesi e persone.")
            : profile === "geo"
              ? tx("Nutze dein Wissen über Karten, Räume und Orientierung.", "Use what you know about maps, places and orientation.", "Utilise tes connaissances sur les cartes, les espaces et l’orientation.", "Usa ciò che sai su carte, spazi e orientamento.")
              : profile === "space" || profile === "space-exploration"
                ? tx("Denke an einfache Beobachtungen von Erde, Mond und Sonne.", "Think of simple observations of Earth, Moon and Sun.", "Pense à des observations simples de la Terre, de la Lune et du Soleil.", "Pensa a semplici osservazioni di Terra, Luna e Sole.")
                : profile === "living" || profile === "body" || profile === "senses"
                  ? tx("Denke an die Aufgabe oder das Merkmal des Lebewesens.", "Think about the function or feature of the living thing.", "Pense à la fonction ou au caractère de l’être vivant.", "Pensa alla funzione o alla caratteristica dell’essere vivente.")
                  : tx("Denke an eine beobachtbare Stoffeigenschaft.", "Think of an observable material property.", "Pense à une propriété observable de la matière.", "Pensa a una proprietà osservabile del materiale."),
  };
}

const EN_SUBJECTS = ["Mia", "Leo", "Sara", "Noah", "Emma", "Ben", "Lina", "Tom", "Nina", "Sam"];
const EN_VERBS = ["reads", "draws", "plays", "likes", "visits", "helps", "carries", "opens", "watches", "finds"];
const EN_INFINITIVES = ["to read", "to draw", "to play", "to like", "to visit", "to help", "to carry", "to open", "to watch", "to find"];
const EN_OBJECTS = ["a comic", "a map", "football", "apples", "the library", "a friend", "a blue bag", "the window", "a short film", "the key"];
const EN_PLANS = ["swim", "cook", "cycle", "read", "visit grandma", "play outside", "draw", "tidy the room", "walk the dog", "make a sandwich"];
const EN_REPLIES = ["Yes, please.", "No, thank you.", "At three o’clock.", "In the library.", "Because it is fun.", "I’m fine, thanks.", "It is ten francs.", "Turn left here.", "My name is Lina.", "I would like some water."];

function englishGenerated(profile: "everyday" | "plans" | "talk", ordinal: number): Generated {
  const i = ordinal % 10;
  const j = Math.floor(ordinal / 10) % 5;
  if (profile === "plans") {
    const day = ["Monday", "Tuesday", "Wednesday", "Saturday", "Sunday"][j];
    const answer = EN_PLANS[i];
    return {
      question: tx(`Use “to ${answer}”: On ${day}, ${EN_SUBJECTS[i]} is going to ___.`, `Use “to ${answer}”: On ${day}, ${EN_SUBJECTS[i]} is going to ___.`, `Use “to ${answer}”: On ${day}, ${EN_SUBJECTS[i]} is going to ___.`, `Use “to ${answer}”: On ${day}, ${EN_SUBJECTS[i]} is going to ___.`),
      answer: tx(answer, answer, answer, answer),
      choices: { label: tx(answer, answer, answer, answer), wrong: EN_PLANS.filter((_, x) => x !== i).slice(j, j + 3).map((x) => tx(x, x, x, x)) as [Texts, Texts, Texts] },
      hint: tx("Look for the activity that makes sense in the sentence.", "Look for the activity that makes sense in the sentence.", "Look for the activity that makes sense in the sentence.", "Look for the activity that makes sense in the sentence."),
    };
  }
  if (profile === "talk") {
    const starters = ["Would you like some juice?", "Do you need help?", "When does the lesson start?", "Where is the book?", "Why do you like music?", "How are you?", "How much is the game?", "How do I get to the park?", "What is your name?", "What would you like?"];
    const answer = EN_REPLIES[i];
    const wrong = EN_REPLIES.filter((_, x) => x !== i).slice(j, j + 3);
    const setting = ["At school", "At home", "At the shop", "On a trip", "With a friend"][j];
    const intents = ["Accept politely.", "Refuse politely.", "Give the time.", "Give the place.", "Give a reason.", "Say how you are.", "Give the price.", "Give the direction.", "Introduce yourself.", "Make a request."];
    return { question: tx(`${setting}: “${starters[i]}” ${intents[i]}`, `${setting}: “${starters[i]}” ${intents[i]}`, `${setting}: “${starters[i]}” ${intents[i]}`, `${setting}: “${starters[i]}” ${intents[i]}`), answer: tx(answer, answer, answer, answer), choices: { label: tx(answer, answer, answer, answer), wrong: wrong.map((x) => tx(x, x, x, x)) as [Texts, Texts, Texts] }, hint: tx("Use the instruction after the dialogue to choose one clear reply.", "Use the instruction after the dialogue to choose one clear reply.", "Use the instruction after the dialogue to choose one clear reply.", "Use the instruction after the dialogue to choose one clear reply.") };
  }
  const subject = EN_SUBJECTS[(i + j) % 10];
  const verb = EN_VERBS[i];
  const object = EN_OBJECTS[i];
  const wrong = EN_VERBS.filter((_, x) => x !== i).slice(j, j + 3);
  return { question: tx(`Use “${EN_INFINITIVES[i]}” and complete: ${subject} ___ ${object}.`, `Use “${EN_INFINITIVES[i]}” and complete: ${subject} ___ ${object}.`, `Use “${EN_INFINITIVES[i]}” and complete: ${subject} ___ ${object}.`, `Use “${EN_INFINITIVES[i]}” and complete: ${subject} ___ ${object}.`), answer: tx(verb, verb, verb, verb), choices: { label: tx(verb, verb, verb, verb), wrong: wrong.map((x) => tx(x, x, x, x)) as [Texts, Texts, Texts] }, hint: tx("The verb must match the person in the sentence.", "The verb must match the person in the sentence.", "The verb must match the person in the sentence.", "The verb must match the person in the sentence.") };
}

const FR_SUBJECTS = ["Lina", "Noah", "Mia", "Léo", "Sara", "Ben", "Emma", "Tom", "Nina", "Sam"];
const FR_VERBS = ["mange", "lit", "dessine", "aime", "visite", "écoute", "porte", "ouvre", "regarde", "cherche"];
const FR_INFINITIVES = ["manger", "lire", "dessiner", "aimer", "visiter", "écouter", "porter", "ouvrir", "regarder", "chercher"];
const FR_OBJECTS = ["une pomme", "un livre", "un chat", "la musique", "le musée", "la maîtresse", "un sac bleu", "la fenêtre", "un film court", "la clé"];
const FR_PLANS = ["nager", "cuisiner", "faire du vélo", "lire", "visiter mamie", "jouer dehors", "dessiner", "ranger la chambre", "promener le chien", "préparer un sandwich"];
const FR_REPLIES = ["Oui, volontiers.", "Non, merci.", "À trois heures.", "À la bibliothèque.", "Parce que c’est amusant.", "Ça va bien, merci.", "Il coûte dix francs.", "Tourne à gauche.", "Je m’appelle Lina.", "Je voudrais de l’eau."];

function frenchGenerated(profile: "day" | "school" | "plans" | "phrases", ordinal: number): Generated {
  const i = ordinal % 10;
  const j = Math.floor(ordinal / 10) % 5;
  if (profile === "plans") {
    const day = ["lundi", "mardi", "mercredi", "samedi", "dimanche"][j];
    const answer = FR_PLANS[i];
    return { question: tx(`Utilise « ${answer} » : ${day}, ${FR_SUBJECTS[i]} va ___.`, `Utilise « ${answer} » : ${day}, ${FR_SUBJECTS[i]} va ___.`, `Utilise « ${answer} » : ${day}, ${FR_SUBJECTS[i]} va ___.`, `Utilise « ${answer} » : ${day}, ${FR_SUBJECTS[i]} va ___.`), answer: tx(answer, answer, answer, answer), choices: { label: tx(answer, answer, answer, answer), wrong: FR_PLANS.filter((_, x) => x !== i).slice(j, j + 3).map((x) => tx(x, x, x, x)) as [Texts, Texts, Texts] }, hint: tx("Utilise l’activité indiquée avant la phrase.", "Utilise l’activité indiquée avant la phrase.", "Utilise l’activité indiquée avant la phrase.", "Utilise l’activité indiquée avant la phrase.") };
  }
  if (profile === "phrases") {
    const starters = ["Tu veux du jus ?", "Tu as besoin d’aide ?", "Quand commence la leçon ?", "Où est le livre ?", "Pourquoi aimes-tu la musique ?", "Comment ça va ?", "Combien coûte le jeu ?", "Comment aller au parc ?", "Comment t’appelles-tu ?", "Qu’est-ce que tu voudrais ?"];
    const answer = FR_REPLIES[i];
    const wrong = FR_REPLIES.filter((_, x) => x !== i).slice(j, j + 3);
    const setting = ["À l’école", "À la maison", "Au magasin", "En voyage", "Avec un ami"][j];
    const intents = ["Accepte poliment.", "Refuse poliment.", "Donne l’heure.", "Donne le lieu.", "Donne une raison.", "Dis comment tu vas.", "Donne le prix.", "Indique le chemin.", "Présente-toi.", "Fais une demande."];
    return { question: tx(`${setting} : « ${starters[i]} » ${intents[i]}`, `${setting} : « ${starters[i]} » ${intents[i]}`, `${setting} : « ${starters[i]} » ${intents[i]}`, `${setting} : « ${starters[i]} » ${intents[i]}`), answer: tx(answer, answer, answer, answer), choices: { label: tx(answer, answer, answer, answer), wrong: wrong.map((x) => tx(x, x, x, x)) as [Texts, Texts, Texts] }, hint: tx("Suis l’instruction après le dialogue pour choisir une réponse claire.", "Suis l’instruction après le dialogue pour choisir une réponse claire.", "Suis l’instruction après le dialogue pour choisir une réponse claire.", "Suis l’instruction après le dialogue pour choisir une réponse claire.") };
  }
  const subject = FR_SUBJECTS[(i + j) % 10];
  const verb = FR_VERBS[i];
  const object = FR_OBJECTS[i];
  const context = profile === "school" ? "À l’école, " : "Chaque jour, ";
  const wrong = FR_VERBS.filter((_, x) => x !== i).slice(j, j + 3);
  return { question: tx(`Conjugue « ${FR_INFINITIVES[i]} » : ${context}${subject} ___ ${object}.`, `Conjugue « ${FR_INFINITIVES[i]} » : ${context}${subject} ___ ${object}.`, `Conjugue « ${FR_INFINITIVES[i]} » : ${context}${subject} ___ ${object}.`, `Conjugue « ${FR_INFINITIVES[i]} » : ${context}${subject} ___ ${object}.`), answer: tx(verb, verb, verb, verb), choices: { label: tx(verb, verb, verb, verb), wrong: wrong.map((x) => tx(x, x, x, x)) as [Texts, Texts, Texts] }, hint: tx("Le verbe doit correspondre à la personne dans la phrase.", "Le verbe doit correspondre à la personne dans la phrase.", "Le verbe doit correspondre à la personne dans la phrase.", "Le verbe doit correspondre à la personne dans la phrase.") };
}

function simpleGenerated(subject: string, topic: string, ordinal: number): Generated {
  if (subject === "english" && topic === "exam-skills-6") {
    const rows: Generated[] = [
      { question: tx("Before answering, what should you do first?", "Before answering, what should you do first?", "Before answering, what should you do first?", "Before answering, what should you do first?"), answer: tx("Read the question carefully", "Read the question carefully", "Read the question carefully", "Read the question carefully"), choices: { label: tx("Read the question carefully", "Read the question carefully", "Read the question carefully", "Read the question carefully"), wrong: [tx("Guess immediately", "Guess immediately", "Guess immediately", "Guess immediately"), tx("Skip every instruction", "Skip every instruction", "Skip every instruction", "Skip every instruction"), tx("Choose the longest answer", "Choose the longest answer", "Choose the longest answer", "Choose the longest answer")] }, hint: tx("Good learning starts with understanding the task.", "Good learning starts with understanding the task.", "Good learning starts with understanding the task.", "Good learning starts with understanding the task.") },
      { question: tx("What can help you understand a new word?", "What can help you understand a new word?", "What can help you understand a new word?", "What can help you understand a new word?"), answer: tx("The words around it", "The words around it", "The words around it", "The words around it"), choices: { label: tx("The words around it", "The words around it", "The words around it", "The words around it"), wrong: [tx("Only its length", "Only its length", "Only its length", "Only its length"), tx("The page number", "The page number", "The page number", "The page number"), tx("The colour of the book", "The colour of the book", "The colour of the book", "The colour of the book")] }, hint: tx("Use the sentence as a clue.", "Use the sentence as a clue.", "Use the sentence as a clue.", "Use the sentence as a clue.") },
      { question: tx("After finishing a task, ___ your answers.", "After finishing a task, ___ your answers.", "After finishing a task, ___ your answers.", "After finishing a task, ___ your answers."), answer: tx("check", "check", "check", "check"), choices: { label: tx("check", "check", "check", "check"), wrong: [tx("hide", "hide", "hide", "hide"), tx("forget", "forget", "forget", "forget"), tx("erase", "erase", "erase", "erase")] }, hint: tx("A final review can catch small mistakes.", "A final review can catch small mistakes.", "A final review can catch small mistakes.", "A final review can catch small mistakes.") },
    ];
    return rows[ordinal % rows.length];
  }
  if (subject === "french" && topic === "france-pays-francophones-6") {
    return {
      question: tx("En Suisse romande, on parle surtout ___.", "En Suisse romande, on parle surtout ___.", "En Suisse romande, on parle surtout ___.", "En Suisse romande, on parle surtout ___."),
      answer: tx("français", "français", "français", "français"),
      choices: { label: tx("français", "français", "français", "français"), wrong: [tx("japonais", "japonais", "japonais", "japonais"), tx("portugais", "portugais", "portugais", "portugais"), tx("suédois", "suédois", "suédois", "suédois")] },
      hint: tx("Pense à la langue apprise dans cette matière.", "Pense à la langue apprise dans cette matière.", "Pense à la langue apprise dans cette matière.", "Pense à la langue apprise dans cette matière."),
    };
  }
  if (subject === "english") {
    const profile = topic === "passive-voice-6" ? "everyday" : topic === "conditionals-6" ? "plans" : "talk";
    return englishGenerated(profile, ordinal);
  }
  if (subject === "french") {
    const profile = topic === "passe-compose-6" ? "day" : topic === "imparfait-6" ? "school" : topic === "futur-simple-6" ? "plans" : "phrases";
    return frenchGenerated(profile, ordinal);
  }
  if (/chemie/.test(topic)) return scienceGenerated("materials", ordinal);
  if (/fuenf-sinne|koerper-sinne/.test(topic)) return scienceGenerated("senses", ordinal);
  if (/lebewesen|pflanzen-tiere/.test(topic)) return scienceGenerated("living", ordinal);
  if (/biologie-zelle|koerper/.test(topic)) return scienceGenerated("body", ordinal);
  if (/globalisierung/.test(topic)) return scienceGenerated("global", ordinal);
  if (/wirtschaft/.test(topic)) return scienceGenerated("economy", ordinal);
  if (/kontinente|europa/.test(topic)) return scienceGenerated("geo", ordinal);
  if (/industrialis|neuzeit/.test(topic)) return scienceGenerated("work", ordinal);
  if (/technik-erfinungen/.test(topic)) return scienceGenerated("work", ordinal);
  if (/weltkriege|demokratie|migration|schweizer-geschichte/.test(topic)) return scienceGenerated("peace", ordinal);
  if (/weltall/.test(topic)) return scienceGenerated("space-exploration", ordinal);
  if (/astronomie|sonnensystem/.test(topic)) return scienceGenerated("space", ordinal);
  if (subject === "german") {
    if (topic === "direkte-rede") {
      const rows: Array<{ thing: Texts; fact: Choice }> = [
        { thing: tx("Direkte Rede", "direct speech", "discours direct", "discorso diretto"), fact: { label: tx("gibt gesprochene Worte wieder", "gibt gesprochene Worte wieder", "gibt gesprochene Worte wieder", "gibt gesprochene Worte wieder"), wrong: [tx("enthält nie Satzzeichen", "enthält nie Satzzeichen", "enthält nie Satzzeichen", "enthält nie Satzzeichen"), tx("besteht nur aus Titeln", "besteht nur aus Titeln", "besteht nur aus Titeln", "besteht nur aus Titeln"), tx("vermeidet jedes Verb", "vermeidet jedes Verb", "vermeidet jedes Verb", "vermeidet jedes Verb")] } },
        { thing: tx("Ein Begleitsatz", "a reporting clause", "une proposition introductrice", "una frase introduttiva"), fact: { label: tx("zeigt, wer spricht", "zeigt, wer spricht", "zeigt, wer spricht", "zeigt, wer spricht"), wrong: [tx("ersetzt die gesprochenen Worte", "ersetzt die gesprochenen Worte", "ersetzt die gesprochenen Worte", "ersetzt die gesprochenen Worte"), tx("ist immer eine Frage", "ist immer eine Frage", "ist immer eine Frage", "ist immer eine Frage"), tx("hat nie ein Verb", "hat nie ein Verb", "hat nie ein Verb", "hat nie ein Verb")] } },
      ];
      const entry = rows[ordinal % rows.length];
      return { question: tx(`${entry.thing.de}: Welche Aussage stimmt?`, `${entry.thing.en}: which statement is correct?`, `${entry.thing.fr} : quelle affirmation est correcte ?`, `${entry.thing.it}: quale affermazione è corretta?`), answer: entry.fact.label, choices: entry.fact, hint: tx("Denke an die Aufgabe der direkten Rede.", "Think about the role of direct speech.", "Pense au rôle du discours direct.", "Pensa alla funzione del discorso diretto.") };
    }
    if (topic === "argumentation-6") return scienceGenerated("argument", ordinal);
    if (topic === "sprache-wandel-6") return scienceGenerated("language", ordinal);
    if (topic === "literatur-6") return scienceGenerated("literature", ordinal);
    if (/rechtschreib/.test(topic)) return scienceGenerated("german", ordinal + 9);
    if (/textsorten/.test(topic)) return scienceGenerated("german", ordinal + 3);
    return scienceGenerated("german", ordinal);
  }
  return scienceGenerated("body", ordinal + 1);
}

function localisedFields(generated: Generated) {
  return {
    questionEN: generated.question.en,
    questionFR: generated.question.fr,
    questionIT: generated.question.it,
    answerEN: generated.answer.en,
    answerFR: generated.answer.fr,
    answerIT: generated.answer.it,
    hintsEN: [generated.hint.en, "Check the question and your answer once more."],
    hintsFR: [generated.hint.fr, "Vérifie encore une fois la question et ta réponse."],
    hintsIT: [generated.hint.it, "Controlla ancora una volta la domanda e la risposta."],
  };
}

function replacement(original: Exercise, generated: Generated, subject: string): Exercise {
  const base = {
    id: original.id,
    difficulty: original.difficulty,
    free: original.free,
    question: generated.question.de,
    answer: generated.answer.de,
    hints: [generated.hint.de, "Prüfe Frage und Antwort noch einmal."],
    ...localisedFields(generated),
  };
  if (original.type === "self-review") {
    const isFrench = subject === "french";
    return {
      ...base,
      type: "self-review",
      question: isFrench
        ? `Lis le modèle : ${generated.question.de.replace("___", generated.answer.de)} Écris ensuite une nouvelle phrase courte.`
        : `Read the model: ${generated.question.de.replace("___", generated.answer.de)} Then write a new short sentence.`,
      questionEN: `Read the model: ${generated.question.en.replace("___", generated.answer.en)} Then write a new short sentence.`,
      questionFR: `Lis le modèle : ${generated.question.fr.replace("___", generated.answer.fr)} Écris ensuite une nouvelle phrase courte.`,
      questionIT: `Leggi il modello: ${generated.question.it.replace("___", generated.answer.it)} Poi scrivi una nuova frase breve.`,
      reviewCriteria: isFrench
        ? ["La phrase correspond au thème.", "La phrase est claire.", "Les majuscules et la ponctuation sont vérifiées."]
        : ["The sentence matches the topic.", "The sentence is clear.", "Capital letters and punctuation are checked."],
      reviewCriteriaEN: ["The sentence matches the task.", "The sentence is clear.", "Capital letters and punctuation are checked."],
      reviewCriteriaFR: ["La phrase correspond à la consigne.", "La phrase est claire.", "Les majuscules et la ponctuation sont vérifiées."],
      reviewCriteriaIT: ["La frase corrisponde al compito.", "La frase è chiara.", "Maiuscole e punteggiatura sono controllate."],
    };
  }
  if (original.type === "fill-in-blank") {
    const ensureBlank = (question: string, answerLabel: string) => question.includes("___") ? question : `${question} ${answerLabel}: ___`;
    const sourceAnswerLabel = subject === "english" ? "Answer" : subject === "french" ? "Réponse" : "Antwort";
    return {
      ...base,
      type: "fill-in-blank",
      question: ensureBlank(base.question, sourceAnswerLabel),
      questionEN: ensureBlank(base.questionEN, "Answer"),
      questionFR: ensureBlank(base.questionFR, "Réponse"),
      questionIT: ensureBlank(base.questionIT, "Risposta"),
    };
  }
  const options = [generated.choices.label, ...generated.choices.wrong];
  return {
    ...base,
    type: "multiple-choice",
    options: options.map((option) => value(option, "de")),
    optionsEN: options.map((option) => value(option, "en")),
    optionsFR: options.map((option) => value(option, "fr")),
    optionsIT: options.map((option) => value(option, "it")),
  };
}

export function applyLp21ApiFitReplacements(grade: number, subject: string, topics: Topic[]): Topic[] {
  return topics.map((topic) => {
    const topicKey = `${grade}/${subject}/${topic.id}`;
    let ordinal = 0;
    const exercises = topic.exercises.map((exercise) => {
      const key = `${topicKey}/${exercise.id}`;
      if (!isLp21ApiFitTarget(key)) return exercise;
      const generated = withTopicContext(simpleGenerated(subject, topic.id, ordinal), topic.id);
      ordinal += 1;
      return replacement(exercise, generated, subject);
    });
    return { ...topic, title: LP21_API_FIT_TOPIC_TITLES[topicKey] ?? topic.title, exercises };
  });
}
