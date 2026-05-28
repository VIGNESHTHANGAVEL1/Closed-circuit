import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, XCircle, CheckCircle } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';

export default function DifferSocial() {
  const whatsappLimits = [
    'Messages and memories get lost in long chat histories.',
    'No proper organization for events, albums, or categories.',
    'Too many notifications and unrelated forwards.',
    'Limited privacy control with no approval system.',
    'Difficult to manage large families with multiple fragmented groups.',
  ];

  const socialLimits = [
    'Presence of strangers and public ecosystem exposure.',
    'Advertisements and distractions mixed with family posts.',
    'Privacy concerns even with platform settings.',
    'Algorithms decide what updates family members see.',
    'Not designed for private family communities or structured memories.',
  ];

  const whyPrivate = [
    'A space only for your family with approved members.',
    'Organized family memories across posts, albums, and events.',
    'Secure and controlled sharing with admin approval.',
    'Meaningful family interaction through likes and comments.',
    'A single private digital home for family stories.',
  ];

  const steps = [
    'Create your family space.',
    'Invite family members with OTP verification.',
    'Approve members before access is granted.',
    'Create groups and events for family organization.',
    'Share and preserve memories in one secure place.',
  ];

  const useCases = [
    'Wedding memories shared with family in multiple cities.',
    'Family reunions and travel updates in one place.',
    'Festival celebrations and greetings without public feeds.',
    'Childhood milestones preserved for generations.',
    'Preserving family history through photos and stories.',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="How We Differ"
        title="Why WhatsApp and Public Social Media Are Not Ideal"
        subtitle="Families need a private digital space built specifically for preserving memories and managing relationships."
      />

      {/* Section 1: Split visual limitation panels */}
      <section className="relative py-32 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-rose-500/10 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl font-bold text-white tracking-tight mb-6">The Problem with Existing Platforms</h2>
            <p className="text-lg text-slate-400 leading-relaxed">Neither messaging apps nor social networks were built with your family's privacy in mind.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* WhatsApp Limitations */}
            <Card className="p-8 border border-rose-500/20 bg-gradient-to-br from-rose-500/5 to-transparent relative overflow-hidden group hover:border-rose-500/40 transition-all shadow-xl">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">Limitations of WhatsApp Groups</h2>
              </div>
              <div className="space-y-4">
                {whatsappLimits.map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/item hover:bg-rose-500/[0.05] hover:border-rose-500/20 transition-all"
                  >
                    <XCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-slate-400 group-hover/item:text-slate-300 transition-colors leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Social Media Limitations */}
            <Card className="p-8 border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent relative overflow-hidden group hover:border-orange-500/40 transition-all shadow-xl">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-orange-500/20 rounded-2xl text-orange-400 border border-orange-500/30">
                  <AlertTriangle className="h-7 w-7" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">Limitations of Public Social Media</h2>
              </div>
              <div className="space-y-4">
                {socialLimits.map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 group/item hover:bg-orange-500/[0.05] hover:border-orange-500/20 transition-all"
                  >
                    <XCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-slate-400 group-hover/item:text-slate-300 transition-colors leading-relaxed">{item}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 2: Why Private banner with image collage */}
      <section className="relative py-32 bg-[#0f172a]/40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 grid gap-16 lg:grid-cols-2 items-center relative z-10">
          {/* Left: visual image panel */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="overflow-hidden p-0 border border-white/10 group col-span-2">
              <img src={visuals.message} alt="Messaging overload" className="h-[280px] w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
            </Card>
            <Card className="overflow-hidden p-0 border border-white/10 group">
              <img src={visuals.community} alt="Private community" className="h-[200px] w-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
            </Card>
            <Card className="overflow-hidden p-0 border border-white/10 group">
              <img src={visuals.secure} alt="Private platform security" className="h-[200px] w-full object-cover transition-transform duration-1000 group-hover:scale-110" loading="lazy" />
            </Card>
          </div>

          {/* Right: Why Private benefits */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h2 className="font-display text-4xl font-bold text-white tracking-tight">Why Families Need a Private Digital Space</h2>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed mb-10">
              Birthdays, weddings, festivals, reunions, and milestones are meant to be shared with loved ones — not with strangers or public audiences.
            </p>
            <div className="space-y-4">
              {whyPrivate.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-indigo-500/[0.05] border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40 transition-all group"
                >
                  <CheckCircle className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-white leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: How it Works (numbered steps) + Use Cases mosaic */}
      <section className="relative py-32 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 blur-[200px] rounded-full pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* How it works */}
            <div>
              <h3 className="font-display text-3xl font-bold text-white tracking-tight mb-10">How a Private Family Platform Works</h3>
              <ol className="space-y-5">
                {steps.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    className="flex items-center gap-6 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-lg font-black border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
                      {index + 1}
                    </span>
                    <span className="text-base font-semibold text-slate-300">{item}</span>
                  </motion.li>
                ))}
              </ol>
            </div>

            {/* Use Cases as visual mosaic */}
            <div>
              <h3 className="font-display text-3xl font-bold text-white tracking-tight mb-10">Family Use Cases</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {useCases.map((item, idx) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.07 }}
                    className={`p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-indigo-500/[0.07] hover:border-indigo-500/30 transition-all group shadow-lg ${idx === 0 ? 'sm:col-span-2' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-1 w-2 h-2 rounded-full bg-indigo-400 shrink-0 shadow-[0_0_8px_rgba(129,140,248,0.8)] group-hover:scale-150 transition-transform" />
                      <p className="text-sm font-semibold text-slate-300 group-hover:text-white leading-relaxed transition-colors">{item}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="mt-8 text-base text-slate-500 leading-relaxed">
                Your family memories are personal, meaningful, and irreplaceable. They deserve a space that is private, organized, and designed specifically for your loved ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Immersive story section */}
      <section className="relative py-32 bg-gradient-to-b from-[#0f172a]/40 to-[#030712]">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 items-center">
          <Card className="overflow-hidden p-0 border border-white/10 group h-full shadow-2xl">
            <img src={visuals.familyHero} alt="Family stories" className="h-full min-h-[450px] w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
          </Card>
          <Card className="p-10 border border-white/10 bg-white/[0.02] h-full flex flex-col justify-center">
            <h3 className="font-display text-4xl font-bold text-white tracking-tight">A Story Every Family Understands</h3>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Every family has thousands of memories — old photographs stored in albums, stories told by grandparents, and moments captured during weddings, festivals, and celebrations. In the past, these memories lived in photo albums and family gatherings. Today, they get scattered across chats, social media feeds, and multiple apps. Over time, many of those memories are lost.
            </p>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              A private family platform brings them all together again — in one safe digital home for your family.
            </p>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}
