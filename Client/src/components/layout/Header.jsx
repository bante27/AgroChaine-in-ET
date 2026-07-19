import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
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
  const buttonRef = useRef(null);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && buttonRef.current && !buttonRef.current.contains(event.target)) {
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={controls}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-white text-gray-800 shadow-md transition-shadow duration-300"
    >
      <style>
        {`
          .glow-effect {
            filter: drop-shadow(0 0 5px rgba(4, 106, 56, 0.2));
          }
          .hover-lift {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }
        `}
      </style>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            initial={{ scale: 1.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="flex items-center space-x-2 sm:space-x-3 shrink-0"
          >
            <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
              <div className="relative">
                <img
                  src={logoIconDarkTransparent}
                  alt="AgroChain Logo Icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
                />
              </div>
              <div className="flex flex-col -space-y-0.5 sm:-space-y-1">
                <span className="text-lg sm:text-xl font-bold text-[#046A38] tracking-tight">{t('nav.brand')}</span>
                <span className="text-[10px] sm:text-xs font-medium text-gray-500">{t('nav.country')}</span>
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
                <option value="en">EN</option>
                <option value="am">አማ</option>
              </select>
            </div>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-[#046A38] text-white rounded-lg hover:bg-[#03542c] hover-lift transition-all duration-300 shadow-sm"
                >
                  {t('nav.dashboard')}
                </Link>
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
            ref={buttonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-700 hover:text-[#046A38] hover:bg-green-50 rounded-full transition-all duration-300 z-50 relative"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden fixed left-0 right-0 top-16 sm:top-20 bg-white border-t border-gray-100 shadow-xl rounded-b-2xl z-40 overflow-y-auto max-h-[calc(100vh-4rem)]"
            >
              <div className="px-4 py-4 space-y-4">
                <Navigation mobile onItemClick={closeMenu} />

                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Globe className="h-5 w-5 text-[#046A38]" />
                      <select
                        value={language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        className="text-sm font-medium border-none bg-transparent focus:ring-0 text-gray-700 hover:text-[#046A38] cursor-pointer"
                      >
                        <option value="en">English</option>
                        <option value="am">አማርኛ</option>
                      </select>
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <Link
                        to="/dashboard"
                        className="flex items-center justify-center w-full px-4 py-3 bg-[#046A38] text-white rounded-xl hover:bg-[#03542c] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        onClick={closeMenu}
                      >
                        <User className="h-5 w-5 mr-2" />
                        {t('nav.dashboard')}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          closeMenu();
                        }}
                        className="w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors duration-300 text-center"
                      >
                        {t('nav.logout')}
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      className={`block w-full text-center px-4 py-3 rounded-xl font-bold transition-all duration-300 ${location.pathname === '/login'
                          ? 'bg-[#046A38] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-800 hover:bg-[#046A38] hover:text-white hover:shadow-lg'
                        }`}
                      onClick={closeMenu}
                    >
                      {t('nav.login')}
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;