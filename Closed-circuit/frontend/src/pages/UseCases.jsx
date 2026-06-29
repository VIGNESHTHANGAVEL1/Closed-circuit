import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Megaphone,
  MessageSquare,
  ShieldCheck,
  Users,
  Vote,
  Camera,
  Crown,
  UserCheck,
} from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';
import {
  companiesHero,
  whyClosedCircuit,
  privateNetwork,
  smartGroups,
  announcements,
  events,
  photos,
  documents,
  polls,
  userRoles,
  orgTypes,
  onePlatform,
  closingHighlight,
} from '../data/companiesContent';
import {
  companiesCTA,
} from '../data/companiesContent';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay } }),
};

const roleIcons = { 'Super Admin': Crown, Admin: ShieldCheck, Users: UserCheck };

function ChipGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item) => (
        <span
          key={item}
          className="flex min-h-[56px] items-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-base md:text-lg font-semibold text-slate-300 backdrop-blur-sm transition hover:border-indigo-500/40 hover:bg-indigo-500/10"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ImageBlock({ src, alt, className = 'h-[280px]' }) {
  return (
    <Card className="group overflow-hidden border border-white/10 p-0 shadow-xl">
      <img
        src={src}
        alt={alt}
        className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${className}`}
        loading="lazy"
      />
    </Card>
  );
}

export default function UseCases() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow={companiesHero.eyebrow}
        title={companiesHero.title}
        subtitle={companiesHero.subtitle}
        compact
      />

      {/* Why Closed Circuit — statistics-style cards */}
      <section className="section-y-sm relative border-b border-white/5 bg-[#030712]">
        <div className="page-container">
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-lg font-bold uppercase tracking-[0.3em] text-indigo-400">
            Why Closed Circuit?
          </motion.p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyClosedCircuit.map((item, idx) => (
              <motion.div key={item.title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx * 0.05}>
                <Card className="h-full border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent p-5 transition hover:border-indigo-500/30 hover:-translate-y-1">
                  <h3 className="font-display text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-lg leading-relaxed text-slate-400">{item.text}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Private Company Network */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container grid items-center gap-5 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-lg font-bold uppercase tracking-[0.3em] text-purple-400">Private Network</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-white md:text-4xl">{privateNetwork.title}</h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-400">{privateNetwork.text}</p>
            <p className="mt-3 text-lg text-slate-500">
              Unlike public social platforms or consumer messaging apps, Closed Circuit gives your organization complete control over who can join, what they can access, and how information is shared.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.1}>
            <ImageBlock src={visuals.businessEnterprise} alt="Private enterprise network" className="h-[320px]" />
          </motion.div>
        </div>
      </section>

      {/* Smart Group Communication */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container">
          <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.1fr]">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-400 border border-indigo-500/30">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="font-display text-lg font-bold text-white md:text-3xl">{smartGroups.title}</h2>
              </div>
              <p className="text-lg text-slate-400 leading-relaxed">{smartGroups.text}</p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.08}>
              <ChipGrid items={smartGroups.groups} />
            </motion.div>
          </div>
          <div className="mt-5">
            <ImageBlock src={visuals.businessCollaboration} alt="Team collaboration" className="h-[260px]" />
          </div>
        </div>
      </section>

      {/* Announcements + Events — two column feature grid */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container grid gap-5 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Card className="h-full border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Megaphone className="h-6 w-6 text-indigo-400" />
                <h3 className="font-display text-3xl font-bold text-white">{announcements.title}</h3>
              </div>
              <p className="text-lg text-slate-400 mb-4">{announcements.text}</p>
              <ChipGrid items={announcements.items} />
            </Card>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.08}>
            <Card className="h-full border border-white/10 bg-white/[0.02] p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="h-6 w-6 text-purple-400" />
                <h3 className="font-display text-3xl font-bold text-white">{events.title}</h3>
              </div>
              <p className="text-lg text-slate-400 mb-4">{events.text}</p>
              <ChipGrid items={events.items} />
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Photos + Documents — image + content blocks */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container space-y-5">
          <div className="grid items-center gap-5 lg:grid-cols-2">
            <ImageBlock src={visuals.businessTeam} alt="Office team celebration" />
            <Card className="border border-white/10 p-6">
              <Camera className="h-6 w-6 text-pink-400 mb-3" />
              <h3 className="font-display text-3xl font-bold text-white">{photos.title}</h3>
              <p className="mt-2 text-lg text-slate-400">{photos.text}</p>
              <div className="mt-4"><ChipGrid items={photos.items} /></div>
            </Card>
          </div>
          <div className="grid items-center gap-5 lg:grid-cols-2">
            <Card className="order-2 lg:order-1 border border-white/10 p-6">
              <FileText className="h-6 w-6 text-cyan-400 mb-3" />
              <h3 className="font-display text-3xl font-bold text-white">{documents.title}</h3>
              <p className="mt-2 text-lg text-slate-400">{documents.text}</p>
              <div className="mt-4"><ChipGrid items={documents.items} /></div>
            </Card>
            <div className="order-1 lg:order-2">
              <ImageBlock src={visuals.businessOffice} alt="Professional workspace" />
            </div>
          </div>
        </div>
      </section>

      {/* Polls & Feedback */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container">
          <Card className="border border-white/10 bg-gradient-to-br from-purple-500/10 via-white/[0.02] to-indigo-500/10 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="md:max-w-md">
                <Vote className="h-7 w-7 text-purple-400 mb-3" />
                <h3 className="font-display text-3xl font-bold text-white">{polls.title}</h3>
                <p className="mt-2 text-lg text-slate-400">{polls.text}</p>
              </div>
              <div className="flex-1"><ChipGrid items={polls.items} /></div>
            </div>
          </Card>
        </div>
      </section>

      {/* User Roles — timeline-style cards */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container">
          <p className="text-lg font-bold uppercase tracking-[0.3em] text-indigo-400 mb-2">Access Control</p>
          <h2 className="font-display text-3xl font-bold text-white mb-5">Simple Yet Powerful Access Control</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {userRoles.map((role, idx) => {
              const Icon = roleIcons[role.role] || Users;
              return (
                <motion.div key={role.role} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={idx * 0.06}>
                  <Card className="h-full border border-white/10 p-6 hover:border-indigo-500/30 transition">
                    <div className="rounded-xl bg-indigo-500/10 p-3 w-fit text-indigo-400 mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-white">{role.role}</h3>
                    <ul className="mt-4 space-y-2">
                      {role.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built for Every Organization */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container grid gap-5 lg:grid-cols-[1fr_1fr]">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-6 w-6 text-indigo-400" />
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">Built for Every Organization</h2>
            </div>
            <p className="text-lg text-slate-400 mb-4">
              Whether you&apos;re a startup, SME, enterprise, educational institution, hospital, manufacturing company, or non-profit — Closed Circuit provides one secure space for all your communication.
            </p>
            <ChipGrid items={orgTypes} />
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.1}>
            <ImageBlock src={visuals.businessMeeting} alt="Business meeting" className="h-full min-h-[300px]" />
          </motion.div>
        </div>
      </section>

      {/* Why Organizations Choose + One Platform */}
      <section className="section-y-sm relative bg-[#0f172a]/40 border-b border-white/5">
        <div className="page-container grid gap-5 lg:grid-cols-2">
          <Card className="border border-white/10 p-6 bg-gradient-to-br from-indigo-500/5 to-transparent">
            <Briefcase className="h-6 w-6 text-indigo-400 mb-3" />
            <h3 className="font-display text-3xl font-bold text-white">Why Organizations Choose Closed Circuit</h3>
            <div className="mt-4 grid gap-3">
              {whyClosedCircuit.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3">
                  <p className="text-lg font-semibold text-white">{item.title}</p>
                  <p className="text-xl text-slate-400 mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card className="border border-white/10 p-6 flex flex-col justify-center">
            <MessageSquare className="h-6 w-6 text-purple-400 mb-3" />
            <h3 className="font-display text-2xl font-bold text-white">{onePlatform.title}</h3>
            <p className="mt-3 text-lg leading-relaxed text-slate-400">{onePlatform.text}</p>
            <div className="mt-5">
              <ImageBlock src={visuals.businessEngagement} alt="Customer engagement" className="h-[180px]" />
            </div>
          </Card>
        </div>
      </section>

      {/* Closing highlight */}
      <section className="section-y-sm relative border-b border-white/5">
        <div className="page-container">
          <Card className="border border-white/10 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-8 text-center">
            <h2 className="font-display text-lg font-bold text-white md:text-4xl">{closingHighlight.title}</h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-slate-400">{closingHighlight.text}</p>
          </Card>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="section-y-sm relative overflow-hidden">
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/40" />

  <div className="page-container relative text-center">
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
        {companiesCTA.title}
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-slate-400">
        {companiesCTA.text}
      </p>

      <Link
        to="/contact"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-lg font-bold text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
      >
        {companiesCTA.button}
        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </Link>
    </motion.div>
  </div>
</section>
    </motion.div>
  );
}
