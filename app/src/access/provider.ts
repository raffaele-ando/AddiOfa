// Contratto tra l'app e i dati: tutto ciò che dipende da "chi sei" e "cosa hai pagato" passa da qui.
// Due implementazioni: LocalProvider (demo e uso senza server: dati sul dispositivo) e ApiProvider (server Cloudflare in pass/).
// Tutti i metodi sono asincroni: nel LocalProvider rispondono subito, nell'ApiProvider fanno una chiamata di rete.
// In DEMO il blocco del Pass è solo grafico (le domande stanno nel bundle): va detto nei termini e in app/DEMO.md.

import type { FormatId, PublicAudience } from '../config/offer';

export type Tier = 'free' | 'pass';
export type EntitlementSource = 'none' | 'demo' | 'stripe' | 'invite' | 'manual';

export interface Entitlement {
  tier: Tier;
  source: EntitlementSource;
  expiresAt: number | null; // ms; null = non scade (o non è un Pass)
}

/** Una domanda come la vede l'utente: senza risposta esatta né spiegazione (arrivano da grade). */
export interface PublicQuestion {
  id: string;
  prompt: string;
  options: string[];
  category: string;
  level?: string;
  grammarTopic?: string;
}

export interface GradeResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;   // in italiano
  theoryId?: string;     // scheda di teoria collegata
}

export interface ExamSession {
  id: string;
  format: FormatId;
  startedAt: number;
  questions: PublicQuestion[];
}

export interface ExamQuestionResult {
  id: string;
  correct: boolean | null; // null = senza risposta
  correctIndex: number;
  explanation: string;
  theoryId?: string;
}

export interface ExamResult {
  rawCorrect: number;     // risposte esatte
  wrong: number;
  omitted: number;
  score: number;          // punteggio con la penalità del formato
  passed: boolean;        // rawCorrect >= soglia del formato
  perQuestion: ExamQuestionResult[];
}

export type TrackEvent =
  | { name: 'diag_done'; audience?: PublicAudience }
  | { name: 'paywall_seen' }
  | { name: 'waitlist_join'; audience: PublicAudience }
  | { name: 'sim_started'; format: FormatId }
  | { name: 'sim_done'; format: FormatId; passed: boolean }
  | { name: 'pass_unlocked'; source: EntitlementSource };

export interface WaitlistInput {
  email: string;
  audience: PublicAudience;
  consent: boolean; // consenso al solo avviso di apertura
}

export interface InviteProgress {
  code: string | null;
  verified: number;
  required: number;
}

export interface WithdrawalInput {
  name: string;
  email: string;
  orderRef?: string;
}

export interface DataProvider {
  readonly mode: 'demo' | 'prod';

  getEntitlement(): Promise<Entitlement>;
  /** Solo demo: sblocca il Pass in prova, senza pagamento. In prod non esiste. */
  unlockDemo?(): Promise<Entitlement>;

  getQuestions(ids: string[]): Promise<PublicQuestion[]>;
  grade(questionId: string, optionIndex: number): Promise<GradeResult>;

  startExam(format: FormatId): Promise<ExamSession>;
  submitExam(sessionId: string, answers: Record<string, number | null>, elapsedSeconds: number): Promise<ExamResult>;

  joinWaitlist(input: WaitlistInput): Promise<{ ok: boolean; stored: 'device' | 'server'; message: string }>;

  createInvite(): Promise<{ code: string }>;
  redeemInvite(code: string): Promise<{ ok: boolean; message: string }>;
  inviteProgress(): Promise<InviteProgress>;

  requestWithdrawal(input: WithdrawalInput): Promise<{ receiptId: string; at: number; stored: 'device' | 'server' }>;

  /** Statistiche senza identificativi né cookie. In demo restano in memoria. */
  track(event: TrackEvent): void;
}
