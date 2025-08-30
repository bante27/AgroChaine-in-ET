import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Leaf, TrendingUp, CheckCircle, ArrowRight, Play, Star, Award, ChevronLeft, ChevronRight, ShoppingCart, Globe } from 'lucide-react';
import LiveChat from '../components/LiveChat';

// Import videos
import video1 from '../assets/Video Background with Overlay.mp4';
import video2 from '../assets/crops1.mp4';
import video3 from '../assets/teff.mp4';
import video4 from '../assets/berllly.mp4';

// Import testimonial images
import ahmedImage from '../assets/images/Jima coffe farmer.jfif';
import fatumaImage from '../assets/images/Distributor.jfif';
import bekeleImage from '../assets/images/Retailer.jfif';

// Custom CSS for enhanced polygonal, curved effects, and vibrant design
const styles = `
  .polygon-bg {
    clip-path: polygon(0 0, 100% 0, 100% 75%, 85% 100%, 15% 100%, 0 75%);
  }
  .curve-bg {
    clip-path: ellipse(80% 65% at 50% 35%);
  }
  .deep-shadow {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
  .hover-lift {
    transition: transform 0.5s ease, box-shadow 0.5s ease;
  }
  .hover-lift:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  }
  .gradient-text {
    background: linear-gradient(90deg, #6d28d9, #3b82f6, #14b8a6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .glow-effect {
    filter: drop-shadow(0 0 15px rgba(124, 58, 237, 0.5));
  }
  .parallax-bg {
    background-attachment: fixed;
    background-size: cover;
    background-position: center;
  }
`;

// Demo Modal Component
const DemoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
    >
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 deep-shadow glow-effect">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <video className="w-full h-auto rounded-xl" controls autoPlay>
          <source src={video1} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </motion.div>
  );
};

const Home = () => {
  const videoRefs = useRef([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const heroContent = [
    {
      video: video1,
      title: (
        <>
          AgroChain <span className="gradient-text">Ethiopia</span>
        </>
      ),
      tagline: 'Traceable. Transparent. Trusted.',
      description: 'Revolutionize Ethiopia’s food supply chain with a blockchain-powered platform connecting farmers, distributors, retailers, and consumers.',
    },
    {
      video: video2,
      title: (
        <>
          Empowering <span className="gradient-text">Farmers</span>
        </>
      ),
      tagline: 'Fair Markets, Thriving Futures',
      description: 'Unlock direct market access, secure payments, and fair pricing to empower Ethiopian farmers and boost local economies.',
    },
    {
      video: video3,
      title: (
        <>
          Ensuring <span className="gradient-text">Food Safety</span>
        </>
      ),
      tagline: 'From Farm to Fork, Verified',
      description: 'Empower consumers with full transparency to trace the origin and quality of their food, ensuring safety and trust.',
    },
    {
      video: video4,
      title: (
        <>
          Building <span className="gradient-text">Trust</span>
        </>
      ),
      tagline: 'A Unified Food Ecosystem',
      description: 'Create an efficient, fraud-free supply chain with compliance to global standards, fostering trust across Ethiopia.',
    },
  ];

  const testimonials = [
    {
      name: 'Ahmed Hassan',
      role: 'Coffee Farmer, Jimma',
      content: 'AgroChain’s traceability has made my coffee a trusted choice for buyers, ensuring I get fair prices every time.',
      rating: 5,
      image: ahmedImage,
    },
    {
      name: 'Fatuma Ali',
      role: 'Distributor, Addis Ababa',
      content: 'This platform streamlined our supply chain, cutting costs and ensuring every product is traceable from source to shelf.',
      rating: 5,
      image: fatumaImage,
    },
    {
      name: 'Bekele Tadesse',
      role: 'Retailer, Hawassa',
      content: 'Customers trust our produce because they can trace its journey. AgroChain has boosted our sales and reputation.',
      rating: 5,
      image: bekeleImage,
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'National ID Integration',
      description: 'Securely verify users with Ethiopia’s National ID for trusted transactions and enhanced data security.',
    },
    {
      icon: Leaf,
      title: 'Digital Traceability',
      description: 'Track every product from farm to table with immutable Technology, ensuring authenticity and trust.',
    },
    {
      icon: Users,
      title: 'Connected Ecosystem',
      description: 'Unite farmers, distributors, retailers, and consumers in a seamless, efficient supply chain platform.',
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Leverage real-time market insights to optimize pricing, boost sales, and make data-driven decisions.',
    },
  ];

  const benefits = [
    'Guaranteed food safety with end-to-end traceability',
    'Eliminate fraud with Technology -powered transparency',
    'Streamlined operations for all supply chain stakeholders',
    'Fair pricing and market access for Ethiopian farmers',
    'Increased consumer confidence in local produce',
    'Support for multi-role users: farmers, traders, and customers',
    'Access to detailed analytics for farmers, buyers, and sellers',
    'Empowers local farmers with technology-driven market insights',
    'Seamless compliance with global and national standards',
  ];

  const integrations = [
    { name: 'Worldwide Market Sync', icon: Globe, description: 'Connect effortlessly with global and local marketplaces like Amazon, eBay, and regional platforms for unparalleled reach.' },
    { name: 'Seamless Payment Gateways', icon: ShoppingCart, description: 'Integrate  payment providers, including mobile payments and Tap to Pay, for fast and secure transactions.' },
  ];

  const handleVideoEnd = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
  }, [heroContent.length]);

  useEffect(() => {
    const testimonialTimer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialTimer);
  }, [testimonials.length]);

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      const playPromise = currentVideo.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log(`Video ${currentVideoIndex + 1} started playing.`))
          .catch((error) => console.error(`Error playing video ${currentVideoIndex}:`, error));
      }
      if (currentVideoIndex === 0) setVideoLoaded(true);
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
              className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1500 ${
                index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
              } glow-effect`}
              muted
              playsInline
              loop={false}
              preload="auto"
              onEnded={handleVideoEnd}
              onLoadedData={() => index === 0 && !videoLoaded && setVideoLoaded(true)}
            >
              <source src={item.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
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
              className="bg-purple-600 text-white px-10 py-5 rounded-full font-semibold text-xl hover:bg-purple-700 hover:shadow-2xl hover:scale-115 transition duration-500 flex items-center gap-3 deep-shadow hover-lift glow-effect"
            >
              Explore Marketplace
              <ArrowRight className="h-6 w-6" />
            </Link>
            <button
              onClick={() => setIsDemoOpen(true)}
              className="flex items-center gap-4 text-white px-10 py-5 rounded-full font-semibold text-xl hover:bg-white/20 hover:shadow-2xl hover:scale-115 transition duration-500 deep-shadow hover-lift glow-effect"
            >
              <span className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700">
                <Play className="h-7 w-7 text-white" />
              </span>
              Watch Demo
            </button>
          </motion.div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          {heroContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentVideoIndex(index)}
              className={`w-5 h-5 rounded-full transition duration-500 ${
                index === currentVideoIndex ? 'bg-purple-400 scale-150 glow-effect' : 'bg-white/50 hover:bg-white/80'
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
              Transformative <span className="gradient-text">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
              Cutting-edge solutions to empower Ethiopia’s food supply chain with transparency and efficiency.
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
              Seamless <span className="gradient-text">Integrations (Coming Soon)</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto mt-6">
              Connect AgroChain Ethiopia with global marketplaces and payment solutions for a truly omnichannel experience.
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
                Why <span className="gradient-text">AgroChain Ethiopia?</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our platform delivers unmatched transparency, efficiency, and trust, transforming Ethiopia’s food supply chain for all stakeholders.
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
                <h3 className="text-2xl font-semibold text-gray-900">Join the Revolution</h3>
              </div>
              <p className="text-base text-gray-600 mb-8">
                Join thousands of farmers, distributors, and retailers transforming Ethiopia’s food ecosystem with AgroChain.
              </p>
              <div className="space-y-6">
                <Link
                  to="/marketplace"
                  className="block bg-purple-600 text-white px-10 py-5 rounded-full font-semibold text-xl hover:bg-purple-700 hover:shadow-2xl hover:scale-115 transition duration-500 text-center deep-shadow hover-lift glow-effect"
                >
                  Start Shopping
                  <ArrowRight className="inline ml-3 h-6 w-6" />
                </Link>
                <Link
                  to="/contact"
                  className="block border-2 border-purple-600 text-purple-600 px-10 py-5 rounded-full font-semibold text-xl hover:bg-purple-50 hover:shadow-2xl hover:scale-115 transition duration-500 text-center deep-shadow hover-lift glow-effect"
                >
                  Contact Sales
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
              Voices of <span className="gradient-text">Impact</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto mt-6">
              Hear from farmers, distributors, and retailers thriving with AgroChain Ethiopia.
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
                  className={`w-5 h-5 rounded-full transition duration-500 ${
                    index === currentTestimonial ? 'bg-teal-400 scale-150 glow-effect' : 'bg-white/50 hover:bg-white/80'
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
            Shape the <span className="gradient-text">Future of Ethiopian Agriculture</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="text-xl mb-10 max-w-4xl mx-auto"
          >
            Join AgroChain Ethiopia to drive transparency, efficiency, and trust across the food supply chain.
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
              Sign Up Now
              <ArrowRight className="inline ml-3 h-6 w-6" />
            </Link>
            
          </motion.div>
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-50">
        <LiveChat />
      </div>
    </div>
  );
};

export default Home;