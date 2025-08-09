import React from 'react';
import { ArrowLeft, Zap, Shield, Flame } from 'lucide-react';
import { AIDifficulty } from './game';
import RuneBackground from './RuneBackground';
import GlobalSettings from './GlobalSettings';
import { useText } from './texts';

interface AISetupProps {
onDifficultySelect: (difficulty: AIDifficulty) => void;
onBackToMenu: () => void;
}

// AI difficulty selection screen
const AISetup: React.FC<AISetupProps> = ({ onDifficultySelect, onBackToMenu }) => {
const { t } = useText();

// Difficulty configurations with icons and colors
const difficulties = [
{
level: 'easy' as AIDifficulty,
name: t('mortalFool'),
description: t('randomGuesses'),
icon: Zap,
color: 'from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 border-green-500'
},
{
level: 'medium' as AIDifficulty,
name: t('cunningWarrior'),
description: t('occasionalMemory'),
icon: Shield,
color: 'from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 border-amber-500'
},
{
level: 'hard' as AIDifficulty,
name: t('divineIntellect'),
description: t('perfectMemory'),
icon: Flame,
color: 'from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-red-500'
}
];

return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center relative overflow-hidden">
<RuneBackground />
<GlobalSettings />

<div className="relative z-10 bg-gradient-to-b from-amber-900/90 to-slate-800/90 backdrop-blur-sm p-8 rounded-lg border-4 border-amber-600 shadow-2xl max-w-lg w-full mx-4">
<div className="text-center mb-8">
<h1 className="text-3xl font-bold text-amber-100 mb-4">{t('faceTheGods')}</h1>
<p className="text-amber-300">Choose your divine opponent</p>
<div className="w-32 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mt-4"></div>
</div>

{/* Difficulty selection buttons */}
<div className="space-y-4 mb-8">
{difficulties.map((diff) => {
const IconComponent = diff.icon;
return (
<button
key={diff.level}
onClick={() => onDifficultySelect(diff.level)}
className={`w-full group bg-gradient-to-r ${diff.color} p-6 rounded-lg border-2 transform hover:scale-105 transition-all duration-200 shadow-lg`}
>
<div className="flex items-center gap-4">
<IconComponent className="w-8 h-8 text-white" />
<div className="text-left flex-1">
<h3 className="text-xl font-bold text-white mb-1">{diff.name}</h3>
<p className="text-white/80 text-sm">{diff.description}</p>
</div>
</div>
</button>
);
})}
</div>

<div className="text-center">
<button
onClick={onBackToMenu}
className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 font-semibold py-3 px-6 rounded-md border-2 border-slate-500 transform hover:scale-105 transition-all duration-200"
>
<ArrowLeft className="w-4 h-4" />
{t('backToMenu')}
</button>
</div>

{/* Flavor text */}
<div className="mt-6 text-center">
<p className="text-amber-300/80 text-xs italic">
"{t('evenGods')}"
</p>
</div>
</div>
</div>
);
};

export default AISetup;