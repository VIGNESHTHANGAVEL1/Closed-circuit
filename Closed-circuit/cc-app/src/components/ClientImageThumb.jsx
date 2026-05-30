import { Building2, User } from 'lucide-react';

export default function ClientImageThumb({ url, variant = 'logo', alt = '' }) {
  const isLogo = variant === 'logo';
  const boxClass = isLogo
    ? 'h-10 w-10 rounded-lg object-contain bg-white/5 p-1'
    : 'h-10 w-10 rounded-full object-cover';

  if (url) {
    return (
      <img
        src={url}
        alt={alt}
        className={`${boxClass} border border-white/10`}
      />
    );
  }

  return (
    <div
      className={`${boxClass} flex items-center justify-center border border-white/10 bg-gradient-to-br from-indigo-500/30 to-purple-600/20 text-indigo-300`}
      aria-hidden
    >
      {isLogo ? <Building2 size={16} /> : <User size={16} />}
    </div>
  );
}
