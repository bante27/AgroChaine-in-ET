import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import LiveChat from '../components/LiveChat';
import toast from 'react-hot-toast';
import axios from 'axios';
import logoIconDarkTransparent from '../assets/images/newlogo.png';
import bgImage from '../assets/images/bg-login.jfif';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      toast.error('Email is required.');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      toast.error('Invalid email format.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
      });
      if (response.data.success) {
        toast.success('Password reset link sent to your email. Check your inbox and spam folder.');
        setEmail('');
        setTimeout(() => navigate('/login', { replace: true }), 5000);
      } else {
        setError(response.data.error || 'Failed to send reset link.');
        toast.error(response.data.error || 'Failed to send reset link.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send reset link. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' } },
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
      }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-lg w-full space-y-10 mt-16">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <img
                src={logoIconDarkTransparent}
                alt="AgroChain Ethiopia Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-zinc-400">
                ET
              </span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-3xl font-extrabold text-blue-950">AgroChain</span>
              <span className="text-lg font-semibold text-emerald-300">Ethiopia</span>
            </div>
          </Link>
          <h2 className="text-4xl font-extrabold text-white">Reset Your Password</h2>
          <p className="text-gray-300 text-lg mt-2">Enter your email to receive a password reset link</p>
        </div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                required
                placeholder="you@example.com"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                error={error}
                className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
                autoComplete="username"
              />
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading}
                className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:bg-purple-800"
                size="large"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              {error && <p className="text-red-500 text-center text-base">{error}</p>}
            </form>
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="px-3 bg-transparent text-orange-500">Have an account?</span>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full border-white/30 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:bg-sky-900"
                >
                  Back to Sign In
                </Button>
              </div>
              <p className="mt-4 text-base text-gray-300 text-center">
                Need help?{' '}
                <Link to="/contact" className="text-emerald-300 hover:text-emerald-400 font-semibold">
                  Contact Support
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
      <LiveChat />
    </div>
  );
};

export default ForgotPassword;