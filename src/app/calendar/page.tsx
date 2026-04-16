import Link from "next/link";
import { plants } from "@/data/plants";
import {
  getCurrentMonthWeek,
  getAvailablePlants,
  getCategoryDotColor,
  formatMonthName,
  getCategoryColor,
} from "@/lib/utils";

const MONTHS = [4, 5, 6, 7, 8, 9, 10, 11];
const WEEKS = [1, 2, 3, 4];

export default function CalendarPage() {
  const { month: currentMonth, week: currentWeek } = getCurrentMonthWeek();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>
          Collection Calendar
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
          Month-by-month guide to specimen collection &mdash; April through November
        </p>
      </div>

      {/* Overview grid: month x plant heatmap */}
      <div
        className="rounded-2xl border p-5 mb-8 overflow-x-auto"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: "var(--color-text)" }}>
          Season Overview
        </h2>
        <table className="text-xs border-collapse w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left pr-4 pb-2 font-medium w-40" style={{ color: "var(--color-text-muted)" }}>
                Species
              </th>
              {MONTHS.map((m) => (
                <th
                  key={m}
                  colSpan={4}
                  className={`pb-2 text-center font-semibold px-0.5 ${m === currentMonth ? "text-green-700" : ""}`}
                  style={m !== currentMonth ? { color: "var(--color-text-muted)" } : {}}
                >
                  {formatMonthName(m).slice(0, 3)}
                  {m === currentMonth && <span className="block text-[8px] text-green-600">now</span>}
                </th>
              ))}
            </tr>
            <tr>
              <th />
              {MONTHS.map((m) =>
                WEEKS.map((w) => (
                  <th
                    key={`${m}-${w}`}
                    className={`pb-1 text-center font-normal px-0.5 ${
                      m === currentMonth && w === currentWeek ? "text-green-600 font-bold" : ""
                    }`}
                    style={{ color: m !== currentMonth || w !== currentWeek ? "var(--color-text-muted)" : undefined }}
                  >
                    {w}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => {
              const dotColor = getCategoryDotColor(plant.category);
              return (
                <tr key={plant.id} className="group">
                  <td className="pr-4 py-0.5">
                    <Link
                      href={`/plants/${plant.id}`}
                      className="text-xs hover:underline font-medium truncate block max-w-[160px]"
                      style={{ color: "var(--color-text)" }}
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
                        <td key={`${m}-${w}`} className="px-0.5 py-0.5">
                          {win ? (
                            <div
                              title={win.note}
                              className={`h-4 w-full rounded-sm ${dotColor} ${
                                isCurrent ? "ring-1 ring-offset-0 ring-white opacity-100" : "opacity-75"
                              }`}
                            />
                          ) : (
                            <div
                              className="h-4 w-full rounded-sm"
                              style={{ background: "var(--color-border)" }}
                            />
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
          {(["tree", "shrub", "wildflower", "fern", "grass", "vine"] as const).map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${getCategoryDotColor(cat)}`} />
              <span className="text-xs capitalize" style={{ color: "var(--color-text-muted)" }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Month cards */}
      <div className="space-y-8">
        {MONTHS.map((m) => {
          const isCurrentMonth = m === currentMonth;
          const monthPlants = plants.filter((p) =>
            p.collectionWindows.some((w) => w.month === m)
          );

          return (
            <section
              key={m}
              id={`month-${m}`}
              className={`rounded-2xl border overflow-hidden ${
                isCurrentMonth ? "ring-2 ring-green-500 ring-offset-2" : ""
              }`}
              style={{
                background: "var(--color-card)",
                borderColor: isCurrentMonth ? "#22c55e" : "var(--color-border)",
              }}
            >
              {/* Month header */}
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{
                  background: isCurrentMonth ? "var(--color-primary)" : "var(--color-primary-pale)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div>
                  <h2
                    className={`text-xl font-bold ${isCurrentMonth ? "text-white" : ""}`}
                    style={!isCurrentMonth ? { color: "var(--color-text)" } : {}}
                  >
                    {formatMonthName(m)}
                    {isCurrentMonth && (
                      <span className="ml-2 text-sm font-normal bg-green-300 text-green-900 px-2 py-0.5 rounded-full">
                        Current Month
                      </span>
                    )}
                  </h2>
                  <p
                    className={`text-sm mt-0.5 ${isCurrentMonth ? "text-green-100" : ""}`}
                    style={!isCurrentMonth ? { color: "var(--color-text-muted)" } : {}}
                  >
                    {monthPlants.length} species collectible
                  </p>
                </div>
              </div>

              <div className="p-6">
                {/* Week breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {WEEKS.map((w) => {
                    const weekPlants = getAvailablePlants(m, w, plants);
                    const isCurrent = isCurrentMonth && w === currentWeek;
                    return (
                      <div
                        key={w}
                        className={`rounded-xl border p-3 ${isCurrent ? "ring-2 ring-green-400 ring-offset-1" : ""}`}
                        style={{
                          borderColor: isCurrent ? "#22c55e" : "var(--color-border)",
                          background: isCurrent ? "#e8f5e2" : "var(--color-background)",
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-bold uppercase tracking-wide"
                            style={{ color: isCurrent ? "#166534" : "var(--color-text-muted)" }}
                          >
                            Week {w}
                            {isCurrent && " ★"}
                          </span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                            style={{
                              background: weekPlants.length > 0 ? "var(--color-primary-pale)" : "var(--color-border)",
                              color: weekPlants.length > 0 ? "var(--color-primary)" : "var(--color-text-muted)",
                            }}
                          >
                            {weekPlants.length}
                          </span>
                        </div>
                        {weekPlants.length > 0 ? (
                          <ul className="space-y-1">
                            {weekPlants.slice(0, 5).map((p) => {
                              const win = p.collectionWindows.find(
                                (cw) => cw.month === m && cw.weeks.includes(w)
                              );
                              return (
                                <li key={p.id}>
                                  <Link
                                    href={`/plants/${p.id}`}
                                    className="flex items-start gap-1.5 hover:underline group/item"
                                  >
                                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${getCategoryDotColor(p.category)}`} />
                                    <span className="text-xs leading-tight" style={{ color: "var(--color-text)" }}>
                                      {p.commonName}
                                      {win && (
                                        <span className="block text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                                          {win.note}
                                        </span>
                                      )}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                            {weekPlants.length > 5 && (
                              <li className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                                +{weekPlants.length - 5} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <p className="text-xs italic" style={{ color: "var(--color-text-muted)" }}>
                            None collectible
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* All species this month */}
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text-muted)" }}>
                    All species collectible in {formatMonthName(m)}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {monthPlants.map((p) => (
                      <Link
                        key={p.id}
                        href={`/plants/${p.id}`}
                        className={`text-xs px-2.5 py-1 rounded-full border font-medium hover:shadow-sm transition-all ${getCategoryColor(p.category)}`}
                      >
                        {p.commonName}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
