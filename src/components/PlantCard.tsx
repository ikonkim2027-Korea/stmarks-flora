import Link from "next/link";
import { Plant } from "@/data/plants";
import {
  getCategoryColor,
  getCategoryDotColor,
  getHabitatLabel,
  formatMonthShort,
  getNativeStatusColor,
  getNativeStatusLabel,
} from "@/lib/utils";
import { getCollectionPolicy } from "@/lib/plantDiscovery";

interface PlantCardProps {
  plant: Plant;
  currentMonth?: number;
}

export default function PlantCard({ plant, currentMonth }: PlantCardProps) {
  const categoryColor = getCategoryColor(plant.category);
  const dotColor = getCategoryDotColor(plant.category);
  const nativeColor = getNativeStatusColor(plant.nativeStatus);
  const nativeLabel = getNativeStatusLabel(plant.nativeStatus);
  const collectionPolicy = getCollectionPolicy(plant);

  // months that have collection windows
  const activeMonths = Array.from(
    new Set(plant.collectionWindows.map((w) => w.month))
  ).sort((a, b) => a - b);

  const isCurrentlyAvailable =
    currentMonth !== undefined &&
    plant.collectionWindows.some((w) => w.month === currentMonth);

  return (
    <Link href={`/plants/${plant.id}`} className="block group">
      <div
        className="atlas-card flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1"
      >
        {/* Top color strip by category */}
        <div className={`h-1 ${dotColor}`} />

        {/* Image */}
        {plant.imageUrl && (
          <div className="aspect-[4/3] overflow-hidden bg-[var(--color-field)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plant.imageUrl}
              alt={plant.commonName}
              loading="lazy"
              className="h-full w-full object-cover saturate-[0.92] transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Card body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="truncate text-base font-black leading-tight tracking-tight"
                style={{ color: "var(--color-text)" }}
              >
                {plant.commonName}
              </h3>
              <p className="mt-1 truncate text-xs italic" style={{ color: "var(--color-text-muted)" }}>
                {plant.scientificName}
              </p>
            </div>
            {isCurrentlyAvailable && (
              <span
                className={`flex-shrink-0 rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
                  collectionPolicy.type === "photograph-only"
                    ? "bg-sky-100 text-sky-800 border-sky-300"
                    : "bg-green-100 text-green-800 border-green-300"
                }`}
              >
                {collectionPolicy.type === "photograph-only" ? "Photo" : "Now"}
              </span>
            )}
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${categoryColor}`}
            >
              {plant.category}
            </span>
            <span
              className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${nativeColor}`}
            >
              {nativeLabel}
            </span>
            {collectionPolicy.type !== "collect" && (
              <span className="rounded-md border border-sky-300 bg-sky-100 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-sky-800">
                {collectionPolicy.shortLabel}
              </span>
            )}
          </div>

          {/* Family */}
          <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
            Family <span className="font-bold italic text-[var(--color-text)]">{plant.family}</span>
          </p>

          {/* Habitats */}
          <div className="flex flex-wrap gap-1.5">
            {plant.habitat.map((h) => (
              <span
                key={h}
                className="rounded-md border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-muted)",
                }}
                title={getHabitatLabel(h)}
              >
                {getHabitatLabel(h)}
              </span>
            ))}
          </div>

          {/* Collection month dots */}
          <div className="mt-auto border-t pt-3" style={{ borderColor: "var(--color-border)" }}>
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: "var(--color-text-muted)" }}>
              Collection months
            </p>
            <div className="flex gap-1 flex-wrap">
              {[4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
                const active = activeMonths.includes(month);
                const isCurrent = currentMonth === month;
                return (
                  <span
                    key={month}
                    title={active ? `${formatMonthShort(month)}: collectible` : formatMonthShort(month)}
                    className={`flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-black transition-colors ${
                      active
                        ? isCurrent
                          ? `${dotColor} text-white ring-2 ring-offset-1 ring-[var(--color-accent)]`
                          : `${dotColor} text-white opacity-80`
                        : "bg-[var(--color-field)] text-gray-400"
                    }`}
                  >
                    {formatMonthShort(month).charAt(0)}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
