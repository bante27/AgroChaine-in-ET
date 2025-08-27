import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import LiveChat from '../components/LiveChat';
import toast from 'react-hot-toast';
import axios from 'axios';
import logoIconDarkTransparent from '../assets/images/newlogo.png';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    if (!email) return toast.error('Please enter your email');
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/reset-password/request', { email });
      toast.success('OTP sent to your email');
      setStep(2);
      setTimer(300); // 5 minutes
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/reset-password/request', { email });
      toast.success('New OTP sent to your email');
      setTimer(300);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error('Please enter the OTP');
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/reset-password/verify', { email, otp });
      toast.success('OTP verified, set your new password');
      setStep(3);
      setTimer(0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error('Please fill all fields');
    if (newPassword !== confirmPassword) return toast.error("Passwords don't match");
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/reset-password/reset', {
        email,
        password: newPassword,
        token: otp,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Password reset successful! Redirecting...');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && step === 2) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' } },
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 lg:px-8 bg-gradient-to-br from-blue-700 via-emerald-600 to-blue-500 overflow-hidden">
      {/* Decorative leaves */}
      <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="hidden md:block absolute left-0 top-1/6 -translate-y-1/6 w-24 md:w-48 h-24 md:h-48 opacity-30" initial={{ y: -100, opacity: 0 }} animate={{ y: 100, opacity: 2 }} transition={{ duration: 1.5 }}>
        <path d="M100 10 C 140 40, 160 100, 100 180 C 40 100, 60 40, 100 10 Z" fill="green" stroke="darkgreen" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="170" stroke="white" strokeWidth="1" />
      </motion.svg>

      <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="hidden md:block absolute right-0 top-1/6 -translate-y-1/6 w-24 md:w-48 h-24 md:h-48 opacity-30" initial={{ y: 100, opacity: 0 }} animate={{ y: -100, opacity: 2 }} transition={{ duration: 1.5 }}>
        <path d="M100 10 C 140 40, 160 100, 100 180 C 40 100, 60 40, 100 10 Z" fill="green" stroke="darkgreen" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="170" stroke="white" strokeWidth="1" />
      </motion.svg>

      {/* Main */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-xs sm:max-w-md lg:max-w-xl space-y-3 sm:space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-1 sm:space-x-3 mb-2 sm:mb-4">
            <div className="relative">
              <img src={logoIconDarkTransparent} alt="AgroChain Logo" className="h-6 w-6 sm:h-10 sm:w-10 object-contain" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-[7px] sm:text-xs font-bold rounded-full w-3 h-3 flex items-center justify-center border border-zinc-400">ET</span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-base sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500">AgroChain</span>
              <span className="text-[8px] sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-md">Ethiopia</span>
            </div>
          </Link>
          <h2 className="text-base sm:text-2xl font-extrabold text-white mt-1">
            {step === 1 ? 'Reset Your Password' : step === 2 ? 'Enter OTP' : 'Set New Password'}
          </h2>
          <p className="text-gray-200 text-[8px] sm:text-sm mt-1">
            {step === 1
              ? 'Enter your email to receive a reset OTP'
              : step === 2
              ? 'Check your email and enter the OTP below'
              : 'Enter your new password and confirm'}
          </p>
          <div className="flex justify-center space-x-1 sm:space-x-2 mt-2 sm:mt-4">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full shadow-lg ${step >= s ? 'bg-emerald-400' : 'bg-gray-400'}`}></span>
            ))}
          </div>
        </div>

        {/* Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.01 }} className="transform-gpu">
          <Card className="bg-blue-500/20 sm:bg-green-500/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg sm:rounded-2xl p-2 sm:p-6 space-y-2 sm:space-y-5 text-[8px] sm:text-sm transition-all duration-300">

            {/* ✅ Step 1 - No Reload */}
            {step === 1 && (
              <div className="space-y-1 sm:space-y-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  icon={<Mail className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
                  className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
                />
                <Button
                  type="button"
                  onClick={handleEmailSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full py-1 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md sm:rounded-lg shadow-md flex items-center justify-center space-x-1 sm:space-x-2 text-[8px] sm:text-sm"
                >
                  {isLoading ? <Loader2 className="h-2 sm:h-4 w-2 sm:w-4 animate-spin" /> : <>Send OTP <ArrowRight className="h-2 w-2 sm:h-4 sm:w-4" /></>}
                </Button>
              </div>
            )}

            {/* Step 2 - OTP */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-1 sm:space-y-4">
                <Input
                  label="OTP"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  required
                  className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
                />
                {timer > 0 ? (
                  <p className="text-red-500 text-[10px] sm:text-sm text-center font-semibold">
                    Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                  </p>
                ) : (
                  <p className="text-center text-[10px] sm:text-sm">
                    <button
                      onClick={handleResendOtp}
                      className="text-emerald-400 hover:text-emerald-500 underline"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Resend OTP'}
                    </button>
                  </p>
                )}
                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full py-1 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md sm:rounded-lg shadow-md flex items-center justify-center space-x-1 sm:space-x-2 text-[8px] sm:text-sm"
                >
                  {isLoading ? <Loader2 className="h-2 sm:h-4 w-2 sm:w-4 animate-spin" /> : <>Verify OTP <ArrowRight className="h-2 w-2 sm:h-4 sm:w-4" /></>}
                </Button>
              </form>
            )}

            {/* Step 3 - Password Reset */}
            {step === 3 && (
              <form onSubmit={handlePasswordSubmit} className="space-y-1 sm:space-y-4">
                {/* New Password */}
                <div className="relative">
                  <Input
                    label="New Password"
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    icon={<Lock className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
                    className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    icon={<Lock className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
                    className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full py-1 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md sm:rounded-lg shadow-md flex items-center justify-center space-x-1 sm:space-x-2 text-[8px] sm:text-sm"
                >
                  {isLoading ? <Loader2 className="h-2 sm:h-4 w-2 sm:w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-2 w-2 sm:h-4 sm:w-4" /></>}
                </Button>
              </form>
            )}

            <div className="mt-1 sm:mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/login')} className="w-full border-white/30 text-white text-[8px] sm:text-sm">
                Back to Sign In
              </Button>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <LiveChat />
    </div>
  );
};

export default ForgotPassword;