import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import Button from './common/Button';
//This modal is updated with a camera component and a better way to handle the file submissions.
const VerificationModal = ({ isOpen, onClose, onVerify, verificationStatus }) => {
  const webcamRef = useRef(null);
  const [nationalIdFront, setNationalIdFront] = useState(null);
  const [nationalIdBack, setNationalIdBack] = useState(null);
  const [name, setName] = useState('');
  const [captureMode, setCaptureMode] = useState(null); // 'front', 'back', or null

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (captureMode === 'front') {
      const byteString = atob(imageSrc.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new Blob([ab], { type: 'image/jpeg' });
      file.name = 'id_front.jpeg';
      setNationalIdFront(file);
    } else if (captureMode === 'back') {
      const byteString = atob(imageSrc.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const file = new Blob([ab], { type: 'image/jpeg' });
      file.name = 'id_back.jpeg';
      setNationalIdBack(file);
    }
    setCaptureMode(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nationalIdFront && nationalIdBack && name) {
      onVerify({ nationalIdFront, nationalIdBack, name });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Your Account</h2>
        {verificationStatus === 'pending' && <p className="text-yellow-600 mb-4 font-medium">Verification pending. Please wait for approval.</p>}
        {verificationStatus === 'verified' && <p className="text-emerald-600 mb-4 font-medium">Account verified successfully!</p>}
        {verificationStatus !== 'verified' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border-gray-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition"
                required
              />
            </div>
            {/* Camera/File Upload Section */}
            {captureMode ? (
              <div className="flex flex-col items-center">
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={320} height={240} className="rounded-lg shadow-md" />
                <Button onClick={captureImage} type="button" className="mt-4">
                  Capture {captureMode === 'front' ? 'Front' : 'Back'} Image
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">National ID (Front)</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button type="button" onClick={() => setCaptureMode('front')}>Scan with Camera</Button>
                    <input type="file" accept="image/*" onChange={(e) => setNationalIdFront(e.target.files[0])} className="w-full text-gray-600" required={!nationalIdFront} />
                  </div>
                  {nationalIdFront && <p className="text-sm text-green-600 mt-2">Front image selected.</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">National ID (Back)</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Button type="button" onClick={() => setCaptureMode('back')}>Scan with Camera</Button>
                    <input type="file" accept="image/*" onChange={(e) => setNationalIdBack(e.target.files[0])} className="w-full text-gray-600" required={!nationalIdBack} />
                  </div>
                  {nationalIdBack && <p className="text-sm text-green-600 mt-2">Back image selected.</p>}
                </div>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default VerificationModal;