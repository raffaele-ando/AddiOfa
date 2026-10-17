// Genera app/src/data/corsi.ts da contenuti/corsi/corsi-polimi.json (elenco dei corsi del Politecnico di Milano
// per la scelta guidata scuola > sede > livello > corso > anno nella registrazione).
// Uso: node contenuti/strumenti/genera-corsi.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RADICE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ORIGINE = path.join(RADICE, 'contenuti', 'corsi', 'corsi-polimi.json');
const DESTINAZIONE = path.join(RADICE, 'app', 'src', 'data', 'corsi.ts');

const dati = JSON.parse(fs.readFileSync(ORIGINE, 'utf8'));
for (const chiave of ['versione', 'verificatoIl', 'scuole', 'sedi', 'corsi', 'inEsaurimento']) {
  if (!(chiave in dati)) throw new Error(`corsi-polimi.json: manca «${chiave}» (esegui prima npm run contenuti:corsi:valida)`);
}

const json = (v) => JSON.stringify(v, null, 2);

const testo = `// GENERATO da contenuti/corsi/corsi-polimi.json con npm run contenuti:corsi: non modificare a mano.
// Corsi di laurea del Politecnico di Milano, a.a. ${dati.versione}, verificati il ${dati.verificatoIl} sulle pagine ufficiali.

export type Livello = 'triennale' | 'magistrale' | 'ciclo-unico';
export type Lingua = 'it' | 'en' | 'it-en';

export interface Scuola {
  id: string;
  nome: string;
  sigla: string;
  /** Sedi in cui la scuola ha almeno un corso. */
  sedi: string[];
}

export interface Sede {
  id: string;
  nome: string;
  citta: string;
  /** false: la sede non ha corsi attivi per le nuove iscrizioni; le funzioni qui sotto la escludono. */
  attiva: boolean;
  nota: string;
}

export interface Corso {
  id: string;
  /** Nome ufficiale in italiano (o il nome ufficiale se esiste solo in inglese). */
  nome: string;
  nomeEn?: string;
  scuola: string;
  sede: string;
  livello: Livello;
  /** Durata legale in anni. */
  anni: number;
  lingua: Lingua;
  /** Pagina ufficiale del corso. */
  fonte: string;
  nota?: string;
}

/** Corso disattivato per le nuove iscrizioni ma con anni ancora in erogazione. */
export interface CorsoInEsaurimento {
  id: string;
  nome: string;
  scuola: string;
  sede: string;
  livello: Livello;
  anniAttivi: number[];
  fonte: string;
}

export const VERSIONE_CORSI = ${json(dati.versione)};
export const CORSI_VERIFICATI_IL = ${json(dati.verificatoIl)};

export const scuole: Scuola[] = ${json(dati.scuole)};

export const sedi: Sede[] = ${json(dati.sedi)};

export const corsi: Corso[] = ${json(dati.corsi)};

export const corsiInEsaurimento: CorsoInEsaurimento[] = ${json(dati.inEsaurimento)};

const ORDINE_LIVELLI: Livello[] = ['triennale', 'ciclo-unico', 'magistrale'];

const sedeAttiva = (sedeId: string): boolean => sedi.some((s) => s.id === sedeId && s.attiva);
const confronta = (a: string, b: string): number => a.localeCompare(b, 'it');

/** Corsi attivi (sede attiva) di una scuola in una sede, di qualunque livello. */
function corsiAttivi(scuolaId: string, sedeId: string): Corso[] {
  if (!sedeAttiva(sedeId)) return [];
  return corsi.filter((c) => c.scuola === scuolaId && c.sede === sedeId);
}

/** Sedi attive della scuola, con almeno un corso, nell'ordine in cui la scuola le elenca. */
export function sediDellaScuola(scuolaId: string): Sede[] {
  const scuola = scuole.find((s) => s.id === scuolaId);
  if (!scuola) return [];
  return scuola.sedi
    .map((id) => sedi.find((s) => s.id === id))
    .filter((s): s is Sede => s !== undefined && s.attiva && corsiAttivi(scuolaId, s.id).length > 0);
}

/** Livelli per cui la scuola ha corsi attivi nella sede (triennale, ciclo unico, magistrale). */
export function livelliDisponibili(scuolaId: string, sedeId: string): Livello[] {
  const presenti = new Set(corsiAttivi(scuolaId, sedeId).map((c) => c.livello));
  return ORDINE_LIVELLI.filter((l) => presenti.has(l));
}

/** Corsi attivi della scuola in quella sede e livello, in ordine alfabetico. */
export function corsiDisponibili(scuolaId: string, sedeId: string, livello: Livello): Corso[] {
  return corsiAttivi(scuolaId, sedeId)
    .filter((c) => c.livello === livello)
    .sort((a, b) => confronta(a.nome, b.nome));
}

/** Gli anni di corso da proporre: [1, ..., anni]. */
export function anniDelCorso(corso: Pick<Corso, 'anni'>): number[] {
  return Array.from({ length: corso.anni }, (_, i) => i + 1);
}
`;

fs.mkdirSync(path.dirname(DESTINAZIONE), { recursive: true });
fs.writeFileSync(DESTINAZIONE, testo);
console.log(`Scritto ${path.relative(RADICE, DESTINAZIONE)}: ${dati.scuole.length} scuole, ${dati.sedi.length} sedi, ${dati.corsi.length} corsi (voci per sede), ${dati.inEsaurimento.length} in esaurimento.`);
