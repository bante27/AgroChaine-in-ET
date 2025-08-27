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
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImage})` }}>
      <Card className="bg-white/15 backdrop-blur-sm border border-white/30 shadow-lg p-4 w-80 rounded-lg">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Verify Your Email</h2>
          <p className="text-gray-200 text-xs mt-1">Enter OTP sent to {email}</p>
        </div>
        <form className="space-y-3 mt-3">
          <Input
            label="OTP Code"
            value={inputOtp}
            onChange={e => setInputOtp(e.target.value)}
            placeholder="6-digit OTP"
            className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
          />
          <div className="flex justify-between text-gray-200 text-xs">
            <span>{timer > 0 ? `Expires: ${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}` : 'Expired'}</span>
            <button type="button" disabled={timer > 0} onClick={onResend} className="text-teal-400 hover:underline disabled:text-gray-500">
              Resend
            </button>
          </div>
          <Button
            type="button"
            onClick={handleVerify}
            loading={false}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded text-sm py-1"
          >
            Verify OTP
            <ArrowRight className="ml-1 h-3 w-3" />
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
    <div className="space-y-3">
      <div className="text-center mb-4">
        <h3 className="text-sm font-bold text-white">Basic Information</h3>
        <p className="text-gray-200 text-xs">Enter your details</p>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <Input
          label="Full Name *"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Full name"
          required
          icon={<User className="h-4 w-4 text-gray-200" />}
          className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
        />
        <PhoneNumberInput
          label="Phone Number *"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          required
          placeholder="+251912345678"
          className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
        />
        <Input
          label="Email Address *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="user@gmail.com"
          required
          icon={<Mail className="h-4 w-4 text-gray-200" />}
          className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
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
          icon={<MapPin className="h-4 w-4 text-gray-200" />}
          className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
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
            className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-0 pr-2 top-6"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-200" /> : <Eye className="h-4 w-4 text-gray-200" />}
          </button>
        </div>
        <Input
          label="Confirm Password *"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm password"
          required
          className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
          autoComplete="new-password"
        />
        <div className="flex items-center">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="h-4 w-4 text-teal-400 border-gray-300 rounded"
            required
          />
          <label htmlFor="agreeToTerms" className="ml-1 text-xs text-gray-200">
            I agree to{' '}
            <Link to="/terms-of-service" className="text-teal-400 hover:text-pink-400">Terms</Link> and{' '}
            <Link to="/privacy-policy" className="text-teal-400 hover:text-pink-400">Privacy</Link>.
          </label>
        </div>
        {passwordStrength && (
          <p className={`text-xs ${passwordStrength === 'Strong' ? 'text-teal-400' : 'text-red-400'}`}>
            Strength: {passwordStrength}
          </p>
        )}
      </div>
    </div>
  );

  if (showOTP) return <OTPInput email={otpEmail} otp={initialOtp} onVerify={handleVerifyOTP} onResend={handleResendOTP} />;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImage})` }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-80 space-y-4"
      >
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2">
            <img src={logoIconDarkTransparent} alt="AgroChain Logo" className="h-8 w-8" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-teal-400">AgroChain</span>
              <span className="text-xs font-medium text-emerald-300">Ethiopia</span>
            </div>
          </Link>
          <h2 className="text-xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Join AgroChain'}</h2>
          <p className="text-gray-200 text-xs">{isLogin ? 'Sign in' : 'Create account'}</p>
        </div>
        <Card className="bg-white/15 backdrop-blur-sm border border-white/30 shadow-lg p-4 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-3" autoComplete={isLogin ? 'on' : 'off'}>
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
                  icon={<Mail className="h-4 w-4 text-gray-200" />}
                  className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
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
                    className="text-sm py-1 bg-white/10 border-white/30 text-white placeholder-gray-300 rounded focus:ring-teal-400"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-6 text-gray-200 hover:text-teal-400"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-teal-400 border-gray-300 rounded"
                      checked={formData.rememberMe || false}
                      onChange={e => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                    />
                    <label htmlFor="remember-me" className="ml-1 text-gray-200">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="text-teal-400 hover:text-pink-400">Forgot?</Link>
                </div>
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded text-sm py-1"
                >
                  Sign In
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </>
            ) : (
              <>
                {renderBasicInfo()}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded text-sm py-1"
                  disabled={isLoading}
                >
                  Create Account
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </>
            )}
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          </form>
          <div className="mt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/40" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-transparent text-orange-400">
                  {isLogin ? "No account?" : 'Have account?'}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleToggleForm}
              className="w-full border-white/30 text-white text-xs py-1 mt-1 hover:text-pink-400"
            >
              {isLogin ? 'Create account' : 'Sign in'}
            </Button>
            {isAuthenticated && (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full mt-1 border-red-400 text-red-400 text-xs py-1 hover:bg-red-400 hover:text-white"
              >
                Logout
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
      <LiveChat />
    </div>
  );
};

export default Login;