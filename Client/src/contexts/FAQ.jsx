import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, PhoneCall, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: t('faqPage.q1'), a: t('faqPage.a1') },
    { q: t('faqPage.q2'), a: t('faqPage.a2') },
    { q: t('faqPage.q3'), a: t('faqPage.a3') },
    { q: t('faqPage.q4'), a: t('faqPage.a4') },
    { q: t('faqPage.q5'), a: t('faqPage.a5') },
    { q: t('faqPage.q6'), a: t('faqPage.a6') },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-6">
              <HelpCircle className="h-4 w-4" />
              SUPPORT CENTER
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              {t('faqPage.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('faqPage.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="border border-gray-100 rounded-[2rem] overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full text-left p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl font-bold text-gray-800 pr-6">{faq.q}</span>
                <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 ${openIndex === idx ? 'rotate-180 bg-green-100' : ''}`}>
                  <ChevronDown className={`h-6 w-6 ${openIndex === idx ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 text-lg text-gray-600 leading-relaxed border-t border-gray-50 pt-6">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto bg-green-600 rounded-[4rem] p-12 md:p-20 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">{t('faqPage.ctaTitle')}</h2>
          <p className="text-xl text-green-100 mb-12 max-w-2xl mx-auto">
            {t('faqPage.ctaDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => window.openChat && window.openChat()}
              className="bg-white text-green-700 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-green-50 transition shadow-xl flex items-center justify-center gap-3"
            >
              <MessageCircle className="h-6 w-6" />
              {t('footer.chatUs')}
            </button>
            <Link
              to="/contact"
              className="bg-green-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-green-400 transition flex items-center justify-center gap-3"
            >
              <PhoneCall className="h-6 w-6" />
              {t('footer.contactSales')}
            </Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-4 text-green-100 font-medium">
            <span>{t('faqPage.officialRecords')}</span>
            <Link to="/privacy" className="underline hover:text-white flex items-center gap-1">
              {t('faqPage.viewLegal')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
