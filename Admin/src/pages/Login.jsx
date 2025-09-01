import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // ✅ Redirect after login based on role
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // if backend sends user.isAdmin === true
      const redirectTo = user.isAdmin ? '/' : '/profile';
      navigate(redirectTo, { replace: true });
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
      toast.error('Please enter email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('Login successful!');
        // ✅ Redirection handled automatically by useEffect
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/80 backdrop-blur-md border border-indigo-100 shadow-xl rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Sign In
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="user@gmail.com"
              icon={Mail}
            />
            <div className="relative w-full">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 z-10 text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <Button
              type="submit"
              loading={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl shadow-md"
            >
              Sign In <ArrowRight className="ml-2" />
            </Button>
          </form>
          <p className="text-center mt-6 text-gray-600">
            New to AgroChain?{' '}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create an account
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
