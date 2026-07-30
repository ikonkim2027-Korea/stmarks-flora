import { Plant } from "@/data/plants";
import { getEnrichment, observedMonths, observedPeakMonths } from "@/lib/enrichment";
import { formatMonthName, formatMonthShort } from "@/lib/utils";

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** Bar track height in px. Bars are drawn as a fraction of this. */
const TRACK = 64;
/** A single observation must still be visible, so bars never fall below this. */
const MIN_BAR = 2;

function listMonths(months: number[]): string {
  const names = months.map(formatMonthName);
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/**
 * One sentence comparing the guide's hand-authored collection window against
 * the months iNaturalist actually records this species in flower.
 *
 * The branches are ordered by how much the reader needs to know:
 *  1. no records at all — nothing to compare (ferns and conifers never flower)
 *  2. bloom observed outside the guide window — the guide misses real months,
 *     the only case where the guide could send someone out at the wrong time
 *  3. guide window covers the bloom but reaches past it — over-broad, harmless
 *  4. the two agree
 */
export function seasonVerdict(guideMonths: Set<number>, observedPeak: number[]): string {
  if (observedPeak.length === 0) return "No flowering records for this species yet.";

  const beyondGuide = observedPeak.filter((m) => !guideMonths.has(m));
  if (beyondGuide.length > 0) {
    return `Observed bloom also extends into ${listMonths(beyondGuide)}.`;
  }

  // Every observed month is covered, so any leftover guide month means the
  // window is the wider of the two. Note the wording: "narrower" would
  // describe the opposite of what this branch tests.
  const beyondObserved = [...guideMonths].filter((m) => !observedPeak.includes(m));
  if (beyondObserved.length > 0) return "Guide window is wider than observed records.";

  return "Guide window matches observed bloom.";
}

export default function PhenologyChart({ plant }: { plant: Plant }) {
  const enrichment = getEnrichment(plant.id);
  const flowering = observedMonths(plant.id);
  const observedPeak = observedPeakMonths(plant.id);
  const peak = Math.max(...flowering);
  const totalRecords = flowering.reduce((sum, n) => sum + n, 0);

  const guideMonths = new Set(plant.collectionWindows.map((w) => w.month));
  const verdict = seasonVerdict(guideMonths, observedPeak);

  const inatTaxonId = enrichment?.inatTaxonId ?? null;
  const nearby = enrichment?.nearbyObservations ?? 0;
  const recordsLabel = `Flowering records: ${totalRecords} iNaturalist observations, Massachusetts`;

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-text">Season check</h2>
      <p className="mt-1.5 text-sm leading-6 text-text">{verdict}</p>

      <div className="mt-5 grid grid-cols-12 gap-1 sm:gap-1.5">
        {MONTHS.map((month) => {
          const inGuide = guideMonths.has(month);
          const count = flowering[month - 1] ?? 0;
          const barHeight =
            count > 0 ? Math.max(MIN_BAR, Math.round((count / peak) * TRACK)) : 0;

          return (
            <div key={month} className="flex flex-col gap-1.5">
              {/* Row 1 — the guide's own collection window */}
              <div
                className={`h-2.5 rounded-full ${inGuide ? "bg-moss" : "bg-tint"}`}
                title={
                  inGuide
                    ? `${formatMonthName(month)}: in the guide's collection window`
                    : `${formatMonthName(month)}: outside the collection window`
                }
              />

              {/* Row 2 — observed flowering, scaled against this species' peak */}
              <div className="flex items-end" style={{ height: TRACK }}>
                {count > 0 ? (
                  <div
                    className="w-full rounded-t-[3px] bg-sprout"
                    style={{ height: barHeight }}
                    title={`${formatMonthName(month)}: ${count} flowering observation${
                      count === 1 ? "" : "s"
                    }`}
                  />
                ) : (
                  <div
                    className="h-px w-full bg-tint"
                    title={`${formatMonthName(month)}: no flowering observations`}
                  />
                )}
              </div>

              <div className="text-center text-[10px] text-text-soft">
                {formatMonthShort(month)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-text-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-full bg-moss" />
          Guide collection window
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 rounded-sm bg-sprout" />
          Observed flowering
        </span>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-text-soft">
        {inatTaxonId ? (
          <a
            href={`https://www.inaturalist.org/observations?taxon_id=${inatTaxonId}&place_id=2`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {recordsLabel}
          </a>
        ) : (
          recordsLabel
        )}
        {" · "}
        Nearby: {nearby} observations within 25 km
      </p>
    </div>
  );
}
