import { getSubjects, getTopics } from '@/data/index';
import { getLehrplanTopicTitle } from './lehrplanTopicTitles';
import type { Lang } from './i18n';
import { lehrplanCopy } from './lehrplanCopy';
export { LEHRPLAN_URL } from './lehrplanCopy';
export { getLehrplanSchema } from './lehrplanSchema';

export const SUBJECT_LABELS = lehrplanCopy.de.subjects;

export function getLehrplanOverview(lang: Lang = 'de') {
  return [1, 2, 3, 4, 5, 6].map(grade => ({
    grade,
    cycle: grade <= 2 ? 1 : 2,
    subjects: getSubjects(grade).map(subject => ({
      id: subject.id,
      name: (lehrplanCopy[lang].subjects as Record<string, string>)[subject.id] ?? subject.id,
      topics: getTopics(grade, subject.id).map(topic => ({
        id: topic.id,
        title: getLehrplanTopicTitle(topic.id, lang, topic.title),
        count: topic.exercises.length,
        codes: topic.curriculumCodes ?? [],
        url: `https://www.cleverli.ch/learn/${grade}/${subject.id}/${topic.id}`,
      })),
    })),
  }));
}
