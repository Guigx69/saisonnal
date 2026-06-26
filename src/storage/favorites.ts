import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favorites";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

async function resetInvalidFavorites() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // Storage cleanup failed; callers should still receive a safe fallback.
  }
}

export async function getFavoriteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (isStringArray(parsed)) return parsed;

    await resetInvalidFavorites();
    return [];
  } catch {
    await resetInvalidFavorites();
    return [];
  }
}

export async function isFavorite(id: string): Promise<boolean> {
  const ids = await getFavoriteIds();
  return ids.includes(id);
}

export async function toggleFavorite(id: string): Promise<string[]> {
  const ids = await getFavoriteIds();
  const next = ids.includes(id)
    ? ids.filter((x) => x !== id)
    : [...ids, id];

  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
