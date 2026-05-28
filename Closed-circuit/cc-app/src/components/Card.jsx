import { motion } from 'framer-motion';

export default function Card({ children, className = '', delay = 0, onClick = null }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -6, scale: 1.01 }}
      onClick={onClick}
      className={`glass-panel rounded-2xl transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
