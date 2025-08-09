import React from 'react';
import { Settings } from 'lucide-react';
import { useTextMode } from './TextContext';

// Global settings button - appears on every page
const GlobalSettings: React.FC = () => {
const { mode, toggleMode } = useTextMode();

return (
<div className="fixed top-4 right-4 z-50">
<div className="flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 px-4 py-2 rounded-full border-2 border-slate-500 shadow-lg transition-all duration-200">
<Settings className="w-4 h-4" />
<span className="text-sm font-semibold">Viking Text:</span>
{/* Toggle switch for viking text mode */}
<button
onClick={toggleMode}
className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
mode === 'viking' ? 'bg-amber-600' : 'bg-slate-600'
}`}
>
<span
className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
mode === 'viking' ? 'translate-x-5' : 'translate-x-1'
}`}
/>
</button>
<span className="text-xs text-slate-300">
{mode === 'viking' ? 'ON' : 'OFF'}
</span>
</div>
</div>
);
};

export default GlobalSettings;