
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
      setTimer(300);
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
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 ? 'Reset Your Password' : step === 2 ? 'Enter OTP' : 'Set New Password'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {step === 1
              ? 'Enter your email to receive a reset OTP'
              : step === 2
              ? 'Check your email and enter the OTP below'
              : 'Enter your new password and confirm'}
          </p>
          <div className="flex justify-center space-x-2 mt-2">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`w-1.5 h-1.5 rounded-full ${step >= s ? 'bg-indigo-600' : 'bg-gray-300'}`}></span>
            ))}
          </div>
        </div>

        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02 }} className="transform-gpu">
          <Card className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-6 space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <Input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gmail.com"
                  required
                  icon={<Mail className="h-5 w-5 text-gray-500" />}
                  className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <Button
                  type="button"
                  onClick={handleEmailSubmit}
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Send OTP <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <Input
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  required
                  className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                {timer > 0 ? (
                  <p className="text-gray-500 text-sm text-center">
                    Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                  </p>
                ) : (
                  <p className="text-center text-sm">
                    <button
                      onClick={handleResendOtp}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
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
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Verify OTP <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    icon={<Lock className="h-5 w-5 text-gray-500" />}
                    className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    icon={<Lock className="h-5 w-5 text-gray-500" />}
                    className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center space-x-2"
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Reset Password <ArrowRight className="h-5 w-5" /></>}
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full py-2 border-gray-200 text-gray-800 hover:bg-indigo-50 hover:text-indigo-700 text-sm font-semibold rounded-xl"
              >
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
