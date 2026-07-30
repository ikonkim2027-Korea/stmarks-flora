import { Metadata } from "next";
import { plants } from "@/data/plants";
import { habitatLocations } from "@/data/habitatLocations";
import { getHabitatDotClass, getHabitatLabel } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RadiusExplorer from "@/components/RadiusExplorer";

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
          count: plants.filter((p) => p.habitat.includes(loc.habitat)).length,
        },
      ])
    ).values()
  );

  return (
    <div className="atlas-shell py-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-soft transition-colors hover:text-text"
      >
        <ArrowLeft size={14} />
        Back to home
      </Link>

      {/* Header */}
      <div className="mt-6 mb-7">
        <p className="section-label">Survey radius</p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          Interactive habitat map
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-text-soft">
          Explore the survey area within 1km of St. Mark&apos;s School. Grow or
          shrink the radius to see which habitat zones fall inside it, then
          select a zone to see the plants found there.
        </p>
      </div>

      {/* Map */}
      <div className="mb-8">
        <RadiusExplorer />
      </div>

      {/* Habitat breakdown */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Habitats in the survey area
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {habitatStats.map(({ habitat, count }) => (
            <Link
              key={habitat}
              href={`/habitats#${habitat}`}
              className="group flex items-center gap-3 rounded-tile bg-canvas p-3 transition-colors hover:bg-tint"
            >
              <span
                className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${getHabitatDotClass(habitat)}`}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-text group-hover:text-moss">
                  {getHabitatLabel(habitat)}
                </div>
                <div className="text-xs text-text-soft">{count} species</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
