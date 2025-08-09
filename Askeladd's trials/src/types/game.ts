export type GameMode = 'menu' | 'single-player' | 'multiplayer-setup' | 'multiplayer-game' | 'ai-setup' | 'ai-game';

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
id: string;
username: string;
score: number;
}

export interface Card {
id: string;
symbol: string;
isFlipped: boolean;
isMatched: boolean;
}

export interface GameState {
cards: Card[];
flippedCards: Card[];
moves: number;
currentPlayer: number;
gameWon: boolean;
winner?: Player;
}