import type { Exercise, Topic } from '@/types/exercise';

type Copy = [question: string, correct: string, wrong1: string, wrong2: string, wrong3: string, hint1: string, hint2: string];
type Review = { key: string; reason: string; de: Copy; en: Copy; fr: Copy; it: Copy };

/** Individually reviewed knowledge questions. No automatic conversion or generic distractors. */
export const KNOWLEDGE_CHOICE_REVIEWS: Review[] = [


  {
    key: '1/science/mein-koerper/k49', reason: 'Identify the sense organ without typing a sentence fragment.',
    de: ['Womit siehst du Farben?', 'Mit den Augen', 'Mit den Ohren', 'Mit der Nase', 'Mit der Zunge', 'Denke an dein Gesicht.', 'Was öffnest du, wenn du etwas anschauen möchtest?'],
    en: ['What do you use to see colours?', 'Your eyes', 'Your ears', 'Your nose', 'Your tongue', 'Think about your face.', 'What do you open when you want to look at something?'],
    fr: ['Avec quoi vois-tu les couleurs ?', 'Avec les yeux', 'Avec les oreilles', 'Avec le nez', 'Avec la langue', 'Pense à ton visage.', 'Qu’ouvres-tu pour regarder quelque chose ?'],
    it: ['Con cosa vedi i colori?', 'Con gli occhi', 'Con le orecchie', 'Con il naso', 'Con la lingua', 'Pensa al tuo viso.', 'Che cosa apri quando vuoi guardare qualcosa?'],
  },
  {
    key: '1/science/pflanzen-gr1/p9', reason: 'Assess basic plant needs rather than memorised wording.',
    de: ['Welche zwei Dinge braucht eine Pflanze?', 'Wasser und Licht', 'Nur Wärme, aber kein Wasser', 'Nur Wasser, aber kein Licht', 'Nur Licht, aber kein Wasser', 'Denke daran, wie du eine Zimmerpflanze pflegst.', 'Sie bekommt etwas aus der Giesskanne und steht an einem hellen Platz.'],
    en: ['Which two things does a plant need?', 'Water and light', 'Only warmth, but no water', 'Only water, but no light', 'Only light, but no water', 'Think about caring for a houseplant.', 'It gets something from a watering can and stands in a bright place.'],
    fr: ['De quelles deux choses une plante a-t-elle besoin ?', 'D’eau et de lumière', 'Seulement de chaleur, sans eau', 'Seulement d’eau, sans lumière', 'Seulement de lumière, sans eau', 'Pense aux soins d’une plante d’intérieur.', 'On utilise un arrosoir et on la place dans un endroit lumineux.'],
    it: ['Di quali due cose ha bisogno una pianta?', 'Acqua e luce', 'Solo calore, ma niente acqua', 'Solo acqua, ma niente luce', 'Solo luce, ma niente acqua', 'Pensa a come curi una pianta in casa.', 'Riceve qualcosa dall’annaffiatoio e sta in un posto luminoso.'],
  },
  {
    key: '1/science/pflanzen-gr1/p40', reason: 'Replace repeated exact-phrase task with a distinct application of plant needs.',
    de: ['Warum giesst du eine Zimmerpflanze?', 'Damit sie genügend Wasser bekommt', 'Damit ihre Wurzeln trocken werden', 'Damit sie kein Licht mehr braucht', 'Damit sie keine Luft mehr braucht', 'Denke an eine Pflanze, deren Erde ganz trocken ist.', 'Die Wurzeln nehmen etwas aus der feuchten Erde auf.'],
    en: ['Why do you water a houseplant?', 'So it gets enough water', 'So its roots become dry', 'So it no longer needs light', 'So it no longer needs air', 'Think of a plant in very dry soil.', 'The roots take something from the moist soil.'],
    fr: ['Pourquoi arroses-tu une plante d’intérieur ?', 'Pour lui donner assez d’eau', 'Pour que ses racines sèchent', 'Pour qu’elle n’ait plus besoin de lumière', 'Pour qu’elle n’ait plus besoin d’air', 'Pense à une plante dont la terre est très sèche.', 'Les racines absorbent quelque chose dans la terre humide.'],
    it: ['Perché annaffi una pianta in casa?', 'Per darle abbastanza acqua', 'Per far seccare le sue radici', 'Perché non abbia più bisogno di luce', 'Perché non abbia più bisogno di aria', 'Pensa a una pianta con la terra molto secca.', 'Le radici assorbono qualcosa dalla terra umida.'],
  },
  {
    key: '1/science/fuenf-sinne/g1-science-fuenf-sinne-s8', reason: 'Recognise hearing without typing the exact definition.',
    de: ['Was nimmt dein Ohr wahr?', 'Geräusche', 'Farben', 'Gerüche', 'Geschmack', 'Denke an eine klingelnde Glocke.', 'Auch Musik gehört zu diesem Sinn.'],
    en: ['What does your ear detect?', 'Sounds', 'Colours', 'Smells', 'Taste', 'Think of a ringing bell.', 'Music also belongs to this sense.'],
    fr: ['Que perçoit ton oreille ?', 'Les sons', 'Les couleurs', 'Les odeurs', 'Les saveurs', 'Pense à une cloche qui sonne.', 'La musique fait aussi appel à ce sens.'],
    it: ['Che cosa percepisce il tuo orecchio?', 'I suoni', 'I colori', 'Gli odori', 'I sapori', 'Pensa a una campana che suona.', 'Anche la musica riguarda questo senso.'],
  },

  {
    key: '1/science/fuenf-sinne/g1-science-fuenf-sinne-s25', reason: 'A distinct sound scenario replaces a repeated exact-definition task.',
    de: ['Eine Glocke läutet. Welcher Sinn hilft dir?', 'Hören', 'Riechen', 'Schmecken', 'Tasten', 'Eine Glocke macht einen Klang.', 'Welches Sinnesorgan nimmst du für Musik?'],
    en: ['You notice a ringing bell. Which sense helps?', 'Hearing', 'Smell', 'Taste', 'Touch', 'A bell makes a sound.', 'Which sense organ do you use for music?'],
    fr: ['Une cloche sonne. Quel sens t’aide ?', 'L’ouïe', 'L’odorat', 'Le goût', 'Le toucher', 'Une cloche produit un son.', 'Quel organe utilises-tu pour écouter de la musique ?'],
    it: ['Suona una campana. Quale senso ti aiuta?', 'L’udito', 'L’olfatto', 'Il gusto', 'Il tatto', 'Una campana produce un suono.', 'Quale organo usi per ascoltare la musica?'],
  },
  {
    key: '1/science/fuenf-sinne/g1-science-fuenf-sinne-s33', reason: 'Identify the tongue’s sensory role without typing a definition.',
    de: ['Was erkennst du mit der Zunge?', 'Wie etwas schmeckt', 'Wie laut etwas klingt', 'Welche Farbe etwas hat', 'Wie weit etwas entfernt ist', 'Denke an einen Bissen Apfel.', 'Damit unterscheidest du süss von sauer.'],
    en: ['What can your tongue tell you?', 'How something tastes', 'How loud something sounds', 'What colour something is', 'How far away something is', 'Think of taking a bite of an apple.', 'It helps you tell sweet from sour.'],
    fr: ['Que reconnais-tu avec la langue ?', 'La saveur de quelque chose', 'Le volume d’un son', 'La couleur de quelque chose', 'La distance d’un objet', 'Pense à une bouchée de pomme.', 'Elle permet de distinguer le sucré de l’acide.'],
    it: ['Cosa riconosci con la lingua?', 'Il sapore di qualcosa', 'Quanto è forte un suono', 'Il colore di qualcosa', 'Quanto è lontano qualcosa', 'Pensa a un morso di mela.', 'Ti aiuta a distinguere il dolce dall’acido.'],
  },
  {
    key: '1/science/fuenf-sinne/g1-science-fuenf-sinne-s48', reason: 'Choose the sensory function instead of reproducing a long phrase.',
    de: ['Was spürst du mit deiner Haut?', 'Wärme und Berührung', 'Licht und Farben', 'Töne und Melodien', 'Düfte und Gerüche', 'Denke an eine weiche Decke.', 'Auch eine warme Tasse kannst du damit wahrnehmen.'],
    en: ['What do you feel with your skin?', 'Warmth and touch', 'Light and colours', 'Sounds and melodies', 'Scents and smells', 'Think of a soft blanket.', 'It also lets you notice a warm cup.'],
    fr: ['Que perçois-tu avec la peau ?', 'La chaleur et le contact', 'La lumière et les couleurs', 'Les sons et les mélodies', 'Les parfums et les odeurs', 'Pense à une couverture douce.', 'Elle te permet aussi de sentir une tasse chaude.'],
    it: ['Che cosa percepisci con la pelle?', 'Calore e contatto', 'Luce e colori', 'Suoni e melodie', 'Profumi e odori', 'Pensa a una coperta morbida.', 'Ti permette anche di sentire una tazza calda.'],
  },
  {
    key: '1/science/verkehr-sicherheit/vs27', reason: 'Assess safe road-crossing preparation without enforcing comma-separated typed order.',
    de: ['Was machst du vor dem Überqueren der Strasse?', 'Anhalten und links, rechts, links schauen', 'Losgehen, sobald ein Auto langsamer fährt', 'Ohne Schauen einem anderen Kind nachlaufen', 'Direkt hinter einem parkierten Auto losgehen', 'Bleibe zuerst am Rand stehen.', 'Prüfe den Verkehr aus beiden Richtungen.'],
    en: ['What should you do before crossing a Swiss road?', 'Stop and look left, right, then left', 'Step out as soon as a car slows down', 'Follow another child without looking', 'Step out directly behind a parked car', 'First stay at the edge of the pavement.', 'Check the traffic coming from both directions.'],
    fr: ['Que fais-tu avant de traverser une rue en Suisse ?', 'S’arrêter et regarder à gauche, à droite, à gauche', 'Avancer dès qu’une voiture ralentit', 'Suivre un enfant sans regarder', 'Avancer directement derrière une voiture garée', 'Reste d’abord au bord du trottoir.', 'Vérifie la circulation dans les deux directions.'],
    it: ['Cosa fai prima di attraversare una strada svizzera?', 'Fermarti e guardare a sinistra, a destra, a sinistra', 'Partire appena un’auto rallenta', 'Seguire un altro bambino senza guardare', 'Partire subito dietro un’auto parcheggiata', 'Prima resta sul bordo del marciapiede.', 'Controlla il traffico nelle due direzioni.'],
  },
{
  "key": "2/science/lebewesen/l12",
  "reason": "Clarify that fungi are neither animals nor plants.",
  "de": [
    "Zu welcher Gruppe gehören Pilze?",
    "Zu einer eigenen Gruppe",
    "Zu den Tieren",
    "Zu den Pflanzen",
    "Zu den Steinen",
    "Nicht alles Lebendige ist ein Tier oder eine Pflanze.",
    "Pilze werden in der Naturkunde gesondert eingeordnet."
  ],
  "en": [
    "Which group do fungi belong to?",
    "A group of their own",
    "Animals",
    "Plants",
    "Rocks",
    "Not every living thing is an animal or a plant.",
    "Scientists classify fungi separately."
  ],
  "fr": [
    "À quel groupe appartiennent les champignons ?",
    "À un groupe à part",
    "Aux animaux",
    "Aux plantes",
    "Aux pierres",
    "Tout ce qui vit n’est pas un animal ou une plante.",
    "Les scientifiques classent les champignons séparément."
  ],
  "it": [
    "A quale gruppo appartengono i funghi?",
    "A un gruppo a sé",
    "Agli animali",
    "Alle piante",
    "Alle pietre",
    "Non tutti gli esseri viventi sono animali o piante.",
    "Gli scienziati classificano i funghi separatamente."
  ]
},
{
  "key": "2/science/lebewesen/l18",
  "reason": "Assess the role of food instead of exact sentence recall.",
  "de": [
    "Warum brauchen Tiere Nahrung?",
    "Sie liefert Energie und hilft beim Wachsen",
    "Sie ersetzt das Atmen",
    "Sie macht das Trinken unnötig",
    "Sie schützt jedes Tier vor Kälte",
    "Denke daran, was ein Tier beim Laufen verbraucht.",
    "Junge Tiere brauchen auch Baustoffe für ihren Körper."
  ],
  "en": [
    "Why do animals need food?",
    "It provides energy and helps them grow",
    "It replaces breathing",
    "It makes drinking unnecessary",
    "It protects every animal from cold",
    "Think about what an animal uses when it runs.",
    "Young animals also need materials to build their bodies."
  ],
  "fr": [
    "Pourquoi les animaux ont-ils besoin de nourriture ?",
    "Elle apporte de l’énergie et aide à grandir",
    "Elle remplace la respiration",
    "Elle rend la boisson inutile",
    "Elle protège tous les animaux du froid",
    "Pense à ce qu’un animal utilise pour courir.",
    "Les jeunes animaux doivent aussi construire leur corps."
  ],
  "it": [
    "Perché gli animali hanno bisogno di cibo?",
    "Fornisce energia e aiuta a crescere",
    "Sostituisce la respirazione",
    "Rende inutile bere",
    "Protegge ogni animale dal freddo",
    "Pensa a ciò che un animale consuma correndo.",
    "Gli animali giovani hanno anche bisogno di costruire il proprio corpo."
  ]
},
{
  "key": "2/science/wasser/w13",
  "reason": "Recognise melting rather than type a sentence.",
  "de": [
    "Ein Eiswürfel liegt im warmen Zimmer. Was passiert?",
    "Er schmilzt zu flüssigem Wasser",
    "Er wird zu Stein",
    "Er wird immer grösser",
    "Er bleibt für immer gefroren",
    "Vergleiche einen Eiswürfel im Zimmer mit einem im Gefrierfach.",
    "Achte darauf, ob er seine feste Form behält."
  ],
  "en": [
    "An ice cube is in a warm room. What happens?",
    "It melts into liquid water",
    "It turns into stone",
    "It keeps getting bigger",
    "It stays frozen forever",
    "Compare ice in a room with ice in a freezer.",
    "Think about whether it keeps its solid shape."
  ],
  "fr": [
    "Un glaçon est dans une pièce chaude. Que se passe-t-il ?",
    "Il fond et devient de l’eau liquide",
    "Il devient une pierre",
    "Il grandit sans cesse",
    "Il reste gelé pour toujours",
    "Compare un glaçon dans une pièce et un autre au congélateur.",
    "Demande-toi s’il garde sa forme solide."
  ],
  "it": [
    "Un cubetto di ghiaccio è in una stanza calda. Cosa succede?",
    "Si scioglie e diventa acqua liquida",
    "Diventa una pietra",
    "Diventa sempre più grande",
    "Resta congelato per sempre",
    "Confronta il ghiaccio in una stanza con quello nel congelatore.",
    "Pensa se mantiene la sua forma solida."
  ]
},
{
  "key": "2/science/wasser/w17",
  "reason": "Fix malformed wording and distinguish cloud droplets from invisible vapour.",
  "de": [
    "Woraus besteht eine Wolke hauptsächlich?",
    "Aus winzigen Wassertröpfchen oder Eiskristallen",
    "Aus Rauch von Feuer",
    "Aus Sandkörnern",
    "Aus Watte",
    "Wolken gehören zum Wasserkreislauf.",
    "In grosser Höhe kann es so kalt sein, dass Wasser gefriert."
  ],
  "en": [
    "What is a cloud mainly made of?",
    "Tiny water droplets or ice crystals",
    "Smoke from fires",
    "Grains of sand",
    "Cotton wool",
    "Clouds are part of the water cycle.",
    "High up, it can be cold enough for water to freeze."
  ],
  "fr": [
    "De quoi un nuage est-il surtout composé ?",
    "De minuscules gouttes d’eau ou cristaux de glace",
    "De fumée d’incendie",
    "De grains de sable",
    "De coton",
    "Les nuages font partie du cycle de l’eau.",
    "En altitude, il peut faire assez froid pour que l’eau gèle."
  ],
  "it": [
    "Da cosa è composta soprattutto una nuvola?",
    "Minuscole gocce d’acqua o cristalli di ghiaccio",
    "Fumo di incendi",
    "Granelli di sabbia",
    "Cotone",
    "Le nuvole fanno parte del ciclo dell’acqua.",
    "In alto può fare abbastanza freddo da far gelare l’acqua."
  ]
},
{
  "key": "2/science/wasser/w24",
  "reason": "Use a child-friendly purpose question about drinking water treatment.",
  "de": [
    "Warum wird Wasser zu Trinkwasser aufbereitet?",
    "Damit Menschen es sicher trinken können",
    "Damit es möglichst salzig wird",
    "Damit es immer gefroren bleibt",
    "Damit es nicht mehr durchsichtig ist",
    "Nicht jedes Wasser aus der Natur ist sauber genug zum Trinken.",
    "Schmutz und schädliche Keime müssen entfernt werden."
  ],
  "en": [
    "Why is water treated to make drinking water?",
    "So people can drink it safely",
    "To make it as salty as possible",
    "To keep it frozen all the time",
    "To stop it being clear",
    "Not all water in nature is clean enough to drink.",
    "Dirt and harmful germs need to be removed."
  ],
  "fr": [
    "Pourquoi traite-t-on l’eau pour la rendre potable ?",
    "Pour pouvoir la boire sans danger",
    "Pour la rendre très salée",
    "Pour qu’elle reste toujours gelée",
    "Pour qu’elle ne soit plus transparente",
    "L’eau de la nature n’est pas toujours assez propre pour être bue.",
    "Il faut retirer les saletés et les microbes dangereux."
  ],
  "it": [
    "Perché l’acqua viene trattata per renderla potabile?",
    "Per poterla bere in sicurezza",
    "Per renderla molto salata",
    "Per mantenerla sempre congelata",
    "Per renderla meno trasparente",
    "L’acqua in natura non è sempre abbastanza pulita da bere.",
    "Occorre eliminare lo sporco e i germi pericolosi."
  ]
},
{
  "key": "2/science/wasser/w28",
  "reason": "Replace abstract definition entry with a concrete shortage scenario.",
  "de": [
    "Ein Dorf hat Wasserknappheit. Was bedeutet das?",
    "Es gibt zu wenig nutzbares Wasser",
    "Alle Häuser haben zu viele Wasserhähne",
    "Es regnet jeden Tag ohne Pause",
    "Der Fluss ist besonders breit",
    "Denke an das Wasser, das Menschen täglich benötigen.",
    "Das vorhandene Wasser reicht nicht für alle Bedürfnisse."
  ],
  "en": [
    "A village has a water shortage. What does that mean?",
    "There is too little usable water",
    "Every house has too many taps",
    "It rains nonstop every day",
    "The river is very wide",
    "Think about the water people need each day.",
    "The available water does not meet all their needs."
  ],
  "fr": [
    "Un village manque d’eau. Qu’est-ce que cela signifie ?",
    "Il n’y a pas assez d’eau utilisable",
    "Chaque maison a trop de robinets",
    "Il pleut sans arrêt chaque jour",
    "La rivière est très large",
    "Pense à l’eau nécessaire chaque jour.",
    "L’eau disponible ne suffit pas à tous les besoins."
  ],
  "it": [
    "In un villaggio c’è scarsità d’acqua. Cosa significa?",
    "Non c’è abbastanza acqua utilizzabile",
    "Ogni casa ha troppi rubinetti",
    "Piove senza sosta ogni giorno",
    "Il fiume è molto largo",
    "Pensa all’acqua necessaria ogni giorno.",
    "L’acqua disponibile non basta per tutti i bisogni."
  ]
},
{
  "key": "2/science/gesunde-ernaehrung/ge16",
  "reason": "Avoid multiple valid fruit names in a typed answer.",
  "de": [
    "Welches Lebensmittel enthält viel Vitamin C?",
    "Eine Orange",
    "Butter",
    "Weisser Reis",
    "Speisesalz",
    "Denke an frisches Obst.",
    "Eine Zitrusfrucht ist gesucht."
  ],
  "en": [
    "Which food contains a lot of vitamin C?",
    "An orange",
    "Butter",
    "White rice",
    "Table salt",
    "Think about fresh fruit.",
    "Look for a citrus fruit."
  ],
  "fr": [
    "Quel aliment contient beaucoup de vitamine C ?",
    "Une orange",
    "Du beurre",
    "Du riz blanc",
    "Du sel",
    "Pense aux fruits frais.",
    "Cherche un agrume."
  ],
  "it": [
    "Quale alimento contiene molta vitamina C?",
    "Un’arancia",
    "Burro",
    "Riso bianco",
    "Sale da cucina",
    "Pensa alla frutta fresca.",
    "Cerca un agrume."
  ]
},
{
  "key": "2/science/gesunde-ernaehrung/ge21",
  "reason": "One specific correct source avoids vague slash-separated food categories.",
  "de": [
    "Welche Nüsse sind besonders reich an Omega-3-Fettsäuren?",
    "Baumnüsse",
    "Mandeln",
    "Cashewnüsse",
    "Haselnüsse",
    "Diese Nüsse wachsen an einem Baum und haben eine harte Schale.",
    "Ihr essbarer Kern hat viele Falten."
  ],
  "en": [
    "Which nuts are especially rich in omega-3 fats?",
    "Walnuts",
    "Almonds",
    "Cashews",
    "Hazelnuts",
    "These nuts grow on a tree and have a hard shell.",
    "Their edible kernel has many folds."
  ],
  "fr": [
    "Quels fruits à coque sont particulièrement riches en oméga-3 ?",
    "Les noix du noyer",
    "Les amandes",
    "Les noix de cajou",
    "Les noisettes",
    "Elles poussent sur un arbre et ont une coque dure.",
    "Leur partie comestible présente de nombreux plis."
  ],
  "it": [
    "Quale frutta a guscio è particolarmente ricca di grassi omega-3?",
    "Le noci",
    "Le mandorle",
    "Gli anacardi",
    "Le nocciole",
    "Cresce su un albero e ha un guscio duro.",
    "La parte commestibile ha molte pieghe."
  ]
},
{
  "key": "2/science/gesunde-ernaehrung/ge23",
  "reason": "Recognise calcium’s role without typing a fixed phrase.",
  "de": [
    "Welche Körperteile enthalten besonders viel Kalzium?",
    "Knochen und Zähne",
    "Haare und Nägel",
    "Magen und Darm",
    "Lunge und Ohren",
    "Denke an die festen Teile deines Körpers.",
    "Sie stützen dich und helfen dir beim Kauen."
  ],
  "en": [
    "Which body parts contain especially large amounts of calcium?",
    "Bones and teeth",
    "Hair and nails",
    "Stomach and intestines",
    "Lungs and ears",
    "Think of the hard parts of your body.",
    "They support you and help you chew."
  ],
  "fr": [
    "Quelles parties du corps contiennent particulièrement beaucoup de calcium ?",
    "Les os et les dents",
    "Les cheveux et les ongles",
    "L’estomac et les intestins",
    "Les poumons et les oreilles",
    "Pense aux parties dures de ton corps.",
    "Elles te soutiennent et t’aident à mâcher."
  ],
  "it": [
    "Quali parti del corpo contengono molto calcio?",
    "Le ossa e i denti",
    "I capelli e le unghie",
    "Lo stomaco e l’intestino",
    "I polmoni e le orecchie",
    "Pensa alle parti dure del tuo corpo.",
    "Ti sostengono e ti aiutano a masticare."
  ]
},
{
  "key": "2/science/gesunde-ernaehrung/ge31",
  "reason": "Avoid categorical overeating claim; assess noticing fullness.",
  "de": [
    "Warum ist es hilfreich, beim Essen nicht zu hetzen?",
    "Du kannst besser merken, wann du satt bist",
    "Das Essen enthält dann keine Nährstoffe mehr",
    "Du brauchst dann nichts zu kauen",
    "Du wirst davon nie mehr hungrig",
    "Achte darauf, wie sich dein Bauch anfühlt.",
    "Dein Körper braucht Zeit, um dir ein Signal zu geben."
  ],
  "en": [
    "Why is it helpful not to rush a meal?",
    "You can notice more easily when you are full",
    "The food loses all its nutrients",
    "You no longer need to chew",
    "You will never feel hungry again",
    "Pay attention to how your stomach feels.",
    "Your body needs time to send you a signal."
  ],
  "fr": [
    "Pourquoi vaut-il mieux ne pas manger trop vite ?",
    "Tu remarques mieux quand tu n’as plus faim",
    "La nourriture perd tous ses nutriments",
    "Tu n’as plus besoin de mâcher",
    "Tu n’auras plus jamais faim",
    "Fais attention à ce que tu ressens dans ton ventre.",
    "Ton corps a besoin de temps pour t’envoyer un signal."
  ],
  "it": [
    "Perché è utile non mangiare di fretta?",
    "Puoi accorgerti meglio di quando sei sazio",
    "Il cibo perde tutti i nutrienti",
    "Non devi più masticare",
    "Non avrai mai più fame",
    "Fai attenzione a come senti la pancia.",
    "Il tuo corpo ha bisogno di tempo per mandarti un segnale."
  ]
},
{
  "key": "2/science/gesunde-ernaehrung/ge33",
  "reason": "Turn embedded verbal choice into an actual selection control.",
  "de": [
    "Was liefern Gemüse wie Rüebli und Spinat?",
    "Vitamine und Mineralstoffe",
    "Vor allem Alkohol",
    "Nur Speisesalz",
    "Nur Zucker, sonst nichts",
    "Gemüse liefert verschiedene Stoffe, die dein Körper braucht.",
    "Viele davon brauchst du nur in kleinen Mengen."
  ],
  "en": [
    "What do vegetables such as carrots and spinach provide?",
    "Vitamins and minerals",
    "Mainly alcohol",
    "Only table salt",
    "Only sugar and nothing else",
    "Vegetables provide different substances your body needs.",
    "You only need small amounts of many of them."
  ],
  "fr": [
    "Qu’apportent les légumes comme les carottes et les épinards ?",
    "Des vitamines et des minéraux",
    "Surtout de l’alcool",
    "Seulement du sel",
    "Seulement du sucre et rien d’autre",
    "Les légumes apportent différentes substances utiles au corps.",
    "Beaucoup sont nécessaires en petites quantités."
  ],
  "it": [
    "Cosa forniscono verdure come carote e spinaci?",
    "Vitamine e minerali",
    "Soprattutto alcol",
    "Solo sale da cucina",
    "Solo zucchero e nient’altro",
    "Le verdure forniscono diverse sostanze utili al corpo.",
    "Di molte ne bastano piccole quantità."
  ]
},
{
  "key": "2/science/schweiz-symbole/ch32",
  "reason": "Replace brand-name recall with recognition of the known Swiss product.",
  "de": [
    "Für welche Süssigkeit ist die Schweiz besonders bekannt?",
    "Schokolade",
    "Ahornsirup",
    "Baklava",
    "Lakritz",
    "Die gesuchte Süssigkeit wird aus Kakao hergestellt.",
    "Man kann sie als Tafel kaufen."
  ],
  "en": [
    "Which sweet food is Switzerland especially known for?",
    "Chocolate",
    "Maple syrup",
    "Baklava",
    "Liquorice",
    "The sweet food is made from cocoa.",
    "You can buy it as a bar."
  ],
  "fr": [
    "Pour quelle gourmandise la Suisse est-elle particulièrement connue ?",
    "Le chocolat",
    "Le sirop d’érable",
    "Le baklava",
    "La réglisse",
    "Cette gourmandise est fabriquée avec du cacao.",
    "On peut l’acheter en tablette."
  ],
  "it": [
    "Per quale dolce è particolarmente famosa la Svizzera?",
    "Il cioccolato",
    "Lo sciroppo d’acero",
    "Il baklava",
    "La liquirizia",
    "Il dolce cercato si produce con il cacao.",
    "Si può comprare in tavoletta."
  ]
},
{
  "key": "2/science/berufe/g2-science-berufe-b14",
  "reason": "Avoid requiring one gendered formulation of a profession.",
  "de": [
    "Wer unterrichtet Kinder in der Schule?",
    "Eine Lehrperson",
    "Eine Tierärztin",
    "Ein Bäcker",
    "Eine Pilotin",
    "Die Person erklärt Aufgaben und hilft beim Lernen.",
    "Du triffst sie oft im Klassenzimmer."
  ],
  "en": [
    "Who teaches children at school?",
    "A teacher",
    "A vet",
    "A baker",
    "A pilot",
    "This person explains tasks and helps you learn.",
    "You often meet them in the classroom."
  ],
  "fr": [
    "Qui enseigne aux enfants à l’école ?",
    "Une personne enseignante",
    "Une vétérinaire",
    "Un boulanger",
    "Une pilote",
    "Cette personne explique les exercices et aide à apprendre.",
    "Tu la rencontres souvent en classe."
  ],
  "it": [
    "Chi insegna ai bambini a scuola?",
    "Un insegnante",
    "Una veterinaria",
    "Un panettiere",
    "Una pilota",
    "Questa persona spiega gli esercizi e aiuta a imparare.",
    "La incontri spesso in classe."
  ]
},


];

const reviewsByKey = new Map(KNOWLEDGE_CHOICE_REVIEWS.map((review, index) => [review.key, { review, index }]));

export function applyReviewedKnowledgeChoices(grade: number, subject: string, topics: Topic[]): Topic[] {
  return topics.map(topic => ({ ...topic, exercises: topic.exercises.map(exercise => {
    const entry = reviewsByKey.get(`${grade}/${subject}/${topic.id}/${exercise.id}`);
    if (!entry) return exercise;
    const { review, index } = entry;
    const result: Exercise = { ...exercise, type: 'multiple-choice', completeLocalization: true, reviewedKnowledgeChoice: true };
    // Remove obsolete writing/voice/option-shape fields, never IDs, difficulty or progress metadata.
    for (const key of ['altAnswers','altAnswersEN','altAnswersFR','altAnswersIT','sequentialAnswer','mathAnswerMode','mathAnswerUnit','caseSensitiveAnswer','spokenPrompt','spokenPromptEN','spokenPromptFR','spokenPromptIT','verbatimSpeech','optionImages','optionEmojis'] as const) delete result[key];
    for (const [lang, suffix] of [['de',''],['en','EN'],['fr','FR'],['it','IT']] as const) {
      const [question, answer, ...rest] = review[lang];
      const options = [answer, ...rest.slice(0,3)];
      const offset = index % options.length;
      Object.assign(result, { [`question${suffix}`]: question, [`answer${suffix}`]: answer, [`options${suffix}`]: [...options.slice(offset), ...options.slice(0,offset)], [`hints${suffix}`]: rest.slice(3) });
    }
    return result;
  }) }));
}
