import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ProductCategory } from "@/src/types/product";

const KEY = "saisonnal:preferences:v1";

export type Preferences = {
  defaultFilter: "all" | ProductCategory;
  hideOffSeasonMonths: boolean;
  ecoMode: boolean;
  preferLocal: boolean;
  notificationsEnabled: boolean; // v2
};

export const DEFAULT_PREFERENCES: Preferences = {
  defaultFilter: "all",
  hideOffSeasonMonths: false,
  ecoMode: true,
  preferLocal: false,
  notificationsEnabled: false,
};

export async function getPreferences(): Promise<Preferences> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULT_PREFERENCES;

  try {
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PREFERENCES, ...(parsed ?? {}) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export async function setPreferences(prefs: Preferences) {
  await AsyncStorage.setItem(KEY, JSON.stringify(prefs));
}

export async function updatePreferences(patch: Partial<Preferences>) {
  const current = await getPreferences();
  const next = { ...current, ...patch };
  await setPreferences(next);
  return next;
}

export async function resetPreferences() {
  await AsyncStorage.removeItem(KEY);
}
