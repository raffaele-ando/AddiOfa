// Anteprima delle schermate di studio con il provider vero (access/), regolata dall'URL.
// Uso: /tests/anteprime/studio.html?s=exam|learn|practice|stats|cheat
//   &sims=1   una simulazione già fatta (storico con 1 voce)
//   &mode=smart|weakness|blitz|recall|category   (solo s=learn)   &cat=topic:Present Simple  (solo s=learn&mode=category)
//   &fallisci=start|submit|grade|domande   forza un errore del provider alla prima chiamata
//   &tema=dark
//   &rs=40   (s=exam) passa risposteStima, per provare il rimando a FoglioStima
//   &dati=1   (s=learn) una dozzina di domande già imparate, per vedere "prima" diverso da zero
// Per i test automatici: window.__giusto[testo della domanda] = testo dell'opzione esatta (si riempie da getQuestions e startExam).
// Registro per Playwright: window.__log (onComplete, onExit, onOpenTheory...).
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import '../../src/brand/brand.css';
import { Layout } from '../../src/components/Layout';
import { provider } from '../../src/access';
import type { AppState, ExamHistory } from '../../src/types';
import { bankMeta } from '../../src/lib/spacedRepetition';
import { questions as banco } from '../../src/data/questions';
import ExamMode from '../../src/components/ExamMode';
import LearnMode from '../../src/components/LearnMode';
import StatsMode from '../../src/components/StatsMode';
import CheatSheet from '../../src/components/CheatSheet';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');
const fallisci = q.get('fallisci');

declare global { interface Window { __log: unknown[]; __giusto: Record<string, string> } }
window.__log = [];
window.__giusto = {};
const registra = (voce: unknown) => { window.__log.push(voce); console.log('LOG', JSON.stringify(voce)); };

// Il provider vero, con errori forzati a richiesta (si sovrascrivono i metodi dell'istanza condivisa)
const originale = {
  getQuestions: provider.getQuestions.bind(provider),
  grade: provider.grade.bind(provider),
  startExam: provider.startExam.bind(provider),
  submitExam: provider.submitExam.bind(provider),
};
let guasto = fallisci;
let restano = 2; // in sviluppo StrictMode avvia l'effetto due volte: la prima chiamata viene scartata
const ricorda = (lista: { id: string; prompt: string }[]) => {
  for (const d of lista) { const b = banco.find(x => x.id === d.id); if (b) window.__giusto[d.prompt] = b.options[b.correctIndex]; }
};
provider.getQuestions = async ids => {
  if (guasto === 'domande' && restano-- > 0) throw new Error('network');
  const lista = await originale.getQuestions(ids);
  ricorda(lista);
  return lista;
};
provider.grade = async (id, i) => {
  if (guasto === 'grade') { guasto = null; throw new Error('network'); }
  return originale.grade(id, i);
};
provider.startExam = async () => {
  if (guasto === 'start') { guasto = null; throw new Error('network'); }
  const sess = await originale.startExam();
  ricorda(sess.questions);
  return sess;
};
provider.submitExam = async (id, a, t) => {
  if (guasto === 'submit') { guasto = null; throw new Error('network'); }
  return originale.submitExam(id, a, t);
};

function storicoFinto(n: number): ExamHistory[] {
  return Array.from({ length: n }, (_, i) => ({ id: `h${i}`, date: Date.now() - 864e5, score: 22, passed: false, timeSpentSeconds: 700 }));
}

const s0 = q.get('s');

function App() {
  const [stato, setStato] = useState<AppState>({
    stats: s0 === 'learn' && q.get('dati') === '1'
      ? Object.fromEntries(bankMeta().slice(0, 12).map(m => [m.id, { correct: 2, incorrect: 0, lastSeen: Date.now() - 864e5, box: 2, easiness: 2.5, interval: 3 }]))
      : {}, history: storicoFinto(Number(q.get('sims') ?? 0)), streak: 0, lastActiveDate: null,
  } as AppState);

  const esci = () => registra({ onExit: true });
  const teoria = (id: string) => registra({ onOpenTheory: id });
  const s = q.get('s') ?? 'exam';

  let corpo;
  if (s === 'exam') {
    corpo = <ExamMode risposteStima={q.get('rs') ? Number(q.get('rs')) : undefined} onExit={esci} onOpenTheory={teoria}
      onComplete={(h, cat, res) => { registra({ onComplete: { score: h.score, passed: h.passed, secondi: h.timeSpentSeconds, domande: h.questionIds?.length, logs: h.questionLogs?.length, cat: Object.keys(cat).length, esiti: Object.keys(res ?? {}).length } }); setStato(p => ({ ...p, history: [...p.history, h] })); }} />;
  } else if (s === 'learn') {
    corpo = <LearnMode appState={stato} mode={(q.get('mode') ?? 'smart') as 'smart'} category={q.get('cat') ?? undefined}
      onUpdateAppState={st => { setStato(st); }} onExit={esci} onOpenTheory={q.get('teoria') === '1' ? teoria : undefined} />;
  } else if (s === 'practice') {
    corpo = <div className="p-6 text-sm">Il menu degli esercizi ora sta nella pagina Esercizi (screens/Esercizi.tsx).</div>;
  } else if (s === 'stats') {
    const conDati: AppState = q.get('dati') === '1' ? {
      ...stato,
      stats: Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`q${i + 1}`, { correct: i % 3 === 0 ? 0 : 2, incorrect: i % 3 === 0 ? 2 : 1, lastSeen: Date.now(), box: i % 4, easiness: 2.1 }])),
      history: [...stato.history, ...storicoFinto(2)],
    } : stato;
    corpo = <StatsMode appState={conDati} onExit={esci} />;
  } else {
    corpo = <CheatSheet onBack={esci} />;
  }
  return <Layout>{corpo}</Layout>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
