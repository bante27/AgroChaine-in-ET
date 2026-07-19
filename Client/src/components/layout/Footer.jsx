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
  Send,
} from 'lucide-react';
import logoIconDarkTransparent from '../../assets/images/newlogo.png';
import { useLanguage } from '../../contexts/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-b from-gray-800 via-gray-900 to-black text-white border-t border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* 2 columns on mobile, 4 on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          
          {/* Column 1 - Company Info */}
          <div className="space-y-3 sm:space-y-5 text-center sm:text-left">
            <Link to="/" className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
              <div className="relative">
                <img src={logoIconDarkTransparent} alt="AgroChain Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" />
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center border border-gray-900">ET</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-white tracking-wide">{t('nav.brand')}</span>
                <span className="text-xs sm:text-sm font-semibold text-amber-400">{t('nav.country')}</span>
              </div>
            </Link>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">{t('footer.about')}</p>
            <div className="flex justify-center sm:justify-start space-x-3 sm:space-x-4 mt-2 sm:mt-3">
              <a href="https://web.facebook.com/tilahun.sitotae" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500"><Facebook className="h-4 w-4 sm:h-5 sm:w-5" /></a>
              <a href="https://x.com/sitotaw_ti83761" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-sky-400"><Twitter className="h-4 w-4 sm:h-5 sm:w-5" /></a>
              <a href="https://www.instagram.com/tile1673/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-pink-500"><Instagram className="h-4 w-4 sm:h-5 sm:w-5" /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-600"><Linkedin className="h-4 w-4 sm:h-5 sm:w-5" /></a>
              <a href="https://t.me/Tile123455" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#0088cc]"><Send className="h-4 w-4 sm:h-5 sm:w-5" /></a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-white bg-gray-700/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl inline-block shadow-inner mx-auto sm:mx-0">{t('footer.quickLinks')}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link to="/about" className="text-gray-300 hover:text-amber-400">{t('nav.about')}</Link></li>
              <li><Link to="/marketplace" className="text-gray-300 hover:text-amber-400">{t('nav.marketplace')}</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-amber-400">{t('footer.contactSales')}</Link></li>
              <li><button onClick={() => window.openChat && window.openChat()} className="text-gray-300 hover:text-amber-400">{t('footer.chatUs')}</button></li>
              <li><Link to="/login" className="text-gray-300 hover:text-amber-400">{t('nav.login')}</Link></li>
            </ul>
          </div>

          {/* Column 3 - Services */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-white bg-gray-700/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl inline-block shadow-inner mx-auto sm:mx-0">{t('footer.services')}</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link to="/kyc" className="text-gray-300 hover:text-amber-400">{t('footer.kyc')}</Link></li>
              <li><Link to="/digital-marketplace" className="text-gray-300 hover:text-amber-400">{t('footer.digitalMarket')}</Link></li>
              <li><Link to="/supplychain" className="text-gray-300 hover:text-amber-400">{t('footer.supplyChain')}</Link></li>
              <li><Link to="/financing" className="text-gray-300 hover:text-amber-400">{t('footer.agroFinancing')}</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-amber-400">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-semibold text-white bg-gray-700/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl inline-block shadow-inner mx-auto sm:mx-0">{t('footer.contactInfo')}</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <span className="text-gray-300">{t('footer.address')}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <span className="text-gray-300">+251 985 076 701</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <a href="mailto:agrochainethiopia@gmail.com" className="text-gray-300 hover:text-amber-400 break-all">agrochainethiopia@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-10 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs sm:text-sm gap-3">
            <p className="text-gray-400 text-center">© {currentYear} <span className="text-amber-400 font-semibold">{t('nav.brand')} {t('nav.country')}</span>. {t('footer.allRights')}</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link to="/privacy" className="text-gray-400 hover:text-amber-400 text-xs sm:text-sm">{t('footer.privacy')}</Link>
              <Link to="/terms" className="text-gray-400 hover:text-amber-400 text-xs sm:text-sm">{t('footer.terms')}</Link>
              <Link to="/cookie" className="text-gray-400 hover:text-amber-400 text-xs sm:text-sm">{t('footer.cookie')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;