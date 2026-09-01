import type { Exercise, Topic } from "@/types/exercise";

type Enrichment = Record<number, Record<string, Record<string, Exercise[]>>>;

const pair = (id: string, label: string, emoji?: string) => ({ id, label, emoji });
const item = (id: string, label: string, emoji?: string) => ({ id, label, emoji });
const zone = (id: string, label: string) => ({ id, label });

const ENRICHMENTS: Enrichment = {
  4: {
    english: {
      "my-daily-routine-4": [
        {
          id: "eng4-rich-routine-match-1", type: "matching", difficulty: 1, answer: "all",
          question: "Match the daily routine phrases.",
          pairs: [pair("wake", "wake up", "⏰"), pair("aufstehen", "aufstehen", "🛏️"), pair("breakfast", "have breakfast", "🥣"), pair("fruehstueck", "frühstücken", "🍞"), pair("school", "go to school", "🎒"), pair("schule", "zur Schule gehen", "🏫"), pair("bed", "go to bed", "🌙"), pair("bett", "ins Bett gehen", "🛌")],
          hints: ["Start with the phrases you use every morning.", "Match each English phrase with the German meaning."],
        },
        {
          id: "eng4-rich-routine-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
          question: "Put the morning routine in a sensible order.",
          dragItems: [item("wake", "I wake up.", "⏰"), item("wash", "I wash my face.", "🚿"), item("eat", "I have breakfast.", "🥣"), item("school", "I go to school.", "🎒")],
          dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
          dropAnswers: { wake: "s1", wash: "s2", eat: "s3", school: "s4" },
          hints: ["Read the verbs first.", "The school day starts after getting ready."],
        },
      ],
      "my-home-4": [
        {
          id: "eng4-rich-home-memory-1", type: "memory", difficulty: 1, answer: "all",
          question: "Find the rooms and what happens there.",
          pairs: [pair("kitchen", "kitchen", "🍳"), pair("cook", "cook food", "🥘"), pair("bedroom", "bedroom", "🛏️"), pair("sleep", "sleep", "🌙"), pair("bathroom", "bathroom", "🚿"), pair("wash", "wash hands", "🧼"), pair("garden", "garden", "🌳"), pair("play", "play outside", "⚽")],
          hints: ["Think about places at home.", "Kitchen and cooking belong together."],
        },
      ],
      "sports-hobbies-4": [
        {
          id: "eng4-rich-hobbies-review-1", type: "self-review", difficulty: 2, answer: "review",
          question: "Write two English sentences about hobbies you like. Say where or when you do them.",
          reviewCriteria: ["Uses two understandable English sentences.", "Names at least one hobby.", "Says where or when the hobby happens."],
          hints: ["Start with: I like...", "Add a place or time, for example at home, outside or after school."],
        },
      ],
      "food-shopping-4": [
        {
          id: "eng4-rich-food-word-1", type: "word-search", difficulty: 2, answer: "all",
          question: "Find food words in English.",
          wordList: ["apple", "bread", "milk", "water", "cheese", "salad"], gridSize: 10,
          hints: ["Look for short food words first.", "All words are useful in a shop or at home."],
        },
      ],
      "travel-directions-4": [
        {
          id: "eng4-rich-directions-drag-1", type: "drag-drop", difficulty: 3, answer: "all",
          question: "Order the short dialogue for asking the way.",
          dragItems: [item("ask", "Excuse me, where is the station?", "💬"), item("answer", "Go straight on.", "➡️"), item("turn", "Turn left at the school.", "↩️"), item("thanks", "Thank you!", "🙏")],
          dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
          dropAnswers: { ask: "s1", answer: "s2", turn: "s3", thanks: "s4" },
          hints: ["A polite question comes first.", "Say thank you at the end."],
        },
        {
          id: "eng4-rich-directions-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Write two simple English sentences to tell a friend how to get from school to the bus stop.",
          reviewCriteria: ["Uses two clear English sentences.", "Uses at least one direction word like left, right or straight on.", "The route is understandable for a child."],
          hints: ["Keep the sentences short.", "Use words such as go, turn, left, right, near."],
        },
      ],
      "describing-people-4": [
        {
          id: "eng4-rich-people-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Match adjectives with friendly descriptions.",
          pairs: [pair("kind", "kind", "🤝"), pair("helps", "helps others", "💛"), pair("funny", "funny", "😄"), pair("laugh", "makes people laugh", "😂"), pair("tall", "tall", "📏"), pair("height", "has more height", "⬆️"), pair("shy", "shy", "🙂"), pair("quiet", "speaks quietly at first", "🤫")],
          hints: ["These words describe people respectfully.", "Kind means friendly and helpful."],
        },
      ],
    },
    french: {
      "journee-heure-4": [
        {
          id: "fr4-rich-journee-match-1", type: "matching", difficulty: 1, answer: "all",
          question: "Associe les moments de la journée.",
          pairs: [pair("matin", "le matin", "🌅"), pair("morgen", "am Morgen", "⏰"), pair("midi", "à midi", "☀️"), pair("mittag", "am Mittag", "🥪"), pair("soir", "le soir", "🌙"), pair("abend", "am Abend", "🏠"), pair("nuit", "la nuit", "⭐"), pair("nacht", "in der Nacht", "🛌")],
          hints: ["Commence par les mots que tu connais déjà.", "Matin bedeutet Morgen."],
        },
        {
          id: "fr4-rich-journee-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
          question: "Mets la routine du matin dans le bon ordre.",
          dragItems: [item("lever", "Je me lève.", "⏰"), item("laver", "Je me lave.", "🚿"), item("dejeuner", "Je prends le petit-déjeuner.", "🥐"), item("ecole", "Je vais à l'école.", "🎒")],
          dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
          dropAnswers: { lever: "s1", laver: "s2", dejeuner: "s3", ecole: "s4" },
          hints: ["Lis d'abord les verbes.", "L'école vient après la préparation."],
        },
      ],
      "maison-position-4": [
        {
          id: "fr4-rich-maison-memory-1", type: "memory", difficulty: 1, answer: "all",
          question: "Trouve les pièces de la maison.",
          pairs: [pair("cuisine", "la cuisine", "🍳"), pair("kochen", "on cuisine", "🥘"), pair("chambre", "la chambre", "🛏️"), pair("dormir", "on dort", "🌙"), pair("salle-bain", "la salle de bain", "🚿"), pair("laver", "on se lave", "🧼"), pair("jardin", "le jardin", "🌳"), pair("jouer", "on joue dehors", "⚽")],
          hints: ["Pense aux endroits à la maison.", "Cuisine passt zu kochen."],
        },
      ],
      "ecole-horaire-4": [
        {
          id: "fr4-rich-ecole-review-1", type: "self-review", difficulty: 2, answer: "review",
          question: "Écris deux phrases simples sur ton école ou ta classe.",
          reviewCriteria: ["Utilise deux phrases compréhensibles en français.", "Nomme au moins un objet ou un lieu d'école.", "Les phrases restent simples et claires."],
          hints: ["Tu peux commencer par: Dans ma classe...", "Utilise des mots comme livre, cahier, table ou école."],
        },
      ],
      "achats-prix-4": [
        {
          id: "fr4-rich-achats-word-1", type: "word-search", difficulty: 2, answer: "all",
          question: "Trouve des mots utiles au magasin.",
          wordList: ["pain", "lait", "eau", "pomme", "prix", "merci"], gridSize: 10,
          hints: ["Cherche d'abord les mots courts.", "Tous les mots peuvent servir au magasin."],
        },
      ],
      "ville-directions-4": [
        {
          id: "fr4-rich-ville-drag-1", type: "drag-drop", difficulty: 3, answer: "all",
          question: "Mets le petit dialogue dans le bon ordre.",
          dragItems: [item("demande", "Excusez-moi, où est la gare?", "💬"), item("reponse", "Allez tout droit.", "➡️"), item("tournez", "Tournez à gauche.", "↩️"), item("merci", "Merci beaucoup!", "🙏")],
          dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
          dropAnswers: { demande: "s1", reponse: "s2", tournez: "s3", merci: "s4" },
          hints: ["Une question polie vient au début.", "On remercie à la fin."],
        },
        {
          id: "fr4-rich-ville-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Écris deux phrases simples pour expliquer le chemin de l'école à l'arrêt de bus.",
          reviewCriteria: ["Utilise deux phrases simples en français.", "Utilise au moins un mot de direction comme gauche, droite ou tout droit.", "Le chemin est clair pour un enfant."],
          hints: ["Garde les phrases courtes.", "Utilise: allez, tournez, à gauche, à droite, près de."],
        },
      ],
      "loisirs-capacites-4": [
        {
          id: "fr4-rich-loisirs-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Associe les loisirs et les phrases avec «je peux».",
          pairs: [pair("nager", "nager", "🏊"), pair("piscine", "Je peux nager à la piscine.", "💧"), pair("dessiner", "dessiner", "✏️"), pair("image", "Je peux dessiner une image.", "🖼️"), pair("lire", "lire", "📖"), pair("livre", "Je peux lire un livre.", "📘"), pair("danser", "danser", "🎵"), pair("musique", "Je peux danser avec la musique.", "💃")],
          hints: ["Cherche le verbe dans la phrase.", "Je peux bedeutet ich kann."],
        },
      ],
    },
  },
  5: {
    english: {
      "present-continuous-5": [
        {
          id: "eng5-rich-continuous-drag-1", type: "drag-drop", difficulty: 1, answer: "all",
          question: "Build present continuous sentences.",
          dragItems: [item("i-am", "I am reading.", "📖"), item("she-is", "She is swimming.", "🏊"), item("we-are", "We are playing.", "⚽"), item("they-are", "They are talking.", "💬")],
          dropZones: [zone("i", "I"), zone("she", "She"), zone("we", "We"), zone("they", "They")],
          dropAnswers: { "i-am": "i", "she-is": "she", "we-are": "we", "they-are": "they" },
          hints: ["Look at am, is and are.", "Present continuous describes what is happening now."],
        },
      ],
      "future-plans-5": [
        {
          id: "eng5-rich-future-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Match future plans with time expressions.",
          pairs: [pair("tomorrow", "tomorrow", "📅"), pair("one-day", "one day later", "➡️"), pair("weekend", "at the weekend", "🎒"), pair("sat-sun", "Saturday or Sunday", "🗓️"), pair("summer", "in summer", "☀️"), pair("holidays", "during the holidays", "🏖️"), pair("tonight", "tonight", "🌙"), pair("evening", "this evening", "🏠")],
          hints: ["Future plans often use a time word.", "Tomorrow means the next day."],
        },
        {
          id: "eng5-rich-future-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Write three English sentences about a realistic weekend plan.",
          reviewCriteria: ["Uses three understandable English sentences.", "Uses future language such as going to or will.", "The plan is realistic and clear."],
          hints: ["Start with: I am going to...", "Add when, where or with whom."],
        },
      ],
      "past-experiences-5": [
        {
          id: "eng5-rich-past-memory-1", type: "memory", difficulty: 2, answer: "all",
          question: "Find present and past verb forms.",
          pairs: [pair("go", "go", "🚶"), pair("went", "went", "➡️"), pair("see", "see", "👀"), pair("saw", "saw", "🔎"), pair("eat", "eat", "🍽️"), pair("ate", "ate", "🥣"), pair("make", "make", "🛠️"), pair("made", "made", "✅")],
          hints: ["These are common irregular verbs.", "Go and went belong together."],
        },
        {
          id: "eng5-rich-past-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
          question: "Order the short story.",
          dragItems: [item("arrive", "We arrived at the lake.", "🏞️"), item("walk", "We walked along the water.", "🚶"), item("eat", "We ate our picnic.", "🥪"), item("home", "Then we went home.", "🏠")],
          dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
          dropAnswers: { arrive: "s1", walk: "s2", eat: "s3", home: "s4" },
          hints: ["Look for a natural order of events.", "Then often introduces a later step."],
        },
      ],
      "technology-5": [
        {
          id: "eng5-rich-tech-word-1", type: "word-search", difficulty: 1, answer: "all",
          question: "Find useful technology words.",
          wordList: ["screen", "mouse", "email", "search", "video", "login"], gridSize: 10,
          hints: ["Search for common computer words.", "All words are short and practical."],
        },
      ],
      "countries-cultures-5": [
        {
          id: "eng5-rich-culture-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Match countries with simple cultural clues.",
          pairs: [pair("uk", "United Kingdom", "🇬🇧"), pair("london", "London", "🏙️"), pair("usa", "United States", "🇺🇸"), pair("washington", "Washington, D.C.", "🏛️"), pair("australia", "Australia", "🇦🇺"), pair("canberra", "Canberra", "📍"), pair("ireland", "Ireland", "🇮🇪"), pair("dublin", "Dublin", "🍀")],
          hints: ["Match each country with its capital.", "London is the capital of the United Kingdom."],
        },
      ],
      "reading-comp-5": [
        {
          id: "eng5-rich-reading-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "After reading a short text, write one sentence about the main idea and one sentence about a detail.",
          reviewCriteria: ["Gives one clear main idea.", "Gives one detail that fits the text.", "Uses own words instead of copying everything."],
          hints: ["Main idea means what the text is mostly about.", "A detail is a smaller fact from the text."],
        },
      ],
    },
    french: {
      "bonjour-5": [
        {
          id: "fr5-rich-salutations-drag-1", type: "drag-drop", difficulty: 1, answer: "all",
          question: "Classe les salutations.",
          dragItems: [item("bonjour", "Bonjour!", "☀️"), item("salut", "Salut!", "👋"), item("bonsoir", "Bonsoir!", "🌙"), item("au-revoir", "Au revoir!", "🚪")],
          dropZones: [zone("arriver", "quand on arrive"), zone("partir", "quand on part")],
          dropAnswers: { bonjour: "arriver", salut: "arriver", bonsoir: "arriver", "au-revoir": "partir" },
          hints: ["Certaines salutations commencent une conversation.", "Au revoir passt zum Weggehen."],
        },
      ],
      "famille-5": [
        {
          id: "fr5-rich-famille-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Associe les membres de la famille.",
          pairs: [pair("mere", "la mère", "👩"), pair("mutter", "die Mutter", "💛"), pair("pere", "le père", "👨"), pair("vater", "der Vater", "💙"), pair("soeur", "la sœur", "👧"), pair("schwester", "die Schwester", "🎒"), pair("frere", "le frère", "👦"), pair("bruder", "der Bruder", "⚽")],
          hints: ["Commence avec mère et père.", "Sœur hat den Buchstaben œ."],
        },
        {
          id: "fr5-rich-famille-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Présente ta famille en trois phrases simples.",
          reviewCriteria: ["Utilise trois phrases compréhensibles en français.", "Nomme au moins deux membres de la famille.", "Utilise correctement mon, ma ou mes quand c'est possible."],
          hints: ["Tu peux commencer par: Dans ma famille...", "Garde les phrases simples et vraies pour toi."],
        },
      ],
      "ecole-5": [
        {
          id: "fr5-rich-ecole-memory-1", type: "memory", difficulty: 2, answer: "all",
          question: "Trouve les objets d'école et leur usage.",
          pairs: [pair("crayon", "le crayon", "✏️"), pair("ecrire", "écrire", "📝"), pair("gomme", "la gomme", "⬜"), pair("effacer", "effacer", "✨"), pair("regle", "la règle", "📏"), pair("ligne", "tracer une ligne", "➖"), pair("cahier", "le cahier", "📓"), pair("noter", "noter", "📌")],
          hints: ["Pense à ce que tu utilises en classe.", "Une gomme sert à effacer."],
        },
      ],
      "nourriture-5": [
        {
          id: "fr5-rich-nourriture-word-1", type: "word-search", difficulty: 1, answer: "all",
          question: "Trouve des mots de nourriture.",
          wordList: ["pain", "lait", "eau", "pomme", "salade", "fromage"], gridSize: 10,
          hints: ["Cherche d'abord les mots courts.", "Tous les mots peuvent être dans une liste de courses."],
        },
      ],
      "verbes-etre-avoir-5": [
        {
          id: "fr5-rich-verbes-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
          question: "Range les formes de être et avoir.",
          dragItems: [item("suis", "je suis", "🙋"), item("est", "il est", "👦"), item("ai", "j'ai", "🎒"), item("ont", "ils ont", "👥")],
          dropZones: [zone("etre", "être"), zone("avoir", "avoir")],
          dropAnswers: { suis: "etre", est: "etre", ai: "avoir", ont: "avoir" },
          hints: ["Être describes what someone is.", "Avoir often means to have."],
        },
        {
          id: "fr5-rich-verbes-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Écris deux phrases avec être et deux phrases avec avoir.",
          reviewCriteria: ["Écrit quatre phrases au total.", "Utilise être dans deux phrases.", "Utilise avoir dans deux phrases et garde le sens clair."],
          hints: ["Exemple: Je suis... / J'ai...", "Vérifie que le sujet et le verbe vont ensemble."],
        },
      ],
      "activites-loisirs-5": [
        {
          id: "fr5-rich-loisirs-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Associe l'activité et le lieu.",
          pairs: [pair("nager", "nager", "🏊"), pair("piscine", "à la piscine", "💧"), pair("lire", "lire", "📖"), pair("bibliotheque", "à la bibliothèque", "📚"), pair("jouer", "jouer au foot", "⚽"), pair("terrain", "sur le terrain", "🥅"), pair("dessiner", "dessiner", "✏️"), pair("atelier", "dans l'atelier", "🎨")],
          hints: ["Cherche le lieu qui convient à l'activité.", "Nager passt zur piscine."],
        },
      ],
    },
  },
  6: {
    english: {
      "passive-voice-6": [
        {
          id: "eng6-rich-everyday-drag-1", type: "drag-drop", difficulty: 1, answer: "all",
          question: "Match useful everyday English phrases with situations.",
          dragItems: [item("help", "Can you help me, please?", "🙋"), item("repeat", "Could you repeat that?", "🔁"), item("agree", "I agree with you.", "🤝"), item("sorry", "I'm sorry, I don't understand.", "💬")],
          dropZones: [zone("need-help", "asking for help"), zone("again", "asking to hear it again"), zone("same", "same opinion"), zone("unclear", "not clear yet")],
          dropAnswers: { help: "need-help", repeat: "again", agree: "same", sorry: "unclear" },
          hints: ["Think about classroom conversations.", "Repeat means say it again."],
        },
      ],
      "conditionals-6": [
        {
          id: "eng6-rich-reasons-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Match plans with reasons.",
          pairs: [pair("train", "I will take the train", "🚆"), pair("less-co2", "because it makes less CO2 than flying", "🌍"), pair("study", "I am going to study", "📚"), pair("test", "because we have a test tomorrow", "📝"), pair("save", "I will save money", "🪙"), pair("bike", "because I want a new bike", "🚲"), pair("call", "I will call my friend", "📱"), pair("birthday", "because it is her birthday", "🎂")],
          hints: ["Reasons often start with because.", "Match each plan with a reason that makes sense."],
        },
        {
          id: "eng6-rich-reasons-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Write four English sentences about a plan and explain your reasons.",
          reviewCriteria: ["Uses at least four understandable English sentences.", "Explains reasons with because or so.", "The plan and reasons fit together."],
          hints: ["Start with your plan, then add reasons.", "Use because to explain why."],
        },
      ],
      "reported-speech-6": [
        {
          id: "eng6-rich-conversation-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
          question: "Order the conversation.",
          dragItems: [item("hello", "Hi, how are you?", "👋"), item("fine", "I'm fine, thanks. And you?", "🙂"), item("invite", "Do you want to play after school?", "⚽"), item("yes", "Yes, good idea!", "✅")],
          dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
          dropAnswers: { hello: "s1", fine: "s2", invite: "s3", yes: "s4" },
          hints: ["Greetings come first.", "An answer follows a question."],
        },
      ],
      "reading-skills-6": [
        {
          id: "eng6-rich-reading-memory-1", type: "memory", difficulty: 2, answer: "all",
          question: "Find reading strategies and their purpose.",
          pairs: [pair("skim", "skim", "👀"), pair("overview", "get the main idea", "🧭"), pair("scan", "scan", "🔎"), pair("detail", "find a detail quickly", "📌"), pair("infer", "infer", "💭"), pair("between", "read between the lines", "📖"), pair("summarise", "summarise", "✍️"), pair("short", "say it briefly", "✅")],
          hints: ["Different strategies help with different questions.", "Scan is useful when you search for one detail."],
        },
      ],
      "vocabulary-6": [
        {
          id: "eng6-rich-vocab-word-1", type: "word-search", difficulty: 1, answer: "all",
          question: "Find useful school and media words.",
          wordList: ["source", "opinion", "reason", "reply", "search", "topic"], gridSize: 10,
          hints: ["These words help in reading and discussions.", "Search for the shorter words first."],
        },
      ],
      "environment-debate-6": [
        {
          id: "eng6-rich-debate-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Match debate phrases with their job.",
          pairs: [pair("opinion", "In my opinion...", "💬"), pair("claim", "state an opinion", "🗣️"), pair("reason", "One reason is...", "🧠"), pair("why", "give a reason", "✅"), pair("example", "For example...", "📌"), pair("show", "give an example", "🔎"), pair("other", "On the other hand...", "⚖️"), pair("balance", "show another view", "↔️")],
          hints: ["A good debate answer is structured.", "On the other hand shows another view."],
        },
        {
          id: "eng6-rich-debate-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Write a short opinion about using less plastic. Include one reason and one example.",
          reviewCriteria: ["States a clear opinion.", "Gives one reason.", "Gives one example that fits the reason."],
          hints: ["Use: In my opinion...", "Add: One reason is... For example..."],
        },
      ],
    },
    french: {
      "passe-compose-6": [
        {
          id: "fr6-rich-journee-drag-1", type: "drag-drop", difficulty: 1, answer: "all",
          question: "Associe les phrases utiles aux moments de la journée.",
          dragItems: [item("matin", "Je me lève.", "🌅"), item("midi", "Je mange à midi.", "🥪"), item("soir", "Je fais mes devoirs.", "📚"), item("nuit", "Je dors.", "🌙")],
          dropZones: [zone("morning", "le matin"), zone("noon", "à midi"), zone("evening", "le soir"), zone("night", "la nuit")],
          dropAnswers: { matin: "morning", midi: "noon", soir: "evening", nuit: "night" },
          hints: ["Lis les mots de temps.", "La nuit passt zu dormir."],
        },
      ],
      "imparfait-6": [
        {
          id: "fr6-rich-ecole-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Associe les phrases d'école et leur sens.",
          pairs: [pair("comprendre", "Je ne comprends pas.", "🤔"), pair("klar", "Ich verstehe nicht.", "💬"), pair("repeter", "Vous pouvez répéter?", "🔁"), pair("nochmal", "Können Sie es wiederholen?", "👂"), pair("fini", "J'ai fini.", "✅"), pair("fertig", "Ich bin fertig.", "📚"), pair("question", "J'ai une question.", "🙋"), pair("frage", "Ich habe eine Frage.", "❓")],
          hints: ["Ce sont des phrases utiles en classe.", "Répéter bedeutet wiederholen."],
        },
        {
          id: "fr6-rich-ecole-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Écris quatre phrases utiles pour parler en classe.",
          reviewCriteria: ["Écrit quatre phrases compréhensibles en français.", "Inclut au moins une question.", "Les phrases sont polies et utiles en classe."],
          hints: ["Tu peux utiliser: Je ne comprends pas / J'ai une question.", "Ajoute s'il vous plaît quand cela convient."],
        },
      ],
      "futur-simple-6": [
        {
          id: "fr6-rich-projets-match-1", type: "matching", difficulty: 2, answer: "all",
          question: "Associe les projets et les raisons.",
          pairs: [pair("sport", "Je vais faire du sport", "⚽"), pair("sante", "parce que c'est bon pour la santé", "💪"), pair("lire", "Je vais lire", "📖"), pair("histoire", "parce que j'aime les histoires", "✨"), pair("ami", "Je vais appeler mon ami", "📱"), pair("anniv", "parce que c'est son anniversaire", "🎂"), pair("train", "Je vais prendre le train", "🚆"), pair("ville", "pour aller en ville", "🏙️")],
          hints: ["Les raisons commencent souvent avec parce que ou pour.", "Le projet doit aller avec la raison."],
        },
      ],
      "ville-directions-6": [
        {
          id: "fr6-rich-ville-drag-1", type: "drag-drop", difficulty: 2, answer: "all",
          question: "Mets les indications dans le bon ordre.",
          dragItems: [item("depart", "Partez de l'école.", "🏫"), item("droite", "Tournez à droite.", "↪️"), item("pont", "Traversez le pont.", "🌉"), item("gare", "La gare est à gauche.", "🚉")],
          dropZones: [zone("s1", "1"), zone("s2", "2"), zone("s3", "3"), zone("s4", "4")],
          dropAnswers: { depart: "s1", droite: "s2", pont: "s3", gare: "s4" },
          hints: ["Commence au point de départ.", "La destination vient à la fin."],
        },
      ],
      "pronoms-cod-coi-6": [
        {
          id: "fr6-rich-phrases-memory-1", type: "memory", difficulty: 2, answer: "all",
          question: "Trouve les phrases utiles et leur fonction.",
          pairs: [pair("opinion", "À mon avis...", "💬"), pair("meinung", "donner une opinion", "🧠"), pair("accord", "Je suis d'accord.", "🤝"), pair("ja", "être du même avis", "✅"), pair("pasaccord", "Je ne suis pas d'accord.", "⚖️"), pair("anderes", "avoir un autre avis", "🔄"), pair("exemple", "Par exemple...", "📌"), pair("zeigen", "donner un exemple", "🔎")],
          hints: ["Ces phrases aident dans une discussion.", "Par exemple sert à donner un exemple."],
        },
      ],
      "france-pays-francophones-6": [
        {
          id: "fr6-rich-pays-word-1", type: "word-search", difficulty: 1, answer: "all",
          question: "Trouve des mots de pays francophones.",
          wordList: ["France", "Suisse", "Canada", "Maroc", "Paris", "Québec"], gridSize: 10,
          hints: ["Cherche les noms propres.", "Tous les mots ont un lien avec le français."],
        },
      ],
      "culture-francophone-6": [
        {
          id: "fr6-rich-culture-review-1", type: "self-review", difficulty: 3, answer: "review",
          question: "Présente un pays ou une région francophone en quatre phrases simples.",
          reviewCriteria: ["Nomme un pays ou une région francophone.", "Donne au moins deux informations correctes.", "Ajoute une phrase personnelle claire."],
          hints: ["Tu peux parler de la langue, d'une ville ou d'une fête.", "Garde les phrases simples mais complètes."],
        },
      ],
    },
  },
};

export function addLanguageRichEnrichment(grade: number, subject: string, topics: Topic[]): Topic[] {
  const byTopic = ENRICHMENTS[grade]?.[subject];
  if (!byTopic) return topics;
  return topics.map((topic) => {
    const additions = byTopic[topic.id] ?? [];
    if (!additions.length) return topic;
    const existingIds = new Set(topic.exercises.map((exercise) => exercise.id));
    return {
      ...topic,
      exercises: [
        ...topic.exercises,
        ...additions.filter((exercise) => !existingIds.has(exercise.id)),
      ],
    };
  });
}

export function getLanguageRichEnrichmentIds() {
  return Object.entries(ENRICHMENTS).flatMap(([grade, subjects]) =>
    Object.entries(subjects).flatMap(([subject, topics]) =>
      Object.entries(topics).flatMap(([topicId, exercises]) =>
        exercises.map((exercise) => ({
          grade: Number(grade),
          subject,
          topicId,
          exerciseId: exercise.id,
        })),
      ),
    ),
  );
}
