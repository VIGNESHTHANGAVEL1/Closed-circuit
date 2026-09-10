/**
 * Shared HTML5 video player used across Flow, Voice, Families, and Watch Feature Demos.
 *
 * Height is increased ~30% from the original implementation while preserving
 * width, responsiveness, controls, and playback attributes.
 */
export default function MediaPlayer({
  src,
  title,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = true,
  playsInline = true,
  preload = 'auto',
  objectFit = 'cover',
  fixedHeight = true,
  className = '',
}) {
  if (!src) {
    return null;
  }

  const sizeClasses = fixedHeight
    ? 'h-[220px] sm:h-[320px] md:h-[416px] lg:h-[494px]'
    : 'h-auto';
  const fitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';

  return (
    <video
      key={src}
      src={src}
      title={title}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={preload}
      className={`${sizeClasses} w-full max-w-[1100px] rounded-2xl ${fitClass} shadow-2xl ${className}`.trim()}
    >
      Your browser does not support the video tag.
    </video>
  );
}
