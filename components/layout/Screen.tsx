import { Theme } from "@/constants/theme";
import type React from "react";
import { View, type ViewProps } from "react-native";

export type ScreenProps = ViewProps & {
  children: React.ReactNode;
};

export function Screen({ children, style, ...rest }: ScreenProps) {
  return (
    <View style={[{ flex: 1, backgroundColor: Theme.bg }, style]} {...rest}>
      {children}
    </View>
  );
}
