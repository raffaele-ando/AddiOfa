import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';
import './brand/brand.css'; // font Inter incorporato (5 pesi, solo latin) e stili del Brand Kit
import { inAppNativa } from './lib/nativo';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

// Uso offline: alla prima visita il browser salva i file del sito (service worker generato in build: sw.js). Non nella build a file unico né nell'app Android.
if (import.meta.env.PROD && import.meta.env.VITE_MODE !== 'demo' && 'serviceWorker' in navigator && !inAppNativa()) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* senza service worker il sito funziona come prima, solo online */ }); });
}
