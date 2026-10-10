// Provider della versione online: parla con il Worker in pass/ (/v1/...). Le risposte hanno gli stessi nomi dei tipi di provider.ts.
// Nessuna eccezione nuda nell'interfaccia: ogni errore diventa un messaggio italiano.
import type {
  DataProvider, Entitlement, ExamResult, ExamSession, GradeResult,
  InviteProgress, PublicQuestion, TrackEvent, WaitlistInput, WithdrawalInput,
} from './provider';
import { FREE_ENTITLEMENT } from './entitlement';
import { INVITE, type FormatId } from '../config/offer';
import { getIdToken } from '../lib/firebase';

const KEY_DEVICE = 'addiofa_device_id';
const TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(message: string, readonly status = 0, readonly code?: string) { super(message); }
}

let idMemoria: string | null = null;
function idDispositivo(): string {
  try {
    const v = localStorage.getItem(KEY_DEVICE);
    if (v && /^[A-Za-z0-9]{16,64}$/.test(v)) return v;
  } catch { /* ripiego sotto */ }
  if (!idMemoria) {
    try { idMemoria = crypto.randomUUID().replace(/-/g, ''); }
    catch { idMemoria = `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`.padEnd(16, '0'); }
    try { localStorage.setItem(KEY_DEVICE, idMemoria); } catch { /* resta in memoria */ }
  }
  return idMemoria;
}

function messaggioPerStato(status: number): string {
  if (status === 401 || status === 403) return 'Non sei autorizzato a farlo. Se hai il Pass, prova ad aggiornare la pagina.';
  if (status === 402) return 'Questa funzione richiede il Pass.';
  if (status === 404) return 'Non ho trovato quello che cercavi.';
  if (status === 409) return 'La richiesta non è più valida: riprova.';
  if (status === 429) return 'Troppe richieste in poco tempo: aspetta un momento e riprova.';
  if (status >= 500) return 'Il server ha un problema in questo momento. Riprova tra poco.';
  return 'Qualcosa non ha funzionato. Riprova.';
}

export class ApiProvider implements DataProvider {
  readonly mode = 'prod' as const;
  private base: string;

  constructor(baseUrl: string = import.meta.env.VITE_API_URL ?? '') {
    this.base = String(baseUrl).replace(/\/+$/, '');
  }

  private async chiama<T>(metodo: 'GET' | 'POST', percorso: string, corpo?: unknown, opzioni: { keepalive?: boolean } = {}): Promise<T> {
    if (!this.base) throw new ApiError('Il server non è configurato in questa versione.');
    const headers: Record<string, string> = { 'X-Device': idDispositivo() };
    const token = await getIdToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    if (corpo !== undefined) headers['Content-Type'] = 'application/json';
    const controllo = new AbortController();
    const timer = setTimeout(() => controllo.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(`${this.base}/v1${percorso}`, {
        method: metodo, headers, signal: controllo.signal, keepalive: opzioni.keepalive,
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
      });
    } catch (e) {
      const scaduto = (e as { name?: string }).name === 'AbortError';
      throw new ApiError(scaduto ? 'Il server non risponde: riprova tra poco.' : 'Non riesco a contattare il server. Controlla la connessione e riprova.');
    } finally {
      clearTimeout(timer);
    }
    const dati = await res.json().catch(() => ({})) as { error?: string; message?: string };
    if (!res.ok) {
      const messaggio = typeof dati.message === 'string' && dati.message ? dati.message : messaggioPerStato(res.status);
      throw new ApiError(messaggio, res.status, typeof dati.error === 'string' ? dati.error : undefined);
    }
    return dati as T;
  }

  async getEntitlement(): Promise<Entitlement> {
    try {
      return await this.chiama<Entitlement>('GET', '/entitlement');
    } catch {
      return FREE_ENTITLEMENT; // senza risposta si resta nella parte gratuita
    }
  }

  async getQuestions(ids: string[]): Promise<PublicQuestion[]> {
    const r = await this.chiama<{ questions: PublicQuestion[] } | PublicQuestion[]>('POST', '/q/batch', { ids });
    return Array.isArray(r) ? r : r.questions;
  }

  grade(questionId: string, optionIndex: number): Promise<GradeResult> {
    return this.chiama<GradeResult>('POST', `/q/${encodeURIComponent(questionId)}/check`, { idx: optionIndex });
  }

  async startExam(format: FormatId): Promise<ExamSession> {
    try {
      return await this.chiama<ExamSession>('POST', '/exam/start', { format });
    } catch (e) {
      if (e instanceof ApiError && (e.code === 'formato_non_disponibile' || e.code === 'format_unavailable')) {
        throw new Error('formato_non_disponibile');
      }
      throw e;
    }
  }

  submitExam(sessionId: string, answers: Record<string, number | null>, elapsedSeconds: number): Promise<ExamResult> {
    return this.chiama<ExamResult>('POST', `/exam/${encodeURIComponent(sessionId)}/submit`, { answers, elapsed: elapsedSeconds });
  }

  async joinWaitlist(input: WaitlistInput) {
    try {
      const r = await this.chiama<{ ok?: boolean; message?: string }>('POST', '/waitlist', input);
      return { ok: r.ok !== false, stored: 'server' as const, message: r.message ?? "Sei in lista: ti scriveremo una sola volta, all'apertura." };
    } catch (e) {
      return { ok: false, stored: 'server' as const, message: (e as Error).message };
    }
  }

  async createInvite(): Promise<{ code: string }> {
    return this.chiama<{ code: string }>('POST', '/invites', {});
  }

  async redeemInvite(code: string) {
    try {
      const r = await this.chiama<{ ok?: boolean; message?: string }>('POST', '/invites/redeem', { code: code.trim().toUpperCase() });
      return { ok: r.ok !== false, message: r.message ?? 'Codice applicato.' };
    } catch (e) {
      return { ok: false, message: (e as Error).message };
    }
  }

  async inviteProgress(): Promise<InviteProgress> {
    try {
      return await this.chiama<InviteProgress>('GET', '/invites/progress');
    } catch {
      return { code: null, verified: 0, required: INVITE.required };
    }
  }

  async requestWithdrawal(input: WithdrawalInput) {
    const r = await this.chiama<{ receiptId: string; at: number }>('POST', '/withdraw', input);
    return { receiptId: r.receiptId, at: r.at, stored: 'server' as const };
  }

  track(event: TrackEvent): void {
    this.chiama('POST', '/event', event, { keepalive: true }).catch(() => undefined);
  }
}
