// src/components/Button.jsx

const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 transform hover:scale-105 active:scale-95';
  const variants = {
    default: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-lg hover:shadow-xl',
    outline: 'bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 focus:ring-blue-500 shadow-md hover:shadow-lg',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-blue-800 focus:ring-green-500 shadow-lg hover:shadow-xl',
  };
  const sizes = {
    default: 'px-4 py-2 sm:px-6 sm:py-3 text-sm',
    small: 'px-3 py-1 sm:px-4 sm:py-2 text-xs',
    large: 'px-6 py-3 sm:px-8 sm:py-4 text-base',
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;