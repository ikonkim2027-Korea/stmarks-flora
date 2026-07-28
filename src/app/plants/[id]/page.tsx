import { notFound } from "next/navigation";
import Link from "next/link";
import { plants } from "@/data/plants";
import AvailabilityBadge, { CalendarWithNow } from "@/components/AvailabilityBadge";
import Chip from "@/components/ui/Chip";
import {
  getNativeStatusLabel,
  getHabitatLabel,
  getAbundanceLabel,
} from "@/lib/utils";
import { getCollectionPolicy } from "@/lib/plantDiscovery";
import { ArrowLeft, AlertTriangle, Leaf, ExternalLink } from "lucide-react";

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

function MetaCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] text-text-soft">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-text">{children}</div>
    </div>
  );
}

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = plants.find((p) => p.id === id);
  if (!plant) notFound();

  const nativeLabel = getNativeStatusLabel(plant.nativeStatus);
  const collectionPolicy = getCollectionPolicy(plant);
  const categoryLabel = plant.category.charAt(0).toUpperCase() + plant.category.slice(1);

  return (
    <div className="atlas-shell max-w-5xl py-10">
      {/* Breadcrumb */}
      <Link
        href="/plants"
        className="inline-flex items-center gap-1.5 text-sm text-text-soft transition-colors hover:text-text"
      >
        <ArrowLeft size={14} />
        Plant index
      </Link>

      {/* Photo left, record right; habitats tuck under the photo on wide screens
          and fall to the end of the stack on narrow ones. */}
      <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {plant.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={plant.imageUrl}
            alt={plant.commonName}
            className="aspect-[4/5] w-full rounded-card object-cover shadow-float lg:col-span-1"
          />
        ) : (
          <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-card bg-tint p-6 text-center shadow-float lg:col-span-1">
            <Leaf size={36} strokeWidth={1.4} className="text-moss" />
            <p className="sci-name text-sm text-text">{plant.scientificName}</p>
            <p className="text-xs text-text-soft">Specimen photo pending</p>
          </div>
        )}

        {/* Right: record */}
        <div className="flex flex-col gap-6 lg:col-span-2 lg:row-span-2">
          <div>
            <p className="section-label">Specimen record</p>
            <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
              {plant.commonName}
            </h1>
            <p className="sci-name mt-2 text-xl text-text-soft">{plant.scientificName}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <AvailabilityBadge plant={plant} variant="pill" />
              <Chip tone={collectionPolicy.type === "photograph-only" ? "mist" : "moss"}>
                {collectionPolicy.label}
              </Chip>
            </div>

            {/* Quiet metadata strip */}
            <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3 border-y border-hairline py-4">
              <MetaCell label="Category">{categoryLabel}</MetaCell>
              <MetaCell label="Status">{nativeLabel}</MetaCell>
              <MetaCell label="Family">
                <span className="sci-name">{plant.family}</span>
              </MetaCell>
              <MetaCell label="Abundance">{getAbundanceLabel(plant.abundance)}</MetaCell>
            </div>
          </div>

          {/* Current collection note */}
          <AvailabilityBadge plant={plant} variant="note" />

          {/* Conservation note */}
          {plant.conservationNote && (
            <div className="flex gap-3 rounded-tile bg-[#f5eeda] p-4 text-sm leading-6 text-text">
              <AlertTriangle size={16} className="mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Conservation note</p>
                <p>{plant.conservationNote}</p>
              </div>
            </div>
          )}

          {/* Invasive warning */}
          {plant.nativeStatus === "invasive" && (
            <div className="flex gap-3 rounded-tile bg-clay-tint p-4 text-sm leading-6 text-clay">
              <AlertTriangle size={16} className="mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold">Invasive species</p>
                <p>
                  This plant is non-native and invasive. Collection is encouraged.
                  {plant.conservationNote ? ` ${plant.conservationNote}` : ""}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text">Description</h2>
            <p className="mt-2 text-[15px] leading-7 text-text">{plant.description}</p>
          </div>

          {/* Identification tips */}
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text">
              Identification tips
            </h2>
            <ul className="mt-3 space-y-2.5">
              {plant.identificationTips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-7 text-text">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-tint text-[11px] text-text-soft">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Specimen preservation notes */}
          <div className="card bg-tint/60 p-6">
            <h2 className="text-lg font-semibold tracking-tight text-text">
              Specimen &amp; preservation notes
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-text">{plant.specimenNotes}</p>
          </div>
        </div>

        {/* Habitats */}
        <div className="card p-5 lg:col-span-1 lg:col-start-1">
          <p className="section-label mb-3">Habitats</p>
          <div className="flex flex-wrap gap-1.5">
            {plant.habitat.map((h) => (
              <Link
                key={h}
                href={`/habitats#${h}`}
                className="chip bg-tint text-text transition-colors hover:bg-sage/45"
              >
                {getHabitatLabel(h)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Collection calendar */}
      <div className="card mt-8 p-6">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-text">
          Collection calendar
        </h2>
        <CalendarWithNow plant={plant} />
      </div>

      {/* Sources */}
      {plant.sources && plant.sources.length > 0 && (
        <div className="card mt-6 p-6">
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-text">
            Sources &amp; references
          </h2>
          <ul className="space-y-2">
            {plant.sources.map((source, i) => (
              <li key={i}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-moss hover:underline"
                >
                  {source.label}
                  <ExternalLink size={12} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer nav */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/plants" className="btn-ghost">
          <ArrowLeft size={15} />
          Back to plant index
        </Link>
        <Link href="/calendar" className="btn-ghost">
          View collection calendar
        </Link>
      </div>
    </div>
  );
}
