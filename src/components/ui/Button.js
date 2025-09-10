import React from 'react';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  disabled = false, 
  loading = false,
  icon,
  className = '',
  type = 'button',
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-lg hover:shadow-blue-500/25';
      case 'secondary':
        return 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600';
      case 'danger':
        return 'bg-red-600 hover:bg-red-500 text-white border-red-500 shadow-lg hover:shadow-red-500/25';
      case 'success':
        return 'bg-green-600 hover:bg-green-500 text-white border-green-500 shadow-lg hover:shadow-green-500/25';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-500 text-white border-yellow-500 shadow-lg hover:shadow-yellow-500/25';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-700 text-slate-300 border-slate-600 hover:border-slate-500';
      case 'outline':
        return 'bg-transparent hover:bg-blue-600 text-blue-400 hover:text-white border-blue-500';
      default:
        return 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'px-2 py-1 text-xs';
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'xl':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center space-x-2 font-medium rounded-lg border 
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:ring-offset-2 focus:ring-offset-slate-800
    ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const buttonClasses = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;