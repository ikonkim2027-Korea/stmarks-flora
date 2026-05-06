"use client";

import { PlantCategory, Habitat } from "@/data/plants";
import { getCategoryColor, getHabitatIcon, getHabitatLabel, formatMonthShort } from "@/lib/utils";
import { SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export interface FilterState {
  categories: PlantCategory[];
  habitats: Habitat[];
  nativeStatuses: ("native" | "naturalized" | "invasive")[];
  months: number[];
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
}

const ALL_CATEGORIES: PlantCategory[] = ["tree", "shrub", "wildflower", "fern", "grass", "vine"];
const ALL_HABITATS: Habitat[] = [
  "forest-floor", "woodland-edge", "roadside", "wetland",
  "pond-edge", "lawn-adjacent", "rocky-outcrop", "meadow", "streambank",
];
const ALL_NATIVE_STATUSES = ["native", "naturalized", "invasive"] as const;
const COLLECTION_MONTHS = [4, 5, 6, 7, 8, 9, 10, 11];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-3 border-b pb-3" style={{ borderColor: "var(--color-border)" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-2 flex w-full items-center justify-between text-sm font-black transition-opacity hover:opacity-70"
        style={{ color: "var(--color-text)" }}
      >
        {title}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && children}
    </div>
  );
}

function CheckItem({
  checked,
  label,
  badge,
  onChange,
}: {
  checked: boolean;
  label: string;
  badge?: React.ReactNode;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border"
        style={{ accentColor: "var(--color-primary)" }}
      />
      <span className="flex items-center gap-1.5 text-sm font-medium transition-opacity group-hover:opacity-80" style={{ color: "var(--color-text)" }}>
        {badge}
        {label}
      </span>
    </label>
  );
}

export default function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const activeCount =
    filters.categories.length +
    filters.habitats.length +
    filters.nativeStatuses.length +
    filters.months.length;

  function toggleCategory(cat: PlantCategory, checked: boolean) {
    onChange({
      ...filters,
      categories: checked
        ? [...filters.categories, cat]
        : filters.categories.filter((c) => c !== cat),
    });
  }

  function toggleHabitat(hab: Habitat, checked: boolean) {
    onChange({
      ...filters,
      habitats: checked
        ? [...filters.habitats, hab]
        : filters.habitats.filter((h) => h !== hab),
    });
  }

  function toggleNative(status: "native" | "naturalized" | "invasive", checked: boolean) {
    onChange({
      ...filters,
      nativeStatuses: checked
        ? [...filters.nativeStatuses, status]
        : filters.nativeStatuses.filter((s) => s !== status),
    });
  }

  function toggleMonth(month: number, checked: boolean) {
    onChange({
      ...filters,
      months: checked
        ? [...filters.months, month]
        : filters.months.filter((m) => m !== month),
    });
  }

  return (
    <div
      className="atlas-panel p-4 shadow-none"
      style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} style={{ color: "var(--color-primary)" }} />
          <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
            Filters
          </span>
          {activeCount > 0 && (
            <span className="rounded-md bg-[var(--color-ink)] px-1.5 py-0.5 text-xs font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-bold hover:underline"
            style={{ color: "var(--color-secondary)" }}
          >
            Reset all
          </button>
        )}
      </div>

      {/* Category */}
      <Section title="Category">
        <div className="flex flex-col gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <CheckItem
              key={cat}
              checked={filters.categories.includes(cat)}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              badge={
                <span className={`rounded border px-1.5 py-0 text-xs ${getCategoryColor(cat)}`}>
                  &nbsp;
                </span>
              }
              onChange={(checked) => toggleCategory(cat, checked)}
            />
          ))}
        </div>
      </Section>

      {/* Native Status */}
      <Section title="Native Status">
        <div className="flex flex-col gap-1.5">
          {ALL_NATIVE_STATUSES.map((status) => (
            <CheckItem
              key={status}
              checked={filters.nativeStatuses.includes(status)}
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              onChange={(checked) => toggleNative(status, checked)}
            />
          ))}
        </div>
      </Section>

      {/* Habitat */}
      <Section title="Habitat">
        <div className="flex flex-col gap-1.5">
          {ALL_HABITATS.map((hab) => (
            <CheckItem
              key={hab}
              checked={filters.habitats.includes(hab)}
              label={getHabitatLabel(hab)}
              badge={<span>{getHabitatIcon(hab)}</span>}
              onChange={(checked) => toggleHabitat(hab, checked)}
            />
          ))}
        </div>
      </Section>

      {/* Month */}
      <Section title="Collectible in Month">
        <div className="grid grid-cols-4 gap-1.5">
          {COLLECTION_MONTHS.map((month) => {
            const checked = filters.months.includes(month);
            return (
              <button
                key={month}
                onClick={() => toggleMonth(month, !checked)}
                className={`text-xs py-1.5 rounded-lg border font-medium transition-colors ${
                  checked
                    ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
                    : "border-gray-200 hover:border-green-300"
                }`}
                style={!checked ? { color: "var(--color-text-muted)" } : {}}
              >
                {formatMonthShort(month)}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
