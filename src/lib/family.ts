// ── Family / Multi-profile system ────────────────────────────────────────────
// Stores up to 3 child profiles in localStorage.
// Each profile is keyed by a local UUID so we can switch without auth.

import { Profile } from "@/hooks/useProfile";

export const MAX_PROFILES = 3;
export const FAMILY_KEY = "cleverli_family";
export const ACTIVE_PROFILE_KEY = "cleverli_active_profile";

export interface FamilyMember {
  id: string;
  name: string;
  avatar: string;   // emoji
  grade: number;
  createdAt: string;
}

export interface FamilyStore {
  members: FamilyMember[];
}

export function loadFamily(): FamilyStore {
  if (typeof window === "undefined") return { members: [] };
  try {
    const raw = localStorage.getItem(FAMILY_KEY);
    return raw ? JSON.parse(raw) : { members: [] };
  } catch { return { members: [] }; }
}

export function saveFamily(store: FamilyStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAMILY_KEY, JSON.stringify(store));
}

export function addMember(name: string, avatar: string, grade: number): FamilyMember {
  const store = loadFamily();
  if (store.members.length >= MAX_PROFILES) throw new Error("Max 3 profiles");
  // Use crypto.randomUUID() so the same ID works in Supabase (valid UUID)
  const id = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  const member: FamilyMember = { id, name, avatar, grade, createdAt: new Date().toISOString() };
  store.members.push(member);
  saveFamily(store);
  return member;
}

export function removeMember(id: string) {
  const store = loadFamily();
  store.members = store.members.filter(m => m.id !== id);
  saveFamily(store);
  // Clean up their profile data
  if (typeof window !== "undefined") {
    localStorage.removeItem(`cleverli_profile_${id}`);
  }
}

export function getActiveProfileId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfileId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

// Load profile for a specific member (profile key includes member id)
export function loadMemberProfile(id: string): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`cleverli_profile_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export const AVATARS = ["🦊","🐻","🐼","🦁","🐯","🐨","🐸","🐧","🦋","🦄","🐶","🐱","🐰","🐹","🦖","🦕","🐬","🦅"];
export const GRADE_OPTIONS = [1, 2, 3];
