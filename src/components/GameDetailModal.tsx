/// <reference types="react" />
import React from 'react';
import type { Game, System } from '../types';
import Modal from './Modal';

interface GameDetailModalProps {
  game: Game;
  system: System | undefined;
  onClose: () => void;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({ game, system, onClose }) => {
  return (
    <Modal title={game.title} onClose={onClose}>
      <div className="flex flex-col md:flex-row gap-6">
        <img src={game.boxArtUrl} alt={`${game.title} box art`} className="w-full md:w-1/3 object-contain rounded-lg" />
        <div className="flex flex-col">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-brand-text-muted mb-4">
            <span>{system?.name}</span>
            <span>&bull;</span>
            <span>{game.releaseDate}</span>
            <span>&bull;</span>
            <span>{game.genre}</span>
          </div>
          <p className="text-lg text-brand-text leading-relaxed">
            {game.description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default GameDetailModal;
