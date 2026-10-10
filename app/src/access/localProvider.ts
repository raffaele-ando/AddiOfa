// Provider della versione dimostrativa: domande nel bundle, Pass "in prova", dati sul dispositivo (localStorage, con ripiego in memoria).
// Il blocco del Pass qui è solo grafico: le risposte esatte stanno nel JavaScript della pagina.
import type {
  DataProvider, Entitlement, ExamQuestionResult, ExamResult, ExamSession, GradeResult,
  InviteProgress, PublicQuestion, TrackEvent, WaitlistInput, WithdrawalInput,
} from './provider';
import { FREE_ENTITLEMENT, isPass } from './entitlement';
import { FORMATS, INVITE, type FormatId } from '../config/offer';
import { questions } from '../data/questions';
import { toPublic } from '../data/bank';
import { poolForFormat, prepareQuestion, scoreExam, selectExamQuestions } from '../lib/exam';
import type { Question } from '../types';

export const KEY_ENTITLEMENT = 'addiofa_demo_entitlement';
export const KEY_WAITLIST = 'addiofa_waitlist';
const KEY_INVITE = 'addiofa_demo_invite';
const KEY_WITHDRAWALS = 'addiofa_withdrawals';

// localStorage può mancare o lanciare (finestra privata, dati bloccati, anteprime): si ripiega sulla memoria.
const memoria = new Map<string, string>();
function leggi(chiave: string): string | null {
  try {
    const v = localStorage.getItem(chiave);
    if (v !== null) return v;
  } catch { /* ripiego sotto */ }
  return memoria.get(chiave) ?? null;
}
function scrivi(chiave: string, valore: string): void {
  memoria.set(chiave, valore);
  try { localStorage.setItem(chiave, valore); } catch { /* resta in memoria */ }
}
function leggiJson<T>(chiave: string, ripiego: T): T {
  const raw = leggi(chiave);
  if (!raw) return ripiego;
  try { return JSON.parse(raw) as T; } catch { return ripiego; }
}

function casuale(lunghezza: number): string {
  // niente caratteri ambigui (0/O, 1/I)
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const byte = new Uint8Array(lunghezza);
  try { crypto.getRandomValues(byte); } catch { for (let i = 0; i < lunghezza; i++) byte[i] = Math.floor(Math.random() * 256); }
  return Array.from(byte, b => alfabeto[b % alfabeto.length]).join('');
}

function pubblica(q: Question): PublicQuestion {
  const p = toPublic(q);
  return { id: p.id, prompt: p.prompt, options: p.options, category: p.category, level: p.level, grammarTopic: p.grammarTopic };
}

interface SessioneLocale { format: FormatId; startedAt: number; domande: Question[] }

export class LocalProvider implements DataProvider {
  readonly mode = 'demo' as const;
  private sessioni = new Map<string, SessioneLocale>();
  private eventi: TrackEvent[] = [];
  private perId = new Map<string, Question>(questions.map(q => [q.id, q]));

  async getEntitlement(): Promise<Entitlement> {
    const e = leggiJson<Partial<Entitlement> | null>(KEY_ENTITLEMENT, null);
    if (!e || (e.tier !== 'pass' && e.tier !== 'free')) return FREE_ENTITLEMENT;
    const valido: Entitlement = {
      tier: e.tier,
      source: e.source ?? 'demo',
      expiresAt: typeof e.expiresAt === 'number' ? e.expiresAt : null,
    };
    return valido.tier === 'pass' && !isPass(valido) ? FREE_ENTITLEMENT : valido;
  }

  async unlockDemo(): Promise<Entitlement> {
    const e: Entitlement = { tier: 'pass', source: 'demo', expiresAt: null };
    scrivi(KEY_ENTITLEMENT, JSON.stringify(e));
    return e;
  }

  async getQuestions(ids: string[]): Promise<PublicQuestion[]> {
    return ids.map(id => this.perId.get(id)).filter((q): q is Question => !!q).map(pubblica);
  }

  async grade(questionId: string, optionIndex: number): Promise<GradeResult> {
    const q = this.perId.get(questionId);
    if (!q) throw new Error('Domanda non trovata.');
    return { correct: optionIndex === q.correctIndex, correctIndex: q.correctIndex, explanation: q.explanation };
  }

  async startExam(format: FormatId): Promise<ExamSession> {
    const f = FORMATS[format];
    const pool = poolForFormat(questions, f);
    // il TENG ha bisogno della quinta opzione: finché mancano domande, l'interfaccia mostra "in arrivo"
    if (pool.length < f.questions) throw new Error('formato_non_disponibile');
    const domande = selectExamQuestions(pool, f).map(q => prepareQuestion(q, f));
    const id = `sim-${Date.now().toString(36)}-${casuale(4)}`;
    const startedAt = Date.now();
    this.sessioni.set(id, { format, startedAt, domande });
    return { id, format, startedAt, questions: domande.map(pubblica) };
  }

  async submitExam(sessionId: string, answers: Record<string, number | null>, _elapsedSeconds: number): Promise<ExamResult> {
    const s = this.sessioni.get(sessionId);
    if (!s) throw new Error('Simulazione non trovata: avviane una nuova.');
    const punteggio = scoreExam(FORMATS[s.format], s.domande, answers);
    const perQuestion: ExamQuestionResult[] = s.domande.map(q => {
      const a = answers[q.id];
      return {
        id: q.id,
        correct: a === null || a === undefined ? null : a === q.correctIndex,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      };
    });
    this.sessioni.delete(sessionId);
    return { ...punteggio, perQuestion };
  }

  async joinWaitlist(input: WaitlistInput) {
    const email = input.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { ok: false, stored: 'device' as const, message: "L'indirizzo email non sembra scritto bene: controllalo e riprova." };
    }
    if (!input.consent) {
      return { ok: false, stored: 'device' as const, message: "Serve il consenso a ricevere l'unico avviso di apertura." };
    }
    const lista = leggiJson<{ email: string; audience: string; at: number }[]>(KEY_WAITLIST, []);
    if (!lista.some(v => v.email === email)) lista.push({ email, audience: input.audience, at: Date.now() });
    scrivi(KEY_WAITLIST, JSON.stringify(lista));
    return {
      ok: true,
      stored: 'device' as const,
      message: 'Iscrizione salvata solo su questo dispositivo: in questa versione non parte nessuna email.',
    };
  }

  async createInvite() {
    let code = leggi(KEY_INVITE);
    if (!code) {
      code = `OFA-${casuale(6)}`;
      scrivi(KEY_INVITE, code);
    }
    return { code };
  }

  async redeemInvite(code: string) {
    const pulito = code.trim().toUpperCase();
    if (!/^OFA-[A-Z0-9]{6}$/.test(pulito)) {
      return { ok: false, message: 'Il codice non ha il formato giusto: deve iniziare con OFA- seguito da 6 caratteri.' };
    }
    return {
      ok: false,
      message: "Il codice ha il formato giusto, ma in questa versione dimostrativa la verifica dell'email del Politecnico non è attiva: non è stato applicato nulla.",
    };
  }

  async inviteProgress(): Promise<InviteProgress> {
    return { code: leggi(KEY_INVITE), verified: 0, required: INVITE.required };
  }

  async requestWithdrawal(input: WithdrawalInput) {
    const at = Date.now();
    const receiptId = `REC-${casuale(8)}`;
    const lista = leggiJson<unknown[]>(KEY_WITHDRAWALS, []);
    lista.push({ receiptId, at, name: input.name, email: input.email, orderRef: input.orderRef ?? null });
    scrivi(KEY_WITHDRAWALS, JSON.stringify(lista));
    return { receiptId, at, stored: 'device' as const };
  }

  track(event: TrackEvent): void {
    this.eventi.push(event); // solo in memoria, nessuna rete
  }
}
