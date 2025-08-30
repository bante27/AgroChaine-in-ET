import React from "react";
import { motion } from "framer-motion";

const faqs = [
  { q: "What is AgroChain Ethiopia?", a: "AgroChain is a digital platform connecting farmers, buyers, and investors across Ethiopia with secure supply chain management." },
  { q: "How do I become a seller?", a: "Register on the platform, complete KYC verification, and upload your product details to start selling." },
  { q: "Is payment secure?", a: "Yes, we integrate with trusted Ethiopian payment providers such as Telebirr, Chapa, and bank transfers." },
  { q: "Can international buyers use AgroChain?", a: "Yes, AgroChain supports both local and international buyers for Ethiopian agricultural products." },
];

export default function FAQ() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-10 text-green-700"
      >
        Frequently Asked Questions
      </motion.h1>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white shadow-md rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800">{faq.q}</h2>
            <p className="text-gray-600 mt-2">{faq.a}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
