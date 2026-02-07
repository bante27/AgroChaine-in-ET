
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Navigation = ({ mobile = false, onItemClick }) => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    // { path: '/services', label: t('nav.services') },
    { path: '/marketplace', label: t('nav.marketplace') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path) => location.pathname === path;

  if (mobile) {
    return (
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${isActive(item.path)
                ? 'bg-[#046A38]/10 text-[#046A38]'
                : 'text-gray-700 hover:bg-gray-50 hover:text-[#046A38]'
              }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-8">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-sm font-semibold tracking-wide transition-all duration-300 relative group ${isActive(item.path)
              ? 'text-[#046A38]'
              : 'text-gray-600 hover:text-[#046A38]'
            }`}
        >
          {item.label}
          <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#046A38] transition-all duration-300 group-hover:w-full ${isActive(item.path) ? 'w-full' : ''}`}></span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
