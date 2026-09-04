import React from 'react';

const Input = ({ 
  label, 
  icon: Icon, // This receives the component function (e.g., Search)
  error, 
  className = "", 
  ...props 
}) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {/* IMPORTANT: We check if Icon is a function/component. 
               If you pass <Search />, this needs to be {Icon}.
               If you pass Search, this needs to be <Icon size={18} />.
               The version below is the most flexible:
            */}
            {React.isValidElement(Icon) ? Icon : <Icon size={18} />}
          </div>
        )}
        <input
          className={`
            w-full rounded-xl border bg-white dark:bg-gray-900 px-4 py-2.5 text-sm
            transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error 
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : 'border-gray-200 dark:border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            }
            dark:text-white ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;