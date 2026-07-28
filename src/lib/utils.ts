import { Plant, PlantCategory, Habitat } from "@/data/plants";
import { resolveMonthWeek } from "./monthWeek";
import type { ChipTone } from "@/components/ui/Chip";

// server/build-time only — client UI must use useCurrentMonthWeek()
export function getCurrentMonthWeek(): { month: number; week: number } {
  return resolveMonthWeek(new Date());
}

export function getAvailablePlants(
  month: number,
  week: number,
  plants: Plant[]
): Plant[] {
  return plants.filter((plant) =>
    plant.collectionWindows.some(
      (w) => w.month === month && w.weeks.includes(week)
    )
  );
}

export function getCategoryTone(category: PlantCategory): ChipTone {
  const map: Record<PlantCategory, ChipTone> = {
    tree: "moss",
    shrub: "clay",
    wildflower: "sprout",
    fern: "moss",
    grass: "sage",
    vine: "mist",
  };
  return map[category] ?? "sage";
}

// Habitats read as one moss/sage scale rather than a per-habitat hue: wooded
// and wet ground sits deep, open ground sits light. The hex mirrors the class
// for consumers that cannot take a utility, such as Leaflet vector styles.
const HABITAT_SCALE: Record<Habitat, { dot: string; hex: string }> = {
  "forest-floor": { dot: "bg-moss", hex: "#3d5a44" },
  "pond-edge": { dot: "bg-moss", hex: "#3d5a44" },
  "woodland-edge": { dot: "bg-moss-soft", hex: "#5c7a62" },
  wetland: { dot: "bg-moss-soft", hex: "#5c7a62" },
  streambank: { dot: "bg-moss-soft", hex: "#5c7a62" },
  roadside: { dot: "bg-sage", hex: "#aec2a4" },
  "rocky-outcrop": { dot: "bg-sage", hex: "#aec2a4" },
  meadow: { dot: "bg-sprout", hex: "#c9e265" },
  "lawn-adjacent": { dot: "bg-sprout", hex: "#c9e265" },
};

export function getHabitatDotClass(habitat: Habitat): string {
  return HABITAT_SCALE[habitat]?.dot ?? "bg-sage";
}

export function getHabitatDotHex(habitat: Habitat): string {
  return HABITAT_SCALE[habitat]?.hex ?? "#aec2a4";
}

export function getHabitatLabel(habitat: Habitat): string {
  const map: Record<Habitat, string> = {
    "forest-floor": "Forest Floor",
    "woodland-edge": "Woodland Edge",
    roadside: "Roadside",
    wetland: "Wetland",
    "pond-edge": "Pond Edge",
    "lawn-adjacent": "Lawn Adjacent",
    "rocky-outcrop": "Rocky Outcrop",
    meadow: "Meadow",
    streambank: "Streambank",
  };
  return map[habitat] ?? habitat;
}

export function formatMonthName(month: number): string {
  const names = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return names[month - 1] ?? `Month ${month}`;
}

export function formatMonthShort(month: number): string {
  const names = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return names[month - 1] ?? `M${month}`;
}

export function getNativeStatusTone(status: Plant["nativeStatus"]): ChipTone {
  if (status === "native") return "moss";
  if (status === "naturalized") return "mist";
  return "clay";
}

export function getNativeStatusLabel(status: Plant["nativeStatus"]): string {
  if (status === "native") return "Native";
  if (status === "naturalized") return "Naturalized";
  return "Invasive";
}

export function getAbundanceLabel(abundance: Plant["abundance"]): string {
  const map: Record<Plant["abundance"], string> = {
    abundant: "Abundant",
    common: "Common",
    occasional: "Occasional",
    uncommon: "Uncommon",
  };
  return map[abundance];
}

export function plantHasWindowInMonth(plant: Plant, month: number): boolean {
  return plant.collectionWindows.some((w) => w.month === month);
}
