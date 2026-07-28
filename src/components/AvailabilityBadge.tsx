"use client";

import { Info } from "lucide-react";
import { Plant } from "@/data/plants";
import CollectionCalendar from "@/components/CollectionCalendar";
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

  if (variant === "pill") {
    return (
      <span
        className={`mt-1 flex-shrink-0 rounded-md px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] ${
          collectionPolicy.type === "photograph-only"
            ? "bg-sky-200 text-sky-950"
            : "bg-green-300 text-green-900"
        }`}
      >
        {collectionPolicy.type === "photograph-only"
          ? "Photograph Now"
          : "Collectible Now"}
      </span>
    );
  }

  return (
    <div
      className="flex gap-3 rounded-lg border p-4"
      style={
        collectionPolicy.type === "photograph-only"
          ? { background: "#e0f2fe", borderColor: "#7dd3fc" }
          : { background: "#e8f5e2", borderColor: "#a8d58a" }
      }
    >
      <Info
        size={18}
        className={`flex-shrink-0 mt-0.5 ${
          collectionPolicy.type === "photograph-only"
            ? "text-sky-700"
            : "text-green-700"
        }`}
      />
      <div>
        <p
          className={`font-semibold text-sm ${
            collectionPolicy.type === "photograph-only"
              ? "text-sky-900"
              : "text-green-800"
          }`}
        >
          {collectionPolicy.type === "photograph-only"
            ? "Photograph This Week"
            : "Collectible This Week"}
        </p>
        <p
          className={`text-sm mt-0.5 ${
            collectionPolicy.type === "photograph-only"
              ? "text-sky-800"
              : "text-green-700"
          }`}
        >
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
