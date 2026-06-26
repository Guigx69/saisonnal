// components/Screen.tsx
import { Theme } from "@/constants/theme";
import React from "react";
import { View, type ViewProps } from "react-native";

type Props = ViewProps & {
  children: React.ReactNode;
};

export function Screen({ children, style, ...rest }: Props) {
  return (
    <View
      style={[{ flex: 1, backgroundColor: Theme.bg }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}