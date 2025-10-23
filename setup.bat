@echo off
echo ================================
echo    Emu-FE First Time Setup
echo ================================
echo.
echo Checking RetroArch installation...

if exist "Emulators\RetroArch\retroarch.exe" (
    echo [OK] RetroArch found!
) else (
    echo [ERROR] RetroArch not found!
    echo Please reinstall Emu-FE
    pause
    exit
)

echo.
echo Checking cores...
dir /b "Emulators\RetroArch\cores\*.dll" | find /c ".dll" > temp.txt
set /p CORE_COUNT=<temp.txt
del temp.txt

echo [OK] Found %CORE_COUNT% cores

echo.
echo Creating ROM directories...
mkdir "ROMs\nes" 2>nul
mkdir "ROMs\snes" 2>nul
mkdir "ROMs\genesis" 2>nul
mkdir "ROMs\gb" 2>nul
mkdir "ROMs\gba" 2>nul
mkdir "ROMs\n64" 2>nul
mkdir "ROMs\psx" 2>nul

echo.
echo ================================
echo      Setup Complete!
echo ================================
echo.
echo Add your ROMs to the ROM folders
echo Then launch Emu-FE.exe
echo.
pause