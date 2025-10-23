/// <reference types="react" />
import React from 'react';
import type { Game } from '../types';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  isSelected: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect, isSelected }) => {
  const cardRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (isSelected) {
      cardRef.current?.focus();
    }
  }, [isSelected]);
  
  return (
    <button
      ref={cardRef}
      onClick={() => onSelect(game)}
      className={`relative aspect-[2/3] w-full rounded-lg overflow-hidden transition-all duration-300 ease-in-out focus:outline-none 
                  ${isSelected ? 'transform scale-105 ring-4 ring-brand-accent ring-offset-4 ring-offset-brand-bg shadow-neon-accent' : 'hover:scale-105'}`}
      aria-label={`Select game ${game.title}`}
      aria-pressed={isSelected}
    >
      <img src={game.boxArtUrl} alt={`${game.title} box art`} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <h3 className="absolute bottom-2 left-3 right-3 text-white font-bold text-lg leading-tight text-shadow">
        {game.title}
      </h3>
    </button>
  );
};

export default GameCard;
