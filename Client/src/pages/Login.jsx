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

  return (
    <div className="min-h-screen flex items-center justify-center py-4 px-2 sm:py-6 sm:px-4 bg-white">
      <Card className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl p-3 w-full max-w-sm sm:p-4 md:p-6">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">Verify Your Email</h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-sm mt-1">Enter OTP sent to {email}</p>
        </div>
        <form className="space-y-2 mt-2 sm:space-y-3 sm:mt-3 md:space-y-4 md:mt-4">
          <Input
            label="OTP Code"
            value={inputOtp}
            onChange={e => setInputOtp(e.target.value)}
            placeholder="6-digit OTP"
            className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
          />
          <div className="flex justify-between items-center text-gray-500 text-xs sm:text-xs md:text-xs">
            <span>{timer > 0 ? `${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}` : 'Expired'}</span>
            <button type="button" disabled={timer > 0} onClick={onResend} className="text-blue-600 hover:text-blue-500 disabled:text-gray-400">
              Resend
            </button>
          </div>
          <Button
            type="button"
            onClick={handleVerify}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 rounded-lg text-sm py-1.5 sm:text-base md:text-base md:py-2"
          >
            Verify
            <ArrowRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4 md:ml-2 md:h-4 md:w-4" />
          </Button>
        </form>
      </Card>
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
        toast.error('Password: 8+ chars, uppercase, lowercase, number, special char.');
        setIsLoading(false);
        return;
      }

      if (!isValidFullName(fullName)) {
        toast.error('Valid full name (2+ words, letters only).');
        setIsLoading(false);
        return;
      }

      if (!isValidAddress(address)) {
        toast.error('Valid address (5-100 chars).');
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

  const handleLogout = () => {
    logout();
    localStorage.removeItem('rememberedEmail');
    navigate('/login', { replace: true });
    toast.success('Logged out!');
  };

  const renderBasicInfo = () => (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      <div className="text-center mb-2 sm:mb-3 md:mb-4">
        <h3 className="text-base font-bold text-gray-800 sm:text-lg md:text-lg">Basic Info</h3>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
        <Input
          label="Full Name"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Tilahun Sitotaw"
          icon={<User className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4 md:h-4 md:w-4" />}
          className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
        />
        <PhoneNumberInput
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="+251912345678"
          className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="user@gmail.com"
          icon={<Mail className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4 md:h-4 md:w-4" />}
          className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
        />
        <Input
          label="Address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="123 Main St, Addis Ababa"
          icon={<MapPin className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4 md:h-4 md:w-4" />}
          className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
        />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:gap-3 md:gap-4">
        <div className="relative">
          <Input
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-7 text-gray-600 hover:text-gray-800 sm:top-8 md:top-8"
          >
            {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4" />}
          </button>
        </div>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm Password"
          className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
        />
      </div>
      <div className="flex items-center mt-1 sm:mt-2 md:mt-2">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded sm:h-4 sm:w-4 md:h-4 md:w-4"
        />
        <label htmlFor="agreeToTerms" className="ml-1 text-xs sm:text-sm md:text-sm text-gray-700">
          Agree to{' '}
          <Link to="/terms-of-service" className="text-indigo-600 hover:text-indigo-500">
            Terms
          </Link>{' '}
          and{' '}
          <Link to="/privacy-policy" className="text-indigo-600 hover:text-indigo-500">
            Privacy
          </Link>
          .
        </label>
      </div>
      {passwordStrength && (
        <p className={`text-xs ${passwordStrength === 'Strong' ? 'text-indigo-600' : 'text-red-600'} sm:text-sm md:text-sm`}>
          Password: {passwordStrength}
        </p>
      )}
    </div>
  );

  if (showOTP) return <OTPInput email={otpEmail} otp={initialOtp} onVerify={handleVerifyOTP} onResend={handleResendOTP} />;

  return (
    <div className="min-h-screen flex items-center justify-center py-2 px-2 sm:py-4 sm:px-4 bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-center w-full h-[80vh] max-w-6xl">
        {/* Login Form - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full p-2 sm:p-4 md:p-6"
        >
          <div className="text-center mb-2 sm:mb-4 md:mb-6">
            <Link to="/" className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-2">
              <div className="relative">
                <img src={logoIconDarkTransparent} alt="AgroChain Logo Icon" className="h-6 w-6 object-contain sm:h-8 sm:w-8 md:h-10 md:w-10" />
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-white text-xs font-bold rounded-full w-3 h-3 flex items-center justify-center border border-gray-800 sm:w-3 sm:h-3 md:w-4 md:h-4">
                  ET
                </span>
              </div>
              <div className="flex flex-col -space-y-0.5 sm:-space-y-1 md:-space-y-1">
                <span className="text-lg font-bold text-gray-800 sm:text-xl md:text-2xl">AgroChain</span>
                <span className="text-xs font-semibold text-indigo-600 sm:text-sm md:text-sm">Ethiopia</span>
              </div>
            </Link>
            <h2 className="text-xl font-bold text-gray-800 mt-1 sm:mt-2 md:mt-4 sm:text-2xl md:text-2xl">{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
            <p className="text-gray-600 text-xs sm:text-sm md:text-sm">{isLogin ? 'Sign in' : 'Create account'}</p>
          </div>
          <Card className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-md rounded-lg p-2 sm:p-4 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3 md:space-y-4" autoComplete={isLogin ? 'on' : 'off'}>
              {isLogin ? (
                <>
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="user@gmail.com"
                    icon={<Mail className="h-3 w-3 text-gray-600 sm:h-4 sm:w-4 md:h-4 md:w-4" />}
                    className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="text-sm py-1.5 px-2 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded sm:text-base md:text-base md:py-2"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-7 text-gray-600 hover:text-gray-800 sm:top-8 md:top-8"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm md:text-xs">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded sm:h-4 sm:w-4 md:h-4 md:w-4"
                        checked={formData.rememberMe || false}
                        onChange={e => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                      />
                      <label htmlFor="remember-me" className="ml-1 text-gray-700 sm:ml-2 md:ml-2">
                        Remember
                      </label>
                    </div>
                    <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-500">
                      Forgot?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 rounded-lg text-sm py-1.5 sm:text-base md:text-base md:py-2"
                  >
                    Sign In
                    <ArrowRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4 md:ml-2 md:h-4 md:w-4" />
                  </Button>
                </>
              ) : (
                <>
                  {renderBasicInfo()}
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 rounded-lg text-sm py-1.5 sm:text-base md:text-base md:py-2"
                  >
                    Create Account
                    <ArrowRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4 md:ml-2 md:h-4 md:w-4" />
                  </Button>
                </>
              )}
              {error && <p className="text-red-600 text-center text-xs sm:text-sm md:text-xs">{error}</p>}
            </form>
            <div className="mt-2 sm:mt-3 md:mt-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm md:text-xs">
                  <span className="px-2 bg-white text-gray-600">{isLogin ? "No account?" : "Have account?"}</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleToggleForm}
                className="w-full mt-1 sm:mt-2 md:mt-2 border-gray-200 text-gray-800 hover:bg-indigo-600 hover:text-white transition-all duration-200 rounded-lg text-sm py-1 sm:text-base md:text-base md:py-1.5"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </Button>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full mt-1 sm:mt-2 md:mt-2 border-red-400 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 rounded-lg text-sm py-1 sm:text-base md:text-base md:py-1.5"
                >
                  Logout
                </Button>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Animated Background with Text - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="hidden sm:block w-0 sm:w-1/2 h-full relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="10,90 50,10 90,90" fill="rgba(99, 102, 241, 0.3)" />
              <polygon points="20,80 60,20 80,80" fill="rgba(168, 85, 247, 0.3)" />
              <polygon points="30,70 70,30 90,70" fill="rgba(139, 92, 246, 0.3)" />
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="20s"
                repeatCount="indefinite"
              />
            </svg>
          </div>
          <motion.div
            className="relative text-center z-10 flex items-center justify-center h-full"
            animate={{
              opacity: [0.7, 1, 0.7],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div>
              <h1 className="text-2xl font-extrabold text-indigo-600 drop-shadow-lg sm:text-3xl md:text-4xl">AgroChain</h1>
              <p className="text-lg text-purple-600 mt-1 drop-shadow sm:text-xl md:text-xl md:mt-2">Empowering Ethiopian Agriculture</p>
              <p className="text-xs text-gray-600 sm:text-sm md:text-sm">Join us today at 03:01 PM EAT, August 29, 2025!</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <LiveChat />
    </div>
  );
};

export default Login;