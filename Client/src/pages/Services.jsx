import React from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  QrCode,
  Users,
  Globe,
  TrendingUp,
  Leaf,
  CheckCircle,
  ArrowRight,
  Smartphone,
  Database,
  Lock,
  Truck,
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import LiveChat from '../components/LiveChat';


// Import your images from assets/images/
import AgricultureHero from '../assets/images/About.jfif'
import EthiopianResilience from '../assets/images/ethiopian-resilience.jfif'
import MakingEffort from '../assets/images/making-effort.jfif'
import AgriculturalReforms from '../assets/images/agricultural-reforms.jfif'
// FIX: Corrected variable name from 'Iveco-Genlyon-TruckImage' to 'IvecoGenlyonTruckImage'
import IvecoGenlyonTruckImage from '../assets/images/Iveco-Genlyon-Truck.jfif'

const Services = () => {
  const serviceImages = [
    AgricultureHero,
    IvecoGenlyonTruckImage, // Using the new image for Logistics & Transport
    MakingEffort,
    AgriculturalReforms,
  ];

  const services = [
    {
      icon: Shield,
      title: 'Enhanced Traceability',
      description: 'Complete product journey tracking from farm to consumer using secure, verifiable records for unparalleled transparency.',
      features: [
        'Verifiable transaction records',
        'Real-time supply chain visibility',
        'Fraud prevention and authenticity verification',
        'Automated compliance reporting',
      ],
      image: serviceImages[0],
      link: '/services/traceability'
    },
    {
      icon: Truck,
      title: 'Logistics & Transport',
      description: 'Efficient and reliable transportation solutions connecting farms to markets across Ethiopia, ensuring timely delivery and product integrity.',
      features: [
        'Optimized route planning',
        'Cold chain management (for perishables)',
        'Fleet tracking and real-time updates',
        'Last-mile delivery coordination',
      ],
      image: serviceImages[1],
      link: '/services/transport'
    },
    {
      icon: Users,
      title: 'KYC Verification',
      description:
        'Secure identity verification using Ethiopian National ID for trusted marketplace participation',
      features: [
        'Ethiopian National ID integration',
        'Biometric verification support',
        'Multi-level verification process',
        'Compliance with local regulations',
      ],
      image: serviceImages[2],
      link: '/services/kyc'
    },
    {
      icon: Globe,
      title: 'Digital Marketplace',
      description:
        'Connect farmers directly with buyers, eliminating middlemen and increasing profits',
      features: [
        'Direct farmer-to-buyer connections',
        'Real-time price discovery',
        'Secure payment processing',
        'Multi-language support',
      ],
      image: serviceImages[3],
      link: '/services/marketplace'
    },
    {
      icon: QrCode,
      title: 'QR Code Integration',
      description:
        'Instant product information access through QR code scanning for consumers and stakeholders',
      features: [
        'Instant product history access',
        'Mobile-friendly scanning',
        'Offline capability',
        'Multi-format support',
      ],
      image: serviceImages[0],
      link: '/services/qrcode'
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Insights',
      description:
        'Comprehensive data analytics to help stakeholders make informed business decisions',
      features: [
        'Market trend analysis',
        'Price forecasting',
        'Supply chain optimization',
        'Performance dashboards',
      ],
      image: serviceImages[1],
      link: '/services/analytics'
    },
    {
      icon: Leaf,
      title: 'Sustainability Tracking',
      description:
        'Monitor and promote sustainable farming practices with environmental impact tracking',
      features: [
        'Carbon footprint tracking',
        'Organic certification management',
        'Environmental impact reports',
        'Sustainability scoring',
      ],
      image: serviceImages[2],
      link: '/services/sustainability'
    }
  ]

  const additionalServices = [
    {
      icon: Smartphone,
      title: 'Mobile App',
      description: 'Access all platform features on-the-go with our mobile application'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Secure cloud storage and management of all agricultural data'
    },
    {
      icon: Lock,
      title: 'Security',
      description: 'Enterprise-grade security protecting all user data and transactions'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient section-padding text-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Comprehensive digital solutions for Ethiopian agriculture, connecting every
              stakeholder in the supply chain with transparency and trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Core Platform Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our innovative services are transforming Ethiopian agriculture
            </p>
          </motion.div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <service.icon className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="group" href={service.link}>
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="rounded-lg card-shadow-lg w-full h-80 object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Supporting services that enhance your experience on our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="text-center h-full">
                  <div>
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-emerald-100 rounded-full">
                        <service.icon className="h-8 w-8 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding hero-gradient text-white">
        <div className="container-max text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Agricultural Business?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
              Join thousands of Ethiopian farmers and businesses already benefiting from our
              comprehensive agricultural platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="large"
                className="bg-gray-600 text-white hover:bg-green-200-700"
                href="/login"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="large"
                className="bg-green-400 text-white hover:bg-gray-600"
                href="/contact"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Live Chat Component */}
      <LiveChat />
    </div>
  )
}

export default Services;