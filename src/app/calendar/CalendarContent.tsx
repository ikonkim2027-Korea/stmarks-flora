"use client";

import Link from "next/link";
import { plants } from "@/data/plants";
import Chip from "@/components/ui/Chip";
import { useCurrentMonthWeek } from "@/lib/useCurrentMonthWeek";
import {
  getAvailablePlants,
  getCategoryTone,
  formatMonthName,
  formatMonthShort,
} from "@/lib/utils";

const MONTHS = [4, 5, 6, 7, 8, 9, 10, 11];
const WEEKS = [1, 2, 3, 4];

// Same dot language as CollectionCalendar, one size down for the dense grid.
const DOT = "mx-auto block h-2 w-2 rounded-full";

export default function CalendarContent() {
  // null until mounted, so the static HTML never carries a build-date "now".
  const now = useCurrentMonthWeek();
  const currentMonth = now?.month;
  const currentWeek = now?.week;

  return (
    <>
      {/* Season overview: species x week dot grid */}
      <div className="card mb-8 overflow-x-auto p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-text">
          Season overview
        </h2>
        <p className="mt-1 text-sm text-text-soft">
          Every documented species across the eight-month field season.
        </p>

        <table className="mt-5 w-full min-w-[620px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="w-40 pb-2 pr-4 text-left font-medium text-text-soft">
                Species
              </th>
              {MONTHS.map((m) => (
                <th
                  key={m}
                  colSpan={4}
                  className={`px-0.5 pb-2 text-center font-medium ${
                    m === currentMonth ? "text-moss" : "text-text-soft"
                  }`}
                >
                  {formatMonthShort(m)}
                  {m === currentMonth && (
                    <span className="block text-[9px] font-normal text-moss">
                      now
                    </span>
                  )}
                </th>
              ))}
            </tr>
            <tr>
              <th />
              {MONTHS.map((m) =>
                WEEKS.map((w) => (
                  <th
                    key={`${m}-${w}`}
                    className={`px-0.5 pb-2 text-center text-[10px] font-normal ${
                      m === currentMonth && w === currentWeek
                        ? "text-moss"
                        : "text-text-soft"
                    }`}
                  >
                    {w}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id}>
                <td className="py-0.5 pr-4">
                  <Link
                    href={`/plants/${plant.id}`}
                    className="block max-w-[160px] truncate text-xs font-medium text-text transition-colors hover:text-moss"
                    title={plant.commonName}
                  >
                    {plant.commonName}
                  </Link>
                </td>
                {MONTHS.map((m) =>
                  WEEKS.map((w) => {
                    const win = plant.collectionWindows.find(
                      (cw) => cw.month === m && cw.weeks.includes(w)
                    );
                    const isCurrent = m === currentMonth && w === currentWeek;
                    return (
                      <td key={`${m}-${w}`} className="px-0.5 py-1">
                        {win ? (
                          <span
                            title={win.note}
                            className={`${DOT} ${
                              isCurrent
                                ? "bg-sprout ring-2 ring-sprout/40"
                                : "bg-moss"
                            }`}
                          />
                        ) : (
                          <span className={`${DOT} bg-tint`} />
                        )}
                      </td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap gap-4 text-[11px] text-text-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-moss" />
            Collectible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-sprout ring-2 ring-sprout/40" />
            Current week
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-tint" />
            Not collectible
          </span>
        </div>
      </div>

      {/* Month cards */}
      <div className="space-y-6">
        {MONTHS.map((m) => {
          const isCurrentMonth = m === currentMonth;
          const monthPlants = plants.filter((p) =>
            p.collectionWindows.some((w) => w.month === m)
          );

          return (
            <section
              key={m}
              id={`month-${m}`}
              className={`card scroll-mt-24 overflow-hidden ${
                isCurrentMonth ? "ring-1 ring-moss/30" : ""
              }`}
            >
              {/* Month header */}
              <div
                className={`px-6 py-5 ${isCurrentMonth ? "bg-moss-tint" : "bg-tint/60"}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-text">
                    {formatMonthName(m)}
                  </h2>
                  {isCurrentMonth && <Chip tone="sprout">Current month</Chip>}
                </div>
                <p className="mt-1 text-sm text-text-soft">
                  {monthPlants.length} species collectible
                </p>
              </div>

              <div className="p-6">
                {/* Week breakdown */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {WEEKS.map((w) => {
                    const weekPlants = getAvailablePlants(m, w, plants);
                    const isCurrent = isCurrentMonth && w === currentWeek;
                    return (
                      <div
                        key={w}
                        className={`rounded-tile p-4 ${
                          isCurrent ? "bg-moss-tint" : "bg-canvas"
                        }`}
                      >
                        <div className="mb-2.5 flex items-center justify-between gap-2">
                          <span
                            className={`section-label ${isCurrent ? "text-moss" : ""}`}
                          >
                            Week {w}
                            {isCurrent && " · now"}
                          </span>
                          <Chip
                            tone={weekPlants.length > 0 ? "moss" : "sage"}
                            className="px-2"
                          >
                            {weekPlants.length}
                          </Chip>
                        </div>
                        {weekPlants.length > 0 ? (
                          <ul className="space-y-2">
                            {weekPlants.slice(0, 5).map((p) => {
                              const win = p.collectionWindows.find(
                                (cw) => cw.month === m && cw.weeks.includes(w)
                              );
                              return (
                                <li key={p.id}>
                                  <Link
                                    href={`/plants/${p.id}`}
                                    className="group flex items-start gap-2"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-moss" />
                                    <span className="text-xs leading-tight">
                                      <span className="font-medium text-text group-hover:text-moss">
                                        {p.commonName}
                                      </span>
                                      {win && (
                                        <span className="mt-0.5 block text-[10px] leading-4 text-text-soft">
                                          {win.note}
                                        </span>
                                      )}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                            {weekPlants.length > 5 && (
                              <li className="text-xs text-text-soft">
                                +{weekPlants.length - 5} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-xs text-text-soft">
                            None collectible
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* All species this month */}
                <div>
                  <p className="section-label">
                    All species collectible in {formatMonthName(m)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {monthPlants.map((p) => (
                      <Link key={p.id} href={`/plants/${p.id}`}>
                        <Chip
                          tone={getCategoryTone(p.category)}
                          className="transition-transform hover:-translate-y-px"
                        >
                          {p.commonName}
                        </Chip>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
