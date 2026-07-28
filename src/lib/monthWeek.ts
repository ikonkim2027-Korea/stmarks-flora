// Pure date-resolution logic, deliberately free of any "use client" or
// "use server" directive so it can be safely imported by both server
// components (via utils.ts) and client components (via useCurrentMonthWeek.ts)
// without Next.js treating it as a client-only boundary.

export interface MonthWeek {
  month: number; // 1-12
  week: number; // 1-4
}

export function resolveMonthWeek(date: Date): MonthWeek {
  return {
    month: date.getMonth() + 1,
    week: Math.min(Math.ceil(date.getDate() / 7), 4),
  };
}
