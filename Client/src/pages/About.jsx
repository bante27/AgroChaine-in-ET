import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Target, Award, Globe } from 'lucide-react';
import Card from '../components/common/Card'; // Assuming Card is a styled component that accepts props

// Images
import WestGojjamZon from '../assets/images/west gojjam zon.jfif'; // For Hero Section background
import TeffImage from '../assets/images/teff.jfif';
import EthiopiaAmharaGojjamTeff from '../assets/images/ethiopia-amhara-gojjam-teff.jfif';
import ForProduction from '../assets/images/for-production.jfif';
import AgricultureQuality from '../assets/images/agriculture-quality.jfif';
import VegProduct from '../assets/images/veg-product.jfif';
import Farmer from '../assets/images/Farmer.jfif';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To revolutionize Ethiopian agriculture by creating a transparent, efficient, and profitable supply chain ecosystem powered by  technology.'
    },
    {
      icon: Users,
      title: 'Our Vision',
      description: 'To become the leading agricultural technology platform in Africa, empowering farmers and connecting communities through innovation.'
    },
    {
      icon: Award,
      title: 'Our Values',
      description: 'Transparency, innovation, sustainability, and empowerment drive everything we do to support Ethiopian agricultural communities.'
    },
    {
      icon: Globe,
      title: 'Our Impact',
      description: 'Creating lasting positive change in rural communities by providing access to global markets and fair pricing for agricultural products.'
    }
  ];

  const team = [
    {
      name: 'M.S Tilahun Sitotaw',
      role: 'CEO & Founder',
      image: '../../src/assets/images/freee.jpg',
      bio: 'Agricultural economist with 15+ years experience in Ethiopian farming systems'
    },
    {
      name: 'Bantalem Mitiku',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/9946445/pexels-photo-9946445.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'software engineer specializing in supply chain solutions'
    },
    {
      name: 'Kebede Worku',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/11099197/pexels-photo-11099197.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Former agricultural extension officer with deep knowledge of Ethiopian farming practices'
    },
    {
      name: 'Dr. Meron Assefa',
      role: 'Head of Research',
      image: 'https://images.pexels.com/photos/16818131/pexels-photo-16818131.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Agricultural researcher focused on sustainable farming and food security'
    }
  ];

  const storyImages = [
    TeffImage,
    EthiopiaAmharaGojjamTeff,
    ForProduction,
    AgricultureQuality,
    VegProduct,
    Farmer
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalTime = 3000;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % storyImages.length
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [storyImages.length]);

  const currentStoryImage = storyImages[currentImageIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-rose-700 font-sans text-gray-800">
      {/* Hero Section */}
      <section
        className="relative section-padding text-white bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${WestGojjamZon})` }}
      >
        {/* Modern Overlay with Gradient and Subtle Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-gray-950 opacity-90"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff20 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="container-max relative z-10 py-24 sm:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <h1 className="text-6xl font- mb-8 drop-shadow-lg leading-tight">
              About AgroChain Ethiopia: <span className="text-emerald-300">Empowering Agricultural Connections</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
              We're dedicated to transforming Ethiopia's agricultural landscape by building a **secure, transparent, and efficient supply chain**. Our innovative platform connects **farmers directly to markets**, 
              ensures **fair prices**, and provides **end-to-end traceability** for all agricultural products, benefiting everyone from producer to consumer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section: Image carousel */}
      <section className="section-padding bg-lime-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-gray-950 transform -skew-y-3 scale-110 origin-top-left -translate-y-1/4"></div>
        <div className="container-max relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-5xl font-bold text-gray-950 mb-8 leading-tight">
                Our <span className="text-gray-950">Journey</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-200 leading-relaxed">
                <p>
                  AgroChain Ethiopia was born from a simple observation: Ethiopian farmers,
                  despite producing some of the world's finest agricultural products, were
                  not receiving fair compensation for their hard work.
                </p>
                <p>
                  Traditional supply chains were opaque, inefficient, and dominated by
                  middlemen who captured most of the value. Farmers struggled to access
                  markets, verify product authenticity, and build trust with buyers.
                </p>
                <p>
                  We saw an opportunity to leverage technology to create a
                  transparent, efficient, and equitable agricultural ecosystem. By
                  connecting farmers directly with buyers and providing complete
                  traceability, we're building a future where everyone in the supply
                  chain benefits fairly.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 30px rgba(0,0,0,0.15)" }}
              className="rounded-xl shadow-2xl overflow-hidden relative h-96 w-full group"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={currentStoryImage}
                  alt="Ethiopian agriculture and farmers"
                  className="w-full h-full object-cover rounded-xl absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-0 transition-opacity duration-300"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-to-br from-blue-950 to-gray-950">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-950 mb-6">
              Our <span className="text-gray-950">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              These principles guide everything we do and shape our unwavering commitment
              to Ethiopian agricultural communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card hover className="h-full bg-emerald-950 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col items-center text-center p-6">
                    <div className="p-4 bg-emerald-100 rounded-full mb-4 shadow-md">
                      <value.icon className="h-8 w-8 text-pink-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {value.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-5" style={{ backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-pink-900 mb-6">
              Meet Our <span className="text-pink-900">Dedicated Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team combines deep agricultural expertise with
              cutting-edge technology skills to drive innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card hover className="text-center bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform duration-300 hover:-translate-y-2">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-5 object-cover border-4 border-emerald-300 shadow-md"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 font-semibold mb-3 text-base">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gray-950 text-white shadow-inner">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="text-5xl font-extrabold mb-3">10,000+</div>
              <div className="text-emerald-100 text-lg">Farmers Registered</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="text-5xl font-extrabold mb-3">500+</div>
              <div className="text-emerald-100 text-lg">Products Tracked</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="text-5xl font-extrabold mb-3">50+</div>
              <div className="text-emerald-100 text-lg">Partner Organizations</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="text-5xl font-extrabold mb-3">$2M+</div>
              <div className="text-emerald-100 text-lg">Farmer Income Generated</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;