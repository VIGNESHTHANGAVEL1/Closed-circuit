import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

function pickVideoUrl({ desktopUrl, mobileUrl }) {
  if (typeof window === 'undefined') {
    return desktopUrl || mobileUrl || '';
  }

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  return (isMobile ? mobileUrl : desktopUrl) || desktopUrl || mobileUrl || '';
}

export default function VideoPopupModal({ isOpen, onClose, title, desktopUrl, mobileUrl }) {
  const [activeUrl, setActiveUrl] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const updateUrl = () => {
      setActiveUrl(pickVideoUrl({ desktopUrl, mobileUrl }));
    };

    updateUrl();
    const media = window.matchMedia('(max-width: 767px)');
    media.addEventListener('change', updateUrl);
    return () => media.removeEventListener('change', updateUrl);
  }, [isOpen, desktopUrl, mobileUrl]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-5xl rounded-2xl border border-white/10 bg-[#0f172a] p-4 sm:p-5 shadow-2xl"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {activeUrl ? (
              <video
                key={activeUrl}
                src={activeUrl}
                title={title}
                controls
                autoPlay
                playsInline
                className="max-h-[75vh] w-full rounded-xl bg-black object-contain"
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center">
                <p className="text-base sm:text-lg text-slate-300 font-medium">Video will be available soon.</p>
                <p className="mt-2 text-sm text-slate-500">
                  The video file is being prepared. Please check back shortly.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
