import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import WebinarReviewsPanel from '../components/entrepreneurshipWebinar/WebinarReviewsPanel';
import WebinarParticipationForm from '../components/entrepreneurshipWebinar/WebinarParticipationForm';

export default function LeetCodeWebinar() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        title="LeetCode Webinar"
        subtitle="Share your experience and register your attendance from our LeetCode-focused entrepreneurship session."
        contentClassName="page-container py-4 md:py-6 text-center"
        compact
      />

      <section className="relative overflow-hidden border-b border-white/5 py-6 md:py-10">
        <div className="absolute top-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="page-container relative">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-4">
            <WebinarReviewsPanel
              refreshKey={refreshKey}
              reviewsApiBase="/api/leetcode-webinar/reviews"
            />
            <WebinarParticipationForm
              submitPath="/api/leetcode-webinar/participations"
              participationBadgeLabel="LeetCode Participation"
              onSubmitted={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        </div>
      </section>
    </motion.div>
  );
}
