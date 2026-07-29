"use client";

import { useSyncExternalStore } from "react";

// Renders the "Generated <date>" line on the printable field guide.
// Resolved on the client via useSyncExternalStore (rather than
// useState+useEffect) so prerendered/static HTML never bakes in a
// build-time date and there's no post-mount setState/cascading render;
// the placeholder keeps the print layout stable until hydration resolves.
const PLACEHOLDER = "—"; // em dash

// No real-time updates happen during a page visit, so subscribe registers
// nothing and returns a no-op cleanup.
function subscribe() {
  return () => {};
}

// Cached so getSnapshot returns a referentially stable value across calls,
// avoiding re-formatting (and the "should be cached" loop guard) on every
// render. A string is fine for Object.is, but we still cache the format call.
let cachedFormatted: string | null = null;

function getSnapshot(): string {
  if (cachedFormatted === null) {
    cachedFormatted = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return cachedFormatted;
}

function getServerSnapshot(): string | null {
  return null;
}

export default function GeneratedDate() {
  const formatted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <>Generated {formatted ?? PLACEHOLDER}</>;
}
