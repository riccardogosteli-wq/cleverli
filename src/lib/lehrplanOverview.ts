import { getSubjects, getTopics } from '@/data/index';

export const LEHRPLAN_URL = 'https://www.cleverli.ch/lehrplanbezug';
export const SUBJECT_LABELS: Record<string, string> = {
  math: 'Mathematik', german: 'Deutsch', science: 'Natur, Mensch, Gesellschaft (NMG)', english: 'Englisch', french: 'Französisch', mi: 'Medien und Informatik',
};

export function getLehrplanOverview() {
  return [1, 2, 3, 4, 5, 6].map(grade => ({
    grade,
    cycle: grade <= 2 ? 1 : 2,
    subjects: getSubjects(grade).map(subject => ({
      id: subject.id,
      name: SUBJECT_LABELS[subject.id] ?? subject.id,
      topics: getTopics(grade, subject.id).map(topic => ({
        id: topic.id,
        title: topic.title,
        count: topic.exercises.length,
        codes: topic.curriculumCodes ?? [],
        url: `https://www.cleverli.ch/learn/${grade}/${subject.id}/${topic.id}`,
      })),
    })),
  }));
}

export function getLehrplanSchema(rows: ReturnType<typeof getLehrplanOverview>) {
  const resources = rows.flatMap(row => row.subjects.flatMap(subject => subject.topics.map(topic => ({
    '@type': 'LearningResource',
    '@id': `${topic.url}#learning-resource`,
    name: topic.title,
    url: topic.url,
    inLanguage: 'de-CH',
    learningResourceType: 'Interaktive Übungen',
    educationalLevel: `${row.grade}. Klasse, Zyklus ${row.cycle}`,
    about: subject.name,
    educationalAlignment: topic.codes.map(code => ({
      '@type': 'AlignmentObject',
      alignmentType: 'educationalSubject',
      educationalFramework: 'Lehrplan 21',
      targetName: code,
    })),
  }))));
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': LEHRPLAN_URL,
    url: LEHRPLAN_URL,
    name: 'Lehrplanbezug: Themen und Übungen bei Cleverli',
    inLanguage: 'de-CH',
    description: 'Bestehende Lehrplanzuordnungen der Cleverli-Themen für die 1. bis 6. Klasse. Keine Aussage zur vollständigen Abdeckung einzelner Kompetenzen.',
    citation: ['https://www.lehrplan21.ch/', 'https://zh.lehrplan.ch/'],
    mainEntity: {
      '@type': 'ItemList', numberOfItems: resources.length,
      itemListElement: resources.map((item, index) => ({ '@type': 'ListItem', position: index + 1, item })),
    },
  };
}
