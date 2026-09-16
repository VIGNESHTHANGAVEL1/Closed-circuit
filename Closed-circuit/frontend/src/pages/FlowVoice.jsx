import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Hero from '../components/Hero';
import Card from '../components/Card';
import VideoPopupModal from '../components/VideoPopupModal';
import { visuals } from '../data/visuals';
import { getFlowVoiceVideoUrl, getFlowVoiceMobileVideoUrl } from '../lib/spaces';

export default function FlowVoice() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        eyebrow="App Flow"
        title="Flow in Voice"
        subtitle="Share spoken memories and heartfelt messages with the same privacy controls that protect your community."
      />

      <section className="relative py-12 border-b border-white/5 bg-[#030712] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="relative z-10 page-container">
          <div className="flex justify-center">
            <Card className="w-full max-w-[1100px] overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent p-6 sm:p-10 text-center">
              <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Watch how Flow in Voice works inside Closed Circuit — private voice sharing with the same approval and
                privacy controls as the rest of your community.
              </p>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm sm:text-base font-bold text-slate-900 shadow-[0_0_30px_rgba(255,255,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(255,255,255,0.35)]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 text-white">
                  <Play size={18} fill="currentColor" />
                </span>
                Watch Video
              </button>
            </Card>
          </div>
        </div>
      </section>

      <VideoPopupModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        title="Flow in Voice"
        desktopUrl={getFlowVoiceVideoUrl()}
        mobileUrl={getFlowVoiceMobileVideoUrl()}
      />

      <section className="section-y relative bg-[#0f172a]/40">
        <div className="page-container grid gap-6 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="p-5 sm:p-8 md:p-10 border border-white/10 bg-gradient-to-br from-indigo-500/5 to-transparent">
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">Voices Feel More Personal</h3>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed">
                Let grandparents share stories, parents send blessings, and communities broadcast updates in a warm,
                human format.
              </p>
              <ul className="mt-8 space-y-4 text-base font-medium text-slate-300">
                {[
                  'Record voice messages directly in the app.',
                  'Admin reviews before voice posts go live.',
                  'Group-targeted broadcasts for relevant audiences.',
                  'Long-term memory preservation in your community archive.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="overflow-hidden p-0 border border-white/10 group h-full">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10 pointer-events-none opacity-40" />
              <img
                src={visuals.voice}
                alt="Voice note capture"
                className="h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="section-y relative border-b border-white/5 bg-[#030712]">
        <div className="page-container grid items-center gap-6 lg:grid-cols-2">
          <Card className="overflow-hidden p-0 border border-white/10 group h-full">
            <img
              src={visuals.secure}
              alt="Secure audio sharing"
              className="h-full min-h-[200px] sm:min-h-[300px] md:min-h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
          </Card>
          <Card className="p-5 sm:p-8 md:p-10 border border-white/10 bg-white/[0.02] h-full flex flex-col justify-center">
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Secure by Default</h3>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Every voice memory stays inside the closed circuit. Only approved members can listen, respond, and keep
              the story alive.
            </p>
          </Card>
        </div>
      </section>
    </motion.div>
  );
}
