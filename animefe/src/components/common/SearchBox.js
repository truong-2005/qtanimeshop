import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';

const SearchBox = ({
  placeholder = 'Tìm kiếm...',
  onSearch,
  initialValue = '',
  debounceTime = 500,
  className = '',
}) => {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, debounceTime);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className={`relative flex items-center w-full max-w-md ${className}`}>
      <span className="absolute left-3.5 text-slate-500 pointer-events-none select-none">
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full bg-slate-900 border border-slate-800 text-slate-100 pl-10 pr-10 py-2.5 rounded-lg text-sm
          placeholder:text-slate-500 transition-all duration-300
          focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
        "
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3.5 p-1 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBox;
