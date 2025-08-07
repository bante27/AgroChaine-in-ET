import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
// Add AnimatePresence here
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence for animations
import { Shield, Users, Leaf, TrendingUp, CheckCircle, ArrowRight, Play, Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';

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
    const videoRefs = useRef([]); // To hold refs to each video element
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videoLoaded, setVideoLoaded] = useState(false); // Still useful for initial load
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
                    <span className="bg-gradient-to-r from-amber-400 to-orange-800 bg-clip-text text-transparent">
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
            gradient: 'from-blue-100 to-pink-950'
        },
        {
            icon: Leaf,
            title: 'Food Traceability',
            description: 'Track food products from farm to table with immutable blockchain technology, ensuring provenance.',
            gradient: 'from-pink-500 to-yellow-700'
        },
        {
            icon: Users,
            title: 'Multi-User Platform',
            description: 'Connect farmers, distributors, retailers, and consumers seamlessly in one integrated ecosystem.',
            gradient: 'from-blue-500 to-yellow-600'
        },
        {
            icon: TrendingUp,
            title: 'Market Analytics',
            description: 'Access real-time market insights and pricing information for informed decisions and optimized sales.',
            gradient: 'from-pink-300 to-green-800'
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
        }, 1000); // Change testimonial every 2 seconds

        return () => {
            clearInterval(testimonialTimer);
        };
    }, [testimonials.length]);

    // New useEffect to play the correct video when currentVideoIndex changes
    useEffect(() => {
        // Pause all videos first
        videoRefs.current.forEach(video => {
            if (video) {
                video.pause();
                video.currentTime = 0; // Reset video to start for seamless loop/transition
            }
        });

        // Play the current video
        const currentVideo = videoRefs.current[currentVideoIndex];
        if (currentVideo) {
            const playPromise = currentVideo.play();

            // The `play()` method returns a Promise
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Video started playing successfully
                    console.log(`Video ${currentVideoIndex + 1} started playing.`);
                }).catch(error => {
                    // This is where you handle the AbortError
                    if (error.name === "AbortError") {
                        console.warn(`Video playback for index ${currentVideoIndex} was aborted. This is often due to quick state changes or browser power saving.`);
                    } else {
                        console.error(`Error playing video for index ${currentVideoIndex}:`, error);
                    }
                });
            }
            // Set initial video loaded state if it's the first video
            if (currentVideoIndex === 0) setVideoLoaded(true);
        }
    }, [currentVideoIndex, handleVideoEnd]); // Added handleVideoEnd to dependency array for correctness


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


    return (
        <div className="relative overflow-hidden font-sans text-gray-800 antialiased">
            {/* Hero Section with Background Video Slider */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gray-900">
                {/* Background Videos */}
                <div className="absolute inset-0 z-0">
                    {heroContent.map((item, index) => (
                        <video
                            key={index}
                            ref={el => videoRefs.current[index] = el}
                            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${
                                index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                            muted
                            playsInline
                            loop={false} // Allow onEnded to fire
                            preload="auto" // Preload for smoother transitions
                            onEnded={handleVideoEnd} // Call handler when current video ends
                            onLoadedData={() => {
                                if (index === 0 && !videoLoaded) { // Only set true for the first video initially
                                    setVideoLoaded(true);
                                }
                            }}
                        >
                            <source src={item.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ))}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>

                    {/* Animated Pattern (subtle, abstract) */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full animate-pulse-slow"></div>
                        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white rounded-full animate-pulse-slow delay-1000"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-2.5 h-2.5 bg-white rounded-full animate-pulse-slow delay-2000"></div>
                        <div className="absolute top-1/2 left-[10%] w-2 h-2 bg-white rounded-full animate-pulse-slow delay-500"></div>
                        <div className="absolute bottom-[15%] right-[20%] w-3.5 h-3.5 bg-white rounded-full animate-pulse-slow delay-1500"></div>
                    </div>
                </div>

                {/* Content */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    className="relative z-10 text-center text-white max-w-6xl mx-auto px-6 py-20"
                >
                    <motion.h1 variants={itemFadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight drop-shadow-lg">
                        {heroContent[currentVideoIndex].title}
                    </motion.h1>
                    <motion.p variants={itemFadeInUp} className="text-xl md:text-2xl lg:text-3xl mb-8 text-gray-200 font-light drop-shadow">
                        {heroContent[currentVideoIndex].tagline}
                    </motion.p>
                    <motion.p variants={itemFadeInUp} className="text-lg md:text-xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                        {heroContent[currentVideoIndex].description}
                    </motion.p>

                    <motion.div variants={itemFadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            to="/services"
                            className="group bg-gradient-to-r from-gray-500 to-pink-600 text-gray-950 px-10 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-green-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 inline-flex items-center space-x-3 border border-green-500"
                        >
                            <span>Explore Services</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <button className="group flex items-center space-x-3 text-white hover:text-pink-400 transition-colors duration-300">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 transform group-hover:scale-110">
                                <Play className="w-7 h-7 ml-1" />
                            </div>
                            <span className="text-xl font-medium">Watch Demo</span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-subtle z-10">
                    <div className="w-7 h-12 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1.5 h-4 bg-white/70 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-r from-emerald-50 to-green-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeInUp}
                        viewport={{ once: true, amount: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div variants={itemFadeInUp} key={index} className="text-center group p-4 rounded-lg">
                                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-105 transition-transform duration-300 shadow-lg">
                                    <stat.icon className="w-10 h-10 text-white" />
                                </div>
                                <div className="text-5xl font-extrabold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24  to bg-purple-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-950 mb-6">
                            Key <span className="text-gray-950">Features</span>
                        </h2>
                        <p className="text-xl text-blue-600 max-w-3xl mx-auto">
                            Innovative solutions for Ethiopia's food traceability challenges.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeInUp}
                        viewport={{ once: true, amount: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
                    >
                        {features.map((feature, index) => (
                            <motion.div variants={itemFadeInUp} key={index} className="group relative">
                                <div className="to bg-purple-950 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-600 hover:border-blue-300 transform hover:-translate-y-3">
                                    <div className={`w-18 h-18 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                                        <feature.icon className="w-9 h-9 text-pink-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                                    <p className="text-gray-500 text-center leading-relaxed text-base">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-gradient-to-br from-gray-950 to bg-pink-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeInUp}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <motion.h2 variants={itemFadeInUp} className="text-5xl md:text-6xl font-bold text-gray-950 mb-8">
                                Why Choose <span className="text-gray-950">AgroChain Ethiopia?</span>
                            </motion.h2>
                            <motion.p variants={itemFadeInUp} className="text-xl text-gray-600 mb-10 leading-relaxed">
                                Our platform addresses critical challenges in Ethiopia's food supply chain
                                while providing innovative solutions for all stakeholders.
                            </motion.p>
                            <motion.div variants={itemFadeInUp} className="grid grid-cols-1 gap-6">
                                {benefits.map((benefit, index) => (
                                    <motion.div variants={itemFadeInUp} key={index} className="flex items-start space-x-4 group p-2 rounded-lg hover:bg-blue-400 transition-colors duration-200">
                                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-purple-800 rounded-full flex items-center justify-center mt-1.5 shadow-md group-hover:scale-110 transition-transform duration-300">
                                            <CheckCircle className="w-5 h-5 text-green-700" />
                                        </div>
                                        <span className="text-gray-700 text-lg leading-relaxed font-medium">{benefit}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={fadeIn}
                            viewport={{ once: true, amount: 0.4 }}
                            className="bg from bg-yellow-900 to bg-violet-950 rounded-3xl p-10 lg:p-12 shadow-2xl border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300"
                        >
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Award className="w-7 h-7 text-pink-900" />
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900">Get Started Today</h3>
                            </div>

                            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                                Join thousands of farmers, distributors, and retailers already using AgroChain Ethiopia
                                to improve their food supply chain operations.
                            </p>

                            <div className="space-y-5">
                                <Link
                                    to="/Login"
                                    className="inline-flex items-center justify-center px-10 py-4 bg-cyan-700 text-white rounded-full font-bold text-lg shadow-lg hover:bg-rose-950 transition-colors duration-300 transform hover:-translate-y-1 w-full"
                                >
                                    Get Started Now <ArrowRight className="ml-3 h-5 w-5" />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center px-10 py-4 border-2 border-emerald-500 text-emerald-600 rounded-full font-bold text-lg hover:bg-emerald-500 hover:text-white transition-colors duration-300 w-full"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-br from-gray-950 to bg-cyan-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true, amount: 0.3 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-950 mb-6">
                            What Our <span className="text-rose-300">Users Say</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Real stories from farmers, distributors, and retailers across Ethiopia.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        variants={fadeIn}
                        viewport={{ once: true, amount: 0.4 }}
                        className="relative max-w-4xl mx-auto"
                    >
                        {/* Corrected: AnimatePresence is now imported */}
                        <AnimatePresence mode="wait">
                            <div className="bg-gradient-to-r from-i to-green-500 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 transform transition-transform duration-300 hover:scale-[1.005]">
                                <motion.div
                                    key={currentTestimonial} // Key prop for AnimatePresence to detect changes
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="flex flex-col items-center text-center"
                                >
                                    <img
                                        src={testimonials[currentTestimonial].image}
                                        alt={testimonials[currentTestimonial].name}
                                        className="w-24 h-24 rounded-full object-cover mb-6 ring-4 ring-emerald-300 shadow-lg border-2 border-white"
                                    />

                                    <div className="flex items-center space-x-1 mb-6">
                                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 text-rose-400 fill-current" />
                                        ))}
                                    </div>

                                    <blockquote className="text-xl md:text-2xl text-gray-800 mb-8 max-w-3xl italic leading-relaxed font-medium">
                                        "{testimonials[currentTestimonial].content}"
                                    </blockquote>

                                    <div className="text-xl font-bold text-gray-900">
                                        {testimonials[currentTestimonial].name}
                                    </div>
                                    <div className="text-gray-950 text-base font-semibold">
                                        {testimonials[currentTestimonial].role}
                                    </div>
                                </motion.div>
                            </div>
                        </AnimatePresence>

                        {/* Testimonial navigation buttons */}
                        <button
                            onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                            className="absolute -left-5 top-1/2 transform -translate-y-1/2 p-4 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors duration-300 z-20 hidden md:block border border-gray-100 hover:border-emerald-300"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-7 h-7 text-gray-700" />
                        </button>
                        <button
                            onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                            className="absolute -right-5 top-1/2 transform -translate-y-1/2 p-4 bg-white/80 rounded-full shadow-lg hover:bg-white transition-colors duration-300 z-20 hidden md:block border border-gray-100 hover:border-emerald-300"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-7 h-7 text-gray-700" />
                        </button>

                        {/* Testimonial dot indicators */}
                        <div className="flex justify-center space-x-3 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                                        index === currentTestimonial ? 'bg-emerald-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-24 bg-gradient-to-r from-rose-700 to-green-800 text-white relative overflow-hidden">
                {/* Subtle texture overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff1a 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute inset-0 bg-pattern-grid opacity-5" style={{ backgroundImage: 'linear-gradient(to right, #ffffff1a 1px, transparent 1px), linear-gradient(to bottom, #ffffff1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>


                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeInUp}
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
                >
                    <motion.h2 variants={itemFadeInUp} className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight drop-shadow-md">
                        Join the <span className="text-emerald-200">Future of Ethiopian Agriculture</span>
                    </motion.h2>
                    <motion.p variants={itemFadeInUp} className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow">
                        Experience unparalleled transparency, efficiency, and trust with AgroChain Ethiopia.
                    </motion.p>
                    <motion.div variants={itemFadeInUp} className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link
                            to="/Login"
                            className="inline-flex items-center justify-center px-10 py-4 bg-white text-emerald-700 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition-colors duration-300 transform hover:-translate-y-1"
                        >
                            Get Started Now <ArrowRight className="ml-3 h-5 w-5" />
                        </Link>
                        <Link
                            to="/learn-more"
                            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors duration-300 transform hover:-translate-y-1"
                        >
                            Learn More
                        </Link>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;