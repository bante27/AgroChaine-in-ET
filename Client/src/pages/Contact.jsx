import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
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
import toast from 'react-hot-toast';
import contactBg from '../assets/images/M.S TilahunSitotaw.jpg';
import { API_URL } from '../utils/apiConfig';

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

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('login.invalidInput');
    if (!formData.email.trim()) newErrors.email = t('login.invalidInput');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('contact.invalidEmail');
    if (!formData.subject.trim()) newErrors.subject = t('login.invalidInput');
    if (!formData.message.trim()) newErrors.message = t('login.invalidInput');
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
      toast.error(t('contact.micDenied'));
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

      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || t('contact.success'));
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFiles([]);
        setAudioBlob(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(data.error || t('contact.error'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      toast.error(t('contact.networkError'));
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
      title: t('contact.office'),
      details: [
        { text: t('contact.officeDetails.bole'), link: 'https://www.google.com/maps/place/Addis+Ababa,+Ethiopia/@9.005401,38.763611,13z', isMap: true },
        { text: t('contact.officeDetails.region'), link: null },
        { text: t('contact.officeDetails.poBox'), link: null },
      ],
    },
    {
      icon: Phone,
      title: t('contact.phoneNumbers'),
      details: [
        { text: '+251985076701', link: 'tel:+251985076701' },
        { text: '+251927993894', link: 'tel:+251927993894' },
        { text: '+251703036701', link: 'tel:+251703036701' },
      ],
    },
    {
      icon: Mail,
      title: t('contact.emailAddresses'),
      details: [

        { text: 'agrochainethiopia@gmail.com', link: 'mailto:agrochainethiopia@gmail.com' },
        { text: 'mitikubanitalem@gmail.com', link: 'mailto:mitikubanitalem@gmail.com' },
        { text: 'sales@agrochain.et', link: 'mailto:sales@agrochain.et' },
      ],
    },
    {
      icon: Clock,
      title: t('contact.hours'),
      details: [
        { text: `${t('contact.hoursMonFri') || 'Monday - Friday'}: 8:00 AM - 6:00 PM`, link: null },
        { text: `${t('contact.hoursSat') || 'Saturday'}: 9:00 AM - 4:00 PM`, link: null },
        { text: `${t('contact.hoursSun') || 'Sunday'}: ${t('contact.hoursClosed') || 'Closed'}`, link: null },
      ],
    },
  ];

  const faqItems = [
    {
      question: t('contact.faq.0.question'),
      answer: t('contact.faq.0.answer'),
    },
    {
      question: t('contact.faq.1.question'),
      answer: t('contact.faq.1.answer'),
    },
    {
      question: t('contact.faq.2.question'),
      answer: t('contact.faq.2.answer'),
    },
    {
      question: t('contact.faq.3.question') || t('contact.faq.0.question'),
      answer: t('contact.faq.3.answer') || t('contact.faq.0.answer'),
    },
  ];

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gradient-to-br from-green-100 to-emerald-200 animate-gradient-shift">
      <style>{styles}</style>
      {/* Hero Section - Modern & Attractive */}
      <section
        className="relative min-h-[88vh] flex items-center overflow-hidden polygon-bg"
        style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #0d3b5e 100%)' }}
      >
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#34d399' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#3b82f6' }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── LEFT: Text Content ── */}
          <div className="flex-1 text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5"
                style={{ background: 'rgba(52,211,153,0.18)', color: '#6ee7b7', border: '1px solid rgba(52,211,153,0.35)' }}>
                🌱 AgroChain Ethiopia
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.1, type: 'spring', stiffness: 90 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-5"
              style={{ color: '#ffffff', textShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
            >
              {t('contact.titlePart1')}{' '}
              <span className="gradient-text glow-effect">{t('contact.titlePart2')}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, type: 'spring', stiffness: 90 }}
              className="text-base sm:text-lg mb-8 max-w-lg leading-relaxed"
              style={{ color: 'rgba(167,243,208,0.92)' }}
            >
              {t('contact.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.4, type: 'spring', stiffness: 90 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact-form"
                className="bg-teal-400 text-gray-900 px-7 py-3.5 rounded-full font-bold text-base hover:bg-teal-300 hover:shadow-2xl transition-all duration-300 deep-shadow hover-lift pulse-animation inline-flex items-center gap-3"
              >
                {t('contact.getInTouch')}
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="tel:+251985076701"
                className="px-7 py-3.5 rounded-full font-bold text-base inline-flex items-center gap-3 transition-all duration-300 hover-lift"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1.5px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}
              >
                📞 +251 985 076 701
              </a>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="flex flex-wrap gap-8 mt-10"
            >
            {/* { [
                { val: '500+', label: t('contact.statFarmers') || 'Farmers Served' },
                { val: '19', label: t('contact.statCities') || 'Cities Covered' },
                { val: '24/7', label: t('contact.statSupport') || 'Support' },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-3xl font-extrabold text-teal-300">{s.val}</p>
                  <p className="text-xs text-emerald-200 mt-0.5">{s.label}</p>
                </div>
              )) 
          } */}
            </motion.div>
          </div>

          {/* ── RIGHT: Fully Visible Portrait Image ── */}
          <div className="flex-1 flex justify-center lg:justify-end relative">
            {/* Decorative ring behind image */}
            <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full pointer-events-none"
              style={{ background: 'rgba(52,211,153,0.10)', border: '2px dashed rgba(52,211,153,0.28)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />

            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.2, type: 'spring', stiffness: 80 }}
              className="relative z-10"
              style={{ animation: 'floatImg 4s ease-in-out infinite' }}
            >
              <img
                src={contactBg}
                alt="Tilahun Sitotaw — AgroChain Ethiopia Founder"
                className="rounded-3xl object-cover object-top"
                style={{
                  width: 'clamp(260px, 34vw, 420px)',
                  height: 'clamp(340px, 46vw, 560px)',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 5px rgba(52,211,153,0.22)',
                  border: '3px solid rgba(52,211,153,0.4)',
                }}
              />
              {/* Name card overlaid at bottom of image */}
              <div className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-2xl"
                style={{ background: 'rgba(6,78,59,0.88)', backdropFilter: 'blur(14px)', border: '1px solid rgba(52,211,153,0.28)' }}>
                <p className="text-white font-bold text-sm">Tilahun Sitotaw</p>
                <p className="text-teal-300 text-xs mt-0.5">Co-Founder &amp; CEO, AgroChain Ethiopia</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating keyframe */}
        <style>{`@keyframes floatImg { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }`}</style>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6 gradient-text">{t('contact.sendMessage')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('contact.fullName')}
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
                      {t('contact.email')}
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
                    {t('contact.subject')}
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
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className={`w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${errors.message ? 'border-red-500' : ''} hover:border-teal-500 transition-all duration-300`}
                    placeholder={t('contact.messagePlaceholder')}
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
                    {recording ? t('contact.recording.stop') : t('contact.recording.start')}
                  </button>
                  {audioBlob && (
                    <div className="flex items-center gap-2">
                      <audio controls src={URL.createObjectURL(audioBlob)} className="max-w-xs rounded-lg border border-gray-200" />
                      <Trash2
                        className="cursor-pointer text-red-500 h-5 w-5 hover:text-red-700 transition-colors duration-300"
                        onClick={deleteRecording}
                        aria-label={t('contact.recording.delete')}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-gray-700">
                    <FileText className="h-5 w-5 text-emerald-600" /> {t('contact.files')}
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-100 file:text-emerald-600 hover:file:bg-emerald-200 transition-all duration-300"
                    aria-label={t('contact.uploadLabel')}
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
                  aria-label={t('contact.sendMessage')}
                >
                  <Send className="h-5 w-5" /> {t('contact.submit')}
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
                                  ? `${t('contact.office')} - Google Maps`
                                  : info.title === t('contact.phoneNumbers')
                                    ? `${t('contact.phoneNumbers')}: ${detail.text}`
                                    : `${t('contact.emailAddresses')}: ${detail.text}`
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
              {t('contact.faqPart1') || <><span className="text-yellow-400">F</span>requently</>}
              <br />
              {t('contact.faqPart2') || <><span className="text-yellow-400">A</span>sked</>}
              <br />
              {t('contact.faqPart3') || <><span className="text-pink-100">Q</span>uestions</>}
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-2 bg-white/20 rounded-lg p-3 shadow-md">
              {t('contact.faqDesc')}
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
            {t('contact.ctaBottomTitlePart1') || t('contact.ctaBottomTitle').split(' ').slice(0, -2).join(' ')} <span className="text-teal-200">{t('contact.ctaBottomTitlePart2') || t('contact.ctaBottomTitle').split(' ').slice(-2).join(' ')}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, type: 'spring', stiffness: 100 }}
            className="text-lg mb-10 max-w-2xl mx-auto bg-white/20 rounded-lg p-3 shadow-md"
          >
            {t('contact.ctaBottomSubtitle')}
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
              {t('hero.empoweringSection.getStarted')}
              <ArrowRight className="h-5 w-5" />
            </Link>

          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
