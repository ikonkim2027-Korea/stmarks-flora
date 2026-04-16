import Link from "next/link";
import { Plant } from "@/data/plants";
import {
  getCategoryColor,
  getCategoryDotColor,
  getHabitatIcon,
  formatMonthShort,
  getNativeStatusColor,
  getNativeStatusLabel,
} from "@/lib/utils";

interface PlantCardProps {
  plant: Plant;
  currentMonth?: number;
}

export default function PlantCard({ plant, currentMonth }: PlantCardProps) {
  const categoryColor = getCategoryColor(plant.category);
  const dotColor = getCategoryDotColor(plant.category);
  const nativeColor = getNativeStatusColor(plant.nativeStatus);
  const nativeLabel = getNativeStatusLabel(plant.nativeStatus);

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
        className="rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden h-full flex flex-col"
        style={{
          background: "var(--color-card)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Top color strip by category */}
        <div className={`h-1.5 ${dotColor}`} />

        {/* Card body */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3
                className="font-semibold text-base leading-tight truncate"
                style={{ color: "var(--color-text)" }}
              >
                {plant.commonName}
              </h3>
              <p className="text-sm italic mt-0.5 truncate" style={{ color: "var(--color-text-muted)" }}>
                {plant.scientificName}
              </p>
            </div>
            {isCurrentlyAvailable && (
              <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium border border-green-300">
                Now
              </span>
            )}
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${categoryColor}`}
            >
              {plant.category}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${nativeColor}`}
            >
              {nativeLabel}
            </span>
          </div>

          {/* Family */}
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Family: <span className="font-medium italic">{plant.family}</span>
          </p>

          {/* Habitats */}
          <div className="flex flex-wrap gap-1">
            {plant.habitat.map((h) => (
              <span
                key={h}
                className="text-xs"
                title={h}
              >
                {getHabitatIcon(h)}
              </span>
            ))}
          </div>

          {/* Collection month dots */}
          <div className="mt-auto pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-xs mb-1.5 font-medium" style={{ color: "var(--color-text-muted)" }}>
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
                    className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium transition-colors ${
                      active
                        ? isCurrent
                          ? `${dotColor} text-white ring-2 ring-offset-1 ring-green-400`
                          : `${dotColor} text-white opacity-80`
                        : "bg-gray-100 text-gray-400"
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
