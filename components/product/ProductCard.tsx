import { Pill } from "@/components/ui/Pill";
import { Theme } from "@/constants/theme";
import type { Product } from "@/src/types/product";
import { getCategoryColors, getCategoryLabel, getProductEmoji } from "@/src/utils/categories";
import * as Haptics from "expo-haptics";
import type React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type ProductCardProps = {
  product: Product;
  onPress: () => void;
  rightSlot?: React.ReactNode;
  actionSlot?: React.ReactNode;
  variant?: "grid" | "list";
};

export function ProductCard({
  product,
  onPress,
  rightSlot,
  actionSlot,
  variant = "grid",
}: ProductCardProps) {
  const slot = actionSlot ?? rightSlot;
  const categoryLabel = getCategoryLabel(product.category);
  const categoryColors = getCategoryColors(product.category);

  async function handlePress() {
    try {
      await Haptics.selectionAsync();
    } catch {
      // Haptics are a nice-to-have and should never block navigation.
    }

    onPress();
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Voir ${product.name}`}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        variant === "list" ? styles.cardList : styles.cardGrid,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.thumb, { backgroundColor: categoryColors.soft }]}>
        <Text style={styles.emoji}>{getProductEmoji(product)}</Text>
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {product.name}
        </Text>

        <Pill
          label={categoryLabel}
          tone={product.category}
          style={[styles.badge, { borderColor: Theme.line, backgroundColor: Theme.brandSoft }]}
        />
      </View>

      {slot ? <View style={styles.slotWrap}>{slot}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 76,
    backgroundColor: Theme.card,
    borderRadius: Theme.r.l,
    padding: Theme.space[14],
    borderWidth: 1,
    borderColor: Theme.line,
    ...Theme.shadows.card,
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.space[12],
  },
  cardGrid: {
    flexBasis: "47%",
    flexGrow: 0,
    flexShrink: 1,
    minWidth: 0,
  },
  cardList: {
    flexBasis: "100%",
    flexGrow: 1,
    flexShrink: 0,
    alignSelf: "stretch",
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  thumb: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  emoji: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: Theme.space[8],
  },
  title: {
    fontSize: Theme.typography.sizes.body,
    lineHeight: Theme.typography.lineHeights.body,
    fontWeight: Theme.typography.weights.heavy,
    color: Theme.text,
  },
  badge: {
    maxWidth: 120,
  },
  slotWrap: {
    marginLeft: Theme.space[8],
    alignSelf: "center",
    flexShrink: 0,
  },
});
