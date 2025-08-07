import React from 'react';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom'; // Essential for internal navigation

const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  className = '',
  href, // This prop makes the button a navigation link
  ...props
}) => {
  // Base classes with 'shadow-md' for a modern look
  const baseClasses = 'font-semibold rounded-lg shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
    // Note: Used 'border-1 border-emerald-400' as in your second code snippet
    secondary: 'bg-white hover:bg-gray-50 text-emerald-600 border-1 border-emerald-400 focus:ring-emerald-400',
    outline: 'bg-transparent hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    default: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  const isDisabled = disabled || loading;

  const combinedClasses = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'}
    ${className}
  `;

  // --- CRITICAL LOGIC: Conditionally render a Link or a Button ---
  if (href) {
    // If 'href' is provided, render a react-router-dom Link (which becomes an <a> tag)
    return (
      <Link
        to={href} // 'to' prop is used for internal routing paths
        className={combinedClasses}
        {...props} // Pass any other props like onClick, target="_blank", etc.
      >
        {loading && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {children}
      </Link>
    );
  }

  // If no 'href' is provided, render a standard <button> element
  return (
    <button
      className={combinedClasses}
      disabled={isDisabled}
      {...props} // Pass any other props like onClick, type="submit", etc.
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;