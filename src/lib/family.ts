// ── Family / Multi-profile system ────────────────────────────────────────────
// Stores up to 3 child profiles in localStorage.
// Each profile is keyed by a local UUID so we can switch without auth.

import type { Profile } from "@/hooks/useProfile";
import {
  parseCurriculumSelection,
  type CurriculumSelection,
} from "@/lib/curriculumProfiles";
import {
  getActiveProfileStorageKey,
  clearLocalProgressForChild,
  getFamilyStorageKey,
  getLastGradeStorageKey,
  getProfileStorageKey,
  hasAuthenticatedStorageScope,
} from "@/lib/accountScopedStorage";

export const MAX_PROFILES = 3;
export const FAMILY_KEY = "cleverli_family";
export const ACTIVE_PROFILE_KEY = "cleverli_active_profile";

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;   // emoji
  grade: number;
  createdAt: string;
  curriculum?: CurriculumSelection;
}

export interface FamilyStore {
  members: FamilyMember[];
}

export function loadFamily(): FamilyStore {
  if (typeof window === "undefined") return { members: [] };
  try {
    const scopedKey = getFamilyStorageKey();
    const raw = localStorage.getItem(scopedKey) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(FAMILY_KEY)
    );
    if (!raw) return { members: [] };
    const parsed = JSON.parse(raw);
    // Migration: old format used "children" instead of "members"
    if (Array.isArray(parsed.children) && !parsed.members) {
      const migrated: FamilyStore = { members: parsed.children };
      saveFamily(migrated); // write back in new format
      return migrated;
    }
    const members = Array.isArray(parsed.members)
      ? parsed.members.map((member: FamilyMember) => ({
          ...member,
          curriculum: parseCurriculumSelection(member.curriculum),
        }))
      : [];
    return { members };
  } catch { return { members: [] }; }
}

export function saveFamily(store: FamilyStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getFamilyStorageKey(), JSON.stringify(store));
}

export function addMember(
  name: string,
  avatar: string,
  grade: number,
  curriculum?: CurriculumSelection,
): FamilyMember {
  const store = loadFamily();
  if (store.members.length >= MAX_PROFILES) throw new Error("Max 3 profiles");
  // Use crypto.randomUUID() so the same ID works in Supabase (valid UUID)
  const id = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const member: FamilyMember = {
    id,
    name,
    avatar,
    grade,
    createdAt: new Date().toISOString(),
    ...(curriculum ? { curriculum } : {}),
  };
  store.members.push(member);
  saveFamily(store);
  return member;
}

export function updateMemberCurriculum(id: string, curriculum: CurriculumSelection): FamilyMember | null {
  const store = loadFamily();
  const member = store.members.find(candidate => candidate.id === id);
  if (!member) return null;
  member.curriculum = curriculum;
  saveFamily(store);
  return member;
}

export function getActiveCurriculumSelection(): CurriculumSelection | undefined {
  const activeId = getActiveProfileId();
  if (!activeId) return undefined;
  return loadFamily().members.find(member => member.id === activeId)?.curriculum;
}

export function removeMember(id: string) {
  const store = loadFamily();
  store.members = store.members.filter(m => m.id !== id);
  saveFamily(store);
  // Clean up their profile data
  clearLocalProgressForChild(id);
}

export function getActiveProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(getActiveProfileStorageKey()) ?? (
    hasAuthenticatedStorageScope() ? null : localStorage.getItem(ACTIVE_PROFILE_KEY)
  );
}

export function setActiveProfileId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getActiveProfileStorageKey(), id);
  const member = loadFamily().members.find(candidate => candidate.id === id);
  if (member?.grade) localStorage.setItem(getLastGradeStorageKey(), String(member.grade));
}

// Load profile for a specific member (profile key includes member id)
export function loadMemberProfile(id: string): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getProfileStorageKey(id)) ?? (
      hasAuthenticatedStorageScope() ? null : localStorage.getItem(`cleverli_profile_${id}`)
    );
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export const AVATARS = ["🦊","🐻","🐼","🦁","🐯","🐨","🐸","🐧","🦋","🦄","🐶","🐱","🐰","🐹","🦖","🦕","🐬","🦅"];
export const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6];
