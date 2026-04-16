"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { plants, PlantCategory, Habitat } from "@/data/plants";
import PlantCard from "@/components/PlantCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import { getCurrentMonthWeek, plantHasWindowInMonth } from "@/lib/utils";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import PDFExport from "@/components/PDFExport";

type SortKey = "commonName" | "scientificName" | "family" | "category";

const EMPTY_FILTERS: FilterState = {
  categories: [],
  habitats: [],
  nativeStatuses: [],
  months: [],
};

export default function BrowseContent() {
  const searchParams = useSearchParams();
  const { month: currentMonth } = getCurrentMonthWeek();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState<FilterState>(() => {
    const cat = searchParams.get("category") as PlantCategory | null;
    const mon = searchParams.get("month");
    return {
      categories: cat ? [cat] : [],
      habitats: [],
      nativeStatuses: [],
      months: mon ? [parseInt(mon)] : [],
    };
  });
  const [sort, setSort] = useState<SortKey>("commonName");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = plants;

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.commonName.toLowerCase().includes(q) ||
          p.scientificName.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    if (filters.habitats.length > 0) {
      result = result.filter((p) =>
        filters.habitats.some((h) => p.habitat.includes(h as Habitat))
      );
    }

    if (filters.nativeStatuses.length > 0) {
      result = result.filter((p) =>
        filters.nativeStatuses.includes(p.nativeStatus)
      );
    }

    if (filters.months.length > 0) {
      result = result.filter((p) =>
        filters.months.some((m) => plantHasWindowInMonth(p, m))
      );
    }

    result = [...result].sort((a, b) => {
      const av = a[sort] as string;
      const bv = b[sort] as string;
      return av.localeCompare(bv);
    });

    return result;
  }, [query, filters, sort]);

  const activeFilterCount =
    filters.categories.length +
    filters.habitats.length +
    filters.nativeStatuses.length +
    filters.months.length;

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setQuery("");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>
          Plant Index
        </h1>
        <div className="mt-2 flex items-center gap-3">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {plants.length} species documented within 1km of St. Mark&apos;s School
          </p>
          <PDFExport variant="subtle" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none pl-8 pr-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer focus:outline-none"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              <option value="commonName">Sort: Common Name</option>
              <option value="scientificName">Sort: Scientific Name</option>
              <option value="family">Sort: Family</option>
              <option value="category">Sort: Category</option>
            </select>
            <ArrowUpDown
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--color-text-muted)" }}
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-green-700 text-white border-green-700"
                : ""
            }`}
            style={
              !showFilters && activeFilterCount === 0
                ? {
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }
                : {}
            }
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-green-800 text-xs px-1.5 py-0 rounded-full font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {showFilters && (
          <aside className="w-60 flex-shrink-0 hidden lg:block">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={() => setFilters(EMPTY_FILTERS)}
            />
          </aside>
        )}

        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowFilters(false)}
            />
            <div
              className="relative ml-auto w-72 h-full overflow-y-auto p-4"
              style={{ background: "var(--color-background)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold" style={{ color: "var(--color-text)" }}>
                  Filters
                </span>
                <button onClick={() => setShowFilters(false)}>
                  <X size={20} style={{ color: "var(--color-text)" }} />
                </button>
              </div>
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                onReset={() => setFilters(EMPTY_FILTERS)}
              />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {(activeFilterCount > 0 || query) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {query && (
                <span
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border"
                  style={{
                    background: "var(--color-primary-pale)",
                    borderColor: "var(--color-primary)",
                    color: "var(--color-primary)",
                  }}
                >
                  &ldquo;{query}&rdquo;
                  <button onClick={() => setQuery("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full border hover:opacity-70 transition-opacity"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                >
                  <X size={12} />
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
            Showing{" "}
            <span className="font-semibold" style={{ color: "var(--color-text)" }}>
              {filtered.length}
            </span>{" "}
            of {plants.length} species
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((plant) => (
                <PlantCard key={plant.id} plant={plant} currentMonth={currentMonth} />
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl border p-12 text-center"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
            >
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-semibold text-lg mb-1" style={{ color: "var(--color-text)" }}>
                No plants found
              </p>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Try adjusting your search or filters
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 text-sm font-medium hover:underline"
                style={{ color: "var(--color-primary)" }}
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
