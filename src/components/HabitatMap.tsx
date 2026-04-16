"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Plant, Habitat } from "@/data/plants";
import type { HabitatLocation } from "@/data/habitatLocations";
import { getHabitatIcon, getHabitatLabel } from "@/lib/utils";

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
        color: "#2d6a4f",
        fillColor: "#2d6a4f",
        fillOpacity: 0.08,
        weight: 2,
        dashArray: "8 4",
      }).addTo(map);

      // School marker
      const schoolIcon = L.divIcon({
        html: '<div style="font-size:24px;line-height:1;text-align:center;">🏫</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        className: "school-marker",
      });

      L.marker(schoolCenter, { icon: schoolIcon })
        .addTo(map)
        .bindPopup(
          '<strong>St. Mark\'s School</strong><br/>25 Marlboro Road<br/>Southborough, MA'
        );

      // Habitat zones
      habitatLocations.forEach((loc) => {
        const plantsInHabitat = plants.filter((p) =>
          p.habitat.includes(loc.habitat)
        );

        const isSelected = selectedHabitat === loc.habitat;

        const circle = L.circleMarker(loc.coords, {
          radius: isSelected ? 16 : 12,
          color: loc.color,
          fillColor: loc.color,
          fillOpacity: isSelected ? 0.7 : 0.5,
          weight: isSelected ? 3 : 2,
        }).addTo(map);

        const plantLinks = plantsInHabitat
          .slice(0, 8)
          .map(
            (p) =>
              `<a href="/plants/${p.id}" style="color:${loc.color};text-decoration:none;font-size:12px;">&bull; ${p.commonName}</a>`
          )
          .join("<br/>");

        const moreText =
          plantsInHabitat.length > 8
            ? `<br/><a href="/habitats#${loc.habitat}" style="color:${loc.color};font-size:11px;font-style:italic;">+ ${plantsInHabitat.length - 8} more...</a>`
            : "";

        circle.bindPopup(
          `<div style="min-width:160px;">` +
            `<strong style="font-size:13px;">${getHabitatIcon(loc.habitat)} ${getHabitatLabel(loc.habitat)}</strong>` +
            `<br/><span style="font-size:11px;color:#666;">${loc.name}</span>` +
            `<hr style="margin:6px 0;border:none;border-top:1px solid #eee;"/>` +
            `<div style="font-size:12px;color:#555;margin-bottom:4px;">${loc.description}</div>` +
            `<hr style="margin:6px 0;border:none;border-top:1px solid #eee;"/>` +
            `<div style="font-size:11px;color:#888;margin-bottom:4px;">${plantsInHabitat.length} species found here:</div>` +
            plantLinks +
            moreText +
            `</div>`
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
        style={{ height: `${height}px`, width: "100%", borderRadius: "12px", zIndex: 1 }}
      />
      {showLegend && (
        <div
          className="mt-4 flex flex-wrap gap-2"
        >
          {uniqueHabitats.map((loc) => (
            <Link
              key={loc.habitat}
              href={`/habitats#${loc.habitat}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border hover:shadow-sm transition-all"
              style={{
                borderColor: loc.color,
                color: loc.color,
                background: `${loc.color}10`,
              }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: loc.color }}
              />
              {getHabitatIcon(loc.habitat)} {getHabitatLabel(loc.habitat)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
