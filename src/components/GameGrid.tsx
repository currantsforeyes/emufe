/// <reference types="react" />
import React from 'react';
import type { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  onAddGame: () => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onSelectGame, onAddGame }) => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  // Reset active index when games list changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [games]);

  const getGridDimensions = () => {
    const containerWidth = gridRef.current?.clientWidth || 0;
    // Estimate card width including gap for column calculation
    const cardWidth = 180;
    return Math.max(1, Math.floor(containerWidth / cardWidth));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = games.length + 1; // +1 for the add button
    if (totalItems === 0) return;
    
    const cols = getGridDimensions();
    let nextIndex = activeIndex;

    switch (e.key) {
      case 'ArrowRight':
        nextIndex = Math.min(totalItems - 1, activeIndex + 1);
        break;
      case 'ArrowLeft':
        nextIndex = Math.max(0, activeIndex - 1);
        break;
      case 'ArrowDown':
        nextIndex = Math.min(totalItems - 1, activeIndex + cols);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(0, activeIndex - cols);
        break;
      case 'Enter':
        if (activeIndex < games.length && games[activeIndex]) {
          onSelectGame(games[activeIndex]);
        } else if (activeIndex === games.length) {
          onAddGame();
        }
        break;
      default:
        return;
    }
    
    e.preventDefault();
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
  };

  return (
    <div className="animate-fade-in p-6 h-full">
      <div
        ref={gridRef}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 focus:outline-none"
        role="grid"
        aria-label="Game selection grid"
      >
        {games.map((game, index) => (
          <div key={game.id} role="gridcell">
            <GameCard
              game={game}
              onSelect={onSelectGame}
              isSelected={index === activeIndex}
            />
          </div>
        ))}
        <div role="gridcell" className="flex items-center justify-center">
            <button
                ref={el => { if (activeIndex === games.length) el?.focus(); }}
                onClick={onAddGame}
                className={`relative aspect-[2/3] w-full rounded-lg border-4 border-dashed border-brand-primary/50 text-brand-text-muted hover:border-brand-accent hover:text-brand-accent transition-all duration-300 flex flex-col items-center justify-center focus:outline-none ${
                    activeIndex === games.length ? 'transform scale-105 ring-4 ring-brand-accent ring-offset-4 ring-offset-brand-bg' : ''
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span className="font-bold mt-2">Add Game</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default GameGrid;
