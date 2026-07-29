import { describe, expect, it } from "vitest";
import {
  haversineMeters,
  zonesWithinRadius,
  speciesWithinRadius,
  destinationPoint,
} from "@/lib/radiusExplorer";
import { habitatLocations, SCHOOL_CENTER } from "@/data/habitatLocations";
import { plants } from "@/data/plants";

describe("radius explorer geometry", () => {
  it("haversine distance is 0 for identical points and symmetric", () => {
    expect(haversineMeters(SCHOOL_CENTER, SCHOOL_CENTER)).toBe(0);
    const a: [number, number] = [42.3075, -71.5235];
    const b: [number, number] = [42.3095, -71.527];
    expect(haversineMeters(a, b)).toBeCloseTo(haversineMeters(b, a), 6);
    expect(haversineMeters(a, b)).toBeGreaterThan(300);
    expect(haversineMeters(a, b)).toBeLessThan(420);
  });

  it("destinationPoint lands at the requested distance from center", () => {
    const p = destinationPoint(SCHOOL_CENTER, 800, 90);
    expect(haversineMeters(SCHOOL_CENTER, p)).toBeCloseTo(800, -1);
  });
});

describe("zone / species inclusion", () => {
  it("includes the on-campus zone even at radius 0 (zone overlap rule)", () => {
    const zones = zonesWithinRadius(habitatLocations, SCHOOL_CENTER, 0);
    expect(zones.map((z) => z.name)).toContain("School Grounds");
  });

  it("includes all zones at 2km and is monotonic in radius", () => {
    expect(zonesWithinRadius(habitatLocations, SCHOOL_CENTER, 2000)).toHaveLength(
      habitatLocations.length
    );
    let previous = 0;
    for (const r of [0, 200, 400, 600, 800, 1000, 1500]) {
      const count = zonesWithinRadius(habitatLocations, SCHOOL_CENTER, r).length;
      expect(count).toBeGreaterThanOrEqual(previous);
      previous = count;
    }
  });

  it("species count grows with radius and reaches all plants at full coverage", () => {
    const small = speciesWithinRadius(plants, habitatLocations, SCHOOL_CENTER, 100);
    const full = speciesWithinRadius(plants, habitatLocations, SCHOOL_CENTER, 2000);
    expect(small.length).toBeLessThanOrEqual(full.length);
    expect(full).toHaveLength(plants.length);
  });
});
