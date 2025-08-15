import React, { useState } from 'react'
import { motion } from 'framer-motion'
import LiveChat from '../components/LiveChat';

import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Headphones
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import toast from 'react-hot-toast'
import contactBg from '../assets/images/bg-login.jfif' // Import the background image

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      details: ['Bole Sub City, Addis Ababa', 'Ethiopia, East Africa', 'P.O. Box 12345']
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['+251985076701', '+251927993894']
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: ['info@agrochain.et', 'support@agrochain.et', 'sales@agrochain.et']
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM', 'Sunday: Closed']
    }
  ]

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: 'Start Chat'
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users and share experiences',
      action: 'Join Forum'
    },
    {
      icon: Headphones,
      title: 'Phone Support',
      description: 'Speak directly with our technical experts',
      action: 'Call Now'
    }
  ]

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${contactBg})`
      }}
    >
      <div className="w-full">
        {/* Hero Section */}
        <section className="section-padding text-white">
          <div className="container-max">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-emerald-100 leading-relaxed">
                Have questions about AgroChain Ethiopia? We're here to help you
                transform your agricultural business with innovative technology.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="section-padding text-white">
          <div className="container-max">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <Card className="h-full">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Enter your full name" error={errors.name} />
                      <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="Enter your email" error={errors.email} />
                    </div>
                    <Input label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} required placeholder="What is this about?" error={errors.subject} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
                      <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={6} className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`} placeholder="Tell us how we can help you..." />
                      {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                    </div>
                    <Button type="submit" loading={isSubmitting} className="w-full" size="large">
                      <Send className="mr-2 h-5 w-5" /> Send Message
                    </Button>
                  </form>
                </Card>
              </motion.div>

              {/* Contact Info */}
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
                {contactInfo.map((info, index) => (
                  <Card key={index} hover>
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-emerald-100 rounded-full">
                        <info.icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                        <div className="space-y-1">
                          {info.details.map((detail, i) => (
                            <p key={i} className="text-gray-600">{detail}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="section-padding text-white">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Other Ways to Get Support</h2>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">Choose the support option that works best for you</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportOptions.map((option, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Card hover className="text-center h-full">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-emerald-100 rounded-full">
                        <option.icon className="h-8 w-8 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{option.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>
                    <Button variant="outline" className="w-full">{option.action}</Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="section-padding">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us on the Map</h2>
              <div className="rounded-lg overflow-hidden card-shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.852079032626!2d38.763611!3d9.005401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85c13b2e5917%3A0xe21d011d8d9b1b11!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="AgroChain Ethiopia Office Location"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding text-white">
          <div className="container-max">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-emerald-100 max-w-3xl mx-auto">Quick answers to common questions about AgroChain Ethiopia</p>
            </motion.div>
            <div className="max-w-4xl mx-auto space-y-6">
              {[
                {
                  question: "How do I register as a farmer on the platform?",
                  answer: "Click 'Register' and select 'Farmer'. You’ll need your Ethiopian National ID for verification."
                },
                {
                  question: "What products can I sell on the marketplace?",
                  answer: "You can sell grains, vegetables, fruits, livestock products, and more. All must meet our quality standards."
                },
                {
                  question: "How does blockchain traceability work?",
                  answer: "Every product movement is recorded on blockchain. You can trace items from farm to consumer via QR codes."
                },
                {
                  question: "Is there a mobile app available?",
                  answer: "Yes! Our app is available for Android and iOS so you can use AgroChain anywhere."
                }
              ].map((faq, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Live Chat Component */}
        <LiveChat />
      </div>
    </div>
  )
}

export default Contact;