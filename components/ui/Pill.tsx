import { Theme } from "@/constants/theme";
import type { ProductCategory } from "@/src/types/product";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

export type PillTone = "neutral" | "brand" | ProductCategory | "veg" | "danger";

export type PillProps = {
  label: string;
  tone?: PillTone;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
};

function toneColors(tone: PillTone, selected: boolean) {
  if (selected) {
    return {
      backgroundColor: Theme.text,
      borderColor: Theme.text,
      color: Theme.card,
    };
  }

  switch (tone) {
    case "fruit":
      return {
        backgroundColor: Theme.category.fruit.soft,
        borderColor: Theme.category.fruit.soft,
        color: Theme.category.fruit.color,
      };
    case "legume":
    case "veg":
      return {
        backgroundColor: Theme.category.legume.soft,
        borderColor: Theme.category.legume.soft,
        color: Theme.category.legume.color,
      };
    case "aromate":
      return {
        backgroundColor: Theme.category.aromate.soft,
        borderColor: Theme.category.aromate.soft,
        color: Theme.category.aromate.color,
      };
    case "fromage":
      return {
        backgroundColor: Theme.category.fromage.soft,
        borderColor: Theme.category.fromage.soft,
        color: Theme.category.fromage.color,
      };
    case "poisson":
      return {
        backgroundColor: Theme.category.poisson.soft,
        borderColor: Theme.category.poisson.soft,
        color: Theme.category.poisson.color,
      };
    case "danger":
      return {
        backgroundColor: Theme.semantic.dangerSoft,
        borderColor: Theme.semantic.dangerSoft,
        color: Theme.semantic.danger,
      };
    case "brand":
      return {
        backgroundColor: Theme.brandSoft,
        borderColor: Theme.line,
        color: Theme.brand,
      };
    case "neutral":
    default:
      return {
        backgroundColor: Theme.softBg,
        borderColor: Theme.line,
        color: Theme.text,
      };
  }
}

export function Pill({ label, tone = "neutral", selected = false, style }: PillProps) {
  const colors = toneColors(tone, selected);

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.backgroundColor, borderColor: colors.borderColor },
        style,
      ]}
    >
      <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.text, { color: colors.color }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 30,
    alignSelf: "flex-start",
    justifyContent: "center",
    paddingHorizontal: Theme.space[12],
    paddingVertical: Theme.space[6],
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 0,
  },
  text: {
    fontSize: Theme.typography.sizes.caption,
    lineHeight: Theme.typography.lineHeights.caption,
    fontWeight: Theme.typography.weights.heavy,
  },
});
