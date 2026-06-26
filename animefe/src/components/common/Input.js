import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  iconLeft,
  iconRight,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-bold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="absolute left-3.5 text-slate-500 select-none pointer-events-none">
            {iconLeft}
          </span>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={`
            w-full bg-white border border-slate-300 text-slate-900 rounded-lg text-sm transition-all duration-300
            placeholder:text-slate-400 shadow-sm
            ${iconLeft ? 'pl-10' : 'pl-4'}
            ${iconRight ? 'pr-10' : 'pr-4'}
            py-2.5
            ${error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none'
            }
            ${className}
          `}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3.5 text-slate-500 select-none">
            {iconRight}
          </span>
        )}
      </div>
      {error && (
        <span className="text-xs text-rose-500 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
