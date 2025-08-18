import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import LiveChat from '../components/LiveChat'
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Users,
  Headphones,
  Mic,
  Trash2,
  FileText
} from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import toast from 'react-hot-toast'
import contactBg from '../assets/images/bg-login.jfif'

const MAX_FILE_SIZE = 15 * 1024 * 1024 * 1024 // 15GB

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState([])

  // Voice recording
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: null })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const invalidFiles = selectedFiles.filter(f => f.size > MAX_FILE_SIZE)
    if (invalidFiles.length > 0) {
      toast.error(`File size must be <= 15GB: ${invalidFiles.map(f => f.name).join(', ')}`)
      return
    }
    setFiles(selectedFiles)
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []
      mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data)
      mediaRecorderRef.current.onstop = () => setAudioBlob(new Blob(audioChunksRef.current, { type: 'audio/webm' }))
      mediaRecorderRef.current.start()
      setRecording(true)
    } catch {
      toast.error("Microphone access denied.")
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current.stop()
    setRecording(false)
  }

  const deleteRecording = () => setAudioBlob(null)

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (!validateForm()) return
  setIsSubmitting(true)

  try {
    const payload = new FormData()
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value))

    files.forEach(file => payload.append('files', file))
    if (audioBlob) payload.append('voice', audioBlob, 'voice_message.webm')

    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      body: payload,
    })

    const data = await res.json()

    if (res.ok) {
      toast.success(data.message)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setFiles([])
      setAudioBlob(null)
    } else {
      toast.error(data.error || "Failed to send message")
    }
  } catch (err) {
    console.error("Submit error:", err)
    toast.error("Network error. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}

  const contactInfo = [
    { icon: MapPin, title: 'Our Office', details: ['Bole Sub City, Addis Ababa', 'Ethiopia, East Africa', 'P.O. Box 12345'] },
    { icon: Phone, title: 'Phone Numbers', details: ['+251985076701', '+251927993894'] },
    { icon: Mail, title: 'Email Addresses', details: ['info@agrochain.et', 'support@agrochain.et', 'sales@agrochain.et'] },
    { icon: Clock, title: 'Business Hours', details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 4:00 PM', 'Sunday: Closed'] }
  ]

  const supportOptions = [
    { icon: MessageCircle, title: 'Live Chat', description: 'Get instant help from our support team', action: 'Start Chat' },
    { icon: Users, title: 'Community Forum', description: 'Connect with other users and share experiences', action: 'Join Forum' },
    { icon: Headphones, title: 'Phone Support', description: 'Speak directly with our technical experts', action: 'Call Now' }
  ]

  const faqItems = [
    { question: "How do I register as a farmer on the platform?", answer: "Click 'Register' and select 'Farmer'. You’ll need your Ethiopian National ID for verification." },
    { question: "What products can I sell on the marketplace?", answer: "You can sell grains, vegetables, fruits, livestock products, and more. All must meet our quality standards." },
    { question: "How does blockchain traceability work?", answer: "Every product movement is recorded on blockchain. You can trace items from farm to consumer via QR codes." },
    { question: "Is there a mobile app available?", answer: "Yes! Our app is available for Android and iOS so you can use AgroChain anywhere." }
  ]

  return (
    <div className="min-h-screen flex flex-col py-12 px-4 bg-cover bg-center" style={{ backgroundImage:`linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${contactBg})` }}>
      <div className="max-w-7xl mx-auto w-full">

        {/* Hero */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="text-center text-white mb-12">
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">Have questions about AgroChain Ethiopia? We're here to help you transform your agricultural business.</p>
        </motion.div>

        {/* Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">

          {/* Contact Form */}
          <Card className="p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required error={errors.name} />
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required error={errors.email} />
              </div>
              <Input label="Subject" name="subject" value={formData.subject} onChange={handleInputChange} required error={errors.subject} />
              <textarea name="message" value={formData.message} onChange={handleInputChange} required rows={5} placeholder="Your message..." className={`w-full p-3 border rounded-lg ${errors.message?'border-red-500':'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-emerald-400`} />

              {/* Voice & File Upload */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button type="button" variant="outline" onClick={recording ? stopRecording : startRecording} className="flex items-center gap-2">
                  <Mic className={`${recording?'text-red-500 animate-pulse':'text-emerald-600'}`} />
                  {recording ? 'Stop Recording' : 'Record Voice'}
                </Button>
                {audioBlob && <div className="flex items-center gap-2">
                  <audio controls src={URL.createObjectURL(audioBlob)} className="max-w-xs" />
                  <Trash2 className="cursor-pointer text-red-500" onClick={deleteRecording} />
                </div>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-700"><FileText /> Attach files (max 15GB)</label>
                <input type="file" multiple onChange={handleFileChange} className="w-full" />
                {files.length > 0 && <ul className="text-gray-600 text-sm">{files.map((f,i)=><li key={i}>{f.name} ({(f.size/1024/1024).toFixed(2)} MB)</li>)}</ul>}
              </div>

              <Button type="submit" loading={isSubmitting} className="w-full flex justify-center items-center gap-2"><Send className="h-5 w-5" /> Send Message</Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} hover className="flex items-start gap-4 p-5 shadow-md hover:shadow-xl rounded-xl transition-all bg-white">
                <div className="p-4 bg-emerald-100 rounded-full"><info.icon className="h-6 w-6 text-emerald-600" /></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{info.title}</h3>
                  {info.details.map((d,i)=><p key={i} className="text-gray-600 text-sm">{d}</p>)}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportOptions.map((option,index)=>(
            <Card key={index} hover className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all">
              <div className="flex justify-center mb-4"><div className="p-4 bg-emerald-100 rounded-full"><option.icon className="h-8 w-8 text-emerald-600"/></div></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>
              <Button variant="outline" className="w-full">{option.action}</Button>
            </Card>
          ))}
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden shadow-xl mb-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.852079032626!2d38.763611!3d9.005401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85c13b2e5917%3A0xe21d011d8d9b1b11!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
            width="100%" height="450" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="AgroChain Ethiopia Office Location"
          ></iframe>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          {faqItems.map((faq,index)=>(
            <Card key={index} className="p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </Card>
          ))}
        </div>

        {/* Live Chat */}
        <LiveChat />
      </div>
    </div>
  )
}

export default Contact
