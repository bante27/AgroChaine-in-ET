import React from 'react';

const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/90">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
        )}
        <input
          className={`w-full bg-white/10 border border-white/20 rounded-xl ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-all duration-200 ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
    </div>
  );
};

export default Input;