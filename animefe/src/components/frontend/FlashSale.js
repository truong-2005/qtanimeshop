import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

const FlashSale = ({ products = [], endDateString = '' }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = endDateString ? new Date(endDateString) : new Date(Date.now() + 24 * 3600 * 1000);

    const timer = setInterval(() => {
      const difference = targetDate - new Date();
      
      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDateString]);

  const saleProducts = products.slice(0, 4);

  if (saleProducts.length === 0) return null;

  const padZero = (num) => String(num).padStart(2, '0');

  return (
    <div className="bg-[#110e2d]/60 border border-purple-900/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden select-none">
      {/* Background Glow */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full filter blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            Chớp nhoáng <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Flash Sale</span>
          </h2>
        </div>

        {/* Countdown timer */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Kết thúc sau</span>
          <div className="flex items-center gap-1 text-sm font-black text-white">
            <span className="px-2.5 py-1.5 bg-purple-950/80 border border-purple-800/40 rounded-lg shadow min-w-10 text-center">
              {padZero(timeLeft.hours)}
            </span>
            <span className="text-purple-400 animate-pulse">:</span>
            <span className="px-2.5 py-1.5 bg-purple-950/80 border border-purple-800/40 rounded-lg shadow min-w-10 text-center">
              {padZero(timeLeft.minutes)}
            </span>
            <span className="text-purple-400 animate-pulse">:</span>
            <span className="px-2.5 py-1.5 bg-purple-950/80 border border-purple-800/40 rounded-lg shadow min-w-10 text-center">
              {padZero(timeLeft.seconds)}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of discounted items */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {saleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
