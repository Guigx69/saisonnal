import { Theme } from "@/constants/theme";
import type { Product, ProductCategory } from "@/src/types/product";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "fruit",
  "legume",
  "aromate",
  "fromage",
  "poisson",
];

type CategoryConfig = {
  label: string;
  pluralLabel: string;
  emoji: string;
};

const CATEGORY_CONFIG: Record<ProductCategory, CategoryConfig> = {
  fruit: {
    label: "Fruit",
    pluralLabel: "Fruits",
    emoji: "🍎",
  },
  legume: {
    label: "Légume",
    pluralLabel: "Légumes",
    emoji: "🥕",
  },
  aromate: {
    label: "Aromate",
    pluralLabel: "Aromates",
    emoji: "🌿",
  },
  fromage: {
    label: "Fromage",
    pluralLabel: "Fromages",
    emoji: "🧀",
  },
  poisson: {
    label: "Poisson",
    pluralLabel: "Poissons",
    emoji: "🐟",
  },
};

const PRODUCT_EMOJI: Partial<Record<string, string>> = {
  orange: "🍊",
  clementine: "🍊",
  mandarine: "🍊",
  pomme: "🍎",
  poire: "🍐",
  citron: "🍋",
  poireau: "🥬",
  "chou-fleur": "🥦",
  brocoli: "🥦",
  carotte: "🥕",
  endive: "🥬",
  navet: "🥔",
};

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

export function getCategoryLabel(category: ProductCategory) {
  return CATEGORY_CONFIG[category].label;
}

export function getCategoryPluralLabel(category: ProductCategory) {
  return CATEGORY_CONFIG[category].pluralLabel;
}

export function getCategoryEmoji(category: ProductCategory) {
  return CATEGORY_CONFIG[category].emoji;
}

export function getCategoryColors(category: ProductCategory) {
  return Theme.category[category];
}

export function getProductEmoji(product: Pick<Product, "id" | "category">) {
  return PRODUCT_EMOJI[product.id] ?? getCategoryEmoji(product.category);
}
