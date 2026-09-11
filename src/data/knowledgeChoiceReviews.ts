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


];

const reviewsByKey = new Map(KNOWLEDGE_CHOICE_REVIEWS.map((review, index) => [review.key, { review, index }]));

export function applyReviewedKnowledgeChoices(grade: number, subject: string, topics: Topic[]): Topic[] {
  return topics.map(topic => ({ ...topic, exercises: topic.exercises.map(exercise => {
    const entry = reviewsByKey.get(`${grade}/${subject}/${topic.id}/${exercise.id}`);
    if (!entry) return exercise;
    const { review, index } = entry;
    const result: Exercise = { ...exercise, type: 'multiple-choice', completeLocalization: true };
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
