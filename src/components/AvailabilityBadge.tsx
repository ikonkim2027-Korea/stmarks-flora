"use client";

import { Info } from "lucide-react";
import { Plant } from "@/data/plants";
import CollectionCalendar from "@/components/CollectionCalendar";
import Chip from "@/components/ui/Chip";
import { getCollectionPolicy } from "@/lib/plantDiscovery";
import { useCurrentMonthWeek } from "@/lib/useCurrentMonthWeek";

interface AvailabilityBadgeProps {
  plant: Plant;
  /** "pill" is the header-band badge, "note" is the callout block. */
  variant: "pill" | "note";
}

export default function AvailabilityBadge({
  plant,
  variant,
}: AvailabilityBadgeProps) {
  const now = useCurrentMonthWeek();

  const currentWindow = now
    ? plant.collectionWindows.find(
        (w) => w.month === now.month && w.weeks.includes(now.week)
      )
    : undefined;
  const isAvailableNow = currentWindow !== undefined;

  if (!isAvailableNow) return null;

  const collectionPolicy = getCollectionPolicy(plant);

  const photoOnly = collectionPolicy.type === "photograph-only";

  if (variant === "pill") {
    return (
      <Chip tone={photoOnly ? "mist" : "sprout"} className="flex-shrink-0">
        {photoOnly ? "Photograph now" : "Collectible now"}
      </Chip>
    );
  }

  return (
    <div
      className={`flex gap-3 rounded-tile p-4 ${
        photoOnly ? "bg-mist-tint text-mist" : "bg-moss-tint text-moss"
      }`}
    >
      <Info size={16} className="mt-0.5 flex-shrink-0" />
      <div className="text-sm leading-6">
        <p className="font-semibold">
          {photoOnly ? "Photograph this week" : "Collectible this week"}
        </p>
        <p>
          {currentWindow.note} {collectionPolicy.description}
        </p>
      </div>
    </div>
  );
}

/**
 * Renders the collection calendar with the live current month/week highlighted.
 * Both stay undefined until the hook resolves, so the prerendered HTML has no
 * "now" marker to disagree with.
 */
export function CalendarWithNow({ plant }: { plant: Plant }) {
  const now = useCurrentMonthWeek();

  return (
    <CollectionCalendar
      collectionWindows={plant.collectionWindows}
      currentMonth={now?.month}
      currentWeek={now?.week}
    />
  );
}
