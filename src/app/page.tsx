import Link from "next/link";
import { plants } from "@/data/plants";
import { habitatLocations, SCHOOL_CENTER, SURVEY_RADIUS } from "@/data/habitatLocations";
import PlantCard from "@/components/PlantCard";
import HabitatMapLoader from "@/components/HabitatMapLoader";
import { getCurrentMonthWeek, getAvailablePlants, getHabitatIcon, getHabitatLabel } from "@/lib/utils";
import { BookOpen, Calendar, MapPin, Search, TreePine, Flower2, Leaf, FileDown, Map } from "lucide-react";
import PDFExport from "@/components/PDFExport";

export default function HomePage() {
  const { month, week } = getCurrentMonthWeek();
  const availableNow = getAvailablePlants(month, week, plants);

  // Stats
  const categories = Array.from(new Set(plants.map((p) => p.category)));
  const habitats = Array.from(new Set(plants.flatMap((p) => p.habitat)));
  const nativeCount = plants.filter((p) => p.nativeStatus === "native").length;
  const invasiveCount = plants.filter((p) => p.nativeStatus === "invasive").length;

  const MONTH_NAMES = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--color-primary)" }}
      >
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden>
          <div className="absolute top-4 left-8 text-8xl">🌿</div>
          <div className="absolute top-12 right-16 text-7xl">🌳</div>
          <div className="absolute bottom-8 left-1/4 text-6xl">🌾</div>
          <div className="absolute bottom-4 right-8 text-8xl">🍃</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="text-green-300" size={20} />
              <span className="text-green-300 text-sm font-medium tracking-wider uppercase">
                Botanical Field Guide
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              St. Mark&apos;s Flora
            </h1>
            <p className="text-xl text-green-100 leading-relaxed mb-8">
              A Field Guide to Plants Within 1km of St. Mark&apos;s School,{" "}
              <span className="text-green-200 font-medium">Southborough, MA</span>
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/plants"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-green-900 font-semibold text-sm hover:bg-green-50 transition-colors shadow"
              >
                <BookOpen size={16} />
                Browse All Plants
              </Link>
              <Link
                href="/calendar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/15 text-white font-semibold text-sm hover:bg-white/25 transition-colors border border-white/20"
              >
                <Calendar size={16} />
                Collection Calendar
              </Link>
              <PDFExport
                variant="secondary"
                className="!bg-white/15 !text-white !border-white/20 hover:!bg-white/25"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Available Now */}
      {availableNow.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                Collectible Now
              </h2>
              <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                {MONTH_NAMES[month]}, Week {week} &mdash; {availableNow.length} species available
              </p>
            </div>
            <Link
              href={`/calendar`}
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              View full calendar →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {availableNow.slice(0, 8).map((plant) => (
              <PlantCard key={plant.id} plant={plant} currentMonth={month} />
            ))}
          </div>
          {availableNow.length > 8 && (
            <div className="mt-6 text-center">
              <Link
                href={`/plants?month=${month}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:shadow-sm transition-all"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-primary)",
                  background: "var(--color-card)",
                }}
              >
                See all {availableNow.length} plants available in {MONTH_NAMES[month]} →
              </Link>
            </div>
          )}
        </section>
      )}

      {/* Stats bar */}
      <section style={{ background: "var(--color-primary-pale)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold" style={{ color: "var(--color-primary)" }}>
                {plants.length}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Total Species
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: "var(--color-primary)" }}>
                {nativeCount}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Native Species
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: "var(--color-secondary)" }}>
                {invasiveCount}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Invasive Species
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: "var(--color-primary)" }}>
                {habitats.length}
              </div>
              <div className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                Habitat Types
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
          Explore the Guide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              href: "/plants",
              icon: <BookOpen size={28} />,
              title: "Browse All Plants",
              desc: `All ${plants.length} species with photos, descriptions, and collection tips.`,
              color: "var(--color-primary)",
            },
            {
              href: "/calendar",
              icon: <Calendar size={28} />,
              title: "By Month",
              desc: "Month-by-month view of what's available for collection, with week-level detail.",
              color: "var(--color-secondary)",
            },
            {
              href: "/habitats",
              icon: <MapPin size={28} />,
              title: "By Habitat",
              desc: "Explore plants grouped by habitat — forest floor, wetland, meadow, and more.",
              color: "#4a6e2a",
            },
            {
              href: "/plants?q=",
              icon: <Search size={28} />,
              title: "Search",
              desc: "Search by common name, scientific name, or plant family.",
              color: "var(--color-accent)",
            },
            {
              href: "/map",
              icon: <Map size={28} />,
              title: "Interactive Map",
              desc: "Explore habitat zones and find plants on an interactive map of the campus area.",
              color: "#2E86AB",
            },
            {
              href: "/field-guide",
              icon: <FileDown size={28} />,
              title: "Field Guide",
              desc: "Printable field guide with all species. Download as PDF or print.",
              color: "#6b4c1e",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-xl border p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
            >
              <div style={{ color: card.color }} className="group-hover:scale-110 transition-transform w-fit">
                {card.icon}
              </div>
              <div>
                <h3 className="font-semibold text-base" style={{ color: "var(--color-text)" }}>
                  {card.title}
                </h3>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Habitat Quick-Access */}
      <section
        className="border-t"
        style={{ background: "var(--color-primary-pale)", borderColor: "var(--color-border)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
              Habitat Types
            </h2>
            <Link
              href="/habitats"
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--color-primary)" }}
            >
              View all habitats →
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {habitats.map((hab) => {
              const count = plants.filter((p) => p.habitat.includes(hab)).length;
              return (
                <Link
                  key={hab}
                  href={`/habitats#${hab}`}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm hover:shadow-sm transition-all"
                  style={{
                    background: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <span>{getHabitatIcon(hab)}</span>
                  <span className="font-medium">{getHabitatLabel(hab)}</span>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{ background: "var(--color-primary-pale)", color: "var(--color-primary)" }}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Survey Area Map */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
            Survey Area
          </h2>
          <Link
            href="/map"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            View Full Map →
          </Link>
        </div>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
          All plants documented within 1km of St. Mark&apos;s School, Southborough, MA
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="p-3">
            <HabitatMapLoader
              habitatLocations={habitatLocations}
              plants={plants}
              schoolCenter={SCHOOL_CENTER}
              surveyRadius={SURVEY_RADIUS}
              height={300}
              showLegend={false}
            />
          </div>
        </div>
      </section>

      {/* Category breakdown */}
      <section
        className="border-t"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-bold mb-5" style={{ color: "var(--color-text)" }}>
            Species by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {(
              [
                { cat: "tree", icon: <TreePine size={22} />, label: "Trees" },
                { cat: "shrub", icon: <Leaf size={22} />, label: "Shrubs" },
                { cat: "wildflower", icon: <Flower2 size={22} />, label: "Wildflowers" },
                { cat: "fern", icon: <Leaf size={22} />, label: "Ferns" },
                { cat: "grass", icon: <Leaf size={22} />, label: "Grasses" },
                { cat: "vine", icon: <Leaf size={22} />, label: "Vines" },
              ] as const
            ).map(({ cat, icon, label }) => {
              const count = plants.filter((p) => p.category === cat).length;
              return (
                <Link
                  key={cat}
                  href={`/plants?category=${cat}`}
                  className="rounded-xl border p-4 text-center hover:shadow-sm hover:-translate-y-0.5 transition-all"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="flex justify-center mb-2 text-green-700">{icon}</div>
                  <div className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                    {count}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
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
