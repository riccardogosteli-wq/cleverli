import type { getLehrplanOverview } from './lehrplanOverview';
import type { Lang } from './i18n';
import { lehrplanCopy, lehrplanGrade, lehrplanUrl } from './lehrplanCopy';

export function getLehrplanSchema(rows: ReturnType<typeof getLehrplanOverview>, lang: Lang = 'de') {
  const c = lehrplanCopy[lang];
  const resources = rows.flatMap(row => row.subjects.flatMap(subject => subject.topics.map(topic => ({
    '@type': 'LearningResource',
    '@id': `${topic.url}${lang === 'de' ? '' : `?lang=${lang}`}#learning-resource`,
    name: topic.title,
    url: lang === 'de' ? topic.url : `${topic.url}?lang=${lang}`,
    inLanguage: c.locale,
    learningResourceType: c.resource,
    educationalLevel: `${lehrplanGrade(row.grade, lang)}, ${c.cycle} ${row.cycle}`,
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
    '@id': lehrplanUrl(lang),
    url: lehrplanUrl(lang),
    name: c.title,
    inLanguage: c.locale,
    description: c.schemaDescription,
    citation: ['https://www.lehrplan21.ch/', 'https://zh.lehrplan.ch/'],
    mainEntity: {
      '@type': 'ItemList', numberOfItems: resources.length,
      itemListElement: resources.map((item, index) => ({ '@type': 'ListItem', position: index + 1, item })),
    },
  };
}
