// Game types and utilities - the core stuff
export type GameMode = 'menu' | 'single-player' | 'multiplayer-setup' | 'multiplayer-game' | 'ai-setup' | 'ai-game';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
id: string;
username: string;
score: number; // number of matches they got
}

export interface Card {
id: string;
symbol: string;
isFlipped: boolean;
isMatched: boolean; // once matched, stays matched
}

export interface GameState {
cards: Card[];
flippedCards: Card[];
moves: number;
currentPlayer: number;
gameWon: boolean;
winner?: Player;
}

// Viking symbols for the memory cards - these look pretty cool
export const VIKING_SYMBOLS = [
'⚔️', '🛡️', '🪓', '⚡', '🔥', '❄️', '🌊', '🏔️',
'🦅', '🐺', '🐻', '🦌', '⭐', '🌙', '☀️', '💎'
];

export interface GameSettings {
vikingTextMode: boolean;
timeLimit: number; // in seconds
}

// Get settings from localStorage or use defaults
export const getSettings = (): GameSettings => {
const stored = localStorage.getItem('askeladd-settings');
return stored ? JSON.parse(stored) : { vikingTextMode: true, timeLimit: 10 };
};

export const updateSettings = (settings: GameSettings): void => {
localStorage.setItem('askeladd-settings', JSON.stringify(settings));
window.dispatchEvent(new Event('settingsUpdate')); // notify other components
};

// Helper to get the right text based on viking mode setting
export const getVikingText = (vikingText: string, normalText: string): string => {
const settings = getSettings();
return settings.vikingTextMode ? vikingText : normalText;
};

export interface HighScore {
score: number;
moves: number;
time?: number; // optional for non-timed modes
mode: 'single' | 'multiplayer' | 'ai';
playerName: string;
difficulty?: string; // for AI mode
}

export const getHighScore = (): HighScore | null => {
const stored = localStorage.getItem('askeladd-high-score');
return stored ? JSON.parse(stored) : null;
};

// Update high score if the new one is better
export const updateHighScore = (newScore: HighScore): boolean => {
const currentHigh = getHighScore();

// Check if this is a new high score
if (!currentHigh || newScore.score > currentHigh.score || 
(newScore.score === currentHigh.score && newScore.moves < currentHigh.moves)) {
localStorage.setItem('askeladd-high-score', JSON.stringify(newScore));
return true; // it's a new record!
}
return false;
};

// Create shuffled cards for the memory game
export function createCards(): Card[] {
const symbols = VIKING_SYMBOLS.slice(0, 8); // take first 8 symbols
const pairs = [...symbols, ...symbols]; // duplicate for pairs

return pairs
.map((symbol, index) => ({
id: `card-${index}`,
symbol,
isFlipped: false,
isMatched: false,
}))
.sort(() => Math.random() - 0.5); // shuffle the deck
}