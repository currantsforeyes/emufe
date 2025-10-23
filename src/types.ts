export interface System {
  id: string;
  name: string;
  logoUrl: string;
  consoleImageUrl: string;
}

export interface Game {
  id: number;
  title: string;
  systemId: string;
  boxArtUrl: string;
  description?: string;
  releaseDate?: string;
  genre?: string;
}

export interface GameMetadata {
  description: string;
  releaseDate: string;
  genre: string;
}
