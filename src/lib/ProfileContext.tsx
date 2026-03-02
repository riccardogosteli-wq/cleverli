"use client";
import { createContext, useContext, ReactNode } from "react";
import { useProfile } from "@/hooks/useProfile";
import { AchievementId } from "@/lib/achievements";
import { Level } from "@/lib/xp";
import { Profile } from "@/hooks/useProfile";

interface ProfileContextValue {
  profile: Profile;
  loaded: boolean;
  level: Level;
  nextLevel: Level | null;
  newAchievements: AchievementId[];
  xpGained: number;
  leveledUp: boolean;
  recordAnswer: ReturnType<typeof useProfile>["recordAnswer"];
  clearNewAchievements: () => void;
  clearXpGained: () => void;
  clearLeveledUp: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const profileData = useProfile();
  return (
    <ProfileContext.Provider value={profileData}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfileContext must be used within ProfileProvider");
  return ctx;
}
