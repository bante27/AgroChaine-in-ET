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
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const tid = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(tid);
  }, []);

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
      telegram: 'https://t.me/tiletechzone',
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
      name: t('about.team.tegene.name') || 'Dejen Sitotaw',
      role: t('about.team.tegene.role'),
      image: TegeneImage,
      bio: t('about.team.tegene.bio'),
      twitter: 'https://twitter.com/example3',
      instagram: 'https://instagram.com/example3',
      telegram: 'https://t.me/dejen_sw',
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
  const cityNamesAm = {
    'Addis Ababa': 'አዲስ አበባ', 'Bahir Dar': 'ባህር ዳር', 'Hawassa': 'ሀዋሳ',
    'Dire Dawa': 'ድሬ ዳዋ', "Mek'ele": 'መቀሌ', 'Mekele': 'መቀሌ', 'Gondar': 'ጎንደር',
    'Jimma': 'ጅማ', 'Adama': 'አዳማ', 'Dessie': 'ደሴ', 'Aksum': 'አክሱም',
    'Lalibela': 'ላሊበላ', 'Jijiga': 'ጅጅጋ', 'Gambela': 'ጋምቤላ', 'Harar': 'ሃረር',
    'Arba Minch': 'አርባ ምንጭ', 'Asosa': 'አሶሳ', 'Shashamane': 'ሻሸመኔ',
    'Debre Markos': 'ደብረ ማርቆስ', 'Semera': 'ሰሜራ', 'Ethiopia': 'ኢትዮጵያ',
  };
  const translateCity = (name) => (language === 'am' && cityNamesAm[name]) ? cityNamesAm[name] : name;

  // ── CROP NAME TRANSLATION MAP ──
  const cropNamesAm = {
    'Teff': 'ጤፍ', 'Maize': 'በቆሎ', 'Wheat': 'ስንዴ', 'Barley': 'ገብስ',
    'Sesame': 'ሰሊጥ', 'Sorghum': 'ማሽላ', 'Coffee': 'ቡና',
    'Coffee Seedlings': 'የቡና ሥሮች', 'Tomato': 'ቲማቲም', 'Onion': 'ሽንኩርት',
    'Cabbage': 'ጎመን', 'Potato': 'ድንች', 'Carrot': 'ካሮት', 'Pepper': 'ቃሪያ',
    'Garlic': 'ነጭ ሽንኩርት', 'Pumpkin': 'ዱባ', 'Bean': 'ባቀላ',
    'Chickpea': 'ሽምብራ', 'Lentil': 'ምስር', 'Fenugreek': 'አበሽ',
    'Flaxseed': 'ታዿት', 'Mango': 'ማንጎ', 'Avocado': 'አቮካዶ',
    'Banana': 'ምዕ', 'Papaya': 'ፓፓያ', 'Guava': 'ዖይትያ',
    'Groundnut': 'ወደ ቦላ ሌሰርድ', 'Sunflower': 'ሰንፈሎወር',
    'Vegetable Crops': 'አትክልቶች', 'All Crops': 'ሁሉም ሰብሎች',
    'Livestock': 'እንስሳ', 'Equipment': 'መሳሪያ',
    'General Crops': 'አጠቃላይ ሰብሎች',
  };
  const translateCrop = (crop) => (language === 'am' && cropNamesAm[crop]) ? cropNamesAm[crop] : crop;

  // ── ETHIOPIAN CALENDAR CONVERTER ──
  function isLeapYearFn(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function gregorianToEthiopian(date) {
    const gY = date.getFullYear(), gM = date.getMonth() + 1, gD = date.getDate();
    const eYear = (gM > 9 || (gM === 9 && gD >= 11)) ? gY - 7 : gY - 8;
    const etNYDay = (eYear + 1) % 4 === 0 ? 12 : 11;
    const gMD = [0, 31, 28 + (isLeapYearFn(gY) ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let dFromJan = 0;
    for (let m = 1; m < gM; m++) dFromJan += gMD[m];
    dFromJan += gD - 1;
    const nyFromJan = 31 + gMD[2] + 31 + 30 + 31 + 30 + 31 + 31 + (etNYDay - 1);
    let dOfEthYear;
    if (dFromJan >= nyFromJan) {
      dOfEthYear = dFromJan - nyFromJan;
    } else {
      const pY = gY - 1;
      const pMD = [0, 31, 28 + (isLeapYearFn(pY) ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const pNYD = eYear % 4 === 0 ? 12 : 11;
      const pNYFromJan = 31 + pMD[2] + 31 + 30 + 31 + 30 + 31 + 31 + (pNYD - 1);
      dOfEthYear = (isLeapYearFn(pY) ? 366 : 365) - pNYFromJan + dFromJan;
    }
    return { year: eYear, month: Math.floor(dOfEthYear / 30) + 1, day: dOfEthYear % 30 + 1 };
  }
  const ethMonthsAm = ['ምስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ', 'ሠምፔ', 'ነቀሴ', 'ጷጹሜ'];
  const ethMonthsEn = ['Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit', 'Megabit', 'Miyazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume'];
  const gMonthsAm = ['ጃንዋሪ', 'ፌብራዋሪ', 'ማርች', 'ኤፕሪል', 'ሜይ', 'ጁን', 'ጁላይ', 'ኦጌስት', 'ሴፕቴምበር', 'ኦክቶበር', 'ኖወምበር', 'ዲሴምበር'];
  const gDaysAm = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];
  const gDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function toEthiopianTime(date) {
    const h = date.getHours(), min = date.getMinutes(), sec = date.getSeconds();
    const ethH = ((h + 6) % 12) || 12;
    const minS = String(min).padStart(2, '0'), secS = String(sec).padStart(2, '0');
    let period;
    if (h >= 6 && h < 12) period = language === 'am' ? 'ጠዋት' : 'Morning';
    else if (h >= 12 && h < 18) period = language === 'am' ? 'ከሰዓት' : 'Afternoon';
    else if (h >= 18 && h < 24) period = language === 'am' ? 'ምሽት' : 'Evening';
    else period = language === 'am' ? 'ለሊት' : 'Night';
    return `${ethH}:${minS}:${secS} ${period}`;
  }
  const etDate = gregorianToEthiopian(currentTime);
  const etMonthName = language === 'am' ? ethMonthsAm[etDate.month - 1] : ethMonthsEn[etDate.month - 1];
  const gMonthName = language === 'am' ? gMonthsAm[currentTime.getMonth()] : currentTime.toLocaleString('en', { month: 'long' });
  const gDayName = language === 'am' ? gDaysAm[currentTime.getDay()] : gDaysEn[currentTime.getDay()];
  const timeStr = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')}`;


  // ── CONDITION-BASED AGRICULTURAL ADVISORY ──
  // Each condition has: gradient, emoji, colors, affected crops, and 6 realistic bilingual tips
  const getWeatherConfig = (condition) => {
    const c = condition?.toLowerCase() || '';

    // ── CLEAR / SUNNY ──────────────────────────────────────────
    if (c.includes('clear') || c.includes('sunny')) return {
      gradient: 'linear-gradient(160deg, #fff7ed 0%, #fef3c7 35%, #fde68a 70%, #fbbf24 100%)',
      emoji: '☀️', color: '#b45309', badgeBg: '#fef3c7', badgeText: '#92400e',
      alertLevel: '🟢', alertLabel: { en: 'Routine Day', am: 'መደበኛ ቀን' },
      crops: ['Teff', 'Maize', 'Wheat', 'Barley', 'Sesame', 'Sorghum', 'Sunflower'],
      tips: [
        { icon: '🌾', priority: '🟢', en: 'Harvest teff and wheat today — clear skies minimize grain moisture and reduce mold risk in stored crops.', am: 'ጤፍ እና ስንዴ ዛሬ ሰብሱ — ፀሐያማ ሰማይ የቅጥ እርጥበትን ይቀንሳል፣ ይህም ሻጋታን ያስቀራል።' },
        { icon: '💧', priority: '🟡', en: 'Irrigate maize and vegetables only before 7 AM or after 5 PM — midday watering causes up to 40% evaporation loss.', am: 'በቆሎ እና አትክልቶችን ልክ ከ7 ፀሐዩ በፊት ወይም ከ5 ምሽቱ በኋላ ብቻ ያጠጡ — የቀን-መሐከል ሙቀት 40% ውሃ ያባክናል።' },
        { icon: '🐛', priority: '🔴', en: 'Scout for aphids and stem borers on sorghum and maize — dry heat causes rapid pest multiplication. Apply pesticide before 8 AM.', am: 'ማሽላ እና በቆሎ ላይ ትኋን እና ግንድ አፋቂዎችን ይፈልጉ — ደረቅ ሙቀት ተባዮችን ያፋጥናል። ፀረ-ተባይ ከ8 ጠዋት በፊት ይርጩ።' },
        { icon: '🌰', priority: '🟢', en: 'Sun-dry harvested sesame and coffee beans on raised platforms for 3–4 days — ideal curing weather reduces toxins.', am: 'የተሰበሰበ ሰሊጥ እና ቡና በፀሐይ ላይ ከፍ ባሉ መድረኮች 3–4 ቀናት ደርቁ — ምርጥ ማድረቂያ ሁኔታ ጎጂ ነፍሳትን ያስወግዳል።' },
        { icon: '🐄', priority: '🟡', en: 'Provide extra drinking water for cattle and oxen — animals in full sun can dehydrate by midday. Check water troughs twice daily.', am: 'ለከብቶች እና ለጥቆሮ ተጨማሪ መጠጥ ውሃ ያቅርቡ — ሙሉ ፀሐይ ስር ያሉ እንስሳት ሊደርቁ ይችላሉ። ዕቃዎቹን ቀን ሁለቴ ይፈትሹ።' },
        { icon: '🚜', priority: '🟢', en: 'Good day for land preparation, plowing and ridging — dry soil makes tillage faster and reduces fuel use.', am: 'ለመሬት ዝግጅት፣ ማረስ እና ጉድጓድ ቆፍሮ ለቦሮ ዘር ምርጥ ቀን — ደረቅ አፈር ማረስን ያቃልላል እና ነዳጅ ይቆጥባል።' },
      ]
    };

    // ── PARTLY CLOUDY ──────────────────────────────────────────
    if (c.includes('cloud')) return {
      gradient: 'linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 40%, #bae6fd 80%, #93c5fd 100%)',
      emoji: '⛅', color: '#1d4ed8', badgeBg: '#e0f2fe', badgeText: '#1e3a8a',
      alertLevel: '🟢', alertLabel: { en: 'Ideal Farming Day', am: 'ምርጥ የግብርና ቀን' },
      crops: ['Tomato', 'Onion', 'Cabbage', 'Potato', 'Coffee Seedlings', 'Carrot', 'Garlic', 'Pepper'],
      tips: [
        { icon: '🌿', priority: '🟢', en: 'Transplant tomato, cabbage and onion seedlings today — diffuse cloud light reduces transplant shock and wilting by 60%.', am: 'ዛሬ ቲማቲም፣ ጎመን እና ሽንኩርት ሥሮችን ይቀምሩ — ደመናማ ብርሃን ሠርጊው ድንጋጤን 60% ይቀንሳል።' },
        { icon: '🧪', priority: '🟡', en: 'Apply urea or DAP foliar fertilizer — overcast sky increases leaf absorption by up to 30% compared to full sun.', am: 'ዩሪያ ወይም DAP የቅጠል ማዳበሪያ ይርጩ — ደመናማ ሰማይ ወደ ቅጠሉ ውስጥ ዘልቆ መግባቱን 30% ይጨምራል።' },
        { icon: '☕', priority: '🟢', en: 'Plant coffee seedlings in nursery beds — cloud cover protects young plants from burning and root stress.', am: 'የቡና ሥሮችን በስፍራ አልጋ ይትከሉ — የደመናው ሽፋን ለምለም ዕፅዋቶቻቸUserን ከፀሐይ ቃጠሎ ይጠብቃቸዋል።' },
        { icon: '🔍', priority: '🟡', en: 'Inspect crops for disease — cool humid air promotes fungal leaf spot and rust on wheat. Check for early brown patches.', am: 'ሰብሎቹን ለበሽታ ይፈትሹ — ቀዝቃዛ እርጥብ አየር በስንዴ ላይ ሻጋታ ይስዛቸዋል። ቡናማ ነጠብጣቦችን ቀደም ብሎ ይፈልጉ።' },
        { icon: '💉', priority: '🟡', en: 'Ideal day for livestock vaccination — cooler temps reduce animal stress during injection and improve immunity response.', am: 'ለእንስሳ ክትትቤት ምርጥ ቀን — ቀዝቃዛ ሙቀት ከመርጊ ወቅት ዕንቅልፍ ያቃልላል እና የዕፅዋት ምላሽ ይሻሻላል።' },
        { icon: '🚜', priority: '🟢', en: 'Excellent day for hand-weeding and hoeing around teff and maize rows — workers last longer in cool conditions.', am: 'ጤፍ እና በቆሎ ረድፎች ዙሪያ ማረም እና ማሳ ለማረስ ምርጥ ቀን — ሠራተኞች ቀዝቃዛ ሁኔታ ውስጥ ረዘም ያለ ሥራ ይሠሩ።' },
      ]
    };

    // ── RAIN / DRIZZLE ─────────────────────────────────────────
    if (c.includes('rain') || c.includes('drizzle')) return {
      gradient: 'linear-gradient(160deg, #eff6ff 0%, #dbeafe 40%, #93c5fd 80%, #3b82f6 100%)',
      emoji: '🌧️', color: '#1e40af', badgeBg: '#dbeafe', badgeText: '#1e3a8a',
      alertLevel: '🟡', alertLabel: { en: 'Caution Advisory', am: 'ጥንቃቄ ምክር' },
      crops: ['Coffee', 'Maize', 'Potato', 'Vegetable Crops', 'Bean', 'Lentil', 'Groundnut'],
      tips: [
        { icon: '🚫', priority: '🔴', en: 'STOP all pesticide and herbicide spraying immediately — rainfall washes chemicals into rivers, harms fish and contaminates water sources.', am: 'ሁሉንም ፀረ-ተባይ እና ፀረ- አረም ርብርብ ወዲያውኑ ያቁሙ — ዝናብ ኬሚካሎችን ወደ ወንዞች ያስሮጣቸዋል፣ ዓሣ ያጠፋል እና የውሃ ምንጮችን ያዳክማል።' },
        { icon: '🌊', priority: '🔴', en: 'Check drainage channels in potato and vegetable fields immediately — waterlogging for 6+ hours causes irreversible root rot.', am: 'የድንች እና አትክልት ማሳ የፍሳሽ ቦዮችን ወዲያውኑ ፈትሹ — ከ6 ሰዓት በላይ ውሃ መቆየት የሥር ብስባሽ ያስከትላል።' },
        { icon: '☕', priority: '🔴', en: 'Monitor coffee trees for CBD (Coffee Berry Disease) — rain + humidity above 80% triggers rapid spread. Apply copper fungicide at field edges.', am: 'የቡና ዛፎች ላይ CBD (የቡና ፍሬ በሽታ) ይከታተሉ — ዝናብ + 80% በላይ እርጥበት ፈጣን ስርጭቱን ይፈጥራል። በማሳ ዳርቻ ልዩ ፈወሲ ይርጩ።' },
        { icon: '🌾', priority: '🟡', en: 'Delay harvesting teff and wheat by at least 2 days after rain stops — wet grain in storage causes aflatoxin mold within 72 hours.', am: 'ዝናቡ ከቆመ በኋላ ቢያንስ 2 ቀናት ጤፍ እና ስንዴ ሳትሰበስቡ ቆዩ — እርጥብ ሰብል ውስጥ አፍላቶክሲን ሻጋታ በ72 ሰዓት ውስጥ ይፈጠራል።' },
        { icon: '🏚️', priority: '🟡', en: 'Secure grain in waterproof storage — check roof sheets and sack covers. A single damp sack can spoil an entire store.', am: 'ሰብልን ውሃ-ተከላካይ ማከማቻ ውስጥ አስቀምጡ — የጣራ ሸካዎችን እና ሣዊ ሽፋኖችን ፈትሹ። አንድ እርጥብ ሣዊ ሙሉ ማከማቻ ሊያበላሽ ይችላል።' },
        { icon: '🪣', priority: '🟢', en: 'Collect rainwater in tanks and pits for dry season irrigation — Ethiopian smallholders can store enough in 2 days of rain for 3 weeks of use.', am: 'ለደረቅ ወቅት መስኖ ዝናብ ውሃ ወደ ታንክ እና ሥፍራ ሰብስቡ — ኢትዮጵያ ትናንሽ ገበሬዎች 2 ቀን ዝናብ ለ3 ሳምንት ሊያዋቅሩ ይችላሉ።' },
      ]
    };

    // ── THUNDERSTORM ───────────────────────────────────────────
    if (c.includes('storm') || c.includes('thunder')) return {
      gradient: 'linear-gradient(160deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
      emoji: '⛈️', color: '#fbbf24', badgeBg: '#1e293b', badgeText: '#fbbf24',
      alertLevel: '🔴', alertLabel: { en: 'URGENT - Emergency Alert', am: '🔴 አስቸኳይ ማስጠንቀቂያ' },
      crops: ['All Crops', 'Livestock', 'Equipment'],
      tips: [
        { icon: '🚨', priority: '🔴', en: 'URGENT: Stop all field work and move indoors now — lightning strikes kill dozens of Ethiopian farmers each rainy season.', am: '🚨 አስቸኳይ: ሁሉንም የሜዳ ሥራ አቁሙ እና ወዲያውኑ ወደ ቤት ግቡ — መብረቅ በየዝናቡ ወቅት የኢትዮጵያ ገበሬዎችን ህይወት ያጠፋ ።' },
        { icon: '🐄', priority: '🔴', en: 'Move oxen and livestock into barn or sheltered enclosures IMMEDIATELY — animals under trees during lightning are at fatal risk.', am: 'ጊደሮች እና ቀሬዎቹን ወዲያውኑ ወደ ጎተራ ወይም ጥላ ምሽግ አስሩ — ዛፍ ስር ያሉ እንስሳ በመብረቅ ሊሞቱ ይችላሉ።' },
        { icon: '🔌', priority: '🔴', en: 'Unplug all electrical irrigation pumps — storm surges can fry motors permanently. Disconnect generator ground cables.', am: 'ሁሉንም ኤሌክትሪካዊ ፓምፖች ያጥፉ — የማዕበል ማዕበሎች ሞተሮቹን ሙሉ በሙሉ ያበላሹ ። ጄኔሬተር ኬብሎችን ያላቅቁ።' },
        { icon: '🏗️', priority: '🟡', en: 'After storm: Walk all farm terraces and bunds for erosion damage — a breached soil bund loses 10 years of land improvement overnight.', am: 'ከማዕበሉ በኋላ: አፈር ሸርሽሮ ያለ ቦታ ፈልጎ ሁሉንም ጉርምቦ እና ቦዩ ፈትሹ — የፈረሰ ጉርምቦ የ10 ዓመት ስራ ቀን ውስጥ ያጠፋ።' },
        { icon: '🌾', priority: '🟡', en: 'Survey for lodging (fallen crop stems) in tall maize and sorghum after wind — straighten and stake leaning plants within 24 hours.', am: 'ከማዕበሉ በኋላ ረዥም በቆሎ እና ማሽላ ውስጥ የወደቁ ዕፅዋቶችን ፈልጉ — ያጋደሉ ዕፅዋቶችን ውስጥ 24 ሰዓታት ያቆሙ።' },
        { icon: '📱', priority: '🟢', en: 'Report storm crop damage to local agricultural bureaus within 48 hrs — eligible for government crop compensation schemes.', am: 'የማዕበሉ ሰብል ጉዳትን ለሚያዋድቁ ቢሮ ውስጥ 48 ሰዓታት ውስጥ ሪፖርት ያድርጉ — ለመንግሥት የሰብል ካሳ ዕቅዶች አብቃ ።' },
      ]
    };

    // ── FOG / HAZE / MIST ──────────────────────────────────────
    if (c.includes('fog') || c.includes('mist') || c.includes('haze')) return {
      gradient: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 40%, #cbd5e1 80%, #94a3b8 100%)',
      emoji: '🌫️', color: '#475569', badgeBg: '#e2e8f0', badgeText: '#1e293b',
      alertLevel: '🟡', alertLabel: { en: 'Monitor Conditions', am: 'ሁኔታን ይከታተሉ' },
      crops: ['Potato', 'Tomato', 'Coffee', 'Wheat', 'Garlic', 'Pumpkin', 'Chickpea'],
      tips: [
        { icon: '🍃', priority: '🔴', en: 'High blight risk for potato and tomato — humid fog triggers Phytophthora within hours. Apply mancozeb fungicide this morning.', am: 'ለድንች እና ቲማቲም የፈንገስ ስጋት ከፍተኛ ነው — ጭጋግ Phytophthora ወደ ጥቂት ሰዓታት ውስጥ ያስጀምረዋል። ዛሬ ጠዋት ፈወሲ ይርጩ።' },
        { icon: '☕', priority: '🟡', en: 'Fog benefits coffee cherry ripening in highland zones — monitor for coffee leaf rust (orange powder under leaves).', am: 'ጭጋግ ከፍተኛ የቡና ፍሬ ለማብሰሉ ይጠቅማል — የቡና ቅጠል ዝገት (ቅጠሎቹ ስር ብርቱካናማ ዱቄት) ይፈትሹ።' },
        { icon: '🌱', priority: '🟡', en: 'Fog moisture helps seed germination in nurseries — ideal to sow onion and carrot seeds directly into moist soil.', am: 'ጭጋግ እርጥበት ዘሮችን ለማቆቆም ይጠቅማል — ሽንኩርት እና ካሮት ዘሮችን ወደ እርጥብ አፈር ለመዝራት ምርጥ ጊዜ።' },
        { icon: '🐑', priority: '🟢', en: 'Ensure livestock pens have ventilation — fog causes respiratory issues in sheep and goats kept in enclosed damp areas.', am: 'ለከብቶቹ ፓምፕ ቡናቱ አየር ማናፈሻ እንዳለ ያረጋግጡ — ጭጋግ ለበጎች እና ፍየሎች አተነፋፈስ ችግር ያስከትላል።' },
        { icon: '📅', priority: '🟢', en: 'Use foggy mornings for farm record-keeping and market planning — analyze which crops gave best returns last season.', am: 'ጭጋጋማ ጠዋቶችን ለማሳ መዝገብ አያያዝ እና የገበያ ዕቅድ ይጠቀሙ — ባለፈው ወቅት ምርጥ ትርፍ ያስገኙ ሰብሎችን ይሞግቱ።' },
        { icon: '🔬', priority: '🟡', en: 'Collect leaf samples today for lab disease testing — visible symptoms in fog conditions identify problems faster.', am: 'ዛሬ የቅጠል ናሙናዎችን ለምርምር ቤት ፍተሻ ሰብስቡ — ጭጋጋዊ ሁኔታ ምልክቶችን ፈጠን ብሎ ያሳያቸዋል።' },
      ]
    };

    // ── DEFAULT / MILD ──────────────────────────────────────────
    return {
      gradient: 'linear-gradient(160deg, #ecfdf5 0%, #d1fae5 40%, #6ee7b7 80%, #34d399 100%)',
      emoji: '🌤️', color: '#059669', badgeBg: '#d1fae5', badgeText: '#065f46',
      alertLevel: '🟢', alertLabel: { en: 'Good Farming Conditions', am: 'ጥሩ የግብርና ሁኔታ' },
      crops: ['General Crops', 'Vegetable Crops', 'Livestock', 'Chickpea', 'Bean', 'Fenugreek', 'Flaxseed'],
      tips: [
        { icon: '📊', priority: '🟢', en: 'Use today to analyze farm data and update your AgroChain marketplace listings with current stock and prices.', am: 'ዛሬ የማሳ ውሂብ ይሞካሽ እና አሁን ያለዎትን ምርት እና ዋጋ በAgroChain ገበያ ዝርዝር ያዘምኑ።' },
        { icon: '🌱', priority: '🟢', en: 'General mild conditions favor most Ethiopian crops. Focus on soil health: apply compost and organic matter to boost next season.', am: 'አጠቃላይ መካከለኛ ሁኔታዎች ለኢትዮጵያ ሰብሎች ጥሩ ናቸው። አፈር ጤና ላይ ትኩረት ስጡ: ለሚቀጥለው ወቅት ብስባሽ ጨምሩ።' },
        { icon: '🐄', priority: '🟢', en: 'Good time to deworm livestock and check hoof condition on oxen — healthy oxen are critical for plowing season.', am: 'ለከብቶቹ ትል ማስወጫ መሥጫ እና ጥቆሮ እግሮቻቸውን ለማፅዳት ጥሩ ጊዜ ነው — ጤናማ ጥቆሮ ለማረስ ወቅት ወሳኝ ናቸው።' },
        { icon: '🗺️', priority: '🟡', en: 'Plan ahead: check long-range forecasts and decide on crop rotation for next planting cycle using soil test results.', am: 'ቀደም ብሎ ዕቅድ ይሥሩ: የረጅም ጊዜ ትንበያ ይፈትሹ እና ለሚቀጥለው ዘር ዑደት የሰብል ምልቀቃ ከአፈር ምርምር ውጤት ይወስኑ።' },
        { icon: '🏗️', priority: '🟢', en: 'Good weather for maintaining irrigation infrastructure — clean canals, repair pump seals and check drip line connections.', am: 'የመስኖ ስርዓቱን ለማደስ ጥሩ አየር — ቦዮቹ ያፅዱ፣ የፓምፕ ማሸጊያ ያደሱ እና የቢሮ መዘርጊያ ትስስሮችን ይፈትሹ።' },
        { icon: '📱', priority: '🟢', en: 'Connect with buyers on the AgroChain marketplace — post crop photos, agree on delivery timelines and get pre-season contracts.', am: 'በAgroChain ገበያ ላይ ከገዢዎች ጋር ይገናኙ — የሰብል ፎቶ ይለጥፉ፣ አካባቢ ሁኔታ ይስማሙ እና ቅድም-ወቅት ውልን ይሙሉ።' },
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

            {/* ⏰ Live Dual-Calendar Date & Time Widget */}
            <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
              {/* Gregorian */}
              <div className="px-5 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(14px)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  📅 {language === 'am' ? 'የጎረግሮሪያ ቀንተሪ' : 'Gregorian Calendar'}
                </p>
                <p className="text-base font-extrabold text-gray-800">
                  {gDayName}, {currentTime.getDate()} {gMonthName} {currentTime.getFullYear()}
                </p>
                <p className="text-xl font-mono font-bold tracking-widest mt-0.5" style={{ color: weather ? getWeatherConfig(weather.condition).color : '#059669' }}>
                  {timeStr}
                </p>
              </div>
              {/* Ethiopian */}
              <div className="px-5 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(14px)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  ✨ {language === 'am' ? 'የኢትዮጵያ ቀንተሪ (ገዕዕ)' : 'Ethiopian Calendar (Geʼez)'}
                </p>
                <p className="text-base font-extrabold text-gray-800">
                  {language === 'am' ? `${etDate.day} ${etMonthName} ${etDate.year} ዓ.ም` : `${etDate.day} ${etMonthName} ${etDate.year} AM`}
                </p>
                <p className="text-xl font-mono font-bold tracking-widest mt-0.5" style={{ color: weather ? getWeatherConfig(weather.condition).color : '#059669' }}>
                  {toEthiopianTime(currentTime)}
                </p>
              </div>
            </div>

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

              {/* Condition-based Agricultural Advisory */}
              <div className="max-w-5xl mx-auto">
                {/* Advisory header */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4 rounded-2xl gap-3"
                  style={{ background: 'rgba(255,255,255,0.60)', backdropFilter: 'blur(14px)' }}>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                      🌾 {language === 'am' ? 'ዛሬ ለኢትዮጵያ ግብርና የምክር ቦርድ' : 'Ethiopia Farm Advisory Board — Today'}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {getWeatherConfig(weather.condition).crops.map((crop, ci) => (
                        <span key={ci} className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(255,255,255,0.75)', color: getWeatherConfig(weather.condition).badgeText || '#065f46', border: '1px solid rgba(0,0,0,0.08)' }}>
                          {translateCrop(crop)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap" style={{ background: 'rgba(255,255,255,0.8)' }}>
                    {getWeatherConfig(weather.condition).alertLevel}{' '}
                    {language === 'am' ? getWeatherConfig(weather.condition).alertLabel.am : getWeatherConfig(weather.condition).alertLabel.en}
                  </span>
                </div>

                {/* Priority legend */}
                <div className="flex flex-wrap gap-3 justify-center mb-5 text-xs font-semibold">
                  <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#dc2626' }}>🔴 {language === 'am' ? 'አስቸኳይ' : 'Urgent'}</span>
                  <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(234,179,8,0.15)', color: '#b45309' }}>🟡 {language === 'am' ? 'አስፈላጊ' : 'Important'}</span>
                  <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#166534' }}>🟢 {language === 'am' ? 'መደበኛ' : 'Routine'}</span>
                </div>

                {/* Tip cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getWeatherConfig(weather.condition).tips.map((tip, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className="rounded-2xl p-5 flex gap-4 items-start hover:scale-[1.02] transition-transform duration-200"
                      style={{ background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(16px)', boxShadow: '0 4px 24px rgba(0,0,0,0.09)' }}>
                      <span className="text-4xl flex-shrink-0 mt-0.5">{tip.icon}</span>
                      <div>
                        <span className="inline-block text-xs font-bold mb-1 opacity-80">{tip.priority}</span>
                        <p className="text-sm text-gray-800 leading-relaxed">{language === 'am' ? tip.am : tip.en}</p>
                      </div>
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