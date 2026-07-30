"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
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

// Hydration-safe read of prefers-reduced-motion. useSyncExternalStore (not
// setState-in-effect) is the React-sanctioned way to read this kind of
// external, client-only value without a server/client render mismatch:
// getServerSnapshot returns `false` for both the server render and the
// first client render, then the real value takes over once mounted.
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

// Tween a number toward its target so counts tick up/down as the circle
// moves. Correctness requirement: `display` must converge to `target` even
// if requestAnimationFrame never runs (browsers suspend rAF in hidden /
// background tabs), so a setTimeout safety net forces the final value
// alongside the rAF-driven tween.
function useAnimatedNumber(target: number, durationMs = 350): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);
  // Mirrors the last value actually committed to `display`, read
  // synchronously (refs don't lag behind stale effect closures the way
  // `display` itself would) so an interrupted tween can hand off truthfully.
  const displayRef = useRef(target);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Reduced-motion users get the exact value with no tween; the
      // rendered number below is derived straight from `target`, so there
      // is nothing to animate and nothing to set here.
      fromRef.current = target;
      displayRef.current = target;
      return;
    }

    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    let frame: number;
    let settled = false;

    const commit = (value: number) => {
      displayRef.current = value;
      setDisplay(value);
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      fromRef.current = target;
      commit(target);
    };

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - t) * (1 - t);
      commit(Math.round(from + (target - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
      else finish();
    };

    frame = requestAnimationFrame(tick);
    // Timers still fire (merely throttled) in hidden/background tabs where
    // rAF does not, so this guarantees convergence to `target` regardless
    // of tab visibility.
    const timeout = setTimeout(finish, durationMs);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      // Torn down mid-tween (rapid slider drags, unmount, tab switch): keep
      // the value truthfully on screen as the next tween's origin instead
      // of leaving a stale `from`.
      if (!settled) fromRef.current = displayRef.current;
    };
  }, [target, durationMs, prefersReducedMotion]);

  return prefersReducedMotion ? target : display;
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
        {activeZones.length === habitatLocations.length && (
          <p className="mt-2 text-[11px] text-text-soft">Full survey area</p>
        )}
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
          {[100, 200, 300, 1000].map((preset) => (
            <button
              key={preset}
              onClick={() => setRadius(preset)}
              className={`chip cursor-pointer ${
                radius === preset ? "bg-ink text-white" : "bg-tint text-text-soft hover:bg-sage/40"
              }`}
            >
              {preset >= 1000 ? "Full 1km" : `${preset}m`}
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
