
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, MapPin, ArrowRight, Loader2, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import PhoneNumberInput from '../components/common/PhoneNumberInput';
import toast from 'react-hot-toast';
import { parsePhoneNumber } from 'libphonenumber-js';
import logoIconDarkTransparent from '../assets/images/newlogo.png';
import LiveChat from '../components/LiveChat';
import axios from 'axios';

// OTP Input component
const OTPInput = ({ email, otp, onVerify, onResend }) => {
  const [inputOtp, setInputOtp] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes

  useEffect(() => {
    setInputOtp(otp || ''); // Pre-fill OTP if provided
    const interval = setInterval(() => setTimer(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [otp]);

  const handleVerify = () => {
    if (!inputOtp || inputOtp.length !== 6) return toast.error('Enter a valid 6-digit OTP');
    onVerify(inputOtp);
  };

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 lg:px-8 bg-gradient-to-br from-blue-700 via-emerald-600 to-blue-500 overflow-hidden">
      <Card className="bg-blue-500/20 sm:bg-green-500/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg sm:rounded-2xl p-2 sm:p-6 w-full max-w-xs sm:max-w-md">
        <div className="text-center">
          <h2 className="text-base sm:text-2xl font-extrabold text-white">Verify Your Email</h2>
          <p className="text-gray-200 text-[8px] sm:text-sm mt-1">Enter OTP sent to {email}</p>
        </div>
        <form className="space-y-2 sm:space-y-4 mt-3">
=======
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})` }}>
      <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8 max-w-lg w-full">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-white">Verify Your Email Account</h2>
          <p className="text-gray-300 text-lg mt-2">Enter the OTP sent to {email}</p>
        </div>
        <form className="space-y-6 mt-8">
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
          <Input
            label="OTP Code"
            value={inputOtp}
            onChange={e => setInputOtp(e.target.value)}
            placeholder="6-digit OTP"
<<<<<<< HEAD
            className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
          />
          <div className="flex justify-between text-gray-200 text-[10px] sm:text-sm">
            <span>{timer > 0 ? `Expires: ${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}` : 'Expired'}</span>
            <button type="button" disabled={timer > 0} onClick={onResend} className="text-emerald-400 hover:text-emerald-500 underline disabled:text-gray-500">
=======
            className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
          />
          <div className="flex justify-between items-center text-gray-300 text-sm">
            <span>{timer > 0 ? `Expires in ${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}` : 'OTP expired'}</span>
            <button type="button" disabled={timer > 0} onClick={onResend} className="text-blue-400 hover:underline disabled:text-gray-400">
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
              Resend
            </button>
          </div>
          <Button
            type="button"
            onClick={handleVerify}
            loading={false}
<<<<<<< HEAD
            className="w-full py-1 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md sm:rounded-lg shadow-md flex items-center justify-center space-x-1 sm:space-x-2 text-[8px] sm:text-sm"
          >
            {false ? <Loader2 className="h-2 sm:h-4 w-2 sm:w-4 animate-spin" /> : <>Verify OTP <ArrowRight className="h-2 w-2 sm:h-4 sm:w-4" /></>}
=======
            className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-pink-950 text-white transition-all duration-300 transform hover:scale-105"
            size="large"
          >
            Verify OTP
            <ArrowRight className="ml-3 h-2 w-4 group-hover:translate-x-1 transition-transform" />
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
          </Button>
        </form>
      </Card>
    </div>
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [passwordStrength, setPasswordStrength] = useState('');

  const { login, logout, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticated, loading, navigate, from]);

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());
  const isValidPassword = (password) =>
    password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password);
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
      const res = await axios.post('http://localhost:5000/api/users/verify-otp', {
        email: otpEmail,
        otp,
      });
      if (res.data.success) {
        await login(res.data.token);
        toast.success('OTP verified! Redirecting to dashboard...');
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
      const res = await axios.post('http://localhost:5000/api/users/register', { email: otpEmail }); // Re-trigger registration for new OTP
      if (res.data.success) {
        setInitialOtp(res.data.otp);
        toast.success('OTP resent successfully.');
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
        const response = await axios.post('http://localhost:5000/api/users/login', {
          email: formData.email,
          password: formData.password,
        });
        if (response.data.success && response.data.token) {
          await login(response.data.token);
          toast.success('Login successful!');
          navigate(from, { replace: true });
        } else {
          toast.error(response.data.error || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'An unexpected error occurred during login.');
      }
    } else {
      const { fullName, email, password, phone, address, agreeToTerms } = formData;

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
        const response = await axios.post('http://localhost:5000/api/users/register', {
          fullName,
          email,
          password,
          phone,
          address,
          agreeToTerms,
        });
        if (response.data.success) {
          setOtpEmail(email);
          setInitialOtp(response.data.otp); // Use OTP from response
          setShowOTP(true);
        } else {
          toast.error(response.data.error || 'Registration failed.');
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
      }
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('rememberedEmail');
    navigate('/login', { replace: true });
    toast.success('Logged out successfully!');
  };

  const renderBasicInfo = () => (
<<<<<<< HEAD
    <div className="space-y-2 sm:space-y-4">
      <div className="text-center mb-2 sm:mb-4">
        <h3 className="text-base sm:text-xl font-extrabold text-white">Basic Information</h3>
        <p className="text-gray-200 text-[8px] sm:text-sm">Enter your details</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
=======
    <div className="space-y-8">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Basic Information</h3>
        <p className="text-gray-500 font-medium text-base">Let's start with your basic details</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
        <Input
          label="Full Name *"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Enter your full name (e.g., Tilahun Sitotaw)"
          required
<<<<<<< HEAD
          icon={<User className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
          className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
=======
          icon={<User className="h-5 w-5 text-gray-950" />}
          className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
        />
        <PhoneNumberInput
          label="Phone Number *"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          required
<<<<<<< HEAD
          placeholder="+251912345678"
          className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
        />
        <Input
          label="Email Address *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="user@gmail.com"
          required
          icon={<Mail className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
          className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
          autoComplete="username"
        />
        <Input
          label="Address *"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="123 Main St"
          required
          icon={<MapPin className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
          className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
=======
          placeholder="Enter your phone number (e.g., +251912345678)"
          className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
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
<<<<<<< HEAD
            icon={<Lock className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
            className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition pr-10"
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
        <div className="relative">
          <Input
            label="Confirm Password *"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm password"
            required
            icon={<Lock className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
            className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition pr-10"
=======
            className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
            autoComplete="new-password"
          />
          <button
            type="button"
<<<<<<< HEAD
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
        <div className="sm:col-span-2 flex items-center">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="h-4 w-4 text-emerald-400 border-gray-300 rounded"
=======
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
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
            required
            className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
            autoComplete="new-password"
          />
<<<<<<< HEAD
          <label htmlFor="agreeToTerms" className="ml-1 text-[8px] sm:text-sm text-gray-200">
            I agree to{' '}
            <Link to="/terms-of-service" className="text-emerald-400 hover:text-emerald-500">Terms</Link> and{' '}
            <Link to="/privacy-policy" className="text-emerald-400 hover:text-emerald-500">Privacy</Link>.
          </label>
        </div>
        {passwordStrength && (
          <p className={`sm:col-span-2 text-[8px] sm:text-sm ${passwordStrength === 'Strong' ? 'text-emerald-400' : 'text-red-400'}`}>
            Strength: {passwordStrength}
          </p>
        )}
=======
        </div>
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
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

  if (showOTP) return <OTPInput email={otpEmail} otp={initialOtp} onVerify={handleVerifyOTP} onResend={handleResendOTP} />;

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' } },
  };

  return (
<<<<<<< HEAD
    <div className="relative min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 lg:px-8 bg-gradient-to-br from-blue-700 via-emerald-600 to-blue-500 overflow-hidden">
      {/* Decorative leaves */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="hidden md:block absolute left-0 top-1/6 -translate-y-1/6 w-24 md:w-48 h-24 md:h-48 opacity-30"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 100, opacity: 2 }}
        transition={{ duration: 1.5 }}
      >
        <path d="M100 10 C 140 40, 160 100, 100 180 C 40 100, 60 40, 100 10 Z" fill="green" stroke="darkgreen" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="170" stroke="white" strokeWidth="1" />
      </motion.svg>
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="hidden md:block absolute right-0 top-1/6 -translate-y-1/6 w-24 md:w-48 h-24 md:h-48 opacity-30"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: -100, opacity: 2 }}
        transition={{ duration: 1.5 }}
      >
        <path d="M100 10 C 140 40, 160 100, 100 180 C 40 100, 60 40, 100 10 Z" fill="green" stroke="darkgreen" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="170" stroke="white" strokeWidth="1" />
      </motion.svg>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xs sm:max-w-md lg:max-w-xl space-y-3 sm:space-y-6 relative z-10"
      >
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-1 sm:space-x-3 mb-2 sm:mb-4">
            <div className="relative">
              <img src={logoIconDarkTransparent} alt="AgroChain Logo" className="h-6 sm:h-10 w-6 sm:w-10 object-contain" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-[7px] sm:text-xs font-bold rounded-full w-3 h-3 flex items-center justify-center border border-zinc-400">ET</span>
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="text-base sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500">AgroChain</span>
              <span className="text-[8px] sm:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-md">Ethiopia</span>
            </div>
          </Link>
          <h2 className="text-base sm:text-2xl font-extrabold text-white">{isLogin ? 'Welcome Back' : 'Join AgroChain'}</h2>
          <p className="text-gray-200 text-[8px] sm:text-sm mt-1">{isLogin ? 'Sign in' : 'Create account'}</p>
        </div>
        <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.01 }} className="transform-gpu">
          <Card className="bg-blue-500/20 sm:bg-green-500/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg sm:rounded-2xl p-2 sm:p-6 space-y-2 sm:space-y-5 text-[8px] sm:text-sm transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-4" autoComplete={isLogin ? 'on' : 'off'}>
              {isLogin ? (
                <>
                  <Input
                    label="Email"
=======
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})` }}
    >
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
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
<<<<<<< HEAD
                    placeholder="user@gmail.com"
                    icon={<Mail className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
                    className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
=======
                    placeholder="Enter your Gmail address (e.g., user@gmail.com)"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
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
<<<<<<< HEAD
                      placeholder="Password"
                      icon={<Lock className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
                      className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition pr-10"
=======
                      placeholder="Enter your password"
                      className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
<<<<<<< HEAD
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[8px] sm:text-sm">
=======
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-200"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
<<<<<<< HEAD
                        className="h-4 w-4 text-emerald-400 border-gray-300 rounded"
                        checked={formData.rememberMe || false}
                        onChange={e => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      />
                      <label htmlFor="remember-me" className="ml-1 text-gray-200">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="text-emerald-400 hover:text-emerald-500">Forgot?</Link>
=======
                        className="h-5 w-5 text-emerald-400 focus:ring-emerald-500 border-gray-300 rounded"
                        checked={formData.rememberMe || false}
                        onChange={e => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      />
                      <label htmlFor="remember-me" className="ml-3 block text-base text-gray-950">
                        Remember me
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-base text-gray-950 hover:text-pink-400">
                      Forgot Password?
                    </Link>
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
                  </div>
                  <Button
                    type="submit"
                    loading={isLoading}
<<<<<<< HEAD
                    className="w-full py-1 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md sm:rounded-lg shadow-md flex items-center justify-center space-x-1 sm:space-x-2 text-[8px] sm:text-sm"
                  >
                    {isLoading ? <Loader2 className="h-2 sm:h-4 w-2 sm:w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-2 w-2 sm:h-4 sm:w-4" /></>}
=======
                    className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-pink-950 text-gray-200 transition-all duration-300 transform hover:scale-105"
                    size="large"
                  >
                    Sign In
                    <ArrowRight className="ml-3 h-2 w-4 group-hover:translate-x-1 transition-transform" />
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
                  </Button>
                </>
              ) : (
                <>
                  {renderBasicInfo()}
                  <Button
                    type="submit"
                    loading={isLoading}
<<<<<<< HEAD
                    className="w-full py-1 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md sm:rounded-lg shadow-md flex items-center justify-center space-x-1 sm:space-x-2 text-[8px] sm:text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="h-2 sm:h-4 w-2 sm:w-4 animate-spin" /> : <>Create Account <ArrowRight className="h-2 w-2 sm:h-4 sm:w-4" /></>}
                  </Button>
                </>
              )}
              {error && <p className="text-red-400 text-[8px] sm:text-sm text-center">{error}</p>}
            </form>
            <div className="mt-1 sm:mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/40" />
                </div>
                <div className="relative flex justify-center text-[8px] sm:text-sm">
                  <span className="px-2 bg-transparent text-orange-400">
                    {isLogin ? 'No account?' : 'Have account?'}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleToggleForm}
                className="w-full border-white/30 text-white text-[8px] sm:text-sm py-1 sm:py-2 mt-1 sm:mt-2 hover:text-emerald-400 hover:border-emerald-400"
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </Button>
=======
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
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={handleLogout}
<<<<<<< HEAD
                  className="w-full mt-1 sm:mt-2 border-red-400 text-red-400 text-[8px] sm:text-sm py-1 sm:py-2 hover:bg-red-400 hover:text-white"
=======
                  className="w-full mt-4 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105"
>>>>>>> fc7a57dcea609e3db36652542efe5797e8f7eda3
                >
                  Logout
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
      <LiveChat />
    </div>
  );
};

export default Login;