// Anteprima delle schermate di studio (agente C) con il LocalProvider vero e un AccessContext che si regola dall'URL.
// Uso: /tests/anteprime/studio.html?s=exam|learn|practice|stats|cheat
//   &pass=1   Pass attivo            &sims=1   una simulazione "ente" già fatta (storico con 1 voce)
//   &mode=smart|weakness|blitz|recall|category   (solo s=learn)   &cat=corpus:all  (solo s=learn&mode=category)
//   &tengfinto=1   il TENG parte con una quinta opzione finta (per provare la penalità), altrimenti "In arrivo"
//   &fallisci=start|submit|grade|domande   forza un errore del provider alla prima chiamata
//   &tema=dark
// Registro per Playwright: window.__log (onNeedPass, onComplete, onExit, track).
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import '../../src/brand/brand.css';
import { Layout } from '../../src/components/Layout';
import { AccessContext, type AccessValue } from '../../src/access/context';
import { LocalProvider } from '../../src/access/localProvider';
import { countFreeSims } from '../../src/access/entitlement';
import type { Entitlement, ExamSession, GradeResult, PublicQuestion, ExamResult } from '../../src/access/provider';
import type { FormatId } from '../../src/config/offer';
import type { AppState, ExamHistory, PaywallReason } from '../../src/types';
import ExamMode from '../../src/components/ExamMode';
import LearnMode from '../../src/components/LearnMode';
import PracticeMenu from '../../src/components/PracticeMenu';
import StatsMode from '../../src/components/StatsMode';
import CheatSheet from '../../src/components/CheatSheet';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');
const conPass = q.get('pass') === '1';
const fallisci = q.get('fallisci');

declare global { interface Window { __log: unknown[] } }
window.__log = [];
const registra = (voce: unknown) => { window.__log.push(voce); console.log('LOG', JSON.stringify(voce)); };

const CON_PASS: Entitlement = { tier: 'pass', source: 'demo', expiresAt: Date.now() + 365 * 864e5 };
const SENZA: Entitlement = { tier: 'free', source: 'none', expiresAt: null };

// Il LocalProvider vero, con errori forzati e un TENG finto a richiesta
class ProviderDiProva extends LocalProvider {
  private guasto = fallisci;
  async getQuestions(ids: string[]): Promise<PublicQuestion[]> {
    if (this.guasto === 'domande') { this.guasto = null; throw new Error('network'); }
    return super.getQuestions(ids);
  }
  async grade(id: string, i: number): Promise<GradeResult> {
    if (this.guasto === 'grade') { this.guasto = null; throw new Error('network'); }
    return super.grade(id, i);
  }
  async startExam(format: FormatId): Promise<ExamSession> {
    if (this.guasto === 'start') { this.guasto = null; throw new Error('network'); }
    if (format === 'teng' && q.get('tengfinto') === '1') {
      const s = await super.startExam('ente');
      // @ts-expect-error campo privato: nella prova si promuove la sessione a TENG
      this.sessioni.get(s.id).format = 'teng';
      return { ...s, format: 'teng', questions: s.questions.map(d => ({ ...d, options: [...d.options, 'None of the above'] })) };
    }
    return super.startExam(format);
  }
  async submitExam(id: string, a: Record<string, number | null>, t: number): Promise<ExamResult> {
    if (this.guasto === 'submit') { this.guasto = null; throw new Error('network'); }
    return super.submitExam(id, a, t);
  }
}
const provider = new ProviderDiProva();

function storicoFinto(n: number): ExamHistory[] {
  return Array.from({ length: n }, (_, i) => ({ id: `h${i}`, date: Date.now() - 864e5, score: 22, passed: false, timeSpentSeconds: 700, format: 'ente' as const }));
}

function App() {
  const [stato, setStato] = useState<AppState>({
    stats: {}, history: storicoFinto(Number(q.get('sims') ?? 0)), streak: 0, lastActiveDate: null,
    selectedCorpus: 'all',
  } as AppState);
  const access = useMemo<AccessValue>(() => ({
    provider,
    entitlement: conPass ? CON_PASS : SENZA,
    pass: conPass,
    simsDone: countFreeSims(stato.history),
    refresh: async () => {},
    unlockDemo: async () => {},
    track: e => registra({ track: e }),
  }), [stato.history]);

  const bisogno = (r: PaywallReason) => registra({ onNeedPass: r });
  const esci = () => registra({ onExit: true });
  const teoria = (id: string) => registra({ onOpenTheory: id });
  const s = q.get('s') ?? 'exam';

  let corpo;
  if (s === 'exam') {
    corpo = <ExamMode onNeedPass={bisogno} onExit={esci} onOpenTheory={teoria}
      onComplete={(h, cat, res) => { registra({ onComplete: { format: h.format, score: h.score, passed: h.passed, secondi: h.timeSpentSeconds, domande: h.questionIds?.length, logs: h.questionLogs?.length, cat: Object.keys(cat).length, esiti: Object.keys(res ?? {}).length } }); setStato(p => ({ ...p, history: [...p.history, h] })); }} />;
  } else if (s === 'learn') {
    corpo = <LearnMode appState={stato} mode={(q.get('mode') ?? 'smart') as 'smart'} category={q.get('cat') ?? undefined}
      onUpdateAppState={st => { setStato(st); }} onExit={esci} onNeedPass={bisogno} onOpenTheory={q.get('teoria') === '1' ? teoria : undefined} />;
  } else if (s === 'practice') {
    corpo = <PracticeMenu selectedCorpus={stato.selectedCorpus} onSelectCorpus={c => setStato(p => ({ ...p, selectedCorpus: c }))}
      onSelectMode={(m, c) => registra({ onSelectMode: [m, c] })} onBack={esci} onNeedPass={bisogno} />;
  } else if (s === 'stats') {
    const conDati: AppState = q.get('dati') === '1' ? {
      ...stato,
      stats: Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`q${i + 1}`, { correct: i % 3 === 0 ? 0 : 2, incorrect: i % 3 === 0 ? 2 : 1, lastSeen: Date.now(), box: i % 4, easiness: 2.1 }])),
      history: [...stato.history, ...storicoFinto(2)],
    } : stato;
    corpo = <StatsMode appState={conDati} onExit={esci} onNeedPass={bisogno} />;
  } else {
    corpo = <CheatSheet onBack={esci} onNeedPass={bisogno} />;
  }
  return (
    <AccessContext.Provider value={access}>
      <Layout>{corpo}</Layout>
    </AccessContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
