import type { Session } from "@/hooks/useSession";

export const EXERCISE_ISSUE_REPORTER_USER_ID = "d2a84762-7443-46a3-9fed-bed23bc7cb75";
export const EXERCISE_ISSUE_REPORTER_EMAIL = "toskina.alexandra@gmail.com";

export function canReportExerciseIssue(session: Pick<Session, "email" | "userId"> | null | undefined) {
  return Boolean(
    session?.userId === EXERCISE_ISSUE_REPORTER_USER_ID
    && session.email?.toLowerCase() === EXERCISE_ISSUE_REPORTER_EMAIL,
  );
}
