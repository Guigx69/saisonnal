export type ProductCategory = "fruit" | "legume" | "aromate" | "fromage" | "poisson";

export type ProductConfidenceLevel = "unknown" | "low" | "medium" | "high";

export type ProductRegionScope =
  | "unknown"
  | "national"
  | "regional"
  | "coastal"
  | "mountain"
  | "overseas";

export type ProductSourceRef = {
  label: string;
  url?: string;
  accessedAt?: string;
  notes?: string;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  seasonMonths: number[];
  peakMonths?: number[];
  availabilityMonths?: number[];
  origins: string[];
  localNotes?: string[];
  ecoTips?: string[];
  sourceRefs?: ProductSourceRef[];
  confidenceLevel?: ProductConfidenceLevel;
  isRegional?: boolean;
  regionScope?: ProductRegionScope;
};
