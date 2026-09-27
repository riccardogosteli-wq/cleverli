import { teacherAccountActive, type TeacherAccount } from "@/lib/teacherAccount";

/** Mirrors current app effective access; billing presentation is not entitlement. */
export function worksheetAccess(profile: { premium: boolean; premium_until: string | null } | null, teacher: TeacherAccount | null, now = Date.now()) {
  return teacherAccountActive(teacher, now) || Boolean(profile?.premium === true &&
    (profile.premium_until === null || (Number.isFinite(Date.parse(profile.premium_until)) && Date.parse(profile.premium_until) > now)));
}
export const PRIVATE_HEADERS = { "Cache-Control": "private, no-store, max-age=0", "Vary": "Authorization", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow" };
