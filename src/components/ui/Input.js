import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  icon,
  rightIcon,
  className = '',
  inputClassName = '',
  maxLength,
  showCharCount = false,
  ...props
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = `
    w-full px-4 py-3 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-400 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${icon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${inputClassName}
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400">{icon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={inputClasses}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <span className="text-slate-400">{rightIcon}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-start">
        {error ? (
          <p className="text-sm text-red-400 flex items-center space-x-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </p>
        ) : (
          <span></span>
        )}
        
        {showCharCount && maxLength && (
          <span className="text-xs text-slate-400">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

// Textarea variant
const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  showCharCount = false,
  className = '',
  ...props
}) => {
  const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const textareaClasses = `
    w-full px-4 py-3 bg-slate-800 border rounded-lg text-slate-100 placeholder-slate-400 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
    resize-vertical
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-600'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        {...props}
      />

      <div className="flex justify-between items-start">
        {error ? (
          <p className="text-sm text-red-400 flex items-center space-x-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </p>
        ) : (
          <span></span>
        )}
        
        {showCharCount && maxLength && (
          <span className="text-xs text-slate-400">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

Input.Textarea = Textarea;

export default Input;