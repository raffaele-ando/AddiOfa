// Anteprima della home con dati di prova.
// Uso: /tests/anteprime/home.html?vista=home|lezioni|impostazioni|misuratore  &stato=nuovo|basso|medio|alto (nuovo = senza diagnostico; basso 5/10, medio 9/10, alto 10/10)  &tema=dark  &sim=0|1  &punti=1..5 (punti del grafico: diagnostico + simulazioni)  &nome=Raffaele (profilo con nome: saluto, se la finestra è alta) &aree=0 (nessuna risposta per area: carta vuota) &debole=1 (un'area sotto il 40 %)
// Registro per Playwright: window.__log (callback chiamate).
import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import '../../src/brand/brand.css';
import { Layout } from '../../src/components/Layout';
import type { AppState, ExamHistory } from '../../src/types';
import { questions } from '../../src/data/questions';
import Menu from '../../src/components/Menu';
import Esercizi from '../../src/screens/Esercizi';
import Impostazioni from '../../src/screens/Impostazioni';
import Misuratore from '../../src/components/home/Misuratore';
import { BannerStato } from '../../src/components/home/Stima';

const q = new URLSearchParams(location.search);
if (q.get('tema') === 'dark') document.documentElement.classList.add('dark');
const stato = q.get('stato') ?? 'medio';
const vista = q.get('vista') ?? 'home';

declare global { interface Window { __log: unknown[] } }
window.__log = [];
const reg = (nome: string) => (...a: unknown[]) => { window.__log.push({ [nome]: a }); console.log('LOG', nome, JSON.stringify(a)); };

function giorno(i: number) { const d = new Date(); d.setDate(d.getDate() - i); return d.toISOString().split('T')[0]; }

// Risposte di prova: la precisione dipende dallo stato (basso 30%, medio 55%, alto 85%)
function costruisci(): AppState {
  const base: AppState = { stats: {}, history: [], streak: 0, lastActiveDate: null } as AppState;
  if (stato === 'nuovo') return base;
  const acc = stato === 'basso' ? 0.3 : stato === 'medio' ? 0.55 : 0.85;
  const nStats: AppState['stats'] = {};
  // debole=1: le domande di Traduzione sono quasi tutte sbagliate (area sotto il 40 %); aree=0: nessuna risposta registrata per area
  const slice = q.get('aree') === '0' ? [] : questions.slice(0, 160);
  slice.forEach((qq, i) => {
    const ok = q.get('debole') === '1' && qq.category === 'Traduzione' ? i % 6 === 0 : (i * 37 % 100) / 100 < acc;
    nStats[qq.id] = { correct: ok ? 3 : 1, incorrect: ok ? 1 : 3, lastSeen: Date.now(), box: ok && i % 3 ? 2 : 0, easiness: 2.3 };
  });
  const diagOk = stato === 'basso' ? 5 : stato === 'medio' ? 9 : 10; // 5/10 = basso, 9/10 = 62 % (medio), 10/10 = 87 % (alto)
  // punti=N: N punti misurati nel grafico = diagnostico + (N-1) simulazioni; senza, vale sim=1 (o lo stato alto)
  const punti = Number(q.get('punti'));
  const nSim = punti >= 1 ? Math.min(4, Math.floor(punti) - 1) : (q.get('sim') === '1' || stato === 'alto' ? 1 : 0);
  const punteggi = stato === 'alto' ? [26, 27, 28, 29] : stato === 'medio' ? [24, 25, 25, 26] : [12, 15, 17, 20];
  const history: ExamHistory[] = Array.from({ length: nSim }, (_, i) => {
    const score = punteggi[i];
    return { id: `h${i + 1}`, date: Date.now() - (nSim - i) * 864e5, score, passed: score >= 25, timeSpentSeconds: 800 };
  });
  return {
    ...base, stats: nStats, history, streak: stato === 'basso' ? 1 : 3, lastActiveDate: Date.now(),
    onboarding: { completedAt: Date.now() - 3 * 864e5, hasCertification: false, hasOfa: 'unknown', diagnosticCorrect: diagOk, diagnosticTotal: 10 },
    ...(q.get('nome') ? { extra: { progetto: { profilo: { nome: q.get('nome'), email: 'raffaele.rossi@mail.polimi.it', emailVerificata: false, consensi: { noi: false, atlas: false, comunicazioni: false }, versioneInformativa: 'x', creatoIl: 1760000000000, aggiornatoIl: 1760000000000 } } } } : {}),
    dailyActivity: { [giorno(0)]: 14, [giorno(1)]: 22, [giorno(2)]: 8, [giorno(4)]: 30, [giorno(6)]: 5 },
  };
}

function App() {
  const appState = useMemo(costruisci, []);
  return (
    <>
      <Layout>
        {vista === 'misuratore' ? (
          // taratura contro il concept 14: ?vista=misuratore&p=82&liv=basso (solo il misuratore e il banner, a 390 px)
          <div style={{ width: 390, background: 'var(--color-superficie)' }} className="mx-auto pt-[44px]">
            <Misuratore percento={Number(q.get('p') ?? 82)} livello={(q.get('liv') as 'basso' | 'medio' | 'alto') ?? 'basso'} etichetta="Probabilità stimata di superare" sotto="il test OFA di inglese" onInfo={() => undefined} />
            <div className="px-6 mt-[14px]"><BannerStato chiave="margine" onClick={() => undefined} /></div>
          </div>
        ) : vista === 'lezioni' ? (
          <Esercizi appState={appState}
            onStartLearn={reg('onStartLearn')} onOpenCheatSheet={reg('onOpenCheatSheet')} onNaviga={reg('onNaviga')} onOpenExtra={reg('onOpenExtra')} />
        ) : vista === 'impostazioni' ? (
          <Impostazioni onBack={reg('onBack')} onOpenLegal={reg('onOpenLegal')}
            onImport={reg('onImport')} onExport={q.get('esporta') === '0' ? undefined : reg('onExport')} />
        ) : (
          <Menu appState={appState}
            onStartSmart={reg('onStartSmart')}
            onOpenTheory={reg('onOpenTheory')} onOpenTheoryTopic={reg('onOpenTheoryTopic')}
            onApriLezione={reg('onApriLezione')} onStartExam={reg('onStartExam')} onApriExtra={reg('onApriExtra')}
            onOpenDiagnostic={reg('onOpenDiagnostic')} onOpenImpostazioni={reg('onOpenImpostazioni')} onNaviga={reg('onNaviga')} />
        )}
      </Layout>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
