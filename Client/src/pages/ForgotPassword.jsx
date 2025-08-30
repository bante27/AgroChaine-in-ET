
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
    <div className="relative min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 bg-white overflow-hidden">
      {/* Decorative leaves */}
      <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="hidden md:block absolute left-0 top-1/6 -translate-y-1/6 w-16 md:w-24 h-16 md:h-24 opacity-10" initial={{ y: -100, opacity: 0 }} animate={{ y: 100, opacity: 0.2 }} transition={{ duration: 1.5 }}>
        <path d="M100 10 C 140 40, 160 100, 100 180 C 40 100, 60 40, 100 10 Z" fill="#10B981" stroke="#047857" strokeWidth="1" />
        <line x1="100" y1="20" x2="100" y2="170" stroke="#047857" strokeWidth="0.5" />
      </motion.svg>
      <motion.svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="hidden md:block absolute right-0 top-1/6 -translate-y-1/6 w-16 md:w-24 h-16 md:h-24 opacity-10" initial={{ y: 100, opacity: 0 }} animate={{ y: -100, opacity: 0.2 }} transition={{ duration: 1.5 }}>
        <path d="M100 10 C 140 40, 160 100, 100 180 C 40 100, 60 40, 100 10 Z" fill="#10B981" stroke="#047857" strokeWidth="1" />
        <line x1="100" y1="20" x2="100" y2="170" stroke="#047857" strokeWidth="0.5" />
      </motion.svg>

      {/* Main */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-xs sm:max-w-sm space-y-2 sm:space-y-4 relative z-10">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-3">
            <div className="relative">
              <img src={logoIconDarkTransparent} alt="AgroChain Logo" className="h-5 w-5 sm:h-6 sm:w-6 object-contain" />
              <span className="absolute -top-0.5 -right-0.5 bg-amber-400 text-black text-[6px] sm:text-[8px] font-bold rounded-full w-2.5 h-2.5 sm:w-3 sm:h-3 flex items-center justify-center border border-gray-600">ET</span>
            </div>
            <div className="flex flex-col -space-y-0.5">
              <span className="text-sm sm:text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600">AgroChain</span>
              <span className="text-[6px] sm:text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500">Ethiopia</span>
            </div>
          </Link>
          <h2 className="text-sm sm:text-xl font-extrabold text-gray-900 mt-1 sm:mt-2">
            {step === 1 ? 'Reset Your Password' : step === 2 ? 'Enter OTP' : 'Set New Password'}
          </h2>
          <p className="text-gray-600 text-[6px] sm:text-xs mt-0.5 sm:mt-1">
            {step === 1
              ? 'Enter your email to receive a reset OTP'
              : step === 2
              ? 'Check your email and enter the OTP below'
              : 'Enter your new password and confirm'}
          </p>
          <div className="flex justify-center space-x-1 sm:space-x-2 mt-1 sm:mt-2">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${step >= s ? 'bg-emerald-600' : 'bg-gray-300'}`}></span>
            ))}
          </div>
        </div>

        {/* Card */}
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02 }} className="transform-gpu">
          <Card className="bg-white shadow-lg rounded-lg sm:rounded-xl p-2 sm:p-4 space-y-1 sm:space-y-3 text-[6px] sm:text-sm transition-all duration-300">
            {/* Step 1 - Email */}
            {step === 1 && (
              <div className="space-y-1 sm:space-y-3">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  icon={<Mail className="h-3 sm:h-4 w-3 sm:w-4 text-gray-500" />}
                  className="text-[6px] sm:text-xs py-1 sm:py-1.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-md focus:ring-2 focus:ring-emerald-500 transition"
                />
                <Button
                  type="button"
                  onClick={handleEmailSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full py-1 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md flex items-center justify-center space-x-1 sm:space-x-2 text-[6px] sm:text-xs"
                >
                  {isLoading ? <Loader2 className="h-3 sm:h-4 w-3 sm:w-4 animate-spin" /> : <>Send OTP <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" /></>}
                </Button>
              </div>
            )}

            {/* Step 2 - OTP */}
            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-1 sm:space-y-3">
                <Input
                  label="OTP"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  required
                  className="text-[6px] sm:text-xs py-1 sm:py-1.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-md focus:ring-2 focus:ring-emerald-500 transition"
                />
                {timer > 0 ? (
                  <p className="text-red-600 text-[7px] sm:text-xs text-center font-medium">
                    Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                  </p>
                ) : (
                  <p className="text-center text-[7px] sm:text-xs">
                    <button
                      onClick={handleResendOtp}
                      className="text-emerald-600 hover:text-emerald-700 underline"
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
                  className="w-full py-1 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md flex items-center justify-center space-x-1 sm:space-x-2 text-[6px] sm:text-xs"
                >
                  {isLoading ? <Loader2 className="h-3 sm:h-4 w-3 sm:w-4 animate-spin" /> : <>Verify OTP <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" /></>}
                </Button>
              </form>
            )}

            {/* Step 3 - Password Reset */}
            {step === 3 && (
              <form onSubmit={handlePasswordSubmit} className="space-y-1 sm:space-y-3">
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
                    icon={<Lock className="h-3 sm:h-4 w-3 sm:w-4 text-gray-500" />}
                    className="text-[6px] sm:text-xs py-1 sm:py-1.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-md pr-9 sm:pr-10 focus:ring-2 focus:ring-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showNewPassword ? <EyeOff className="h-3 sm:h-4 w-3 sm:w-4" /> : <Eye className="h-3 sm:h-4 w-3 sm:w-4" />}
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
                    icon={<Lock className="h-3 sm:h-4 w-3 sm:w-4 text-gray-500" />}
                    className="text-[6px] sm:text-xs py-1 sm:py-1.5 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-md pr-9 sm:pr-10 focus:ring-2 focus:ring-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-3 sm:h-4 w-3 sm:w-4" /> : <Eye className="h-3 sm:h-4 w-3 sm:w-4" />}
                  </button>
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full py-1 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md flex items-center justify-center space-x-1 sm:space-x-2 text-[6px] sm:text-xs"
                >
                  {isLoading ? <Loader2 className="h-3 sm:h-4 w-3 sm:w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" /></>}
                </Button>
              </form>
            )}

            <div className="mt-1 sm:mt-2 text-center">
              <Button variant="outline" onClick={() => navigate('/login')} className="w-full border-gray-300 text-gray-700 hover:bg-emerald-50 text-[6px] sm:text-xs">
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