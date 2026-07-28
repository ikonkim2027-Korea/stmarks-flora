"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { plants } from "@/data/plants";
import PlantCard from "@/components/PlantCard";
import { getDiscoverablePlantsForWeek } from "@/lib/plantDiscovery";
import { useCurrentMonthWeek } from "@/lib/useCurrentMonthWeek";

export default function FieldReadySection() {
  const now = useCurrentMonthWeek();
  if (!now) return null;

  const availableNow = getDiscoverablePlantsForWeek(now.month, now.week, plants);
  const fieldReadyPlants = [
    ...availableNow.collectible,
    ...availableNow.observationOnly,
  ];
  if (fieldReadyPlants.length === 0) return null;

  return (
    <section className="atlas-shell py-14">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="atlas-kicker">Current field window</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Field-ready now
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
            {availableNow.collectible.length} collectible specimens and{" "}
            {availableNow.observationOnly.length} photograph-only observations.
          </p>
        </div>
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 text-sm font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          View full calendar
          <ArrowUpRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fieldReadyPlants.slice(0, 8).map((plant) => (
          <PlantCard key={plant.id} plant={plant} currentMonth={now.month} />
        ))}
      </div>
    </section>
  );
}
