import { Theme } from "@/constants/theme";
import type React from "react";
import { StyleSheet, Text, View, type ViewProps } from "react-native";

export type SectionProps = ViewProps & {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
};

export function Section({ title, right, children, style, ...rest }: SectionProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {right ? <View>{right}</View> : null}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Theme.space[12],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: Theme.typography.sizes.title,
    lineHeight: Theme.typography.lineHeights.title,
    fontWeight: Theme.typography.weights.heavy,
    color: Theme.text,
  },
});
