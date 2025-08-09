import React, { createContext, useContext, useState, useEffect } from 'react';

type TextMode = 'viking' | 'normal';

// Context for managing text mode globally
const TextContext = createContext<{
mode: TextMode;
toggleMode: () => void;
}>({
mode: 'viking',
toggleMode: () => {},
});

export const TextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [mode, setMode] = useState<TextMode>('viking'); // default to viking mode

// Load saved preference on mount
useEffect(() => {
const stored = localStorage.getItem('askeladd-text-mode');
if (stored) {
setMode(stored as TextMode);
}
}, []);

const toggleMode = () => {
setMode((prev) => {
const newMode = prev === 'viking' ? 'normal' : 'viking';
localStorage.setItem('askeladd-text-mode', newMode); // save it
return newMode;
});
};

return (
<TextContext.Provider value={{ mode, toggleMode }}>
{children}
</TextContext.Provider>
);
};

export const useTextMode = () => useContext(TextContext);