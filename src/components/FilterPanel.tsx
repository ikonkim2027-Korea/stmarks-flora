"use client";

import { PlantCategory, Habitat } from "@/data/plants";
import { getHabitatLabel, formatMonthShort } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Chip from "@/components/ui/Chip";

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
    <div className="mb-4 last:mb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="section-label mb-2 flex w-full items-center justify-between transition-colors hover:text-text"
      >
        {title}
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && children}
    </div>
  );
}

/** Pill-shaped checkbox: the native input stays for semantics and keyboard use. */
function PillToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={`chip cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sage ${
        checked ? "bg-ink text-white" : "bg-tint text-text-soft hover:bg-sage/45"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {label}
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
    <div className="card p-5">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-text">Filters</span>
          {activeCount > 0 && <Chip tone="ink">{activeCount}</Chip>}
        </div>
        {activeCount > 0 && (
          <button onClick={onReset} className="btn-ghost text-sm">
            Reset all
          </button>
        )}
      </div>

      {/* Category */}
      <Section title="Category">
        <div className="flex flex-wrap gap-1.5">
          {ALL_CATEGORIES.map((cat) => (
            <PillToggle
              key={cat}
              checked={filters.categories.includes(cat)}
              label={cat.charAt(0).toUpperCase() + cat.slice(1)}
              onChange={(checked) => toggleCategory(cat, checked)}
            />
          ))}
        </div>
      </Section>

      {/* Native Status */}
      <Section title="Native status">
        <div className="flex flex-wrap gap-1.5">
          {ALL_NATIVE_STATUSES.map((status) => (
            <PillToggle
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
        <div className="flex flex-wrap gap-1.5">
          {ALL_HABITATS.map((hab) => (
            <PillToggle
              key={hab}
              checked={filters.habitats.includes(hab)}
              label={getHabitatLabel(hab)}
              onChange={(checked) => toggleHabitat(hab, checked)}
            />
          ))}
        </div>
      </Section>

      {/* Month */}
      <Section title="Collectible in month">
        <div className="flex flex-wrap gap-1.5">
          {COLLECTION_MONTHS.map((month) => (
            <PillToggle
              key={month}
              checked={filters.months.includes(month)}
              label={formatMonthShort(month)}
              onChange={(checked) => toggleMonth(month, checked)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
