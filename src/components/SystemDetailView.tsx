/// <reference types="react" />
import React from 'react';
import type { System } from '../types';

interface SystemDetailViewProps {
  system: System | null;
}

const SystemDetailView: React.FC<SystemDetailViewProps> = ({ system }) => {
  if (!system) {
    return (
      <div className="flex-grow flex items-center justify-center text-brand-text-muted">
        <p>No system selected.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
      <div 
        className="relative animate-slide-in-fade"
        style={{ animationDelay: '100ms'}}
      >
        <img 
          src={system.consoleImageUrl} 
          alt={`${system.name} console`} 
          className="max-w-xl max-h-[40vh] object-contain drop-shadow-2xl"
        />
        {/* Reflection */}
        <div 
          className="absolute left-0 right-0 bottom-0 h-1/2"
          style={{
            background: `linear-gradient(to top, rgba(13, 13, 26, 0.8), transparent)`,
            maskImage: `linear-gradient(to top, black 30%, transparent)`,
            transform: 'scaleY(-1) translateY(100%)',
            filter: 'blur(2px)',
          }}
        >
           <img 
            src={system.consoleImageUrl} 
            alt="" 
            className="max-w-xl max-h-[40vh] object-contain opacity-40"
          />
        </div>
      </div>
      <h2 
        className="text-6xl font-display text-white mt-8 animate-slide-in-fade"
        style={{ animationDelay: '200ms'}}
      >
        {system.name}
      </h2>
      <p 
        className="text-2xl text-brand-accent mt-6 font-display animate-pulse-glow"
        style={{ animationDelay: '300ms'}}
      >
          Press Enter to browse games
      </p>
    </div>
  );
};

export default SystemDetailView;
