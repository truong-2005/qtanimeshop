import React from 'react';

const DashboardCard = ({
  title,
  value,
  percentage,
  isIncrease = true,
  variant = 'blue',
  sparklineData = [10, 15, 8, 12, 18, 14, 20],
}) => {
  const gradients = {
    purple: 'from-[#6366F1] to-[#8B5CF6] text-white shadow-indigo-500/10',
    blue: 'from-[#3B82F6] to-[#06B6D4] text-white shadow-blue-500/10',
    orange: 'from-[#F59E0B] to-[#F97316] text-white shadow-amber-500/10',
    red: 'from-[#EF4444] to-[#F43F5E] text-white shadow-red-500/10',
  };

  // Function to draw an SVG sparkline path
  const getSparklinePath = (data) => {
    if (!data || data.length < 2) return '';
    const width = 140;
    const height = 32;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min === 0 ? 1 : max - min;

    return data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - 2 - ((val - min) / range) * (height - 4);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  return (
    <div
      className={`
        relative rounded-xl p-5 overflow-hidden shadow-lg bg-gradient-to-br transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        ${gradients[variant] || gradients.blue}
      `}
    >
      {/* Background visual curve */}
      <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none select-none">
        <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
          <path
            d="M0 80C30 50 60 70 90 30C105 10 115 5 120 0V80H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Card Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider opacity-85">
          {title}
        </span>
        
        {/* Dropdown/Options trigger icon */}
        <button className="text-white/75 hover:text-white transition-colors" aria-label="Card Options">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>

      {/* Card Body */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
          {value}
        </span>
        <span className="text-xs font-bold flex items-center gap-0.5 opacity-90">
          {percentage}
          {isIncrease ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          )}
        </span>
      </div>

      {/* Card Footer with Sparkline */}
      <div className="flex items-end justify-between mt-2">
        <div className="w-36 h-8">
          <svg width="100%" height="100%" viewBox="0 0 140 32" className="overflow-visible">
            <path
              d={getSparklinePath(sparklineData)}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
