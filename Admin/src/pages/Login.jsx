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
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      navigate('/', { replace: true });
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
        style: { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' },
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('Login successful!', {
          style: { background: '#dbeafe', color: '#1d4ed8', border: '1px solid #93c5fd' },
        });
        navigate('/', { replace: true });
      } else {
        toast.error(result.error || 'Invalid credentials', {
          style: { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' },
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed', {
        style: { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' },
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side: Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-cyan-500 to-indigo-500 justify-center items-center p-8 rounded-l-xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-lg">Sign in to access your Admin Dashboard</p>
        </motion.div>
      </div>

      {/* Right side: Login form */}
      <div className="flex flex-1 justify-center items-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              Admin Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="relative">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="user@example.com"
                  icon={Mail}
                  className="pl-10 pr-4 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
                <Mail className="absolute left-3 top-12 h-5 w-5 text-gray-400" />
              </div>

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 py-3 w-full bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-12 z-10 text-gray-400 hover:text-cyan-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                loading={isLoading}
                className={`w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:from-cyan-600 hover:to-indigo-600 transition-colors duration-200 flex items-center justify-center gap-2 text-lg ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                ) : (
                  <>
                    Sign In <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} AgroChain Ethiopia. All rights reserved.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
