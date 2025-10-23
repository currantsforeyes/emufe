import type { System, Game } from './types';

export const SYSTEMS: System[] = [
  { 
    id: 'genesis', 
    name: 'Sega Genesis', 
    logoUrl: 'https://en.wikipedia.org/wiki/Sega_Genesis#/media/File:GenesisLogo.png',
    consoleImageUrl: 'https://en.wikipedia.org/wiki/Sega_Genesis#/media/File:Sega-Genesis-Mk2-6button.jpg',
  },
    { 
    id: 'snes', 
    name: 'Super Nintendo', 
    logoUrl: 'https://en.wikipedia.org/wiki/Super_Nintendo_Entertainment_System#/media/File:Super_Nintendo_Entertainment_System_logo.svg',
    consoleImageUrl: 'https://en.wikipedia.org/wiki/Super_Nintendo_Entertainment_System#/media/File:Nintendo-Super-Famicom-Set-FL.jpg',
  },
  { 
    id: 'n64', 
    name: 'Nintendo 64', 
    logoUrl: 'https://en.wikipedia.org/wiki/Nintendo_64#/media/File:Nintendo_64_(logo).svg',
    consoleImageUrl: 'https://en.wikipedia.org/wiki/Nintendo#/media/File:Nintendo-64-wController-L.jpg',
  },
  { 
    id: 'ps1', 
    name: 'PlayStation', 
    logoUrl: 'https://en.wikipedia.org/wiki/PlayStation#/media/File:Playstation_logo_colour.svg',
    consoleImageUrl: 'https://en.wikipedia.org/wiki/PlayStation#/media/File:PlayStation-SCPH-1000-with-Controller.jpg',
  },
    { 
    id: 'ps2', 
    name: 'PlayStation 2', 
    logoUrl: 'hhttps://en.wikipedia.org/wiki/PlayStation#/media/File:PlayStation_logo.svg',
    consoleImageUrl: 'https://en.wikipedia.org/wiki/PlayStation#/media/File:Sony-PlayStation-2-30001-wController-L.jpg',
  },
];

export const INITIAL_GAMES: Game[] = [
    {
        id: 1,
        title: "The Legend of Zelda: A Link to the Past",
        systemId: "snes",
        boxArtUrl: "https://picsum.photos/seed/zelda/400/600",
        description: "An action-adventure game developed and published by Nintendo for the Super Nintendo Entertainment System. It is the third game in The Legend of Zelda series and was released in 1991 in Japan and 1992 in North America and Europe.",
        releaseDate: "1991-11-21",
        genre: "Action-adventure"
    },
    {
        id: 2,
        title: "Super Metroid",
        systemId: "snes",
        boxArtUrl: "https://picsum.photos/seed/metroid/400/600",
        description: "An action-adventure game developed by Nintendo R&D1 and published by Nintendo for the Super Nintendo Entertainment System. The third installment in the Metroid series, it was released in Japan in March 1994, with other regions later that year.",
        releaseDate: "1994-03-19",
        genre: "Action-adventure, Platformer"
    },
    {
        id: 3,
        title: "Sonic the Hedgehog 2",
        systemId: "genesis",
        boxArtUrl: "https://picsum.photos/seed/sonic2/400/600",
        description: "A 1992 platform game developed by Sega Technical Institute and published by Sega for the Sega Genesis. It follows Sonic as he attempts to stop Doctor Robotnik from stealing the Chaos Emeralds to power his space station, the Death Egg.",
        releaseDate: "1992-11-21",
        genre: "Platformer"
    },
     {
        id: 4,
        title: "Super Mario 64",
        systemId: "n64",
        boxArtUrl: "https://picsum.photos/seed/mario64/400/600",
        description: "A 1996 platform game for the Nintendo 64 and the first Super Mario game to feature 3D gameplay. As Mario, the player explores Princess Peach's castle to rescue her from Bowser.",
        releaseDate: "1996-06-23",
        genre: "Platformer, Action-adventure"
    },
     {
        id: 5,
        title: "Final Fantasy VII",
        systemId: "ps1",
        boxArtUrl: "https://picsum.photos/seed/ff7/400/600",
        description: "A 1997 role-playing video game developed by Square for the PlayStation console. It is the seventh main installment in the Final Fantasy series.",
        releaseDate: "1997-01-31",
        genre: "Role-playing game"
    },
];
