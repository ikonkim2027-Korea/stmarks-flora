import { Habitat } from "./plants";

export interface HabitatLocation {
  habitat: Habitat;
  name: string;
  coords: [number, number];
  radius: number; // meters
  description: string;
  color: string;
}

export const SCHOOL_CENTER: [number, number] = [42.3075, -71.5235];
export const SURVEY_RADIUS = 1000; // 1km in meters

export const HABITAT_COLORS: Record<Habitat, string> = {
  "forest-floor": "#1a5c2e",
  "woodland-edge": "#3d8b37",
  roadside: "#8B8B8B",
  wetland: "#2E86AB",
  "pond-edge": "#1B4965",
  "lawn-adjacent": "#90BE6D",
  "rocky-outcrop": "#A67C52",
  meadow: "#F9C74F",
  streambank: "#4CC9F0",
};

export const habitatLocations: HabitatLocation[] = [
  // Forest Floor / Woodland
  {
    habitat: "forest-floor",
    name: "Woods NW of Campus",
    coords: [42.3095, -71.5270],
    radius: 120,
    description: "Dense deciduous woodland northwest of campus with rich understory",
    color: HABITAT_COLORS["forest-floor"],
  },
  {
    habitat: "forest-floor",
    name: "Woods E of Campus",
    coords: [42.3065, -71.5195],
    radius: 100,
    description: "Mixed forest east of campus grounds",
    color: HABITAT_COLORS["forest-floor"],
  },

  // Woodland Edge
  {
    habitat: "woodland-edge",
    name: "Along Marlboro Road",
    coords: [42.3080, -71.5250],
    radius: 80,
    description: "Transitional zone between woodland and road along Marlboro Road",
    color: HABITAT_COLORS["woodland-edge"],
  },
  {
    habitat: "woodland-edge",
    name: "Campus Perimeter",
    coords: [42.3070, -71.5235],
    radius: 90,
    description: "Edge habitat along the campus tree line",
    color: HABITAT_COLORS["woodland-edge"],
  },

  // Roadside
  {
    habitat: "roadside",
    name: "Marlboro Road Corridor",
    coords: [42.3085, -71.5240],
    radius: 60,
    description: "Disturbed roadside habitat along Marlboro Road",
    color: HABITAT_COLORS["roadside"],
  },
  {
    habitat: "roadside",
    name: "Main Street Area",
    coords: [42.3055, -71.5250],
    radius: 60,
    description: "Roadside vegetation near Main Street",
    color: HABITAT_COLORS["roadside"],
  },

  // Wetland
  {
    habitat: "wetland",
    name: "Wetland S of Campus",
    coords: [42.3050, -71.5230],
    radius: 110,
    description: "Seasonal wetland area south of the school campus",
    color: HABITAT_COLORS["wetland"],
  },

  // Pond Edge
  {
    habitat: "pond-edge",
    name: "Pond near Fay School",
    coords: [42.3045, -71.5210],
    radius: 90,
    description: "Pond margin habitat with aquatic and emergent vegetation",
    color: HABITAT_COLORS["pond-edge"],
  },

  // Streambank
  {
    habitat: "streambank",
    name: "Stream Corridor",
    coords: [42.3060, -71.5200],
    radius: 70,
    description: "Riparian zone along the stream corridor",
    color: HABITAT_COLORS["streambank"],
  },

  // Meadow
  {
    habitat: "meadow",
    name: "Open Field near Athletic Fields",
    coords: [42.3080, -71.5215],
    radius: 100,
    description: "Open meadow and grassland near the athletic fields",
    color: HABITAT_COLORS["meadow"],
  },

  // Rocky Outcrop
  {
    habitat: "rocky-outcrop",
    name: "Rocky Area NW",
    coords: [42.3100, -71.5260],
    radius: 70,
    description: "Exposed rock formations with specialized plant communities",
    color: HABITAT_COLORS["rocky-outcrop"],
  },

  // Lawn Adjacent
  {
    habitat: "lawn-adjacent",
    name: "School Grounds",
    coords: [42.3075, -71.5235],
    radius: 80,
    description: "Managed lawn edges and garden borders on school grounds",
    color: HABITAT_COLORS["lawn-adjacent"],
  },
];
