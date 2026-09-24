import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import SalesCareerSection from '../components/careers/SalesCareerSection';
import TechnicalCareerSection from '../components/careers/TechnicalCareerSection';

const TABS = [
  { id: 'technical', label: 'Technical' },
  { id: 'sales', label: 'Sales' },
];

export default function Careers() {
  const [activeTab, setActiveTab] = useState('technical');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero title="Careers at Closed Circuit" contentClassName="page-container pt-4 pb-2 md:pt-5 md:pb-3 text-center" compact />

      <section className="relative pt-2 pb-6 md:pt-3 md:pb-10 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

        <div className="page-container flex justify-center mb-5 md:mb-7">
          <div
            role="tablist"
            aria-label="Career tracks"
            className="inline-flex w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0f172a]/80 p-1.5 sm:p-2 shadow-[0_8px_40px_rgba(99,102,241,0.15)] backdrop-blur-sm"
          >
            {TABS.map(({ id, label }) => {
              const selected = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 min-w-[8rem] rounded-xl px-6 sm:px-10 py-3.5 sm:py-4 md:py-5 text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-all duration-200 ${
                    selected
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/40 ring-1 ring-indigo-400/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'technical' ? <TechnicalCareerSection /> : <SalesCareerSection />}
      </section>
    </motion.div>
  );
}
