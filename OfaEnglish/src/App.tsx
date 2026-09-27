/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserStats, ExamHistory, CorpusType, OnboardingResult } from './types';
import { ECOSYSTEM, CONSENT_VERSION, ScopeId } from './config/ecosystem';
import { atlas, isAtlasOnline, ProjectAccount } from './lib/atlas';
import { loadState, saveState, updateStreak, exportData, importData, syncToCloud, syncFromCloud } from './lib/storage';
import { getQuestionStats, applySm2, calculateContinuousQuality, calculateExpectedResponseTimeMs } from './lib/spacedRepetition';
import { questions } from './data/questions';
import { auth, signInWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Menu from './components/Menu';
import PracticeMenu from './components/PracticeMenu';
import LearnMode from './components/LearnMode';
import ExamMode from './components/ExamMode';
import StatsMode from './components/StatsMode';
import DebugMode from './components/DebugMode';
import { Layout } from './components/Layout';
import Onboarding from './components/Onboarding';
import Plans from './components/Plans';
import CheatSheet from './components/CheatSheet';
import PaymentThanks from './components/PaymentThanks';
import ProjectConsent from './components/ProjectConsent';
import ProjectProfile from './components/ProjectProfile';
import Leaderboard from './components/Leaderboard';

type View = 'menu' | 'practiceMenu' | 'learn' | 'exam' | 'stats' | 'debug' | 'onboarding' | 'plans' | 'cheatsheet' | 'thanks' | 'profile' | 'leaderboard';

// Il tempo di studio conta solo mentre si studia davvero (serve anche per la Garanzia Promosso)
const STUDY_VIEWS: View[] = ['learn', 'exam', 'onboarding'];

function initialView(state: AppState): View {
  const params = new URLSearchParams(window.location.search);
  if (params.get('pagamento') === 'ok') return 'thanks';
  const isNewUser = !state.onboarding && state.history.length === 0 && Object.keys(state.stats).length === 0;
  return isNewUser ? 'onboarding' : 'menu';
}

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => loadState());
  const [view, setView] = useState<View>(() => initialView(appState));
  const [learnMode, setLearnMode] = useState<'standard' | 'weakness' | 'blitz' | 'category' | 'recall' | 'smart'>('smart');
  const [learnCategory, setLearnCategory] = useState<string | undefined>(undefined);
  const viewRef = useRef(view);
  viewRef.current = view;
  const [user, setUser] = useState<User | null>(null);
  const [projectAccount, setProjectAccount] = useState<ProjectAccount | null>(null);
  const [consent, setConsent] = useState<{ open: boolean; busy: boolean; error: string | null }>({ open: false, busy: false, error: null });
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    // Listen to Auth State
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
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
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          const dateString = new Date().toISOString().split('T')[0];
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

  const handleUpdateAppState = (newState: AppState) => {
    const updatedState = updateStreak(newState);
    setAppState(updatedState);
    saveState(updatedState);
    if (user) syncToCloud(user.uid, updatedState);
  };

  const handleUpdateStats = (newStats: UserStats) => {
    handleUpdateAppState({ ...appState, stats: newStats });
  };

  const handleExamComplete = (
    historyEntry: ExamHistory, 
    categoryUpdates: Record<string, { correct: number, total: number }>,
    questionResults?: Record<string, 'correct' | 'incorrect' | 'omitted'>
  ) => {
    setAppState(prev => {
      const mergedCategoryStats = { ...(prev.examCategoryStats || {}) };
      for (const [cat, stats] of Object.entries(categoryUpdates)) {
        if (!mergedCategoryStats[cat]) {
          mergedCategoryStats[cat] = { correct: 0, total: 0 };
        }
        mergedCategoryStats[cat].correct += stats.correct;
        mergedCategoryStats[cat].total += stats.total;
      }

      const newStats: UserStats = { ...(prev.stats || {}) };
      let answeredCount = 0;
      if (questionResults) {
        // Map question logs by questionId for fast telemetry retrieval
        const logsMap = new Map((historyEntry.questionLogs || []).map(l => [l.questionId, l]));
        const speed = prev.speedStats;

        for (const [qId, result] of Object.entries(questionResults)) {
          const currentQ = getQuestionStats(newStats, qId);
          const log = logsMap.get(qId);
          const question = questions.find(q => q.id === qId);
          if (result !== 'omitted') answeredCount++;

          // Le risposte della simulazione aggiornano SM-2 come in allenamento:
          // giusta → voto continuo da tempo e cambi di opzione; sbagliata o omessa → 0
          let quality = 0;
          if (result === 'correct') {
            const expectedMs = calculateExpectedResponseTimeMs(question, speed?.speedFactor ?? 1.0, speed?.avgWpm ?? 180);
            quality = calculateContinuousQuality(true, log?.timeSpentMs ?? expectedMs, expectedMs, 1, 'high', {
              switchCount: log?.switchCount ?? 0,
              trajectory: log?.trajectory ?? [],
              firstOptionIndex: log?.firstOptionIndex,
            }, question);
          }
          const sm2 = applySm2({ repetitions: currentQ.box, interval: currentQ.interval, easiness: currentQ.easiness }, quality);

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
            lastSeen: Date.now(),
            lastResponseTimeMs: log?.timeSpentMs ?? currentQ.lastResponseTimeMs,
            lastFirstClickTimeMs: log?.firstClickTimeMs ?? currentQ.lastFirstClickTimeMs,
            lastSwitchCount: log?.switchCount ?? currentQ.lastSwitchCount,
            lastTrajectory: log?.trajectory ?? currentQ.lastTrajectory,
          };
        }
      }
      
      const dateString = new Date().toISOString().split('T')[0];
      const newDailyActivity = { ...(prev.dailyActivity || {}) };
      newDailyActivity[dateString] = (newDailyActivity[dateString] || 0) + answeredCount;

      const newState = updateStreak({ 
        ...prev, 
        stats: newStats,
        history: [...prev.history, historyEntry],
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
    if (file) {
      try {
        const imported = await importData(file);
        setAppState(imported);
        saveState(imported);
        if (user) syncToCloud(user.uid, imported);
        alert("Dati importati con successo!");
      } catch (err) {
        alert("Errore nell'importazione dei dati. Assicurati che il file sia valido.");
      }
    }
  };

  const handleOnboardingFinish = (result: OnboardingResult) => {
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
    if (view !== 'menu' || !user || !isAtlasOnline() || !appState.projectLink?.scopes.includes('noi.leaderboard')) return;
    const mastered = questions.filter(q => (appState.stats[q.id]?.box ?? 0) > 0).length;
    const bestSim = Math.max(0, ...appState.history.map(h => h.score));
    atlas.postScore(ECOSYSTEM.appId, mastered, bestSim).catch(err => console.error('NOI', err));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, user, appState.projectLink]);

  const handleSelectCorpus = (corpus: CorpusType) => {
    handleUpdateAppState({
      ...appState,
      selectedCorpus: corpus
    });
  };

  return (
    <Layout>
      {view === 'menu' && (
        <Menu 
          appState={appState} 
          user={user}
          onStartSmart={() => {
            setLearnMode('smart');
            setLearnCategory(undefined);
            setView('learn');
          }}
          onStartLearn={() => setView('practiceMenu')}
          onStartExam={() => setView('exam')}
          onOpenStats={() => setView('stats')}
          onExport={() => exportData(appState)}
          onImport={() => fileInputRef.current?.click()}
          onLogin={signInWithGoogle}
          onLogout={logout}
          onOpenDebug={import.meta.env.DEV ? () => setView('debug') : undefined}
          onSelectCorpus={handleSelectCorpus}
          onOpenPlans={() => setView('plans')}
          onOpenCheatSheet={() => setView('cheatsheet')}
          onOpenDiagnostic={() => setView('onboarding')}
          onOpenProfile={() => setView('profile')}
          onOpenLeaderboard={() => setView('leaderboard')}
        />
      )}
      {view === 'profile' && user && (
        <ProjectProfile
          user={user}
          account={projectAccount}
          appState={appState}
          onBack={() => setView('menu')}
          onAccountChange={setProjectAccount}
          onChangeScopes={handleChangeScopes}
          onUnlink={handleUnlink}
          onDeleteAccount={handleDeleteAccount}
          onLogout={() => { logout(); setView('menu'); }}
        />
      )}
      {view === 'leaderboard' && (
        <Leaderboard
          user={user}
          appState={appState}
          onBack={() => setView('menu')}
          onLogin={signInWithGoogle}
          onJoin={() => handleChangeScopes(Array.from(new Set([...(appState.projectLink?.scopes ?? ['profile']), 'noi.leaderboard'])) as ScopeId[])}
        />
      )}
      {consent.open && user && (
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
          onLogin={signInWithGoogle}
          onUpdateAppState={handleUpdateAppState}
          onFinish={handleOnboardingFinish}
        />
      )}
      {view === 'plans' && (
        <Plans
          appState={appState}
          user={user}
          onBack={() => setView('menu')}
          onContinueFree={() => setView('menu')}
        />
      )}
      {view === 'cheatsheet' && (
        <CheatSheet onBack={() => setView('menu')} />
      )}
      {view === 'thanks' && (
        <PaymentThanks onContinue={() => {
          window.history.replaceState(null, '', window.location.pathname);
          setView('menu');
        }} />
      )}
      {view === 'practiceMenu' && (
        <PracticeMenu 
          selectedCorpus={appState.selectedCorpus || 'all'}
          onSelectCorpus={handleSelectCorpus}
          onSelectMode={(mode, category) => {
            setLearnMode(mode);
            setLearnCategory(category);
            setView('learn');
          }}
          onBack={() => setView('menu')}
        />
      )}
      {view === 'learn' && (
        <LearnMode 
          appState={appState}
          mode={learnMode}
          category={learnCategory}
          onUpdateAppState={handleUpdateAppState}
          onExit={() => setView('menu')}
        />
      )}
      {view === 'exam' && (
        <ExamMode 
          corpus={appState.selectedCorpus || 'all'}
          onComplete={handleExamComplete}
          onExit={() => setView('menu')}
        />
      )}
      {view === 'stats' && (
        <StatsMode 
          appState={appState}
          onExit={() => setView('menu')}
        />
      )}
      <input 
        type="file" 
        accept=".json" 
        style={{ display: 'none' }} 
        ref={fileInputRef}
        onChange={handleImport}
      />
      {import.meta.env.DEV && view === 'debug' && (
        <DebugMode onBack={() => setView('menu')} />
      )}
    </Layout>
  );
}
