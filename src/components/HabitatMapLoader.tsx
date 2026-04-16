"use client";

import dynamic from "next/dynamic";
import type { Plant, Habitat } from "@/data/plants";
import type { HabitatLocation } from "@/data/habitatLocations";

const HabitatMap = dynamic(() => import("@/components/HabitatMap"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-xl border flex items-center justify-center"
      style={{
        height: "300px",
        background: "var(--color-primary-pale)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="text-center">
        <div className="text-4xl mb-2">🗺️</div>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Loading map...
        </p>
      </div>
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
}

export default function HabitatMapLoader(props: HabitatMapLoaderProps) {
  return <HabitatMap {...props} />;
}
