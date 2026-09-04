import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, ArrowLeft, Timer, RefreshCw, CheckCircle2 } from "lucide-react";
import logo from '../assets/images/newlogo.png';
import { API_URL } from "../utils/apiConfig";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();
  const { setUser, setToken, setIsAuthenticated } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email) return toast.error(t('auth.forgotPasswordPage.enterEmail'));
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      toast.success(t('auth.forgotPasswordPage.otpSentSuccess'));
      setStep(2);
      setTimer(180);
    } catch (err) {
      toast.error(err.response?.data?.error || t('auth.forgotPasswordPage.otpSendFailed'));
    } finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      toast.success(t('auth.forgotPasswordPage.otpResentSuccess'));
      setTimer(180);
    } catch (err) { toast.error(t('auth.forgotPasswordPage.otpResentFailed')); }
    finally { setIsLoading(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error(t('auth.forgotPasswordPage.fillAllFields'));
    if (newPassword !== confirmPassword) return toast.error(t('auth.forgotPasswordPage.passwordsDontMatch'));

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/reset-password`, {
        email, otp, password: newPassword,
      });
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      if (setToken) setToken(res.data.token);
      if (setUser) setUser(res.data.user);
      if (setIsAuthenticated) setIsAuthenticated(true);
      toast.success(t('auth.forgotPasswordPage.resetSuccess'));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || t('auth.forgotPasswordPage.resetFailed'));
    } finally { setIsLoading(false); }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <img src={logo} alt="Agrochain" className="h-14 mx-auto mb-6" />
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}
            className="group inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            {step === 1 ? "Return to Sign In" : "Back to previous step"}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden">
          {/* Top Progress Indicator */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50">
            <div 
              className={`h-full transition-all duration-700 ease-out ${step === 3 ? 'bg-green-500' : 'bg-blue-600'}`} 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {step === 1 && t('auth.forgotPasswordPage.title')}
              {step === 2 && t('auth.forgotPasswordPage.enterOtpTitle')}
              {step === 3 && t('auth.forgotPasswordPage.resetPasswordTitle')}
            </h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              {step === 1 && "Don't worry! Enter your email and we'll send you a reset code."}
              {step === 2 && `We've sent a 6-digit verification code to ${email}`}
              {step === 3 && "Almost done! Please choose a strong new password."}
            </p>
          </div>

          {/* Form Content */}
          <div className="min-h-[220px]">
            {step === 1 && (
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-3"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <span>Get Secure Code</span>}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={(e) => {e.preventDefault(); setStep(3)}} className="space-y-6">
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    required
                    maxLength="6"
                    placeholder="· · · · · ·"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 font-bold text-xl tracking-[0.5em] focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none text-center transition-all"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>

                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <Timer className="w-4 h-4 mr-1.5 text-blue-500" />
                    <span>{timer > 0 ? formatTimer(timer) : "Expired"}</span>
                  </div>
                  <button
                    type="button"
                    disabled={timer > 0 || isLoading}
                    onClick={handleResendOtp}
                    className={`text-sm font-bold transition-colors ${timer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all"
                >
                  Verify and Continue
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="Create new password"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 font-medium focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="relative group">
                  <CheckCircle2 className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 font-medium focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-green-100 active:scale-[0.98] transition-all"
                >
                  {isLoading ? "Saving..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;