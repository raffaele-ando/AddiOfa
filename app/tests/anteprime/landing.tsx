// Anteprima della landing, senza il resto dell'app.
// Uso: /tests/anteprime/landing.html?tema=dark  &pass=0 (senza il pulsante verso il Pass)
// Registro per Playwright: window.__log (callback chiamate).
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import '../../src/index.css';
import '../../src/brand/brand.css';
import Landing from '../../src/screens/Landing';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');

declare global { interface Window { __log: unknown[] } }
window.__log = [];
const reg = (nome: string) => (...a: unknown[]) => { window.__log.push({ [nome]: a }); console.log('LOG', nome, JSON.stringify(a)); };

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <Landing
        onStartDiagnostic={reg('onStartDiagnostic')}
        onSkip={reg('onSkip')}
        onOpenLegal={reg('onOpenLegal')}
        onOpenPass={q.get('pass') === '0' ? undefined : reg('onOpenPass')}
      />
    </MotionConfig>
  </StrictMode>,
);
