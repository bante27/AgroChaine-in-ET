import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Leaf, TrendingUp, CheckCircle, ArrowRight, Play, Star, Award, ChevronLeft, ChevronRight, ShoppingCart, Globe, X } from 'lucide-react';
import LiveChat from '../components/LiveChat';
import { useLanguage } from '../contexts/LanguageContext';

// Import videos
import video1 from '../assets/teff.mp4';
import video2 from '../assets/crops1.mp4';
import video3 from '../assets/berlly.mp4';
import video4 from '../assets/Video Background with Overlay.mp4';

// Import images
import ahmedImage from '../assets/images/Jima coffe farmer.jfif';
import fatumaImage from '../assets/images/Distributor.jfif';
import bekeleImage from '../assets/images/Retailer.jfif';

const styles = `
  .polygon-bg {
    clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%);
  }
  .gradient-text {
    background: linear-gradient(90deg, #6d28d9, #3b82f6, #14b8a6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .deep-shadow {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  }
  .hover-lift {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .hover-lift:hover {
    transform: translateY(-10px) scale(1.02);
  }
  .glow-effect {
    position: relative;
  }
  .glow-effect::after {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(45deg, #6d28d9, #3b82f6, #14b8a6);
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: -1;
    border-radius: inherit;
  }
  .glow-effect:hover::after {
    opacity: 0.4;
  }
  .parallax-bg {
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
`;

const DemoModal = ({ isOpen, onClose, video }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full aspect-video shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition"
        >
          <X className="h-6 w-6" />
        </button>
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <video
            key={video}
            className="w-full h-full object-contain"
            controls
            autoPlay
            muted
            playsInline
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </motion.div>
    </div>
  );
};

const getHeroContent = (t) => [
  {
    video: video1,
    title: (
      <>
        {t('hero.slides.0.title').split(' ')[0]} <span className="gradient-text text-amber-400">{t('hero.slides.0.title').split(' ')[1]}</span>
      </>
    ),
    tagline: t('hero.slides.0.tagline'),
    description: t('hero.slides.0.description'),
  },
  {
    video: video2,
    title: (
      <>
        {t('hero.slides.1.title').split(' ')[0]} <span className="gradient-text">{t('hero.slides.1.title').split(' ')[1]}</span>
      </>
    ),
    tagline: t('hero.slides.1.tagline'),
    description: t('hero.slides.1.description'),
  },
  {
    video: video3,
    title: (
      <>
        {t('hero.slides.2.title').split(' ')[0]} <span className="gradient-text">{t('hero.slides.2.title').split(' ').slice(1).join(' ')}</span>
      </>
    ),
    tagline: t('hero.slides.2.tagline'),
    description: t('hero.slides.2.description'),
  },
  {
    video: video4,
    title: (
      <>
        {t('hero.slides.3.title').split(' ')[0]} <span className="gradient-text">{t('hero.slides.3.title').split(' ').slice(1).join(' ')}</span>
      </>
    ),
    tagline: t('hero.slides.3.tagline'),
    description: t('hero.slides.3.description'),
  },
];

const Home = () => {
  const { t } = useLanguage();
  const videoRefs = useRef([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const heroContent = getHeroContent(t);

  const testimonials = (t('hero.testimonials.items') || []).map((item, idx) => ({
    ...item,
    rating: 5,
    image: [ahmedImage, fatumaImage, bekeleImage][idx % 3]
  }));

  const features = [
    {
      icon: Shield,
      title: t('features.kyc'),
      description: t('features.kycDesc'),
    },
    {
      icon: Leaf,
      title: t('features.traceability'),
      description: t('features.traceabilityDesc'),
    },
    {
      icon: Users,
      title: t('features.marketplace'),
      description: t('features.marketplaceDesc'),
    },
    {
      icon: TrendingUp,
      title: t('features.security'),
      description: t('features.securityDesc'),
    },
  ];

  const benefits = [
    t('home.benefits.b1'),
    t('home.benefits.b2'),
    t('home.benefits.b3'),
    t('home.benefits.b4'),
    t('home.benefits.b5'),
    t('home.benefits.b6'),
    t('home.benefits.b7'),
    t('home.benefits.b8'),
    t('home.benefits.b9'),
  ];

  const integrations = [
    { name: t('home.integrations.sync'), icon: Globe, description: t('home.integrations.syncDesc') },
    { name: t('home.integrations.payment'), icon: ShoppingCart, description: t('home.integrations.paymentDesc') },
  ];

  const handleVideoEnd = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
  }, [heroContent.length]);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    const videoTimer = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % heroContent.length);
    }, 8000);

    return () => {
      clearInterval(testimonialTimer);
      clearInterval(videoTimer);
    };
  }, [testimonials.length, heroContent.length]);

  useEffect(() => {
    // Stop and reset all videos except the one that should be playing
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentVideoIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });

    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      // Small delay to ensure browser state is ready for play()
      setTimeout(() => {
        try {
          currentVideo.load(); // Standardize and force reload
          const playPromise = currentVideo.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                if (currentVideoIndex === 0) setVideoLoaded(true);
              })
              .catch((error) => {
                if (error.name !== 'AbortError') {
                  console.error(`Error playing video ${currentVideoIndex}:`, error);
                }
              });
          }
        } catch (err) {
          console.error("Playback failed:", err);
        }
      }, 50);
    }
  }, [currentVideoIndex]);

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gradient-to-b from-gray-100 to-gray-400">
      <style>{styles}</style>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden polygon-bg bg-gradient-to-r from-purple-800 to-blue-700 parallax-bg">
        <div className="absolute inset-0">
          {heroContent.map((item, index) => (
            <video
              key={index}
              ref={(el) => (videoRefs.current[index] = el)}
              src={item.video}
              className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ${index === currentVideoIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              muted
              playsInline
              autoPlay={index === currentVideoIndex}
              loop={false}
              preload="auto"
              onEnded={() => index === currentVideoIndex && handleVideoEnd()}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
        </div>
        <div className="relative z-10 text-center text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-4xl sm:text-6xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-2xl glow-effect"
          >
            {heroContent[currentVideoIndex].title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="text-xl sm:text-2xl lg:text-3xl mb-8 font-medium drop-shadow-lg"
          >
            {heroContent[currentVideoIndex].tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            className="text-lg sm:text-xl lg:text-2xl mb-10 max-w-4xl mx-auto drop-shadow-lg"
          >
            {heroContent[currentVideoIndex].description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              to="/marketplace"
              className=" text-white px-10 py-5 rounded-full font-semibold text-xl hover:text-purple-950 hover:shadow-2xl hover:scale-115 transition duration-500 flex items-center gap-3 deep-shadow hover-lift glow-effect"
            >
              {t('hero.explore')}
              <ArrowRight className="h-6 w-6" />
            </Link>
            <button
              onClick={() => setIsDemoOpen(true)}
              className="flex items-center gap-4 text-white px-10 py-5 rounded-full font-semibold text-xl hover:bg-white/20 hover:shadow-2xl hover:scale-115 transition duration-500 deep-shadow hover-lift glow-effect"
            >
              <span className="w-14  rounded-full flex items-center justify-center hover:bg-purple-700">
                <Play className="h-7 w-7 text-white" />
              </span>
              {t('hero.demo')}
            </button>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          {heroContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-5 h-5 rounded-full transition duration-500 ${index === currentVideoIndex ? 'bg-purple-400 scale-150 glow-effect' : 'bg-white/50 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white curve-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900">
              {t('features.title')} <span className="gradient-text">{t('features.titleSpan')}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              {t('features.subtitle')}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: index * 0.3, ease: "easeOut" }}
                className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-10 deep-shadow hover-lift glow-effect"
              >
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">{feature.title}</h3>
                <p className="text-base text-gray-600 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-32 bg-gradient-to-r from-blue-700 to-purple-800 text-white polygon-bg relative parallax-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              {t('home.integrations.title')} <span className="gradient-text">{t('home.integrations.titleSpan')}</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto mt-6">
              {t('home.integrations.subtitle')}
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: index * 0.3, ease: "easeOut" }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 deep-shadow hover-lift glow-effect"
              >
                <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <integration.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">{integration.name}</h3>
                <p className="text-base text-center">{integration.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-white curve-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900">
                {t('home.benefits.title')} <span className="gradient-text">{t('home.benefits.titleSpan')}</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {t('home.benefits.subtitle')}
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: index * 0.2, ease: "easeOut" }}
                    className="flex items-center gap-4"
                  >
                    <CheckCircle className="h-8 w-8 text-purple-500 glow-effect" />
                    <span className="text-lg text-gray-800">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="bg-gradient-to-br from-white to-gray-100 rounded-3xl p-10 deep-shadow hover-lift glow-effect"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">{t('home.benefits.joinRevolution')}</h3>
              </div>
              <p className="text-base text-gray-600 mb-8">
                {t('home.benefits.revolutionDesc')}
              </p>
              <div className="space-y-6">
                <Link
                  to="/marketplace"
                  className="block bg-purple-600 text-white px-10 py-5 rounded-full font-semibold text-xl hover:bg-purple-700 hover:shadow-2xl hover:scale-115 transition duration-500 text-center deep-shadow hover-lift glow-effect"
                >
                  {t('home.cta.startShopping')}
                  <ArrowRight className="inline ml-3 h-6 w-6" />
                </Link>
                <Link
                  to="/contact"
                  className="block border-2 border-purple-600 text-purple-600 px-10 py-5 rounded-full font-semibold text-xl hover:bg-purple-50 hover:shadow-2xl hover:scale-115 transition duration-500 text-center deep-shadow hover-lift glow-effect"
                >
                  {t('home.cta.contactSales')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-gradient-to-r from-purple-800 to-blue-700 text-white polygon-bg relative parallax-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">
              {t('hero.testimonials.title')} <span className="gradient-text">{t('hero.testimonials.titleSpan')}</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto mt-6">
              {t('hero.testimonials.subtitle')}
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-white/15 backdrop-blur-xl rounded-3xl p-10 deep-shadow hover-lift glow-effect"
              >
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-28 h-28 rounded-full object-cover mx-auto mb-6 ring-4 ring-teal-400 glow-effect"
                />
                <div className="flex justify-center gap-3 mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-7 w-7 text-yellow-400 fill-current glow-effect" />
                  ))}
                </div>
                <blockquote className="text-xl mb-6 italic text-gray-100">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="text-lg font-semibold text-center text-white">{testimonials[currentTestimonial].name}</div>
                <div className="text-base text-teal-300 text-center">{testimonials[currentTestimonial].role}</div>
              </motion.div>
            </AnimatePresence>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute -left-16 top-1/2 -translate-y-1/2 p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-500 hidden md:block deep-shadow glow-effect"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute -right-16 top-1/2 -translate-y-1/2 p-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-500 hidden md:block deep-shadow glow-effect"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
            <div className="flex justify-center gap-4 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-5 h-5 rounded-full transition duration-500 ${index === currentTestimonial ? 'bg-teal-400 scale-150 glow-effect' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-32 bg-gradient-to-r from-blue-700 to-purple-800 text-white polygon-bg relative parallax-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6"
          >
            {t('home.cta.title')} <span className="gradient-text">{t('home.cta.titleSpan')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="text-xl mb-10 max-w-4xl mx-auto"
          >
            {t('home.cta.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              to="/Login"
              className="bg-teal-500 text-white px-10 py-5 rounded-full font-semibold text-xl hover:bg-teal-600 hover:shadow-2xl hover:scale-115 transition duration-500 deep-shadow hover-lift glow-effect"
            >
              {t('nav.register')}
              <ArrowRight className="inline ml-3 h-6 w-6" />
            </Link>

          </motion.div>
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {isDemoOpen && (
          <DemoModal
            isOpen={isDemoOpen}
            onClose={() => setIsDemoOpen(false)}
            video={heroContent[currentVideoIndex].video}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50">
        <LiveChat />
      </div>
    </div>
  );
};

export default Home;