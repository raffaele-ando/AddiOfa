// Elenchi della registrazione. I corsi sono quelli con più studenti con OFA di inglese tra gli ammessi 2026
// (docs/dati/graduatorie-polimi/tabelle/07 e 08, e docs/strategia/simulatore-ofa.md), nell'ordine in cui compaiono lì: dal più numeroso.
// «Altro» chiude l'elenco. Il valore salvato e inviato è il nome scritto qui (massimo 120 caratteri, come chiede il Worker).

export const CORSI: string[] = [
  'Progettazione dell\'Architettura',
  'Ingegneria Gestionale',
  'Ingegneria Informatica',
  'Ingegneria Meccanica',
  'Engineering Science',
  'Industrial Engineering',
  'Process Engineering',
  'Design degli Interni',
  'Ingegneria dell\'Automazione',
  'Design del Prodotto Industriale',
  'Ingegneria Biomedica',
  'Ingegneria Chimica',
  'Ingegneria Energetica',
  'Ingegneria dei Materiali e delle Nanotecnologie',
  'Ingegneria Civile',
  'Ingegneria Informatica Online',
  'Ingegneria Elettrica',
  'Ingegneria Elettronica',
  'Ingegneria Matematica',
  'Ingegneria della Produzione Industriale',
  'Ingegneria Aerospaziale',
  'Ingegneria Fisica',
  'Design della Moda',
  'Ingegneria Edile e delle Costruzioni',
  'Ingegneria Edile - Architettura',
  'Design della Comunicazione',
];
export const CORSO_ALTRO = 'Altro';

export const SEDI = ['Leonardo', 'Bovisa', 'Altro'] as const;
export type Sede = (typeof SEDI)[number];

/** Come ci hai conosciuto: le risposte sono queste, scelte da chi legge; nessuna è suggerita. */
export const PROVENIENZE = ['Gruppo o chat', 'Instagram (polimi.agora)', 'Amici o compagni', 'Ricerca su internet', 'Altro'] as const;
export type Provenienza = (typeof PROVENIENZE)[number];

export const eCorso = (v: unknown): v is string => typeof v === 'string' && (v === CORSO_ALTRO || CORSI.includes(v));
export const eSede = (v: unknown): v is Sede => typeof v === 'string' && (SEDI as readonly string[]).includes(v);
export const eProvenienza = (v: unknown): v is Provenienza => typeof v === 'string' && (PROVENIENZE as readonly string[]).includes(v);
