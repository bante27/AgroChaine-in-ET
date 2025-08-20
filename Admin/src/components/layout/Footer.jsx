import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="lg:ml-64 bg-black/20 backdrop-blur-sm border-t border-white/10 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Left side: Logo + Text */}
          <div className="flex items-center gap-3 text-white/60 text-sm">
            <img
              src="/newlogo.png"
              alt="AgroChain Ethiopia Logo"
              className="h-6 w-auto"
            />
            <span>© {year} AgroChain Ethiopia. All rights reserved.</span>
          </div>

          {/* Right side: Links */}
          <div className="flex items-center gap-6 text-white/60 text-sm">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
