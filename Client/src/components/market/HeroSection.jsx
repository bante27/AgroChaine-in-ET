import React from "react";
import { motion } from "framer-motion";
import { Shield, Globe, Tractor } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import ananas from "../../assets/images/Ananas stock.jfif";
import apple from "../../assets/images/Apple.jfif";
import onion from "../../assets/images/Onion.jfif";
import coffee from "../../assets/images/cofee.jfif";

const productImages = [
  ananas,
  apple,
  onion,
  coffee,
  // 🌾 Extra high-quality agricultural visuals
  "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=1200&q=80", // golden wheat field
  "https://images.unsplash.com/photo-1582515073490-dc84b8c4e6b1?auto=format&fit=crop&w=1200&q=80", // vibrant corn
  "https://images.unsplash.com/photo-1587049352846-4f4e2a9b158d?auto=format&fit=crop&w=1200&q=80", // premium coffee beans
  "https://images.unsplash.com/photo-1590080875831-2e7a13e6d6a0?auto=format&fit=crop&w=1200&q=80", // fresh market veggies
  "https://images.unsplash.com/photo-1560493675-048a7e3166c3?auto=format&fit=crop&w=1200&q=80", // teff harvest
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", // avocado bounty
];

const HeroSection = () => {
  const { t } = useLanguage();
  // ⚡ Ultra-smooth infinite scroll (adjust speed here)
  const scrollSpeed = 40; // seconds per full loop – tweak for feel

  const badges = [
    { icon: Shield, text: t('marketplace.hero.badges.security') },
    { icon: Globe, text: t('marketplace.hero.badges.carbon') },
    { icon: Tractor, text: t('marketplace.hero.badges.farmer') },
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 overflow-hidden">
      {/* 🌫️ Subtle animated grain overlay for premium depth */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-soft-light animate-pulse-slow" />
      </div>

      {/* ✨ Floating geometric accents */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-tr from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-96 h-96 bg-gradient-to-bl from-amber-400/20 to-green-600/20 rounded-full blur-3xl"
        animate={{ y: [0, 40, 0], rotate: [0, -120, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        {/* 📜 LEFT: Epic headline & tagline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, staggerChildren: 0.2 }}
          className="space-y-8"
        >
          {/* Dynamic gradient headline */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 animate-gradient-xy"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", stiffness: 80 }}
          >
            {t('nav.brand')}
            <br />
            <span className="block mt-2 text-4xl sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-green-700">
              {t('marketplace.hero.title')}
            </span>
          </motion.h1>

          {/* Rich subtext */}
          <motion.p
            className="text-xl sm:text-2xl text-gray-700 max-w-2xl leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            {t('marketplace.hero.subtitle')}
            <span className="block mt-3 font-semibold text-emerald-700">
              {t('marketplace.hero.tagline')}
            </span>
          </motion.p>

          {/* 🌟 Micro-interactions: subtle pulse badges with Lucide icons */}
          <motion.div
            className="flex flex-wrap gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {badges.map((badge, i) => (
              <motion.span
                key={i}
                className="flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-md text-sm font-medium text-emerald-800 border border-emerald-200"
                whileHover={{ scale: 1.1, boxShadow: "0 8px 20px rgba(16, 197, 136, 0.25)" }}
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                <badge.icon className="w-4 h-4" />
                {badge.text}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* 🖼️ RIGHT: Infinite premium carousel */}
        <div className="relative">
          {/* Mask for clean edges */}
          <div className="overflow-hidden rounded-3xl shadow-2xl bg-white/50 backdrop-blur-sm border border-white/30">
            <motion.div
              className="flex gap-8 py-8"
              animate={{ x: [0, -100 + "%"] }}
              transition={{
                x: { duration: scrollSpeed, repeat: Infinity, ease: "linear" },
              }}
            >
              {/* Duplicate set for seamless loop */}
              {[...productImages, ...productImages].map((src, i) => (
                <motion.div
                  key={i}
                  className="flex-shrink-0 w-72 h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-white/50"
                  whileHover={{ scale: 1.08, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={src}
                    alt={`Ethiopian produce ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 🎨 Decorative wave bottom */}
          <svg
            className="absolute -bottom-8 left-0 w-full"
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,0 L1440,0 L1440,80 C1200,120 1000,40 720,80 C440,120 240,40 0,80 Z"
              fill="url(#waveGradient)"
            />
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 🌈 Custom CSS for animated gradient text */}
      <style>{`
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 12s ease infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5%; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default HeroSection;