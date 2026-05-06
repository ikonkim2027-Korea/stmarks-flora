import Link from "next/link";
import { plants } from "@/data/plants";
import {
  habitatLocations,
  SCHOOL_CENTER,
  SURVEY_RADIUS,
} from "@/data/habitatLocations";
import PlantCard from "@/components/PlantCard";
import HabitatMapLoader from "@/components/HabitatMapLoader";
import { getCurrentMonthWeek, getHabitatLabel } from "@/lib/utils";
import { getDiscoverablePlantsForWeek } from "@/lib/plantDiscovery";
import {
  ArrowUpRight,
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

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

export default function HomePage() {
  const { month, week } = getCurrentMonthWeek();
  const availableNow = getDiscoverablePlantsForWeek(month, week, plants);
  const fieldReadyPlants = [
    ...availableNow.collectible,
    ...availableNow.observationOnly,
  ];

  const habitats = Array.from(new Set(plants.flatMap((p) => p.habitat)));
  const nativeCount = plants.filter((p) => p.nativeStatus === "native").length;
  const invasiveCount = plants.filter((p) => p.nativeStatus === "invasive").length;
  const photoOnlyCount = plants.filter(
    (p) => p.collectionPolicy === "photograph-only"
  ).length;
  const heroPlant = plants.find((plant) => plant.id === "red-maple") ?? plants[0];

  return (
    <div>
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[var(--color-ink)] text-white">
        {heroPlant.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroPlant.imageUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-38"
          />
        )}
        <div className="absolute inset-0 specimen-grid" aria-hidden />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,24,22,0.94)_0%,rgba(17,24,22,0.78)_42%,rgba(17,24,22,0.28)_100%)]" />

        <div className="atlas-shell relative flex min-h-[calc(100vh-4rem)] flex-col justify-between py-10 sm:py-14 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-end">
            <div className="max-w-3xl pt-10 sm:pt-16">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-[#d9b44a]">
                St. Mark&apos;s School botanical field atlas
              </p>
              <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                Tiny Worlds Collectibles
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-white/78">
                A modern survey guide for plants documented within 1km of St.
                Mark&apos;s School in Southborough, Massachusetts.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/plants" className="atlas-button-primary bg-white text-[var(--color-ink)] hover:text-white">
                  <BookOpen size={17} />
                  Browse specimens
                </Link>
                <Link href="/calendar" className="atlas-button-secondary">
                  <Calendar size={17} />
                  This season
                </Link>
                <PDFExport
                  variant="secondary"
                  className="!min-h-[2.75rem] !rounded-lg !border-white/35 !bg-white/10 !text-white hover:!bg-white/18"
                />
              </div>
            </div>

            <aside className="atlas-panel bg-white/8 p-5 text-white shadow-none backdrop-blur-md">
              <div className="flex items-start justify-between gap-6 border-b border-white/20 pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/54">
                    Active survey frame
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {MONTH_NAMES[month]} W{week}
                  </p>
                </div>
                <Microscope className="text-[#d9b44a]" size={28} strokeWidth={1.6} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Species", plants.length],
                  ["Native", nativeCount],
                  ["Invasive", invasiveCount],
                  ["Photo only", photoOnlyCount],
                ].map(([label, value]) => (
                  <div key={label} className="border-t border-white/18 pt-3">
                    <div className="text-3xl font-black">{value}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/52">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="mt-12 grid gap-3 border-t border-white/18 pt-5 text-xs uppercase tracking-[0.18em] text-white/58 sm:grid-cols-3">
            <span>1km survey radius</span>
            <span>{habitats.length} habitat systems</span>
            <span>Ethical collection policy</span>
          </div>
        </div>
      </section>

      {fieldReadyPlants.length > 0 && (
        <section className="atlas-shell py-14">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="atlas-kicker">Current field window</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Field-ready now
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                {availableNow.collectible.length} collectible specimens and{" "}
                {availableNow.observationOnly.length} photograph-only observations.
              </p>
            </div>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 text-sm font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              View full calendar
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fieldReadyPlants.slice(0, 8).map((plant) => (
              <PlantCard key={plant.id} plant={plant} currentMonth={month} />
            ))}
          </div>
        </section>
      )}

      <section className="border-y" style={{ borderColor: "var(--color-border)", background: "var(--color-field)" }}>
        <div className="atlas-shell py-12">
          <div className="grid gap-3 md:grid-cols-4">
            {quickLinks.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="atlas-card group flex min-h-44 flex-col justify-between p-5 transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: "var(--color-text-muted)" }}>
                      0{index + 1}
                    </span>
                    <Icon size={23} strokeWidth={1.6} style={{ color: "var(--color-primary)" }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-text-muted)" }}>
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="atlas-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="atlas-kicker">Habitat matrix</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Zones, edges, water, meadow.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7" style={{ color: "var(--color-text-muted)" }}>
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
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold transition-colors hover:bg-white"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    {getHabitatLabel(habitat)}
                    <span style={{ color: "var(--color-primary)" }}>{count}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="atlas-panel overflow-hidden p-2">
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

      <section className="border-t" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
        <div className="atlas-shell py-12">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="atlas-kicker">Taxonomic scan</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight">
                Species by category
              </h2>
            </div>
            <Link
              href="/plants?q="
              className="inline-flex items-center gap-2 text-sm font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              Search the atlas
              <Search size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(
              [
                { cat: "tree", icon: TreePine, label: "Trees" },
                { cat: "shrub", icon: Camera, label: "Shrubs" },
                { cat: "wildflower", icon: Flower2, label: "Wildflowers" },
                { cat: "fern", icon: Microscope, label: "Ferns" },
                { cat: "grass", icon: MapPin, label: "Grasses" },
                { cat: "vine", icon: BookOpen, label: "Vines" },
              ] as const
            ).map(({ cat, icon: Icon, label }) => {
              const count = plants.filter((plant) => plant.category === cat).length;
              return (
                <Link
                  key={cat}
                  href={`/plants?category=${cat}`}
                  className="atlas-card p-4 transition-all hover:-translate-y-1"
                >
                  <Icon size={21} strokeWidth={1.6} style={{ color: "var(--color-primary)" }} />
                  <div className="mt-5 text-4xl font-black tracking-tight">
                    {count}
                  </div>
                  <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--color-text-muted)" }}>
                    {label}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
