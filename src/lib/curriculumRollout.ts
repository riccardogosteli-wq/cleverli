/** Deterministic, sticky rollout for the canton-profile UI. */

const ENABLED = process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED === "true";

function rolloutPercent() {
  const parsed = Number(process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ROLLOUT_PERCENT ?? "0");
  if (!Number.isFinite(parsed)) return 0;
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

export function curriculumRolloutBucket(visitorId: string): number {
  let hash = 2166136261;
  for (let index = 0; index < visitorId.length; index += 1) {
    hash ^= visitorId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 100;
}

export function isCurriculumProfilesRolloutEnabled(visitorId?: string | null): boolean {
  if (!ENABLED || !visitorId) return false;
  return curriculumRolloutBucket(visitorId) < rolloutPercent();
}
