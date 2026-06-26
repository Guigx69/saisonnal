import { Theme } from "@/constants/theme";
import type React from "react";
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export type IconButtonProps = Omit<PressableProps, "children" | "style"> & {
  children: React.ReactNode;
  accessibilityLabel: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ children, accessibilityLabel, onPress, style, ...rest }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [styles.root, pressed && styles.pressed, style]}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.line,
    backgroundColor: Theme.card,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
