"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { plants } from "@/data/plants";
import {
  habitatLocations,
  SCHOOL_CENTER,
  SURVEY_RADIUS,
} from "@/data/habitatLocations";
import {
  RADIUS_MAX,
  RADIUS_MIN,
  RADIUS_STEP,
  speciesWithinRadius,
  zonesWithinRadius,
} from "@/lib/radiusExplorer";
import HabitatMapLoader from "@/components/HabitatMapLoader";

// Tween a number toward its target so counts tick up/down as the circle moves.
function useAnimatedNumber(target: number, durationMs = 350): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else fromRef.current = target;
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return display;
}

export default function RadiusExplorer() {
  const [radius, setRadius] = useState(SURVEY_RADIUS);

  const activeZones = useMemo(
    () => zonesWithinRadius(habitatLocations, SCHOOL_CENTER, radius),
    [radius]
  );
  const activeHabitats = useMemo(
    () => new Set(activeZones.map((z) => z.habitat)),
    [activeZones]
  );
  const species = useMemo(
    () => speciesWithinRadius(plants, habitatLocations, SCHOOL_CENTER, radius),
    [radius]
  );

  const speciesCount = useAnimatedNumber(species.length);
  const zoneCount = useAnimatedNumber(activeZones.length);

  return (
    <div className="relative">
      <div className="card overflow-hidden p-2">
        <HabitatMapLoader
          habitatLocations={habitatLocations}
          plants={plants}
          schoolCenter={SCHOOL_CENTER}
          surveyRadius={SURVEY_RADIUS}
          radius={radius}
          onRadiusChange={setRadius}
          activeHabitats={activeHabitats}
          height={520}
          showLegend={false}
        />
      </div>

      <div className="glass pointer-events-none absolute left-5 top-5 z-[500] w-[230px] p-4 sm:w-[260px]">
        <p className="section-label">Survey radius · St. Mark&apos;s</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight text-text">
          {radius >= 1000 ? `${(radius / 1000).toFixed(2)} km` : `${radius} m`}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-hairline pt-3">
          <div>
            <div className="text-3xl font-semibold tracking-tight text-moss">{speciesCount}</div>
            <div className="text-[11px] text-text-soft">species in reach</div>
          </div>
          <div>
            <div className="text-3xl font-semibold tracking-tight text-text">{zoneCount}</div>
            <div className="text-[11px] text-text-soft">habitat zones</div>
          </div>
        </div>
      </div>

      <div className="card mt-4 flex flex-wrap items-center gap-4 p-4">
        {/* basis-64 keeps the track wide enough to drag: on narrow cards it
            pushes the preset chips onto their own row instead of squeezing the
            slider down to a few pixels. */}
        <input
          type="range"
          min={RADIUS_MIN}
          max={RADIUS_MAX}
          step={RADIUS_STEP}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          aria-label="Survey radius in meters"
          className="h-2 min-w-0 flex-1 basis-64 cursor-pointer appearance-none rounded-full bg-tint accent-moss"
        />
        <div className="flex items-center gap-2">
          {[250, 500, 1000, 1500].map((preset) => (
            <button
              key={preset}
              onClick={() => setRadius(preset)}
              className={`chip cursor-pointer ${
                radius === preset ? "bg-ink text-white" : "bg-tint text-text-soft hover:bg-sage/40"
              }`}
            >
              {preset >= 1000 ? `${preset / 1000}km` : `${preset}m`}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-xs text-text-soft">
        Drag the dot on the circle&apos;s edge, or use the slider, to grow or shrink
        the survey area. Zones light up as they come into reach.
      </p>
    </div>
  );
}
