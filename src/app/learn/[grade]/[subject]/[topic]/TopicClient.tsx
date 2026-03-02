"use client";
import { Topic } from "@/types/exercise";
import ExercisePlayer from "@/components/ExercisePlayer";
import { useSession } from "@/hooks/useSession";

interface Props { topic: Topic; grade: number; subject: string; allTopics: Topic[]; topicIndex: number; }

export default function TopicClient({ topic, grade, subject, allTopics, topicIndex }: Props) {
  const { isPremium } = useSession();
  return (
    <ExercisePlayer
      topic={topic}
      grade={grade}
      subject={subject}
      isPremium={isPremium}
      allTopics={allTopics}
      topicIndex={topicIndex}
    />
  );
}
