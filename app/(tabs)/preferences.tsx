import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Theme } from "@/constants/theme";
import {
  getPreferences,
  updatePreferences,
  type Preferences,
} from "../../src/storage/preferences";

export default function PreferencesScreen() {
  const [prefs, setPrefs] = useState<Preferences | null>(null);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    (async () => {
      const p = await getPreferences();
      setPrefs(p);

      fade.setValue(0);
      slide.setValue(10);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    })();
  }, [fade, slide]);

  async function patch(next: Partial<Preferences>) {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // no-op
    }
    const updated = await updatePreferences(next);
    setPrefs(updated);
  }

  return (
    <Screen>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.title}>Préférences</Text>
          <Text style={styles.subtitle}>
            Personnalise l’expérience, sans compte.
          </Text>
        </View>

        {/* Loading */}
        {!prefs ? (
          <View style={styles.section}>
            <Card style={styles.loadingCard}>
              <Text style={styles.loadingTitle}>Chargement…</Text>
              <Text style={styles.loadingSub}>
                Nous préparons tes préférences.
              </Text>
            </Card>
          </View>
        ) : (
          <Animated.View style={{ opacity: fade, transform: [{ translateY: slide }] }}>
            {/* Default filter */}
            <View style={styles.section}>
              <Card>
                <Text style={styles.cardTitle}>Affichage par défaut</Text>
                <Text style={styles.cardSub}>
                  Choisis ce que tu veux voir en premier.
                </Text>

                <View style={styles.segment}>
                  {(["all", "fruit", "legume"] as const).map((k) => {
                    const label =
                      k === "all" ? "Tout" : k === "fruit" ? "Fruits" : "Légumes";
                    const active = prefs.defaultFilter === k;

                    return (
                      <Pressable
                        key={k}
                        onPress={() => patch({ defaultFilter: k })}
                        style={({ pressed }) => [
                          styles.segmentItem,
                          active && styles.segmentItemActive,
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                          {label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>
            </View>

            {/* Toggles */}
            <View style={styles.section}>
              <Card>
                <Text style={styles.cardTitle}>Confort</Text>

                <Row
                  title="Masquer les mois hors saison"
                  desc="Sur la fiche produit, n’afficher que les mois pertinents."
                  value={prefs.hideOffSeasonMonths}
                  onChange={(v) => patch({ hideOffSeasonMonths: v })}
                />

                <Divider />

                <Row
                  title="Mode éco (pédagogie)"
                  desc="Plus de conseils et d’explications sur l’impact."
                  value={prefs.ecoMode}
                  onChange={(v) => patch({ ecoMode: v })}
                />

                <Divider />

                <Row
                  title="Préférer le local"
                  desc="Mettre en avant les origines proches quand c’est possible."
                  value={prefs.preferLocal}
                  onChange={(v) => patch({ preferLocal: v })}
                />
              </Card>
            </View>

            {/* Notifications (v2) */}
            <View style={styles.section}>
              <Card>
                <Text style={styles.cardTitle}>Notifications (v2)</Text>
                <Text style={styles.cardSub}>
                  Tu recevras une alerte quand un favori redevient de saison.
                </Text>

                <Row
                  title="Activer les notifications"
                  desc="Désactivé pour l’instant (à brancher ensuite)."
                  value={prefs.notificationsEnabled}
                  onChange={(v) => patch({ notificationsEnabled: v })}
                />
              </Card>
            </View>
          </Animated.View>
        )}

        {/* Spacer TabBar */}
        <View style={{ height: 68 + Theme.space[24] }} />
      </ScrollView>
    </Screen>
  );
}

function Row({
  title,
  desc,
  value,
  onChange,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{desc}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: Theme.brandSoft, true: Theme.brandSoft }}
        thumbColor={value ? Theme.brand : "#FFFFFF"}
        ios_backgroundColor={Theme.brandSoft}
      />
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Theme.bg },

  container: {
    paddingHorizontal: Theme.space[20],
    paddingTop: Theme.space[16],
  },

  section: {
    marginBottom: Theme.space[14],
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: Theme.text,
    letterSpacing: -0.7,
    marginTop: Theme.space[6],
  },
  subtitle: {
    marginTop: Theme.space[6],
    fontSize: 14,
    fontWeight: "700",
    color: Theme.muted,
  },

  loadingCard: {
    padding: Theme.space[16],
  },
  loadingTitle: { fontSize: 16, fontWeight: "900", color: Theme.text },
  loadingSub: { marginTop: Theme.space[8], fontSize: 13, color: Theme.muted, fontWeight: "700" },

  cardTitle: { fontSize: 16, fontWeight: "900", color: Theme.text },
  cardSub: { marginTop: Theme.space[8], fontSize: 13, color: Theme.muted, lineHeight: 18, fontWeight: "600" },

  segment: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Theme.space[10],
    marginTop: Theme.space[12],
  },
  segmentItem: {
    paddingHorizontal: Theme.space[12],
    paddingVertical: Theme.space[10],
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Theme.line,
    backgroundColor: Theme.softBg,
  },
  segmentItemActive: { backgroundColor: Theme.text, borderColor: Theme.text },
  segmentText: { fontSize: 13, fontWeight: "900", color: Theme.text },
  segmentTextActive: { color: "#FFFFFF" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Theme.space[12],
    paddingVertical: Theme.space[8],
  },
  rowTitle: { fontSize: 14, fontWeight: "900", color: Theme.text },
  rowDesc: { marginTop: Theme.space[6], fontSize: 12, color: Theme.muted, lineHeight: 16, fontWeight: "600" },

  divider: {
    height: 1,
    backgroundColor: Theme.line,
    marginVertical: Theme.space[12],
  },
});