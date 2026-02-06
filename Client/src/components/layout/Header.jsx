import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Menu, X, User, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Navigation from './Navigation';
import logoIconDarkTransparent from "../../assets/images/newlogo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const location = useLocation();
  const controls = useAnimation();
  const menuRef = useRef(null);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={controls}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      // Updated to ISPA-like Clean White Style
      className="sticky top-0 z-50 bg-white text-gray-800 shadow-md transition-shadow duration-300"
    >
      <style>
        {`
          .glow-effect {
            filter: drop-shadow(0 0 5px rgba(4, 106, 56, 0.2)); /* Subtle Green glow */
          }
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Softer shadow */
          }
        `}
      </style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ scale: 1.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="flex items-center space-x-3 shrink-0"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                {/* Circular logo with transparency */}
                <img
                  src={logoIconDarkTransparent}
                  alt="AgroChain Logo Icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full bg-white p-0.5 border border-gray-100"
                />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-xl sm:text-2xl font-bold text-[#046A38] tracking-tight">{t('nav.brand')}</span> {/* ISPA Green Brand */}
                <span className="text-xs sm:text-sm font-medium text-gray-500">{t('nav.country')}</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Navigation />
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-600 hover:text-[#046A38] transition-colors duration-300" />
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="text-sm border-none bg-transparent focus:ring-0 text-gray-700 hover:text-[#046A38] transition-colors duration-300 font-medium"
              >
                <option value="en" className="text-gray-800">{language === 'en' ? 'EN' : 'እንግ'}</option>
                <option value="am" className="text-gray-800">{language === 'en' ? 'AM' : 'አማ'}</option>
              </select>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hover:text-[#046A38] transition-colors duration-300">{user?.name}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-[#046A38] text-white rounded-lg hover:bg-[#03542c] hover-lift transition-all duration-300 shadow-sm"
                >
                  {t('nav.dashboard')}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-[#046A38] transition-colors duration-300 hover-lift"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-sm font-medium transition-colors duration-300 ${location.pathname === '/login'
                  ? 'text-[#046A38]'
                  : 'text-gray-600 hover:text-[#046A38]'
                  }`}
              >
                {t('nav.login')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 transition-colors duration-300 hover-lift rounded-lg hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '65vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-3 border-t border-gray-100 bg-white backdrop-blur-md shadow-2xl"
          >
            <Navigation mobile onItemClick={() => setIsMenuOpen(false)} />
            <div className="flex items-center justify-between px-4 py-2 border-t border-teal-500/20 mt-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-white hover:text-teal-300 transition-colors duration-300" />
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-base border-none bg-transparent focus:ring-0 text-white hover:text-teal-300 transition-colors duration-300"
                >
                  <option value="en">{language === 'en' ? 'English' : 'እንግሊዝኛ'}</option>
                  <option value="am">{language === 'en' ? 'Amharic' : 'አማርኛ'}</option>
                </select>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-teal-500/20">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-white hover:text-teal-300 bg-teal-500 rounded-lg transition-colors duration-300 hover-lift"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:text-teal-300 rounded-lg transition-colors duration-300 hover-lift"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className={`block px-4 py-2 rounded-lg transition-colors duration-300 ${location.pathname === '/login'
                      ? 'bg-teal-500 text-white'
                      : 'text-white hover:text-teal-300 hover:bg-teal-600'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
