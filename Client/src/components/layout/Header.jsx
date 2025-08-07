import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { Menu, X, User, Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Navigation from './Navigation';
import logoIconDarkTransparent from "../../assets/images/logo1.png";

const Header = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const { isAuthenticated, user, logout } = useAuth();
      const { language, changeLanguage, t } = useLanguage();
      const location = useLocation();

      // Animation Controls
      const controls = useAnimation();

      useEffect(() => {
        controls.start({ opacity: 1, y: 0 });
      }, [controls]);

        const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={controls}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-gradient-to-r from-blue-950 to-blue-950 text-gray-200 hover:text-blue-600 shadow"
  >

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <img src={logoIconDarkTransparent} alt="AgroChain Logo Icon" className="h-10 w-10 object-contain" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-blaack text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                  ET
                </span>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-bold text-gray-200 hover:text-blue-600">AgroChain</span>
                <span className="text-sm font-semibold text-gray-200 hover:text-blue-600">Ethiopia</span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Navigation />
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-gray-200 hover:text-blue-600" />
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="text-sm border-none bg-transparent focus:ring-0 text-gray-200  hover:text-blue-600"
              >
                <option value="en">EN</option>
                <option value="am">አማ</option>
                <option value="om">OM</option>
                <option value="ti">ትግ</option>
                <option value="ar">عربي</option>
                <option value="es">ES</option>
              </select>
            </div>
            {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-black" />
                    <span className="text-sm font-medium text-black">{user?.name}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-emerald-600 text-black rounded-lg hover:bg-emerald-700 transition-colors duration-300"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm text-black hover:text-blue-400 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                      to="/login"
                      className={`text-sm font-medium transition-colors duration-200 ${
                        location.pathname === '/login'
                          ? 'text-blue-600'
                          : 'text-gray-200 hover:text-blue-600'
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
            className="md:hidden p-2 rounded-lg hover:bg-white/20 bg-white/10 text-black"
            aria-label="Toggle mobile menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden py-4 border-t border-gray-200/20 dark:border-gray-700/20 bg-purple-950 backdrop-blur-md"
          >
            <Navigation mobile onItemClick={() => setIsMenuOpen(false)} />
            <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200/20 dark:border-gray-700/20 mt-4">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-gray-200 hover:text-blue-600" />
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="text-base border-none bg-transparent focus:ring-0 text-gray-200  hover:text-blue-600"
                >
                  <option value="en">English</option>
                  <option value="am">አማርኛ</option>
                  <option value="om">Afan Oromo</option>
                  <option value="ti">ትግርኛ</option>
                  <option value="ar">العربية</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-gray-700/20">
              {isAuthenticated ? (
                            <div className="space-y-2">
                              <Link
                                to="/dashboard"
                                className="block px-4 py-2 text-black hover:bg-blue-500/20 rounded-lg transition-colors duration-300"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                Dashboard
                              </Link>
                              <button
                                onClick={() => {
                                  logout();
                                  setIsMenuOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-black hover:bg-blue-500/20 rounded-lg transition-colors duration-300"
                              >
                                Logout
                              </button>
                            </div>
                          ) : 
                          (
                              <div className="space-y-2">
                              <Link
                                    to="/login"
                                    className={`block px-4 py-2 rounded-lg transition-colors duration-300 ${
                                      location.pathname === '/login'
                                        ? 'bg-emerald-100 text-blue-600 dark:bg-emerald-700 dark:text-white'
                                        : 'text-gray-200 hover:text-blue-600 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    {t('nav.login')}
                                </Link>

                              </div>
                          )
              
                   }
            
            
           </div>
          
         </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;