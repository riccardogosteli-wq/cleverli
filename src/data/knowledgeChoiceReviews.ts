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

{
  "key": "4/science/koerper-gesundheit/g4kg1c",
  "reason": "Recognise joint function rather than reproduce a definition.",
  "de": [
    "Was ermöglicht ein Gelenk am Knie?",
    "Das Bein zu beugen",
    "Nahrung zu verdauen",
    "Blut herzustellen",
    "Gerüche wahrzunehmen",
    "Denke an das Treppensteigen.",
    "Beobachte, was dein Knie beim Hinsetzen macht."
  ],
  "en": [
    "What does the knee joint allow you to do?",
    "Bend your leg",
    "Digest food",
    "Make blood",
    "Detect smells",
    "Think about climbing stairs.",
    "Notice what your knee does when you sit down."
  ],
  "fr": [
    "Que permet l’articulation du genou ?",
    "De plier la jambe",
    "De digérer les aliments",
    "De fabriquer le sang",
    "De percevoir les odeurs",
    "Pense à la montée des escaliers.",
    "Observe ton genou lorsque tu t’assieds."
  ],
  "it": [
    "Che cosa permette l’articolazione del ginocchio?",
    "Piegare la gamba",
    "Digerire il cibo",
    "Produrre il sangue",
    "Percepire gli odori",
    "Pensa a quando sali le scale.",
    "Osserva il ginocchio quando ti siedi."
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg1g",
  "reason": "Recognise white blood cell function with distinct biological distractors.",
  "de": [
    "Welche Aufgabe haben weisse Blutkörperchen?",
    "Krankheitserreger bekämpfen",
    "Knochen miteinander verbinden",
    "Nahrung im Magen zerkleinern",
    "Licht im Auge wahrnehmen",
    "Denke daran, was bei einer Infektion geschieht.",
    "Der Körper braucht Schutz vor schädlichen Eindringlingen."
  ],
  "en": [
    "What do white blood cells do?",
    "Fight germs",
    "Connect bones",
    "Break down food in the stomach",
    "Detect light in the eye",
    "Think about an infection.",
    "The body needs protection from harmful invaders."
  ],
  "fr": [
    "Quel est le rôle des globules blancs ?",
    "Combattre les microbes",
    "Relier les os",
    "Décomposer les aliments dans l’estomac",
    "Détecter la lumière dans l’œil",
    "Pense à une infection.",
    "Le corps doit se protéger des intrus dangereux."
  ],
  "it": [
    "Qual è il compito dei globuli bianchi?",
    "Combattere i germi",
    "Collegare le ossa",
    "Scomporre il cibo nello stomaco",
    "Percepire la luce nell’occhio",
    "Pensa a un’infezione.",
    "Il corpo deve proteggersi dagli intrusi dannosi."
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg1k",
  "reason": "Recognise brain function without memorised list entry.",
  "de": [
    "Welche Aufgabe übernimmt dein Gehirn?",
    "Informationen verarbeiten und Bewegungen steuern",
    "Blut durch die Adern pumpen",
    "Sauerstoff aus der Luft aufnehmen",
    "Nahrung im Magen mischen",
    "Denke an das Lösen eines Rätsels.",
    "Auch beim bewussten Heben deiner Hand ist es beteiligt."
  ],
  "en": [
    "What does your brain do?",
    "Process information and control movements",
    "Pump blood through vessels",
    "Take oxygen from the air",
    "Mix food in the stomach",
    "Think about solving a puzzle.",
    "It is also involved when you choose to raise your hand."
  ],
  "fr": [
    "Quel est le rôle de ton cerveau ?",
    "Traiter les informations et commander les mouvements",
    "Pomper le sang dans les vaisseaux",
    "Prélever l’oxygène de l’air",
    "Mélanger les aliments dans l’estomac",
    "Pense à la résolution d’une énigme.",
    "Il intervient aussi lorsque tu décides de lever la main."
  ],
  "it": [
    "Qual è il compito del cervello?",
    "Elaborare informazioni e controllare i movimenti",
    "Pompare sangue nei vasi",
    "Prelevare ossigeno dall’aria",
    "Mescolare il cibo nello stomaco",
    "Pensa a quando risolvi un indovinello.",
    "Interviene anche quando decidi di alzare la mano."
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg2a",
  "reason": "Choose the systemic circulation route instead of typing an arrow sequence.",
  "de": [
    "Welchen Weg nimmt das Blut im Körperkreislauf?",
    "Vom Herzen zum Körper und zurück zum Herzen",
    "Vom Magen in den Darm und zurück zum Magen",
    "Von der Nase zur Lunge und durch den Mund hinaus",
    "Vom Herzen in die Knochen und dort bleibt es",
    "Ein Kreislauf endet wieder an seinem Ausgangspunkt.",
    "Überlege, welches Organ das Blut antreibt."
  ],
  "en": [
    "Which route does blood take in the body’s systemic circulation?",
    "From the heart to the body and back to the heart",
    "From the stomach to the intestine and back",
    "From the nose to the lungs and out through the mouth",
    "From the heart into the bones, where it stays",
    "A circuit returns to its starting point.",
    "Think about which organ drives the blood."
  ],
  "fr": [
    "Quel trajet suit le sang dans la grande circulation ?",
    "Du cœur vers le corps, puis retour au cœur",
    "De l’estomac à l’intestin, puis retour à l’estomac",
    "Du nez aux poumons, puis sortie par la bouche",
    "Du cœur vers les os, où il reste",
    "Un circuit revient à son point de départ.",
    "Quel organe fait circuler le sang ?"
  ],
  "it": [
    "Quale percorso segue il sangue nella grande circolazione?",
    "Dal cuore al corpo e di nuovo al cuore",
    "Dallo stomaco all’intestino e ritorno",
    "Dal naso ai polmoni e fuori dalla bocca",
    "Dal cuore alle ossa, dove rimane",
    "Un circuito torna al punto di partenza.",
    "Quale organo fa circolare il sangue?"
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg2c",
  "reason": "Clarify digestion as breakdown into usable nutrients.",
  "de": [
    "Was geschieht bei der Verdauung?",
    "Nahrung wird in kleinere, nutzbare Bestandteile zerlegt",
    "Luft wird in den Lungen erwärmt",
    "Knochen werden durch Gelenke bewegt",
    "Licht wird in den Augen erkannt",
    "Denke an den Weg eines Bissens durch deinen Körper.",
    "Der Körper muss an die Nährstoffe gelangen."
  ],
  "en": [
    "What happens during digestion?",
    "Food is broken into smaller parts the body can use",
    "Air is warmed in the lungs",
    "Joints move bones",
    "The eyes detect light",
    "Think about the journey of a bite of food.",
    "The body needs to obtain the nutrients."
  ],
  "fr": [
    "Que se passe-t-il pendant la digestion ?",
    "Les aliments sont décomposés en éléments utilisables",
    "L’air est réchauffé dans les poumons",
    "Les articulations font bouger les os",
    "Les yeux détectent la lumière",
    "Pense au trajet d’une bouchée dans ton corps.",
    "Le corps doit pouvoir utiliser les nutriments."
  ],
  "it": [
    "Che cosa succede durante la digestione?",
    "Il cibo viene scomposto in parti utilizzabili",
    "L’aria viene riscaldata nei polmoni",
    "Le articolazioni muovono le ossa",
    "Gli occhi percepiscono la luce",
    "Pensa al percorso di un boccone nel corpo.",
    "Il corpo deve poter utilizzare le sostanze nutritive."
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg2e",
  "reason": "Recognise immune defence without exact explanatory wording.",
  "de": [
    "Wobei hilft das Immunsystem?",
    "Beim Schutz vor Krankheitserregern",
    "Beim Sehen von Farben",
    "Beim Zerkauen mit den Zähnen",
    "Beim Tragen des Körpers durch Knochen",
    "Denke an eine Erkältung.",
    "Verschiedene Teile des Körpers arbeiten gegen eine Infektion zusammen."
  ],
  "en": [
    "What does the immune system help with?",
    "Protection against germs",
    "Seeing colours",
    "Chewing with your teeth",
    "Supporting the body with bones",
    "Think about a cold.",
    "Different parts of the body work together against an infection."
  ],
  "fr": [
    "À quoi sert le système immunitaire ?",
    "À se protéger des microbes",
    "À voir les couleurs",
    "À mâcher avec les dents",
    "À soutenir le corps grâce aux os",
    "Pense à un rhume.",
    "Plusieurs parties du corps luttent ensemble contre une infection."
  ],
  "it": [
    "A che cosa serve il sistema immunitario?",
    "A proteggersi dai germi",
    "A vedere i colori",
    "A masticare con i denti",
    "A sostenere il corpo con le ossa",
    "Pensa a un raffreddore.",
    "Diverse parti del corpo collaborano contro un’infezione."
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg2i",
  "reason": "Narrow liver definition to one recognisable function.",
  "de": [
    "Welche Aufgabe hat die Leber?",
    "Viele schädliche Stoffe abbauen",
    "Blut durch den Körper pumpen",
    "Gedanken und Erinnerungen verarbeiten",
    "Luft in die Lunge leiten",
    "Sie verarbeitet Stoffe aus dem Blut.",
    "Nicht alles, was in den Körper gelangt, ist nützlich."
  ],
  "en": [
    "What is one function of the liver?",
    "Break down many harmful substances",
    "Pump blood around the body",
    "Process thoughts and memories",
    "Carry air into the lungs",
    "It processes substances from the blood.",
    "Not everything that enters the body is useful."
  ],
  "fr": [
    "Quel est l’un des rôles du foie ?",
    "Décomposer de nombreuses substances nocives",
    "Pomper le sang dans le corps",
    "Traiter les pensées et les souvenirs",
    "Conduire l’air aux poumons",
    "Il traite des substances présentes dans le sang.",
    "Tout ce qui entre dans le corps n’est pas utile."
  ],
  "it": [
    "Qual è uno dei compiti del fegato?",
    "Scomporre molte sostanze dannose",
    "Pompare il sangue nel corpo",
    "Elaborare pensieri e ricordi",
    "Condurre l’aria ai polmoni",
    "Elabora sostanze presenti nel sangue.",
    "Non tutto ciò che entra nel corpo è utile."
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg2k",
  "reason": "Recognise calcium role rather than type a paired noun phrase.",
  "de": [
    "Wofür ist Calcium besonders wichtig?",
    "Für feste Knochen und Zähne",
    "Für die Farbe der Haare",
    "Für den Geruch des Schweisses",
    "Für die Länge der Wimpern",
    "Denke an die harten Teile deines Körpers.",
    "Dieser Mineralstoff hilft beim Aufbau des Skeletts."
  ],
  "en": [
    "What is calcium especially important for?",
    "Strong bones and teeth",
    "Hair colour",
    "The smell of sweat",
    "The length of eyelashes",
    "Think of the hard parts of your body.",
    "This mineral helps build the skeleton."
  ],
  "fr": [
    "Pour quoi le calcium est-il particulièrement important ?",
    "Des os et des dents solides",
    "La couleur des cheveux",
    "L’odeur de la sueur",
    "La longueur des cils",
    "Pense aux parties dures de ton corps.",
    "Ce minéral aide à construire le squelette."
  ],
  "it": [
    "Per che cosa è particolarmente importante il calcio?",
    "Ossa e denti forti",
    "Il colore dei capelli",
    "L’odore del sudore",
    "La lunghezza delle ciglia",
    "Pensa alle parti dure del corpo.",
    "Questo minerale aiuta a costruire lo scheletro."
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg2m",
  "reason": "Clarify pulse as the pressure wave caused by heartbeat.",
  "de": [
    "Was spürst du beim Pulsmessen am Handgelenk?",
    "Den regelmässigen Druck des Blutes durch den Herzschlag",
    "Das Wachsen der Knochen",
    "Das Öffnen der Lunge",
    "Die Bewegung der Nahrung im Darm",
    "Lege zwei Finger sanft an dein Handgelenk.",
    "Nach dem Rennen ist dieses Klopfen oft schneller."
  ],
  "en": [
    "What do you feel when checking your wrist pulse?",
    "Regular blood pressure waves caused by the heartbeat",
    "Bones growing",
    "The lungs opening",
    "Food moving through the intestine",
    "Place two fingers gently on your wrist.",
    "After running, this throbbing is often faster."
  ],
  "fr": [
    "Que sens-tu en prenant ton pouls au poignet ?",
    "Les pulsations du sang provoquées par les battements du cœur",
    "La croissance des os",
    "L’ouverture des poumons",
    "Le déplacement des aliments dans l’intestin",
    "Pose doucement deux doigts sur ton poignet.",
    "Après une course, ces pulsations sont souvent plus rapides."
  ],
  "it": [
    "Che cosa senti misurando il polso?",
    "Le pulsazioni del sangue provocate dal battito cardiaco",
    "La crescita delle ossa",
    "L’apertura dei polmoni",
    "Il movimento del cibo nell’intestino",
    "Appoggia delicatamente due dita sul polso.",
    "Dopo una corsa queste pulsazioni sono spesso più rapide."
  ]
},
{
  "key": "4/science/koerper-gesundheit/g4kg2o",
  "reason": "Recognise tendon connection with anatomically distinct alternatives.",
  "de": [
    "Was verbindet eine Sehne?",
    "Einen Muskel mit einem Knochen",
    "Zwei Blutgefässe miteinander",
    "Den Mund mit dem Magen",
    "Die Nase mit den Ohren",
    "Denke daran, wie Muskelkraft auf das Skelett wirkt.",
    "Beim Anspannen wird der Zug weitergegeben."
  ],
  "en": [
    "What does a tendon connect?",
    "A muscle to a bone",
    "Two blood vessels",
    "The mouth to the stomach",
    "The nose to the ears",
    "Think about how muscle force acts on the skeleton.",
    "When a muscle tightens, its pull is passed on."
  ],
  "fr": [
    "Que relie un tendon ?",
    "Un muscle à un os",
    "Deux vaisseaux sanguins",
    "La bouche à l’estomac",
    "Le nez aux oreilles",
    "Pense à l’action de la force musculaire sur le squelette.",
    "Lorsqu’un muscle se contracte, sa traction est transmise."
  ],
  "it": [
    "Che cosa collega un tendine?",
    "Un muscolo a un osso",
    "Due vasi sanguigni",
    "La bocca allo stomaco",
    "Il naso alle orecchie",
    "Pensa a come la forza muscolare agisce sullo scheletro.",
    "Quando un muscolo si contrae, la sua trazione viene trasmessa."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr1a",
  "reason": "Recognise habitat through a concrete example.",
  "de": [
    "Welcher Ort ist ein natürlicher Lebensraum für einen Frosch?",
    "Ein Teich mit Uferpflanzen",
    "Ein trockener Vorratsschrank",
    "Ein verschlossener Kühlschrank",
    "Ein staubiger Dachboden",
    "Überlege, wo Frösche Nahrung und Schutz finden.",
    "Auch ihre Kaulquappen müssen dort leben können."
  ],
  "en": [
    "Which place is a natural habitat for a frog?",
    "A pond with plants along its edge",
    "A dry kitchen cupboard",
    "A closed fridge",
    "A dusty attic",
    "Where can frogs find food and shelter?",
    "Their tadpoles must also be able to live there."
  ],
  "fr": [
    "Quel lieu est un habitat naturel pour une grenouille ?",
    "Un étang avec des plantes sur les rives",
    "Un placard sec",
    "Un réfrigérateur fermé",
    "Un grenier poussiéreux",
    "Où les grenouilles trouvent-elles nourriture et abri ?",
    "Leurs têtards doivent aussi pouvoir y vivre."
  ],
  "it": [
    "Quale luogo è un ambiente naturale per una rana?",
    "Uno stagno con piante sulle rive",
    "Un armadio asciutto",
    "Un frigorifero chiuso",
    "Una soffitta polverosa",
    "Dove trovano cibo e riparo le rane?",
    "Anche i girini devono poterci vivere."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr1g",
  "reason": "Recognise purpose of hibernation without exact definition.",
  "de": [
    "Warum hält ein Igel Winterschlaf?",
    "Um bei wenig Nahrung Energie zu sparen",
    "Um im Winter schneller zu wachsen",
    "Um sich ein neues Fell wachsen zu lassen",
    "Um unter Wasser atmen zu können",
    "Im Winter findet er kaum Insekten.",
    "Sein Körper arbeitet in dieser Zeit langsamer."
  ],
  "en": [
    "Why does a hedgehog hibernate?",
    "To save energy when food is scarce",
    "To grow faster in winter",
    "To grow a new coat of fur",
    "To breathe underwater",
    "It finds very few insects in winter.",
    "Its body works more slowly during this time."
  ],
  "fr": [
    "Pourquoi le hérisson hiberne-t-il ?",
    "Pour économiser de l’énergie quand la nourriture manque",
    "Pour grandir plus vite en hiver",
    "Pour faire pousser un nouveau pelage",
    "Pour respirer sous l’eau",
    "Il trouve très peu d’insectes en hiver.",
    "Son corps fonctionne plus lentement pendant cette période."
  ],
  "it": [
    "Perché il riccio va in letargo?",
    "Per risparmiare energia quando il cibo scarseggia",
    "Per crescere più in fretta in inverno",
    "Per far crescere un nuovo pelo",
    "Per respirare sott’acqua",
    "In inverno trova pochissimi insetti.",
    "In questo periodo il suo corpo funziona più lentamente."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr1i",
  "reason": "Apply food-chain ordering with explicit arrow meaning.",
  "de": [
    "Der Pfeil bedeutet «wird gefressen von». Welche Nahrungskette stimmt?",
    "Gras → Hase → Fuchs",
    "Fuchs → Gras → Hase",
    "Hase → Fuchs → Gras",
    "Gras → Fuchs → Hase",
    "Beginne bei der Pflanze.",
    "Prüfe dann, wer sich von Pflanzen und wer sich von Tieren ernährt."
  ],
  "en": [
    "The arrow means ‘is eaten by’. Which food chain is correct?",
    "Grass → rabbit → fox",
    "Fox → grass → rabbit",
    "Rabbit → fox → grass",
    "Grass → fox → rabbit",
    "Start with the plant.",
    "Then check who eats plants and who eats animals."
  ],
  "fr": [
    "La flèche signifie « est mangé par ». Quelle chaîne est correcte ?",
    "Herbe → lapin → renard",
    "Renard → herbe → lapin",
    "Lapin → renard → herbe",
    "Herbe → renard → lapin",
    "Commence par la plante.",
    "Vérifie ensuite qui mange des plantes et qui mange des animaux."
  ],
  "it": [
    "La freccia significa «viene mangiato da». Quale catena è corretta?",
    "Erba → coniglio → volpe",
    "Volpe → erba → coniglio",
    "Coniglio → volpe → erba",
    "Erba → volpe → coniglio",
    "Inizia dalla pianta.",
    "Poi controlla chi mangia piante e chi mangia animali."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr1k",
  "reason": "Recognise an insect eater rather than type definition plus example.",
  "de": [
    "Welches Tier fängt fliegende Insekten als Nahrung?",
    "Die Schwalbe",
    "Das Reh",
    "Der Feldhase",
    "Die Kuh",
    "Das gesuchte Tier jagt in der Luft.",
    "Beobachte, welches dieser Tiere Flügel hat."
  ],
  "en": [
    "Which animal catches flying insects for food?",
    "The swallow",
    "The roe deer",
    "The hare",
    "The cow",
    "This animal hunts in the air.",
    "Which of these animals has wings?"
  ],
  "fr": [
    "Quel animal attrape des insectes en vol pour se nourrir ?",
    "L’hirondelle",
    "Le chevreuil",
    "Le lièvre",
    "La vache",
    "Cet animal chasse dans les airs.",
    "Lequel de ces animaux a des ailes ?"
  ],
  "it": [
    "Quale animale cattura insetti in volo per nutrirsi?",
    "La rondine",
    "Il capriolo",
    "La lepre",
    "La mucca",
    "Questo animale caccia nell’aria.",
    "Quale di questi animali ha le ali?"
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr2a",
  "reason": "Clarify ecosystem includes organisms and nonliving environment.",
  "de": [
    "Was gehört zum Ökosystem Teich?",
    "Tiere, Pflanzen, Wasser und Boden mit ihren Beziehungen",
    "Nur die Fische im Wasser",
    "Nur die Pflanzen am Ufer",
    "Nur das Wasser ohne Lebewesen",
    "Ein Teich besteht nicht nur aus Tieren.",
    "Überlege, wovon seine Lebewesen abhängig sind."
  ],
  "en": [
    "What belongs to a pond ecosystem?",
    "Animals, plants, water and soil and their interactions",
    "Only the fish in the water",
    "Only the plants on the bank",
    "Only the water without living things",
    "A pond contains more than animals.",
    "Think about what its living things depend on."
  ],
  "fr": [
    "Que comprend l’écosystème d’un étang ?",
    "Animaux, plantes, eau et sol avec leurs interactions",
    "Seulement les poissons",
    "Seulement les plantes des rives",
    "Seulement l’eau sans êtres vivants",
    "Un étang ne contient pas que des animaux.",
    "De quoi ses êtres vivants dépendent-ils ?"
  ],
  "it": [
    "Che cosa comprende l’ecosistema di uno stagno?",
    "Animali, piante, acqua e suolo con le loro relazioni",
    "Solo i pesci nell’acqua",
    "Solo le piante sulle rive",
    "Solo l’acqua senza esseri viventi",
    "Uno stagno non contiene solo animali.",
    "Da che cosa dipendono i suoi esseri viventi?"
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr2c",
  "reason": "Replace repeated habitat phrase with applied habitat choice.",
  "de": [
    "Warum ist eine Hecke für viele kleine Tiere wertvoll?",
    "Sie bietet Nahrung und Verstecke",
    "Sie bietet nur Nahrung, aber keinerlei Schutz",
    "Sie ist nur für grosse Weidetiere geeignet",
    "Sie verhindert, dass Tiere sich zwischen Gärten bewegen",
    "Denke an Beeren und dichtes Geäst.",
    "Ein Tier braucht sowohl etwas zu fressen als auch Schutz."
  ],
  "en": [
    "Why is a hedge valuable to many small animals?",
    "It provides food and hiding places",
    "It provides food but no shelter at all",
    "It is suitable only for large grazing animals",
    "It prevents animals from moving between gardens",
    "Think about berries and dense branches.",
    "An animal needs both food and shelter."
  ],
  "fr": [
    "Pourquoi une haie est-elle utile à de nombreux petits animaux ?",
    "Elle offre nourriture et cachettes",
    "Elle offre de la nourriture mais aucun abri",
    "Elle convient seulement aux grands animaux qui broutent",
    "Elle empêche les animaux de passer entre les jardins",
    "Pense aux baies et aux branches serrées.",
    "Un animal a besoin de nourriture et d’un abri."
  ],
  "it": [
    "Perché una siepe è preziosa per molti piccoli animali?",
    "Offre cibo e nascondigli",
    "Offre cibo ma nessun riparo",
    "È adatta solo ai grandi animali al pascolo",
    "Impedisce agli animali di passare tra i giardini",
    "Pensa alle bacche e ai rami fitti.",
    "Un animale ha bisogno sia di cibo sia di riparo."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr2e",
  "reason": "Explain mimicry through accessible harmless hoverfly example.",
  "de": [
    "Eine harmlose Schwebfliege sieht einer Wespe ähnlich. Wie kann ihr das helfen?",
    "Manche Fressfeinde halten sie für wehrhaft und meiden sie",
    "Sie kann dadurch wie eine Wespe stechen",
    "Sie braucht dadurch keine Nahrung",
    "Sie kann dadurch ohne Flügel fliegen",
    "Ihr Aussehen verändert nicht ihre Körperteile.",
    "Entscheidend ist, wie ein anderes Tier auf ihr Aussehen reagiert."
  ],
  "en": [
    "A harmless hoverfly looks like a wasp. How can this help it?",
    "Some predators avoid it because they think it can defend itself",
    "It can then sting like a wasp",
    "It no longer needs food",
    "It can fly without wings",
    "Its appearance does not change its body parts.",
    "What matters is how another animal reacts to its appearance."
  ],
  "fr": [
    "Un syrphe inoffensif ressemble à une guêpe. Quel avantage en tire-t-il ?",
    "Certains prédateurs le croient dangereux et l’évitent",
    "Il peut alors piquer comme une guêpe",
    "Il n’a plus besoin de nourriture",
    "Il peut voler sans ailes",
    "Son apparence ne transforme pas son corps.",
    "Pense à la réaction d’un autre animal devant cette apparence."
  ],
  "it": [
    "Un sirfide innocuo assomiglia a una vespa. Come può aiutarlo?",
    "Alcuni predatori lo credono pericoloso e lo evitano",
    "Può così pungere come una vespa",
    "Non ha più bisogno di cibo",
    "Può volare senza ali",
    "Il suo aspetto non cambia le parti del corpo.",
    "Conta la reazione di un altro animale al suo aspetto."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr2g",
  "reason": "Recognise predator relation in a concrete scenario.",
  "de": [
    "Ein Fuchs jagt eine Maus. Was ist der Fuchs für die Maus?",
    "Ein Fressfeind",
    "Ein Bestäuber",
    "Ein Pflanzenfresser",
    "Ein Zersetzer",
    "Achte darauf, wer wen jagt.",
    "Die Maus dient dem anderen Tier als Nahrung."
  ],
  "en": [
    "A fox hunts a mouse. What is the fox to the mouse?",
    "A predator",
    "A pollinator",
    "A herbivore",
    "A decomposer",
    "Notice which animal hunts the other.",
    "The mouse is food for the other animal."
  ],
  "fr": [
    "Un renard chasse une souris. Qu’est-il pour la souris ?",
    "Un prédateur",
    "Un pollinisateur",
    "Un herbivore",
    "Un décomposeur",
    "Observe quel animal chasse l’autre.",
    "La souris sert de nourriture à l’autre animal."
  ],
  "it": [
    "Una volpe caccia un topo. Che cos’è la volpe per il topo?",
    "Un predatore",
    "Un impollinatore",
    "Un erbivoro",
    "Un decompositore",
    "Osserva quale animale caccia l’altro.",
    "Il topo serve da cibo all’altro animale."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr2k",
  "reason": "Choose resident bird definition with migration misconceptions.",
  "de": [
    "Was zeichnet einen Standvogel aus?",
    "Er bleibt das ganze Jahr in derselben Gegend",
    "Er fliegt jeden Herbst in ein fernes Wintergebiet",
    "Er kann seine Flügel nicht bewegen",
    "Er lebt ausschliesslich auf dem Boden",
    "Der Name beschreibt sein Verhalten im Jahreslauf.",
    "Vergleiche ihn mit einem Zugvogel."
  ],
  "en": [
    "What describes a resident bird?",
    "It stays in the same area all year",
    "It flies to a distant wintering area every autumn",
    "It cannot move its wings",
    "It lives only on the ground",
    "The name describes its behaviour through the year.",
    "Compare it with a migratory bird."
  ],
  "fr": [
    "Qu’est-ce qu’un oiseau sédentaire ?",
    "Un oiseau qui reste dans la même région toute l’année",
    "Un oiseau qui part loin chaque automne",
    "Un oiseau qui ne peut pas bouger ses ailes",
    "Un oiseau qui vit uniquement au sol",
    "Le mot décrit son comportement au fil de l’année.",
    "Compare-le à un oiseau migrateur."
  ],
  "it": [
    "Che cosa caratterizza un uccello stanziale?",
    "Resta nella stessa zona tutto l’anno",
    "Ogni autunno vola lontano per svernare",
    "Non può muovere le ali",
    "Vive soltanto a terra",
    "Il nome descrive il suo comportamento durante l’anno.",
    "Confrontalo con un uccello migratore."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr2m",
  "reason": "Replace repeated chain definition with reading a chain.",
  "de": [
    "Eine Raupe frisst ein Blatt. Eine Meise frisst die Raupe. Wer frisst hier die Pflanze?",
    "Die Raupe",
    "Die Meise",
    "Beide Tiere",
    "Keines der Tiere",
    "Verfolge die Nahrung jedes Tieres einzeln.",
    "Das Blatt gehört zur Pflanze."
  ],
  "en": [
    "A caterpillar eats a leaf. A tit eats the caterpillar. Who eats the plant here?",
    "The caterpillar",
    "The tit",
    "Both animals",
    "Neither animal",
    "Follow each animal’s food separately.",
    "The leaf is part of the plant."
  ],
  "fr": [
    "Une chenille mange une feuille. Une mésange mange la chenille. Qui mange la plante ici ?",
    "La chenille",
    "La mésange",
    "Les deux animaux",
    "Aucun des deux",
    "Suis séparément la nourriture de chaque animal.",
    "La feuille appartient à la plante."
  ],
  "it": [
    "Un bruco mangia una foglia. Una cinciallegra mangia il bruco. Chi mangia la pianta?",
    "Il bruco",
    "La cinciallegra",
    "Entrambi gli animali",
    "Nessuno dei due",
    "Segui separatamente il cibo di ciascun animale.",
    "La foglia fa parte della pianta."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr2o",
  "reason": "Recognise decomposer role rather than copy technical definition.",
  "de": [
    "Was machen viele Pilze und Bakterien mit abgestorbenen Blättern?",
    "Sie bauen sie ab und geben Nährstoffe frei",
    "Sie verwandeln sie in lebende Tiere",
    "Sie halten sie für immer unverändert",
    "Sie machen daraus neue Steine",
    "Denke an Laub auf dem Waldboden.",
    "Nach längerer Zeit ist es kaum noch als Blatt erkennbar."
  ],
  "en": [
    "What do many fungi and bacteria do to dead leaves?",
    "Break them down and release nutrients",
    "Turn them into living animals",
    "Keep them unchanged forever",
    "Make new stones from them",
    "Think about leaves on the forest floor.",
    "After a long time, they are hardly recognisable as leaves."
  ],
  "fr": [
    "Que font de nombreux champignons et bactéries aux feuilles mortes ?",
    "Ils les décomposent et libèrent des nutriments",
    "Ils les transforment en animaux vivants",
    "Ils les gardent inchangées pour toujours",
    "Ils en font de nouvelles pierres",
    "Pense aux feuilles sur le sol d’une forêt.",
    "Après longtemps, on les reconnaît à peine."
  ],
  "it": [
    "Che cosa fanno molti funghi e batteri alle foglie morte?",
    "Le decompongono e liberano sostanze nutritive",
    "Le trasformano in animali vivi",
    "Le mantengono invariate per sempre",
    "Ne fanno nuove pietre",
    "Pensa alle foglie sul terreno del bosco.",
    "Dopo molto tempo sono difficili da riconoscere."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr3c",
  "reason": "Assess species diversity with distinct counted examples.",
  "de": [
    "Auf welcher Wiese findest du in diesen Beobachtungen die meisten Tierarten?",
    "Auf Wiese A: Biene, Schmetterling und Käfer",
    "Auf Wiese B: zehn Bienen derselben Art",
    "Auf Wiese C: fünf Käfer derselben Art",
    "Auf Wiese D: zwei Schmetterlinge derselben Art",
    "Zähle verschiedene Arten, nicht einzelne Tiere.",
    "Viele Tiere derselben Art zählen nur als eine Art."
  ],
  "en": [
    "Which meadow has the most animal species in these observations?",
    "Meadow A: a bee, a butterfly and a beetle",
    "Meadow B: ten bees of one species",
    "Meadow C: five beetles of one species",
    "Meadow D: two butterflies of one species",
    "Count different species, not individual animals.",
    "Many animals of the same species count as one species."
  ],
  "fr": [
    "Quelle prairie présente le plus d’espèces animales dans ces observations ?",
    "Prairie A : abeille, papillon et coléoptère",
    "Prairie B : dix abeilles de la même espèce",
    "Prairie C : cinq coléoptères de la même espèce",
    "Prairie D : deux papillons de la même espèce",
    "Compte les espèces différentes, pas les individus.",
    "Plusieurs animaux de la même espèce comptent pour une espèce."
  ],
  "it": [
    "Quale prato presenta più specie animali in queste osservazioni?",
    "Prato A: ape, farfalla e coleottero",
    "Prato B: dieci api della stessa specie",
    "Prato C: cinque coleotteri della stessa specie",
    "Prato D: due farfalle della stessa specie",
    "Conta le specie diverse, non i singoli animali.",
    "Molti animali della stessa specie contano come una specie."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr3e",
  "reason": "Replace advanced coevolution with observable pollinator cooperation.",
  "de": [
    "Eine Biene besucht eine Blüte und trägt Pollen zur nächsten. Was hilft sie der Pflanze damit?",
    "Bei der Bestäubung",
    "Beim Aufnehmen von Wasser durch Wurzeln",
    "Beim Festhalten im Boden",
    "Beim Abwerfen aller Blätter",
    "Pollen bleibt am Körper der Biene hängen.",
    "Denke an die Entstehung von Samen."
  ],
  "en": [
    "A bee carries pollen from one flower to another. What does it help the plant with?",
    "Pollination",
    "Taking up water through roots",
    "Staying anchored in the soil",
    "Shedding all its leaves",
    "Pollen sticks to the bee’s body.",
    "Think about how seeds form."
  ],
  "fr": [
    "Une abeille transporte du pollen entre deux fleurs. À quoi aide-t-elle la plante ?",
    "À la pollinisation",
    "À absorber l’eau par les racines",
    "À rester ancrée dans le sol",
    "À perdre toutes ses feuilles",
    "Le pollen colle au corps de l’abeille.",
    "Pense à la formation des graines."
  ],
  "it": [
    "Un’ape trasporta polline da un fiore all’altro. In che cosa aiuta la pianta?",
    "Nell’impollinazione",
    "Nell’assorbire acqua dalle radici",
    "Nel restare ancorata al terreno",
    "Nel perdere tutte le foglie",
    "Il polline si attacca al corpo dell’ape.",
    "Pensa alla formazione dei semi."
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr3i",
  "reason": "Replace abstract fragmentation terminology with wildlife crossing application.",
  "de": [
    "Warum baut man eine begrünte Wildtierbrücke über eine Autobahn?",
    "Damit Tiere zwischen Lebensräumen wechseln können",
    "Damit Autos auf der Wiese parkieren können",
    "Damit der Wald kein Regenwasser mehr bekommt",
    "Damit alle Tiere am selben Ort bleiben müssen",
    "Eine Autobahn kann Wanderwege von Tieren unterbrechen.",
    "Überlege, wie Tiere die Fahrbahnen sicher überwinden können."
  ],
  "en": [
    "Why build a planted wildlife bridge over a motorway?",
    "So animals can move between habitats",
    "So cars can park on the grass",
    "So the forest receives no more rain",
    "So all animals must stay in one place",
    "A motorway can cut across animal routes.",
    "How could animals get safely past the traffic lanes?"
  ],
  "fr": [
    "Pourquoi construire un passage végétalisé pour animaux au-dessus d’une autoroute ?",
    "Pour permettre aux animaux de passer entre des habitats",
    "Pour garer les voitures sur l’herbe",
    "Pour empêcher la pluie d’atteindre la forêt",
    "Pour obliger tous les animaux à rester au même endroit",
    "Une autoroute peut couper les chemins des animaux.",
    "Comment pourraient-ils franchir les voies en sécurité ?"
  ],
  "it": [
    "Perché costruire un ponte verde per animali sopra un’autostrada?",
    "Per permettere agli animali di spostarsi tra habitat",
    "Per parcheggiare le auto sull’erba",
    "Per impedire alla pioggia di raggiungere il bosco",
    "Per obbligare tutti gli animali a restare nello stesso posto",
    "Un’autostrada può interrompere i percorsi degli animali.",
    "Come potrebbero superare le corsie in sicurezza?"
  ]
},
{
  "key": "4/science/lebensraeume-tiere/g4lr3k",
  "reason": "Apply plant shelter relationship within animal habitats.",
  "de": [
    "Warum lässt man am Teich einen Streifen mit Pflanzen stehen?",
    "Damit kleine Tiere dort Schutz finden",
    "Damit kein Tier mehr zum Wasser gelangen kann",
    "Damit das Wasser nie mehr verdunstet",
    "Damit alle Wasserpflanzen verschwinden",
    "Betrachte den Übergang zwischen Land und Wasser.",
    "Dichtes Grün bietet kleine geschützte Plätze."
  ],
  "en": [
    "Why leave a strip of plants beside a pond?",
    "So small animals can find shelter",
    "So no animal can ever reach the water",
    "So the water never evaporates again",
    "So all water plants disappear",
    "Look at the boundary between land and water.",
    "Dense greenery provides small protected spaces."
  ],
  "fr": [
    "Pourquoi garder une bande de plantes au bord d’un étang ?",
    "Pour offrir un abri aux petits animaux",
    "Pour empêcher tout animal d’atteindre l’eau",
    "Pour que l’eau ne s’évapore plus jamais",
    "Pour faire disparaître toutes les plantes aquatiques",
    "Observe la limite entre la terre et l’eau.",
    "Une végétation dense offre de petits espaces protégés."
  ],
  "it": [
    "Perché lasciare una fascia di piante accanto a uno stagno?",
    "Per offrire riparo ai piccoli animali",
    "Per impedire a ogni animale di raggiungere l’acqua",
    "Perché l’acqua non evapori mai più",
    "Per far sparire tutte le piante acquatiche",
    "Osserva il confine tra terra e acqua.",
    "La vegetazione fitta offre piccoli spazi protetti."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk1a",
  "reason": "Distinguish climate from a single weather observation.",
  "de": [
    "Welche Aussage beschreibt das Klima eines Ortes?",
    "Die Sommer sind dort über viele Jahre meist trocken",
    "Heute regnet es um zwölf Uhr",
    "Jetzt zieht eine dunkle Wolke vorbei",
    "Morgen gibt es am Nachmittag ein Gewitter",
    "Achte auf den betrachteten Zeitraum.",
    "Ein einzelner Tag reicht dafür nicht aus."
  ],
  "en": [
    "Which statement describes a place’s climate?",
    "Summers there are usually dry over many years",
    "It is raining there at noon today",
    "A dark cloud is passing now",
    "There will be a thunderstorm tomorrow afternoon",
    "Notice the time period.",
    "One day is not enough to describe it."
  ],
  "fr": [
    "Quelle phrase décrit le climat d’un lieu ?",
    "Les étés y sont généralement secs sur de nombreuses années",
    "Il y pleut aujourd’hui à midi",
    "Un nuage sombre passe maintenant",
    "Il y aura un orage demain après-midi",
    "Observe la durée considérée.",
    "Une seule journée ne suffit pas pour le décrire."
  ],
  "it": [
    "Quale frase descrive il clima di un luogo?",
    "Le estati sono generalmente secche per molti anni",
    "Oggi piove a mezzogiorno",
    "Ora passa una nuvola scura",
    "Domani pomeriggio ci sarà un temporale",
    "Osserva il periodo considerato.",
    "Un solo giorno non basta per descriverlo."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk1e",
  "reason": "Recognise weather station purpose.",
  "de": [
    "Wozu dient eine Wetterstation?",
    "Sie misst zum Beispiel Temperatur, Wind und Regen",
    "Sie stellt Wolken für die Landwirtschaft her",
    "Sie verhindert jedes Gewitter",
    "Sie bestimmt die Jahreszeit durch Abstimmung",
    "Dort stehen verschiedene Messgeräte.",
    "Die Messwerte helfen, das Wetter zu beobachten."
  ],
  "en": [
    "What is a weather station used for?",
    "Measuring things such as temperature, wind and rain",
    "Making clouds for farms",
    "Preventing every thunderstorm",
    "Choosing the season by voting",
    "It contains different measuring instruments.",
    "Its readings help people observe the weather."
  ],
  "fr": [
    "À quoi sert une station météorologique ?",
    "À mesurer notamment la température, le vent et la pluie",
    "À fabriquer des nuages pour les fermes",
    "À empêcher tous les orages",
    "À choisir la saison par un vote",
    "Elle contient différents instruments de mesure.",
    "Ces mesures servent à observer le temps."
  ],
  "it": [
    "A che cosa serve una stazione meteorologica?",
    "A misurare temperatura, vento e pioggia",
    "A produrre nuvole per le fattorie",
    "A impedire ogni temporale",
    "A scegliere la stagione con un voto",
    "Contiene diversi strumenti di misura.",
    "Le misurazioni aiutano a osservare il tempo."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk1g",
  "reason": "Clarify dew formation instead of defining it by nighttime alone.",
  "de": [
    "Wie entsteht Tau auf einem kühlen Grashalm?",
    "Wasserdampf aus der Luft wird zu Tropfen",
    "Flüssiges Wasser verdunstet am Grashalm",
    "Eis schmilzt zu flüssigem Wasser",
    "Flüssiges Wasser gefriert zu einer Eisschicht",
    "Die Luft enthält unsichtbaren Wasserdampf.",
    "An einer kühlen Oberfläche kann sich sein Zustand ändern."
  ],
  "en": [
    "How does dew form on a cool blade of grass?",
    "Water vapour in the air turns into droplets",
    "Liquid water evaporates from the grass",
    "Ice melts into liquid water",
    "Liquid water freezes into a layer of ice",
    "Air contains invisible water vapour.",
    "Its state can change on a cool surface."
  ],
  "fr": [
    "Comment la rosée se forme-t-elle sur une herbe froide ?",
    "La vapeur d’eau de l’air devient des gouttelettes",
    "L’eau liquide s’évapore de l’herbe",
    "La glace fond en eau liquide",
    "L’eau liquide gèle en une couche de glace",
    "L’air contient de la vapeur d’eau invisible.",
    "Son état peut changer sur une surface froide."
  ],
  "it": [
    "Come si forma la rugiada su un filo d’erba freddo?",
    "Il vapore acqueo nell’aria diventa goccioline",
    "L’acqua liquida evapora dall’erba",
    "Il ghiaccio fonde in acqua liquida",
    "L’acqua liquida gela in uno strato di ghiaccio",
    "L’aria contiene vapore acqueo invisibile.",
    "Il suo stato può cambiare su una superficie fredda."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk1i",
  "reason": "Recognise forms of precipitation.",
  "de": [
    "Welche Gruppe besteht nur aus Niederschlag?",
    "Regen, Schnee und Hagel",
    "Wind, Sonne und Regen",
    "Nebel, Wind und Sonnenschein",
    "Regenbogen, Donner und Schnee",
    "Niederschlag fällt aus Wolken zum Boden.",
    "Er kann flüssig oder gefroren sein."
  ],
  "en": [
    "Which group contains only precipitation?",
    "Rain, snow and hail",
    "Wind, sunshine and rain",
    "Fog, wind and sunshine",
    "Rainbows, thunder and snow",
    "Precipitation falls from clouds to the ground.",
    "It can be liquid or frozen."
  ],
  "fr": [
    "Quel groupe ne contient que des précipitations ?",
    "Pluie, neige et grêle",
    "Vent, soleil et pluie",
    "Brouillard, vent et soleil",
    "Arc-en-ciel, tonnerre et neige",
    "Les précipitations tombent des nuages vers le sol.",
    "Elles peuvent être liquides ou gelées."
  ],
  "it": [
    "Quale gruppo contiene soltanto precipitazioni?",
    "Pioggia, neve e grandine",
    "Vento, sole e pioggia",
    "Nebbia, vento e sole",
    "Arcobaleno, tuono e neve",
    "Le precipitazioni cadono dalle nuvole al suolo.",
    "Possono essere liquide o ghiacciate."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk1k",
  "reason": "Recognise forecasting and its uncertainty.",
  "de": [
    "Was sagt eine Wettervorhersage aus?",
    "Wie das Wetter wahrscheinlich werden wird",
    "Wie das Wetter an jedem Tag garantiert sein muss",
    "Wie das Wetter an einem Ort vor hundert Jahren genau war",
    "Welche Kleidung alle Menschen unabhängig vom Wetter tragen müssen",
    "Sie nutzt Messwerte und Berechnungen.",
    "Die Zukunft lässt sich damit nicht völlig sicher bestimmen."
  ],
  "en": [
    "What does a weather forecast tell you?",
    "What the weather will probably be like",
    "What the weather is guaranteed to be every day",
    "Exactly what the weather was there a hundred years ago",
    "What everyone must wear regardless of the weather",
    "It uses measurements and calculations.",
    "It cannot predict the future with complete certainty."
  ],
  "fr": [
    "Qu’indiquent les prévisions météorologiques ?",
    "Le temps qu’il fera probablement",
    "Le temps garanti pour chaque jour",
    "Le temps exact de ce lieu il y a cent ans",
    "Les vêtements obligatoires pour tous quel que soit le temps",
    "Elles utilisent des mesures et des calculs.",
    "Elles ne peuvent pas prévoir l’avenir avec une certitude totale."
  ],
  "it": [
    "Che cosa indicano le previsioni meteorologiche?",
    "Come sarà probabilmente il tempo",
    "Il tempo garantito per ogni giorno",
    "Il tempo esatto di quel luogo cento anni fa",
    "I vestiti obbligatori per tutti indipendentemente dal tempo",
    "Usano misurazioni e calcoli.",
    "Non possono prevedere il futuro con certezza assoluta."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk2a",
  "reason": "Recognise a water-cycle step without typing a sequence.",
  "de": [
    "Regenwasser fliesst über Bäche ins Meer. Wie kann es wieder in die Luft gelangen?",
    "Durch Verdunstung",
    "Durch Gefrieren",
    "Durch Versickern im Boden",
    "Durch Kondensation zu Tropfen",
    "Sonnenwärme wirkt auf die Wasseroberfläche.",
    "Wasser kann seinen Zustand wechseln."
  ],
  "en": [
    "Rainwater flows through streams into the sea. How can it return to the air?",
    "By evaporation",
    "By freezing",
    "By soaking into the ground",
    "By condensing into droplets",
    "The Sun warms the water’s surface.",
    "Water can change its state."
  ],
  "fr": [
    "L’eau de pluie rejoint la mer par les cours d’eau. Comment peut-elle retourner dans l’air ?",
    "Par évaporation",
    "Par congélation",
    "Par infiltration dans le sol",
    "Par condensation en gouttelettes",
    "Le soleil chauffe la surface de l’eau.",
    "L’eau peut changer d’état."
  ],
  "it": [
    "L’acqua piovana raggiunge il mare attraverso i corsi d’acqua. Come può tornare nell’aria?",
    "Per evaporazione",
    "Per congelamento",
    "Per infiltrazione nel terreno",
    "Per condensazione in goccioline",
    "Il sole riscalda la superficie dell’acqua.",
    "L’acqua può cambiare stato."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk2e",
  "reason": "Replace advanced pressure-area definition with everyday pressure instrument knowledge.",
  "de": [
    "Was misst ein Barometer an einer Wetterstation?",
    "Den Luftdruck",
    "Die Regenmenge",
    "Die Windrichtung",
    "Die Schneehöhe",
    "Auch Luft übt Druck aus.",
    "Vergleiche das Gerät mit einem Thermometer, das Wärme und Kälte misst."
  ],
  "en": [
    "What does a barometer measure at a weather station?",
    "Air pressure",
    "Rainfall",
    "Wind direction",
    "Snow depth",
    "Air also exerts pressure.",
    "Compare it with a thermometer, which measures temperature."
  ],
  "fr": [
    "Que mesure un baromètre dans une station météo ?",
    "La pression de l’air",
    "La quantité de pluie",
    "La direction du vent",
    "La hauteur de neige",
    "L’air exerce aussi une pression.",
    "Compare cet instrument au thermomètre qui mesure la température."
  ],
  "it": [
    "Che cosa misura un barometro in una stazione meteo?",
    "La pressione dell’aria",
    "La quantità di pioggia",
    "La direzione del vento",
    "L’altezza della neve",
    "Anche l’aria esercita una pressione.",
    "Confrontalo con il termometro, che misura la temperatura."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk2g",
  "reason": "Replace technical convection definition with warm-air observation.",
  "de": [
    "Was macht Luft meist, wenn sie wärmer als die Luft um sie herum wird?",
    "Sie steigt auf",
    "Sie sinkt ab",
    "Sie bleibt immer am Boden liegen",
    "Sie bewegt sich nur waagrecht, nie nach oben",
    "Denke an einen Heissluftballon.",
    "Erwärmte Luft ist bei gleichem Druck weniger dicht."
  ],
  "en": [
    "What does air usually do when it becomes warmer than the air around it?",
    "It rises",
    "It sinks",
    "It always stays at ground level",
    "It moves only horizontally, never upwards",
    "Think of a hot-air balloon.",
    "Warmer air is less dense at the same pressure."
  ],
  "fr": [
    "Que fait généralement l’air lorsqu’il devient plus chaud que l’air autour de lui ?",
    "Il monte",
    "Il descend",
    "Il reste toujours au sol",
    "Il se déplace seulement horizontalement, jamais vers le haut",
    "Pense à une montgolfière.",
    "À pression égale, l’air plus chaud est moins dense."
  ],
  "it": [
    "Che cosa fa di solito l’aria quando diventa più calda di quella circostante?",
    "Sale",
    "Scende",
    "Resta sempre al suolo",
    "Si muove solo orizzontalmente, mai verso l’alto",
    "Pensa a una mongolfiera.",
    "A parità di pressione, l’aria più calda è meno densa."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk2i",
  "reason": "Apply evaporation to an everyday observation.",
  "de": [
    "Eine Pfütze wird an einem warmen Tag kleiner, obwohl nichts abfliesst. Warum?",
    "Ein Teil des Wassers verdunstet",
    "Das Wasser gefriert vollständig",
    "Zusätzlicher Wasserdampf wird in der Pfütze flüssig",
    "Das Wasser zieht sich durch die Wärme stark zusammen",
    "Auch ohne Kochen kann Wasser in die Luft gelangen.",
    "Überlege, ob das Wasser noch sichtbar sein muss."
  ],
  "en": [
    "A puddle shrinks on a warm day even though no water drains away. Why?",
    "Some of the water evaporates",
    "The water freezes completely",
    "Extra water vapour becomes liquid in the puddle",
    "The water shrinks greatly because of the warmth",
    "Water can enter the air without boiling.",
    "Does the water have to remain visible?"
  ],
  "fr": [
    "Une flaque rétrécit par temps chaud sans que l’eau s’écoule. Pourquoi ?",
    "Une partie de l’eau s’évapore",
    "L’eau gèle entièrement",
    "De la vapeur supplémentaire devient liquide dans la flaque",
    "L’eau se contracte fortement à cause de la chaleur",
    "L’eau peut passer dans l’air sans bouillir.",
    "L’eau doit-elle forcément rester visible ?"
  ],
  "it": [
    "Una pozzanghera si riduce con il caldo anche se l’acqua non defluisce. Perché?",
    "Una parte dell’acqua evapora",
    "L’acqua gela completamente",
    "Altro vapore diventa liquido nella pozzanghera",
    "L’acqua si contrae fortemente per il calore",
    "L’acqua può passare nell’aria senza bollire.",
    "L’acqua deve per forza restare visibile?"
  ]
},
{
  "key": "4/science/wetter-klima/g4wk2k",
  "reason": "Recognise cirrus appearance without full technical definition.",
  "de": [
    "Wie sehen Federwolken meist aus?",
    "Dünn und faserig, hoch am Himmel",
    "Wie eine geschlossene Nebeldecke am Boden",
    "Wie dunkle Wasserpfützen auf der Strasse",
    "Wie einzelne Schneebälle im Gras",
    "Ihr Name beschreibt ihre Form.",
    "Sie wirken leicht und ausgefranst."
  ],
  "en": [
    "What do cirrus clouds usually look like?",
    "Thin and wispy, high in the sky",
    "A solid fog layer on the ground",
    "Dark puddles on the road",
    "Separate snowballs in the grass",
    "They are sometimes called feather clouds.",
    "They look light and frayed."
  ],
  "fr": [
    "À quoi ressemblent généralement les cirrus ?",
    "À de fins filaments très hauts dans le ciel",
    "À une nappe de brouillard au sol",
    "À des flaques sombres sur la route",
    "À des boules de neige dans l’herbe",
    "On les compare parfois à des plumes.",
    "Ils semblent légers et effilochés."
  ],
  "it": [
    "Come appaiono di solito i cirri?",
    "Sottili e filamentosi, in alto nel cielo",
    "Come uno strato di nebbia al suolo",
    "Come pozzanghere scure sulla strada",
    "Come palle di neve nell’erba",
    "A volte vengono paragonati a piume.",
    "Sembrano leggeri e sfrangiati."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk2m",
  "reason": "Narrow complex regional weather claim to mountain barrier effect.",
  "de": [
    "Warum kann es auf zwei Seiten der Alpen unterschiedliches Wetter geben?",
    "Die Berge lenken Luft ab und zwingen sie zum Aufsteigen",
    "Die Berge schalten auf einer Seite die Sonne aus",
    "Auf einer Seite gibt es grundsätzlich keine Luft",
    "Die Landesgrenze hält alle Wolken auf",
    "Luft bewegt sich über und um Berge.",
    "Beim Aufsteigen kann sie abkühlen und Wolken bilden."
  ],
  "en": [
    "Why can opposite sides of the Alps have different weather?",
    "Mountains redirect air and force it upwards",
    "Mountains switch off the Sun on one side",
    "One side has no air at all",
    "The national border stops every cloud",
    "Air moves over and around mountains.",
    "As it rises, it can cool and form clouds."
  ],
  "fr": [
    "Pourquoi le temps peut-il différer de part et d’autre des Alpes ?",
    "Les montagnes dévient l’air et le forcent à monter",
    "Les montagnes éteignent le soleil d’un côté",
    "Il n’y a aucun air d’un côté",
    "La frontière arrête tous les nuages",
    "L’air passe au-dessus et autour des montagnes.",
    "En montant, il peut refroidir et former des nuages."
  ],
  "it": [
    "Perché sui due versanti delle Alpi il tempo può essere diverso?",
    "Le montagne deviano l’aria e la costringono a salire",
    "Le montagne spengono il sole da un lato",
    "Da un lato non esiste aria",
    "Il confine ferma tutte le nuvole",
    "L’aria passa sopra e intorno alle montagne.",
    "Salendo può raffreddarsi e formare nuvole."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk2o",
  "reason": "Replace off-topic fair-trade item with appropriate weather safety.",
  "de": [
    "Ein Gewitter zieht auf. Wo bist du am sichersten?",
    "In einem festen, geschlossenen Gebäude",
    "Unter einem einzelnen Baum auf der Wiese",
    "Im Wasser eines Sees",
    "Auf einem freien Berggipfel",
    "Blitze können hohe, freistehende Punkte treffen.",
    "Suche einen geschlossenen Schutzraum statt eines Platzes im Freien."
  ],
  "en": [
    "A thunderstorm is approaching. Where are you safest?",
    "Inside a solid, enclosed building",
    "Under a lone tree in a meadow",
    "In a lake",
    "On an exposed mountain summit",
    "Lightning can strike tall, isolated points.",
    "Look for enclosed shelter rather than an outdoor spot."
  ],
  "fr": [
    "Un orage approche. Où es-tu le plus en sécurité ?",
    "Dans un bâtiment solide et fermé",
    "Sous un arbre isolé dans un pré",
    "Dans un lac",
    "Sur un sommet découvert",
    "La foudre peut frapper les points hauts et isolés.",
    "Cherche un abri fermé plutôt qu’un endroit à l’extérieur."
  ],
  "it": [
    "Si avvicina un temporale. Dove sei più al sicuro?",
    "Dentro un edificio solido e chiuso",
    "Sotto un albero isolato in un prato",
    "Nell’acqua di un lago",
    "Su una cima montuosa esposta",
    "I fulmini possono colpire punti alti e isolati.",
    "Cerca un riparo chiuso invece di un posto all’aperto."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk3a",
  "reason": "Simplify greenhouse effect while preserving core climate concept.",
  "de": [
    "Wie wirken Treibhausgase in der Atmosphäre?",
    "Sie halten einen Teil der abgegebenen Wärme zurück",
    "Sie lassen die gesamte Erdwärme ungehindert ins All entweichen",
    "Sie verhindern ausschliesslich die Verdunstung von Meerwasser",
    "Sie kühlen die Erde immer stärker ab, je mehr vorhanden sind",
    "Die Erde gibt Wärme wieder ab.",
    "Vergleiche eine Erde mit und ohne diese Gase."
  ],
  "en": [
    "How do greenhouse gases act in the atmosphere?",
    "They retain some of the heat given off by Earth",
    "They let all Earth’s heat escape freely into space",
    "Their only effect is stopping seawater evaporation",
    "They always cool Earth more as their amount increases",
    "Earth gives heat off again.",
    "Compare Earth with and without these gases."
  ],
  "fr": [
    "Quel est l’effet des gaz à effet de serre dans l’atmosphère ?",
    "Ils retiennent une partie de la chaleur émise par la Terre",
    "Ils laissent toute la chaleur terrestre s’échapper librement",
    "Ils empêchent uniquement l’évaporation de l’eau de mer",
    "Ils refroidissent toujours davantage la Terre quand leur quantité augmente",
    "La Terre émet à son tour de la chaleur.",
    "Compare la Terre avec et sans ces gaz."
  ],
  "it": [
    "Come agiscono i gas serra nell’atmosfera?",
    "Trattengono parte del calore emesso dalla Terra",
    "Lasciano sfuggire liberamente tutto il calore terrestre",
    "Impediscono soltanto l’evaporazione dell’acqua marina",
    "Raffreddano sempre di più la Terra quando aumentano",
    "La Terra emette a sua volta calore.",
    "Confronta la Terra con e senza questi gas."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk3c",
  "reason": "Replace off-topic internet definition with interpreting weather information.",
  "de": [
    "Die Wettervorhersage zeigt für den Schulweg starken Regen. Was ist sinnvoll?",
    "Regenjacke und wasserdichte Schuhe anziehen",
    "Nur eine Sonnenbrille mitnehmen",
    "In Badehose zur Schule gehen",
    "Die Regenwarnung als Temperaturangabe lesen",
    "Überlege, welche Kleidung bei Nässe schützt.",
    "Wind und Regen können dich auch bei milden Temperaturen auskühlen."
  ],
  "en": [
    "The forecast shows heavy rain on your way to school. What makes sense?",
    "Wear a raincoat and waterproof shoes",
    "Take only sunglasses",
    "Go to school in swimming trunks",
    "Read the rain warning as a temperature",
    "Which clothes protect you from getting wet?",
    "Wind and rain can chill you even in mild weather."
  ],
  "fr": [
    "De fortes pluies sont prévues sur le chemin de l’école. Que faire ?",
    "Mettre un imperméable et des chaussures étanches",
    "Prendre seulement des lunettes de soleil",
    "Aller à l’école en maillot de bain",
    "Lire l’alerte pluie comme une température",
    "Quels vêtements protègent de l’humidité ?",
    "Le vent et la pluie peuvent refroidir même par temps doux."
  ],
  "it": [
    "Sono previste forti piogge sul percorso per la scuola. Che cosa conviene fare?",
    "Indossare una giacca impermeabile e scarpe resistenti all’acqua",
    "Portare soltanto occhiali da sole",
    "Andare a scuola in costume da bagno",
    "Leggere l’allerta pioggia come una temperatura",
    "Quali vestiti proteggono dall’acqua?",
    "Vento e pioggia possono raffreddarti anche con temperature miti."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk3e",
  "reason": "Replace advanced El Niño definition with reading rain measurements.",
  "de": [
    "Im Regenmesser stehen nach Montag 3 mm und nach Dienstag 12 mm, jeweils für einen Tag. Wann fiel mehr Regen?",
    "Am Dienstag",
    "Am Montag",
    "An beiden Tagen gleich viel",
    "Das erkennt man nur an der Windrichtung",
    "Vergleiche die beiden Messwerte.",
    "Ein höherer Wert bedeutet hier mehr Niederschlag."
  ],
  "en": [
    "A rain gauge records 3 mm for Monday and 12 mm for Tuesday. Which day had more rain?",
    "Tuesday",
    "Monday",
    "Both days had the same amount",
    "Only wind direction can tell us",
    "Compare the two readings.",
    "A higher reading means more precipitation here."
  ],
  "fr": [
    "Un pluviomètre mesure 3 mm lundi et 12 mm mardi, pour chaque journée. Quel jour a-t-il le plus plu ?",
    "Mardi",
    "Lundi",
    "La même quantité les deux jours",
    "Seule la direction du vent permet de le savoir",
    "Compare les deux mesures.",
    "Une valeur plus élevée signifie ici davantage de précipitations."
  ],
  "it": [
    "Un pluviometro misura 3 mm lunedì e 12 mm martedì, per ciascun giorno. Quando è piovuto di più?",
    "Martedì",
    "Lunedì",
    "La stessa quantità nei due giorni",
    "Lo indica soltanto la direzione del vento",
    "Confronta le due misurazioni.",
    "Un valore maggiore indica più precipitazioni."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk3g",
  "reason": "Recognise tornado without reproducing full definition.",
  "de": [
    "Was ist ein Tornado?",
    "Ein stark rotierender Luftwirbel mit Bodenkontakt",
    "Eine gleichmässige Meeresströmung",
    "Eine dünne Eisschicht auf Gras",
    "Ein ruhiger Nebelstreifen ohne Wind",
    "Er gehört zu gefährlichen Wettererscheinungen.",
    "Die Luft bewegt sich darin kreisend."
  ],
  "en": [
    "What is a tornado?",
    "A strongly rotating column of air touching the ground",
    "A steady ocean current",
    "A thin layer of ice on grass",
    "A calm strip of fog with no wind",
    "It is a dangerous weather event.",
    "The air moves in a spinning motion."
  ],
  "fr": [
    "Qu’est-ce qu’une tornade ?",
    "Une colonne d’air en forte rotation qui touche le sol",
    "Un courant marin régulier",
    "Une fine couche de glace sur l’herbe",
    "Une bande de brouillard calme sans vent",
    "C’est un phénomène météorologique dangereux.",
    "L’air y tourne sur lui-même."
  ],
  "it": [
    "Che cos’è un tornado?",
    "Una colonna d’aria in forte rotazione a contatto con il suolo",
    "Una corrente marina regolare",
    "Un sottile strato di ghiaccio sull’erba",
    "Una striscia di nebbia calma senza vento",
    "È un fenomeno meteorologico pericoloso.",
    "L’aria si muove girando su se stessa."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk3i",
  "reason": "Recognise drought with duration and low precipitation.",
  "de": [
    "Wann spricht man von einer Dürre?",
    "Wenn über längere Zeit ungewöhnlich wenig Niederschlag fällt",
    "Wenn es eine Stunde lang nicht regnet",
    "Wenn in einer Nacht viel Schnee fällt",
    "Wenn nach Regen ein Regenbogen erscheint",
    "Entscheidend ist nicht nur ein trockener Nachmittag.",
    "Böden und Gewässer verlieren bei anhaltender Trockenheit Wasser."
  ],
  "en": [
    "When do we speak of a drought?",
    "When unusually little precipitation falls for a long time",
    "When it does not rain for one hour",
    "When much snow falls in one night",
    "When a rainbow appears after rain",
    "One dry afternoon is not enough.",
    "Soils and waterways lose water during prolonged dryness."
  ],
  "fr": [
    "Quand parle-t-on de sécheresse ?",
    "Quand les précipitations sont anormalement faibles pendant longtemps",
    "Quand il ne pleut pas pendant une heure",
    "Quand il neige beaucoup en une nuit",
    "Quand un arc-en-ciel apparaît après la pluie",
    "Un après-midi sec ne suffit pas.",
    "Les sols et les cours d’eau perdent de l’eau si le manque de pluie dure."
  ],
  "it": [
    "Quando si parla di siccità?",
    "Quando per molto tempo cadono precipitazioni insolitamente scarse",
    "Quando non piove per un’ora",
    "Quando nevica molto in una notte",
    "Quando appare un arcobaleno dopo la pioggia",
    "Un pomeriggio asciutto non basta.",
    "Suolo e corsi d’acqua perdono acqua se la mancanza di pioggia continua."
  ]
},
{
  "key": "4/science/wetter-klima/g4wk3k",
  "reason": "Simplify ocean current concept to a clear recognition question.",
  "de": [
    "Was ist der Golfstrom?",
    "Eine warme Meeresströmung im Atlantik",
    "Ein kalter Wind in einem Alpental",
    "Ein Fluss, der durch die Schweiz fliesst",
    "Ein Stromkabel unter einem Golfplatz",
    "Der Name enthält zwar «Strom», meint aber keinen elektrischen Strom.",
    "Denke an grosse Wassermengen, die sich im Meer bewegen."
  ],
  "en": [
    "What is the Gulf Stream?",
    "A warm ocean current in the Atlantic",
    "A cold wind in an Alpine valley",
    "A river flowing through Switzerland",
    "An electric cable under a golf course",
    "Here, ‘stream’ does not mean a small river.",
    "Think of large amounts of moving seawater."
  ],
  "fr": [
    "Qu’est-ce que le Gulf Stream ?",
    "Un courant marin chaud dans l’Atlantique",
    "Un vent froid dans une vallée alpine",
    "Un fleuve qui traverse la Suisse",
    "Un câble électrique sous un terrain de golf",
    "Il ne s’agit pas d’un courant électrique.",
    "Pense à de grandes masses d’eau qui se déplacent dans la mer."
  ],
  "it": [
    "Che cos’è la Corrente del Golfo?",
    "Una corrente marina calda nell’Atlantico",
    "Un vento freddo in una valle alpina",
    "Un fiume che attraversa la Svizzera",
    "Un cavo elettrico sotto un campo da golf",
    "Non si tratta di corrente elettrica.",
    "Pensa a grandi masse d’acqua che si muovono nel mare."
  ]
},
{
  "key": "4/science/pflanzen-4/pfl4_28",
  "reason": "Choose a familiar storage organ rather than a technical list.",
  "de": [
    "Wo speichert eine Kartoffelpflanze besonders viel Stärke?",
    "In ihren Knollen",
    "In ihren Blütenblättern",
    "In den Härchen ihrer Blätter",
    "Im Duft ihrer Blüten",
    "Denke an den Teil, den wir ernten.",
    "Dieser Teil wächst unter der Erde."
  ],
  "en": [
    "Where does a potato plant store a lot of starch?",
    "In its tubers",
    "In its petals",
    "In its leaf hairs",
    "In the scent of its flowers",
    "Think of the part we harvest.",
    "That part grows underground."
  ],
  "fr": [
    "Où le plant de pomme de terre stocke-t-il beaucoup d’amidon ?",
    "Dans ses tubercules",
    "Dans ses pétales",
    "Dans les poils de ses feuilles",
    "Dans le parfum de ses fleurs",
    "Pense à la partie récoltée.",
    "Elle pousse sous terre."
  ],
  "it": [
    "Dove accumula molto amido la pianta di patata?",
    "Nei tuberi",
    "Nei petali",
    "Nei peli delle foglie",
    "Nel profumo dei fiori",
    "Pensa alla parte che raccogliamo.",
    "Cresce sotto terra."
  ]
},
{
  "key": "4/science/pflanzen-4/pfl4_38",
  "reason": "Replace generic habitat phrase with plant habitat adaptation.",
  "de": [
    "Welche Pflanze ist an einen sehr trockenen Lebensraum angepasst?",
    "Ein Kaktus mit wasserspeicherndem Stamm",
    "Eine Seerose mit schwimmenden Blättern",
    "Schilf mit Wurzeln im Uferwasser",
    "Wasserpest, die unter Wasser wächst",
    "Nicht überall fällt regelmässig Regen.",
    "Ein Wasservorrat hilft, trockene Zeiten zu überstehen."
  ],
  "en": [
    "Which plant is adapted to a very dry habitat?",
    "A cactus with a water-storing stem",
    "A water lily with floating leaves",
    "Reeds rooted in shallow water",
    "Pondweed growing underwater",
    "Rain does not fall regularly everywhere.",
    "Stored water helps a plant survive dry periods."
  ],
  "fr": [
    "Quelle plante est adaptée à un milieu très sec ?",
    "Un cactus dont la tige stocke l’eau",
    "Un nénuphar aux feuilles flottantes",
    "Un roseau enraciné dans l’eau",
    "Une élodée qui pousse sous l’eau",
    "Il ne pleut pas régulièrement partout.",
    "Une réserve d’eau aide à passer les périodes sèches."
  ],
  "it": [
    "Quale pianta è adatta a un ambiente molto secco?",
    "Un cactus con un fusto che conserva acqua",
    "Una ninfea con foglie galleggianti",
    "Una canna radicata nell’acqua",
    "Un’elodea che cresce sott’acqua",
    "Non piove regolarmente dappertutto.",
    "Una riserva d’acqua aiuta a superare i periodi secchi."
  ]
},
{
  "key": "4/science/pflanzen-4/pfl4_44",
  "reason": "Replace coevolution with accessible flower-pollinator relationship.",
  "de": [
    "Was finden viele Bienen in Blüten als Nahrung?",
    "Nektar und Pollen",
    "Sand und Kies",
    "Rinde und Steine",
    "Salz und Erde",
    "Blüten bieten mehr als schöne Farben.",
    "Die Bienen sammeln dort Nahrung für sich und ihren Nachwuchs."
  ],
  "en": [
    "What food do many bees find in flowers?",
    "Nectar and pollen",
    "Sand and gravel",
    "Bark and stones",
    "Salt and soil",
    "Flowers offer more than pretty colours.",
    "Bees collect food there for themselves and their young."
  ],
  "fr": [
    "Quelle nourriture de nombreuses abeilles trouvent-elles dans les fleurs ?",
    "Du nectar et du pollen",
    "Du sable et du gravier",
    "De l’écorce et des pierres",
    "Du sel et de la terre",
    "Les fleurs offrent plus que de belles couleurs.",
    "Les abeilles y trouvent de la nourriture pour elles et leurs petits."
  ],
  "it": [
    "Quale cibo trovano molte api nei fiori?",
    "Nettare e polline",
    "Sabbia e ghiaia",
    "Corteccia e pietre",
    "Sale e terra",
    "I fiori offrono più di bei colori.",
    "Le api raccolgono cibo per sé e per i piccoli."
  ]
},
{
  "key": "4/science/pflanzen-4/pfl4_46",
  "reason": "Replace specialised guttation definition with root water uptake.",
  "de": [
    "Durch welchen Pflanzenteil wird Wasser hauptsächlich aus dem Boden aufgenommen?",
    "Durch die Wurzeln",
    "Durch die Blütenblätter",
    "Durch die Früchte",
    "Durch die Samen in einer trockenen Schachtel",
    "Denke an die Teile unter der Erde.",
    "Sie stehen in engem Kontakt mit feuchtem Boden."
  ],
  "en": [
    "Which plant part mainly takes up water from the soil?",
    "The roots",
    "The petals",
    "The fruits",
    "Seeds in a dry box",
    "Think of the parts underground.",
    "They are in close contact with moist soil."
  ],
  "fr": [
    "Quelle partie absorbe principalement l’eau du sol ?",
    "Les racines",
    "Les pétales",
    "Les fruits",
    "Les graines dans une boîte sèche",
    "Pense aux parties sous terre.",
    "Elles sont en contact étroit avec le sol humide."
  ],
  "it": [
    "Quale parte assorbe principalmente l’acqua dal terreno?",
    "Le radici",
    "I petali",
    "I frutti",
    "I semi in una scatola asciutta",
    "Pensa alle parti sotto terra.",
    "Sono a stretto contatto con il terreno umido."
  ]
},
{
  "key": "4/science/pflanzen-4/pfl4_48",
  "reason": "Replace clinostat rotation with observable shoot response to light.",
  "de": [
    "Eine Zimmerpflanze steht seitlich am Fenster. In welche Richtung wachsen viele ihrer jungen Triebe?",
    "Zum Licht hin",
    "Immer genau vom Fenster weg",
    "Immer senkrecht nach unten",
    "Nur in Richtung der nächsten Tür",
    "Beobachte Pflanzen an einem hellen Fenster.",
    "Die Blätter benötigen Licht für ihre Arbeit."
  ],
  "en": [
    "A houseplant stands beside a window. Which way do many young shoots grow?",
    "Towards the light",
    "Always directly away from the window",
    "Always straight down",
    "Only towards the nearest door",
    "Observe plants at a bright window.",
    "Leaves need light to do their work."
  ],
  "fr": [
    "Une plante est placée à côté d’une fenêtre. Vers où poussent beaucoup de ses jeunes tiges ?",
    "Vers la lumière",
    "Toujours à l’opposé de la fenêtre",
    "Toujours droit vers le bas",
    "Uniquement vers la porte la plus proche",
    "Observe les plantes près d’une fenêtre lumineuse.",
    "Les feuilles ont besoin de lumière pour fonctionner."
  ],
  "it": [
    "Una pianta è accanto a una finestra. Verso dove crescono molti giovani germogli?",
    "Verso la luce",
    "Sempre dalla parte opposta alla finestra",
    "Sempre dritti verso il basso",
    "Soltanto verso la porta più vicina",
    "Osserva le piante vicino a una finestra luminosa.",
    "Le foglie hanno bisogno di luce per lavorare."
  ]
},
{
  "key": "4/science/pflanzen-4/pfl4_50",
  "reason": "Replace generic food-chain phrase with plants as food producers.",
  "de": [
    "Welche Rolle hat Gras in der Nahrungskette Gras, Hase, Fuchs?",
    "Es stellt mit Licht eigene Nährstoffe her",
    "Es jagt den Hasen",
    "Es frisst den Fuchs",
    "Es zersetzt ausschliesslich Tierknochen",
    "Pflanzen ernähren sich anders als Tiere.",
    "Denke daran, wozu ihre grünen Blätter Licht brauchen."
  ],
  "en": [
    "What role does grass have in the food chain grass, rabbit, fox?",
    "It makes its own nutrients using light",
    "It hunts the rabbit",
    "It eats the fox",
    "It only breaks down animal bones",
    "Plants obtain food differently from animals.",
    "Why do their green leaves need light?"
  ],
  "fr": [
    "Quel rôle joue l’herbe dans la chaîne herbe, lapin, renard ?",
    "Elle fabrique ses nutriments grâce à la lumière",
    "Elle chasse le lapin",
    "Elle mange le renard",
    "Elle décompose seulement les os d’animaux",
    "Les plantes se nourrissent autrement que les animaux.",
    "Pourquoi leurs feuilles vertes ont-elles besoin de lumière ?"
  ],
  "it": [
    "Quale ruolo ha l’erba nella catena erba, coniglio, volpe?",
    "Produce sostanze nutritive usando la luce",
    "Caccia il coniglio",
    "Mangia la volpe",
    "Decompone soltanto ossa animali",
    "Le piante si nutrono diversamente dagli animali.",
    "Perché le foglie verdi hanno bisogno di luce?"
  ]
},
{
  "key": "4/science/materie-stoffe-4/ms4_20",
  "reason": "Replace multi-blank rust phrase with a controlled comparison.",
  "de": [
    "Welcher Eisennagel rostet unter diesen Bedingungen am ehesten?",
    "Ein ungeschützter Nagel in feuchter Luft",
    "Ein trocken gelagerter Nagel im geschlossenen Behälter",
    "Ein vollständig mit Schutzlack bedeckter Nagel",
    "Ein vollständig mit Schutzöl bedeckter Nagel",
    "Rost braucht Kontakt mit bestimmten Stoffen.",
    "Feuchtigkeit und Sauerstoff spielen dabei eine Rolle."
  ],
  "en": [
    "Which iron nail is most likely to rust in these conditions?",
    "An unprotected nail in damp air",
    "A dry nail in a closed container",
    "A nail fully covered in protective paint",
    "A nail fully covered in protective oil",
    "Rust needs contact with certain substances.",
    "Moisture and oxygen play a role."
  ],
  "fr": [
    "Quel clou en fer risque le plus de rouiller dans ces conditions ?",
    "Un clou non protégé dans l’air humide",
    "Un clou sec dans une boîte fermée",
    "Un clou entièrement couvert de peinture protectrice",
    "Un clou entièrement couvert d’huile protectrice",
    "La rouille nécessite le contact avec certaines substances.",
    "L’humidité et l’oxygène jouent un rôle."
  ],
  "it": [
    "Quale chiodo di ferro rischia maggiormente di arrugginire?",
    "Un chiodo non protetto nell’aria umida",
    "Un chiodo asciutto in un contenitore chiuso",
    "Un chiodo interamente coperto di vernice protettiva",
    "Un chiodo interamente coperto di olio protettivo",
    "La ruggine richiede il contatto con certe sostanze.",
    "Umidità e ossigeno hanno un ruolo."
  ]
},
{
  "key": "4/science/materie-stoffe-4/ms4_30",
  "reason": "Recognise magnetic material without parenthetical terminology.",
  "de": [
    "Welchen Gegenstand zieht ein gewöhnlicher Magnet an?",
    "Einen Eisennagel",
    "Einen Holzlöffel",
    "Eine Glasperle",
    "Einen Korkzapfen",
    "Nicht jedes Material reagiert auf Magnete.",
    "Vergleiche Metall mit Holz, Glas und Kork."
  ],
  "en": [
    "Which object does an ordinary magnet attract?",
    "An iron nail",
    "A wooden spoon",
    "A glass bead",
    "A cork stopper",
    "Not every material reacts to magnets.",
    "Compare metal with wood, glass and cork."
  ],
  "fr": [
    "Quel objet un aimant ordinaire attire-t-il ?",
    "Un clou en fer",
    "Une cuillère en bois",
    "Une perle en verre",
    "Un bouchon en liège",
    "Tous les matériaux ne réagissent pas aux aimants.",
    "Compare le métal au bois, au verre et au liège."
  ],
  "it": [
    "Quale oggetto attira un normale magnete?",
    "Un chiodo di ferro",
    "Un cucchiaio di legno",
    "Una perlina di vetro",
    "Un tappo di sughero",
    "Non tutti i materiali reagiscono ai magneti.",
    "Confronta il metallo con legno, vetro e sughero."
  ]
},
{
  "key": "4/science/materie-stoffe-4/ms4_32",
  "reason": "Replace specialised periodic-table attribution with material-property classification.",
  "de": [
    "Nach welcher Eigenschaft kannst du durchsichtige und undurchsichtige Stoffe ordnen?",
    "Danach, ob Licht hindurchgeht",
    "Danach, wer sie gekauft hat",
    "Danach, wie ihr Name geschrieben wird",
    "Danach, an welchem Wochentag du sie findest",
    "Vergleiche Fensterglas mit einem Holzbrett.",
    "Kannst du einen Gegenstand dahinter sehen?"
  ],
  "en": [
    "Which property separates transparent and opaque materials?",
    "Whether light passes through them",
    "Who bought them",
    "How their names are spelt",
    "Which weekday you find them",
    "Compare window glass with a wooden board.",
    "Can you see an object behind them?"
  ],
  "fr": [
    "Quelle propriété distingue les matériaux transparents et opaques ?",
    "Le passage ou non de la lumière",
    "La personne qui les a achetés",
    "L’orthographe de leur nom",
    "Le jour où tu les trouves",
    "Compare une vitre à une planche en bois.",
    "Peux-tu voir un objet derrière ?"
  ],
  "it": [
    "Quale proprietà distingue materiali trasparenti e opachi?",
    "Se lasciano passare la luce",
    "Chi li ha comprati",
    "Come si scrive il loro nome",
    "Il giorno in cui li trovi",
    "Confronta un vetro con una tavola di legno.",
    "Riesci a vedere un oggetto dietro?"
  ]
},
{
  "key": "4/science/materie-stoffe-4/ms4_38",
  "reason": "Replace ionic bonding with observable dissolving.",
  "de": [
    "Du rührst wenig Salz in ein Glas Wasser. Was geschieht normalerweise?",
    "Das Salz löst sich im Wasser",
    "Das Salz wird zu Kies",
    "Das Wasser wird sofort zu Eis",
    "Das Salz verwandelt sich in Öl",
    "Auch wenn du es nicht mehr siehst, ist das Salz noch da.",
    "Der Stoff verteilt sich im Wasser."
  ],
  "en": [
    "You stir a little salt into a glass of water. What usually happens?",
    "The salt dissolves",
    "The salt turns into gravel",
    "The water instantly becomes ice",
    "The salt turns into oil",
    "The salt is still there even when you cannot see it.",
    "It spreads through the water."
  ],
  "fr": [
    "Tu remues un peu de sel dans un verre d’eau. Que se passe-t-il ?",
    "Le sel se dissout",
    "Le sel devient du gravier",
    "L’eau devient immédiatement glace",
    "Le sel devient de l’huile",
    "Le sel est toujours là même si tu ne le vois plus.",
    "Il se répartit dans l’eau."
  ],
  "it": [
    "Mescoli poco sale in un bicchiere d’acqua. Che cosa succede di solito?",
    "Il sale si scioglie",
    "Il sale diventa ghiaia",
    "L’acqua diventa subito ghiaccio",
    "Il sale diventa olio",
    "Il sale c’è ancora anche se non lo vedi.",
    "Si distribuisce nell’acqua."
  ]
},
{
  "key": "4/science/materie-stoffe-4/ms4_40",
  "reason": "Replace exothermy jargon with a familiar heat-releasing process.",
  "de": [
    "Bei welchem Vorgang wird Wärme an die Umgebung abgegeben?",
    "Beim Verbrennen von Holz",
    "Beim Schmelzen eines Eiswürfels",
    "Beim Verdunsten von Wasser",
    "Beim Auftauen gefrorener Beeren",
    "Denke an die Wärme eines Feuers.",
    "Die anderen Vorgänge benötigen Wärme aus der Umgebung."
  ],
  "en": [
    "Which process gives heat to its surroundings?",
    "Burning wood",
    "Melting an ice cube",
    "Evaporating water",
    "Thawing frozen berries",
    "Think about the warmth of a fire.",
    "The other processes take in heat from their surroundings."
  ],
  "fr": [
    "Quel phénomène libère de la chaleur dans son environnement ?",
    "Le bois qui brûle",
    "Un glaçon qui fond",
    "L’eau qui s’évapore",
    "Des baies congelées qui dégèlent",
    "Pense à la chaleur d’un feu.",
    "Les autres phénomènes absorbent de la chaleur."
  ],
  "it": [
    "Quale processo cede calore all’ambiente?",
    "La combustione del legno",
    "La fusione di un cubetto di ghiaccio",
    "L’evaporazione dell’acqua",
    "Lo scongelamento di bacche",
    "Pensa al calore di un fuoco.",
    "Gli altri processi assorbono calore dall’ambiente."
  ]
},
{
  "key": "4/science/materie-stoffe-4/ms4_44",
  "reason": "Replace electrolysis with age-appropriate separation of mixtures.",
  "de": [
    "Wie trennst du groben Sand von Wasser?",
    "Mit einem passenden Filter",
    "Mit einem Magneten",
    "Nur mit einer Taschenlampe",
    "Indem du die Mischung schüttelst",
    "Die Sandkörner sollen zurückbleiben.",
    "Wasser kann durch kleine Öffnungen gelangen."
  ],
  "en": [
    "How can you separate coarse sand from water?",
    "With a suitable filter",
    "With a magnet",
    "With only a torch",
    "By shaking the mixture",
    "The sand grains should be left behind.",
    "Water can pass through small openings."
  ],
  "fr": [
    "Comment séparer du sable grossier de l’eau ?",
    "Avec un filtre adapté",
    "Avec un aimant",
    "Avec une lampe seulement",
    "En secouant le mélange",
    "Les grains de sable doivent être retenus.",
    "L’eau peut passer par de petites ouvertures."
  ],
  "it": [
    "Come separi sabbia grossolana e acqua?",
    "Con un filtro adatto",
    "Con un magnete",
    "Soltanto con una torcia",
    "Agitando il miscuglio",
    "I granelli di sabbia devono restare indietro.",
    "L’acqua può passare attraverso piccole aperture."
  ]
},
{
  "key": "4/science/materie-stoffe-4/ms4_46",
  "reason": "Replace colloid size definition with observable immiscible liquids.",
  "de": [
    "Was beobachtest du meist, wenn Öl und Wasser nach dem Schütteln ruhig stehen?",
    "Sie bilden wieder getrennte Schichten",
    "Sie bleiben ohne Zusatz dauerhaft gleichmässig vermischt",
    "Sie werden beide bei Zimmertemperatur fest",
    "Das Öl löst sich genauso wie wenig Salz in Wasser",
    "Nicht alle Flüssigkeiten mischen sich dauerhaft.",
    "Beobachte die Flüssigkeit nach einigen Minuten."
  ],
  "en": [
    "What usually happens when shaken oil and water are left to stand?",
    "They separate into layers again",
    "They remain evenly mixed permanently without anything added",
    "Both become solid at room temperature",
    "Oil dissolves just like a little salt in water",
    "Not all liquids stay mixed.",
    "Observe the liquid after a few minutes."
  ],
  "fr": [
    "Que se passe-t-il quand on laisse reposer de l’huile et de l’eau agitées ?",
    "Elles forment à nouveau des couches séparées",
    "Ils restent mélangés uniformément pour toujours sans ajout",
    "Ils deviennent tous deux solides à température ambiante",
    "L’huile se dissout comme un peu de sel dans l’eau",
    "Tous les liquides ne restent pas mélangés.",
    "Observe après quelques minutes."
  ],
  "it": [
    "Che cosa accade lasciando riposare olio e acqua dopo averli agitati?",
    "Formano di nuovo strati separati",
    "Restano mescolati uniformemente per sempre senza aggiunte",
    "Diventano entrambi solidi a temperatura ambiente",
    "L’olio si scioglie come poco sale nell’acqua",
    "Non tutti i liquidi restano mescolati.",
    "Osserva dopo alcuni minuti."
  ]
},
{
  "key": "4/science/materie-stoffe-4/ms4_48",
  "reason": "Replace atomic decay definition with safe material investigation.",
  "de": [
    "Du findest eine unbekannte Flüssigkeit. Wie gehst du sicher vor?",
    "Nicht probieren und eine erwachsene Person fragen",
    "Einen Schluck trinken, um sie zu erkennen",
    "Sie direkt an die Nase halten und tief einatmen",
    "Sie mit allen anderen Flüssigkeiten mischen",
    "Unbekannte Stoffe können gefährlich sein.",
    "Zur Untersuchung gehört auch, Risiken zu vermeiden."
  ],
  "en": [
    "You find an unknown liquid. What is the safe response?",
    "Do not taste it and ask an adult",
    "Drink a mouthful to identify it",
    "Hold it to your nose and breathe deeply",
    "Mix it with every other liquid",
    "Unknown substances may be dangerous.",
    "Investigating also means avoiding risks."
  ],
  "fr": [
    "Tu trouves un liquide inconnu. Que faire pour rester en sécurité ?",
    "Ne pas le goûter et demander à un adulte",
    "En boire une gorgée pour l’identifier",
    "Le mettre sous le nez et inspirer profondément",
    "Le mélanger à tous les autres liquides",
    "Les substances inconnues peuvent être dangereuses.",
    "Étudier une substance demande aussi d’éviter les risques."
  ],
  "it": [
    "Trovi un liquido sconosciuto. Come agisci in sicurezza?",
    "Non assaggiarlo e chiedere a un adulto",
    "Berne un sorso per riconoscerlo",
    "Portarlo al naso e inspirare profondamente",
    "Mescolarlo con tutti gli altri liquidi",
    "Le sostanze sconosciute possono essere pericolose.",
    "Studiare una sostanza significa anche evitare rischi."
  ]
},
{
  "key": "4/science/kraefte-energie-4/ke4_10",
  "reason": "Recognise sunlight energy without malformed compound answer.",
  "de": [
    "Woran merkst du die Energie der Sonne auf deiner Haut?",
    "Sie wird im Sonnenlicht warm",
    "Sie wird durch das Sonnenlicht immer kälter",
    "Ihre Temperatur bleibt unabhängig von der Bestrahlung gleich",
    "Sie erwärmt sich nur, wenn die Sonne die Haut direkt berührt",
    "Vergleiche Sonne und Schatten.",
    "Denke an die Temperatur."
  ],
  "en": [
    "How can your skin notice energy from the Sun?",
    "It gets warm in sunlight",
    "Sunlight always makes it colder",
    "Its temperature stays unchanged regardless of sunlight",
    "It warms only if the Sun physically touches it",
    "Compare sunshine and shade.",
    "Think about temperature."
  ],
  "fr": [
    "Comment ta peau perçoit-elle l’énergie du soleil ?",
    "Elle se réchauffe au soleil",
    "La lumière solaire la refroidit toujours",
    "Sa température reste identique quelle que soit l’exposition",
    "Elle chauffe seulement si le Soleil la touche physiquement",
    "Compare le soleil et l’ombre.",
    "Pense à la température."
  ],
  "it": [
    "Come percepisce la pelle l’energia del sole?",
    "Si scalda alla luce del sole",
    "La luce solare la raffredda sempre",
    "La temperatura resta uguale indipendentemente dall’esposizione",
    "Si scalda solo se il Sole la tocca fisicamente",
    "Confronta sole e ombra.",
    "Pensa alla temperatura."
  ]
},
{
  "key": "4/science/kraefte-energie-4/ke4_12",
  "reason": "Recognise magnetic repulsion rather than type a general force phrase.",
  "de": [
    "Was geschieht, wenn du zwei Nordpole von Magneten näherst?",
    "Sie stossen sich ab",
    "Sie ziehen sich an",
    "Sie verlieren sofort jede Magnetkraft",
    "Sie schmelzen zusammen",
    "Vergleiche gleiche und verschiedene Pole.",
    "Die Richtung der Kraft hängt davon ab, welche Pole sich gegenüberstehen."
  ],
  "en": [
    "What happens when you bring two magnetic north poles together?",
    "They repel",
    "They attract",
    "They instantly lose all magnetism",
    "They melt together",
    "Compare like and unlike poles.",
    "The force depends on which poles face each other."
  ],
  "fr": [
    "Que se passe-t-il quand on rapproche deux pôles nord magnétiques ?",
    "Ils se repoussent",
    "Ils s’attirent",
    "Ils perdent aussitôt tout magnétisme",
    "Ils fondent ensemble",
    "Compare les pôles identiques et différents.",
    "La force dépend des pôles qui se font face."
  ],
  "it": [
    "Che cosa succede avvicinando due poli nord magnetici?",
    "Si respingono",
    "Si attirano",
    "Perdono subito tutto il magnetismo",
    "Si fondono insieme",
    "Confronta poli uguali e diversi.",
    "La forza dipende dai poli che si trovano di fronte."
  ]
},
{
  "key": "4/science/kraefte-energie-4/ke4_22",
  "reason": "Recognise the driving source of a waterwheel.",
  "de": [
    "Was treibt ein Wasserrad in einem Bach an?",
    "Das fliessende Wasser",
    "Der Wind allein",
    "Ein Feuer unter den Schaufeln",
    "Die Muskelkraft einer Person auf Pedalen",
    "Beobachte, was gegen die Schaufeln drückt.",
    "Etwas bewegt sich im Bach."
  ],
  "en": [
    "What drives a waterwheel in a stream?",
    "Flowing water",
    "Wind alone",
    "A fire under the paddles",
    "A person’s muscle power on pedals",
    "Notice what pushes the paddles.",
    "Something is moving in the stream."
  ],
  "fr": [
    "Qu’est-ce qui entraîne une roue à eau dans un ruisseau ?",
    "L’eau qui coule",
    "Le vent seul",
    "Un feu sous les pales",
    "La force d’une personne sur des pédales",
    "Observe ce qui pousse les pales.",
    "Quelque chose bouge dans le ruisseau."
  ],
  "it": [
    "Che cosa aziona una ruota idraulica in un ruscello?",
    "L’acqua che scorre",
    "Solo il vento",
    "Un fuoco sotto le pale",
    "La forza di una persona sui pedali",
    "Osserva che cosa spinge le pale.",
    "Qualcosa si muove nel ruscello."
  ]
},
{
  "key": "4/science/kraefte-energie-4/ke4_40",
  "reason": "Replace second law of thermodynamics with everyday heat transfer.",
  "de": [
    "Eine warme Tasse Tee steht in einem kühleren Zimmer. Was geschieht ohne weiteres Erwärmen?",
    "Der Tee gibt Wärme ab und kühlt sich ab",
    "Der Tee wird von selbst immer heisser",
    "Der Tee bleibt garantiert gleich warm",
    "Der Tee wird sofort kälter als Eis",
    "Vergleiche die Temperaturen von Tee und Zimmer.",
    "Wärme wird zwischen unterschiedlich warmen Dingen übertragen."
  ],
  "en": [
    "Warm tea stands in a cooler room. What happens without more heating?",
    "The tea gives off heat and cools",
    "The tea gets hotter by itself",
    "The tea is guaranteed to stay equally warm",
    "The tea instantly becomes colder than ice",
    "Compare the tea and room temperatures.",
    "Heat moves between things at different temperatures."
  ],
  "fr": [
    "Un thé chaud reste dans une pièce plus fraîche. Que se passe-t-il sans chauffage ?",
    "Il cède de la chaleur et refroidit",
    "Il devient toujours plus chaud tout seul",
    "Il garde forcément la même température",
    "Il devient immédiatement plus froid que la glace",
    "Compare les températures du thé et de la pièce.",
    "La chaleur passe entre des objets de températures différentes."
  ],
  "it": [
    "Un tè caldo resta in una stanza più fresca. Che cosa accade senza riscaldarlo?",
    "Cede calore e si raffredda",
    "Diventa sempre più caldo da solo",
    "Mantiene sicuramente la stessa temperatura",
    "Diventa subito più freddo del ghiaccio",
    "Confronta le temperature del tè e della stanza.",
    "Il calore passa tra oggetti con temperature diverse."
  ]
},
{
  "key": "4/science/kraefte-energie-4/ke4_42",
  "reason": "Replace resonance terminology with familiar swing timing.",
  "de": [
    "Wie bringst du eine Schaukel mit kleinen Schüben höher?",
    "Indem du passend zu ihrer Bewegung anschubst",
    "Indem du sie bei jedem Schub festhältst",
    "Indem du immer gegen ihre Bewegung drückst",
    "Indem du die Seile verkürzt, während jemand schaukelt",
    "Beobachte zuerst den Rhythmus.",
    "Dein Schub soll die Bewegung unterstützen, nicht bremsen."
  ],
  "en": [
    "How can small pushes make a swing go higher?",
    "By timing the pushes with its motion",
    "By holding it still at every push",
    "By always pushing against its motion",
    "By shortening the ropes while someone swings",
    "First observe the rhythm.",
    "Your push should help the motion, not slow it."
  ],
  "fr": [
    "Comment de petites poussées font-elles monter une balançoire ?",
    "En poussant au bon moment de son mouvement",
    "En la bloquant à chaque poussée",
    "En poussant toujours contre son mouvement",
    "En raccourcissant les cordes pendant son utilisation",
    "Observe d’abord le rythme.",
    "La poussée doit accompagner le mouvement, pas le freiner."
  ],
  "it": [
    "Come puoi far salire un’altalena con piccole spinte?",
    "Spingendo al momento giusto del movimento",
    "Bloccandola a ogni spinta",
    "Spingendo sempre contro il movimento",
    "Accorciando le corde mentre qualcuno dondola",
    "Osserva prima il ritmo.",
    "La spinta deve aiutare il movimento, non frenarlo."
  ]
},
{
  "key": "4/science/kraefte-energie-4/ke4_44",
  "reason": "Replace electromagnetic induction definition with bicycle dynamo energy conversion.",
  "de": [
    "Was macht ein Fahrraddynamo für die Lampe?",
    "Er wandelt Bewegung in elektrische Energie um",
    "Er speichert Trinkwasser",
    "Er wandelt Licht in Pedale um",
    "Er kühlt die Bremsen mit Eis",
    "Die Lampe kann beim Fahren leuchten.",
    "Dazu wird ein Teil der Bewegung des Fahrrads genutzt."
  ],
  "en": [
    "What does a bicycle dynamo do for the lamp?",
    "It converts motion into electrical energy",
    "It stores drinking water",
    "It turns light into pedals",
    "It cools the brakes with ice",
    "The lamp can shine while riding.",
    "It uses some of the bicycle’s motion."
  ],
  "fr": [
    "Que fait une dynamo de vélo pour la lampe ?",
    "Elle transforme le mouvement en énergie électrique",
    "Elle stocke de l’eau potable",
    "Elle transforme la lumière en pédales",
    "Elle refroidit les freins avec de la glace",
    "La lampe peut briller pendant le trajet.",
    "Elle utilise une partie du mouvement du vélo."
  ],
  "it": [
    "Che cosa fa una dinamo per la lampada della bici?",
    "Trasforma il movimento in energia elettrica",
    "Conserva acqua potabile",
    "Trasforma la luce in pedali",
    "Raffredda i freni con ghiaccio",
    "La lampada può illuminarsi mentre pedali.",
    "Usa una parte del movimento della bici."
  ]
},
{
  "key": "4/science/kraefte-energie-4/ke4_46",
  "reason": "Replace nuclear fusion/fission comparison with renewable energy recognition.",
  "de": [
    "Welche Energiequelle erneuert sich durch natürliche Vorgänge?",
    "Wind",
    "Erdöl",
    "Kohle",
    "Erdgas",
    "Vergleiche Wetter mit Brennstoffen aus dem Boden.",
    "Manche Vorräte brauchen Millionen Jahre, um zu entstehen."
  ],
  "en": [
    "Which energy source is renewed by natural processes?",
    "Wind",
    "Oil",
    "Coal",
    "Natural gas",
    "Compare weather with fuels from the ground.",
    "Some supplies take millions of years to form."
  ],
  "fr": [
    "Quelle source d’énergie se renouvelle par des phénomènes naturels ?",
    "Le vent",
    "Le pétrole",
    "Le charbon",
    "Le gaz naturel",
    "Compare la météo aux combustibles du sous-sol.",
    "Certaines réserves mettent des millions d’années à se former."
  ],
  "it": [
    "Quale fonte di energia si rinnova grazie a processi naturali?",
    "Il vento",
    "Il petrolio",
    "Il carbone",
    "Il gas naturale",
    "Confronta il tempo atmosferico con i combustibili del sottosuolo.",
    "Alcune riserve richiedono milioni di anni per formarsi."
  ]
},
{
  "key": "4/science/kraefte-energie-4/ke4_48",
  "reason": "Replace Doppler effect with observable friction and energy.",
  "de": [
    "Du reibst deine Hände kräftig aneinander. Was bemerkst du?",
    "Die Hände werden durch Reibung wärmer",
    "Die Hände werden durch die Reibung kälter",
    "Die Reibung verändert die Temperatur grundsätzlich nicht",
    "Nur die Luft wird wärmer, die Hände nie",
    "Bewegung kann eine Temperatur verändern.",
    "Vergleiche die Hände vor und nach dem Reiben."
  ],
  "en": [
    "You rub your hands together briskly. What do you notice?",
    "Friction makes your hands warmer",
    "Friction makes the hands colder",
    "Friction never changes temperature",
    "Only the air gets warmer, never the hands",
    "Motion can change temperature.",
    "Compare your hands before and after rubbing."
  ],
  "fr": [
    "Tu frottes vivement tes mains. Que remarques-tu ?",
    "Le frottement les réchauffe",
    "Le frottement refroidit les mains",
    "Le frottement ne change jamais la température",
    "Seul l’air chauffe, jamais les mains",
    "Le mouvement peut modifier la température.",
    "Compare tes mains avant et après."
  ],
  "it": [
    "Strofini energicamente le mani. Che cosa noti?",
    "L’attrito le riscalda",
    "L’attrito raffredda le mani",
    "L’attrito non cambia mai la temperatura",
    "Si scalda solo l’aria, mai le mani",
    "Il movimento può cambiare la temperatura.",
    "Confronta le mani prima e dopo."
  ]
},
{
  "key": "4/science/technik-4/tech4_12",
  "reason": "Recognise motor conversion without technical parenthetical answer.",
  "de": [
    "Was bewirkt der Elektromotor eines Ventilators?",
    "Er setzt die Flügel in Bewegung",
    "Er wandelt den Wind der Flügel hauptsächlich in Strom um",
    "Er speichert Strom, ohne etwas zu bewegen",
    "Er macht die Stromzufuhr während des Betriebs überflüssig",
    "Der Ventilator wird mit Strom versorgt.",
    "Überlege, was sich nach dem Einschalten verändert."
  ],
  "en": [
    "What does a fan’s electric motor do?",
    "It sets the blades in motion",
    "It mainly converts the blades’ wind into electricity",
    "It stores electricity without moving anything",
    "It makes an electricity supply unnecessary during operation",
    "The fan receives electricity.",
    "What changes when it is switched on?"
  ],
  "fr": [
    "Que fait le moteur électrique d’un ventilateur ?",
    "Il fait tourner les pales",
    "Il transforme surtout le vent des pales en électricité",
    "Il stocke du courant sans rien déplacer",
    "Il rend l’alimentation électrique inutile pendant le fonctionnement",
    "Le ventilateur reçoit de l’électricité.",
    "Qu’est-ce qui change quand on l’allume ?"
  ],
  "it": [
    "Che cosa fa il motore elettrico di un ventilatore?",
    "Mette in movimento le pale",
    "Trasforma soprattutto il vento delle pale in elettricità",
    "Conserva elettricità senza muovere nulla",
    "Rende inutile l’alimentazione durante il funzionamento",
    "Il ventilatore riceve elettricità.",
    "Che cosa cambia quando lo accendi?"
  ]
},
{
  "key": "4/science/technik-4/tech4_14",
  "reason": "Identify bicycle chain engagement without paired technical names.",
  "de": [
    "Worin greift die Fahrradkette, damit die Kraft übertragen wird?",
    "In die Zähne von Zahnrädern",
    "In das Glas des Rücklichts",
    "In den Stoff des Sattels",
    "In die Luft im Reifen",
    "Schau gedanklich auf den Antrieb bei den Pedalen.",
    "Die Kette soll nicht auf einer glatten Fläche rutschen."
  ],
  "en": [
    "What does a bicycle chain engage with to transfer force?",
    "The teeth of sprockets",
    "The rear light’s glass",
    "The saddle fabric",
    "The air in the tyre",
    "Picture the drive near the pedals.",
    "The chain must not slip on a smooth surface."
  ],
  "fr": [
    "Dans quoi la chaîne du vélo s’engage-t-elle pour transmettre la force ?",
    "Dans les dents des roues dentées",
    "Dans le verre du feu arrière",
    "Dans le tissu de la selle",
    "Dans l’air du pneu",
    "Imagine le mécanisme près des pédales.",
    "La chaîne ne doit pas glisser sur une surface lisse."
  ],
  "it": [
    "Con che cosa ingrana la catena della bici per trasmettere la forza?",
    "Con i denti delle ruote dentate",
    "Con il vetro del fanale",
    "Con il tessuto della sella",
    "Con l’aria nel pneumatico",
    "Immagina il meccanismo vicino ai pedali.",
    "La catena non deve scivolare su una superficie liscia."
  ]
},
{
  "key": "4/science/technik-4/tech4_16",
  "reason": "Apply gearing to cycling rather than vague motor-versus-gearbox phrase.",
  "de": [
    "Warum schaltest du beim steilen Bergauffahren in einen kleinen Gang?",
    "Damit du pro Pedaltritt weniger Kraft brauchst",
    "Damit du überhaupt nicht mehr treten musst",
    "Damit die Bremsen stärker reiben",
    "Damit der Reifen mehr Luft enthält",
    "Vergleiche einen grossen und einen kleinen Gang.",
    "Leichteres Treten geht mit einem kürzeren Weg pro Kurbelumdrehung einher."
  ],
  "en": [
    "Why use a low gear when cycling up a steep hill?",
    "To need less force on each pedal stroke",
    "To avoid pedalling altogether",
    "To make the brakes rub harder",
    "To put more air in the tyre",
    "Compare high and low gears.",
    "Easier pedalling means travelling less far per crank rotation."
  ],
  "fr": [
    "Pourquoi utiliser un petit rapport dans une montée raide à vélo ?",
    "Pour fournir moins de force sur les pédales",
    "Pour ne plus pédaler du tout",
    "Pour que les freins frottent davantage",
    "Pour mettre plus d’air dans le pneu",
    "Compare un grand et un petit rapport.",
    "Pédaler plus facilement fait parcourir moins de distance par tour de pédalier."
  ],
  "it": [
    "Perché usi una marcia bassa pedalando su una salita ripida?",
    "Per esercitare meno forza sui pedali",
    "Per non dover più pedalare",
    "Per far sfregare di più i freni",
    "Per avere più aria nel pneumatico",
    "Confronta una marcia alta e una bassa.",
    "Pedalare più facilmente significa percorrere meno strada per giro."
  ]
},
{
  "key": "4/science/technik-4/tech4_36",
  "reason": "Replace steam turbine sequence with accessible wind turbine mechanism.",
  "de": [
    "Was bringt die Rotorblätter einer Windkraftanlage zum Drehen?",
    "Die Kraft der bewegten Luft",
    "Das Gewicht der Wolken",
    "Das Licht der Sterne",
    "Das Wachstum des Grases",
    "Die Anlage nutzt eine Bewegung in der Umgebung.",
    "An windstillen Tagen fehlt dieser Antrieb."
  ],
  "en": [
    "What makes a wind turbine’s blades rotate?",
    "The force of moving air",
    "The weight of clouds",
    "Starlight",
    "Growing grass",
    "The machine uses motion in its surroundings.",
    "On calm days, this driving force is missing."
  ],
  "fr": [
    "Qu’est-ce qui fait tourner les pales d’une éolienne ?",
    "La force de l’air en mouvement",
    "Le poids des nuages",
    "La lumière des étoiles",
    "La croissance de l’herbe",
    "La machine utilise un mouvement autour d’elle.",
    "Par temps calme, cette force manque."
  ],
  "it": [
    "Che cosa fa girare le pale di una turbina eolica?",
    "La forza dell’aria in movimento",
    "Il peso delle nuvole",
    "La luce delle stelle",
    "La crescita dell’erba",
    "La macchina usa un movimento nell’ambiente.",
    "Nei giorni senza vento manca questa forza."
  ]
},
{
  "key": "4/science/technik-4/tech4_38",
  "reason": "Replace FPGA with age-appropriate programming sequence.",
  "de": [
    "Ein Roboter soll zuerst vorwärtsfahren und dann anhalten. Welche Befehlsfolge passt?",
    "Vorwärtsfahren, dann stoppen",
    "Stoppen, dann rückwärtsfahren",
    "Drehen, dann weiterdrehen",
    "Rückwärtsfahren, dann schneller werden",
    "Ein Programm führt Befehle in einer Reihenfolge aus.",
    "Vergleiche Anfang und Ende der gewünschten Bewegung."
  ],
  "en": [
    "A robot should move forwards and then stop. Which sequence fits?",
    "Move forwards, then stop",
    "Stop, then move backwards",
    "Turn, then keep turning",
    "Move backwards, then speed up",
    "A program follows commands in an order.",
    "Compare the start and end of the requested motion."
  ],
  "fr": [
    "Un robot doit avancer puis s’arrêter. Quelle suite convient ?",
    "Avancer, puis s’arrêter",
    "S’arrêter, puis reculer",
    "Tourner, puis continuer à tourner",
    "Reculer, puis accélérer",
    "Un programme suit les instructions dans un ordre.",
    "Compare le début et la fin du mouvement demandé."
  ],
  "it": [
    "Un robot deve avanzare e poi fermarsi. Quale sequenza va bene?",
    "Avanzare, poi fermarsi",
    "Fermarsi, poi arretrare",
    "Girare, poi continuare a girare",
    "Arretrare, poi accelerare",
    "Un programma segue i comandi in un ordine.",
    "Confronta l’inizio e la fine del movimento richiesto."
  ]
},
{
  "key": "4/science/technik-4/tech4_40",
  "reason": "Replace misleading machine-learning definition with appropriate critical use of computers.",
  "de": [
    "Ein Computerprogramm gibt dir eine Antwort. Was ist bei wichtigen Informationen sinnvoll?",
    "Die Antwort mit einer zuverlässigen Quelle prüfen",
    "Jede Antwort ungeprüft für richtig halten",
    "Nur auf die Länge der Antwort achten",
    "Alle anderen Quellen sofort löschen",
    "Auch Programme können Fehler machen.",
    "Eine zweite verlässliche Quelle hilft beim Vergleichen."
  ],
  "en": [
    "A computer program gives you an answer. What should you do with important information?",
    "Check it against a reliable source",
    "Assume every answer is correct",
    "Judge only the answer’s length",
    "Delete all other sources immediately",
    "Programs can make mistakes too.",
    "A second reliable source helps you compare."
  ],
  "fr": [
    "Un programme te donne une réponse. Que faire pour une information importante ?",
    "La vérifier avec une source fiable",
    "Croire chaque réponse sans vérifier",
    "Regarder seulement la longueur de la réponse",
    "Supprimer immédiatement les autres sources",
    "Les programmes peuvent aussi se tromper.",
    "Une autre source fiable permet de comparer."
  ],
  "it": [
    "Un programma ti dà una risposta. Che cosa fare con informazioni importanti?",
    "Controllarle con una fonte affidabile",
    "Credere a ogni risposta senza controllare",
    "Guardare soltanto la lunghezza della risposta",
    "Cancellare subito tutte le altre fonti",
    "Anche i programmi possono sbagliare.",
    "Un’altra fonte affidabile permette di confrontare."
  ]
},
{
  "key": "4/science/technik-4/tech4_44",
  "reason": "Replace abstract feedback-loop definition with thermostat use.",
  "de": [
    "Ein Thermostat soll das Zimmer bei 20 Grad halten. Es misst nur 17 Grad. Was sollte die Heizung tun?",
    "Heizen, bis die gewünschte Temperatur erreicht wird",
    "Sofort dauerhaft ausgeschaltet bleiben",
    "Das Zimmer weiter abkühlen",
    "Die Temperaturmessung ignorieren",
    "Vergleiche gemessene und gewünschte Temperatur.",
    "Die Regelung soll den Unterschied verkleinern."
  ],
  "en": [
    "A thermostat should keep a room at 20 degrees. It measures 17 degrees. What should the heating do?",
    "Heat until the desired temperature is reached",
    "Stay switched off permanently",
    "Cool the room further",
    "Ignore the temperature reading",
    "Compare actual and desired temperatures.",
    "The control should reduce the difference."
  ],
  "fr": [
    "Un thermostat doit maintenir 20 degrés. Il mesure 17 degrés. Que doit faire le chauffage ?",
    "Chauffer jusqu’à la température souhaitée",
    "Rester éteint définitivement",
    "Refroidir davantage la pièce",
    "Ignorer la température mesurée",
    "Compare la température mesurée à celle souhaitée.",
    "Le réglage doit réduire l’écart."
  ],
  "it": [
    "Un termostato deve mantenere 20 gradi. Ne misura 17. Che cosa deve fare il riscaldamento?",
    "Scaldare fino alla temperatura desiderata",
    "Restare spento per sempre",
    "Raffreddare ancora la stanza",
    "Ignorare la temperatura misurata",
    "Confronta temperatura misurata e desiderata.",
    "La regolazione deve ridurre la differenza."
  ]
},
{
  "key": "4/science/technik-4/tech4_46",
  "reason": "Apply cybersecurity through child-relevant password privacy.",
  "de": [
    "Eine unbekannte Person im Spielchat fragt nach deinem Passwort. Was tust du?",
    "Nichts weitergeben und eine vertraute erwachsene Person informieren",
    "Das Passwort schicken, wenn sie freundlich fragt",
    "Das Passwort öffentlich in den Chat schreiben",
    "Ihr das Passwort zusammen mit deiner Adresse senden",
    "Dein Passwort schützt dein Konto.",
    "Freundliche Worte beweisen nicht, wer hinter einer Nachricht steckt."
  ],
  "en": [
    "A stranger in a game chat asks for your password. What do you do?",
    "Do not share it and tell a trusted adult",
    "Send it if they ask politely",
    "Post it publicly in the chat",
    "Send it together with your address",
    "Your password protects your account.",
    "Friendly words do not prove who sent a message."
  ],
  "fr": [
    "Un inconnu dans un jeu demande ton mot de passe. Que fais-tu ?",
    "Ne rien donner et prévenir un adulte de confiance",
    "Le donner s’il demande gentiment",
    "L’écrire dans le chat public",
    "L’envoyer avec ton adresse",
    "Ton mot de passe protège ton compte.",
    "Un message gentil ne prouve pas l’identité de son auteur."
  ],
  "it": [
    "Uno sconosciuto nella chat di un gioco chiede la tua password. Che fai?",
    "Non la condivido e avviso un adulto fidato",
    "La invio se la chiede gentilmente",
    "La scrivo nella chat pubblica",
    "La invio insieme al mio indirizzo",
    "La password protegge il tuo account.",
    "Parole gentili non dimostrano chi ha scritto il messaggio."
  ]
},
{
  "key": "4/science/technik-4/tech4_48",
  "reason": "Replace augmented-reality definition with recognising a digital overlay.",
  "de": [
    "Eine Handy-App zeigt auf dem Kamerabild einen erfundenen Drachen im Zimmer. Was stimmt?",
    "Der Drache ist eine digitale Ergänzung im Bild",
    "Im Zimmer steht deshalb ein echter Drache",
    "Die Kamera hat das Zimmer in einen Wald verwandelt",
    "Alle Personen sehen den Drachen auch ohne Bildschirm",
    "Vergleiche Bildschirm und Blick ins Zimmer.",
    "Ein Programm kann dem Kamerabild etwas hinzufügen."
  ],
  "en": [
    "A phone app shows an invented dragon in the camera view of your room. What is true?",
    "The dragon is a digital addition to the image",
    "There is now a real dragon in the room",
    "The camera has turned the room into a forest",
    "Everyone can see the dragon without a screen",
    "Compare the screen with the room itself.",
    "A program can add something to a camera image."
  ],
  "fr": [
    "Une appli montre un dragon imaginaire dans l’image de ta chambre. Qu’est-ce qui est vrai ?",
    "Le dragon est un ajout numérique dans l’image",
    "Un vrai dragon se trouve maintenant dans la chambre",
    "La caméra a transformé la chambre en forêt",
    "Tout le monde voit le dragon sans écran",
    "Compare l’écran et la chambre réelle.",
    "Un programme peut ajouter quelque chose à l’image filmée."
  ],
  "it": [
    "Un’app mostra un drago inventato nell’immagine della tua stanza. Che cosa è vero?",
    "Il drago è un’aggiunta digitale all’immagine",
    "Ora nella stanza c’è un drago vero",
    "La fotocamera ha trasformato la stanza in un bosco",
    "Tutti vedono il drago anche senza schermo",
    "Confronta lo schermo con la stanza reale.",
    "Un programma può aggiungere qualcosa all’immagine ripresa."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_12",
  "reason": "Recognise renewable source with finite-fuel distractors.",
  "de": [
    "Welche Anlage nutzt eine erneuerbare Energiequelle?",
    "Ein Wasserkraftwerk",
    "Ein Kohlekraftwerk",
    "Eine Ölheizung",
    "Ein Erdgaskraftwerk",
    "Vergleiche Brennstoffe mit dem Wasserkreislauf.",
    "Manche Energiequellen werden laufend durch natürliche Vorgänge erneuert."
  ],
  "en": [
    "Which installation uses a renewable energy source?",
    "A hydroelectric plant",
    "A coal power station",
    "An oil heater",
    "A natural gas power station",
    "Compare fuels with the water cycle.",
    "Natural processes continually renew some energy sources."
  ],
  "fr": [
    "Quelle installation utilise une énergie renouvelable ?",
    "Une centrale hydroélectrique",
    "Une centrale à charbon",
    "Un chauffage au mazout",
    "Une centrale à gaz naturel",
    "Compare les combustibles au cycle de l’eau.",
    "Les phénomènes naturels renouvellent certaines sources d’énergie."
  ],
  "it": [
    "Quale impianto usa una fonte rinnovabile?",
    "Una centrale idroelettrica",
    "Una centrale a carbone",
    "Un riscaldamento a petrolio",
    "Una centrale a gas naturale",
    "Confronta i combustibili con il ciclo dell’acqua.",
    "I processi naturali rinnovano alcune fonti di energia."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_16",
  "reason": "Apply food relationship to ecological change.",
  "de": [
    "In einem Teich fressen Fische Wasserinsekten. Was kann bei starkem Rückgang der Insekten passieren?",
    "Die Fische finden weniger Nahrung",
    "Die Fische brauchen plötzlich kein Futter",
    "Die Fische werden zu Pflanzen",
    "Das Wasser wird allein dadurch salzig",
    "Verfolge, wer sich von wem ernährt.",
    "Eine Veränderung kann andere Lebewesen betreffen."
  ],
  "en": [
    "Fish in a pond eat aquatic insects. What may happen if insect numbers fall sharply?",
    "The fish find less food",
    "The fish no longer need food",
    "The fish become plants",
    "This alone makes the water salty",
    "Follow who eats whom.",
    "A change can affect other living things."
  ],
  "fr": [
    "Des poissons mangent des insectes aquatiques. Que peut entraîner une forte baisse des insectes ?",
    "Les poissons trouvent moins de nourriture",
    "Les poissons n’ont plus besoin de nourriture",
    "Les poissons deviennent des plantes",
    "Cela suffit à rendre l’eau salée",
    "Suis les relations alimentaires.",
    "Un changement peut toucher d’autres êtres vivants."
  ],
  "it": [
    "I pesci mangiano insetti acquatici. Che cosa può accadere se gli insetti diminuiscono molto?",
    "I pesci trovano meno cibo",
    "I pesci non hanno più bisogno di cibo",
    "I pesci diventano piante",
    "Questo da solo rende l’acqua salata",
    "Segui chi mangia chi.",
    "Un cambiamento può influire su altri esseri viventi."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_20",
  "reason": "Recognise a specific plastic wildlife hazard.",
  "de": [
    "Warum ist eine weggeworfene Plastikschnur am See gefährlich für Vögel?",
    "Sie können sich darin verfangen",
    "Sie macht alle Federn wasserdicht",
    "Sie liefert immer geeignetes Futter",
    "Sie hält sämtliche Fressfeinde fern",
    "Dünne Schnüre können sich um Körperteile wickeln.",
    "Überlege, was das für die Bewegung bedeutet."
  ],
  "en": [
    "Why is discarded plastic string by a lake dangerous for birds?",
    "They can become entangled in it",
    "It waterproofs all their feathers",
    "It always provides suitable food",
    "It keeps every predator away",
    "Thin strings can wrap around body parts.",
    "Consider what this does to movement."
  ],
  "fr": [
    "Pourquoi une ficelle en plastique jetée près d’un lac menace-t-elle les oiseaux ?",
    "Ils peuvent s’y emmêler",
    "Elle imperméabilise toutes leurs plumes",
    "Elle fournit toujours une nourriture adaptée",
    "Elle éloigne tous les prédateurs",
    "Une ficelle peut s’enrouler autour du corps.",
    "Pense aux conséquences sur les mouvements."
  ],
  "it": [
    "Perché uno spago di plastica abbandonato al lago è pericoloso per gli uccelli?",
    "Possono restarvi impigliati",
    "Rende impermeabili tutte le piume",
    "Fornisce sempre cibo adatto",
    "Tiene lontani tutti i predatori",
    "Uno spago può avvolgersi attorno al corpo.",
    "Pensa alle conseguenze sui movimenti."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_24",
  "reason": "Replace acid rain formula recall with air-pollution source recognition.",
  "de": [
    "Welche Handlung verursacht direkt Abgase?",
    "Benzin in einem Automotor verbrennen",
    "Zu Fuss zur Schule gehen",
    "Ein Buch ohne Gerät lesen",
    "Ein Fahrrad ohne Motor fahren",
    "Achte auf die Verbrennung eines Treibstoffs.",
    "Dabei entstehen Stoffe, die in die Luft gelangen."
  ],
  "en": [
    "Which action directly produces exhaust fumes?",
    "Burning petrol in a car engine",
    "Walking to school",
    "Reading a paper book",
    "Riding a bicycle without a motor",
    "Look for fuel combustion.",
    "It produces substances that enter the air."
  ],
  "fr": [
    "Quelle action produit directement des gaz d’échappement ?",
    "Brûler de l’essence dans un moteur",
    "Aller à l’école à pied",
    "Lire un livre papier",
    "Rouler à vélo sans moteur",
    "Cherche la combustion d’un carburant.",
    "Elle produit des substances qui passent dans l’air."
  ],
  "it": [
    "Quale azione produce direttamente gas di scarico?",
    "Bruciare benzina in un motore",
    "Andare a scuola a piedi",
    "Leggere un libro di carta",
    "Andare in bici senza motore",
    "Cerca la combustione di un carburante.",
    "Produce sostanze che entrano nell’aria."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_26",
  "reason": "Clarify glacier retreat over time rather than blanket melting cause.",
  "de": [
    "Warum verlieren viele Alpengletscher über Jahre an Eis?",
    "Es schmilzt mehr Eis, als durch Schnee neu entsteht",
    "Jeder Sommer lässt sie gleich stark wachsen",
    "Das Eis wird vollständig zu Fels",
    "Die Berge saugen das Eis unverändert auf",
    "Vergleiche Verlust und Neubildung.",
    "Wärmere Temperaturen beeinflussen dieses Gleichgewicht."
  ],
  "en": [
    "Why do many Alpine glaciers lose ice over the years?",
    "More ice melts than is replaced by snowfall",
    "Every summer makes them grow equally",
    "All the ice turns into rock",
    "Mountains absorb the ice unchanged",
    "Compare loss with new formation.",
    "Warmer temperatures affect this balance."
  ],
  "fr": [
    "Pourquoi de nombreux glaciers alpins perdent-ils de la glace au fil des années ?",
    "Il fond plus de glace que la neige n’en reforme",
    "Chaque été les fait grandir autant",
    "Toute la glace devient roche",
    "Les montagnes absorbent la glace intacte",
    "Compare les pertes et la formation.",
    "Des températures plus élevées modifient cet équilibre."
  ],
  "it": [
    "Perché molti ghiacciai alpini perdono ghiaccio negli anni?",
    "Si scioglie più ghiaccio di quanto la neve ne riformi",
    "Ogni estate li fa crescere allo stesso modo",
    "Tutto il ghiaccio diventa roccia",
    "Le montagne assorbono il ghiaccio intatto",
    "Confronta perdite e nuova formazione.",
    "Temperature più alte modificano questo equilibrio."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_28",
  "reason": "Recognise habitat loss from deforestation.",
  "de": [
    "Was passiert, wenn ein artenreicher Wald vollständig für ein Feld gerodet wird?",
    "Viele Waldtiere verlieren Nahrung und Verstecke",
    "Alle Waldarten bleiben sicher unverändert erhalten",
    "Jeder Baum wächst sofort wieder nach",
    "Das Feld bietet automatisch genau dieselben Lebensräume",
    "Vergleiche einen Wald mit einem offenen Feld.",
    "Nicht jedes Tier kann dort gleich gut leben."
  ],
  "en": [
    "What happens when a diverse forest is completely cleared for a field?",
    "Many forest animals lose food and shelter",
    "Every forest species certainly remains unchanged",
    "Every tree grows back immediately",
    "The field automatically offers identical habitats",
    "Compare a forest with an open field.",
    "Not every animal can live equally well there."
  ],
  "fr": [
    "Que se passe-t-il quand on défriche entièrement une forêt riche en espèces pour un champ ?",
    "De nombreux animaux perdent nourriture et abris",
    "Toutes les espèces restent forcément inchangées",
    "Chaque arbre repousse immédiatement",
    "Le champ offre automatiquement les mêmes habitats",
    "Compare une forêt à un champ ouvert.",
    "Tous les animaux ne peuvent pas y vivre aussi bien."
  ],
  "it": [
    "Che cosa accade disboscando interamente una foresta ricca di specie per un campo?",
    "Molti animali perdono cibo e ripari",
    "Tutte le specie restano sicuramente invariate",
    "Ogni albero ricresce subito",
    "Il campo offre automaticamente gli stessi habitat",
    "Confronta una foresta con un campo aperto.",
    "Non tutti gli animali possono viverci altrettanto bene."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_30",
  "reason": "Replace treaty acronym with practical wildlife protection.",
  "de": [
    "Wie schützt du seltene Wildpflanzen beim Wandern?",
    "Du lässt sie an ihrem Standort wachsen",
    "Du gräbst sie für deinen Garten aus",
    "Du pflückst alle Blüten als Andenken",
    "Du zertrittst andere Pflanzen rundherum",
    "Seltene Arten brauchen geeignete Lebensräume.",
    "Ein Foto ist schonender als das Mitnehmen."
  ],
  "en": [
    "How can you protect rare wild plants on a hike?",
    "Leave them growing where they are",
    "Dig them up for your garden",
    "Pick all the flowers as souvenirs",
    "Trample the plants around them",
    "Rare species need suitable habitats.",
    "A photo does less harm than taking the plant."
  ],
  "fr": [
    "Comment protéger les plantes sauvages rares en randonnée ?",
    "Les laisser pousser sur place",
    "Les déterrer pour ton jardin",
    "Cueillir toutes les fleurs en souvenir",
    "Piétiner les plantes autour",
    "Les espèces rares ont besoin d’un habitat adapté.",
    "Une photo est moins dommageable qu’emporter la plante."
  ],
  "it": [
    "Come proteggi le piante selvatiche rare durante un’escursione?",
    "Le lasci crescere dove sono",
    "Le sradichi per il giardino",
    "Raccogli tutti i fiori come ricordo",
    "Calpesti le piante intorno",
    "Le specie rare hanno bisogno di habitat adatti.",
    "Una foto è meno dannosa che portare via la pianta."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_36",
  "reason": "Apply species diversity to garden management.",
  "de": [
    "Was fördert verschiedene Insektenarten im Garten?",
    "Verschiedene einheimische Blütenpflanzen",
    "Eine vollständig versiegelte Betonfläche",
    "Das Entfernen sämtlicher Blüten",
    "Das tägliche Besprühen aller Pflanzen mit Insektengift",
    "Verschiedene Arten brauchen unterschiedliche Nahrung.",
    "Blütezeiten und Blütenformen können sich ergänzen."
  ],
  "en": [
    "What supports different insect species in a garden?",
    "A variety of native flowering plants",
    "A completely sealed concrete area",
    "Removing every flower",
    "Spraying every plant with insecticide daily",
    "Different species need different food.",
    "Flower shapes and flowering seasons can complement each other."
  ],
  "fr": [
    "Qu’est-ce qui favorise différentes espèces d’insectes au jardin ?",
    "Diverses plantes à fleurs indigènes",
    "Une surface entièrement bétonnée",
    "Enlever toutes les fleurs",
    "Pulvériser un insecticide partout chaque jour",
    "Les espèces ont des besoins alimentaires différents.",
    "Les formes des fleurs et les floraisons peuvent se compléter."
  ],
  "it": [
    "Che cosa favorisce diverse specie di insetti in giardino?",
    "Diverse piante da fiore autoctone",
    "Una superficie tutta cementata",
    "Togliere tutti i fiori",
    "Spruzzare insetticida ovunque ogni giorno",
    "Specie diverse hanno bisogni alimentari diversi.",
    "Forme e periodi di fioritura possono completarsi."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_38",
  "reason": "Replace biotic/abiotic vocabulary with living/nonliving distinction.",
  "de": [
    "Welcher Einfluss auf eine Waldpflanze kommt von etwas Nichtlebendem?",
    "Die Temperatur",
    "Ein Reh, das Blätter frisst",
    "Ein Pilz an ihren Wurzeln",
    "Eine Raupe auf ihrem Blatt",
    "Unterscheide Lebewesen von Umweltbedingungen.",
    "Ein Messwert ist kein Organismus."
  ],
  "en": [
    "Which influence on a forest plant comes from something nonliving?",
    "Temperature",
    "A deer eating its leaves",
    "A fungus at its roots",
    "A caterpillar on its leaf",
    "Distinguish living things from environmental conditions.",
    "A measured value is not an organism."
  ],
  "fr": [
    "Quelle influence sur une plante forestière vient de quelque chose de non vivant ?",
    "La température",
    "Un chevreuil qui mange ses feuilles",
    "Un champignon à ses racines",
    "Une chenille sur une feuille",
    "Distingue les êtres vivants des conditions du milieu.",
    "Une valeur mesurée n’est pas un organisme."
  ],
  "it": [
    "Quale influenza su una pianta del bosco viene da qualcosa di non vivente?",
    "La temperatura",
    "Un capriolo che mangia le foglie",
    "Un fungo alle radici",
    "Un bruco su una foglia",
    "Distingui esseri viventi e condizioni ambientali.",
    "Un valore misurato non è un organismo."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_40",
  "reason": "Apply light needs instead of repeated plant definition.",
  "de": [
    "Eine gesunde Pflanze steht lange in einem dunklen Schrank und bekommt Wasser. Was fehlt ihr?",
    "Licht",
    "Noch mehr Dunkelheit",
    "Ein grösseres Namensschild",
    "Musik aus einem Lautsprecher",
    "Wasser allein erfüllt nicht alle Bedürfnisse.",
    "Denke an die Aufgabe der grünen Blätter."
  ],
  "en": [
    "A healthy plant stays in a dark cupboard for a long time and gets water. What is missing?",
    "Light",
    "More darkness",
    "A larger name label",
    "Music from a speaker",
    "Water alone does not meet every need.",
    "Think of what green leaves do."
  ],
  "fr": [
    "Une plante saine reste longtemps dans un placard sombre et reçoit de l’eau. Que lui manque-t-il ?",
    "La lumière",
    "Encore plus d’obscurité",
    "Une étiquette plus grande",
    "La musique d’un haut-parleur",
    "L’eau seule ne répond pas à tous ses besoins.",
    "Pense au rôle des feuilles vertes."
  ],
  "it": [
    "Una pianta sana resta a lungo in un armadio buio e riceve acqua. Che cosa le manca?",
    "La luce",
    "Ancora più buio",
    "Un’etichetta più grande",
    "La musica di un altoparlante",
    "L’acqua da sola non basta.",
    "Pensa al compito delle foglie verdi."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_42",
  "reason": "Replace duplicate chain phrase with identifying a producer.",
  "de": [
    "Wer steht am Anfang der Nahrungskette Eichenblatt, Raupe, Meise?",
    "Die Eiche",
    "Die Meise",
    "Die Raupe",
    "Alle drei sind Fressfeinde der anderen",
    "Beginne bei dem Lebewesen, das nicht erst ein anderes fressen muss.",
    "Es nutzt Sonnenlicht."
  ],
  "en": [
    "Who is at the start of the food chain oak leaf, caterpillar, tit?",
    "The oak",
    "The tit",
    "The caterpillar",
    "All three are predators of the others",
    "Start with the organism that does not need to eat another.",
    "It uses sunlight."
  ],
  "fr": [
    "Qui est au début de la chaîne feuille de chêne, chenille, mésange ?",
    "Le chêne",
    "La mésange",
    "La chenille",
    "Les trois sont prédateurs des autres",
    "Commence par celui qui ne doit pas manger un autre être vivant.",
    "Il utilise la lumière solaire."
  ],
  "it": [
    "Chi è all’inizio della catena foglia di quercia, bruco, cinciallegra?",
    "La quercia",
    "La cinciallegra",
    "Il bruco",
    "Tutti e tre sono predatori degli altri",
    "Inizia dall’organismo che non deve mangiarne un altro.",
    "Usa la luce solare."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_48",
  "reason": "Replace blue-carbon terminology with soil protection by roots.",
  "de": [
    "Warum helfen Pflanzenwurzeln gegen das Wegspülen von Erde?",
    "Sie halten Bodenteilchen fest",
    "Sie machen Regen unmöglich",
    "Sie verwandeln den Boden vollständig in Beton",
    "Sie verhindern jedes Gefälle",
    "Vergleiche bewachsenen und nackten Boden.",
    "Die Wurzeln bilden ein Netz im Boden."
  ],
  "en": [
    "Why do plant roots help stop soil washing away?",
    "They hold soil particles in place",
    "They make rain impossible",
    "They turn all soil into concrete",
    "They remove every slope",
    "Compare planted and bare soil.",
    "Roots form a network in the ground."
  ],
  "fr": [
    "Pourquoi les racines limitent-elles l’emportement de la terre par l’eau ?",
    "Elles retiennent les particules du sol",
    "Elles rendent la pluie impossible",
    "Elles transforment tout le sol en béton",
    "Elles suppriment toutes les pentes",
    "Compare un sol couvert de plantes à un sol nu.",
    "Les racines forment un réseau dans le sol."
  ],
  "it": [
    "Perché le radici aiutano a evitare che l’acqua porti via il terreno?",
    "Trattengono le particelle del suolo",
    "Rendono impossibile la pioggia",
    "Trasformano tutto il terreno in cemento",
    "Eliminano ogni pendenza",
    "Confronta terreno coperto di piante e terreno nudo.",
    "Le radici formano una rete nel suolo."
  ]
},
{
  "key": "4/science/oekologie-4/oek4_50",
  "reason": "Replace repeated plant-needs phrase with resource-conscious watering.",
  "de": [
    "Wie giesst du ein trockenes Gartenbeet möglichst gezielt?",
    "Das Wasser langsam auf die Erde bei den Wurzeln geben",
    "Das Wasser auf den gepflasterten Weg giessen",
    "Nur die trockene Giesskanne neben das Beet stellen",
    "Das Wasser möglichst hoch in die Luft sprühen",
    "Das Wasser soll die Pflanze erreichen.",
    "Wo nimmt sie es hauptsächlich auf?"
  ],
  "en": [
    "How can you water a dry garden bed in a targeted way?",
    "Pour slowly onto the soil near the roots",
    "Pour onto the paved path",
    "Place an empty watering can beside the bed",
    "Spray the water as high into the air as possible",
    "The water should reach the plant.",
    "Where does it mainly take water up?"
  ],
  "fr": [
    "Comment arroser un parterre sec de façon ciblée ?",
    "Verser lentement sur la terre près des racines",
    "Verser sur le chemin pavé",
    "Poser un arrosoir vide à côté",
    "Pulvériser l’eau le plus haut possible",
    "L’eau doit atteindre la plante.",
    "Par où l’absorbe-t-elle principalement ?"
  ],
  "it": [
    "Come annaffi un’aiuola secca in modo mirato?",
    "Versando lentamente sulla terra vicino alle radici",
    "Versando sul vialetto pavimentato",
    "Mettendo un annaffiatoio vuoto accanto",
    "Spruzzando l’acqua il più in alto possibile",
    "L’acqua deve raggiungere la pianta.",
    "Da dove la assorbe principalmente?"
  ]
},
{
  "key": "4/science/kantone-schweiz-4/kan4_20",
  "reason": "Recognise cantonal languages without parenthetical sentence.",
  "de": [
    "Welche zwei Amtssprachen hat der Kanton Freiburg?",
    "Deutsch und Französisch",
    "Deutsch und Italienisch",
    "Französisch und Rätoromanisch",
    "Italienisch und Englisch",
    "Der Kanton liegt an einer Sprachgrenze.",
    "Denke an die Westschweiz und die Deutschschweiz."
  ],
  "en": [
    "Which two official languages does the canton of Fribourg have?",
    "German and French",
    "German and Italian",
    "French and Romansh",
    "Italian and English",
    "The canton lies on a language boundary.",
    "Think of western and German-speaking Switzerland."
  ],
  "fr": [
    "Quelles sont les deux langues officielles du canton de Fribourg ?",
    "L’allemand et le français",
    "L’allemand et l’italien",
    "Le français et le romanche",
    "L’italien et l’anglais",
    "Le canton se trouve sur une frontière linguistique.",
    "Pense à la Suisse romande et à la Suisse alémanique."
  ],
  "it": [
    "Quali sono le due lingue ufficiali del Canton Friburgo?",
    "Tedesco e francese",
    "Tedesco e italiano",
    "Francese e romancio",
    "Italiano e inglese",
    "Il cantone si trova su un confine linguistico.",
    "Pensa alla Svizzera romanda e a quella tedesca."
  ]
},
{
  "key": "4/science/kantone-schweiz-4/kan4_24",
  "reason": "Replace ordered blanks with exact canton pair recognition.",
  "de": [
    "Welche beiden Kantone tragen den Namen Appenzell?",
    "Appenzell Innerrhoden und Appenzell Ausserrhoden",
    "Appenzell Stadt und Appenzell Land",
    "Appenzell Nord und Appenzell Süd",
    "Appenzell Oberland und Appenzell Unterland",
    "Beide Namen haben eine historische Herkunft.",
    "Achte auf die offiziellen Namen auf einer Kantonskarte."
  ],
  "en": [
    "Which two cantons share the name Appenzell?",
    "Appenzell Innerrhoden and Appenzell Ausserrhoden",
    "Appenzell City and Appenzell Country",
    "Appenzell North and Appenzell South",
    "Appenzell Highlands and Appenzell Lowlands",
    "Both names have a historical origin.",
    "Look for official names on a cantonal map."
  ],
  "fr": [
    "Quels deux cantons portent le nom d’Appenzell ?",
    "Appenzell Rhodes-Intérieures et Appenzell Rhodes-Extérieures",
    "Appenzell-Ville et Appenzell-Campagne",
    "Appenzell-Nord et Appenzell-Sud",
    "Appenzell-Haut et Appenzell-Bas",
    "Les deux noms ont une origine historique.",
    "Cherche les noms officiels sur une carte des cantons."
  ],
  "it": [
    "Quali due cantoni portano il nome Appenzello?",
    "Appenzello Interno e Appenzello Esterno",
    "Appenzello Città e Appenzello Campagna",
    "Appenzello Nord e Appenzello Sud",
    "Appenzello Alto e Appenzello Basso",
    "I nomi hanno un’origine storica.",
    "Cerca i nomi ufficiali su una carta dei cantoni."
  ]
},
{
  "key": "4/science/kantone-schweiz-4/kan4_30",
  "reason": "Replace six-fragment archaic half-canton task with one clear canton pair.",
  "de": [
    "Welche beiden heutigen Kantone werden historisch als Unterwalden zusammengefasst?",
    "Obwalden und Nidwalden",
    "Uri und Schwyz",
    "Basel-Stadt und Basel-Landschaft",
    "Zug und Luzern",
    "Beide Namen enthalten denselben zweiten Wortteil.",
    "Denke an Kantone in der Zentralschweiz."
  ],
  "en": [
    "Which two present-day cantons are historically grouped as Unterwalden?",
    "Obwalden and Nidwalden",
    "Uri and Schwyz",
    "Basel-Stadt and Basel-Landschaft",
    "Zug and Lucerne",
    "Both names share an ending.",
    "Think of central Switzerland."
  ],
  "fr": [
    "Quels cantons actuels sont historiquement regroupés sous le nom d’Unterwald ?",
    "Obwald et Nidwald",
    "Uri et Schwytz",
    "Bâle-Ville et Bâle-Campagne",
    "Zoug et Lucerne",
    "Les deux noms ont une partie commune.",
    "Pense à la Suisse centrale."
  ],
  "it": [
    "Quali cantoni attuali sono storicamente raggruppati come Untervaldo?",
    "Obvaldo e Nidvaldo",
    "Uri e Svitto",
    "Basilea Città e Basilea Campagna",
    "Zugo e Lucerna",
    "I due nomi hanno una parte comune.",
    "Pensa alla Svizzera centrale."
  ]
},
{
  "key": "4/science/kantone-schweiz-4/kan4_36",
  "reason": "Recognise founding regions without acronym-heavy entry.",
  "de": [
    "Welche drei Orte verbindet man mit dem Bundesbrief von 1291?",
    "Uri, Schwyz und Unterwalden",
    "Zürich, Bern und Genf",
    "Basel, Schaffhausen und Thurgau",
    "Tessin, Waadt und Jura",
    "Denke an die Urschweiz.",
    "Die gesuchten Orte liegen in der Zentralschweiz."
  ],
  "en": [
    "Which three regions are associated with the Federal Charter of 1291?",
    "Uri, Schwyz and Unterwalden",
    "Zurich, Bern and Geneva",
    "Basel, Schaffhausen and Thurgau",
    "Ticino, Vaud and Jura",
    "Think of the original Swiss regions.",
    "They lie in central Switzerland."
  ],
  "fr": [
    "Quels trois territoires associe-t-on au Pacte fédéral de 1291 ?",
    "Uri, Schwytz et Unterwald",
    "Zurich, Berne et Genève",
    "Bâle, Schaffhouse et Thurgovie",
    "Tessin, Vaud et Jura",
    "Pense aux premiers territoires confédérés.",
    "Ils se trouvent en Suisse centrale."
  ],
  "it": [
    "Quali tre territori sono associati al Patto federale del 1291?",
    "Uri, Svitto e Untervaldo",
    "Zurigo, Berna e Ginevra",
    "Basilea, Sciaffusa e Turgovia",
    "Ticino, Vaud e Giura",
    "Pensa ai primi territori confederati.",
    "Si trovano nella Svizzera centrale."
  ]
},
{
  "key": "4/science/kantone-schweiz-4/kan4_42",
  "reason": "Replace peripheral etymology with civic canton concept.",
  "de": [
    "Was ist ein Kanton in der Schweiz?",
    "Ein Gliedstaat mit eigener Regierung",
    "Ein anderer Name für jeden Bahnhof",
    "Ein Land ausserhalb der Schweiz",
    "Ein einzelnes Schulzimmer",
    "Die Schweiz besteht aus mehreren politischen Teilen.",
    "Ein Kanton umfasst meist viele Gemeinden."
  ],
  "en": [
    "What is a canton in Switzerland?",
    "A member state with its own government",
    "Another name for every railway station",
    "A country outside Switzerland",
    "A single classroom",
    "Switzerland has several political parts.",
    "A canton usually contains many municipalities."
  ],
  "fr": [
    "Qu’est-ce qu’un canton en Suisse ?",
    "Un État membre avec son propre gouvernement",
    "Un autre nom pour chaque gare",
    "Un pays en dehors de la Suisse",
    "Une seule salle de classe",
    "La Suisse comprend plusieurs entités politiques.",
    "Un canton regroupe généralement plusieurs communes."
  ],
  "it": [
    "Che cos’è un cantone in Svizzera?",
    "Uno Stato membro con un proprio governo",
    "Un altro nome per ogni stazione",
    "Un paese fuori dalla Svizzera",
    "Una singola aula scolastica",
    "La Svizzera comprende diverse entità politiche.",
    "Un cantone comprende generalmente molti comuni."
  ]
},
{
  "key": "4/science/kantone-schweiz-4/kan4_46",
  "reason": "Recognise geographical pass without spelling variant burden.",
  "de": [
    "Welcher Pass verbindet Uri mit dem Tessin?",
    "Der Gotthardpass",
    "Der Julierpass",
    "Der Simplonpass",
    "Der Berninapass",
    "Gesucht ist eine wichtige Verbindung durch die Zentralschweiz nach Süden.",
    "Andermatt und Airolo liegen auf den beiden Seiten."
  ],
  "en": [
    "Which pass connects Uri with Ticino?",
    "The Gotthard Pass",
    "The Julier Pass",
    "The Simplon Pass",
    "The Bernina Pass",
    "Look for a major route south through central Switzerland.",
    "Andermatt and Airolo lie on opposite sides."
  ],
  "fr": [
    "Quel col relie Uri au Tessin ?",
    "Le col du Saint-Gothard",
    "Le col du Julier",
    "Le col du Simplon",
    "Le col de la Bernina",
    "Cherche un passage vers le sud par la Suisse centrale.",
    "Andermatt et Airolo sont de part et d’autre."
  ],
  "it": [
    "Quale passo collega Uri al Ticino?",
    "Il passo del San Gottardo",
    "Il passo del Giulia",
    "Il passo del Sempione",
    "Il passo del Bernina",
    "Cerca un importante collegamento verso sud dalla Svizzera centrale.",
    "Andermatt e Airolo si trovano sui due versanti."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_2",
  "reason": "Clarify marked compass end and approximate north.",
  "de": [
    "Wohin zeigt das markierte Nordende einer ungestörten Kompassnadel ungefähr?",
    "Nach Norden",
    "Nach Süden",
    "Immer bergauf",
    "Immer zum nächsten See",
    "Halte den Kompass fern von Magneten.",
    "Die Nadel hilft beim Bestimmen der Himmelsrichtungen."
  ],
  "en": [
    "Where does the marked north end of an undisturbed compass needle roughly point?",
    "North",
    "South",
    "Always uphill",
    "Always towards the nearest lake",
    "Keep the compass away from magnets.",
    "The needle helps identify directions."
  ],
  "fr": [
    "Où pointe approximativement l’extrémité nord d’une boussole non perturbée ?",
    "Vers le nord",
    "Vers le sud",
    "Toujours vers le haut d’une pente",
    "Toujours vers le lac le plus proche",
    "Éloigne la boussole des aimants.",
    "L’aiguille aide à trouver les points cardinaux."
  ],
  "it": [
    "Dove punta circa l’estremità nord di una bussola non disturbata?",
    "Verso nord",
    "Verso sud",
    "Sempre in salita",
    "Sempre verso il lago più vicino",
    "Tieni la bussola lontana dai magneti.",
    "L’ago aiuta a trovare i punti cardinali."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_4",
  "reason": "Recognise conventional map water colour.",
  "de": [
    "Was stellen blaue Flächen auf einer gewöhnlichen Landkarte meist dar?",
    "Seen und andere Gewässer",
    "Wälder",
    "Stadtgebiete",
    "Berggipfel",
    "Farben haben auf Karten eine Bedeutung.",
    "Prüfe zur Sicherheit die Legende."
  ],
  "en": [
    "What do blue areas on an ordinary map usually show?",
    "Lakes and other bodies of water",
    "Forests",
    "Urban areas",
    "Mountain peaks",
    "Map colours have meanings.",
    "Check the legend to be sure."
  ],
  "fr": [
    "Que représentent généralement les surfaces bleues sur une carte ?",
    "Les lacs et autres étendues d’eau",
    "Les forêts",
    "Les zones urbaines",
    "Les sommets",
    "Les couleurs ont un sens sur les cartes.",
    "Vérifie la légende pour confirmer."
  ],
  "it": [
    "Che cosa indicano di solito le aree blu su una carta?",
    "Laghi e altre acque",
    "Boschi",
    "Zone urbane",
    "Cime montuose",
    "I colori sulle carte hanno un significato.",
    "Controlla la legenda per conferma."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_12",
  "reason": "Recognise topographic information by task.",
  "de": [
    "Was kannst du mithilfe einer topografischen Karte besonders gut erkennen?",
    "Die Form und Höhe des Geländes",
    "Den morgigen Stundenplan",
    "Das Alter aller Einwohner",
    "Den Preis jedes Hauses",
    "Achte auf Höhenlinien und Höhenzahlen.",
    "Eine Wanderung kann über flaches oder steiles Gelände führen."
  ],
  "en": [
    "What can a topographic map show especially well?",
    "The shape and height of the terrain",
    "Tomorrow’s school timetable",
    "Every resident’s age",
    "The price of every house",
    "Look for contour lines and height figures.",
    "A walk may cross flat or steep terrain."
  ],
  "fr": [
    "Que montre particulièrement bien une carte topographique ?",
    "La forme et l’altitude du terrain",
    "L’horaire scolaire de demain",
    "L’âge de tous les habitants",
    "Le prix de chaque maison",
    "Observe les courbes de niveau et les altitudes.",
    "Une randonnée peut traverser un terrain plat ou raide."
  ],
  "it": [
    "Che cosa mostra particolarmente bene una carta topografica?",
    "La forma e l’altitudine del terreno",
    "L’orario scolastico di domani",
    "L’età di tutti gli abitanti",
    "Il prezzo di ogni casa",
    "Osserva curve di livello e quote.",
    "Una passeggiata può attraversare terreno piano o ripido."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_18",
  "reason": "Replace malformed ordered longitude/latitude blanks with globe recognition.",
  "de": [
    "Welche gedachte Linie teilt die Erde in Nordhalbkugel und Südhalbkugel?",
    "Der Äquator",
    "Der Nordpol",
    "Die Schweizer Grenze",
    "Der Alpenkamm",
    "Suche die Mitte zwischen den Polen.",
    "Diese Linie verläuft rund um die Erde."
  ],
  "en": [
    "Which imaginary line divides Earth into northern and southern hemispheres?",
    "The Equator",
    "The North Pole",
    "The Swiss border",
    "The Alpine ridge",
    "Look halfway between the poles.",
    "This line goes around Earth."
  ],
  "fr": [
    "Quelle ligne imaginaire sépare les hémisphères nord et sud ?",
    "L’équateur",
    "Le pôle Nord",
    "La frontière suisse",
    "La crête des Alpes",
    "Cherche à mi-chemin entre les pôles.",
    "Cette ligne fait le tour de la Terre."
  ],
  "it": [
    "Quale linea immaginaria divide gli emisferi nord e sud?",
    "L’equatore",
    "Il Polo Nord",
    "Il confine svizzero",
    "La cresta delle Alpi",
    "Cerca a metà fra i poli.",
    "Questa linea circonda la Terra."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_22",
  "reason": "Recognise national mapping agency product without exact title entry.",
  "de": [
    "Welche Karte stellt swisstopo für die Schweiz her?",
    "Die Landeskarte",
    "Den Menüplan jeder Schule",
    "Den Sitzplan jedes Kinos",
    "Den Spielplan aller Sportvereine",
    "Es geht um die Vermessung des Landes.",
    "Die Karte hilft zum Beispiel bei Wanderungen."
  ],
  "en": [
    "Which map does swisstopo produce for Switzerland?",
    "The national map",
    "Every school’s meal plan",
    "Every cinema’s seating plan",
    "Every sports club’s fixture list",
    "Think about surveying the country.",
    "This map helps with activities such as hiking."
  ],
  "fr": [
    "Quelle carte swisstopo produit-il pour la Suisse ?",
    "La carte nationale",
    "Le menu de chaque école",
    "Le plan des places de chaque cinéma",
    "Le calendrier de tous les clubs sportifs",
    "Il s’agit de mesurer le territoire.",
    "Cette carte aide notamment en randonnée."
  ],
  "it": [
    "Quale carta produce swisstopo per la Svizzera?",
    "La carta nazionale",
    "Il menu di ogni scuola",
    "La pianta dei posti di ogni cinema",
    "Il calendario di tutte le società sportive",
    "Si tratta di misurare il territorio.",
    "Questa carta aiuta per esempio nelle escursioni."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_26",
  "reason": "Clarify elevation reference without inaccurate Swiss Normalnull gloss.",
  "de": [
    "Was bedeutet bei einem Ort die Angabe «800 m ü. M.»?",
    "Er liegt 800 Meter über dem Meeresspiegel",
    "Er liegt 800 Meter vom nächsten Meer entfernt",
    "Er ist 800 Meter breit",
    "Er liegt 800 Meter unter dem Meeresspiegel",
    "Es handelt sich um eine Höhenangabe.",
    "Vergleiche Höhe mit waagrechter Entfernung."
  ],
  "en": [
    "What does ‘800 metres above sea level’ mean for a place?",
    "Its elevation is 800 metres above the sea reference level",
    "It is 800 metres from the nearest sea",
    "It is 800 metres wide",
    "It is 800 metres below sea level",
    "This is a height measurement.",
    "Compare height with horizontal distance."
  ],
  "fr": [
    "Que signifie « 800 m d’altitude » pour un lieu ?",
    "Il est à 800 mètres au-dessus du niveau de la mer",
    "Il est à 800 mètres de la mer la plus proche",
    "Il mesure 800 mètres de large",
    "Il est à 800 mètres sous le niveau de la mer",
    "Il s’agit d’une hauteur.",
    "Distingue hauteur et distance horizontale."
  ],
  "it": [
    "Che cosa significa «800 m s.l.m.» per un luogo?",
    "Si trova 800 metri sopra il livello del mare",
    "Si trova a 800 metri dal mare più vicino",
    "È largo 800 metri",
    "Si trova 800 metri sotto il livello del mare",
    "Si tratta di un’altitudine.",
    "Distingui altezza e distanza orizzontale."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_36",
  "reason": "Apply map legend rather than reproduce explanation.",
  "de": [
    "Du kennst ein Zeichen auf einer Karte nicht. Wo schaust du nach?",
    "In der Kartenlegende",
    "In der Wettervorhersage",
    "In der Preisliste eines Ladens",
    "Im Kalender der nächsten Woche",
    "Karten erklären ihre eigenen Zeichen.",
    "Suche den Bereich mit Symbolen und Erklärungen."
  ],
  "en": [
    "You do not know a map symbol. Where do you look?",
    "In the map legend",
    "In the weather forecast",
    "In a shop’s price list",
    "In next week’s calendar",
    "Maps explain their own symbols.",
    "Look for the section with symbols and explanations."
  ],
  "fr": [
    "Tu ne connais pas un symbole sur une carte. Où cherches-tu ?",
    "Dans la légende",
    "Dans les prévisions météo",
    "Dans les prix d’un magasin",
    "Dans le calendrier de la semaine prochaine",
    "Les cartes expliquent leurs symboles.",
    "Cherche la partie avec les signes et leurs explications."
  ],
  "it": [
    "Non conosci un simbolo sulla carta. Dove cerchi?",
    "Nella legenda",
    "Nelle previsioni meteo",
    "Nel listino di un negozio",
    "Nel calendario della prossima settimana",
    "Le carte spiegano i propri simboli.",
    "Cerca la parte con simboli e spiegazioni."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_38",
  "reason": "Replace compass declination with practical magnetic interference.",
  "de": [
    "Warum hältst du einen Magneten nicht direkt neben einen Kompass?",
    "Er kann die Nadel ablenken",
    "Er sorgt automatisch für eine genauere Nordanzeige",
    "Er verhindert nur das Ablesen der Höhenlinien",
    "Er ändert den Massstab auf der Papierkarte",
    "Die Nadel reagiert auf Magnetfelder.",
    "Ein Gegenstand in der Nähe kann die Anzeige beeinflussen."
  ],
  "en": [
    "Why should you not hold a magnet right beside a compass?",
    "It can deflect the needle",
    "It automatically gives a more accurate north reading",
    "It only prevents reading contour lines",
    "It changes the paper map’s scale",
    "The needle responds to magnetic fields.",
    "A nearby object can affect the reading."
  ],
  "fr": [
    "Pourquoi ne faut-il pas mettre un aimant juste à côté d’une boussole ?",
    "Il peut dévier l’aiguille",
    "Il rend automatiquement le nord plus précis",
    "Il empêche seulement de lire les courbes de niveau",
    "Il change l’échelle de la carte papier",
    "L’aiguille réagit aux champs magnétiques.",
    "Un objet proche peut modifier l’indication."
  ],
  "it": [
    "Perché non tieni un magnete accanto a una bussola?",
    "Può deviare l’ago",
    "Rende automaticamente più precisa l’indicazione del nord",
    "Impedisce soltanto di leggere le curve di livello",
    "Cambia la scala della carta geografica",
    "L’ago reagisce ai campi magnetici.",
    "Un oggetto vicino può influire sull’indicazione."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_42",
  "reason": "Replace LV95 technical definition with accessible grid reference.",
  "de": [
    "Auf einer Karte liegt der Spielplatz im Feld B3. Wozu dient diese Angabe?",
    "Den Spielplatz im Kartenraster finden",
    "Die Temperatur am Spielplatz angeben",
    "Die Anzahl aller Kinder nennen",
    "Die Öffnungszeit auf drei Uhr festlegen",
    "Buchstaben und Zahlen bezeichnen Felder.",
    "Suche die passende Spalte und Zeile."
  ],
  "en": [
    "A playground is in square B3 on a map. What is this reference for?",
    "Finding the playground in the map grid",
    "Giving the playground’s temperature",
    "Stating the number of children",
    "Setting opening time to three o’clock",
    "Letters and numbers identify squares.",
    "Find the matching column and row."
  ],
  "fr": [
    "Une place de jeux est dans la case B3. À quoi sert cette indication ?",
    "À la trouver dans le quadrillage",
    "À donner sa température",
    "À compter tous les enfants",
    "À fixer l’ouverture à trois heures",
    "Les lettres et les chiffres désignent des cases.",
    "Cherche la colonne et la ligne correspondantes."
  ],
  "it": [
    "Un parco giochi è nella casella B3 della carta. A che serve l’indicazione?",
    "A trovarlo nella griglia",
    "A indicarne la temperatura",
    "A contare tutti i bambini",
    "A fissare l’apertura alle tre",
    "Lettere e numeri identificano caselle.",
    "Cerca la colonna e la riga corrispondenti."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_44",
  "reason": "Apply map scale measurement instead of typing tool variants.",
  "de": [
    "Du misst eine Strecke auf einer Papierkarte mit dem Lineal. Was brauchst du zusätzlich für die echte Entfernung?",
    "Den Massstab",
    "Nur den Nordpfeil",
    "Nur die Höhenzahl am Ziel",
    "Nur das Erscheinungsjahr der Karte",
    "Eine Karte stellt die Welt verkleinert dar.",
    "Du musst wissen, wie stark sie verkleinert ist."
  ],
  "en": [
    "You measure a distance on a paper map with a ruler. What else do you need for the real distance?",
    "The scale",
    "Only the north arrow",
    "Only the destination’s elevation",
    "Only the map’s publication year",
    "A map shows the world at a smaller size.",
    "You need to know how much smaller."
  ],
  "fr": [
    "Tu mesures une distance sur une carte avec une règle. Que faut-il pour connaître la distance réelle ?",
    "L’échelle",
    "Seulement la flèche du nord",
    "Seulement l’altitude du but",
    "Seulement l’année de publication",
    "Une carte représente le monde en plus petit.",
    "Il faut connaître la réduction utilisée."
  ],
  "it": [
    "Misuri una distanza sulla carta con un righello. Che cosa serve per la distanza reale?",
    "La scala",
    "Solo la freccia del nord",
    "Solo l’altitudine della meta",
    "Solo l’anno di pubblicazione",
    "Una carta rappresenta il mondo più piccolo.",
    "Devi sapere quanto è ridotto."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_46",
  "reason": "Replace LIDAR with interpreting contour spacing.",
  "de": [
    "Auf derselben Karte liegen Höhenlinien sehr eng beieinander. Was zeigt das meist?",
    "Einen steilen Hang",
    "Eine besonders flache Ebene",
    "Einen tieferen See allein wegen der Linien",
    "Eine politische Grenze",
    "Jede Linie steht für eine bestimmte Höhe.",
    "Viele Höhenmeter auf kurzer Strecke bedeuten eine starke Steigung."
  ],
  "en": [
    "Contour lines are very close together on the same map. What does this usually show?",
    "A steep slope",
    "A very flat plain",
    "A deeper lake just because of the lines",
    "A political border",
    "Each line represents a certain height.",
    "A large height change over a short distance means a steep slope."
  ],
  "fr": [
    "Sur une même carte, les courbes de niveau sont très rapprochées. Que montrent-elles généralement ?",
    "Une pente raide",
    "Une plaine très plate",
    "Un lac plus profond à cause des lignes seulement",
    "Une frontière politique",
    "Chaque courbe correspond à une altitude.",
    "Beaucoup de dénivelé sur peu de distance signifie une forte pente."
  ],
  "it": [
    "Sulla stessa carta le curve di livello sono molto vicine. Che cosa indicano di solito?",
    "Un pendio ripido",
    "Una pianura molto piatta",
    "Un lago più profondo solo per le linee",
    "Un confine politico",
    "Ogni curva rappresenta un’altitudine.",
    "Molto dislivello in poca distanza significa forte pendenza."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_48",
  "reason": "Recognise border function rather than exact abstract phrase.",
  "de": [
    "Was kennzeichnet eine Kantonsgrenze auf der Karte?",
    "Wo das Gebiet eines Kantons endet und ein anderes beginnt",
    "Wo immer eine hohe Mauer steht",
    "Wo die Lufttemperatur genau null Grad ist",
    "Wo jeder Fluss entspringt",
    "Es geht um eine politische Einteilung.",
    "Eine Linie auf der Karte muss keine sichtbare Mauer sein."
  ],
  "en": [
    "What does a cantonal boundary on a map mark?",
    "Where one canton’s territory ends and another begins",
    "Where a high wall always stands",
    "Where the air is exactly zero degrees",
    "Where every river begins",
    "It is a political division.",
    "A line on a map need not be a visible wall."
  ],
  "fr": [
    "Que marque une frontière cantonale sur une carte ?",
    "La limite entre les territoires de deux cantons",
    "Un endroit où il y a toujours un grand mur",
    "Un endroit où il fait exactement zéro degré",
    "La source de chaque rivière",
    "C’est une division politique.",
    "Une ligne sur la carte n’est pas forcément un mur visible."
  ],
  "it": [
    "Che cosa indica un confine cantonale sulla carta?",
    "Dove finisce un cantone e ne inizia un altro",
    "Dove c’è sempre un muro alto",
    "Dove l’aria è esattamente a zero gradi",
    "Dove nasce ogni fiume",
    "È una divisione politica.",
    "Una linea sulla carta non deve essere un muro visibile."
  ]
},
{
  "key": "4/science/orientierung-karte-4/ok4_50",
  "reason": "Replace oversimplified connected-landmass definition with continent recognition.",
  "de": [
    "Welcher Name bezeichnet einen Kontinent?",
    "Afrika",
    "Schweiz",
    "Zürich",
    "Bodensee",
    "Vergleiche die Grössenordnungen.",
    "Gesucht ist weder ein Land noch eine Stadt oder ein See."
  ],
  "en": [
    "Which name identifies a continent?",
    "Africa",
    "Switzerland",
    "Zurich",
    "Lake Constance",
    "Compare the scales.",
    "It is not a country, city or lake."
  ],
  "fr": [
    "Quel nom désigne un continent ?",
    "L’Afrique",
    "La Suisse",
    "Zurich",
    "Le lac de Constance",
    "Compare les tailles.",
    "Ce n’est ni un pays, ni une ville, ni un lac."
  ],
  "it": [
    "Quale nome indica un continente?",
    "Africa",
    "Svizzera",
    "Zurigo",
    "Lago di Costanza",
    "Confronta le dimensioni.",
    "Non è un paese, una città o un lago."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_6",
  "reason": "Recognise historical battle name without exact multiword entry.",
  "de": [
    "Welche Schlacht fand 1315 zwischen Eidgenossen und Habsburgern statt?",
    "Die Schlacht am Morgarten",
    "Die Schlacht bei Marignano",
    "Die Schlacht bei Solferino",
    "Die Schlacht bei Waterloo",
    "Gesucht ist ein Ereignis der frühen Eidgenossenschaft.",
    "Der Ort liegt in der Nähe des Ägerisees."
  ],
  "en": [
    "Which battle took place in 1315 between Swiss Confederates and Habsburg forces?",
    "The Battle of Morgarten",
    "The Battle of Marignano",
    "The Battle of Solferino",
    "The Battle of Waterloo",
    "Think of the early Confederacy.",
    "The place is near Lake Ägeri."
  ],
  "fr": [
    "Quelle bataille opposa les Confédérés aux Habsbourg en 1315 ?",
    "La bataille de Morgarten",
    "La bataille de Marignan",
    "La bataille de Solférino",
    "La bataille de Waterloo",
    "Pense aux débuts de la Confédération.",
    "Le lieu est proche du lac d’Ägeri."
  ],
  "it": [
    "Quale battaglia oppose i Confederati agli Asburgo nel 1315?",
    "La battaglia del Morgarten",
    "La battaglia di Marignano",
    "La battaglia di Solferino",
    "La battaglia di Waterloo",
    "Pensa agli inizi della Confederazione.",
    "Il luogo è vicino al lago di Ägeri."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_10",
  "reason": "Clarify neutrality concerns wars between other states, not all conflicts or self-defence.",
  "de": [
    "Was gehört zur militärischen Neutralität der Schweiz?",
    "Nicht als Kriegspartei an Kriegen zwischen anderen Staaten teilnehmen",
    "Keine Beziehungen zu anderen Ländern haben",
    "Bei einem Angriff auf jede Verteidigung verzichten",
    "Keine Menschen aus anderen Ländern aufnehmen",
    "Neutralität betrifft die Rolle in einem Krieg.",
    "Zusammenarbeit und Selbstverteidigung sind davon zu unterscheiden."
  ],
  "en": [
    "What is part of Switzerland’s military neutrality?",
    "Not joining wars between other states as a belligerent",
    "Having no relations with other countries",
    "Giving up all defence if attacked",
    "Admitting no people from other countries",
    "Neutrality concerns a country’s role in a war.",
    "Distinguish this from cooperation and self-defence."
  ],
  "fr": [
    "Que comprend la neutralité militaire suisse ?",
    "Ne pas participer comme belligérant aux guerres entre d’autres États",
    "N’avoir aucune relation avec d’autres pays",
    "Renoncer à se défendre en cas d’attaque",
    "N’accueillir personne d’autres pays",
    "La neutralité concerne le rôle dans une guerre.",
    "Distingue cela de la coopération et de la défense de soi."
  ],
  "it": [
    "Che cosa comprende la neutralità militare svizzera?",
    "Non partecipare come parte belligerante a guerre fra altri Stati",
    "Non avere rapporti con altri paesi",
    "Rinunciare a difendersi in caso di attacco",
    "Non accogliere persone di altri paesi",
    "La neutralità riguarda il ruolo in una guerra.",
    "Distinguila dalla cooperazione e dalla difesa propria."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_16",
  "reason": "Replace legendary-name spelling with source-awareness objective.",
  "de": [
    "Die Erzählung vom Rütlischwur gilt als Gründungslegende. Was bedeutet das?",
    "Nicht jedes Detail ist als historische Tatsache belegt",
    "Jedes erzählte Wort wurde damals aufgenommen",
    "Eine Legende ist ein heutiges Gesetz",
    "Eine Legende enthält nur Wetterdaten",
    "Unterscheide Überlieferung und überprüfbare Quellen.",
    "Eine wichtige Erzählung kann Geschichte deuten, ohne jedes Detail zu beweisen."
  ],
  "en": [
    "The Rütli Oath story is called a founding legend. What does that mean?",
    "Not every detail is proven historical fact",
    "Every spoken word was recorded at the time",
    "A legend is a current law",
    "A legend contains only weather data",
    "Distinguish tradition from verifiable sources.",
    "A meaningful story need not prove every detail."
  ],
  "fr": [
    "Le récit du serment du Grütli est une légende fondatrice. Qu’est-ce que cela signifie ?",
    "Tous les détails ne sont pas des faits historiques prouvés",
    "Chaque parole a été enregistrée à l’époque",
    "Une légende est une loi actuelle",
    "Une légende contient seulement des données météo",
    "Distingue la tradition des sources vérifiables.",
    "Un récit important ne prouve pas forcément chaque détail."
  ],
  "it": [
    "Il racconto del giuramento del Grütli è una leggenda fondativa. Che cosa significa?",
    "Non ogni dettaglio è un fatto storico dimostrato",
    "Ogni parola fu registrata all’epoca",
    "Una leggenda è una legge attuale",
    "Una leggenda contiene solo dati meteo",
    "Distingui tradizione e fonti verificabili.",
    "Un racconto importante non dimostra per forza ogni dettaglio."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_22",
  "reason": "Replace battle-name recall with Dunant’s humanitarian objective.",
  "de": [
    "Welche Idee machte Henry Dunant nach seinen Erlebnissen bei Solferino bekannt?",
    "Verwundeten unabhängig von ihrer Kriegspartei helfen",
    "Nur den reichsten Verwundeten helfen",
    "Hilfe ausschliesslich nach der Sprache verteilen",
    "Kranke ohne Versorgung zurücklassen",
    "Denke an die Arbeit des Roten Kreuzes.",
    "Die Not eines Menschen soll für die Hilfe entscheidend sein."
  ],
  "en": [
    "Which idea did Henry Dunant promote after his experiences at Solferino?",
    "Helping wounded people regardless of their side in the war",
    "Helping only the richest wounded people",
    "Giving help only according to language",
    "Leaving sick people without care",
    "Think of the Red Cross’s work.",
    "A person’s need should determine the help."
  ],
  "fr": [
    "Quelle idée Henry Dunant a-t-il défendue après Solférino ?",
    "Aider les blessés quel que soit leur camp",
    "Aider seulement les blessés les plus riches",
    "Distribuer l’aide uniquement selon la langue",
    "Laisser les malades sans soins",
    "Pense au travail de la Croix-Rouge.",
    "Le besoin de la personne doit guider l’aide."
  ],
  "it": [
    "Quale idea promosse Henry Dunant dopo Solferino?",
    "Aiutare i feriti indipendentemente dallo schieramento",
    "Aiutare soltanto i feriti più ricchi",
    "Distribuire aiuti soltanto in base alla lingua",
    "Lasciare i malati senza cure",
    "Pensa al lavoro della Croce Rossa.",
    "Il bisogno della persona deve guidare l’aiuto."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_24",
  "reason": "Clarify mercenary concept without confusing medieval and later papal guard dates.",
  "de": [
    "Was waren Söldner?",
    "Soldaten, die gegen Bezahlung für einen Auftraggeber kämpften",
    "Bauern, die nur ihr eigenes Feld bestellten",
    "Händler, die ausschliesslich Salz verkauften",
    "Mönche, die Bücher abschrieben",
    "Der Begriff beschreibt eine bezahlte Tätigkeit.",
    "Denke an einen militärischen Dienst für fremde Auftraggeber."
  ],
  "en": [
    "What were mercenaries?",
    "Soldiers paid to fight for an employer",
    "Farmers working only their own fields",
    "Traders selling only salt",
    "Monks copying books",
    "The term describes paid work.",
    "Think of military service for other employers."
  ],
  "fr": [
    "Qu’étaient les mercenaires ?",
    "Des soldats payés pour combattre pour un employeur",
    "Des paysans cultivant seulement leur champ",
    "Des marchands vendant seulement du sel",
    "Des moines copiant des livres",
    "Le terme désigne une activité rémunérée.",
    "Pense au service militaire pour d’autres employeurs."
  ],
  "it": [
    "Chi erano i mercenari?",
    "Soldati pagati per combattere per un committente",
    "Contadini che coltivavano soltanto il proprio campo",
    "Mercanti che vendevano solo sale",
    "Monaci che copiavano libri",
    "Il termine indica un’attività retribuita.",
    "Pensa al servizio militare per altri committenti."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_32",
  "reason": "Recognise steam engine’s historical use.",
  "de": [
    "Wofür wurden Dampfmaschinen in Fabriken eingesetzt?",
    "Um Maschinen anzutreiben",
    "Um Internetnachrichten zu versenden",
    "Um Lebensmittel ohne Energie gefrieren zu lassen",
    "Um Wasserleitungen überflüssig zu machen",
    "Denke an die Industrialisierung.",
    "Viele Arbeiten brauchten eine mechanische Antriebskraft."
  ],
  "en": [
    "What were steam engines used for in factories?",
    "Driving machinery",
    "Sending internet messages",
    "Freezing food without energy",
    "Making water pipes unnecessary",
    "Think of industrialisation.",
    "Many tasks needed mechanical power."
  ],
  "fr": [
    "À quoi servaient les machines à vapeur dans les usines ?",
    "À entraîner des machines",
    "À envoyer des messages sur Internet",
    "À congeler sans énergie",
    "À rendre les canalisations inutiles",
    "Pense à l’industrialisation.",
    "De nombreux travaux demandaient une force mécanique."
  ],
  "it": [
    "A che cosa servivano le macchine a vapore nelle fabbriche?",
    "Ad azionare macchinari",
    "A inviare messaggi su Internet",
    "A congelare senza energia",
    "A rendere inutili le tubature",
    "Pensa all’industrializzazione.",
    "Molti lavori richiedevano forza meccanica."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_36",
  "reason": "Recognise telephone’s historical communication change.",
  "de": [
    "Was wurde mit dem Telefon möglich?",
    "Direkt mit weit entfernten Menschen sprechen",
    "Pakete ohne Transport verschicken",
    "Menschen körperlich an einen anderen Ort versetzen",
    "Gespräche ohne jede technische Verbindung führen",
    "Vergleiche einen Brief mit einem Anruf.",
    "Beim Anruf kann die andere Person sofort antworten."
  ],
  "en": [
    "What did the telephone make possible?",
    "Speaking directly with people far away",
    "Sending parcels without transport",
    "Moving people physically to another place",
    "Holding calls without any technical connection",
    "Compare a letter with a phone call.",
    "In a call, the other person can answer immediately."
  ],
  "fr": [
    "Qu’a rendu possible le téléphone ?",
    "Parler directement avec des personnes éloignées",
    "Envoyer des colis sans transport",
    "Déplacer physiquement des personnes ailleurs",
    "Téléphoner sans aucune connexion technique",
    "Compare une lettre et un appel.",
    "Lors d’un appel, l’autre personne peut répondre tout de suite."
  ],
  "it": [
    "Che cosa ha reso possibile il telefono?",
    "Parlare direttamente con persone lontane",
    "Inviare pacchi senza trasporto",
    "Spostare fisicamente persone altrove",
    "Telefonare senza alcun collegamento tecnico",
    "Confronta una lettera e una telefonata.",
    "Durante una chiamata l’altra persona può rispondere subito."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_38",
  "reason": "Replace oversimplified Marignano consequence claim with historical source recognition.",
  "de": [
    "Welche Quelle kann etwas über das Leben in der Schweiz vor 500 Jahren zeigen?",
    "Ein erhaltener Brief aus jener Zeit",
    "Eine heutige erfundene Geschichte ohne Quellen",
    "Die Wettervorhersage für morgen",
    "Eine Preisliste für heutige Handys",
    "Achte darauf, wann die Quelle entstanden ist.",
    "Ein Gegenstand aus der Zeit kann Hinweise liefern, muss aber geprüft werden."
  ],
  "en": [
    "Which source can tell us about life in Switzerland 500 years ago?",
    "A surviving letter from that time",
    "A modern invented story with no sources",
    "Tomorrow’s weather forecast",
    "A price list for current phones",
    "Notice when the source was made.",
    "An object from the time provides clues but still needs checking."
  ],
  "fr": [
    "Quelle source peut renseigner sur la vie en Suisse il y a 500 ans ?",
    "Une lettre conservée de cette époque",
    "Un récit actuel inventé sans sources",
    "Les prévisions météo de demain",
    "Le prix des téléphones actuels",
    "Observe la date de création de la source.",
    "Un objet d’époque donne des indices, mais doit être examiné."
  ],
  "it": [
    "Quale fonte può informarci sulla vita in Svizzera 500 anni fa?",
    "Una lettera conservata di quell’epoca",
    "Un racconto moderno inventato senza fonti",
    "Le previsioni meteo di domani",
    "Il prezzo dei telefoni attuali",
    "Osserva quando è stata creata la fonte.",
    "Un oggetto dell’epoca offre indizi, ma va comunque esaminato."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_40",
  "reason": "Replace advanced Burgundian state definition with accessible historical trade.",
  "de": [
    "Warum waren Alpenpässe schon früher wichtig für die Schweiz?",
    "Sie ermöglichten Handel und Reisen über die Berge",
    "Sie verhinderten jede Begegnung mit Nachbarn",
    "Sie waren nur für heutige Flugzeuge bestimmt",
    "Sie ersetzten in allen Städten die Märkte",
    "Berge erschweren den Weg von Norden nach Süden.",
    "Ein Pass bietet einen Übergang."
  ],
  "en": [
    "Why were Alpine passes important to Switzerland in the past?",
    "They allowed trade and travel across the mountains",
    "They prevented every meeting with neighbours",
    "They were meant only for modern aircraft",
    "They replaced markets in every town",
    "Mountains make north-south travel difficult.",
    "A pass offers a crossing."
  ],
  "fr": [
    "Pourquoi les cols alpins étaient-ils importants autrefois ?",
    "Ils permettaient le commerce et les voyages à travers les montagnes",
    "Ils empêchaient toute rencontre avec les voisins",
    "Ils étaient destinés seulement aux avions actuels",
    "Ils remplaçaient les marchés de toutes les villes",
    "Les montagnes compliquent les trajets nord-sud.",
    "Un col offre un passage."
  ],
  "it": [
    "Perché i passi alpini erano importanti in passato?",
    "Permettevano commercio e viaggi attraverso le montagne",
    "Impedivano ogni incontro con i vicini",
    "Erano destinati soltanto agli aerei moderni",
    "Sostituivano i mercati di tutte le città",
    "Le montagne rendono difficili i viaggi nord-sud.",
    "Un passo offre un attraversamento."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_44",
  "reason": "Replace niche contemporary party-event trivia with central Swiss historical milestone.",
  "de": [
    "Was änderte sich 1848 grundlegend in der Schweiz?",
    "Sie wurde zum Bundesstaat mit gemeinsamen Bundesbehörden",
    "Sie wurde zu einer absoluten Monarchie",
    "Alle Kantone wurden abgeschafft",
    "Sie trat der heutigen Europäischen Union bei",
    "Die Kantone blieben bestehen.",
    "Gleichzeitig erhielt die gemeinsame staatliche Ebene mehr Aufgaben."
  ],
  "en": [
    "What fundamental change took place in Switzerland in 1848?",
    "It became a federal state with shared federal authorities",
    "It became an absolute monarchy",
    "All cantons were abolished",
    "It joined today’s European Union",
    "The cantons continued to exist.",
    "The common federal level also gained more responsibilities."
  ],
  "fr": [
    "Quel changement fondamental a eu lieu en Suisse en 1848 ?",
    "Elle est devenue un État fédéral avec des autorités fédérales communes",
    "Elle est devenue une monarchie absolue",
    "Tous les cantons ont été supprimés",
    "Elle a rejoint l’Union européenne actuelle",
    "Les cantons ont continué d’exister.",
    "Le niveau fédéral commun a aussi reçu davantage de tâches."
  ],
  "it": [
    "Quale cambiamento fondamentale avvenne in Svizzera nel 1848?",
    "Divenne uno Stato federale con autorità federali comuni",
    "Divenne una monarchia assoluta",
    "Furono aboliti tutti i cantoni",
    "Entrò nell’attuale Unione europea",
    "I cantoni continuarono a esistere.",
    "Anche il livello federale comune ricevette più compiti."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_46",
  "reason": "Replace repeated steam-machine phrase with historical transport recognition.",
  "de": [
    "Welches Fahrzeug nutzte früher häufig eine Dampfmaschine?",
    "Eine Dampflokomotive",
    "Ein gewöhnliches Segelboot",
    "Ein Fahrrad ohne Motor",
    "Ein Pferdeschlitten",
    "Gesucht ist ein Fahrzeug auf Schienen.",
    "Erhitztes Wasser spielte beim Antrieb eine Rolle."
  ],
  "en": [
    "Which vehicle often used a steam engine in the past?",
    "A steam locomotive",
    "An ordinary sailing boat",
    "A bicycle without a motor",
    "A horse-drawn sleigh",
    "Look for a vehicle on rails.",
    "Heated water played a role in its power source."
  ],
  "fr": [
    "Quel véhicule utilisait souvent une machine à vapeur autrefois ?",
    "Une locomotive à vapeur",
    "Un voilier ordinaire",
    "Un vélo sans moteur",
    "Un traîneau tiré par un cheval",
    "Cherche un véhicule sur rails.",
    "L’eau chauffée jouait un rôle dans son fonctionnement."
  ],
  "it": [
    "Quale veicolo usava spesso una macchina a vapore in passato?",
    "Una locomotiva a vapore",
    "Una normale barca a vela",
    "Una bici senza motore",
    "Una slitta trainata da cavalli",
    "Cerca un veicolo su rotaie.",
    "L’acqua riscaldata aveva un ruolo nel funzionamento."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_48",
  "reason": "Replace nuanced neutrality exception essay with clear civil-war classification.",
  "de": [
    "Der Sonderbundskrieg von 1847 wurde zwischen Schweizer Kantonen geführt. Welche Art Konflikt war das?",
    "Ein Bürgerkrieg innerhalb der Schweiz",
    "Ein Krieg zwischen der Schweiz und Japan",
    "Ein Krieg nur zwischen ausländischen Staaten",
    "Eine Sportveranstaltung ohne Kampfhandlungen",
    "Achte darauf, wer auf beiden Seiten beteiligt war.",
    "Die Beteiligten gehörten zum selben Land."
  ],
  "en": [
    "The Sonderbund War of 1847 was fought between Swiss cantons. What kind of conflict was it?",
    "A civil war within Switzerland",
    "A war between Switzerland and Japan",
    "A war only between foreign states",
    "A sporting event without fighting",
    "Notice who took part on both sides.",
    "The participants belonged to the same country."
  ],
  "fr": [
    "La guerre du Sonderbund de 1847 a opposé des cantons suisses. Quel type de conflit était-ce ?",
    "Une guerre civile en Suisse",
    "Une guerre entre la Suisse et le Japon",
    "Une guerre uniquement entre États étrangers",
    "Une compétition sportive sans combats",
    "Observe les participants des deux camps.",
    "Ils appartenaient au même pays."
  ],
  "it": [
    "La guerra del Sonderbund del 1847 oppose cantoni svizzeri. Che tipo di conflitto fu?",
    "Una guerra civile in Svizzera",
    "Una guerra fra Svizzera e Giappone",
    "Una guerra soltanto fra Stati stranieri",
    "Una competizione sportiva senza combattimenti",
    "Osserva i partecipanti dei due schieramenti.",
    "Appartenevano allo stesso paese."
  ]
},
{
  "key": "4/science/schweizer-geschichte-4/sg4_50",
  "reason": "Recognise railway impact with explicit comparison.",
  "de": [
    "Was erleichterte die Eisenbahn gegenüber langsamen Pferdefuhrwerken?",
    "Viele Menschen und Waren schneller über Land transportieren",
    "Ohne Gleise über jeden Berg fliegen",
    "Waren ganz ohne Energie bewegen",
    "Jede Reise ohne Planung und Haltestellen durchführen",
    "Vergleiche Tragfähigkeit und Geschwindigkeit.",
    "Mehrere Wagen können gemeinsam gezogen werden."
  ],
  "en": [
    "What did railways make easier compared with slow horse-drawn wagons?",
    "Transporting many people and goods faster over land",
    "Flying over every mountain without tracks",
    "Moving goods with no energy",
    "Making every trip without planning or stations",
    "Compare capacity and speed.",
    "Several carriages can be pulled together."
  ],
  "fr": [
    "Qu’a facilité le chemin de fer par rapport aux lentes voitures à chevaux ?",
    "Transporter plus vite beaucoup de personnes et de marchandises",
    "Voler sans rails au-dessus de chaque montagne",
    "Déplacer des marchandises sans énergie",
    "Voyager toujours sans préparation ni arrêts",
    "Compare la capacité et la vitesse.",
    "Plusieurs wagons peuvent être tirés ensemble."
  ],
  "it": [
    "Che cosa ha facilitato la ferrovia rispetto ai lenti carri trainati da cavalli?",
    "Trasportare più velocemente molte persone e merci",
    "Volare senza binari sopra ogni montagna",
    "Spostare merci senza energia",
    "Viaggiare sempre senza pianificazione né fermate",
    "Confronta capacità e velocità.",
    "Più vagoni possono essere trainati insieme."
  ]
},
{
  "key": "4/science/europa-4/eu4_8",
  "reason": "Replace ambiguous continent-country count with unambiguous location.",
  "de": [
    "Welches dieser Länder liegt in Europa?",
    "Portugal",
    "Japan",
    "Brasilien",
    "Kenia",
    "Suche westlich der Schweiz.",
    "Das Land liegt neben Spanien."
  ],
  "en": [
    "Which of these countries is in Europe?",
    "Portugal",
    "Japan",
    "Brazil",
    "Kenya",
    "Look west of Switzerland.",
    "The country is beside Spain."
  ],
  "fr": [
    "Lequel de ces pays se trouve en Europe ?",
    "Le Portugal",
    "Le Japon",
    "Le Brésil",
    "Le Kenya",
    "Cherche à l’ouest de la Suisse.",
    "Ce pays est voisin de l’Espagne."
  ],
  "it": [
    "Quale di questi paesi si trova in Europa?",
    "Portogallo",
    "Giappone",
    "Brasile",
    "Kenya",
    "Cerca a ovest della Svizzera.",
    "Il paese è vicino alla Spagna."
  ]
},
{
  "key": "4/science/europa-4/eu4_14",
  "reason": "Replace awkward multilingual negation blank with membership distinction.",
  "de": [
    "Welche Aussage über die Schweiz stimmt?",
    "Sie liegt in Europa, gehört aber nicht zur EU",
    "Sie liegt in Asien und gehört zur EU",
    "Sie ist ein Bundesland Deutschlands",
    "Sie ist Teil von Frankreich",
    "Europa und EU bedeuten nicht dasselbe.",
    "Ein Land kann auf dem Kontinent liegen, ohne Mitglied der Organisation zu sein."
  ],
  "en": [
    "Which statement about Switzerland is correct?",
    "It is in Europe but is not an EU member",
    "It is in Asia and is an EU member",
    "It is a German federal state",
    "It is part of France",
    "Europe and the EU are not the same.",
    "A country can be on the continent without joining the organisation."
  ],
  "fr": [
    "Quelle affirmation sur la Suisse est correcte ?",
    "Elle est en Europe mais n’est pas membre de l’UE",
    "Elle est en Asie et membre de l’UE",
    "Elle est un État fédéré allemand",
    "Elle fait partie de la France",
    "L’Europe et l’UE ne sont pas la même chose.",
    "Un pays peut être sur le continent sans adhérer à l’organisation."
  ],
  "it": [
    "Quale affermazione sulla Svizzera è corretta?",
    "È in Europa ma non fa parte dell’UE",
    "È in Asia e fa parte dell’UE",
    "È uno Stato federato tedesco",
    "Fa parte della Francia",
    "Europa e UE non sono la stessa cosa.",
    "Un paese può essere sul continente senza aderire all’organizzazione."
  ]
},
{
  "key": "4/science/europa-4/eu4_16",
  "reason": "Replace multi-institution seat sequence with one official parliamentary seat.",
  "de": [
    "In welcher französischen Stadt hat das Europäische Parlament seinen offiziellen Sitz?",
    "Strassburg",
    "Paris",
    "Lyon",
    "Marseille",
    "Die Stadt liegt nahe der deutschen Grenze.",
    "Sie liegt im Elsass."
  ],
  "en": [
    "Which French city is the official seat of the European Parliament?",
    "Strasbourg",
    "Paris",
    "Lyon",
    "Marseille",
    "The city is close to Germany.",
    "It is in Alsace."
  ],
  "fr": [
    "Dans quelle ville française se trouve le siège officiel du Parlement européen ?",
    "Strasbourg",
    "Paris",
    "Lyon",
    "Marseille",
    "La ville est proche de l’Allemagne.",
    "Elle se trouve en Alsace."
  ],
  "it": [
    "In quale città francese si trova la sede ufficiale del Parlamento europeo?",
    "Strasburgo",
    "Parigi",
    "Lione",
    "Marsiglia",
    "La città è vicina alla Germania.",
    "Si trova in Alsazia."
  ]
},
{
  "key": "4/science/europa-4/eu4_30",
  "reason": "Replace changing treaty count with basic international agreement purpose.",
  "de": [
    "Warum schliessen die Schweiz und Nachbarländer Verträge?",
    "Um gemeinsame Regeln für die Zusammenarbeit festzulegen",
    "Um alle Landesgrenzen auf Karten zu löschen",
    "Um die Jahreszeiten gleich lang zu machen",
    "Um alle Menschen auf dieselbe Sprache zu verpflichten",
    "Länder haben gemeinsame Aufgaben.",
    "Vereinbarungen können zum Beispiel Verkehr und Handel regeln."
  ],
  "en": [
    "Why do Switzerland and neighbouring countries make agreements?",
    "To set shared rules for cooperation",
    "To erase every border from maps",
    "To make seasons equally long",
    "To force everyone to speak one language",
    "Countries have shared tasks.",
    "Agreements can regulate transport and trade."
  ],
  "fr": [
    "Pourquoi la Suisse et ses voisins concluent-ils des accords ?",
    "Pour fixer des règles communes de coopération",
    "Pour effacer toutes les frontières des cartes",
    "Pour rendre les saisons aussi longues",
    "Pour imposer une seule langue à tous",
    "Les pays ont des tâches communes.",
    "Les accords peuvent régler les transports et le commerce."
  ],
  "it": [
    "Perché la Svizzera e i paesi vicini concludono accordi?",
    "Per fissare regole comuni di collaborazione",
    "Per cancellare tutti i confini dalle carte",
    "Per rendere le stagioni ugualmente lunghe",
    "Per imporre una sola lingua a tutti",
    "I paesi hanno compiti comuni.",
    "Gli accordi possono regolare trasporti e commercio."
  ]
},
{
  "key": "4/science/europa-4/eu4_32",
  "reason": "Recognise neighbouring country currency.",
  "de": [
    "Welche Währung verwendet Liechtenstein?",
    "Schweizer Franken",
    "Britisches Pfund",
    "US-Dollar",
    "Japanischer Yen",
    "Das Land arbeitet eng mit der Schweiz zusammen.",
    "Vergleiche mit der Währung in deinem Schweizer Portemonnaie."
  ],
  "en": [
    "Which currency does Liechtenstein use?",
    "Swiss franc",
    "British pound",
    "US dollar",
    "Japanese yen",
    "The country works closely with Switzerland.",
    "Compare it with the currency in a Swiss wallet."
  ],
  "fr": [
    "Quelle monnaie utilise le Liechtenstein ?",
    "Le franc suisse",
    "La livre sterling",
    "Le dollar américain",
    "Le yen japonais",
    "Ce pays coopère étroitement avec la Suisse.",
    "Compare avec la monnaie dans un porte-monnaie suisse."
  ],
  "it": [
    "Quale valuta usa il Liechtenstein?",
    "Il franco svizzero",
    "La sterlina britannica",
    "Il dollaro statunitense",
    "Lo yen giapponese",
    "Il paese collabora strettamente con la Svizzera.",
    "Confronta con la valuta di un portafoglio svizzero."
  ]
},
{
  "key": "4/science/europa-4/eu4_36",
  "reason": "Replace institutional comparison essay with elected representation.",
  "de": [
    "Wie gelangen die Abgeordneten ins Europäische Parlament?",
    "Durch Wahlen in den EU-Mitgliedsländern",
    "Durch Vererbung innerhalb einer Königsfamilie",
    "Durch einen jährlichen Sportwettkampf",
    "Durch das Ziehen von Namen aller Touristen",
    "Ein Parlament vertritt Menschen.",
    "Denke an demokratische Mitbestimmung."
  ],
  "en": [
    "How do representatives enter the European Parliament?",
    "Through elections in EU member countries",
    "By inheritance in a royal family",
    "Through an annual sports competition",
    "By drawing names of all tourists",
    "A parliament represents people.",
    "Think of democratic participation."
  ],
  "fr": [
    "Comment les députés entrent-ils au Parlement européen ?",
    "Par des élections dans les pays membres de l’UE",
    "Par héritage dans une famille royale",
    "Par une compétition sportive annuelle",
    "Par tirage au sort parmi les touristes",
    "Un parlement représente la population.",
    "Pense à la participation démocratique."
  ],
  "it": [
    "Come entrano i deputati nel Parlamento europeo?",
    "Con elezioni nei paesi membri dell’UE",
    "Per eredità in una famiglia reale",
    "Con una gara sportiva annuale",
    "Estraendo i nomi di tutti i turisti",
    "Un parlamento rappresenta la popolazione.",
    "Pensa alla partecipazione democratica."
  ]
},
{
  "key": "4/science/europa-4/eu4_38",
  "reason": "Replace EFTA/EU comparison with geographical neighbour recognition.",
  "de": [
    "Welches Land grenzt direkt an die Schweiz?",
    "Österreich",
    "Portugal",
    "Schweden",
    "Griechenland",
    "Suche östlich der Schweiz.",
    "Das gesuchte Land hat ebenfalls viele Alpenberge."
  ],
  "en": [
    "Which country directly borders Switzerland?",
    "Austria",
    "Portugal",
    "Sweden",
    "Greece",
    "Look east of Switzerland.",
    "This country also contains many Alpine mountains."
  ],
  "fr": [
    "Quel pays a une frontière directe avec la Suisse ?",
    "L’Autriche",
    "Le Portugal",
    "La Suède",
    "La Grèce",
    "Cherche à l’est de la Suisse.",
    "Ce pays possède aussi de nombreuses montagnes alpines."
  ],
  "it": [
    "Quale paese confina direttamente con la Svizzera?",
    "Austria",
    "Portogallo",
    "Svezia",
    "Grecia",
    "Cerca a est della Svizzera.",
    "Anche questo paese ha molte montagne alpine."
  ]
},
{
  "key": "4/science/europa-4/eu4_40",
  "reason": "Replace specialist EU legislative distinction with purpose of shared rules.",
  "de": [
    "Mehrere Länder vereinbaren gemeinsame Regeln zum Schutz eines Flusses. Warum ist das sinnvoll?",
    "Der Fluss und Verschmutzungen können Landesgrenzen überschreiten",
    "Jedes Land kann nur das Wasser direkt an seiner Quelle beeinflussen",
    "Wasserqualität betrifft ausschliesslich das Land an der Flussmündung",
    "Gemeinsame Regeln ersetzen jede praktische Reinigung",
    "Verfolge einen Fluss auf einer Europakarte.",
    "Was flussaufwärts geschieht, kann flussabwärts Folgen haben."
  ],
  "en": [
    "Several countries agree on rules to protect a river. Why is this useful?",
    "The river and pollution can cross borders",
    "Each country can affect water only directly at its source",
    "Water quality concerns only the country at the river mouth",
    "Shared rules replace all practical treatment",
    "Trace a river on a European map.",
    "What happens upstream can affect places downstream."
  ],
  "fr": [
    "Plusieurs pays protègent ensemble une rivière. Pourquoi est-ce utile ?",
    "La rivière et la pollution peuvent franchir les frontières",
    "Chaque pays peut agir sur l’eau seulement à sa source",
    "La qualité de l’eau concerne seulement le pays à l’embouchure",
    "Des règles communes remplacent tout traitement concret",
    "Suis une rivière sur une carte d’Europe.",
    "Ce qui arrive en amont peut avoir des effets en aval."
  ],
  "it": [
    "Più paesi proteggono insieme un fiume. Perché è utile?",
    "Il fiume e l’inquinamento possono attraversare i confini",
    "Ogni paese può influire sull’acqua solo alla sorgente",
    "La qualità dell’acqua riguarda solo il paese alla foce",
    "Regole comuni sostituiscono ogni trattamento concreto",
    "Segui un fiume sulla carta d’Europa.",
    "Ciò che avviene a monte può avere effetti a valle."
  ]
},
{
  "key": "4/science/europa-4/eu4_42",
  "reason": "Replace policy-package memorisation with clear climate cooperation action.",
  "de": [
    "Welche gemeinsame Massnahme europäischer Länder kann den Klimaschutz unterstützen?",
    "Bahnverbindungen als Alternative zu vielen Autofahrten verbessern",
    "Überall zusätzliche Kohle verbrennen",
    "Alle Gebäude im Winter bei offenen Fenstern heizen",
    "Wälder vollständig durch Parkplätze ersetzen",
    "Vergleiche den Energiebedarf der Handlungen.",
    "Gut ausgelastete öffentliche Verkehrsmittel können viele einzelne Fahrten ersetzen."
  ],
  "en": [
    "Which joint action by European countries can support climate protection?",
    "Improve rail links as an alternative to many car journeys",
    "Burn extra coal everywhere",
    "Heat all buildings with open windows in winter",
    "Replace forests entirely with car parks",
    "Compare the actions’ energy use.",
    "Well-used public transport can replace many separate journeys."
  ],
  "fr": [
    "Quelle action commune peut aider les pays européens à protéger le climat ?",
    "Améliorer le train pour remplacer de nombreux trajets en voiture",
    "Brûler davantage de charbon partout",
    "Chauffer tous les bâtiments fenêtres ouvertes en hiver",
    "Remplacer toutes les forêts par des parkings",
    "Compare la consommation d’énergie.",
    "Des transports publics bien utilisés remplacent de nombreux trajets individuels."
  ],
  "it": [
    "Quale azione comune può aiutare i paesi europei a proteggere il clima?",
    "Migliorare i treni per sostituire molti viaggi in auto",
    "Bruciare più carbone ovunque",
    "Riscaldare tutti gli edifici con finestre aperte in inverno",
    "Sostituire tutti i boschi con parcheggi",
    "Confronta il consumo di energia.",
    "Trasporti pubblici ben utilizzati sostituiscono molti viaggi individuali."
  ]
},
{
  "key": "4/science/europa-4/eu4_44",
  "reason": "Replace bilateral/multilateral terminology with explicit agreement parties.",
  "de": [
    "Die Schweiz und Frankreich vereinbaren gemeinsam eine Regel. Wer muss dieser Vereinbarung zustimmen?",
    "Beide Vertragspartner",
    "Nur die Schweiz, auch wenn Frankreich ablehnt",
    "Nur eine beliebige Schulklasse",
    "Niemand, sobald ein Vorschlag auf Papier steht",
    "Eine Vereinbarung wird gemeinsam getroffen.",
    "Ein Vorschlag allein ist noch keine Zustimmung."
  ],
  "en": [
    "Switzerland and France make a joint agreement. Who must agree to it?",
    "Both parties",
    "Only Switzerland, even if France refuses",
    "Only a random school class",
    "Nobody, once a proposal is on paper",
    "An agreement is made jointly.",
    "A proposal alone is not consent."
  ],
  "fr": [
    "La Suisse et la France concluent un accord. Qui doit l’accepter ?",
    "Les deux parties",
    "Seulement la Suisse, même si la France refuse",
    "Seulement une classe choisie au hasard",
    "Personne dès qu’une proposition est écrite",
    "Un accord se conclut ensemble.",
    "Une proposition n’est pas encore un consentement."
  ],
  "it": [
    "Svizzera e Francia concludono un accordo. Chi deve accettarlo?",
    "Entrambe le parti",
    "Solo la Svizzera, anche se la Francia rifiuta",
    "Solo una classe scelta a caso",
    "Nessuno appena la proposta è scritta",
    "Un accordo si conclude insieme.",
    "Una proposta non è ancora un consenso."
  ]
},
{
  "key": "4/science/europa-4/eu4_46",
  "reason": "Replace Maastricht treaty chronology with understanding EU abbreviation.",
  "de": [
    "Wofür steht die Abkürzung EU?",
    "Europäische Union",
    "Einheitliche Uhrzeit",
    "Europäischer Urwald",
    "Eidgenössische Universität",
    "Es geht um einen Zusammenschluss von Ländern.",
    "Nicht alle europäischen Länder gehören dazu."
  ],
  "en": [
    "What does EU stand for?",
    "European Union",
    "Equal Universe",
    "European Underground",
    "Eastern University",
    "It is an association of countries.",
    "Not every European country belongs to it."
  ],
  "fr": [
    "Que signifie l’abréviation UE ?",
    "Union européenne",
    "Université égyptienne",
    "Unité électrique",
    "Usine écologique",
    "Il s’agit d’un regroupement de pays.",
    "Tous les pays européens n’en font pas partie."
  ],
  "it": [
    "Che cosa significa la sigla UE?",
    "Unione europea",
    "Università egiziana",
    "Unità elettrica",
    "Ufficio ecologico",
    "Si tratta di un’unione di paesi.",
    "Non tutti i paesi europei ne fanno parte."
  ]
},
{
  "key": "4/science/europa-4/eu4_48",
  "reason": "Replace Euratom with common European currency recognition.",
  "de": [
    "Welche Währung verwenden Deutschland, Frankreich und Italien gemeinsam?",
    "Euro",
    "Schweizer Franken",
    "Britisches Pfund",
    "Japanischer Yen",
    "Diese Länder teilen sich eine gemeinsame Währungszone.",
    "Vergleiche Geldscheine auf einer Reise in diese Länder."
  ],
  "en": [
    "Which currency do Germany, France and Italy share?",
    "Euro",
    "Swiss franc",
    "British pound",
    "Japanese yen",
    "These countries share a common currency area.",
    "Compare banknotes when travelling there."
  ],
  "fr": [
    "Quelle monnaie utilisent l’Allemagne, la France et l’Italie ?",
    "L’euro",
    "Le franc suisse",
    "La livre sterling",
    "Le yen japonais",
    "Ces pays partagent une même zone monétaire.",
    "Compare les billets lors d’un voyage dans ces pays."
  ],
  "it": [
    "Quale valuta usano Germania, Francia e Italia?",
    "Euro",
    "Franco svizzero",
    "Sterlina britannica",
    "Yen giapponese",
    "Questi paesi condividono una stessa area monetaria.",
    "Confronta le banconote durante un viaggio in questi paesi."
  ]
},
{
  "key": "4/science/europa-4/eu4_50",
  "reason": "Replace EU/Council of Europe distinction and stale member count with shared human-rights concept.",
  "de": [
    "Was bedeutet der Schutz der Menschenrechte in Europa?",
    "Die grundlegenden Rechte jedes Menschen achten",
    "Rechte nur für die reichsten Menschen vorsehen",
    "Rechte allein von der Haarfarbe abhängig machen",
    "Menschen ohne Prüfung nach ihrer Sprache bestrafen",
    "Menschenrechte gelten für Menschen, nicht nur für eine bevorzugte Gruppe.",
    "Denke an gleiche Würde und Schutz vor Willkür."
  ],
  "en": [
    "What does protecting human rights in Europe mean?",
    "Respecting every person’s basic rights",
    "Giving rights only to the richest people",
    "Making rights depend only on hair colour",
    "Punishing people for their language without examination",
    "Human rights are not just for a favoured group.",
    "Think of equal dignity and protection from arbitrary treatment."
  ],
  "fr": [
    "Que signifie protéger les droits humains en Europe ?",
    "Respecter les droits fondamentaux de chaque personne",
    "Réserver les droits aux plus riches",
    "Faire dépendre les droits de la couleur des cheveux",
    "Punir les gens pour leur langue sans examen",
    "Les droits humains ne sont pas réservés à un groupe favorisé.",
    "Pense à l’égale dignité et à la protection contre l’arbitraire."
  ],
  "it": [
    "Che cosa significa proteggere i diritti umani in Europa?",
    "Rispettare i diritti fondamentali di ogni persona",
    "Riservare i diritti ai più ricchi",
    "Far dipendere i diritti dal colore dei capelli",
    "Punire le persone per la loro lingua senza esame",
    "I diritti umani non sono riservati a un gruppo favorito.",
    "Pensa alla pari dignità e alla protezione dall’arbitrio."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_2",
  "reason": "Apply respectful local decision-making.",
  "de": [
    "Zwei Gruppen streiten über die Nutzung eines Spielplatzes. Was hilft bei einer fairen Lösung?",
    "Beide anhören und gemeinsame Regeln suchen",
    "Nur die lautere Gruppe anhören",
    "Eine Gruppe ohne Gespräch vertreiben",
    "Die Beschwerden aller ignorieren",
    "Alle Betroffenen haben Bedürfnisse.",
    "Eine Lösung braucht Informationen von beiden Seiten."
  ],
  "en": [
    "Two groups disagree about using a playground. What helps find a fair solution?",
    "Hear both groups and seek shared rules",
    "Listen only to the louder group",
    "Drive one group away without discussion",
    "Ignore everyone’s concerns",
    "Everyone involved has needs.",
    "A solution needs information from both sides."
  ],
  "fr": [
    "Deux groupes se disputent l’usage d’une place de jeux. Qu’est-ce qui aide ?",
    "Écouter les deux groupes et chercher des règles communes",
    "Écouter seulement le groupe le plus bruyant",
    "Chasser un groupe sans discussion",
    "Ignorer toutes les préoccupations",
    "Chacun a des besoins.",
    "Une solution demande les informations des deux côtés."
  ],
  "it": [
    "Due gruppi discutono sull’uso di un parco giochi. Che cosa aiuta?",
    "Ascoltare entrambi e cercare regole comuni",
    "Ascoltare solo il gruppo più rumoroso",
    "Cacciare un gruppo senza discutere",
    "Ignorare tutte le preoccupazioni",
    "Tutti hanno dei bisogni.",
    "Una soluzione richiede informazioni da entrambe le parti."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_12",
  "reason": "Make fair voting rule explicit.",
  "de": [
    "Bei einer Klassenabstimmung hat jedes Kind eine Stimme. Welche Auszählung ist fair?",
    "Jede gültige Stimme einmal zählen",
    "Die Stimmen der Freunde doppelt zählen",
    "Unbeliebte Stimmen wegwerfen",
    "Nur die ersten drei Stimmen zählen",
    "Für alle gilt dieselbe Regel.",
    "Persönliche Vorlieben dürfen das Zählen nicht verändern."
  ],
  "en": [
    "Each child has one vote in a class poll. Which count is fair?",
    "Count each valid vote once",
    "Count friends’ votes twice",
    "Throw away unpopular votes",
    "Count only the first three votes",
    "The same rule applies to everyone.",
    "Personal preferences must not change the count."
  ],
  "fr": [
    "Chaque enfant a une voix lors d’un vote. Quel comptage est juste ?",
    "Compter chaque voix valable une fois",
    "Compter deux fois les voix des amis",
    "Jeter les voix déplaisantes",
    "Compter seulement les trois premières",
    "La même règle vaut pour tous.",
    "Les préférences ne doivent pas modifier le comptage."
  ],
  "it": [
    "Ogni bambino ha un voto. Quale conteggio è equo?",
    "Contare una volta ogni voto valido",
    "Contare due volte i voti degli amici",
    "Buttare i voti sgraditi",
    "Contare soltanto i primi tre",
    "La stessa regola vale per tutti.",
    "Le preferenze non devono modificare il conteggio."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_16",
  "reason": "Apply inclusion within community play.",
  "de": [
    "Ein neues Kind kennt auf dem Quartierspielplatz niemanden. Was ist einladend?",
    "Es fragen, ob es mitspielen möchte",
    "Seine Fragen absichtlich überhören",
    "Ihm den Zugang verbieten",
    "Sich über seinen Namen lustig machen",
    "Ein neuer Ort kann verunsichern.",
    "Eine freundliche Einladung lässt dem Kind die Wahl."
  ],
  "en": [
    "A new child knows nobody at the neighbourhood playground. What is welcoming?",
    "Ask whether they would like to join in",
    "Deliberately ignore their questions",
    "Forbid them to enter",
    "Make fun of their name",
    "A new place can feel uncertain.",
    "A friendly invitation gives the child a choice."
  ],
  "fr": [
    "Un nouvel enfant ne connaît personne au parc. Qu’est-ce qui l’accueille bien ?",
    "Lui demander s’il veut jouer",
    "Ignorer volontairement ses questions",
    "Lui interdire l’entrée",
    "Se moquer de son nom",
    "Un lieu nouveau peut inquiéter.",
    "Une invitation amicale laisse le choix à l’enfant."
  ],
  "it": [
    "Un bambino nuovo non conosce nessuno al parco. Come lo accogli?",
    "Chiedendogli se vuole giocare",
    "Ignorando apposta le sue domande",
    "Vietandogli di entrare",
    "Prendendo in giro il suo nome",
    "Un posto nuovo può intimorire.",
    "Un invito gentile lascia una scelta al bambino."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_20",
  "reason": "Recognise constitution as shared framework without inverted translations.",
  "de": [
    "Welche grundlegenden Regeln gelten für die ganze Schweiz?",
    "Die Bundesverfassung",
    "Die Hausordnung eines einzelnen Wohnhauses",
    "Der Trainingsplan eines Vereins",
    "Die Speisekarte eines Restaurants",
    "Achte auf den Geltungsbereich.",
    "Gesucht ist die Grundlage des gemeinsamen Staates."
  ],
  "en": [
    "Which basic rules apply to all of Switzerland?",
    "The Federal Constitution",
    "One building’s house rules",
    "A club’s training schedule",
    "A restaurant menu",
    "Notice the area they apply to.",
    "Look for the foundation of the shared state."
  ],
  "fr": [
    "Quelles règles fondamentales s’appliquent à toute la Suisse ?",
    "La Constitution fédérale",
    "Le règlement d’un immeuble",
    "Le programme d’entraînement d’un club",
    "Le menu d’un restaurant",
    "Observe le champ d’application.",
    "Cherche la base de l’État commun."
  ],
  "it": [
    "Quali regole fondamentali valgono per tutta la Svizzera?",
    "La Costituzione federale",
    "Il regolamento di un palazzo",
    "Il programma di allenamento di un club",
    "Il menu di un ristorante",
    "Osserva l’ambito di applicazione.",
    "Cerca la base dello Stato comune."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_28",
  "reason": "Simplify municipal code function.",
  "de": [
    "Was regelt eine Gemeindeordnung hauptsächlich?",
    "Wie eine Gemeinde organisiert ist",
    "Wie lange jeder Winter dauert",
    "Wie Pflanzen ihre Blätter bilden",
    "Wie hoch alle Berge werden",
    "Es geht um Aufgaben und Zuständigkeiten.",
    "Die Regeln betreffen die örtliche politische Gemeinschaft."
  ],
  "en": [
    "What does a municipal constitution mainly regulate?",
    "How a municipality is organised",
    "How long every winter lasts",
    "How plants form leaves",
    "How high all mountains grow",
    "Think of tasks and responsibilities.",
    "The rules concern the local political community."
  ],
  "fr": [
    "Que règle principalement l’organisation fondamentale d’une commune ?",
    "La manière dont la commune est organisée",
    "La durée de chaque hiver",
    "La formation des feuilles",
    "La hauteur de toutes les montagnes",
    "Pense aux tâches et aux responsabilités.",
    "Ces règles concernent la communauté politique locale."
  ],
  "it": [
    "Che cosa regola principalmente l’ordinamento di un comune?",
    "Come è organizzato il comune",
    "La durata di ogni inverno",
    "La formazione delle foglie",
    "L’altezza di tutte le montagne",
    "Pensa a compiti e responsabilità.",
    "Le regole riguardano la comunità politica locale."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_32",
  "reason": "Replace federal chancellery detail with relevant local administration.",
  "de": [
    "Eine Familie zieht neu in eine Gemeinde. Wo meldet sie ihren Wohnsitz an?",
    "Bei der zuständigen Gemeindeverwaltung",
    "Bei einer beliebigen Bäckerei",
    "Beim nächsten Kino",
    "Beim Wetterdienst",
    "Es geht um eine amtliche Aufgabe.",
    "Die Gemeinde führt Angaben zu ihren Einwohnern."
  ],
  "en": [
    "A family moves to a municipality. Where do they register their residence?",
    "At the responsible municipal office",
    "At any bakery",
    "At the nearest cinema",
    "At the weather service",
    "This is an official task.",
    "The municipality keeps records of its residents."
  ],
  "fr": [
    "Une famille s’installe dans une commune. Où annonce-t-elle son domicile ?",
    "Au service communal compétent",
    "Dans n’importe quelle boulangerie",
    "Au cinéma le plus proche",
    "Au service météo",
    "C’est une démarche officielle.",
    "La commune tient un registre de ses habitants."
  ],
  "it": [
    "Una famiglia si trasferisce in un comune. Dove annuncia il domicilio?",
    "All’ufficio comunale competente",
    "In una panetteria qualsiasi",
    "Al cinema più vicino",
    "Al servizio meteo",
    "È una pratica ufficiale.",
    "Il comune tiene un registro degli abitanti."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_36",
  "reason": "Replace technical executive/legislative essay with parliamentary task recognition.",
  "de": [
    "Welche Aufgabe hat ein Parlament?",
    "Gesetze beraten und beschliessen",
    "Jeden privaten Einkauf bezahlen",
    "Das Wetter festlegen",
    "Alle Schulaufgaben für Kinder lösen",
    "Es geht um gemeinsame Regeln.",
    "Gewählte Vertreter beraten über Vorschläge."
  ],
  "en": [
    "What is one task of a parliament?",
    "Discussing and passing laws",
    "Paying for every private purchase",
    "Deciding the weather",
    "Doing every child’s homework",
    "Think of shared rules.",
    "Elected representatives discuss proposals."
  ],
  "fr": [
    "Quel est un rôle du parlement ?",
    "Débattre et adopter des lois",
    "Payer chaque achat privé",
    "Décider de la météo",
    "Faire les devoirs de tous les enfants",
    "Pense aux règles communes.",
    "Les représentants élus discutent des propositions."
  ],
  "it": [
    "Qual è un compito del parlamento?",
    "Discutere e approvare leggi",
    "Pagare ogni acquisto privato",
    "Decidere il tempo atmosferico",
    "Fare i compiti di tutti i bambini",
    "Pensa alle regole comuni.",
    "I rappresentanti eletti discutono le proposte."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_38",
  "reason": "Replace department definition with basic federal government recognition.",
  "de": [
    "Wie heisst die Regierung der Schweiz?",
    "Bundesrat",
    "Nationalbibliothek",
    "Bundesgericht",
    "Gemeinderat von Bern",
    "Gesucht ist die Regierung des ganzen Landes.",
    "Sie besteht aus sieben Mitgliedern."
  ],
  "en": [
    "What is Switzerland’s government called?",
    "Federal Council",
    "National Library",
    "Federal Supreme Court",
    "Bern Municipal Council",
    "Look for the government of the whole country.",
    "It has seven members."
  ],
  "fr": [
    "Comment s’appelle le gouvernement de la Suisse ?",
    "Le Conseil fédéral",
    "La Bibliothèque nationale",
    "Le Tribunal fédéral",
    "Le Conseil communal de Berne",
    "Cherche le gouvernement de tout le pays.",
    "Il compte sept membres."
  ],
  "it": [
    "Come si chiama il governo della Svizzera?",
    "Consiglio federale",
    "Biblioteca nazionale",
    "Tribunale federale",
    "Municipio di Berna",
    "Cerca il governo di tutto il paese.",
    "Ha sette membri."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_40",
  "reason": "Correct misleading federal register label and identify local voting list.",
  "de": [
    "Was hält das Stimmregister einer Gemeinde fest?",
    "Wer dort stimmberechtigt ist",
    "Wer am schnellsten rennt",
    "Welche Bücher alle lesen",
    "Welche Partei jedes Kind wählen muss",
    "Es gehört zur Organisation von Abstimmungen.",
    "Nicht jedes Verzeichnis erfasst alle Einwohner für denselben Zweck."
  ],
  "en": [
    "What does a municipality’s electoral register record?",
    "Who is entitled to vote there",
    "Who runs fastest",
    "Which books everyone reads",
    "Which party every child must choose",
    "It helps organise voting.",
    "Registers serve different purposes."
  ],
  "fr": [
    "Que contient le registre électoral d’une commune ?",
    "Les personnes qui y ont le droit de vote",
    "Les personnes qui courent le plus vite",
    "Les livres lus par chacun",
    "Le parti que chaque enfant doit choisir",
    "Il sert à organiser les votations.",
    "Les registres ont des fonctions différentes."
  ],
  "it": [
    "Che cosa contiene il catalogo elettorale di un comune?",
    "Le persone che vi hanno diritto di voto",
    "Chi corre più velocemente",
    "Quali libri leggono tutti",
    "Quale partito deve scegliere ogni bambino",
    "Serve a organizzare le votazioni.",
    "I registri hanno scopi diversi."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_42",
  "reason": "Replace specialist ombudsman definition with accessible mediation.",
  "de": [
    "Was macht eine neutrale Vermittlungsperson bei einem Streit?",
    "Sie hört beide Seiten an und hilft bei einer Lösung",
    "Sie unterstützt ohne Zuhören immer ihre Freunde",
    "Sie verschärft den Streit absichtlich",
    "Sie verbietet beiden Seiten jede Erklärung",
    "Neutral bedeutet, nicht von Anfang an Partei zu ergreifen.",
    "Verstehen kommt vor dem Lösungsvorschlag."
  ],
  "en": [
    "What does a neutral mediator do in a dispute?",
    "Listens to both sides and helps find a solution",
    "Always backs friends without listening",
    "Deliberately worsens the dispute",
    "Forbids both sides to explain",
    "Neutral means not taking a side from the start.",
    "Understanding comes before proposing a solution."
  ],
  "fr": [
    "Que fait une personne neutre qui aide à résoudre un conflit ?",
    "Elle écoute les deux côtés et aide à trouver une solution",
    "Elle soutient ses amis sans écouter",
    "Elle aggrave exprès le conflit",
    "Elle interdit toute explication",
    "Être neutre, c’est ne pas choisir un camp d’avance.",
    "Comprendre vient avant proposer une solution."
  ],
  "it": [
    "Che cosa fa una persona neutrale che media un conflitto?",
    "Ascolta entrambe le parti e aiuta a trovare una soluzione",
    "Sostiene gli amici senza ascoltare",
    "Aggrava apposta il conflitto",
    "Vieta ogni spiegazione",
    "Essere neutrali significa non scegliere una parte in anticipo.",
    "Capire viene prima di proporre una soluzione."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_44",
  "reason": "Replace electoral-system comparison with simple majority interpretation.",
  "de": [
    "Bei einer Abstimmung wählen 12 Kinder den Park und 8 das Museum. Welche Wahl hat die Mehrheit?",
    "Der Park",
    "Das Museum",
    "Beide gleich viele",
    "Keine Wahl, weil nicht alle dasselbe wählen",
    "Vergleiche die Stimmenzahlen.",
    "Eine Mehrheit bedeutet hier mehr als die Hälfte."
  ],
  "en": [
    "Twelve children vote for the park and eight for the museum. Which has the majority?",
    "The park",
    "The museum",
    "Both equally",
    "Neither, because not everyone agrees",
    "Compare the vote counts.",
    "A majority here means more than half."
  ],
  "fr": [
    "Douze enfants votent pour le parc et huit pour le musée. Quel choix a la majorité ?",
    "Le parc",
    "Le musée",
    "Les deux à égalité",
    "Aucun, car tous ne sont pas d’accord",
    "Compare le nombre de voix.",
    "La majorité signifie ici plus de la moitié."
  ],
  "it": [
    "Dodici bambini votano il parco e otto il museo. Quale scelta ha la maggioranza?",
    "Il parco",
    "Il museo",
    "Entrambe alla pari",
    "Nessuna, perché non sono tutti d’accordo",
    "Confronta i voti.",
    "Qui maggioranza significa più della metà."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_46",
  "reason": "Make official statistics concrete.",
  "de": [
    "Welche Frage lässt sich mit einer Einwohnerstatistik beantworten?",
    "Wie viele Menschen in einer Gemeinde wohnen",
    "Welcher Mensch am freundlichsten ist",
    "Welche Farbe morgen alle mögen",
    "Welcher Traum in Erfüllung geht",
    "Statistiken fassen gemessene oder gezählte Angaben zusammen.",
    "Achte auf eine zählbare Grösse."
  ],
  "en": [
    "Which question can population statistics answer?",
    "How many people live in a municipality",
    "Which person is kindest",
    "Which colour everyone will like tomorrow",
    "Which dream will come true",
    "Statistics summarise measured or counted data.",
    "Look for something countable."
  ],
  "fr": [
    "À quelle question répond une statistique de population ?",
    "Combien de personnes habitent une commune",
    "Quelle personne est la plus gentille",
    "Quelle couleur plaira à tous demain",
    "Quel rêve se réalisera",
    "Les statistiques résument des données mesurées ou comptées.",
    "Cherche une quantité que l’on peut compter."
  ],
  "it": [
    "A quale domanda rispondono le statistiche sulla popolazione?",
    "Quante persone abitano in un comune",
    "Quale persona è la più gentile",
    "Quale colore piacerà a tutti domani",
    "Quale sogno si realizzerà",
    "Le statistiche riassumono dati misurati o contati.",
    "Cerca una quantità che si può contare."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_48",
  "reason": "Replace repeated exclusion phrase with accessible municipal participation.",
  "de": [
    "Die Gemeinde fragt Kinder nach Ideen für den Spielplatz. Wie können möglichst viele mitreden?",
    "Ideen aller interessierten Kinder sammeln",
    "Nur Kinder mit teuren Schuhen fragen",
    "Nur die eigene Familie informieren",
    "Alle anderen Meinungen vor dem Lesen löschen",
    "Mitreden soll nicht vom Besitz abhängen.",
    "Verschiedene Erfahrungen helfen bei der Planung."
  ],
  "en": [
    "A municipality asks children for playground ideas. How can many take part?",
    "Collect ideas from all interested children",
    "Ask only children with expensive shoes",
    "Tell only your own family",
    "Delete other views before reading them",
    "Participation should not depend on possessions.",
    "Different experiences help planning."
  ],
  "fr": [
    "La commune demande des idées pour une place de jeux. Comment faire participer beaucoup d’enfants ?",
    "Recueillir les idées de tous les enfants intéressés",
    "Interroger seulement ceux qui ont des chaussures chères",
    "Informer seulement sa famille",
    "Effacer les autres avis sans les lire",
    "La participation ne doit pas dépendre des biens possédés.",
    "Des expériences variées aident à planifier."
  ],
  "it": [
    "Il comune chiede idee per un parco giochi. Come far partecipare molti bambini?",
    "Raccogliere idee da tutti gli interessati",
    "Chiedere solo a chi ha scarpe costose",
    "Informare soltanto la propria famiglia",
    "Cancellare gli altri pareri senza leggerli",
    "La partecipazione non deve dipendere dai beni posseduti.",
    "Esperienze diverse aiutano a progettare."
  ]
},
{
  "key": "4/science/gemeinde-kanton-4/gk4_50",
  "reason": "Replace duplicate dispute phrase with respecting shared-use rules.",
  "de": [
    "Auf dem Spielplatz steht: Nach dem Spielen Geräte wegräumen. Warum hilft diese Regel?",
    "Andere können den Platz sicher nutzen",
    "Nur die schnellsten Kinder dürfen spielen",
    "Spielgeräte müssen versteckt bleiben",
    "Der Platz soll danach unbenutzbar sein",
    "Der Platz gehört nicht nur einer Gruppe.",
    "Denke an die nächsten Besucher."
  ],
  "en": [
    "A playground rule says to put equipment away after use. Why does this help?",
    "Others can use the space safely",
    "Only the fastest children may play",
    "Equipment must stay hidden",
    "The space should become unusable",
    "The space is not just for one group.",
    "Think of the next visitors."
  ],
  "fr": [
    "Une règle demande de ranger le matériel après le jeu. Pourquoi est-ce utile ?",
    "Les autres peuvent utiliser le lieu en sécurité",
    "Seuls les plus rapides peuvent jouer",
    "Le matériel doit rester caché",
    "Le lieu doit devenir inutilisable",
    "Le lieu n’appartient pas à un seul groupe.",
    "Pense aux prochains visiteurs."
  ],
  "it": [
    "Una regola chiede di riordinare il materiale dopo il gioco. Perché aiuta?",
    "Gli altri possono usare lo spazio in sicurezza",
    "Possono giocare solo i più veloci",
    "Il materiale deve restare nascosto",
    "Lo spazio deve diventare inutilizzabile",
    "Il luogo non è di un solo gruppo.",
    "Pensa ai prossimi visitatori."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_20",
  "reason": "Recognise Roman cultural influence without fragment completion.",
  "de": [
    "Was bedeutet Romanisierung?",
    "Die Übernahme römischer Sprache und Lebensweisen",
    "Die Erfindung von Smartphones",
    "Der Bau der ersten Flugzeuge",
    "Die Abschaffung jeder Stadt",
    "Es geht um den Einfluss des Römischen Reichs.",
    "Menschen übernahmen nicht nur Gegenstände, sondern auch Gewohnheiten."
  ],
  "en": [
    "What does Romanisation mean?",
    "Adopting Roman language and ways of life",
    "Inventing smartphones",
    "Building the first aircraft",
    "Abolishing every city",
    "Think of the Roman Empire’s influence.",
    "People adopted customs as well as objects."
  ],
  "fr": [
    "Que signifie la romanisation ?",
    "Adopter la langue et des modes de vie romains",
    "Inventer les smartphones",
    "Construire les premiers avions",
    "Supprimer toutes les villes",
    "Pense à l’influence de l’Empire romain.",
    "Les gens adoptaient des habitudes et des objets."
  ],
  "it": [
    "Che cosa significa romanizzazione?",
    "Adottare lingua e modi di vita romani",
    "Inventare gli smartphone",
    "Costruire i primi aerei",
    "Eliminare tutte le città",
    "Pensa all’influenza dell’Impero romano.",
    "Le persone adottavano abitudini e oggetti."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_24",
  "reason": "Replace disputable largest-state claim with Mediterranean geography.",
  "de": [
    "Um welches Meer lagen viele Gebiete des Römischen Reichs?",
    "Um das Mittelmeer",
    "Um die Ostsee",
    "Um das Japanische Meer",
    "Um das Karibische Meer",
    "Suche Rom auf einer Karte.",
    "Das Meer liegt zwischen Europa und Nordafrika."
  ],
  "en": [
    "Around which sea did many Roman territories lie?",
    "The Mediterranean Sea",
    "The Baltic Sea",
    "The Sea of Japan",
    "The Caribbean Sea",
    "Find Rome on a map.",
    "The sea lies between Europe and North Africa."
  ],
  "fr": [
    "Autour de quelle mer se trouvaient de nombreux territoires romains ?",
    "La Méditerranée",
    "La mer Baltique",
    "La mer du Japon",
    "La mer des Caraïbes",
    "Trouve Rome sur une carte.",
    "Cette mer sépare l’Europe et l’Afrique du Nord."
  ],
  "it": [
    "Attorno a quale mare si trovavano molti territori romani?",
    "Il Mediterraneo",
    "Il Mar Baltico",
    "Il Mar del Giappone",
    "Il Mar dei Caraibi",
    "Trova Roma su una carta.",
    "Questo mare è fra Europa e Africa settentrionale."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_28",
  "reason": "Recognise insula housing function.",
  "de": [
    "Was war eine Insula in einer römischen Stadt?",
    "Ein mehrstöckiges Wohnhaus mit Mietwohnungen",
    "Ein öffentlicher Badebereich",
    "Eine Wasserleitung auf Bögen",
    "Eine Rennbahn für Wagen",
    "Der Begriff beschreibt ein Gebäude zum Wohnen.",
    "Mehrere Haushalte konnten darin leben."
  ],
  "en": [
    "What was an insula in a Roman city?",
    "A multi-storey building with rented homes",
    "A public bathing area",
    "An arched water channel",
    "A chariot racing track",
    "The term describes housing.",
    "Several households could live in it."
  ],
  "fr": [
    "Qu’était une insula dans une ville romaine ?",
    "Un immeuble à étages avec des logements loués",
    "Un espace de bains publics",
    "Un canal sur des arches",
    "Une piste de courses de chars",
    "Le terme désigne une habitation.",
    "Plusieurs ménages pouvaient y vivre."
  ],
  "it": [
    "Che cos’era un’insula in una città romana?",
    "Un edificio a più piani con abitazioni in affitto",
    "Un’area di bagni pubblici",
    "Un canale sopra archi",
    "Una pista per corse di carri",
    "Il termine indica un’abitazione.",
    "Potevano viverci più famiglie."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_36",
  "reason": "Replace oversimplified constitutional comparison with emperor recognition.",
  "de": [
    "Welcher Titel bezeichnet einen Herrscher des Römischen Kaiserreichs?",
    "Kaiser",
    "Bäcker",
    "Töpfer",
    "Gladiator",
    "Gesucht ist eine politische Herrschaftsrolle.",
    "Augustus trug diesen Titel in unserer heutigen Bezeichnung."
  ],
  "en": [
    "Which title names a ruler of the Roman Empire?",
    "Emperor",
    "Baker",
    "Potter",
    "Gladiator",
    "Look for a political ruling role.",
    "This is how we describe Augustus today."
  ],
  "fr": [
    "Quel titre désigne un dirigeant de l’Empire romain ?",
    "Empereur",
    "Boulanger",
    "Potier",
    "Gladiateur",
    "Cherche un rôle de pouvoir politique.",
    "C’est ainsi que nous désignons Auguste aujourd’hui."
  ],
  "it": [
    "Quale titolo indica un sovrano dell’Impero romano?",
    "Imperatore",
    "Fornaio",
    "Vasaio",
    "Gladiatore",
    "Cerca un ruolo di potere politico.",
    "È così che oggi definiamo Augusto."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_38",
  "reason": "Recognise Latin Swiss name without explanatory phrase entry.",
  "de": [
    "Welches Land bezeichnet «Helvetia» auf Schweizer Münzen?",
    "Die Schweiz",
    "Italien",
    "Griechenland",
    "Ägypten",
    "Die Aufschrift verwendet einen lateinischen Namen.",
    "Denke daran, welches Land diese Münzen herausgibt."
  ],
  "en": [
    "Which country does ‘Helvetia’ name on Swiss coins?",
    "Switzerland",
    "Italy",
    "Greece",
    "Egypt",
    "The inscription uses a Latin name.",
    "Think of the country issuing these coins."
  ],
  "fr": [
    "Quel pays désigne « Helvetia » sur les pièces suisses ?",
    "La Suisse",
    "L’Italie",
    "La Grèce",
    "L’Égypte",
    "L’inscription utilise un nom latin.",
    "Pense au pays qui émet ces pièces."
  ],
  "it": [
    "Quale paese indica «Helvetia» sulle monete svizzere?",
    "La Svizzera",
    "L’Italia",
    "La Grecia",
    "L’Egitto",
    "L’iscrizione usa un nome latino.",
    "Pensa al paese che emette queste monete."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_40",
  "reason": "Replace repeated language-history essay with Roman archaeological place.",
  "de": [
    "Was kannst du in Augusta Raurica bei Basel besichtigen?",
    "Überreste einer römischen Stadt",
    "Ein noch bewohntes römisches Kaiserreich",
    "Eine moderne Raumstation",
    "Die ägyptischen Pyramiden von Gizeh",
    "Der Ort bewahrt Spuren der Antike.",
    "Archäologische Funde zeigen frühere Gebäude und Alltagsgegenstände."
  ],
  "en": [
    "What can you visit at Augusta Raurica near Basel?",
    "Remains of a Roman town",
    "A still-existing Roman Empire",
    "A modern space station",
    "The Egyptian pyramids of Giza",
    "The site preserves traces of antiquity.",
    "Archaeological finds reveal old buildings and everyday objects."
  ],
  "fr": [
    "Que peut-on visiter à Augusta Raurica près de Bâle ?",
    "Les vestiges d’une ville romaine",
    "Un Empire romain encore existant",
    "Une station spatiale moderne",
    "Les pyramides égyptiennes de Gizeh",
    "Le site conserve des traces de l’Antiquité.",
    "Les fouilles révèlent des bâtiments et des objets anciens."
  ],
  "it": [
    "Che cosa puoi visitare ad Augusta Raurica vicino a Basilea?",
    "Resti di una città romana",
    "Un Impero romano ancora esistente",
    "Una stazione spaziale moderna",
    "Le piramidi egizie di Giza",
    "Il sito conserva tracce dell’antichità.",
    "Gli scavi mostrano edifici e oggetti antichi."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_42",
  "reason": "Recognise Latin ancestry without causal essay.",
  "de": [
    "Aus welcher Sprache entwickelte sich das Rätoromanische hauptsächlich?",
    "Aus dem gesprochenen Latein",
    "Aus dem Japanischen",
    "Aus dem Finnischen",
    "Aus dem modernen Englisch",
    "Denke an den sprachlichen Einfluss der Römer.",
    "Sprachen verändern sich über viele Generationen."
  ],
  "en": [
    "From which language did Romansh mainly develop?",
    "Spoken Latin",
    "Japanese",
    "Finnish",
    "Modern English",
    "Think of Roman language influence.",
    "Languages change over many generations."
  ],
  "fr": [
    "De quelle langue le romanche est-il principalement issu ?",
    "Du latin parlé",
    "Du japonais",
    "Du finnois",
    "De l’anglais moderne",
    "Pense à l’influence linguistique romaine.",
    "Les langues évoluent au fil des générations."
  ],
  "it": [
    "Da quale lingua si è sviluppato principalmente il romancio?",
    "Dal latino parlato",
    "Dal giapponese",
    "Dal finlandese",
    "Dall’inglese moderno",
    "Pensa all’influenza linguistica romana.",
    "Le lingue cambiano nel corso delle generazioni."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_44",
  "reason": "Replace duplicate insula definition with housing density application.",
  "de": [
    "Warum konnten in römischen Mietshäusern viele Familien auf wenig Grundfläche wohnen?",
    "Die Häuser hatten mehrere Stockwerke",
    "Alle Häuser waren nur Zelte",
    "Jede Familie bewohnte einen eigenen grossen Park",
    "Die Wohnungen lagen ausschliesslich auf Schiffen",
    "Vergleiche Bauen in die Höhe mit Bauen in die Breite.",
    "Über einer Wohnung konnte eine weitere liegen."
  ],
  "en": [
    "Why could Roman apartment houses fit many families on little ground?",
    "They had several floors",
    "All the houses were tents",
    "Each family occupied a large private park",
    "The homes were only on ships",
    "Compare building upwards with building outwards.",
    "One home could be above another."
  ],
  "fr": [
    "Pourquoi les immeubles romains logeaient-ils beaucoup de familles sur peu de terrain ?",
    "Ils avaient plusieurs étages",
    "Toutes les maisons étaient des tentes",
    "Chaque famille occupait un grand parc privé",
    "Les logements étaient seulement sur des bateaux",
    "Compare construire en hauteur et en largeur.",
    "Un logement pouvait se trouver au-dessus d’un autre."
  ],
  "it": [
    "Perché i caseggiati romani ospitavano molte famiglie su poco terreno?",
    "Avevano più piani",
    "Tutte le case erano tende",
    "Ogni famiglia occupava un grande parco privato",
    "Le abitazioni erano soltanto su navi",
    "Confronta costruire in altezza e in larghezza.",
    "Un’abitazione poteva trovarsi sopra un’altra."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_46",
  "reason": "Recognise commemorative arch function.",
  "de": [
    "Wozu errichteten Römer Triumphbögen?",
    "Um Siege und Herrscher zu ehren",
    "Um ausschliesslich Getreide zu mahlen",
    "Um in jedem Bogen Trinkwasser zu lagern",
    "Um Tiere im Winter zu füttern",
    "Es waren öffentliche Denkmäler.",
    "Inschriften und Bilder erinnerten an bestimmte Ereignisse oder Personen."
  ],
  "en": [
    "Why did Romans build triumphal arches?",
    "To honour victories and rulers",
    "Only to grind grain",
    "To store drinking water in every arch",
    "To feed animals in winter",
    "They were public monuments.",
    "Inscriptions and images recalled events or people."
  ],
  "fr": [
    "Pourquoi les Romains construisaient-ils des arcs de triomphe ?",
    "Pour honorer des victoires et des dirigeants",
    "Seulement pour moudre du grain",
    "Pour stocker de l’eau dans chaque arc",
    "Pour nourrir les animaux en hiver",
    "C’étaient des monuments publics.",
    "Les inscriptions et images rappelaient des événements ou des personnes."
  ],
  "it": [
    "Perché i Romani costruivano archi di trionfo?",
    "Per celebrare vittorie e governanti",
    "Solo per macinare cereali",
    "Per conservare acqua in ogni arco",
    "Per nutrire animali in inverno",
    "Erano monumenti pubblici.",
    "Iscrizioni e immagini ricordavano eventi o persone."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_48",
  "reason": "Replace numismatics jargon with source interpretation.",
  "de": [
    "Was kann das Bild auf einer römischen Münze über die damalige Zeit zeigen?",
    "Welcher Herrscher dargestellt und geehrt wurde",
    "Das genaue Wetter an jedem Tag",
    "Die Namen aller Einwohner des Reichs",
    "Den Fahrplan heutiger Züge",
    "Münzen verbreiteten auch Bilder und Botschaften.",
    "Achte auf Porträts und Inschriften."
  ],
  "en": [
    "What can an image on a Roman coin show about its time?",
    "Which ruler was depicted and honoured",
    "The exact weather every day",
    "The names of every empire resident",
    "Today’s train timetable",
    "Coins also spread images and messages.",
    "Look at portraits and inscriptions."
  ],
  "fr": [
    "Que peut montrer l’image d’une monnaie romaine sur son époque ?",
    "Quel dirigeant était représenté et honoré",
    "La météo exacte de chaque jour",
    "Le nom de tous les habitants",
    "L’horaire actuel des trains",
    "Les monnaies diffusaient aussi des images et messages.",
    "Observe les portraits et inscriptions."
  ],
  "it": [
    "Che cosa può mostrare l’immagine su una moneta romana?",
    "Quale governante era raffigurato e celebrato",
    "Il tempo esatto di ogni giorno",
    "I nomi di tutti gli abitanti",
    "L’orario dei treni attuali",
    "Le monete diffondevano anche immagini e messaggi.",
    "Osserva ritratti e iscrizioni."
  ]
},
{
  "key": "4/science/roemisches-reich-4/rr4_50",
  "reason": "Replace malformed archaeological traces essay with object identification.",
  "de": [
    "Welcher Fund kann direkt aus der Römerzeit stammen?",
    "Eine bei einer Ausgrabung datierte römische Münze",
    "Ein Smartphone mit Römerfoto",
    "Ein heutiges Comicbuch über Caesar",
    "Ein Plastikschwert aus einem Spielzeugladen",
    "Unterscheide einen alten Gegenstand von einer neuen Darstellung.",
    "Die Herkunft und Datierung des Fundes müssen geprüft sein."
  ],
  "en": [
    "Which find can come directly from Roman times?",
    "A Roman coin dated during an excavation",
    "A smartphone with a Roman photo",
    "A modern comic about Caesar",
    "A plastic sword from a toy shop",
    "Distinguish an old object from a new depiction.",
    "The find’s origin and date need checking."
  ],
  "fr": [
    "Quel objet peut provenir directement de l’époque romaine ?",
    "Une monnaie romaine datée lors de fouilles",
    "Un smartphone avec une photo romaine",
    "Une BD actuelle sur César",
    "Une épée en plastique d’un magasin",
    "Distingue un objet ancien d’une représentation récente.",
    "L’origine et la datation doivent être vérifiées."
  ],
  "it": [
    "Quale reperto può provenire direttamente dall’epoca romana?",
    "Una moneta romana datata durante uno scavo",
    "Uno smartphone con una foto romana",
    "Un fumetto moderno su Cesare",
    "Una spada di plastica di un negozio",
    "Distingui un oggetto antico da una rappresentazione recente.",
    "Origine e datazione devono essere verificate."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_4",
  "reason": "Replace contested sole-inventor/date gloss with chronological technology comparison.",
  "de": [
    "Welches Gerät gab es früher als das Smartphone?",
    "Das Telefon mit Kabelanschluss",
    "Die moderne Smartwatch",
    "Das Tablet mit Touchscreen",
    "Die heutige Spielkonsole mit Internet",
    "Vergleiche verschiedene Generationen von Geräten.",
    "Früher war ein Anruf meist an einen festen Anschluss gebunden."
  ],
  "en": [
    "Which device existed before the smartphone?",
    "The wired telephone",
    "The modern smartwatch",
    "The touchscreen tablet",
    "Today’s internet-connected game console",
    "Compare generations of devices.",
    "Calls used to be tied to a fixed connection."
  ],
  "fr": [
    "Quel appareil existait avant le smartphone ?",
    "Le téléphone filaire",
    "La montre connectée moderne",
    "La tablette tactile",
    "La console actuelle connectée à Internet",
    "Compare les générations d’appareils.",
    "Les appels dépendaient souvent d’un raccordement fixe."
  ],
  "it": [
    "Quale apparecchio esisteva prima dello smartphone?",
    "Il telefono con filo",
    "Lo smartwatch moderno",
    "Il tablet con schermo tattile",
    "L’attuale console collegata a Internet",
    "Confronta generazioni di apparecchi.",
    "Le chiamate dipendevano spesso da un collegamento fisso."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_6",
  "reason": "Recognise hand textile production without blanket historical claim.",
  "de": [
    "Wie stellten Menschen Stoff her, bevor mechanische Webmaschinen verbreitet waren?",
    "Durch Weben am Handwebstuhl",
    "Durch Nähen direkt aus ungesponnener Wolle allein",
    "Durch Formen von Fäden wie Ton in einer Form",
    "Durch blosses Färben einzelner Fäden ohne Verbindung",
    "Fäden müssen miteinander verbunden werden.",
    "Die Hände bewegten die Teile des Werkzeugs."
  ],
  "en": [
    "How did people make cloth before mechanical looms were widespread?",
    "By weaving on a hand loom",
    "By sewing directly from unspun wool alone",
    "By moulding threads like clay in a mould",
    "By only dyeing separate threads without joining them",
    "Threads need to be joined together.",
    "Hands moved the tool’s parts."
  ],
  "fr": [
    "Comment fabriquait-on du tissu avant la diffusion des métiers mécaniques ?",
    "Avec un métier à tisser manuel",
    "En cousant directement de la laine non filée seulement",
    "En moulant les fils comme de l’argile",
    "En teignant seulement des fils séparés sans les relier",
    "Les fils doivent être entrelacés.",
    "Les mains actionnaient les parties de l’outil."
  ],
  "it": [
    "Come si produceva tessuto prima della diffusione dei telai meccanici?",
    "Con un telaio manuale",
    "Cucendo direttamente soltanto lana non filata",
    "Modellando i fili come argilla in uno stampo",
    "Tingendo solo fili separati senza unirli",
    "I fili devono essere intrecciati.",
    "Le mani muovevano le parti dello strumento."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_10",
  "reason": "Recognise contemporary real-time communication.",
  "de": [
    "Wie können zwei Menschen an entfernten Orten heute gleichzeitig miteinander sprechen und sich sehen?",
    "Mit einem Videoanruf",
    "Mit einer verschlossenen Postkarte",
    "Mit einem Tagebuch im Schrank",
    "Mit einem gedruckten Wörterbuch allein",
    "Bild und Ton müssen übertragen werden.",
    "Dafür brauchen die Geräte eine Verbindung."
  ],
  "en": [
    "How can distant people talk and see each other at the same time today?",
    "With a video call",
    "With a sealed postcard",
    "With a diary in a cupboard",
    "With only a printed dictionary",
    "Images and sound must be transmitted.",
    "The devices need a connection."
  ],
  "fr": [
    "Comment des personnes éloignées peuvent-elles se parler et se voir en même temps ?",
    "Par appel vidéo",
    "Avec une carte postale fermée",
    "Avec un journal dans un placard",
    "Avec seulement un dictionnaire imprimé",
    "Il faut transmettre image et son.",
    "Les appareils ont besoin d’une connexion."
  ],
  "it": [
    "Come possono persone lontane parlarsi e vedersi nello stesso momento?",
    "Con una videochiamata",
    "Con una cartolina chiusa",
    "Con un diario nell’armadio",
    "Solo con un dizionario stampato",
    "Immagini e suoni devono essere trasmessi.",
    "Gli apparecchi hanno bisogno di un collegamento."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_24",
  "reason": "Make automation concrete without overclaiming all work replacement.",
  "de": [
    "Welche gleichförmige Arbeit kann eine Maschine gut wiederholen?",
    "Gleich grosse Teile nach Gewicht sortieren",
    "Ohne Prüfung wissen, was jeder Mensch fühlt",
    "Alle menschlichen Entscheidungen fehlerfrei ersetzen",
    "Jeden Streit ohne Informationen lösen",
    "Klare Messregeln helfen einer Maschine.",
    "Gefühle und schwierige Entscheidungen brauchen mehr als einen einfachen Messwert."
  ],
  "en": [
    "Which repetitive task can a machine do well?",
    "Sort equal-sized parts by weight",
    "Know everyone’s feelings without checking",
    "Replace all human decisions without error",
    "Solve every dispute without information",
    "Clear measurement rules help a machine.",
    "Feelings and difficult decisions need more than one measurement."
  ],
  "fr": [
    "Quelle tâche répétitive une machine peut-elle bien accomplir ?",
    "Trier des pièces de même taille selon leur poids",
    "Connaître les sentiments de tous sans vérifier",
    "Remplacer toutes les décisions humaines sans erreur",
    "Résoudre chaque conflit sans information",
    "Des règles de mesure claires aident la machine.",
    "Les sentiments demandent plus qu’une simple mesure."
  ],
  "it": [
    "Quale compito ripetitivo può svolgere bene una macchina?",
    "Ordinare pezzi uguali per peso",
    "Conoscere tutti i sentimenti senza verificare",
    "Sostituire ogni decisione umana senza errori",
    "Risolvere ogni conflitto senza informazioni",
    "Regole di misura chiare aiutano la macchina.",
    "I sentimenti richiedono più di una semplice misura."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_28",
  "reason": "Replace inaccurate apprenticeship-instead-of-school generalisation with craft learning.",
  "de": [
    "Wie lernte ein Lehrling früher oft ein Handwerk?",
    "Durch Mitarbeit und Anleitung bei einem erfahrenen Meister",
    "Nur durch Schlafen in der Werkstatt",
    "Durch sofortiges Können ohne Übung",
    "Nur durch Betrachten des Firmenschilds",
    "Fertigkeiten wachsen durch angeleitetes Üben.",
    "Jemand mit Erfahrung zeigte die Arbeitsschritte."
  ],
  "en": [
    "How did an apprentice often learn a craft in the past?",
    "By working under an experienced master’s guidance",
    "Only by sleeping in the workshop",
    "By knowing everything without practice",
    "Only by looking at the business sign",
    "Skills grow through guided practice.",
    "An experienced person demonstrated the steps."
  ],
  "fr": [
    "Comment un apprenti apprenait-il souvent un métier autrefois ?",
    "En travaillant sous la direction d’un maître expérimenté",
    "Seulement en dormant dans l’atelier",
    "En sachant tout sans entraînement",
    "Seulement en regardant l’enseigne",
    "Les compétences se développent par la pratique guidée.",
    "Une personne expérimentée montrait les étapes."
  ],
  "it": [
    "Come imparava spesso un mestiere un apprendista in passato?",
    "Lavorando sotto la guida di un maestro esperto",
    "Solo dormendo in bottega",
    "Sapendo già tutto senza esercizio",
    "Solo guardando l’insegna",
    "Le capacità crescono con la pratica guidata.",
    "Una persona esperta mostrava i passaggi."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_30",
  "reason": "Explain compulsory schooling rather than complete tautological history sentence.",
  "de": [
    "Was bedeutet Schulpflicht?",
    "Kinder müssen während der vorgeschriebenen Zeit eine Schulbildung erhalten",
    "Nur Kinder mit reichen Eltern dürfen lernen",
    "Jedes Kind darf Unterricht grundsätzlich verweigern",
    "Schulen sind nur in den Ferien geöffnet",
    "Es geht um Bildung für alle Kinder.",
    "Die genauen Regeln legt der Staat fest."
  ],
  "en": [
    "What does compulsory schooling mean?",
    "Children must receive schooling during the required period",
    "Only children with rich parents may learn",
    "Every child can simply refuse all education",
    "Schools open only during holidays",
    "Think of education for all children.",
    "The state sets the exact rules."
  ],
  "fr": [
    "Que signifie la scolarité obligatoire ?",
    "Les enfants doivent recevoir une formation scolaire durant la période prévue",
    "Seuls les enfants riches peuvent apprendre",
    "Chaque enfant peut refuser toute instruction",
    "Les écoles ouvrent seulement pendant les vacances",
    "Pense à l’éducation de tous les enfants.",
    "L’État fixe les règles précises."
  ],
  "it": [
    "Che cosa significa obbligo scolastico?",
    "I bambini devono ricevere un’istruzione nel periodo previsto",
    "Solo i bambini ricchi possono imparare",
    "Ogni bambino può rifiutare ogni istruzione",
    "Le scuole aprono solo durante le vacanze",
    "Pensa all’istruzione di tutti i bambini.",
    "Lo Stato stabilisce le regole precise."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_32",
  "reason": "Replace blanket housework reduction claim with specific appliance function.",
  "de": [
    "Welche Arbeit übernimmt eine Waschmaschine?",
    "Wäsche im Wasser bewegen und reinigen",
    "Alle Kleider selbstständig nähen",
    "Jeden Fleck ohne Wasser oder Mittel entfernen",
    "Alle Hausarbeiten gleichzeitig erledigen",
    "Betrachte eine einzelne Aufgabe im Haushalt.",
    "Maschinen nehmen bestimmte Arbeitsschritte ab, nicht jede Arbeit."
  ],
  "en": [
    "Which task does a washing machine perform?",
    "Move and clean laundry in water",
    "Sew every garment by itself",
    "Remove every stain without water or detergent",
    "Do all household tasks at once",
    "Focus on one household task.",
    "Machines handle certain steps, not every task."
  ],
  "fr": [
    "Quelle tâche accomplit une machine à laver ?",
    "Brasser et nettoyer le linge dans l’eau",
    "Coudre seule tous les vêtements",
    "Enlever toute tache sans eau ni produit",
    "Faire toutes les tâches ménagères à la fois",
    "Pense à une tâche précise du ménage.",
    "Les machines prennent en charge certaines étapes, pas tout."
  ],
  "it": [
    "Quale compito svolge una lavatrice?",
    "Muovere e pulire il bucato nell’acqua",
    "Cucire da sola tutti i vestiti",
    "Togliere ogni macchia senza acqua né prodotto",
    "Fare tutte le faccende insieme",
    "Pensa a un compito preciso in casa.",
    "Le macchine svolgono alcuni passaggi, non tutto."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_34",
  "reason": "Recognise remote digital work equipment.",
  "de": [
    "Was ermöglicht die gemeinsame Bearbeitung einer Online-Datei von verschiedenen Orten?",
    "Vernetzte Computer mit passendem Programm",
    "Zwei ausgeschaltete Geräte ohne Verbindung",
    "Ein leerer Briefumschlag",
    "Nur ein Lineal auf jedem Tisch",
    "Die Geräte müssen Daten austauschen können.",
    "Auch die passende Software wird gebraucht."
  ],
  "en": [
    "What allows people in different places to edit an online file together?",
    "Connected computers with suitable software",
    "Two switched-off devices with no connection",
    "An empty envelope",
    "Only a ruler on each desk",
    "The devices must exchange data.",
    "Suitable software is also needed."
  ],
  "fr": [
    "Qu’est-ce qui permet de modifier ensemble un fichier en ligne depuis différents lieux ?",
    "Des ordinateurs connectés avec un logiciel adapté",
    "Deux appareils éteints sans connexion",
    "Une enveloppe vide",
    "Seulement une règle sur chaque table",
    "Les appareils doivent échanger des données.",
    "Il faut aussi un logiciel adapté."
  ],
  "it": [
    "Che cosa permette di modificare insieme un file online da luoghi diversi?",
    "Computer collegati con un programma adatto",
    "Due apparecchi spenti senza collegamento",
    "Una busta vuota",
    "Solo un righello su ogni tavolo",
    "Gli apparecchi devono scambiare dati.",
    "Serve anche un programma adatto."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_36",
  "reason": "Replace philosophy of history with elementary timeline ordering.",
  "de": [
    "Welche Reihenfolge ist zeitlich richtig?",
    "Grosseltern als Kinder, Eltern als Kinder, du als Kind",
    "Du als Kind, Grosseltern als Kinder, Eltern als Kinder",
    "Eltern als Kinder, du als Kind, Grosseltern als Kinder",
    "Alle drei Generationen waren gleichzeitig Kinder",
    "Vergleiche die Generationen.",
    "Beginne mit der ältesten Generation."
  ],
  "en": [
    "Which order is chronological?",
    "Grandparents as children, parents as children, you as a child",
    "You as a child, grandparents as children, parents as children",
    "Parents as children, you as a child, grandparents as children",
    "All three generations were children at the same time",
    "Compare the generations.",
    "Start with the oldest generation."
  ],
  "fr": [
    "Quel ordre est chronologique ?",
    "Grands-parents enfants, parents enfants, toi enfant",
    "Toi enfant, grands-parents enfants, parents enfants",
    "Parents enfants, toi enfant, grands-parents enfants",
    "Les trois générations étaient enfants en même temps",
    "Compare les générations.",
    "Commence par la génération la plus ancienne."
  ],
  "it": [
    "Quale ordine è cronologico?",
    "Nonni da bambini, genitori da bambini, tu da bambino",
    "Tu da bambino, nonni da bambini, genitori da bambini",
    "Genitori da bambini, tu da bambino, nonni da bambini",
    "Le tre generazioni erano bambine contemporaneamente",
    "Confronta le generazioni.",
    "Inizia dalla generazione più anziana."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_38",
  "reason": "Replace demography definition with countable population change.",
  "de": [
    "In ein Dorf ziehen mehr Menschen zu, als wegziehen. Was bewirkt dieser Unterschied allein?",
    "Die Einwohnerzahl steigt",
    "Die Einwohnerzahl sinkt",
    "Die Einwohnerzahl bleibt durch diesen Unterschied unverändert",
    "Die Einwohnerzahl lässt sich nur an der Fläche des Dorfes erkennen",
    "Betrachte nur Zu- und Wegzüge.",
    "Vergleiche Hinzukommen und Weggehen."
  ],
  "en": [
    "More people move into a village than leave. What does this difference alone do?",
    "The population increases",
    "The population decreases",
    "This difference leaves the population unchanged",
    "Population can only be found from the village’s area",
    "Consider only arrivals and departures.",
    "Compare people joining and leaving."
  ],
  "fr": [
    "Plus de personnes arrivent dans un village qu’il n’en part. Quel est l’effet de cette différence seule ?",
    "La population augmente",
    "La population diminue",
    "Cette différence laisse la population inchangée",
    "La population se détermine seulement par la superficie du village",
    "Considère seulement les arrivées et départs.",
    "Compare les personnes qui entrent et qui sortent."
  ],
  "it": [
    "In un paese arrivano più persone di quante partano. Che effetto ha questa differenza da sola?",
    "La popolazione aumenta",
    "La popolazione diminuisce",
    "Questa differenza lascia invariata la popolazione",
    "La popolazione si determina solo dalla superficie del paese",
    "Considera solo arrivi e partenze.",
    "Confronta chi arriva e chi parte."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_40",
  "reason": "Replace postmodernism with respectful differences in everyday life.",
  "de": [
    "Zwei Familien feiern unterschiedliche Feste. Welche Aussage passt?",
    "Familien können unterschiedliche Bräuche haben",
    "Eine Familie muss deshalb falsch leben",
    "Alle Familien feiern immer genau gleich",
    "Unterschiedliche Feste verhindern jede Freundschaft",
    "Lebensweisen können verschieden sein.",
    "Respekt verlangt nicht, dass alle dasselbe tun."
  ],
  "en": [
    "Two families celebrate different festivals. Which statement fits?",
    "Families can have different customs",
    "One family must therefore live wrongly",
    "Every family always celebrates identically",
    "Different festivals make friendship impossible",
    "Ways of life can differ.",
    "Respect does not require everyone to do the same thing."
  ],
  "fr": [
    "Deux familles célèbrent des fêtes différentes. Quelle phrase convient ?",
    "Les familles peuvent avoir des coutumes différentes",
    "Une famille vit donc forcément mal",
    "Toutes les familles fêtent toujours pareil",
    "Des fêtes différentes rendent l’amitié impossible",
    "Les modes de vie peuvent varier.",
    "Le respect n’exige pas de faire tous la même chose."
  ],
  "it": [
    "Due famiglie celebrano feste diverse. Quale frase va bene?",
    "Le famiglie possono avere usanze diverse",
    "Una famiglia vive quindi per forza male",
    "Tutte le famiglie festeggiano sempre allo stesso modo",
    "Feste diverse rendono impossibile l’amicizia",
    "I modi di vivere possono variare.",
    "Il rispetto non richiede di fare tutti le stesse cose."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_42",
  "reason": "Replace Homo faber with concrete tool purpose.",
  "de": [
    "Warum verwenden Menschen Werkzeuge wie einen Hammer?",
    "Um bestimmte Arbeiten zu erleichtern",
    "Damit jede Arbeit ohne Menschen geschieht",
    "Damit man keine Sicherheitsregeln braucht",
    "Damit Material beliebig aus dem Nichts entsteht",
    "Ein Werkzeug erweitert Möglichkeiten der Hände.",
    "Die passende Form hilft bei einer bestimmten Aufgabe."
  ],
  "en": [
    "Why do people use tools such as a hammer?",
    "To make certain tasks easier",
    "So all work happens without people",
    "So safety rules are unnecessary",
    "So materials appear from nothing",
    "A tool extends what hands can do.",
    "Its shape helps with a specific task."
  ],
  "fr": [
    "Pourquoi utilise-t-on des outils comme un marteau ?",
    "Pour faciliter certaines tâches",
    "Pour que tout se fasse sans personne",
    "Pour ne plus avoir besoin de règles de sécurité",
    "Pour créer des matériaux à partir de rien",
    "Un outil élargit les possibilités des mains.",
    "Sa forme aide à une tâche précise."
  ],
  "it": [
    "Perché si usano strumenti come un martello?",
    "Per facilitare certi lavori",
    "Perché tutto avvenga senza persone",
    "Per non aver bisogno di regole di sicurezza",
    "Per creare materiali dal nulla",
    "Uno strumento amplia le possibilità delle mani.",
    "La forma aiuta in un compito preciso."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_44",
  "reason": "Replace Thomas theorem with evidence-based handling of rumours.",
  "de": [
    "Jemand erzählt, morgen falle die Schule aus. Was ist vor dem Weitererzählen sinnvoll?",
    "Bei der Schule oder einer verlässlichen Mitteilung nachprüfen",
    "Die Nachricht sofort als Tatsache verbreiten",
    "Nur zählen, wie oft das Gerücht geteilt wurde",
    "Eine noch aufregendere Version erfinden",
    "Eine oft erzählte Behauptung ist nicht automatisch wahr.",
    "Suche eine zuständige Quelle."
  ],
  "en": [
    "Someone says school is cancelled tomorrow. What should you do before sharing it?",
    "Check with the school or an official notice",
    "Spread it immediately as fact",
    "Only count how often the rumour was shared",
    "Invent a more exciting version",
    "A repeated claim is not automatically true.",
    "Look for a responsible source."
  ],
  "fr": [
    "Quelqu’un dit qu’il n’y a pas d’école demain. Que faire avant de le répéter ?",
    "Vérifier auprès de l’école ou d’une annonce fiable",
    "Le répandre aussitôt comme un fait",
    "Compter seulement les partages de la rumeur",
    "Inventer une version plus excitante",
    "Une affirmation répétée n’est pas forcément vraie.",
    "Cherche une source compétente."
  ],
  "it": [
    "Qualcuno dice che domani la scuola è chiusa. Che fare prima di ripeterlo?",
    "Verificare con la scuola o un avviso affidabile",
    "Diffonderlo subito come un fatto",
    "Contare solo le condivisioni della voce",
    "Inventare una versione più emozionante",
    "Un’affermazione ripetuta non è per forza vera.",
    "Cerca una fonte competente."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_46",
  "reason": "Recognise tradition through an example.",
  "de": [
    "Welches Beispiel zeigt eine Tradition?",
    "Eine Familie backt seit Generationen dasselbe Festgebäck",
    "Eine Firma erfindet heute erstmals ein Gerät",
    "Ein Kind entdeckt gerade einen unbekannten Weg",
    "Eine Schule testet zum ersten Mal eine neue App",
    "Achte auf das Weitergeben über längere Zeit.",
    "Etwas wird wiederholt und bewahrt."
  ],
  "en": [
    "Which example shows a tradition?",
    "A family has baked the same festive pastry for generations",
    "A company invents a device for the first time today",
    "A child has just found an unknown path",
    "A school tests a new app for the first time",
    "Look for something passed on over time.",
    "Something is repeated and preserved."
  ],
  "fr": [
    "Quel exemple montre une tradition ?",
    "Une famille prépare le même gâteau de fête depuis des générations",
    "Une entreprise invente un appareil aujourd’hui",
    "Un enfant découvre un chemin inconnu",
    "Une école teste une nouvelle appli pour la première fois",
    "Cherche ce qui se transmet dans le temps.",
    "Quelque chose est répété et conservé."
  ],
  "it": [
    "Quale esempio mostra una tradizione?",
    "Una famiglia prepara lo stesso dolce festivo da generazioni",
    "Un’azienda inventa oggi un apparecchio",
    "Un bambino scopre un sentiero sconosciuto",
    "Una scuola prova per la prima volta una nuova app",
    "Cerca ciò che viene trasmesso nel tempo.",
    "Qualcosa viene ripetuto e conservato."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_48",
  "reason": "Replace misleading evolution/revolution dichotomy with gradual change observation.",
  "de": [
    "Welche Veränderung geschieht schrittweise über viele Jahre?",
    "Ein Dorf bekommt nach und nach neue Häuser",
    "Eine Lampe wird mit einem Klick eingeschaltet",
    "Ein Glas fällt in einer Sekunde um",
    "Eine Tür wird kurz zugeschlagen",
    "Achte auf die Dauer.",
    "Schrittweise bedeutet nicht alles auf einmal."
  ],
  "en": [
    "Which change happens gradually over many years?",
    "A village gains new houses little by little",
    "A lamp is switched on with one click",
    "A glass falls over in a second",
    "A door is briefly slammed",
    "Notice the duration.",
    "Gradually means not all at once."
  ],
  "fr": [
    "Quel changement se fait progressivement sur de nombreuses années ?",
    "Un village gagne peu à peu de nouvelles maisons",
    "Une lampe s’allume d’un clic",
    "Un verre tombe en une seconde",
    "Une porte claque brièvement",
    "Observe la durée.",
    "Progressivement ne veut pas dire tout à la fois."
  ],
  "it": [
    "Quale cambiamento avviene gradualmente in molti anni?",
    "Un paese acquista poco alla volta nuove case",
    "Una lampada si accende con un clic",
    "Un bicchiere cade in un secondo",
    "Una porta viene sbattuta",
    "Osserva la durata.",
    "Gradualmente non significa tutto insieme."
  ]
},
{
  "key": "4/science/lebensweisen-4/lw4_50",
  "reason": "Recognise chronology purpose rather than redundant definition entry.",
  "de": [
    "Was zeigt eine Zeitleiste?",
    "Ereignisse in ihrer zeitlichen Reihenfolge",
    "Orte nach ihrer Höhe über Meer",
    "Wörter nur nach ihrer Länge",
    "Menschen nach ihrer Schuhgrösse",
    "Achte auf Jahreszahlen und Zeitabschnitte.",
    "Du erkennst, was früher und was später geschah."
  ],
  "en": [
    "What does a timeline show?",
    "Events in chronological order",
    "Places by height above sea level",
    "Words only by length",
    "People by shoe size",
    "Look for years and time periods.",
    "You can see what happened earlier and later."
  ],
  "fr": [
    "Que montre une frise chronologique ?",
    "Les événements dans l’ordre du temps",
    "Les lieux selon leur altitude",
    "Les mots selon leur longueur seulement",
    "Les personnes selon leur pointure",
    "Observe les années et les périodes.",
    "Tu vois ce qui s’est passé avant ou après."
  ],
  "it": [
    "Che cosa mostra una linea del tempo?",
    "Gli eventi in ordine cronologico",
    "I luoghi secondo l’altitudine",
    "Le parole solo per lunghezza",
    "Le persone secondo il numero di scarpe",
    "Osserva anni e periodi.",
    "Vedi che cosa è avvenuto prima e dopo."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_2",
  "reason": "Clarify water-tower metaphor without list entry.",
  "de": [
    "Warum wird die Schweiz manchmal als Wasserturm Europas bezeichnet?",
    "In ihren Bergen liegen wichtige Wasserspeicher und Flussquellen",
    "Sie besitzt einen einzigen Turm mit allem Wasser Europas",
    "In der Schweiz gibt es kein trockenes Wetter",
    "Alles Wasser der Welt stammt aus der Schweiz",
    "Denke an Schnee, Gletscher und Quellen.",
    "Mehrere grosse Flüsse führen Wasser aus den Alpen in Nachbarländer."
  ],
  "en": [
    "Why is Switzerland sometimes called Europe’s water tower?",
    "Its mountains hold important water stores and river sources",
    "One Swiss tower holds all Europe’s water",
    "Switzerland never has dry weather",
    "All water on Earth comes from Switzerland",
    "Think of snow, glaciers and springs.",
    "Several major rivers carry Alpine water to neighbouring countries."
  ],
  "fr": [
    "Pourquoi appelle-t-on parfois la Suisse le château d’eau de l’Europe ?",
    "Ses montagnes abritent des réserves d’eau et des sources importantes",
    "Une seule tour suisse contient toute l’eau d’Europe",
    "Il ne fait jamais sec en Suisse",
    "Toute l’eau du monde vient de Suisse",
    "Pense à la neige, aux glaciers et aux sources.",
    "Plusieurs grands fleuves transportent l’eau des Alpes vers les pays voisins."
  ],
  "it": [
    "Perché la Svizzera è talvolta chiamata serbatoio d’acqua d’Europa?",
    "Le montagne ospitano importanti riserve d’acqua e sorgenti",
    "Una sola torre svizzera contiene tutta l’acqua europea",
    "In Svizzera non c’è mai tempo secco",
    "Tutta l’acqua del mondo viene dalla Svizzera",
    "Pensa a neve, ghiacciai e sorgenti.",
    "Diversi grandi fiumi portano acqua alpina nei paesi vicini."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_6",
  "reason": "Disambiguate lake size by naming a cross-border lake.",
  "de": [
    "Welchen grossen See teilen sich die Schweiz und Frankreich bei Genf?",
    "Den Genfersee",
    "Den Zürichsee",
    "Den Vierwaldstättersee",
    "Den Neuenburgersee",
    "Die Stadt Genf liegt an seinem Ausfluss.",
    "Sein französischer Name ist Lac Léman."
  ],
  "en": [
    "Which large lake do Switzerland and France share near Geneva?",
    "Lake Geneva",
    "Lake Zurich",
    "Lake Lucerne",
    "Lake Neuchâtel",
    "Geneva stands at its outflow.",
    "Its French name is Lac Léman."
  ],
  "fr": [
    "Quel grand lac la Suisse et la France partagent-elles près de Genève ?",
    "Le Léman",
    "Le lac de Zurich",
    "Le lac des Quatre-Cantons",
    "Le lac de Neuchâtel",
    "Genève se trouve à sa sortie.",
    "Le Rhône le traverse."
  ],
  "it": [
    "Quale grande lago condividono Svizzera e Francia vicino a Ginevra?",
    "Il lago di Ginevra",
    "Il lago di Zurigo",
    "Il lago dei Quattro Cantoni",
    "Il lago di Neuchâtel",
    "Ginevra si trova al suo emissario.",
    "In francese si chiama Lac Léman."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_8",
  "reason": "Recognise renewable material with management caveat.",
  "de": [
    "Welcher Rohstoff kann bei nachhaltiger Nutzung nachwachsen?",
    "Holz",
    "Erdöl",
    "Kupfererz",
    "Kohle",
    "Vergleiche Pflanzen mit Lagerstätten im Boden.",
    "Es darf nicht mehr genutzt werden, als auf Dauer nachwächst."
  ],
  "en": [
    "Which raw material can regrow when used sustainably?",
    "Wood",
    "Oil",
    "Copper ore",
    "Coal",
    "Compare plants with underground deposits.",
    "Use must not exceed long-term regrowth."
  ],
  "fr": [
    "Quelle matière première peut repousser si elle est utilisée durablement ?",
    "Le bois",
    "Le pétrole",
    "Le minerai de cuivre",
    "Le charbon",
    "Compare les plantes aux gisements du sous-sol.",
    "Il ne faut pas consommer plus que ce qui repousse à long terme."
  ],
  "it": [
    "Quale materia prima può ricrescere con un uso sostenibile?",
    "Legno",
    "Petrolio",
    "Minerale di rame",
    "Carbone",
    "Confronta piante e giacimenti nel sottosuolo.",
    "Non si deve usare più di quanto ricresce a lungo termine."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_16",
  "reason": "Replace off-topic fair trade with water-saving action.",
  "de": [
    "Wie sparst du beim Zähneputzen Wasser?",
    "Den Hahn während des Putzens schliessen",
    "Den Hahn die ganze Zeit voll öffnen",
    "Zusätzlich die Dusche laufen lassen",
    "Den Hahn nach dem Putzen offen lassen",
    "Wasser soll nur fliessen, wenn du es brauchst.",
    "Zum Bürsten muss nicht ständig frisches Wasser nachlaufen."
  ],
  "en": [
    "How can you save water while brushing your teeth?",
    "Turn the tap off while brushing",
    "Keep the tap fully open throughout",
    "Run the shower as well",
    "Leave the tap on afterwards",
    "Water should flow only when needed.",
    "Brushing does not require constant running water."
  ],
  "fr": [
    "Comment économiser l’eau en se brossant les dents ?",
    "Fermer le robinet pendant le brossage",
    "Le laisser ouvert à fond",
    "Faire couler aussi la douche",
    "Laisser le robinet ouvert après",
    "L’eau doit couler seulement quand elle est nécessaire.",
    "Le brossage ne demande pas un écoulement constant."
  ],
  "it": [
    "Come risparmi acqua lavandoti i denti?",
    "Chiudendo il rubinetto mentre spazzoli",
    "Lasciandolo sempre tutto aperto",
    "Facendo scorrere anche la doccia",
    "Lasciandolo aperto dopo",
    "L’acqua deve scorrere solo quando serve.",
    "Spazzolare non richiede acqua corrente continua."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_22",
  "reason": "Replace salinity thresholds with basic comparative distinction.",
  "de": [
    "Wie unterscheidet sich Meerwasser meist vom Wasser eines Schweizer Süsswassersees?",
    "Es enthält deutlich mehr gelöstes Salz",
    "Es enthält grundsätzlich kein Wasser",
    "Es ist immer gefroren",
    "Es ist automatisch sauberes Trinkwasser",
    "Der Begriff Süsswasser bedeutet nicht Zuckerwasser.",
    "Vergleiche den Salzgehalt."
  ],
  "en": [
    "How does seawater usually differ from water in a Swiss freshwater lake?",
    "It contains much more dissolved salt",
    "It contains no water at all",
    "It is always frozen",
    "It is automatically safe drinking water",
    "Freshwater does not mean sugary water.",
    "Compare the salt content."
  ],
  "fr": [
    "En quoi l’eau de mer diffère-t-elle généralement de celle d’un lac d’eau douce suisse ?",
    "Elle contient beaucoup plus de sel dissous",
    "Elle ne contient aucune eau",
    "Elle est toujours gelée",
    "Elle est automatiquement potable",
    "Eau douce ne signifie pas eau sucrée.",
    "Compare la teneur en sel."
  ],
  "it": [
    "Come differisce di solito l’acqua marina da quella di un lago dolce svizzero?",
    "Contiene molto più sale disciolto",
    "Non contiene affatto acqua",
    "È sempre ghiacciata",
    "È automaticamente potabile",
    "Acqua dolce non significa acqua zuccherata.",
    "Confronta il contenuto di sale."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_28",
  "reason": "Recognise solar resource application.",
  "de": [
    "Welche Energiequelle nutzt eine Solarzelle?",
    "Sonnenlicht",
    "Benzin",
    "Kohle",
    "Erdgas",
    "Der Name weist auf die Sonne hin.",
    "Licht wird in elektrische Energie umgewandelt."
  ],
  "en": [
    "Which energy source does a solar cell use?",
    "Sunlight",
    "Petrol",
    "Coal",
    "Natural gas",
    "Its name points to the Sun.",
    "Light is converted into electrical energy."
  ],
  "fr": [
    "Quelle source d’énergie utilise une cellule solaire ?",
    "La lumière solaire",
    "L’essence",
    "Le charbon",
    "Le gaz naturel",
    "Son nom renvoie au Soleil.",
    "La lumière est transformée en énergie électrique."
  ],
  "it": [
    "Quale fonte di energia usa una cella solare?",
    "La luce del sole",
    "La benzina",
    "Il carbone",
    "Il gas naturale",
    "Il nome richiama il Sole.",
    "La luce viene trasformata in energia elettrica."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_36",
  "reason": "Replace hydropower plant comparison with reservoir purpose.",
  "de": [
    "Wozu dient ein Stausee bei einem Speicherkraftwerk?",
    "Wasser für eine spätere Nutzung zurückhalten",
    "Wasser ausschliesslich zur Reinigung durch die Staumauer drücken",
    "Jedes Zufliessen von Wasser dauerhaft unterbinden",
    "Das gesamte Wasser sofort ohne Nutzung abfliessen lassen",
    "Eine Staumauer hält Wasser zurück.",
    "Der Zeitpunkt der Nutzung kann dadurch gewählt werden."
  ],
  "en": [
    "What is a reservoir used for at a storage hydropower plant?",
    "Holding water for later use",
    "Push water through the dam solely to clean it",
    "Permanently stop all water flowing in",
    "Let all water flow out immediately without using it",
    "A dam holds water back.",
    "This allows the time of use to be chosen."
  ],
  "fr": [
    "À quoi sert un réservoir dans une centrale hydroélectrique à accumulation ?",
    "À retenir l’eau pour l’utiliser plus tard",
    "Faire passer l’eau dans le barrage uniquement pour la nettoyer",
    "Empêcher définitivement toute arrivée d’eau",
    "Laisser toute l’eau repartir aussitôt sans utilisation",
    "Un barrage retient l’eau.",
    "On peut ainsi choisir le moment de l’utilisation."
  ],
  "it": [
    "A che serve un bacino in una centrale idroelettrica ad accumulazione?",
    "A trattenere acqua per usarla più tardi",
    "Far passare acqua nella diga solo per pulirla",
    "Impedire definitivamente ogni afflusso",
    "Lasciare uscire subito tutta l’acqua senza usarla",
    "Una diga trattiene l’acqua.",
    "Si può così scegliere quando utilizzarla."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_40",
  "reason": "Apply circular use without claiming perfect perpetual recycling.",
  "de": [
    "Welche Handlung hält einen Gegenstand länger in Gebrauch?",
    "Einen defekten Reissverschluss reparieren",
    "Eine fast neue Jacke wegwerfen",
    "Ein Fahrrad wegen Staub entsorgen",
    "Für jede Nutzung einen neuen Rucksack kaufen",
    "Denke an die Lebensdauer eines Produkts.",
    "Oft ist nur ein kleiner Teil kaputt."
  ],
  "en": [
    "Which action keeps an object in use longer?",
    "Repairing a broken zip",
    "Throwing away an almost new jacket",
    "Discarding a bicycle because it is dusty",
    "Buying a new backpack for every use",
    "Think about a product’s lifespan.",
    "Often only one small part is broken."
  ],
  "fr": [
    "Quelle action prolonge l’utilisation d’un objet ?",
    "Réparer une fermeture éclair cassée",
    "Jeter une veste presque neuve",
    "Jeter un vélo parce qu’il est poussiéreux",
    "Acheter un sac neuf à chaque utilisation",
    "Pense à la durée de vie d’un produit.",
    "Souvent, seule une petite pièce est cassée."
  ],
  "it": [
    "Quale azione prolunga l’uso di un oggetto?",
    "Riparare una cerniera rotta",
    "Buttare una giacca quasi nuova",
    "Buttare una bici perché è polverosa",
    "Comprare uno zaino nuovo a ogni uso",
    "Pensa alla durata di un prodotto.",
    "Spesso è rotta solo una piccola parte."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_42",
  "reason": "Replace broad climate-crisis claim with concrete water scarcity consequence.",
  "de": [
    "Was kann nach vielen Wochen ohne ausreichenden Regen passieren?",
    "Bäche führen weniger Wasser und Böden trocknen aus",
    "Alle Seen steigen automatisch an",
    "Jeder Boden wird nasser",
    "Es gibt garantiert überall Hochwasser",
    "Vergleiche Zufuhr und Verbrauch von Wasser.",
    "Verdunstung geht auch ohne neuen Regen weiter."
  ],
  "en": [
    "What can happen after many weeks without enough rain?",
    "Streams carry less water and soil dries out",
    "All lakes automatically rise",
    "Every soil gets wetter",
    "Flooding is guaranteed everywhere",
    "Compare water supply and use.",
    "Evaporation continues without new rain."
  ],
  "fr": [
    "Que peut-il arriver après des semaines sans assez de pluie ?",
    "Les cours d’eau baissent et les sols s’assèchent",
    "Tous les lacs montent automatiquement",
    "Tous les sols deviennent plus humides",
    "Des inondations surviennent forcément partout",
    "Compare les apports et les pertes d’eau.",
    "L’évaporation continue même sans pluie."
  ],
  "it": [
    "Che cosa può accadere dopo settimane senza pioggia sufficiente?",
    "I corsi d’acqua calano e i terreni si seccano",
    "Tutti i laghi salgono automaticamente",
    "Tutti i terreni diventano più umidi",
    "Si verificano sicuramente alluvioni ovunque",
    "Confronta apporti e perdite d’acqua.",
    "L’evaporazione continua anche senza pioggia."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_44",
  "reason": "Simplify pumped storage while preserving energy-storage distinction.",
  "de": [
    "Warum pumpt ein Pumpspeicherwerk Wasser in einen höher gelegenen See?",
    "Um Energie für später zu speichern",
    "Um beim Hochpumpen mehr Strom zu erzeugen, als gebraucht wird",
    "Um das Wasser allein durch die Höhe zu Trinkwasser zu machen",
    "Um Strom ohne Wasserbewegung in der Staumauer zu lagern",
    "Zum Hochpumpen wird Strom gebraucht.",
    "Beim späteren Herabfliessen kann ein Teil der Energie zurückgewonnen werden."
  ],
  "en": [
    "Why does a pumped-storage plant pump water to a higher lake?",
    "To store energy for later",
    "To generate more electricity while pumping uphill than is used",
    "To turn water into drinking water through height alone",
    "To store electricity inside the dam without water movement",
    "Pumping uphill requires electricity.",
    "Some energy can be recovered when the water flows down later."
  ],
  "fr": [
    "Pourquoi une centrale de pompage-turbinage remonte-t-elle l’eau ?",
    "Pour stocker de l’énergie pour plus tard",
    "Pour produire en pompant plus de courant que l’on en utilise",
    "Pour rendre l’eau potable seulement grâce à l’altitude",
    "Pour stocker le courant dans le barrage sans mouvement d’eau",
    "Le pompage consomme de l’électricité.",
    "Une partie de l’énergie est récupérée quand l’eau redescend."
  ],
  "it": [
    "Perché una centrale di pompaggio porta acqua a un lago più alto?",
    "Per accumulare energia per dopo",
    "Per produrre pompando più corrente di quanta se ne usi",
    "Per rendere l’acqua potabile solo grazie all’altitudine",
    "Per conservare corrente nella diga senza movimento d’acqua",
    "Pompare richiede elettricità.",
    "Parte dell’energia si recupera quando l’acqua scende."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_46",
  "reason": "Apply resource efficiency rather than abstract maximisation definition.",
  "de": [
    "Zwei Lampen leuchten gleich hell. Welche nutzt Strom sparsamer?",
    "Die Lampe mit geringerem Stromverbrauch",
    "Die Lampe mit höherem Stromverbrauch",
    "Immer die schwerere Lampe",
    "Immer die Lampe mit rotem Gehäuse",
    "Vergleiche gleiche Leistung für den Alltag.",
    "Entscheidend ist, wie viel Energie dafür gebraucht wird."
  ],
  "en": [
    "Two lamps shine equally brightly. Which uses electricity more efficiently?",
    "The one that uses less electricity",
    "The one that uses more electricity",
    "Always the heavier lamp",
    "Always the lamp with a red case",
    "Compare the same useful result.",
    "What matters is the energy needed for it."
  ],
  "fr": [
    "Deux lampes éclairent autant. Laquelle utilise l’électricité plus efficacement ?",
    "Celle qui consomme moins",
    "Celle qui consomme plus",
    "Toujours la plus lourde",
    "Toujours celle au boîtier rouge",
    "Compare le même résultat utile.",
    "Ce qui compte est l’énergie nécessaire."
  ],
  "it": [
    "Due lampade illuminano allo stesso modo. Quale usa l’elettricità più efficientemente?",
    "Quella che consuma meno",
    "Quella che consuma di più",
    "Sempre quella più pesante",
    "Sempre quella con involucro rosso",
    "Confronta lo stesso risultato utile.",
    "Conta l’energia necessaria."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_48",
  "reason": "Replace off-topic languages phrase with drinking-water safety.",
  "de": [
    "An einem Brunnen steht «Kein Trinkwasser». Was tust du?",
    "Nicht davon trinken",
    "Nur trinken, wenn das Wasser klar aussieht",
    "Die Warnung entfernen",
    "Anderen sagen, das Wasser sei sicher trinkbar",
    "Klares Aussehen beweist keine Trinkwasserqualität.",
    "Beachte die Information der zuständigen Stelle."
  ],
  "en": [
    "A fountain says ‘Not drinking water’. What do you do?",
    "Do not drink from it",
    "Drink if it looks clear",
    "Remove the warning",
    "Tell others it is safe to drink",
    "Clear appearance does not prove drinking-water quality.",
    "Follow the responsible authority’s information."
  ],
  "fr": [
    "Une fontaine indique « Eau non potable ». Que fais-tu ?",
    "Ne pas en boire",
    "Boire si elle paraît claire",
    "Enlever l’avertissement",
    "Dire aux autres qu’elle est potable",
    "La transparence ne prouve pas la potabilité.",
    "Respecte l’information du service responsable."
  ],
  "it": [
    "Una fontana indica «Acqua non potabile». Che fai?",
    "Non la bevo",
    "La bevo se sembra limpida",
    "Tolgo l’avviso",
    "Dico agli altri che è potabile",
    "La limpidezza non dimostra la potabilità.",
    "Rispetta l’informazione dell’ente responsabile."
  ]
},
{
  "key": "4/science/ressourcen-wasser-4/rw4_50",
  "reason": "Replace water concession law with shared resource stewardship.",
  "de": [
    "Warum darf nicht jeder beliebig viel Wasser aus einem Bach ableiten?",
    "Andere Menschen und Lebewesen brauchen das Wasser ebenfalls",
    "Bachwasser gehört grundsätzlich dem lautesten Menschen",
    "Fische brauchen grundsätzlich kein Wasser",
    "Jede Entnahme erzeugt automatisch neues Wasser",
    "Wasserentnahmen wirken sich flussabwärts aus.",
    "Gemeinsame Regeln schützen verschiedene Bedürfnisse."
  ],
  "en": [
    "Why can people not divert unlimited water from a stream?",
    "Other people and living things need it too",
    "Stream water belongs to whoever shouts loudest",
    "Fish never need water",
    "Every withdrawal automatically creates new water",
    "Taking water affects places downstream.",
    "Shared rules protect different needs."
  ],
  "fr": [
    "Pourquoi ne peut-on pas détourner une quantité illimitée d’eau d’un ruisseau ?",
    "D’autres personnes et êtres vivants en ont besoin",
    "L’eau appartient à qui crie le plus fort",
    "Les poissons n’ont jamais besoin d’eau",
    "Chaque prélèvement crée automatiquement de l’eau",
    "Les prélèvements ont des effets en aval.",
    "Des règles communes protègent différents besoins."
  ],
  "it": [
    "Perché non si può deviare acqua illimitata da un ruscello?",
    "Anche altre persone ed esseri viventi ne hanno bisogno",
    "L’acqua appartiene a chi grida più forte",
    "I pesci non hanno mai bisogno d’acqua",
    "Ogni prelievo crea automaticamente acqua nuova",
    "I prelievi hanno effetti a valle.",
    "Regole comuni proteggono bisogni diversi."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_8",
  "reason": "Recognise forced displacement without technical push-factor term.",
  "de": [
    "Welche Situation kann Menschen zwingen, ihre Heimat zu verlassen?",
    "Ein Krieg bedroht ihr Leben",
    "Eine geplante Ferienreise beginnt",
    "Sie möchten einen Tagesausflug machen",
    "Sie besuchen freiwillig ein Konzert",
    "Unterscheide Gefahr von einer frei gewählten Freizeitaktivität.",
    "Manche Menschen müssen einen sicheren Ort suchen."
  ],
  "en": [
    "Which situation can force people to leave their home?",
    "War threatens their lives",
    "A planned holiday begins",
    "They want a day trip",
    "They choose to attend a concert",
    "Distinguish danger from freely chosen leisure.",
    "Some people must seek a safe place."
  ],
  "fr": [
    "Quelle situation peut obliger des personnes à quitter leur foyer ?",
    "Une guerre menace leur vie",
    "Des vacances prévues commencent",
    "Elles souhaitent une excursion",
    "Elles choisissent un concert",
    "Distingue un danger d’un loisir choisi.",
    "Certaines personnes doivent chercher un lieu sûr."
  ],
  "it": [
    "Quale situazione può costringere persone a lasciare casa?",
    "Una guerra minaccia la loro vita",
    "Inizia una vacanza programmata",
    "Desiderano una gita",
    "Scelgono di andare a un concerto",
    "Distingui un pericolo dal tempo libero scelto.",
    "Alcune persone devono cercare un luogo sicuro."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_12",
  "reason": "Replace vague diaspora-location answer with migration direction.",
  "de": [
    "Eine Schweizer Familie zieht dauerhaft nach Kanada. Wie nennt man das aus Sicht der Schweiz?",
    "Auswanderung",
    "Einwanderung in die Schweiz",
    "Ein Tagesausflug",
    "Eine Reise innerhalb derselben Gemeinde",
    "Achte auf den Ausgangsort.",
    "Die Familie verlegt ihren Wohnsitz in ein anderes Land."
  ],
  "en": [
    "A Swiss family moves permanently to Canada. What is this from Switzerland’s perspective?",
    "Emigration",
    "Immigration into Switzerland",
    "A day trip",
    "Travel within the same municipality",
    "Notice the starting country.",
    "The family moves its residence to another country."
  ],
  "fr": [
    "Une famille suisse s’installe durablement au Canada. Comment appelle-t-on cela du point de vue suisse ?",
    "L’émigration",
    "L’immigration en Suisse",
    "Une excursion d’un jour",
    "Un déplacement dans la même commune",
    "Observe le pays de départ.",
    "La famille change de pays de résidence."
  ],
  "it": [
    "Una famiglia svizzera si trasferisce stabilmente in Canada. Come si chiama dal punto di vista svizzero?",
    "Emigrazione",
    "Immigrazione in Svizzera",
    "Una gita di un giorno",
    "Uno spostamento nello stesso comune",
    "Osserva il paese di partenza.",
    "La famiglia cambia paese di residenza."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_16",
  "reason": "Apply clarification rather than repeated generic conflict phrase.",
  "de": [
    "Du verstehst eine Aussage eines neuen Mitschülers nicht. Was hilft?",
    "Freundlich nachfragen, was er meint",
    "Sofort eine böse Absicht unterstellen",
    "Seine Sprache nachäffen",
    "Ohne Nachfrage ein Gerücht verbreiten",
    "Ein Missverständnis ist nicht automatisch ein Streit.",
    "Fragen helfen mehr als Vermutungen."
  ],
  "en": [
    "You do not understand a new classmate’s statement. What helps?",
    "Ask kindly what they mean",
    "Immediately assume bad intentions",
    "Mock their language",
    "Spread a rumour without asking",
    "A misunderstanding is not automatically a conflict.",
    "Questions help more than guesses."
  ],
  "fr": [
    "Tu ne comprends pas une phrase d’un nouveau camarade. Que faire ?",
    "Demander gentiment ce qu’il veut dire",
    "Supposer tout de suite une mauvaise intention",
    "Imiter sa langue pour se moquer",
    "Répandre une rumeur sans demander",
    "Un malentendu n’est pas forcément un conflit.",
    "Les questions aident plus que les suppositions."
  ],
  "it": [
    "Non capisci una frase di un nuovo compagno. Che cosa aiuta?",
    "Chiedere gentilmente che cosa intende",
    "Supporre subito cattive intenzioni",
    "Prendere in giro la sua lingua",
    "Diffondere una voce senza chiedere",
    "Un malinteso non è per forza un conflitto.",
    "Le domande aiutano più delle supposizioni."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_22",
  "reason": "Replace confused cultural-property rights wording with freedom of belief.",
  "de": [
    "Was bedeutet Religionsfreiheit?",
    "Eine Religion wählen, wechseln oder keine haben dürfen",
    "Alle müssen dieselbe Religion haben",
    "Nur Erwachsene dürfen eigene Überzeugungen haben",
    "Niemand darf friedlich über Glauben sprechen",
    "Es geht um eine geschützte persönliche Entscheidung.",
    "Auch ohne Religion zu leben gehört dazu."
  ],
  "en": [
    "What does freedom of religion mean?",
    "Being free to choose, change or have no religion",
    "Everyone must have the same religion",
    "Only adults may have their own beliefs",
    "Nobody may speak peacefully about beliefs",
    "It protects a personal choice.",
    "Living without a religion is included."
  ],
  "fr": [
    "Que signifie la liberté de religion ?",
    "Pouvoir choisir, changer de religion ou ne pas en avoir",
    "Tous doivent avoir la même religion",
    "Seuls les adultes peuvent avoir des convictions",
    "Personne ne peut parler paisiblement de croyances",
    "Elle protège un choix personnel.",
    "Vivre sans religion en fait aussi partie."
  ],
  "it": [
    "Che cosa significa libertà religiosa?",
    "Poter scegliere, cambiare religione o non averne",
    "Tutti devono avere la stessa religione",
    "Solo gli adulti possono avere convinzioni proprie",
    "Nessuno può parlare pacificamente di fede",
    "Protegge una scelta personale.",
    "Comprende anche vivere senza religione."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_24",
  "reason": "Apply intercultural learning through respectful curiosity.",
  "de": [
    "Du lernst ein unbekanntes Fest kennen. Wie erfährst du respektvoll mehr?",
    "Interessiert fragen und verschiedene Erfahrungen anhören",
    "Sofort behaupten, alle feierten genau gleich",
    "Das Fest ohne Informationen abwerten",
    "Eine Person zwingen, für alle Menschen zu sprechen",
    "Nicht jede Person hat dieselben Erfahrungen.",
    "Zuhören hilft, vorschnelle Urteile zu vermeiden."
  ],
  "en": [
    "You learn about an unfamiliar festival. How can you learn more respectfully?",
    "Ask with interest and hear different experiences",
    "Immediately claim everyone celebrates identically",
    "Dismiss it without information",
    "Force one person to speak for everyone",
    "People do not all have the same experiences.",
    "Listening helps avoid quick judgments."
  ],
  "fr": [
    "Tu découvres une fête inconnue. Comment en apprendre plus avec respect ?",
    "Poser des questions et écouter diverses expériences",
    "Dire aussitôt que tous fêtent pareil",
    "La dénigrer sans information",
    "Forcer une personne à parler pour tout le monde",
    "Les expériences ne sont pas toutes identiques.",
    "Écouter évite les jugements hâtifs."
  ],
  "it": [
    "Scopri una festa sconosciuta. Come impari di più con rispetto?",
    "Fare domande e ascoltare esperienze diverse",
    "Dire subito che tutti festeggiano uguale",
    "Svalutarla senza informazioni",
    "Costringere una persona a parlare per tutti",
    "Le esperienze non sono tutte uguali.",
    "Ascoltare evita giudizi affrettati."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_26",
  "reason": "Recognise racial discrimination through an explicit unfair exclusion scenario.",
  "de": [
    "Ein Kind darf wegen seiner Hautfarbe nicht mitspielen. Was ist das?",
    "Rassistische Ausgrenzung",
    "Eine faire Spielregel",
    "Eine hilfreiche Sicherheitsmassnahme",
    "Ein Beweis für seine Fähigkeiten",
    "Die Hautfarbe sagt nichts darüber aus, wie jemand spielt.",
    "Ein Mensch wird wegen eines persönlichen Merkmals ausgeschlossen."
  ],
  "en": [
    "A child is excluded from playing because of skin colour. What is this?",
    "Racist exclusion",
    "A fair game rule",
    "A helpful safety measure",
    "Proof of the child’s abilities",
    "Skin colour says nothing about how someone plays.",
    "A person is excluded because of a personal characteristic."
  ],
  "fr": [
    "Un enfant ne peut pas jouer à cause de sa couleur de peau. Qu’est-ce que c’est ?",
    "Une exclusion raciste",
    "Une règle de jeu juste",
    "Une mesure de sécurité utile",
    "Une preuve de ses capacités",
    "La couleur de peau ne dit rien sur sa façon de jouer.",
    "Une personne est exclue pour une caractéristique personnelle."
  ],
  "it": [
    "Un bambino non può giocare per il colore della pelle. Che cos’è?",
    "Un’esclusione razzista",
    "Una regola di gioco equa",
    "Una misura di sicurezza utile",
    "Una prova delle sue capacità",
    "Il colore della pelle non indica come gioca.",
    "Una persona viene esclusa per una caratteristica personale."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_34",
  "reason": "Recognise Swiss emigration without overgeneralising one historical cause.",
  "de": [
    "Warum wanderten im 19. Jahrhundert manche Schweizer nach Amerika aus?",
    "Sie hofften auf Arbeit und bessere Lebensbedingungen",
    "Alle wurden zu einer Ferienreise eingeladen",
    "Die Schweiz lag damals in Amerika",
    "Reisen waren für alle kostenlos und ungefährlich",
    "Auch in der Schweiz gab es Armut.",
    "Menschen suchten neue Möglichkeiten für ihren Lebensunterhalt."
  ],
  "en": [
    "Why did some Swiss people emigrate to the Americas in the 19th century?",
    "They hoped for work and better living conditions",
    "Everyone was invited on holiday",
    "Switzerland was then in America",
    "Travel was free and safe for everyone",
    "Switzerland also experienced poverty.",
    "People sought new ways to earn a living."
  ],
  "fr": [
    "Pourquoi des Suisses ont-ils émigré vers les Amériques au XIXe siècle ?",
    "Ils espéraient du travail et de meilleures conditions de vie",
    "Tous étaient invités en vacances",
    "La Suisse était alors en Amérique",
    "Le voyage était gratuit et sûr pour tous",
    "La Suisse connaissait aussi la pauvreté.",
    "Les gens cherchaient de nouveaux moyens de vivre."
  ],
  "it": [
    "Perché alcuni svizzeri emigrarono nelle Americhe nell’Ottocento?",
    "Speravano in lavoro e migliori condizioni di vita",
    "Tutti erano invitati in vacanza",
    "La Svizzera si trovava allora in America",
    "Il viaggio era gratuito e sicuro per tutti",
    "Anche in Svizzera esisteva povertà.",
    "Le persone cercavano nuovi mezzi per vivere."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_36",
  "reason": "Replace three technical legal labels in one input with accessible migration definition.",
  "de": [
    "Was bedeutet Migration im Zusammenhang mit Menschen?",
    "Den Wohnort für längere Zeit verlegen",
    "Jeden Morgen die Zähne putzen",
    "Einen Ball über den Pausenplatz werfen",
    "Einmal kurz das Fenster öffnen",
    "Es geht um einen Wechsel des Lebensmittelpunkts.",
    "Nicht jede kurze Bewegung ist ein Umzug."
  ],
  "en": [
    "What does migration mean in relation to people?",
    "Moving one’s place of residence for a longer period",
    "Brushing teeth every morning",
    "Throwing a ball across a playground",
    "Briefly opening a window",
    "It concerns a change in where someone lives.",
    "Not every short movement is a move of home."
  ],
  "fr": [
    "Que signifie la migration des personnes ?",
    "Changer de lieu de résidence pour une durée prolongée",
    "Se brosser les dents chaque matin",
    "Lancer un ballon dans la cour",
    "Ouvrir brièvement une fenêtre",
    "Il s’agit de changer de lieu de vie.",
    "Un court mouvement n’est pas forcément un déménagement."
  ],
  "it": [
    "Che cosa significa migrazione delle persone?",
    "Cambiare luogo di residenza per un periodo prolungato",
    "Lavarsi i denti ogni mattina",
    "Lanciare una palla nel cortile",
    "Aprire brevemente una finestra",
    "Riguarda un cambiamento del luogo di vita.",
    "Un breve movimento non è per forza un trasloco."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_40",
  "reason": "Replace structural discrimination definition with accessible unfair-rule example.",
  "de": [
    "Ein Verein erlaubt nur Kindern mit einer bestimmten Herkunft die Teilnahme. Was sollte geprüft werden?",
    "Ob die Regel Kinder unfair ausschliesst",
    "Ob die ausgeschlossenen Kinder automatisch weniger können",
    "Ob Herkunft den Spielspass sicher bestimmt",
    "Ob man die Regel ohne Nachdenken verschärfen soll",
    "Auch Regeln können Menschen benachteiligen.",
    "Herkunft allein sagt nichts über Fähigkeiten oder Interesse."
  ],
  "en": [
    "A club only allows children of one background to join. What should be examined?",
    "Whether the rule unfairly excludes children",
    "Whether excluded children automatically have less ability",
    "Whether background certainly determines enjoyment",
    "Whether to make the rule stricter without thinking",
    "Rules can disadvantage people too.",
    "Background alone says nothing about abilities or interest."
  ],
  "fr": [
    "Un club accepte seulement les enfants d’une certaine origine. Que faut-il examiner ?",
    "Si la règle exclut injustement des enfants",
    "Si les enfants exclus sont forcément moins capables",
    "Si l’origine détermine sûrement le plaisir de jouer",
    "S’il faut durcir la règle sans réfléchir",
    "Les règles peuvent aussi désavantager des personnes.",
    "L’origine seule ne dit rien sur les capacités ou l’intérêt."
  ],
  "it": [
    "Un club accetta solo bambini di una certa origine. Che cosa va esaminato?",
    "Se la regola esclude ingiustamente bambini",
    "Se gli esclusi sono automaticamente meno capaci",
    "Se l’origine determina sicuramente il divertimento",
    "Se irrigidire la regola senza pensare",
    "Anche le regole possono svantaggiare persone.",
    "L’origine da sola non indica capacità o interesse."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_42",
  "reason": "Replace cultural hybridity with multilingual everyday life without stereotypes.",
  "de": [
    "Ein Kind spricht zu Hause Italienisch und in der Schule Deutsch. Welche Aussage stimmt?",
    "Mehrere Sprachen können zu seinem Alltag gehören",
    "Es darf nur eine der Sprachen behalten",
    "Es kann deshalb keine Freundschaften schliessen",
    "Seine Sprachen bestimmen automatisch seine Interessen",
    "Menschen können mehrere Zugehörigkeiten haben.",
    "Eine Sprache schliesst eine andere nicht aus."
  ],
  "en": [
    "A child speaks Italian at home and German at school. Which statement is true?",
    "Several languages can be part of everyday life",
    "The child must keep only one language",
    "The child cannot form friendships",
    "The languages automatically determine the child’s interests",
    "People can have several connections.",
    "One language does not exclude another."
  ],
  "fr": [
    "Un enfant parle italien à la maison et allemand à l’école. Quelle phrase est vraie ?",
    "Plusieurs langues peuvent faire partie de son quotidien",
    "Il doit garder une seule langue",
    "Il ne peut pas avoir d’amis",
    "Ses langues déterminent automatiquement ses intérêts",
    "Une personne peut avoir plusieurs appartenances.",
    "Une langue n’exclut pas l’autre."
  ],
  "it": [
    "Un bambino parla italiano a casa e tedesco a scuola. Quale frase è vera?",
    "Più lingue possono far parte della sua vita quotidiana",
    "Deve conservare soltanto una lingua",
    "Non può avere amicizie",
    "Le lingue determinano automaticamente i suoi interessi",
    "Una persona può avere più appartenenze.",
    "Una lingua non esclude l’altra."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_44",
  "reason": "Replace transnationalism with maintaining relationships after moving.",
  "de": [
    "Eine Familie zieht in ein anderes Land. Wie kann sie Kontakt zu Verwandten am alten Wohnort halten?",
    "Durch Besuche, Briefe oder Anrufe",
    "Nur indem sie alle neuen Nachbarn meidet",
    "Gar nicht, weil Grenzen jede Nachricht verhindern",
    "Nur indem sie sofort zurückzieht",
    "Entfernung beendet Beziehungen nicht automatisch.",
    "Es gibt verschiedene Wege der Verständigung."
  ],
  "en": [
    "A family moves to another country. How can it stay in touch with relatives back home?",
    "Through visits, letters or calls",
    "Only by avoiding every new neighbour",
    "Not at all, because borders stop all messages",
    "Only by moving back immediately",
    "Distance does not automatically end relationships.",
    "There are different ways to communicate."
  ],
  "fr": [
    "Une famille s’installe dans un autre pays. Comment garder contact avec les proches restés sur place ?",
    "Par des visites, lettres ou appels",
    "Seulement en évitant tous les nouveaux voisins",
    "Impossible, les frontières bloquent tout message",
    "Seulement en revenant immédiatement",
    "La distance ne met pas forcément fin aux relations.",
    "Il existe plusieurs moyens de communiquer."
  ],
  "it": [
    "Una famiglia si trasferisce all’estero. Come resta in contatto con i parenti rimasti?",
    "Con visite, lettere o chiamate",
    "Solo evitando tutti i nuovi vicini",
    "Non può, i confini bloccano ogni messaggio",
    "Solo tornando subito indietro",
    "La distanza non interrompe automaticamente i rapporti.",
    "Esistono diversi modi per comunicare."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_46",
  "reason": "Replace nativism ideology definition with recognising stereotypes.",
  "de": [
    "Jemand sagt: «Alle Menschen aus diesem Land sind gleich.» Was stimmt dazu?",
    "Menschen desselben Landes können sehr verschieden sein",
    "Das Herkunftsland bestimmt jeden Charakter vollständig",
    "Man muss keine einzelne Person kennenlernen",
    "Die Aussage ist immer eine überprüfte Tatsache",
    "Denke an Unterschiede innerhalb deiner eigenen Klasse.",
    "Eine Gruppe besteht aus einzelnen Menschen."
  ],
  "en": [
    "Someone says, ‘Everyone from that country is the same.’ What is true?",
    "People from one country can be very different",
    "Country of origin fully determines every personality",
    "There is no need to know individuals",
    "The statement is always a verified fact",
    "Think of differences within your own class.",
    "A group consists of individuals."
  ],
  "fr": [
    "Quelqu’un dit : « Tous les gens de ce pays sont pareils. » Que peut-on répondre ?",
    "Les personnes d’un même pays peuvent être très différentes",
    "Le pays d’origine détermine tout le caractère",
    "Il est inutile de connaître les personnes",
    "Cette phrase est toujours un fait vérifié",
    "Pense aux différences dans ta propre classe.",
    "Un groupe est composé de personnes individuelles."
  ],
  "it": [
    "Qualcuno dice: «Tutti quelli di quel paese sono uguali». Che cosa è vero?",
    "Persone dello stesso paese possono essere molto diverse",
    "Il paese d’origine determina tutto il carattere",
    "Non serve conoscere le singole persone",
    "La frase è sempre un fatto verificato",
    "Pensa alle differenze nella tua classe.",
    "Un gruppo è composto da singole persone."
  ]
},
{
  "key": "4/science/migration-kulturen-4/mk4_48",
  "reason": "Replace inaccurate full-rights legal distinction with citizenship versus residence basics.",
  "de": [
    "Was zeigt ein Schweizer Pass grundsätzlich an?",
    "Die Person besitzt die Schweizer Staatsangehörigkeit",
    "Die Person wohnt zwingend immer in der Schweiz",
    "Die Person spricht garantiert alle Landessprachen",
    "Die Person ist automatisch volljährig",
    "Staatsangehörigkeit und Wohnort sind nicht dasselbe.",
    "Auch Kinder können einen Pass besitzen."
  ],
  "en": [
    "What does a Swiss passport basically show?",
    "The holder has Swiss citizenship",
    "The holder must always live in Switzerland",
    "The holder certainly speaks every national language",
    "The holder is automatically an adult",
    "Citizenship and residence are different.",
    "Children can also have passports."
  ],
  "fr": [
    "Que montre fondamentalement un passeport suisse ?",
    "La personne possède la nationalité suisse",
    "La personne habite forcément toujours en Suisse",
    "La personne parle forcément toutes les langues nationales",
    "La personne est automatiquement majeure",
    "Nationalité et domicile sont différents.",
    "Les enfants peuvent aussi avoir un passeport."
  ],
  "it": [
    "Che cosa indica fondamentalmente un passaporto svizzero?",
    "La persona ha la cittadinanza svizzera",
    "La persona vive necessariamente sempre in Svizzera",
    "La persona parla certamente tutte le lingue nazionali",
    "La persona è automaticamente maggiorenne",
    "Cittadinanza e domicilio sono diversi.",
    "Anche i bambini possono avere un passaporto."
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
