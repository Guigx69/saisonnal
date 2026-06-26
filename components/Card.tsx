// components/Card.tsx
import { Theme } from "@/constants/theme";
import React from "react";
import { View, type ViewProps } from "react-native";

type Props = ViewProps & {
  children: React.ReactNode;
};

export function Card({ children, style, ...rest }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: Theme.card,
          borderRadius: Theme.r.l,
          padding: Theme.space[16],
          borderWidth: 1,
          borderColor: Theme.line,

          shadowColor: Theme.shadow.color,
          shadowOpacity: Theme.shadow.opacity,
          shadowRadius: Theme.shadow.radius,
          shadowOffset: Theme.shadow.offset,
          elevation: Theme.shadow.elevation,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}