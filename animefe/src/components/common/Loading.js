import React from 'react';

const Loading = ({
  fullScreen = false,
  size = 'md',
  color = 'indigo',
  text = 'Đang tải...',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-16 h-16 border-4',
  };

  const colorClasses = {
    indigo: 'border-indigo-500/20 border-t-indigo-500',
    purple: 'border-purple-500/20 border-t-purple-500',
    pink: 'border-pink-500/20 border-t-pink-500',
    emerald: 'border-emerald-500/20 border-t-emerald-500',
  };

  const containerStyles = fullScreen
    ? 'fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-4'
    : 'flex flex-col items-center justify-center p-6 gap-3';

  return (
    <div className={containerStyles}>
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className={`absolute rounded-full filter blur-md animate-pulse ${
          color === 'indigo' ? 'bg-indigo-500/30' :
          color === 'purple' ? 'bg-purple-500/30' :
          color === 'pink' ? 'bg-pink-500/30' : 'bg-emerald-500/30'
        } ${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-14 h-14' : 'w-20 h-20'}`} />
        
        {/* Spinner */}
        <div
          className={`
            animate-spin rounded-full border-t-solid
            ${sizeClasses[size]}
            ${colorClasses[color] || colorClasses.indigo}
          `}
        />
      </div>
      {text && (
        <span className="text-sm font-medium tracking-wide text-slate-400 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loading;
