import { plants, PlantCategory } from "@/data/plants";
import { formatMonthName, getHabitatLabel } from "@/lib/utils";
import PrintButton from "@/components/PrintButton";
import PDFExport from "@/components/PDFExport";
import GeneratedDate from "@/components/GeneratedDate";

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
        <h1 style={{ fontSize: "28pt", color: "#3d5a44", marginBottom: "8pt" }}>
          Tiny Worlds Collectibles
        </h1>
        <p style={{ fontSize: "16pt", color: "#b0603f", marginBottom: "12pt" }}>
          A Field Guide
        </p>
        <p style={{ fontSize: "11pt", color: "#20241f" }}>
          Plants Within 1km of St. Mark&apos;s School, Southborough, MA
        </p>
        <p style={{ fontSize: "10pt", color: "#6b7268", marginTop: "24pt" }}>
          {plants.length} species documented
        </p>
        <p style={{ fontSize: "9pt", color: "#6b7268", marginTop: "12pt" }}>
          <GeneratedDate />
        </p>
      </div>

      {/* Screen header */}
      <div className="no-print atlas-shell max-w-4xl pt-10">
        <p className="section-label">Offline reference</p>
        <h1 className="mt-1.5 text-4xl font-semibold tracking-tight text-text sm:text-5xl">
          Printable field guide
        </h1>
        <p className="mt-3 text-sm text-text-soft">
          All {plants.length} species, laid out for printing or PDF download.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <PrintButton />
          <PDFExport variant="secondary" />
        </div>
      </div>

      {/* Content: works for both screen and print */}
      <div className="atlas-shell max-w-4xl py-10">
        {/* Table of Contents */}
        <div className="print-toc card mb-8 p-6">
          <h2 className="text-lg font-semibold tracking-tight text-text">
            Table of contents
          </h2>
          <div className="mt-4 space-y-4">
            {sortedCategories.map((cat) => {
              const catPlants = plants
                .filter((p) => p.category === cat.key)
                .sort((a, b) => a.commonName.localeCompare(b.commonName));
              return (
                <div key={cat.key}>
                  <h3 className="text-sm font-semibold text-moss">
                    <a href={`#category-${cat.key}`} className="hover:underline">
                      {cat.label} ({catPlants.length})
                    </a>
                  </h3>
                  <ul className="mt-1.5 ml-4 space-y-1">
                    {catPlants.map((plant) => (
                      <li key={plant.id} className="text-sm text-text-soft">
                        <a href={`#plant-${plant.id}`} className="hover:text-text">
                          {plant.commonName}{" "}
                          <span className="sci-name">({plant.scientificName})</span>
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
                className="category-header mb-6 border-b border-hairline pb-2 text-2xl font-semibold tracking-tight text-text"
              >
                {cat.label}
              </h2>

              <div className="mb-10 space-y-5">
                {catPlants.map((plant) => (
                  <article
                    key={plant.id}
                    id={`plant-${plant.id}`}
                    className="plant-entry card scroll-mt-24 p-6"
                  >
                    {/* Header */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold tracking-tight text-text">
                        {plant.commonName}
                      </h3>
                      <p className="sci-name text-base text-moss">
                        {plant.scientificName}
                      </p>
                      <p className="mt-1 text-sm text-text-soft">
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
                      <p className="section-label">Description</p>
                      <p className="mt-1 text-sm leading-7 text-text">
                        {plant.description}
                      </p>
                    </div>

                    {/* Identification Tips */}
                    {plant.identificationTips.length > 0 && (
                      <div className="mb-4">
                        <p className="section-label">Identification tips</p>
                        <ul className="mt-1 list-inside list-disc space-y-1">
                          {plant.identificationTips.map((tip, i) => (
                            <li key={i} className="text-sm leading-6 text-text">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Habitats */}
                    <div className="mb-4">
                      <p className="section-label">Habitats</p>
                      <p className="mt-1 text-sm text-text-soft">
                        {plant.habitat.map(getHabitatLabel).join(", ")}
                      </p>
                    </div>

                    {/* Collection Windows */}
                    {plant.collectionWindows.length > 0 && (
                      <div className="mb-4">
                        <p className="section-label">Collection windows</p>
                        <div className="mt-1 space-y-1">
                          {plant.collectionWindows.map((w, i) => (
                            <p key={i} className="text-sm leading-6 text-text">
                              <span className="font-semibold text-moss">
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
                        <p className="section-label">Specimen notes</p>
                        <p className="mt-1 text-sm leading-7 text-text">
                          {plant.specimenNotes}
                        </p>
                      </div>
                    )}

                    {/* Conservation Note */}
                    {plant.conservationNote && (
                      <div className="rounded-tile bg-[#f5eeda] p-4 text-sm leading-6 text-text">
                        <span className="font-semibold">Conservation note:</span>{" "}
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
