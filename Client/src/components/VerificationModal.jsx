// src/components/VerificationModal.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from './Button';
import { Camera } from 'lucide-react';

const VerificationModal = ({ isOpen, onClose, onVerify, verificationStatus }) => {
  const [govIdFront, setGovIdFront] = useState(null);
  const [govIdBack, setGovIdBack] = useState(null);
  const [name, setName] = useState('');
  const [isFrontCameraActive, setIsFrontCameraActive] = useState(false);
  const [isBackCameraActive, setIsBackCameraActive] = useState(false);
  const videoFrontRef = useRef(null);
  const canvasFrontRef = useRef(null);
  const videoBackRef = useRef(null);
  const canvasBackRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Camera for front
  useEffect(() => {
    let stream;
    if (isFrontCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => { stream = s; if (videoFrontRef.current) videoFrontRef.current.srcObject = stream; })
        .catch(() => toast.error('Failed to access camera'));
    }
    return () => stream && stream.getTracks().forEach((t) => t.stop());
  }, [isFrontCameraActive]);

  // Camera for back
  useEffect(() => {
    let stream;
    if (isBackCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => { stream = s; if (videoBackRef.current) videoBackRef.current.srcObject = stream; })
        .catch(() => toast.error('Failed to access camera'));
    }
    return () => stream && stream.getTracks().forEach((t) => t.stop());
  }, [isBackCameraActive]);

  // Convert DataURL to File
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // Capture Front ID
  const captureFrontImage = () => {
    if (videoFrontRef.current && canvasFrontRef.current) {
      const ctx = canvasFrontRef.current.getContext('2d');
      ctx.drawImage(videoFrontRef.current, 0, 0, 300, 200);
      const imageData = canvasFrontRef.current.toDataURL('image/jpeg');
      setGovIdFront(dataURLtoFile(imageData, 'id_front.jpg'));
      setIsFrontCameraActive(false);
      toast.success('Front ID captured');
    }
  };

  // Capture Back ID
  const captureBackImage = () => {
    if (videoBackRef.current && canvasBackRef.current) {
      const ctx = canvasBackRef.current.getContext('2d');
      ctx.drawImage(videoBackRef.current, 0, 0, 300, 200);
      const imageData = canvasBackRef.current.toDataURL('image/jpeg');
      setGovIdBack(dataURLtoFile(imageData, 'id_back.jpg'));
      setIsBackCameraActive(false);
      toast.success('Back ID captured');
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!govIdFront || !govIdBack || !name) {
      toast.error('Please provide name and both ID images');
      return;
    }
    setIsLoading(true);
    try {
      await onVerify({ govIdFront, govIdBack, name });
      toast.success('Verification submitted, pending review');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="bg-white dark:bg-gray-900 rounded-2xl p-4 w-full max-w-sm shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Verify Your Account
        </h2>

        {verificationStatus === 'pending' && (
          <p className="text-yellow-600 dark:text-yellow-400 mb-4 font-medium text-center bg-yellow-100 dark:bg-yellow-900/40 rounded-lg p-2">
            Verification pending...
          </p>
        )}
        {verificationStatus === 'verified' && (
          <p className="text-green-600 dark:text-green-400 mb-4 font-medium text-center bg-green-100 dark:bg-green-900/40 rounded-lg p-2">
            Verified successfully!
          </p>
        )}

        {verificationStatus !== 'verified' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 px-3 py-2 focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* National ID (Front) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                National ID (Front)
              </label>
              {isFrontCameraActive ? (
                <div className="space-y-2">
                  <video ref={videoFrontRef} autoPlay className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-xl object-cover" />
                  <canvas ref={canvasFrontRef} width="300" height="200" className="hidden" />
                  <Button onClick={captureFrontImage} className="w-full" disabled={isLoading}>
                    <Camera className="h-4 w-4 mr-1" /> Capture Front
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGovIdFront(e.target.files[0])}
                    className="w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-2 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => setIsFrontCameraActive(true)}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-1"
                    disabled={isLoading}
                  >
                    <Camera className="h-4 w-4" /> <span>Scan with Camera</span>
                  </Button>
                </div>
              )}
            </div>

            {/* National ID (Back) */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                National ID (Back)
              </label>
              {isBackCameraActive ? (
                <div className="space-y-2">
                  <video ref={videoBackRef} autoPlay className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-xl object-cover" />
                  <canvas ref={canvasBackRef} width="300" height="200" className="hidden" />
                  <Button onClick={captureBackImage} className="w-full" disabled={isLoading}>
                    <Camera className="h-4 w-4 mr-1" /> Capture Back
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGovIdBack(e.target.files[0])}
                    className="w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-2 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => setIsBackCameraActive(true)}
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-1"
                    disabled={isLoading}
                  >
                    <Camera className="h-4 w-4" /> <span>Scan with Camera</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Submitting...' : 'Submit Verification'}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default VerificationModal;
