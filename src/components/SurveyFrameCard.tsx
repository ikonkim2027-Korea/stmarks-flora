"use client";

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

  const stats: { label: string; value: number }[] = [
    { label: "Species", value: speciesCount },
    { label: "Native", value: nativeCount },
    { label: "Invasive", value: invasiveCount },
    { label: "Photo only", value: photoOnlyCount },
  ];

  return (
    <aside className="glass divide-y divide-hairline p-5">
      <div className="pb-4">
        <p className="section-label">Active survey frame</p>
        <p className="mt-1.5 text-2xl font-semibold tracking-tight text-text">
          {now ? `${MONTH_NAMES[now.month]} W${now.week}` : "–"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="text-2xl font-semibold tracking-tight text-text">
              {stat.value}
            </div>
            <div className="mt-0.5 text-[11px] text-text-soft">{stat.label}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
