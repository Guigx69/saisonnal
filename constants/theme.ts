// constants/theme.ts
export const Theme = {
  // Colors
  bg: "#F6F7F5",
  card: "#FFFFFF",
  text: "#0F172A",
  muted: "#6B7280",
  line: "rgba(15,23,42,0.08)",

  // Brand
  brand: "#0F172A",
  brandSoft: "rgba(15,23,42,0.06)",

  // Categories
  fruit: "#F59E0B",
  fruitSoft: "rgba(245,158,11,0.15)",

  veg: "#22C55E",
  vegSoft: "rgba(34,197,94,0.15)",

  // ✅ Aliases (compat) — pour éviter de casser selon les fichiers
  // (tu peux utiliser soit fruit/veg, soit accentFruit/accentVeg)
  accentFruit: "#F59E0B",
  accentVeg: "#22C55E",

  // ✅ UI helpers (compat) — utilisés dans ProductCard / inputs / badges
  softBg: "rgba(15,23,42,0.04)",
  badgeBg: "rgba(15,23,42,0.03)",

  // Radius
  r: {
    s: 12,
    m: 18,
    l: 24,
    xl: 32,
  },

  // Spacing
  // ✅ IMPORTANT: si tu utilises Theme.space[10] ou [14] quelque part -> il faut les mettre ici.
  space: {
    4: 4,
    6: 6,
    8: 8,
    10: 10,
    12: 12,
    14: 14,
    16: 16,
    18: 18,
    20: 20,
    24: 24,
    28: 28,
    32: 32,
  },

  // Shadow
  shadow: {
    color: "#000",
    opacity: 0.06,
    radius: 18,
    offset: { width: 0, height: 10 },
    elevation: 2,
  },
} as const;
export type ThemeTokens = typeof Theme;