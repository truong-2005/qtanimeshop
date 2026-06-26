import React, { useState } from 'react';
import AdminSidebar from '../components/backend/AdminSidebar';
import AdminHeader from '../components/backend/AdminHeader';

const BackendLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Admin Sidebar */}
      <AdminSidebar isCollapsed={isSidebarCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Admin Header */}
        <AdminHeader onToggleSidebar={toggleSidebar} />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default BackendLayout;
