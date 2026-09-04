// src/components/Card.jsx
import { motion } from 'framer-motion';

const Card = ({ children, hover, className = '' }) => (
  <motion.div
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4 sm:p-6 ${
      hover ? 'hover:shadow-2xl hover:scale-[1.02] transition-all duration-300' : ''
    } ${className}`}
    whileHover={hover ? { y: -4 } : {}}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export default Card;