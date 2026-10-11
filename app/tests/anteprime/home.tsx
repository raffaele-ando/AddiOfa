// Anteprima della home con un AccessContext finto e dati di prova.
// Uso: /tests/anteprime/home.html?vista=home|lezioni|impostazioni  &stato=nuovo|basso|medio|alto  &pass=1  &tema=dark  &sim=0|1  &punti=1..5 (punti del grafico: diagnostico + simulazioni)  &focus=0 (barre non cliccabili)
// Registro per Playwright: window.__log (callback chiamate).
import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
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
import Lezioni from '../../src/screens/Lezioni';
import Impostazioni from '../../src/screens/Impostazioni';
import Misuratore from '../../src/components/home/Misuratore';
import { BannerStato } from '../../src/components/home/Stima';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');
const conPass = q.get('pass') === '1';
const stato = q.get('stato') ?? 'medio';
const vista = q.get('vista') ?? 'home';

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
  // punti=N: N punti misurati nel grafico = diagnostico + (N-1) simulazioni; senza, vale sim=1 (o lo stato alto)
  const punti = Number(q.get('punti'));
  const nSim = punti >= 1 ? Math.min(4, Math.floor(punti) - 1) : (q.get('sim') === '1' || stato === 'alto' ? 1 : 0);
  const punteggi = stato === 'alto' ? [26, 27, 28, 29] : stato === 'medio' ? [24, 25, 25, 26] : [12, 15, 17, 20];
  const history: ExamHistory[] = Array.from({ length: nSim }, (_, i) => {
    const score = punteggi[i];
    return { id: `h${i + 1}`, date: Date.now() - (nSim - i) * 864e5, score, passed: score >= 25, timeSpentSeconds: 800, format: 'ente' as const };
  });
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
        {vista === 'misuratore' ? (
          // taratura contro il concept 14: ?vista=misuratore&p=82&liv=basso (solo il misuratore e il banner, a 390 px)
          <div style={{ width: 390, background: 'var(--color-superficie)' }} className="mx-auto pt-[44px]">
            <Misuratore percento={Number(q.get('p') ?? 82)} livello={(q.get('liv') as 'basso' | 'medio' | 'alto') ?? 'basso'} etichetta="Probabilità stimata di superare" sotto="il test OFA di inglese" onInfo={() => undefined} />
            <div className="px-6 mt-[14px]"><BannerStato chiave="margine" onClick={() => undefined} /></div>
          </div>
        ) : vista === 'lezioni' ? (
          <Lezioni appState={appState} corpus={conPass ? 'all' : 'initial'}
            onStartLearn={reg('onStartLearn')} onOpenStats={reg('onOpenStats')} onStartErrors={reg('onStartErrors')}
            onOpenTheory={reg('onOpenTheory')} onOpenTheoryTopic={reg('onOpenTheoryTopic')}
            onStartFocus={q.get('focus') === '0' ? undefined : reg('onStartFocus')}
            onOpenCheatSheet={reg('onOpenCheatSheet')} onOpenDiagnostic={reg('onOpenDiagnostic')}
            onSelectCorpus={reg('onSelectCorpus')} onOpenPaywall={reg('onOpenPaywall')} onNeedPass={reg('onNeedPass')} onNaviga={reg('onNaviga')} />
        ) : vista === 'impostazioni' ? (
          <Impostazioni onBack={reg('onBack')} onOpenPaywall={reg('onOpenPaywall')} onOpenLegal={reg('onOpenLegal')}
            onImport={reg('onImport')} onExport={q.get('esporta') === '0' ? undefined : reg('onExport')}
            onLogin={q.get('login') === '1' ? reg('onLogin') : undefined}
            utente={q.get('utente') === '1' ? { displayName: 'Raffaele Rossi', email: 'raffaele@example.com' } : null}
            onLogout={reg('onLogout')} onOpenProfile={reg('onOpenProfile')} />
        ) : (
          <Menu appState={appState} corpus={conPass ? 'all' : 'initial'}
            onStartSmart={reg('onStartSmart')} onStartExam={reg('onStartExam')} onNeedPass={reg('onNeedPass')}
            onOpenTheory={reg('onOpenTheory')} onOpenTheoryTopic={reg('onOpenTheoryTopic')}
            onOpenDiagnostic={reg('onOpenDiagnostic')} onOpenImpostazioni={reg('onOpenImpostazioni')} onNaviga={reg('onNaviga')} />
        )}
      </Layout>
    </AccessContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
