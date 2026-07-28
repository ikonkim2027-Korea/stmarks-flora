import { plants } from "@/data/plants";
import CalendarContent from "./CalendarContent";

export default function CalendarPage() {
  return (
    <div className="atlas-shell py-10">
      <div className="mb-8">
        <p className="section-label">Seasonal windows</p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          Collection calendar
        </h1>
        <p className="mt-3 text-sm text-text-soft">
          Month-by-month field timing for all {plants.length} documented species,
          April through November.
        </p>
      </div>

      <CalendarContent />
    </div>
  );
}
