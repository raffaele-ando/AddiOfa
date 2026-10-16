// Anteprima isolata delle schermate d'ingresso (landing e diagnostico). Solo per lavorare in locale.
// Uso: http://localhost:<porta>/tests/anteprime/anteprima.html?s=landing|onboarding  &tema=dark
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import { Layout } from '../../src/components/Layout';
import type { AppState } from '../../src/types';
import Landing from '../../src/screens/Landing';
import Onboarding from '../../src/components/Onboarding';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');

const STATO = { stats: {}, history: [], streak: 0 } as unknown as AppState;

function App() {
  const [log, setLog] = useState('');
  const nota = (s: string) => () => { setLog(s); console.log('azione', s); };
  const legal = (s: string) => { setLog(`legal:${s}`); };
  const s = q.get('s') ?? 'landing';
  const corpo = s === 'onboarding'
    ? <Onboarding appState={STATO} onUpdateAppState={() => {}} onFinish={r => setLog('finish ' + JSON.stringify(r))} />
    : <Landing onStartDiagnostic={nota('diag')} onSkip={nota('skip')} onOpenLegal={legal} />;
  return (
    <>
      <Layout>{corpo}</Layout>
      <output id="log" className="sr-only">{log}</output>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
