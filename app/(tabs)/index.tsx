// app/(tabs)/index.tsx
import { ProductCard } from "@/components/ProductCard";
import { Theme } from "@/constants/theme";
import products from "@/src/data/products.json";
import type { Product } from "@/src/types/product";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

function MonthNameFR(month: number) {
  const names = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return names[month - 1] ?? `Mois ${month}`;
}

type Filter = "all" | "fruit" | "legume";

export default function HomeScreen() {
  const monthNow = new Date().getMonth() + 1;

  // ✅ mois sélectionné (flèches)
  const [month, setMonth] = useState(monthNow);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  function prevMonth() {
    setMonth((m) => (m === 1 ? 12 : m - 1));
  }
  function nextMonth() {
    setMonth((m) => (m === 12 ? 1 : m + 1));
  }

  const inSeason = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (products as Product[])
      .filter((p) => p.seasonMonths.includes(month))
      .filter((p) => (filter === "all" ? true : p.category === filter))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) : true))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }, [month, query, filter]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand header */}
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>

        {/* ✅ pas de wrap du titre */}
        <View style={styles.brandText}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            Saisonnal
          </Text>
          <Text numberOfLines={2} style={styles.subtitle}>
            Manger de saison, simplement
          </Text>
        </View>
      </View>

      {/* Month hero */}
      <View style={styles.heroCard}>
        <Text style={styles.kicker}>EN SAISON</Text>

        {/* ✅ flèches + mois sur la même ligne (premium + stable) */}
        <View style={styles.heroTopRow}>
          <View style={styles.monthNav}>
            <Pressable
              onPress={prevMonth}
              hitSlop={12}
              style={({ pressed }) => [styles.arrowBtn, pressed && styles.pressed]}
            >
              <Text style={styles.arrowText}>‹</Text>
            </Pressable>

            <Text
              style={styles.monthTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {MonthNameFR(month)}
            </Text>

            <Pressable
              onPress={nextMonth}
              hitSlop={12}
              style={({ pressed }) => [styles.arrowBtn, pressed && styles.pressed]}
            >
              <Text style={styles.arrowText}>›</Text>
            </Pressable>
          </View>

          <View style={styles.monthBadge}>
            <Text style={styles.monthBadgeNum}>{month}</Text>
            <Text style={styles.monthBadgeDen}>/12</Text>
          </View>
        </View>

        <Text style={styles.heroSub}>
          Consomme au bon moment, sans te compliquer la vie.
        </Text>
      </View>

      {/* Search + filters */}
      <View style={styles.searchCard}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher un fruit ou un légume…"
          placeholderTextColor={Theme.muted}
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={styles.filters}>
          {(["all", "fruit", "legume"] as const).map((k) => {
            const label =
              k === "all" ? "Tout" : k === "fruit" ? "Fruits" : "Légumes";
            const active = filter === k;

            return (
              <Pressable
                key={k}
                onPress={() => setFilter(k)}
                style={({ pressed }) => [
                  styles.pill,
                  active && styles.pillActive,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>En saison</Text>
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{inSeason.length}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        {inSeason.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onPress={() => router.push(`../product/${p.id}`)}
          />
        ))}

        {inSeason.length === 0 && (
          <Text style={styles.empty}>
            Rien trouvé pour “{query.trim() || "…"}”.
          </Text>
        )}
      </View>

      <Text style={styles.footerHint}>
        Astuce : navigue les mois pour anticiper fruits & légumes.
      </Text>

      <View style={{ height: Theme.space[28] }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Theme.bg },
  container: {
    paddingHorizontal: Theme.space[20],
    paddingTop: Theme.space[16],
    gap: Theme.space[14],
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.space[12],
    marginTop: Theme.space[6],
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Theme.text,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Theme.shadow.color,
    shadowOpacity: Theme.shadow.opacity,
    shadowRadius: Theme.shadow.radius,
    shadowOffset: Theme.shadow.offset,
    elevation: Theme.shadow.elevation,
  },
  logoText: { color: "#fff", fontWeight: "900", fontSize: 18 },

  brandText: { flex: 1, minWidth: 0 },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: Theme.text,
    letterSpacing: -0.6,
    flexShrink: 1,
  },
  subtitle: { fontSize: 13, fontWeight: "700", color: Theme.muted },

  heroCard: {
    backgroundColor: Theme.card,
    borderRadius: Theme.r.l,
    borderWidth: 1,
    borderColor: Theme.line,
    padding: Theme.space[18],
    shadowColor: Theme.shadow.color,
    shadowOpacity: Theme.shadow.opacity,
    shadowRadius: Theme.shadow.radius,
    shadowOffset: Theme.shadow.offset,
    elevation: Theme.shadow.elevation,
    gap: Theme.space[10],
  },
  kicker: {
    fontSize: 12,
    color: Theme.muted,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.space[12],
  },

  monthNav: {
    flex: 1,
    minWidth: 0,
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.line,
    backgroundColor: Theme.bg,
    paddingHorizontal: Theme.space[8],
    flexDirection: "row",
    alignItems: "center",
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.line,
    backgroundColor: Theme.card,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  arrowText: {
    fontSize: 22,
    fontWeight: "900",
    color: Theme.text,
    lineHeight: 22,
    marginTop: -1,
  },
  monthTitle: {
    flex: 1,
    minWidth: 0,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: Theme.text,
    letterSpacing: -0.5,
    paddingHorizontal: Theme.space[8],
  },

  monthBadge: {
    width: 64,
    height: 64,
    borderRadius: Theme.r.m,
    backgroundColor: Theme.softBg,
    borderWidth: 1,
    borderColor: Theme.line,
    alignItems: "center",
    justifyContent: "center",
  },
  monthBadgeNum: { color: Theme.text, fontWeight: "900", fontSize: 18 },
  monthBadgeDen: { color: Theme.muted, fontWeight: "900", fontSize: 12, marginTop: 2 },

  heroSub: {
    color: Theme.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  searchCard: {
    backgroundColor: Theme.card,
    borderRadius: Theme.r.l,
    borderWidth: 1,
    borderColor: Theme.line,
    padding: Theme.space[14],
    gap: Theme.space[12],
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
    backgroundColor: Theme.softBg,
    color: Theme.text,
    fontSize: 14,
    fontWeight: "700",
  },

  filters: { flexDirection: "row", gap: Theme.space[10], flexWrap: "wrap" },
  pill: {
    paddingHorizontal: Theme.space[12],
    paddingVertical: Theme.space[10],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.line,
    backgroundColor: Theme.softBg,
  },
  pillActive: { backgroundColor: Theme.text, borderColor: Theme.text },
  pillText: { color: Theme.text, fontSize: 13, fontWeight: "900" },
  pillTextActive: { color: "#fff" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Theme.space[6],
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

  grid: { flexDirection: "row", flexWrap: "wrap", gap: Theme.space[12] },

  empty: {
    color: Theme.muted,
    fontWeight: "700",
    fontStyle: "italic",
    marginTop: Theme.space[12],
  },
  footerHint: { color: Theme.muted, fontSize: 12, fontWeight: "700", marginTop: Theme.space[10] },
});
