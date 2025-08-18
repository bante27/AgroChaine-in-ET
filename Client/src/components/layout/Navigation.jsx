// Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

const Navigation = ({ mobile = false, onItemClick }) => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/services', label: t('nav.services') },
    { path: '/marketplace', label: t('nav.marketplace') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const isActive = (path) => location.pathname === path;

  if (mobile) {
    return (
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onItemClick}
            className={`block px-4 py-2 rounded-lg transition-colors duration-200 ${
              isActive(item.path)
                ? 'bg-emerald-100 text-blue-600 dark:bg-emerald-700 dark:text-white'
                : 'text-gray-200 hover:text-blue-600 dark:hover:bg-gray-800'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex items-center space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`text-sm font-medium transition-colors duration-200 ${
            isActive(item.path)
              ? 'text-blue-600 dark:text-blue-600'
              : 'text-gray-200 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
