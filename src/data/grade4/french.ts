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
    "J'ai répondu à chaque partie de la consigne.",
    "J'ai utilisé des phrases simples et compréhensibles.",
    "J'ai vérifié l'orthographe, les majuscules et la ponctuation.",
  ] as [string, string, string],
});

const GRADE4_CORE_CODES = [
  "FS1F.1.A.1.b", "FS1F.1.B.1.b", "FS1F.2.A.1.b", "FS1F.2.B.1.b",
  "FS1F.3.A.1.b", "FS1F.3.B.1.b", "FS1F.3.C.1.b", "FS1F.4.A.1.b",
  "FS1F.4.B.1.b", "FS1F.5.B.1.a", "FS1F.5.C.1.a", "FS1F.5.D.1.a", "FS1F.5.E.1.a",
] as const;
const GRADE4_CULTURE_CODES = [...GRADE4_CORE_CODES, "FS1F.6.A.1.b", "FS1F.6.C.1.a"] as const;

// Second year of French (FS1F A1.2 orientation point): short conversations,
// concrete information, modelled messages, descriptions and learning strategies.
const specs = [
  {
    id: "journee-heure-4", title: "Ma journée et l'heure", emoji: "⏰", curriculumCodes: GRADE4_CORE_CODES,
    vocabulary: [
      v("je me lève", "ich stehe auf", "🌅"), v("je déjeune", "ich frühstücke", "🥣"), v("je vais à l'école", "ich gehe zur Schule", "🎒"),
      v("je mange", "ich esse", "🍽️"), v("je fais mes devoirs", "ich mache Hausaufgaben", "✏️"), v("je joue", "ich spiele", "⚽"),
      v("je me couche", "ich gehe schlafen", "🛏️"), v("le matin", "am Morgen", "🌄"), v("l'après-midi", "am Nachmittag", "☀️"), v("le soir", "am Abend", "🌙"),
    ],
    categoryLabels: ["🏃 Actions", "🕒 Moments de la journée"],
    categoryAssignments: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    choices: [
      choice("Il est sept heures et l'école commence bientôt. Quelle action est logique ?", "Je vais à l'école.", "Je me couche.", "Je dîne à minuit.", "Je ferme la montagne.", "Le contexte indique le début de la journée scolaire."),
      choice("Quelle activité fait-on normalement avant de dormir ?", "Je me couche.", "Je vais à l'école.", "Je déjeune.", "Je me lève.", "Se coucher signifie aller au lit."),
      choice("A : «À quelle heure tu te lèves ?» B : ___", "Je me lève à sept heures.", "Je me lève le cahier.", "J'ai sept heures.", "À la chaise.", "La réponse donne une heure précise."),
      choice("Quel ordre est logique ?", "Je me lève, je déjeune, je vais à l'école.", "Je me couche, je me lève, je dors.", "Je vais à l'école, je me lève, je déjeune.", "Je joue, je nais, je déjeune hier.", "Suis le déroulement du matin."),
      choice("Quand fais-tu souvent tes devoirs ?", "L'après-midi.", "Pendant que je dors.", "Avant de me lever.", "Dans le lac.", "Après l'école, l'après-midi est plausible."),
    ],
    cloze: [
      cloze("Le matin, je me ___ à sept heures.", "lève", "Le verbe pronominal est «se lever»."),
      cloze("À midi, je ___.", "mange", "Une action liée au repas."),
      cloze("Après l'école, je fais mes ___.", "devoirs", "Le travail scolaire à la maison."),
      cloze("Le soir, je me ___ à neuf heures.", "couche", "Aller au lit."),
      cloze("Il est huit ___.", "heures", "Après un nombre, on indique l'unité de temps."),
    ],
    writing: [
      write("Décris ta matinée en trois phrases avec des heures.", "Je me lève à sept heures. Je déjeune à sept heures et demie. Je vais à l'école à huit heures."),
      write("Écris quatre actions de ta journée dans l'ordre.", "Je me lève, je vais à l'école, je fais mes devoirs et je me couche."),
      write("Compare ton après-midi et ton soir.", "L'après-midi, je joue. Le soir, je mange et je me couche."),
    ],
  },
  {
    id: "maison-position-4", title: "La maison et les positions", emoji: "🏠", curriculumCodes: GRADE4_CORE_CODES,
    vocabulary: [
      v("la cuisine", "die Küche", "🍳"), v("la chambre", "das Schlafzimmer", "🛏️"), v("le salon", "das Wohnzimmer", "🛋️"),
      v("la salle de bains", "das Badezimmer", "🛁"), v("le jardin", "der Garten", "🌳"), v("sur", "auf", "⬆️"),
      v("sous", "unter", "⬇️"), v("dans", "in", "📦"), v("devant", "vor", "⏩"), v("derrière", "hinter", "⏪"),
    ],
    categoryLabels: ["🏠 Pièces et lieux", "📍 Mots de position"],
    categoryAssignments: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    choices: [
      choice("Où prépare-t-on normalement le repas ?", "dans la cuisine", "dans la chambre", "dans le jardin", "dans la salle de bains", "La cuisine contient les appareils pour cuisiner."),
      choice("Le livre est posé en haut de la table. Il est…", "sur la table", "sous la table", "derrière la table", "dans la table", "«Sur» indique un contact au-dessus."),
      choice("Le chat est caché en bas du lit. Il est…", "sous le lit", "sur le lit", "devant le jardin", "dans la cuisine", "«Sous» signifie en dessous."),
      choice("Quelle phrase décrit une chambre ?", "Il y a un lit et une armoire.", "Il y a un four et une casserole.", "Il y a une baignoire et une douche.", "Il y a des arbres et de l'herbe.", "Le lit est typique d'une chambre."),
      choice("A : «Où est ton sac ?» B : ___", "Il est dans ma chambre.", "Il est à neuf ans.", "Il mange derrière.", "Je m'appelle le sac.", "La réponse donne un lieu."),
    ],
    cloze: [
      cloze("Je dors dans ma ___.", "chambre", "La pièce avec le lit."),
      cloze("Nous regardons un film dans le ___.", "salon", "La pièce avec le canapé."),
      cloze("La tasse est ___ la table.", "sur", "Elle se trouve au-dessus et touche la table."),
      cloze("Les chaussures sont ___ le lit.", "sous", "Elles sont en dessous."),
      cloze("Le vélo est ___ la maison, dans le jardin.", "derrière", "À l'arrière de la maison."),
    ],
    writing: [
      write("Décris ta chambre avec trois objets et deux positions.", "Dans ma chambre, il y a un lit. Le livre est sur la table et le sac est sous la chaise."),
      write("Écris où se trouvent trois personnes dans une maison.", "Maman est dans la cuisine. Mon frère est dans le jardin. Je suis dans le salon."),
      write("Imagine une maison et présente quatre pièces.", "Ma maison a une cuisine, un salon, deux chambres et une salle de bains."),
    ],
  },
  {
    id: "ecole-horaire-4", title: "L'école et l'horaire", emoji: "📚", curriculumCodes: GRADE4_CORE_CODES,
    vocabulary: [
      v("les maths", "Mathematik", "🔢"), v("le français", "Französisch", "🇫🇷"), v("l'allemand", "Deutsch", "📖"),
      v("le sport", "Sport", "⚽"), v("la musique", "Musik", "🎵"), v("lundi", "Montag", "1️⃣"),
      v("mardi", "Dienstag", "2️⃣"), v("mercredi", "Mittwoch", "3️⃣"), v("jeudi", "Donnerstag", "4️⃣"), v("vendredi", "Freitag", "5️⃣"),
    ],
    categoryLabels: ["📘 Matières", "📅 Jours d'école"],
    categoryAssignments: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    choices: [
      choice("Quel jour vient après mardi ?", "mercredi", "lundi", "vendredi", "jeudi", "Récite les jours dans l'ordre."),
      choice("Dans quelle matière calcule-t-on ?", "les maths", "la musique", "le sport", "le français", "Les nombres et les opérations appartiennent aux maths."),
      choice("A : «Tu as sport quand ?» B : ___", "J'ai sport le jeudi.", "Je suis sport neuf ans.", "Le jeudi a sport moi.", "J'habite sport.", "La réponse utilise «le» devant le jour."),
      choice("Quelle phrase parle d'une préférence scolaire ?", "J'aime la musique.", "Jeudi est un crayon.", "Les maths habitent ici.", "Je m'appelle sport.", "«J'aime» exprime une préférence."),
      choice("L'horaire dit : lundi, 10 h, français. Quelle information est correcte ?", "Le cours de français est lundi à dix heures.", "Le sport est vendredi à midi.", "Lundi est une matière.", "Le français est une heure.", "Combine le jour, l'heure et la matière."),
    ],
    cloze: [
      cloze("Après lundi, c'est ___.", "mardi", "Le deuxième jour d'école."),
      cloze("Avant vendredi, c'est ___.", "jeudi", "Le jour juste avant vendredi."),
      cloze("J'aime compter : ma matière préférée, ce sont les ___.", "maths", "La matière des nombres."),
      cloze("Nous chantons en cours de ___.", "musique", "La matière avec des chansons."),
      cloze("Le mercredi, j'___ français.", "ai", "On dit «j'ai un cours»."),
    ],
    writing: [
      write("Écris ton horaire pour deux jours avec une heure et une matière.", "Lundi à neuf heures, j'ai les maths. Mardi à dix heures, j'ai le français."),
      write("Présente ta matière préférée et donne une raison simple.", "Ma matière préférée est le sport parce que j'aime bouger."),
      write("Écris trois questions à poser sur un horaire.", "Tu as français quand ? À quelle heure commence le sport ? Quelle matière as-tu lundi ?"),
    ],
  },
  {
    id: "loisirs-capacites-4", title: "Les loisirs et les capacités", emoji: "⚽", curriculumCodes: GRADE4_CORE_CODES,
    vocabulary: [
      v("jouer au football", "Fussball spielen", "⚽"), v("faire du vélo", "Velo fahren", "🚲"), v("nager", "schwimmen", "🏊"),
      v("lire", "lesen", "📖"), v("dessiner", "zeichnen", "🎨"), v("chanter", "singen", "🎤"),
      v("danser", "tanzen", "💃"), v("je peux", "ich kann", "💪"), v("je ne peux pas", "ich kann nicht", "🚫"), v("j'adore", "ich liebe", "😍"),
    ],
    categoryLabels: ["🎯 Activités", "💬 Parler de ses capacités et préférences"],
    categoryAssignments: [0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    choices: [
      choice("Quelle activité fait-on dans une piscine ?", "nager", "lire", "dessiner", "chanter", "Dans l'eau, on nage."),
      choice("A : «Tu sais faire du vélo ?» B : ___", "Oui, je peux faire du vélo.", "Oui, je suis un vélo.", "Je vélo neuf ans.", "Non, j'habite vélo.", "«Je peux» exprime une capacité."),
      choice("Quelle phrase exprime une forte préférence ?", "J'adore dessiner.", "Je ne peux pas dessiner.", "Dessiner est lundi.", "J'ai dessiner.", "«J'adore» est plus fort que «j'aime»."),
      choice("Lina ne sait pas nager. Que dit-elle ?", "Je ne peux pas nager.", "Je peux très nager.", "Je nager pas peux.", "J'adore ne pas piscine.", "La négation encadre le verbe conjugué."),
      choice("Quelle question demande un loisir ?", "Qu'est-ce que tu aimes faire ?", "Quel âge a lundi ?", "Où est la couleur ?", "Comment s'appelle dix heures ?", "La question contient le verbe «aimer»."),
    ],
    cloze: [
      cloze("Je ___ jouer au football.", "peux", "Le verbe exprime la capacité."),
      cloze("Je ne peux ___ nager.", "pas", "La deuxième partie de la négation."),
      cloze("J'___ lire des bandes dessinées.", "adore", "Une préférence très forte."),
      cloze("Elle fait du ___.", "vélo", "Un véhicule à deux roues."),
      cloze("Nous aimons ___ ensemble.", "chanter", "Après «aimer», utilise l'infinitif."),
    ],
    writing: [
      write("Écris trois loisirs : un que tu adores, un que tu aimes et un que tu n'aimes pas.", "J'adore nager. J'aime dessiner. Je n'aime pas danser."),
      write("Présente deux choses que tu peux faire et une que tu ne peux pas encore faire.", "Je peux faire du vélo et chanter. Je ne peux pas encore jouer du piano."),
      write("Prépare quatre phrases pour présenter ton loisir préféré.", "Mon loisir préféré est le football. Je joue le mercredi. Je joue avec mes amis. J'adore courir."),
    ],
  },
  {
    id: "achats-prix-4", title: "Les achats et les prix", emoji: "🛒", curriculumCodes: GRADE4_CORE_CODES,
    vocabulary: [
      v("combien", "wie viel", "❓"), v("ça coûte", "es kostet", "💰"), v("un franc", "ein Franken", "🪙"),
      v("cher", "teuer", "💸"), v("bon marché", "günstig", "🏷️"), v("je voudrais", "ich möchte", "🙋"),
      v("acheter", "kaufen", "🛍️"), v("le magasin", "das Geschäft", "🏪"), v("la monnaie", "das Rückgeld", "🪙"), v("le prix", "der Preis", "🏷️"),
    ],
    categoryLabels: ["💰 Prix et argent", "🛍️ Acheter poliment"],
    categoryAssignments: [0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
    choices: [
      choice("Quelle question demande le prix ?", "Combien ça coûte ?", "Comment tu t'appelles ?", "Où habites-tu ?", "Quel âge as-tu ?", "Le mot «combien» demande une quantité."),
      choice("Au magasin, quelle demande est polie ?", "Je voudrais une pomme, s'il vous plaît.", "Donne pomme maintenant.", "Une pomme au revoir.", "Je suis une pomme.", "«Je voudrais» et «s'il vous plaît» sont polis."),
      choice("Un cahier coûte CHF 2 et tu donnes CHF 5. Quelle monnaie reçois-tu ?", "CHF 3", "CHF 2", "CHF 5", "CHF 7", "5 − 2 = 3."),
      choice("Quel adjectif décrit un prix très élevé ?", "cher", "bon marché", "petit", "bleu", "«Cher» signifie que le prix est élevé."),
      choice("Le panneau indique «Pain : CHF 3». Quelle information donne-t-il ?", "Le prix du pain", "L'âge du pain", "La couleur du magasin", "Le jour de l'école", "Le nombre après CHF est le prix."),
    ],
    cloze: [
      cloze("Combien ça ___ ?", "coûte", "Le verbe lié au prix."),
      cloze("Je ___ acheter ce livre.", "voudrais", "Une demande polie."),
      cloze("Ce jouet est très ___ : CHF 80 !", "cher", "Le prix est élevé."),
      cloze("Cette gomme coûte un ___.", "franc", "La monnaie suisse."),
      cloze("Après avoir payé, je reçois la ___.", "monnaie", "L'argent rendu."),
    ],
    writing: [
      write("Écris un dialogue de quatre lignes entre un client et une vendeuse.", "— Bonjour, je voudrais une pomme, s'il vous plaît.\n— Voilà.\n— Combien ça coûte ?\n— Deux francs."),
      write("Crée une petite liste de trois produits avec leur prix.", "Pain : CHF 3. Lait : CHF 2. Pommes : CHF 4."),
      write("Compare deux prix avec «cher» et «bon marché».", "Le vélo est cher. Le crayon est bon marché."),
    ],
  },
  {
    id: "meteo-saisons-4", title: "La météo et les saisons", emoji: "🌦️", curriculumCodes: GRADE4_CORE_CODES,
    vocabulary: [
      v("il fait chaud", "es ist warm", "☀️"), v("il fait froid", "es ist kalt", "🥶"), v("il pleut", "es regnet", "🌧️"),
      v("il neige", "es schneit", "❄️"), v("il y a du vent", "es ist windig", "💨"), v("le printemps", "der Frühling", "🌷"),
      v("l'été", "der Sommer", "🏖️"), v("l'automne", "der Herbst", "🍂"), v("l'hiver", "der Winter", "⛄"), v("la météo", "das Wetter", "🌤️"),
    ],
    categoryLabels: ["🌤️ Temps qu'il fait", "📅 Saisons"],
    categoryAssignments: [0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
    choices: [
      choice("Quel temps correspond à un parapluie ouvert ?", "Il pleut.", "Il neige.", "Il fait chaud.", "Il y a du soleil la nuit.", "Le parapluie protège de la pluie."),
      choice("Quelle saison vient après l'été ?", "l'automne", "le printemps", "l'hiver", "lundi", "L'ordre est printemps, été, automne, hiver."),
      choice("On construit souvent un bonhomme de neige en…", "hiver", "été", "automne", "printemps", "La neige est fréquente en hiver."),
      choice("La météo annonce 30 °C et du soleil. Quelle phrase convient ?", "Il fait chaud.", "Il fait froid.", "Il neige.", "Il y a une tempête de glace.", "30 °C est une température chaude."),
      choice("A : «Quel temps fait-il ?» B : ___", "Il y a du vent.", "Je suis la météo.", "Il a neuf ans.", "La saison habite ici.", "La réponse décrit le temps."),
    ],
    cloze: [
      cloze("En hiver, il fait souvent ___.", "froid", "Le contraire de «chaud»."),
      cloze("Quand l'eau tombe du ciel, il ___.", "pleut", "Le verbe de la pluie."),
      cloze("Après le printemps vient l'___.", "été", "La saison chaude."),
      cloze("Les feuilles tombent en ___.", "automne", "La saison entre l'été et l'hiver."),
      cloze("Aujourd'hui, il y a du ___. Les arbres bougent.", "vent", "L'air se déplace."),
    ],
    writing: [
      write("Écris une météo pour aujourd'hui avec deux informations.", "Aujourd'hui, il fait froid et il y a du vent."),
      write("Présente ta saison préférée et donne deux raisons.", "Ma saison préférée est l'été parce qu'il fait chaud et que je peux nager."),
      write("Compare l'été et l'hiver en trois phrases.", "En été, il fait chaud. En hiver, il fait froid et il neige parfois."),
    ],
  },
  {
    id: "ville-directions-4", title: "En ville et les directions", emoji: "🗺️", curriculumCodes: GRADE4_CORE_CODES,
    vocabulary: [
      v("la gare", "der Bahnhof", "🚉"), v("l'école", "die Schule", "🏫"), v("la poste", "die Post", "📮"),
      v("le parc", "der Park", "🌳"), v("la boulangerie", "die Bäckerei", "🥐"), v("à gauche", "links", "⬅️"),
      v("à droite", "rechts", "➡️"), v("tout droit", "geradeaus", "⬆️"), v("près de", "in der Nähe von", "📍"), v("loin de", "weit weg von", "🗺️"),
    ],
    categoryLabels: ["🏙️ Lieux en ville", "🧭 Directions et distance"],
    categoryAssignments: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    choices: [
      choice("Où prends-tu normalement le train ?", "à la gare", "à la boulangerie", "au parc", "à la poste", "Les trains partent de la gare."),
      choice("Tu veux acheter du pain. Où vas-tu ?", "à la boulangerie", "à la gare", "à l'école", "au parc", "La boulangerie vend du pain."),
      choice("Le plan montre une flèche vers la droite. Que fais-tu ?", "Je tourne à droite.", "Je tourne à gauche.", "Je vais en arrière.", "Je m'arrête pour dormir.", "Suis le sens de la flèche."),
      choice("A : «Excusez-moi, où est la poste ?» B : ___", "Allez tout droit, puis tournez à gauche.", "La poste a neuf ans.", "Je voudrais un lundi.", "Il pleut dans le livre.", "Une direction utilise un trajet clair."),
      choice("L'école est à deux minutes de chez moi. Elle est…", "près de chez moi", "loin de chez moi", "sous chez moi", "avant lundi", "Deux minutes indiquent une petite distance."),
    ],
    cloze: [
      cloze("Pour prendre le train, je vais à la ___.", "gare", "Le lieu des trains."),
      cloze("Tourne à ___ : ⬅️", "gauche", "Suis la flèche."),
      cloze("Continue tout ___.", "droit", "Sans tourner."),
      cloze("Le parc est ___ de l'école : seulement 100 mètres.", "près", "Une courte distance."),
      cloze("J'achète une baguette à la ___.", "boulangerie", "Le magasin du pain."),
    ],
    writing: [
      write("Écris un itinéraire de l'école au parc avec trois étapes.", "Sors de l'école. Va tout droit. Tourne à droite : le parc est là."),
      write("Décris où se trouvent trois lieux de ta commune.", "La poste est près de la gare. Le parc est derrière l'école. La boulangerie est à gauche."),
      write("Écris un mini-dialogue pour demander puis donner le chemin.", "— Excusez-moi, où est la gare ?\n— Allez tout droit, puis tournez à gauche."),
    ],
  },
  {
    id: "messages-invitations-4", title: "Les messages et les invitations", emoji: "💌", curriculumCodes: GRADE4_CORE_CODES,
    vocabulary: [
      v("bonjour", "Guten Tag", "👋"), v("cher", "lieber", "💌"), v("chère", "liebe", "💌"),
      v("je t'invite", "ich lade dich ein", "🎉"), v("la fête", "das Fest", "🎈"), v("samedi", "Samstag", "📅"),
      v("à bientôt", "bis bald", "👋"), v("répondre", "antworten", "✉️"), v("d'accord", "einverstanden", "✅"), v("désolé", "Entschuldigung", "🙏"),
    ],
    categoryLabels: ["✉️ Écrire et répondre", "📅 Informations d'une invitation"],
    categoryAssignments: [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    choices: [
      choice("Quel élément doit absolument figurer dans une invitation ?", "La date et le lieu", "La couleur des chaussures du lecteur", "Le prix d'un train inconnu", "Une liste de tous les verbes", "Le destinataire doit savoir quand et où venir."),
      choice("L'invitation dit «Samedi à 14 h chez Lina». Quand a lieu la fête ?", "Samedi à quatorze heures", "Vendredi à midi", "Dimanche matin", "Lundi à neuf heures", "Repère le jour et l'heure dans le message."),
      choice("Tu acceptes l'invitation. Quelle réponse convient ?", "D'accord, merci ! Je viens.", "Désolé, je suis une date.", "La fête coûte à gauche.", "Bonjour, je ne lis jamais.", "Une acceptation claire dit que tu viens."),
      choice("Tu ne peux pas venir. Quelle réponse est polie ?", "Désolé, je ne peux pas venir.", "Non.", "Fête samedi gauche.", "Je viens ne pas peux.", "On s'excuse et on donne une réponse complète."),
      choice("Quelle formule convient à la fin d'un message amical ?", "À bientôt !", "Quel âge ?", "Tout droit !", "Il pleut !", "Cette formule annonce qu'on se reverra."),
    ],
    cloze: [
      cloze("___ Emma, je t'invite à ma fête.", "Chère", "On s'adresse à une fille."),
      cloze("Je t'___ à mon anniversaire.", "invite", "Le verbe signifie «einladen»."),
      cloze("La fête est ___ à 15 h.", "samedi", "Un jour du week-end."),
      cloze("Merci pour ton message. Je vais ___.", "répondre", "Écrire une réponse."),
      cloze("Je ne peux pas venir. Je suis ___.", "désolé", "Une excuse polie."),
    ],
    writing: [
      write("Écris une invitation avec la date, l'heure et le lieu.", "Chère Mia, je t'invite à ma fête samedi à 14 h chez moi. À bientôt !"),
      write("Réponds positivement à une invitation en deux phrases.", "Merci pour ton invitation ! D'accord, je viens samedi."),
      write("Réponds poliment que tu ne peux pas venir.", "Merci pour ton invitation. Désolé, je ne peux pas venir samedi."),
    ],
  },
  {
    id: "histoires-cultures-4", title: "Histoires et cultures francophones", emoji: "📖", curriculumCodes: GRADE4_CULTURE_CODES,
    vocabulary: [
      v("l'histoire", "die Geschichte", "📖"), v("le personnage", "die Figur", "🧒"), v("le début", "der Anfang", "▶️"),
      v("la fin", "das Ende", "🏁"), v("drôle", "lustig", "😄"), v("triste", "traurig", "😢"),
      v("la bande dessinée", "der Comic", "💬"), v("la chanson", "das Lied", "🎵"), v("la tradition", "die Tradition", "🎊"), v("la francophonie", "die französischsprachige Welt", "🌍"),
    ],
    categoryLabels: ["📚 Comprendre un récit", "🌍 Culture francophone"],
    categoryAssignments: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    choices: [
      choice("Dans une histoire, qui fait les actions ?", "le personnage", "la ponctuation", "le prix", "la direction", "Les personnages vivent les événements."),
      choice("Quelle stratégie aide à comprendre une bande dessinée ?", "Observer les images, les bulles et les mots connus.", "Cacher toutes les images.", "Lire seulement les numéros de page.", "Traduire les couleurs en calculs.", "Les images donnent le contexte de l'action."),
      choice("Le héros rit et fait rire ses amis. L'histoire est probablement…", "drôle", "triste", "chère", "loin", "Le rire indique un ton amusant."),
      choice("Que désigne la francophonie ?", "Les personnes et régions qui utilisent le français", "Seulement la ville de Paris", "Une matière de mathématiques", "Un seul livre suisse", "Le français est parlé sur plusieurs continents."),
      choice("Quel élément peut être différent entre deux cultures ?", "Une tradition de fête", "Le résultat de 2 + 2", "Le nombre de côtés d'un carré", "La température où l'eau gèle", "Les traditions varient selon les communautés."),
    ],
    cloze: [
      cloze("Au ___ de l'histoire, le personnage arrive à Genève.", "début", "La première partie du récit."),
      cloze("À la ___, tout le monde rentre à la maison.", "fin", "La dernière partie."),
      cloze("Une histoire qui fait rire est ___.", "drôle", "Le contraire de triste dans ce contexte."),
      cloze("Une ___ dessinée raconte avec des images et des bulles.", "bande", "Le premier mot de l'expression «bande dessinée»."),
      cloze("Le français est parlé dans plusieurs pays : c'est la ___.", "francophonie", "La communauté mondiale liée au français."),
    ],
    writing: [
      write("Résume une petite histoire en trois parties : début, action, fin.", "Au début, Léo arrive au lac. Il cherche son chien. À la fin, il le retrouve près du parc."),
      write("Décris un personnage avec trois informations.", "Zoé est une fille de dix ans. Elle est drôle et courageuse. Elle adore les bandes dessinées."),
      write("Compare une tradition francophone avec une tradition que tu connais.", "À Genève, on fête l'Escalade. Dans ma commune, nous avons une autre fête avec de la musique."),
    ],
  },
] satisfies readonly FrenchPrimaryTopicSpec[];

export default createFrenchPrimaryTopics(specs);
