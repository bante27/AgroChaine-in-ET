import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Mail, Phone, MapPin, Send, Mic, Trash2, 
  FileText, ChevronDown, ArrowRight, X, Sparkles, Globe
} from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../utils/apiConfig';

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

  const contactInfo = [
    { icon: MapPin, title: t('contact.office'), text: 'Bole, Addis Ababa, Ethiopia' },
    { icon: Phone, title: t('contact.phoneNumbers'), text: '+251 985 076 701' },
    { icon: Mail, title: t('contact.emailAddresses'), text: 'agrochainethiopia@gmail.com' },
    { icon: Globe, title: 'Network', text: 'Connecting 500+ Farmers' },
  ];

  const faqItems = [
    { question: t('contact.faq.0.question'), answer: t('contact.faq.0.answer') },
    { question: t('contact.faq.1.question'), answer: t('contact.faq.1.answer') },
    { question: t('contact.faq.2.question'), answer: t('contact.faq.2.answer') },
  ];

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
      toast.error(`File size must be <= 20MB`);
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
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
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      files.forEach((file) => payload.append('files', file));
      if (audioBlob) payload.append('voice', audioBlob, 'voice_message.webm');

      const res = await fetch(`${API_URL}/api/contact`, { method: 'POST', body: payload });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || t('contact.success'));
        setFormData({ name: '', email: '', subject: '', message: '' });
        setFiles([]);
        setAudioBlob(null);
      } else {
        toast.error(data.error || t('contact.error'));
      }
    } catch (err) {
      toast.error(t('contact.networkError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            How can we <span className="text-emerald-600">help you?</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Drop us a message and our team will get back to you shortly.
          </p>
        </div>
      </header>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <div className="space-y-4">
              {contactInfo.map((info, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <info.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{info.title}</h3>
                      <p className="text-slate-900 font-bold">{info.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Subject</label>
                    <input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is this about?"
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Type your message here..."
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-900 focus:bg-white focus:border-emerald-500 outline-none transition-all resize-none font-medium"
                    />
                  </div>

                  {/* Attachment Actions */}
                  <div className="flex flex-wrap items-center gap-4 py-4 border-t border-slate-50">
                    <button
                      type="button"
                      onClick={recording ? stopRecording : startRecording}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${recording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                      <Mic className="h-4 w-4" />
                      {recording ? "Stop Recording" : "Add Voice Message"}
                    </button>

                    <label className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all shadow-sm border border-transparent">
                      <FileText className="h-4 w-4" />
                      Attach Documents
                      <input type="file" multiple className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>

                  {/* --- ATTACHMENT PREVIEW AREA (The fix for "No See") --- */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {/* Voice Preview */}
                    {audioBlob && (
                      <div className="flex items-center gap-3 bg-emerald-50 p-2 pr-4 rounded-full border border-emerald-100 shadow-sm">
                        <div className="bg-emerald-500 p-1.5 rounded-full">
                          <Mic className="h-3 w-3 text-white" />
                        </div>
                        <audio src={URL.createObjectURL(audioBlob)} controls className="h-8 w-40" />
                        <button 
                          type="button" 
                          onClick={() => setAudioBlob(null)}
                          className="hover:bg-emerald-100 p-1 rounded-full transition-colors"
                        >
                          <X className="h-4 w-4 text-emerald-600" />
                        </button>
                      </div>
                    )}

                    {/* File Previews */}
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 shadow-sm animate-in fade-in zoom-in duration-200">
                        <FileText className="h-4 w-4 text-slate-500" />
                        <span className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{file.name}</span>
                        <button 
                          type="button" 
                          onClick={() => removeFile(idx)}
                          className="hover:bg-slate-200 p-1 rounded-full"
                        >
                          <X className="h-3 w-3 text-slate-500" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 transition-all flex justify-center items-center gap-3 active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-12">Common Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq, idx) => (
              <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:border-slate-200 transition-all">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-6 text-left font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {faq.question}
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-slate-500 text-sm leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;