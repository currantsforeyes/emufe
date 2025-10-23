import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SystemSelector from './components/SystemSelector';
import GameList from './components/GameList';
import SettingsMenu from './components/SettingsMenu';
import { retroArchService, ParsedGame, ParsedSystem } from './services/retroArchService';

type ViewMode = 'system-select' | 'game-list' | 'settings';

interface SystemOption {
  id: string;
  name: string;
  gameCount: number;
}

// Convert ParsedGame to the Game type expected by GameList
interface GameForList {
  id: string;
  title: string;
  system: string;
  path: string;
  coverImage: string;
  lastPlayed: string;
}

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('system-select');
  const [systems, setSystems] = useState<SystemOption[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<SystemOption | null>(null);
  const [selectedSystemFull, setSelectedSystemFull] = useState<ParsedSystem | null>(null);
  const [games, setGames] = useState<GameForList[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameForList | null>(null);
  const [selectedGameFull, setSelectedGameFull] = useState<ParsedGame | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load systems on mount
  useEffect(() => {
    loadSystems();
  }, []);

  const loadSystems = async () => {
    setIsLoading(true);
    try {
      // Update game counts and get systems
      const retroArchSystems = await retroArchService.updateSystemGameCounts();
      
      // Filter out systems with no games
      const systemsWithGames = retroArchSystems.filter(s => s.gameCount > 0);
      
      // Convert to SystemOption format
      const systemOptions: SystemOption[] = systemsWithGames.map(s => ({
        id: s.id,
        name: s.name,
        gameCount: s.gameCount
      }));
      
      // Add Settings as a special system at the end
      const systemsWithSettings: SystemOption[] = [
        ...systemOptions,
        {
          id: 'settings',
          name: 'SETTINGS',
          gameCount: 10 // Number of settings categories
        }
      ];
      
      setSystems(systemsWithSettings);
      
      // Auto-select first system if available
      if (systemsWithSettings.length > 0) {
        setSelectedSystem(systemsWithSettings[0]);
        setSelectedSystemFull(systemsWithGames[0]);
      }
    } catch (error) {
      console.error('Error loading systems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSystemSelect = (system: SystemOption) => {
    setSelectedSystem(system);
    // Find full system data (skip for settings)
    if (system.id !== 'settings') {
      const fullSystem = systems.find(s => s.id === system.id);
      if (fullSystem) {
        setSelectedSystemFull(fullSystem as any);
      }
    }
  };

  const handleSystemEnter = async (system: SystemOption) => {
    // Check if Settings was selected
    if (system.id === 'settings') {
      setViewMode('settings');
      return;
    }

    // Regular game system logic
    setIsLoading(true);
    try {
      // Load games for this system from RetroArch
      const retroArchGames = await retroArchService.getGamesForSystem(system.id);
      
      // Convert to GameForList format
      const gamesForList: GameForList[] = retroArchGames.map(game => ({
        id: game.id,
        title: game.title,
        system: game.systemName,
        path: game.path,
        coverImage: '',
        lastPlayed: new Date().toISOString()
      }));
      
      setGames(gamesForList);
      setSelectedGame(gamesForList.length > 0 ? gamesForList[0] : null);
      setSelectedGameFull(retroArchGames.length > 0 ? retroArchGames[0] : null);
      setViewMode('game-list');
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameSelect = (game: GameForList) => {
    setSelectedGame(game);
    // Find full game data
    const gameIndex = games.findIndex(g => g.id === game.id);
    if (gameIndex !== -1) {
      retroArchService.getGamesForSystem(selectedSystem?.id || '').then(retroGames => {
        setSelectedGameFull(retroGames[gameIndex]);
      });
    }
  };

  const handleLaunchGame = () => {
    if (selectedGameFull) {
      retroArchService.launchGame(selectedGameFull);
    }
  };

  const handleBackFromGames = () => {
    setViewMode('system-select');
    setGames([]);
    setSelectedGame(null);
    setSelectedGameFull(null);
  };

  const handleBackFromSettings = () => {
    setViewMode('system-select');
  };

  const handleRescan = async () => {
    await loadSystems();
  };

  return (
    <Layout>
      <div className="flex h-full w-full">
        {/* Loading overlay */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            color: '#c084fc',
            fontSize: '24px',
            fontFamily: 'Bungee, cursive'
          }}>
            LOADING...
          </div>
        )}

        {/* Instructions overlay */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '14px',
          fontFamily: 'Poppins, sans-serif',
          border: '2px solid #9333ea'
        }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold', color: '#c084fc', fontSize: '16px' }}>
            {viewMode === 'system-select' && '🎮 SELECT SYSTEM'}
            {viewMode === 'game-list' && '🕹️ SELECT GAME'}
            {viewMode === 'settings' && '⚙️ SETTINGS'}
          </div>
          <div style={{ marginBottom: '5px' }}>⬆️ ⬇️ Navigate</div>
          {viewMode === 'system-select' && <div style={{ marginBottom: '5px' }}>↵ Enter - View Games</div>}
          {viewMode === 'game-list' && (
            <>
              <div style={{ marginBottom: '5px' }}>↵ Enter - Launch Game</div>
              <div style={{ marginBottom: '10px' }}>⎋ Esc - Back to Systems</div>
            </>
          )}
          {viewMode === 'settings' && (
            <>
              <div style={{ marginBottom: '5px' }}>↵ Enter - Open Setting</div>
              <div style={{ marginBottom: '10px' }}>⎋ Esc - Back to Systems</div>
            </>
          )}
          {selectedGame && viewMode === 'game-list' && (
            <div style={{ 
              marginTop: '10px', 
              paddingTop: '10px', 
              borderTop: '1px solid #9333ea',
              fontSize: '12px',
              color: '#c084fc'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>Selected:</div>
              <div>{selectedGame.title}</div>
            </div>
          )}
          {viewMode === 'system-select' && (
            <button 
              onClick={handleRescan}
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                background: '#9333ea',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              🔄 Refresh Systems
            </button>
          )}
        </div>

        {viewMode === 'system-select' && (
          <SystemSelector
            systems={systems}
            selectedSystem={selectedSystem}
            onSelectSystem={handleSystemSelect}
            onBack={() => {}}
            onEnter={handleSystemEnter}
          />
        )}

        {viewMode === 'game-list' && (
          <GameList
            games={games}
            selectedGame={selectedGame}
            onSelectGame={handleGameSelect}
            onBack={handleBackFromGames}
            onLaunch={handleLaunchGame}
          />
        )}

        {viewMode === 'settings' && (
          <SettingsMenu
            onBack={handleBackFromSettings}
          />
        )}
      </div>
    </Layout>
  );
};

export default App;
