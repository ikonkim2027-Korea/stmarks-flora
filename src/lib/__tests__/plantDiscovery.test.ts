import { describe, expect, it } from "vitest";
import { plants } from "@/data/plants";
import {
  filterPlants,
  getCollectionPolicy,
  getDiscoverablePlantsForWeek,
} from "@/lib/plantDiscovery";

describe("plant discovery", () => {
  it("matches search terms beyond names and family", () => {
    const results = filterPlants(plants, {
      query: "monarch",
      filters: {
        categories: [],
        habitats: [],
        nativeStatuses: [],
        months: [],
      },
      sort: "relevance",
    });

    expect(results.map((plant) => plant.id)).toContain("common-milkweed");
    expect(results[0].id).toBe("common-milkweed");
  });

  it("does not present photograph-only plants as specimen-collectible", () => {
    const available = getDiscoverablePlantsForWeek(5, 4, plants);

    expect(available.collectible.map((plant) => plant.id)).not.toContain(
      "pink-ladys-slipper"
    );
    expect(available.observationOnly.map((plant) => plant.id)).toContain(
      "pink-ladys-slipper"
    );
  });

  it("keeps plant data internally valid for static generation and filters", () => {
    const ids = plants.map((plant) => plant.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    expect(duplicateIds).toEqual([]);
    expect(plants.length).toBeGreaterThanOrEqual(60);

    for (const plant of plants) {
      expect(plant.collectionWindows.length, plant.id).toBeGreaterThan(0);
      expect(getCollectionPolicy(plant).type, plant.id).toMatch(
        /collect|limited|photograph-only/
      );

      for (const window of plant.collectionWindows) {
        expect(window.month, plant.id).toBeGreaterThanOrEqual(1);
        expect(window.month, plant.id).toBeLessThanOrEqual(12);
        expect(window.weeks.length, plant.id).toBeGreaterThan(0);

        for (const week of window.weeks) {
          expect(week, plant.id).toBeGreaterThanOrEqual(1);
          expect(week, plant.id).toBeLessThanOrEqual(4);
        }
      }

      for (const source of plant.sources ?? []) {
        expect(source.label.trim(), plant.id).not.toBe("");
        expect(source.url, plant.id).toMatch(/^https:\/\//);
      }
    }
  });
});
