import { ProductCard } from "@/components/ProductCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconButton } from "@/components/ui/IconButton";
import { Pill } from "@/components/ui/Pill";
import { SearchBar } from "@/components/ui/SearchBar";
import { Theme } from "@/constants/theme";
import products from "@/src/data/products.json";
import { getPreferences } from "@/src/storage/preferences";
import type { Product } from "@/src/types/product";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "fruit", label: "Fruits" },
  { key: "legume", label: "Légumes" },
];

export default function HomeScreen() {
  const monthNow = new Date().getMonth() + 1;

  const [month, setMonth] = useState(monthNow);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let isMounted = true;

    getPreferences()
      .then((prefs) => {
        if (isMounted) setFilter(prefs.defaultFilter);
      })
      .catch(() => {
        // Keep the current default if preferences cannot be read.
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  const countLabel = inSeason.length === 1 ? "1 produit" : `${inSeason.length} produits`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.brandRow}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>S</Text>
        </View>

        <View style={styles.brandText}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
            Saisonnal
          </Text>
          <Text numberOfLines={2} style={styles.subtitle}>
            Manger de saison, simplement
          </Text>
        </View>
      </View>

      <Card style={styles.heroCard}>
        <Text style={styles.kicker}>EN SAISON</Text>

        <View style={styles.heroTopRow}>
          <View style={styles.monthNav}>
            <IconButton
              accessibilityLabel="Mois précédent"
              onPress={prevMonth}
              style={styles.arrowBtn}
            >
              <Text style={styles.arrowText}>‹</Text>
            </IconButton>

            <Text
              style={styles.monthTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {MonthNameFR(month)}
            </Text>

            <IconButton
              accessibilityLabel="Mois suivant"
              onPress={nextMonth}
              style={styles.arrowBtn}
            >
              <Text style={styles.arrowText}>›</Text>
            </IconButton>
          </View>

          <View style={styles.monthBadge}>
            <Text style={styles.monthBadgeNum}>{month}</Text>
            <Text style={styles.monthBadgeDen}>/12</Text>
          </View>
        </View>

        <Text style={styles.heroSub}>
          Consomme au bon moment, sans te compliquer la vie.
        </Text>
      </Card>

      <View style={styles.controls}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Rechercher un fruit ou un légume…"
          accessibilityLabel="Rechercher un fruit ou un légume"
        />

        <View style={styles.filters}>
          {FILTERS.map((item) => {
            const active = filter === item.key;

            return (
              <Pressable
                key={item.key}
                accessibilityRole="button"
                accessibilityLabel={`Filtrer par ${item.label}`}
                accessibilityState={{ selected: active }}
                onPress={() => setFilter(item.key)}
                style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}
              >
                <Pill label={item.label} selected={active} />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>En saison</Text>
        <Pill label={countLabel} tone="brand" />
      </View>

      <View style={styles.grid}>
        {inSeason.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onPress={() =>
              router.push({
                pathname: "/product/[id]",
                params: { id: p.id },
              })
            }
          />
        ))}

        {inSeason.length === 0 && (
          <EmptyState
            style={styles.empty}
            message={`Rien trouvé pour “${query.trim() || "…"}”.`}
          />
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
    ...Theme.shadows.card,
  },
  logoText: { color: Theme.card, fontWeight: "900", fontSize: 18 },

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
    padding: Theme.space[18],
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
    width: 44,
    height: 44,
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

  controls: {
    gap: Theme.space[12],
  },

  filters: { flexDirection: "row", gap: Theme.space[10], flexWrap: "wrap" },
  filterButton: {
    minHeight: 44,
    justifyContent: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Theme.space[6],
  },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: Theme.text, letterSpacing: -0.3 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: Theme.space[12], alignItems: "stretch" },

  empty: {
    flexBasis: "100%",
    marginTop: Theme.space[12],
  },
  footerHint: { color: Theme.muted, fontSize: 12, fontWeight: "700", marginTop: Theme.space[10] },
});
