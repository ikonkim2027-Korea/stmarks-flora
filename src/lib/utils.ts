import { Plant, PlantCategory, Habitat } from "@/data/plants";

export function getCurrentMonthWeek(): { month: number; week: number } {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-indexed
  const day = now.getDate();
  const week = Math.min(Math.ceil(day / 7), 4);
  return { month, week };
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

export function getCategoryColor(category: PlantCategory): string {
  const map: Record<PlantCategory, string> = {
    tree: "bg-green-100 text-green-800 border-green-300",
    shrub: "bg-amber-100 text-amber-800 border-amber-300",
    wildflower: "bg-pink-100 text-pink-800 border-pink-300",
    fern: "bg-emerald-100 text-emerald-800 border-emerald-300",
    grass: "bg-lime-100 text-lime-800 border-lime-300",
    vine: "bg-purple-100 text-purple-800 border-purple-300",
  };
  return map[category] ?? "bg-gray-100 text-gray-800 border-gray-300";
}

export function getCategoryDotColor(category: PlantCategory): string {
  const map: Record<PlantCategory, string> = {
    tree: "bg-green-600",
    shrub: "bg-amber-600",
    wildflower: "bg-pink-500",
    fern: "bg-emerald-600",
    grass: "bg-lime-600",
    vine: "bg-purple-600",
  };
  return map[category] ?? "bg-gray-500";
}

export function getHabitatIcon(habitat: Habitat): string {
  const map: Record<Habitat, string> = {
    "forest-floor": "🌿",
    "woodland-edge": "🌳",
    roadside: "🛤️",
    wetland: "🌾",
    "pond-edge": "🌊",
    "lawn-adjacent": "🌱",
    "rocky-outcrop": "🪨",
    meadow: "🌼",
    streambank: "💧",
  };
  return map[habitat] ?? "🌱";
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

export function getNativeStatusColor(status: Plant["nativeStatus"]): string {
  if (status === "native") return "bg-green-100 text-green-800 border-green-300";
  if (status === "naturalized") return "bg-blue-100 text-blue-800 border-blue-300";
  return "bg-red-100 text-red-800 border-red-300";
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
