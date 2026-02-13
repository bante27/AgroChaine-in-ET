// src/components/VerificationModal.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from './Button';
import { Camera, CheckCircle, ShieldCheck, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const VerificationModal = ({ isOpen, onClose, onVerify, verificationStatus }) => {
  const [step, setStep] = useState(1);
  const [govIdFront, setGovIdFront] = useState(null);
  const [govIdBack, setGovIdBack] = useState(null);
  const [govIdSelfie, setGovIdSelfie] = useState(null);
  const [name, setName] = useState('');
  const [nationalIdNumber, setNationalIdNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraType, setCameraType] = useState('front'); // front, back, selfie

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setGovIdFront(null);
      setGovIdBack(null);
      setGovIdSelfie(null);
      setOtpCode('');
    }
  }, [isOpen]);

  // Handle Camera Stream
  useEffect(() => {
    let stream;
    if (isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {
          toast.error(t('dashboard.verification.cameraAccessFailed'));
          setIsCameraActive(false);
        });
    }
    return () => stream && stream.getTracks().forEach((tk) => tk.stop());
  }, [isCameraActive, t]);

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
      ctx.drawImage(videoRef.current, 0, 0, 300, 200);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      const file = dataURLtoFile(imageData, `${cameraType}.jpg`);

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

      setIsCameraActive(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!name || !govIdFront || !govIdBack || !nationalIdNumber) {
        toast.error(t('dashboard.verification.provideBothIds'));
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!govIdSelfie) {
        toast.error(t('dashboard.verification.captureSelfie'));
        return;
      }
      setStep(3);
      toast.success(t('dashboard.verification.otpSent'));
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-4">
            {step === 1 && <ShieldCheck size={24} />}
            {step === 2 && <Camera size={24} />}
            {step === 3 && <Smartphone size={24} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 && t('dashboard.verification.title')}
            {step === 2 && t('dashboard.verification.selfieTitle')}
            {step === 3 && t('dashboard.verification.enterOtp')}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1 && "Step 1: Document Upload"}
            {step === 2 && t('dashboard.verification.selfieDesc')}
            {step === 3 && t('dashboard.verification.otpSent')}
          </p>
        </div>

        {/* Camera Overlay */}
        <AnimatePresence>
          {isCameraActive && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-4"
            >
              <div className="relative w-full max-w-sm aspect-[4/3] bg-gray-800 rounded-3xl overflow-hidden border-2 border-blue-500">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                {cameraType === 'selfie' && (
                  <div className="absolute inset-0 border-[40px] border-black/40 rounded-full scale-75 pointer-events-none border-dashed" />
                )}
              </div>
              <div className="mt-8 flex gap-4">
                <Button variant="danger" onClick={() => setIsCameraActive(false)}>Cancel</Button>
                <Button onClick={captureImage} className="px-10">Capture</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multi-Step Forms */}
        <div className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Full Name</label>
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl p-4 text-gray-900 dark:text-white"
                  placeholder="Enter your legal name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">{t('dashboard.verification.nationalIdNumber')}</label>
                <input
                  type="text" value={nationalIdNumber} onChange={e => setNationalIdNumber(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl p-4 text-gray-900 dark:text-white"
                  placeholder="12-digit Fayda Number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setCameraType('id_front'); setIsCameraActive(true); }}
                  className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${govIdFront ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}
                >
                  {govIdFront ? <CheckCircle className="text-green-500 mb-2" /> : <Camera className="text-gray-400 mb-2" />}
                  <span className="text-xs font-medium">{govIdFront ? "Front OK" : "ID Front"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setCameraType('id_back'); setIsCameraActive(true); }}
                  className={`h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${govIdBack ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'}`}
                >
                  {govIdBack ? <CheckCircle className="text-green-500 mb-2" /> : <Camera className="text-gray-400 mb-2" />}
                  <span className="text-xs font-medium">{govIdBack ? "Back OK" : "ID Back"}</span>
                </button>
              </div>
              <Button onClick={nextStep} className="w-full py-4 rounded-2xl text-lg font-bold">Next Step</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 text-center">
              <div className="relative w-48 h-48 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-blue-500 p-1">
                {govIdSelfie ? (
                  <img src={URL.createObjectURL(govIdSelfie)} alt="Selfie" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <Camera size={48} className="text-gray-300" />
                )}
              </div>
              <Button
                onClick={() => { setCameraType('selfie'); setIsCameraActive(true); }}
                variant="outline" className="w-full py-4 rounded-2xl border-2"
              >
                {govIdSelfie ? "Retake Selfie" : t('dashboard.verification.captureSelfie')}
              </Button>
              <div className="flex gap-4">
                <Button variant="ghost" onClick={() => setStep(1)} className="flex-1">Back</Button>
                <Button onClick={nextStep} className="flex-1 font-bold">Verify & Continue</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex justify-center gap-2">
                <input
                  type="text" maxLength="6" value={otpCode} onChange={e => setOtpCode(e.target.value)}
                  className="w-full max-w-xs text-center text-3xl font-black tracking-[1em] bg-gray-50 dark:bg-gray-800 border-0 rounded-2xl py-6"
                  placeholder="000000"
                />
              </div>
              <p className="text-center text-xs text-gray-500">
                We sent a code to your phone +251 •••• ••88
              </p>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {isLoading ? "Verifying..." : t('dashboard.verification.confirmOtp')}
              </Button>
              <Button variant="ghost" onClick={() => setStep(2)} className="w-full text-xs">Correction? Back to Selfie</Button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-8 w-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium transition-colors"
        >
          Cancel Verification
        </button>
      </motion.div>
    </div>
  );
};

export default VerificationModal;
