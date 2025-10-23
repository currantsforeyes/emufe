/// <reference types="react" />
import React, { useState } from 'react';
import type { System } from '../types';
import { SpinnerIcon } from './icons';
import Modal from './Modal';

interface AddGameModalProps {
  systems: System[];
  onClose: () => void;
  onAddGame: (title: string, systemId: string) => Promise<void>;
}

const AddGameModal: React.FC<AddGameModalProps> = ({ systems, onClose, onAddGame }) => {
  const [title, setTitle] = useState('');
  const [systemId, setSystemId] = useState(systems.length > 0 ? systems[0].id : '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !systemId) {
      setError('Please provide a title and select a system.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onAddGame(title, systemId);
      onClose();
    } catch (err) {
      setError('Failed to add game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Add a New Game" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="gameTitle" className="block text-brand-text-muted mb-2">Game Title</label>
          <input
            id="gameTitle"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-base bg-brand-bg border-2 border-brand-primary/50 rounded-lg p-2 text-white focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
            placeholder="e.g., Chrono Trigger"
            required
            autoFocus
          />
        </div>
        <div className="mb-6">
          <label htmlFor="system" className="block text-brand-text-muted mb-2">System</label>
          <select
            id="system"
            value={systemId}
            onChange={(e) => setSystemId(e.target.value)}
            className="w-full text-base bg-brand-bg border-2 border-brand-primary/50 rounded-lg p-2 text-white focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
            required
          >
            {systems.map(system => (
              <option key={system.id} value={system.id}>{system.name}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-brand-primary text-white hover:bg-brand-secondary transition-colors flex items-center gap-2 disabled:bg-gray-600">
            {isLoading && <SpinnerIcon />}
            {isLoading ? 'Adding...' : 'Add Game'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddGameModal;
