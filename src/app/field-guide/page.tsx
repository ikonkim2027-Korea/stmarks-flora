import { plants, PlantCategory } from "@/data/plants";
import { formatMonthName, getHabitatLabel } from "@/lib/utils";
import PrintButton from "@/components/PrintButton";
import PDFExport from "@/components/PDFExport";

const CATEGORY_ORDER: { key: PlantCategory; label: string }[] = [
  { key: "tree", label: "Trees" },
  { key: "shrub", label: "Shrubs" },
  { key: "wildflower", label: "Wildflowers" },
  { key: "fern", label: "Ferns" },
  { key: "grass", label: "Grasses" },
  { key: "vine", label: "Vines" },
];

export default function FieldGuidePage() {
  const sortedCategories = CATEGORY_ORDER.filter((cat) =>
    plants.some((p) => p.category === cat.key)
  );

  return (
    <>
      <style>{`
        @media print {
          /* Hide non-print elements */
          nav, footer, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 10pt !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          main {
            padding: 0 !important;
          }
          /* Cover page */
          .print-cover {
            page-break-after: always;
            display: flex !important;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 90vh;
            text-align: center;
          }
          /* TOC */
          .print-toc {
            page-break-after: always;
          }
          /* Each plant on its own page */
          .plant-entry {
            page-break-inside: avoid;
            page-break-after: always;
            padding: 0;
            border: none !important;
            box-shadow: none !important;
            margin: 0;
          }
          .plant-entry:last-child {
            page-break-after: auto;
          }
          /* Category headers */
          .category-header {
            page-break-before: always;
            page-break-after: avoid;
          }
          .category-header:first-of-type {
            page-break-before: avoid;
          }
          /* Print footer */
          @page {
            margin: 0.75in;
            @bottom-center {
              content: "Tiny Worlds Collectibles Field Guide";
              font-size: 8pt;
              color: #666;
            }
          }
        }

        @media screen {
          .print-cover {
            display: none;
          }
        }
      `}</style>

      {/* Print-only cover page */}
      <div className="print-cover">
        <h1 style={{ fontSize: "28pt", color: "#2D5016", marginBottom: "8pt" }}>
          Tiny Worlds Collectibles
        </h1>
        <p style={{ fontSize: "16pt", color: "#8B6914", marginBottom: "12pt" }}>
          A Field Guide
        </p>
        <p style={{ fontSize: "11pt", color: "#3C2415" }}>
          Plants Within 1km of St. Mark&apos;s School, Southborough, MA
        </p>
        <p style={{ fontSize: "10pt", color: "#7a6040", marginTop: "24pt" }}>
          {plants.length} species documented
        </p>
        <p style={{ fontSize: "9pt", color: "#7a6040", marginTop: "12pt" }}>
          Generated {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Screen header */}
      <div className="no-print">
        <div
          className="border-b"
          style={{
            background: "var(--color-primary)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Printable Field Guide
            </h1>
            <p className="text-green-200 text-sm mb-6">
              {plants.length} species &mdash; Optimized for printing (Ctrl+P) or
              download as PDF
            </p>
            <div className="flex flex-wrap gap-3">
              <PrintButton />
              <PDFExport variant="secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Content: works for both screen and print */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table of Contents */}
        <div className="print-toc mb-10">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
          >
            Table of Contents
          </h2>
          <div className="space-y-3">
            {sortedCategories.map((cat) => {
              const catPlants = plants
                .filter((p) => p.category === cat.key)
                .sort((a, b) => a.commonName.localeCompare(b.commonName));
              return (
                <div key={cat.key}>
                  <h3
                    className="font-bold text-base"
                    style={{ color: "var(--color-text)" }}
                  >
                    <a href={`#category-${cat.key}`} className="hover:underline">
                      {cat.label} ({catPlants.length})
                    </a>
                  </h3>
                  <ul className="ml-4 mt-1 space-y-0.5">
                    {catPlants.map((plant) => (
                      <li key={plant.id} className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        <a href={`#plant-${plant.id}`} className="hover:underline">
                          {plant.commonName}{" "}
                          <span className="italic">({plant.scientificName})</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plant entries by category */}
        {sortedCategories.map((cat) => {
          const catPlants = plants
            .filter((p) => p.category === cat.key)
            .sort((a, b) => a.commonName.localeCompare(b.commonName));
          return (
            <div key={cat.key}>
              <h2
                id={`category-${cat.key}`}
                className="category-header text-2xl font-bold mb-6 pb-2 border-b-2"
                style={{
                  color: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                }}
              >
                {cat.label}
              </h2>

              <div className="space-y-6 mb-10">
                {catPlants.map((plant) => (
                  <article
                    key={plant.id}
                    id={`plant-${plant.id}`}
                    className="plant-entry rounded-xl border p-6"
                    style={{
                      background: "var(--color-card)",
                      borderColor: "var(--color-border)",
                    }}
                  >
                    {/* Header */}
                    <div className="mb-4">
                      <h3
                        className="text-xl font-bold"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {plant.commonName}
                      </h3>
                      <p
                        className="italic text-base"
                        style={{ color: "var(--color-secondary)" }}
                      >
                        {plant.scientificName}
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Family: {plant.family} &bull;{" "}
                        {plant.nativeStatus.charAt(0).toUpperCase() +
                          plant.nativeStatus.slice(1)}{" "}
                        &bull;{" "}
                        {plant.abundance.charAt(0).toUpperCase() +
                          plant.abundance.slice(1)}
                      </p>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                      <h4
                        className="text-sm font-bold uppercase tracking-wider mb-1"
                        style={{ color: "var(--color-text)" }}
                      >
                        Description
                      </h4>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--color-text)" }}
                      >
                        {plant.description}
                      </p>
                    </div>

                    {/* Identification Tips */}
                    {plant.identificationTips.length > 0 && (
                      <div className="mb-4">
                        <h4
                          className="text-sm font-bold uppercase tracking-wider mb-1"
                          style={{ color: "var(--color-text)" }}
                        >
                          Identification Tips
                        </h4>
                        <ul className="list-disc list-inside space-y-1">
                          {plant.identificationTips.map((tip, i) => (
                            <li
                              key={i}
                              className="text-sm"
                              style={{ color: "var(--color-text)" }}
                            >
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Habitats */}
                    <div className="mb-4">
                      <h4
                        className="text-sm font-bold uppercase tracking-wider mb-1"
                        style={{ color: "var(--color-text)" }}
                      >
                        Habitats
                      </h4>
                      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                        {plant.habitat.map(getHabitatLabel).join(", ")}
                      </p>
                    </div>

                    {/* Collection Windows */}
                    {plant.collectionWindows.length > 0 && (
                      <div className="mb-4">
                        <h4
                          className="text-sm font-bold uppercase tracking-wider mb-1"
                          style={{ color: "var(--color-text)" }}
                        >
                          Collection Windows
                        </h4>
                        <div className="space-y-1">
                          {plant.collectionWindows.map((w, i) => (
                            <p key={i} className="text-sm" style={{ color: "var(--color-text)" }}>
                              <span className="font-semibold" style={{ color: "var(--color-primary)" }}>
                                {formatMonthName(w.month)} (Weeks {w.weeks.join(", ")}):
                              </span>{" "}
                              {w.note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Specimen Notes */}
                    {plant.specimenNotes && (
                      <div className="mb-4">
                        <h4
                          className="text-sm font-bold uppercase tracking-wider mb-1"
                          style={{ color: "var(--color-text)" }}
                        >
                          Specimen Notes
                        </h4>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "var(--color-text)" }}
                        >
                          {plant.specimenNotes}
                        </p>
                      </div>
                    )}

                    {/* Conservation Note */}
                    {plant.conservationNote && (
                      <div
                        className="rounded-lg p-3 border text-sm"
                        style={{
                          background: "#fef3c7",
                          borderColor: "#d4a017",
                          color: "#8B6914",
                        }}
                      >
                        <span className="font-bold">Conservation Note:</span>{" "}
                        {plant.conservationNote}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
