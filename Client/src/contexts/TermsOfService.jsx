import React from 'react';
import { motion } from 'framer-motion';
import { Scale, FileCheck, AlertCircle, Bookmark, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const TermsOfService = () => {
  const { t } = useLanguage();

  const sections = [
    { icon: Bookmark, title: t('legal.dataCollection'), desc: t('legal.dataCollectionDesc') },
    { icon: Scale, title: t('legal.dataSecurity'), desc: t('legal.dataSecurityDesc') },
    { icon: ShieldAlert, title: t('legal.userResponsibilities'), desc: t('legal.userResponsibilitiesDesc') },
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
            <div className="flex items-center gap-3 text-amber-600 font-bold mb-4">
              <Scale className="h-6 w-6" />
              <span>{t('legal.termsAndConditions')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              {t('legal.termsTitle')}
            </h1>
            <p className="text-lg text-gray-400 font-medium">
              {t('legal.termsUpdate')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-8 bg-amber-50 rounded-3xl border border-amber-100 mb-16 flex gap-6 items-start"
          >
            <AlertCircle className="h-8 w-8 text-amber-600 shrink-0 mt-1" />
            <p className="text-lg text-amber-900 leading-relaxed font-medium">
              {t('legal.intro')}
            </p>
          </motion.div>

          <div className="space-y-16">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <section.icon className="h-6 w-6 text-gray-600 group-hover:text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed pl-16">
                  {section.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-green-600 font-bold pl-16">
                  <FileCheck className="h-5 w-5" />
                  <span className="text-sm">{t('legal.bindingAgreement')}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-24 pt-10 border-t border-gray-100 text-center text-gray-400">
            {t('nav.brand')} {t('nav.country')} © 2026. {t('footer.allRights')}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
