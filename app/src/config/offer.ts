// Tutto ciò che riguarda nome, offerta e condizioni commerciali sta qui, così si cambia in un posto solo.

export const APP_NAME = 'AddiOFA';

export const DISCLAIMER =
  "Progetto studentesco indipendente e non ufficiale. Non affiliato, autorizzato o collegato al Politecnico di Milano.";

// Soglia del test reale (risposte esatte su 30) usata dalla stima del quiz diagnostico
export const REAL_TEST_QUESTIONS = 30;
export const REAL_TEST_PASS_MARK = 24;

// Costo indicativo di un tentativo del test di recupero presso gli enti convenzionati
export const RETAKE_COST_EUR = 30;

// Conseguenze mostrate nel funnel: devono restare vere e verificabili, niente allarmismi inventati
export const OFA_CONSEQUENCES = [
  `Il test di recupero presso gli enti convenzionati è a pagamento (circa ${RETAKE_COST_EUR} € a tentativo)`,
  "L'OFA di Inglese va recuperato entro il primo anno",
  "Finché non lo recuperi, parte della carriera può restare bloccata",
];
export const OFA_RULES_NOTE = "Le regole possono cambiare: controlla sempre il regolamento aggiornato del tuo corso.";

export type PlanId = 'simulatore' | 'pro' | 'garanzia';

export interface Plan {
  id: PlanId;
  name: string;
  priceEur: number;
  summary: string;
  features: string[];
  badge?: { label: string; tone: 'red' | 'green' };
  // Stripe Payment Link (o simile): il pagamento avviene sulla pagina del provider, mai dentro l'app
  paymentLink?: string;
}

const env = import.meta.env;

export const PLANS: Plan[] = [
  {
    id: 'simulatore',
    name: 'Pass Simulatore',
    priceEur: 9.99,
    summary: 'Simulazioni illimitate con timer da 15 minuti',
    features: ['Simulazioni da 30 domande in 15 minuti', 'Correzione con spiegazioni', 'Risultati per categoria'],
    paymentLink: env.VITE_PAYMENT_LINK_SIMULATORE,
  },
  {
    id: 'pro',
    name: 'CRAM Pass Pro',
    priceEur: 14.99,
    summary: 'Simulatore + tutte le modalità di ripasso + prontuario',
    features: ['Tutto il Pass Simulatore', 'Ripasso dilazionato su tutto il banco di domande', 'Prontuario delle regole e delle trappole'],
    badge: { label: 'Più scelto', tone: 'red' },
    paymentLink: env.VITE_PAYMENT_LINK_PRO,
  },
  {
    id: 'garanzia',
    name: 'Garanzia Promosso',
    priceEur: 24.99,
    summary: 'Tutto il CRAM Pass Pro + rimborso se non superi il test, alle condizioni qui sotto',
    features: ['Tutto il CRAM Pass Pro', 'Rimborso totale se rispetti le condizioni e non superi il test'],
    badge: { label: 'Massima sicurezza', tone: 'green' },
    paymentLink: env.VITE_PAYMENT_LINK_GARANZIA,
  },
];

// Condizioni della garanzia: sono mostrate per intero accanto al prezzo (non solo nei termini),
// e l'app le misura con il tracker in Statistiche, così l'utente sa sempre se ne ha diritto.
export const GUARANTEE = {
  studyDays: 7,           // giorni con almeno studyMinutesPerDay minuti di studio attivo
  studyMinutesPerDay: 30,
  passedSimulations: 5,   // simulazioni con almeno SIM_PASS_SCORE/30
  lastSimulationsAllPassed: 3, // le ultime N simulazioni tutte superate
  claimDays: 7,           // giorni dall'esito ufficiale per chiedere il rimborso
};
export const SIM_PASS_SCORE = 25;

export const GUARANTEE_CONDITIONS = [
  `Almeno ${GUARANTEE.studyDays} giorni con ${GUARANTEE.studyMinutesPerDay} minuti di studio attivo nell'app (sessioni e simulazioni)`,
  `Almeno ${GUARANTEE.passedSimulations} simulazioni superate con ${SIM_PASS_SCORE}/30 o più`,
  `Le ultime ${GUARANTEE.lastSimulationsAllPassed} simulazioni prima del test tutte superate`,
  `Richiesta entro ${GUARANTEE.claimDays} giorni dall'esito ufficiale, con la prova dell'esito negativo`,
];

export function isPaymentConfigured(plan: Plan): boolean {
  return typeof plan.paymentLink === 'string' && plan.paymentLink.startsWith('https://');
}

export function formatEur(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
}
