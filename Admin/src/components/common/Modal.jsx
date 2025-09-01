import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'default',
  className = '' 
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        
        <div className={`relative w-full ${sizes[size]} bg-gradient-to-br from-gray-900 to-slate-800 rounded-2xl border border-white/20 shadow-2xl ${className}`}>
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-gray-600">{title}</h3>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;