import { getCatalogSubjects, getTopicSummaries } from "@/data/topicCatalog";
import { notFound, permanentRedirect } from "next/navigation";

/** Validate before metadata or rendering; never turn arbitrary slugs into SEO pages. */
export function validateLearningRoute(grade: string, subject: string, topicId?: string) {
  if (!/^[1-6]$/.test(grade)) notFound();
  const gradeNumber = Number(grade);
  const canonicalSubject = subject === "nt" || subject === "rzg" ? "science" : subject;
  if (!getCatalogSubjects(gradeNumber).some(({ id }) => id === canonicalSubject)) notFound();
  const topics = getTopicSummaries(gradeNumber, canonicalSubject);
  if (!topics.length || (topicId !== undefined && !topics.some(({ id }) => id === topicId))) notFound();
  if (canonicalSubject === "french" && gradeNumber <= 4 && process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED !== "true") notFound();
  if (subject !== canonicalSubject) {
    permanentRedirect(`/learn/${grade}/${canonicalSubject}${topicId === undefined ? "" : `/${topicId}`}`);
  }
  return topics;
}
