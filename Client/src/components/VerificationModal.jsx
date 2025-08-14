// Verification Modal with Camera Scanning for Both Front and Back
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const VerificationModal = ({ isOpen, onClose, verificationStatus, setVerificationStatus }) => {
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

  // FRONT camera lifecycle
  useEffect(() => {
    let stream;
    if (isFrontCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoFrontRef.current) videoFrontRef.current.srcObject = stream;
        })
        .catch(() => toast.error('Failed to access camera'));
    }
    return () => stream && stream.getTracks().forEach((t) => t.stop());
  }, [isFrontCameraActive]);

  // BACK camera lifecycle
  useEffect(() => {
    let stream;
    if (isBackCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((s) => {
          stream = s;
          if (videoBackRef.current) videoBackRef.current.srcObject = stream;
        })
        .catch(() => toast.error('Failed to access camera'));
    }
    return () => stream && stream.getTracks().forEach((t) => t.stop());
  }, [isBackCameraActive]);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!govIdFront || !govIdBack || !name) {
      toast.error('Please provide name and both ID images');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('govIdFront', govIdFront);
      formData.append('govIdBack', govIdBack);
      formData.append('name', name);

      const token = localStorage.getItem('token'); // ✅ auth token

      await axios.post('/verify-id', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setVerificationStatus('pending');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-gradient-to-r from-gray-950 to-blue-950 rounded-xl p-6 w-full max-w-md shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-200 mb-4">Verify Your Account</h2>

        {verificationStatus === 'pending' && <p className="text-yellow-600 mb-4 font-medium">Verification pending...</p>}
        {verificationStatus === 'verified' && <p className="text-green-600 mb-4 font-medium">Verified successfully!</p>}

        {verificationStatus !== 'verified' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-200">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* FRONT ID */}
            <div>
              <label className="block text-sm font-medium text-gray-200">National ID (Front)</label>
              {isFrontCameraActive ? (
                <>
                  <video ref={videoFrontRef} autoPlay className="w-full h-48 bg-gray-100 rounded-md" />
                  <canvas ref={canvasFrontRef} width="300" height="200" className="hidden" />
                  <Button onClick={captureFrontImage} className="mt-2" disabled={isLoading}>
                    Capture Front
                  </Button>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGovIdFront(e.target.files[0])}
                    className="mt-1 w-full text-gray-600"
                    disabled={isLoading}
                  />
                  <Button onClick={() => setIsFrontCameraActive(true)} className="mt-2 flex items-center space-x-2" disabled={isLoading}>
                    <Camera className="h-4 w-4" />
                    <span>Scan with Camera</span>
                  </Button>
                </>
              )}
            </div>

            {/* BACK ID */}
            <div>
              <label className="block text-sm font-medium text-gray-200">National ID (Back)</label>
              {isBackCameraActive ? (
                <>
                  <video ref={videoBackRef} autoPlay className="w-full h-48 bg-gray-100 rounded-md" />
                  <canvas ref={canvasBackRef} width="300" height="200" className="hidden" />
                  <Button onClick={captureBackImage} className="mt-2" disabled={isLoading}>
                    Capture Back
                  </Button>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGovIdBack(e.target.files[0])}
                    className="mt-1 w-full text-gray-600"
                    required
                    disabled={isLoading}
                  />
                  <Button onClick={() => setIsBackCameraActive(true)} className="mt-2 flex items-center space-x-2" disabled={isLoading}>
                    <Camera className="h-4 w-4" />
                    <span>Scan with Camera</span>
                  </Button>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? 'Submitting...' : 'Submit'}</Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default VerificationModal;
