import React from 'react';

const KYCVerification = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">KYC Verification</h1>
      <p className="text-gray-700 text-lg">
        At <span className="font-semibold">AgroChain</span>, your security and trust are our top priorities. 
        All users undergo <span className="font-semibold">KYC verification</span> to ensure a safe and authentic marketplace experience.
      </p>
      <p className="text-gray-700 text-lg">
        Upload your government-issued ID and let our team review it promptly. Verified users enjoy full platform access, including buying, selling, and supply chain management.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-4">Why KYC Matters</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Prevent fraud and unauthorized activities within the platform.</li>
        <li>Builds trust among buyers, sellers, and suppliers.</li>
        <li>Ensures regulatory compliance for a secure ecosystem.</li>
        <li>Enhances credibility and visibility for verified users.</li>
      </ul>

      <p className="text-gray-700 mt-4">
        By completing KYC verification, you contribute to a safe and reliable AgroChain community where every transaction is protected and every member is trusted.
      </p>
    </div>
  );
};

export default KYCVerification;
