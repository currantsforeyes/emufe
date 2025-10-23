/// <reference types="react" />
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  backgroundUrl?: string | null;
}

const Layout: React.FC<LayoutProps> = ({ children, backgroundUrl }) => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
       {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{
          backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
          opacity: backgroundUrl ? 1 : 0,
        }}
      >
         <div 
            className="absolute inset-0"
            style={{ animation: 'kenburns 40s ease-in-out infinite alternate' }}
         />
      </div>

      {/* Darkening and Blur Overlay */}
      <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm" />

      {/* The main application content */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
      
      {/* Vignette overlay for atmospheric effect */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 12rem rgba(0,0,0,0.7)',
        }}
      ></div>
    </div>
  );
};

export default Layout;
