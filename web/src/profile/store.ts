import { create } from "zustand";
import { Profile } from "../data/profile.schema";
import { DEFAULT_PROFILE } from "./defaults";

export const STORAGE_KEY = "where:profile:v1";

function loadInitial(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return Profile.parse(JSON.parse(raw));
  } catch {
    return DEFAULT_PROFILE;
  }
}

function persist(p: Profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore quota errors */
  }
}

interface ProfileState {
  profile: Profile;
  setProfile: (p: Profile) => void;
  updateSection: <K extends keyof Profile>(key: K, patch: Partial<Profile[K]>) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: loadInitial(),
  setProfile: (p) => {
    set({ profile: p });
    persist(p);
  },
  updateSection: (key, patch) => {
    const next = { ...get().profile, [key]: { ...get().profile[key], ...patch } } as Profile;
    set({ profile: next });
    persist(next);
  },
}));
