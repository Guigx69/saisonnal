import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Theme } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarStyle: {
          backgroundColor: Theme.card,
          borderTopColor: Theme.line,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
        },

        tabBarActiveTintColor: Theme.text,
        tabBarInactiveTintColor: Theme.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoris",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size ?? 24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="preferences"
        options={{
          title: "Préférences",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="options" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
