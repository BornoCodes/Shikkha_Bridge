import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BengaliArtBackground } from './BengaliArtBackground';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen text-matti flex flex-col font-sans relative selection:bg-terracotta selection:text-white">
      {/* Dynamic Animated Bengali Traditional Art Background */}
      <BengaliArtBackground />

      {/* Glassmorphic Navbar with Nakshi ribbon */}
      <Navbar />

      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
