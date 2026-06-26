import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0d0c1d] flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-purple-600/10 rounded-full filter blur-[100px] pointer-events-none" />
      
      {/* Container */}
      <div className="w-full max-w-md bg-[#0f0e24]/70 border border-purple-900/35 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-md z-10 relative">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
