import { GoogleGenAI, Type } from "@google/genai";
import type { GameMetadata } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const fetchGameMetadata = async (gameTitle: string): Promise<GameMetadata> => {
  try {
    const prompt = `
      You are a video game historian. For the game "${gameTitle}", provide a concise, one-paragraph description, 
      its initial release date (YYYY-MM-DD format), and its primary genre(s). 
      If the game is fictional, create plausible information for it.
      Return the information in a JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "A one-paragraph summary of the game."
            },
            releaseDate: {
              type: Type.STRING,
              description: "The initial release date in YYYY-MM-DD format."
            },
            genre: {
              type: Type.STRING,
              description: "The primary genre or genres of the game, comma-separated."
            }
          },
          required: ["description", "releaseDate", "genre"],
        },
      },
    });

    // FIX: The `GenerateContentResponse` object returns a JSON string in `response.text`. This string must be parsed to get a JSON object.
    const metadata: GameMetadata = JSON.parse(response.text);
    
    return metadata;

  } catch (error) {
    console.error("Error fetching game metadata from Gemini:", error);
    // Return fallback data on error
    return {
      description: `Could not fetch description for ${gameTitle}.`,
      releaseDate: "N/A",
      genre: "N/A",
    };
  }
};

export const findNewGameForSystem = async (systemName: string, existingGameTitles: string[]): Promise<{ title: string } | null> => {
    try {
        const prompt = `
            You are a video game database curator. For the system "${systemName}", suggest one popular and well-regarded game 
            that is NOT in the following list: ${existingGameTitles.join(', ')}. 
            Provide only the title of the game.
            Return the response as a JSON object with a single key: "title".
            Example: {"title": "Chrono Trigger"}
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING }
                    },
                    required: ['title']
                }
            }
        });
        // FIX: The `GenerateContentResponse` object returns a JSON string in `response.text`. This string must be parsed to get a JSON object.
        return JSON.parse(response.text) as { title: string };
    } catch (error) {
        console.error(`Error finding new game for ${systemName}:`, error);
        return null;
    }
};

export const inventNewSystem = async (): Promise<{ systemName: string; logoUrl: string; consoleImageUrl: string; gameTitle: string; } | null> => {
    try {
        const prompt = `
            You are a creative video game historian. Invent a fictional 16-bit video game console that could have existed in the early 1990s. 
            Provide a name for the console and a title for a fictional launch game for it. 
            Also, provide a placeholder URL for its logo and a placeholder URL for an image of the console itself, 
            using the format 'https://picsum.photos/seed/UNIQUE_TEXT/WIDTH/HEIGHT' for the URLs, using unique text for the seed.
            The logo should be 400x200. The console image can be 1280x720.
            Return this information as a JSON object with keys: "systemName", "logoUrl", "consoleImageUrl", and "gameTitle".
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        systemName: { type: Type.STRING },
                        logoUrl: { type: Type.STRING },
                        consoleImageUrl: { type: Type.STRING },
                        gameTitle: { type: Type.STRING }
                    },
                    required: ['systemName', 'logoUrl', 'consoleImageUrl', 'gameTitle']
                }
            }
        });
        // FIX: The `GenerateContentResponse` object returns a JSON string in `response.text`. This string must be parsed to get a JSON object.
        return JSON.parse(response.text) as { systemName: string; logoUrl: string; consoleImageUrl: string; gameTitle: string; };
    } catch (error) {
        console.error('Error inventing new system:', error);
        return null;
    }
};

export const scrapeGameMetadata = async (
  gameTitle: string,
  systemName: string,
  source: 'ScreenScraper' | 'TheGamesDB'
): Promise<(GameMetadata & { boxArtUrl: string }) | null> => {
  try {
    const prompt = `
      You are an expert video game data scraper. Emulate a lookup from the '${source}' database.
      For the game "${gameTitle}" on the system "${systemName}", find its metadata.
      Provide the following:
      1. A concise, one-paragraph description of the game.
      2. The original release date in YYYY-MM-DD format.
      3. The primary genre or genres, comma-separated.
      4. A realistic but placeholder URL for the box art. Use the format 'https://picsum.photos/seed/UNIQUE_TEXT/400/600', where UNIQUE_TEXT is derived from the game title.

      Return this information as a JSON object.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: {
              type: Type.STRING,
              description: "A one-paragraph summary of the game."
            },
            releaseDate: {
              type: Type.STRING,
              description: "The initial release date in YYYY-MM-DD format."
            },
            genre: {
              type: Type.STRING,
              description: "The primary genre or genres, comma-separated."
            },
            boxArtUrl: {
              type: Type.STRING,
              description: "A placeholder URL for the game's box art."
            }
          },
          required: ["description", "releaseDate", "genre", "boxArtUrl"],
        },
      },
    });

    // FIX: The `GenerateContentResponse` object returns a JSON string in `response.text`. This string must be parsed to get a JSON object.
    return JSON.parse(response.text) as GameMetadata & { boxArtUrl: string };

  } catch (error) {
    console.error(`Error scraping metadata for ${gameTitle} from ${source}:`, error);
    return null;
  }
};