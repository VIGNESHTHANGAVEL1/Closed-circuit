import { motion } from 'framer-motion';
import { ShieldCheck, XCircle, CheckCircle } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';

export default function DifferFacebook() {
  const rows = [
    ['Audience', 'Your content appears on a platform used by millions of strangers', 'Only your invited family members and approved contacts'],
    ['Privacy Control', 'Privacy settings are complex and not fully controlled', 'Full control with member approval and admin moderation'],
    ['Advertisements', 'Ads appear between your family posts and photos', 'Completely ad-free private environment'],
    ['Content Ownership', 'Your data is stored and used by the platform company', 'Your family data is stored securely on your dedicated VPS server'],
    ['Algorithm Influence', 'Algorithms decide which posts you see', 'All family updates appear naturally in your feed'],
    ['Security', 'Public platforms are frequent targets for data mining and tracking', 'Closed network with secure access only for your members'],
    ['Content Organization', 'Photos and posts get lost in timelines', 'Organized albums, events, and family groups'],
    ['Community Focus', 'Designed for public social networking', 'Designed specifically for private family communities'],
    ['Member Access', 'Anyone can send requests or view depending on settings', 'Only approved members can join'],
    ['Data Control', 'Platform owns infrastructure and data policies', 'Your family controls the platform and the data'],
  ];

  const advantages = [
    'Photos, videos, and posts remain private',
    'Only approved members can access the platform',
    'Family data is not shared with advertisers or external companies',
    'Dedicated VPS infrastructure ensures full isolation',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="How We Differ"
        title="Facebook vs Your Private Family Platform"
        subtitle="Public social platforms are designed for mass networks, not private family communities."
      />

      {/* Section 1: Comparison Cards instead of Table */}
      <section className="relative py-32 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[200px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-rose-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="mb-16 text-center max-w-3xl mx-auto">
             <h2 className="font-display text-4xl font-bold text-white tracking-tight mb-6">A Clear Contrast in Values</h2>
             <p className="text-lg text-slate-400 leading-relaxed">
                Public networks prioritize reach and advertising. Closed Circuit prioritizes trust, privacy, and
                member approval. See how we protect what matters most.
             </p>
          </div>

          <div className="grid gap-6">
            {rows.map((row, idx) => (
              <motion.div 
                key={row[0]}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="grid lg:grid-cols-[1.2fr_1.5fr_1.5fr] gap-0 bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 shadow-xl"
              >
                {/* Feature Name */}
                <div className="p-6 bg-white/[0.01] flex items-center border-b lg:border-b-0 lg:border-r border-white/10">
                  <h3 className="font-display font-bold text-xl text-white tracking-tight">
                    {row[0]}
                  </h3>
                </div>
                
                {/* Public Social Media */}
                <div className="p-6 lg:p-8 flex flex-col gap-3 relative border-b lg:border-b-0 lg:border-r border-white/10 bg-rose-500/[0.02] group-hover:bg-rose-500/[0.04] transition-colors">
                  <div className="flex items-center gap-2">
                     <XCircle className="w-4 h-4 text-rose-500" />
                     <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">Public Networks</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    {row[1]}
                  </p>
                </div>

                {/* Private Platform */}
                <div className="p-6 lg:p-8 flex flex-col gap-3 relative bg-indigo-500/[0.05] group-hover:bg-indigo-500/[0.1] transition-colors">
                   <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-2 relative z-10">
                     <CheckCircle className="w-4 h-4 text-indigo-400" />
                     <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Private Platform</span>
                  </div>
                  <p className="text-white font-semibold text-base leading-relaxed relative z-10">
                    {row[2]}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Advantage text left | Image right */}
      <section className="relative py-32 bg-[#0f172a]/40">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <Card className="p-10 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-display text-3xl font-bold text-white tracking-tight">
                Key Advantage
              </h3>
            </div>
            <p className="mt-4 text-lg text-slate-400 leading-relaxed">
              Your family platform runs in a dedicated runtime environment on a private VPS server, ensuring complete
              privacy and control.
            </p>
            <ul className="mt-8 space-y-4 text-base text-slate-300 font-medium">
              {advantages.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="overflow-hidden p-0 border border-white/10 group h-full">
            <img
              src={visuals.secure}
              alt="Private platform security"
              className="h-full min-h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
          </Card>
        </div>
      </section>
    </motion.div>
  );
}
