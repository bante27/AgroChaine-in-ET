import React from 'react';
import { motion } from 'framer-motion';
import { Cookie, MousePointer2, Settings, Info, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const CookiePolicy = () => {
  const { t } = useLanguage();

  const sections = [
    { icon: MousePointer2, title: t('legal.dataCollection'), desc: t('legal.dataCollectionDesc') },
    { icon: ShieldCheck, title: t('legal.dataSecurity'), desc: t('legal.dataSecurityDesc') },
    { icon: Settings, title: t('legal.userResponsibilities'), desc: t('legal.userResponsibilitiesDesc') },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-gray-50 pt-24 pb-16 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 text-blue-600 font-bold mb-4">
              <Cookie className="h-6 w-6" />
              <span>PRIVACY PREFERENCES</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              {t('legal.cookieTitle')}
            </h1>
            <p className="text-lg text-gray-400 font-medium">
              {t('legal.cookieUpdate')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl text-gray-600 mb-16 leading-relaxed bg-blue-50/50 p-8 rounded-3xl border border-blue-100 italic"
          >
            {t('legal.intro')}
          </motion.p>

          <div className="space-y-16">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="flex gap-10 items-start"
              >
                <div className="w-14 h-14 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center shrink-0">
                  <section.icon className="h-7 w-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-6">{section.desc}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    <Info className="h-4 w-4" />
                    Essential Technology
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 flex justify-center">
            <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition">
              Manage Preferences
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
