import React, { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, RotateCcw, Trophy, Swords, Crown } from 'lucide-react';
import { Card, Player, createCards, updateHighScore, HighScore } from './game';
import MemoryCard from './MemoryCard';
import RuneBackground from './RuneBackground';
import HighScoreBanner from './HighScoreBanner';
import GlobalSettings from './GlobalSettings';
import { useText } from './texts';

interface MultiplayerGameProps {
players: Player[];
onBackToMenu: () => void;
onLogout: () => void;
}

// Multiplayer PvP game - turn based
const MultiplayerGame: React.FC<MultiplayerGameProps> = ({ players, onBackToMenu, onLogout }) => {
const { t } = useText();
const [cards, setCards] = useState<Card[]>(createCards());
const [flippedCards, setFlippedCards] = useState<Card[]>([]);
const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
const [playerScores, setPlayerScores] = useState<Player[]>(players);
const [moves, setMoves] = useState(0);
const [gameWon, setGameWon] = useState(false);
const [winner, setWinner] = useState<Player | null>(null);
const [isNewHighScore, setIsNewHighScore] = useState(false);

const currentPlayer = playerScores[currentPlayerIndex];

const handleCardClick = (clickedCard: Card) => {
// Basic validation - can't click during processing or on invalid cards
if (flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) {
return;
}

const newFlippedCards = [...flippedCards, clickedCard];
setFlippedCards(newFlippedCards);

// Flip the clicked card
setCards(prevCards =>
prevCards.map(card =>
card.id === clickedCard.id ? { ...card, isFlipped: true } : card
)
);

if (newFlippedCards.length === 2) {
setMoves(prev => prev + 1); // count this move

if (newFlippedCards[0].symbol === newFlippedCards[1].symbol) {
// Match found! Current player gets a point and continues
setTimeout(() => {
setCards(prevCards =>
prevCards.map(card =>
newFlippedCards.some(flipped => flipped.id === card.id)
? { ...card, isMatched: true }
: card
)
);

// Update current player's score
setPlayerScores(prev =>
prev.map((player, index) =>
index === currentPlayerIndex
? { ...player, score: player.score + 1 }
: player
)
);

setFlippedCards([]);

// Check if game is over (all 8 pairs matched)
const totalMatches = playerScores.reduce((sum, player) => sum + player.score, 0) + 1;
if (totalMatches === 8) {
const updatedScores = playerScores.map((player, index) =>
index === currentPlayerIndex
? { ...player, score: player.score + 1 }
: player
);
const gameWinner = updatedScores.reduce((prev, current) => 
current.score > prev.score ? current : prev
);

// Check for high score
const finalScore: HighScore = {
score: gameWinner.score,
moves: moves,
mode: 'multiplayer',
playerName: gameWinner.username
};

const isHigh = updateHighScore(finalScore);
setIsNewHighScore(isHigh);

if (isHigh) {
window.dispatchEvent(new Event('highScoreUpdate')); // notify banner
}

setWinner(gameWinner);
setGameWon(true);
}
}, 1000);
} else {
// No match - flip back and switch turns
setTimeout(() => {
setCards(prevCards =>
prevCards.map(card =>
newFlippedCards.some(flipped => flipped.id === card.id)
? { ...card, isFlipped: false }
: card
)
);
setFlippedCards([]);
setCurrentPlayerIndex(prev => (prev + 1) % playerScores.length); // next player's turn
}, 1000);
}
}
};

// Reset for new game
const resetGame = () => {
setCards(createCards());
setFlippedCards([]);
setCurrentPlayerIndex(0);
setPlayerScores(players.map(p => ({ ...p, score: 0 }))); // reset scores
setMoves(0);
setGameWon(false);
setWinner(null);
setIsNewHighScore(false);
};

// Victory screen
if (gameWon && winner) {
return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center relative overflow-hidden">
<RuneBackground />
<GlobalSettings />

<div className="relative z-10 bg-gradient-to-b from-amber-900/90 to-slate-800/90 backdrop-blur-sm p-8 rounded-lg border-4 border-amber-600 shadow-2xl max-w-md w-full mx-4 text-center">
<Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
<h1 className="text-3xl font-bold text-amber-100 mb-2">
{isNewHighScore ? t('newRecord') : t('victory')}
</h1>
{isNewHighScore && (
<div className="flex items-center justify-center gap-2 mb-4">
<Crown className="w-5 h-5 text-amber-400" />
<span className="text-amber-300 font-bold">{t('hallOfFame')}</span>
<Crown className="w-5 h-5 text-amber-400" />
</div>
)}
<h2 className="text-xl text-amber-300 mb-6">
{winner.username} claims the throne!
</h2>

{/* Final scores */}
<div className="bg-slate-800/50 p-4 rounded-lg mb-6">
{playerScores.map((player, index) => (
<div key={player.id} className={`flex justify-between items-center mb-2 ${
player.id === winner.id ? 'text-amber-200 font-bold' : 'text-slate-300'
}`}>
<span className="flex items-center gap-2">
{player.id === winner.id && <Trophy className="w-4 h-4 text-amber-400" />}
{player.username}
</span>
<span>{player.score} matches</span>
</div>
))}
<div className="border-t border-amber-600/30 pt-2 mt-2">
<div className="flex justify-between text-amber-200">
<span>Total Moves:</span>
<span className="font-bold">{moves}</span>
</div>
</div>
</div>

<div className="flex gap-4">
<button
onClick={resetGame}
className="flex-1 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 font-bold py-3 px-4 rounded-md border-2 border-amber-500 transform hover:scale-105 transition-all duration-200"
>
<RotateCcw className="w-4 h-4 inline mr-2" />
{t('rematch')}
</button>
<button
onClick={onBackToMenu}
className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 font-bold py-3 px-4 rounded-md border-2 border-slate-500 transform hover:scale-105 transition-all duration-200"
>
{t('menu')}
</button>
</div>
</div>
</div>
);
}

return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900 p-4 relative overflow-hidden">
<RuneBackground />
<GlobalSettings />

<div className="relative z-10 max-w-4xl mx-auto">
<HighScoreBanner />

{/* Header */}
<div className="flex justify-between items-center mb-6">
<button
onClick={onBackToMenu}
className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 font-semibold py-2 px-4 rounded-md border-2 border-slate-500 transform hover:scale-105 transition-all duration-200"
>
<ArrowLeft className="w-4 h-4" />
{t('back')}
</button>

<div className="text-center">
<div className="flex items-center gap-2 justify-center mb-1">
<Swords className="w-5 h-5 text-amber-400" />
<h1 className="text-2xl font-bold text-amber-100">{t('warriorDuel')}</h1>
<Swords className="w-5 h-5 text-amber-400" />
</div>
<p className="text-amber-300 text-sm">Turn: {currentPlayer.username}</p>
</div>

<button
onClick={onLogout}
className="inline-flex items-center gap-2 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-red-100 font-semibold py-2 px-4 rounded-md border-2 border-red-600 transform hover:scale-105 transition-all duration-200"
>
<LogOut className="w-4 h-4" />
{t('logout')}
</button>
</div>

{/* Score display */}
<div className="bg-gradient-to-r from-amber-900/80 to-slate-800/80 backdrop-blur-sm p-4 rounded-lg border-2 border-amber-600/50 mb-6">
<div className="flex justify-center gap-8">
{playerScores.map((player, index) => (
<div 
key={player.id} 
className={`text-center p-3 rounded-lg transition-all ${
index === currentPlayerIndex 
? 'bg-amber-600/30 border-2 border-amber-400' // highlight current player
: 'bg-slate-800/30'
}`}
>
<div className="text-xl font-bold text-amber-100">{player.score}</div>
<div className="text-sm text-amber-300">{player.username}</div>
</div>
))}
</div>
<div className="text-center mt-3 text-amber-200">
<span className="text-sm">Total Moves: {moves}</span>
</div>
</div>

{/* Game board */}
<div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
{cards.map((card) => (
<MemoryCard
key={card.id}
card={card}
onClick={() => handleCardClick(card)}
/>
))}
</div>
</div>
</div>
);
};

export default MultiplayerGame;