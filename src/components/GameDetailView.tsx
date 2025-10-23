/// <reference types="react" />
import React from 'react';
import type { Game } from '../types';

interface GameDetailViewProps {
  game: Game | null;
  onAddGame?: () => void;
}

const GameDetailView: React.FC<GameDetailViewProps> = ({ game, onAddGame }) => {
  if (!game) {
    return (
      <div className="flex-grow h-full flex items-center justify-center">
        <div className="text-center text-brand-text-muted animate-fade-in">
            <h2 className="text-4xl font-display text-white mb-4">No Games Found</h2>
            <p className="mb-6">This system doesn't have any games yet.</p>
            {onAddGame && (
                <button
                    onClick={onAddGame}
                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 text-xl rounded-full transition-all duration-300 shadow-lg hover:shadow-neon-purple"
                >
                    Add a Game
                </button>
            )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
        <div className="relative z-10 flex gap-12 items-center max-w-6xl w-full">
            {/* Box Art with Reflection */}
            <div className="flex-shrink-0 w-80 animate-slide-in-fade" style={{ animationDelay: '100ms' }}>
                 <div className="relative">
                    <img 
                        src={game.boxArtUrl} 
                        alt={`${game.title} box art`} 
                        className="w-full h-auto aspect-[3/4] rounded-lg shadow-2xl object-cover"
                    />
                    {/* Reflection */}
                    <div 
                        className="absolute left-0 right-0 bottom-0 h-1/2"
                        style={{
                            background: `linear-gradient(to top, rgba(13, 13, 26, 0.7), transparent)`,
                            maskImage: `linear-gradient(to top, black 20%, transparent)`,
                            transform: 'scaleY(-1) translateY(100%)',
                             filter: 'blur(1px)',
                        }}
                    >
                        <img 
                            src={game.boxArtUrl} 
                            alt="" 
                            className="w-full h-auto aspect-[3/4] object-cover opacity-30"
                        />
                    </div>
                 </div>
            </div>

            <div className="text-white flex-grow">
                <h2 className="text-6xl font-display mb-2 animate-slide-in-fade" style={{ animationDelay: '200ms' }}>{game.title}</h2>
                <div className="flex gap-4 text-brand-text-muted mb-4 text-lg animate-slide-in-fade" style={{ animationDelay: '300ms' }}>
                    <span>{game.releaseDate}</span>
                    <span>&bull;</span>
                    <span>{game.genre}</span>
                </div>
                <p className="text-xl text-brand-text leading-relaxed max-w-3xl h-48 overflow-y-auto pr-2 animate-slide-in-fade" style={{ animationDelay: '400ms' }}>
                    {game.description}
                </p>
            </div>
        </div>
    </div>
  );
};

export default GameDetailView;
