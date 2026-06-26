import { Theme } from "@/constants/theme";
import type React from "react";
import { StyleSheet, Text, View, type ViewProps } from "react-native";

export type EmptyStateProps = ViewProps & {
  title?: string;
  message: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, message, action, style, ...rest }: EmptyStateProps) {
  return (
    <View style={[styles.root, style]} {...rest}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text style={styles.message}>{message}</Text>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Theme.space[8],
  },
  title: {
    color: Theme.text,
    fontSize: Theme.typography.sizes.body,
    lineHeight: Theme.typography.lineHeights.body,
    fontWeight: Theme.typography.weights.heavy,
  },
  message: {
    color: Theme.muted,
    fontSize: Theme.typography.sizes.body,
    lineHeight: Theme.typography.lineHeights.body,
    fontWeight: Theme.typography.weights.bold,
  },
  action: {
    marginTop: Theme.space[4],
  },
});
