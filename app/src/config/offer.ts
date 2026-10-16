// Nome dell'app, avvertenza di indipendenza e numeri del test. App gratuita e statica: qui non c'è nessun prezzo,
// nessun piano e nessuna scadenza commerciale. (Il nome del file è storico: i consumatori importano ancora da qui.)

export const APP_NAME = 'AddiOFA';

export const DISCLAIMER = 'Progetto studentesco indipendente, non affiliato al Politecnico di Milano.';

// ---- Il test di riferimento della stima
// La stima di superare il test usa il test di recupero di LinguaViva: 30 domande, si supera con 25 risposte esatte.
export const REAL_TEST_QUESTIONS = 30;
export const REAL_TEST_PASS_MARK = 25;

// Costo di un tentativo del test di recupero presso gli enti convenzionati (27,50 - 30,50 €)
export const RETAKE_COST_EUR = 30;

// Conseguenze dell'OFA: devono restare vere e verificabili, niente allarmismi inventati
export const OFA_CONSEQUENCES = [
  `Il test di recupero presso gli enti convenzionati costa circa ${RETAKE_COST_EUR} € a tentativo`,
  "Finché l'OFA non è tolto, nel piano degli studi puoi inserire solo esami del 1° anno",
  "Le scadenze per avere il piano completo del 2° anno cadono tra fine agosto e fine settembre",
];
export const OFA_RULES_NOTE = 'Le regole possono cambiare: controlla sempre il regolamento aggiornato del tuo corso sul sito del Politecnico.';

// Scadenze del calendario ufficiale 2026/27 per avere il piano completo del 2° anno
export const OFA_DEADLINES = [
  { scuola: 'Architettura', data: '31 agosto' },
  { scuola: 'Design', data: '3 settembre' },
  { scuola: 'Ingegneria', data: '25 settembre' },
];

// ---- La simulazione: un solo formato
export interface ExamFormat {
  questions: number;  // domande
  minutes: number;    // durata
  passMark: number;   // risposte esatte per superare
  options: 4;         // opzioni per domanda
}

export const EXAM: ExamFormat = { questions: 30, minutes: 15, passMark: 25, options: 4 };

/** Soglia usata dalla stima del diagnostico e dai badge. */
export const SIM_PASS_SCORE = EXAM.passMark;

/** Domande del quiz diagnostico. */
export const DIAGNOSTIC_QUESTIONS = 10;

export function formatEur(value: number): string {
  return value.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
}

/** Indirizzo a cui arrivano le segnalazioni. Finché non c'è un indirizzo vero resta `undefined`: la schermata Segnala offre solo «Copia». */
export const CONTACT_EMAIL: string | undefined = undefined;

/**
 * Titolare del trattamento dei dati raccolti con l'iscrizione (nome, email PoliMi, corso...). DA COMPILARE PRIMA DEL LANCIO:
 * `nome` oggi è il nome del progetto; per il GDPR serve la persona o l'ente che risponde (cognome e nome, o ragione sociale)
 * e un indirizzo di contatto. Le pagine legali scrivono la riga «Contatto» solo se `CONTACT_EMAIL` esiste.
 */
export const TITOLARE: { nome: string; responsabile?: string; indirizzo?: string } = { nome: 'Project' };
