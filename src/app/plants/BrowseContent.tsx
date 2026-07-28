"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { plants, PlantCategory } from "@/data/plants";
import PlantCard from "@/components/PlantCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import { useCurrentMonthWeek } from "@/lib/useCurrentMonthWeek";
import { filterPlants, PlantSortKey } from "@/lib/plantDiscovery";
import { SlidersHorizontal, X, ArrowUpDown, Search } from "lucide-react";
import PDFExport from "@/components/PDFExport";

const EMPTY_FILTERS: FilterState = {
  categories: [],
  habitats: [],
  nativeStatuses: [],
  months: [],
};

export default function BrowseContent() {
  const searchParams = useSearchParams();
  const now = useCurrentMonthWeek();

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
  const [sort, setSort] = useState<PlantSortKey>("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return filterPlants(plants, { query, filters, sort });
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
    <div className="atlas-shell py-10">
      <div className="mb-8 border-b pb-6" style={{ borderColor: "var(--color-border)" }}>
        <p className="atlas-kicker">Specimen database</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl" style={{ color: "var(--color-text)" }}>
          Plant index
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
            {`${plants.length} species documented within 1km of St. Mark's School`}
          </p>
          <PDFExport variant="subtle" />
        </div>
      </div>

      <div className="mb-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as PlantSortKey)}
              className="cursor-pointer appearance-none rounded-lg border py-3 pl-8 pr-4 text-sm font-bold focus:outline-none"
              style={{
                background: "var(--color-card)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              <option value="relevance">Sort: Relevance</option>
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
            className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-bold transition-colors ${
              showFilters || activeFilterCount > 0
                ? "bg-[var(--color-ink)] text-white border-[var(--color-ink)]"
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
          <aside className="hidden w-64 flex-shrink-0 lg:block">
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
              className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-bold"
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
                  className="inline-flex items-center gap-1 rounded-md border px-3 py-1 text-xs font-bold transition-opacity hover:opacity-70"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                >
                  <X size={12} />
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <p className="mb-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
            Showing{" "}
            <span className="font-semibold" style={{ color: "var(--color-text)" }}>
              {filtered.length}
            </span>{" "}
            of {plants.length} species
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((plant) => (
                <PlantCard key={plant.id} plant={plant} currentMonth={now?.month} />
              ))}
            </div>
          ) : (
            <div
              className="atlas-panel p-12 text-center"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
            >
              <Search className="mx-auto mb-4" size={34} strokeWidth={1.4} style={{ color: "var(--color-primary)" }} />
              <p className="mb-1 text-lg font-black" style={{ color: "var(--color-text)" }}>
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
