import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
  <section className="  text-blue-950 ">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-">Welcome to Agrochan Digital Marketplace</h1>
          <p className="text-lg sm:text-xl text-blue-700 leading-relaxed">
            Discover and sell / buy fresh agricultural products with ease. 


          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;