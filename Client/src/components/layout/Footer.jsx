import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send, // for Telegram icon
} from 'lucide-react';
import logoIconDarkTransparent from '../../assets/images/newlogo.png';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white border-t border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={logoIconDarkTransparent}
                  alt="AgroChain Logo Icon"
                  className="h-10 w-10 object-contain"
                />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-gray-900">
                  ET
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-wide">
                  {t('nav.brand')}
                </span>
                <span className="text-sm font-semibold text-amber-400">
                  {t('nav.country')}
                </span>
              </div>
            </Link>

            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.about')}
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-3">
              <a
                href="https://web.facebook.com/tilahun.sitotae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-500 transition-colors"
                title={t('footer.social.facebook')}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com/sitotaw_ti83761"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-sky-400 transition-colors"
                title={t('footer.social.twitter')}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/tile1673/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-pink-500 transition-colors"
                title={t('footer.social.instagram')}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-600 transition-colors"
                title={t('footer.social.linkedin')}
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://t.me/Tile123455"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#0088cc] transition-colors"
                title={t('footer.social.telegram')}
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white bg-gray-700/60 px-4 py-2 rounded-xl shadow-inner">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('nav.marketplace')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('nav.login')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white bg-gray-700/60 px-4 py-2 rounded-xl shadow-inner">
              {t('footer.services')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/kyc"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('footer.kyc')}
                </Link>
              </li>
              <li>
                <Link
                  to="/digital-marketplace"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('footer.digitalMarket')}
                </Link>
              </li>
              <li>
                <Link
                  to="/supplychain"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('footer.supplyChain')}
                </Link>
              </li>
              <li>
                <Link
                  to="/financing"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('footer.agroFinancing')}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-amber-400 transition-colors"
                >
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white bg-gray-700/60 px-4 py-2 rounded-xl shadow-inner">
              {t('footer.contactInfo')}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-amber-400" />
                <span className="text-gray-300">{t('footer.address')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-amber-400" />
                <span className="text-gray-300">+251 985 076 701</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-amber-400" />
                <span className="text-gray-300">tilahunsitotaw87@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-400">
              © {currentYear} <span className="text-amber-400 font-semibold">{t('nav.brand')} {t('nav.country')}</span>. {t('footer.allRights')}
            </p>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                {t('footer.privacy')}
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                {t('footer.terms')}
              </Link>
              <Link
                to="/cookie"
                className="text-gray-400 hover:text-amber-400 transition-colors"
              >
                {t('footer.cookie')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
