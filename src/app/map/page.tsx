import { Metadata } from "next";
import { plants } from "@/data/plants";
import {
  habitatLocations,
  SCHOOL_CENTER,
  SURVEY_RADIUS,
} from "@/data/habitatLocations";
import { getHabitatIcon, getHabitatLabel } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import HabitatMapLoader from "@/components/HabitatMapLoader";

export const metadata: Metadata = {
  title: "Interactive Map | Tiny Worlds Collectibles",
  description:
    "Explore habitat zones and find plants on an interactive map of the St. Mark's School campus area.",
};

export default function MapPage() {
  // Build habitat summary stats
  const habitatStats = Array.from(
    new Map(
      habitatLocations.map((loc) => [
        loc.habitat,
        {
          habitat: loc.habitat,
          color: loc.color,
          count: plants.filter((p) => p.habitat.includes(loc.habitat)).length,
        },
      ])
    ).values()
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm hover:underline mb-6"
        style={{ color: "var(--color-text-muted)" }}
      >
        <ArrowLeft size={14} />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-3xl font-bold flex items-center gap-2"
          style={{ color: "var(--color-text)" }}
        >
          <MapPin size={28} style={{ color: "var(--color-primary)" }} />
          Interactive Habitat Map
        </h1>
        <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
          Explore the survey area within 1km of St. Mark&apos;s School. Click on
          habitat zones to see the plants found there.
        </p>
      </div>

      {/* Map */}
      <div
        className="rounded-2xl border overflow-hidden mb-8"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-card)",
        }}
      >
        <div className="p-4">
          <HabitatMapLoader
            habitatLocations={habitatLocations}
            plants={plants}
            schoolCenter={SCHOOL_CENTER}
            surveyRadius={SURVEY_RADIUS}
            height={500}
            showLegend={true}
          />
        </div>
      </div>

      {/* Habitat breakdown */}
      <div
        className="rounded-2xl border p-6"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: "var(--color-text)" }}
        >
          Habitats in the Survey Area
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {habitatStats.map(({ habitat, color, count }) => (
            <Link
              key={habitat}
              href={`/habitats#${habitat}`}
              className="flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm transition-all"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${color}20` }}
              >
                {getHabitatIcon(habitat)}
              </div>
              <div className="min-w-0">
                <div
                  className="font-semibold text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {getHabitatLabel(habitat)}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {count} species
                </div>
              </div>
              <div
                className="ml-auto flex-shrink-0 w-3 h-3 rounded-full"
                style={{ background: color }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
