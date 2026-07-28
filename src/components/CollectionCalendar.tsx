"use client";

import { CollectionWindow } from "@/data/plants";
import { formatMonthShort } from "@/lib/utils";
import { useState } from "react";

interface CollectionCalendarProps {
  collectionWindows: CollectionWindow[];
  currentMonth?: number;
  currentWeek?: number;
}

const MONTHS = [4, 5, 6, 7, 8, 9, 10, 11];
const WEEKS = [1, 2, 3, 4];

const DOT = "mx-auto block h-3.5 w-3.5 rounded-full";

export default function CollectionCalendar({
  collectionWindows,
  currentMonth,
  currentWeek,
}: CollectionCalendarProps) {
  const [tooltip, setTooltip] = useState<{ note: string; x: number; y: number } | null>(null);

  function getWindow(month: number, week: number): CollectionWindow | undefined {
    return collectionWindows.find(
      (w) => w.month === month && w.weeks.includes(week)
    );
  }

  function isCurrent(month: number, week: number) {
    return month === currentMonth && week === currentWeek;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-xs">
        <thead>
          <tr>
            <th className="w-12 pb-3 pr-3 text-left text-xs font-medium text-text-soft">
              Wk
            </th>
            {MONTHS.map((month) => (
              <th
                key={month}
                className={`px-1 pb-3 text-center text-xs font-medium ${
                  month === currentMonth ? "text-moss" : "text-text-soft"
                }`}
              >
                {formatMonthShort(month)}
                {month === currentMonth && (
                  <span className="block text-[9px] font-normal text-moss">now</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WEEKS.map((week) => (
            <tr key={week}>
              <td className="py-1.5 pr-3 text-xs font-medium text-text-soft">{week}</td>
              {MONTHS.map((month) => {
                const win = getWindow(month, week);
                const current = isCurrent(month, week);
                return (
                  <td key={month} className="px-1 py-1.5">
                    {win ? (
                      <span
                        className={`${DOT} cursor-help ${
                          current ? "bg-sprout ring-2 ring-sprout/40" : "bg-moss"
                        }`}
                        title={win.note}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({ note: win.note, x: rect.left, y: rect.top });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    ) : (
                      <span className={`${DOT} bg-tint`} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-text-soft">
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

      {/* Collection notes list */}
      {collectionWindows.length > 0 && (
        <div className="mt-6 space-y-2">
          <p className="section-label">Collection notes</p>
          {collectionWindows.map((w, i) => (
            <div key={i} className="flex gap-3 text-sm leading-6">
              <span className="w-20 flex-shrink-0 font-medium text-moss">
                {formatMonthShort(w.month)} Wk {w.weeks.join(",")}
              </span>
              <span className="text-text">{w.note}</span>
            </div>
          ))}
        </div>
      )}

      {tooltip && (
        <div
          className="card pointer-events-none fixed z-50 max-w-xs px-3 py-2 text-xs text-text shadow-float"
          style={{ top: tooltip.y - 44, left: tooltip.x }}
        >
          {tooltip.note}
        </div>
      )}
    </div>
  );
}
