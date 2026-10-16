/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState, useEffect, useRef, useMemo } from 'react';
import { AppState, UserStats, ExamHistory, CorpusType, OnboardingResult, LegalSection, PaywallReason } from './types';
import { ECOSYSTEM, CONSENT_VERSION, ScopeId } from './config/ecosystem';
import { FEATURE_FLAGS, type FormatId } from './config/offer';
import { atlas, isAtlasOnline, ProjectAccount } from './lib/atlas';
import { loadState, saveState, updateStreak, exportData, importData, syncToCloud, syncFromCloud } from './lib/storage';
import { getQuestionStats, applySm2, qualityForResult, countLearned } from './lib/spacedRepetition';
import { chiaveGiorno } from './lib/utils';
import { questions } from './data/questions';
import { signInWithGoogle, logout, onAuthChange } from './lib/firebase';
import type { User } from 'firebase/auth';
import { AccessProvider } from './access/AccessProvider';
import { useAccess } from './access/context';
import { canStartSim } from './access/entitlement';
import Menu from './components/Menu';
import Lezioni from './screens/Lezioni';
import Impostazioni from './screens/Impostazioni';
import PracticeMenu from './components/PracticeMenu';
import LearnMode from './components/LearnMode';
import ExamMode from './components/ExamMode';
import StatsMode from './components/StatsMode';
import { Layout, DemoBanner } from './components/Layout';
import Onboarding from './components/Onboarding';
import CheatSheet from './components/CheatSheet';
import PaymentThanks from './components/PaymentThanks';
import ProjectConsent from './components/ProjectConsent';
import ProjectProfile from './components/ProjectProfile';
import Leaderboard from './components/Leaderboard';
import Navigazione, { Scheda } from './components/Navigazione';
import { ToastProvider, useToast } from './components/Toast';
import Landing from './screens/Landing';
import Paywall from './screens/Paywall';
import Waitlist from './screens/Waitlist';
import Invites from './screens/Invites';
import Legal from './screens/Legal';
import { ExtraProvider, type ExtraCtx } from './screens/extra/contesto';
import Splash from './brand/Splash';
import { SCHERMATE } from './screens/extra/registro';
// La teoria pesa: si carica solo quando serve
const Theory = lazy(() => import('./screens/Theory'));
// Strumenti da sviluppo: fuori dalla build di produzione
const BrandKit = import.meta.env.DEV ? lazy(() => import('./brand/BrandKit')) : null;
const DebugMode = import.meta.env.DEV ? lazy(() => import('./components/DebugMode')) : null;

type View = 'landing' | 'onboarding' | 'menu' | 'practiceMenu' | 'learn' | 'exam' | 'stats' | 'cheatsheet'
  | 'paywall' | 'waitlist' | 'invites' | 'theory' | 'legal' | 'thanks' | 'brand' | 'debug' | 'profile' | 'leaderboard' | 'lezioni' | 'impostazioni' | 'extra';

// Schermate extra (screens/extra): componenti caricati solo quando servono
const COMPONENTI_EXTRA = new Map<string, React.LazyExoticComponent<React.ComponentType>>();
function componenteExtra(id: string) {
  let c = COMPONENTI_EXTRA.get(id);
  if (!c && SCHERMATE[id]) { c = lazy(SCHERMATE[id].carica); COMPONENTI_EXTRA.set(id, c); }
  return c;
}

// Il tempo di studio conta solo mentre si studia davvero
const STUDY_VIEWS: View[] = ['learn', 'exam', 'onboarding'];
// Da qui, dopo il paywall o le pagine legali, si torna al menu e non si riavvia la sessione
const NO_RETURN: View[] = ['learn', 'thanks', 'brand', 'debug'];

function initialView(state: AppState): View {
  const params = new URLSearchParams(window.location.search);
  if (params.get('pagamento') === 'ok') return 'thanks';
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

// Lo stato dei progressi sta qui perché AccessProvider ha bisogno dello storico per contare le simulazioni gratuite
export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadState());
  return (
    <AccessProvider history={appState.history}>
      <ToastProvider>
        <AppInner appState={appState} setAppState={setAppState} />
      </ToastProvider>
    </AccessProvider>
  );
}

function AppInner({ appState, setAppState }: { appState: AppState; setAppState: React.Dispatch<React.SetStateAction<AppState>> }) {
  const { provider, pass, entitlement, simsDone, refresh, track } = useAccess();
  const toast = useToast();
  const isDemo = provider.mode === 'demo';
  // Login e Project ID restano spenti nel lancio e in demo
  const loginOn = FEATURE_FLAGS.projectId && !isDemo;

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
  const [paywallReason, setPaywallReason] = useState<PaywallReason>('generico');
  const [legalSection, setLegalSection] = useState<LegalSection>('termini');
  const viewRef = useRef(view);
  viewRef.current = view;
  // pile delle schermate da cui si è arrivati (per il tasto indietro di paywall, legale, lista d'attesa, teoria)
  const pila = useRef<View[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [projectAccount, setProjectAccount] = useState<ProjectAccount | null>(null);
  const [consent, setConsent] = useState<{ open: boolean; busy: boolean; error: string | null }>({ open: false, busy: false, error: null });
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

  const apriPaywall = (reason: PaywallReason = 'generico') => {
    setPaywallReason(reason);
    track({ name: 'paywall_seen' });
    apri('paywall');
  };
  const apriLegale = (s: LegalSection) => { setLegalSection(s); apri('legal'); };

  // Nella parte gratuita il materiale è solo il nucleo; lo stato salvato non cambia
  const corpusAttivo: CorpusType = pass ? (appState.selectedCorpus || 'all') : 'initial';
  const statoVista = useMemo<AppState>(
    () => (appState.selectedCorpus === corpusAttivo ? appState : { ...appState, selectedCorpus: corpusAttivo }),
    [appState, corpusAttivo],
  );

  const saveProjectLink = (scopes: ScopeId[] | undefined, uid?: string) => {
    setAppState(prev => {
      const now = Date.now();
      const newState: AppState = {
        ...prev,
        projectLink: scopes
          ? { scopes, consentVersion: CONSENT_VERSION, grantedAt: prev.projectLink?.grantedAt ?? now, updatedAt: now }
          : undefined,
      };
      saveState(newState);
      if (uid) syncToCloud(uid, newState);
      return newState;
    });
  };

  // Dopo il login: collega AddiOFA al Project ID. Se il consenso (con l'informativa attuale) non c'è, lo chiede.
  const connectProjectId = async (currentUser: User, state: AppState) => {
    let localLink = state.projectLink?.consentVersion === CONSENT_VERSION ? state.projectLink : undefined;
    if (isAtlasOnline()) {
      try {
        const { account, links } = await atlas.me();
        setProjectAccount(account);
        const remote = links.find(l => l.appId === ECOSYSTEM.appId && l.consentVersion === CONSENT_VERSION);
        if (remote) {
          saveProjectLink(remote.scopes, currentUser.uid);
          return;
        }
        if (localLink) {
          await atlas.setLink(ECOSYSTEM.appId, localLink.scopes);
          return;
        }
      } catch (err) {
        console.error(`${ECOSYSTEM.engineName} non raggiungibile`, err);
        if (localLink) return;
      }
    } else if (localLink) {
      return;
    }
    setConsent({ open: true, busy: false, error: null });
  };

  const handleLogin = async () => {
    if (!loginOn) { toast('Il login non è disponibile in questa versione.', 'info'); return; }
    try {
      await signInWithGoogle();
    } catch (err) {
      toast((err as Error).message || 'Non sono riuscito a fare il login. Riprova tra poco.', 'errore');
    }
  };

  useEffect(() => {
    // Il login si ascolta solo se è acceso: altrimenti Firebase non si carica nemmeno
    if (!loginOn) return;
    return onAuthChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync data from cloud upon login
        const syncedState = await syncFromCloud(currentUser.uid, loadState());
        setAppState(syncedState);
        await connectProjectId(currentUser, syncedState);
      } else {
        setProjectAccount(null);
        setConsent({ open: false, busy: false, error: null });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginOn]);

  useEffect(() => {
    // Update streak on load
    const newState = updateStreak(appState);
    setAppState(newState);
    saveState(newState);
    if (user) {
      syncToCloud(user.uid, newState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let lastSync = Date.now();
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && STUDY_VIEWS.includes(viewRef.current)) {
        setAppState(prev => {
          const dateString = chiaveGiorno();
          const newDailyTimeSpent = { ...(prev.dailyTimeSpent || {}) };
          newDailyTimeSpent[dateString] = (newDailyTimeSpent[dateString] || 0) + 10;
          
          const newState = { ...prev, dailyTimeSpent: newDailyTimeSpent };
          saveState(newState);
          
          const now = Date.now();
          if (now - lastSync >= 60000 && user) {
            syncToCloud(user.uid, newState);
            lastSync = now;
          }
          return newState;
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // Tornando da Stripe il Pass può arrivare con qualche secondo di ritardo (webhook): si riprova a leggerlo
  useEffect(() => {
    if (view !== 'thanks' || pass) return;
    let tentativi = 0;
    const t = setInterval(() => {
      tentativi++;
      void refresh();
      if (tentativi >= 8) clearInterval(t);
    }, 2500);
    void refresh();
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, pass]);

  const commit = (newState: AppState) => {
    const updatedState = updateStreak(newState);
    setAppState(updatedState);
    saveState(updatedState);
    if (user) syncToCloud(user.uid, updatedState);
  };

  // Le schermate di studio vedono il corpus attivo: nella parte gratuita non lo salviamo al posto della scelta dell'utente
  const handleUpdateAppState = (newState: AppState) => {
    commit(pass ? newState : { ...newState, selectedCorpus: appState.selectedCorpus });
  };

  const apriTeoria = (id: string) => { setTeoriaId(id); setView('theory'); };
  // dalla home o dalle Lezioni: la freccia indietro riporta lì
  const apriTeoriaDa = (id: string) => { setTeoriaId(id); apri('theory'); };

  const handleExamComplete = (
    historyEntry: ExamHistory, 
    categoryUpdates: Record<string, { correct: number, total: number }>,
    questionResults?: Record<string, 'correct' | 'incorrect' | 'omitted'>,
    format?: FormatId
  ) => {
    // Lo storico ricorda il formato (assente = 'ente'); la simulazione conta per il limite gratuito
    const entry: ExamHistory = { ...historyEntry, format: historyEntry.format ?? format ?? 'ente' };
    track({ name: 'sim_done', format: entry.format ?? 'ente', passed: entry.passed });
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
      if (user) syncToCloud(user.uid, newState);
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
      if (user) syncToCloud(user.uid, imported);
      toast('Progressi importati.', 'ok');
    } catch {
      toast('Non riesco a leggere il file: controlla che sia un salvataggio di AddiOFA.', 'errore');
    }
  };

  const handleOnboardingFinish = (result: OnboardingResult) => {
    if (result.diagnosticTotal) {
      track({ name: 'diag_done', audience: result.hasOfa === 'yes' ? 'recupero' : 'prevenzione' });
    }
    setAppState(prev => {
      const newState = { ...prev, onboarding: result };
      saveState(newState);
      if (user) syncToCloud(user.uid, newState);
      return newState;
    });
    setView('menu');
  };

  const handleConsentAccept = async (scopes: ScopeId[]) => {
    if (!user) return;
    setConsent(c => ({ ...c, busy: true, error: null }));
    try {
      if (isAtlasOnline()) await atlas.setLink(ECOSYSTEM.appId, scopes);
      saveProjectLink(scopes, user.uid);
      setConsent({ open: false, busy: false, error: null });
    } catch (err) {
      setConsent({ open: true, busy: false, error: (err as Error).message });
    }
  };

  // Senza consenso non c'è collegamento: si torna ospiti, con i progressi solo sul dispositivo
  const handleConsentCancel = () => {
    setConsent({ open: false, busy: false, error: null });
    logout();
  };

  const handleChangeScopes = async (scopes: ScopeId[]) => {
    if (!user) return;
    if (isAtlasOnline()) await atlas.setLink(ECOSYSTEM.appId, scopes);
    saveProjectLink(scopes, user.uid);
  };

  const handleUnlink = async () => {
    if (!user) return;
    if (isAtlasOnline()) await atlas.removeLink(ECOSYSTEM.appId);
    saveProjectLink(undefined, user.uid);
    await logout();
    setView('menu');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (isAtlasOnline()) await atlas.deleteMe();
    saveProjectLink(undefined, user.uid);
    setProjectAccount(null);
    await logout();
    setView('menu');
  };

  // Punteggio NOI: si aggiorna tornando al menu, solo con il consenso alla classifica
  useEffect(() => {
    if (!FEATURE_FLAGS.leaderboard || view !== 'menu' || !user || !isAtlasOnline() || !appState.projectLink?.scopes.includes('noi.leaderboard')) return;
    const mastered = countLearned(appState.stats, questions.map(q => q.id));
    const bestSim = Math.max(0, ...appState.history.map(h => h.score));
    atlas.postScore(ECOSYSTEM.appId, mastered, bestSim).catch(err => console.error('NOI', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, user, appState.projectLink]);

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

  const handleSelectCorpus = (corpus: CorpusType) => {
    if (corpus === 'all' && !pass) { apriPaywall('domande'); return; }
    commit({ ...appState, selectedCorpus: corpus });
  };

  // Una simulazione parte con il Pass o se ne resta una gratuita; altrimenti si mostra il Pass
  const avviaSimulazione = () => {
    if (!canStartSim(entitlement, 'ente', simsDone)) { apriPaywall('simulazione'); return; }
    setView('exam');
  };

  const aggiornaExtra = (fn: (s: AppState) => AppState) => {
    setAppState(prev => {
      const nuovo = fn(prev);
      saveState(nuovo);
      return nuovo;
    });
  };
  const ctxExtra: ExtraCtx = {
    appState, aggiorna: aggiornaExtra, pass, demo: isDemo,
    id: extra.id, params: extra.params, vai: vaiExtra, indietro: indietroExtra,
    apriPaywall: () => apriPaywall('generico'),
    apriTeoria: (id?: string) => { setTeoriaId(id); apri('theory'); },
    apriImpostazioni: () => apri('impostazioni'),
    apriLegale,
    apriInviti: () => apri('invites'),
    apriLanding: () => setView('landing'),
    avviaEsercizi: (modo, categoria) => { setLearnMode(modo); setLearnCategory(categoria); setView('learn'); },
    avviaSimulazione: avviaSimulazione,
    vaiHome: () => setView('menu'),
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
    <Layout banner={isDemo ? <DemoBanner /> : undefined}>
      {view === 'landing' && (
        <Landing
          onStartDiagnostic={() => setView('onboarding')}
          onSkip={() => setView('menu')}
          onOpenLegal={apriLegale}
          onOpenPass={() => apriPaywall('generico')}
        />
      )}
      {view === 'menu' && (
        <Menu
          appState={statoVista}
          corpus={corpusAttivo}
          onStartSmart={() => {
            setLearnMode('smart');
            setLearnCategory(undefined);
            setView('learn');
          }}
          onStartExam={avviaSimulazione}
          onNeedPass={apriPaywall}
          onOpenTheory={() => { setTeoriaId(undefined); apri('theory'); }}
          onOpenTheoryTopic={apriTeoriaDa}
          onOpenDiagnostic={() => setView('onboarding')}
          onOpenImpostazioni={() => (SCHERMATE.profilo ? vaiExtra('profilo') : apri('impostazioni'))}
          onNaviga={vaiScheda}
        />
      )}
      {view === 'lezioni' && (
        <Lezioni
          appState={statoVista}
          corpus={corpusAttivo}
          onStartLearn={() => apri('practiceMenu')}
          onOpenStats={() => apri('stats')}
          onStartErrors={() => { setLearnMode('weakness'); setLearnCategory(undefined); setView('learn'); }}
          onOpenTheory={() => { setTeoriaId(undefined); apri('theory'); }}
          onOpenTheoryTopic={apriTeoriaDa}
          onStartFocus={f => { setLearnMode('category'); setLearnCategory(f); setView('learn'); }}
          onOpenCheatSheet={() => apri('cheatsheet')}
          onOpenDiagnostic={() => setView('onboarding')}
          onOpenLeaderboard={FEATURE_FLAGS.leaderboard ? () => apri('leaderboard') : undefined}
          onSelectCorpus={handleSelectCorpus}
          onOpenPaywall={() => apriPaywall('generico')}
          onNeedPass={apriPaywall}
          onNaviga={vaiScheda}
          onOpenExtra={vaiExtra}
        />
      )}
      {view === 'extra' && !SCHERMATE[extra.id] && conBarra('home', (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
          <p className="text-base font-bold text-testo">Questa schermata non è ancora disponibile.</p>
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
          utente={user}
          onBack={indietro}
          onOpenPaywall={() => apriPaywall('generico')}
          onOpenLanding={() => setView('landing')}
          onVai={vaiExtra}
          corpus={corpusAttivo}
          onCambiaCorpus={handleSelectCorpus}
          onOpenLegal={apriLegale}
          onImport={() => fileInputRef.current?.click()}
          onExport={isDemo ? undefined : () => exportData(appState)}
          onLogin={loginOn ? handleLogin : undefined}
          onLogout={loginOn && user ? () => { logout(); } : undefined}
          onOpenProfile={FEATURE_FLAGS.projectId && user ? () => apri('profile') : undefined}
          onOpenDebug={import.meta.env.DEV ? () => apri('debug') : undefined}
        />
      )}
      {FEATURE_FLAGS.projectId && view === 'profile' && user && (
        <ProjectProfile
          user={user}
          account={projectAccount}
          appState={appState}
          onBack={indietro}
          onAccountChange={setProjectAccount}
          onChangeScopes={handleChangeScopes}
          onUnlink={handleUnlink}
          onDeleteAccount={handleDeleteAccount}
          onLogout={() => { logout(); setView('menu'); }}
        />
      )}
      {FEATURE_FLAGS.leaderboard && view === 'leaderboard' && (
        conBarra(null, <>
        <Leaderboard
          user={user}
          appState={appState}
          onBack={indietro}
          onLogin={handleLogin}
          onJoin={() => handleChangeScopes(Array.from(new Set([...(appState.projectLink?.scopes ?? ['profile']), 'noi.leaderboard'])) as ScopeId[])}
        />
        </>)
      )}
      {FEATURE_FLAGS.projectId && consent.open && user && (
        <ProjectConsent
          user={user}
          initialScopes={appState.projectLink?.scopes}
          busy={consent.busy}
          error={consent.error}
          onAccept={handleConsentAccept}
          onCancel={handleConsentCancel}
        />
      )}
      {view === 'onboarding' && (
        <Onboarding
          appState={appState}
          user={user}
          onLogin={handleLogin}
          onUpdateAppState={handleUpdateAppState}
          onFinish={handleOnboardingFinish}
          onOpenPaywall={() => apriPaywall('generico')}
        />
      )}
      {view === 'paywall' && (
        <Paywall
          reason={paywallReason}
          onBack={indietro}
          onWaitlist={() => apri('waitlist')}
          onOpenLegal={apriLegale}
        />
      )}
      {view === 'waitlist' && (
        <Waitlist onBack={indietro} onDone={() => setView('menu')} onOpenLegal={apriLegale} />
      )}
      {view === 'invites' && (
        <Invites onBack={indietro} />
      )}
      {view === 'theory' && (
        conBarra('lezioni', (
          <Suspense fallback={<Caricamento />}>
            <Theory key={teoriaId ?? 'elenco'} initialTopicId={teoriaId} onBack={indietro} onOpenPaywall={() => apriPaywall('teoria')} />
          </Suspense>
        ))
      )}
      {view === 'legal' && (
        <Legal section={legalSection} onBack={indietro} onSection={setLegalSection} />
      )}
      {view === 'cheatsheet' && (
        <CheatSheet onBack={indietro} onNeedPass={apriPaywall} />
      )}
      {view === 'thanks' && (
        <PaymentThanks onContinue={() => {
          window.history.replaceState(null, '', window.location.pathname);
          void refresh();
          setView('menu');
        }} />
      )}
      {view === 'practiceMenu' && (
        conBarra('lezioni', <>
        <PracticeMenu 
          selectedCorpus={corpusAttivo}
          onSelectCorpus={handleSelectCorpus}
          onSelectMode={(mode, category) => {
            setLearnMode(mode);
            setLearnCategory(category);
            setView('learn');
          }}
          onBack={indietro}
          onNeedPass={apriPaywall}
        />
        </>)
      )}
      {view === 'learn' && (
        <LearnMode 
          appState={statoVista}
          mode={learnMode}
          category={learnCategory}
          onUpdateAppState={handleUpdateAppState}
          onExit={() => setView('menu')}
          onNeedPass={apriPaywall}
          onOpenTheory={apriTeoria}
        />
      )}
      {view === 'exam' && (
        <ExamMode 
          corpus={corpusAttivo}
          onComplete={handleExamComplete}
          onExit={() => setView('menu')}
          onNeedPass={apriPaywall}
          onOpenTheory={apriTeoria}
        />
      )}
      {view === 'stats' && (
        conBarra('lezioni', <>
        <StatsMode 
          appState={appState}
          onExit={indietro}
          onNeedPass={apriPaywall}
          onVaiPercorso={() => vaiExtra('percorso')}
          onApriLezione={id => vaiExtra('lezione-dettaglio', { id })}
        />
        </>)
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
