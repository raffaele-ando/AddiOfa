import { AppState, UserStats, ExamHistory } from '../types';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = 'ofa_polimi_app_state';

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

export function loadState(): AppState {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return defaultState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state', err);
    return defaultState;
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

export async function syncToCloud(userId: string, state: AppState) {
  try {
    await setDoc(doc(db, "users", userId), state, { merge: true });
    console.log("State synced to cloud.");
  } catch (err) {
    console.error('Error syncing to cloud', err);
  }
}

export async function syncFromCloud(userId: string, localState: AppState): Promise<AppState> {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const cloudState = docSnap.data() as AppState;
      const mergedState = { ...localState };
      
      // 1. Merge history uniquely by date
      const historyMap = new Map<number, any>();
      localState.history?.forEach(h => historyMap.set(h.date, h));
      cloudState.history?.forEach(h => historyMap.set(h.date, h));
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
        if (!mergedState.examCategoryStats) mergedState.examCategoryStats = {};
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
        if (!mergedState.stats) mergedState.stats = {};
        for (const qId in cloudState.stats) {
          const cloudStat = cloudState.stats[qId];
          const localStat = mergedState.stats[qId];
          if (!localStat || cloudStat.lastSeen > localStat.lastSeen) {
            mergedState.stats[qId] = cloudStat;
          }
        }
      }

      // 4. Merge speedStats (keep the one with most answers)
      if (cloudState.speedStats) {
        if (!mergedState.speedStats || cloudState.speedStats.totalAnswers > mergedState.speedStats.totalAnswers) {
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
         mergedState.streak = Math.max(cloudState.streak, mergedState.streak);
      }

      // 6. Merge dailyActivity
      if (cloudState.dailyActivity) {
        if (!mergedState.dailyActivity) mergedState.dailyActivity = {};
        for (const [dateStr, count] of Object.entries(cloudState.dailyActivity)) {
          mergedState.dailyActivity[dateStr] = Math.max(mergedState.dailyActivity[dateStr] || 0, count);
        }
      }
      
      // 7. Merge dailyTimeSpent
      if (cloudState.dailyTimeSpent) {
        if (!mergedState.dailyTimeSpent) mergedState.dailyTimeSpent = {};
        for (const [dateStr, time] of Object.entries(cloudState.dailyTimeSpent)) {
          mergedState.dailyTimeSpent[dateStr] = Math.max(mergedState.dailyTimeSpent[dateStr] || 0, time);
        }
      }

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

  if (!newState.lastActiveDate) {
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

  return newState;
}

export function exportData(state: AppState) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "ofa_polimi_progress.json");
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
        if (typeof importedState.streak !== 'number') throw new Error("Invalid format");
        resolve(importedState);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
