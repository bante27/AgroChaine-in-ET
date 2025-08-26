import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Leaf, TrendingUp, CheckCircle, ArrowRight, Play, Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import LiveChat from '../components/LiveChat';

// Import your videos from src/assets/
import video2 from '../assets/crops1.mp4';
import video3 from '../assets/teff.mp4';
import video1 from '../assets/Video Background with Overlay.mp4';
import video4 from '../assets/berllly.mp4';

// Import testimonial images
import ahmedImage from '../assets/images/Jima coffe farmer.jfif';
import fatumaImage from '../assets/images/Distributor.jfif';
import bekeleImage from '../assets/images/Retailer.jfif';

const Home = () => {
    const videoRefs = useRef([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Array of all video sources AND their corresponding text content
    const heroContent = [
        {
            video: video1,
            title: (
                <>
                    AgroChain{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
                        Ethiopia
                    </span>
                </>
            ),
            tagline: 'A National ID-Integrated Food Traceability Platform',
            description:
                'Connecting farmers, distributors, retailers, and consumers to ensure food safety, transparency, and trust in Ethiopia\'s food supply chain.',
        },
        {
            video: video2,
            title: (
                <>
                    Empowering{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
                        Farmers
                    </span>
                </>
            ),
            tagline: 'Direct Market Access for Agricultural Producers',
            description:
                'AgroChain provides Ethiopian farmers with direct access to markets, fair pricing, and secure transactions, boosting their livelihoods and the economy.',
        },
        {
            video: video3,
            title: (
                <>
                    Ensuring{' '}
                    <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        Food Safety
                    </span>
                </>
            ),
            tagline: 'Unmatched Transparency from Farm to Fork',
            description:
                'Consumers can verify the origin, journey, and quality of their food, promoting health and confidence in every bite.',
        },
        {
            video: video4,
            title: (
                <>
                    Building{' '}
                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        Trust
                    </span>
                </>
            ),
            tagline: 'Revolutionizing Ethiopia\'s Food Supply Chain',
            description:
                'Our platform fosters a transparent and efficient ecosystem, reducing fraud and ensuring compliance with national and international standards.',
        },
    ];

    const testimonials = [
        {
            name: 'Ahmed Hassan',
            role: 'Coffee Farmer, Jimma',
            content: 'AgroChain has transformed how I connect with buyers. The traceability system gives my customers confidence in the quality of my coffee, ensuring fair value.',
            rating: 5,
            image: ahmedImage
        },
        {
            name: 'Fatuma Ali',
            role: 'Distributor, Addis Ababa',
            content: 'The platform has streamlined our operations significantly. We can now track every product from source to delivery, increasing efficiency and reducing waste.',
            rating: 5,
            image: fatumaImage
        },
        {
            name: 'Bekele Tadesse',
            role: 'Retailer, Hawassa',
            content: 'Our customers love being able to trace their food back to its source. It has increased trust and sales, making our produce more desirable.',
            rating: 5,
            image: bekeleImage
        }
    ];

    const features = [
        {
            icon: Shield,
            title: 'National ID Integration',
            description: 'Secure verification system using Ethiopian National ID for authentic user registration and enhanced security.',
            gradient: 'from-blue-600 to-cyan-600'
        },
        {
            icon: Leaf,
            title: 'Food Traceability',
            description: 'Track food products from farm to table with immutable blockchain technology, ensuring provenance.',
            gradient: 'from-emerald-600 to-green-600'
        },
        {
            icon: Users,
            title: 'Multi-User Platform',
            description: 'Connect farmers, distributors, retailers, and consumers seamlessly in one integrated ecosystem.',
            gradient: 'from-purple-600 to-pink-600'
        },
        {
            icon: TrendingUp,
            title: 'Market Analytics',
            description: 'Access real-time market insights and pricing information for informed decisions and optimized sales.',
            gradient: 'from-amber-600 to-orange-600'
        }
    ];

    const benefits = [
        'Enhanced food safety and quality assurance with verifiable data',
        'Reduced food fraud and counterfeiting through technology transparency',
        'Improved supply chain efficiency and transparency for all stakeholders',
        'Better market access and fair pricing for farmers, boosting incomes',
        'Increased consumer trust and confidence in local produce',
        'Streamlined government regulatory compliance and reporting'
    ];

    const stats = [
        { number: '10,000+', label: 'Registered Farmers', icon: Users },
        { number: '500+', label: 'Active Distributors', icon: TrendingUp },
        { number: '50,000+', label: 'Products Tracked', icon: Leaf },
        { number: '99.9%', label: 'Platform Uptime', icon: Shield }
    ];

    // Callback to handle video ending and switch to the next video and content
    const handleVideoEnd = useCallback(() => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
    }, [heroContent.length]);

    // Effect to manage testimonial auto-slide
    useEffect(() => {
        const testimonialTimer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000); // Change testimonial every 5 seconds

        return () => {
            clearInterval(testimonialTimer);
        };
    }, [testimonials.length]);

    // New useEffect to play the current video
    useEffect(() => {
        videoRefs.current.forEach(video => {
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
                    .then(() => {
                        console.log(`Video ${currentVideoIndex + 1} started playing.`);
                    })
                    .catch(error => {
                        if (error.name === "AbortError") {
                            console.warn(`Video playback for index ${currentVideoIndex} was aborted.`);
                        } else {
                            console.error(`Error playing video for index ${currentVideoIndex}:`, error);
                        }
                    });
            }
            if (currentVideoIndex === 0) setVideoLoaded(true);
        }
    }, [currentVideoIndex]);

    // Animation variants for Framer Motion
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } }
    };

    const itemFadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="relative min-h-screen font-sans text-gray-900 antialiased bg-gradient-to-b from-gray-50 to-emerald-50/30">
            {/* Hero Section with Video Slider */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
                {/* Background Videos */}
                <div className="absolute inset-0 z-0">
                    {heroContent.map((item, index) => (
                        <video
                            key={index}
                            ref={el => videoRefs.current[index] = el}
                            className={`w-full h-full object-cover absolute top-0 left-0 transition-all duration-1000 ${
                                index === currentVideoIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                            }`}
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
                    {/* Gradient Overlay with Glassmorphism */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70 mix-blend-multiply backdrop-blur-sm"></div>
                    {/* 3D Animated Particles */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-gradient-to-r from-emerald-300/50 to-lime-300/50 shadow-lg"
                                style={{
                                    width: `${Math.random() * 80 + 40}px`,
                                    height: `${Math.random() * 80 + 40}px`,
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    animation: `float3d ${Math.random() * 12 + 8}s infinite ease-in-out`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    transformStyle: 'preserve-3d'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Hero Content with 3D Tilt */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="relative z-10 text-center text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 perspective-1500"
                >
                    <motion.div
                        className="transform transition-transform duration-500 hover:[transform:rotateX(5deg)_rotateY(5deg)]"
                    >
                        <motion.h1
                            variants={itemFadeInUp}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight"
                        >
                            {heroContent[currentVideoIndex].title}
                        </motion.h1>
                        <motion.p
                            variants={itemFadeInUp}
                            className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6 sm:mb-8 font-semibold text-gray-100"
                        >
                            {heroContent[currentVideoIndex].tagline}
                        </motion.p>
                        <motion.p
                            variants={itemFadeInUp}
                            className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 text-gray-200 max-w-4xl mx-auto leading-relaxed"
                        >
                            {heroContent[currentVideoIndex].description}
                        </motion.p>
                    </motion.div>
                    <motion.div variants={itemFadeInUp} className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                        <Link
                            to="/services"
                            className="group bg-gradient-to-r from-emerald-600 to-lime-500 hover:from-emerald-700 hover:to-lime-600 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 transform hover:-translate-y-2 hover:scale-105 inline-flex items-center space-x-3"
                        >
                            <span>Explore Services</span>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </Link>
                        <button className="group flex items-center space-x-3 text-white hover:text-lime-300 transition-colors duration-300">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                                <Play className="w-4 h-4 sm:w-6 sm:h-6 ml-0.5 sm:ml-1 text-lime-300" />
                            </div>
                            <span className="text-base sm:text-lg font-semibold">Watch Demo</span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Video Indicator Dots with Glow */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2 sm:space-x-3">
                    {heroContent.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentVideoIndex(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 shadow-md ${
                                index === currentVideoIndex ? 'bg-lime-400 scale-150 shadow-lime-400/50' : 'bg-white/60 hover:bg-white/90 hover:scale-125'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Scroll Indicator with Modern Animation */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="animate-bounce duration-1000">
                        <div className="w-4 h-8 sm:w-6 sm:h-10 border-2 border-lime-300/70 rounded-full flex justify-center shadow-lg">
                            <div className="w-1 h-2 sm:w-1 sm:h-3 bg-lime-300 rounded-full mt-1 sm:mt-2 animate-ping"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section with 3D Flip Effect */}
            <section className="py-16 sm:py-20 bg-gradient-to-br from-emerald-100/50 to-lime-100/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={staggerContainer}
                        viewport={{ once: true, amount: 0.3 }}
                        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 perspective-2000"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                variants={itemFadeInUp}
                                key={index}
                                className="group relative h-36 sm:h-44 md:h-48 [perspective:1000px]"
                            >
                                <div className="absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                                    {/* Front Face */}
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col items-center justify-center [backface-visibility:hidden]">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-600 to-lime-600 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-md">
                                            <stat.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                                        </div>
                                        <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-emerald-800 mb-1">{stat.number}</div>
                                        <div className="text-xs sm:text-sm md:text-base text-emerald-700 font-medium text-center">{stat.label}</div>
                                    </div>
                                    {/* Back Face */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-lime-600 rounded-2xl p-4 sm:p-6 shadow-xl flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                        <div className="text-white text-center font-bold text-sm sm:text-base md:text-lg">
                                            Join the Future!
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section with Enhanced 3D Hover */}
            <section className="py-20 sm:py-24 bg-white/30 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                            Powerful <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">Features</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Innovative solutions for Ethiopia's food traceability challenges.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={staggerContainer}
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 perspective-2000"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                variants={itemFadeInUp}
                                key={index}
                                className="group relative h-full [perspective:1500px]"
                            >
                                <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-emerald-100/50 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 group-hover:[transform:rotateX(8deg)_rotateY(8deg)] flex flex-col overflow-hidden">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-2xl`}>
                                        <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                                    </div>
                                    <h3 className="text-base sm:text-lg lg:text-xl font-extrabold text-gray-900 mb-2 sm:mb-3 lg:mb-4 text-center tracking-tight">{feature.title}</h3>
                                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 text-center leading-relaxed flex-grow">{feature.description}</p>
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-lime-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section with 3D Card Tilt */}
            <section className="py-20 sm:py-24 bg-gradient-to-br from-emerald-700 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3)_0%,transparent_50%)] animate-pulse-slow"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeInUp}
                            viewport={{ once: true, amount: 0.3 }}
                            className="text-white perspective-1500"
                        >
                            <motion.h2
                                variants={itemFadeInUp}
                                className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 tracking-tight"
                            >
                                Why Choose <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">AgroChain Ethiopia?</span>
                            </motion.h2>
                            <motion.p
                                variants={itemFadeInUp}
                                className="text-base sm:text-lg md:text-xl text-emerald-100 mb-6 sm:mb-8 leading-relaxed opacity-90"
                            >
                                Our platform addresses critical challenges in Ethiopia's food supply chain while providing innovative solutions for all stakeholders.
                            </motion.p>
                            <motion.div variants={itemFadeInUp} className="space-y-3 sm:space-y-4">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        variants={itemFadeInUp}
                                        key={index}
                                        className="flex items-center space-x-3 sm:space-x-4 group p-3 sm:p-4 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 transform hover:-translate-x-2 hover:scale-105 shadow-md hover:shadow-lg"
                                    >
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-amber-400/80 rounded-full flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-900" />
                                        </div>
                                        <span className="text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-medium">{benefit}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true, amount: 0.4 }}
                            className="relative [perspective:1500px]"
                        >
                            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-emerald-200/50 transition-all duration-500 transform hover:[transform:rotateY(10deg)_rotateX(5deg)] hover:scale-105 hover:shadow-emerald-300/30">
                                <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-slow">
                                        <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-900 tracking-tight">Get Started Today</h3>
                                </div>
                                <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-4 sm:mb-6 lg:mb-8 leading-relaxed">
                                    Join thousands of farmers, distributors, and retailers already using AgroChain Ethiopia to improve their food supply chain operations.
                                </p>
                                <div className="space-y-3 sm:space-y-4">
                                    <Link
                                        to="/Login"
                                        className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-teal-400/50 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 w-full"
                                    >
                                        Get Started Now <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3 border-2 border-emerald-400 text-emerald-100 rounded-full font-bold text-sm sm:text-base hover:bg-emerald-400/10 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 w-full"
                                    >
                                        Contact Sales
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section with 3D Depth */}
            <section className="py-20 sm:py-24 bg-gradient-to-b from-gray-50 to-emerald-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-12 sm:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight">
                            What Our <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Users Say</span>
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Real stories from farmers, distributors, and retailers across Ethiopia.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true, amount: 0.4 }}
                        className="relative max-w-4xl mx-auto [perspective:2000px]"
                    >
                        <AnimatePresence mode="wait">
                            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-emerald-100/50 transition-all duration-500 transform hover:scale-105 hover:[transform:rotateY(8deg)_rotateX(4deg)] hover:shadow-emerald-300/30">
                                <motion.div
                                    key={currentTestimonial}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <img
                                        src={testimonials[currentTestimonial].image}
                                        alt={testimonials[currentTestimonial].name}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-4 sm:mb-6 ring-4 ring-emerald-200 shadow-lg transform hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="flex items-center space-x-1 mb-4 sm:mb-6">
                                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-current animate-twinkle" />
                                        ))}
                                    </div>
                                    <blockquote className="text-base sm:text-lg md:text-xl text-gray-800 mb-4 sm:mb-6 lg:mb-8 max-w-3xl italic leading-relaxed font-serif">
                                        "{testimonials[currentTestimonial].content}"
                                    </blockquote>
                                    <div className="text-base sm:text-lg font-extrabold text-gray-900">{testimonials[currentTestimonial].name}</div>
                                    <div className="text-sm sm:text-base text-emerald-600 font-semibold">{testimonials[currentTestimonial].role}</div>
                                </motion.div>
                            </div>
                        </AnimatePresence>

                        {/* Testimonial Navigation Buttons */}
                        <button
                            onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                            className="absolute -left-4 sm:-left-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 z-20 hidden md:block border border-emerald-100 hover:border-emerald-300 hover:scale-110"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                        </button>
                        <button
                            onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                            className="absolute -right-4 sm:-right-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 z-20 hidden md:block border border-emerald-100 hover:border-emerald-300 hover:scale-110"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                        </button>

                        {/* Testimonial Dot Indicators */}
                        <div className="flex justify-center space-x-2 sm:space-x-3 mt-6 sm:mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 shadow-sm ${
                                        index === currentTestimonial ? 'bg-emerald-600 scale-150 shadow-emerald-400/50' : 'bg-gray-300 hover:bg-gray-400 hover:scale-125'
                                    }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action Section with Parallax Background */}
            <section className="py-20 sm:py-24 bg-fixed bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://source.unsplash.com/random/1920x1080/?ethiopia,agriculture")' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/90 to-teal-800/90 mix-blend-multiply"></div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInUp}
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white perspective-1500"
                >
                    <motion.h2
                        variants={itemFadeInUp}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 sm:mb-8 leading-tight tracking-tight"
                    >
                        Join the <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">Future of Ethiopian Agriculture</span>
                    </motion.h2>
                    <motion.p
                        variants={itemFadeInUp}
                        className="text-base sm:text-lg md:text-xl text-emerald-100 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed opacity-90"
                    >
                        Experience unparalleled transparency, efficiency, and trust with AgroChain Ethiopia.
                    </motion.p>
                    <motion.div variants={itemFadeInUp} className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                        <Link
                            to="/Login"
                            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-white to-gray-100 text-emerald-800 rounded-full font-extrabold text-sm sm:text-base shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 hover:[transform:rotateY(5deg)]"
                        >
                            Get Started Now <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 animate-bounce-x" />
                        </Link>
                        <Link
                            to="/learn-more"
                            className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-4 border-2 border-white/80 text-white rounded-full font-extrabold text-sm sm:text-base hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 hover:[transform:rotateY(5deg)]"
                        >
                            Learn More
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Live Chat Component */}
            <LiveChat />

            <style jsx>{`
                @keyframes float3d {
                    0% { transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg); }
                    50% { transform: translate3d(0, -25px, 30px) rotateX(10deg) rotateY(15deg); }
                    100% { transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                @keyframes bounce-x {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(5px); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s infinite ease-in-out;
                }
                .animate-twinkle {
                    animation: twinkle 1.5s infinite ease-in-out;
                }
                .animate-bounce-x {
                    animation: bounce-x 1s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default Home;