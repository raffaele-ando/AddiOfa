import { AppState } from '../types';
import { GUARANTEE, SIM_PASS_SCORE } from '../config/offer';

export interface GuaranteeProgress {
  studyDays: number;
  passedSimulations: number;
  lastSimulationsPassed: number; // quante delle ultime N sono superate
  checks: { label: string; current: number; target: number; done: boolean }[];
  qualified: boolean;
}

export function computeGuaranteeProgress(state: AppState): GuaranteeProgress {
  const minSeconds = GUARANTEE.studyMinutesPerDay * 60;
  const studyDays = Object.values(state.dailyTimeSpent || {}).filter(sec => sec >= minSeconds).length;

  // Contano solo le simulazioni nel formato del test di recupero: il punteggio del TENG ha la penalità sugli errori
  // e una soglia diversa, e non si confronta con SIM_PASS_SCORE.
  const history = (state.history || []).filter(h => (h.format ?? 'ente') === 'ente');
  const superata = (h: { score: number }) => h.score >= SIM_PASS_SCORE;
  const passedSimulations = history.filter(superata).length;
  const lastN = history.slice(-GUARANTEE.lastSimulationsAllPassed);
  const lastSimulationsPassed = lastN.filter(superata).length;

  const checks = [
    {
      label: `Giorni con ${GUARANTEE.studyMinutesPerDay} min di studio`,
      current: Math.min(studyDays, GUARANTEE.studyDays),
      target: GUARANTEE.studyDays,
    },
    {
      label: `Simulazioni superate (≥ ${SIM_PASS_SCORE}/30)`,
      current: Math.min(passedSimulations, GUARANTEE.passedSimulations),
      target: GUARANTEE.passedSimulations,
    },
    {
      label: `Ultime ${GUARANTEE.lastSimulationsAllPassed} simulazioni superate`,
      current: lastN.length < GUARANTEE.lastSimulationsAllPassed ? Math.min(lastSimulationsPassed, lastN.length) : lastSimulationsPassed,
      target: GUARANTEE.lastSimulationsAllPassed,
    },
  ].map(c => ({ ...c, done: c.current >= c.target }));

  return {
    studyDays,
    passedSimulations,
    lastSimulationsPassed,
    checks,
    qualified: checks.every(c => c.done),
  };
}
