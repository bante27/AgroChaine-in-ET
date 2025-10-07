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
import axios from 'axios';
import LiveChat from '../components/LiveChat';

// OTP Input component
const OTPInput = ({ email, otp, onVerify, onResend }) => {
  const [inputOtp, setInputOtp] = useState('');
  const [timer, setTimer] = useState(300);
  
  useEffect(() => {
    setInputOtp(otp || '');
    const interval = setInterval(() => setTimer(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [otp]);
  
  const handleVerify = () => {
    if (!inputOtp || inputOtp.length !== 6) return toast.error('Enter a valid 6-digit OTP');
    onVerify(inputOtp);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
            <p className="text-gray-500 text-sm mt-2">Enter the OTP sent to <span className="font-medium">{email}</span></p>
          </div>
          <form 
            className="space-y-4 mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
          >
            <Input
              label="OTP Code"
              value={inputOtp}
              onChange={e => setInputOtp(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter 6-digit OTP"
              className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <div className="flex justify-between items-center text-gray-500 text-sm">
              <span>{timer > 0 ? `${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}` : 'Expired'}</span>
              <button
                type="button"
                disabled={timer > 0}
                onClick={onResend}
                className="text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 font-medium transition-colors"
              >
                Resend OTP
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
            >
              Verify OTP
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [initialOtp, setInitialOtp] = useState('');
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
  const { login, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  // Dynamic Date and Time
  const [currentDateTime, setCurrentDateTime] = useState('05:47 PM EAT on Saturday, August 30, 2025');
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        timeZone: 'Africa/Addis_Ababa',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(now);
      setCurrentDateTime(formattedDate.replace(',', ' at'));
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticated, loading, navigate, from]);

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());
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
  };

  const handleVerifyOTP = async (otp) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/verify-otp', { email: otpEmail, otp });
      if (res.data.success) {
        await login(res.data.token);
        toast.success('OTP verified! Redirecting...');
        navigate(from, { replace: true });
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/register', { email: otpEmail });
      if (res.data.success) {
        setInitialOtp(res.data.otp);
        toast.success('OTP resent.');
      } else {
        toast.error(res.data.error);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend OTP');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error('Enter email and password.');
        setIsLoading(false);
        return;
      }
      if (!isValidEmail(formData.email)) {
        toast.error('Valid Gmail required (e.g., user@gmail.com).');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/users/login', { email: formData.email, password: formData.password });
        if (response.data.success && response.data.token) {
          await login(response.data.token);
          toast.success('Login successful!');
          navigate(from, { replace: true });
        } else {
          toast.error(response.data.error || 'Login failed.');
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Login error.');
      }
    } else {
      const { fullName, email, password, phone, address, agreeToTerms, confirmPassword } = formData;

      if (!fullName || !email || !password || !phone || !address || !confirmPassword) {
        toast.error('All fields required.');
        setIsLoading(false);
        return;
      }
      if (!isValidEmail(email)) {
        toast.error('Valid Gmail required.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        setIsLoading(false);
        return;
      }
      if (!isValidFullName(fullName)) {
        toast.error('Valid full name (2+ words, letters only).');
        setIsLoading(false);
        return;
      }
      if (!isValidAddress(address)) {
        toast.error('Valid address (2-100 chars).');
        setIsLoading(false);
        return;
      }
      if (!isValidPhone(phone)) {
        toast.error('Valid phone (e.g., +251912345678).');
        setIsLoading(false);
        return;
      }
      if (!agreeToTerms) {
        toast.error('Agree to Terms and Privacy.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/users/register', { fullName, email, password, phone, address, agreeToTerms });
        if (response.data.success) {
          setOtpEmail(email);
          setInitialOtp(response.data.otp);
          setShowOTP(true);
        } else {
          toast.error(response.data.error || 'Registration failed.');
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Registration failed.');
      }
    }
    setIsLoading(false);
  };

  // Handle Enter key press for form submission
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Tilahun Sitotaw"
          icon={<User className="h-5 w-5 text-gray-500" />}
          className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <PhoneNumberInput
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          onKeyPress={handleKeyPress}
          placeholder="+251912345678"
          className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="user@gmail.com"
        icon={<Mail className="h-5 w-5 text-gray-500" />}
        className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
      />
      <Input
        label="Address"
        name="address"
        type="text"
        value={formData.address}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="123 Main St, Addis Ababa"
        icon={<MapPin className="h-5 w-5 text-gray-500" />}
        className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Create a password"
            className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Confirm your password"
          className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>
      <div className="flex items-center">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-600">
          I agree to the{' '}
          <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Privacy Policy
          </Link>
        </label>
      </div>
    </div>
  );

  if (showOTP) return <OTPInput email={otpEmail} otp={initialOtp} onVerify={handleVerifyOTP} onResend={handleResendOTP} />;

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Join AgroChain'}</h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? 'Sign in to access your account' : 'Create an account to get started'}
          </p>
        </div>
        <Card className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete={isLogin ? 'on' : 'off'}>
            {isLogin ? (
              <>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="user@gmail.com"
                  icon={<Mail className="h-5 w-5 text-gray-500" />}
                  className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <div className="relative">
                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your password"
                    className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      checked={formData.rememberMe || false}
                      onChange={e => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                    />
                    <label htmlFor="remember-me" className="ml-2 text-gray-600">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Forgot Password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                >
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                {renderBasicInfo()}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </>
            )}
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          </form>
          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">{isLogin ? 'New to AgroChain?' : 'Already have an account?'}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleToggleForm}
              className="w-full mt-4 border-gray-200 text-gray-800 hover:bg-indigo-600 hover:text-white py-2 rounded-xl text-sm font-semibold transition-all duration-300"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </Button>
          </div>
        </Card>
      </motion.div>
      <LiveChat />
    </div>
  );
};

export default Login;