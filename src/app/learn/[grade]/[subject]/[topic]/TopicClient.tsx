"use client";
import { Topic } from "@/types/exercise";
import ExercisePlayer from "@/components/ExercisePlayer";
import { useSession } from "@/hooks/useSession";

interface Props { topic: Topic; grade: number; subject: string; }

export default function TopicClient({ topic, grade, subject }: Props) {
  const { isPremium } = useSession();
  return <ExercisePlayer topic={topic} grade={grade} subject={subject} isPremium={isPremium} />;
}
