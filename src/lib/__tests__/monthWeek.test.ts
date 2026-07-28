import { describe, expect, it } from "vitest";
import { resolveMonthWeek } from "@/lib/useCurrentMonthWeek";

describe("resolveMonthWeek", () => {
  it("maps day-of-month to week 1-4", () => {
    expect(resolveMonthWeek(new Date(2026, 6, 1))).toEqual({ month: 7, week: 1 });
    expect(resolveMonthWeek(new Date(2026, 6, 8))).toEqual({ month: 7, week: 2 });
    expect(resolveMonthWeek(new Date(2026, 6, 28))).toEqual({ month: 7, week: 4 });
    expect(resolveMonthWeek(new Date(2026, 6, 31))).toEqual({ month: 7, week: 4 });
  });
  it("uses 1-indexed months", () => {
    expect(resolveMonthWeek(new Date(2026, 0, 15)).month).toBe(1);
    expect(resolveMonthWeek(new Date(2026, 11, 3)).month).toBe(12);
  });
});
