import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favorites";

export async function getFavoriteIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
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