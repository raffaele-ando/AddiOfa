// Dati del profilo (nome, corso di studi): restano sul dispositivo, in appState.extra['profilo'].
// Nessuna foto e nessuna scelta d'avatar: l'avatar è sempre la lettera del nome (le illustrazioni hanno un altro mestiere nell'app).
// I profili salvati quando l'avatar si poteva scegliere hanno ancora un campo `avatar`: normalizzaProfilo lo ignora, e si vede la lettera.

export interface ProfiloDati {
  /** Nome scelto dall'utente. Vuoto = «Studente». */
  nome: string;
  /** Corso di studi, facoltativo. */
  corso: string;
}

export const PROFILO_INIZIALE: ProfiloDati = { nome: '', corso: '' };
export const NOME_MAX = 30;
export const CORSO_MAX = 60;
export const NOME_DI_RIPIEGO = 'Studente';

const ripulisci = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max).trim() : '';

/** Porta qualunque cosa sia salvata a un profilo valido (testi ripuliti e accorciati; un vecchio campo `avatar` si scarta: resta la lettera). */
export function normalizzaProfilo(raw: unknown): ProfiloDati {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  return { nome: ripulisci(r.nome, NOME_MAX), corso: ripulisci(r.corso, CORSO_MAX) };
}

export function nomeVisibile(p: ProfiloDati): string {
  return p.nome.trim() || NOME_DI_RIPIEGO;
}

/** Lettera dell'avatar: la prima del nome, in maiuscolo; senza nome la S di «Studente». */
export function iniziale(p: ProfiloDati): string {
  const prima = Array.from(nomeVisibile(p))[0] ?? 'S';
  return prima.toLocaleUpperCase('it-IT');
}
