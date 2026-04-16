import { Suspense } from "react";
import BrowseContent from "./BrowseContent";
import { plants } from "@/data/plants";

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>
              Plant Index
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
              {plants.length} species documented within 1km of St. Mark&apos;s School
            </p>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-10 rounded-lg bg-gray-200 w-full" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-52 rounded-xl bg-gray-200" />
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
