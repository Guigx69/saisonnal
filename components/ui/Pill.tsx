import { Theme } from "@/constants/theme";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

export type PillTone = "neutral" | "brand" | "fruit" | "veg" | "danger";

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
        backgroundColor: Theme.fruitSoft,
        borderColor: Theme.fruitSoft,
        color: Theme.fruit,
      };
    case "veg":
      return {
        backgroundColor: Theme.vegSoft,
        borderColor: Theme.vegSoft,
        color: Theme.veg,
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
