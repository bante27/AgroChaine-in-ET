// src/components/ProfileImageUploadModal.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from './Button';
import { Camera, User } from 'lucide-react';

const ProfileImageUploadModal = ({ isOpen, onClose, onImageSave }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      toast.success('Image selected');
    }
  };

  const handleSave = async () => {
    if (profileImage) {
      setIsLoading(true);
      try {
        await onImageSave(profileImage);
        toast.success('Profile image updated');
        onClose();
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to update profile image');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please select an image');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.4, type: 'spring' }}
        className="relative bg-gradient-to-br from-white to-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 w-full max-w-xs sm:max-w-md shadow-2xl border border-gray-200"
      >
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Update Profile Picture</h2>
        <div className="flex flex-col items-center space-y-1">
          <div className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-full overflow-hidden border-2 sm:border-4 border-gray-200 group shadow-lg">
            {profileImage ? (
              <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                <User className="w-16 sm:w-20 h-16 sm:h-20" />
              </div>
            )}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <Camera className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-center">Click the camera icon to upload an image.</p>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="mt-4 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !profileImage} className="flex-1">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileImageUploadModal;