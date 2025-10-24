import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Target,
  Award,
  Globe,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Shield,
  Truck,
  Smartphone,
  Database,
  Lock,
  CheckCircle,
  Star,
  Twitter,
  Instagram,
  Send,
} from 'lucide-react';
import LiveChat from '../components/LiveChat';

// Images
import TeffImage from '../assets/images/teff.jfif';
import EthiopiaAmharaGojjamTeff from '../assets/images/ethiopia-amhara-gojjam-teff.jfif';
import ForProduction from '../assets/images/for-production.jfif';
import AgricultureQuality from '../assets/images/agriculture-quality.jfif';
import VegProduct from '../assets/images/veg-product.jfif';
import Farmer from '../assets/images/Farmer.jfif';
import AgricultureHero from '../assets/images/Traceability-2.0-Digital-Solutions-Empowering-Agriculture.png';
import MakingEffort from '../assets/images/Digital trac.png';
import AgriculturalReforms from '../assets/images/image.png';
import IvecoGenlyonTruckImage from '../assets/images/Iveco-Genlyon-Truck.jfif';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To revolutionize Ethiopian agriculture with a transparent, efficient, and profitable supply chain ecosystem powered by technology.',
    },
    {
      icon: Users,
      title: 'Our Vision',
      description: 'To lead as Africa’s top agricultural technology platform, empowering farmers and connecting communities through innovation.',
    },
    {
      icon: Award,
      title: 'Our Values',
      description: 'Transparency, innovation, sustainability, and empowerment guide our support for Ethiopian agricultural communities.',
    },
    {
      icon: Globe,
      title: 'Our Impact',
      description: 'Driving positive change in rural communities with access to global markets and fair pricing.',
    },
  ];

  const team = [
    {
      name: 'M.S Tilahun Sitotaw',
      role: 'CEO & Founder',
      image: '../../src/assets/images/freee.jpg',
      bio: 'Agricultural Ethiopian farming systems.',
      twitter: 'https://x.com/sitotaw_ti83761',
      instagram: 'https://www.instagram.com/tile1673/',
      telegram: 'https://t.me/Tile123455',
    },
    {
      name: 'M.S Bantalem Mitiku',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/9946445/pexels-photo-9946445.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: ' supply chain solutions.',
      twitter: 'https://twitter.com/example2',
      instagram: 'https://instagram.com/example2',
      telegram: 'https://t.me/Wubbante',
    },
    {
      name: 'M.S Tegene',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/11099197/pexels-photo-11099197.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Former agricultural extension officer with deep farming expertise.',
      twitter: 'https://twitter.com/example3',
      instagram: 'https://instagram.com/example3',
      telegram: 'https://t.me/example3',
    },
  ];

  const services = [
    {
      icon: Shield,
      title: 'Enhanced Traceability',
      description: 'Track products from farm to consumer with secure, verifiable records for unmatched transparency.',
      features: [
        'Verifiable transaction records',
        'Real-time supply chain visibility',
        'Fraud prevention and authenticity verification',
        'Automated compliance reporting',
      ],
      image: AgricultureHero,
    },
    {
      icon: Truck,
      title: 'Logistics & Transport',
      description: 'Reliable transportation solutions connecting farms to markets, ensuring timely delivery.',
      features: [
        'Optimized route planning',
        'Cold chain management',
        'Fleet tracking and real-time updates',
        'Last-mile delivery coordination',
      ],
      image: IvecoGenlyonTruckImage,
    },
    {
      icon: Users,
      title: 'KYC Verification',
      description: 'Secure identity verification using Ethiopian National ID for trusted marketplace participation.',
      features: [
        'Ethiopian National ID integration',
        'Multi-level verification process',
        'Compliance with local regulations',
      ],
      image: MakingEffort,
    },
    {
      icon: Globe,
      title: 'Digital Marketplace',
      description: 'Connect farmers directly with buyers, eliminating middlemen and boosting profits.',
      features: [
        'Direct farmer-to-buyer connections',
        'Real-time price discovery',
        'Secure payment processing',
        'Multi-language support',
      ],
      image: AgriculturalReforms,
    },
  ];

  const additionalServices = [
    {
      icon: Smartphone,
      title: 'Mobile App ',
      description: '(Coming Soon) Access platform features on-the-go with our mobile application.',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Secure cloud storage and management of agricultural data.',
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Enterprise-grade security protecting all user data and transactions.',
    },
  ];

  const testimonials = [
    {
      quote: 'AgroChain has transformed how we sell our crops, connecting us directly to buyers and ensuring fair prices.',
      author: 'Abebe Kebede',
      role: 'Farmer, Amhara Region',
    },
    {
      quote: 'The traceability feature gives our customers confidence in the authenticity of our products.',
      author: 'Selamawit Tadesse',
      role: 'Agricultural Cooperative Manager',
    },
    {
      quote: 'The logistics solutions have streamlined our supply chain, saving time and reducing costs.',
      author: 'Yonas Alemayehu',
      role: 'Market Distributor',
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % storyImages.length);
    }, 3000);
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => {
      clearInterval(imageInterval);
      clearInterval(testimonialInterval);
    };
  }, []);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + storyImages.length) % storyImages.length);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % storyImages.length);
  };

  const storyImages = [
    TeffImage,
    EthiopiaAmharaGojjamTeff,
    ForProduction,
    AgricultureQuality,
    VegProduct,
    Farmer,
  ];

  const currentStoryImage = storyImages[currentImageIndex];

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-br from-green-100 to-emerald-200">
      {/* Hero Section - Enhanced Attractive Design with Improved Text Visibility */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950  animate-gradient-shift">
        <div className="relative z-10 text-center max-w-7xl mx-auto px-10 sm:px-12 lg:px-16 py-24">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.8, type: 'spring', stiffness: 120 }}
            className="text-6xl sm:text-7xl md:text-8xl font-extrabold mb-12 leading-tight tracking-wider"
            style={{
              background: 'linear-gradient(45deg, #ffffff, #000000, #f59e0b)', /* Stronger contrast with black */
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 6px 15px rgba(0, 0, 0, 0.7)', /* Darker shadow for better visibility */
              clipPath: 'polygon(10% 0%, 90% 0%, 100% 90%, 50% 100%, 0% 90%)',
              padding: '25px 40px',
              borderRadius: '30px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)', /* Added solid background */
            }}
          >
            AgroChain <span className="text-yellow-300">Ethiopia</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.4, type: 'spring', stiffness: 120 }}
            className="text-2xl sm:text-3xl md:text-4xl max-w-5xl mx-auto mb-16"
            style={{
              background: 'rgba(255, 255, 255, 0.95)', /* Increased opacity for better contrast */
              padding: '20px 35px',
              borderRadius: '25px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
              clipPath: 'polygon(10% 10%, 90% 0%, 100% 90%, 50% 100%, 0% 90%)',
              color: '#1a202c', /* Darker text color for visibility */
            }}
          >
            Empowering Ethiopian agriculture with cutting-edge technology, transparency, and sustainable growth for farmers and communities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, delay: 0.6, type: 'spring', stiffness: 120 }}
            className="flex justify-center gap-6"
          >
            <Link
              to="/login"
              className="bg-yellow-400 text-teal-900 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-yellow-500 hover:shadow-lg transition-all duration-300 hover:scale-105"
              aria-label="Get started with AgroChain"
            >
              Join Us Now
            </Link>
          </motion.div>
        </div>
        <svg className="absolute bottom-0 w-full h-32 text-yellow-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,40 900,120 600,60 C300,0 0,40 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Journey Section: Enhanced About Us Content */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-2xl p-12 sm:p-14 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '450px' }} /* Increased minHeight */
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-10 gradient-text">
                Our <span className="text-amber-500">Story</span>
              </h2>
              <div className="space-y-6 text-lg sm:text-xl text-gray-950">
                <p>
                  AgroChain Ethiopia was born from a vision to uplift Ethiopian farmers by tackling the inefficiencies of traditional agricultural supply chains. Founded in 2025, we leverage advanced technology to bridge the gap between rural producers and global markets.
                </p>
                <p>
                  Our platform offers real-time traceability, secure logistics, and a digital marketplace, empowering  farmers with fair pricing and direct buyer connections. We are committed to sustainable practices, supporting local economies, and fostering innovation in agriculture.
                </p>
                <p>
                  With a team of agricultural experts and tech innovators, AgroChain Ethiopia aims to set a new standard for agricultural transformation across Africa, ensuring prosperity for generations to come.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative h-[450px] w-full rounded-2xl overflow-hidden shadow-xl border-2 border-teal-300"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={currentStoryImage}
                  alt={`Ethiopian agriculture ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-2xl"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1.2 }}
                />
              </AnimatePresence>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {storyImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-amber-500 scale-150' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Values Section - Refined Curved Design with Better Visibility */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-2xl p-12" /* Increased padding */
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'linear-gradient(135deg, #ffffff, #10b981)', boxShadow: '0 12px 25px rgba(0, 0, 0, 0.15)' }}>
              Our <span className="gradient-text">Core Values</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">
              The guiding principles shaping our mission for Ethiopian agriculture.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl p-10 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '350px' }} /* Increased minHeight */
              >
                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-6">{value.title}</h3>
                <p className="text-lg sm:text-xl text-gray-600 text-center leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Core Services Section - Enhanced Layout with Improved Visibility */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-2xl p-12" /* Increased padding */
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'linear-gradient(135deg, #10b981, #3b82f6)', boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)' }}>
              Our <span className="gradient-text">Core Services</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">
              Innovative solutions transforming Ethiopian agriculture.
            </p>
          </motion.div>
          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div 
                  className={`${index % 2 === 1 ? 'lg:col-start-2 order-2 lg:order-1' : 'order-1'} rounded-2xl p-10 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500`}
                  style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '350px' }} /* Increased minHeight */
                >
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="p-5 bg-teal-100 rounded-full animate-pulse-slow" style={{ boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                      <service.icon className="h-10 w-10 text-teal-600" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 gradient-text">{service.title}</h3>
                  </div>
                  <p className="text-xl sm:text-2xl text-gray-900 mb-8 leading-relaxed" style={{ minHeight: '150px' }} /* Increased minHeight, darker text */
                  >{service.description}</p>
                  <div className="space-y-5 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-4">
                        <CheckCircle className="h-7 w-7 text-teal-600 flex-shrink-0" />
                        <span className="text-lg sm:text-xl text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1 order-1 lg:order-2' : 'order-2'}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-2xl w-full h-96 object-cover shadow-xl border-2 border-amber-300 hover:shadow-2xl transition duration-300"
                    style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Additional Services Section - Improved Design */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-2xl p-10" /* Increased padding */
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}>
              Additional <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">
              Enhancing your experience with our platform.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl p-8 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '300px' }} /* Increased minHeight */
              >
                <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Testimonials Section - Polished Layout */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-2xl p-10" /* Increased padding */
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}>
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">
              Hear from farmers and businesses who trust AgroChain Ethiopia.
            </p>
          </motion.div>
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
                className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '300px' }} /* Increased minHeight */
              >
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg sm:text-xl text-gray-700 italic mb-6">" {testimonials[currentTestimonialIndex].quote} "</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{testimonials[currentTestimonialIndex].author}</p>
                <p className="text-sm text-gray-600">{testimonials[currentTestimonialIndex].role}</p>
              </motion.div>
            </AnimatePresence>
            <button
              onClick={() => setCurrentTestimonialIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Team Section - Elegant Design */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight rounded-2xl p-10" /* Increased padding */
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}>
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mt-4">
              Combining agricultural expertise with cutting-edge technology.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl p-8 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '450px' }} /* Increased minHeight */
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-40 h-40 rounded-full mx-auto mb-6 object-cover ring-4 ring-amber-200"
                />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-4">{member.role}</p>
                <p className="text-sm sm:text-base text-gray-600 mb-6">{member.bio}</p>
                <div className="flex justify-center gap-6">
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter className="h-7 w-7 text-gray-700 hover:text-teal-600 transition duration-300 hover:scale-110" />
                  </a>
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-7 w-7 text-gray-700 hover:text-teal-600 transition duration-300 hover:scale-110" />
                  </a>
                  <a href={member.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                    <Send className="h-7 w-7 text-gray-700 hover:text-teal-600 transition duration-300 hover:scale-110" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Call to Action Section - Premium Design */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            className="text-4xl sm:text-5xl font-extrabold mb-8 rounded-2xl p-10" /* Increased padding */
            style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'rgba(255, 255, 255, 0.9)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)' }}
          >
            Transform <span className="gradient-text">Ethiopian Agriculture</span> Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, type: 'spring', stiffness: 100 }}
            className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
          >
            Join thousands of farmers and businesses revolutionizing agriculture with transparency and innovation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6, type: 'spring', stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-8 justify-center"
          >
            <Link
              to="/contact"
              className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-teal-50 hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-4"
              aria-label="Contact our sales team"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Live Chat Component */}
      <LiveChat />
    </div>
  );
};

export default About;