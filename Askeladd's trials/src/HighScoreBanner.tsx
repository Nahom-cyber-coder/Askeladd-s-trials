import React, { useState, useEffect } from 'react';
import { Trophy, Crown } from 'lucide-react';
import { HighScore, getHighScore } from './game';

// High score banner - shows the best achievement
const HighScoreBanner: React.FC = () => {
const [highScore, setHighScore] = useState<HighScore | null>(null);

useEffect(() => {
const updateHighScore = () => {
setHighScore(getHighScore());
};

updateHighScore(); // initial load

// Check for updates periodically - probably overkill but works
const interval = setInterval(updateHighScore, 1000);

// Listen for storage changes and custom events
window.addEventListener('storage', updateHighScore);
window.addEventListener('highScoreUpdate', updateHighScore);

return () => {
clearInterval(interval);
window.removeEventListener('storage', updateHighScore);
window.removeEventListener('highScoreUpdate', updateHighScore);
}; // cleanup listeners
}, []);

// Show placeholder if no high score yet
if (!highScore) {
return (
<div className="bg-gradient-to-r from-amber-900/60 to-slate-800/60 backdrop-blur-sm border-2 border-amber-600/30 rounded-lg p-3 mb-4">
<div className="flex items-center justify-center gap-2 text-amber-300">
<Crown className="w-5 h-5" />
<span className="font-bold text-sm">NO CHAMPION YET</span>
</div>
</div>
);
}

// Convert mode to display string
const getModeDisplay = () => {
switch (highScore.mode) {
case 'single': return 'SOLO QUEST';
case 'multiplayer': return 'WARRIOR DUEL';
case 'ai': return `VS ${highScore.difficulty?.toUpperCase()}`;
default: return 'UNKNOWN'; // shouldn't happen
}
};

return (
<div className="bg-gradient-to-r from-amber-900/80 to-slate-800/80 backdrop-blur-sm border-2 border-amber-500 rounded-lg p-3 mb-4 shadow-lg">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<Trophy className="w-5 h-5 text-amber-400" />
<span className="font-bold text-amber-100 text-sm">HALL OF FAME</span>
</div>
<div className="text-right">
<div className="text-amber-200 font-bold text-lg">{highScore.score} MATCHES</div>
<div className="text-amber-300 text-xs">
{highScore.playerName} • {getModeDisplay()} • {highScore.moves} moves
{highScore.time && ` • ${highScore.time}s`}
</div>
</div>
</div>
</div>
);
};

export default HighScoreBanner;