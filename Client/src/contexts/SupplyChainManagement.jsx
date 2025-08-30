import React from 'react';

const SupplyChainManagement = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Supply Chain Management</h1>
      <p className="text-gray-700 text-lg">
        AgroChain simplifies agricultural supply chains, ensuring traceability, transparency, and efficiency from farm to market. Every transaction and movement is tracked for maximum accountability.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-4">Benefits of Our Supply Chain System</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Real-time tracking of goods from farm to buyer.</li>
        <li>Detailed transaction history for accountability and trust.</li>
        <li>Data-driven insights to optimize logistics and reduce waste.</li>
        <li>Transparent product origin verification for consumer confidence.</li>
      </ul>

      <p className="text-gray-700 mt-4">
        Our supply chain tools empower farmers and suppliers to efficiently manage production, delivery, and transactions, building a stronger and more resilient agricultural ecosystem.
      </p>
    </div>
  );
};

export default SupplyChainManagement;
