import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Privacy Policy</h1>
      <p className="text-gray-700 text-lg">
        Your privacy matters at <span className="font-semibold">AgroChain</span>. We collect only the information necessary to provide a secure, personalized experience while protecting your data at all times.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-4">Key Privacy Points</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>All personal data is encrypted and securely stored.</li>
        <li>Information is used solely to improve platform services and verify transactions.</li>
        <li>We do not share your personal information without your consent.</li>
        <li>You can access, update, or delete your data anytime.</li>
        <li>We comply with all relevant data protection laws.</li>
      </ul>

      <p className="text-gray-700 mt-4">
        Our commitment to privacy ensures you can confidently use AgroChain without worrying about data misuse or unauthorized access.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
