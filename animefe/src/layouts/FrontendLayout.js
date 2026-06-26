import React from 'react';
import Header from '../components/frontend/Header';
import Footer from '../components/frontend/Footer';

const FrontendLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-purple-500/30 selection:text-purple-900">
      {/* Top Navbar */}
      <Header />

      {/* Viewport content */}
      <main className="flex-1">
        {children}
      </main>

      {/* bottom layout footer */}
      <Footer />
    </div>
  );
};

export default FrontendLayout;
