import { motion } from 'framer-motion';
import Hero from '../components/Hero';

export default function FeatureDemos() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#030712] text-slate-300">
      <Hero
        title="Watch Feature Demos"
        subtitle="Feature demonstration videos will be available soon."
      />
    </motion.div>
  );
}
