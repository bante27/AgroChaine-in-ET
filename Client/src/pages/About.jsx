import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
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
  Cloud,
  Thermometer,
  Wind,
  Droplet,
  MapPin,
  Sun,
  CloudRain,
  AlertCircle,
} from 'lucide-react';
import { API_URL } from '../utils/apiConfig';

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
  const { t } = useLanguage();
  const values = [
    {
      icon: Target,
      title: t('about.mission.title'),
      description: t('about.mission.desc'),
    },
    {
      icon: Users,
      title: t('about.vision.title'),
      description: t('about.vision.desc'),
    },
    {
      icon: Award,
      title: t('about.values.title'),
      description: t('about.values.desc'),
    },
    {
      icon: Globe,
      title: t('about.impact.title'),
      description: t('about.impact.desc'),
    },
  ];

  const team = [
    {
      name: 'M.S Tilahun Sitotaw',
      role: t('about.team.tilahun.role'),
      image: '../../src/assets/images/freee.jpg',
      bio: t('about.team.tilahun.bio'),
      twitter: 'https://x.com/sitotaw_ti83761',
      instagram: 'https://www.instagram.com/tile1673/',
      telegram: 'https://t.me/Tile123455',
    },
    {
      name: 'M.S Bantalem Mitiku',
      role: t('about.team.bantalem.role'),
      image: 'https://images.pexels.com/photos/9946445/pexels-photo-9946445.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: t('about.team.bantalem.bio'),
      twitter: 'https://twitter.com/example2',
      instagram: 'https://instagram.com/example2',
      telegram: 'https://t.me/Wubbante',
    },
    {
      name: 'M.S Tegene',
      role: t('about.team.tegene.role'),
      image: 'https://images.pexels.com/photos/11099197/pexels-photo-11099197.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: t('about.team.tegene.bio'),
      twitter: 'https://twitter.com/example3',
      instagram: 'https://instagram.com/example3',
      telegram: 'https://t.me/example3',
    },
  ];

  const services = [
    {
      icon: Shield,
      title: t('about.services.traceability.title'),
      description: t('about.services.traceability.desc'),
      features: [
        t('about.services.traceability.f1'),
        t('about.services.traceability.f2'),
        t('about.services.traceability.f3'),
        t('about.services.traceability.f4'),
      ],
      image: AgricultureHero,
    },
    {
      icon: Truck,
      title: t('about.services.logistics.title'),
      description: t('about.services.logistics.desc'),
      features: [
        t('about.services.logistics.f1'),
        t('about.services.logistics.f2'),
        t('about.services.logistics.f3'),
        t('about.services.logistics.f4'),
      ],
      image: IvecoGenlyonTruckImage,
    },
    {
      icon: Users,
      title: t('about.services.kyc.title'),
      description: t('about.services.kyc.desc'),
      features: [
        t('about.services.kyc.f1'),
        t('about.services.kyc.f2'),
        t('about.services.kyc.f3'),
      ],
      image: MakingEffort,
    },
    {
      icon: Globe,
      title: t('about.services.marketplace.title'),
      description: t('about.services.marketplace.desc'),
      features: [
        t('about.services.marketplace.f1'),
        t('about.services.marketplace.f2'),
        t('about.services.marketplace.f3'),
        t('about.services.marketplace.f4'),
      ],
      image: AgriculturalReforms,
    },
  ];

  const additionalServices = [
    {
      icon: Smartphone,
      title: t('about.services.additional.mobile.title'),
      description: t('about.services.additional.mobile.desc'),
    },
    {
      icon: Database,
      title: t('about.services.additional.data.title'),
      description: t('about.services.additional.data.desc'),
    },
    {
      icon: Lock,
      title: t('about.services.additional.security.title'),
      description: t('about.services.additional.security.desc'),
    },
  ];

  const testimonials = [
    {
      quote: t('about.testimonials.t1.quote'),
      author: t('about.testimonials.t1.author'),
      role: t('about.testimonials.t1.role'),
    },
    {
      quote: t('about.testimonials.t2.quote'),
      author: t('about.testimonials.t2.author'),
      role: t('about.testimonials.t2.role'),
    },
    {
      quote: t('about.testimonials.t3.quote'),
      author: t('about.testimonials.t3.author'),
      role: t('about.testimonials.t3.role'),
    },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [userCity, setUserCity] = useState('Addis Ababa'); // Default

  // All major Ethiopian places
  // All major Ethiopian places (fixed spellings, no trailing spaces, added more)
  const locations = [
    'Addis Ababa',
    'Bahir Dar',
    'Debre Markos',
    'Mek\'ele',
    'Gondar',
    'Hawassa',
    'Jimma',
    'Dire Dawa',
    'Harar',
    'Adama',
    'Dessie',
    'Aksum',
    'Lalibela',
    'Jijiga',
    'Semera',
    'Gambela',
    'Arba Minch',
    'Asosa',
    'Shashamane', // Added
  ];

  // Define fetchWeather at the component level with useCallback for memoization
  const fetchWeather = useCallback(async (city) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const response = await fetch(`${API_URL}/api/weather?city=${encodeURIComponent(city)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setWeather(data.weather);
      } else {
        setWeatherError(data.error);
      }
    } catch (err) {
      setWeatherError('Failed to load weather data');
      console.error(err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []); // Empty deps: only created once

  // Define getUserLocation at the component level
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`${API_URL}/api/weather?lat=${latitude}&lon=${longitude}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.success) {
              setWeather(data.weather);
              setUserCity(data.weather.city);
              setSelectedLocation(data.weather.city);
            } else {
              setWeatherError(data.error);
            }
          } catch (err) {
            setWeatherError('Failed to load weather data');
            console.error(err);
          } finally {
            setIsLoadingWeather(false);
          }
        },
        (err) => {
          setWeatherError('Geolocation denied. Using default.');
          fetchWeather('Addis Ababa');
        }
      );
    } else {
      setWeatherError('Geolocation not supported.');
      fetchWeather('Addis Ababa');
    }
  };

  // First useEffect: intervals and initial location fetch
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % storyImages.length);
    }, 3000);
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    getUserLocation(); // Call the function (now defined outside)

    return () => {
      clearInterval(imageInterval);
      clearInterval(testimonialInterval);
    };
  }, []); // Note: fetchWeather not in deps since it's memoized

  // Second useEffect: fetch on city selection change
  useEffect(() => {
    if (selectedLocation && selectedLocation !== userCity) {
      fetchWeather(selectedLocation);
    }
  }, [selectedLocation, userCity, fetchWeather]); // Add fetchWeather as dep

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

  // Get background gradient based on condition
  const getBackground = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return 'from-yellow-100 to-blue-200';
      case 'clouds':
        return 'from-gray-200 to-blue-300';
      case 'rain':
        return 'from-blue-200 to-gray-300';
      default:
        return 'from-teal-50 to-emerald-100';
    }
  };

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
            {t('about.titlePart1')} <span className="text-yellow-300">{t('about.titlePart2')}</span>
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
            {t('about.subtitle')}
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
              {t('joinNow')}
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
                {t('about.story.titlePart1') || t('about.story.title').split(' ')[0]} <span className="text-amber-500">{t('about.story.titlePart2') || t('about.story.title').split(' ').slice(1).join(' ')}</span>
              </h2>
              <div className="space-y-6 text-lg sm:text-xl text-gray-950">
                <p>
                  {t('about.story.p1')}
                </p>
                <p>
                  {t('about.story.p2')}
                </p>
                <p>
                  {t('about.story.p3')}
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
                  alt={t('about.story.title')}
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
              {t('about.values.titlePart1') || t('about.values.title').split(' ')[0]} <span className="gradient-text">{t('about.values.titlePart2') || t('about.values.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">
              {t('about.values.desc')}
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
              {t('about.services.titlePart1') || t('about.services.title').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('about.services.titlePart2') || t('about.services.title').split(' ').slice(-1)}</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">
              {t('about.services.subtitle')}
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
              {t('about.services.additional.titlePart1') || 'Additional'} <span className="gradient-text">{t('about.services.additional.titlePart2') || 'Features'}</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">
              {t('about.services.additional.subtitle')}
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
              {t('about.testimonials.title').split(' ').slice(0, -2).join(' ')} <span className="gradient-text">{t('about.testimonials.title').split(' ').slice(-2).join(' ')}</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">
              {t('about.testimonials.subtitle')}
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
              {t('about.team.title').split(' ')[0]} <span className="gradient-text">{t('about.team.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mt-4">
              {t('about.team.subtitle')}
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

      {/* Modern & Attractive Weather Section with Real Fetch */}
      <section className={`py-20 bg-gradient-to-br ${getBackground(weather?.condition)} rounded-3xl mx-4 md:mx-0 shadow-2xl relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20" style={{ background: 'url("https://source.unsplash.com/random/1920x1080/?weather,ethiopia") no-repeat center center / cover' }}></div>
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 drop-shadow-md">
              {t('Real time weather')} <span className="text-teal-600">{selectedLocation || userCity}</span>
            </h2>
            <p className="text-xl text-gray-700 mb-6 drop-shadow-sm">{t('weather')}</p>
            <div className="flex justify-center items-center gap-4">
              <MapPin className="h-6 w-6 text-teal-600 animate-pulse" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="p-3 bg-white/80 backdrop-blur-md border border-teal-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition hover:scale-105"
              >
                <option value="">Use Current Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
          {isLoadingWeather ? (
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block h-12 w-12 border-4 border-teal-600 border-t-transparent rounded-full mb-4"
              ></motion.div>
              <p className="text-gray-600 font-medium drop-shadow">{t('about.weather.detecting')}</p>
            </div>
          ) : weatherError ? (
            <div className="text-center p-8 bg-red-50/80 backdrop-blur-md rounded-2xl border border-red-200 shadow-inner">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
              <p className="text-red-600 font-medium mb-4">{weatherError}</p>
              <button
                onClick={() => fetchWeather(selectedLocation || userCity)}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 hover:scale-105"
              >
                {t('about.weather.retry')}
              </button>
            </div>
          ) : weather ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto"
            >
              {/* Condition Card - Animated Icon */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center hover:shadow-2xl transition-all duration-300 col-span-1 md:col-span-1">
                <motion.img
                  src={weather.icon}
                  alt={weather.condition}
                  className="mx-auto w-32 h-32 mb-6" // Increased size for clearer visibility
                />
                <h3 className="text-3xl font-bold text-teal-800 mb-2">{weather.condition}</h3>
                <p className="text-xl text-gray-700 capitalize font-semibold">{weather.description}</p>
              </div>

              {/* Temperature Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center hover:shadow-2xl transition-all duration-300">
                <Thermometer className="h-12 w-12 mx-auto mb-4 text-orange-600" />
                <h3 className="text-3xl font-bold text-orange-800">{weather.temperature}°C</h3>
                <p className="text-gray-700">{t('about.weather.feelsLike')} {weather.feelsLike}°C</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-red-600 flex items-center"><Sun className="h-4 w-4 mr-1" /> {t('about.weather.high')}: {weather.high}°C</span>
                  <span className="text-blue-600 flex items-center"><Cloud className="h-4 w-4 mr-1" /> {t('about.weather.low')}: {weather.low}°C</span>
                </div>
              </div>

              {/* Humidity Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center hover:shadow-2xl transition-all duration-300">
                <Droplet className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-3xl font-bold text-blue-800">{weather.humidity}%</h3>
                <p className="text-gray-700">{t('about.weather.humidity')}</p>
              </div>

              {/* Wind Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center hover:shadow-2xl transition-all duration-300">
                <Wind className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <h3 className="text-3xl font-bold text-gray-800">{weather.windSpeed} m/s</h3>
                <p className="text-gray-700">{t('about.weather.windSpeed')}</p>
              </div>

              {/* Precipitation & Tip Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg text-center hover:shadow-2xl transition-all duration-300 col-span-1 md:col-span-2 lg:col-span-1">
                <CloudRain className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-3xl font-bold text-green-800">{weather.precipitation || 0} mm</h3>
                <p className="text-gray-700">{t('about.weather.precipitation')}</p>
                <p className="mt-4 text-sm text-gray-600 font-medium">{t('about.weather.tip')}</p>
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-gray-600 text-xl">No weather data available.</p>
          )}
          <p className="text-center text-sm text-gray-500 mt-8">{t('about.weather.updateInfo')}</p>
        </div>
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
            {t('about.cta.title').split(' ').slice(0, -2).join(' ')} <span className="gradient-text">{t('about.cta.title').split(' ').slice(-2).join(' ')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, type: 'spring', stiffness: 100 }}
            className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto"
          >
            {t('about.cta.subtitle')}
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
              aria-label={t('about.cta.contactSales')}
            >
              {t('about.cta.contactSales')}
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;