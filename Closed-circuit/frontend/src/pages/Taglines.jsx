import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Crown,
  Globe,
  Users,
  EyeOff,
  Ban,
  UserCircle,
  Layers,
  KeyRound,
  Bell,
  Settings,
  Infinity,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { heroTaglines, coreValues, taglineCategories, platformTaglines } from '../data/taglinesContent';

const iconMap = {
  Shield, Lock, Crown, Globe, Users, EyeOff, Ban, UserCircle,
  Layers, KeyRound, Bell, Settings, Infinity, MessageSquare, FileCheck,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay } }),
};

export default function Taglines() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      {/* ── KEEP EXISTING INTRO — unchanged ── */}
      <Hero
        eyebrow="Family Platform"
        title="Luxurious redefined with Closed Circuit."
        subtitle="Many families begin with messaging groups to stay connected, but as communities grow, they discover that chat apps are not designed to preserve memories, manage large family networks, or create a lasting digital home."
        gradient="from-[#020617] via-[#0f172a] to-[#030712]"
        contentClassName="page-container py-6 md:py-8 text-center"
      />

      {/* ── NEW CONTENT from taglines.docx ── */}

      {/* Top hero taglines */}
      <section className="section-y-sm relative border-b border-white/5 bg-[#020617]">
        <div className="page-container text-center">
          <p className="text-lg font-bold uppercase tracking-[0.3em] text-indigo-400 mb-5">
            Closed Circuit — The Private, Secure, and Fully Controlled Digital Platform for Modern Communities.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {heroTaglines.map((line, idx) => (
              <motion.div
                key={line}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.06}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 px-6 py-5 transition hover:border-indigo-500/30 hover:-translate-y-0.5"
              >
                <p className="font-display text-lg font-bold text-white md:text-xl leading-snug">{line}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core values chips */}
      <section className="section-y-sm relative border-b border-white/5 bg-[#030712]">
  <div className="page-container">
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {coreValues.map((value) => (
        <span
          key={value}
          className="flex items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm font-bold uppercase tracking-wider text-indigo-300 whitespace-nowrap"
        >
          {value}
        </span>
      ))}
    </div>
  </div>
</section>

      {/* Platform taglines strip */}
      {/* <section className="section-y-sm relative border-b border-white/5 bg-[#0f172a]/40">
        <div className="page-container">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {platformTaglines.map((line, idx) => (
              <motion.p
                key={line}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx * 0.04}
                className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm font-medium text-slate-400 text-center hover:text-slate-300 hover:border-white/10 transition"
              >
                {line}
              </motion.p>
            ))}
          </div>
        </div>
      </section> */}

      {/* Category glass cards */}
      <section className="section-y-sm relative bg-[#030712]">
        <div className="absolute inset-0 section-grid opacity-20 pointer-events-none" />
        <div className="page-container relative z-10">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {taglineCategories.map((category, idx) => {
              const Icon = iconMap[category.icon] || Shield;
              return (
                <motion.div
                  key={category.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  custom={idx * 0.03}
                  whileHover={{ y: -6 }}
                >
                  <Card className="group relative h-full min-h-[260px] overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-6 shadow-xl transition hover:border-indigo-500/30">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-80" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-50" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-2.5 text-indigo-300 transition group-hover:scale-110 group-hover:bg-indigo-500/20">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display text-lg font-bold text-white">{category.title}</h3>
                      </div>
                      <ul className="space-y-2.5 flex-1">
                        {category.taglines.map((tagline) => (
                          <li key={tagline} className="flex items-start gap-2 text-sm text-white leading-snug group-hover:text-slate-300 transition">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.8)]" />
                            {tagline}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
