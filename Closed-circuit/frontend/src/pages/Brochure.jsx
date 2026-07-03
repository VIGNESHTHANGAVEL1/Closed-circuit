import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Download, ExternalLink, BookOpen } from 'lucide-react';
import Hero from '../components/Hero';
import { getApiBaseUrl } from '../lib/api';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

function FileCard({ file, index }) {
  const [imgError, setImgError] = useState(false);
  const { fileName, fileType, url } = file;
  const isPdf = fileType === 'pdf';
  const isImg = fileType === 'image' && !imgError;
  const label = fileName.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '');

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      whileHover={{ y: -6 }}
      className="group rounded-[24px] border border-white/10 bg-white/[0.03] overflow-hidden shadow-xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-white/[0.06]"
    >
      {/* Preview */}
      <div className="relative bg-[#0a0f1e] overflow-hidden" style={{ minHeight: '220px' }}>
        {isImg ? (
          <img
            src={url}
            alt={label}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : isPdf ? (
          <div className="flex flex-col items-center justify-center h-56 gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 p-5">
              <FileText className="h-14 w-14 text-indigo-400" />
            </div>
            <span className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">PDF Document</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-56 gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-400/10 border border-white/10 p-5">
              <ImageIcon className="h-14 w-14 text-slate-400" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Info + actions */}
      <div className="p-5">
        <h3 className="font-display font-bold text-white text-base mb-1 truncate capitalize" title={label}>
          {label}
        </h3>
        <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">
          {isPdf ? 'PDF Document' : 'Image File'} • {fileName}
        </p>
        <div className="flex gap-2 flex-wrap">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:scale-105"
          >
            <ExternalLink size={14} />
            {isPdf ? 'Open PDF' : 'View Image'}
          </a>
          <a
            href={url}
            download={fileName}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <Download size={14} />
            Download
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Brochure() {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${getApiBaseUrl()}/api/public/brochures`)
      .then((res) => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then((data) => setFiles(Array.isArray(data) ? data : []))
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-[#030712] text-slate-300"
    >
      <Hero
        eyebrow="Company Brochure"
        title="Download Our Brochure"
        subtitle="Explore Closed Circuit through our official brochures. Learn about our platform, features, and how we protect your privacy."
        gradient="from-[#020617] via-[#0f172a] to-[#030712]"
        contentClassName="page-container py-8 md:py-12 text-center"
        compact
      />

      <section className="section-y-sm relative">
        <div className="absolute inset-0 section-grid opacity-20 pointer-events-none" />
        <div className="page-container relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                <p className="text-slate-400 text-sm">Loading brochures…</p>
              </div>
            </div>
          ) : files && files.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((file, i) => (
                <FileCard key={file.fileName} file={file} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 p-8">
                <BookOpen className="h-16 w-16 text-indigo-400/60" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">Brochure Coming Soon</h2>
              <p className="text-slate-400 max-w-md">
                Brochure will be available soon. Please check back later or contact us for more information.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
