import { motion } from 'framer-motion';
import { Gift, Lock, Sparkles, Heart, Users, GraduationCap, Home, Star, Shield, Bell, EyeOff, Album, Camera } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';
// import giftsVideo from '../assets/gifts_in_voice.mp4';

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
      <Hero
        eyebrow="Gifts"
        title="A Unique Gift Idea for Every Special Occasion"
        subtitle="A modern gift for the digital world — a private platform for memories."
      />

      {/* Video section */}
      <section className="relative py-12 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative z-10 page-container">
          <div className="flex justify-center">
            <video
              src="https://lara.blr1.cdn.digitaloceanspaces.com/Closed%20Circuit/gifts_in_voice.mp4"
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-[320px] w-full max-w-[1100px] rounded-2xl object-cover shadow-2xl md:h-[380px]"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Section 1: Hero image + Occasion chips + Unique gift card */}
      <section className="section-y relative border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-purple-500/10 blur-[200px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
        
        <div className="page-container grid gap-8 lg:grid-cols-2 items-center relative z-10">
          {/* Left: Image with overlay */}
          <motion.div initial={{ x: -40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Card className="overflow-hidden p-0 border border-white/10 relative z-10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/20 to-transparent z-10 pointer-events-none" />
              <img src={visuals.gift} alt="Thoughtful gift" className="h-[480px] w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
              {/* Overlay text */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-10">
                <p className="text-2xl font-display font-bold text-white tracking-tight">A Gift That Lasts Forever</p>
                <p className="mt-3 text-slate-400 leading-relaxed text-base max-w-xs">A lasting digital home for memories, messages, and shared moments.</p>
              </div>
            </Card>
          </motion.div>

          {/* Right: Occasion chips + Unique card */}
          <motion.div initial={{ x: 40, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="grid gap-10">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <Gift className="h-7 w-7" />
                </div>
                <h2 className="font-display text-4xl font-bold text-white tracking-tight">Perfect For</h2>
              </div>

              {/* Occasion chips — creative pill layout */}
              <div className="flex flex-wrap gap-4">
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

            <Card className="p-10 border border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent hover:border-purple-500/30 transition-colors shadow-2xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-[200px] font-black text-purple-500/5 pointer-events-none select-none leading-none">✦</div>
              <div className="flex items-center gap-4 mb-6 relative z-10">
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

      {/* Section 2: Features as icon-tile grid | Image right */}
      <section className="section-y relative bg-[#0f172a]/40 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[180px] pointer-events-none" />
        <div className="page-container grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] relative z-10">
          <div>
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="font-display text-4xl font-bold text-white tracking-tight">Main Features</h2>
            </div>

            {/* Feature tiles — icon grid, not a boring list */}
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-300 group shadow-lg"
                  >
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all shrink-0 border border-indigo-500/10">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 leading-snug transition-colors">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <p className="mt-5 pt-8 border-t border-white/10 text-lg text-slate-400 leading-relaxed">
              Your memories will never disappear. Your family moments stay safe forever across web, Android, and iPhone access.
            </p>
          </div>

          <Card className="overflow-hidden p-0 border border-white/10 group h-full shadow-2xl">
            <img src={visuals.celebration} alt="Family celebration" className="h-full min-h-[500px] w-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="lazy" />
          </Card>
        </div>
      </section>
    </motion.div>
  );
}


