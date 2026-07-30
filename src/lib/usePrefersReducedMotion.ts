"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Hydration-safe read of prefers-reduced-motion. useSyncExternalStore (not
 * setState-in-effect) is the React-sanctioned way to read this kind of
 * external, client-only value without a server/client render mismatch:
 * getServerSnapshot returns `false` for both the server render and the
 * first client render, then the real value takes over once mounted.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
