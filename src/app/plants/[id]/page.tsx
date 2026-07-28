import { notFound } from "next/navigation";
import Link from "next/link";
import { plants } from "@/data/plants";
import AvailabilityBadge, { CalendarWithNow } from "@/components/AvailabilityBadge";
import {
  getCategoryColor,
  getNativeStatusColor,
  getNativeStatusLabel,
  getHabitatLabel,
  getAbundanceLabel,
} from "@/lib/utils";
import { getCollectionPolicy } from "@/lib/plantDiscovery";
import { ArrowLeft, AlertTriangle, Leaf, MapPin, ExternalLink } from "lucide-react";

export async function generateStaticParams() {
  return plants.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = plants.find((p) => p.id === id);
  if (!plant) return { title: "Plant Not Found" };
  return {
    title: `${plant.commonName} | Tiny Worlds Collectibles`,
    description: `${plant.scientificName} — ${plant.description.slice(0, 120)}...`,
  };
}

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = plants.find((p) => p.id === id);
  if (!plant) notFound();

  const categoryColor = getCategoryColor(plant.category);
  const nativeColor = getNativeStatusColor(plant.nativeStatus);
  const nativeLabel = getNativeStatusLabel(plant.nativeStatus);
  const collectionPolicy = getCollectionPolicy(plant);

  return (
    <div className="atlas-shell max-w-5xl py-10">
      {/* Back link */}
      <Link
        href="/plants"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
        style={{ color: "var(--color-text-muted)" }}
      >
        <ArrowLeft size={14} />
        Back to Plant Index
      </Link>

      {/* Herbarium sheet header */}
      <div
        className="atlas-panel mb-6 overflow-hidden"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
      >
        {/* Top band */}
        <div
          className="border-b px-6 py-5"
          style={{
            background: "var(--color-ink)",
            borderColor: "rgba(255,255,255,0.12)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/48">
                Specimen record
              </p>
              <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                {plant.commonName}
              </h1>
              <p className="mt-2 text-lg italic text-white/64">{plant.scientificName}</p>
            </div>
            <AvailabilityBadge plant={plant} variant="pill" />
          </div>
        </div>

        {/* Badges and meta */}
        <div className="flex flex-wrap items-center gap-2 border-b px-6 py-4" style={{ borderColor: "var(--color-border)" }}>
          <span className={`rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${categoryColor}`}>
            {plant.category}
          </span>
          <span className={`rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] ${nativeColor}`}>
            {nativeLabel}
          </span>
          <span
            className="rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]"
            style={{
              background: "var(--color-primary-pale)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            Family <span className="italic" style={{ color: "var(--color-text)" }}>{plant.family}</span>
          </span>
          <span
            className="rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]"
            style={{
              background: "var(--color-primary-pale)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            {getAbundanceLabel(plant.abundance)}
          </span>
          <span
            className="rounded-md border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]"
            style={{
              background:
                collectionPolicy.type === "photograph-only"
                  ? "#e0f2fe"
                  : "var(--color-primary-pale)",
              borderColor:
                collectionPolicy.type === "photograph-only"
                  ? "#7dd3fc"
                  : "var(--color-border)",
              color:
                collectionPolicy.type === "photograph-only"
                  ? "#075985"
                  : "var(--color-primary)",
            }}
          >
            {collectionPolicy.label}
          </span>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
          {/* Left: photo + habitats */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Photo placeholder */}
            <div
              className="flex aspect-[4/5] flex-col items-center justify-center overflow-hidden rounded-lg border p-4 text-center"
              style={{
                background: "var(--color-primary-pale)",
                borderColor: "var(--color-border)",
              }}
            >
              {plant.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={plant.imageUrl}
                  alt={plant.commonName}
                  className="h-full w-full rounded-lg object-cover saturate-[0.92]"
                />
              ) : (
                <>
                  <Leaf className="mb-3" size={42} strokeWidth={1.4} style={{ color: "var(--color-primary)" }} />
                  <p className="text-sm font-medium italic" style={{ color: "var(--color-primary)" }}>
                    {plant.scientificName}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                    Specimen photo pending
                  </p>
                </>
              )}
            </div>

            {/* Habitats */}
            <div
              className="rounded-lg border p-4"
              style={{ borderColor: "var(--color-border)" }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5" style={{ color: "var(--color-text-muted)" }}>
                <MapPin size={13} />
                Habitats
              </h3>
              <div className="flex flex-col gap-2">
                {plant.habitat.map((h) => (
                  <Link
                    key={h}
                    href={`/habitats#${h}`}
                    className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm font-bold hover:bg-white"
                    style={{ color: "var(--color-text)" }}
                  >
                    <span>{getHabitatLabel(h)}</span>
                    <MapPin size={13} style={{ color: "var(--color-primary)" }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: description, tips, notes */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Current collection note */}
            <AvailabilityBadge plant={plant} variant="note" />

            {/* Conservation note */}
            {plant.conservationNote && (
              <div
                className="flex gap-3 rounded-lg border p-4"
                style={{ background: "#fff8e1", borderColor: "#f0c84c" }}
              >
                <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-amber-800">Conservation Note</p>
                  <p className="text-sm text-amber-700 mt-0.5">{plant.conservationNote}</p>
                </div>
              </div>
            )}

            {/* Invasive warning */}
            {plant.nativeStatus === "invasive" && (
              <div
                className="flex gap-3 rounded-lg border p-4"
                style={{ background: "#fef2f2", borderColor: "#f9a8a8" }}
              >
                <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-red-800">Invasive Species</p>
                  <p className="text-sm text-red-700 mt-0.5">
                    This plant is non-native and invasive. Collection is encouraged.
                    {plant.conservationNote ? ` ${plant.conservationNote}` : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-lg font-black" style={{ color: "var(--color-text)" }}>
                <Leaf size={16} style={{ color: "var(--color-primary)" }} />
                Description
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                {plant.description}
              </p>
            </div>

            {/* Identification Tips */}
            <div>
              <h2 className="mb-3 text-lg font-black" style={{ color: "var(--color-text)" }}>
                Identification Tips
              </h2>
              <ul className="space-y-2">
                {plant.identificationTips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-sm" style={{ color: "var(--color-text)" }}>
                    <span
                      className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-xs font-black"
                      style={{ background: "var(--color-primary-pale)", color: "var(--color-primary)" }}
                    >
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Specimen Preservation Notes */}
            <div
              className="rounded-lg border p-5"
              style={{
                background: "var(--color-primary-pale)",
                borderColor: "var(--color-border)",
              }}
            >
              <h2 className="mb-2 text-base font-black" style={{ color: "var(--color-text)" }}>
                Specimen &amp; Preservation Notes
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                {plant.specimenNotes}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Calendar */}
      <div
        className="atlas-panel mb-6 p-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="mb-4 text-xl font-black" style={{ color: "var(--color-text)" }}>
          Collection Calendar
        </h2>
        <CalendarWithNow plant={plant} />
      </div>

      {/* Sources */}
      {plant.sources && plant.sources.length > 0 && (
        <div className="atlas-panel mb-6 p-6" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black" style={{ color: "var(--color-text)" }}>
            <ExternalLink size={18} style={{ color: "var(--color-primary)" }} />
            Sources &amp; References
          </h2>
          <ul className="space-y-2">
            {plant.sources.map((source, i) => (
              <li key={i}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:underline inline-flex items-center gap-1.5"
                  style={{ color: "var(--color-primary)" }}
                >
                  <span className="font-medium">{source.label}</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer nav */}
      <div className="flex gap-3">
        <Link
          href="/plants"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-all hover:shadow-sm"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
            background: "var(--color-card)",
          }}
        >
          <ArrowLeft size={14} />
          Back to Plant Index
        </Link>
        <Link
          href="/calendar"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-all hover:shadow-sm"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-primary)",
            background: "var(--color-card)",
          }}
        >
          View Collection Calendar
        </Link>
      </div>
    </div>
  );
}
