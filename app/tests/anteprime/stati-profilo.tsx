// Pagina di prova di ErrorBoundary, Toast, Impostazioni e Legal (non fa parte dell'app).
import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import '../../src/index.css';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';
import { ToastProvider, useToast } from '../../src/components/Toast';
import Impostazioni from '../../src/screens/Impostazioni';
import Legal from '../../src/screens/Legal';

function Rompe(): never { throw new Error('Prova dell\'errore imprevisto'); }

function Toasts() {
  const toast = useToast();
  useEffect(() => { toast('Progressi copiati.', 'ok'); toast('Il file non è valido.', 'errore'); toast('Appunti non disponibili.', 'info'); }, []);
  return <div className="h-full bg-superficie" />;
}

function Prova() {
  const s = new URLSearchParams(location.search).get('s') ?? 'errore';
  if (s === 'errore') return <ErrorBoundary><Rompe /></ErrorBoundary>;
  if (s === 'toast') return <ToastProvider><Toasts /></ToastProvider>;
  if (s === 'legal') return <Legal section="privacy" onBack={() => {}} onSection={() => {}} />;
  return <ToastProvider><div className="h-full"><Impostazioni onBack={() => {}} onImport={() => {}} onExport={() => {}} onReset={() => {}} /></div></ToastProvider>;
}

createRoot(document.getElementById('root')!).render(<Prova />);
