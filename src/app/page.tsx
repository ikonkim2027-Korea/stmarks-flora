import Link from "next/link";
import { plants } from "@/data/plants";
import {
  habitatLocations,
  SCHOOL_CENTER,
  SURVEY_RADIUS,
} from "@/data/habitatLocations";
import HabitatMapLoader from "@/components/HabitatMapLoader";
import SurveyFrameCard from "@/components/SurveyFrameCard";
import FieldReadySection from "@/components/FieldReadySection";
import StatTile from "@/components/ui/StatTile";
import { getHabitatLabel } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  Camera,
  FileDown,
  Flower2,
  Map,
  MapPin,
  Microscope,
  Search,
  TreePine,
} from "lucide-react";
import PDFExport from "@/components/PDFExport";

const quickLinks = [
  {
    href: "/plants",
    icon: BookOpen,
    title: "Specimen Index",
    desc: "Names, traits, photos, habitats, collection policy.",
  },
  {
    href: "/calendar",
    icon: Calendar,
    title: "Seasonal Windows",
    desc: "Month and week-level field timing for student surveys.",
  },
  {
    href: "/map",
    icon: Map,
    title: "Survey Radius",
    desc: "Habitat zones around the St. Mark's campus area.",
  },
  {
    href: "/field-guide",
    icon: FileDown,
    title: "Printable Atlas",
    desc: "A PDF-ready field guide for offline reference.",
  },
];

const categories = [
  { cat: "tree", icon: TreePine, label: "Trees" },
  { cat: "shrub", icon: Camera, label: "Shrubs" },
  { cat: "wildflower", icon: Flower2, label: "Wildflowers" },
  { cat: "fern", icon: Microscope, label: "Ferns" },
  { cat: "grass", icon: MapPin, label: "Grasses" },
  { cat: "vine", icon: BookOpen, label: "Vines" },
] as const;

// StatTile takes a plain-string label, so the sprout accent dot is attached to
// the tile's label row as a ::before marker instead of an extra element.
const LABEL_DOT =
  "[&>div:last-child]:flex [&>div:last-child]:items-center [&>div:last-child]:gap-1.5 " +
  "[&>div:last-child]:before:h-2 [&>div:last-child]:before:w-2 " +
  "[&>div:last-child]:before:rounded-full [&>div:last-child]:before:bg-sprout " +
  "[&>div:last-child]:before:content-['']";

export default function HomePage() {
  const habitats = Array.from(new Set(plants.flatMap((p) => p.habitat)));
  const nativeCount = plants.filter((p) => p.nativeStatus === "native").length;
  const invasiveCount = plants.filter((p) => p.nativeStatus === "invasive").length;
  const photoOnlyCount = plants.filter(
    (p) => p.collectionPolicy === "photograph-only"
  ).length;
  const heroPlant = plants.find((plant) => plant.id === "red-maple") ?? plants[0];

  return (
    <div>
      {/* Hero — light editorial split */}
      <section className="atlas-shell grid gap-10 pt-14 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <p className="section-label">
            St. Mark&apos;s School · Southborough MA
          </p>
          <h1 className="mt-3 text-5xl font-semibold leading-[1.02] tracking-tight text-text sm:text-6xl lg:text-7xl">
            Tiny Worlds <span className="text-moss">Field Atlas</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-text-soft">
            A modern survey guide for plants documented within 1km of St.
            Mark&apos;s School in Southborough, Massachusetts.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/plants" className="btn-ink">
              <BookOpen size={17} />
              Browse specimens
            </Link>
            <Link href="/calendar" className="btn-ghost">
              <Calendar size={17} />
              This season
            </Link>
            <PDFExport variant="secondary" />
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-xs text-text-soft">
            <span>1km survey radius</span>
            <span>{habitats.length} habitat systems</span>
            <span>Ethical collection policy</span>
          </div>
        </div>

        <div className="relative">
          {heroPlant.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroPlant.imageUrl}
              alt={heroPlant.commonName}
              className="aspect-[4/5] w-full rounded-card object-cover shadow-float"
            />
          )}
          {/* Overlaps the photo on wide screens; stacks below it on narrow ones */}
          <div className="mt-4 lg:absolute lg:-bottom-8 lg:-left-8 lg:mt-0 lg:w-[280px]">
            <SurveyFrameCard
              speciesCount={plants.length}
              nativeCount={nativeCount}
              invasiveCount={invasiveCount}
              photoOnlyCount={photoOnlyCount}
            />
          </div>
        </div>
      </section>

      <FieldReadySection />

      {/* Quick links */}
      <section className="atlas-shell py-12">
        <div className="grid gap-4 md:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="card card-hover flex min-h-44 flex-col justify-between p-6"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-moss-tint text-moss">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-text">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-text-soft">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Habitat matrix */}
      <section className="atlas-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="section-label">Habitat matrix</p>
            <h2 className="mt-1.5 text-3xl font-semibold tracking-tight text-text">
              Zones, edges, water, meadow.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-text-soft">
              The guide is organized around actual field conditions, not just
              taxonomy. Each habitat acts as a fast entry point into the campus
              survey area.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {habitats.map((habitat) => {
                const count = plants.filter((plant) =>
                  plant.habitat.includes(habitat)
                ).length;
                return (
                  <Link
                    key={habitat}
                    href={`/habitats#${habitat}`}
                    className="chip bg-surface text-text shadow-card transition-colors hover:bg-tint"
                  >
                    {getHabitatLabel(habitat)}
                    <span className="font-semibold text-moss">{count}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="card overflow-hidden p-2">
            <HabitatMapLoader
              habitatLocations={habitatLocations}
              plants={plants}
              schoolCenter={SCHOOL_CENTER}
              surveyRadius={SURVEY_RADIUS}
              height={380}
              showLegend={false}
            />
          </div>
        </div>
      </section>

      {/* Category scan */}
      <section className="atlas-shell py-12">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="section-label">Taxonomic scan</p>
            <h2 className="mt-1.5 text-3xl font-semibold tracking-tight text-text">
              Species by category
            </h2>
          </div>
          <Link
            href="/plants?q="
            className="inline-flex items-center gap-1.5 text-sm font-medium text-moss"
          >
            Search the atlas
            <Search size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(({ cat, icon: Icon, label }) => {
            const count = plants.filter((plant) => plant.category === cat).length;
            return (
              <Link key={cat} href={`/plants?category=${cat}`} className="relative block">
                <StatTile
                  value={count}
                  label={label}
                  className={`card-hover h-full pt-14 ${LABEL_DOT}`}
                />
                <Icon
                  size={20}
                  strokeWidth={1.7}
                  className="absolute left-4 top-4 text-moss"
                  aria-hidden
                />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
