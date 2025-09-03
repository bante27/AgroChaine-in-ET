import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect after login
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate('/', { replace: true }); // Always redirect to '/' since only admins can log in
    }
  }, [user, isAuthenticated, loading, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password.', {
        style: {
          background: 'rgba(239, 68, 68, 0.1)', // bg-red-500/10
          color: '#f87171', // text-red-400
          border: '1px solid rgba(239, 68, 68, 0.2)', // border-red-500/20
        },
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('Login successful!', {
          style: {
            background: 'rgba(6, 182, 212, 0.1)', // bg-cyan-500/10
            color: '#06b6d4', // text-cyan-400
            border: '1px solid rgba(6, 182, 212, 0.2)', // border-cyan-500/20
          },
        });
      } else {
        toast.error(result.error || 'Invalid credentials', {
          style: {
            background: 'rgba(239, 68, 68, 0.1)', // bg-red-500/10
            color: '#f87171', // text-red-400
            border: '1px solid rgba(239, 68, 68, 0.2)', // border-red-500/20
          },
        });
        // Redirect to login page if non-admin
        if (result.error === 'Access denied: Only admins can log in') {
          window.location.href = 'http://localhost:5174/login';
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed', {
        style: {
          background: 'rgba(239, 68, 68, 0.1)', // bg-red-500/10
          color: '#f87171', // text-red-400
          border: '1px solid rgba(239, 68, 68, 0.2)', // border-red-500/20
        },
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-800 rounded-xl shadow-lg border border-cyan-500/20 p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="user@gmail.com"
                icon={Mail}
                className="pl-10 pr-4 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
              />
              <Mail className="absolute left-3 top-11 h-4 w-4 text-gray-400" />
            </div>
            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="pl-10 pr-10 py-2 w-full bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 z-10 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              type="submit"
              loading={isLoading}
              className={`w-full p-3 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-indigo-600 transition-colors duration-200 flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-t-2 border-white rounded-full"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;