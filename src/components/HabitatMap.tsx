"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type * as LeafletTypes from "leaflet";
import type { Plant, Habitat } from "@/data/plants";
import type { HabitatLocation } from "@/data/habitatLocations";
import {
  destinationPoint,
  haversineMeters,
  RADIUS_MAX,
  RADIUS_MIN,
} from "@/lib/radiusExplorer";
import {
  getHabitatDotClass,
  getHabitatDotHex,
  getHabitatLabel,
} from "@/lib/utils";

// Leaflet ships its own chrome; this pulls popups onto the atlas card look.
const ATLAS_LEAFLET_CSS = `
.leaflet-container { font-family: var(--font-instrument-sans), system-ui, sans-serif; }
.leaflet-popup-content-wrapper {
  border-radius: 16px;
  padding: 2px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgb(23 27 23 / 0.04), 0 16px 40px -16px rgb(23 27 23 / 0.18);
}
.leaflet-popup-content { margin: 12px 14px; }
.leaflet-popup-tip { box-shadow: none; }
.leaflet-container a.leaflet-popup-close-button { color: #6b7268; padding: 8px 8px 0 0; }
/* Leaflet's own link colour outranks the utility class, so restate it here. */
.leaflet-container .leaflet-popup-content a { color: #3d5a44; text-decoration: none; }
.leaflet-container .leaflet-popup-content a.atlas-popup-more { color: #6b7268; }
.leaflet-bar, .leaflet-control-attribution { border-radius: 10px; }
`;

interface HabitatMapProps {
  habitatLocations: HabitatLocation[];
  plants: Plant[];
  schoolCenter: [number, number];
  surveyRadius: number;
  selectedHabitat?: Habitat;
  height?: number;
  showLegend?: boolean;
  /** Live survey radius in metres. Falls back to `surveyRadius`. */
  radius?: number;
  /** Providing this turns on the draggable edge handle. */
  onRadiusChange?: (meters: number) => void;
  /** Habitats currently in reach — zones outside it fade back. */
  activeHabitats?: Set<Habitat>;
}

export default function HabitatMap({
  habitatLocations,
  plants,
  schoolCenter,
  surveyRadius,
  selectedHabitat,
  height = 500,
  showLegend = true,
  radius,
  onRadiusChange,
  activeHabitats,
}: HabitatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<LeafletTypes.Map | null>(null);
  const circleRef = useRef<LeafletTypes.Circle | null>(null);
  const handleRef = useRef<LeafletTypes.Marker | null>(null);
  const zoneLayersRef = useRef<Map<string, LeafletTypes.CircleMarker>>(new Map());
  const draggingRef = useRef(false);
  const [ready, setReady] = useState(false);

  const effectiveRadius = radius ?? surveyRadius;
  const interactive = Boolean(onRadiusChange);

  // Latest values the map-construction effect needs *without* depending on them:
  // rebuilding the map on every radius tick would reload tiles mid-drag.
  const radiusRef = useRef(effectiveRadius);
  radiusRef.current = effectiveRadius;
  const onRadiusChangeRef = useRef(onRadiusChange);
  onRadiusChangeRef.current = onRadiusChange;
  const activeHabitatsRef = useRef(activeHabitats);
  activeHabitatsRef.current = activeHabitats;

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }
    if (!document.getElementById("leaflet-atlas-css")) {
      const style = document.createElement("style");
      style.id = "leaflet-atlas-css";
      style.textContent = ATLAS_LEAFLET_CSS;
      document.head.appendChild(style);
    }
    setReady(true);
  }, []);

  // Map construction. `radius` / `activeHabitats` are deliberately NOT deps —
  // see the sync effect below.
  useEffect(() => {
    if (!ready || !mapRef.current) return;

    let map: LeafletTypes.Map | null = null;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;

      // Clean up previous map instance
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      map = L.map(mapRef.current).setView(schoolCenter, 15);
      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Dashed reference circle — the official 1km survey boundary, never moves.
      L.circle(schoolCenter, {
        radius: surveyRadius,
        color: "#3d5a44",
        fillOpacity: 0,
        weight: 2,
        dashArray: "8 4",
        interactive: false,
      }).addTo(map);

      // The adjustable survey circle.
      circleRef.current = L.circle(schoolCenter, {
        radius: radiusRef.current,
        color: "#3d5a44",
        fillColor: "#c9e265",
        fillOpacity: 0.1,
        weight: 2,
        interactive: false,
      }).addTo(map);

      // School marker — a moss dot in a sprout halo, no emoji
      const schoolIcon = L.divIcon({
        html:
          '<span style="display:block;width:14px;height:14px;border-radius:9999px;' +
          'background:#3d5a44;box-shadow:0 0 0 5px rgba(201,226,101,0.55);"></span>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        className: "school-marker",
      });

      L.marker(schoolCenter, { icon: schoolIcon })
        .addTo(map)
        .bindPopup(
          '<div class="min-w-[160px]">' +
            '<div class="text-[13px] font-semibold text-text">St. Mark\'s School</div>' +
            '<div class="mt-0.5 text-[11px] leading-4 text-text-soft">25 Marlboro Road<br/>Southborough, MA</div>' +
            "</div>"
        );

      // Habitat zones
      zoneLayersRef.current = new Map();
      habitatLocations.forEach((loc) => {
        const plantsInHabitat = plants.filter((p) =>
          p.habitat.includes(loc.habitat)
        );

        const isSelected = selectedHabitat === loc.habitat;

        const circle = L.circleMarker(loc.coords, {
          radius: isSelected ? 16 : 12,
          color: "#3d5a44",
          fillColor: getHabitatDotHex(loc.habitat),
          fillOpacity: isSelected ? 0.85 : 0.65,
          weight: isSelected ? 3 : 2,
        }).addTo(map!);

        zoneLayersRef.current.set(loc.name, circle);

        const plantLinks = plantsInHabitat
          .slice(0, 8)
          .map(
            (p) =>
              `<a href="/plants/${p.id}" class="block text-[12px] font-medium text-moss no-underline">${p.commonName}</a>`
          )
          .join("");

        const moreText =
          plantsInHabitat.length > 8
            ? `<a href="/habitats#${loc.habitat}" class="atlas-popup-more mt-1 block text-[11px] no-underline">+ ${plantsInHabitat.length - 8} more</a>`
            : "";

        circle.bindPopup(
          `<div class="min-w-[180px]">` +
            `<div class="flex items-center gap-2">` +
            `<span class="h-2.5 w-2.5 flex-shrink-0 rounded-full ${getHabitatDotClass(loc.habitat)}"></span>` +
            `<span class="text-[13px] font-semibold text-text">${getHabitatLabel(loc.habitat)}</span>` +
            `</div>` +
            `<div class="mt-0.5 text-[11px] text-text-soft">${loc.name}</div>` +
            `<div class="mt-2 border-t border-hairline pt-2 text-[12px] leading-5 text-text">${loc.description}</div>` +
            `<div class="mt-2 border-t border-hairline pt-2 text-[11px] text-text-soft">${plantsInHabitat.length} species found here</div>` +
            `<div class="mt-1 space-y-0.5">` +
            plantLinks +
            moreText +
            `</div></div>`
        );
      });

      // The map is built asynchronously, so paint the current in-reach state
      // once the layers exist rather than waiting for the next radius change.
      if (activeHabitatsRef.current) {
        const reach = activeHabitatsRef.current;
        zoneLayersRef.current.forEach((layer, name) => {
          const loc = habitatLocations.find((l) => l.name === name);
          if (!loc) return;
          const active = reach.has(loc.habitat);
          layer.setStyle({
            fillOpacity: active ? 0.55 : 0.12,
            opacity: active ? 1 : 0.25,
          });
        });
      }

      // Draggable edge handle — radius only, the centre is fixed.
      if (interactive) {
        const handleIcon = L.divIcon({
          className: "radius-handle",
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          html: '<div class="radius-handle-dot"></div>',
        });

        const handle = L.marker(
          destinationPoint(schoolCenter, radiusRef.current, 90),
          {
            draggable: true,
            icon: handleIcon,
            keyboard: false,
            zIndexOffset: 1000,
          }
        ).addTo(map);
        handleRef.current = handle;

        handle.on("dragstart", () => {
          draggingRef.current = true;
        });

        handle.on("drag", () => {
          const p = handle.getLatLng();
          const meters = haversineMeters(schoolCenter, [p.lat, p.lng]);
          const clamped = Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, meters));
          onRadiusChangeRef.current?.(Math.round(clamped));
        });

        handle.on("dragend", () => {
          draggingRef.current = false;
          // Snap back onto the due-east edge of the final circle.
          handle.setLatLng(
            destinationPoint(schoolCenter, radiusRef.current, 90)
          );
        });
      }

      // Fix Leaflet default icon issue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    })();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        leafletMapRef.current = null;
        circleRef.current = null;
        handleRef.current = null;
        zoneLayersRef.current = new Map();
      }
    };
  }, [
    ready,
    habitatLocations,
    plants,
    schoolCenter,
    surveyRadius,
    selectedHabitat,
    interactive,
  ]);

  // Cheap per-frame sync: resize the circle, move the handle, light zones up.
  // No map teardown here, so tiles never reload while dragging.
  useEffect(() => {
    circleRef.current?.setRadius(effectiveRadius);

    if (handleRef.current && !draggingRef.current) {
      const p = destinationPoint(schoolCenter, effectiveRadius, 90);
      handleRef.current.setLatLng(p);
    }

    if (activeHabitats) {
      habitatLocations.forEach((loc) => {
        const layer = zoneLayersRef.current.get(loc.name);
        if (!layer) return;
        const active = activeHabitats.has(loc.habitat);
        layer.setStyle({
          fillOpacity: active ? 0.55 : 0.12,
          opacity: active ? 1 : 0.25,
        });
      });
    }
  }, [effectiveRadius, activeHabitats, habitatLocations, schoolCenter, ready]);

  // Deduplicate habitats for legend
  const uniqueHabitats = Array.from(
    new Map(habitatLocations.map((loc) => [loc.habitat, loc])).values()
  );

  return (
    <div className="relative w-full">
      <div
        ref={mapRef}
        className="overflow-hidden rounded-tile"
        style={{ height: `${height}px`, width: "100%", zIndex: 1 }}
      />
      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-2">
          {uniqueHabitats.map((loc) => (
            <Link
              key={loc.habitat}
              href={`/habitats#${loc.habitat}`}
              className="chip bg-surface text-text shadow-card transition-colors hover:bg-tint"
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${getHabitatDotClass(loc.habitat)}`}
                aria-hidden
              />
              {getHabitatLabel(loc.habitat)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
