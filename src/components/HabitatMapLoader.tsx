"use client";

import dynamic from "next/dynamic";
import type { Plant, Habitat } from "@/data/plants";
import type { HabitatLocation } from "@/data/habitatLocations";

const HabitatMap = dynamic(() => import("@/components/HabitatMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex animate-pulse items-center justify-center rounded-tile bg-tint"
      style={{ height: "300px" }}
    >
      <p className="text-sm text-text-soft">Loading map</p>
    </div>
  ),
});

interface HabitatMapLoaderProps {
  habitatLocations: HabitatLocation[];
  plants: Plant[];
  schoolCenter: [number, number];
  surveyRadius: number;
  selectedHabitat?: Habitat;
  height?: number;
  showLegend?: boolean;
  radius?: number;
  onRadiusChange?: (meters: number) => void;
  activeHabitats?: Set<Habitat>;
}

export default function HabitatMapLoader(props: HabitatMapLoaderProps) {
  return <HabitatMap {...props} />;
}
