import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Landmark, Coins, Umbrella, Briefcase, CheckSquare, TrendingUp, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const AgroFinancing = () => {
  const { t } = useLanguage();

  const solutions = [
    { icon: Coins, title: t('financingPage.loans'), desc: t('financingPage.loansDesc'), color: 'text-amber-600', bg: 'bg-amber-50' },
    { icon: Umbrella, title: t('financingPage.insurance'), desc: t('financingPage.insuranceDesc'), color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Briefcase, title: t('financingPage.investment'), desc: t('financingPage.investmentDesc'), color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  const criteria = [
    t('financingPage.criteria1'),
    t('financingPage.criteria2'),
    t('financingPage.criteria3'),
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-lime-50 to-white pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-20 h-20 bg-lime-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Landmark className="h-10 w-10 text-lime-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              {t('financingPage.title')}
            </h1>
            <p className="text-xl md:text-2xl text-lime-700 font-medium mb-8">
              {t('financingPage.subtitle')}
            </p>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
              {t('financingPage.intro')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-24 px-4 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            {t('financingPage.productsTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {solutions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-white border border-lime-100 shadow-xl shadow-lime-50 rounded-[3rem] p-10 md:p-20 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-50 rounded-full blur-2xl"></div>
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                {t('financingPage.eligibilityTitle')}
              </h2>
              <div className="space-y-6">
                {criteria.map((text, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex items-center gap-4 text-xl text-gray-700 font-medium"
                  >
                    <CheckSquare className="h-7 w-7 text-lime-600 flex-shrink-0" />
                    {text}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="bg-lime-900 text-white p-10 rounded-[2rem] shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <TrendingUp className="h-8 w-8 text-lime-400" />
                  <span className="text-2xl font-bold">{t('financingPage.growthLabel')}</span>
                </div>
                <div className="space-y-6">
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '75%' }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-lime-400"
                    ></motion.div>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-lime-200 uppercase tracking-widest">
                    <span>{t('financingPage.rateLabel')}</span>
                    <span>{t('financingPage.optimalLabel')}</span>
                  </div>
                </div>
                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 flex gap-4">
                  <Info className="h-6 w-6 text-lime-400 shrink-0" />
                  <p className="text-sm opacity-80 leading-relaxed italic">
                    "{t('financingPage.intro')}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">{t('financingPage.horizonLink')}</h2>
        <Link
          to="/login"
          className="bg-lime-600 text-white px-12 py-5 rounded-full font-bold text-xl shadow-xl shadow-lime-100 hover:bg-lime-700 transition inline-block"
        >
          {t('financingPage.checkEligibility')}
        </Link>
      </section>
    </div>
  );
};

export default AgroFinancing;
