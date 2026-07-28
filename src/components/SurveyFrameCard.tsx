"use client";

import { Microscope } from "lucide-react";
import { useCurrentMonthWeek } from "@/lib/useCurrentMonthWeek";

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

interface SurveyFrameCardProps {
  speciesCount: number;
  nativeCount: number;
  invasiveCount: number;
  photoOnlyCount: number;
}

export default function SurveyFrameCard({
  speciesCount,
  nativeCount,
  invasiveCount,
  photoOnlyCount,
}: SurveyFrameCardProps) {
  const now = useCurrentMonthWeek();

  return (
    <aside className="atlas-panel bg-white/8 p-5 text-white shadow-none backdrop-blur-md">
      <div className="flex items-start justify-between gap-6 border-b border-white/20 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/54">
            Active survey frame
          </p>
          <p className="mt-2 text-2xl font-black">
            {now ? `${MONTH_NAMES[now.month]} W${now.week}` : "–"}
          </p>
        </div>
        <Microscope className="text-[#d9b44a]" size={28} strokeWidth={1.6} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {[
          ["Species", speciesCount],
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
  );
}
