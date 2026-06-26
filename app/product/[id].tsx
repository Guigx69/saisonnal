// app/product/[id].tsx
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Theme } from "@/constants/theme";
import products from "@/src/data/products.json";
import { isFavorite, toggleFavorite } from "@/src/storage/favorites";
import { getPreferences, type Preferences } from "@/src/storage/preferences";

type Product = {
  id: string;
  name: string;
  category: "fruit" | "legume";
  seasonMonths: number[];
  origins?: string[];
};

const MONTHS = [
  { month: 1, key: "J", label: "Janvier" },
  { month: 2, key: "F", label: "Février" },
  { month: 3, key: "M", label: "Mars" },
  { month: 4, key: "A", label: "Avril" },
  { month: 5, key: "M", label: "Mai" },
  { month: 6, key: "J", label: "Juin" },
  { month: 7, key: "J", label: "Juillet" },
  { month: 8, key: "A", label: "Août" },
  { month: 9, key: "S", label: "Septembre" },
  { month: 10, key: "O", label: "Octobre" },
  { month: 11, key: "N", label: "Novembre" },
  { month: 12, key: "D", label: "Décembre" },
] as const;

function productEmoji(id: string, category: Product["category"]) {
  const map: Record<string, string> = {
    orange: "🍊",
    clementine: "🍊",
    mandarine: "🍊",
    pomme: "🍎",
    poire: "🍐",
    citron: "🍋",
    poireau: "🥬",
    "chou-fleur": "🥦",
    brocoli: "🥦",
    carotte: "🥕",
    endive: "🥬",
    navet: "🥔",
  };
  return map[id] ?? (category === "fruit" ? "🍓" : "🥕");
}

function accent(category: Product["category"]) {
  return category === "fruit" ? Theme.fruit : Theme.veg;
}
function accentSoft(category: Product["category"]) {
  return category === "fruit" ? Theme.fruitSoft : Theme.vegSoft;
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const product = useMemo(() => {
    return (products as Product[]).find((p) => p.id === id);
  }, [id]);

  const monthNow = new Date().getMonth() + 1;

  const [fav, setFav] = useState(false);
  const [prefs, setPrefs] = useState<Preferences | null>(null);

  // Tooltip mois
  const [pickedMonth, setPickedMonth] = useState<number | null>(null);
  const [pickedLabel, setPickedLabel] = useState<string | null>(null);
  const tipOpacity = useRef(new Animated.Value(0)).current;

  // Animations premium
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(10)).current;
  const hero = useRef(new Animated.Value(0.985)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(hero, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [fade, slide, hero]);

  useEffect(() => {
    (async () => {
      const p = await getPreferences();
      setPrefs(p);
    })();
  }, []);

  useEffect(() => {
    if (!product) return;
    isFavorite(product.id).then(setFav);
  }, [product?.id]);

  if (!product) {
    return (
      <View style={styles.screen}>
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
        </View>

        <View style={styles.center}>
          <Text style={styles.title}>Produit introuvable</Text>
          <Text style={styles.muted}>Impossible de trouver ce produit.</Text>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.9 }]}
          >
            <Text style={styles.primaryBtnText}>Retour</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const catLabel = product.category === "fruit" ? "Fruit" : "Légume";
  const inSeasonNow = product.seasonMonths.includes(monthNow);

  const originsLabel =
    product.origins && product.origins.length > 0
      ? product.origins.join(" • ")
      : "France • Import";

  const hideOffSeasonMonths = Boolean(prefs?.hideOffSeasonMonths);

  const visibleMonths = hideOffSeasonMonths
    ? MONTHS.filter((m) => product.seasonMonths.includes(m.month) || m.month === monthNow)
    : MONTHS;

  async function onToggleFavorite() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await toggleFavorite(id);
    const next = await isFavorite(id);
    setFav(next);
  }

  function showMonthTooltip(month: number, label: string) {
    setPickedMonth(month);
    setPickedLabel(label);

    tipOpacity.stopAnimation();
    tipOpacity.setValue(0);
    Animated.timing(tipOpacity, { toValue: 1, duration: 140, useNativeDriver: true }).start();

    // auto-hide léger
    setTimeout(() => {
      Animated.timing(tipOpacity, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
        setPickedMonth(null);
        setPickedLabel(null);
      });
    }, 1200);
  }

  return (
    <View style={styles.screen}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.8 }]}
        >
          <Text style={styles.backBtnText}>←</Text>
        </Pressable>

        <Pressable
          onPress={onToggleFavorite}
          style={({ pressed }) => [
            styles.favBtn,
            { backgroundColor: Theme.card, borderColor: Theme.line },
            pressed && { transform: [{ scale: 0.98 }], opacity: 0.95 },
          ]}
        >
          <Text style={styles.favText}>{fav ? "❤️" : "🤍"}</Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        style={{ flex: 1, opacity: fade, transform: [{ translateY: slide }] }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Animated.View
          style={[
            styles.hero,
            {
              borderColor: Theme.line,
              backgroundColor: Theme.card,
              transform: [{ scale: hero }],
            },
          ]}
        >
          <View style={[styles.heroEmoji, { backgroundColor: accentSoft(product.category) }]}>
            <Text style={styles.heroEmojiText}>{productEmoji(product.id, product.category)}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.heroMeta}>
              {catLabel} • {originsLabel}
            </Text>

            <View style={styles.heroPills}>
              <View
                style={[
                  styles.pill,
                  {
                    backgroundColor: accentSoft(product.category),
                    borderColor: accentSoft(product.category),
                  },
                ]}
              >
                <Text style={[styles.pillText, { color: accent(product.category) }]}>{catLabel}</Text>
              </View>

              <View style={[styles.pill, { backgroundColor: Theme.bg, borderColor: Theme.line }]}>
                <Text style={[styles.pillText, { color: inSeasonNow ? Theme.text : Theme.muted }]}>
                  {inSeasonNow ? "✅ En saison maintenant" : "⏳ Hors saison maintenant"}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Seasonality */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saisonnalité</Text>
          <Text style={styles.cardSub}>
            {hideOffSeasonMonths ? "Mois pertinents" : "Mois en pleine saison"}
          </Text>

          <View style={styles.monthGrid}>
            {visibleMonths.map((m) => {
              const active = product.seasonMonths.includes(m.month);
              const isNow = m.month === monthNow;

              // Si hideOffSeasonMonths: tout ce qui est affiché est "utile"
              const bg = active ? Theme.card : Theme.bg;
              const border = active ? Theme.line : Theme.line;
              const opacity = active ? 1 : 0.45;

              return (
                <Pressable
                  key={m.month}
                  onPress={async () => {
                    await Haptics.selectionAsync();
                    showMonthTooltip(m.month, m.label);
                  }}
                  style={({ pressed }) => [
                    styles.monthCell,
                    {
                      backgroundColor: bg,
                      borderColor: border,
                      opacity,
                    },
                    isNow && {
                      borderColor: Theme.brand,
                      backgroundColor: Theme.brandSoft,
                      opacity: 1,
                    },
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <Text
                    style={[
                      styles.monthKey,
                      { color: active || isNow ? Theme.text : Theme.muted },
                    ]}
                  >
                    {m.key}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Tooltip / label */}
          {pickedMonth && pickedLabel ? (
            <Animated.View style={[styles.monthTip, { opacity: tipOpacity }]}>
              <Text style={styles.monthTipText}>
                {pickedLabel}
                {pickedMonth === monthNow ? " • maintenant" : ""}
              </Text>
            </Animated.View>
          ) : null}

          <Text style={styles.tip}>
            Astuce : privilégie les produits “en saison” pour une consommation plus éco-responsable.
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => router.push(`/`)}
          style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
        >
          <Text style={styles.primaryBtnText}>Voir “en saison maintenant”</Text>
        </Pressable>

        <View style={{ height: 24 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Theme.bg },

  topBar: {
    paddingHorizontal: Theme.space[20],
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: Theme.card,
    borderWidth: 1,
    borderColor: Theme.line,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: { fontSize: 18, fontWeight: "900", color: Theme.text },

  favBtn: {
    width: 42,
    height: 42,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  favText: { fontSize: 18 },

  container: {
    paddingHorizontal: Theme.space[20],
    paddingBottom: 24,
    gap: Theme.space[16],
  },

  hero: {
    borderRadius: Theme.r.l,
    borderWidth: 1,
    padding: 16,
    flexDirection: "row",
    gap: 14,
    shadowColor: Theme.shadow.color,
    shadowOpacity: Theme.shadow.opacity,
    shadowRadius: Theme.shadow.radius,
    shadowOffset: Theme.shadow.offset,
    elevation: Theme.shadow.elevation,
  },

  heroEmoji: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmojiText: { fontSize: 30 },

  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: Theme.text,
    letterSpacing: -0.6,
  },
  heroMeta: {
    marginTop: 6,
    color: Theme.muted,
    fontWeight: "700",
  },

  heroPills: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap",
  },

  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillText: { fontWeight: "900", fontSize: 12 },

  card: {
    backgroundColor: Theme.card,
    borderRadius: Theme.r.l,
    borderWidth: 1,
    borderColor: Theme.line,
    padding: 16,
    shadowColor: Theme.shadow.color,
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 1,
  },
  cardTitle: { fontSize: 18, fontWeight: "900", color: Theme.text },
  cardSub: { marginTop: 6, fontWeight: "700", color: Theme.muted },

  monthGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    // ⚠️ pas de gap (Android/RN)
    justifyContent: "space-between",
  },
  monthCell: {
    width: "23%", // 4 colonnes propres, stable
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  monthKey: { fontSize: 14, fontWeight: "900" },

  monthTip: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Theme.brandSoft,
    borderWidth: 1,
    borderColor: Theme.line,
  },
  monthTipText: { fontSize: 12, fontWeight: "900", color: Theme.text },

  tip: {
    marginTop: 14,
    color: Theme.muted,
    fontWeight: "700",
    lineHeight: 18,
  },

  primaryBtn: {
    height: 54,
    borderRadius: Theme.r.l,
    backgroundColor: Theme.text,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: Theme.card,
    fontWeight: "900",
    fontSize: 14,
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 10 },
  title: { fontSize: 22, fontWeight: "900", color: Theme.text },
  muted: { color: Theme.muted, fontWeight: "700", textAlign: "center" },
});