"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { plants } from "@/data/plants";
import { useCurrentMonthWeek } from "@/lib/useCurrentMonthWeek";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** Five name swaps at 80 ms ≈ a 400 ms dice-roll before the route changes. */
const SHUFFLE_STEPS = 5;
const STEP_MS = 80;

/** Below this, "in season" is too thin a pool to feel random — use everything. */
const MIN_SEASONAL_POOL = 3;

const ARIA_LABEL = "Feeling lucky — open a random plant";
const TITLE = "Feeling lucky — press R";

interface FeelingLuckyProps {
  variant?: "button" | "icon";
  /** Visible text for the button variant; ignored by the icon variant. */
  label?: string;
}

export default function FeelingLucky({
  variant = "button",
  label = "Feeling lucky",
}: FeelingLuckyProps) {
  const router = useRouter();
  const now = useCurrentMonthWeek();
  const prefersReducedMotion = usePrefersReducedMotion();
  // null except during the shuffle animation, so the server render and the
  // first client render both show the plain label.
  const [shuffleLabel, setShuffleLabel] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const go = useCallback(() => {
    // A roll is already in flight; a second click would race two pushes.
    if (timerRef.current) return;

    // Prefer something findable today. `now` is null until the hook mounts,
    // and a handful of months have almost nothing in window, so fall back to
    // the whole atlas rather than offering the same two plants every time.
    const seasonal = now
      ? plants.filter((p) => p.collectionWindows.some((w) => w.month === now.month))
      : [];
    const pool = seasonal.length >= MIN_SEASONAL_POOL ? seasonal : plants;

    // Math.random() lives here and nowhere else: picking during render would
    // hand the client a different plant than the prerendered HTML.
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const target = `/plants/${pick.id}`;
    const randomName = () =>
      plants[Math.floor(Math.random() * plants.length)].commonName;

    if (prefersReducedMotion) {
      router.push(target);
      return;
    }

    let step = 1;
    setShuffleLabel(randomName());
    timerRef.current = setInterval(() => {
      step += 1;
      if (step > SHUFFLE_STEPS) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setShuffleLabel(null);
        router.push(target);
        return;
      }
      setShuffleLabel(randomName());
    }, STEP_MS);
  }, [now, prefersReducedMotion, router]);

  // The nav icon is the one instance mounted on every route, so it owns the
  // global shortcut. Registering it on each instance would fire several
  // independent rolls — and several pushes — from one keypress.
  useEffect(() => {
    if (variant !== "icon") return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "r") return;
      // Modified presses belong to the browser (Cmd+R / Ctrl+R reload).
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const active = document.activeElement as HTMLElement | null;
      const tag = active?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (active?.isContentEditable) return;

      event.preventDefault();
      go();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [variant, go]);

  const rolling = shuffleLabel !== null;

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={go}
        aria-label={ARIA_LABEL}
        title={TITLE}
        className="rounded-full bg-surface p-2.5 text-text shadow-card transition-colors hover:bg-tint"
      >
        <Shuffle size={18} className={rolling ? "animate-pulse" : undefined} />
      </button>
    );
  }

  return (
    <button type="button" onClick={go} aria-label={ARIA_LABEL} title={TITLE} className="btn-ghost">
      <Shuffle size={17} className={rolling ? "animate-pulse" : undefined} />
      {/* Fixed min-width so cycling through plant names does not jog the row. */}
      <span
        className={`inline-block min-w-[8.5rem] text-left ${rolling ? "text-text-soft" : ""}`}
      >
        {shuffleLabel ?? label}
      </span>
    </button>
  );
}
