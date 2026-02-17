import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, BarChart3, ShoppingCart, Zap, Search, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DigitalMarketplace = () => {
  const { t } = useLanguage();

  const features = [
    { icon: BarChart3, title: t('digitalMarketPage.price'), desc: t('digitalMarketPage.priceDesc') },
    { icon: Zap, title: t('digitalMarketPage.direct'), desc: t('digitalMarketPage.directDesc') },
    { icon: Globe, title: t('digitalMarketPage.global'), desc: t('digitalMarketPage.globalDesc') },
  ];

  const howSteps = [
    { icon: Search, title: t('digitalMarketPage.browse'), desc: t('digitalMarketPage.browseDesc') },
    { icon: ShoppingCart, title: t('digitalMarketPage.secure'), desc: t('digitalMarketPage.secureDesc') },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-amber-50 to-white pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {t('digitalMarketPage.title')}
            </h1>
            <p className="text-xl md:text-2xl text-amber-600 font-semibold mb-8">
              {t('digitalMarketPage.subtitle')}
            </p>
            <p className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed italic">
              "{t('digitalMarketPage.intro')}"
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            {t('digitalMarketPage.featuresTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group"
              >
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-amber-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-gray-900 text-white rounded-[48px] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 p-12 md:p-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
              {t('digitalMarketPage.howTitle')}
            </h2>
            <div className="grid md:grid-cols-2 gap-16">
              {howSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.3 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                    <step.icon className="h-10 w-10 text-amber-400" />
                  </div>
                  <h4 className="text-2xl font-bold">{step.title}</h4>
                  <p className="text-gray-400 text-lg leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-20 flex justify-center">
              <div className="flex items-center gap-4 bg-white/5 px-8 py-4 rounded-full border border-white/10">
                <ShieldCheck className="h-6 w-6 text-green-400" />
                <span className="text-lg font-medium">{t('digitalMarketPage.verifiedBadge')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10">
            {t('digitalMarketPage.ctaTitle')}
          </h2>
          <Link
            to="/marketplace"
            className="bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all shadow-lg shadow-amber-200 flex items-center gap-3 mx-auto w-fit"
          >
            {t('digitalMarketPage.title')}
            <ArrowRight className="h-6 w-6" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default DigitalMarketplace;
