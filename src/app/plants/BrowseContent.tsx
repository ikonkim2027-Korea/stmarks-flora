"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { plants, PlantCategory } from "@/data/plants";
import PlantCard from "@/components/PlantCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import Chip from "@/components/ui/Chip";
import { useCurrentMonthWeek } from "@/lib/useCurrentMonthWeek";
import { filterPlants, PlantSortKey } from "@/lib/plantDiscovery";
import { SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
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
      <div className="mb-8">
        <p className="section-label">Specimen database</p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          Plant index
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-sm text-text-soft">
            {`${plants.length} species documented within 1km of St. Mark's School`}
          </p>
          <PDFExport variant="subtle" />
        </div>
      </div>

      <div className="mb-7 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative flex items-center rounded-full bg-surface px-4 py-3 text-sm font-medium shadow-card">
            <ArrowUpDown size={14} className="pointer-events-none text-text-soft" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as PlantSortKey)}
              className="cursor-pointer appearance-none bg-transparent pl-2 pr-1 text-sm font-medium text-text focus:outline-none"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="commonName">Sort: Common Name</option>
              <option value="scientificName">Sort: Scientific Name</option>
              <option value="family">Sort: Family</option>
              <option value="category">Sort: Category</option>
            </select>
          </div>
          <button onClick={() => setShowFilters((v) => !v)} className="btn-ghost">
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && <Chip tone="ink">{activeFilterCount}</Chip>}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-6">
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
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="absolute inset-0 bg-ink/40"
              onClick={() => setShowFilters(false)}
            />
            <div className="relative ml-auto h-full w-80 overflow-y-auto bg-canvas p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold tracking-tight text-text">
                  Filters
                </span>
                <button
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters"
                  className="rounded-full bg-surface p-2 text-text shadow-card transition-colors hover:bg-tint"
                >
                  <X size={16} />
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

        <div className="min-w-0 flex-1">
          {(activeFilterCount > 0 || query) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {query && (
                <span className="chip bg-tint text-text">
                  &ldquo;{query}&rdquo;
                  <button onClick={() => setQuery("")} aria-label="Clear search">
                    <X size={12} />
                  </button>
                </span>
              )}
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="chip bg-surface text-text-soft shadow-card transition-colors hover:bg-tint"
                >
                  <X size={12} />
                  Clear all filters
                </button>
              )}
            </div>
          )}

          <p className="mb-4 text-sm text-text-soft">
            Showing <span className="font-medium text-text">{filtered.length}</span> of{" "}
            {plants.length} species
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((plant) => (
                <PlantCard key={plant.id} plant={plant} currentMonth={now?.month} />
              ))}
            </div>
          ) : (
            <div className="card p-10 text-center">
              <p className="text-lg font-semibold tracking-tight text-text">
                No plants found
              </p>
              <p className="mt-1.5 text-sm text-text-soft">
                Try a different search term, or loosen the active filters.
              </p>
              <button onClick={resetFilters} className="btn-ghost mt-5">
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
