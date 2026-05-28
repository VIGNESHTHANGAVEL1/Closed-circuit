import { motion } from 'framer-motion';
import { ArrowRight, Bell, Calendar, CheckCircle, Globe, Image as ImageIcon, Lock, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import heroVisual from '../assets/generated_1.png';
import shieldVisual from '../assets/generated_2.png';
import communityVisual from '../assets/generated_2.png';
import albumVisual from '../assets/generated_3.png';
import heroPhoto from '../assets/generated_3.png';

export default function Home() {
  const occasions = [
    'Sibling Birthday',
    'Children Birthday',
    'Friend or Relative Birthday',
    "Friend's Kid Birthday",
    'Marriage Gift',
    'Wedding Anniversary Gift',
  ];

  const keyFeatures = [
    {
      title: 'Private and Secure',
      description: 'OTP based login. Only invited friends and relatives can join. No outside access.',
      icon: Shield,
    },
    {
      title: 'Post Approval System',
      description: 'Posts need approval before publishing. SMS notification for submissions and approvals.',
      icon: CheckCircle,
    },
    {
      title: 'Family and Group Sharing',
      description: 'Create private family groups, friends groups, and event groups with precise visibility.',
      icon: Users,
    },
    {
      title: 'Albums for Your Memories',
      description: 'Create albums for birthdays, weddings, trips, and celebrations with photos and videos.',
      icon: ImageIcon,
    },
    {
      title: 'Event Management',
      description: 'Create and manage events for birthdays, weddings, and gatherings with group access.',
      icon: Calendar,
    },
    {
      title: 'No Ads. No Noise.',
      description: 'No advertisements, no unknown posts, no algorithms, and no distractions.',
      icon: Bell,
    },
  ];

  const dataOwnership = [
    'No external sharing',
    'No public access',
    'No data selling',
    'Your memories stay in your own digital space - forever.',
  ];

  const availability = [
    { label: 'Web Platform', icon: Globe },
    { label: 'Android App', icon: ImageIcon },
    { label: 'iPhone App', icon: Lock },
  ];

  const giftQualities = ['Unique', 'Private', 'Modern', 'Meaningful'];
  const whyPoints = [
    'Built on Privacy: member data, posts, albums, and events remain private.',
    'Confidential by Design: conversations and media stay inside approved circles.',
    'Secure by Technology: protected infrastructure and data storage.',
    'Controlled Member Access: approval-based signup for trusted access.',
    'Powerful Access Control: role-based permissions for administrators, moderators, and members.',
    'Content Moderation for Quality: admin approval before content becomes visible.',
    'Complete Data Protection: user information is never exposed or sold.',
    'Structured Group Management: organize by families, departments, classes, or teams.',
    'Private Sharing Only: no public feeds or external sharing.',
    'Events Made Private: manage events for specific groups.',
    'Albums for Your Memories: secure albums assigned to groups or events.',
    'Clear Content Ownership: members retain ownership of their content.',
    'No External Feeds: the platform is fully self-contained.',
    'No Advertisements: distraction-free community experience.',
    'Dedicated Private Infrastructure: each community runs on its own VPS.',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <section className="relative overflow-hidden bg-aurora">
        <div className="absolute inset-0 section-grid opacity-80" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-28 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              Closed Circuit
            </span>
            <h1 className="font-display mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
              Your Memories.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Your People.
              </span><br/>
              Closed Circuit.
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">
              A unique digital gift for every special occasion. Give a modern digital gift for 2026 - a
              private platform that keeps memories safe forever.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {occasions.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 backdrop-blur-md shadow-lg"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="group relative inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.3)] transition hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:-translate-y-0.5"
              >
                Create Your Private Memory Platform
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/10 backdrop-blur-lg"
              >
                Explore Features
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-indigo-500/30 blur-[100px]" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/30 blur-[100px]" />
            <div className="glass-panel relative rounded-3xl p-4 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
              <img src={heroVisual} alt="Closed Circuit platform overview" className="w-full rounded-2xl border border-white/10" />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
            </div>
            <div className="absolute -bottom-10 -left-10 hidden w-48 rounded-3xl border border-white/10 bg-[#0f172a]/80 p-3 shadow-2xl backdrop-blur-xl lg:block transform hover:-translate-y-2 transition-transform duration-500">
              <img src={heroPhoto} alt="Family memories" className="rounded-2xl" />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32">
        <div className="absolute inset-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-3xl blur-2xl" />
            <img src={communityVisual} alt="Private community groups" className="relative rounded-3xl shadow-[0_0_40px_rgba(168,85,247,0.2)] border border-white/10" />
          </motion.div>
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400">
              Your Own Private Social Media
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold text-white md:text-5xl leading-tight">
              Create your own <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">private platform.</span>
            </h2>
            <p className="mt-6 text-xl text-slate-400 leading-relaxed">
              It works like your personal Instagram - but only for you, your family, and your close friends.
              No strangers. No public posts. Just your memories and your people.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {keyFeatures.slice(0, 4).map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] group">
                    <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 bg-slate-900/50">
        <div className="absolute inset-0 section-grid opacity-30" />
        <div className="relative mx-auto grid max-w-7xl items-start gap-16 px-6 lg:grid-cols-2">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              Why Our Product Is For You
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold text-white md:text-5xl leading-tight">
              A Secure, Private, Fully Controlled <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Digital Environment</span>
            </h2>
            <p className="mt-6 text-xl text-slate-400 leading-relaxed">
              Closed Circuit solves the privacy challenge of open social networks by creating a
              trusted digital space where communication and memories remain inside approved circles.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {whyPoints.slice(0, 10).map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/5 bg-white/[0.03] px-5 py-4 text-sm text-slate-300 hover:bg-white/[0.05] transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mb-3" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid gap-8"
          >
            <Card className="overflow-hidden p-0 border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10" />
              <img
                src={shieldVisual}
                alt="Security and privacy"
                className="h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Card>
            <Card className="p-8 border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent">
              <div className="grid gap-4 sm:grid-cols-2">
                {whyPoints.slice(10).map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 text-sm text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mb-2" />
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute -right-1/4 top-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl font-bold text-white md:text-5xl leading-tight">
              Key Features,<br/> Clearly Controlled
            </h2>
            <p className="mt-6 text-xl text-slate-400 leading-relaxed">
              Closed Circuit gives you complete control over what appears, who sees it, and how your memories
              are organized.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {keyFeatures.slice(4).map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="p-6 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all group">
                    <Icon className="h-8 w-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <h3 className="mt-5 text-lg font-bold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid gap-6"
          >
            <Card className="p-10 border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Lock className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Your Data Is Truly Yours</h3>
                </div>
                <ul className="mt-8 space-y-4 text-base text-slate-300 font-medium">
                  {dataOwnership.map((item) => (
                    <li key={item} className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                      <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 bg-slate-900/40">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
            <img src={albumVisual} alt="Albums for memories" className="relative rounded-3xl shadow-2xl border border-white/10 object-cover w-full h-[500px]" />
          </motion.div>
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-pink-400">
              Personal Prestige Platform
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold text-white md:text-5xl leading-tight">
              A private platform with <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">your name.</span>
            </h2>
            <p className="mt-6 text-xl text-slate-400 leading-relaxed">
              A place where your family memories live forever - a prestigious digital gift for your loved ones.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {availability.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="p-6 text-center border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:-translate-y-2 transition-all duration-300">
                    <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-orange-500/20 text-pink-400 mb-4">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-200">{item.label}</p>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[600px] bg-indigo-500/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative mx-auto max-w-4xl px-6">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl font-bold md:text-7xl text-white"
          >
            Give the Gift of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Memories</span>
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mx-auto mt-8 max-w-2xl text-xl text-slate-400 leading-relaxed"
          >
            Not just a gift. A private digital home for memories - unique, private, modern, and meaningful.
          </motion.p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {giftQualities.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-slate-300 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-6">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:-translate-y-1"
            >
              Create Your Private Memory Platform Today
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/gifts"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white transition hover:-translate-y-1 hover:bg-white/10 backdrop-blur-lg"
            >
              View Gift Details
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
