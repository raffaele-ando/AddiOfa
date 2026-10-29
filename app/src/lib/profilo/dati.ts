// Dati del profilo (nome, avatar, corso di studi): restano sul dispositivo, in appState.extra['profilo'].
// Nessuna foto: l'avatar è una lettera o un'illustrazione del kit.

export interface ProfiloDati {
  /** Nome scelto dall'utente. Vuoto = «Studente». */
  nome: string;
  /** 'iniziale' (la lettera del nome) oppure il nome di un'illustrazione del kit blu (vedi AVATAR). */
  avatar: string;
  /** Corso di studi, facoltativo. */
  corso: string;
}

export const PROFILO_INIZIALE: ProfiloDati = { nome: '', avatar: 'iniziale', corso: '' };
export const NOME_MAX = 30;
export const CORSO_MAX = 60;
export const NOME_DI_RIPIEGO = 'Studente';

/** Le scelte d'avatar oltre alla lettera: illustrazioni del kit blu (gruppo `illustrazioni`). */
export const AVATAR: { id: string; etichetta: string }[] = [
  { id: 'studio-inglese', etichetta: 'Libri' },
  { id: 'quiz-test', etichetta: 'Quiz' },
  { id: 'successo', etichetta: 'Coppa' },
  { id: 'superamento', etichetta: 'Documento' },
  { id: 'celebrazione', etichetta: 'Festa' },
  { id: 'suggerimenti-consigli', etichetta: 'Idea' },
  { id: 'mondo-internazionale', etichetta: 'Mondo' },
  { id: 'progressi-statistiche', etichetta: 'Grafico' },
  { id: 'ricerca', etichetta: 'Lente' },
  { id: 'messaggi-supporto', etichetta: 'Messaggi' },
  { id: 'cappello-laurea-orologio', etichetta: 'Laurea' },
];

const ID_AVATAR = new Set(AVATAR.map(a => a.id));

const ripulisci = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max).trim() : '';

/** Porta qualunque cosa sia salvata a un profilo valido (testi ripuliti e accorciati, avatar noto). */
export function normalizzaProfilo(raw: unknown): ProfiloDati {
  const r = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  const avatar = typeof r.avatar === 'string' && ID_AVATAR.has(r.avatar) ? r.avatar : 'iniziale';
  return { nome: ripulisci(r.nome, NOME_MAX), avatar, corso: ripulisci(r.corso, CORSO_MAX) };
}

export function nomeVisibile(p: ProfiloDati): string {
  return p.nome.trim() || NOME_DI_RIPIEGO;
}

/** Lettera dell'avatar: la prima del nome, in maiuscolo; senza nome la S di «Studente». */
export function iniziale(p: ProfiloDati): string {
  const prima = Array.from(nomeVisibile(p))[0] ?? 'S';
  return prima.toLocaleUpperCase('it-IT');
}
