import React from 'react';

const Title = ({
  children,
  subtitle,
  align = 'left',
  size = 'lg',
  className = '',
}) => {
  const aligns = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const sizes = {
    sm: 'text-lg md:text-xl font-semibold',
    md: 'text-xl md:text-2xl font-bold',
    lg: 'text-2xl md:text-4xl font-extrabold tracking-tight',
  };

  return (
    <div className={`flex flex-col gap-1.5 ${aligns[align]} ${className}`}>
      <h1 className={`text-slate-900 ${sizes[size]} relative inline-block`}>
        {children}
        <span className={`absolute bottom-[-6px] left-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300 w-12 ${align === 'center' ? 'left-1/2 transform -translate-x-1/2' : ''}`} />
      </h1>
      {subtitle && (
        <p className="text-sm text-slate-500 mt-2 max-w-2xl font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Title;
