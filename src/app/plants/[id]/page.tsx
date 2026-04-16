import { notFound } from "next/navigation";
import Link from "next/link";
import { plants } from "@/data/plants";
import CollectionCalendar from "@/components/CollectionCalendar";
import {
  getCategoryColor,
  getNativeStatusColor,
  getNativeStatusLabel,
  getHabitatIcon,
  getHabitatLabel,
  getAbundanceLabel,
  getCurrentMonthWeek,
} from "@/lib/utils";
import { ArrowLeft, AlertTriangle, Info, Leaf, MapPin, ExternalLink } from "lucide-react";

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
    title: `${plant.commonName} | St. Mark's Flora`,
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

  const { month, week } = getCurrentMonthWeek();
  const isAvailableNow = plant.collectionWindows.some(
    (w) => w.month === month && w.weeks.includes(week)
  );
  const currentWindow = plant.collectionWindows.find(
    (w) => w.month === month && w.weeks.includes(week)
  );

  const categoryColor = getCategoryColor(plant.category);
  const nativeColor = getNativeStatusColor(plant.nativeStatus);
  const nativeLabel = getNativeStatusLabel(plant.nativeStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/plants"
        className="inline-flex items-center gap-1.5 text-sm hover:underline mb-6"
        style={{ color: "var(--color-text-muted)" }}
      >
        <ArrowLeft size={14} />
        Back to Plant Index
      </Link>

      {/* Herbarium sheet header */}
      <div
        className="rounded-2xl border overflow-hidden mb-6"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
      >
        {/* Top band */}
        <div
          className="px-6 py-4 border-b"
          style={{
            background: "var(--color-primary)",
            borderColor: "var(--color-primary-light)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {plant.commonName}
              </h1>
              <p className="text-lg italic text-green-200 mt-1">{plant.scientificName}</p>
            </div>
            {isAvailableNow && (
              <span className="flex-shrink-0 mt-1 px-3 py-1 bg-green-300 text-green-900 text-sm font-bold rounded-full">
                Collectible Now
              </span>
            )}
          </div>
        </div>

        {/* Badges and meta */}
        <div className="px-6 py-4 flex flex-wrap gap-3 items-center border-b" style={{ borderColor: "var(--color-border)" }}>
          <span className={`text-sm px-3 py-1 rounded-full border font-medium capitalize ${categoryColor}`}>
            {plant.category}
          </span>
          <span className={`text-sm px-3 py-1 rounded-full border font-medium ${nativeColor}`}>
            {nativeLabel}
          </span>
          <span
            className="text-sm px-3 py-1 rounded-full border font-medium"
            style={{
              background: "var(--color-primary-pale)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            Family: <span className="italic font-semibold" style={{ color: "var(--color-text)" }}>{plant.family}</span>
          </span>
          <span
            className="text-sm px-3 py-1 rounded-full border"
            style={{
              background: "var(--color-primary-pale)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
          >
            {getAbundanceLabel(plant.abundance)}
          </span>
        </div>

        {/* Main content grid */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: photo + habitats */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Photo placeholder */}
            <div
              className="rounded-xl border aspect-[4/5] flex flex-col items-center justify-center text-center p-4"
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
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <>
                  <div className="text-5xl mb-3">🌿</div>
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
              className="rounded-xl border p-4"
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
                    className="flex items-center gap-2 text-sm hover:underline"
                    style={{ color: "var(--color-text)" }}
                  >
                    <span>{getHabitatIcon(h)}</span>
                    <span>{getHabitatLabel(h)}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: description, tips, notes */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Current collection note */}
            {isAvailableNow && currentWindow && (
              <div
                className="rounded-xl border p-4 flex gap-3"
                style={{ background: "#e8f5e2", borderColor: "#a8d58a" }}
              >
                <Info size={18} className="text-green-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-green-800">Collectible This Week</p>
                  <p className="text-sm text-green-700 mt-0.5">{currentWindow.note}</p>
                </div>
              </div>
            )}

            {/* Conservation note */}
            {plant.conservationNote && (
              <div
                className="rounded-xl border p-4 flex gap-3"
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
                className="rounded-xl border p-4 flex gap-3"
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
              <h2 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                <Leaf size={16} style={{ color: "var(--color-primary)" }} />
                Description
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
                {plant.description}
              </p>
            </div>

            {/* Identification Tips */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--color-text)" }}>
                Identification Tips
              </h2>
              <ul className="space-y-2">
                {plant.identificationTips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-sm" style={{ color: "var(--color-text)" }}>
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
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
              className="rounded-xl border p-5"
              style={{
                background: "var(--color-primary-pale)",
                borderColor: "var(--color-border)",
              }}
            >
              <h2 className="text-base font-bold mb-2" style={{ color: "var(--color-text)" }}>
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
        className="rounded-2xl border p-6 mb-6"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
          Collection Calendar
        </h2>
        <CollectionCalendar
          collectionWindows={plant.collectionWindows}
          currentMonth={month}
          currentWeek={week}
        />
      </div>

      {/* Sources */}
      {plant.sources && plant.sources.length > 0 && (
        <div className="rounded-2xl border p-6 mb-6" style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--color-text)" }}>
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:shadow-sm transition-all"
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:shadow-sm transition-all"
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
