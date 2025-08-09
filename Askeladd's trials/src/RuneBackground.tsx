import React from 'react';

// Norse runes for the background effect
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

// Animated rune background - adds atmosphere
const RuneBackground: React.FC = () => {
return (
<div className="absolute inset-0 overflow-hidden pointer-events-none">
{Array.from({ length: 30 }).map((_, i) => (
<div
key={i}
className="absolute text-amber-700/20 text-6xl animate-pulse"
style={{
left: `${Math.random() * 100}%`,
top: `${Math.random() * 100}%`,
animationDelay: `${Math.random() * 4}s`,
animationDuration: `${3 + Math.random() * 4}s`, // random duration
transform: `rotate(${Math.random() * 360}deg)`,
}}
>
{RUNES[Math.floor(Math.random() * RUNES.length)]}
</div>
))} {/* end of rune generation */}
</div>
);
};

export default RuneBackground;