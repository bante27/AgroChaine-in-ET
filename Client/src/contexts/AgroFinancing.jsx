import React from "react";

const AgroFinancing = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-lime-600 mb-6">
        Agro Financing & Payments
      </h1>
      <p className="text-gray-700 mb-6">
        AgroChain Ethiopia empowers farmers and buyers with secure, fast, and
        reliable financial services. Through local banks, mobile money, and
        digital wallets, we ensure smooth payments and financial inclusion for
        everyone in the agricultural value chain.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-lime-700 mb-3">Payment Options</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Telebirr and Safaricom M-Pesa integration</li>
            <li>Bank transfers (CBE, Awash, Dashen, BOA, Birhan)</li>
            <li>Wallet-to-wallet transactions within AgroChain</li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-lime-700 mb-3">Financing Services</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Micro-loans for smallholder farmers</li>
            <li>Flexible payment plans for buyers</li>
            <li>Partnerships with banks for agricultural financing</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 bg-lime-50 border border-lime-200 rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-lime-700 mb-3">Why Agro Financing?</h2>
        <p className="text-gray-700">
          Many farmers in Ethiopia struggle with access to affordable financing.
          AgroChain Ethiopia bridges this gap by connecting them with trusted
          financial partners and providing secure, easy-to-use digital payment
          solutions.
        </p>
      </div>
    </section>
  );
};

export default AgroFinancing;
