import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Leaf, TrendingUp, CheckCircle, ArrowRight, Play, Star, Award, ChevronLeft, ChevronRight } from 'lucide-react';
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

const Home = () => {
    const videoRefs = useRef([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const heroContent = [
        {
            video: video1,
            title: (
                <>
                    AgroChain{' '}
                    <span className="text-emerald-600">Ethiopia</span>
                </>
            ),
            tagline: 'A National ID-Integrated Food Traceability Platform',
            description: 'Connecting farmers, distributors, retailers, and consumers to ensure food safety, transparency, and trust in Ethiopia\'s food supply chain.',
        },
        {
            video: video2,
            title: (
                <>
                    Empowering{' '}
                    <span className="text-emerald-600">Farmers</span>
                </>
            ),
            tagline: 'Direct Market Access for Agricultural Producers',
            description: 'AgroChain provides Ethiopian farmers with direct access to markets, fair pricing, and secure transactions, boosting their livelihoods and the economy.',
        },
        {
            video: video3,
            title: (
                <>
                    Ensuring{' '}
                    <span className="text-teal-600">Food Safety</span>
                </>
            ),
            tagline: 'Unmatched Transparency from Farm to Fork',
            description: 'Consumers can verify the origin, journey, and quality of their food, promoting health and confidence in every bite.',
        },
        {
            video: video4,
            title: (
                <>
                    Building{' '}
                    <span className="text-emerald-600">Trust</span>
                </>
            ),
            tagline: 'Revolutionizing Ethiopia\'s Food Supply Chain',
            description: 'Our platform fosters a transparent and efficient ecosystem, reducing fraud and ensuring compliance with national and international standards.',
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
        },
        {
            icon: Leaf,
            title: 'Food Traceability',
            description: 'Track food products from farm to table with immutable blockchain technology, ensuring provenance.',
        },
        {
            icon: Users,
            title: 'Multi-User Platform',
            description: 'Connect farmers, distributors, retailers, and consumers seamlessly in one integrated ecosystem.',
        },
        {
            icon: TrendingUp,
            title: 'Market Analytics',
            description: 'Access real-time market insights and pricing information for informed decisions and optimized sales.',
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
                    .then(() => console.log(`Video ${currentVideoIndex + 1} started playing.`))
                    .catch(error => console.error(`Error playing video ${currentVideoIndex}:`, error));
            }
            if (currentVideoIndex === 0) setVideoLoaded(true);
        }
    }, [currentVideoIndex]);

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    {heroContent.map((item, index) => (
                        <video
                            key={index}
                            ref={el => videoRefs.current[index] = el}
                            className={`w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-1000 ${index === currentVideoIndex ? 'opacity-100' : 'opacity-0'}`}
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
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 text-center text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                    >
                        {heroContent[currentVideoIndex].title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl sm:text-2xl md:text-3xl mb-8 font-medium"
                    >
                        {heroContent[currentVideoIndex].tagline}
                    </motion.p>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-lg sm:text-xl md:text-2xl mb-10 max-w-4xl mx-auto"
                    >
                        {heroContent[currentVideoIndex].description}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            to="/services"
                            className="bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 hover:shadow-lg hover:scale-105 transition duration-300 flex items-center gap-2"
                        >
                            Explore Services
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <button className="flex items-center gap-3 text-white px-8 py-4 rounded-full font-semibold text-lg hover:text-teal-200 hover:bg-white/10 transition duration-300">
                            <span className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-700">
                                <Play className="h-6 w-6" />
                            </span>
                            Watch Demo
                        </button>
                    </motion.div>
                </div>
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
                    {heroContent.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentVideoIndex(index)}
                            className={`w-4 h-4 rounded-full transition duration-300 ${index === currentVideoIndex ? 'bg-teal-200 scale-125' : 'bg-white/70 hover:bg-white'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                            Powerful <span className="text-emerald-600">Features</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
                            Innovative solutions for Ethiopia's food traceability challenges.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-105 transition duration-300"
                            >
                                <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">{feature.title}</h3>
                                <p className="text-base text-gray-600 text-center">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-emerald-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                                Why Choose <span className="text-teal-200">AgroChain Ethiopia?</span>
                            </h2>
                            <p className="text-xl mb-8">
                                Our platform addresses critical challenges in Ethiopia's food supply chain while providing innovative solutions for all stakeholders.
                            </p>
                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex items-center gap-4"
                                    >
                                        <CheckCircle className="h-7 w-7 text-teal-200" />
                                        <span className="text-lg">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white text-gray-900 rounded-xl p-8 shadow-md"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center">
                                    <Award className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-semibold">Get Started Today</h3>
                            </div>
                            <p className="text-base text-gray-600 mb-8">
                                Join thousands of farmers, distributors, and retailers already using AgroChain Ethiopia to improve their food supply chain operations.
                            </p>
                            <div className="space-y-4">
                                <Link
                                    to="/Login"
                                    className="block bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 hover:shadow-lg hover:scale-105 transition duration-300 text-center"
                                >
                                    Get Started Now
                                    <ArrowRight className="inline ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="block border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-50 hover:shadow-lg hover:scale-105 transition duration-300 text-center"
                                >
                                    Contact Sales
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                            What Our <span className="text-emerald-600">Users Say</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
                            Real stories from farmers, distributors, and retailers across Ethiopia.
                        </p>
                    </motion.div>
                    <div className="max-w-4xl mx-auto relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-lg transition duration-300"
                            >
                                <img
                                    src={testimonials[currentTestimonial].image}
                                    alt={testimonials[currentTestimonial].name}
                                    className="w-24 h-24 rounded-full object-cover mx-auto mb-6 ring-4 ring-emerald-100"
                                />
                                <div className="flex justify-center gap-2 mb-6">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <Star key={i} className="h-6 w-6 text-yellow-500 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-xl text-gray-800 mb-6 italic">
                                    "{testimonials[currentTestimonial].content}"
                                </blockquote>
                                <div className="text-lg font-semibold text-gray-900 text-center">{testimonials[currentTestimonial].name}</div>
                                <div className="text-base text-emerald-600 text-center">{testimonials[currentTestimonial].role}</div>
                            </motion.div>
                        </AnimatePresence>
                        <button
                            onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                            className="absolute -left-12 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition duration-300 hidden md:block"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                            className="absolute -right-12 top-1/2 -translate-y-1/2 p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition duration-300 hidden md:block"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                        <div className="flex justify-center gap-3 mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-4 h-4 rounded-full transition duration-300 ${index === currentTestimonial ? 'bg-emerald-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-20 bg-teal-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl sm:text-5xl font-bold mb-6"
                    >
                        Join the <span className="text-teal-200">Future of Ethiopian Agriculture</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl mb-10 max-w-4xl mx-auto"
                    >
                        Experience unparalleled transparency, efficiency, and trust with AgroChain Ethiopia.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link
                            to="/Login"
                            className="bg-white text-teal-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 hover:shadow-lg hover:scale-105 transition duration-300"
                        >
                            Get Started Now
                            <ArrowRight className="inline ml-2 h-5 w-5" />
                        </Link>
                        <Link
                            to="/learn-more"
                            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 hover:shadow-lg hover:scale-105 transition duration-300"
                        >
                            Learn More
                        </Link>
                    </motion.div>
                </div>
            </section>

            <LiveChat />
        </div>
    );
};

export default Home;