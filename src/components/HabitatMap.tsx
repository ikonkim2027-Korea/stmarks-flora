"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Plant, Habitat } from "@/data/plants";
import type { HabitatLocation } from "@/data/habitatLocations";
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
}

export default function HabitatMap({
  habitatLocations,
  plants,
  schoolCenter,
  surveyRadius,
  selectedHabitat,
  height = 500,
  showLegend = true,
}: HabitatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<unknown>(null);
  const [ready, setReady] = useState(false);

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

  useEffect(() => {
    if (!ready || !mapRef.current) return;

    let map: ReturnType<typeof import("leaflet")["map"]> extends infer T ? T : never;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapRef.current) return;

      // Clean up previous map instance
      if (leafletMapRef.current) {
        (leafletMapRef.current as { remove: () => void }).remove();
      }

      map = L.map(mapRef.current).setView(schoolCenter, 15);
      leafletMapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // 1km radius circle
      L.circle(schoolCenter, {
        radius: surveyRadius,
        color: "#3d5a44",
        fillColor: "rgba(201,226,101,0.12)",
        fillOpacity: 1,
        weight: 2,
        dashArray: "8 4",
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
        }).addTo(map);

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
      }
    };
  }, [ready, habitatLocations, plants, schoolCenter, surveyRadius, selectedHabitat]);

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
