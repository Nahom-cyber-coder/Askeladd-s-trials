import { useTextMode } from './TextContext';

// Central translation system - all text goes through here
export const useText = () => {
const { mode } = useTextMode();

const t = (key: string) => {
const translations = {
enterName: {
viking: 'ENTER YOUR NAME, WARRIOR',
normal: 'Enter Your Name',
},
beginTrials: {
viking: 'BEGIN TRIALS',
normal: 'Start Game',
},
welcome: {
viking: 'WELCOME',
normal: 'Welcome',
},
choosePath: {
viking: 'Choose your path, warrior',
normal: 'Choose your game mode',
},
soloQuest: {
viking: 'SOLO QUEST',
normal: 'Single Player',
},
soloQuestDesc: {
viking: 'Test your memory against time',
normal: 'Play alone against the clock',
},
warriorDuel: {
viking: 'WARRIOR DUEL',
normal: 'Multiplayer',
},
warriorDuelDesc: {
viking: 'Challenge another warrior',
normal: 'Play against another player',
},
faceTheGods: {
viking: 'FACE THE GODS',
normal: 'Play vs AI',
},
faceTheGodsDesc: {
viking: 'Battle against divine intelligence',
normal: 'Challenge the computer',
},
abandonQuest: {
viking: 'ABANDON QUEST',
normal: 'Logout',
},
back: {
viking: 'BACK',
normal: 'Back',
},
logout: {
viking: 'LOGOUT',
normal: 'Logout',
},
prepareForBattle: {
viking: 'PREPARE FOR BATTLE',
normal: 'Get Ready',
},
timeLimit: {
viking: 'Time Limit:',
normal: 'Time Limit:',
},
seconds: {
viking: 'seconds',
normal: 'seconds',
},
beginQuest: {
viking: 'BEGIN QUEST',
normal: 'Start Game',
},
changeTime: {
viking: 'CHANGE TIME',
normal: 'Change Time',
},
chooseDuration: {
viking: 'Choose your trial duration:',
normal: 'Select time limit:',
},
moves: {
viking: 'Moves',
normal: 'Moves',
},
matches: {
viking: 'Matches',
normal: 'Matches',
},
timeLeft: {
viking: 'Time Left',
normal: 'Time Left',
},
victory: {
viking: 'VICTORY!',
normal: 'Victory!',
},
newRecord: {
viking: 'NEW RECORD!',
normal: 'New Record!',
},
timeExpired: {
viking: 'TIME EXPIRED!',
normal: 'Time Up!',
},
hallOfFame: {
viking: 'HALL OF FAME',
normal: 'Hall of Fame',
},
wellFought: {
viking: 'Well fought, {name}! Your memory serves you well.',
normal: 'Good job, {name}! You completed the game.',
},
timeUp: {
viking: 'The gods have spoken, {name}. Time has run out.',
normal: 'Time\'s up, {name}! Try again.',
},
again: {
viking: 'AGAIN',
normal: 'Play Again',
},
menu: {
viking: 'MENU',
normal: 'Menu',
},
time: {
viking: 'Time:',
normal: 'Time:',
},
player1: {
viking: 'PLAYER 1',
normal: 'Player 1',
},
player2Name: {
viking: 'PLAYER 2 NAME',
normal: 'Player 2 Name',
},
battle: {
viking: 'BATTLE',
normal: 'Start Battle',
},
twoWarriors: {
viking: 'Two warriors enter, one emerges victorious.',
normal: 'Two players compete for victory.',
},
rematch: {
viking: 'REMATCH',
normal: 'Play Again',
},
mortalFool: {
viking: 'MORTAL FOOL',
normal: 'Easy',
},
cunningWarrior: {
viking: 'CUNNING WARRIOR',
normal: 'Medium',
},
divineIntellect: {
viking: 'DIVINE INTELLECT',
normal: 'Hard',
},
randomGuesses: {
viking: 'Random guesses, no memory',
normal: 'Random moves, no strategy',
},
occasionalMemory: {
viking: 'Occasional memory, tactical thinking',
normal: 'Some memory, basic strategy',
},
perfectMemory: {
viking: 'Near-perfect memory, godlike strategy',
normal: 'Perfect memory, advanced strategy',
},
evenGods: {
viking: 'Even the gods can be challenged by a brave heart.',
normal: 'Challenge yourself against the computer.',
},
backToMenu: {
viking: 'BACK TO MENU',
normal: 'Back to Menu',
},
retry: {
viking: 'RETRY',
normal: 'Try Again',
},
defeat: {
viking: 'DEFEAT!',
normal: 'You Lost!',
},
soloQuestMode: {
viking: 'Solo Quest',
normal: 'Single Player',
},
};

const translation = translations[key as keyof typeof translations];
if (!translation) return key; // fallback to key if not found

return translation[mode] || key;
};

return { t };
};