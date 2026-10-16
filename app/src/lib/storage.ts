import { AppState, UserStats, ExamHistory } from '../types';

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
 * Porta qualunque cosa sia stata salvata (versioni vecchie, JSON rovinato, file importato) a un AppState usabile:
 * `stats` oggetto, `history` elenco di simulazioni, `streak` numero. Non butta via i dati buoni.
 */
export function normalizeState(raw: unknown): AppState {
  const out = statoVuoto();
  if (!isObj(raw)) return out;
  const stats: UserStats = {};
  if (isObj(raw.stats)) {
    for (const [id, st] of Object.entries(raw.stats)) if (isObj(st)) stats[id] = st as UserStats[string];
  }
  // Salvataggi di versioni precedenti: le simulazioni nel vecchio formato a 5 opzioni (TENG) non esistono più e non si contano;
  // il campo `format` delle altre si toglie. `selectedCorpus` e `projectLink` (nucleo gratuito, Project ID) non servono più.
  const history = Array.isArray(raw.history)
    ? raw.history
        .filter((h): h is ExamHistory & { format?: string } => isObj(h) && typeof h.date === 'number' && Number.isFinite(h.date) && h.format !== 'teng')
        .map(({ format: _formato, ...resto }) => resto as ExamHistory)
    : [];
  const { selectedCorpus: _corpus, projectLink: _link, ...conservati } = raw as Record<string, unknown>;
  return {
    ...conservati,
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
