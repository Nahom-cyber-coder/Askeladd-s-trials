import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import ModeSelection from './ModeSelection';
import SinglePlayerGame from './SinglePlayerGame';
import MultiplayerSetup from './MultiplayerSetup';
import MultiplayerGame from './MultiplayerGame';
import AISetup from './AISetup';
import AIGame from './AIGame';
import { GameMode, Player, AIDifficulty } from './game';

// Main app component - this is where all the magic happens
function App() {
const [currentUser, setCurrentUser] = useState<string>('');
const [gameMode, setGameMode] = useState<GameMode>('menu');
const [players, setPlayers] = useState<Player[]>([]);
const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('easy'); // default to easy mode

// Handle user login - pretty straightforward
const handleLogin = (username: string) => {
setCurrentUser(username);
setGameMode('menu'); // always go to menu after login
};

// Logout and reset everything back to initial state
const handleLogout = () => {
setCurrentUser('');
setGameMode('menu');
setPlayers([]); // clear the player list too
};

const handleModeSelect = (mode: GameMode) => {
setGameMode(mode);
};

// This handles the multiplayer setup completion
const handleMultiplayerSetup = (playerList: Player[]) => {
setPlayers(playerList);
setGameMode('multiplayer-game'); // jump straight to the game
};

const handleAISetup = (difficulty: AIDifficulty) => {
setAiDifficulty(difficulty);
setGameMode('ai-game');
};

// Go back to main menu - used everywhere
const handleBackToMenu = () => {
setGameMode('menu');
setPlayers([]); // reset players when going back
};

// If no user logged in, show login screen
if (!currentUser) {
return <LoginScreen onLogin={handleLogin} />;
}

return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900">
{gameMode === 'menu' && (
<ModeSelection 
username={currentUser}
onModeSelect={handleModeSelect}
onLogout={handleLogout}
/>
)}
{gameMode === 'single-player' && (
<SinglePlayerGame 
username={currentUser}
onBackToMenu={handleBackToMenu}
onLogout={handleLogout}
/>
)}
{gameMode === 'multiplayer-setup' && (
<MultiplayerSetup 
currentUser={currentUser}
onSetupComplete={handleMultiplayerSetup}
onBackToMenu={handleBackToMenu}
/>
)}
{gameMode === 'multiplayer-game' && (
<MultiplayerGame 
players={players}
onBackToMenu={handleBackToMenu}
onLogout={handleLogout}
/>
)}
{gameMode === 'ai-setup' && (
<AISetup 
onDifficultySelect={handleAISetup}
onBackToMenu={handleBackToMenu}
/>
)}
{gameMode === 'ai-game' && (
<AIGame 
username={currentUser}
difficulty={aiDifficulty}
onBackToMenu={handleBackToMenu}
onLogout={handleLogout}
/>
)} {/* end of ai-game mode */}
</div>
);
}

export default App;