import React from 'react';
import { Card } from './game';

interface MemoryCardProps {
card: Card;
onClick: () => void;
}

// Individual memory card component with flip animation
const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick }) => {
return (
<div
className="relative w-full aspect-square cursor-pointer transform transition-all duration-300 hover:scale-105"
onClick={onClick}
>
{/* 3D flip container */}
<div
className={`absolute inset-0 w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
}`}
>
{/* Card back - shows rune symbol */}
<div className="absolute inset-0 w-full h-full backface-hidden rounded-lg border-4 border-amber-600 bg-gradient-to-br from-slate-800 to-slate-700 shadow-lg flex items-center justify-center">
<div className="text-4xl text-amber-400 opacity-60">ᚦ</div>
</div>

{/* Card front - shows the actual symbol */}
<div className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg border-4 shadow-lg flex items-center justify-center text-4xl ${
card.isMatched 
? 'border-green-500 bg-gradient-to-br from-green-800 to-green-700' // matched cards get green
: 'border-amber-600 bg-gradient-to-br from-amber-900 to-amber-800'
}`}>
{card.symbol}
</div>
</div>
</div>
);
};

export default MemoryCard;