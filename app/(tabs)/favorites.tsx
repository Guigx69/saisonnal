// app/(tabs)/favorites.tsx
import * as Haptics from "expo-haptics";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ProductCard } from "@/components/ProductCard";
import { Theme } from "@/constants/theme";
import products from "@/src/data/products.json";
import { getFavoriteIds, toggleFavorite } from "@/src/storage/favorites";
import type { Product } from "@/src/types/product";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Product>);

export default function FavoritesScreen() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  // animations
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(10)).current;

  const load = useCallback(async () => {
    const ids = await getFavoriteIds();
    setFavIds(ids);

    fade.setValue(0);
    slide.setValue(10);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, [fade, slide]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const favorites = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = (products as Product[]).filter((p) => favIds.includes(p.id));
    return list
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [favIds, query]);

  const onRemove = useCallback(async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleFavorite(id);
    const ids = await getFavoriteIds();
    setFavIds(ids);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.row}>
        <ProductCard
          variant="list"
          product={item}
          onPress={() => router.push(`../product/${item.id}`)}
          rightSlot={
            <Pressable
              onPress={() => onRemove(item.id)}
              hitSlop={10}
              style={({ pressed }) => [
                styles.actionBtn,
                pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Text style={styles.actionIcon}>🗑️</Text>
            </Pressable>
          }
        />
      </View>
    ),
    [onRemove]
  );

  return (
    <View style={styles.screen}>
      <AnimatedFlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        style={{ flex: 1, opacity: fade, transform: [{ translateY: slide }] }}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Favoris</Text>
              <Text style={styles.subtitle}>Tes produits préférés, à portée de pouce.</Text>
            </View>

            <View style={styles.searchCard}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Rechercher dans tes favoris…"
                placeholderTextColor={Theme.muted}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mes favoris</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{favorites.length}</Text>
              </View>
            </View>

            {favorites.length === 0 ? (
              <Text style={styles.empty}>
                Aucun favori pour le moment. Ajoute-en depuis une fiche produit ❤️
              </Text>
            ) : null}
          </>
        }
        ListFooterComponent={<View style={{ height: Theme.space[24] }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Theme.bg },

  container: {
    paddingHorizontal: Theme.space[20],
    paddingTop: Theme.space[16],
    paddingBottom: Theme.space[24],
  },

  header: { gap: Theme.space[6], marginTop: Theme.space[6] },
  title: { fontSize: 40, fontWeight: "900", color: Theme.text, letterSpacing: -0.9 },
  subtitle: { color: Theme.muted, fontWeight: "700", fontSize: 14 },

  searchCard: {
    marginTop: Theme.space[14],
    backgroundColor: Theme.card,
    borderRadius: Theme.r.l,
    borderWidth: 1,
    borderColor: Theme.line,
    padding: Theme.space[14],
    shadowColor: Theme.shadow.color,
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  searchInput: {
    height: 48,
    borderRadius: Theme.r.m,
    paddingHorizontal: Theme.space[14],
    borderWidth: 1,
    borderColor: Theme.line,
    backgroundColor: Theme.brandSoft,
    color: Theme.text,
    fontSize: 14,
    fontWeight: "700",
  },

  sectionHeader: {
    marginTop: Theme.space[16],
    marginBottom: Theme.space[12],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: Theme.text, letterSpacing: -0.3 },

  countPill: {
    paddingHorizontal: Theme.space[12],
    paddingVertical: Theme.space[8],
    borderRadius: 999,
    backgroundColor: Theme.card,
    borderWidth: 1,
    borderColor: Theme.line,
  },
  countPillText: { color: Theme.text, fontWeight: "900", fontSize: 12 },

  row: {
    marginBottom: Theme.space[12],
  },

  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.line,
    backgroundColor: Theme.card,
    alignItems: "center",
    justifyContent: "center",
  },
  actionIcon: { fontSize: 18 },

  empty: {
    marginTop: Theme.space[12],
    color: Theme.muted,
    fontWeight: "700",
    fontStyle: "italic",
  },
});