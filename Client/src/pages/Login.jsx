import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, MapPin, ArrowRight } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import PhoneNumberInput from '../components/common/PhoneNumberInput';
import toast from 'react-hot-toast';
import logo from '../assets/images/newlogo.png';
import { parsePhoneNumber } from 'libphonenumber-js';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import { useLanguage } from '../contexts/LanguageContext';

const GOOGLE_CLIENT_ID = "1088160142171-gs1ds648tsn9vskm3o7v62j3367mrpov.apps.googleusercontent.com";

// Helper function to decode JWT token payload safely on frontend
const decodeGoogleCredential = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding Google credential:", error);
    return null;
  }
};

// OTP Input component (Static structure, no Framer Motion wrappers)
const OTPInput = ({ email, onVerify, onResend }) => {
  const { t } = useLanguage();
  const [inputOtp, setInputOtp] = useState('');
  const [timer, setTimer] = useState(300);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTimer(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (isVerifying) return;
    if (!inputOtp || inputOtp.length !== 6) {
      return toast.error(t('auth.enterValidOtp'), {
        icon: <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center text-xs font-bold">A</div>
      });
    }
    setIsVerifying(true);
    try {
      await onVerify(inputOtp);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    await onResend();
    setTimer(300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <Card className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">{t('auth.verifyEmail')}</h2>
            <p className="text-gray-500 text-sm mt-2">{t('auth.enterOtp')} <span className="font-medium">{email}</span></p>
          </div>
          <form
            className="space-y-4 mt-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
          >
            <Input
              label={t('auth.otpLabel')}
              value={inputOtp}
              onChange={e => setInputOtp(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('auth.otpPlaceholder')}
              className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <div className="flex flex-col items-center gap-3 text-gray-500 text-sm">
              <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg text-indigo-700 font-semibold border border-indigo-100">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                <span>{timer > 0 ? `${Math.floor(timer / 60)}:${('0' + (timer % 60)).slice(-2)}` : t('auth.expired')}</span>
              </div>

              <button
                type="button"
                disabled={timer > 0}
                onClick={handleResend}
                className="text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 font-medium transition-colors hover:underline"
              >
                {timer > 0 ? `${t('auth.resendTimer')} ${timer} ${t('auth.seconds')}` : t('auth.resendOtp')}
              </button>
            </div>
            <Button
              type="submit"
              loading={isVerifying}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
            >
              {t('auth.verifyButton')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

const LoginContent = () => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [initialOtp, setInitialOtp] = useState('');
  const [formData, setFormData] = useState({
    email: sessionStorage.getItem('rememberedEmail') || '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState(null);
  const { login, user, isAuthenticated, loading, googleLoginContext } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticated, loading, navigate, from]);

  const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim());
  
  const isValidFullName = (fullName) => {
    const nameRegex = /^[a-zA-Z\u1200-\u137F\s-]{2,100}$/;
    const hasMultipleWords = fullName.trim().split(/\s+/).length >= 2;
    return nameRegex.test(fullName.trim()) && hasMultipleWords;
  };

  const isValidAddress = (address) => /^[a-zA-Z0-9\u1200-\u137F\s,.-]{5,100}$/.test(address.trim());

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

  const handleVerifyOTP = async (typedOtp) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/verify-otp`, {
        email: otpEmail,
        otp: typedOtp
      });

      if (res.data.success) {
        const loginResult = await login({ email: otpEmail, password: formData.password });

        if (loginResult.success) {
          toast.success(t('auth.otpVerified'), { icon: <img src={logo} alt="A" className="h-6 w-6 rounded-full object-cover" /> });
          navigate('/dashboard', { replace: true });
        } else {
          toast.error(loginResult.error || t('auth.loginFailed'), { icon: <img src={logo} alt="A" className="h-6 w-6 rounded-full object-cover" /> });
        }
      } else {
        toast.error(res.data.error || t('auth.otpInvalid'), { icon: <img src={logo} alt="A" className="h-6 w-6 rounded-full object-cover" /> });
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || t('auth.otpVerificationFailed'), { icon: <img src={logo} alt="A" className="h-6 w-6 rounded-full object-cover" /> });
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/users/resend-otp`, { email: otpEmail });
      if (res.data.success) {
        toast.success(t('auth.otpResent'), { icon: <img src={logo} alt="A" className="h-6 w-6 rounded-full object-cover" /> });
      } else {
        toast.error(res.data.error, { icon: <img src={logo} alt="A" className="h-6 w-6 rounded-full object-cover" /> });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || t('auth.otpResentFailed'), { icon: <img src={logo} alt="A" className="h-6 w-6 rounded-full object-cover" /> });
    }
  };

  // 🛠️ FIXED: Decodes Identity payload and maps key structures matching the backend validation paths
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const decodedData = decodeGoogleCredential(credentialResponse.credential);
      
      if (!decodedData) {
        throw new Error("Failed to extract valid identity claims from Google credential string.");
      }

      // Map parameters seamlessly to your backend destructured arguments
      const payload = {
        email: decodedData.email,
        fullName: decodedData.name,
        profilePic: decodedData.picture
      };

      const res = await axios.post(`${API_URL}/api/users/google`, payload);

      if (res.data.success) {
        await googleLoginContext(res.data.token, res.data.user);
        toast.success(t('auth.googleLoginSuccess') || 'Logged in with Google successfully!');
        navigate(from, { replace: true });
      } else {
        toast.error(res.data.message || 'Google login failed');
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to authenticate via Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (isLogin) {
      if (!formData.email || !formData.password) {
        toast.error(t('auth.enterCredentials'));
        setIsLoading(false);
        return;
      }
      if (!isValidEmail(formData.email)) {
        toast.error(t('auth.validGmailHelper'));
        setIsLoading(false);
        return;
      }

      try {
        const result = await login({ email: formData.email, password: formData.password });

        if (result.success) {
          toast.success(t('auth.loginSuccess'));
          navigate(from, { replace: true });
        } else {
          toast.error(result.error || t('auth.loginFailed'));
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error(error.response?.data?.error || t('auth.loginError'));
      }
    } else {
      const { fullName, email, password, phone, address, agreeToTerms, confirmPassword } = formData;

      if (!fullName || !email || !password || !phone || !address || !confirmPassword) {
        toast.error(t('auth.allFieldsRequired'));
        setIsLoading(false);
        return;
      }
      if (!isValidEmail(email)) {
        toast.error(t('auth.validGmail'));
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast.error(t('auth.passwordMismatch'));
        setIsLoading(false);
        return;
      }
      if (!isValidFullName(fullName)) {
        toast.error(t('auth.validNameHelper'));
        setIsLoading(false);
        return;
      }
      if (!isValidAddress(address)) {
        toast.error(t('auth.validAddressHelper'));
        setIsLoading(false);
        return;
      }
      if (!isValidPhone(phone)) {
        toast.error(t('auth.validPhoneHelper'));
        setIsLoading(false);
        return;
      }
      if (!agreeToTerms) {
        toast.error(t('auth.agreeTermsError'));
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(`${API_URL}/api/users/register`, { fullName, email, password, phone, address, agreeToTerms });
        if (response.data.success) {
          setOtpEmail(email);
          setInitialOtp(response.data.otp);
          setShowOTP(true);
        } else {
          toast.error(response.data.error || t('auth.registrationFailed'));
        }
      } catch (error) {
        toast.error(error.response?.data?.error || t('auth.registrationFailed'));
      }
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900">{t('auth.basicInfo')}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('auth.fullName')}
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Wubante Mitiku"
          icon={<User className="h-5 w-5 text-gray-500" />}
          className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <PhoneNumberInput
          label={t('auth.phone')}
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          onKeyPress={handleKeyPress}
          placeholder="+251927993894"
          className="text-sm py-2 px-4 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
        />
      </div>
      <Input
        label={t('auth.email')}
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
        label={t('auth.address')}
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
            label={t('auth.password')}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={t('auth.createPasswordPlaceholder')}
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
          label={t('auth.confirmPassword')}
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={t('auth.confirmPasswordPlaceholder')}
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
          {t('auth.agreeTo')}{' '}
          <Link to="/terms" className="text-indigo-600 hover:text-indigo-700 font-medium">
            {t('auth.terms')}
          </Link>{' '}
          {t('auth.and')}{' '}
          <Link to="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
            {t('auth.privacyPolicy')}
          </Link>
        </label>
      </div>
    </div>
  );

  if (showOTP) return <OTPInput email={otpEmail} otp={initialOtp} onVerify={handleVerifyOTP} onResend={handleResendOTP} />;

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">{isLogin ? t('auth.welcomeBack') : t('auth.joinTitle')}</h2>
          <p className="text-gray-500 text-sm mt-2">
            {isLogin ? t('auth.signInDesc') : t('auth.createAccountDesc')}
          </p>
        </div>
        <Card className="bg-white/90 backdrop-blur-lg border border-gray-100 shadow-2xl rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete={isLogin ? 'on' : 'off'}>
            {isLogin ? (
              <>
                <Input
                  label={t('auth.email')}
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
                    label={t('auth.password')}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={t('auth.password')}
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
                    <label htmlFor="remember-me" className="ml-2 text-gray-600">{t('auth.rememberMe')}</label>
                  </div>
                  <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full bg-gradient-to-r from-lime-950 to-green-600 text-white hover:from-lime-900 hover:to-green-700 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  {t('auth.signIn')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                {renderBasicInfo()}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full mt-4 border-gray-200 text-gray-800 hover:bg-indigo-600 hover:text-white py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  {t('auth.createAccount')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </>
            )}
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
          </form>

          {isLogin && (
            <div className="mt-4">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              <div className="flex justify-center w-full">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google authentication failed.")}
                  shape="circle"
                  theme="filled_blue"
                />
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">{isLogin ? t('auth.newTo') : t('auth.alreadyHaveAccount')}</span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleToggleForm}
              className="w-full mt-4 border-gray-200 text-gray-800 hover:bg-indigo-600 hover:text-white py-2 rounded-xl text-sm font-semibold transition-all duration-300"
            >
              {isLogin ? t('auth.createAccount') : t('auth.signIn')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginContent />
    </GoogleOAuthProvider>
  );
};

export default Login;