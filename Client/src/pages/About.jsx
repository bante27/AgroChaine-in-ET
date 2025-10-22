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
import AgricultureHero from '../assets/images/About.jfif';
import MakingEffort from '../assets/images/making-effort.jfif';
import AgriculturalReforms from '../assets/images/agricultural-reforms.jfif';
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
      bio: 'Expert in Ethiopian agricultural farming systems.',
      twitter: 'https://x.com/sitotaw_ti83761',
      instagram: 'https://www.instagram.com/tile1673/',
      telegram: 'https://t.me/example1',
    },
    {
      name: 'M.S Bantalem Mitiku',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/9946445/pexels-photo-9946445.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Expert in supply chain solutions.',
      twitter: 'https://twitter.com/example2',
      instagram: 'https://instagram.com/example2',
      telegram: 'https://t.me/example2',
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
      title: 'Mobile App',
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
    }, 4000); // Increased interval for better viewing
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
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
    <div className="min-h-screen font-sans text-gray-900 bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Hero Section - Sleek and modern with optimized contrast */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600/90 to-emerald-700/90">
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
              padding: '15px 25px',
              borderRadius: '20px',
            }}
          >
            AgroChain <span className="text-amber-400">Ethiopia</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-xl sm:text-2xl md:text-3xl max-w-4xl mx-auto mb-10 font-medium text-gray-800"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '15px 20px',
              borderRadius: '15px',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            Empowering Ethiopian agriculture with cutting-edge technology, transparency, and sustainable growth for farmers and communities.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.4, type: 'spring', stiffness: 100 }}
            className="flex justify-center gap-4"
          >
            <Link
              to="/login"
              className="bg-amber-400 text-teal-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-500 hover:shadow-md transition-all duration-300"
              aria-label="Get started with AgroChain"
            >
              Join Us Now
            </Link>
          </motion.div>
        </div>
        <svg className="absolute bottom-0 w-full h-20 text-amber-100" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,40 900,120 600,60 C300,0 0,40 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Journey Section: Enhanced with modern carousel and bold text */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-xl p-8 sm:p-10 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ minHeight: '450px' }}
            >
              <h2 className="text-4xl font-bold mb-6 text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text">
                Our <span className="text-amber-500">Story</span>
              </h2>
              <div className="space-y-5 text-lg text-gray-800 font-medium">
                <p>
                  AgroChain Ethiopia was born from a vision to uplift Ethiopian farmers by tackling the inefficiencies of traditional agricultural supply chains. Founded in 2025, we leverage advanced technology to bridge the gap between rural producers and global markets.
                </p>
                <p>
                  Our platform offers real-time traceability, secure logistics, and a digital marketplace, empowering farmers with fair pricing and direct buyer connections. We are committed to sustainable practices, supporting local economies, and fostering innovation in agriculture.
                </p>
                <p>
                  With a team of agricultural experts and tech innovators, AgroChain Ethiopia aims to set a new standard for agricultural transformation across Africa, ensuring prosperity for generations to come.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, type: 'spring', stiffness: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative h-[450px] w-full rounded-xl overflow-hidden shadow-lg border border-teal-300/50"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={currentStoryImage}
                  alt={`Ethiopian agriculture ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-teal-600/80 text-white rounded-full hover:bg-teal-700 transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-teal-600/80 text-white rounded-full hover:bg-teal-700 transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {storyImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentImageIndex ? 'bg-amber-500' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <svg className="w-full h-16 text-emerald-100" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Values Section - Clean and modern with subtle effects */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text">
              Our <span className="text-amber-500">Core Values</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-4 font-medium">
              The guiding principles shaping our mission for Ethiopian agriculture.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl p-6 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200"
                style={{ minHeight: '300px' }}
              >
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 text-center mb-4 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text">
                  {value.title}
                </h3>
                <p className="text-base text-gray-700 text-center leading-relaxed font-medium">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-16 text-emerald-100" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Core Services Section - Modern and responsive layout */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text">
              Our <span className="text-amber-500">Core Services</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-4 font-medium">
              Innovative solutions transforming Ethiopian agriculture.
            </p>
          </motion.div>
          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div style={{ minHeight: '350px' }}>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-teal-100 rounded-full">
                      <service.icon className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 mb-4 font-medium">{service.description}</p>
                  <div className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-teal-600" />
                        <span className="text-base text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-xl w-full h-64 object-cover shadow-md hover:shadow-lg transition duration-200"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-16 text-emerald-100" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Additional Services Section - Minimalistic and modern */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text">
              Additional <span className="text-amber-500">Features</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-4 font-medium">
              Enhancing your experience with our platform.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl p-5 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 text-center"
                style={{ minHeight: '250px' }}
              >
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <service.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-700 font-medium">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-16 text-emerald-100" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Testimonials Section - Sleek with smooth transitions */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text">
              What Our <span className="text-amber-500">Clients Say</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-4 font-medium">
              Hear from farmers and businesses who trust AgroChain Ethiopia.
            </p>
          </motion.div>
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
                className="bg-white/80 backdrop-blur-sm shadow-md rounded-xl p-6 text-center"
                style={{ minHeight: '250px' }}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-500 fill-current" />
                  ))}
                </div>
                <p className="text-base text-gray-700 italic mb-2 font-medium">" {testimonials[currentTestimonialIndex].quote} "</p>
                <p className="text-lg font-medium text-gray-900">{testimonials[currentTestimonialIndex].author}</p>
                <p className="text-sm text-gray-600">{testimonials[currentTestimonialIndex].role}</p>
              </motion.div>
            </AnimatePresence>
            <button
              onClick={() => setCurrentTestimonialIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-teal-600/80 text-white rounded-full hover:bg-teal-700 transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-teal-600/80 text-white rounded-full hover:bg-teal-700 transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <svg className="w-full h-16 text-emerald-100" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Team Section - Modern and compact */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text">
              Meet Our <span className="text-amber-500">Team</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mt-4 font-medium">
              Combining agricultural expertise with cutting-edge technology.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl p-4 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-200 text-center"
                style={{ minHeight: '400px' }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-3 object-cover ring-2 ring-amber-300"
                />
                <h3 className="text-xl font-semibold text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text mb-1">
                  {member.name}
                </h3>
                <p className="text-teal-700 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-700 mb-3 font-medium">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter className="h-5 w-5 text-gray-700 hover:text-teal-600 transition duration-200" />
                  </a>
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-5 w-5 text-gray-700 hover:text-teal-600 transition duration-200" />
                  </a>
                  <a href={member.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                    <Send className="h-5 w-5 text-gray-700 hover:text-teal-600 transition duration-200" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-16 text-emerald-100" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Call to Action Section - Minimal and modern */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: 'spring', stiffness: 80 }}
            className="text-4xl font-bold mb-6 text-gray-900 bg-gradient-to-r from-teal-600 to-emerald-700 text-transparent bg-clip-text"
          >
            Transform <span className="text-amber-500">Ethiopian Agriculture</span> Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, type: 'spring', stiffness: 80 }}
            className="text-lg mb-8 max-w-xl mx-auto text-gray-700 font-medium"
          >
            Join thousands of farmers and businesses revolutionizing agriculture with transparency and innovation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, type: 'spring', stiffness: 80 }}
            className="flex justify-center"
          >
            <Link
              to="/contact"
              className="border-2 border-teal-600 text-teal-600 px-6 py-3 rounded-lg font-medium text-base hover:bg-teal-50 hover:shadow-md transition-all duration-200"
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