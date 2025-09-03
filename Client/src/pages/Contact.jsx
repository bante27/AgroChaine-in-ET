import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Mic,
  Trash2,
  FileText,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import LiveChat from '../components/LiveChat';
import toast from 'react-hot-toast';
import contactBg from '../assets/images/bg-login.jfif';

const styles = `
  .polygon-bg {
    clip-path: polygon(0 0, 100% 0, 100% 75%, 85% 100%, 15% 100%, 0 75%);
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
  }
  .deep-shadow {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }
  .hover-lift {
    transition: transform 0.5s ease, box-shadow 0.5s ease;
  }
  .hover-lift:hover {
    transform: translateY(-3px);
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
  .pulse-animation {
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  .animate-gradient-shift {
    animation: gradientShift 10s ease infinite;
    background-size: 200% 200%;
  }
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @media (max-width: 640px) {
    .polygon-bg {
      clip-path: polygon(0 0, 100% 0, 100% 85%, 80% 100%, 20% 100%, 0 85%);
    }
  }
`;

const MAX_FILE_SIZE = 15 * 1024 * 1024 * 1024; // 15GB

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const invalidFiles = selectedFiles.filter((f) => f.size > MAX_FILE_SIZE);
    if (invalidFiles.length > 0) {
      toast.error(`File size must be <= 15GB: ${invalidFiles.map((f) => f.name).join(', ')}`);
      return;
    }
    setFiles(selectedFiles);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () =>
        setAudioBlob(new Blob(audioChunksRef.current, { type: 'audio/webm' }));
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch {
      toast.error('Microphone access denied.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const deleteRecording = () => setAudioBlob(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      files.forEach((file) => payload.append('files', file));
      if (audioBlob) payload.append('voice', audioBlob, 'voice_message.webm');

      const res = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFiles([]);
        setAudioBlob(null);
      } else {
        toast.error(data.error || 'Failed to send message');
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      details: [
        { text: 'Bole Sub City, Addis Ababa', link: 'https://www.google.com/maps/place/Addis+Ababa,+Ethiopia/@9.005401,38.763611,13z', isMap: true },
        { text: 'Ethiopia, East Africa', link: null },
        { text: 'P.O. Box 12345', link: null },
      ],
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: [
        { text: '+251985076701', link: 'tel:+251985076701' },
        { text: '+251927993894', link: 'tel:+251927993894' },
        {text: '+251703036701' ,link: 'tel:+251703036701'},
      ],
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: [
        { text: 'tilahunsitotaw87@gmail.com', link: 'tilahunsitotaw87@gmail.com' },
        { text: 'mitikubanitalem@gmail.com', link: 'mitikubanitalem@gmail.com' },
        { text: 'sales@agrochain.et', link: 'sales@agrochain.et' },
      ],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: [
        { text: 'Monday - Friday: 8:00 AM - 6:00 PM', link: null },
        { text: 'Saturday: 9:00 AM - 4:00 PM', link: null },
        { text: 'Sunday: Closed', link: null },
      ],
    },
  ];

  const faqItems = [
    {
      question: 'How do I register as a farmer on the platform?',
      answer: "Click 'Register' and select 'Farmer'. You’ll need your Ethiopian National ID for verification.",
    },
    {
      question: 'What products can I sell on the marketplace?',
      answer: 'You can sell grains, vegetables, fruits, livestock products, and more. All must meet our quality standards.',
    },
    {
      question: 'How do I track a product using the platform?',
      answer: 'Scan the QR code on the product or enter the product ID in the traceability section to view the full supply chain journey from farm to consumer.',
    },
    {
      question: 'What payment methods are supported in the marketplace?',
      answer: 'We support bank transfers, mobile money (e.g., Telebirr), CBE, and cryptocurrency options for secure and convenient transactions.',
    },
    {
      question: 'How can I get technical support for the platform?',
      answer: 'Contact our support team via email at mitikubanitalem@gmail.com or call +251985076701. We also offer live chat for immediate assistance.',
    },
    {
      question: 'Can I use the platform in multiple languages?',
      answer: 'Yes, AgroChain Ethiopia supports Amharic, English, with plans to add more languages in the future.',
    },
    {
      question: 'What is the cost to join the platform?',
      answer: 'Registration is free for farmers. Premium features for distributors and retailers are available through subscription plans in the future.',
    },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gradient-to-br from-green-100 to-emerald-200 animate-gradient-shift">
      <style>{styles}</style>
      {/* Hero Section - Modern & Attractive */}
      <section
        className="relative h-[80vh] flex items-center justify-center bg-cover bg-center overflow-hidden polygon-bg"
        style={{ backgroundImage: `url(${contactBg})`, backgroundAttachment: 'fixed' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/80 to-blue-600/80"></div>
        <div className="relative z-10 text-center text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 100 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight tracking-wide gradient-text glow-effect"
            style={{ textShadow: '0 6px 15px rgba(0, 0, 0, 0.7)' }}
          >
            Contact <span className="text-yellow-300">AgroChain Ethiopia</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 text-gray-500 bg-white/70 rounded-xl p-4 shadow-md"
          >
            Let’s grow together! Reach out to transform your agricultural journey.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, type: 'spring', stiffness: 100 }}
            className="flex justify-center"
          >
            <a
              href="#contact-form"
              className="bg-teal-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-teal-600 hover:shadow-2xl transition-all duration-300 deep-shadow hover-lift pulse-animation inline-flex items-center gap-3"
            >
              Get in Touch
              <ArrowRight className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Form & Contact Info Section - Modern Layout */}
      <section id="contact-form" className="py-24 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 deep-shadow"
              style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6 gradient-text">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.name ? 'border-red-500' : ''} hover:border-teal-500 transition-all duration-300`}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-red-500 text-sm mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.email ? 'border-red-500' : ''} hover:border-teal-500 transition-all duration-300`}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.subject ? 'border-red-500' : ''} hover:border-teal-500 transition-all duration-300`}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="text-red-500 text-sm mt-1">
                      {errors.subject}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.message ? 'border-red-500' : ''} hover:border-teal-500 transition-all duration-300`}
                    placeholder="Your message..."
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    type="button"
                    onClick={recording ? stopRecording : startRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-200 hover:shadow-md transition-all duration-300 deep-shadow hover-lift"
                    aria-label={recording ? 'Stop recording voice message' : 'Start recording voice message'}
                  >
                    <Mic className={`${recording ? 'text-red-500 animate-pulse' : 'text-emerald-600'} h-5 w-5`} />
                    {recording ? 'Stop' : 'Record Voice'}
                  </button>
                  {audioBlob && (
                    <div className="flex items-center gap-2">
                      <audio controls src={URL.createObjectURL(audioBlob)} className="max-w-xs rounded-lg border border-gray-200" />
                      <Trash2
                        className="cursor-pointer text-red-500 h-5 w-5 hover:text-red-700 transition-colors duration-300"
                        onClick={deleteRecording}
                        aria-label="Delete voice recording"
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-5 w-5 text-emerald-600" /> Attach Files (max 15GB)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-100 file:text-emerald-600 hover:file:bg-emerald-200 transition-all duration-300"
                    aria-label="Upload files"
                  />
                  {files.length > 0 && (
                    <ul className="text-gray-600 text-sm mt-2 bg-white/80 rounded-lg p-2 shadow-md">
                      {files.map((f, i) => (
                        <li key={i} className="flex justify-between p-1">
                          {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex justify-center items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-full font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all duration-300 deep-shadow hover-lift ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl pulse-animation'}`}
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" /> Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 80 }}
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 deep-shadow"
                  style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-emerald-100 rounded-full glow-effect">
                      <info.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2 gradient-text">{info.title}</h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-gray-600 text-sm mb-1 flex items-center gap-2">
                          {detail.link ? (
                            <a
                              href={detail.link}
                              className="text-emerald-600 hover:text-emerald-700 hover:underline transition-all duration-300 hover-lift"
                              aria-label={
                                detail.isMap
                                  ? `View ${detail.text} on Google Maps`
                                  : info.title === 'Phone Numbers'
                                  ? `Call ${detail.text}`
                                  : `Email ${detail.text}`
                              }
                              target={detail.isMap ? '_blank' : undefined}
                              rel={detail.isMap ? 'noopener noreferrer' : undefined}
                            >
                              {detail.text}
                            </a>
                          ) : (
                            detail.text
                          )}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Modern & Attractive */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden polygon-bg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#4ade80_0%,_transparent_70%)] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 100 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight gradient-text glow-effect">
              <span className="text-yellow-400">F</span>requently
              <br />
              <span className="text-yellow-400">A</span>sked
              <br />
              <span className="text-pink-100">Q</span>uestions
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-2 bg-white/20 rounded-lg p-3 shadow-md">
              Discover answers to your questions about AgroChain Ethiopia.
            </p>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 80 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-all duration-300 deep-shadow"
                style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 95%, 0% 95%)' }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left text-white hover:gradient-text transition-colors duration-300"
                  aria-expanded={openFaqIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-gray-200 text-sm p-2 bg-white/10 rounded-lg shadow-md"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Modern & Attractive */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-500 text-white polygon-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, type: 'spring', stiffness: 100 }}
            className="text-4xl sm:text-5xl font-extrabold mb-6 gradient-text glow-effect"
          >
            Ready to Transform <span className="text-teal-200">Your Business?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-lg mb-10 max-w-2xl mx-auto bg-white/20 rounded-lg p-3 shadow-md"
          >
            Join AgroChain Ethiopia and unlock a transparent, efficient agricultural ecosystem.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, type: 'spring', stiffness: 100 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              to="/Login"
              className="bg-teal-500 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-teal-600 hover:shadow-2xl transition-all duration-300 deep-shadow hover-lift pulse-animation inline-flex items-center gap-3"
              aria-label="Get started with AgroChain"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            
          </motion.div>
        </div>
      </section>

      {/* Live Chat Component */}
      <LiveChat />
    </div>
  );
};

export default Contact;