"use client";

import { useEffect, useState } from "react";

// Renders the "Generated <date>" line on the printable field guide.
// Resolved after mount so prerendered/static HTML never bakes in a
// build-time date; the placeholder keeps the print layout stable until then.
const PLACEHOLDER = "—"; // em dash

export default function GeneratedDate() {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }, []);

  return <>Generated {formatted ?? PLACEHOLDER}</>;
}
