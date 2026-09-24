export default function YesNoGroup({ name, label, value, onChange, disabled }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3 sm:p-4">
      <p className="text-base sm:text-lg font-semibold text-white mb-3 leading-snug tracking-tight">
        {label} <span className="text-indigo-400 font-bold">*</span>
      </p>
      <div className="flex flex-wrap gap-6 sm:gap-8">
        {['Yes', 'No'].map((option) => (
          <label
            key={option}
            className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={onChange}
              disabled={disabled}
              className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem] accent-indigo-500 shrink-0"
            />
            <span className="text-sm sm:text-base font-semibold text-slate-200">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
