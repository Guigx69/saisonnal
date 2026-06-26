// components/ProductCard.tsx
import { Theme } from "@/constants/theme";
import type { Product } from "@/src/types/product";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

function accentColor(category: Product["category"]) {
  return category === "fruit" ? Theme.accentFruit : Theme.accentVeg;
}

function accentSoft(category: Product["category"]) {
  return category === "fruit" ? Theme.fruitSoft : Theme.vegSoft;
}

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

type Props = {
  product: Product;
  onPress: () => void;
  rightSlot?: React.ReactNode; // ex: bouton poubelle / coeur
  variant?: "grid" | "list"; // ✅ NEW
};

export function ProductCard({ product, onPress, rightSlot, variant = "grid" }: Props) {
  const accent = accentColor(product.category);

  async function handlePress() {
    await Haptics.selectionAsync();
    onPress();
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        variant === "list" ? styles.cardList : styles.cardGrid,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.thumb, { backgroundColor: accentSoft(product.category) }]}>
        <Text style={styles.emoji}>{productEmoji(product.id, product.category)}</Text>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {product.name}
        </Text>

        <View style={styles.footer}>
          <View style={[styles.badge, { borderColor: Theme.line, backgroundColor: Theme.brandSoft }]}>
            <Text style={[styles.badgeText, { color: accent }]}>
              {product.category === "fruit" ? "Fruit" : "Légume"}
            </Text>
          </View>
        </View>
      </View>

      {/* ✅ Zone dédiée à droite (ne chevauche jamais) */}
      {rightSlot ? <View style={styles.rightSlotWrap}>{rightSlot}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: Theme.card,
    borderRadius: Theme.r.l,
    padding: Theme.space[14],
    borderWidth: 1,
    borderColor: Theme.line,
    shadowColor: Theme.shadow.color,
    shadowOpacity: Theme.shadow.opacity,
    shadowRadius: Theme.shadow.radius,
    shadowOffset: Theme.shadow.offset,
    elevation: Theme.shadow.elevation,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.space[12],
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },

  cardGrid: {
    width: "48%",
  },

  cardList: {
    width: "100%",
  },

  thumb: {
    width: 44,
    height: 44,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { 
    fontSize: 22 
  },

  content: { 
    flex: 1,
    gap: Theme.space[8]
  },

  title: {
    fontSize: 12,
    fontWeight: "900",
    color: Theme.text,
    letterSpacing: -0.2,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  badge: {
    paddingHorizontal: Theme.space[12],
    paddingVertical: Theme.space[8],
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: 120,
  },
  badgeText: { fontSize: 10, fontWeight: "900" },

  rightSlotWrap: {
    marginLeft: Theme.space[8],
    alignSelf: "center",
    flexShrink: 0,
  },
});