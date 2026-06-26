// components/Section.tsx
import { Theme } from "@/constants/theme";
import React from "react";
import { Text, View, type ViewProps } from "react-native";

type Props = ViewProps & {
  title: string;
  right?: React.ReactNode;   // ex: compteur / bouton
  children: React.ReactNode;
};

export function Section({ title, right, children, style, ...rest }: Props) {
  return (
    <View style={[{ gap: Theme.space[12] }, style]} {...rest}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text style={{ fontSize: 18, fontWeight: "900", color: Theme.text, letterSpacing: -0.2 }}>
          {title}
        </Text>
        {right ? <View>{right}</View> : null}
      </View>

      {children}
    </View>
  );
}