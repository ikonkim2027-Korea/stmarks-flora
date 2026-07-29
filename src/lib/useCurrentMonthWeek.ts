"use client";

import { useSyncExternalStore } from "react";
import { resolveMonthWeek, type MonthWeek } from "./monthWeek";

export type { MonthWeek };
export { resolveMonthWeek };

// No real-time updates happen during a page visit, so subscribe registers
// nothing and returns a no-op cleanup.
function subscribe() {
  return () => {};
}

// Cached so getSnapshot returns a referentially stable value across calls —
// useSyncExternalStore requires this to avoid an infinite render loop. Only
// replaced when the resolved month/week actually changes.
let cachedSnapshot: MonthWeek | null = null;

function getSnapshot(): MonthWeek {
  const next = resolveMonthWeek(new Date());
  if (
    !cachedSnapshot ||
    cachedSnapshot.month !== next.month ||
    cachedSnapshot.week !== next.week
  ) {
    cachedSnapshot = next;
  }
  return cachedSnapshot;
}

// Returns null on the server and during hydration, then the real value on
// the client — so static HTML never bakes in a build-time date. Using
// useSyncExternalStore (rather than useState+useEffect) avoids a
// server/client mismatch without a post-mount setState.
function getServerSnapshot(): MonthWeek | null {
  return null;
}

export function useCurrentMonthWeek(): MonthWeek | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
