import React from 'react';

const DigitalMarketplace = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Digital Marketplace</h1>
      <p className="text-gray-700 text-lg">
        Explore, buy, and sell agricultural products effortlessly on our <span className="font-semibold">digital marketplace</span>. AgroChain connects farmers, buyers, and suppliers in a safe and transparent environment.
      </p>
      <p className="text-gray-700 text-lg">
        From fresh produce to farming tools, you can discover high-quality products from verified sellers across Ethiopia and beyond.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-4">Marketplace Features</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Browse verified sellers and top-rated products easily.</li>
        <li>Secure transactions with full transparency and tracking.</li>
        <li>Real-time notifications for orders, shipments, and deliveries.</li>
        <li>Save favorite products and sellers for future purchases.</li>
      </ul>

      <p className="text-gray-700 mt-4">
        Our marketplace is designed to empower farmers, enhance supply chain efficiency, and create a seamless buying experience for everyone.
      </p>
    </div>
  );
};

export default DigitalMarketplace;
