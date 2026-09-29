import { Star } from 'lucide-react';

export default function StarRatingInput({ value, onChange, disabled = false, label = 'Your rating (optional)' }) {
  const selected = Number(value) || 0;

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <p className="block font-semibold text-white mb-2 text-sm sm:text-base">{label}</p>
      <div className="flex items-center gap-1.5 sm:gap-2" role="group" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= selected;
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onChange(selected === star ? '' : String(star))}
              className="rounded-lg p-1 transition hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              aria-label={`${star} star${star === 1 ? '' : 's'}`}
            >
              <Star
                size={28}
                className={active ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}
                strokeWidth={1.5}
              />
            </button>
          );
        })}
        {selected > 0 && (
          <span className="ml-2 text-sm font-semibold text-amber-300">{selected} / 5</span>
        )}
      </div>
    </div>
  );
}

export function StarRatingDisplay({ rating, size = 16 }) {
  const value = Number(rating) || 0;
  if (value < 1) return null;

  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
