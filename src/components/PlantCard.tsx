import Link from "next/link";
import { Plant } from "@/data/plants";
import { getCategoryTone, getNativeStatusTone, getNativeStatusLabel, getHabitatLabel, formatMonthShort } from "@/lib/utils";
import { getCollectionPolicy } from "@/lib/plantDiscovery";
import Chip from "@/components/ui/Chip";

interface PlantCardProps {
  plant: Plant;
  currentMonth?: number;
}

export default function PlantCard({ plant, currentMonth }: PlantCardProps) {
  const collectionPolicy = getCollectionPolicy(plant);
  const activeMonths = Array.from(new Set(plant.collectionWindows.map((w) => w.month))).sort((a, b) => a - b);
  const isCurrentlyAvailable =
    currentMonth !== undefined && plant.collectionWindows.some((w) => w.month === currentMonth);

  return (
    <Link href={`/plants/${plant.id}`} className="group block">
      <div className="card card-hover flex h-full flex-col overflow-hidden">
        {plant.imageUrl && (
          <div className="relative aspect-[4/3] overflow-hidden bg-tint">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={plant.imageUrl}
              alt={plant.commonName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {isCurrentlyAvailable && (
              <Chip
                tone={collectionPolicy.type === "photograph-only" ? "mist" : "sprout"}
                className="absolute left-3 top-3 shadow-card"
              >
                {collectionPolicy.type === "photograph-only" ? "Photo now" : "In season"}
              </Chip>
            )}
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold tracking-tight text-text">{plant.commonName}</h3>
            <p className="sci-name mt-0.5 truncate text-sm text-text-soft">{plant.scientificName}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Chip tone={getCategoryTone(plant.category)}>{plant.category}</Chip>
            <Chip tone={getNativeStatusTone(plant.nativeStatus)}>{getNativeStatusLabel(plant.nativeStatus)}</Chip>
            {collectionPolicy.type !== "collect" && <Chip tone="mist">{collectionPolicy.shortLabel}</Chip>}
          </div>
          <p className="truncate text-xs text-text-soft">
            {plant.family} · {plant.habitat.map(getHabitatLabel).join(", ")}
          </p>
          <div className="mt-auto pt-3">
            <div className="flex items-center gap-1">
              {[4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
                const active = activeMonths.includes(month);
                const isCurrent = currentMonth === month;
                return (
                  <span
                    key={month}
                    title={`${formatMonthShort(month)}${active ? ": in window" : ""}`}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      active ? (isCurrent ? "bg-sprout" : "bg-moss/70") : "bg-tint"
                    }`}
                  />
                );
              })}
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-text-soft">
              <span>Apr</span>
              <span>Nov</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
