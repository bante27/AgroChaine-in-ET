import React from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, // For tracking
  Truck,
  Package, // For cargo integrity
  Clock, // For timely delivery
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

// Import new transport-specific images
import CovenantTransportImage from '../assets/images/Convenant-Transport.jfif'
import IvecoGenlyonTruckImage from '../assets/images/Iveco-Genlyon-Truck.jfif'

const Transport = () => {
  const features = [
    {
      icon: Truck,
      title: 'Diverse Fleet',
      description: 'Access to a network of vehicles suited for various agricultural products, from grains to perishables.',
    },
    {
      icon: MapPin,
      title: 'Real-time Tracking',
      description: 'Monitor your shipments in real-time from farm to destination, ensuring transparency and accountability.',
    },
    {
      icon: Package,
      title: 'Cargo Integrity',
      description: 'Solutions for maintaining optimal conditions, including cold chain management for sensitive goods.',
    },
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'Optimized logistics and route planning to minimize delays and ensure products reach markets fresh.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section for Transport */}
      <section
        className="relative section-padding text-white bg-cover bg-center"
        // Changed hero image to IvecoGenlyonTruckImage
        style={{ backgroundImage: `url(${IvecoGenlyonTruckImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="container-max relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">
              Logistics & Transport Services
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Connecting Ethiopian farms to markets with efficient, reliable, and transparent transportation solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Streamlining Your Agricultural Supply Chain
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Effective logistics and transport are crucial for agricultural success. AgroChain Ethiopia provides seamless, secure, and timely delivery services to ensure your produce reaches its destination in optimal condition, whether local markets or export hubs.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We leverage technology to optimize routes, manage fleets, and provide real-time updates, giving you peace of mind and reducing post-harvest losses.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={CovenantTransportImage} // Changed image to CovenantTransportImage
                alt="Agricultural Transport"
                className="w-full h-80 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Transport Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key aspects of how we ensure your agricultural products are moved efficiently
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-emerald-100 rounded-full">
                      <feature.icon className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action for Transport */}
      <section className="section-padding hero-gradient text-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Need Reliable Agricultural Transport?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
              Let us handle your logistics, so you can focus on what you do best – farming.
            </p>
            <Button
              size="large"
              className="bg-pink-600 text-white hover:bg-gray-700"
            >
              Get a Transport Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Transport