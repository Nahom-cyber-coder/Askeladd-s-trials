import React, { useState } from 'react';
import { Sword, Shield } from 'lucide-react';
import RuneBackground from './RuneBackground';

interface LoginScreenProps {
onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
const [username, setUsername] = useState('');

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (username.trim()) {
onLogin(username.trim());
}
};

return (
<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-amber-900 flex items-center justify-center relative overflow-hidden">
<RuneBackground />

{/* Viking longship silhouette background */}
<div className="absolute inset-0 opacity-5">
<img 
src="https://images.pexels.com/photos/1002779/pexels-photo-1002779.jpeg" 
alt="Viking ship"
className="w-full h-full object-cover"
/>
</div>

<div className="relative z-10 bg-gradient-to-b from-amber-900/90 to-slate-800/90 backdrop-blur-sm p-12 rounded-lg border-4 border-amber-600 shadow-2xl max-w-md w-full mx-4">
<div className="text-center mb-8">
<div className="flex items-center justify-center gap-4 mb-6">
<Sword className="w-8 h-8 text-amber-400 transform -rotate-45" />
<h1 className="text-4xl font-bold text-amber-100 font-serif tracking-wide">
ASKELADD'S
</h1>
<Shield className="w-8 h-8 text-amber-400" />
</div>
<h2 className="text-2xl text-amber-200 font-serif mb-2">TRIALS</h2>
<p className="text-amber-300 text-sm italic">Memory of the North</p>
<div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto mt-4"></div>
</div>

<form onSubmit={handleSubmit} className="space-y-6">
<div>
<label htmlFor="username" className="block text-amber-200 text-sm font-semibold mb-3 tracking-wide">
ENTER YOUR NAME, WARRIOR
</label>
<input
type="text"
id="username"
value={username}
onChange={(e) => setUsername(e.target.value)}
className="w-full px-4 py-3 bg-slate-800/80 border-2 border-amber-600/50 rounded-md text-amber-100 placeholder-amber-400/60 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all font-semibold tracking-wide"
placeholder="Your Viking name..."
required
/>
</div>
<button
type="submit"
className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-amber-100 font-bold py-4 px-8 rounded-md border-2 border-amber-500 shadow-lg transform hover:scale-105 transition-all duration-200 tracking-widest"
>
BEGIN TRIALS
</button>
</form>

<div className="mt-8 text-center">
<p className="text-amber-300/80 text-xs italic">
"The sea calls to us. Let us set sail."
</p>
</div>
</div>
</div>
);
};

export default LoginScreen;