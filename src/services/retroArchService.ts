// RetroArch Service - Portable Package Approach
// Uses hardcoded relative paths - no configuration needed!

import path from 'path';
import fs from 'fs';

export interface SystemConfig {
  id: string;
  name: string;
  fullname: string;
  path: string;
  extensions: string[];
  core: string;
  platform: string;
}

export interface ParsedGame {
  id: string;
  title: string;
  path: string;
  systemId: string;
  systemName: string;
  extension: string;
}

export interface ParsedSystem {
  id: string;
  name: string;
  gameCount: number;
  core: string;
}

class RetroArchService {
  // Hardcoded relative paths - works from anywhere!
  private readonly BASE_PATH = process.cwd();
  private readonly RETROARCH_PATH = path.join(this.BASE_PATH, 'Emulators', 'RetroArch', 'retroarch.exe');
  private readonly CORES_PATH = path.join(this.BASE_PATH, 'Emulators', 'RetroArch', 'cores');
  private readonly ROMS_PATH = path.join(this.BASE_PATH, 'ROMs');
  private readonly SAVES_PATH = path.join(this.BASE_PATH, 'Saves');
  private readonly BIOS_PATH = path.join(this.BASE_PATH, 'Emulators', 'RetroArch', 'system');

  // System configurations with cores
  private readonly DEFAULT_SYSTEMS: SystemConfig[] = [
    {
      id: 'nes',
      name: 'NES',
      fullname: 'Nintendo Entertainment System',
      path: 'nes',
      extensions: ['.nes', '.NES', '.zip', '.ZIP'],
      core: 'fceumm_libretro.dll',
      platform: 'nes'
    },
    {
      id: 'snes',
      name: 'SNES',
      fullname: 'Super Nintendo Entertainment System',
      path: 'snes',
      extensions: ['.smc', '.sfc', '.SMC', '.SFC', '.zip', '.ZIP'],
      core: 'snes9x_libretro.dll',
      platform: 'snes'
    },
    {
      id: 'genesis',
      name: 'Genesis',
      fullname: 'Sega Genesis / Mega Drive',
      path: 'genesis',
      extensions: ['.md', '.MD', '.gen', '.GEN', '.zip', '.ZIP'],
      core: 'genesis_plus_gx_libretro.dll',
      platform: 'genesis'
    },
    {
      id: 'mastersystem',
      name: 'Master System',
      fullname: 'Sega Master System',
      path: 'mastersystem',
      extensions: ['.sms', '.SMS', '.zip', '.ZIP'],
      core: 'genesis_plus_gx_libretro.dll',
      platform: 'mastersystem'
    },
    {
      id: 'gb',
      name: 'Game Boy',
      fullname: 'Nintendo Game Boy',
      path: 'gb',
      extensions: ['.gb', '.GB', '.zip', '.ZIP'],
      core: 'gambatte_libretro.dll',
      platform: 'gb'
    },
    {
      id: 'gbc',
      name: 'Game Boy Color',
      fullname: 'Nintendo Game Boy Color',
      path: 'gbc',
      extensions: ['.gbc', '.GBC', '.zip', '.ZIP'],
      core: 'gambatte_libretro.dll',
      platform: 'gbc'
    },
    {
      id: 'gba',
      name: 'Game Boy Advance',
      fullname: 'Nintendo Game Boy Advance',
      path: 'gba',
      extensions: ['.gba', '.GBA', '.zip', '.ZIP'],
      core: 'mgba_libretro.dll',
      platform: 'gba'
    },
    {
      id: 'n64',
      name: 'Nintendo 64',
      fullname: 'Nintendo 64',
      path: 'n64',
      extensions: ['.n64', '.N64', '.z64', '.Z64', '.v64', '.V64', '.zip', '.ZIP'],
      core: 'mupen64plus_next_libretro.dll',
      platform: 'n64'
    },
    {
      id: 'psx',
      name: 'PlayStation',
      fullname: 'Sony PlayStation',
      path: 'psx',
      extensions: ['.cue', '.CUE', '.bin', '.BIN', '.img', '.IMG', '.pbp', '.PBP'],
      core: 'pcsx_rearmed_libretro.dll',
      platform: 'psx'
    },
    {
      id: 'atari2600',
      name: 'Atari 2600',
      fullname: 'Atari 2600',
      path: 'atari2600',
      extensions: ['.a26', '.A26', '.bin', '.BIN', '.zip', '.ZIP'],
      core: 'stella_libretro.dll',
      platform: 'atari2600'
    },
    {
      id: 'arcade',
      name: 'Arcade',
      fullname: 'Arcade (MAME)',
      path: 'arcade',
      extensions: ['.zip', '.ZIP'],
      core: 'mame2003_plus_libretro.dll',
      platform: 'arcade'
    }
  ];

  constructor() {
    this.ensureDirectories();
  }

  // Create necessary directories if they don't exist
  private ensureDirectories() {
    const dirs = [
      path.join(this.BASE_PATH, 'Emulators', 'RetroArch', 'cores'),
      path.join(this.BASE_PATH, 'Emulators', 'RetroArch', 'system'),
      path.join(this.BASE_PATH, 'ROMs'),
      path.join(this.BASE_PATH, 'Saves', 'saves'),
      path.join(this.BASE_PATH, 'Saves', 'states'),
      path.join(this.BASE_PATH, 'Screenshots')
    ];

    // Create ROM directories for each system
    this.DEFAULT_SYSTEMS.forEach(system => {
      dirs.push(path.join(this.ROMS_PATH, system.path));
    });

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  // Check if RetroArch is present in the package
  isConfigured(): boolean {
    return fs.existsSync(this.RETROARCH_PATH);
  }

  // Get paths for info/debugging
  getPaths() {
    return {
      base: this.BASE_PATH,
      retroarch: this.RETROARCH_PATH,
      cores: this.CORES_PATH,
      roms: this.ROMS_PATH,
      saves: this.SAVES_PATH,
      bios: this.BIOS_PATH
    };
  }

  // Get system configuration by ID
  getSystemConfig(systemId: string): SystemConfig | undefined {
    return this.DEFAULT_SYSTEMS.find(s => s.id === systemId);
  }

  // Scan ROM directory for a specific system
  async scanSystemGames(systemId: string): Promise<ParsedGame[]> {
    const systemConfig = this.getSystemConfig(systemId);
    if (!systemConfig) {
      console.error(`System ${systemId} not found in configuration`);
      return [];
    }

    try {
      const systemPath = path.join(this.ROMS_PATH, systemConfig.path);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(systemPath)) {
        fs.mkdirSync(systemPath, { recursive: true });
        return [];
      }

      const files = await window.electron.scanDirectory(systemPath);
      const games: ParsedGame[] = [];
      
      for (const file of files) {
        const extension = this.getFileExtension(file);
        
        // Check if extension is supported by this system
        if (systemConfig.extensions.some(ext => 
          ext.toLowerCase() === extension.toLowerCase()
        )) {
          const fileName = this.getFileName(file);
          games.push({
            id: `${systemId}_${fileName}`,
            title: fileName,
            path: path.join(systemPath, file),
            systemId: systemConfig.id,
            systemName: systemConfig.fullname,
            extension: extension
          });
        }
      }
      
      return games;
    } catch (error) {
      console.error(`Error scanning games for ${systemId}:`, error);
      return [];
    }
  }

  // Update game counts for all systems
  async updateSystemGameCounts(): Promise<ParsedSystem[]> {
    const systems: ParsedSystem[] = [];
    
    for (const systemConfig of this.DEFAULT_SYSTEMS) {
      const games = await this.scanSystemGames(systemConfig.id);
      systems.push({
        id: systemConfig.id,
        name: systemConfig.fullname,
        gameCount: games.length,
        core: systemConfig.core
      });
    }
    
    return systems;
  }

  // Get games for a specific system
  async getGamesForSystem(systemId: string): Promise<ParsedGame[]> {
    return await this.scanSystemGames(systemId);
  }

  // Launch game using RetroArch with appropriate core
  async launchGame(game: ParsedGame): Promise<void> {
    const systemConfig = this.getSystemConfig(game.systemId);
    if (!systemConfig) {
      throw new Error(`System configuration not found for ${game.systemId}`);
    }

    if (!this.isConfigured()) {
      throw new Error('RetroArch is not found in the Emulators folder. Please reinstall Emu-FE.');
    }

    // Build command with relative paths
    const corePath = path.join(this.CORES_PATH, systemConfig.core);
    
    // Check if core exists
    if (!fs.existsSync(corePath)) {
      throw new Error(`Core not found: ${systemConfig.core}\nPlease ensure all cores are installed in Emulators/RetroArch/cores/`);
    }

    // Launch command following EmulationStation format
    const command = `"${this.RETROARCH_PATH}" -L "${corePath}" "${game.path}"`;

    console.log('Launching game:', {
      game: game.title,
      system: systemConfig.fullname,
      core: systemConfig.core,
      command: command
    });

    try {
      await window.electron.executeCommand(command);
    } catch (error) {
      console.error('Error launching game:', error);
      throw new Error(`Failed to launch game: ${error}`);
    }
  }

  // Check which cores are installed
  async getInstalledCores(): Promise<string[]> {
    try {
      if (!fs.existsSync(this.CORES_PATH)) {
        return [];
      }
      
      const files = fs.readdirSync(this.CORES_PATH);
      return files.filter(file => file.endsWith('.dll'));
    } catch (error) {
      console.error('Error reading cores directory:', error);
      return [];
    }
  }

  // Helper: Get file extension
  private getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(lastDot) : '';
  }

  // Helper: Get filename without extension
  private getFileName(filepath: string): string {
    const filename = filepath.split(path.sep).pop() || filepath;
    const lastDot = filename.lastIndexOf('.');
    return lastDot !== -1 ? filename.substring(0, lastDot) : filename;
  }

  // Get all system configurations
  getAllSystems(): SystemConfig[] {
    return this.DEFAULT_SYSTEMS;
  }

  // Get default systems config
  getDefaultSystems(): SystemConfig[] {
    return this.DEFAULT_SYSTEMS;
  }
}

// Create singleton instance
export const retroArchService = new RetroArchService();

// Export types
export type { SystemConfig, ParsedGame, ParsedSystem };
