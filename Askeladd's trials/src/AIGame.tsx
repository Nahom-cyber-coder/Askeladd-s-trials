import React, { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, RotateCcw, Trophy, Bot, User } from 'lucide-react';
import { Card, AIDifficulty, createCards } from './game';
import MemoryCard from './MemoryCard';
import RuneBackground from './RuneBackground';
import GlobalSettings from './GlobalSettings';
import { useText } from './texts';

interface AIGameProps {
username: string;
difficulty: AIDifficulty;
onBackToMenu: () => void;
onLogout: () => void;
}

// AI memory entry structure
interface AIMemoryEntry {
symbol: string;
indices: number[];
}

// AI vs Human game - the real challenge
const AIGame: React.FC<AIGameProps> = ({ username, difficulty, onBackToMenu, onLogout }) => {
const { t } = useText();
const [cards, setCards] = useState<Card[]>(createCards());
const [flippedCards, setFlippedCards] = useState<Card[]>([]);
const [isPlayerTurn, setIsPlayerTurn] = useState(true);
const [isProcessing, setIsProcessing] = useState(false); // prevent clicks during AI processing
const [playerScore, setPlayerScore] = useState(0);
const [aiScore, setAiScore] = useState(0);
const [moves, setMoves] = useState(0);
const [gameWon, setGameWon] = useState(false);
const [winner, setWinner] = useState<'human' | 'ai' | null>(null);
const [aiMemory, setAiMemory] = useState<{ [symbol: string]: AIMemoryEntry }>({});

// Get difficulty display name
const getDifficultyName = () => {
switch (difficulty) {
case 'easy': return t('mortalFool');
case 'medium': return t('cunningWarrior');
case 'hard': return t('divineIntellect');
}
};

// Memory limits based on difficulty
const getMemoryLimit = () => {
switch (difficulty) {
case 'easy': return 0; // no memory
case 'medium': return 6; // limited memory
case 'hard': return 16; // perfect memory
}
};

// Update AI's memory when cards are revealed
const updateAiMemory = (symbol: string, index: number) => {
if (difficulty === 'easy') return; // easy AI has no memory

setAiMemory(prev => {
const newMemory = { ...prev };

if (!newMemory[symbol]) {
newMemory[symbol] = { symbol, indices: [] };
}

// Add index if not already there
if (!newMemory[symbol].indices.includes(index)) {
newMemory[symbol].indices.push(index);
}

// For medium difficulty, limit memory size
if (difficulty === 'medium') {
const allIndices = Object.values(newMemory).flatMap(entry => entry.indices);
if (allIndices.length > getMemoryLimit()) {
// Remove oldest memory entry
const oldestSymbol = Object.keys(newMemory)[0];
if (newMemory[oldestSymbol].indices.length === 1) {
delete newMemory[oldestSymbol];
} else {
newMemory[oldestSymbol].indices.shift(); // remove first index
}
}
}

return newMemory;
});
};

// Remove matched pairs from memory
const removeFromMemory = (symbol: string) => {
setAiMemory(prev => {
const newMemory = { ...prev };
delete newMemory[symbol];
return newMemory;
});
};

// Find a known matching pair in memory
const findKnownPair = (): [number, number] | null => {
for (const entry of Object.values(aiMemory)) {
if (entry.indices.length >= 2) {
const availableIndices = entry.indices.filter(index => 
!cards[index].isMatched && !cards[index].isFlipped
);
if (availableIndices.length >= 2) {
return [availableIndices[0], availableIndices[1]]; // found a pair!
}
}
}
return null; // no known pairs
};

// AI makes its move - this is where the magic happens
const makeAiMove = async () => {
setIsProcessing(true);

// AI "thinking" time - makes it feel more natural
await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

const availableCards = cards.map((card, index) => ({ card, index }))
.filter(({ card }) => !card.isMatched && !card.isFlipped);

let firstIndex: number;
let secondIndex: number;

if (difficulty !== 'easy') {
// Try to use memory first
const knownPair = findKnownPair();
if (knownPair) {
[firstIndex, secondIndex] = knownPair;
} else {
// No known pairs, pick randomly
const randomIndices = availableCards
.sort(() => Math.random() - 0.5)
.slice(0, 2)
.map(({ index }) => index);
[firstIndex, secondIndex] = randomIndices;
}
} else {
// Easy AI - always random
const randomIndices = availableCards
.sort(() => Math.random() - 0.5)
.slice(0, 2)
.map(({ index }) => index);
[firstIndex, secondIndex] = randomIndices;
}

if (firstIndex !== undefined && secondIndex !== undefined) {
const firstCard = cards[firstIndex];
const secondCard = cards[secondIndex];

// Flip first card
setCards(prevCards =>
prevCards.map((card, index) =>
index === firstIndex ? { ...card, isFlipped: true } : card
)
);
setFlippedCards([firstCard]);

// Wait a bit, then flip second card
await new Promise(resolve => setTimeout(resolve, 600));

setCards(prevCards =>
prevCards.map((card, index) =>
index === secondIndex ? { ...card, isFlipped: true } : card
)
);
setFlippedCards([firstCard, secondCard]);

setMoves(prev => prev + 1);

// Check for match after showing both cards
setTimeout(() => {
if (firstCard.symbol === secondCard.symbol) {
// AI got a match!
setCards(prevCards =>
prevCards.map((card, index) =>
[firstIndex, secondIndex].includes(index)
? { ...card, isMatched: true }
: card
)
);

setAiScore(prev => prev + 1);
setFlippedCards([]);
removeFromMemory(firstCard.symbol); // clean up memory

// Check if game is over
const totalMatches = playerScore + aiScore + 1;
if (totalMatches === 8) {
setWinner('ai');
setGameWon(true);
setIsProcessing(false);
return;
}

setIsProcessing(false); // AI continues turn
} else {
// No match - flip back and give turn to player
setCards(prevCards =>
prevCards.map((card, index) =>
[firstIndex, secondIndex].includes(index)
? { ...card, isFlipped: false }
: card
)
);
setFlippedCards([]);
setIsPlayerTurn(true);
setIsProcessing(false);
}
}, 1200); // give time to see the cards
} else {
// Shouldn't happen, but just in case
setIsProcessing(false);
setIsPlayerTurn(true);
}
};

// Handle player card clicks
const handleCardClick = (clickedCard: Card) => {
// Block clicks during AI turn or processing
if (!isPlayerTurn || isProcessing || flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) {
return;
}

const cardIndex = cards.findIndex(card => card.id === clickedCard.id);
updateAiMemory(clickedCard.symbol, cardIndex); // AI learns from player moves too

const newFlippedCards = [...flippedCards, clickedCard];
setFlippedCards(newFlippedCards);

setCards(prevCards =>
prevCards.map(card =>
card.id === clickedCard.id ? { ...card, isFlipped: true } : card
)
);

if (newFlippedCards.length === 2) {
setMoves(prev => prev + 1);
setIsProcessing(true); // prevent more clicks

setTimeout(() => {
if (newFlippedCards[0].symbol === newFlippedCards[1].symbol) {
// Player got a match!
setCards(prevCards =>
prevCards.map(card =>
newFlippedCards.some(flipped => flipped.id === card.id)
? { ...card, isMatched: true }
: card
)
);

setPlayerScore(prev => prev + 1);
setFlippedCards([]);
removeFromMemory(newFlippedCards[0].symbol);

// Check if game is over
const totalMatches = playerScore + 1 + aiScore;
if (totalMatches === 8) {
setWinner('human');
setGameWon(true);
setIsProcessing(false);
return;
}

setIsProcessing(false); // player continues
} else {
// No match - flip back and switch to AI
setCards(prevCards =>
prevCards.map(card =>
newFlippedCards.some(flipped => flipped.id === card.id)
? { ...card, isFlipped: false }
: card
)
);
setFlippedCards([]);
setIsPlayerTurn(false); // AI's turn now
setIsProcessing(false);
}
}, 1200);
}
};

// Trigger AI move when it's AI's turn
useEffect(() => {
if (!isPlayerTurn && !gameWon && !isProcessing && flippedCards.length === 0) {
const timer = setTimeout(() => {
makeAiMove();
}, 800); // slight delay before AI moves
return () => clearTimeout(timer);
}
}, [isPlayerTurn, gameWon, isProcessing, flippedCards.length]);

// Update AI memory when cards are flipped (by anyone)
useEffect(() => {
flippedCards.forEach(card => {
const cardIndex = cards.findIndex(c => c.id === card.id);
if (cardIndex !== -1) {
updateAiMemory(card.symbol, cardIndex);
}
});
}, [flippedCards]);

// Reset everything for new game
const resetGame = () => {
setCards(createCards());
setFlippedCards([]);
setIsPlayerTurn(true);
setIsProcessing(false);
setPlayerScore(0);
setAiScore(0);
setMoves(0);
setGameWon(false);
setWinner(null);
setAiMemory({}); // clear AI memory
};

// Game over screen
if (gameWon && winner) {
return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center relative overflow-hidden">
<RuneBackground />
<GlobalSettings />

<div className="relative z-10 bg-gradient-to-b from-amber-900/90 to-slate-800/90 backdrop-blur-sm p-8 rounded-lg border-4 border-amber-600 shadow-2xl max-w-md w-full mx-4 text-center">
<Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
<h1 className="text-3xl font-bold text-amber-100 mb-2">
{winner === 'human' ? t('victory') : t('defeat')}
</h1>
<h2 className="text-xl text-amber-300 mb-6">
{winner === 'human' 
? `${username} triumphs over the gods!` 
: `The ${getDifficultyName()} claims victory!`
}
</h2>

{/* Final scores */}
<div className="bg-slate-800/50 p-4 rounded-lg mb-6">
<div className={`flex justify-between items-center mb-2 ${
winner === 'human' ? 'text-amber-200 font-bold' : 'text-slate-300'
}`}>
<span className="flex items-center gap-2">
{winner === 'human' && <Trophy className="w-4 h-4 text-amber-400" />}
<User className="w-4 h-4" />
{username}
</span>
<span>{playerScore} matches</span>
</div>
<div className={`flex justify-between items-center mb-2 ${
winner === 'ai' ? 'text-amber-200 font-bold' : 'text-slate-300'
}`}>
<span className="flex items-center gap-2">
{winner === 'ai' && <Trophy className="w-4 h-4 text-amber-400" />}
<Bot className="w-4 h-4" />
{getDifficultyName()}
</span>
<span>{aiScore} matches</span>
</div>
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
{t('retry')}
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
<Bot className="w-5 h-5 text-amber-400" />
<h1 className="text-2xl font-bold text-amber-100">VS {getDifficultyName()}</h1>
</div>
<p className="text-amber-300 text-sm">
Turn: {isPlayerTurn ? username : 'AI'}
{isProcessing && ' (processing...)'}
</p>
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
<div className={`text-center p-3 rounded-lg transition-all ${
isPlayerTurn && !isProcessing
? 'bg-amber-600/30 border-2 border-amber-400' 
: 'bg-slate-800/30'
}`}>
<div className="flex items-center gap-2 justify-center mb-1">
<User className="w-4 h-4 text-amber-400" />
<span className="text-sm text-amber-300">{username}</span>
</div>
<div className="text-xl font-bold text-amber-100">{playerScore}</div>
</div>

<div className={`text-center p-3 rounded-lg transition-all ${
!isPlayerTurn || isProcessing
? 'bg-amber-600/30 border-2 border-amber-400' 
: 'bg-slate-800/30'
}`}>
<div className="flex items-center gap-2 justify-center mb-1">
<Bot className="w-4 h-4 text-amber-400" />
<span className="text-sm text-amber-300">AI</span>
</div>
<div className="text-xl font-bold text-amber-100">{aiScore}</div>
</div>
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

export default AIGame;