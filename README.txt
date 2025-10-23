=========================================
         Welcome to Emu-FE!
=========================================

QUICK START:
1. Add your ROM files to the appropriate folders in /ROMs
2. Run Emu-FE.exe
3. Navigate using arrow keys, Enter to select, Escape to go back

FOLDER GUIDE:
- ROMs/        Put your games here (organized by system)
- Saves/       Your save files and save states
- Screenshots/ In-game screenshots
- Emulators/   RetroArch is here (don't modify)

ADDING GAMES:
Drop ROM files into these folders:
- ROMs/nes/      Nintendo (NES) games
- ROMs/snes/     Super Nintendo (SNES) games  
- ROMs/genesis/  Sega Genesis games
- ROMs/gb/       Game Boy games
- ROMs/gba/      Game Boy Advance games
- ROMs/n64/      Nintendo 64 games
- ROMs/psx/      PlayStation 1 games

BIOS FILES (if needed):
Some systems require BIOS files:
- Put BIOS in: Emulators/RetroArch/system/

Systems that need BIOS:
- PlayStation 1: scph1001.bin, scph5501.bin, scph7001.bin

SUPPORTED FILE TYPES:
- NES: .nes, .zip
- SNES: .smc, .sfc, .zip
- Genesis: .md, .gen, .zip
- Game Boy: .gb, .gbc, .zip
- GBA: .gba, .zip
- N64: .n64, .z64, .v64, .zip
- PSX: .cue, .bin (keep .cue and .bin together!)

TROUBLESHOOTING:
- Games not showing? Check file extensions
- Games not launching? Install Visual C++ Redistributable
- Black screen? System may need BIOS file

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`