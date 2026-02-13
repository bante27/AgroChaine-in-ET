// src/components/VerificationModal.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from './Button';
import { Camera, CheckCircle, ShieldCheck, Smartphone, RefreshCw, Upload, X, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';

const VerificationModal = ({ isOpen, onClose, onVerify, verificationStatus, userEmail }) => {
  const [step, setStep] = useState(1);
  const [govIdFront, setGovIdFront] = useState(null);
  const [govIdBack, setGovIdBack] = useState(null);
  const [govIdSelfie, setGovIdSelfie] = useState(null);
  const [name, setName] = useState('');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraType, setCameraType] = useState('id_front'); // id_front, id_back, selfie
  const [facingMode, setFacingMode] = useState('environment'); // user or environment

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const { t } = useLanguage();

  const handleRequestOTP = async () => {
    setIsSendingCode(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/users/request-verification-otp`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(t('dashboard.verification.emailOtpSent'));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to send code");
    } finally {
      setIsSendingCode(false);
    }
  };

  // Mask Email function
  const maskEmail = (email) => {
    if (!email) return "••••@••••.com";
    const [userPart, domain] = email.split('@');
    if (userPart.length <= 2) return `${userPart.charAt(0)}•••@${domain}`;
    return `${userPart.substring(0, 2)}••••@${domain}`;
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setGovIdFront(null);
      setGovIdBack(null);
      setGovIdSelfie(null);
      setOtpCode('');
      setFacingMode('environment');
    }
  }, [isOpen]);

  // Handle Camera Stream
  useEffect(() => {
    let stream;
    if (isCameraActive) {
      const constraints = {
        video: {
          facingMode: cameraType === 'selfie' ? 'user' : facingMode
        }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Camera error:", err);
          toast.error(t('dashboard.verification.cameraAccessFailed'));
          setIsCameraActive(false);
        });
    }
    return () => stream && stream.getTracks().forEach((tk) => tk.stop());
  }, [isCameraActive, cameraType, facingMode, t]);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      // Set canvas size to video size for full resolution
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);

      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
      const file = dataURLtoFile(imageData, `${cameraType}.jpg`);

      handleFileSelection(file);
      setIsCameraActive(false);
    }
  };

  const handleFileSelection = (file) => {
    if (cameraType === 'id_front') {
      setGovIdFront(file);
      toast.success(t('dashboard.verification.frontIdCaptured'));
    } else if (cameraType === 'id_back') {
      setGovIdBack(file);
      toast.success(t('dashboard.verification.backIdCaptured'));
    } else if (cameraType === 'selfie') {
      setGovIdSelfie(file);
      toast.success(t('dashboard.verification.selfieCaptured'));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const nextStep = () => {
    if (step === 1) {
      if (!name || !govIdFront || !govIdBack || !nationalIdNumber) {
        toast.error(t('dashboard.verification.provideBothIds'));
        return;
      }
      if (nationalIdNumber.length !== 12) {
        toast.error(t('dashboard.verification.invalidIdLength'));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!govIdSelfie) {
        toast.error(t('dashboard.verification.captureSelfie'));
        return;
      }
      setStep(3);
      handleRequestOTP();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      toast.error(t('dashboard.verification.invalidOtp'));
      return;
    }

    setIsLoading(true);
    try {
      await onVerify({
        govIdFront,
        govIdBack,
        govIdSelfie,
        name,
        nationalIdNumber,
        otpCode
      });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || t('dashboard.verification.verificationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-2xl relative my-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 mb-3">
            {step === 1 && <ShieldCheck size={24} />}
            {step === 2 && <Camera size={24} />}
            {step === 3 && <Smartphone size={24} />}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
            {step === 1 && t('dashboard.verification.title')}
            {step === 2 && t('dashboard.verification.selfieTitle')}
            {step === 3 && t('dashboard.verification.enterOtp')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {step === 1 && "Step 1: Document Upload"}
            {step === 2 && t('dashboard.verification.selfieDesc')}
            {step === 3 && t('dashboard.verification.emailOtpSent')}
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />

        {/* Camera Overlay */}
        <AnimatePresence>
          {isCameraActive && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4"
            >
              <div className="relative w-full max-w-md aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)]">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                {/* Viewfinder Scopes */}
                <div className="absolute inset-0 pointer-events-none">
                  {cameraType === 'selfie' ? (
                    <div className="absolute inset-[15%] border-[3px] border-white/40 rounded-full border-dashed animate-pulse" />
                  ) : (
                    <div className="absolute inset-[10%] border-[2px] border-white/30 rounded-2xl">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />
                    </div>
                  )}
                </div>

                {/* Floating Switch Camera Button */}
                {cameraType !== 'selfie' && (
                  <button
                    onClick={toggleCamera}
                    className="absolute top-4 right-4 p-3 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all active:scale-90"
                  >
                    <RefreshCw size={24} />
                  </button>
                )}
              </div>

              <div className="mt-12 flex items-center gap-6">
                <button
                  onClick={() => setIsCameraActive(false)}
                  className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <X size={24} />
                </button>
                <button
                  onClick={captureImage}
                  className="w-20 h-20 rounded-full bg-white border-8 border-blue-500/30 flex items-center justify-center hover:scale-105 transition-all shadow-xl active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600" />
                </button>
                <div className="w-14" /> {/* Spacer */}
              </div>
              <p className="text-white/60 text-xs mt-6 font-medium uppercase tracking-widest">
                {cameraType === 'selfie' ? "Position your face in the circle" : "Align document within the frame"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multi-Step Forms */}
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('dashboard.verification.fullName')}</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500/50 rounded-2xl p-4 text-gray-900 dark:text-white transition-all outline-none"
                  placeholder="Enter your legal name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{t('dashboard.verification.nationalIdNumber')}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={nationalIdNumber}
                    onChange={e => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 12) {
                        setNationalIdNumber(value);
                      }
                    }}
                    maxLength="12"
                    className={`w-full bg-gray-50 dark:bg-gray-800/50 border-2 ${nationalIdNumber.length === 12
                      ? 'border-green-500'
                      : nationalIdNumber.length > 0
                        ? 'border-yellow-500'
                        : 'border-transparent'
                      } focus:border-blue-500 rounded-2xl p-4 pr-12 text-gray-900 dark:text-white transition-all outline-none font-mono tracking-wider`}
                    placeholder="123456789012"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold">
                    <span className={nationalIdNumber.length === 12 ? 'text-green-600' : 'text-gray-400'}>
                      {nationalIdNumber.length}/12
                    </span>
                  </div>
                </div>
                {nationalIdNumber.length > 0 && nationalIdNumber.length < 12 && (
                  <p className="text-xs text-yellow-600 ml-1">⚠️ Must be exactly 12 digits</p>
                )}
                {nationalIdNumber.length === 12 && (
                  <p className="text-xs text-green-600 ml-1">✓ Valid format</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Front ID Card */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => { setCameraType('id_front'); setIsCameraActive(true); }}
                    className={`group relative w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${govIdFront ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50'}`}
                  >
                    {govIdFront ? (
                      <>
                        <img src={URL.createObjectURL(govIdFront)} alt="Front" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <CheckCircle className="text-green-600 relative z-10 drop-shadow-md" size={32} />
                        <span className="relative z-10 text-[10px] font-bold text-green-700 uppercase mt-1">Front Captured</span>
                      </>
                    ) : (
                      <>
                        <Camera className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2" size={28} />
                        <span className="text-xs font-bold text-gray-500 uppercase">Capture Front</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setCameraType('id_front'); fileInputRef.current.click(); }}
                    className="w-full text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 hover:underline"
                  >
                    <Upload size={10} /> {t('dashboard.verification.uploadFile')}
                  </button>
                </div>

                {/* Back ID Card */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => { setCameraType('id_back'); setIsCameraActive(true); }}
                    className={`group relative w-full h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${govIdBack ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50'}`}
                  >
                    {govIdBack ? (
                      <>
                        <img src={URL.createObjectURL(govIdBack)} alt="Back" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                        <CheckCircle className="text-green-600 relative z-10 drop-shadow-md" size={32} />
                        <span className="relative z-10 text-[10px] font-bold text-green-700 uppercase mt-1">Back Captured</span>
                      </>
                    ) : (
                      <>
                        <Camera className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2" size={28} />
                        <span className="text-xs font-bold text-gray-500 uppercase">Capture Back</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setCameraType('id_back'); fileInputRef.current.click(); }}
                    className="w-full text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 hover:underline"
                  >
                    <Upload size={10} /> {t('dashboard.verification.uploadFile')}
                  </button>
                </div>
              </div>
              <Button onClick={nextStep} className="w-full py-5 rounded-[1.25rem] text-lg font-black shadow-lg shadow-blue-500/20 active:scale-[0.98]">
                {t('common.next')}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 py-4">
              <div className="relative group w-52 h-52 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 border-dashed animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-2 rounded-full border-4 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  {govIdSelfie ? (
                    <img src={URL.createObjectURL(govIdSelfie)} alt="Selfie" className="w-full h-full object-cover scale-110" />
                  ) : (
                    <Camera size={64} className="text-gray-200 dark:text-gray-700" />
                  )}
                </div>
                {govIdSelfie && (
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white border-4 border-white dark:border-gray-900 shadow-lg">
                    <CheckCircle size={24} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setCameraType('selfie'); setIsCameraActive(true); }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-all font-bold"
                >
                  <Camera size={24} className="mb-1" />
                  <span className="text-xs">{govIdSelfie ? "Retake" : "Open Camera"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setCameraType('selfie'); fileInputRef.current.click(); }}
                  className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 transition-all font-bold"
                >
                  <Upload size={24} className="mb-1" />
                  <span className="text-xs">Gallery</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1 py-4 text-gray-500 font-bold">{t('common.back')}</Button>
                <Button onClick={nextStep} className="flex-[2] py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all">Verify & Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 py-2">
              <div className="text-center group">
                <div className="relative inline-block w-full max-w-[240px]">
                  <input
                    type="text" maxLength="6" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                    className="w-full text-center text-3xl sm:text-4xl font-black tracking-[0.5em] bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 rounded-2xl py-5 text-gray-900 dark:text-white outline-none transition-all"
                    placeholder="000000"
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-900/20">
                <p className="text-center text-[11px] text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {t('dashboard.verification.emailOtpSent')}
                  <br />
                  <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block tracking-wider">{maskEmail(userEmail)}</span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || otpCode.length < 6}
                  className="w-full py-4 rounded-2xl text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? "..." : t('dashboard.verification.confirmOtp')}
                </Button>

                <button
                  onClick={handleRequestOTP}
                  disabled={isSendingCode}
                  className="text-[11px] font-bold text-gray-400 hover:text-blue-500 flex items-center justify-center gap-1 uppercase tracking-widest disabled:opacity-50"
                >
                  <Send size={12} /> {isSendingCode ? "Sending..." : "Resend Code"}
                </button>
              </div>

              <button onClick={() => setStep(2)} className="w-full text-[10px] font-bold text-gray-400 hover:text-blue-500 transition-colors uppercase tracking-widest">
                {t('common.back')} to selfie
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationModal;
