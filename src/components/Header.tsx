/// <reference types="react" />
import React from 'react';
import { CogIcon } from './icons';

interface HeaderProps {
    onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="absolute top-0 left-0 right-0 p-4 z-30 flex justify-between items-center">
      {/* Spacer to center the title */}
      <div className="w-16 h-16" />

      <div className="w-full max-w-sm">
        <div 
            className="bg-black/20 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
        >
            <h1 className="text-4xl font-display text-white text-center py-2">
                EmuFE
            </h1>
        </div>
      </div>
      
      <div className="w-16 h-16 flex items-center justify-center">
        <button 
            onClick={onOpenSettings} 
            className="bg-black/20 backdrop-blur-md rounded-full p-3 border border-white/10 shadow-lg hover:bg-brand-primary transition-colors text-white"
            aria-label="Open Settings"
        >
            <CogIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
