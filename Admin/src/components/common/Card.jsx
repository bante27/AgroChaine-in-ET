import React from 'react';

const Card = ({ children, className = '', gradient = false }) => {
  const baseClasses = gradient 
    ? 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl'
    : 'bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl';

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;