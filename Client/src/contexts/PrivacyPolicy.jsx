import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  const sections = [
    { icon: Shield, title: t('legal.dataCollection'), desc: t('legal.dataCollectionDesc') },
    { icon: Lock, title: t('legal.dataSecurity'), desc: t('legal.dataSecurityDesc') },
    { icon: Eye, title: t('legal.userResponsibilities'), desc: t('legal.userResponsibilitiesDesc') },
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
            <div className="flex items-center gap-3 text-teal-600 font-bold mb-4">
              <FileText className="h-6 w-6" />
              <span>{t('legal.docs')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              {t('legal.privacyTitle')}
            </h1>
            <p className="text-lg text-gray-400 font-medium">
              {t('legal.privacyUpdate')}
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
            className="text-xl text-gray-600 mb-16 leading-relaxed italic border-l-4 border-teal-500 pl-8"
          >
            {t('legal.intro')}
          </motion.p>

          <div className="space-y-16">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0">
                  <section.icon className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{section.desc}</p>
                  <ul className="mt-6 space-y-3">
                    {[1, 2].map((i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-500">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>{t('legal.compliance')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 italic text-gray-500 text-center">
            {t('legal.agreement')}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
