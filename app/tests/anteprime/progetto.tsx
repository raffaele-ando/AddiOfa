// Pagina di prova delle schermate di Project e della registrazione (non fa parte dell'app). Il registro vero lo aggiunge il coordinatore:
// qui le schermate si aprono da SCHERMATE_PROGETTO. Parametri: ?vista=…  ?stato=nuovo|profilo|collegato|diag  ?tema=dark  ?atlasProva=uid:Nome (solo sviluppo, vedi lib/firebase.ts).
import { createRoot } from 'react-dom/client';
import { Suspense, lazy, useMemo, useRef, useState, type ComponentType } from 'react';
import '../../src/index.css';
import type { AppState } from '../../src/types';
import { ExtraProvider, type ExtraCtx } from '../../src/screens/extra/contesto';
import { SCHERMATE_PROGETTO } from '../../src/screens/extra/progetto';
import Onboarding from '../../src/components/Onboarding';
import { CHIAVE_PROGETTO, creaProfilo, impostaProfilo } from '../../src/lib/progetto/profilo';
import { coda } from '../../src/lib/progetto/coda';
import { questions } from '../../src/data/questions';

const q = new URLSearchParams(location.search);
const STORAGE = 'anteprima_progetto_stato';

function statoIniziale(): AppState {
  const base: AppState = { stats: {}, history: [], streak: 1, lastActiveDate: Date.now() };
  const stato = q.get('stato') ?? 'nuovo';
  if (stato === 'nuovo') return base;
  const diag: AppState = { ...base, onboarding: { completedAt: Date.now(), hasCertification: false, hasOfa: 'yes', diagnosticCorrect: 7, diagnosticTotal: 10, passProbability: 0.45 } };
  if (stato === 'diag') return diag;
  if (stato === 'ricco') {
    const stats: AppState['stats'] = {};
    questions.slice(0, 120).forEach((qq, i) => { stats[qq.id] = { correct: i % 4 === 0 ? 1 : 3, incorrect: i % 3 === 0 ? 2 : 0, lastSeen: Date.now() - 86400000 * 3, box: i % 5 === 0 ? 3 : 1 }; });
    const logs = questions.slice(0, 30).map((qq, i) => ({ questionId: qq.id, userAnswerIndex: i < 21 ? qq.correctIndex : (qq.correctIndex + 1) % 4, correctIndex: qq.correctIndex, isCorrect: i < 21, category: qq.category }));
    return { ...diag, stats, history: [{ id: 's1', date: Date.now() - 86400000, score: 21, passed: false, timeSpentSeconds: 700, questionLogs: logs, questionIds: logs.map(l => l.questionId) }] };
  }
  const p = creaProfilo({ nome: 'Maria Rossi', email: 'maria.rossi@mail.polimi.it', corso: 'Ingegneria Gestionale', sede: 'Bovisa', provenienza: 'Gruppo o chat', consensi: { noi: true } }, Date.now())!;
  const conProfilo = impostaProfilo(diag, p);
  if (stato === 'profilo') return conProfilo;
  return { ...conProfilo, extra: { ...conProfilo.extra, [CHIAVE_PROGETTO]: { profilo: p, collegamento: { scopes: ['profile', 'noi.leaderboard'], collegatoIl: Date.now(), aggiornatoIl: Date.now() } } } };
}

function Host() {
  const [state, setState] = useState<AppState>(() => { try { const s = sessionStorage.getItem(STORAGE); if (s && !q.get('reset')) return JSON.parse(s); } catch { /* niente */ } return statoIniziale(); });
  const [vista, setVista] = useState<{ id: string; params: Record<string, string> }>({ id: q.get('vista') ?? 'esplora', params: {} });
  const pila = useRef<typeof vista[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const componenti = useMemo(() => new Map<string, ComponentType>(), []);
  const salva = (s: AppState) => { try { sessionStorage.setItem(STORAGE, JSON.stringify(s)); } catch { /* niente */ } };
  const nota = (t: string) => setLog(l => [...l.slice(-5), t]);
  const ctx: ExtraCtx = {
    appState: state, aggiorna: fn => setState(prev => { const n = fn(prev); salva(n); return n; }),
    id: vista.id, params: vista.params,
    vai: (id, params = {}) => { pila.current.push(vista); setVista({ id, params }); },
    indietro: () => { const p = pila.current.pop(); if (p) setVista(p); else nota('indietro (fuori dalle schermate)'); },
    apriTeoria: id => nota(`apriTeoria ${id ?? ''}`), apriImpostazioni: () => nota('apriImpostazioni'), apriLegale: s => nota(`apriLegale ${s}`),
    apriLanding: () => nota('apriLanding'), avviaEsercizi: m => nota(`avviaEsercizi ${m}`), avviaSimulazione: () => nota('avviaSimulazione'),
    vaiHome: () => nota('vaiHome'), avviaDiagnostico: () => nota('avviaDiagnostico'),
  };
  (window as unknown as { __log: string[]; __stato: AppState; __coda: typeof coda }).__log = log;
  (window as unknown as { __stato: AppState }).__stato = state;
  (window as unknown as { __coda: typeof coda }).__coda = coda;

  let corpo;
  if (vista.id === 'onboarding') {
    corpo = <Onboarding appState={state} onUpdateAppState={s => { setState(s); salva(s); }} onFinish={() => nota('onFinish')} onOpenLegal={s => nota(`apriLegale ${s}`)} />;
  } else {
    let C = componenti.get(vista.id);
    const def = SCHERMATE_PROGETTO[vista.id];
    if (!C && def) { C = lazy(def.carica); componenti.set(vista.id, C); }
    corpo = C ? <ExtraProvider valore={ctx}><Suspense fallback={<p>…</p>}><C key={vista.id} /></Suspense></ExtraProvider> : <p>Vista sconosciuta</p>;
  }
  return (
    <div className="h-full w-full flex flex-col bg-fondo">
      <div className="flex-1 min-h-0 mx-auto w-full max-w-[440px]">{corpo}</div>
      <pre id="log" className="shrink-0 max-h-16 overflow-auto bg-superficie-2 px-2 text-[10px] text-testo-tenue">{log.join('\n')}</pre>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<Host />);
