/** Internal/test rollout gate for the canton-profile UI. */

type RolloutMode = "internal" | "all";

type CurriculumRolloutContext = {
  email?: string | null;
  visitorId?: string | null;
};

const DEFAULT_INTERNAL_EMAILS = [
  "test@cleverli.ch",
  "riccardogosteli@gmail.com",
];

const rolloutEnabled = process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ENABLED === "true";
const configuredMode = process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_ROLLOUT_MODE;
const rolloutMode: RolloutMode = configuredMode === "all" ? "all" : "internal";

function splitCsv(value?: string) {
  return (value ?? "")
    .split(",")
    .map(item => item.trim().toLowerCase())
    .filter(Boolean);
}

function internalEmails() {
  return new Set([
    ...DEFAULT_INTERNAL_EMAILS,
    ...splitCsv(process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_INTERNAL_EMAILS),
  ]);
}

function internalDomains() {
  return new Set(splitCsv(process.env.NEXT_PUBLIC_CURRICULUM_PROFILES_INTERNAL_DOMAINS));
}

function normaliseEmail(email?: string | null) {
  return (email ?? "").trim().toLowerCase();
}

function isInternalEmail(email?: string | null) {
  const normalised = normaliseEmail(email);
  if (!normalised) return false;
  if (internalEmails().has(normalised)) return true;
  const domain = normalised.split("@")[1];
  return Boolean(domain && internalDomains().has(domain));
}

export function curriculumRolloutBucket(visitorId: string): number {
  let hash = 2166136261;
  for (let index = 0; index < visitorId.length; index += 1) {
    hash ^= visitorId.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 100;
}

function parseStoredSessionEmail() {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem("cleverli_session");
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { email?: unknown };
    return typeof parsed.email === "string" ? parsed.email : null;
  } catch {
    return null;
  }
}

export function getCurriculumRolloutContext(visitorId?: string | null): CurriculumRolloutContext {
  return {
    visitorId,
    email: parseStoredSessionEmail(),
  };
}

export function isCurriculumProfilesRolloutEnabled(
  context?: CurriculumRolloutContext | string | null,
): boolean {
  if (!rolloutEnabled) return false;
  if (rolloutMode === "all") return true;

  if (typeof context === "string") {
    return isInternalEmail(context);
  }

  return isInternalEmail(context?.email);
}
