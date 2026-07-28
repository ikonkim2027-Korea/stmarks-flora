import { Suspense } from "react";
import BrowseContent from "./BrowseContent";
import { plants } from "@/data/plants";

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="atlas-shell py-10">
          <div className="mb-8">
            <p className="section-label">Specimen database</p>
            <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              Plant index
            </h1>
            <p className="mt-3 text-sm text-text-soft">
              {plants.length} species documented within 1km of St. Mark&apos;s School
            </p>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-full rounded-full bg-tint" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-52 rounded-card bg-tint" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
