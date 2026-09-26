/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { AppState, UserStats, ExamHistory, CorpusType } from './types';
import { loadState, saveState, updateStreak, exportData, importData, syncToCloud, syncFromCloud } from './lib/storage';
import { getQuestionStats } from './lib/spacedRepetition';
import { auth, signInWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Menu from './components/Menu';
import PracticeMenu from './components/PracticeMenu';
import LearnMode from './components/LearnMode';
import ExamMode from './components/ExamMode';
import StatsMode from './components/StatsMode';
import DebugMode from './components/DebugMode';
import { Layout } from './components/Layout';

type View = 'menu' | 'practiceMenu' | 'learn' | 'exam' | 'stats' | 'debug';

export default function App() {
  const [view, setView] = useState<View>('menu');
  const [learnMode, setLearnMode] = useState<'standard' | 'weakness' | 'blitz' | 'category' | 'recall' | 'smart'>('smart');
  const [learnCategory, setLearnCategory] = useState<string | undefined>(undefined);
  const [appState, setAppState] = useState<AppState>(() => loadState());
  const [user, setUser] = useState<User | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Listen to Auth State
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync data from cloud upon login
        const syncedState = await syncFromCloud(currentUser.uid, appState);
        setAppState(syncedState);
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
      if (document.visibilityState === 'visible') {
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
      if (questionResults) {
        // Map question logs by questionId for fast telemetry retrieval
        const logsMap = new Map((historyEntry.questionLogs || []).map(l => [l.questionId, l]));

        for (const [qId, result] of Object.entries(questionResults)) {
          const currentQ = getQuestionStats(newStats, qId);
          const log = logsMap.get(qId);

          if (result === 'correct') {
            newStats[qId] = {
              ...currentQ,
              correct: currentQ.correct + 1,
              box: currentQ.box + 1,
              lastSeen: Date.now(),
              lastResponseTimeMs: log?.timeSpentMs ?? currentQ.lastResponseTimeMs,
              lastFirstClickTimeMs: log?.firstClickTimeMs ?? currentQ.lastFirstClickTimeMs,
              lastSwitchCount: log?.switchCount ?? currentQ.lastSwitchCount,
              lastTrajectory: log?.trajectory ?? currentQ.lastTrajectory,
            };
          } else if (result === 'incorrect') {
            newStats[qId] = {
              ...currentQ,
              incorrect: currentQ.incorrect + 1,
              box: 0,
              lastSeen: Date.now(),
              lastResponseTimeMs: log?.timeSpentMs ?? currentQ.lastResponseTimeMs,
              lastFirstClickTimeMs: log?.firstClickTimeMs ?? currentQ.lastFirstClickTimeMs,
              lastSwitchCount: log?.switchCount ?? currentQ.lastSwitchCount,
              lastTrajectory: log?.trajectory ?? currentQ.lastTrajectory,
            };
          } else if (result === 'omitted') {
            newStats[qId] = {
              ...currentQ,
              omitted: (currentQ.omitted || 0) + 1,
              lastSeen: Date.now(),
              lastResponseTimeMs: log?.timeSpentMs ?? currentQ.lastResponseTimeMs,
              lastFirstClickTimeMs: log?.firstClickTimeMs ?? currentQ.lastFirstClickTimeMs,
              lastSwitchCount: log?.switchCount ?? currentQ.lastSwitchCount,
              lastTrajectory: log?.trajectory ?? currentQ.lastTrajectory,
            };
          }
        }
      }
      
      const dateString = new Date().toISOString().split('T')[0];
      const newDailyActivity = { ...(prev.dailyActivity || {}) };
      newDailyActivity[dateString] = (newDailyActivity[dateString] || 0) + 30; // Assuming 30 questions in exam

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
          onOpenDebug={() => setView('debug')}
          onSelectCorpus={handleSelectCorpus}
        />
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
      {view === 'debug' && (
        <DebugMode onBack={() => setView('menu')} />
      )}
    </Layout>
  );
}
