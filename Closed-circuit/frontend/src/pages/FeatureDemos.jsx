import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Video } from 'lucide-react';
import Hero from '../components/Hero';
import MediaPlayer from '../components/MediaPlayer';
import { apiRequest } from '../lib/api';

export default function FeatureDemos() {
  const [videos, setVideos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/api/public/demo-videos/');
      const list = Array.isArray(data) ? data : data.videos || [];
      setVideos(list);
      setSelectedId((prev) => prev ?? list[0]?.id ?? null);
    } catch (err) {
      setError(err.data?.message || 'Unable to load feature demos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const selectedVideo = videos.find((v) => v.id === selectedId) || videos[0] || null;

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#030712] text-slate-300"
    >
      <Hero
        eyebrow="Features"
        title="Watch Feature Demos"
        subtitle="Learn how Closed Circuit works through guided video walkthroughs."
      />

      <section className="section-y relative border-b border-white/5 bg-[#030712]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-indigo-500/10 blur-[180px] rounded-full pointer-events-none" />

        <div className="page-container relative z-10">
          {loading && (
            <div className="flex items-center justify-center py-24 text-slate-400">
              Loading demos...
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <Video className="mx-auto h-12 w-12 text-indigo-400 mb-4" />
              <p className="text-lg text-white font-semibold">Demo videos coming soon</p>
              <p className="mt-2 text-slate-400">Feature demonstration videos will be available shortly.</p>
            </div>
          )}

          {!loading && !error && videos.length > 0 && (
            <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
              {/* Left panel — video topic list */}
              <aside className="rounded-2xl border border-white/10 bg-[#0a0f1a]/80 backdrop-blur-xl overflow-hidden">
                <div className="border-b border-white/10 px-5 py-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-300">Video Topics</h2>
                  <p className="text-xs text-slate-500 mt-1">{videos.length} demo{videos.length !== 1 ? 's' : ''}</p>
                </div>
                <nav className="max-h-[200px] sm:max-h-[360px] md:max-h-[520px] overflow-y-auto p-3 space-y-1" aria-label="Demo video topics">
                  {videos.map((video, index) => {
                    const isActive = selectedVideo?.id === video.id;
                    return (
                      <button
                        key={video.id}
                        type="button"
                        onClick={() => handleSelect(video.id)}
                        className={`flex w-full items-start gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-500/25 to-purple-600/15 text-white border border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                        }`}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isActive ? 'bg-indigo-500/30 text-indigo-200' : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <span className="font-medium leading-snug">{video.title}</span>
                        {isActive && <Play className="ml-auto h-4 w-4 shrink-0 text-indigo-300 mt-0.5" />}
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* Right panel — video player */}
              <div className="rounded-2xl border border-white/10 bg-[#0a0f1a]/60 backdrop-blur-xl p-6 sm:p-8">
                <div className="flex justify-center">
                  <MediaPlayer
                    src={selectedVideo?.videoUrl}
                    title={selectedVideo?.title}
                    autoPlay
                    muted
                    loop={false}
                  />
                </div>

                <div className="mt-6">
                  <h3 className="font-display text-2xl font-bold text-white tracking-tight">
                    {selectedVideo?.title}
                  </h3>
                  <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 min-h-[80px]">
                    <p className="text-sm text-slate-500">
                      Description area — reserved for future video descriptions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
