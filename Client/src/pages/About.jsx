import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Users, Target, Award, Globe, ChevronLeft, ChevronRight,
  ArrowRight, Shield, Truck, Smartphone, Database, Lock,
  CheckCircle, Star, Twitter, Instagram, Send, Cloud,
  Thermometer, Wind, Droplet, MapPin, Sun, CloudRain, AlertCircle,
} from 'lucide-react';
import { API_URL } from '../utils/apiConfig';

// Original story images
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

// Hero scroll images
import AboutCropImage from '../assets/images/About crop image.jpg';
import AboutPng from '../assets/images/About.png';
import ManImageForCrop from '../assets/images/Man image for crop.jpg';
import AboutImagePng from '../assets/images/About image.png';
import ManForFax from '../assets/images/man for fax.jpg';
import PesticideImage from '../assets/images/pesticide.jpg';
import CropOneImage from '../assets/images/Crop one.jpg';
import FarmerJpg from '../assets/images/Farmer.jpg';
import FarmingOnePng from '../assets/images/Farming one.png';
import PlagingManImage from '../assets/images/Plaging man.jpg';

// Team Images
import TilahunImage from '../assets/images/M.S Tilahun Sitotaw.jpg';
import BantalemImage from '../assets/images/M.S Bantalem Mitiku.jpg';
import TegeneImage from '../assets/images/M.S Tegene.jpg';

const heroImages = [
  AboutCropImage,
  AboutPng,
  ManImageForCrop,
  AboutImagePng,
  ManForFax,
  PesticideImage,
  CropOneImage,
  FarmerJpg,
  FarmingOnePng,
  PlagingManImage,
];

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Target, title: t('about.mission.title'), description: t('about.mission.desc') },
    { icon: Users, title: t('about.vision.title'), description: t('about.vision.desc') },
    { icon: Award, title: t('about.values.title'), description: t('about.values.desc') },
    { icon: Globe, title: t('about.impact.title'), description: t('about.impact.desc') },
  ];

  // Team: names now come from translations (without M.S prefix)
  const team = [
    {
      name: t('about.team.tilahun.name') || 'Tilahun Sitotaw',
      role: t('about.team.tilahun.role'),
      image: TilahunImage,
      bio: t('about.team.tilahun.bio'),
      twitter: 'https://x.com/sitotaw_ti83761',
      instagram: 'https://www.instagram.com/tile1673/',
      telegram: 'https://t.me/Tile123455',
    },
    {
      name: t('about.team.bantalem.name') || 'Bantalem Mitiku',
      role: t('about.team.bantalem.role'),
      image: BantalemImage,
      bio: t('about.team.bantalem.bio'),
      twitter: 'https://x.com/sitotaw_ti83761',
      instagram: 'https://instagram.com/example2',
      telegram: 'https://t.me/Wubbante',
    },
    {
      name: t('about.team.tegene.name') || 'Tegene Mekonnen',
      role: t('about.team.tegene.role'),
      image: TegeneImage,
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
    { icon: Smartphone, title: t('about.services.additional.mobile.title'), description: t('about.services.additional.mobile.desc') },
    { icon: Database, title: t('about.services.additional.data.title'), description: t('about.services.additional.data.desc') },
    { icon: Lock, title: t('about.services.additional.security.title'), description: t('about.services.additional.security.desc') },
  ];

  const testimonials = [
    { quote: t('about.testimonials.t1.quote'), author: t('about.testimonials.t1.author'), role: t('about.testimonials.t1.role') },
    { quote: t('about.testimonials.t2.quote'), author: t('about.testimonials.t2.author'), role: t('about.testimonials.t2.role') },
    { quote: t('about.testimonials.t3.quote'), author: t('about.testimonials.t3.author'), role: t('about.testimonials.t3.role') },
  ];

  const storyImages = [TeffImage, EthiopiaAmharaGojjamTeff, ForProduction, AgricultureQuality, VegProduct, Farmer];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [userCity, setUserCity] = useState('Addis Ababa');
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const scrollTrackRef = useRef(null);

  const locations = [
    'Addis Ababa', 'Bahir Dar', 'Debre Markos', "Mek'ele", 'Gondar', 'Hawassa',
    'Jimma', 'Dire Dawa', 'Harar', 'Adama', 'Dessie', 'Aksum', 'Lalibela',
    'Jijiga', 'Semera', 'Gambela', 'Arba Minch', 'Asosa', 'Shashamane',
  ];

  const fetchWeather = useCallback(async (city) => {
    setIsLoadingWeather(true);
    setWeatherError(null);
    try {
      const response = await fetch(`${API_URL}/api/weather?city=${encodeURIComponent(city)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success) setWeather(data.weather);
      else setWeatherError(data.error);
    } catch (err) {
      setWeatherError('Failed to load weather data');
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`${API_URL}/api/weather?lat=${latitude}&lon=${longitude}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
          } finally {
            setIsLoadingWeather(false);
          }
        },
        () => { fetchWeather('Addis Ababa'); }
      );
    } else {
      fetchWeather('Addis Ababa');
    }
  };

  // Auto-scroll hero images
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setActiveHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(heroInterval);
  }, []);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % storyImages.length);
    }, 3000);
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    getUserLocation();
    return () => { clearInterval(imageInterval); clearInterval(testimonialInterval); };
  }, []);

  useEffect(() => {
    if (selectedLocation && selectedLocation !== userCity) fetchWeather(selectedLocation);
  }, [selectedLocation, userCity, fetchWeather]);

  const handlePrevImage = () => setCurrentImageIndex((prev) => (prev - 1 + storyImages.length) % storyImages.length);
  const handleNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % storyImages.length);
  const currentStoryImage = storyImages[currentImageIndex];

  // Translated city names (Amharic mapping)
  const { language } = useLanguage();
  const cityNamesAm = {
    'Addis Ababa': 'አዲስ አበባ', 'Bahir Dar': 'ባህር ዳር', 'Hawassa': 'ሀዋሳ',
    'Dire Dawa': 'ድሬ ዳዋ', "Mek'ele": 'መቀሌ', 'Mekele': 'መቀሌ', 'Gondar': 'ጎንደር',
    'Jimma': 'ጅማ', 'Adama': 'አዳማ', 'Dessie': 'ደሴ', 'Aksum': 'አክሱም',
    'Lalibela': 'ላሊበላ', 'Jijiga': 'ጅጅጋ', 'Gambela': 'ጋምቤላ', 'Harar': 'ሃረር',
    'Arba Minch': 'አርባ ምንጭ', 'Asosa': 'አሶሳ', 'Shashamane': 'ሻሸመኔ',
    'Debre Markos': 'ደብረ ማርቆስ', 'Semera': 'ሰሜራ', 'Ethiopia': 'ኢትዮጵያ',
  };
  const translateCity = (name) => (language === 'am' && cityNamesAm[name]) ? cityNamesAm[name] : name;

  // Condition-based weather configs
  const getWeatherConfig = (condition) => {
    const c = condition?.toLowerCase() || '';
    if (c.includes('clear') || c.includes('sunny')) return {
      gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #93c5fd 100%)',
      emoji: '☀️', color: '#d97706', badgeBg: '#fef3c7', badgeText: '#92400e',
      tips: [
        { icon: '🌾', en: 'Excellent day for harvesting — minimal moisture loss.', am: 'ለምርት ሰብሳቢነት ምርጥ ቀን — የእርጥበት ኪሳራ ዝቅተኛ ነው።' },
        { icon: '💧', en: 'Irrigate crops early morning to minimize evaporation.', am: 'ትነትን ለመቀነስ ሰብሎችን ከጎህ ጀምሮ ያጠጡ።' },
        { icon: '🌱', en: 'Ideal for planting sun-loving crops like maize and teff.', am: 'ፀሐይ ወዳድ ሰብሎችን ለመትከል — በቆሎ፣ ጤፍ — ምርጥ ጊዜ።' },
        { icon: '🐄', en: 'Provide extra shade and water for livestock.', am: 'ለእንስሳት ተጨማሪ ጥላ እና ውሃ ያቅርቡ።' },
      ]
    };
    if (c.includes('cloud')) return {
      gradient: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 40%, #a5b4fc 100%)',
      emoji: '⛅', color: '#4f46e5', badgeBg: '#e0e7ff', badgeText: '#3730a3',
      tips: [
        { icon: '🌿', en: 'Perfect conditions for transplanting seedlings — less heat stress.', am: 'ሥሮችን ለማስቀመጥ ምርጥ ሁኔታ — ሙቀቱ ዝቅተኛ ነው።' },
        { icon: '🧪', en: 'Good day to apply foliar fertilizers — better absorption.', am: 'የቅጠል ማዳበሪያ ለመርጨት ምሩ ቀን — ምጣኔ ጥሩ ነው።' },
        { icon: '🌧️', en: 'Monitor sky — rain may follow. Ensure drainage ditches are clear.', am: 'ሰማዩን ይከታተሉ — ዝናብ ሊከተል ይችላል። ፍሳሽ ቦዮቹ ንጹህ መሆናቸውን ያረጋግጡ።' },
        { icon: '🚜', en: 'Ideal for field work — cool and comfortable working conditions.', am: 'የሜዳ ሥራ ለማከናወን ምርጥ — ቀዝቃዛ እና ምቹ ሁኔታዎች።' },
      ]
    };
    if (c.includes('rain') || c.includes('drizzle')) return {
      gradient: 'linear-gradient(135deg, #dbeafe 0%, #93c5fd 40%, #60a5fa 100%)',
      emoji: '🌧️', color: '#1d4ed8', badgeBg: '#dbeafe', badgeText: '#1e3a8a',
      tips: [
        { icon: '🚫', en: 'Avoid pesticide & fertilizer spraying — rain will wash them away.', am: 'ፀረ-ተባይ ወይም ማዳበሪያ አለመርጨት — ዝናቡ ያጥባቸዋል።' },
        { icon: '💧', en: 'Natural irrigation in progress — suspend manual watering.', am: 'ተፈጥሯዊ መስኖ በሂደት ላይ — የእጅ መስኖ ያቁሙ።' },
        { icon: '🌾', en: 'Delay harvesting to prevent mold and crop spoilage.', am: 'ፈንገስ እና ሰብል ብልሻትን ለመከላከል ሰብሳቢነቱን ያቆዩ።' },
        { icon: '🏠', en: 'Inspect storage facilities — ensure grain is protected from moisture.', am: 'መጋዘኖቹን ይፈትሹ — እህሉ ከእርጥበት የተጠበቀ መሆኑን ያረጋግጡ።' },
      ]
    };
    if (c.includes('storm') || c.includes('thunder')) return {
      gradient: 'linear-gradient(135deg, #374151 0%, #1f2937 60%, #111827 100%)',
      emoji: '⛈️', color: '#f59e0b', badgeBg: '#1f2937', badgeText: '#fbbf24',
      tips: [
        { icon: '⚠️', en: 'Stay indoors and avoid open field work during the storm.', am: 'በቤት ይቆዩ እና በ嵐 ወቅት ሜዳ ላይ ሥራ ያቁሙ።' },
        { icon: '🐄', en: 'Secure livestock in sheltered areas immediately.', am: 'እንስሳቱን ወዲያውኑ ወደ ጥላ ቦታ ያስግቡ።' },
        { icon: '🔧', en: 'Check for crop and infrastructure damage after the storm.', am: 'ከ嵐 ካለፈ በኋላ ሰብሉ እና መሠረተ ልማቱ ጉዳት እንደሌለ ይፈትሹ።' },
        { icon: '💾', en: 'Secure farming equipment and irrigation systems beforehand.', am: 'የግብርና መሳሪያዎትን እና የመስኖ ሥርዓቱን አስቀድሞ ደህና ያድርጉ።' },
      ]
    };
    // default (haze, mist, etc.)
    return {
      gradient: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 40%, #34d399 100%)',
      emoji: '🌫️', color: '#059669', badgeBg: '#d1fae5', badgeText: '#065f46',
      tips: [
        { icon: '📊', en: 'Monitor weather forecasts regularly for planning.', am: 'ለእቅድ አወጣጥ የአየር ሁኔታ ትንበያን በየጊዜው ይከታተሉ።' },
        { icon: '🌱', en: 'Mild conditions are generally good for most crops.', am: 'መካከለኛ ሁኔታዎች ለአብዛኛዎቹ ሰብሎች በጠቅላላ ጥሩ ናቸው።' },
        { icon: '🐑', en: 'Good time to assess livestock health and feed supplies.', am: 'የእንስሳቱን ጤና እና የምግብ አቅርቦት ለመፈተሽ ጥሩ ጊዜ ነው።' },
        { icon: '🗺️', en: 'Plan upcoming planting or harvesting schedules now.', am: 'መጪውን የዘር ወይም የሰብሳቢነት ቀናት አሁን ያቅዱ።' },
      ]
    };
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-gradient-to-br from-green-100 to-emerald-200">

      {/* ── HERO SECTION with horizontal scrolling image strip ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Horizontal auto-scrolling image strip as background */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHeroImage}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 1.2 }}
            >
              <img
                src={heroImages[activeHeroImage]}
                alt="AgroChain Ethiopia"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Horizontal thumbnail strip */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex overflow-hidden" style={{ height: '100px' }}>
          <div
            ref={scrollTrackRef}
            className="flex gap-2 px-2 py-2"
            style={{ animation: 'scrollX 18s linear infinite', whiteSpace: 'nowrap', width: 'max-content' }}
          >
            {[...heroImages, ...heroImages].map((img, i) => (
              <div
                key={i}
                onClick={() => setActiveHeroImage(i % heroImages.length)}
                className="relative flex-shrink-0 overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-105"
                style={{
                  width: '140px',
                  height: '84px',
                  border: (i % heroImages.length) === activeHeroImage ? '3px solid #f59e0b' : '2px solid rgba(255,255,255,0.2)'
                }}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/0 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content — AgroChain Ethiopia text stays in English always */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 sm:px-10 flex flex-col items-center" style={{ marginBottom: '120px' }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-4"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
              style={{ background: 'rgba(245,158,11,0.85)', color: '#1a1a1a', letterSpacing: '0.2em' }}>
              {t('about.team.estd')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="font-extrabold leading-tight mb-5"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', color: '#ffffff', textShadow: '0 4px 30px rgba(0,0,0,0.7)' }}
          >
            {t('nav.brand')}{' '}
            <span style={{ color: '#f59e0b' }}>{t('nav.country')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl"
            style={{ color: 'rgba(255,255,255,0.92)', textShadow: '0 2px 10px rgba(0,0,0,0.6)', lineHeight: 1.6 }}
          >
            {t('about.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5, type: 'spring' }}
          >
            {/* "Join Now" is translated via the language context */}
            <Link
              to="/login"
              className="inline-flex items-center gap-3 font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#1a1a1a',
                padding: '16px 40px',
                boxShadow: '0 8px 32px rgba(245,158,11,0.5)',
              }}
              aria-label={t('joinNow')}
            >
              {t('joinNow')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>

        {/* Image nav dots */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2 z-10" style={{ bottom: '110px' }}>
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveHeroImage(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeHeroImage ? '28px' : '10px',
                height: '10px',
                background: i === activeHeroImage ? '#f59e0b' : 'rgba(255,255,255,0.5)',
              }}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* CSS animation for horizontal scroll */}
      <style>{`
        @keyframes scrollX {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* ── JOURNEY / STORY SECTION ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-2xl p-12 sm:p-14 bg-white/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-500"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '450px' }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-10">
                {t('about.story.titlePart1') || 'Our'} <span className="text-amber-500">{t('about.story.titlePart2') || 'Story'}</span>
              </h2>
              <div className="space-y-6 text-lg sm:text-xl text-gray-950">
                <p>{t('about.story.p1')}</p>
                <p>{t('about.story.p2')}</p>
                <p>{t('about.story.p3')}</p>
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
              <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-110" aria-label="Previous image">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-all duration-300 hover:scale-110" aria-label="Next image">
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {storyImages.map((_, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-amber-500 scale-150' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to image ${index + 1}`} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ── VALUES SECTION ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-2xl p-12"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'linear-gradient(135deg, #ffffff, #10b981)', boxShadow: '0 12px 25px rgba(0,0,0,0.15)' }}>
              {t('about.values.titlePart1') || 'Our'} <span className="text-amber-500">{t('about.values.titlePart2') || 'Values'}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {values.map((value, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: index * 0.1, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl p-10 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '350px' }}>
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

      {/* ── CORE SERVICES ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-2xl p-12"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'linear-gradient(135deg, #10b981, #3b82f6)', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}>
              {t('about.services.titlePart1') || 'Our Core'} <span className="text-white">{t('about.services.titlePart2') || 'Services'}</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">{t('about.services.subtitle')}</p>
          </motion.div>
          <div className="space-y-20">
            {services.map((service, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: index * 0.1, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`${index % 2 === 1 ? 'lg:col-start-2 order-2 lg:order-1' : 'order-1'} rounded-2xl p-10 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500`}
                  style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '350px' }}>
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="p-5 bg-teal-100 rounded-full" style={{ boxShadow: '0 0 15px rgba(16,185,129,0.5)' }}>
                      <service.icon className="h-10 w-10 text-teal-600" />
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-xl sm:text-2xl text-gray-900 mb-8 leading-relaxed" style={{ minHeight: '100px' }}>{service.description}</p>
                  <div className="space-y-5 mb-8">
                    {service.features.map((feature, fi) => (
                      <div key={fi} className="flex items-center space-x-4">
                        <CheckCircle className="h-7 w-7 text-teal-600 flex-shrink-0" />
                        <span className="text-lg sm:text-xl text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1 order-1 lg:order-2' : 'order-2'}>
                  <img src={service.image} alt={service.title} className="rounded-2xl w-full h-96 object-cover shadow-xl border-2 border-amber-300 hover:shadow-2xl transition duration-300"
                    style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ── ADDITIONAL SERVICES ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-2xl p-10"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'rgba(255,255,255,0.9)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              {t('about.services.additional.titlePart1') || 'Additional'} <span className="text-teal-600">{t('about.services.additional.titlePart2') || 'Features'}</span>
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">{t('about.services.additional.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {additionalServices.map((service, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: index * 0.1, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl p-8 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '300px' }}>
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

      {/* ── TESTIMONIALS ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 rounded-2xl p-10"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'rgba(255,255,255,0.9)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              {t('about.testimonials.title')}
            </h2>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mt-6">{t('about.testimonials.subtitle')}</p>
          </motion.div>
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentTestimonialIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
                className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '300px' }}>
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />)}
                </div>
                <p className="text-lg sm:text-xl text-gray-700 italic mb-6">&ldquo; {testimonials[currentTestimonialIndex].quote} &rdquo;</p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{testimonials[currentTestimonialIndex].author}</p>
                <p className="text-sm text-gray-600">{testimonials[currentTestimonialIndex].role}</p>
              </motion.div>
            </AnimatePresence>
            <button onClick={() => setCurrentTestimonialIndex((p) => (p - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-300 hover:scale-110" aria-label="Previous testimonial">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={() => setCurrentTestimonialIndex((p) => (p + 1) % testimonials.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-all duration-300 hover:scale-110" aria-label="Next testimonial">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
        <svg className="w-full h-24 text-emerald-200" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 L1440,0 L1440,120 C1200,60 900,120 600,60 C300,0 0,60 0,0 Z" fill="currentColor" />
        </svg>
      </section>

      {/* ── TEAM SECTION — names are always in English, not translated ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }} className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight rounded-2xl p-10"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'rgba(255,255,255,0.9)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
              {t('about.team.title').split(' ')[0]} <span className="text-teal-600">{t('about.team.title').split(' ').slice(1).join(' ')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto mt-4">{t('about.team.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: index * 0.1, type: 'spring', stiffness: 80 }} viewport={{ once: true, amount: 0.3 }}
                className="rounded-2xl p-8 bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', minHeight: '450px' }}>
                <img src={member.image} alt={member.name} className="w-40 h-40 rounded-full mx-auto mb-6 object-cover ring-4 ring-amber-200" />
                {/* Name is always hardcoded in English */}
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

      {/* ── WEATHER SECTION — Modern Premium Design ── */}
      <section className="py-20 relative overflow-hidden" style={{ background: weather ? getWeatherConfig(weather.condition).gradient : 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 40%, #34d399 100%)' }}>
        {/* Decorative blurred orbs */}
        <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: '#ffffff' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: '#10b981' }} />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} viewport={{ once: true, amount: 0.3 }} className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4" style={{ background: weather ? getWeatherConfig(weather.condition).badgeBg : '#d1fae5', color: weather ? getWeatherConfig(weather.condition).badgeText : '#065f46' }}>
              🌍 {t('about.weather.title')} {translateCity(selectedLocation || userCity)}
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3 drop-shadow">
              {weather ? getWeatherConfig(weather.condition).emoji : '🌤️'}{' '}
              <span style={{ color: weather ? getWeatherConfig(weather.condition).color : '#059669' }}>
                {translateCity(weather?.city || selectedLocation || userCity)}
              </span>
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-6">{t('about.weather.subtitle')}</p>
            {/* Location selector */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)' }}>
              <MapPin className="h-5 w-5 text-teal-600 animate-pulse flex-shrink-0" />
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-gray-800 font-medium cursor-pointer text-base">
                <option value="">{language === 'am' ? 'የአሁኑን አካባቢ ተጠቀም' : 'Use Current Location'}</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{language === 'am' ? (cityNamesAm[loc] || loc) : loc}</option>
                ))}
              </select>
            </div>
          </motion.div>

          {/* Loading */}
          {isLoadingWeather ? (
            <div className="text-center py-16">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="inline-block h-16 w-16 border-4 border-teal-600 border-t-transparent rounded-full mb-5" />
              <p className="text-gray-700 font-semibold text-lg">{t('about.weather.detecting')}</p>
            </div>
          ) : weatherError ? (
            <div className="text-center p-10 rounded-3xl max-w-lg mx-auto" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)' }}>
              <AlertCircle className="h-14 w-14 mx-auto mb-4 text-red-500" />
              <p className="text-red-600 font-semibold mb-5 text-lg">{weatherError}</p>
              <button onClick={() => fetchWeather(selectedLocation || userCity)}
                className="px-8 py-3 rounded-2xl font-bold text-white transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
                {t('about.weather.retry')}
              </button>
            </div>
          ) : weather ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              {/* Main metric cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-10">

                {/* Condition */}
                <div className="col-span-2 sm:col-span-1 rounded-3xl p-6 text-center flex flex-col items-center justify-center" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <img src={weather.icon} alt={weather.condition} className="w-24 h-24 mb-3" />
                  <span className="text-3xl font-extrabold" style={{ color: getWeatherConfig(weather.condition).color }}>{weather.condition}</span>
                  <span className="text-sm text-gray-600 capitalize mt-1">{weather.description}</span>
                </div>

                {/* Temperature */}
                <div className="rounded-3xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <Thermometer className="h-10 w-10 mx-auto mb-2 text-orange-500" />
                  <p className="text-4xl font-extrabold text-orange-700">{weather.temperature}°C</p>
                  <p className="text-xs text-gray-600 mt-1">{t('about.weather.feelsLike')} <strong>{weather.feelsLike}°C</strong></p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-red-500 flex items-center gap-1"><Sun className="h-3 w-3" />{weather.high}°</span>
                    <span className="text-blue-500 flex items-center gap-1"><Cloud className="h-3 w-3" />{weather.low}°</span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="rounded-3xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <Droplet className="h-10 w-10 mx-auto mb-2 text-blue-500" />
                  <p className="text-4xl font-extrabold text-blue-700">{weather.humidity}%</p>
                  <p className="text-xs text-gray-600 mt-1">{t('about.weather.humidity')}</p>
                </div>

                {/* Wind */}
                <div className="rounded-3xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <Wind className="h-10 w-10 mx-auto mb-2 text-gray-500" />
                  <p className="text-4xl font-extrabold text-gray-700">{weather.windSpeed}</p>
                  <p className="text-xs text-gray-600 mt-1">{t('about.weather.windSpeed')} (m/s)</p>
                </div>

                {/* Precipitation */}
                <div className="rounded-3xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(18px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  <CloudRain className="h-10 w-10 mx-auto mb-2 text-teal-500" />
                  <p className="text-4xl font-extrabold text-teal-700">{weather.precipitation || 0}</p>
                  <p className="text-xs text-gray-600 mt-1">{t('about.weather.precipitation')} (mm)</p>
                </div>
              </div>

              {/* Condition-based Agricultural Tips */}
              <div className="max-w-5xl mx-auto">
                <h3 className="text-xl font-bold text-gray-800 text-center mb-5">
                  🌿 {language === 'am' ? 'የአካባቢ የግብርና ምክሮች' : 'Agricultural Tips for Today'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getWeatherConfig(weather.condition).tips.map((tip, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(14px)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                      <span className="text-3xl mb-3 block">{tip.icon}</span>
                      <p className="text-sm text-gray-800 leading-relaxed font-medium">{language === 'am' ? tip.am : tip.en}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-center text-gray-600 text-xl py-10">{language === 'am' ? 'የአየር ሁኔታ መረጃ አልተገኘም።' : 'No weather data available.'}</p>
          )}

          <p className="text-center text-xs text-gray-600 mt-8 opacity-80">{t('about.weather.updateInfo')}</p>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-16 text-center">
          <motion.h2 initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, type: 'spring', stiffness: 100 }}
            className="text-4xl sm:text-5xl font-extrabold mb-8 rounded-2xl p-10"
            style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)', background: 'rgba(255,255,255,0.9)', boxShadow: '0 12px 40px rgba(0,0,0,0.15)' }}>
            {t('about.cta.title')}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.3, type: 'spring', stiffness: 100 }}
            className="text-lg sm:text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            {t('about.cta.subtitle')}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.6, type: 'spring', stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-8 justify-center">
            <Link to="/contact"
              className="border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-teal-50 hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-4"
              aria-label={t('about.cta.contactSales')}>
              {t('about.cta.contactSales')}
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;