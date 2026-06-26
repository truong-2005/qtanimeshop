import React, { forwardRef } from 'react';

const SelectBox = forwardRef(({
  label,
  options = [],
  error,
  placeholder = 'Chọn một tùy chọn',
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 11)}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-bold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          ref={ref}
          className={`
            w-full bg-white border border-slate-300 text-slate-900 px-4 py-2.5 rounded-lg text-sm appearance-none transition-all duration-300 shadow-sm
            ${error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
              : 'focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="absolute right-3.5 text-slate-500 select-none pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      {error && (
        <span className="text-xs text-rose-500 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

SelectBox.displayName = 'SelectBox';

export default SelectBox;
