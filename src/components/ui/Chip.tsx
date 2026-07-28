import { ReactNode } from "react";

const TONES = {
  moss: "bg-moss-tint text-moss",
  sage: "bg-tint text-text-soft",
  clay: "bg-clay-tint text-clay",
  mist: "bg-mist-tint text-mist",
  sprout: "bg-sprout text-ink",
  ink: "bg-ink text-white",
} as const;

export type ChipTone = keyof typeof TONES;

export default function Chip({
  tone = "sage",
  children,
  className = "",
}: {
  tone?: ChipTone;
  children: ReactNode;
  className?: string;
}) {
  return <span className={`chip ${TONES[tone]} ${className}`}>{children}</span>;
}
