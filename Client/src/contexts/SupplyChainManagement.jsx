import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link2, Truck, BadgeCheck, MoveRight, Eye, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SupplyChainManagement = () => {
  const { t } = useLanguage();

  const concepts = [
    { icon: Eye, title: t('supplyChainPage.trace'), desc: t('supplyChainPage.traceDesc') },
    { icon: Truck, title: t('supplyChainPage.efficiency'), desc: t('supplyChainPage.efficiencyDesc') },
    { icon: BadgeCheck, title: t('supplyChainPage.quality'), desc: t('supplyChainPage.qualityDesc') },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-tr from-green-50 to-white pt-24 pb-16 px-4 overflow-hidden relative">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-display">
              {t('supplyChainPage.title')}
            </h1>
            <p className="text-xl md:text-2xl text-green-600 font-semibold mb-8">
              {t('supplyChainPage.subtitle')}
            </p>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
              {t('supplyChainPage.intro')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Concept Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('supplyChainPage.conceptsTitle')}</h2>
            <div className="w-20 h-1.5 bg-green-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {concepts.map((concept, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group p-10 rounded-[2.5rem] bg-gray-50 hover:bg-white hover:shadow-2xl hover:shadow-green-100 transition-all duration-500 border border-transparent hover:border-green-100"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <concept.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{concept.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{concept.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Workflow Placeholder / Vision */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-6">
                  <Layers className="h-4 w-4" />
                  {t('supplyChainPage.techBadge')}
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {t('supplyChainPage.visionTitle')}
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {t('supplyChainPage.visionDesc')}
                </p>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-white text-xs">✓</div>
                      <div className="h-4 bg-gray-200 rounded-full w-full animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2 bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
              <div className="flex justify-between items-center mb-10">
                <BadgeCheck className="h-10 w-10 text-green-500" />
                <div className="px-4 py-2 bg-gray-100 rounded-lg text-xs font-mono text-gray-500 uppercase tracking-widest">{t('supplyChainPage.activeBadge')}</div>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-1 bg-green-500 rounded-full h-12"></div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">{t('supplyChainPage.seedOriginLabel')}</div>
                    <div className="text-sm font-bold text-gray-800 uppercase">{t('supplyChainPage.seedOriginValue')}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-green-500 rounded-full h-12"></div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">{t('supplyChainPage.harvestDateLabel')}</div>
                    <div className="text-sm font-bold text-gray-800 uppercase">Feb 14, 2026</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-amber-400 rounded-full h-12"></div>
                  <div>
                    <div className="text-xs text-gray-400 font-bold mb-1">{t('supplyChainPage.currentStatusLabel')}</div>
                    <div className="text-sm font-bold text-gray-800 uppercase">{t('supplyChainPage.currentStatusValue')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Link */}
      <section className="py-24 px-4 text-center">
        <motion.div
          whileHover={{ y: -5 }}
          className="inline-block"
        >
          <Link to="/marketplace" className="text-green-600 font-bold text-xl flex items-center gap-3 hover:text-green-700 transition lg:text-3xl">
            {t('supplyChainPage.actionLink')}
            <MoveRight className="h-8 w-8" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default SupplyChainManagement;
