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
{
  "key": "3/science/unsere-erde/ue18",
  "reason": "Recognise glacier movement without exact definition entry.",
  "de": [
    "Was ist ein Gletscher?",
    "Eine grosse Eismasse, die sich langsam bewegt",
    "Ein See mit warmem Wasser",
    "Ein Berg aus Sand",
    "Eine Wolke direkt über dem Boden",
    "Denke an Schnee und Eis im Hochgebirge.",
    "Die Masse bleibt nicht völlig an derselben Stelle."
  ],
  "en": [
    "What is a glacier?",
    "A large mass of ice that moves slowly",
    "A lake of warm water",
    "A mountain of sand",
    "A cloud just above the ground",
    "Think of snow and ice in high mountains.",
    "The mass does not stay completely in one place."
  ],
  "fr": [
    "Qu’est-ce qu’un glacier ?",
    "Une grande masse de glace qui avance lentement",
    "Un lac d’eau chaude",
    "Une montagne de sable",
    "Un nuage juste au-dessus du sol",
    "Pense à la neige et à la glace en haute montagne.",
    "Cette masse ne reste pas tout à fait au même endroit."
  ],
  "it": [
    "Che cos’è un ghiacciaio?",
    "Una grande massa di ghiaccio che si muove lentamente",
    "Un lago di acqua calda",
    "Una montagna di sabbia",
    "Una nuvola appena sopra il suolo",
    "Pensa alla neve e al ghiaccio in alta montagna.",
    "La massa non resta sempre nello stesso punto."
  ]
},
{
  "key": "3/science/unsere-erde/ue20",
  "reason": "Distinguish largest hot desert from largest desert overall.",
  "de": [
    "Welche Aussage über die Sahara stimmt?",
    "Sie ist die grösste Heisswüste der Erde",
    "Sie liegt in Südamerika",
    "Sie ist von einem dicken Eisschild bedeckt",
    "Sie ist ein tropischer Regenwald",
    "Denke an das trockene Gebiet im Norden Afrikas.",
    "Beachte das Wort Heisswüste, nicht Eiswüste."
  ],
  "en": [
    "Which statement about the Sahara is correct?",
    "It is the largest hot desert on Earth",
    "It is in South America",
    "It is covered by a thick ice sheet",
    "It is a tropical rainforest",
    "Think of the dry area in northern Africa.",
    "Notice the words hot desert, not polar desert."
  ],
  "fr": [
    "Quelle affirmation sur le Sahara est correcte ?",
    "C’est le plus grand désert chaud de la Terre",
    "Il se trouve en Amérique du Sud",
    "Il est couvert d’une épaisse calotte de glace",
    "C’est une forêt tropicale humide",
    "Pense à la région sèche du nord de l’Afrique.",
    "Il s’agit d’un désert chaud, pas d’un désert polaire."
  ],
  "it": [
    "Quale affermazione sul Sahara è corretta?",
    "È il più grande deserto caldo della Terra",
    "Si trova in Sudamerica",
    "È coperto da una spessa calotta di ghiaccio",
    "È una foresta pluviale tropicale",
    "Pensa alla regione secca del Nordafrica.",
    "Si parla di un deserto caldo, non polare."
  ]
},
{
  "key": "3/science/unsere-erde/ue21",
  "reason": "Explain plate motion with accessible wording.",
  "de": [
    "Was beschreibt die Plattentektonik?",
    "Grosse Platten der äusseren Erde bewegen sich langsam",
    "Wolken bewegen sich mit dem Wind",
    "Die Erde dreht sich um ihre Achse",
    "Wasser fliesst von Bergen ins Tal",
    "Denke an die feste äussere Schicht der Erde.",
    "Ihre grossen Teile können aneinander vorbeigleiten oder zusammenstossen."
  ],
  "en": [
    "What does plate tectonics describe?",
    "Large plates of the outer Earth move slowly",
    "Clouds move with the wind",
    "Earth spins on its axis",
    "Water flows from mountains into valleys",
    "Think of Earth’s solid outer layer.",
    "Its large pieces can slide past each other or collide."
  ],
  "fr": [
    "Que décrit la tectonique des plaques ?",
    "De grandes plaques externes de la Terre bougent lentement",
    "Les nuages se déplacent avec le vent",
    "La Terre tourne sur elle-même",
    "L’eau descend des montagnes vers les vallées",
    "Pense à la couche extérieure solide de la Terre.",
    "Ses grandes parties peuvent glisser ou se rencontrer."
  ],
  "it": [
    "Che cosa descrive la tettonica delle placche?",
    "Grandi placche esterne della Terra si muovono lentamente",
    "Le nuvole si spostano con il vento",
    "La Terra ruota sul proprio asse",
    "L’acqua scende dai monti nelle valli",
    "Pensa allo strato esterno solido della Terra.",
    "Le sue grandi parti possono scorrere o scontrarsi."
  ]
},
{
  "key": "3/science/unsere-erde/ue31",
  "reason": "Identify the Amazon accurately without a long fixed description.",
  "de": [
    "Was ist der Amazonas?",
    "Ein sehr wasserreicher Fluss in Südamerika",
    "Ein Gebirge in Europa",
    "Eine Wüste in Afrika",
    "Ein Meer zwischen Europa und Afrika",
    "Suche auf einer Karte im Norden Südamerikas.",
    "Sein Wasser fliesst zum Atlantischen Ozean."
  ],
  "en": [
    "What is the Amazon?",
    "A river carrying a huge amount of water in South America",
    "A mountain range in Europe",
    "A desert in Africa",
    "A sea between Europe and Africa",
    "Look at northern South America on a map.",
    "Its water flows into the Atlantic Ocean."
  ],
  "fr": [
    "Qu’est-ce que l’Amazone ?",
    "Un fleuve au débit immense en Amérique du Sud",
    "Une chaîne de montagnes en Europe",
    "Un désert en Afrique",
    "Une mer entre l’Europe et l’Afrique",
    "Regarde le nord de l’Amérique du Sud sur une carte.",
    "Son eau rejoint l’océan Atlantique."
  ],
  "it": [
    "Che cos’è il Rio delle Amazzoni?",
    "Un fiume con moltissima acqua in Sudamerica",
    "Una catena montuosa in Europa",
    "Un deserto in Africa",
    "Un mare tra Europa e Africa",
    "Guarda il nord del Sudamerica su una carta.",
    "Le sue acque raggiungono l’Oceano Atlantico."
  ]
},
{
  "key": "3/science/unsere-erde/ue33",
  "reason": "Choose the geographic definition rather than type it.",
  "de": [
    "Was ist ein Kontinent?",
    "Eine sehr grosse Landmasse der Erde",
    "Ein einzelnes Dorf",
    "Ein kleiner Bach",
    "Eine Strasse zwischen zwei Städten",
    "Europa und Afrika sind Beispiele.",
    "Auf einem solchen Gebiet können viele Länder liegen."
  ],
  "en": [
    "What is a continent?",
    "A very large landmass on Earth",
    "A single village",
    "A small stream",
    "A road between two cities",
    "Europe and Africa are examples.",
    "Many countries can lie within one."
  ],
  "fr": [
    "Qu’est-ce qu’un continent ?",
    "Une très grande étendue de terre",
    "Un seul village",
    "Un petit ruisseau",
    "Une route entre deux villes",
    "L’Europe et l’Afrique en sont des exemples.",
    "Il peut contenir de nombreux pays."
  ],
  "it": [
    "Che cos’è un continente?",
    "Una grandissima massa di terra emersa",
    "Un singolo villaggio",
    "Un piccolo ruscello",
    "Una strada tra due città",
    "L’Europa e l’Africa sono esempi.",
    "Può comprendere molti Paesi."
  ]
},
{
  "key": "3/science/unsere-erde/ue36",
  "reason": "Avoid ambiguous slash-separated volcanic products.",
  "de": [
    "Was kann bei einem Vulkanausbruch austreten?",
    "Lava und Asche",
    "Nur Schnee",
    "Nur Trinkwasser",
    "Nur Sand aus der Wüste",
    "Im Inneren der Erde kann Gestein schmelzen.",
    "Auch feine Gesteinsteilchen können in die Luft gelangen."
  ],
  "en": [
    "What can come out during a volcanic eruption?",
    "Lava and ash",
    "Only snow",
    "Only drinking water",
    "Only desert sand",
    "Rock can melt inside Earth.",
    "Fine rock particles can also enter the air."
  ],
  "fr": [
    "Que peut rejeter un volcan en éruption ?",
    "De la lave et des cendres",
    "Seulement de la neige",
    "Seulement de l’eau potable",
    "Seulement du sable du désert",
    "La roche peut fondre à l’intérieur de la Terre.",
    "De fines particules de roche peuvent aussi s’élever dans l’air."
  ],
  "it": [
    "Che cosa può uscire durante un’eruzione vulcanica?",
    "Lava e cenere",
    "Solo neve",
    "Solo acqua potabile",
    "Solo sabbia del deserto",
    "All’interno della Terra la roccia può fondere.",
    "Anche particelle fini di roccia possono finire nell’aria."
  ]
},
{
  "key": "3/science/unsere-erde/ue43",
  "reason": "Replace malformed embedded binary-choice sentence with actual choices.",
  "de": [
    "Was kann eine Region auszeichnen?",
    "Orte haben gemeinsame Merkmale",
    "Sie muss ein eigener Staat sein",
    "Sie besteht immer aus genau einer Stadt",
    "Sie hat überall auf der Erde dieselbe Grösse",
    "Denke zum Beispiel an eine Bergregion.",
    "Die Landschaft kann mehrere Orte verbinden."
  ],
  "en": [
    "What can define a region?",
    "Places share common features",
    "It must be an independent country",
    "It always consists of exactly one city",
    "It has the same size everywhere on Earth",
    "Think of a mountain region.",
    "A landscape can connect several places."
  ],
  "fr": [
    "Qu’est-ce qui peut caractériser une région ?",
    "Des lieux partagent des caractéristiques",
    "Elle doit être un État indépendant",
    "Elle comprend toujours exactement une ville",
    "Toutes les régions ont la même taille",
    "Pense à une région montagneuse.",
    "Un paysage peut relier plusieurs lieux."
  ],
  "it": [
    "Che cosa può caratterizzare una regione?",
    "Luoghi con caratteristiche comuni",
    "Deve essere uno Stato indipendente",
    "Comprende sempre esattamente una città",
    "Tutte le regioni hanno la stessa grandezza",
    "Pensa a una regione montuosa.",
    "Un paesaggio può unire diversi luoghi."
  ]
},
{
  "key": "3/science/unsere-erde/ue45",
  "reason": "Make map-legend knowledge directly selectable.",
  "de": [
    "Wozu dient die Legende einer Karte?",
    "Sie erklärt die Zeichen und Farben",
    "Sie misst die Lufttemperatur",
    "Sie zeigt immer die aktuelle Uhrzeit",
    "Sie zählt alle Menschen auf der Karte",
    "Auf Karten gibt es verschiedene Symbole.",
    "Die Legende hilft dir zu verstehen, was diese bedeuten."
  ],
  "en": [
    "What is a map legend for?",
    "It explains symbols and colours",
    "It measures air temperature",
    "It always shows the current time",
    "It counts everyone shown on the map",
    "Maps use different symbols.",
    "The legend helps you understand their meaning."
  ],
  "fr": [
    "À quoi sert la légende d’une carte ?",
    "Elle explique les symboles et les couleurs",
    "Elle mesure la température de l’air",
    "Elle donne toujours l’heure actuelle",
    "Elle compte les personnes sur la carte",
    "Les cartes utilisent différents symboles.",
    "La légende aide à comprendre leur sens."
  ],
  "it": [
    "A cosa serve la legenda di una carta?",
    "Spiega i simboli e i colori",
    "Misura la temperatura dell’aria",
    "Mostra sempre l’ora attuale",
    "Conta tutte le persone sulla carta",
    "Le carte usano simboli diversi.",
    "La legenda aiuta a capirne il significato."
  ]
},
{
  "key": "3/science/unsere-erde/ue49",
  "reason": "Constrain El Niño to the relevant Pacific surface-water area.",
  "de": [
    "Was passiert bei El Niño mit dem Oberflächenwasser in einem Teil des Pazifiks?",
    "Es wird ungewöhnlich warm",
    "Es gefriert überall",
    "Es wird zu Süsswasser",
    "Es verschwindet vollständig",
    "Es geht um die Temperatur des Meerwassers.",
    "Vergleiche sie mit den üblichen Werten in diesem Gebiet."
  ],
  "en": [
    "During El Niño, what happens to surface water in part of the Pacific?",
    "It becomes unusually warm",
    "It freezes everywhere",
    "It becomes fresh water",
    "It disappears completely",
    "Think about seawater temperature.",
    "Compare it with the usual temperatures in this area."
  ],
  "fr": [
    "Pendant El Niño, que devient l’eau de surface dans une partie du Pacifique ?",
    "Elle devient anormalement chaude",
    "Elle gèle partout",
    "Elle devient douce",
    "Elle disparaît complètement",
    "Il s’agit de la température de l’eau de mer.",
    "Compare-la aux températures habituelles de cette région."
  ],
  "it": [
    "Durante El Niño, cosa succede all’acqua superficiale in una parte del Pacifico?",
    "Diventa insolitamente calda",
    "Gela ovunque",
    "Diventa acqua dolce",
    "Scompare completamente",
    "Pensa alla temperatura dell’acqua marina.",
    "Confrontala con i valori abituali della zona."
  ]
},
{
  "key": "3/science/materialien/mat22",
  "reason": "Recognise the source of ordinary paper without fixed-phrase recall.",
  "de": [
    "Woraus wird gewöhnliches Papier hauptsächlich hergestellt?",
    "Aus Pflanzenfasern, oft aus Holz",
    "Aus geschmolzenem Eisen",
    "Aus Glasscherben",
    "Aus Speisesalz",
    "Denke an Bäume und Recyclingpapier.",
    "Die feinen Fasern werden mit Wasser verarbeitet."
  ],
  "en": [
    "What is ordinary paper mainly made from?",
    "Plant fibres, often from wood",
    "Melted iron",
    "Broken glass",
    "Table salt",
    "Think of trees and recycled paper.",
    "Fine fibres are processed with water."
  ],
  "fr": [
    "Avec quoi fabrique-t-on principalement le papier ordinaire ?",
    "Des fibres végétales, souvent issues du bois",
    "Du fer fondu",
    "Des morceaux de verre",
    "Du sel",
    "Pense aux arbres et au papier recyclé.",
    "De fines fibres sont travaillées avec de l’eau."
  ],
  "it": [
    "Con cosa si produce soprattutto la carta comune?",
    "Fibre vegetali, spesso ricavate dal legno",
    "Ferro fuso",
    "Frammenti di vetro",
    "Sale da cucina",
    "Pensa agli alberi e alla carta riciclata.",
    "Le fibre sottili vengono lavorate con acqua."
  ]
},
{
  "key": "3/science/materialien/mat24",
  "reason": "Use a concrete combination example to explain composite material.",
  "de": [
    "Beton wird mit Stahl verstärkt. Warum ist das ein Verbundwerkstoff?",
    "Zwei Materialien werden miteinander verbunden",
    "Es besteht nur aus einem einzigen Stoff",
    "Es ist immer durchsichtig",
    "Es kann nur aus Pflanzen bestehen",
    "Achte darauf, wie viele verschiedene Materialien vorkommen.",
    "Die Materialien ergänzen ihre Eigenschaften."
  ],
  "en": [
    "Concrete is reinforced with steel. Why is this a composite material?",
    "Two materials are combined",
    "It consists of only one substance",
    "It is always transparent",
    "It can only be made from plants",
    "Notice how many different materials are used.",
    "The materials combine their properties."
  ],
  "fr": [
    "Le béton est renforcé avec de l’acier. Pourquoi est-ce un matériau composite ?",
    "Deux matériaux sont associés",
    "Il contient une seule substance",
    "Il est toujours transparent",
    "Il ne peut contenir que des plantes",
    "Observe le nombre de matériaux différents.",
    "Leurs propriétés se complètent."
  ],
  "it": [
    "Il calcestruzzo è rinforzato con acciaio. Perché è un materiale composito?",
    "Si uniscono due materiali",
    "Contiene una sola sostanza",
    "È sempre trasparente",
    "Può contenere soltanto piante",
    "Osserva quanti materiali diversi vengono usati.",
    "Le loro proprietà si completano."
  ]
},
{
  "key": "3/science/materialien/mat28",
  "reason": "Identify cotton as a plant fibre.",
  "de": [
    "Was ist Baumwolle?",
    "Eine Pflanzenfaser, aus der man Stoff herstellen kann",
    "Ein Metall für Werkzeuge",
    "Ein Gestein für Mauern",
    "Ein Kunststoff aus Erdöl",
    "Schau auf das Etikett eines T-Shirts.",
    "Die Faser wächst an einer Pflanze."
  ],
  "en": [
    "What is cotton?",
    "A plant fibre used to make fabric",
    "A metal for tools",
    "A rock for walls",
    "A plastic made from oil",
    "Look at the label of a T-shirt.",
    "The fibre grows on a plant."
  ],
  "fr": [
    "Qu’est-ce que le coton ?",
    "Une fibre végétale utilisée pour les tissus",
    "Un métal pour les outils",
    "Une roche pour les murs",
    "Un plastique issu du pétrole",
    "Regarde l’étiquette d’un T-shirt.",
    "Cette fibre pousse sur une plante."
  ],
  "it": [
    "Che cos’è il cotone?",
    "Una fibra vegetale usata per i tessuti",
    "Un metallo per gli attrezzi",
    "Una roccia per i muri",
    "Una plastica ricavata dal petrolio",
    "Guarda l’etichetta di una maglietta.",
    "Questa fibra cresce su una pianta."
  ]
},
{
  "key": "3/science/materialien/mat34",
  "reason": "Choose concrete’s ingredients instead of reproducing a long list.",
  "de": [
    "Welche Zutaten gehören zu gewöhnlichem Beton?",
    "Zement, Sand, Kies und Wasser",
    "Nur Holz und Leim",
    "Nur Baumwolle und Wolle",
    "Nur Glas und Salz",
    "Beton wird beim Bauen zunächst als formbare Mischung verwendet.",
    "Kleine Steine sind darin enthalten, und die Mischung wird später fest."
  ],
  "en": [
    "Which ingredients are used in ordinary concrete?",
    "Cement, sand, gravel and water",
    "Only wood and glue",
    "Only cotton and wool",
    "Only glass and salt",
    "Concrete starts as a mixture that can be shaped.",
    "It contains small stones and later becomes hard."
  ],
  "fr": [
    "Quels ingrédients entrent dans le béton ordinaire ?",
    "Du ciment, du sable, du gravier et de l’eau",
    "Seulement du bois et de la colle",
    "Seulement du coton et de la laine",
    "Seulement du verre et du sel",
    "Le béton est d’abord un mélange que l’on peut façonner.",
    "Il contient de petits cailloux et durcit ensuite."
  ],
  "it": [
    "Quali ingredienti compongono il calcestruzzo comune?",
    "Cemento, sabbia, ghiaia e acqua",
    "Solo legno e colla",
    "Solo cotone e lana",
    "Solo vetro e sale",
    "Il calcestruzzo è inizialmente un impasto modellabile.",
    "Contiene piccole pietre e poi indurisce."
  ]
},
{
  "key": "3/science/materialien/mat36",
  "reason": "Replace mismatched slash alternatives with one category.",
  "de": [
    "Zu welcher Gruppe gehören Kohlenhydrate, Fette und Proteine?",
    "Zu den Nährstoffen",
    "Zu den Metallen",
    "Zu den Gesteinen",
    "Zu den Kunststoffen",
    "Diese Stoffe kommen in Lebensmitteln vor.",
    "Dein Körper nutzt sie zum Leben und Wachsen."
  ],
  "en": [
    "Which group includes carbohydrates, fats and proteins?",
    "Nutrients",
    "Metals",
    "Rocks",
    "Plastics",
    "These substances are found in food.",
    "Your body uses them to live and grow."
  ],
  "fr": [
    "À quel groupe appartiennent les glucides, les graisses et les protéines ?",
    "Aux nutriments",
    "Aux métaux",
    "Aux roches",
    "Aux plastiques",
    "Ces substances se trouvent dans les aliments.",
    "Ton corps les utilise pour vivre et grandir."
  ],
  "it": [
    "A quale gruppo appartengono carboidrati, grassi e proteine?",
    "Ai nutrienti",
    "Ai metalli",
    "Alle rocce",
    "Alle plastiche",
    "Queste sostanze si trovano negli alimenti.",
    "Il tuo corpo le usa per vivere e crescere."
  ]
},
{
  "key": "3/science/materialien/mat37",
  "reason": "Remove multi-blank input and avoid claiming all plastics are flexible.",
  "de": [
    "Was stimmt über ein Trinkglas und eine dünne Plastiktüte?",
    "Das Glas kann zerbrechen, die Tüte lässt sich biegen",
    "Beide lassen sich wie Papier falten",
    "Das Glas lässt sich kneten, die Tüte nicht",
    "Beide bestehen aus demselben Material",
    "Vergleiche die Formen der beiden Gegenstände, ohne etwas zu zerbrechen.",
    "Eine Tüte kann man leicht zusammenlegen."
  ],
  "en": [
    "What is true of a drinking glass and a thin plastic bag?",
    "The glass can shatter; the bag can bend",
    "Both fold like paper",
    "The glass can be kneaded, but the bag cannot",
    "Both are made of the same material",
    "Compare the objects without breaking anything.",
    "A bag is easy to fold up."
  ],
  "fr": [
    "Que peut-on dire d’un verre à boire et d’un sac plastique fin ?",
    "Le verre peut se casser, le sac peut se plier",
    "Les deux se plient comme du papier",
    "Le verre se pétrit, mais pas le sac",
    "Les deux sont faits du même matériau",
    "Compare les objets sans rien casser.",
    "Un sac se replie facilement."
  ],
  "it": [
    "Cosa è vero per un bicchiere di vetro e un sacchetto di plastica sottile?",
    "Il vetro può rompersi, il sacchetto si può piegare",
    "Entrambi si piegano come carta",
    "Il vetro si può impastare, il sacchetto no",
    "Sono fatti dello stesso materiale",
    "Confronta gli oggetti senza rompere nulla.",
    "Un sacchetto si ripiega facilmente."
  ]
},
{
  "key": "3/science/materialien/mat39",
  "reason": "Recognise oxygen requirement without equivalent-verb entry.",
  "de": [
    "Eine Kerzenflamme bekommt keinen Sauerstoff mehr. Was passiert?",
    "Die Flamme erlischt",
    "Die Flamme brennt immer grösser",
    "Die Kerze wird zu Wasser",
    "Die Flamme wird zu Eis",
    "Zum Brennen braucht die Flamme etwas aus der Luft.",
    "Fehlt eine Voraussetzung zum Brennen, kann die Flamme nicht weiterbrennen."
  ],
  "en": [
    "A candle flame can no longer get oxygen. What happens?",
    "The flame goes out",
    "The flame keeps growing",
    "The candle turns into water",
    "The flame turns into ice",
    "A flame needs something from the air to burn.",
    "Without a requirement for burning, it cannot keep burning."
  ],
  "fr": [
    "Une flamme de bougie ne reçoit plus d’oxygène. Que se passe-t-il ?",
    "La flamme s’éteint",
    "La flamme grandit sans cesse",
    "La bougie devient de l’eau",
    "La flamme devient de la glace",
    "Pour brûler, la flamme a besoin d’un élément de l’air.",
    "Si une condition manque, elle ne peut pas continuer à brûler."
  ],
  "it": [
    "La fiamma di una candela non riceve più ossigeno. Cosa succede?",
    "La fiamma si spegne",
    "La fiamma continua a crescere",
    "La candela diventa acqua",
    "La fiamma diventa ghiaccio",
    "Per bruciare, la fiamma ha bisogno di qualcosa nell’aria.",
    "Se manca una condizione necessaria, non può continuare a bruciare."
  ]
},
{
  "key": "3/science/materialien/mat42",
  "reason": "Avoid blanket claim that every plastic has identical biodegradability.",
  "de": [
    "Warum darf man gewöhnliche Plastikverpackungen nicht in der Natur liegen lassen?",
    "Sie können sehr lange als Abfall erhalten bleiben",
    "Sie werden sofort zu sauberem Trinkwasser",
    "Sie düngen alle Pflanzen besonders gut",
    "Sie lösen sich bei jedem Regen vollständig auf",
    "Vergleiche eine Verpackung mit einem Blatt vom Baum.",
    "Viele Kunststoffe werden in der Natur nur sehr langsam abgebaut."
  ],
  "en": [
    "Why must ordinary plastic packaging not be left in nature?",
    "It can remain as waste for a very long time",
    "It immediately becomes clean drinking water",
    "It is excellent fertiliser for every plant",
    "It dissolves completely whenever it rains",
    "Compare packaging with a leaf from a tree.",
    "Many plastics break down very slowly in nature."
  ],
  "fr": [
    "Pourquoi ne faut-il pas laisser les emballages plastiques ordinaires dans la nature ?",
    "Ils peuvent rester très longtemps comme déchets",
    "Ils deviennent aussitôt de l’eau potable",
    "Ils fertilisent très bien toutes les plantes",
    "Ils se dissolvent complètement à chaque pluie",
    "Compare un emballage à une feuille d’arbre.",
    "Beaucoup de plastiques se dégradent très lentement dans la nature."
  ],
  "it": [
    "Perché non si devono lasciare comuni imballaggi di plastica nella natura?",
    "Possono restare come rifiuti per molto tempo",
    "Diventano subito acqua potabile",
    "Concimano benissimo tutte le piante",
    "Si sciolgono completamente a ogni pioggia",
    "Confronta un imballaggio con una foglia.",
    "Molte plastiche si degradano molto lentamente in natura."
  ]
},
{
  "key": "3/science/licht-schatten/ls11",
  "reason": "Distinguish primary light colours from paint mixing.",
  "de": [
    "Welche drei Farben werden als Grundfarben beim Mischen von Licht verwendet?",
    "Rot, Grün und Blau",
    "Rot, Gelb und Blau",
    "Schwarz, Weiss und Grau",
    "Orange, Braun und Rosa",
    "Denke an die farbigen Lichtpunkte eines Bildschirms.",
    "Hier geht es um Licht, nicht um Wasserfarben."
  ],
  "en": [
    "Which three colours are used as the primary colours for mixing light?",
    "Red, green and blue",
    "Red, yellow and blue",
    "Black, white and grey",
    "Orange, brown and pink",
    "Think of the coloured light points in a screen.",
    "This is about light, not paint."
  ],
  "fr": [
    "Quelles sont les trois couleurs primaires pour mélanger la lumière ?",
    "Rouge, vert et bleu",
    "Rouge, jaune et bleu",
    "Noir, blanc et gris",
    "Orange, brun et rose",
    "Pense aux points lumineux colorés d’un écran.",
    "Il s’agit de lumière, pas de peinture."
  ],
  "it": [
    "Quali sono i tre colori primari per mescolare la luce?",
    "Rosso, verde e blu",
    "Rosso, giallo e blu",
    "Nero, bianco e grigio",
    "Arancione, marrone e rosa",
    "Pensa ai punti luminosi colorati di uno schermo.",
    "Si parla di luce, non di pittura."
  ]
},
{
  "key": "3/science/licht-schatten/ls15",
  "reason": "Use a concrete magnetic-material choice rather than a fixed three-metal list.",
  "de": [
    "Welcher Gegenstand wird von einem üblichen Magneten stark angezogen?",
    "Ein Nagel aus Eisen",
    "Ein Holzlöffel",
    "Ein Glasbecher",
    "Ein Radiergummi",
    "Das Material des Gegenstands ist entscheidend.",
    "Nicht alle Metalle reagieren gleich auf einen Magneten."
  ],
  "en": [
    "Which object is strongly attracted by an ordinary magnet?",
    "An iron nail",
    "A wooden spoon",
    "A glass cup",
    "An eraser",
    "The object’s material matters.",
    "Not all metals react in the same way to a magnet."
  ],
  "fr": [
    "Quel objet est fortement attiré par un aimant ordinaire ?",
    "Un clou en fer",
    "Une cuillère en bois",
    "Un verre",
    "Une gomme",
    "Le matériau de l’objet est important.",
    "Tous les métaux ne réagissent pas de la même façon à un aimant."
  ],
  "it": [
    "Quale oggetto è fortemente attratto da una comune calamita?",
    "Un chiodo di ferro",
    "Un cucchiaio di legno",
    "Un bicchiere di vetro",
    "Una gomma",
    "Conta il materiale dell’oggetto.",
    "Non tutti i metalli reagiscono allo stesso modo a una calamita."
  ]
},
{
  "key": "3/science/umwelt-nachhaltigkeit/un13",
  "reason": "Recognise harmful water pollution instead of writing a definition.",
  "de": [
    "Was ist ein Beispiel für Wasserverschmutzung?",
    "Schädliche Stoffe gelangen in einen Fluss",
    "Regen fällt in einen sauberen See",
    "Wasser gefriert zu Eis",
    "Wasser verdunstet in der Sonne",
    "Achte darauf, ob etwas Lebewesen im Wasser schaden kann.",
    "Es geht nicht um einen natürlichen Wechsel des Wasserzustands."
  ],
  "en": [
    "Which is an example of water pollution?",
    "Harmful substances enter a river",
    "Rain falls into a clean lake",
    "Water freezes into ice",
    "Water evaporates in sunlight",
    "Look for something that could harm living things in water.",
    "It is not a natural change in the state of water."
  ],
  "fr": [
    "Quel est un exemple de pollution de l’eau ?",
    "Des substances nocives arrivent dans une rivière",
    "La pluie tombe dans un lac propre",
    "L’eau gèle",
    "L’eau s’évapore au soleil",
    "Cherche ce qui peut nuire aux êtres vivants dans l’eau.",
    "Ce n’est pas un changement naturel de l’état de l’eau."
  ],
  "it": [
    "Qual è un esempio di inquinamento dell’acqua?",
    "Sostanze nocive entrano in un fiume",
    "La pioggia cade in un lago pulito",
    "L’acqua diventa ghiaccio",
    "L’acqua evapora al sole",
    "Cerca qualcosa che può danneggiare gli esseri viventi nell’acqua.",
    "Non si tratta di un cambiamento naturale di stato dell’acqua."
  ]
},
{
  "key": "3/science/umwelt-nachhaltigkeit/un19",
  "reason": "Specify battery-electric drive, avoiding an overbroad hybrid claim.",
  "de": [
    "Was treibt ein reines Batterie-Elektroauto an?",
    "Ein Elektromotor mit Strom aus der Batterie",
    "Ein Benzinmotor mit Benzin aus dem Tank",
    "Ein Segel auf dem Dach",
    "Ein Pedalantrieb wie beim Velo",
    "Beim Laden wird Energie in einer Batterie gespeichert.",
    "Der Motor nutzt diese gespeicherte Energie."
  ],
  "en": [
    "What drives a fully battery-electric car?",
    "An electric motor using power from the battery",
    "A petrol engine using petrol from a tank",
    "A sail on the roof",
    "Pedals like those on a bicycle",
    "Charging stores energy in a battery.",
    "The motor uses this stored energy."
  ],
  "fr": [
    "Qu’est-ce qui fait avancer une voiture entièrement électrique à batterie ?",
    "Un moteur électrique alimenté par la batterie",
    "Un moteur à essence alimenté par un réservoir",
    "Une voile sur le toit",
    "Des pédales comme sur un vélo",
    "La recharge stocke de l’énergie dans une batterie.",
    "Le moteur utilise cette énergie stockée."
  ],
  "it": [
    "Cosa fa muovere un’auto interamente elettrica a batteria?",
    "Un motore elettrico alimentato dalla batteria",
    "Un motore a benzina alimentato dal serbatoio",
    "Una vela sul tetto",
    "Pedali come quelli di una bicicletta",
    "La ricarica immagazzina energia nella batteria.",
    "Il motore usa questa energia accumulata."
  ]
},
{
  "key": "3/science/demokratie/dk15",
  "reason": "Recognise flag colours without fixed phrase entry.",
  "de": [
    "Welche Farben hat die Schweizer Fahne?",
    "Rot und Weiss",
    "Blau und Gelb",
    "Grün und Weiss",
    "Rot und Schwarz",
    "Denke an das Kreuz auf der Fahne.",
    "Das helle Kreuz steht auf einem farbigen Hintergrund."
  ],
  "en": [
    "What colours are on the Swiss flag?",
    "Red and white",
    "Blue and yellow",
    "Green and white",
    "Red and black",
    "Think of the cross on the flag.",
    "The light-coloured cross is on a coloured background."
  ],
  "fr": [
    "Quelles sont les couleurs du drapeau suisse ?",
    "Rouge et blanc",
    "Bleu et jaune",
    "Vert et blanc",
    "Rouge et noir",
    "Pense à la croix du drapeau.",
    "La croix claire est sur un fond coloré."
  ],
  "it": [
    "Quali sono i colori della bandiera svizzera?",
    "Rosso e bianco",
    "Blu e giallo",
    "Verde e bianco",
    "Rosso e nero",
    "Pensa alla croce sulla bandiera.",
    "La croce chiara si trova su uno sfondo colorato."
  ]
},
{
  "key": "3/science/demokratie/dk17",
  "reason": "Explain press freedom through government criticism without implying no legal limits.",
  "de": [
    "Was gehört zur Pressefreiheit?",
    "Zeitungen dürfen die Regierung kritisch hinterfragen",
    "Die Regierung muss jeden Artikel vorher erlauben",
    "Nur die Regierung darf Nachrichten schreiben",
    "Zeitungen dürfen nie über Politik berichten",
    "Eine freie Presse kontrolliert auch Menschen mit Macht.",
    "Sie darf Missstände ansprechen, ohne vorher um politische Erlaubnis zu bitten."
  ],
  "en": [
    "What is part of freedom of the press?",
    "Newspapers may critically question the government",
    "The government must approve every article first",
    "Only the government may write news",
    "Newspapers may never report on politics",
    "A free press also examines people in power.",
    "It can discuss problems without first asking for political permission."
  ],
  "fr": [
    "Que permet la liberté de la presse ?",
    "Les journaux peuvent critiquer le gouvernement",
    "Le gouvernement doit autoriser chaque article",
    "Seul le gouvernement peut écrire les nouvelles",
    "Les journaux ne peuvent jamais parler de politique",
    "Une presse libre examine aussi les personnes au pouvoir.",
    "Elle peut signaler des problèmes sans autorisation politique préalable."
  ],
  "it": [
    "Che cosa permette la libertà di stampa?",
    "I giornali possono criticare il governo",
    "Il governo deve autorizzare prima ogni articolo",
    "Solo il governo può scrivere notizie",
    "I giornali non possono mai parlare di politica",
    "La stampa libera controlla anche chi ha potere.",
    "Può segnalare problemi senza chiedere prima un permesso politico."
  ]
},
{
  "key": "3/science/demokratie/dk19",
  "reason": "Recognise a binding state rule rather than memorise an imprecise definition.",
  "de": [
    "Was ist ein Gesetz?",
    "Eine verbindliche Regel des Staates",
    "Ein unverbindlicher Wunsch einer Person",
    "Eine Wettervorhersage",
    "Eine erfundene Geschichte",
    "Ein Gesetz regelt das Zusammenleben.",
    "Wer dagegen verstösst, kann rechtliche Folgen erleben."
  ],
  "en": [
    "What is a law?",
    "A binding rule made by the state",
    "One person’s optional wish",
    "A weather forecast",
    "An invented story",
    "A law helps regulate how people live together.",
    "Breaking it can have legal consequences."
  ],
  "fr": [
    "Qu’est-ce qu’une loi ?",
    "Une règle obligatoire de l’État",
    "Un souhait sans obligation d’une personne",
    "Une prévision météo",
    "Une histoire inventée",
    "Une loi organise la vie en société.",
    "La transgresser peut avoir des conséquences juridiques."
  ],
  "it": [
    "Che cos’è una legge?",
    "Una regola vincolante dello Stato",
    "Un desiderio personale senza obblighi",
    "Una previsione del tempo",
    "Una storia inventata",
    "Una legge regola la convivenza.",
    "Violarla può avere conseguenze giuridiche."
  ]
},
{
  "key": "3/science/demokratie/dk22",
  "reason": "Make representative decision-making directly recognisable.",
  "de": [
    "Wie werden in einer repräsentativen Demokratie viele politische Entscheidungen getroffen?",
    "Gewählte Vertreter entscheiden im Parlament",
    "Eine Königin entscheidet alles allein",
    "Alle Entscheidungen werden gewürfelt",
    "Nur die reichste Person entscheidet",
    "Die Stimmberechtigten wählen Personen, die sie vertreten.",
    "Diese beraten und stimmen über politische Fragen ab."
  ],
  "en": [
    "How are many political decisions made in a representative democracy?",
    "Elected representatives decide in parliament",
    "A queen decides everything alone",
    "Every decision is made by rolling dice",
    "Only the richest person decides",
    "Eligible voters elect people to represent them.",
    "These people discuss and vote on political issues."
  ],
  "fr": [
    "Comment prend-on beaucoup de décisions dans une démocratie représentative ?",
    "Des représentants élus décident au parlement",
    "Une reine décide de tout toute seule",
    "On décide tout avec des dés",
    "Seule la personne la plus riche décide",
    "Les électeurs choisissent des personnes pour les représenter.",
    "Ces personnes discutent et votent sur les questions politiques."
  ],
  "it": [
    "Come si prendono molte decisioni in una democrazia rappresentativa?",
    "Rappresentanti eletti decidono in parlamento",
    "Una regina decide tutto da sola",
    "Si decide tutto tirando i dadi",
    "Decide solo la persona più ricca",
    "Gli elettori scelgono persone che li rappresentino.",
    "Queste discutono e votano sulle questioni politiche."
  ]
},
{
  "key": "3/science/demokratie/dk43",
  "reason": "Avoid multiple valid nouns and clarify democratic participation.",
  "de": [
    "Was gehört zu einer Demokratie?",
    "Stimmberechtigte können ihre politischen Vertreter wählen",
    "Eine Person bestimmt ohne Wahlen alles allein",
    "Politische Meinungen dürfen nie verschieden sein",
    "Niemand darf die Regierung kritisieren",
    "Menschen können an politischen Entscheidungen mitwirken.",
    "Dabei ist eine freie Wahl wichtig."
  ],
  "en": [
    "What is part of a democracy?",
    "Eligible voters can elect political representatives",
    "One person decides everything without elections",
    "Political opinions must never differ",
    "Nobody may criticise the government",
    "People can take part in political decisions.",
    "Free elections are important."
  ],
  "fr": [
    "Qu’est-ce qui fait partie d’une démocratie ?",
    "Les électeurs peuvent choisir leurs représentants",
    "Une personne décide de tout sans élections",
    "Les opinions politiques ne peuvent jamais différer",
    "Personne ne peut critiquer le gouvernement",
    "Les personnes peuvent participer aux décisions politiques.",
    "Des élections libres sont importantes."
  ],
  "it": [
    "Che cosa fa parte di una democrazia?",
    "Gli elettori possono scegliere i rappresentanti politici",
    "Una persona decide tutto senza elezioni",
    "Le opinioni politiche non possono mai essere diverse",
    "Nessuno può criticare il governo",
    "Le persone possono partecipare alle decisioni politiche.",
    "Sono importanti le elezioni libere."
  ]
},
{
  "key": "3/science/energie/en11",
  "reason": "Avoid claiming every energy-saving action has identical carbon effects.",
  "de": [
    "Warum ist es sinnvoll, unnötigen Energieverbrauch zu vermeiden?",
    "Wir schonen Energieressourcen",
    "Dann brauchen alle Geräte mehr Strom",
    "Dann entstehen automatisch neue Rohstoffe",
    "Dann können wir jedes Licht immer anlassen",
    "Auch die Bereitstellung von Energie braucht Mittel und Anlagen.",
    "Was wir nicht unnötig verbrauchen, müssen wir nicht zusätzlich bereitstellen."
  ],
  "en": [
    "Why is it sensible to avoid wasting energy?",
    "We conserve energy resources",
    "All devices then need more electricity",
    "New raw materials appear automatically",
    "We can leave every light on forever",
    "Providing energy requires resources and equipment.",
    "Energy we do not waste does not need to be provided unnecessarily."
  ],
  "fr": [
    "Pourquoi est-il utile d’éviter de gaspiller l’énergie ?",
    "Nous préservons les ressources énergétiques",
    "Tous les appareils consomment alors plus",
    "De nouvelles matières premières apparaissent",
    "Nous pouvons laisser toutes les lumières allumées",
    "Fournir de l’énergie nécessite des ressources et des installations.",
    "L’énergie non gaspillée n’a pas besoin d’être fournie inutilement."
  ],
  "it": [
    "Perché è utile evitare sprechi di energia?",
    "Conserviamo le risorse energetiche",
    "Tutti gli apparecchi consumano più corrente",
    "Compaiono automaticamente nuove materie prime",
    "Possiamo lasciare sempre accese tutte le luci",
    "Fornire energia richiede risorse e impianti.",
    "L’energia non sprecata non deve essere fornita inutilmente."
  ]
},
{
  "key": "3/science/energie/en38",
  "reason": "Replace secondary-level Ohm formula recall with age-appropriate circuit reasoning.",
  "de": [
    "Der Schalter unterbricht den Stromkreis einer Batterielampe. Was passiert?",
    "Die Lampe geht aus",
    "Die Lampe leuchtet heller",
    "Die Batterie wird dadurch immer voller",
    "Die Lampe wird zu einem Magneten",
    "Strom kann nur durch einen geschlossenen Weg fliessen.",
    "Überlege, was eine Unterbrechung mit diesem Weg macht."
  ],
  "en": [
    "A switch breaks a battery lamp’s circuit. What happens?",
    "The lamp goes out",
    "The lamp shines brighter",
    "The battery keeps getting fuller",
    "The lamp becomes a magnet",
    "Current needs a closed path to flow.",
    "Think about what a break does to this path."
  ],
  "fr": [
    "Un interrupteur ouvre le circuit d’une lampe à pile. Que se passe-t-il ?",
    "La lampe s’éteint",
    "La lampe brille plus fort",
    "La pile se recharge sans cesse",
    "La lampe devient un aimant",
    "Le courant a besoin d’un trajet fermé.",
    "Réfléchis à l’effet d’une coupure sur ce trajet."
  ],
  "it": [
    "Un interruttore interrompe il circuito di una lampada a batteria. Cosa succede?",
    "La lampada si spegne",
    "La lampada brilla di più",
    "La batteria si ricarica sempre di più",
    "La lampada diventa una calamita",
    "La corrente ha bisogno di un percorso chiuso.",
    "Pensa all’effetto di un’interruzione sul percorso."
  ]
},
{
  "key": "3/science/energie/en39",
  "reason": "Remove ambiguous circuit-completion alternatives and identify the lamp’s role safely.",
  "de": [
    "Welches Teil wandelt in einer einfachen Batterielampe elektrische Energie in Licht um?",
    "Das Lämpchen",
    "Das Kunststoffgehäuse",
    "Der ausgeschaltete Schalter",
    "Die Verpackung",
    "Denke an das Teil, das beim Einschalten hell wird.",
    "Es ist nicht die Hülle oder die Verpackung."
  ],
  "en": [
    "Which part of a simple battery lamp turns electrical energy into light?",
    "The bulb",
    "The plastic casing",
    "The switch when it is off",
    "The packaging",
    "Think of the part that lights up when switched on.",
    "It is not the casing or the packaging."
  ],
  "fr": [
    "Quelle partie d’une lampe à pile transforme l’énergie électrique en lumière ?",
    "L’ampoule",
    "Le boîtier en plastique",
    "L’interrupteur en position arrêt",
    "L’emballage",
    "Pense à la partie qui s’éclaire quand on allume.",
    "Ce n’est ni le boîtier ni l’emballage."
  ],
  "it": [
    "Quale parte di una lampada a batteria trasforma l’energia elettrica in luce?",
    "La lampadina",
    "L’involucro di plastica",
    "L’interruttore spento",
    "La confezione",
    "Pensa alla parte che si illumina all’accensione.",
    "Non è l’involucro né la confezione."
  ]
},
{
  "key": "3/science/uhr-24h-gr3/u24h35",
  "reason": "Recognise time wording without exact phrase entry.",
  "de": [
    "Wie sagt man 10:45 auch?",
    "Viertel vor elf",
    "Viertel nach zehn",
    "Halb elf",
    "Viertel vor zehn",
    "Bis elf Uhr fehlen noch einige Minuten.",
    "Eine Viertelstunde dauert 15 Minuten."
  ],
  "en": [
    "How else can you say 10:45?",
    "Quarter to eleven",
    "Quarter past ten",
    "Half past ten",
    "Quarter to ten",
    "There are still a few minutes until eleven.",
    "A quarter of an hour is 15 minutes."
  ],
  "fr": [
    "Comment peut-on dire 10 h 45 ?",
    "Onze heures moins le quart",
    "Dix heures et quart",
    "Dix heures et demie",
    "Dix heures moins le quart",
    "Il reste quelques minutes avant onze heures.",
    "Un quart d’heure dure 15 minutes."
  ],
  "it": [
    "Come si possono dire le 10:45?",
    "Le undici meno un quarto",
    "Le dieci e un quarto",
    "Le dieci e mezza",
    "Le dieci meno un quarto",
    "Mancano alcuni minuti alle undici.",
    "Un quarto d’ora dura 15 minuti."
  ]
},
{
  "key": "3/science/kalender-gr3/kd40",
  "reason": "Avoid requiring a pope’s full name, numeral and date in one typed answer.",
  "de": [
    "Nach welchem Papst ist der gregorianische Kalender benannt?",
    "Gregor XIII.",
    "Franziskus",
    "Johannes Paul II.",
    "Benedikt XVI.",
    "Achte auf den Namen des Kalenders.",
    "Der gesuchte Name klingt ähnlich wie gregorianisch."
  ],
  "en": [
    "Which pope is the Gregorian calendar named after?",
    "Gregory XIII",
    "Francis",
    "John Paul II",
    "Benedict XVI",
    "Look at the calendar’s name.",
    "The name you need sounds like Gregorian."
  ],
  "fr": [
    "Quel pape a donné son nom au calendrier grégorien ?",
    "Grégoire XIII",
    "François",
    "Jean-Paul II",
    "Benoît XVI",
    "Observe le nom du calendrier.",
    "Le nom recherché ressemble à grégorien."
  ],
  "it": [
    "Da quale papa prende il nome il calendario gregoriano?",
    "Gregorio XIII",
    "Francesco",
    "Giovanni Paolo II",
    "Benedetto XVI",
    "Osserva il nome del calendario.",
    "Il nome cercato assomiglia a gregoriano."
  ]
},
{
  "key": "3/science/kalender-gr3/kd46",
  "reason": "Recognise the English historical date abbreviation without exact translation entry.",
  "de": [
    "Was bedeutet BC bei einer englischen Jahreszahl?",
    "Before Christ, also vor Christus",
    "After Christ, also nach Christus",
    "Beginning of Century, also Jahrhundertbeginn",
    "British Calendar, also britischer Kalender",
    "Diese Abkürzung wird für sehr frühe Jahreszahlen verwendet.",
    "Das erste Wort sagt, dass die Jahreszahl vor einem Bezugspunkt liegt."
  ],
  "en": [
    "What does BC mean next to a year?",
    "Before Christ",
    "After Christ",
    "Beginning of Century",
    "British Calendar",
    "This abbreviation is used for very early dates.",
    "The first word places the year before a reference point."
  ],
  "fr": [
    "Que signifie BC à côté d’une année en anglais ?",
    "Before Christ, donc avant Jésus-Christ",
    "After Christ, donc après Jésus-Christ",
    "Beginning of Century, donc début du siècle",
    "British Calendar, donc calendrier britannique",
    "Cette abréviation accompagne des dates très anciennes.",
    "Le premier mot situe la date avant un point de référence."
  ],
  "it": [
    "Cosa significa BC accanto a un anno in inglese?",
    "Before Christ, cioè avanti Cristo",
    "After Christ, cioè dopo Cristo",
    "Beginning of Century, cioè inizio del secolo",
    "British Calendar, cioè calendario britannico",
    "Questa abbreviazione si usa per date molto antiche.",
    "La prima parola colloca l’anno prima di un punto di riferimento."
  ]
},
{
  "key": "3/science/raeume-karte/karte_norm_6",
  "reason": "Recognise map perspective without exact descriptive phrase entry.",
  "de": [
    "Wie zeigt eine gewöhnliche Landkarte ein Gebiet?",
    "Von oben und verkleinert",
    "Von unten und in echter Grösse",
    "Nur als Foto eines einzelnen Hauses",
    "Immer grösser als das wirkliche Gebiet",
    "Viele Orte passen auf ein kleines Blatt.",
    "Stell dir vor, du blickst aus grosser Höhe auf die Landschaft."
  ],
  "en": [
    "How does an ordinary map show an area?",
    "From above and at a smaller scale",
    "From below and at actual size",
    "Only as a photo of one house",
    "Always larger than the real area",
    "Many places fit on a small sheet.",
    "Imagine looking down on the landscape from high above."
  ],
  "fr": [
    "Comment une carte ordinaire représente-t-elle un territoire ?",
    "Vu d’en haut et à une échelle réduite",
    "Vu d’en bas et en taille réelle",
    "Uniquement par la photo d’une maison",
    "Toujours plus grand que le vrai territoire",
    "De nombreux lieux tiennent sur une petite feuille.",
    "Imagine regarder le paysage depuis très haut."
  ],
  "it": [
    "Come rappresenta un territorio una carta geografica comune?",
    "Dall’alto e in scala ridotta",
    "Dal basso e a grandezza reale",
    "Solo come foto di una casa",
    "Sempre più grande del territorio reale",
    "Molti luoghi stanno su un piccolo foglio.",
    "Immagina di guardare il paesaggio dall’alto."
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
