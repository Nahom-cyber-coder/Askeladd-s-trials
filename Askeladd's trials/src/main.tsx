import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TextProvider } from './TextContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
<StrictMode>
<TextProvider>
<App />
</TextProvider>
</StrictMode>
);
