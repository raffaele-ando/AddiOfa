// Formati di simulazione. Copia di FORMATS in app/src/config/offer.ts: se cambiano la', vanno cambiati anche qui.
// (L'app e' il contratto; il server calcola il punteggio, quindi i numeri devono coincidere.)

export type FormatId = 'ente' | 'teng';

export interface ExamFormat {
  id: FormatId;
  questions: number;
  minutes: number;
  passMark: number; // risposte esatte per superare
  options: 4 | 5;
  penalty: number;  // punti tolti per ogni risposta sbagliata
}

export const FORMATS: Record<FormatId, ExamFormat> = {
  ente: { id: 'ente', questions: 30, minutes: 15, passMark: 25, options: 4, penalty: 0 },
  teng: { id: 'teng', questions: 30, minutes: 15, passMark: 24, options: 5, penalty: 0.25 },
};

export function isFormatId(v: unknown): v is FormatId {
  return typeof v === 'string' && Object.prototype.hasOwnProperty.call(FORMATS, v);
}

// Tolleranza sul limite di tempo: latenza di rete e consegna dell'ultima risposta
export const TIME_TOLERANCE_SECONDS = 20;

// Soglia di somiglianza tra due domande dello stesso esame (come nell'app)
export const SIMILARITY_MAX = 0.45;

export const FREE_SIMULATIONS = 1;

// Inviti (copia di INVITE in offer.ts)
export const INVITE = {
  required: 3,
  minDiagnosticSeconds: 240,
  emailDomain: 'mail.polimi.it',
};

export const PASS_VALID_MONTHS = 12;
