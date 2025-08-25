import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
  <section className="bg-gradient-to-r from-green-500 to-blue-600 section-padding text-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Vital Marketplace</h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
            Discover and sell fresh agricultural products
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;