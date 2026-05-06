import { Habitat, Plant, PlantCategory } from "@/data/plants";
import {
  getHabitatLabel,
  plantHasWindowInMonth,
} from "@/lib/utils";

export type NativeStatus = Plant["nativeStatus"];
export type CollectionPolicyType = "collect" | "limited" | "photograph-only";
export type PlantSortKey =
  | "relevance"
  | "commonName"
  | "scientificName"
  | "family"
  | "category";

export interface DiscoveryFilters {
  categories: PlantCategory[];
  habitats: Habitat[];
  nativeStatuses: NativeStatus[];
  months: number[];
}

export interface PlantDiscoveryOptions {
  query: string;
  filters: DiscoveryFilters;
  sort: PlantSortKey;
}

export interface CollectionPolicy {
  type: CollectionPolicyType;
  label: string;
  shortLabel: string;
  description: string;
}

const COLLECTION_POLICIES: Record<CollectionPolicyType, CollectionPolicy> = {
  collect: {
    type: "collect",
    label: "Specimen collection",
    shortLabel: "Collect",
    description: "Specimen collection is appropriate when local rules allow it.",
  },
  limited: {
    type: "limited",
    label: "Limited collection",
    shortLabel: "Limited",
    description:
      "Collect sparingly from robust populations, or photograph when uncertain.",
  },
  "photograph-only": {
    type: "photograph-only",
    label: "Photograph only",
    shortLabel: "Photo only",
    description:
      "Do not collect living specimens. Record the plant with photos and notes.",
  },
};

export function getCollectionPolicy(plant: Plant): CollectionPolicy {
  return COLLECTION_POLICIES[plant.collectionPolicy ?? "collect"];
}

export function isSpecimenCollectible(plant: Plant): boolean {
  return getCollectionPolicy(plant).type !== "photograph-only";
}

export function getDiscoverablePlantsForWeek(
  month: number,
  week: number,
  plantList: Plant[]
): { collectible: Plant[]; observationOnly: Plant[] } {
  const available = plantList.filter((plant) =>
    plant.collectionWindows.some(
      (window) => window.month === month && window.weeks.includes(week)
    )
  );

  return {
    collectible: available.filter(isSpecimenCollectible),
    observationOnly: available.filter((plant) => !isSpecimenCollectible(plant)),
  };
}

export function filterPlants(
  plantList: Plant[],
  options: PlantDiscoveryOptions
): Plant[] {
  const queryTokens = tokenize(options.query);

  return plantList
    .map((plant) => ({
      plant,
      score: scorePlant(plant, queryTokens),
    }))
    .filter(({ plant, score }) => {
      if (queryTokens.length > 0 && score === 0) return false;
      if (
        options.filters.categories.length > 0 &&
        !options.filters.categories.includes(plant.category)
      ) {
        return false;
      }
      if (
        options.filters.habitats.length > 0 &&
        !options.filters.habitats.some((habitat) =>
          plant.habitat.includes(habitat)
        )
      ) {
        return false;
      }
      if (
        options.filters.nativeStatuses.length > 0 &&
        !options.filters.nativeStatuses.includes(plant.nativeStatus)
      ) {
        return false;
      }
      if (
        options.filters.months.length > 0 &&
        !options.filters.months.some((month) =>
          plantHasWindowInMonth(plant, month)
        )
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => compareScoredPlants(a, b, options.sort))
    .map(({ plant }) => plant);
}

function compareScoredPlants(
  a: { plant: Plant; score: number },
  b: { plant: Plant; score: number },
  sort: PlantSortKey
): number {
  if (sort === "relevance") {
    const scoreDifference = b.score - a.score;
    if (scoreDifference !== 0) return scoreDifference;
    return compareByString(a.plant.commonName, b.plant.commonName);
  }

  return compareByString(a.plant[sort], b.plant[sort]);
}

function scorePlant(plant: Plant, tokens: string[]): number {
  if (tokens.length === 0) return 1;

  const weightedFields = [
    { value: plant.commonName, weight: 12 },
    { value: plant.scientificName, weight: 10 },
    { value: plant.family, weight: 8 },
    { value: plant.category, weight: 6 },
    { value: plant.nativeStatus, weight: 5 },
    { value: plant.habitat.map(getHabitatLabel).join(" "), weight: 5 },
    { value: plant.searchKeywords?.join(" ") ?? "", weight: 8 },
    { value: plant.identificationTips.join(" "), weight: 3 },
    { value: plant.description, weight: 2 },
    { value: plant.specimenNotes, weight: 2 },
    { value: plant.conservationNote ?? "", weight: 2 },
  ];

  return tokens.reduce((total, token) => {
    const tokenScore = weightedFields.reduce((fieldTotal, field) => {
      const value = normalizeText(field.value);
      if (value.split(" ").includes(token)) return fieldTotal + field.weight * 2;
      if (value.includes(token)) return fieldTotal + field.weight;
      return fieldTotal;
    }, 0);

    return tokenScore === 0 ? 0 : total + tokenScore;
  }, 0);
}

function tokenize(query: string): string[] {
  return normalizeText(query)
    .split(" ")
    .filter((token) => token.length > 1);
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compareByString(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}
