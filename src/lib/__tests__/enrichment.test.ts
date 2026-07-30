import { describe, expect, it } from "vitest";
import { plants } from "@/data/plants";
import { getEnrichment, observedMonths } from "@/lib/enrichment";

describe("enrichment data", () => {
  it("has an entry for every plant", () => {
    for (const plant of plants) {
      expect(getEnrichment(plant.id), `missing enrichment for ${plant.id}`).toBeDefined();
    }
  });

  it("flags no unresolved taxonomy conflicts silently", () => {
    for (const plant of plants) {
      const e = getEnrichment(plant.id);
      if (e?.gbif?.status === "SYNONYM") {
        expect(e.gbif.acceptedName, `${plant.id} synonym without acceptedName`).toBeTruthy();
      }
    }
  });

  it("observedMonths returns 12 non-negative numbers", () => {
    const months = observedMonths(plants[0].id);
    expect(months).toHaveLength(12);
    expect(months.every((n) => Number.isInteger(n) && n >= 0)).toBe(true);
  });
});
