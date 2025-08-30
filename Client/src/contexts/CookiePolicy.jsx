import React from 'react';

const CookiePolicy = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-green-700">Cookie Policy</h1>
      <p className="text-gray-700 text-lg">
        AgroChain uses cookies to enhance your browsing experience, improve platform functionality, and analyze usage. Cookies help us provide a secure, seamless, and personalized experience.
      </p>

      <h2 className="text-2xl font-semibold text-green-600 mt-4">Your Choices</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Accept cookies to enjoy the full platform experience.</li>
        <li>Manage or disable cookies in your browser settings.</li>
        <li>Essential cookies are required for basic platform functionality.</li>
        <li>Cookies improve security, performance, and analytics on the site.</li>
      </ul>

      <p className="text-gray-700 mt-4">
        By using AgroChain, you consent to our use of cookies for a better, faster, and safer digital marketplace experience.
      </p>
    </div>
  );
};

export default CookiePolicy;
