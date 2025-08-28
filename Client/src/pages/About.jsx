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
import AppleTree from '../assets/images/AppleTree.jfif';
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
      bio: 'Agricultural economist with 15+ years in Ethiopian farming systems.',
      twitter: 'https://twitter.com/example1',
      instagram: 'https://instagram.com/example1',
      telegram: 'https://t.me/example1',
    },
    {
      name: 'Bantalem Mitiku',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/9946445/pexels-photo-9946445.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Software engineer specializing in supply chain solutions.',
      twitter: 'https://twitter.com/example2',
      instagram: 'https://instagram.com/example2',
      telegram: 'https://t.me/example2',
    },
    {
      name: 'Kebede Worku',
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
        'Biometric verification support',
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
      description: 'Access platform features on-the-go with our mobile application.',
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
    <div className="min-h-screen font-sans text-amber-800 bg-sky-50">
      {/* Hero Section - Polished Curved Triangular Design */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="relative z-10 text-center max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-8 leading-tight tracking-wide"
            style={{
              clipPath: 'polygon(5% 0%, 95% 0%, 100% 85%, 50% 100%, 0% 85%)',
              color: '#1e293b', // Dark gray for visibility on white background
              padding: '20px 30px',
              borderRadius: '25px',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
            }}
          >
            AgroChain <span className="text-gray-600">Ethiopia</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto mb-10"
            style={{
              clipPath: 'polygon(5% 15%, 95% 0%, 100% 85%, 50% 100%, 0% 85%)',
              color: '#475569', // Medium gray for visibility
              padding: '12px 25px',
              borderRadius: '20px',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            }}
          >
            Empowering Ethiopian agriculture with innovative, transparent solutions.
          </motion.p>
        </div>
      </section>

      {/* Journey Section: Enhanced Image Carousel */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-xl p-10 bg-white shadow-xl"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
                Our <span className="text-emerald-600">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-950">
                <p>
                  AgroChain Ethiopia was founded to empower farmers by addressing inefficiencies in traditional supply chains.
                </p>
                <p>
                  Using cutting-edge technology, we connect farmers to markets, ensure fair pricing, and provide traceability.
                </p>
                <p>
                  Our mission is to transform agriculture into a sustainable, profitable ecosystem for all stakeholders.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative h-[450px] w-full rounded-xl overflow-hidden shadow-xl"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={currentStoryImage}
                  alt={`Ethiopian agriculture ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 1.2 }}
                />
              </AnimatePresence>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition duration-300"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {storyImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-4 h-4 rounded-full transition duration-300 ${index === currentImageIndex ? 'bg-teal-400 scale-150' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section - Refined Curved Design */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-xl p-6"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: '#f9fafb' }}>
              Our <span className="text-emerald-600">Core Values</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mt-6">
              The principles driving our commitment to Ethiopian agriculture.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl p-8 bg-white shadow-lg hover:shadow-2xl transition duration-300"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
              >
                <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">{value.title}</h3>
                <p className="text-base text-gray-600 text-center leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services Section - Enhanced Layout */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-xl p-6"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: '#f9fafb' }}>
              Our <span className="text-emerald-600">Core Services</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mt-6">
              Innovative solutions transforming Ethiopian agriculture.
            </p>
          </motion.div>
          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2 order-2 lg:order-1' : 'order-1'} style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-4 bg-emerald-100 rounded-full">
                      <service.icon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-lg text-gray-700 mb-6 leading-loose">{service.description}</p>
                  <div className="space-y-4 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1 order-1 lg:order-2' : 'order-2'}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-xl w-full h-96 object-cover shadow-xl"
                    style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services Section - Improved Design */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-xl p-6"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: '#f9fafb' }}>
              Additional <span className="text-emerald-600">Features</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mt-6">
              Enhancing your experience with our platform.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl p-8 bg-white shadow-lg hover:shadow-2xl transition duration-300 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
              >
                <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <service.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-base text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Polished Layout */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-xl p-6"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: '#f9fafb' }}>
              What Our <span className="text-emerald-600">Clients Say</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mt-6">
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
                transition={{ duration: 0.8 }}
                className="bg-white shadow-xl rounded-xl p-10 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
              >
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-lg sm:text-xl text-gray-700 italic mb-6">" {testimonials[currentTestimonialIndex].quote} "</p>
                <p className="text-base font-semibold text-gray-900">{testimonials[currentTestimonialIndex].author}</p>
                <p className="text-sm text-gray-600">{testimonials[currentTestimonialIndex].role}</p>
              </motion.div>
            </AnimatePresence>
            <button
              onClick={() => setCurrentTestimonialIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Team Section - Elegant Design */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight rounded-xl p-6"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: '#f9fafb' }}>
              Our <span className="text-emerald-600">Team</span>
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mt-4">
              Combining agricultural expertise with cutting-edge technology.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl p-8 bg-white shadow-lg hover:shadow-2xl transition duration-300 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-40 h-40 rounded-full mx-auto mb-6 object-cover ring-4 ring-emerald-100"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-emerald-600 font-medium mb-4">{member.role}</p>
                <p className="text-sm text-gray-600 mb-6">{member.bio}</p>
                <div className="flex justify-center gap-6">
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <Twitter className="h-7 w-7 text-gray-700 hover:text-emerald-600 transition duration-300" />
                  </a>
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-7 w-7 text-gray-700 hover:text-emerald-600 transition duration-300" />
                  </a>
                  <a href={member.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                    <Send className="h-7 w-7 text-gray-700 hover:text-emerald-600 transition duration-300" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section - Premium Design */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-4xl sm:text-5xl font-extrabold mb-8 rounded-xl p-6"
            style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: '#f9fafb' }}
          >
            Transform <span className="text-emerald-600">Ethiopian Agriculture</span> Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
          >
            Join thousands of farmers and businesses revolutionizing agriculture with transparency and innovation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row gap-8 justify-center"
          >
            <Link
              to="/login"
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-300 inline-flex items-center gap-4"
              aria-label="Get started with AgroChain"
            >
              Get Started Now
              <ArrowRight className="h-6 w-6" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 hover:shadow-xl transition-all duration-300 inline-flex items-center gap-4"
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