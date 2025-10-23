/// <reference types="react" />
import React, { useState, useRef } from 'react';
import type { System, Game } from '../types';
import { TrashIcon, SpinnerIcon, PencilIcon, CloseIcon } from './icons';

type ScrapeSource = 'ScreenScraper' | 'TheGamesDB';

interface SettingsDetailViewProps {
  activeSetting: string;
  systems: System[];
  games: Game[];
  onDeleteSystem: (systemId: string) => void;
  onDeleteGame: (gameId: number) => void;
  onUpdateLibrary: () => Promise<void>;
  isUpdatingLibrary: boolean;
  onScrape: (source: ScrapeSource) => void;
  isScraping: boolean;
  scrapingStatus: string;
  onUpdateGameBoxArt: (gameId: number, newUrl: string) => void;
  onScanForBoxArt: (files: FileList) => void;
  isScanningArt: boolean;
  scanStatus: string;
}

const GamesSettings: React.FC<Omit<SettingsDetailViewProps, 'activeSetting' | 'onScrape' | 'isScraping' | 'scrapingStatus'>> = ({
  systems,
  games,
  onDeleteSystem,
  onDeleteGame,
  onUpdateLibrary,
  isUpdatingLibrary,
  onUpdateGameBoxArt,
  onScanForBoxArt,
  isScanningArt,
  scanStatus,
}) => {
  const [editingGameId, setEditingGameId] = useState<number | null>(null);
  const [newBoxArtUrl, setNewBoxArtUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onScanForBoxArt(event.target.files);
    }
  };

  const handleEditClick = (game: Game) => {
    setEditingGameId(game.id);
    setNewBoxArtUrl(game.boxArtUrl);
  };

  const handleSaveClick = (gameId: number) => {
    onUpdateGameBoxArt(gameId, newBoxArtUrl);
    setEditingGameId(null);
    setNewBoxArtUrl('');
  };

  const handleCancelClick = () => {
    setEditingGameId(null);
    setNewBoxArtUrl('');
  };

  return (
    <div className="w-full max-w-4xl h-full p-4 flex flex-col animate-fade-in">
      <h2 className="text-4xl font-display text-white mb-6">Games Settings</h2>
      <div className="flex-grow overflow-y-auto space-y-8 pr-4">
        {/* AI Library Update */}
        <div>
            <h3 className="text-2xl font-semibold text-brand-accent mb-4 border-b-2 border-brand-primary/30 pb-2">Manage Library with AI</h3>
            <p className="text-brand-text-muted mb-4">
                Use Gemini to automatically discover a new game for each of your systems, and even invent a brand new fictional system with its own launch title.
            </p>
            <button
                onClick={onUpdateLibrary}
                disabled={isUpdatingLibrary}
                className="w-full bg-brand-secondary hover:bg-brand-primary disabled:bg-gray-600 text-white font-bold py-3 px-4 text-xl rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-neon-purple"
            >
                {isUpdatingLibrary ? <><SpinnerIcon /> Updating Library...</> : 'Update Library using Gemini'}
            </button>
        </div>

        {/* Box Art Management */}
        <div>
            <h3 className="text-2xl font-semibold text-brand-accent mb-4 border-b-2 border-brand-primary/30 pb-2">Box Art Management</h3>
             <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanningArt}
                className="w-full bg-brand-secondary hover:bg-brand-primary disabled:bg-gray-600 text-white font-bold py-3 px-4 text-xl rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-neon-purple mb-4"
            >
                {isScanningArt ? <><SpinnerIcon /> Scanning...</> : 'Scan Local Files for Box Art'}
            </button>
            {scanStatus && <p className="text-center text-brand-accent">{scanStatus}</p>}
        </div>

        {/* Manage Games List */}
        <div>
            <h3 className="text-2xl font-semibold text-brand-accent mb-4 border-b-2 border-brand-primary/30 pb-2">Manage Games</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                 {games.length > 0 ? games.map(game => (
                    <div key={game.id} className="bg-brand-surface/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <img src={game.boxArtUrl} alt={game.title} className="w-12 h-16 object-cover rounded-sm" />
                                <div>
                                    <p className="text-white text-lg">{game.title}</p>
                                    <p className="text-brand-text-muted text-sm">{systems.find(s => s.id === game.systemId)?.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleEditClick(game)} className="text-brand-accent hover:text-white transition-colors p-2 rounded-full hover:bg-white/10">
                                    <PencilIcon />
                                </button>
                                <button onClick={() => onDeleteGame(game.id)} className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-full hover:bg-white/10">
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                        {editingGameId === game.id && (
                           <div className="mt-4 space-y-2">
                                <input
                                    type="text"
                                    value={newBoxArtUrl}
                                    onChange={e => setNewBoxArtUrl(e.target.value)}
                                    placeholder="Enter new box art URL"
                                    className="w-full text-base bg-brand-bg border-2 border-brand-primary/50 rounded-lg p-2 text-white focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition"
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={handleCancelClick} className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors">Cancel</button>
                                    <button onClick={() => handleSaveClick(game.id)} className="px-4 py-2 rounded-lg bg-brand-primary text-white hover:bg-brand-secondary transition-colors">Save</button>
                                </div>
                            </div>
                        )}
                    </div>
                )) : <p className="text-brand-text-muted">No games found.</p>}
            </div>
        </div>

        {/* Manage Systems List */}
        <div>
            <h3 className="text-2xl font-semibold text-brand-accent mb-4 border-b-2 border-brand-primary/30 pb-2">Manage Systems</h3>
            <div className="space-y-2">
                {systems.length > 0 ? systems.map(system => (
                    <div key={system.id} className="flex items-center justify-between bg-brand-surface/50 p-3 rounded-lg">
                        <span className="text-white text-lg">{system.name}</span>
                        <button onClick={() => onDeleteSystem(system.id)} className="text-red-400 hover:text-red-300 transition-colors">
                            <TrashIcon />
                        </button>
                    </div>
                )) : <p className="text-brand-text-muted">No systems found.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};

const ScrapeSettings: React.FC<Pick<SettingsDetailViewProps, 'onScrape' | 'isScraping' | 'scrapingStatus'>> = ({ onScrape, isScraping, scrapingStatus }) => {
  return (
    <div className="w-full max-w-lg h-full p-4 flex flex-col justify-center items-center animate-fade-in text-center">
      <h2 className="text-4xl font-display text-white mb-8">Scrape Metadata</h2>
       {isScraping ? (
        <div className="flex flex-col items-center gap-4">
            <SpinnerIcon />
            <p className="text-lg text-brand-accent">{scrapingStatus}</p>
            <p className="text-brand-text-muted text-sm">Please wait, this may take a while...</p>
        </div>
      ) : (
      <div className="w-full space-y-4">
        <button 
            onClick={() => onScrape('ScreenScraper')}
            disabled={isScraping}
            className="w-full bg-brand-secondary hover:bg-brand-primary disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 text-xl rounded-full transition-all duration-300 shadow-lg hover:shadow-neon-purple"
        >
          Scrape from ScreenScraper.fr
        </button>
        <button 
            onClick={() => onScrape('TheGamesDB')}
            disabled={isScraping}
            className="w-full bg-brand-secondary hover:bg-brand-primary disabled:bg-gray-600/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 text-xl rounded-full transition-all duration-300 shadow-lg hover:shadow-neon-purple"
        >
          Scrape from TheGamesDB.net
        </button>
      </div>
       )}
    </div>
  );
};

const PlaceholderSettings: React.FC<{ title: string }> = ({ title }) => (
    <div className="w-full max-w-lg h-full p-4 flex flex-col justify-center items-center animate-fade-in text-center">
        <h2 className="text-4xl font-display text-white mb-4">{title}</h2>
        <p className="text-brand-text-muted">Settings for this section are not yet implemented.</p>
    </div>
);


const SettingsDetailView: React.FC<SettingsDetailViewProps> = (props) => {
  const { activeSetting } = props;

  switch (activeSetting) {
    case 'gamesSettings':
      return <GamesSettings {...props} />;
    case 'scrape':
      return <ScrapeSettings onScrape={props.onScrape} isScraping={props.isScraping} scrapingStatus={props.scrapingStatus} />;
    case 'retroAchievements':
      return <PlaceholderSettings title="RetroAchievements" />;
    case 'controllerSettings':
      return <PlaceholderSettings title="Controller Settings" />;
    case 'uiSettings':
      return <PlaceholderSettings title="UI Settings" />;
    case 'soundSettings':
      return <PlaceholderSettings title="Sound Settings" />;
    case 'networkSettings':
      return <PlaceholderSettings title="Network Settings" />;
    case 'updatesDownloads':
        return <PlaceholderSettings title="Updates & Downloads" />;
    case 'retroArchSettings':
        return <PlaceholderSettings title="RetroArch Settings" />;
    case 'systemSettings':
        return <PlaceholderSettings title="System Settings" />;
    default:
      return (
        <div className="w-full max-w-lg h-full p-4 flex flex-col justify-center items-center animate-fade-in text-center">
            <h2 className="text-4xl font-display text-white mb-4">Settings</h2>
            <p className="text-brand-text-muted">Select a category from the left.</p>
        </div>
      );
  }
};

export default SettingsDetailView;
