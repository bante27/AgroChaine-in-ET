import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Terms of Service</h1>
      <p className="text-gray-700 text-lg">
        By using <span className="font-semibold">AgroChain</span>, you agree to our terms, ensuring a safe and fair experience for all users. These terms govern buying, selling, and supply chain activities on the platform.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-4">Highlights</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Only verified users may conduct transactions.</li>
        <li>Users are responsible for the accuracy of their listings and transactions.</li>
        <li>AgroChain reserves the right to suspend or remove accounts violating policies.</li>
        <li>Platform content and intellectual property must not be misused.</li>
        <li>Dispute resolution is handled fairly, with transparency and accountability.</li>
      </ul>

      <p className="text-gray-700 mt-4">
        These terms create a secure, transparent, and trusted environment, empowering users to confidently participate in the AgroChain ecosystem.
      </p>
    </div>
  );
};

export default TermsOfService;
