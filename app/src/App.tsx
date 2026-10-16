/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { AppState, UserStats, ExamHistory, OnboardingResult, LegalSection } from './types';
import { loadState, saveState, updateStreak, exportData, importData } from './lib/storage';
import { getQuestionStats, applySm2, qualityForResult } from './lib/spacedRepetition';
import { chiaveGiorno } from './lib/utils';
import { questions } from './data/questions';
import Menu from './components/Menu';
import Lezioni from './screens/Lezioni';
import Impostazioni from './screens/Impostazioni';
import PracticeMenu from './components/PracticeMenu';
import LearnMode from './components/LearnMode';
import ExamMode from './components/ExamMode';
import { Layout } from './components/Layout';
import Onboarding from './components/Onboarding';
import CheatSheet from './components/CheatSheet';
import Navigazione, { Scheda } from './components/Navigazione';
import { ToastProvider, useToast } from './components/Toast';
import Landing from './screens/Landing';
import Legal from './screens/Legal';
import { ExtraProvider, type ExtraCtx } from './screens/extra/contesto';
import Splash from './brand/Splash';
import { SCHERMATE } from './screens/extra/registro';
// La teoria pesa: si carica solo quando serve
const Theory = lazy(() => import('./screens/Theory'));
// Strumenti da sviluppo: fuori dalla build di produzione
const BrandKit = import.meta.env.DEV ? lazy(() => import('./brand/BrandKit')) : null;
const DebugMode = import.meta.env.DEV ? lazy(() => import('./components/DebugMode')) : null;

type View = 'landing' | 'onboarding' | 'menu' | 'practiceMenu' | 'learn' | 'exam' | 'cheatsheet'
  | 'theory' | 'legal' | 'brand' | 'debug' | 'lezioni' | 'impostazioni' | 'extra';

// Schermate extra (screens/extra): componenti caricati solo quando servono
const COMPONENTI_EXTRA = new Map<string, React.LazyExoticComponent<React.ComponentType>>();
function componenteExtra(id: string) {
  let c = COMPONENTI_EXTRA.get(id);
  if (!c && SCHERMATE[id]) { c = lazy(SCHERMATE[id].carica); COMPONENTI_EXTRA.set(id, c); }
  return c;
}

// Il tempo di studio conta solo mentre si studia davvero
const STUDY_VIEWS: View[] = ['learn', 'exam', 'onboarding'];
// Da qui, dopo le pagine legali o la teoria, si torna al menu e non si riavvia la sessione
const NO_RETURN: View[] = ['learn', 'brand', 'debug'];

function initialView(state: AppState): View {
  const params = new URLSearchParams(window.location.search);
  if (params.has('landing')) return 'landing';
  if (params.has('vista') && SCHERMATE[params.get('vista') ?? '']) return 'extra';
  if (params.has('sfida')) return 'extra';
  if (import.meta.env.DEV && params.has('brand')) return 'brand';
  const isNewUser = !state.onboarding && state.history.length === 0 && Object.keys(state.stats).length === 0;
  return isNewUser ? 'landing' : 'menu';
}

function Caricamento() {
  return <Splash />;
}

// Sito statico: nessun server, nessun account. Lo stato dei progressi sta qui e si salva nel browser (lib/storage.ts).
export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadState());
  return (
    <ToastProvider>
      <AppInner appState={appState} setAppState={setAppState} />
    </ToastProvider>
  );
}

function AppInner({ appState, setAppState }: { appState: AppState; setAppState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const toast = useToast();

  const [view, setViewRaw] = useState<View>(() => initialView(appState));
  const [extra, setExtra] = useState<{ id: string; params: Record<string, string> }>(() => {
    const q = new URLSearchParams(window.location.search);
    const id = q.has('sfida') && !q.has('vista') ? 'sfida-accetta' : (q.get('vista') ?? '');
    return { id: SCHERMATE[id] || id === 'sfida-accetta' ? id : 'profilo', params: Object.fromEntries(q.entries()) };
  });
  const extraPila = useRef<{ id: string; params: Record<string, string> }[]>([]);
  // il codice della sfida è già stato letto: si toglie dall'indirizzo, così un ricaricamento non riapre «Hai già giocato»
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.has('sfida')) window.history.replaceState(null, '', window.location.pathname);
  }, []);
  const [learnMode, setLearnMode] = useState<'standard' | 'weakness' | 'blitz' | 'category' | 'recall' | 'smart'>('smart');
  const [learnCategory, setLearnCategory] = useState<string | undefined>(undefined);
  const [teoriaId, setTeoriaId] = useState<string | undefined>(undefined);
  const [legalSection, setLegalSection] = useState<LegalSection>('termini');
  const viewRef = useRef(view);
  viewRef.current = view;
  // pila delle schermate da cui si è arrivati (per il tasto indietro di legale, teoria, impostazioni)
  const pila = useRef<View[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setView = (v: View) => { pila.current = []; setViewRaw(v); };
  // apre una schermata ricordando da dove si viene
  const apri = (v: View) => {
    const da = viewRef.current;
    if (da !== v) pila.current.push(da);
    setViewRaw(v);
  };
  const indietro = () => {
    let v = pila.current.pop() ?? 'menu';
    if (NO_RETURN.includes(v)) v = 'menu';
    setViewRaw(v);
  };

  // schermate extra: `vai` apre un'altra schermata extra ricordando la precedente; `indietro` torna lì, poi alla schermata da cui si è arrivati
  const vaiExtra = (id: string, params: Record<string, string> = {}) => {
    if (viewRef.current === 'extra') extraPila.current.push(extra); else { extraPila.current = []; apri('extra'); }
    setExtra({ id, params });
  };
  const indietroExtra = () => {
    const prec = extraPila.current.pop();
    if (prec) setExtra(prec); else indietro();
  };

  const apriLegale = (s: LegalSection) => { setLegalSection(s); apri('legal'); };

  useEffect(() => {
    // Update streak on load
    const newState = updateStreak(appState);
    setAppState(newState);
    saveState(newState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && STUDY_VIEWS.includes(viewRef.current)) {
        setAppState(prev => {
          const dateString = chiaveGiorno();
          const newDailyTimeSpent = { ...(prev.dailyTimeSpent || {}) };
          newDailyTimeSpent[dateString] = (newDailyTimeSpent[dateString] || 0) + 10;
          
          const newState = { ...prev, dailyTimeSpent: newDailyTimeSpent };
          saveState(newState);
          return newState;
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const commit = (newState: AppState) => {
    const updatedState = updateStreak(newState);
    setAppState(updatedState);
    saveState(updatedState);
  };

  const handleUpdateAppState = commit;

  const apriTeoria = (id: string) => { setTeoriaId(id); setView('theory'); };
  // dalla home o dalle Lezioni: la freccia indietro riporta lì
  const apriTeoriaDa = (id: string) => { setTeoriaId(id); apri('theory'); };

  const handleExamComplete = (
    historyEntry: ExamHistory, 
    categoryUpdates: Record<string, { correct: number, total: number }>,
    questionResults?: Record<string, 'correct' | 'incorrect' | 'omitted'>,
  ) => {
    const entry: ExamHistory = historyEntry;
    setAppState(prev => {
      // Copia profonda: gli oggetti di `prev` non si toccano (in StrictMode l'aggiornamento gira due volte e il conteggio raddoppierebbe)
      const mergedCategoryStats: Record<string, { correct: number; total: number }> =
        Object.fromEntries(Object.entries(prev.examCategoryStats || {}).map(([k, v]) => [k, { ...v }]));
      for (const [cat, stats] of Object.entries(categoryUpdates)) {
        if (!mergedCategoryStats[cat]) {
          mergedCategoryStats[cat] = { correct: 0, total: 0 };
        }
        mergedCategoryStats[cat].correct += stats.correct;
        mergedCategoryStats[cat].total += stats.total;
      }

      const adesso = Date.now();
      const newStats: UserStats = { ...(prev.stats || {}) };
      let answeredCount = 0;
      if (questionResults) {
        // Map question logs by questionId for fast telemetry retrieval
        const logsMap = new Map((entry.questionLogs || []).map(l => [l.questionId, l]));
        const speed = prev.speedStats;

        for (const [qId, result] of Object.entries(questionResults)) {
          const currentQ = getQuestionStats(newStats, qId);
          const log = logsMap.get(qId);
          const question = questions.find(q => q.id === qId);
          if (result !== 'omitted') answeredCount++;

          // Le risposte della simulazione aggiornano SM-2 come in allenamento: giusta = voto continuo da tempo e cambi
          // di opzione, sbagliata = 0, omessa = QUALITY_OMITTED (torna domani ma toglie meno facilità di un errore).
          // Con `lastSeen` una simulazione fatta subito dopo una sessione non fa avanzare il box.
          const quality = qualityForResult(result, question, log, speed);
          const sm2 = applySm2({ repetitions: currentQ.box, interval: currentQ.interval, easiness: currentQ.easiness, lastSeen: currentQ.lastSeen }, quality, adesso);

          newStats[qId] = {
            ...currentQ,
            correct: currentQ.correct + (result === 'correct' ? 1 : 0),
            incorrect: currentQ.incorrect + (result === 'incorrect' ? 1 : 0),
            omitted: (currentQ.omitted || 0) + (result === 'omitted' ? 1 : 0),
            box: sm2.repetitions,
            interval: sm2.interval,
            easiness: sm2.easiness,
            previousEasiness: currentQ.easiness,
            lastQuality: quality,
            lastSeen: adesso,
            lastResponseTimeMs: log?.timeSpentMs ?? currentQ.lastResponseTimeMs,
            lastFirstClickTimeMs: log?.firstClickTimeMs ?? currentQ.lastFirstClickTimeMs,
            lastSwitchCount: log?.switchCount ?? currentQ.lastSwitchCount,
            lastTrajectory: log?.trajectory ?? currentQ.lastTrajectory,
          };
        }
      }
      
      const dateString = chiaveGiorno();
      const newDailyActivity = { ...(prev.dailyActivity || {}) };
      newDailyActivity[dateString] = (newDailyActivity[dateString] || 0) + answeredCount;

      const newState = updateStreak({ 
        ...prev, 
        stats: newStats,
        history: [...prev.history, entry],
        examCategoryStats: mergedCategoryStats,
        dailyActivity: newDailyActivity
      });
      saveState(newState);
      return newState;
    });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const imported = await importData(file);
      setAppState(imported);
      saveState(imported);
      toast('Progressi importati.', 'ok');
    } catch {
      toast('Non riesco a leggere il file: controlla che sia un salvataggio di AddiOFA.', 'errore');
    }
  };

  const handleOnboardingFinish = (result: OnboardingResult) => {
    setAppState(prev => {
      const newState = { ...prev, onboarding: result };
      saveState(newState);
      return newState;
    });
    setView('menu');
  };

  // Barra in basso, tre voci: Home, Simulazioni (scelta e avvio della simulazione), Lezioni (hub di teoria, esercizi, ripasso, progressi).
  // Le pagine che si aprono dalle Lezioni (teoria, esercizi, progressi) mostrano la barra con "Lezioni" attiva.
  const vaiScheda = (s: Scheda) => {
    if (s === 'simulazioni' && SCHERMATE.simulazioni) { extraPila.current = []; setExtra({ id: 'simulazioni', params: {} }); setView('extra'); return; }
    setView(({ home: 'menu', simulazioni: 'exam', lezioni: 'lezioni' } as const)[s]);
  };
  const conBarra = (scheda: Scheda | null, pagina: React.ReactNode) => (
    <div className="h-full w-full flex flex-col overflow-hidden sm:rounded-[28px] sm:border sm:border-linea bg-superficie">
      <div className="flex-1 min-h-0 [&>*]:sm:rounded-none [&>*]:sm:border-0">{pagina}</div>
      <Navigazione attiva={scheda} onVai={vaiScheda} />
    </div>
  );

  const avviaSimulazione = () => setView('exam');

  const aggiornaExtra = (fn: (s: AppState) => AppState) => {
    setAppState(prev => {
      const nuovo = fn(prev);
      saveState(nuovo);
      return nuovo;
    });
  };
  const ctxExtra: ExtraCtx = {
    appState, aggiorna: aggiornaExtra,
    id: extra.id, params: extra.params, vai: vaiExtra, indietro: indietroExtra,
    apriTeoria: (id?: string) => { setTeoriaId(id); apri('theory'); },
    apriImpostazioni: () => apri('impostazioni'),
    apriLegale,
    apriLanding: () => setView('landing'),
    avviaEsercizi: (modo, categoria) => { setLearnMode(modo); setLearnCategory(categoria); setView('learn'); },
    avviaSimulazione: avviaSimulazione,
    vaiHome: () => setView('menu'),
    avviaDiagnostico: () => setView('onboarding'),
  };

  // Il Brand Kit usa tutta la finestra, fuori dalla cornice dell'app (solo in sviluppo)
  if (BrandKit && view === 'brand') {
    return (
      <div style={{ height: '100dvh' }}>
        <Suspense fallback={<Caricamento />}>
          <BrandKit onEsci={() => { window.history.replaceState(null, '', window.location.pathname); setView('menu'); }} />
        </Suspense>
      </div>
    );
  }

  return (
    <Layout>
      {view === 'landing' && (
        <Landing
          onStartDiagnostic={() => setView('onboarding')}
          onSkip={() => setView('menu')}
          onOpenLegal={apriLegale}
        />
      )}
      {view === 'menu' && (
        <Menu
          appState={appState}
          onStartSmart={() => {
            setLearnMode('smart');
            setLearnCategory(undefined);
            setView('learn');
          }}
          onOpenTheory={() => { setTeoriaId(undefined); apri('theory'); }}
          onOpenTheoryTopic={apriTeoriaDa}
          onOpenDiagnostic={() => setView('onboarding')}
          onApriLezione={id => vaiExtra('lezione-dettaglio', { id })}
          onOpenImpostazioni={() => (SCHERMATE.profilo ? vaiExtra('profilo') : apri('impostazioni'))}
          onNaviga={vaiScheda}
        />
      )}
      {view === 'lezioni' && (
        <Lezioni
          appState={appState}
          onStartLearn={() => apri('practiceMenu')}
          onOpenStats={() => vaiExtra('progressi')}
          onOpenProfilo={() => vaiExtra('profilo')}
          onStartErrors={() => { setLearnMode('weakness'); setLearnCategory(undefined); setView('learn'); }}
          onOpenTheory={() => { setTeoriaId(undefined); apri('theory'); }}
          onOpenTheoryTopic={apriTeoriaDa}
          onStartFocus={f => { setLearnMode('category'); setLearnCategory(f); setView('learn'); }}
          onOpenCheatSheet={() => apri('cheatsheet')}
          onOpenDiagnostic={() => setView('onboarding')}
          onNaviga={vaiScheda}
          onOpenExtra={vaiExtra}
        />
      )}
      {view === 'extra' && !SCHERMATE[extra.id] && conBarra('home', (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="text-base font-bold text-testo">Pagina non trovata.</p>
          <button type="button" onClick={indietroExtra} className="rounded-xl bg-azione px-5 py-3 text-sm font-bold text-azione-su">Indietro</button>
        </div>
      ))}
      {view === 'extra' && SCHERMATE[extra.id] && (() => {
        const Comp = componenteExtra(extra.id);
        if (!Comp) return null;
        const def = SCHERMATE[extra.id];
        const pagina = (
          <ExtraProvider valore={ctxExtra}>
            <Suspense fallback={<Caricamento />}><Comp key={extra.id + JSON.stringify(extra.params)} /></Suspense>
          </ExtraProvider>
        );
        return def.barra === null ? pagina : conBarra(def.barra ?? 'home', pagina);
      })()}
      {view === 'impostazioni' && (
        <Impostazioni
          onBack={indietro}
          onOpenLanding={() => setView('landing')}
          onVai={vaiExtra}
          onOpenLegal={apriLegale}
          onImport={() => fileInputRef.current?.click()}
          onExport={() => exportData(appState)}
          onOpenDebug={import.meta.env.DEV ? () => apri('debug') : undefined}
        />
      )}
      {view === 'onboarding' && (
        <Onboarding
          appState={appState}
          onUpdateAppState={handleUpdateAppState}
          onFinish={handleOnboardingFinish}
        />
      )}
      {view === 'theory' && (
        conBarra('lezioni', (
          <Suspense fallback={<Caricamento />}>
            <Theory key={teoriaId ?? 'elenco'} initialTopicId={teoriaId} onBack={indietro} />
          </Suspense>
        ))
      )}
      {view === 'legal' && (
        <Legal section={legalSection} onBack={indietro} onSection={setLegalSection} />
      )}
      {view === 'cheatsheet' && (
        <CheatSheet onBack={indietro} />
      )}
      {view === 'practiceMenu' && (
        conBarra('lezioni', <>
        <PracticeMenu
          onSelectMode={(mode, category) => {
            setLearnMode(mode);
            setLearnCategory(category);
            setView('learn');
          }}
          onBack={indietro}
        />
        </>)
      )}
      {view === 'learn' && (
        <LearnMode
          appState={appState}
          mode={learnMode}
          category={learnCategory}
          onUpdateAppState={handleUpdateAppState}
          onExit={() => setView('menu')}
          onOpenTheory={apriTeoria}
        />
      )}
      {view === 'exam' && (
        <ExamMode
          onComplete={handleExamComplete}
          onExit={() => setView('menu')}
          onOpenTheory={apriTeoria}
        />
      )}
      <input
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleImport}
      />
      {DebugMode && view === 'debug' && (
        <Suspense fallback={<Caricamento />}>
          <DebugMode onBack={indietro} />
        </Suspense>
      )}
    </Layout>
  );
}
