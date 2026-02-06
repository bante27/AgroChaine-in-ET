import React from 'react';
import { motion } from 'framer-motion';
import { Shield, UserCheck, Lock, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const KYCVerification = () => {
  const { t } = useLanguage();

  const benefits = [
    { icon: Shield, title: t('kycPage.trust'), desc: t('kycPage.trustDesc') },
    { icon: UserCheck, title: t('kycPage.safety'), desc: t('kycPage.safetyDesc') },
    { icon: Lock, title: t('kycPage.access'), desc: t('kycPage.accessDesc') },
  ];

  const steps = [
    { title: t('kycPage.step1'), desc: t('kycPage.step1Desc') },
    { title: t('kycPage.step2'), desc: t('kycPage.step2Desc') },
    { title: t('kycPage.step3'), desc: t('kycPage.step3Desc') },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-white pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 font-display">
              {t('kycPage.title')}
            </h1>
            <p className="text-xl md:text-2xl text-teal-600 font-medium mb-8">
              {t('kycPage.subtitle')}
            </p>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
              {t('kycPage.intro')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why KYC Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-900 mb-16"
          >
            {t('kycPage.whyTitle')}
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            {benefits.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <item.icon className="h-12 w-12 text-teal-600 mb-6" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-teal-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                {t('kycPage.stepsTitle')}
              </h2>
              <div className="space-y-10">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-white text-teal-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                      <p className="text-teal-50 opacity-90 leading-relaxed text-lg">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-[40px] shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-8">
                  <FileCheck className="h-10 w-10 text-amber-400" />
                  <span className="text-2xl font-bold italic">AgroChain Verified</span>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-teal-300" />
                      <div className="h-2 bg-white/20 rounded-full flex-grow"></div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex justify-center">
                  <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center shadow-inner">
                    <UserCheck className="h-12 w-12 text-white" />
                  </div>
                </div>
              </motion.div>
              <div className="absolute -bottom-6 -left-6 bg-amber-500 p-6 rounded-2xl shadow-xl flex items-center gap-4 rotate-3">
                <Shield className="h-8 w-8 text-white" />
                <span className="font-bold">100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
            Ready to become a trusted AgroChain Ethiopia partner?
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-teal-600 text-white px-12 py-5 rounded-full font-bold text-xl shadow-xl shadow-teal-100 hover:bg-teal-700 transition flex items-center gap-3 mx-auto"
          >
            Start My KYC
            <ArrowRight className="h-6 w-6" />
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default KYCVerification;
