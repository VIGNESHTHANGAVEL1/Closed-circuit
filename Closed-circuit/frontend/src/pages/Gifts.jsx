import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Gift,
  Lock,
  Sparkles,
  Heart,
  Users,
  GraduationCap,
  Home,
  Star,
  Shield,
  Bell,
  EyeOff,
  Camera,
  ArrowRight,
  TreePine,
  AlertTriangle,
  Album,
} from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import MediaPlayer from '../components/MediaPlayer';
import { visuals } from '../data/visuals';
import { getFamilyVideoUrl } from '../lib/spaces';
import {
  familyIntro,
  stayConnected,
  generations,
  shareLife,
  familyEvents,
  familyTree,
  emergency,
  preserveMemories,
  privacyFirst,
  whyFamilies,
  familyConnected,
} from '../data/familiesContent';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay } }),
};

function ChipGrid({ items }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-lg font-semibold text-slate-300 transition hover:border-indigo-500/40 hover:bg-indigo-500/10"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function SectionDivider({ label }) {
  return (
    <div className="relative border-y border-white/10 bg-[#0a0f1a]/80 py-6">
      <div className="page-container flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        <span className="text-lg font-bold uppercase tracking-[0.35em] text-indigo-400">{label}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
      </div>
    </div>
  );
}

export default function Gifts() {
  const giftOccasions = [
    { label: 'Sibling birthday', icon: Heart },
    { label: 'Children birthday', icon: Star },
    { label: 'Friend or relative birthday', icon: Users },
    { label: "Friend's child's birthday", icon: GraduationCap },
    { label: 'Marriage gift', icon: Home },
    { label: 'Wedding anniversary gift', icon: Gift },
  ];

  const features = [
    { text: 'Private access with OTP-based login.', icon: Lock },
    { text: 'Post control with admin approval and SMS notifications.', icon: Bell },
    { text: 'Private management to control who sees each post.', icon: EyeOff },
    { text: 'Event management for family celebrations and gatherings.', icon: Gift },
    { text: 'Album management with photo and video sharing.', icon: Camera },
    { text: 'Complete privacy with no external sharing.', icon: Shield },
    { text: 'No advertisements, no external posts, no algorithm-based feeds.', icon: Sparkles },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1 — Families.docx content (complete, in document order)
          ══════════════════════════════════════════════════════════════════════ */}

      <Hero
        eyebrow="Families"
        title="Because Family Deserves a Private Space."
        subtitle="In today's world, families are scattered across cities, countries, and time zones. Staying connected shouldn't mean sharing your precious moments with strangers. Closed Circuit gives your family a secure, private place to communicate, celebrate, organize, and preserve memories — without ads, without unwanted audiences, and without compromising privacy."
        compact
      />

      {/* Your Family. Your Space. Your Rules. */}
      <section className="section-y-sm relative border-b border-white/5 bg-[#0f172a]/40">
        <div className="page-container text-center max-w-3xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{familyIntro.title}</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">{familyIntro.text}</p>
          </motion.div>
        </div>
        {/* First CTA — after all Families.docx content */}
      <section className="section-y-sm relative border-b border-white/5 overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/30" />
        <div className="page-container relative max-w-2xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5"
            >
              Create Your Family Circle
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
      </section>
      

      {/* Stay Connected, No Matter the Distance */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container grid gap-5 lg:grid-cols-2 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">{stayConnected.title}</h2>
            <p className="mt-3 text-lg text-slate-400">{stayConnected.text}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {stayConnected.items.map((item) => (
                <div key={item.text} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-lg font-medium text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.1}>
            <Card className="overflow-hidden border border-white/10 p-0">
              <img src={visuals.familyTogether} alt="Family staying connected" className="h-[320px] w-full object-cover" loading="lazy" />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Built for Every Generation */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container">
          <h2 className="font-display text-2xl font-bold text-white md:text-3xl">{generations.title}</h2>
          <p className="mt-2 text-lg text-slate-400">Closed Circuit is designed for everyone in the family. {generations.text}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {generations.members.map((member) => (
              <Card key={member} className="border border-white/10 bg-white/[0.02] p-5 text-center hover:border-indigo-500/30 transition">
                <Users className="h-6 w-6 text-indigo-400 mx-auto mb-2" />
                <p className="font-semibold text-white">{member}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Share Life Privately */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container grid gap-5 lg:grid-cols-2 items-center">
          <Card className="border border-white/10 p-6">
            <EyeOff className="h-6 w-6 text-purple-400 mb-3" />
            <h3 className="font-display text-3xl font-bold text-white">{shareLife.title}</h3>
            <p className="mt-2 text-lg text-slate-400">{shareLife.text}</p>
          </Card>
          <Card className="overflow-hidden border border-white/10 p-0">
            <img src={visuals.familyMultiGen} alt="Multi-generational family" className="h-[260px] w-full object-cover" loading="lazy" />
          </Card>
        </div>
      </section>

      {/* Family Events Made Simple */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container">
          <Card className="border border-white/10 p-6 md:p-8">
            <Gift className="h-6 w-6 text-pink-400 mb-3" />
            <h3 className="font-display text-3xl font-bold text-white">{familyEvents.title}</h3>
            <p className="mt-2 text-lg text-slate-400 mb-4">{familyEvents.text}</p>
            <ChipGrid items={familyEvents.items} />
          </Card>
        </div>
      </section>

      {/* Create Your Family Tree Digitally */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container grid gap-5 lg:grid-cols-2">
          <Card className="border border-white/10 p-6">
            <TreePine className="h-6 w-6 text-emerald-400 mb-3" />
            <h3 className="font-display text-3xl font-bold text-white">{familyTree.title}</h3>
            <p className="mt-2 text-lg text-slate-400 mb-3">{familyTree.text}</p>
            <ChipGrid items={familyTree.items} />
          </Card>
          <Card className="overflow-hidden border border-white/10 p-0">
            <img src={visuals.familyMemories} alt="Family tree and memories" className="h-full min-h-[240px] w-full object-cover" loading="lazy" />
          </Card>
        </div>
      </section>

      {/* Emergency Communication */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container">
          <Card className="border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-6 md:p-8">
            <AlertTriangle className="h-6 w-6 text-amber-400 mb-3" />
            <h3 className="font-display text-3xl font-bold text-white">{emergency.title}</h3>
            <p className="mt-2 text-lg text-slate-400 mb-4">{emergency.text}</p>
            <ChipGrid items={emergency.items} />
          </Card>
        </div>
      </section>

      {/* Preserve Family Memories Forever */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container grid gap-5 lg:grid-cols-2 items-center">
          <Card className="border border-white/10 p-6">
            <Album className="h-6 w-6 text-indigo-400 mb-3" />
            <h3 className="font-display text-3xl font-bold text-white">{preserveMemories.title}</h3>
            <p className="mt-2 text-lg text-slate-400 mb-3">{preserveMemories.text}</p>
            <ChipGrid items={preserveMemories.items} />
          </Card>
          <Card className="overflow-hidden border border-white/10 p-0">
            <img src={visuals.familyCelebration} alt="Family memories preserved" className="h-[280px] w-full object-cover" loading="lazy" />
          </Card>
        </div>
      </section>

      {/* Privacy Comes First */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container">
          <Card className="border border-white/10 p-6 md:p-8">
            <Shield className="h-6 w-6 text-cyan-400 mb-3" />
            <h3 className="font-display text-3xl font-bold text-white">{privacyFirst.title}</h3>
            <p className="mt-2 text-lg text-slate-400 mb-4">{privacyFirst.text}</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {privacyFirst.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-lg text-slate-400">
                  <span className="text-emerald-400 mt-0.5">✅</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* Why Families Choose Closed Circuit */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl mb-5">{whyFamilies.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {whyFamilies.items.map((item) => (
              <Card key={item.text} className="border border-white/10 bg-white/[0.02] p-5 hover:border-indigo-500/30 transition">
                <span className="text-2xl">{item.emoji}</span>
                <p className="mt-3 text-lg font-semibold text-slate-300">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Imagine Your Family Connected */}
      <section className="section-y-sm relative overflow-hidden border-b border-white/5">
  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-purple-500/5" />

  <div className="page-container relative">
    <div className="mx-auto max-w-4xl text-center">
      <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
        {familyConnected.title}
      </h2>

      <p className="mt-3 text-slate-400">
        {familyConnected.tagline}
      </p>

      <div className="mmt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {familyConnected.items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-indigo-500/20 bg-white/5 px-5 py-3 text-lg font-medium text-blue-300 backdrop-blur transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-blue-200"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Join Thousands of Families */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container text-center max-w-2xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Join Thousands of Families Building Stronger Connections
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Closed Circuit isn&apos;t another social media platform. It&apos;s a private digital home built exclusively for the people who matter most.
            </p>
            <section className="section-y-sm relative overflow-hidden text-center">
        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/40" /> */}
        <div className="page-container relative max-w-2xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {/* <h2 className="font-display text-3xl font-bold text-white md:text-4xl">Start Your Family Circle Today</h2> */}
            <Link
              to="/contact"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-lg font-bold text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5"
            >
              Start Your Family Circle Today
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="mt-3 text-lg text-slate-400">Reconnect. Celebrate. Protect. Belong.</p>
            <p className="mt-2 text-lg text-indigo-400">Closed Circuit — Where Families Stay Together. ❤️</p>
            
          </motion.div>
        </div>
      </section>
          </motion.div>
        </div>
      </section>
       {/* Final CTA — after existing Gifts section */}
      

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2 — Existing Gifts content (unchanged, grouped together)
          ══════════════════════════════════════════════════════════════════════ */}

      {/* <SectionDivider label="Gifts" /> */}

      <Hero
        eyebrow="Gifts"
        title="A Unique Gift Idea for Every Special Occasion"
        subtitle="A modern gift for the digital world — a private platform for memories."
      />

      <section className="relative py-8 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative z-10 page-container">
          <div className="flex justify-center">
            <MediaPlayer src={getFamilyVideoUrl()} title="Families in Voice" />
          </div>
        </div>
      </section>

      <section className="section-y-sm relative border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-[200px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />

        <div className="page-container grid gap-5 lg:grid-cols-2 items-center relative z-10">
          <motion.div initial={{ x: -40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Card className="overflow-hidden p-0 border border-white/10 relative z-10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/20 to-transparent z-10 pointer-events-none" />
              <img src={visuals.gift} alt="Thoughtful gift" className="h-[480px] w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
              <div className="absolute bottom-0 left-0 right-0 z-20 p-10">
                <p className="text-2xl font-display font-bold text-white tracking-tight">A Gift That Lasts Forever</p>
                <p className="mt-3 text-slate-400 leading-relaxed text-lg max-w-xs">A lasting digital home for memories, messages, and shared moments.</p>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ x: 40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="grid gap-6">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Gift className="h-7 w-7" />
                </div>
                <h2 className="font-display text-4xl font-bold text-white tracking-tight">Perfect For</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {giftOccasions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: idx * 0.07 }}
                      className="flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.04] border border-white/10 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all duration-300 group cursor-default shadow-lg"
                    >
                      <Icon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">{item.label}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <Card className="p-8 border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent hover:border-purple-500/30 transition-colors shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-[200px] font-black text-purple-500/5 pointer-events-none select-none leading-none">✦</div>
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400 border border-purple-500/30">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h2 className="font-display text-3xl font-bold text-white">A Truly Unique Gift</h2>
              </div>
              <p className="text-lg text-slate-400 leading-relaxed relative z-10">
                A different and special gift for 2026 — a prestigious and memorable digital space for your loved ones.
                It is like your own Instagram-style app, but only for you and your family.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="section-y-sm relative bg-[#0f172a]/40 overflow-hidden border-b border-white/5">
        <div className="page-container grid items-center gap-5 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white tracking-tight">Main Features</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-all shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 leading-snug">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
            <p className="mt-5 pt-6 border-t border-white/10 text-lg text-slate-400 leading-relaxed">
              Your memories will never disappear. Your family moments stay safe forever across web, Android, and iPhone access.
            </p>
          </div>
          <Card className="overflow-hidden p-0 border border-white/10 group h-full shadow-2xl">
            <img src={visuals.celebration} alt="Family celebration" className="h-full min-h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
          </Card>
        </div>
      </section>
    </motion.div>
  );
}
