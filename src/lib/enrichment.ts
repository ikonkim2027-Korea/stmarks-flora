import raw from "@/data/enrichment.json";

export interface GbifInfo {
  usageKey: number | null;
  taxonKey: number | null;      // accepted key — use for map tiles
  status: string | null;        // ACCEPTED | SYNONYM | ...
  matchedName: string | null;
  acceptedName: string | null;  // present whenever status === "SYNONYM"
  family: string | null;
  vernacularNames: string[];
}

export interface PlantEnrichment {
  id: string;
  scientificName: string;
  fetchedAt: string;
  gbif: GbifInfo | null;
  /** Flowering-annotation counts by month, index 0 = January. Source: iNaturalist, Massachusetts. */
  floweringByMonth: number[];
  /** Fruiting-annotation counts by month, index 0 = January. */
  fruitingByMonth: number[];
  /** Observation count within 25 km of campus. */
  nearbyObservations: number;
  inatTaxonId: number | null;
  wikipedia: { extract: string; url: string; thumbnail: string | null } | null;
}

const data = raw as { generatedAt: string; plants: Record<string, PlantEnrichment> };

export function getEnrichment(id: string): PlantEnrichment | undefined {
  return data.plants[id];
}

export function observedMonths(id: string): number[] {
  return getEnrichment(id)?.floweringByMonth ?? new Array(12).fill(0);
}

/** Months (1-12) where observed flowering is at least 15% of the species' peak. */
export function observedPeakMonths(id: string): number[] {
  const months = observedMonths(id);
  const peak = Math.max(...months);
  if (peak === 0) return [];
  return months
    .map((count, i) => ({ month: i + 1, count }))
    .filter(({ count }) => count >= peak * 0.15)
    .map(({ month }) => month);
}

export const enrichmentGeneratedAt = data.generatedAt;
