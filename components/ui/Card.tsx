import { Theme } from "@/constants/theme";
import type React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

export type CardProps = ViewProps & {
  children: React.ReactNode;
};

export function Card({ children, style, ...rest }: CardProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: Theme.card,
    borderRadius: Theme.r.l,
    padding: Theme.space[16],
    borderWidth: 1,
    borderColor: Theme.line,
    ...Theme.shadows.card,
  },
});
