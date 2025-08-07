import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';
import logoIconDarkTransparent from '../assets/images/logo-icon-dark-transparent.png';

const ForgotPassword = () => {
  // State Management
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Validation Function
  const isValidEmail = (email) => {
    return /^[a-zA-Z0-9.]+@gmail\.com$/.test(email);
  };

  // Handlers
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast.error('Please enter your Gmail address.');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid Gmail address (e.g., username@gmail.com).');
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(email);
      toast.success('Password reset link sent to your Gmail address. Please check your inbox.');
      setEmail('');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to send password reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8 mt-16"
      >
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="relative">
              <img src={logoIconDarkTransparent} alt="AgroChain Logo Icon" className="h-10 w-10 object-contain" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-transparent">
                ET
              </span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-bold text-gray-900">AgroChain</span>
              <span className="text-base font-semibold text-emerald-600">Ethiopia</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="text-gray-600">Enter your Gmail address to receive a password reset link</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={handleInputChange}
                required
                placeholder="Enter your Gmail address"
                icon={<Mail className="h-4 w-4 text-gray-400" />}
              />
              <Button
                type="submit"
                loading={isLoading}
                className="w-full group bg-blue-600 hover:bg-blue-700 text-white"
                size="large"
              >
                Send Reset Link
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Remember your password?</span>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
                  Back to Sign In
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;