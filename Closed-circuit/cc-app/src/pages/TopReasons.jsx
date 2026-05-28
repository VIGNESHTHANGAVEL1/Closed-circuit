import { motion } from 'framer-motion';
import { ListChecks } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';

export default function TopReasons() {
  const reasons = [
    {
      title: 'Messages Get Lost in Chat',
      description:
        'In messaging apps, conversations move quickly and important photos, videos, and announcements get buried.',
    },
    {
      title: 'No Proper Organization',
      description:
        'Messaging apps are designed for conversations, not memory management. Events, albums, and announcements are hard to organize.',
    },
    {
      title: 'Too Many Notifications',
      description:
        'Large family groups become overwhelming with constant forwards and unrelated updates.',
    },
    {
      title: 'Difficult to Manage Large Families',
      description:
        'Multiple chat groups cause confusion as families grow across cities and countries.',
    },
    {
      title: 'No Member Approval System',
      description:
        'Anyone added to a messaging group can immediately access all content without verification.',
    },
    {
      title: 'Family Memories Deserve Better Storage',
      description:
        'Birthdays, weddings, festivals, and milestones should not disappear in long chat histories.',
    },
    {
      title: 'No Privacy from External Platforms',
      description:
        'Public platforms like Facebook, Instagram, and TikTok expose personal content to a public ecosystem.',
    },
    {
      title: 'No Advertisements or Distractions',
      description:
        'Public platforms mix family photos with ads and unrelated content.',
    },
    {
      title: 'Full Control Over Your Family Community',
      description:
        'On public platforms, companies control the infrastructure and algorithms. A private platform puts your family in control.',
    },
    {
      title: 'Dedicated Secure Infrastructure',
      description:
        'Your family platform runs in a dedicated VPS environment, keeping data private and protected.',
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="Top Reasons"
        title="10 Reasons Families Are Moving to Private Platforms"
        subtitle="A private family platform solves the challenges of messaging apps and public social networks."
      />

      {/* Section 1: Reasons editorial list left | Image column right */}
      <section className="relative py-32 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[200px] pointer-events-none" />
        
        <div className="relative z-10 mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.3fr_0.7fr] items-start">
          
          <div className="grid gap-6 sm:grid-cols-2">
            {reasons.map((reason, index) => (
              <motion.div 
                key={reason.title} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-indigo-500/30 overflow-hidden shadow-2xl transition-all duration-300"
              >
                {/* Glowing edge on hover */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
                
                {/* Giant watermark number */}
                <div className="text-[140px] leading-none font-black absolute -top-4 -right-2 text-indigo-400/20 [text-shadow:0_0_18px_rgba(99,102,241,0.16)] group-hover:text-indigo-300/30 group-hover:scale-110 transition-all duration-500 pointer-events-none select-none">
                  {index + 1}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 relative z-10 w-4/5 leading-snug tracking-tight">
                  {reason.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed relative z-10 font-medium">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid gap-8 lg:sticky lg:top-32"
          >
            <Card className="overflow-hidden p-0 border border-white/10 group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10 pointer-events-none opacity-60" />
              <img
                src={visuals.familyHero}
                alt="Family connection"
                className="h-[450px] w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
            </Card>
            <Card className="p-8 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-xl">
              <h3 className="font-display text-2xl font-bold text-white tracking-tight">Private by Default</h3>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">
                Families deserve calm, safe spaces that prioritize memories over noise, giving you full control over who sees your digital legacy.
              </p>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Call-to-action text left | Image right */}
      <section className="relative py-32 bg-[#0f172a]/40 bg-gradient-to-b from-transparent to-[#030712]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-10 border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
            <div className="position relative z-10">
               <div className="inline-flex p-5 rounded-3xl bg-indigo-500/10 text-indigo-400 mb-8 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                 <ListChecks className="h-10 w-10" />
               </div>
               <h2 className="font-display text-4xl font-bold text-white leading-tight">
                 Your Family Deserves Its Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Digital Home</span>
               </h2>
               <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                 A messaging group is just a conversation. A private family platform is a permanent digital home for your
                 family's memories, relationships, and stories.
               </p>
            </div>
          </Card>
          <Card className="overflow-hidden p-0 border border-white/10 group shadow-2xl">
            <img
              src={visuals.secure}
              alt="Protected family memories"
              className="h-[500px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
          </Card>
        </div>
      </section>
    </motion.div>
  );
}
