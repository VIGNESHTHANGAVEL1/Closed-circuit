import { motion } from 'framer-motion';

export default function Hero({
  title,
  subtitle,
  eyebrow,
  gradient = 'from-[#030712] via-[#0f172a] to-[#030712]',
  contentClassName = 'mx-auto max-w-6xl px-6 py-16 md:py-24 text-center',
}) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white border-b border-white/5`}
    >
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -top-40 -left-20 h-96 w-96 rounded-full bg-indigo-500/30 blur-[120px]" />
        <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 h-[300px] w-full bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      <div className={`relative z-20 ${contentClassName}`}>
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display mt-8 text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="mx-auto mt-8 max-w-3xl text-xl md:text-2xl text-slate-400 leading-relaxed font-normal"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.section>
  );
}
