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

  return (
    <div className="relative min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 lg:px-8 bg-gradient-to-br from-blue-700 via-emerald-600 to-blue-500 overflow-hidden">
      <Card className="bg-blue-500/20 sm:bg-green-500/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-lg sm:rounded-2xl p-2 sm:p-6 w-full max-w-xs sm:max-w-md">
        <div className="text-center">
          <h2 className="text-base sm:text-2xl font-extrabold text-white">Verify Your Email</h2>
          <p className="text-gray-200 text-[8px] sm:text-sm mt-1">Enter OTP sent to {email}</p>
        </div>
        <form className="space-y-2 sm:space-y-4 mt-3">
          <Input
            label="OTP Code"
            value={inputOtp}
            onChange={e => setInputOtp(e.target.value)}
            placeholder="6-digit OTP"
            className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
          />
          <div className="flex justify-between text-gray-200 text-[10px] sm:text-sm">
            <span>{timer > 0 ? `Expires: ${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}` : 'Expired'}</span>
            <button type="button" disabled={timer > 0} onClick={onResend} className="text-emerald-400 hover:text-emerald-500 underline disabled:text-gray-500">
              Resend
            </button>
          </div>
          <Button
            type="button"
            onClick={handleVerify}
            loading={false}
            className="w-full py-1 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md sm:rounded-lg shadow-md flex items-center justify-center space-x-1 sm:space-x-2 text-[8px] sm:text-sm"
          >
            {false ? <Loader2 className="h-2 sm:h-4 w-2 sm:w-4 animate-spin" /> : <>Verify OTP <ArrowRight className="h-2 w-2 sm:h-4 sm:w-4" /></>}
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
        toast.error('Enter email and password.');
        setIsLoading(false);
        return;
      }
      if (!isValidEmail(formData.email)) {
        toast.error('Valid Gmail required.');
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
      const { fullName, email, password, phone, address, agreeToTerms } = formData;

      if (!fullName || !email || !password || !phone || !address) {
        toast.error('All fields required.');
        setIsLoading(false);
        return;
      }

      if (!isValidEmail(email)) {
        toast.error('Valid Gmail required.');
        setIsLoading(false);
        return;
      }

      if (!isValidPassword(password)) {
        toast.error('Password must be 8+ chars with uppercase, lowercase, number, and special char.');
        setIsLoading(false);
        return;
      }

      if (!isValidFullName(fullName)) {
        toast.error('Valid full name (2+ words) required.');
        setIsLoading(false);
        return;
      }

      if (!isValidAddress(address)) {
        toast.error('Valid address (5-100 chars) required.');
        setIsLoading(false);
        return;
      }

      if (!isValidPhone(phone)) {
        toast.error('Valid phone number required.');
        setIsLoading(false);
        return;
      }

      if (!agreeToTerms) {
        toast.error('Agree to terms required.');
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

  const handleLogout = () => {
    logout();
    localStorage.removeItem('rememberedEmail');
    navigate('/login', { replace: true });
    toast.success('Logged out!');
  };

  const renderBasicInfo = () => (
    <div className="space-y-2 sm:space-y-4">
      <div className="text-center mb-2 sm:mb-4">
        <h3 className="text-base sm:text-xl font-extrabold text-white">Basic Information</h3>
        <p className="text-gray-200 text-[8px] sm:text-sm">Enter your details</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <Input
          label="Full Name *"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Full name"
          required
          icon={<User className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
          className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
        />
        <PhoneNumberInput
          label="Phone Number *"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          required
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
        />
        <div className="relative">
          <Input
            label="Password *"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            required
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
            autoComplete="new-password"
          />
          <button
            type="button"
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
            required
          />
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
      </div>
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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="user@gmail.com"
                    icon={<Mail className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
                    className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition"
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
                      placeholder="Password"
                      icon={<Lock className="h-2 sm:h-5 w-2 sm:w-5 text-gray-400" />}
                      className="text-[8px] sm:text-sm py-1 sm:py-2 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-md sm:rounded-lg focus:ring-2 focus:ring-emerald-400 transition pr-10"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[8px] sm:text-sm">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-emerald-400 border-gray-300 rounded"
                        checked={formData.rememberMe || false}
                        onChange={e => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      />
                      <label htmlFor="remember-me" className="ml-1 text-gray-200">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="text-emerald-400 hover:text-emerald-500">Forgot?</Link>
                  </div>
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full py-1 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md sm:rounded-lg shadow-md flex items-center justify-center space-x-1 sm:space-x-2 text-[8px] sm:text-sm"
                  >
                    {isLoading ? <Loader2 className="h-2 sm:h-4 w-2 sm:w-4 animate-spin" /> : <>Sign In <ArrowRight className="h-2 w-2 sm:h-4 sm:w-4" /></>}
                  </Button>
                </>
              ) : (
                <>
                  {renderBasicInfo()}
                  <Button
                    type="submit"
                    loading={isLoading}
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
              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full mt-1 sm:mt-2 border-red-400 text-red-400 text-[8px] sm:text-sm py-1 sm:py-2 hover:bg-red-400 hover:text-white"
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