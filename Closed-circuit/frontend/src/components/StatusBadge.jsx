const statusStyles = {
  New: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  Processing: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'Rejected temporarily': 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  'Rejected permanently': 'bg-red-500/15 text-red-300 border-red-500/30',
  Closed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

export default function StatusBadge({ status }) {
  const label = status || 'New';
  const style = statusStyles[label] || statusStyles.New;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${style}`}
    >
      {label}
    </span>
  );
}
