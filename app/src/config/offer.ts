// Tutto ciò che riguarda nome, offerta e condizioni commerciali sta qui, così si cambia in un posto solo.
// Decisioni di prodotto: docs/business/AddiOFA_piano_definitivo.md

export const APP_NAME = 'AddiOFA';

export const DISCLAIMER =
  "Progetto studentesco indipendente e non ufficiale. Non affiliato, autorizzato o collegato al Politecnico di Milano.";

// ---- Il test reale (fonti ufficiali del Politecnico, a.a. 2026/27)
// Il TENG è la sezione di inglese del test d'ingresso: 30 domande in 15 minuti, OFA se meno di 24 risposte esatte.
export const REAL_TEST_QUESTIONS = 30;
export const REAL_TEST_PASS_MARK = 24;

// Costo di un tentativo del test di recupero presso gli enti convenzionati (27,50 - 30,50 €)
export const RETAKE_COST_EUR = 30;

// Conseguenze mostrate nel funnel: devono restare vere e verificabili, niente allarmismi inventati
export const OFA_CONSEQUENCES = [
  `Il test di recupero presso gli enti convenzionati costa circa ${RETAKE_COST_EUR} € a tentativo`,
  "Finché l'OFA non è tolto, nel piano degli studi puoi inserire solo esami del 1° anno",
  "Le scadenze per avere il piano completo del 2° anno cadono tra fine agosto e fine settembre",
];
export const OFA_RULES_NOTE = "Le regole possono cambiare: controlla sempre il regolamento aggiornato del tuo corso sul sito del Politecnico.";

// Scadenze del calendario ufficiale 2026/27 per avere il piano completo del 2° anno
export const OFA_DEADLINES = [
  { scuola: 'Architettura', data: '31 agosto' },
  { scuola: 'Design', data: '3 settembre' },
  { scuola: 'Ingegneria', data: '25 settembre' },
];

// ---- Formati di simulazione
export type FormatId = 'ente' | 'teng';

export interface ExamFormat {
  id: FormatId;
  name: string;
  summary: string;
  questions: number;
  minutes: number;
  passMark: number;       // risposte esatte per superare
  options: 4 | 5;         // opzioni per domanda
  penalty: number;        // punti tolti per ogni risposta sbagliata (0 = nessuna penalità)
  notes: string;
}

export const FORMATS: Record<FormatId, ExamFormat> = {
  ente: {
    id: 'ente', name: 'Test di recupero (enti convenzionati)',
    summary: '30 domande, 4 opzioni, 15 minuti. Si supera con 25 su 30.',
    questions: 30, minutes: 15, passMark: 25, options: 4, penalty: 0,
    notes: 'Formato del test di LinguaViva. Language Academy e British Institutes non pubblicano la soglia: controlla con l\'ente che hai scelto.',
  },
  teng: {
    id: 'teng', name: 'TENG (test d\'ingresso)',
    summary: '30 domande, 5 opzioni, 15 minuti. Meno di 24 risposte esatte dà l\'OFA.',
    questions: 30, minutes: 15, passMark: 24, options: 5, penalty: 0.25,
    notes: 'Ogni risposta sbagliata toglie 0,25 punti dal punteggio del test d\'ingresso; per l\'OFA conta il numero di risposte esatte.',
  },
};
export const DEFAULT_FORMAT: FormatId = 'ente';

// Soglia usata dalla stima del diagnostico e dal tracker della garanzia (formato "ente")
export const SIM_PASS_SCORE = FORMATS.ente.passMark;

// ---- Il Pass
const env = import.meta.env;

export const PASS = {
  id: 'pass' as const,
  name: 'Pass AddiOFA',
  priceEur: 14.99,
  launchPriceEur: 9.99,
  launchUntil: '2027-01-31',       // data vera, scritta ovunque: niente timer che riparte
  validMonths: 12,
  summary: 'Tutte le domande, simulazioni illimitate, spiegazioni in italiano e teoria per ogni argomento. Pagamento una tantum, nessun abbonamento.',
  features: [
    'Tutte le domande del banco, con spiegazione in italiano',
    'Simulazioni illimitate nei due formati: test di recupero e TENG',
    'Scheda di teoria per ognuno dei 31 argomenti',
    'Ripasso intelligente sugli errori e statistiche complete',
    'Valido 12 mesi, un solo pagamento',
  ],
};

export const FREE_FEATURES = [
  'Quiz diagnostico da 10 domande con la probabilità di superare il test',
  'Ripasso intelligente su un nucleo di circa 100 domande',
  'Una simulazione completa',
  'Una scheda di teoria',
];

// Con VITE_PAYMENTS_ENABLED=true e un link Stripe (VITE_STRIPE_LINK) il pulsante apre il pagamento;
// altrimenti porta alla lista d'attesa. Resta spento finché l'utente non ha la partita IVA pronta.
export const STRIPE_LINK: string | undefined = env.VITE_STRIPE_LINK;
export const PAYMENTS_ENABLED: boolean =
  env.VITE_PAYMENTS_ENABLED === 'true' && typeof STRIPE_LINK === 'string' && STRIPE_LINK.startsWith('https://');

/** Prezzo da mostrare oggi: quello di lancio fino a launchUntil (compreso), poi quello pieno. */
export function currentPriceEur(now: Date = new Date()): number {
  const fine = new Date(`${PASS.launchUntil}T23:59:59`);
  return now.getTime() <= fine.getTime() ? PASS.launchPriceEur : PASS.priceEur;
}
export function isLaunchPrice(now: Date = new Date()): boolean {
  return currentPriceEur(now) === PASS.launchPriceEur;
}

// ---- Limiti della parte gratuita
export const FREE_LIMITS = {
  diagnostic: 10,   // domande del quiz diagnostico
  coreQuestions: 100, // domande del nucleo gratuito
  freeSimulations: 1,
  freeTheoryTopics: 1,
};

// ---- Inviti: il Pass è gratis con 3 compagni verificati che finiscono il diagnostico
export const INVITE = {
  required: 3,
  minDiagnosticSeconds: 240,
  emailDomain: 'mail.polimi.it',
  inviteeDiscountPct: 20,
};
export const AMBASSADOR_COMMISSION_PCT = 20; // sulle vendite dirette, dichiarata come link con commissione

// ---- Cosa si mostra (si accende quando è pronto)
export const FEATURE_FLAGS = {
  guarantee: false,      // garanzia di rimborso: estate 2027
  leaderboard: false,    // classifica NOI
  projectId: false,      // login e consenso Project ID
  ambassador: false,     // programma ambassador
};

export type PublicAudience = 'recupero' | 'prevenzione';

// ---- Garanzia: non più in vendita, il codice resta per l'estate 2027 (FEATURE_FLAGS.guarantee)
// Condizioni della garanzia: sono mostrate per intero accanto al prezzo (non solo nei termini),
// e l'app le misura con il tracker in Statistiche, così l'utente sa sempre se ne ha diritto.
export const GUARANTEE = {
  studyDays: 7,           // giorni con almeno studyMinutesPerDay minuti di studio attivo
  studyMinutesPerDay: 30,
  passedSimulations: 5,   // simulazioni con almeno SIM_PASS_SCORE/30
  lastSimulationsAllPassed: 3, // le ultime N simulazioni tutte superate
  claimDays: 7,           // giorni dall'esito ufficiale per chiedere il rimborso
};
export const GUARANTEE_CONDITIONS = [
  `Almeno ${GUARANTEE.studyDays} giorni con ${GUARANTEE.studyMinutesPerDay} minuti di studio attivo nell'app (sessioni e simulazioni)`,
  `Almeno ${GUARANTEE.passedSimulations} simulazioni superate con ${SIM_PASS_SCORE}/30 o più`,
  `Le ultime ${GUARANTEE.lastSimulationsAllPassed} simulazioni prima del test tutte superate`,
  `Richiesta entro ${GUARANTEE.claimDays} giorni dall'esito ufficiale, con la prova dell'esito negativo`,
];

export function formatEur(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
}
