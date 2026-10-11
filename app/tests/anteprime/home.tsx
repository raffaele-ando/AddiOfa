// Anteprima della home con un AccessContext finto e dati di prova.
// Uso: /tests/anteprime/home.html?stato=nuovo|basso|medio|alto  &pass=1  &tema=dark  &sim=0|1  &focus=0 (barre non cliccabili)
// Registro per Playwright: window.__log (callback chiamate).
import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import '../../src/index.css';
import '../../src/brand/brand.css';
import { Layout } from '../../src/components/Layout';
import { AccessContext, type AccessValue } from '../../src/access/context';
import { LocalProvider } from '../../src/access/localProvider';
import { countFreeSims } from '../../src/access/entitlement';
import type { Entitlement } from '../../src/access/provider';
import type { AppState, ExamHistory } from '../../src/types';
import { questions } from '../../src/data/questions';
import Menu from '../../src/components/Menu';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');
const conPass = q.get('pass') === '1';
const stato = q.get('stato') ?? 'medio';

declare global { interface Window { __log: unknown[] } }
window.__log = [];
const reg = (nome: string) => (...a: unknown[]) => { window.__log.push({ [nome]: a }); console.log('LOG', nome, JSON.stringify(a)); };

const CON_PASS: Entitlement = { tier: 'pass', source: 'demo', expiresAt: Date.now() + 365 * 864e5 };
const SENZA: Entitlement = { tier: 'free', source: 'none', expiresAt: null };

function giorno(i: number) { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0]; }

// Risposte di prova: la precisione dipende dallo stato (basso 30%, medio 55%, alto 85%)
function costruisci(): AppState {
  const base: AppState = { stats: {}, history: [], streak: 0, lastActiveDate: null, selectedCorpus: 'initial' } as AppState;
  if (stato === 'nuovo') return base;
  const acc = stato === 'basso' ? 0.3 : stato === 'medio' ? 0.55 : 0.85;
  const nStats: AppState['stats'] = {};
  questions.slice(0, 160).forEach((qq, i) => {
    const ok = (i * 37 % 100) / 100 < acc;
    nStats[qq.id] = { correct: ok ? 3 : 1, incorrect: ok ? 1 : 3, lastSeen: Date.now(), box: ok && i % 3 ? 2 : 0, easiness: 2.3 };
  });
  const diagOk = stato === 'basso' ? 5 : stato === 'medio' ? 8 : 10;
  const sim = q.get('sim') === '1' || stato === 'alto';
  const history: ExamHistory[] = sim ? [{ id: 'h1', date: Date.now() - 864e5, score: stato === 'alto' ? 27 : 21, passed: stato === 'alto', timeSpentSeconds: 800, format: 'ente' }] : [];
  return {
    ...base, stats: nStats, history, streak: stato === 'basso' ? 1 : 3, lastActiveDate: Date.now(),
    onboarding: { completedAt: Date.now() - 3 * 864e5, hasCertification: false, hasOfa: 'unknown', diagnosticCorrect: diagOk, diagnosticTotal: 10 },
    dailyActivity: { [giorno(0)]: 14, [giorno(1)]: 22, [giorno(2)]: 8, [giorno(4)]: 30, [giorno(6)]: 5 },
  };
}

function App() {
  const appState = useMemo(costruisci, []);
  const access = useMemo<AccessValue>(() => ({
    provider: new LocalProvider(),
    entitlement: conPass ? CON_PASS : SENZA,
    pass: conPass,
    simsDone: countFreeSims(appState.history),
    refresh: async () => {}, unlockDemo: async () => {}, track: () => {},
  }), [appState]);
  return (
    <AccessContext.Provider value={access}>
      <Layout>
        <Menu appState={appState} user={null} corpus={conPass ? 'all' : 'initial'}
          onStartSmart={reg('onStartSmart')} onStartLearn={reg('onStartLearn')} onStartExam={reg('onStartExam')} onOpenStats={reg('onOpenStats')}
          onImport={reg('onImport')} onSelectCorpus={reg('onSelectCorpus')} onOpenPaywall={reg('onOpenPaywall')} onNeedPass={reg('onNeedPass')}
          onStartErrors={reg('onStartErrors')} onOpenTheory={reg('onOpenTheory')} onOpenTheoryTopic={reg('onOpenTheoryTopic')}
          onStartFocus={q.get('focus') === '0' ? undefined : reg('onStartFocus')}
          onOpenLegal={reg('onOpenLegal')} onOpenCheatSheet={reg('onOpenCheatSheet')} onOpenDiagnostic={reg('onOpenDiagnostic')}
          onNaviga={reg('onNaviga')} />
      </Layout>
    </AccessContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><MotionConfig reducedMotion="user"><App /></MotionConfig></StrictMode>);
