import { motion } from 'framer-motion';
import Hero from '../components/Hero';

const socialPlatforms = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@closedcircuit2026',
    url: 'https://instagram.com/closedcircuit2026',
    description: 'Follow us on Instagram for product updates, behind-the-scenes moments, and privacy tips.',
    color: 'from-pink-500 via-rose-500 to-orange-400',
    borderColor: 'border-pink-500/30',
    glowColor: 'rgba(236,72,153,0.25)',
    hoverBorder: 'hover:border-pink-500/50',
    badgeColor: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'urprivacy',
    url: 'https://facebook.com/urprivacy',
    description: 'Connect with us on Facebook. Stay updated with news, articles, and community discussions.',
    color: 'from-blue-600 to-blue-400',
    borderColor: 'border-blue-500/30',
    glowColor: 'rgba(59,130,246,0.25)',
    hoverBorder: 'hover:border-blue-500/50',
    badgeColor: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'urprivacy',
    url: 'https://linkedin.com/in/urprivacy',
    description: 'Follow our LinkedIn page for professional insights, product launches, and business networking.',
    color: 'from-sky-600 to-sky-400',
    borderColor: 'border-sky-500/30',
    glowColor: 'rgba(14,165,233,0.25)',
    hoverBorder: 'hover:border-sky-500/50',
    badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@urprivacy',
    url: 'https://www.youtube.com/@urprivacy',
    description: 'Subscribe to our YouTube channel for product demos, tutorials, and privacy education videos.',
    color: 'from-red-600 to-rose-400',
    borderColor: 'border-red-500/30',
    glowColor: 'rgba(239,68,68,0.25)',
    hoverBorder: 'hover:border-red-500/50',
    badgeColor: 'bg-red-500/10 text-red-300 border-red-500/20',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

function openSocialPopup(url) {
  const width = 960;
  const height = 700;
  const left = Math.max(0, (window.screen.width - width) / 2);
  const top = Math.max(0, (window.screen.height - height) / 2);
  window.open(
    url,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,toolbar=no,menubar=no,status=no`
  );
}

export default function SocialMedia() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#030712] text-slate-300"
    >
      <Hero
        eyebrow="Connect With Us"
        title="Follow Closed Circuit"
        subtitle="Stay connected, informed, and inspired. Find us on your favourite social platforms and be part of our growing private community."
        gradient="from-[#020617] via-[#0f172a] to-[#030712]"
        contentClassName="page-container py-8 md:py-12 text-center"
        compact
      />

      <section className="section-y-sm relative">
        <div className="absolute inset-0 section-grid opacity-20 pointer-events-none" />
        <div className="page-container relative z-10">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {socialPlatforms.map((platform, i) => (
              <motion.div
                key={platform.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -6 }}
              >
                <button
                  type="button"
                  onClick={() => openSocialPopup(platform.url)}
                  className={`group w-full text-left rounded-[24px] border ${platform.borderColor} ${platform.hoverBorder} bg-white/[0.03] p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  style={{ boxShadow: `0 0 0 0 ${platform.glowColor}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 40px ${platform.glowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${platform.color} p-3 text-white shadow-lg mb-5 transition-transform duration-300 group-hover:scale-110`}
                  >
                    {platform.icon}
                  </div>

                  {/* Name + handle */}
                  <h2 className="text-xl font-bold text-white mb-1">{platform.name}</h2>
                  <span
                    className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold mb-4 ${platform.badgeColor}`}
                  >
                    {platform.handle}
                  </span>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-slate-400 mb-5">{platform.description}</p>

                  {/* CTA */}
                  <div
                    className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${platform.color} px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}
                  >
                    <span>Visit {platform.name}</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Bottom note */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 text-center"
          >
            <p className="text-sm text-slate-400">
              <span className="text-indigo-400 font-semibold">Clicking any card</span> opens the social media page in a new popup window — your current session stays intact.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
