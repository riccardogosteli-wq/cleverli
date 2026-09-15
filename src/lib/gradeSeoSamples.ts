import type { Exercise, Topic } from "@/types/exercise";
import type { GradeSubjectSeoPage } from "@/lib/gradeSubjectSeo";
import { getSampleExercises } from "@/lib/seoContent";

type GradeSeoSample = Exercise & { topicTitle: string; explanation?: string };

// Curated marketing examples never change the exercise pool or practice order.
export function getGradeSeoSamples(page: GradeSubjectSeoPage, topics: Topic[]): GradeSeoSample[] {
  if (page.sampleRefs) {
    return page.sampleRefs.map((ref) => {
      const topic = topics.find((item) => item.id === ref.topicId);
      const exercise = topic?.exercises.find((item) => item.id === ref.exerciseId);
      if (!topic || !exercise?.question) {
        throw new Error(`Missing SEO sample: ${page.slug}/${ref.topicId}/${ref.exerciseId}`);
      }
      return { ...exercise, topicTitle: topic.title, explanation: ref.explanation };
    });
  }
  return topics.flatMap((topic) => getSampleExercises(topic, 2).map((exercise) => ({
    ...exercise,
    topicTitle: topic.title,
  }))).filter((exercise) => Boolean(exercise.question)).slice(0, 5);
}
