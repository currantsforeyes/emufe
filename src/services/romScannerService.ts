// ROM Scanner Service
// This service scans specified directories for ROM files and organizes them by system

export interface ScannedGame {
  id: string;
  title: string;
  systemId: string;
  path: string;
  fileName: string;
  extension: string;
}

export interface SystemGames {
  systemId: string;
  systemName: string;
  games: ScannedGame[];
}

// System definitions with their ROM file extensions
export const SYSTEM_DEFINITIONS = [
  {
    id: 'nes',
    name: 'Nintendo Entertainment System',
    shortName: 'NES',
    extensions: ['.nes'],
    folderName: 'nes'
  },
  {
    id: 'snes',
    name: 'Super Nintendo',
    shortName: 'SNES',
    extensions: ['.smc', '.sfc'],
    folderName: 'snes'
  },
  {
    id: 'genesis',
    name: 'Sega Genesis',
    shortName: 'Genesis',
    extensions: ['.gen', '.md', '.bin'],
    folderName: 'genesis'
  },
  {
    id: 'n64',
    name: 'Nintendo 64',
    shortName: 'N64',
    extensions: ['.n64', '.z64', '.v64'],
    folderName: 'n64'
  },
  {
    id: 'gba',
    name: 'Game Boy Advance',
    shortName: 'GBA',
    extensions: ['.gba'],
    folderName: 'gba'
  },
  {
    id: 'gb',
    name: 'Game Boy',
    shortName: 'GB',
    extensions: ['.gb'],
    folderName: 'gb'
  },
  {
    id: 'gbc',
    name: 'Game Boy Color',
    shortName: 'GBC',
    extensions: ['.gbc'],
    folderName: 'gbc'
  },
  {
    id: 'ps1',
    name: 'PlayStation',
    shortName: 'PS1',
    extensions: ['.cue', '.bin', '.iso'],
    folderName: 'ps1'
  },
];

class ROMScannerService {
  private basePath: string = 'D:/roms'; // Default ROM directory

  setBasePath(path: string) {
    this.basePath = path;
  }

  // Get file extension
  private getExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.substring(lastDot).toLowerCase();
  }

  // Clean up game title from filename
  private cleanTitle(filename: string): string {
    // Remove extension
    let title = filename.replace(/\.[^/.]+$/, '');
    
    // Remove common patterns like (USA), [!], etc.
    title = title.replace(/\([^)]*\)/g, '');
    title = title.replace(/\[[^\]]*\]/g, '');
    
    // Replace underscores and dashes with spaces
    title = title.replace(/[_-]/g, ' ');
    
    // Remove extra spaces
    title = title.replace(/\s+/g, ' ').trim();
    
    return title;
  }

  // Mock scan function - in a real implementation, this would use fs/electron API
  async scanForGames(): Promise<SystemGames[]> {
    // This is a mock implementation
    // In a real Electron app, you would use Node.js fs module to scan directories
    
    const mockData: SystemGames[] = [
      {
        systemId: 'nes',
        systemName: 'NES',
        games: [
          {
            id: 'nes-1',
            title: 'Super Mario Bros',
            systemId: 'nes',
            path: 'D:/roms/nes/Super Mario Bros.nes',
            fileName: 'Super Mario Bros.nes',
            extension: '.nes'
          },
          {
            id: 'nes-2',
            title: 'The Legend of Zelda',
            systemId: 'nes',
            path: 'D:/roms/nes/The Legend of Zelda.nes',
            fileName: 'The Legend of Zelda.nes',
            extension: '.nes'
          },
          {
            id: 'nes-3',
            title: 'Metroid',
            systemId: 'nes',
            path: 'D:/roms/nes/Metroid.nes',
            fileName: 'Metroid.nes',
            extension: '.nes'
          }
        ]
      },
      {
        systemId: 'genesis',
        systemName: 'Genesis',
        games: [
          {
            id: 'genesis-1',
            title: 'Sonic the Hedgehog',
            systemId: 'genesis',
            path: 'D:/roms/genesis/Sonic the Hedgehog.gen',
            fileName: 'Sonic the Hedgehog.gen',
            extension: '.gen'
          },
          {
            id: 'genesis-2',
            title: 'Streets of Rage 2',
            systemId: 'genesis',
            path: 'D:/roms/genesis/Streets of Rage 2.gen',
            fileName: 'Streets of Rage 2.gen',
            extension: '.gen'
          }
        ]
      },
      {
        systemId: 'snes',
        systemName: 'SNES',
        games: [
          {
            id: 'snes-1',
            title: 'Super Mario World',
            systemId: 'snes',
            path: 'D:/roms/snes/Super Mario World.smc',
            fileName: 'Super Mario World.smc',
            extension: '.smc'
          },
          {
            id: 'snes-2',
            title: 'The Legend of Zelda: A Link to the Past',
            systemId: 'snes',
            path: 'D:/roms/snes/Zelda - A Link to the Past.smc',
            fileName: 'Zelda - A Link to the Past.smc',
            extension: '.smc'
          }
        ]
      }
    ];

    // Store in localStorage for persistence
    localStorage.setItem('scannedGames', JSON.stringify(mockData));
    
    return mockData;
  }

  // Load games from storage
  loadGamesFromStorage(): SystemGames[] {
    const stored = localStorage.getItem('scannedGames');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  }

  // Get systems that have games
  getAvailableSystems(): Array<{ id: string; name: string; gameCount: number }> {
    const systemGames = this.loadGamesFromStorage();
    return systemGames.map(sg => ({
      id: sg.systemId,
      name: sg.systemName,
      gameCount: sg.games.length
    }));
  }

  // Get games for a specific system
  getGamesForSystem(systemId: string): ScannedGame[] {
    const systemGames = this.loadGamesFromStorage();
    const system = systemGames.find(sg => sg.systemId === systemId);
    return system ? system.games : [];
  }
}

export const romScannerService = new ROMScannerService();
