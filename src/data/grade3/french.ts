import { createFrenchPrimaryTopics, type FrenchPrimaryTopicSpec } from "../frenchPrimaryFactory";

const v = (fr: string, de: string, emoji?: string) => ({ fr, de, emoji });
const choice = (question: string, answer: string, b: string, c: string, d: string, hint: string) => ({
  question, answer, options: [answer, b, c, d] as [string, string, string, string], hint,
});
const cloze = (question: string, answer: string, hint: string, altAnswers?: string[]) => ({ question, answer, hint, altAnswers });
const write = (question: string, example: string) => ({
  question,
  example,
  criteria: [
    "J'ai suivi le modèle et répondu à toute la consigne.",
    "J'ai utilisé des mots français du thème.",
    "J'ai vérifié la majuscule et le point.",
  ] as [string, string, string],
});

const GRADE3_CORE_CODES = [
  "FS1F.1.A.1.a", "FS1F.1.B.1.a", "FS1F.2.A.1.a", "FS1F.2.B.1.a",
  "FS1F.3.A.1.a", "FS1F.3.B.1.a", "FS1F.3.C.1.a", "FS1F.4.A.1.a",
  "FS1F.4.B.1.a", "FS1F.5.B.1.a", "FS1F.5.C.1.a", "FS1F.5.D.1.a", "FS1F.5.E.1.a",
] as const;
const GRADE3_CULTURE_CODES = [...GRADE3_CORE_CODES, "FS1F.6.A.1.a", "FS1F.6.C.1.a"] as const;

// First year of French (FS1F A1.1): familiar words, supported comprehension,
// short interactions, modelled writing, language strategies and culture.
const specs = [
  {
    id: "bonjour-classe-3", title: "Bonjour et la classe", emoji: "👋", curriculumCodes: GRADE3_CORE_CODES,
    vocabulary: [
      v("bonjour", "Guten Tag", "👋"), v("salut", "Hallo", "🙂"), v("au revoir", "Auf Wiedersehen", "👋"),
      v("merci", "Danke", "🙏"), v("s'il te plaît", "Bitte", "✨"), v("oui", "ja", "✅"),
      v("non", "nein", "❌"), v("écoute", "hör zu", "👂"), v("regarde", "schau", "👀"), v("répète", "wiederhole", "🔁"),
    ],
    categoryLabels: ["👋 Saluer et être poli", "🏫 Comprendre en classe"],
    categoryAssignments: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    choices: [
      choice("Lina entre en classe le matin. Que dit-elle ?", "Bonjour !", "Au revoir !", "Bonne nuit !", "Non !", "Le matin, on salue avec «bonjour»."),
      choice("La leçon est finie. Que dit la classe ?", "Au revoir !", "Écoute !", "Oui !", "Merci ?", "On se dit au revoir quand on part."),
      choice("Le professeur dit «Écoute et répète». Que fais-tu ?", "J'écoute, puis je redis les mots.", "Je ferme le livre et je pars.", "Je réponds seulement «non».", "Je dessine sans écouter.", "Les deux verbes donnent l'ordre des actions."),
      choice("Noah reçoit un crayon. Quelle réponse est polie ?", "Merci !", "Regarde !", "Non !", "Au revoir !", "On remercie quand on reçoit quelque chose."),
      choice("Tu demandes une gomme à un camarade. Quelle phrase convient ?", "Une gomme, s'il te plaît.", "Une gomme, au revoir.", "Écoute une gomme.", "Non merci bonjour.", "«S'il te plaît» rend la demande polie."),
    ],
    cloze: [
      cloze("Le matin, je dis : ___.", "bonjour", "C'est la salutation de la journée."),
      cloze("Quand je pars, je dis : ___.", "au revoir", "Deux mots pour prendre congé."),
      cloze("Pour remercier, je dis : ___.", "merci", "Un mot très fréquent."),
      cloze("Le professeur dit : «___ et répète.»", "écoute", "On utilise ses oreilles."),
      cloze("Je réponds positivement : ___.", "oui", "Le contraire de «non»."),
    ],
    writing: [
      write("Écris un mini-dialogue de deux lignes pour saluer un camarade.", "— Bonjour, Mia !\n— Salut, Léo !"),
      write("Écris une demande polie avec «s'il te plaît».", "Un crayon, s'il te plaît."),
      write("Écris trois mots que tu peux utiliser en classe.", "Bonjour, merci, écoute."),
    ],
  },
  {
    id: "je-me-presente-3", title: "Je me présente", emoji: "🙋", curriculumCodes: GRADE3_CORE_CODES,
    vocabulary: [
      v("je m'appelle", "ich heisse", "🏷️"), v("j'ai", "ich habe", "🙋"), v("ans", "Jahre alt", "🎂"),
      v("j'habite", "ich wohne", "🏠"), v("je viens de", "ich komme aus", "🗺️"), v("comment", "wie", "❓"),
      v("quel âge", "wie alt", "🎂"), v("où", "wo", "📍"), v("ça va", "wie geht's", "🙂"), v("bien", "gut", "😊"),
    ],
    categoryLabels: ["🙋 Donner une information", "❓ Poser ou répondre à une question"],
    categoryAssignments: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    choices: [
      choice("On te demande «Comment tu t'appelles ?». Que réponds-tu ?", "Je m'appelle Sara.", "J'ai neuf ans.", "J'habite à Berne.", "Ça va bien.", "La question demande ton prénom."),
      choice("On te demande «Quel âge as-tu ?». Quelle réponse convient ?", "J'ai neuf ans.", "Je m'appelle neuf.", "J'habite neuf ans.", "Je viens de lundi.", "En français, on a un âge avec «avoir»."),
      choice("Quelle question demande le lieu d'habitation ?", "Où habites-tu ?", "Comment ça va ?", "Quel âge as-tu ?", "Comment tu t'appelles ?", "Le mot interrogatif «où» demande un lieu."),
      choice("Léo dit : «Je viens de Suisse.» Quelle information donne-t-il ?", "Son pays d'origine", "Son âge", "Son humeur", "Son prénom", "«Venir de» indique l'origine."),
      choice("A : «Ça va ?» B : ___", "Oui, ça va bien.", "Je m'appelle à Zurich.", "J'ai Suisse.", "Où neuf ans ?", "La réponse parle de l'état de la personne."),
    ],
    cloze: [
      cloze("Bonjour, je m'___ Mila.", "appelle", "La formule complète est «je m'appelle»."),
      cloze("J'___ neuf ans.", "ai", "On utilise le verbe avoir pour l'âge."),
      cloze("J'___ à Bâle.", "habite", "Le verbe signifie «wohnen»."),
      cloze("Je viens ___ Suisse.", "de", "«Venir de» + pays."),
      cloze("Comment ça va ? — Très ___.", "bien", "Une réponse positive."),
    ],
    writing: [
      write("Présente-toi en deux phrases : prénom et âge.", "Je m'appelle Nina. J'ai neuf ans."),
      write("Écris où tu habites avec le modèle «J'habite à…».", "J'habite à Soleure."),
      write("Écris trois informations simples sur toi.", "Je m'appelle Amir. J'ai huit ans. Je viens de Suisse."),
    ],
  },
  {
    id: "nombres-dates-3", title: "Les nombres et les dates", emoji: "🔢", curriculumCodes: GRADE3_CORE_CODES,
    vocabulary: [
      v("zéro", "null", "0️⃣"), v("un", "eins", "1️⃣"), v("deux", "zwei", "2️⃣"), v("trois", "drei", "3️⃣"),
      v("quatre", "vier", "4️⃣"), v("cinq", "fünf", "5️⃣"), v("six", "sechs", "6️⃣"), v("sept", "sieben", "7️⃣"),
      v("huit", "acht", "8️⃣"), v("neuf", "neun", "9️⃣"),
    ],
    categoryLabels: ["🔵 Nombres de 0 à 4", "🟣 Nombres de 5 à 9"],
    categoryAssignments: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    choices: [
      choice("Quel nombre vient après «trois» ?", "quatre", "deux", "sept", "neuf", "Compte dans l'ordre."),
      choice("Combien font deux et trois ?", "cinq", "quatre", "six", "huit", "2 + 3 = 5."),
      choice("Tu entends «huit». Quel chiffre choisis-tu ?", "8", "6", "4", "9", "«Huit» commence par un son muet puis [ɥit]."),
      choice("Quel mot contient le son final [s] ?", "six", "deux", "trois", "neuf", "Dans le nombre isolé «six», le x se prononce [s]."),
      choice("Aujourd'hui, nous sommes le 4 mai. Comment écrit-on 4 en lettres ?", "quatre", "cinq", "trois", "huit", "Le chiffre 4 se dit «quatre»."),
    ],
    cloze: [
      cloze("Un, deux, trois, ___.", "quatre", "Continue la suite."),
      cloze("Cinq, six, ___, huit.", "sept", "Le nombre entre six et huit."),
      cloze("Le chiffre 9 s'écrit ___.", "neuf", "Le mot commence par n."),
      cloze("Zéro plus un égale ___.", "un", "0 + 1 = 1."),
      cloze("J'ai ___ ans. (8)", "huit", "Écris le nombre en lettres."),
    ],
    writing: [
      write("Écris les nombres de zéro à quatre en français.", "zéro, un, deux, trois, quatre"),
      write("Écris ton âge en français dans une phrase.", "J'ai neuf ans."),
      write("Écris trois petits calculs avec des nombres français.", "un + deux = trois\ndeux + trois = cinq\nquatre + deux = six"),
    ],
  },
  {
    id: "ecole-objets-3", title: "L'école et les objets", emoji: "🎒", curriculumCodes: GRADE3_CORE_CODES,
    vocabulary: [
      v("le livre", "das Buch", "📘"), v("le cahier", "das Heft", "📓"), v("le crayon", "der Bleistift", "✏️"),
      v("la gomme", "der Radiergummi", "🧽"), v("la règle", "das Lineal", "📏"), v("le sac", "die Tasche", "🎒"),
      v("la table", "der Tisch", "🪑"), v("la chaise", "der Stuhl", "🪑"), v("la porte", "die Tür", "🚪"), v("la fenêtre", "das Fenster", "🪟"),
    ],
    categoryLabels: ["🎒 Matériel scolaire", "🏫 Dans la salle"],
    categoryAssignments: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    choices: [
      choice("Avec quoi écris-tu ?", "Avec un crayon.", "Avec une porte.", "Avec une chaise.", "Avec une fenêtre.", "Le crayon sert à écrire."),
      choice("Tu veux effacer un mot. Quel objet prends-tu ?", "la gomme", "le livre", "la table", "le sac", "La gomme efface le crayon."),
      choice("Quel objet aide à tracer une ligne droite ?", "la règle", "la chaise", "la porte", "le cahier", "La règle est longue et droite."),
      choice("Où ranges-tu tes livres pour aller à l'école ?", "dans le sac", "dans la fenêtre", "dans la gomme", "dans la règle", "Le sac transporte le matériel."),
      choice("La professeure dit «Ouvre le livre». Que fais-tu ?", "J'ouvre le livre.", "Je ferme la porte.", "Je prends la chaise.", "J'efface la table.", "Le verbe «ouvrir» donne l'action."),
    ],
    cloze: [
      cloze("J'écris avec un ___.", "crayon", "Un objet avec une mine."),
      cloze("Je dessine dans mon ___.", "cahier", "On écrit sur ses pages."),
      cloze("La ___ sert à mesurer.", "règle", "Elle porte des centimètres."),
      cloze("Je m'assieds sur la ___.", "chaise", "Un meuble pour s'asseoir."),
      cloze("La lumière entre par la ___.", "fenêtre", "Elle est souvent en verre."),
    ],
    writing: [
      write("Écris une liste de quatre objets dans ton sac.", "Dans mon sac : un livre, un cahier, un crayon et une gomme."),
      write("Décris ta salle de classe avec deux phrases simples.", "Il y a des tables et des chaises. La porte est ouverte."),
      write("Écris une demande polie pour emprunter un crayon.", "Tu me prêtes un crayon, s'il te plaît ?"),
    ],
  },
  {
    id: "famille-amis-3", title: "La famille et les amis", emoji: "👨‍👩‍👧‍👦", curriculumCodes: GRADE3_CORE_CODES,
    vocabulary: [
      v("la mère", "die Mutter", "👩"), v("le père", "der Vater", "👨"), v("la sœur", "die Schwester", "👧"),
      v("le frère", "der Bruder", "👦"), v("les parents", "die Eltern", "👨‍👩‍👧"), v("la grand-mère", "die Grossmutter", "👵"),
      v("le grand-père", "der Grossvater", "👴"), v("l'amie", "die Freundin", "👧"), v("l'ami", "der Freund", "👦"), v("la famille", "die Familie", "🏡"),
    ],
    categoryLabels: ["🏡 Famille", "🙂 Amis"],
    categoryAssignments: [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
    choices: [
      choice("Emma dit : «Lina est la fille de ma mère.» Qui est Lina ?", "Sa sœur", "Son père", "Son grand-père", "Son ami", "Deux filles des mêmes parents sont sœurs."),
      choice("Le père et la mère sont ensemble…", "les parents", "les amis", "les frères", "les grands-pères", "Le pluriel regroupe le père et la mère."),
      choice("Quelle phrase présente un ami ?", "Voici mon ami Noah.", "Voici ma mère Noah.", "J'ai neuf ami.", "Mon livre est Noah.", "«Mon ami» présente un garçon proche."),
      choice("Qui est la mère de ton père ?", "Ta grand-mère", "Ta sœur", "Ton amie", "Ta mère", "Remonte d'une génération."),
      choice("Quel article accompagne «sœur» ?", "la", "le", "un", "les", "«Sœur» est féminin singulier."),
    ],
    cloze: [
      cloze("La fille de mes parents est ma ___.", "sœur", "Un mot avec œ."),
      cloze("Le fils de mes parents est mon ___.", "frère", "Le mot commence par fr."),
      cloze("Mon père et ma mère sont mes ___.", "parents", "Un nom au pluriel."),
      cloze("La mère de ma mère est ma ___.", "grand-mère", "Deux parties reliées par un trait d'union."),
      cloze("Voici ___ ami Léo.", "mon", "Devant un nom masculin singulier."),
    ],
    writing: [
      write("Présente deux personnes de ta famille.", "Voici ma mère. Elle s'appelle Anna. Voici mon frère. Il s'appelle Tim."),
      write("Écris deux phrases sur un ami ou une amie.", "Mon amie s'appelle Zoé. Elle a neuf ans."),
      write("Écris une petite liste des personnes de ta famille.", "Dans ma famille, il y a ma mère, mon père et ma sœur."),
    ],
  },
  {
    id: "couleurs-vetements-3", title: "Les couleurs et les vêtements", emoji: "🎨", curriculumCodes: GRADE3_CORE_CODES,
    vocabulary: [
      v("rouge", "rot", "🔴"), v("bleu", "blau", "🔵"), v("vert", "grün", "🟢"), v("jaune", "gelb", "🟡"),
      v("noir", "schwarz", "⚫"), v("blanc", "weiss", "⚪"), v("le pull", "der Pullover", "👕"),
      v("le pantalon", "die Hose", "👖"), v("la robe", "das Kleid", "👗"), v("les chaussures", "die Schuhe", "👟"),
    ],
    categoryLabels: ["🎨 Couleurs", "👕 Vêtements"],
    categoryAssignments: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    choices: [
      choice("Quelle couleur a une tomate mûre ?", "rouge", "bleu", "vert", "noir", "Une tomate mûre est généralement rouge."),
      choice("Quel vêtement portes-tu aux jambes ?", "le pantalon", "le pull", "la robe", "les chaussures", "Le pantalon couvre les jambes."),
      choice("Quelle phrase décrit correctement une fille avec une robe jaune ?", "Elle porte une robe jaune.", "Il porte un pantalon rouge.", "Elle mange une robe.", "La robe porte jaune.", "«Porter» décrit les vêtements."),
      choice("Le drapeau suisse est…", "rouge et blanc", "bleu et vert", "jaune et noir", "blanc et bleu", "La croix est blanche sur fond rouge."),
      choice("Quels vêtements mets-tu aux pieds ?", "les chaussures", "la robe", "le pull", "le pantalon", "Les chaussures protègent les pieds."),
    ],
    cloze: [
      cloze("L'herbe est ___.", "verte", "Accorde «vert» avec un nom féminin."),
      cloze("Le soleil est ___.", "jaune", "Une couleur lumineuse."),
      cloze("Je porte un ___ bleu.", "pull", "Un vêtement pour le haut du corps."),
      cloze("Elle porte une ___ rouge.", "robe", "Un vêtement féminin dans cet exemple."),
      cloze("Mes ___ sont noires.", "chaussures", "On les porte aux pieds."),
    ],
    writing: [
      write("Décris tes vêtements aujourd'hui avec deux couleurs.", "Je porte un pull bleu et un pantalon noir."),
      write("Écris trois objets et leur couleur.", "Le livre est rouge. La règle est verte. Le sac est noir."),
      write("Invente une tenue et décris-la en deux phrases.", "Je porte une robe jaune. Mes chaussures sont blanches."),
    ],
  },
  {
    id: "manger-boire-3", title: "Manger et boire", emoji: "🍎", curriculumCodes: GRADE3_CORE_CODES,
    vocabulary: [
      v("le pain", "das Brot", "🍞"), v("le fromage", "der Käse", "🧀"), v("la pomme", "der Apfel", "🍎"),
      v("la banane", "die Banane", "🍌"), v("la carotte", "die Karotte", "🥕"), v("l'eau", "das Wasser", "💧"),
      v("le lait", "die Milch", "🥛"), v("j'aime", "ich mag", "❤️"), v("je n'aime pas", "ich mag nicht", "👎"), v("j'ai faim", "ich habe Hunger", "😋"),
    ],
    categoryLabels: ["🍽️ Aliments et boissons", "🙂 Dire ce qu'on ressent ou préfère"],
    categoryAssignments: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    choices: [
      choice("Tu as soif. Que demandes-tu ?", "De l'eau, s'il te plaît.", "Une chaise, s'il te plaît.", "Un livre, merci.", "Au revoir, pomme.", "Quand on a soif, on boit."),
      choice("Quelle phrase exprime une préférence positive ?", "J'aime les pommes.", "Je n'aime pas les pommes.", "J'ai une pomme bleue.", "Écoute les pommes.", "«J'aime» signifie que quelque chose nous plaît."),
      choice("Quel aliment est un légume ?", "la carotte", "la pomme", "la banane", "le lait", "La carotte pousse dans la terre."),
      choice("Quel produit est souvent fabriqué avec du lait ?", "le fromage", "le pain", "la pomme", "l'eau", "Le fromage est un produit laitier."),
      choice("Tu veux manger. Que peux-tu dire ?", "J'ai faim.", "J'ai bleu.", "Je viens de pain.", "Je m'appelle eau.", "Cette expression indique la faim."),
    ],
    cloze: [
      cloze("Je bois de l'___.", "eau", "Le mot commence par une voyelle et prend l'."),
      cloze("J'___ les bananes.", "aime", "Une préférence positive."),
      cloze("Je n'aime ___ le lait.", "pas", "La négation entoure le verbe : ne…pas."),
      cloze("La ___ est orange.", "carotte", "Un légume long et croquant."),
      cloze("À midi, j'ai ___.", "faim", "On ressent cela avant de manger."),
    ],
    writing: [
      write("Écris deux aliments que tu aimes et un que tu n'aimes pas.", "J'aime le pain et les pommes. Je n'aime pas les carottes."),
      write("Écris une commande très simple et polie.", "Un jus de pomme, s'il vous plaît."),
      write("Compose un petit goûter avec trois choses.", "Pour mon goûter, je prends du pain, du fromage et de l'eau."),
    ],
  },
  {
    id: "animaux-3", title: "Les animaux", emoji: "🐾", curriculumCodes: GRADE3_CORE_CODES,
    vocabulary: [
      v("le chat", "die Katze", "🐱"), v("le chien", "der Hund", "🐶"), v("le lapin", "das Kaninchen", "🐰"),
      v("le cheval", "das Pferd", "🐴"), v("la vache", "die Kuh", "🐄"), v("l'oiseau", "der Vogel", "🐦"),
      v("le poisson", "der Fisch", "🐟"), v("grand", "gross", "📏"), v("petit", "klein", "🤏"), v("vite", "schnell", "💨"),
    ],
    categoryLabels: ["🐾 Noms d'animaux", "📝 Mots pour décrire"],
    categoryAssignments: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    choices: [
      choice("Quel animal vit dans l'eau ?", "le poisson", "le cheval", "le lapin", "le chat", "Le poisson nage."),
      choice("Quel animal peut voler ?", "l'oiseau", "la vache", "le chien", "le poisson", "L'oiseau a des ailes."),
      choice("Quelle phrase décrit un lapin ?", "Le lapin est petit.", "Le lapin est une couleur.", "Le lapin boit une chaise.", "Le lapin est un poisson.", "«Petit» décrit sa taille."),
      choice("Quel animal de ferme donne du lait ?", "la vache", "l'oiseau", "le chat", "le poisson", "La vache est un mammifère de ferme."),
      choice("Le cheval court…", "vite", "bleu", "merci", "fenêtre", "«Vite» décrit la vitesse."),
    ],
    cloze: [
      cloze("Le ___ miaule.", "chat", "Le son est «miaou»."),
      cloze("Le ___ aboie.", "chien", "Le son est «ouaf»."),
      cloze("L'___ vole dans le ciel.", "oiseau", "Il a des ailes."),
      cloze("Le poisson nage dans l'___.", "eau", "Il vit dans ce milieu."),
      cloze("Une souris est ___.", "petite", "Accorde «petit» au féminin."),
    ],
    writing: [
      write("Décris ton animal préféré en deux phrases.", "Mon animal préféré est le chien. Il est grand et gentil."),
      write("Écris trois animaux du plus petit au plus grand.", "Le poisson est petit, le chien est grand et le cheval est très grand."),
      write("Invente une carte d'identité simple pour un animal.", "Nom : Léo. Animal : chat. Couleur : noir. Taille : petit."),
    ],
  },
  {
    id: "suisse-romande-3", title: "La Suisse romande", emoji: "🇨🇭", curriculumCodes: GRADE3_CULTURE_CODES,
    vocabulary: [
      v("la Suisse", "die Schweiz", "🇨🇭"), v("le français", "Französisch", "🇫🇷"), v("Genève", "Genf", "⛲"),
      v("Lausanne", "Lausanne", "🏙️"), v("Neuchâtel", "Neuenburg", "🏰"), v("le lac", "der See", "🌊"),
      v("la ville", "die Stadt", "🏙️"), v("la montagne", "der Berg", "🏔️"), v("la fête", "das Fest", "🎉"), v("la chanson", "das Lied", "🎵"),
    ],
    categoryLabels: ["🗺️ Lieux et paysages", "🎭 Langue et culture"],
    categoryAssignments: [0, 1, 0, 0, 0, 0, 0, 0, 1, 1],
    choices: [
      choice("Dans quelle partie de la Suisse parle-t-on beaucoup français ?", "En Suisse romande", "Seulement au Tessin", "Seulement à Zurich", "Nulle part en Suisse", "La Romandie est la région francophone."),
      choice("Quelle ville se trouve au bord du lac Léman ?", "Genève", "Saint-Gall", "Coire", "Altdorf", "Genève est à l'extrémité du Léman."),
      choice("Que montre une chanson francophone ?", "Une partie de la langue et de la culture", "Seulement un calcul", "Une règle de géométrie", "Un canton sans langue", "Les chansons transmettent des mots et des traditions."),
      choice("La Suisse a plusieurs langues nationales. Laquelle étudies-tu ici ?", "le français", "le japonais", "le portugais", "le suédois", "Ce cours porte sur le français."),
      choice("Quel mot désigne une grande étendue d'eau ?", "le lac", "la ville", "la fête", "la chanson", "Le Léman et le lac de Neuchâtel sont des lacs."),
    ],
    cloze: [
      cloze("Genève est une ___ suisse.", "ville", "Un lieu avec beaucoup d'habitants."),
      cloze("À Lausanne, on parle notamment ___.", "français", "La langue de la Romandie."),
      cloze("Le Léman est un ___.", "lac", "Une grande étendue d'eau."),
      cloze("La Suisse a quatre langues ___.", "nationales", "Deutsch: Landessprachen."),
      cloze("Une ___ a des paroles et une mélodie.", "chanson", "On peut la chanter."),
    ],
    writing: [
      write("Écris deux choses que tu sais sur la Suisse romande.", "On parle français en Suisse romande. Genève et Lausanne sont des villes romandes."),
      write("Prépare une carte postale très courte depuis Genève.", "Bonjour de Genève ! Le lac est très beau. À bientôt !"),
      write("Compare une salutation française et une salutation allemande.", "En français, je dis «bonjour». En allemand, je dis «Guten Tag»."),
    ],
  },
] satisfies readonly FrenchPrimaryTopicSpec[];

export default createFrenchPrimaryTopics(specs);
