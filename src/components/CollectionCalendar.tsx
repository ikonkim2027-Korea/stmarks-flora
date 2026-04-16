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
      <table className="text-xs border-collapse w-full min-w-[480px]">
        <thead>
          <tr>
            <th className="text-left pr-3 pb-2 font-medium w-12" style={{ color: "var(--color-text-muted)" }}>
              Wk
            </th>
            {MONTHS.map((month) => (
              <th
                key={month}
                className={`pb-2 font-semibold text-center px-1 ${
                  month === currentMonth ? "text-green-700" : ""
                }`}
                style={month !== currentMonth ? { color: "var(--color-text-muted)" } : {}}
              >
                {formatMonthShort(month)}
                {month === currentMonth && (
                  <span className="block text-[9px] text-green-600 font-normal">now</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WEEKS.map((week) => (
            <tr key={week}>
              <td className="pr-3 py-0.5 font-medium" style={{ color: "var(--color-text-muted)" }}>
                {week}
              </td>
              {MONTHS.map((month) => {
                const win = getWindow(month, week);
                const current = isCurrent(month, week);
                return (
                  <td key={month} className="px-1 py-0.5">
                    {win ? (
                      <div
                        className={`w-full h-6 rounded cursor-help flex items-center justify-center transition-opacity hover:opacity-80 relative ${
                          current
                            ? "bg-green-600 ring-2 ring-green-400 ring-offset-1"
                            : "bg-green-500"
                        }`}
                        title={win.note}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltip({ note: win.note, x: rect.left, y: rect.top });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        {current && (
                          <span className="text-white text-[8px] font-bold">●</span>
                        )}
                      </div>
                    ) : (
                      <div
                        className="w-full h-6 rounded"
                        style={{ background: "var(--color-border)" }}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex gap-4 mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-green-500" />
          <span>Collectible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-green-600 ring-2 ring-green-400 ring-offset-1" />
          <span>Current week</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded" style={{ background: "var(--color-border)" }} />
          <span>Not collectible</span>
        </div>
      </div>

      {/* Collection notes list */}
      {collectionWindows.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
            Collection Notes
          </p>
          {collectionWindows.map((w, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span
                className="flex-shrink-0 font-semibold"
                style={{ color: "var(--color-primary)", minWidth: "4rem" }}
              >
                {formatMonthShort(w.month)} Wk {w.weeks.join(",")}
              </span>
              <span style={{ color: "var(--color-text)" }}>{w.note}</span>
            </div>
          ))}
        </div>
      )}

      {tooltip && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs rounded px-2 py-1 pointer-events-none max-w-xs shadow-lg"
          style={{ top: tooltip.y - 36, left: tooltip.x }}
        >
          {tooltip.note}
        </div>
      )}
    </div>
  );
}
