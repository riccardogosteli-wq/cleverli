export type WorksheetTopic = { id: string; grade: number; subject: string; topicId: string; title: string; curriculum: { code: string; scope: string; url: string } };
export const worksheetSubjects: Record<string, string> = { math: "Mathematik", german: "Deutsch", science: "Natur, Mensch, Gesellschaft", english: "Englisch", french: "Französisch", mi: "Medien und Informatik" };
