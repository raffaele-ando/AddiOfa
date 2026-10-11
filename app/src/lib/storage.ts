import { AppState, UserStats, ExamHistory } from '../types';
import { getDb, isDemoMode } from './firebase';

const STORAGE_KEY = 'ofa_polimi_app_state'; // chiave storica: non cambiarla o si perdono i progressi salvati

const defaultState: AppState = {
  stats: {},
  history: [],
  streak: 0,
  lastActiveDate: null,
  speedStats: {
    minTimeMs: 3000, 
    maxTimeMs: 15000,
    avgTimeMs: 8000,
    totalAnswers: 0
  },
  examCategoryStats: {}
};

const isObj = (v: unknown): v is Record<string, any> => typeof v === 'object' && v !== null && !Array.isArray(v);
const finito = (v: unknown, ripiego: number) => (typeof v === 'number' && Number.isFinite(v) ? v : ripiego);

function statoVuoto(): AppState {
  return { ...defaultState, stats: {}, history: [], speedStats: { ...defaultState.speedStats! }, examCategoryStats: {} };
}

/**
 * Porta qualunque cosa sia stata salvata (versioni vecchie, JSON rovinato, import o cloud) a un AppState usabile:
 * `stats` oggetto, `history` elenco di simulazioni, `streak` numero. Non butta via i dati buoni.
 */
export function normalizeState(raw: unknown): AppState {
  const out = statoVuoto();
  if (!isObj(raw)) return out;
  const stats: UserStats = {};
  if (isObj(raw.stats)) {
    for (const [id, st] of Object.entries(raw.stats)) if (isObj(st)) stats[id] = st as UserStats[string];
  }
  const history = Array.isArray(raw.history)
    ? raw.history.filter((h): h is ExamHistory => isObj(h) && typeof h.date === 'number' && Number.isFinite(h.date))
    : [];
  return {
    ...raw,
    stats,
    history,
    streak: Math.max(0, Math.floor(finito(raw.streak, 0))),
    lastActiveDate: typeof raw.lastActiveDate === 'number' && Number.isFinite(raw.lastActiveDate) ? raw.lastActiveDate : null,
    speedStats: isObj(raw.speedStats) ? (raw.speedStats as AppState['speedStats']) : out.speedStats,
    examCategoryStats: isObj(raw.examCategoryStats) ? (raw.examCategoryStats as AppState['examCategoryStats']) : {},
    dailyActivity: isObj(raw.dailyActivity) ? (raw.dailyActivity as AppState['dailyActivity']) : undefined,
    dailyTimeSpent: isObj(raw.dailyTimeSpent) ? (raw.dailyTimeSpent as AppState['dailyTimeSpent']) : undefined,
    onboarding: isObj(raw.onboarding) ? (raw.onboarding as AppState['onboarding']) : undefined,
  } as AppState;
}

export function loadState(): AppState {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return statoVuoto();
    }
    return normalizeState(JSON.parse(serializedState));
  } catch (err) {
    console.error('Error loading state', err);
    return statoVuoto();
  }
}

export function saveState(state: AppState) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state', err);
  }
}

// Un documento Firestore ha un limite di 1 MiB. I clic dettagliati di ogni simulazione (~14 KB l'una)
// restano solo in locale; sul cloud va lo storico alleggerito, con i log per domanda solo per le ultime 50.
const CLOUD_HISTORY_WITH_LOGS = 50;

export function toCloudState(state: AppState): AppState {
  const history = state.history || [];
  const firstWithLogs = Math.max(0, history.length - CLOUD_HISTORY_WITH_LOGS);
  // Firestore rifiuta i campi `undefined` (ce ne sono nelle statistiche e nell'onboarding): il passaggio da JSON li toglie
  return JSON.parse(JSON.stringify({
    ...state,
    history: history.map((h, i) => {
      if (i < firstWithLogs) {
        const { questionLogs, answers, questionIds, ...rest } = h;
        return rest;
      }
      return {
        ...h,
        questionLogs: h.questionLogs?.map(({ clickEvents, trajectory, ...log }) => log),
      };
    }),
  }));
}

// Il cloud si usa solo con un utente collegato e mai in demo (Firebase si carica qui, al primo uso)
export async function syncToCloud(userId: string, state: AppState) {
  if (!userId || isDemoMode()) return;
  try {
    const [db, { doc, setDoc }] = await Promise.all([getDb(), import('firebase/firestore')]);
    await setDoc(doc(db, "users", userId), toCloudState(state), { merge: true });
  } catch (err) {
    console.error('Error syncing to cloud', err);
  }
}

export async function syncFromCloud(userId: string, localState: AppState): Promise<AppState> {
  if (!userId || isDemoMode()) return localState;
  try {
    const [db, { doc, getDoc }] = await Promise.all([getDb(), import('firebase/firestore')]);
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const cloudState = normalizeState(docSnap.data());
      // copie dei contenitori che si modificano sotto: lo stato locale (anche quello di React) non si muta
      const mergedState: AppState = {
        ...localState,
        stats: { ...(localState.stats ?? {}) },
        dailyActivity: { ...(localState.dailyActivity ?? {}) },
        dailyTimeSpent: { ...(localState.dailyTimeSpent ?? {}) },
        examCategoryStats: { ...(localState.examCategoryStats ?? {}) },
      };
      
      // 1. Merge history uniquely by date
      const historyMap = new Map<number | string, any>();
      // Prima il cloud, poi il locale: a parità di esame vince la copia locale, che ha i log completi
      cloudState.history?.forEach(h => historyMap.set(h.id ?? h.date, h));
      localState.history?.forEach(h => historyMap.set(h.id ?? h.date, h));
      mergedState.history = Array.from(historyMap.values()).sort((a, b) => a.date - b.date);

      // 2. Reconstruct examCategoryStats perfectly from merged history
      const newExamCategoryStats: Record<string, { correct: number, total: number }> = {};
      mergedState.history.forEach(h => {
        if (h.categoryStats) {
          for (const [cat, stats] of Object.entries(h.categoryStats)) {
            if (!newExamCategoryStats[cat]) newExamCategoryStats[cat] = { correct: 0, total: 0 };
            newExamCategoryStats[cat].correct += stats.correct;
            newExamCategoryStats[cat].total += stats.total;
          }
        }
      });
      
      if (Object.keys(newExamCategoryStats).length > 0) {
        mergedState.examCategoryStats = newExamCategoryStats;
      } else if (cloudState.examCategoryStats) {
        // Fallback for legacy data without categoryStats in history
        for (const cat in cloudState.examCategoryStats) {
          const cloudCat = cloudState.examCategoryStats[cat];
          const localCat = mergedState.examCategoryStats[cat];
          if (!localCat || cloudCat.total > localCat.total) {
            mergedState.examCategoryStats[cat] = cloudCat;
          }
        }
      }
      
      // 3. Merge Question stats based on lastSeen timestamp (most recent state wins)
      if (cloudState.stats) {
        for (const qId in cloudState.stats) {
          const cloudStat = cloudState.stats[qId];
          const localStat = mergedState.stats[qId];
          if (!localStat || (cloudStat.lastSeen ?? 0) > (localStat.lastSeen ?? 0)) {
            mergedState.stats[qId] = cloudStat;
          }
        }
      }

      // 4. Merge speedStats (keep the one with most answers)
      if (cloudState.speedStats) {
        if (!mergedState.speedStats || (cloudState.speedStats.totalAnswers ?? 0) > (mergedState.speedStats.totalAnswers ?? 0)) {
          mergedState.speedStats = cloudState.speedStats;
        }
      }
      
      // 5. Merge streak and lastActiveDate
      const cloudLastActive = cloudState.lastActiveDate || 0;
      const localLastActive = mergedState.lastActiveDate || 0;
      if (cloudLastActive > localLastActive) {
         mergedState.lastActiveDate = cloudLastActive;
         mergedState.streak = cloudState.streak;
      } else if (cloudLastActive === localLastActive) {
         mergedState.streak = Math.max(cloudState.streak, finito(mergedState.streak, 0));
      }

      // 6. Merge dailyActivity
      if (cloudState.dailyActivity) {
        for (const [dateStr, count] of Object.entries(cloudState.dailyActivity)) {
          mergedState.dailyActivity[dateStr] = Math.max(mergedState.dailyActivity[dateStr] || 0, count);
        }
      }
      
      // 7. Merge dailyTimeSpent
      if (cloudState.dailyTimeSpent) {
        for (const [dateStr, time] of Object.entries(cloudState.dailyTimeSpent)) {
          mergedState.dailyTimeSpent[dateStr] = Math.max(mergedState.dailyTimeSpent[dateStr] || 0, time);
        }
      }

      // 8. Consenso Project ID: vince la scelta più recente
      if (cloudState.projectLink && (!mergedState.projectLink || cloudState.projectLink.updatedAt > mergedState.projectLink.updatedAt)) {
        mergedState.projectLink = cloudState.projectLink;
      }
      if (!mergedState.onboarding && cloudState.onboarding) mergedState.onboarding = cloudState.onboarding;

      saveState(mergedState);
      return mergedState;
    }
  } catch (err) {
    console.error('Error syncing from cloud', err);
  }
  return localState;
}

export function updateStreak(state: AppState): AppState {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const ONE_DAY = 86400000;

  const newState = { ...state };
  newState.streak = Math.max(0, Math.floor(finito(newState.streak, 0)));

  if (!newState.lastActiveDate || !Number.isFinite(newState.lastActiveDate)) {
    newState.streak = 1;
    newState.lastActiveDate = now.getTime();
  } else {
    const lastActive = new Date(newState.lastActiveDate);
    const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate()).getTime();
    const diffDays = Math.round((today - lastActiveDay) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day
      newState.streak += 1;
      newState.lastActiveDate = now.getTime();
    } else if (diffDays > 1) {
      // Streak broken
      newState.streak = 1;
      newState.lastActiveDate = now.getTime();
    } else {
      // Same day (diffDays === 0), just update exact time to reflect latest activity
      newState.lastActiveDate = now.getTime();
    }
  }
  // chi è attivo oggi ha almeno 1 giorno di serie (uno stato importato può avere serie 0 con data di oggi)
  if (newState.streak < 1) newState.streak = 1;

  return newState;
}

export function exportData(state: AppState) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "addiofa_progressi.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

export function importData(file: File): Promise<AppState> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedState = JSON.parse(event.target?.result as string);
        // Basic validation
        if (typeof importedState.streak !== 'number' || !Array.isArray(importedState.history) || typeof importedState.stats !== 'object' || importedState.stats === null) {
          throw new Error("Invalid format");
        }
        resolve(normalizeState(importedState));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
