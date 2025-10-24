import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../../assets/images/Traceability-2.0-Digital-Solutions-Empowering-Agriculture.png'; // optional: replace with your own image

const HeroSection = () => {
  return (
    <section
      className="relative bg-gradient-to-br from-green-50 via-white to-amber-50 text-blue-950 py-20 sm:py-28 overflow-hidden"
    >
      {/* Background Decorative Image or Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Animated Intro */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-amber-600 to-green-700 drop-shadow-sm">
            Welcome to AgroChain Digital Marketplace
          </h1>

          <p className="text-lg sm:text-xl text-blue-800 leading-relaxed mb-8">
            Empowering Ethiopian farmers and buyers through transparent, secure,
            and efficient agricultural trade — all in one digital platform.
          </p>

          {/* Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            {/* <motion.a
              href="/marketplace"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-green-700 text-white font-semibold shadow-lg hover:bg-green-800 transition duration-300"
            >
              Explore Marketplace
            </motion.a> */}

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition duration-300"
            >
              Contact Us
            </motion.a>

            {/* <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-full bg-amber-500 text-white font-semibold shadow-lg hover:bg-amber-600 transition duration-300"
            >
              Login / Register
            </motion.a> */}
          </div>
        </motion.div>

        {/* Decorative Shapes */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-tr from-green-400 via-amber-300 to-green-200 rounded-full blur-3xl"
        ></motion.div>
      </div>
    </section>
  );
};

export default HeroSection;