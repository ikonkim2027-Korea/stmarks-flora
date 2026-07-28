"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { plants, PlantCategory } from "@/data/plants";
import { formatMonthName, getHabitatLabel } from "@/lib/utils";

const CATEGORY_ORDER: { key: PlantCategory; label: string }[] = [
  { key: "tree", label: "Trees" },
  { key: "shrub", label: "Shrubs" },
  { key: "wildflower", label: "Wildflowers" },
  { key: "fern", label: "Ferns" },
  { key: "grass", label: "Grasses" },
  { key: "vine", label: "Vines" },
];

// Colors — mirrors the v2 token palette
const PRIMARY = [61, 90, 68] as const; // moss #3d5a44
const SECONDARY = [176, 96, 63] as const; // clay #b0603f
const TEXT = [32, 36, 31] as const; // text #20241f
const MUTED = [107, 114, 104] as const; // text-soft #6b7268
const BG = [240, 241, 234] as const; // canvas #f0f1ea

interface PDFExportProps {
  variant?: "primary" | "secondary" | "subtle";
  className?: string;
}

export default function PDFExport({ variant = "primary", className = "" }: PDFExportProps) {
  const [generating, setGenerating] = useState(false);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      await import("jspdf-autotable");

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // ─── Cover Page ────────────────────────────────
      doc.setFillColor(...BG);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Top decorative line
      doc.setDrawColor(...PRIMARY);
      doc.setLineWidth(0.8);
      doc.line(margin, 40, pageWidth - margin, 40);
      doc.line(margin, 42, pageWidth - margin, 42);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.setTextColor(...PRIMARY);
      doc.text("Tiny Worlds Collectibles", pageWidth / 2, 70, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(16);
      doc.setTextColor(...SECONDARY);
      doc.text("A Field Guide", pageWidth / 2, 82, { align: "center" });

      doc.setFontSize(11);
      doc.setTextColor(...TEXT);
      doc.text(
        "Plants Within 1km of St. Mark's School, Southborough, MA",
        pageWidth / 2,
        95,
        { align: "center" }
      );

      // Bottom decorative line
      doc.setDrawColor(...PRIMARY);
      doc.line(margin, 105, pageWidth - margin, 105);
      doc.line(margin, 107, pageWidth - margin, 107);

      // Stats
      const stats = [
        { label: "Total Species", value: plants.length.toString() },
        { label: "Native Species", value: plants.filter((p) => p.nativeStatus === "native").length.toString() },
        { label: "Plant Categories", value: CATEGORY_ORDER.filter((c) => plants.some((p) => p.category === c.key)).length.toString() },
      ];

      let sx = pageWidth / 2 - (stats.length * 45) / 2;
      stats.forEach((s) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(...PRIMARY);
        doc.text(s.value, sx + 22, 130, { align: "center" });
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...MUTED);
        doc.text(s.label, sx + 22, 137, { align: "center" });
        sx += 45;
      });

      // Date
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(...MUTED);
      doc.text(
        `Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        pageWidth / 2,
        160,
        { align: "center" }
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(
        "For educational field observation, ethical collection, and conservation-aware study.",
        pageWidth / 2,
        170,
        { align: "center" }
      );

      // ─── Table of Contents ──────────────────────────
      doc.addPage();
      let y = margin;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...PRIMARY);
      doc.text("Table of Contents", margin, y);
      y += 12;

      doc.setDrawColor(...PRIMARY);
      doc.setLineWidth(0.5);
      doc.line(margin, y, margin + 50, y);
      y += 10;

      let pageTracker = 3; // Cover is page 1, TOC is page 2

      CATEGORY_ORDER.forEach((cat) => {
        const catPlants = plants.filter((p) => p.category === cat.key);
        if (catPlants.length === 0) return;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(...TEXT);
        doc.text(`${cat.label} (${catPlants.length})`, margin, y);

        // Dotted leader to page number
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...MUTED);
        doc.text(`p. ${pageTracker}`, pageWidth - margin, y, { align: "right" });
        y += 6;

        catPlants
          .sort((a, b) => a.commonName.localeCompare(b.commonName))
          .forEach((plant) => {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...MUTED);
            doc.text(`${plant.commonName} (${plant.scientificName})`, margin + 6, y);
            y += 5;

            if (y > pageHeight - margin) {
              doc.addPage();
              y = margin;
            }
          });

        pageTracker += catPlants.length;
        y += 4;
      });

      // ─── Plant Pages ──────────────────────────────
      CATEGORY_ORDER.forEach((cat) => {
        const catPlants = plants
          .filter((p) => p.category === cat.key)
          .sort((a, b) => a.commonName.localeCompare(b.commonName));
        if (catPlants.length === 0) return;

        catPlants.forEach((plant) => {
          doc.addPage();
          y = margin;

          // Category badge
          doc.setFillColor(...PRIMARY);
          doc.roundedRect(margin, y - 4, 50, 7, 1.5, 1.5, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.setTextColor(255, 255, 255);
          doc.text(cat.label.toUpperCase(), margin + 25, y + 0.5, { align: "center" });
          y += 10;

          // Common name
          doc.setFont("helvetica", "bold");
          doc.setFontSize(18);
          doc.setTextColor(...PRIMARY);
          doc.text(plant.commonName, margin, y);
          y += 7;

          // Scientific name
          doc.setFont("helvetica", "italic");
          doc.setFontSize(12);
          doc.setTextColor(...SECONDARY);
          doc.text(plant.scientificName, margin, y);
          y += 6;

          // Family
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...MUTED);
          doc.text(`Family: ${plant.family}`, margin, y);

          // Status + abundance on right
          const statusText = `${plant.nativeStatus.charAt(0).toUpperCase() + plant.nativeStatus.slice(1)} | ${plant.abundance.charAt(0).toUpperCase() + plant.abundance.slice(1)}`;
          doc.text(statusText, pageWidth - margin, y, { align: "right" });
          y += 4;

          // Divider
          doc.setDrawColor(...PRIMARY);
          doc.setLineWidth(0.3);
          doc.line(margin, y, pageWidth - margin, y);
          y += 8;

          // Description
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(...TEXT);
          doc.text("Description", margin, y);
          y += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...TEXT);
          const descLines = doc.splitTextToSize(plant.description, contentWidth);
          doc.text(descLines, margin, y);
          y += descLines.length * 4 + 6;

          // Identification Tips
          if (plant.identificationTips.length > 0) {
            if (y > pageHeight - 50) {
              doc.addPage();
              y = margin;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(...TEXT);
            doc.text("Identification Tips", margin, y);
            y += 5;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...TEXT);
            plant.identificationTips.forEach((tip) => {
              if (y > pageHeight - 20) {
                doc.addPage();
                y = margin;
              }
              const tipLines = doc.splitTextToSize(`\u2022 ${tip}`, contentWidth - 4);
              doc.text(tipLines, margin + 2, y);
              y += tipLines.length * 4 + 2;
            });
            y += 4;
          }

          // Habitats
          if (y > pageHeight - 40) {
            doc.addPage();
            y = margin;
          }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(...TEXT);
          doc.text("Habitats", margin, y);
          y += 5;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(...MUTED);
          doc.text(plant.habitat.map(getHabitatLabel).join(", "), margin, y);
          y += 8;

          // Collection Windows
          if (plant.collectionWindows.length > 0) {
            if (y > pageHeight - 40) {
              doc.addPage();
              y = margin;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(...TEXT);
            doc.text("Collection Windows", margin, y);
            y += 5;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            plant.collectionWindows.forEach((w) => {
              if (y > pageHeight - 20) {
                doc.addPage();
                y = margin;
              }
              doc.setTextColor(...PRIMARY);
              doc.setFont("helvetica", "bold");
              doc.text(
                `${formatMonthName(w.month)} (Weeks ${w.weeks.join(", ")})`,
                margin,
                y
              );
              doc.setFont("helvetica", "normal");
              doc.setTextColor(...TEXT);
              const noteLines = doc.splitTextToSize(w.note, contentWidth - 4);
              y += 4;
              doc.text(noteLines, margin + 2, y);
              y += noteLines.length * 4 + 3;
            });
            y += 3;
          }

          // Specimen Notes
          if (plant.specimenNotes) {
            if (y > pageHeight - 35) {
              doc.addPage();
              y = margin;
            }

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(...TEXT);
            doc.text("Specimen Notes", margin, y);
            y += 5;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            doc.setTextColor(...TEXT);
            const noteLines = doc.splitTextToSize(plant.specimenNotes, contentWidth);
            doc.text(noteLines, margin, y);
          }

          // Conservation note if present
          if (plant.conservationNote) {
            y += 10;
            if (y > pageHeight - 25) {
              doc.addPage();
              y = margin;
            }

            doc.setFillColor(254, 243, 199); // light yellow
            doc.setDrawColor(217, 169, 23);
            doc.roundedRect(margin, y - 4, contentWidth, 14, 2, 2, "FD");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(8);
            doc.setTextColor(139, 105, 20);
            doc.text("Conservation Note:", margin + 3, y + 1);
            doc.setFont("helvetica", "normal");
            const consLines = doc.splitTextToSize(plant.conservationNote, contentWidth - 6);
            doc.text(consLines, margin + 3, y + 5.5);
          }

          // Page footer
          doc.setFont("helvetica", "italic");
          doc.setFontSize(7);
          doc.setTextColor(...MUTED);
          doc.text(
            `Tiny Worlds Collectibles Field Guide`,
            margin,
            pageHeight - 10
          );
          doc.text(
            `${plant.commonName} - ${plant.scientificName}`,
            pageWidth - margin,
            pageHeight - 10,
            { align: "right" }
          );
        });
      });

      doc.save("stmarks-flora-field-guide.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const variantClasses = {
    primary: "btn-ink",
    secondary: "btn-ghost",
    subtle: "btn-ghost min-h-0 px-4 py-2 text-xs",
  };

  return (
    <button
      onClick={generatePDF}
      disabled={generating}
      className={`${variantClasses[variant]} disabled:opacity-50 ${className}`}
    >
      {generating ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <FileDown size={16} />
      )}
      {generating ? "Generating PDF..." : "Download Field Guide PDF"}
    </button>
  );
}
