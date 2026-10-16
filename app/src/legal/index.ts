// Testi legali di AddiOFA: sito gratuito, senza account, senza pagamenti; i dati restano nel dispositivo.
import type { LegalSection } from '../types';
import type { LegalDoc } from './base';
import { termini } from './termini';
import { privacy } from './privacy';
import { cookie } from './cookie';

export { LEGAL_AGGIORNATO, AVVERTENZA_INDIPENDENZA } from './base';
export type { LegalDoc, LegalSezione } from './base';

export const LEGAL_DOCS: Record<LegalSection, LegalDoc> = { termini, privacy, cookie };

/** Etichette brevi per schede e piè di pagina, nell'ordine di visualizzazione. */
export const LEGAL_TABS: { id: LegalSection; label: string }[] = [
  { id: 'termini', label: 'Termini' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'cookie', label: 'Cookie' },
];
