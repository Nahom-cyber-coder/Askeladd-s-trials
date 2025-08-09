import React from 'react';
import { User, Users, Bot, LogOut, Sword, Shield } from 'lucide-react';
import { GameMode } from './game';
import RuneBackground from './RuneBackground';
import HighScoreBanner from './HighScoreBanner';
import GlobalSettings from './GlobalSettings';
import { useText } from './texts';

interface ModeSelectionProps {
username: string;
onModeSelect: (mode: GameMode) => void;
onLogout: () => void;
}

// Main menu where users choose their game mode
const ModeSelection: React.FC<ModeSelectionProps> = ({ username, onModeSelect, onLogout }) => {
const { t } = useText();

return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center relative overflow-hidden">
<RuneBackground />
<GlobalSettings />

{/* Wood texture background for authenticity */}
<div className="absolute inset-0 opacity-10">
<img 
src="https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg" 
alt="Wood texture"
className="w-full h-full object-cover"
/>
</div>

<div className="relative z-10 bg-gradient-to-b from-amber-900/90 to-slate-800/90 backdrop-blur-sm p-8 rounded-lg border-4 border-amber-600 shadow-2xl max-w-2xl w-full mx-4">
<HighScoreBanner />

<div className="text-center mb-8">
<div className="flex items-center justify-center gap-4 mb-4">
<Sword className="w-6 h-6 text-amber-400 transform -rotate-45" />
<h1 className="text-3xl font-bold text-amber-100 font-serif tracking-wide">
{t('welcome')}, {username.toUpperCase()}
</h1>
<Shield className="w-6 h-6 text-amber-400" />
</div>
<p className="text-amber-300 italic">{t('choosePath')}</p>
<div className="w-32 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mt-4"></div>
</div>

{/* Game mode selection buttons */}
<div className="grid gap-6 mb-8">
<button
onClick={() => onModeSelect('single-player')}
className="group bg-gradient-to-r from-slate-700 to-slate-600 hover:from-amber-700 hover:to-amber-600 p-6 rounded-lg border-2 border-amber-600/50 hover:border-amber-400 transform hover:scale-105 transition-all duration-200 shadow-lg"
>
<div className="flex items-center gap-4">
<User className="w-8 h-8 text-amber-400 group-hover:text-amber-200" />
<div className="text-left">
<h3 className="text-xl font-bold text-amber-100 mb-1">{t('soloQuest')}</h3>
<p className="text-amber-300 text-sm">{t('soloQuestDesc')}</p>
</div>
</div>
</button>

<button
onClick={() => onModeSelect('multiplayer-setup')}
className="group bg-gradient-to-r from-slate-700 to-slate-600 hover:from-amber-700 hover:to-amber-600 p-6 rounded-lg border-2 border-amber-600/50 hover:border-amber-400 transform hover:scale-105 transition-all duration-200 shadow-lg"
>
<div className="flex items-center gap-4">
<Users className="w-8 h-8 text-amber-400 group-hover:text-amber-200" />
<div className="text-left">
<h3 className="text-xl font-bold text-amber-100 mb-1">{t('warriorDuel')}</h3>
<p className="text-amber-300 text-sm">{t('warriorDuelDesc')}</p>
</div>
</div>
</button>

<button
onClick={() => onModeSelect('ai-setup')}
className="group bg-gradient-to-r from-slate-700 to-slate-600 hover:from-amber-700 hover:to-amber-600 p-6 rounded-lg border-2 border-amber-600/50 hover:border-amber-400 transform hover:scale-105 transition-all duration-200 shadow-lg"
>
<div className="flex items-center gap-4">
<Bot className="w-8 h-8 text-amber-400 group-hover:text-amber-200" />
<div className="text-left">
<h3 className="text-xl font-bold text-amber-100 mb-1">{t('faceTheGods')}</h3>
<p className="text-amber-300 text-sm">{t('faceTheGodsDesc')}</p>
</div>
</div>
</button>
</div>

{/* Logout button */}
<div className="text-center">
<button
onClick={onLogout}
className="inline-flex items-center gap-2 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-red-100 font-semibold py-3 px-6 rounded-md border-2 border-red-600 transform hover:scale-105 transition-all duration-200"
>
<LogOut className="w-4 h-4" />
{t('abandonQuest')}
</button>
</div>

{/* Flavor text */}
<div className="mt-6 text-center">
<p className="text-amber-300/80 text-xs italic">
"A true warrior tests their mind as well as their blade."
</p>
</div>
</div>
</div>
);
};

export default ModeSelection;