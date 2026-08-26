import type { Exercise } from "@/types/exercise";

type ExercisePatch = Partial<Exercise>;

const SELF_REVIEW_KEYS = new Set([
  // German / NMG: several examples or lists can be equally correct.
  "2/german/wortfamilien/wf50",
  "5/science/schweiz-politik-5/sp5-24",
  "5/science/nachhaltigkeit-5/nh5-6",

  // Grade 3 English: LP21 Cycle 2 — short personal information, lists and sentence frames.
  "3/english/greetings-3/gr3-50",
  "3/english/colours-shapes-3/cs3-46",
  "3/english/school-objects-3/so3-36",
  "3/english/school-objects-3/so3-50",
  "3/english/family-friends-3/ff3-36",
  "3/english/family-friends-3/ff3-46",
  "3/english/animals-3/an3-36",
  "3/english/animals-3/an3-40",
  "3/english/food-drink-3/fd3-30",
  "3/english/food-drink-3/fd3-36",
  "3/english/food-drink-3/fd3-40",
  "3/english/food-drink-3/fd3-50",
  "3/english/days-months-3/dm3-20",
  "3/english/days-months-3/dm3-50",
  "3/english/simple-sentences-3/ss3-36",
  "3/english/simple-sentences-3/ss3-44",
  "3/english/simple-sentences-3/ss3-48",

  // Grade 4 English: familiar people, places and everyday situations with scaffolding.
  "4/english/my-daily-routine-4/dr4-40",
  "4/english/my-home-4/mh4-36",
  "4/english/my-home-4/mh4-46",
  "4/english/my-home-4/mh4-50",
  "4/english/sports-hobbies-4/sh4-36",
  "4/english/food-shopping-4/fs4-36",
  "4/english/food-shopping-4/fs4-44",
  "4/english/weather-seasons-4/ws4-50",
  "4/english/describing-people-4/dp4-14",
  "4/english/describing-people-4/dp4-50",

  // Grade 5 French: beginner Cycle-2 production about self and familiar topics.
  "5/french/bonjour-5/bj5-6",
  "5/french/bonjour-5/bj5-30",
  "5/french/bonjour-5/bj5-36",
  "5/french/bonjour-5/bj5-50",
  "5/french/famille-5/fa5-36",
  "5/french/famille-5/fa5-50",
  "5/french/ecole-5/ec5-50",
  "5/french/nourriture-5/no5-50",
  "5/french/couleurs-description-5/cd5-50",
  "5/french/verbes-etre-avoir-5/va5-50",
  "5/french/animaux-5/ai5-44",
  "5/french/animaux-5/ai5-50",
  "5/french/activites-loisirs-5/al5-50",

  // Grade 5 English: simple connected sentences on familiar Cycle-2 topics.
  "5/english/future-plans-5/fp5-50",
  "5/english/environment-5/env5-40",
  "5/english/environment-5/env5-42",
  "5/english/environment-5/env5-48",
  "5/english/technology-5/tech5-36",
  "5/english/technology-5/tech5-40",
  "5/english/technology-5/tech5-48",
  "5/english/technology-5/tech5-50",
  "5/english/countries-cultures-5/cc5-42",
  "5/english/countries-cultures-5/cc5-50",
  "5/english/modal-verbs-5/mv5-44",
  "5/english/modal-verbs-5/mv5-50",
  "5/english/storytelling-5/st5-10",
  "5/english/storytelling-5/st5-36",
  "5/english/storytelling-5/st5-44",
  "5/english/storytelling-5/st5-48",
  "5/english/storytelling-5/st5-50",
  "5/english/reading-comp-5/rc5-50",

  // Grade 6 French: short supported Cycle-2 texts, not secondary-school essays.
  "6/french/imparfait-6/imp6-40",
  "6/french/imparfait-6/imp6-50",
  "6/french/futur-simple-6/fs6-38",
  "6/french/futur-simple-6/fs6-50",
  "6/french/ville-directions-6/vd6-36",
  "6/french/ville-directions-6/vd6-44",
  "6/french/ville-directions-6/vd6-50",
  "6/french/sante-corps-6/sc6-36",
  "6/french/sante-corps-6/sc6-46",
  "6/french/sante-corps-6/sc6-50",
  "6/french/pronoms-cod-coi-6/pr6-50",
  "6/french/france-pays-francophones-6/ff6-50",
  "6/french/metiers-avenir-6/ma6-50",
  "6/french/culture-francophone-6/cf6-50",

  // Grade 6 English: upper Cycle-2 production, simplified where the old task was Cycle 3.
  "6/english/passive-voice-6/pv6-42",
  "6/english/passive-voice-6/pv6-50",
  "6/english/conditionals-6/cond6-38",
  "6/english/conditionals-6/cond6-46",
  "6/english/conditionals-6/cond6-50",
  "6/english/reading-skills-6/rsk6-50",
  "6/english/writing-skills-6/ws6-18",
  "6/english/writing-skills-6/ws6-34",
  "6/english/writing-skills-6/ws6-36",
  "6/english/writing-skills-6/ws6-40",
  "6/english/writing-skills-6/ws6-44",
  "6/english/writing-skills-6/ws6-46",
  "6/english/writing-skills-6/ws6-50",
  "6/english/vocabulary-6/vb6-50",
  "6/english/environment-debate-6/ed6-36",
  "6/english/environment-debate-6/ed6-40",
  "6/english/environment-debate-6/ed6-48",
  "6/english/environment-debate-6/ed6-50",
  "6/english/culture-media-6/cm6-36",
  "6/english/culture-media-6/cm6-38",
  "6/english/culture-media-6/cm6-50",
  "6/english/exam-skills-6/ex6-36",
  "6/english/exam-skills-6/ex6-50",
]);

const REWRITES: Record<string, ExercisePatch> = {
  "3/english/greetings-3/gr3-50": { answer: "Hello! My name is Mia. I am from Bern." },
  "3/english/colours-shapes-3/cs3-46": { answer: "My favourite colour is blue." },
  "3/english/school-objects-3/so3-36": { answer: "pencil, pen, eraser, ruler" },
  "3/english/school-objects-3/so3-50": { answer: "My favourite subject is Art because I like drawing." },
  "3/english/family-friends-3/ff3-36": { answer: "I have a mother, a father, and a sister." },
  "3/english/animals-3/an3-36": { answer: "My favourite animal is a dog because it is friendly." },
  "3/english/animals-3/an3-40": { answer: "cow, pig, sheep" },
  "3/english/food-drink-3/fd3-30": { answer: "My favourite fruit is an apple." },
  "3/english/food-drink-3/fd3-40": { answer: "cheese, tomato, cucumber" },
  "3/english/food-drink-3/fd3-50": { answer: "Today I had pasta." },
  "3/english/days-months-3/dm3-20": { answer: "My birthday is in May." },
  "3/english/days-months-3/dm3-50": { answer: "My favourite season is summer because it is warm." },
  "3/english/simple-sentences-3/ss3-44": {
    question: "Describe a friend: 'My friend is ___. He or she is very ___.'",
    answer: "My friend is Mia. She is very kind.",
  },
  "3/english/simple-sentences-3/ss3-36": { answer: "I am Mia. I am nine years old. I am from Zurich." },
  "3/english/simple-sentences-3/ss3-48": { answer: "Is your school big? Yes, it is." },

  "4/english/my-home-4/mh4-36": { answer: "I live in a flat in Bern. There is a kitchen and a bedroom." },
  "4/english/my-home-4/mh4-46": { answer: "In my town there is a park, a school and a shop." },
  "4/english/sports-hobbies-4/sh4-36": { answer: "I like swimming and reading. I can draw, but I can't play the guitar." },
  "4/english/food-shopping-4/fs4-36": { answer: "I'd like some bread, please." },
  "4/english/food-shopping-4/fs4-44": { answer: "milk, bread, apples" },
  "4/english/weather-seasons-4/ws4-50": { answer: "Today in Zurich it is sunny and warm. Tomorrow it will rain with strong wind." },
  "4/english/describing-people-4/dp4-14": { answer: "My hair is brown." },

  "5/french/bonjour-5/bj5-6": { answer: "Je m'appelle Léa." },
  "5/french/bonjour-5/bj5-30": { answer: "Je viens de Suisse." },
  "5/french/bonjour-5/bj5-36": { answer: "Bonjour ! Je m'appelle Léo. J'ai onze ans. Je viens de Suisse." },
  "5/french/bonjour-5/bj5-50": { answer: "Bonjour ! Je m'appelle Léa et j'ai onze ans. Je viens de Berne." },
  "5/french/famille-5/fa5-36": { answer: "Dans ma famille, il y a ma mère, mon frère et moi." },
  "5/french/couleurs-description-5/cd5-50": { answer: "Dans l'image, il y a un chat noir et une maison blanche." },
  "5/french/activites-loisirs-5/al5-50": { answer: "Dans mon temps libre, j'aime lire et nager. Je joue souvent avec mes amis." },

  "5/english/environment-5/env5-40": {
    question: "Write one health recommendation with 'shouldn't': 'People shouldn't ___ because ___.'",
    answer: "People shouldn't waste water because it is precious.",
  },
  "5/english/environment-5/env5-42": {
    question: "Write two simple actions that reduce a person's carbon footprint.",
    answer: "Use public transport. Save electricity at home.",
  },
  "5/english/technology-5/tech5-36": {
    question: "Write two simple sentences about social media: one advantage and one disadvantage.",
    answer: "Social media connects people. Too much social media can waste time.",
  },
  "5/english/technology-5/tech5-40": { answer: "One advantage of smartphones is quick communication, but one disadvantage is too much screen time." },
  "5/english/technology-5/tech5-50": {
    question: "Write two simple sentences about technology: one advantage and one disadvantage.",
    answer: "Technology helps us find information. Too much screen time can make us tired.",
  },
  "5/english/countries-cultures-5/cc5-42": { answer: "The capital of Italy is Rome. People there are called Italians." },
  "5/english/storytelling-5/st5-10": { answer: "First, Mia woke up. Next, she ate breakfast. Finally, she went to school." },
  "5/english/storytelling-5/st5-50": {
    question: "Write a short story in three simple sentences: setting, problem and ending.",
    answer: "A boy was walking in the forest. Suddenly, he lost his map. A friendly hiker helped him find the path.",
  },

  "6/french/imparfait-6/imp6-40": { answer: "Quand j'étais petit, je jouais dehors. Hier, j'ai joué au football." },
  "6/french/imparfait-6/imp6-50": {
    question: "Écris deux phrases courtes : une description à l'imparfait et un événement au passé composé.",
    answer: "Il faisait beau. Nous avons joué dans le parc.",
  },
  "6/french/futur-simple-6/fs6-50": {
    question: "Écris deux phrases simples au futur sur tes projets pour l'année prochaine.",
    answer: "L'année prochaine, j'apprendrai l'italien. Je visiterai le Tessin.",
  },
  "6/french/ville-directions-6/vd6-36": { answer: "Il faut aller tout droit, puis tourner à gauche. Le musée est en face de la gare." },
  "6/french/ville-directions-6/vd6-50": {
    question: "Écris deux indications simples pour aller de l'école à la mairie.",
    answer: "Sors de l'école et tourne à droite. Va tout droit jusqu'à la mairie.",
  },
  "6/french/sante-corps-6/sc6-36": { answer: "Docteur, j'ai mal à la tête, j'ai de la fièvre et je tousse depuis hier." },
  "6/french/sante-corps-6/sc6-46": { answer: "Il faut dormir assez et il ne faut pas manger trop de sucre." },
  "6/french/sante-corps-6/sc6-50": { answer: "Un mode de vie sain comprend une alimentation équilibrée, du mouvement et assez de sommeil." },
  "6/french/pronoms-cod-coi-6/pr6-50": {
    question: "Écris deux phrases courtes : une avec 'le' et une avec 'lui'.",
    answer: "Je le vois à l'école. Je lui parle après le cours.",
  },
  "6/french/france-pays-francophones-6/ff6-50": {
    question: "Écris deux phrases simples sur un pays francophone : nom, continent et langue.",
    answer: "Le Sénégal se trouve en Afrique. On y parle français.",
  },
  "6/french/metiers-avenir-6/ma6-50": {
    question: "Écris deux phrases simples sur ton métier de rêve : métier et raison.",
    answer: "Je voudrais devenir vétérinaire. J'aime aider les animaux.",
  },
  "6/french/culture-francophone-6/cf6-50": {
    question: "Écris deux phrases simples sur un aspect de la culture francophone : un fait et ton opinion.",
    answer: "La bande dessinée est populaire en Belgique. J'aime lire Tintin.",
  },

  "6/english/passive-voice-6/pv6-42": {
    question: "Use this frame to write one passive sentence about school: 'Our classroom was ___ by ___.'",
    answer: "Our classroom was decorated by the pupils.",
  },
  "6/english/passive-voice-6/pv6-50": {
    question: "Write one simple passive sentence about chocolate using this frame: 'Chocolate is made from ___.'",
    answer: "Chocolate is made from cocoa beans.",
  },
  "6/english/conditionals-6/cond6-46": {
    question: "Complete a first conditional about school in your own way: 'If I study regularly, I will ___.'",
    answer: "If I study regularly, I will understand the lessons better.",
  },
  "6/english/conditionals-6/cond6-50": {
    question: "Write two simple first conditional sentences about school using 'If ..., I will ...'.",
    answer: "If I finish my homework, I will read a book. If I have a test, I will revise.",
  },
  "6/english/reading-skills-6/rsk6-50": {
    question: "Write one simple opinion about a character and give one clue from the text: 'I think ___ because the text says ___.'",
    answer: "I think the character is brave because the text says she entered the dark room alone.",
  },
  "6/english/writing-skills-6/ws6-18": {
    question: "Write one simple opinion about school using 'Although ..., I think ...'.",
    answer: "Although homework takes time, I think it helps me learn.",
  },
  "6/english/writing-skills-6/ws6-34": { answer: "Exercise is good because it keeps our bodies healthy." },
  "6/english/writing-skills-6/ws6-36": {
    question: "Write two simple sentences about reading: one opinion and one reason.",
    answer: "I think reading is useful. It helps me learn new words.",
  },
  "6/english/writing-skills-6/ws6-40": {
    question: "Write two simple sentences about protecting the environment: problem and action.",
    answer: "Plastic waste harms animals. We should use less plastic.",
  },
  "6/english/writing-skills-6/ws6-44": {
    question: "Write one simple opinion about homework and give one reason.",
    answer: "I think homework can be useful because it helps me practise.",
  },
  "6/english/writing-skills-6/ws6-46": {
    question: "Write three short sentences about exercise using 'first', 'also' and 'finally'.",
    answer: "First, exercise makes us strong. It also reduces stress. Finally, it can be fun with friends.",
  },
  "6/english/writing-skills-6/ws6-50": {
    question: "Write two simple sentences about learning languages: one benefit and one conclusion.",
    answer: "Languages help us talk to more people. In conclusion, learning a language is useful.",
  },
  "6/english/vocabulary-6/vb6-50": {
    question: "Write one simple sentence with the phrasal verb 'get up'.",
    answer: "I get up at seven o'clock.",
  },
  "6/english/environment-debate-6/ed6-40": {
    question: "Write one balanced sentence about cars using 'Cars are useful, but ...'.",
    answer: "Cars are useful, but they can cause air pollution.",
  },
  "6/english/environment-debate-6/ed6-48": {
    question: "Write one simple conclusion using 'In conclusion, I believe ... because ...'.",
    answer: "In conclusion, I believe recycling is important because it reduces waste.",
  },
  "6/english/environment-debate-6/ed6-50": {
    question: "Write two simple sentences about an environmental problem: opinion and consequence.",
    answer: "I think plastic pollution is a serious problem. It can harm animals in the sea.",
  },
  "6/english/culture-media-6/cm6-36": {
    question: "Explain fake news in two simple sentences: what it is and why it is dangerous.",
    answer: "Fake news is false information. It is dangerous because people may believe it.",
  },
  "6/english/culture-media-6/cm6-38": {
    question: "Write two simple checks for a news story.",
    answer: "Check who published it. Compare it with another trusted source.",
  },
  "6/english/culture-media-6/cm6-50": { answer: "This documentary is effective because it uses real interviews, which makes the audience trust it." },
  "6/english/exam-skills-6/ex6-36": {
    question: "Write three simple steps for starting a test.",
    answer: "Read the instructions. Answer the easy questions first. Check your work at the end.",
  },
};

const CONSTRAINED_FIXES: Record<string, ExercisePatch> = {
  "3/english/family-friends-3/ff3-40": {
    question: "Complete with one family word: 'I look like my ___. We have the same eyes.'",
    answer: "mother",
    altAnswers: ["father", "parent"],
  },
  "3/english/simple-sentences-3/ss3-40": {
    question: "Write the pronoun for an animal: 'Isn't ___ your dog?'",
    answer: "it",
    altAnswers: undefined,
  },
  "3/english/simple-sentences-3/ss3-50": {
    question: "Complete: 'We ___ in Grade 3. Our teacher ___ Ms Brown. We ___ happy at school.'",
    answer: "are / is / are",
  },
  "3/science/umwelt-nachhaltigkeit/un33": {
    question: "Nenne eine Naturkatastrophe: ___.",
    answer: "Erdbeben",
    altAnswers: ["Vulkanausbruch", "Überschwemmung", "Hochwasser", "Lawine", "Sturm", "Tsunami"],
  },
  "3/science/energie/en7": {
    question: "Nenne eine Sache, für die Menschen Energie brauchen: ___.",
    answer: "Licht",
    altAnswers: ["Heizung", "Kochen", "Verkehr", "Maschinen", "Computer"],
  },
  "3/german/saetze/sb51": {
    question: "Nenne ein Fragewort: ___.",
    answer: "Wer",
    altAnswers: ["Was", "Wann", "Wo", "Wie", "Warum", "Wieso", "Welche", "Welcher", "Welches"],
  },
  "5/german/wortarten-5/wa5-14": {
    question: "Nenne ein Temporaladverb (Zeitwort): ___.",
    answer: "jetzt",
    altAnswers: ["heute", "morgen", "gestern", "bald", "später", "damals", "nie", "immer"],
  },
  "6/french/passe-compose-6/pc6-50": {
    question: "Raconte la matinée de Paul: 'Ce matin, Paul ___ (se lever), ___ (prendre) une douche, ___ (partir) à l'école et ___ (rentrer) à 16h.'",
    answer: "s'est levé / a pris / est parti / est rentré",
  },
};

const reviewGuidance = {
  de: [
    "Ich habe alle Teile der Aufgabe beantwortet.",
    "Ich habe passende Wörter und die verlangte Satzform verwendet.",
    "Ich habe Grossschreibung, Rechtschreibung und Satzzeichen geprüft.",
  ],
  en: [
    "I answered every part of the task.",
    "I used suitable words and the requested sentence pattern.",
    "I checked capital letters, spelling and punctuation.",
  ],
  fr: [
    "J'ai répondu à toutes les parties de l'exercice.",
    "J'ai utilisé des mots adaptés et la structure demandée.",
    "J'ai vérifié les majuscules, l'orthographe et la ponctuation.",
  ],
  it: [
    "Ho risposto a tutte le parti dell'esercizio.",
    "Ho usato parole adatte e la struttura richiesta.",
    "Ho controllato maiuscole, ortografia e punteggiatura.",
  ],
};

const reviewHints = {
  de: ["Nutze den Satzanfang und Wörter aus diesem Thema.", "Lies deine Antwort nochmals und prüfe jeden Teil der Aufgabe."],
  en: ["Use the sentence starter and words from this topic.", "Read your answer again and check every part of the task."],
  fr: ["Utilise le début de phrase et les mots de ce thème.", "Relis ta réponse et vérifie chaque partie de l'exercice."],
  it: ["Usa l'inizio della frase e le parole di questo argomento.", "Rileggi la risposta e controlla ogni parte dell'esercizio."],
};

export function repairOpenWritingExercise(
  grade: number,
  subject: string,
  topicId: string,
  exercise: Exercise,
): Exercise {
  const key = `${grade}/${subject}/${topicId}/${exercise.id}`;
  const constrained = CONSTRAINED_FIXES[key];
  if (constrained) return { ...exercise, ...constrained };
  if (!SELF_REVIEW_KEYS.has(key)) return exercise;

  return {
    ...exercise,
    ...REWRITES[key],
    type: "self-review",
    hints: reviewHints.de,
    hintsEN: reviewHints.en,
    hintsFR: reviewHints.fr,
    hintsIT: reviewHints.it,
    reviewCriteria: reviewGuidance.de,
    reviewCriteriaEN: reviewGuidance.en,
    reviewCriteriaFR: reviewGuidance.fr,
    reviewCriteriaIT: reviewGuidance.it,
  };
}

export const OPEN_WRITING_SELF_REVIEW_COUNT = SELF_REVIEW_KEYS.size;
export const OPEN_WRITING_CONSTRAINED_COUNT = Object.keys(CONSTRAINED_FIXES).length;
export const OPEN_WRITING_CHANGED_KEYS = new Set([
  ...SELF_REVIEW_KEYS,
  ...Object.keys(CONSTRAINED_FIXES),
]);
