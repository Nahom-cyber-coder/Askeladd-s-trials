import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Play } from 'lucide-react';
import { Player } from './game';
import RuneBackground from './RuneBackground';
import GlobalSettings from './GlobalSettings';
import { useText } from './texts';

interface MultiplayerSetupProps {
currentUser: string;
onSetupComplete: (players: Player[]) => void;
onBackToMenu: () => void;
}

// Setup screen for multiplayer - get player 2 name
const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({ 
currentUser, 
onSetupComplete, 
onBackToMenu 
}) => {
const [player2Name, setPlayer2Name] = useState('');
const { t } = useText();

const handleStartGame = () => {
if (!player2Name.trim()) return; // need a name first

// Create player objects
const players: Player[] = [
{ id: '1', username: currentUser, score: 0 },
{ id: '2', username: player2Name.trim(), score: 0 }
];

onSetupComplete(players);
};

return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center relative overflow-hidden">
<RuneBackground />
<GlobalSettings />

<div className="relative z-10 bg-gradient-to-b from-amber-900/90 to-slate-800/90 backdrop-blur-sm p-8 rounded-lg border-4 border-amber-600 shadow-2xl max-w-md w-full mx-4">
<div className="text-center mb-8">
<h1 className="text-3xl font-bold text-amber-100 mb-4">{t('warriorDuel')}</h1>
<p className="text-amber-300">Prepare for battle</p>
<div className="w-32 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mt-4"></div>
</div>

<div className="space-y-6 mb-8">
{/* Player 1 - already set */}
<div className="bg-slate-800/50 p-4 rounded-lg border-2 border-green-600/50">
<div className="flex items-center gap-3">
<UserPlus className="w-5 h-5 text-green-400" />
<div>
<div className="text-green-400 text-sm font-semibold">{t('player1')}</div>
<div className="text-amber-100 font-bold">{currentUser}</div>
</div>
</div>
</div>

{/* Player 2 input */}
<div className="bg-slate-800/50 p-4 rounded-lg border-2 border-amber-600/50">
<label className="block text-amber-200 text-sm font-semibold mb-2">
{t('player2Name')}
</label>
<input
type="text"
value={player2Name}
onChange={(e) => setPlayer2Name(e.target.value)}
className="w-full px-3 py-2 bg-slate-700/80 border-2 border-amber-600/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
placeholder="Enter warrior name..."
required
/>
</div>
</div>

<div className="flex gap-4">
<button
onClick={onBackToMenu}
className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 font-semibold py-3 px-4 rounded-md border-2 border-slate-500 transform hover:scale-105 transition-all duration-200"
>
<ArrowLeft className="w-4 h-4" />
{t('back')}
</button>

<button
onClick={handleStartGame}
disabled={!player2Name.trim()}
className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 text-amber-100 font-bold py-3 px-4 rounded-md border-2 border-amber-500 disabled:border-gray-600 transform hover:scale-105 disabled:transform-none transition-all duration-200"
>
<Play className="w-4 h-4" />
{t('battle')}
</button>
</div>

{/* Flavor text */}
<div className="mt-6 text-center">
<p className="text-amber-300/80 text-xs italic">
"{t('twoWarriors')}"
</p>
</div>
</div>
</div>
);
};

export default MultiplayerSetup;