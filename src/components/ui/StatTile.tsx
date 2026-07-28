export default function StatTile({
  value,
  label,
  className = "",
}: {
  value: string | number;
  label: string;
  className?: string;
}) {
  return (
    <div className={`rounded-tile bg-surface p-4 shadow-card ${className}`}>
      <div className="text-3xl font-semibold tracking-tight text-text">{value}</div>
      <div className="mt-1 text-xs text-text-soft">{label}</div>
    </div>
  );
}
