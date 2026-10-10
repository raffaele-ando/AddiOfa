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

  const history = state.history || [];
  const passedSimulations = history.filter(h => h.score >= SIM_PASS_SCORE).length;
  const lastN = history.slice(-GUARANTEE.lastSimulationsAllPassed);
  const lastSimulationsPassed = lastN.filter(h => h.score >= SIM_PASS_SCORE).length;

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
