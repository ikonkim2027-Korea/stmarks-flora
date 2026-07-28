"use client";

import { useEffect, useState } from "react";
import { resolveMonthWeek, type MonthWeek } from "./monthWeek";

export type { MonthWeek };
export { resolveMonthWeek };

// Returns null on the server and during the first client render, then the
// real value after mount — so static HTML never bakes in a build-time date.
export function useCurrentMonthWeek(): MonthWeek | null {
  const [value, setValue] = useState<MonthWeek | null>(null);
  useEffect(() => {
    setValue(resolveMonthWeek(new Date()));
  }, []);
  return value;
}
