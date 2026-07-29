import { HabitatLocation } from "@/data/habitatLocations";
import { Plant, Habitat } from "@/data/plants";

const EARTH_RADIUS_M = 6371000;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const toDeg = (rad: number) => (rad * 180) / Math.PI;

export function haversineMeters(a: [number, number], b: [number, number]): number {
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h));
}

// A zone counts as "inside" when its own circle overlaps the survey circle.
export function zonesWithinRadius(
  zones: HabitatLocation[],
  center: [number, number],
  radiusMeters: number
): HabitatLocation[] {
  return zones.filter(
    (zone) => haversineMeters(center, zone.coords) - zone.radius <= radiusMeters
  );
}

export function speciesWithinRadius(
  plants: Plant[],
  zones: HabitatLocation[],
  center: [number, number],
  radiusMeters: number
): Plant[] {
  const habitats = new Set<Habitat>(
    zonesWithinRadius(zones, center, radiusMeters).map((z) => z.habitat)
  );
  return plants.filter((p) => p.habitat.some((h) => habitats.has(h)));
}

// Point at `distanceMeters` from center along `bearingDeg` (90 = due east) —
// used to place the drag handle on the circle's edge.
export function destinationPoint(
  center: [number, number],
  distanceMeters: number,
  bearingDeg: number
): [number, number] {
  const angular = distanceMeters / EARTH_RADIUS_M;
  const bearing = toRad(bearingDeg);
  const lat1 = toRad(center[0]);
  const lng1 = toRad(center[1]);
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angular) +
      Math.cos(lat1) * Math.sin(angular) * Math.cos(bearing)
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angular) * Math.cos(lat1),
      Math.cos(angular) - Math.sin(lat1) * Math.sin(lat2)
    );
  return [toDeg(lat2), toDeg(lng2)];
}

export const RADIUS_MIN = 100;
export const RADIUS_MAX = 1500;
export const RADIUS_STEP = 25;
