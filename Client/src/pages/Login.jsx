import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import PhoneNumberInput from '../components/common/PhoneNumberInput';
import toast from 'react-hot-toast';
import { parsePhoneNumber } from 'libphonenumber-js';
import logoIconDarkTransparent from '../assets/images/newlogo.png';
import bgImage from '../assets/images/bg-login.jfif';
import axios from 'axios';

const GooglePasswordPrompt = ({ email, onSave, onNever }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNever();
    }, 10); // Changed back to 10000ms for better UX
    return () => clearTimeout(timer);
  }, [onNever]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">AgroChain</h3>
            <p className="text-sm text-gray-500">Save password?</p>
          </div>
        </div>
        <div className="mb-4">
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <div className="p-2 bg-gray-50 rounded text-sm text-gray-700">{email}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
            <div className="p-2 bg-gray-50 rounded text-sm text-gray-700">••••••••</div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={onNever}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
          >
            Never
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
          >
            Save
          </button>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            You can use saved passwords on any device. They're saved to Google Password Manager for {email}.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [formData, setFormData] = useState({
    email: localStorage.getItem('rememberedEmail') || '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));

  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    console.log('Login: Current auth state:', { user, isAuthenticated, loading });
    if (isAuthenticated && user && !loading) {
      console.log('Login: Navigating to', from);
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticated, loading, navigate, from]);

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());
  const isValidPassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
  const isValidFullName = (fullName) => {
    const nameRegex = /^[a-zA-Z\s-]{2,50}$/;
    const hasMultipleWords = fullName.trim().split(/\s+/).length >= 2;
    return nameRegex.test(fullName.trim()) && hasMultipleWords;
  };
  const isValidAddress = (address) => /^[a-zA-Z0-9\s,.-]{5,100}$/.test(address.trim());
  const isValidPhone = (phone) => {
    try {
      const phoneNumber = parsePhoneNumber(phone, 'ET');
      return phoneNumber.isValid();
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (formData.password && !isLogin) {
      setPasswordStrength(isValidPassword(formData.password) ? 'Strong' : 'Weak');
    } else {
      setPasswordStrength('');
    }
  }, [formData.password, isLogin]);

  useEffect(() => {
    if (rememberMe) {
      setFormData((prev) => ({
        ...prev,
        email: localStorage.getItem('rememberedEmail') || prev.email,
      }));
    }
  }, [rememberMe]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: isLogin ? formData.email : '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      address: '',
      agreeToTerms: false,
    });
    setError(null);
    setShowSavePrompt(false);
  };

  const handleSaveCredentials = (save) => {
    console.log('Login: handleSaveCredentials, save:', save);
    if (save) {
      localStorage.setItem('rememberedEmail', formData.email);
      toast.success('Credentials saved');
    } else {
      localStorage.removeItem('rememberedEmail');
      toast.success('Credentials not saved');
    }
    setShowSavePrompt(false);
    navigate(from, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error('Please enter both email and password.');
        setIsLoading(false);
        return;
      }
      if (!isValidEmail(formData.email)) {
        toast.error('Please enter a valid Gmail address (e.g., user@gmail.com).');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Login: Sending login request:', { email: formData.email });
        const response = await axios.post('http://localhost:5000/api/users/login', {
          email: formData.email,
          password: formData.password,
        });
        console.log('Login: Response:', response.data);
        if (response.data.success && response.data.token) {
          await login(response.data.token); // Ensure login completes
          console.log('Login: AuthContext login called with token:', response.data.token);
          toast.success('Login successful!');
          if (rememberMe) {
            localStorage.setItem('rememberedEmail', formData.email);
            navigate(from, { replace: true });
          } else {
            localStorage.removeItem('rememberedEmail');
            setShowSavePrompt(true);
            setIsLoading(false); // Allow prompt to handle navigation
          }
        } else {
          toast.error(response.data.error || 'Login failed. Please check your credentials.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Login: Error:', error);
        toast.error(error.response?.data?.error || 'An unexpected error occurred during login.');
        setIsLoading(false);
      }
    } else {
      const { fullName, email, password, confirmPassword, phone, address, agreeToTerms } = formData;

      if (!fullName || !email || !password || !phone || !address) {
        toast.error('All fields are required.');
        setIsLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        toast.error('Please enter a valid Gmail address (e.g., user@gmail.com).');
        setIsLoading(false);
        return;
      }

      if (!isValidPassword(password)) {
        toast.error(
          'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.'
        );
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        setIsLoading(false);
        return;
      }

      if (!isValidFullName(fullName)) {
        toast.error('Please enter a valid full name (at least 2 words, letters, spaces, or hyphens only).');
        setIsLoading(false);
        return;
      }

      if (!isValidAddress(address)) {
        toast.error('Please enter a valid address (5-100 characters, letters, numbers, spaces, commas, periods, or hyphens).');
        setIsLoading(false);
        return;
      }

      if (!isValidPhone(phone)) {
        toast.error('Please enter a valid phone number (e.g., +251912345678).');
        setIsLoading(false);
        return;
      }

      if (!agreeToTerms) {
        toast.error('You must agree to the Terms of Service and Privacy Policy.');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Login: Sending register request:', { fullName, email, phone, address, agreeToTerms });
        const response = await axios.post('http://localhost:5000/api/users/register', {
          fullName,
          email,
          password,
          phone,
          address,
          agreeToTerms,
        });
        console.log('Login: Register response:', response.data);
        if (response.data.success) {
          toast.success('Registration successful! Please log in.');
          setFormData({
            email: email, // Retain email for login form
            password: '',
            confirmPassword: '',
            fullName: '',
            phone: '',
            address: '',
            agreeToTerms: false,
          });
          setIsLogin(true); // Switch to login form
          setShowSavePrompt(true); // Show save prompt for registration
          setIsLoading(false);
        } else {
          toast.error(response.data.error || 'Registration failed.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Login: Registration error:', error);
        toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Basic Information</h3>
        <p className="text-gray-500 font-medium text-base">Let's start with your basic details</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Full Name *"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name (e.g., Tilahun Sitotaw)"
          required
          icon={<User className="h-5 w-5 text-gray-950" />}
          className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
        />
        <PhoneNumberInput
          label="Phone Number *"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          required
          placeholder="Enter your phone number (e.g., +251912345678)"
          className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
        />
        <div className="md:col-span-1">
          <Input
            label="Email Address *"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your Gmail address (e.g., user@gmail.com)"
            required
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
            autoComplete="username"
          />
        </div>
        <div className="md:col-span-1">
          <Input
            label="Address *"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address (e.g., 123 Main St, Addis Ababa)"
            required
            icon={<MapPin className="h-5 w-5 text-gray-400" />}
            className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <Input
            label="Password *"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
            className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-4 flex items-center top-9"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
        <div className="relative">
          <Input
            label="Confirm Password *"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            required
            className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
            autoComplete="new-password"
          />
        </div>
      </div>
      <div className="flex items-center mt-6">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          required
        />
        <label htmlFor="agreeToTerms" className="ml-3 block text-base text-gray-950">
          I agree to the{' '}
          <Link to="/terms-of-service" className="text-blue-950 hover:text-pink-400 font-semibold">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy-policy" className="text-blue-950 hover:text-pink-400 font-semibold">
            Privacy Policy
          </Link>
          .
        </label>
      </div>
      {passwordStrength && (
        <p className={`text-sm mt-2 ${passwordStrength === 'Strong' ? 'text-emerald-600' : 'text-red-600'}`}>
          Password Strength: {passwordStrength}
        </p>
      )}
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
      }}
    >
      {showSavePrompt && (
        <GooglePasswordPrompt
          email={formData.email}
          onSave={() => handleSaveCredentials(true)}
          onNever={() => handleSaveCredentials(false)}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-lg w-full space-y-10 mt-16"
      >
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <img src={logoIconDarkTransparent} alt="AgroChain Logo Icon" className="h-12 w-12 object-contain" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-sm font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-zinc-400">
                ET
              </span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-3xl font-extrabold text-blue-950">AgroChain</span>
              <span className="text-lg font-semibold text-emerald-300">Ethiopia</span>
            </div>
          </Link>
          <h2 className="text-4xl font-extrabold text-white">{isLogin ? 'Welcome Back' : 'Join AgroChain'}</h2>
          <p className="text-gray-300 text-lg mt-2">{isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8" autoComplete={isLogin ? 'on' : 'off'}>
              {isLogin ? (
                <>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your Gmail address (e.g., user@gmail.com)"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
                    autoComplete="username"
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your password"
                      className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-5 w-5 text-emerald-400 focus:ring-emerald-500 border-gray-300 rounded"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-base text-gray-950">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-base text-gray-950 hover:text-pink-400">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-pink-950 text-gray-200 transition-all duration-300 transform hover:scale-105"
                    size="large"
                  >
                    Sign In
                    <ArrowRight className="ml-3 h-2 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </>
              ) : (
                <>
                  {renderBasicInfo()}
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-pink-950 text-white transition-all duration-300 transform hover:scale-105"
                    size="large"
                    disabled={isLoading}
                  >
                    Create Account
                    <ArrowRight className="ml-3 h-2 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </>
              )}
              {error && <p className="text-red-500 text-center">{error}</p>}
            </form>
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/30" />
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="px-3 bg-transparent text-orange-500">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={handleToggleForm}
                  className="w-full border-white/30 text-white hover:text-pink-950 transition-all duration-300 transform hover:scale-105"
                >
                  {isLogin ? 'Create an account' : 'Sign in to existing account'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;