import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Download, ExternalLink, Award } from 'lucide-react';
import Hero from '../components/Hero';

const FOLDER = '/Closed Circuit/Certificates';
const MANIFEST = `${FOLDER}/manifest.json`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08 } }),
};

function isPdf(filename) {
  return /\.pdf$/i.test(filename);
}

function isImage(filename) {
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(filename);
}

function CertCard({ file, index }) {
  const [imgError, setImgError] = useState(false);
  const fileUrl = `${FOLDER}/${file.name}`;
  const label = file.label || file.name;
  const pdf = isPdf(file.name);
  const img = isImage(file.name) && !imgError;

  const openFile = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      whileHover={{ y: -6 }}
      className="group rounded-[24px] border border-white/10 bg-white/[0.03] overflow-hidden shadow-xl transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.06]"
    >
      {/* Preview area */}
      <div className="relative bg-[#0a0f1e] overflow-hidden" style={{ minHeight: '220px' }}>
        {img ? (
          <img
            src={fileUrl}
            alt={label}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : pdf ? (
          <div className="flex flex-col items-center justify-center h-56 gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-500/20 p-5">
              <FileText className="h-14 w-14 text-purple-400" />
            </div>
            <span className="text-sm font-semibold text-purple-300 uppercase tracking-wider">PDF Certificate</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-56 gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-400/10 border border-white/10 p-5">
              <ImageIcon className="h-14 w-14 text-slate-400" />
            </div>
            <span className="text-sm text-slate-500">Preview unavailable</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/80 via-transparent to-transparent pointer-events-none" />

        {/* Certification badge overlay */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-[#0b1235]/90 px-3 py-1 backdrop-blur-md">
            <Award className="h-3.5 w-3.5 text-purple-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Certified</span>
          </div>
        </div>
      </div>

      {/* Info + actions */}
      <div className="p-5">
        <h3 className="font-display font-bold text-white text-base mb-1 truncate" title={label}>
          {label}
        </h3>
        <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">
          {pdf ? 'PDF Certificate' : 'Certificate Image'} • {file.name}
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={openFile}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:scale-105 hover:shadow-purple-500/30"
          >
            <ExternalLink size={14} />
            {pdf ? 'Open Certificate' : 'View Certificate'}
          </button>
          <a
            href={fileUrl}
            download
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

export default function IsoCertification() {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(MANIFEST)
      .then((res) => {
        if (!res.ok) throw new Error('Manifest not found');
        return res.json();
      })
      .then((data) => {
        setFiles(Array.isArray(data.files) ? data.files : []);
      })
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
        eyebrow="Quality Assurance"
        title="ISO Certification"
        subtitle="Closed Circuit is committed to international quality standards. View and download our official ISO certifications below."
        gradient="from-[#020617] via-[#0f172a] to-[#030712]"
        contentClassName="page-container py-8 md:py-12 text-center"
        compact
      />

      {/* ISO Info Banner */}
      <section className="border-b border-white/5 bg-[#020617] py-5">
        <div className="page-container">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {['ISO 9001:2015', 'Quality Management System', 'International Standard', 'Certified Organisation'].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2"
                >
                  <Award className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="section-y-sm relative">
        <div className="absolute inset-0 section-grid opacity-20 pointer-events-none" />
        <div className="page-container relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-slate-400 text-sm">Loading certificates…</p>
              </div>
            </div>
          ) : files && files.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((file, i) => (
                <CertCard key={file.name} file={file} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-6 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-8">
                <Award className="h-16 w-16 text-purple-400/60" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-3">Certificate Coming Soon</h2>
              <p className="text-slate-400 max-w-md">
                ISO Certification will be available soon. Our team is in the process of uploading the official documents.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
