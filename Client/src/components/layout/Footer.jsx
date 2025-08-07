import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import logoIconDarkTransparent from "../../assets/images/logo-icon-dark-transparent.png";

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-max section-padding mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            {/* Logo - Replicating Header's Logo Structure */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="relative">
                <img src={logoIconDarkTransparent} alt="AgroChain Logo Icon" className="h-8 w-8 object-contain" />
                {/* ET Badge */}
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-gray-900">
                  ET
                </span>
              </div>
              {/* Logo Text */}
              <div className="flex flex-col -space-y-1">
                <span className="text-xl font-bold text-white">
                  AgroChain
                </span>
                <span className="text-sm font-semibold text-emerald-400">
                  Ethiopia
                </span>
              </div>
            </Link>

            <p className="text-gray-300 leading-relaxed">
              Revolutionizing Ethiopian agriculture through technology, 
              connecting farmers directly with consumers for a transparent and 
              profitable supply chain.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Linkedin">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-blue-600 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-gray-300 hover:text-blue-600 transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-600 transition-colors">
                  KYC Verification
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-600 transition-colors">
                  Digital Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-600 transition-colors">
                  Supply Chain Management
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">Addis Ababa, Ethiopia</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">+251 985 076 701</span> {/* Updated phone number */}
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span className="text-gray-300">info@agrochain.et</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} AgroChain Ethiopia. All rights reserved. {/* Dynamic year */}
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-600 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;