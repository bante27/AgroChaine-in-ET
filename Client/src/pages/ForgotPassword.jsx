import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
      setTimer(180); // 3 minutes
    } catch (err) {
      toast.error(err.response?.data?.error || t('auth.forgotPasswordPage.otpSendFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return toast.error(t('auth.forgotPasswordPage.enterEmailFirst'));

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/users/forgot-password`, { email });
      toast.success(t('auth.forgotPasswordPage.otpResentSuccess'));
      setTimer(180); // 3 minutes
    } catch (err) {
      toast.error(err.response?.data?.error || t('auth.forgotPasswordPage.otpResendFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (!otp) return toast.error(t('auth.forgotPasswordPage.enterOtp'));
    setStep(3);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) return toast.error(t('auth.forgotPasswordPage.fillAllFields'));
    if (newPassword !== confirmPassword) return toast.error(t('auth.forgotPasswordPage.passwordsDontMatch'));

    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/reset-password`, {
        email,
        otp,
        password: newPassword,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update context state
      if (setToken) setToken(res.data.token);
      if (setUser) setUser(res.data.user);
      if (setIsAuthenticated) setIsAuthenticated(true);

      toast.success(t('auth.forgotPasswordPage.resetSuccess'));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || t('auth.forgotPasswordPage.resetFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4">
      <div className="max-w-md w-full bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {step === 1 && t('auth.forgotPasswordPage.title')}
          {step === 2 && t('auth.forgotPasswordPage.enterOtpTitle')}
          {step === 3 && t('auth.forgotPasswordPage.resetPasswordTitle')}
        </h2>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              placeholder={t('auth.forgotPasswordPage.emailPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg shadow-md transition"
            >
              {isLoading ? t('auth.forgotPasswordPage.sendingButton') : t('auth.forgotPasswordPage.sendOtpButton')}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <input
              type="text"
              placeholder={t('auth.forgotPasswordPage.otpPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 tracking-widest text-center font-mono"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {timer > 0 ? (
              <p className="text-sm text-center">
                {t('auth.forgotPasswordPage.otpExpiresIn')}{" "}
                <span className="font-semibold text-red-500">{formatTimer(timer)}</span>
              </p>
            ) : (
              <p className="text-sm text-center">
                {t('auth.forgotPasswordPage.didntReceiveOtp')}{" "}
                <button
                  type="button"
                  className="text-blue-600 underline hover:text-blue-800"
                  onClick={handleResendOtp}
                >
                  {t('auth.forgotPasswordPage.resendOtp')}
                </button>
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg shadow-md transition"
            >
              {isLoading ? t('auth.forgotPasswordPage.verifyingButton') : t('auth.forgotPasswordPage.verifyOtpButton')}
            </button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              placeholder={t('auth.forgotPasswordPage.newPasswordPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t('auth.forgotPasswordPage.confirmPasswordPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg shadow-md transition"
            >
              {isLoading ? t('auth.forgotPasswordPage.resettingButton') : t('auth.forgotPasswordPage.resetPasswordButton')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
