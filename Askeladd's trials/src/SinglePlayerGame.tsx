import React, { useState, useEffect } from 'react';
import { ArrowLeft, LogOut, RotateCcw, Trophy, Crown, Clock, Settings as SettingsIcon } from 'lucide-react';
import { Card, createCards, updateHighScore, HighScore, getSettings } from './game';
import MemoryCard from './MemoryCard';
import RuneBackground from './RuneBackground';
import HighScoreBanner from './HighScoreBanner';
import GlobalSettings from './GlobalSettings';
import { useText } from './texts';

interface SinglePlayerGameProps {
username: string;
onBackToMenu: () => void;
onLogout: () => void;
}

// Single player game with timer - the classic mode
const SinglePlayerGame: React.FC<SinglePlayerGameProps> = ({ username, onBackToMenu, onLogout }) => {
const { t } = useText();
const [cards, setCards] = useState<Card[]>(createCards());
const [flippedCards, setFlippedCards] = useState<Card[]>([]);
const [showTimeSettings, setShowTimeSettings] = useState(false);
const [timeLimit, setTimeLimit] = useState(getSettings().timeLimit);
const [timeLeft, setTimeLeft] = useState(getSettings().timeLimit);
const [gameStarted, setGameStarted] = useState(false);
const [gameEnded, setGameEnded] = useState(false);
const [moves, setMoves] = useState(0);
const [matches, setMatches] = useState(0);
const [gameWon, setGameWon] = useState(false);
const [startTime] = useState(Date.now()); // track when game started
const [endTime, setEndTime] = useState<number | null>(null);
const [isNewHighScore, setIsNewHighScore] = useState(false);

// Timer countdown effect
useEffect(() => {
let timer: NodeJS.Timeout;
if (gameStarted && !gameEnded && timeLeft > 0) {
timer = setTimeout(() => {
setTimeLeft(prev => {
if (prev <= 1) {
setGameEnded(true);
setEndTime(Date.now());
return 0; // time's up!
}
return prev - 1;
});
}, 1000);
}
return () => clearTimeout(timer);
}, [gameStarted, gameEnded, timeLeft]);

const startGame = () => {
setGameStarted(true);
setTimeLeft(timeLimit); // reset timer
};

// Change time limit and close settings
const changeTimeLimit = (newLimit: number) => {
setTimeLimit(newLimit);
setTimeLeft(newLimit);
setShowTimeSettings(false);
};

const handleCardClick = (clickedCard: Card) => {
// Don't allow clicks if game not started, ended, or during processing
if (!gameStarted || gameEnded || flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched || timeLeft === 0) {
return;
}

const newFlippedCards = [...flippedCards, clickedCard];
setFlippedCards(newFlippedCards);

// Flip the card
setCards(prevCards =>
prevCards.map(card =>
card.id === clickedCard.id ? { ...card, isFlipped: true } : card
)
);

if (newFlippedCards.length === 2) {
setMoves(prev => prev + 1); // count the move

if (newFlippedCards[0].symbol === newFlippedCards[1].symbol) {
// It's a match!
setTimeout(() => {
setCards(prevCards =>
prevCards.map(card =>
newFlippedCards.some(flipped => flipped.id === card.id)
? { ...card, isMatched: true }
: card
)
);
setMatches(prev => prev + 1);
setFlippedCards([]);

// Check if game is won (all 8 pairs matched)
if (matches + 1 === 8) {
setGameWon(true);
setGameEnded(true);
setEndTime(Date.now());

// Check for high score
const finalScore: HighScore = {
score: matches + 1,
moves: moves,
time: Math.floor((Date.now() - startTime) / 1000),
mode: 'single',
playerName: username
};

const isHigh = updateHighScore(finalScore);
setIsNewHighScore(isHigh);

if (isHigh) {
window.dispatchEvent(new Event('highScoreUpdate')); // notify other components
}
}
}, 1000);
} else {
// Not a match - flip back after delay
setTimeout(() => {
setCards(prevCards =>
prevCards.map(card =>
newFlippedCards.some(flipped => flipped.id === card.id)
? { ...card, isFlipped: false }
: card
)
);
setFlippedCards([]);
}, 1000);
}
}
};

// Reset everything for new game
const resetGame = () => {
setCards(createCards());
setFlippedCards([]);
setGameStarted(false);
setGameEnded(false);
setTimeLeft(timeLimit);
setMoves(0);
setMatches(0);
setGameWon(false);
setEndTime(null);
setIsNewHighScore(false);
};

const getGameTime = () => {
if (!endTime) return 0;
return Math.floor((endTime - startTime) / 1000);
};

// Game over screen
if (gameWon || (gameEnded && !gameWon)) {
return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center relative overflow-hidden">
<RuneBackground />
<GlobalSettings />

<div className="relative z-10 bg-gradient-to-b from-amber-900/90 to-slate-800/90 backdrop-blur-sm p-8 rounded-lg border-4 border-amber-600 shadow-2xl max-w-md w-full mx-4 text-center">
<Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
<h1 className="text-3xl font-bold text-amber-100 mb-2">
{gameWon 
? (isNewHighScore ? t('newRecord') : t('victory'))
: t('timeExpired')
}
</h1>
{isNewHighScore && (
<div className="flex items-center justify-center gap-2 mb-4">
<Crown className="w-5 h-5 text-amber-400" />
<span className="text-amber-300 font-bold">{t('hallOfFame')}</span>
<Crown className="w-5 h-5 text-amber-400" />
</div>
)}
<p className="text-amber-300 mb-6">
{gameWon 
? t('wellFought').replace('{name}', username)
: t('timeUp').replace('{name}', username)
}
</p>

{/* Game stats */}
<div className="bg-slate-800/50 p-4 rounded-lg mb-6">
<div className="flex justify-between text-amber-200 mb-2">
<span>{t('moves')}:</span>
<span className="font-bold">{moves}</span>
</div>
<div className="flex justify-between text-amber-200 mb-2">
<span>{t('matches')}:</span>
<span className="font-bold">{matches}</span>
</div>
<div className="flex justify-between text-amber-200">
<span>{t('time')}</span>
<span className="font-bold">{getGameTime()}s</span>
</div>
</div>

<div className="flex gap-4">
<button
onClick={resetGame}
className="flex-1 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 font-bold py-3 px-4 rounded-md border-2 border-amber-500 transform hover:scale-105 transition-all duration-200"
>
<RotateCcw className="w-4 h-4 inline mr-2" />
{t('again')}
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

{/* Header with navigation */}
<div className="flex justify-between items-center mb-6">
<button
onClick={onBackToMenu}
className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 font-semibold py-2 px-4 rounded-md border-2 border-slate-500 transform hover:scale-105 transition-all duration-200"
>
<ArrowLeft className="w-4 h-4" />
{t('back')}
</button>

<div className="text-center">
<h1 className="text-2xl font-bold text-amber-100 mb-1">{username.toUpperCase()}</h1>
<p className="text-amber-300 text-sm">{t('soloQuestMode')}</p>
</div>

<button
onClick={onLogout}
className="inline-flex items-center gap-2 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-red-100 font-semibold py-2 px-4 rounded-md border-2 border-red-600 transform hover:scale-105 transition-all duration-200"
>
<LogOut className="w-4 h-4" />
{t('logout')}
</button>
</div>

{/* Pre-game setup */}
{!gameStarted ? (
<div className="bg-gradient-to-r from-amber-900/80 to-slate-800/80 backdrop-blur-sm p-6 rounded-lg border-2 border-amber-600/50 mb-6 text-center">
<h2 className="text-2xl font-bold text-amber-100 mb-4">
{t('prepareForBattle')}
</h2>
<div className="flex items-center justify-center gap-2 mb-4">
<Clock className="w-5 h-5 text-amber-400" />
<span className="text-amber-200">
{t('timeLimit')} {timeLimit} {t('seconds')}
</span>
</div>
<div className="flex gap-4 justify-center">
<button
onClick={startGame}
className="bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 font-bold py-3 px-6 rounded-md border-2 border-amber-500 transform hover:scale-105 transition-all duration-200"
>
{t('beginQuest')}
</button>
<button
onClick={() => setShowTimeSettings(!showTimeSettings)}
className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 font-semibold py-3 px-6 rounded-md border-2 border-slate-500 transform hover:scale-105 transition-all duration-200"
>
<SettingsIcon className="w-4 h-4 inline mr-2" />
{t('changeTime')}
</button>
</div>
{/* Time selection dropdown */}
{showTimeSettings && (
<div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-amber-600/30">
<p className="text-amber-200 mb-3">{t('chooseDuration')}</p>
<div className="flex gap-2 justify-center">
{[10, 30, 60, 120].map((time) => (
<button
key={time}
onClick={() => changeTimeLimit(time)}
className={`py-2 px-4 rounded-md border-2 font-semibold transition-all ${
timeLimit === time
? 'bg-amber-600 border-amber-400 text-amber-100'
: 'bg-slate-700 border-slate-500 text-slate-300 hover:border-amber-500'
}`}
>
{time}s
</button>
))}
</div>
</div>
)}
</div>
) : (
// Game HUD during play
<div className="bg-gradient-to-r from-amber-900/80 to-slate-800/80 backdrop-blur-sm p-4 rounded-lg border-2 border-amber-600/50 mb-6">
<div className="flex justify-center gap-8 text-amber-100">
<div className="text-center">
<div className="text-2xl font-bold">{moves}</div>
<div className="text-sm text-amber-300">{t('moves')}</div>
</div>
<div className="text-center">
<div className="text-2xl font-bold">{matches}/8</div>
<div className="text-sm text-amber-300">{t('matches')}</div>
</div>
<div className="text-center">
<div className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400' : ''}`}>
{timeLeft}
</div>
<div className="text-sm text-amber-300">{t('timeLeft')}</div>
</div>
</div>
</div>
)}

{/* Game board */}
{gameStarted && (
<div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
{cards.map((card) => (
<MemoryCard
key={card.id}
card={card}
onClick={() => handleCardClick(card)}
/>
))}
</div>
)}
</div>
</div>
);
};

export default SinglePlayerGame;