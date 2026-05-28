import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, BellOff, FolderKanban, Globe2, HardDrive } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';

const marqueeItems = [
  'Messages get lost in chat',
  'Organize memories properly',
  'Less noise, more meaning',
  'One private family space',
  'Admin-approved access',
  'Dedicated secure infrastructure',
];

const reasons = [
  {
    number: '01',
    title: 'Messages Get Lost in Chat',
    description:
      'In messaging apps like WhatsApp, conversations move quickly. Important photos, videos, and announcements get buried under hundreds of messages and forwards. A private family platform keeps posts organized and easy to find anytime.',
    icon: FolderKanban,
  },
  {
    number: '02',
    title: 'No Proper Organization',
    description:
      'Messaging apps are designed for conversation, not memory management. There is no clean way to organize family events, photo albums, and important announcements. A family platform keeps everything structured through albums, posts, and events.',
    icon: FolderKanban,
  },
  {
    number: '03',
    title: 'Too Many Notifications',
    description:
      'Large family groups can become overwhelming. Constant notifications, forwards, and unrelated messages make it difficult to focus on meaningful updates. A private platform provides clean, focused communication without the noise.',
    icon: BellOff,
  },
  {
    number: '04',
    title: 'Difficult to Manage Large Families',
    description:
      'As families grow across cities and countries, multiple chat groups get created for cousins, weddings, elders, and festivals. That creates confusion and fragmentation. A private platform brings the entire family into one organized digital space.',
    icon: Globe2,
  },
  {
    number: '05',
    title: 'No Member Approval System',
    description:
      'Anyone added to a messaging group can immediately access messages and media. There is no proper verification or approval workflow. A family platform allows admin approval and controlled member access.',
    icon: ShieldCheck,
  },
  {
    number: '06',
    title: 'Family Memories Deserve Better Storage',
    description:
      'Birthdays, weddings, festivals, and childhood moments are priceless. These memories should not disappear into a long chat history. A private platform preserves and organizes them in a more permanent, meaningful way.',
    icon: HardDrive,
  },
  {
    number: '07',
    title: 'No Privacy from External Platforms',
    description:
      'When content is shared on public social media platforms such as Facebook, Instagram, and TikTok, it exists inside a public ecosystem surrounded by strangers. A family platform creates a completely private environment for personal sharing.',
    icon: ShieldCheck,
  },
  {
    number: '08',
    title: 'No Advertisements or Distractions',
    description:
      'Public platforms mix family photos and updates with advertisements and unrelated content. A private family platform creates an ad-free, distraction-free digital experience.',
    icon: BellOff,
  },
  {
    number: '09',
    title: 'Full Control Over Your Family Community',
    description:
      'On public platforms, companies control the infrastructure and algorithms. On a private platform, your family controls membership, content, and the overall community experience.',
    icon: CheckCircle2,
  },
  {
    number: '10',
    title: 'Dedicated Secure Infrastructure',
    description:
      'Your family platform runs in a dedicated VPS environment. That means your data is stored privately, your media remains secure, and only approved members can access it. Family memories stay protected and private.',
    icon: HardDrive,
  },
];

const platformBenefits = [
  'Private albums for family photos and videos',
  'Structured announcements, updates, and family events',
  'Approval-based access for trusted members only',
  'A calmer digital space without public-platform distractions',
];

const groupProblems = [
  'Important updates buried under chat activity',
  'Separate groups for cousins, elders, weddings, and festivals',
  'No real archive for family history and memories',
  'Limited control over access, structure, and privacy',
];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  }),
};

export default function Taglines() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="Family Platform"
        title="Luxurious redefined with Closed Circuit."
        subtitle="Many families begin with messaging groups to stay connected, but as communities grow, they discover that chat apps are not designed to preserve memories, manage large family networks, or create a lasting digital home."
        gradient="from-[#020617] via-[#0f172a] to-[#030712]"
        contentClassName="mx-auto max-w-6xl px-6 py-20 md:py-24 text-center"
      />

      <section className="relative overflow-hidden border-b border-white/5 bg-[#020617] py-5 md:py-6">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="flex w-max gap-4"
        >
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex min-h-[64px] min-w-[280px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-8 py-4 text-center text-[13px] font-bold uppercase tracking-[0.3em] text-slate-300 sm:min-h-[72px] sm:min-w-[340px]"
            >
              {item}
            </div>
          ))}
        </motion.div>
      </section>

      <section className="relative overflow-hidden border-b border-white/5 bg-[#030712] py-24">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.32, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -left-24 top-12 h-[520px] w-[520px] rounded-full bg-indigo-500/15 blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1.05, 1, 1.05], opacity: [0.16, 0.26, 0.16] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute -right-24 bottom-0 h-[480px] w-[480px] rounded-full bg-purple-500/12 blur-[170px]"
        />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
          >
            <Card className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-500/10 via-white/[0.04] to-purple-500/10 p-8 shadow-[0_0_60px_rgba(76,29,149,0.18)] md:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-300">Why Families Upgrade</p>
                  <h2 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
                    A messaging group is just a conversation. A private family platform is a digital home.
                  </h2>
                  <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">
                    Messaging apps help families talk, but they do not give large communities the structure, privacy,
                    and permanence needed to preserve memories and manage relationships over time. A private family
                    platform solves these problems with a secure, organized, and meaningful digital space.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Messaging Apps</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                      {groupProblems.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-rose-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-[28px] border border-white/10 bg-black/20 p-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">Private Platform</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                      {platformBenefits.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {reasons.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.number}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  custom={0.05 * idx}
                  whileHover={{ y: -10 }}
                  className={idx % 3 === 0 ? 'xl:translate-y-6' : ''}
                >
                  <Card className="group relative min-h-[320px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 shadow-2xl md:min-h-[360px] md:p-10">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/14 via-transparent to-purple-500/10 opacity-80" />
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-60" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_35%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3 text-indigo-300">
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-black tracking-[0.3em] text-white/30">{item.number}</span>
                      </div>
                      <h3 className="mt-8 font-display text-[1.85rem] font-bold leading-tight text-white md:text-[2.15rem]">
                        {item.title}
                      </h3>
                      <p className="mt-5 text-base leading-7 text-slate-300/90">{item.description}</p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0f172a]/60 py-28">
        <div className="absolute inset-0 section-grid opacity-25" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
          >
            <Card className="group relative overflow-hidden border border-white/10 p-0 shadow-2xl">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent" />
              <img
                src={visuals.familyHero}
                alt="Family memories preserved privately"
                className="h-[460px] w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 z-20 p-8">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-300">Digital Home</p>
                <h3 className="mt-3 max-w-xl font-display text-3xl font-bold text-white">
                  Your family deserves a space built for memory, trust, and continuity.
                </h3>
              </div>
            </Card>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0.12}
            className="grid gap-6"
          >
            <Card className="border border-white/10 bg-gradient-to-br from-purple-500/10 via-white/[0.02] to-transparent p-8 shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-300">Why It Matters</p>
              <h3 className="mt-4 font-display text-4xl font-bold tracking-tight text-white">
                Family memories should not disappear into scrolling chat history.
              </h3>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                Birthdays. Weddings. Festivals. Childhood moments. These are not casual updates. They are part of a
                family&apos;s long-term story and deserve better storage, stronger privacy, and easier access.
              </p>
            </Card>

            <Card className="border border-white/10 bg-gradient-to-br from-indigo-500/10 via-white/[0.02] to-transparent p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-3 text-indigo-300">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Dedicated Secure Infrastructure</h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-400">
                    With a dedicated VPS environment, family data stays private, media remains protected, and access is
                    limited to approved members only. This gives families more control and greater confidence in where
                    their digital history lives.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
