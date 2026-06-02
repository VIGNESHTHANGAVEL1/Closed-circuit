import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  FolderLock,
  ClipboardCheck,
  Calendar,
  MessageCircle,
  Settings,
  Sparkles,
} from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import { visuals } from '../data/visuals';

const SectionRow = ({ title, description, icon: Icon, items, image, imageAlt, reverse = false }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
    <motion.div
      initial={{ x: reverse ? 30 : -30, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Icon className="h-7 w-7 text-indigo-400" />
        </div>
        <h2 className="font-display text-3xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      <p className="text-lg text-slate-400 leading-relaxed">{description}</p>
      <ul className="grid gap-4 text-base text-slate-300 sm:grid-cols-2 mt-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>

    <motion.div
      initial={{ x: reverse ? -30 : 30, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative group"
    >
      {/* Decorative background glow behind image */}
      <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <Card className="overflow-hidden p-0 border border-white/10 relative z-10 transition-transform duration-700 group-hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />
        <img
          src={image}
          alt={imageAlt}
          className="h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />
      </Card>
    </motion.div>
  </div>
);

export default function Features() {
  const sections = [
    {
      title: 'Privacy, Security & Trust',
      description:
        'Our platform operates within a dedicated server environment, ensuring community data remains isolated and protected.',
      icon: Shield,
      items: [
        'Private Network Environment with isolated data storage.',
        'Privacy protection for posts, photos, videos, and events.',
        'Confidentiality for conversations within approved members.',
        'OTP-based authentication with admin approval.',
        'Role-based access control for all roles.',
      ],
      image: visuals.secure,
      imageAlt: 'Privacy and security infrastructure',
    },
    {
      title: 'Community & Member Management',
      description:
        'Membership is approval-based to maintain a trusted and verified community of family members or organizations.',
      icon: Users,
      items: [
        'Simple OTP-based member registration.',
        'Admin approval required for every signup request.',
        'Member blocking and removal to maintain safety.',
        'Structured member roles with clear responsibilities.',
      ],
      image: visuals.community,
      imageAlt: 'Community member management',
    },
    {
      title: 'Group Organization',
      description:
        'Create group types and multiple groups to keep communication organized across family branches or teams.',
      icon: FolderLock,
      items: [
        'Group types for family branches or relationship categories.',
        'Multiple groups under each type for structured sharing.',
        'Member assignment to one or multiple groups.',
        'Group-level visibility for posts, albums, and events.',
      ],
      image: visuals.workspace,
      imageAlt: 'Group organization structure',
    },
    {
      title: 'Posts & Content Sharing',
      description:
        'Administrators and approved members can share text, rich text, images, and videos in a moderated flow.',
      icon: ClipboardCheck,
      items: [
        'Private posting with targeted sharing to selected groups.',
        'Member post requests with admin approval before visibility.',
        'Content moderation to ensure respectful sharing.',
        'SMS notifications when posts are published or approved.',
      ],
      image: visuals.message,
      imageAlt: 'Content sharing and moderation',
    },
    {
      title: 'Events, Albums & Media',
      description:
        'Create private events and albums to preserve memories and keep media organized by occasion.',
      icon: Calendar,
      items: [
        'Create private events for family gatherings or celebrations.',
        'Group-based event access and engagement.',
        'Albums for photos and videos with unlimited uploads.',
        'Event-based albums and multi-group album sharing.',
      ],
      image: visuals.celebration,
      imageAlt: 'Events and album management',
    },
    {
      title: 'Community Interaction',
      description:
        'Members can like and comment on posts, albums, and events within a controlled environment.',
      icon: MessageCircle,
      items: [
        'Likes and comments for posts, albums, images, and events.',
        'Engagement visibility for transparent community interaction.',
        'No external sharing or unwanted content imports.',
      ],
      image: visuals.familyHero,
      imageAlt: 'Community interaction and engagement',
    },
    {
      title: 'Administrative Customization',
      description:
        "Administrators can personalize the platform's logo and key visuals at any time.",
      icon: Settings,
      items: [
        'Custom logo updates through the admin dashboard.',
        'Homepage hero image customization.',
        'Signup and login page image customization.',
        'Full platform control dashboard for members and content.',
      ],
      image: visuals.contact,
      imageAlt: 'Admin customization dashboard',
    },
  ];

  const highlightCards = [
    {
      title: 'Dedicated Private Infrastructure',
      description: 'Every community runs on isolated VPS hosting with full control.',
      icon: Shield,
    },
    {
      title: 'Human-Centered Moderation',
      description: 'Admins approve members and content before it reaches the feed.',
      icon: ClipboardCheck,
    },
    {
      title: 'Designed for Real Communities',
      description: 'Families, schools, and organizations stay organized in one place.',
      icon: Users,
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="Product Features"
        title="Everything You Need for a Private Digital Community"
        subtitle="Every feature is built with privacy, control, and simplicity in mind — powered by dedicated VPS hosting for complete isolation."
      />

      {/* Highlight Summary Strip */}
      <section className="relative py-20 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#030712] opacity-50 pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Sparkles className="h-7 w-7 text-indigo-400 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
            <h2 className="font-display text-4xl font-bold text-white text-center">
              Premium Experience, End to End
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {highlightCards.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group hover:-translate-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all mb-4">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-base text-slate-400 leading-relaxed">{item.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Alternating Feature Sections */}
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/5 hidden lg:block" />
        {sections.map((section, index) => (
          <section
            key={section.title}
            className={`relative ${index % 2 === 0 ? 'bg-[#030712]' : 'bg-[#0f172a]/40'} py-28 md:py-36 overflow-hidden`}
          >
            {/* Ambient gradients */}
            <div className={`absolute top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 pointer-events-none ${index % 2 === 0 ? '-left-64 bg-indigo-500' : '-right-64 bg-purple-500'}`} />
            
            <div className="relative z-10 mx-auto max-w-7xl px-6">
              <SectionRow
                title={section.title}
                description={section.description}
                icon={section.icon}
                items={section.items}
                image={section.image}
                imageAlt={section.imageAlt}
                reverse={index % 2 !== 0}
              />
            </div>
          </section>
        ))}
      </div>
    </motion.div>
  );
}
