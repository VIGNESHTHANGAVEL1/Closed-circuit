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
      <Hero title="Careers at Closed Circuit" contentClassName="page-container py-4 md:py-6 text-center" compact />

      <section className="relative py-6 md:py-10 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

        <div className="page-container mb-6 md:mb-8">
          <div
            role="tablist"
            aria-label="Career tracks"
            className="inline-flex w-full max-w-md mx-auto rounded-xl border border-white/10 bg-white/[0.03] p-1"
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
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm sm:text-base font-bold transition ${
                    selected
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
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
