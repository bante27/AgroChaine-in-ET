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

// OTP Input component styled like the login/register form
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
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
      }}
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
          <h2 className="text-4xl font-extrabold text-white">Verify Your Email Account</h2>
          <p className="text-gray-300 text-lg mt-2">Enter the OTP sent to {email}</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8">
            <form className="space-y-6 mt-2" onSubmit={e => { e.preventDefault(); handleVerify(); }}>
              <Input
                label="OTP Code"
                value={inputOtp}
                onChange={e => setInputOtp(e.target.value)}
                placeholder="6-digit OTP"
                className="text-lg py-3 bg-white/5 border-white/20 text-white placeholder-gray-400"
                autoComplete="one-time-code"
              />
              <div className="flex justify-between items-center text-gray-300 text-sm">
                <span>
                  {timer > 0
                    ? `Expires in ${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}`
                    : 'OTP expired'}
                </span>
                <button
                  type="button"
                  disabled={timer > 0}
                  onClick={onResend}
                  className="text-blue-400 hover:underline disabled:text-gray-400"
                >
                  Resend
                </button>
              </div>
              <Button
                type="submit"
                loading={false}
                className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-pink-950 text-white transition-all duration-300 transform hover:scale-105"
                size="large"
              >
                Verify OTP
                <ArrowRight className="ml-3 h-2 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-400">
              Didn’t receive the code? Check your spam or{' '}
              <button
                type="button"
                disabled={timer > 0}
                onClick={onResend}
                className="text-blue-400 hover:underline disabled:text-gray-500"
              >
                resend OTP
              </button>
              .
            </div>
          </Card>
        </motion.div>
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
      const res = await axios.post('http://localhost:5000/api/users/resend-otp', { email: otpEmail });
      if (res.data.success) {
        setInitialOtp(res.data.otp || '');
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
      // login validation
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
          setOtpEmail(formData.email);
          setInitialOtp(response.data.otp || '');
          setShowOTP(true);
          toast.success('OTP sent to your email. Please verify.');
        } else {
          toast.error(response.data.error || 'Login failed. Please check your credentials.');
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'An unexpected error occurred during login.');
      }
    } else {
      // registration validation
      if (
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.fullName ||
        !formData.phone ||
        !formData.address
      ) {
        toast.error('Please fill all required fields.');
        setIsLoading(false);
        return;
      }
      if (!isValidEmail(formData.email)) {
        toast.error('Please enter a valid Gmail address (e.g., user@gmail.com).');
        setIsLoading(false);
        return;
      }
      if (!isValidFullName(formData.fullName)) {
        toast.error('Full name must have at least two words and only letters, spaces, or hyphens.');
        setIsLoading(false);
        return;
      }
      if (!isValidPhone(formData.phone)) {
        toast.error('Please enter a valid Ethiopian phone number.');
        setIsLoading(false);
        return;
      }
      if (!isValidAddress(formData.address)) {
        toast.error('Please enter a valid address (5-100 characters).');
        setIsLoading(false);
        return;
      }
      if (!isValidPassword(formData.password)) {
        toast.error(
          'Password must be at least 8 characters long, with uppercase, lowercase, number, and special character.'
        );
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match.');
        setIsLoading(false);
        return;
      }
      if (!formData.agreeToTerms) {
        toast.error('You must agree to the terms and conditions.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/api/users/register', {
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        });
        if (response.data.success) {
          setOtpEmail(formData.email);
          setInitialOtp(response.data.otp || '');
          setShowOTP(true);
          toast.success('Registration successful! OTP sent to your email.');
        } else {
          toast.error(response.data.error || 'Registration failed.');
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'An unexpected error occurred during registration.');
      }
    }

    setIsLoading(false);
  };

  if (showOTP) {
    return <OTPInput email={otpEmail} otp={initialOtp} onVerify={handleVerifyOTP} onResend={handleResendOTP} />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
      }}
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
          <h2 className="text-4xl font-extrabold text-white">{isLogin ? 'Login to Your Account' : 'Create a New Account'}</h2>
          <p className="text-gray-300 text-lg mt-2">
            {isLogin
              ? 'Sign in to access your dashboard.'
              : 'Register now to start managing your farm with AgroChain.'}
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6 mt-2">
              {/* Email input */}
              <Input
                type="email"
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@gmail.com"
                autoComplete="email"
                icon={<Mail className="h-4 w-4 text-white/60" />}
                className="text-white bg-white/5 border-white/20 placeholder-white/50"
              />
              {/* Password input */}
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="********"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                icon={
                  showPassword ? (
                    <EyeOff className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(false)} />
                  ) : (
                    <Eye className="h-4 w-4 cursor-pointer" onClick={() => setShowPassword(true)} />
                  )
                }
                className="text-white bg-white/5 border-white/20 placeholder-white/50"
              />

              {!isLogin && (
                <>
                  <Input
                    type="password"
                    name="confirmPassword"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="********"
                    autoComplete="new-password"
                    className="text-white bg-white/5 border-white/20 placeholder-white/50"
                  />
                  <Input
                    type="text"
                    name="fullName"
                    label="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    icon={<User className="h-4 w-4 text-white/60" />}
                    className="text-white bg-white/5 border-white/20 placeholder-white/50"
                  />
                  <PhoneNumberInput value={formData.phone} onChange={handlePhoneChange} />
                  <Input
                    type="text"
                    name="address"
                    label="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Farm St, Addis Ababa"
                    icon={<MapPin className="h-4 w-4 text-white/60" />}
                    className="text-white bg-white/5 border-white/20 placeholder-white/50"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <label htmlFor="agreeToTerms" className="text-white text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-orange-500 hover:underline">
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                  {passwordStrength && (
                    <p
                      className={`text-sm font-semibold ${
                        passwordStrength === 'Strong' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      Password strength: {passwordStrength}
                    </p>
                  )}
                </>
              )}
              <Button
                type="submit"
                loading={isLoading}
                className="w-full group bg-gradient-to-r from-emerald-600 to-teal-600 hover:text-pink-950 text-white transition-all duration-300 transform hover:scale-105"
                size="large"
              >
                {isLogin ? 'Login' : 'Register'}
                <ArrowRight className="ml-3 h-2 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            <p className="mt-6 text-center text-white">
              {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={handleToggleForm}
                className="text-orange-500 hover:underline font-semibold"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </Card>
        </motion.div>
      </motion.div>
      <LiveChat />
    </div>
  );
};

export default Login;
