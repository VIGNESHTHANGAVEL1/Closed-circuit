import { motion } from 'framer-motion';
import { Briefcase, Building2, GraduationCap, HeartPulse, Home, Landmark, ShieldCheck, Users } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';

export default function UseCases() {
  const useCases = [
    {
      title: 'Families & Friends',
      description:
        'Create a private digital space for family and close friends to share memories, organize events, and communicate securely.',
      icon: Users,
    },
    {
      title: 'Gated Communities',
      description:
        'Residents receive announcements, participate in discussions, and access notices in a members-only space.',
      icon: Home,
    },
    {
      title: 'Golden Villages / Senior Communities',
      description:
        'Support senior living communities with simple, secure digital communication for residents and caregivers.',
      icon: HeartPulse,
    },
    {
      title: 'Schools',
      description:
        'Administrators, teachers, students, and parents stay connected with controlled announcements and albums.',
      icon: GraduationCap,
    },
    {
      title: 'Colleges & Universities',
      description:
        'Create department-wise or batch-wise communities for updates, events, and alumni engagement.',
      icon: Landmark,
    },
    {
      title: 'Companies & Organizations',
      description:
        'Deploy as an internal communication and engagement platform with strict access control.',
      icon: Briefcase,
    },
    {
      title: 'Hospitals & Healthcare Institutions',
      description:
        'Secure internal communication for staff coordination, notices, and event updates.',
      icon: Building2,
    },
    {
      title: 'Customer Communities',
      description:
        'Build exclusive communities for customers or premium members with controlled brand-owned engagement.',
      icon: ShieldCheck,
    },
  ];

  const spotlight = [
    'Approval-only member access',
    'Structured posts, events, and albums',
    'Community-specific branding and control',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="Use Cases"
        title="Ideal for Private, Structured Communities"
        subtitle="Closed Circuit creates secure, invitation-based digital spaces for organizations and groups that value privacy and control."
      />

      <section className="relative py-32 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-400">
              Built for Real Communities
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold text-white md:text-5xl leading-tight">
              Purpose-built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">privacy-first groups.</span>
            </h2>
            <p className="mt-6 text-xl text-slate-400 leading-relaxed">
              Whether you manage a family, a school, or a professional organization, the platform adapts to your
              structure while keeping everything secure and organized.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {spotlight.map((item) => (
                <Card key={item} className="p-6 text-center border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">Benefit</span>
                  <p className="mt-3 text-sm font-semibold text-white">{item}</p>
                </Card>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid gap-8"
          >
            <Card className="p-2 border border-white/10 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img src={visuals.community} alt="Community collaboration" className="rounded-2xl relative z-10 h-[250px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
            </Card>
            <Card className="p-2 border border-white/10 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img src={visuals.celebration} alt="Community celebration" className="rounded-2xl relative z-10 h-[200px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 bg-[#0f172a]/40">
        <div className="absolute inset-0 section-grid opacity-30" />
        <div className="relative mx-auto max-w-6xl px-6 z-10">
          <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
            <Card className="p-10 border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">Key Advantage</p>
              <h2 className="font-display mt-5 text-3xl font-bold text-white leading-tight">
                Your Community. Your Privacy. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Your Digital Space.</span>
              </h2>
              <p className="mt-5 text-lg text-slate-400 leading-relaxed">
                Unlike public social networks, the platform ensures complete control, structured group management,
                approval-based membership, and privacy-focused communication.
              </p>
              <div className="mt-8 grid gap-4">
                {spotlight.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] px-5 py-4 text-sm text-slate-300 font-medium hover:bg-white/[0.05] transition-colors"
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="overflow-hidden p-0 border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10 pointer-events-none opacity-60" />
              <img
                src={visuals.community}
                alt="Private community collaboration"
                className="h-[500px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 mt-10">
            {useCases.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group hover:-translate-y-1 hover:border-indigo-500/30">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-base text-slate-400 leading-relaxed">{item.description}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-center">
            <Card className="p-10 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 h-full flex flex-col justify-center relative overflow-hidden">
               <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <h3 className="font-display text-3xl font-bold text-white">A Platform That Scales With You</h3>
                <p className="mt-5 text-lg text-slate-400 leading-relaxed">
                  Build multiple communities, keep data isolated, and maintain a consistent branded experience for every
                  group you manage.
                </p>
              </div>
            </Card>
            <Card className="overflow-hidden p-0 border border-white/10 group h-full">
              <img src={visuals.workspace} alt="Modern workspace collaboration" className="h-full min-h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            </Card>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
